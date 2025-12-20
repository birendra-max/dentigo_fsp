import { useContext, useState, useEffect, useMemo } from "react";
import Hd from './Hd';
import Foot from './Foot';
import { ThemeContext } from "../../Context/ThemeContext";
import Datatable from './Datatable';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faFileAlt,
    faDownload,
    faCalendarAlt,
    faFilter,
    faSearch,
    faChartBar,
    faSync,
    faHashtag
} from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from "../../utils/designerapi";

export default function Reports() {
    const { theme } = useContext(ThemeContext);
    const [selectedFilter, setSelectedFilter] = useState('4'); // Default to 'All Time'
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderIdFrom, setOrderIdFrom] = useState('');
    const [orderIdTo, setOrderIdTo] = useState('');
    const [allData, setAllData] = useState([]); // Store all data from backend
    const [filteredData, setFilteredData] = useState([]); // Store filtered data for display
    const [reportStats, setReportStats] = useState({
        totalOrders: 0,
        completed: 0,
        inProgress: 0,
        pending: 0
    });

    // Professional theme-based classes
    const getThemeClasses = () => {
        const isLight = theme === 'light';
        return {
            main: isLight
                ? 'bg-gradient-to-br from-gray-25 to-gray-50 text-gray-900'
                : 'bg-gradient-to-br from-gray-900 to-gray-950 text-white',
            card: isLight
                ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-200'
                : 'bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
            input: isLight
                ? 'bg-white border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30 text-gray-900 placeholder-gray-500 shadow-sm'
                : 'bg-gray-700 border-2 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-gray-400 shadow-sm',
            button: {
                primary: isLight
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all cursor-pointer'
                    : 'bg-blue-700 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer',
                success: isLight
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg',
                filterActive: isLight
                    ? 'bg-blue-600 text-white shadow-md border border-blue-600'
                    : 'bg-blue-700 text-white shadow-md border border-blue-600',
                filterInactive: isLight
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                    : 'bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600 hover:border-gray-500 shadow-sm',
                download: isLight
                    ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-md hover:shadow-lg'
                    : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
            },
            text: {
                primary: isLight ? 'text-gray-900' : 'text-white',
                secondary: isLight ? 'text-gray-600' : 'text-gray-300',
                muted: isLight ? 'text-gray-500' : 'text-gray-400',
                accent: isLight ? 'text-blue-600' : 'text-blue-400'
            },
            border: isLight ? 'border-gray-200' : 'border-gray-700',
            headerGradient: isLight
                ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)'
        };
    };

    const themeClasses = getThemeClasses();

    const columns = [
        { header: "Order Id", accessor: "orderid" },
        { header: "File Name", accessor: "fname" },
        { header: "TAT", accessor: "tduration" },
        { header: "Status", accessor: "status" },
        { header: "Unit", accessor: "unit" },
        { header: "Tooth", accessor: "tooth" },
        { header: "Lab Name", accessor: "labname" },
        { header: "Run Self By", accessor: "run_self_by" },
        { header: "Date", accessor: "order_date" },
        { header: "Message", accessor: "message" },
    ];

    const filterButtons = [
        { value: '1', label: 'Today', icon: faCalendarAlt },
        { value: '2', label: 'Weekly', icon: faChartBar },
        { value: '3', label: 'Monthly', icon: faFileAlt },
        { value: '4', label: 'All Time', icon: faFilter },
    ];

    // Calculate report statistics
    const calculateStats = (cases) => {
        const stats = {
            totalOrders: cases.length,
            completed: cases.filter(caseItem => caseItem.status === 'Designed Completed').length,
            inProgress: cases.filter(caseItem => caseItem.status === 'In Progress').length,
            pending: cases.filter(caseItem => caseItem.status === 'New' || caseItem.status === 'QC Required').length
        };
        setReportStats(stats);
    };
    const parseOrderDateOnly = (dateStr) => {
        if (!dateStr) return null;

        // "14-Mar-2023 07:32:31am"
        const [datePart] = dateStr.split(' ');
        const [day, monthStr, year] = datePart.split('-');

        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3,
            May: 4, Jun: 5, Jul: 6, Aug: 7,
            Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        return new Date(year, months[monthStr], day, 0, 0, 0, 0);
    };


    // Filter data based on all criteria
    const applyFilters = () => {
        if (!allData.length) {
            setFilteredData([]);
            calculateStats([]);
            return;
        }

        let filtered = [...allData];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isOrderIdActive = orderIdFrom || orderIdTo;
        const isCustomDateActive = startDate || endDate;

        // ===== TIME PERIOD FILTER (only if NO Order ID & NO custom date) =====
        if (!isOrderIdActive && !isCustomDateActive) {
            switch (selectedFilter) {
                case '1': { // Today
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);

                    filtered = filtered.filter(item => {
                        const itemDate = parseOrderDateOnly(item.order_date);
                        return itemDate && itemDate >= today && itemDate < tomorrow;
                    });
                    break;
                }

                case '2': { // Last 7 days
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);

                    filtered = filtered.filter(item => {
                        const itemDate = parseOrderDateOnly(item.order_date);
                        return itemDate && itemDate >= weekAgo;
                    });
                    break;
                }

                case '3': { // Last 30 days
                    const monthAgo = new Date(today);
                    monthAgo.setDate(today.getDate() - 30);

                    filtered = filtered.filter(item => {
                        const itemDate = parseOrderDateOnly(item.order_date);
                        return itemDate && itemDate >= monthAgo;
                    });
                    break;
                }

                case '4': // All Time
                default:
                    break;
            }
        }

        // ===== ORDER ID FILTER (highest priority) =====
        if (isOrderIdActive) {
            if (orderIdFrom) {
                const fromId = parseInt(orderIdFrom);
                filtered = filtered.filter(item => parseInt(item.orderid) >= fromId);
            }

            if (orderIdTo) {
                const toId = parseInt(orderIdTo);
                filtered = filtered.filter(item => parseInt(item.orderid) <= toId);
            }
        }

        // ===== CUSTOM DATE RANGE (only if NO Order ID) =====
        if (!isOrderIdActive && isCustomDateActive) {
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);

                filtered = filtered.filter(item => {
                    const itemDate = parseOrderDateOnly(item.order_date);
                    return itemDate && itemDate >= start;
                });
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);

                filtered = filtered.filter(item => {
                    const itemDate = parseOrderDateOnly(item.order_date);
                    return itemDate && itemDate <= end;
                });
            }
        }

        setFilteredData(filtered);
        calculateStats(filtered);
    };

    // Handle search button click
    const handleSearchClick = () => {
        applyFilters();
    };

    // Handle filter button click
    const handleFilterClick = (filterValue) => {
        setSelectedFilter(filterValue);
    };

    // Handle download report
    const handleDownloadReport = () => {
        if (filteredData.length === 0) {
            alert('No data available to download');
            return;
        }

        // Create CSV content
        const headers = columns.map(col => col.header).join(',');
        const rows = filteredData.map(item =>
            columns.map(col => `"${item[col.accessor] || ''}"`).join(',')
        ).join('\n');

        const csvContent = `${headers}\n${rows}`;

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setOrderIdFrom('');
        setOrderIdTo('');
        setSelectedFilter('4'); // Reset to "All Time"
        setFilteredData(allData);
        calculateStats(allData);
    };

    // Handle order ID input validation
    const handleOrderIdFromChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setOrderIdFrom(value);
    };

    const handleOrderIdToChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setOrderIdTo(value);
    };

    // Apply filters whenever any filter criteria changes
    useEffect(() => {
        applyFilters();
    }, [selectedFilter, allData]);

    // Initial data fetch
    useEffect(() => {
        async function fetchAllCases() {
            setIsLoading(true);
            try {
                const responseData = await fetchWithAuth("/get-reports", {
                    method: "POST",
                    body: JSON.stringify({
                        filter: 'all',
                        startDate: '',
                        endDate: '',
                    }),
                });

                if (responseData?.status === "success") {
                    setAllData(responseData.cases);
                    setFilteredData(responseData.cases);
                    calculateStats(responseData.cases);
                } else {
                    setAllData([]);
                    setFilteredData([]);
                    setReportStats({ totalOrders: 0, completed: 0, inProgress: 0, pending: 0 });
                }
            } catch (error) {
                console.error("Report fetch error:", error);
                setAllData([]);
                setFilteredData([]);
                setReportStats({ totalOrders: 0, completed: 0, inProgress: 0, pending: 0 });
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllCases();
    }, []);

    return (
        <>
            <Hd />
            <main id="main" className={`flex-grow px-4 transition-colors duration-300 ${themeClasses.main} pt-14`}>
                <div className="min-h-screen px-2 sm:px-6 lg:px-2">
                    <div className="w-full max-w-full">

                        {/* Enhanced Header Section - ORIGINAL TEXT KEPT */}
                        <header className={`rounded-xl border shadow-sm my-6 px-6 py-4`} style={{ background: themeClasses.headerGradient }}>
                            <div className="container mx-auto">
                                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-center sm:text-left">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                            Reports & Analytics
                                        </h1>
                                        <p className="mt-2 text-sm sm:text-base text-blue-100">
                                            Generate comprehensive reports and analyze order performance
                                        </p>
                                    </div>
                                    <nav className="flex justify-center sm:justify-start">
                                        <ol className="flex items-center space-x-2 sm:space-x-3 text-sm">
                                            <li>
                                                <Link
                                                    to="/designer/home"
                                                    className="hover:text-blue-700 transition-colors duration-300 flex items-center text-blue-100"
                                                >
                                                    <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-2" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </li>
                                            <li className="text-blue-300">
                                                <span>/</span>
                                            </li>
                                            <li className="text-white font-semibold">
                                                <span>Reports</span>
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </header>

                        {/* Main Card Container */}
                        <div className={`rounded-xl ${themeClasses.card} p-6 mb-8`}>

                            {/* Search Section - ORIGINAL TEXT KEPT */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-xl font-semibold ${themeClasses.text.primary} flex items-center`}>
                                        <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-3 text-blue-500" />
                                        Report Criteria
                                    </h2>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleResetFilters}
                                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${theme === 'light'
                                                ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-300'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700 border border-gray-600'
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faSync} className="w-4 h-4" />
                                            <span>Reset</span>
                                        </button>
                                        <button
                                            onClick={handleDownloadReport}
                                            disabled={filteredData.length === 0}
                                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${filteredData.length === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : themeClasses.button.download
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                                            <span>Export Report</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="max-w-6xl mx-auto">
                                    <div className="flex items-end gap-4 flex-nowrap overflow-x-auto">

                                        {/* Order ID From */}
                                        <div className="min-w-[160px] flex-shrink-0">
                                            <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-2 flex items-center`}>
                                                <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 mr-2 text-blue-500" />
                                                Order ID From
                                            </label>
                                            <input
                                                type="text"
                                                value={orderIdFrom}
                                                onChange={handleOrderIdFromChange}
                                                placeholder="e.g., 1001"
                                                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${themeClasses.input}`}
                                            />
                                        </div>

                                        {/* Order ID To */}
                                        <div className="min-w-[160px] flex-shrink-0">
                                            <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-2 flex items-center`}>
                                                <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 mr-2 text-blue-500" />
                                                Order ID To
                                            </label>
                                            <input
                                                type="text"
                                                value={orderIdTo}
                                                onChange={handleOrderIdToChange}
                                                placeholder="e.g., 2000"
                                                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${themeClasses.input}`}
                                            />
                                        </div>

                                        {/* OR Divider */}
                                        <div className="flex items-center pb-1 px-2 font-bold text-lg text-gray-500 whitespace-nowrap flex-shrink-0">
                                            OR
                                        </div>

                                        {/* Start Date */}
                                        <div className="min-w-[160px] flex-shrink-0">
                                            <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-2 flex items-center`}>
                                                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-blue-500" />
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${themeClasses.input}`}
                                            />
                                        </div>

                                        {/* End Date */}
                                        <div className="min-w-[160px] flex-shrink-0">
                                            <label className={`block text-sm font-semibold ${themeClasses.text.primary} mb-2 flex items-center`}>
                                                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-blue-500" />
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${themeClasses.input}`}
                                            />
                                        </div>

                                        {/* Apply Filters Button */}
                                        <div className="min-w-[180px] pb-1 flex-shrink-0">
                                            <button
                                                onClick={handleSearchClick}
                                                disabled={isLoading}
                                                className={`w-full h-12 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : themeClasses.button.success}`}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                        <span>Applying Filters...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4" />
                                                        <span>Apply Filters</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </div>

                                    {/* Search Tips – text preserved */}
                                    <div className="mt-4 text-center">
                                        <p className={`text-xs ${themeClasses.text.muted}`}>
                                            Tip: Use <b>Order ID range OR Date filters</b> to refine your report.
                                            Showing {filteredData.length} of {allData.length} records.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Enhanced Filter Section - ORIGINAL TEXT KEPT */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} flex items-center`}>
                                        <FontAwesomeIcon icon={faFilter} className="w-4 h-4 mr-2 text-blue-500" />
                                        Time Period
                                    </h3>
                                    <span className={`text-sm ${themeClasses.text.muted}`}>
                                        {filteredData.length} of {allData.length} records shown
                                    </span>
                                </div>

                                <div className="max-w-full mx-auto">
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {filterButtons.map((button) => (
                                            <button
                                                key={button.value}
                                                onClick={() => handleFilterClick(button.value)}
                                                disabled={isLoading}
                                                className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 min-w-[120px] cursor-pointer ${selectedFilter === button.value
                                                    ? `${themeClasses.button.filterActive} transform scale-105`
                                                    : themeClasses.button.filterInactive
                                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={button.icon}
                                                    className={`w-4 h-4 ${selectedFilter === button.value ? 'text-white' : 'text-blue-500'
                                                        }`}
                                                />
                                                <span className="font-medium">{button.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Data Table Section - ORIGINAL TEXT KEPT */}
                            <div className="mt-8">
                                <Datatable
                                    columns={columns}
                                    data={filteredData}
                                    rowsPerPage={50}
                                    theme={theme}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Foot />
        </>
    );
}