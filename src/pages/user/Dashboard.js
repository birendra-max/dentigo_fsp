import { useEffect, useRef, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { fetchWithAuth } from "../../utils/userapi";
import { ThemeContext } from "../../Context/ThemeContext";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import Loder from "../../Components/Loder";

import {
    faCheckDouble,
    faRunning,
    faClipboardCheck,
    faHandPaper,
    faLightbulb,
    faHeart,
    faStar,
    faArrowRight,
    faXmark,
    faClock,
    faCalendarDay,
    faBox,
    faBriefcase,
    faCalendarWeek,
    faRedo,
    faBan,
    faSun,
    faChartLine,
    faChevronRight,
    faFire,
    faBolt,
    faRocket,
    faGem,
    // Alternative clearer icons
    faCalendarAlt,
    faTasks,
    faFileAlt,
    faHourglassHalf,
    faExclamationCircle,
    faRedoAlt,
    faCalendar,
    faCheckCircle,
    faPauseCircle,
    faFlag,
    faClipboardList,
    faCalendarCheck,
    faSyncAlt
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const base_url = localStorage.getItem('base_url');
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const [cases, setCases] = useState(null);
    const [cards, setCards] = useState([]);
    const [form, setForm] = useState({
        feedback: "",
        likes: "",
    });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const feedBackaRef = useRef(null);
    const token = localStorage.getItem('token');
    const saveFeedback = async () => {
        if (form.feedback === '') {
            feedBackaRef.current.focus();
        }
        else {
            const resp = await fetch(`${base_url}/save-feedback`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant': 'dentigo'
                },
                body: JSON.stringify(form),
            })

            const data = await resp.json()
            if (data.status === 'success') {
                const statusEl = document.getElementById('status');
                statusEl.className = 'mb-4 w-full px-4 py-2 text-sm font-medium border rounded-lg border-green-400 bg-green-100 text-green-700 dark:border-green-500 dark:bg-green-900/30 dark:text-green-400';
                statusEl.innerText = data.message;
                setForm({ feedback: "", likes: "" });
                document.getElementById('feedbackform').reset();
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);

            } else {

                if (data.error === 'Invalid or expired token') {
                    alert('Invalid or expired token. Please log in again.')
                    navigate(logout);
                }

                const statusEl = document.getElementById('status');
                statusEl.className = 'mb-4 w-full px-4 py-2 text-sm font-medium border rounded-lg border-red-400 bg-red-100 text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-400';
                statusEl.innerText = data.message;
                setForm({ feedback: "", likes: "" });
                document.getElementById('feedbackform').reset();
                setTimeout(() => {
                    setShowModal(false);
                }, 2000);
            }
        }
    };

    useEffect(() => {
        async function fetchCardsData() {
            try {
                const data = await fetchWithAuth('all-cases-data-count', {
                    method: "GET",
                });

                if (data.status === 'success') {
                    setCases(data);
                } else {
                    setCases(null);
                }
            } catch (error) {
                console.error("Error fetching cases:", error);
                setCases(null);
            }
        }

        fetchCardsData();
    }, []);

    useEffect(() => {
        if (cases) {
            const updatedCards = [
                { 
                    id: "today", 
                    href: "/user/today_cases", 
                    title: "Today's Cases", 
                    subtitle: "Active for today", 
                    count: cases.today_cases, 
                    color: "from-amber-500 to-yellow-500", 
                    icon: faSun, 
                    accent: "bg-amber-500", 
                    priority: "high",
                    iconSize: "text-lg"
                },
                { 
                    id: "home", 
                    href: "/user/home", 
                    title: "New Cases", 
                    subtitle: "Awaiting review", 
                    count: cases.new_cases, 
                    color: "from-blue-500 to-cyan-500", 
                    icon: faFileAlt,  // Changed from faBox
                    accent: "bg-blue-500", 
                    priority: "high",
                    iconSize: "text-lg"
                },
                { 
                    id: "progress", 
                    href: "/user/in_progress", 
                    title: "In Progress", 
                    subtitle: "Currently working", 
                    count: cases.progress, 
                    color: "from-teal-500 to-emerald-500", 
                    icon: faHourglassHalf,  // Changed from faClock
                    accent: "bg-teal-500", 
                    priority: "medium",
                    iconSize: "text-lg"
                },
                { 
                    id: "completed", 
                    href: "/user/completed_case", 
                    title: "Completed", 
                    subtitle: "Ready for delivery", 
                    count: cases.completed, 
                    color: "from-green-500 to-lime-500", 
                    icon: faCheckCircle,  // Changed from faCheckDouble
                    accent: "bg-green-500", 
                    priority: "low",
                    iconSize: "text-lg"
                },
                { 
                    id: "rush", 
                    href: "/user/rush_cases", 
                    title: "Rush Cases", 
                    subtitle: "High priority", 
                    count: cases.rush, 
                    color: "from-red-500 to-pink-500", 
                    icon: faFlag,  // Changed from faRunning
                    accent: "bg-red-500", 
                    priority: "high",
                    iconSize: "text-lg"
                },
                { 
                    id: "qc", 
                    href: "/user/qc_required", 
                    title: "QC Required", 
                    subtitle: "Quality check", 
                    count: cases.qc, 
                    color: "from-purple-500 to-violet-500", 
                    icon: faClipboardList,  // Changed from faClipboardCheck
                    accent: "bg-purple-500", 
                    priority: "medium",
                    iconSize: "text-lg"
                },
                { 
                    id: "hold", 
                    href: "/user/case_on_hold", 
                    title: "On Hold", 
                    subtitle: "Pending information", 
                    count: cases.hold, 
                    color: "from-gray-500 to-slate-500", 
                    icon: faPauseCircle,  // Changed from faHandPaper
                    accent: "bg-gray-500", 
                    priority: "medium",
                    iconSize: "text-lg"
                },
                { 
                    id: "canceled", 
                    href: "/user/canceled_case", 
                    title: "Cancelled", 
                    subtitle: "Terminated cases", 
                    count: cases.canceled, 
                    color: "from-rose-500 to-red-500", 
                    icon: faExclamationCircle,  // Changed from faBan
                    accent: "bg-rose-500", 
                    priority: "low",
                    iconSize: "text-lg"
                },
                { 
                    id: "all_c", 
                    href: "/user/all_cases", 
                    title: "All Cases", 
                    subtitle: "Total overview", 
                    count: cases.all, 
                    color: "from-indigo-500 to-blue-600", 
                    icon: faTasks,  // Changed from faBriefcase
                    accent: "bg-indigo-500", 
                    priority: "low",
                    iconSize: "text-lg"
                },
                { 
                    id: "yesterday", 
                    href: "/user/yesterday_cases", 
                    title: "Yesterday", 
                    subtitle: "Previous day", 
                    count: cases.yesterday_cases, 
                    color: "from-cyan-500 to-sky-500", 
                    icon: faCalendarCheck,  // Changed from faCalendarDay
                    accent: "bg-cyan-500", 
                    priority: "low",
                    iconSize: "text-lg"
                },
                { 
                    id: "weekly", 
                    href: "/user/weekly_case", 
                    title: "Weekly", 
                    subtitle: "This week", 
                    count: cases.weekly_cases, 
                    color: "from-fuchsia-500 to-pink-500", 
                    icon: faCalendar,  // Changed from faCalendarWeek
                    accent: "bg-fuchsia-500", 
                    priority: "medium",
                    iconSize: "text-lg"
                },
                { 
                    id: "Redesign", 
                    href: "/user/redesign_cases", 
                    title: "Redesign", 
                    subtitle: "Revision needed", 
                    count: cases.redesign_cases, 
                    color: "from-emerald-500 to-teal-500", 
                    icon: faSyncAlt,  // Changed from faRedo
                    accent: "bg-emerald-500", 
                    priority: "medium",
                    iconSize: "text-lg"
                },
            ];

            setCards(updatedCards);
        }
    }, [cases]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Theme-based classes
    const getBackgroundClass = () => {
        return theme === 'dark'
            ? 'bg-black'
            : 'bg-gradient-to-br from-teal-50 via-pink-50 to-cyan-50';
    };

    const getCardClass = () => {
        return theme === 'dark'
            ? 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-700'
            : 'bg-white/90 hover:bg-white border-gray-200';
    };

    const getTextClass = () => {
        return theme === 'dark'
            ? 'text-gray-300'
            : 'text-gray-600';
    };

    const getTitleClass = () => {
        return theme === 'dark'
            ? 'text-white'
            : 'text-gray-900';
    };

    const getSubtitleClass = () => {
        return theme === 'dark'
            ? 'text-gray-400'
            : 'text-gray-500';
    };

    const getCountClass = () => {
        return theme === 'dark'
            ? 'text-white'
            : 'text-gray-900';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
            case 'medium': return theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600';
            case 'low': return theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
            default: return theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
        }
    };

    if (cards && cards != null) {
        return (
            <section className={`p-4 md:p-6 ${getBackgroundClass()}`}>
                {/* Cards Grid - Professional Compact Design */}
                <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cards.map((card, idx) => (
                        <Link
                            key={idx}
                            to={card.href}
                            className={`
                                rounded-lg p-4 transition-all duration-200 cursor-pointer border
                                ${getCardClass()}
                                hover:shadow-lg hover:-translate-y-0.5
                                transform hover:scale-[1.01]
                                group relative overflow-hidden min-h-[110px] max-h-[120px]
                                flex items-center
                            `}
                            id={card.id}
                        >
                            {/* Left side accent bar */}
                            <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${card.accent}`}></div>

                            <div className="flex items-center justify-between w-full pl-3">
                                {/* Left side - Content */}
                                <div className="flex-1 pr-3">
                                    {/* Title Row */}
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-sm font-semibold truncate ${getTitleClass()} tracking-tight`}>
                                            {card.title}
                                        </h3>
                                    </div>

                                    {/* Subtitle */}
                                    <p className={`text-xs mb-2 truncate ${getSubtitleClass()} opacity-90`}>
                                        {card.subtitle}
                                    </p>

                                    {/* Count */}
                                    <div className="flex items-baseline gap-1">
                                        {card.count !== null ? (
                                            <h4 className={`text-xl font-bold ${getCountClass()} leading-none`}>
                                                {card.count}
                                            </h4>
                                        ) : (
                                            <h4 className={`text-xl font-bold ${getCountClass()} leading-none`}>
                                                0
                                            </h4>
                                        )}
                                        <span className="text-xs font-normal opacity-75">cases</span>
                                    </div>
                                </div>

                                {/* Right side - Clear, Visible Icons */}
                                <div className="flex flex-col items-end">
                                    <div className="relative">
                                        {/* Clean, clear icon container */}
                                        <div className={`
                                            relative w-14 h-14 rounded-xl 
                                            ${card.accent}
                                            flex items-center justify-center
                                            shadow-lg
                                            transition-all duration-200 group-hover:scale-110
                                            border-2 ${theme === 'dark' ? 'border-white/40' : 'border-white/60'}
                                        `}>
                                            {/* Solid white icon - much clearer */}
                                            <FontAwesomeIcon
                                                icon={card.icon}
                                                className="text-white text-lg"
                                            />
                                            
                                            {/* Subtle glow effect on hover */}
                                            <div className={`absolute inset-0 rounded-xl ${card.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-200`}></div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className="absolute -bottom-4 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-1">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} shadow-sm`}>
                                                <FontAwesomeIcon
                                                    icon={faChevronRight}
                                                    className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Feedback Modal - Clean Professional Design */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={handleCloseModal}
                        ></div>

                        {/* Modal Container */}
                        <div className={`relative w-full max-w-md rounded-xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center`}>
                                            <FontAwesomeIcon icon={faLightbulb} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-semibold ${getTitleClass()}`}>
                                                Share Feedback
                                            </h3>
                                            <p className={`text-xs ${getSubtitleClass()}`}>
                                                Help us improve your experience
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                    >
                                        <FontAwesomeIcon icon={faXmark} className={getSubtitleClass()} />
                                    </button>
                                </div>

                                {/* Status message */}
                                <p id="status" className="mb-4 text-xs"></p>

                                {/* Form */}
                                <form className="space-y-5" id="feedbackform">
                                    {/* Feedback textarea */}
                                    <div>
                                        <label className={`block mb-2 text-xs font-medium ${getTitleClass()}`}>
                                            Your Feedback
                                        </label>
                                        <textarea
                                            ref={feedBackaRef}
                                            rows="3"
                                            name="feedback"
                                            value={form.feedback}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm transition-all ${theme === 'dark'
                                                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                                                }`}
                                            placeholder="What can we improve?"
                                        ></textarea>
                                    </div>

                                    {/* Star Rating */}
                                    <div>
                                        <label className={`block mb-3 text-xs font-medium ${getTitleClass()}`}>
                                            Rate Your Experience
                                        </label>
                                        <div className="flex items-center justify-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setForm((prev) => ({ ...prev, likes: num }))}
                                                    className="group relative"
                                                >
                                                    <div className={`
                                                        w-9 h-9 flex items-center justify-center rounded-lg
                                                        transition-all duration-200
                                                        ${form.likes >= num
                                                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                                                            : theme === 'dark'
                                                                ? 'bg-gray-700 hover:bg-gray-600'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                        }
                                                    `}>
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            className={`text-sm ${form.likes >= num ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
                                                        />
                                                    </div>
                                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-gray-800 text-white whitespace-nowrap">
                                                        {num}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {form.likes > 0 && (
                                            <div className={`mt-3 p-2.5 rounded-lg text-center ${theme === 'dark' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-100'}`}>
                                                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                    {form.likes === 1 ? '⭐ Needs Improvement'
                                                        : form.likes === 2 ? '⭐⭐ Fair'
                                                            : form.likes === 3 ? '⭐⭐⭐ Good'
                                                                : form.likes === 4 ? '⭐⭐⭐⭐ Very Good'
                                                                    : '⭐⭐⭐⭐⭐ Excellent'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className={`flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${theme === 'dark'
                                                ? 'bg-gray-700 hover:bg-gray-600'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                                } ${getTitleClass()}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={saveFeedback}
                                            className="flex-1 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm shadow-sm"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Feedback Button */}
                <div className="fixed bottom-6 right-6 z-40">
                    <button
                        onClick={handleOpenModal}
                        className="group relative cursor-pointer"
                    >
                        {/* Main button */}
                        <div className="relative w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700"></div>
                            <div className="relative w-full h-full flex items-center justify-center">
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className="text-white text-sm group-hover:scale-110 transition-transform duration-200"
                                />
                            </div>
                            {/* Button shine */}
                            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl"></div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className={`px-2.5 py-1.5 rounded text-xs font-medium whitespace-nowrap shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
                                }`}>
                                Feedback
                                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-1.5 h-1.5 bg-inherit"></div>
                            </div>
                        </div>
                    </button>
                </div>
            </section>
        )
    } else {
        return (
            <div className={`min-h-screen flex items-center justify-center ${getBackgroundClass()}`}>
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-4 border-transparent border-b-green-500 border-l-yellow-500 rounded-full animate-spin animation-delay-300"></div>
                    </div>
                    <p className={`mt-6 text-lg font-medium ${getTitleClass()}`}>Loading Dashboard...</p>
                    <p className={`mt-2 text-sm ${getSubtitleClass()}`}>Please wait while we load your data</p>
                </div>
            </div>
        )
    }
}