import { useContext, useState, useEffect } from 'react';
import Hd from './Hd';
import Foot from './Foot';
import { DesignerContext } from '../../Context/DesignerContext';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeContext } from "../../Context/ThemeContext";
import {
    faEye,
    faEyeSlash,
    faCamera,
    faCheckCircle,
    faUser,
    faEnvelope,
    faPhone,
    faHome,
    faCalendarAlt,
    faSave,
    faIdCard,
    faUserTie,
    faKey,
    faExclamationTriangle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
    let base_url = localStorage.getItem('base_url');
    const token = localStorage.getItem('token');
    const { theme } = useContext(ThemeContext);
    const [formStatus, setFormStatus] = useState(0);
    const { designer, setDesigner } = useContext(DesignerContext);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [form, setForm] = useState({
        email: "",
        designation: "",
        mobile: "",
        password: "",
    });

    // Fetch user data from backend on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/get-user-profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant': 'dentigo'
                }
            });

            const data = await response.json();
            if (data.status === 'success') {
                setDesigner(data.designer);
                setForm({
                    email: data.designer.email || "",
                    designation: data.designer.designation || "",
                    mobile: data.designer.mobile || "",
                    password: "",
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("profile", file);

            try {
                setProfileLoading(true);
                const profileresp = await fetch(`${base_url}/update-profile`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Tenant': 'dentigo'
                    },
                    body: formData,
                });

                const data = await profileresp.json();
                const statusEl = document.getElementById('profilestatus');
                if (data.status === 'success') {
                    statusEl.className = `w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${theme === 'light'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-green-900/20 text-green-400 border border-green-800'
                        }`;
                    statusEl.innerText = data.message;
                    await fetchUserData();
                    setTimeout(() => {
                        statusEl.innerText = '';
                    }, 3000);
                } else {
                    statusEl.className = `w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${theme === 'light'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-red-900/20 text-red-400 border border-red-800'
                        }`;
                    statusEl.innerText = data.message;
                }
            } catch (err) {
                const statusEl = document.getElementById('profilestatus');
                statusEl.className = `w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${theme === 'light'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-red-900/20 text-red-400 border border-red-800'
                    }`;
                statusEl.innerText = 'Upload failed. Please try again.';
            } finally {
                setProfileLoading(false);
            }
        }
    };

    const handleProfile = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormStatus(formStatus + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/update-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant': 'dentigo'
                },
                body: JSON.stringify(form),
            });

            const resp = await response.json();
            const statusEl = document.getElementById('status');
            if (resp.status === 'success') {
                statusEl.className = `w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${theme === 'light'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-green-900/20 text-green-400 border border-green-800'
                    }`;
                statusEl.innerText = resp.message;
                await fetchUserData();
                setTimeout(() => {
                    statusEl.innerText = '';
                }, 3000);
            } else {
                statusEl.className = `w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${theme === 'light'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-red-900/20 text-red-400 border border-red-800'
                    }`;
                statusEl.innerText = resp.message;
            }
        } catch (error) {
            const statusEl = document.getElementById('status');
            statusEl.className = `w-full text-center text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 ${theme === 'light'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-red-900/20 text-red-400 border border-red-800'
                }`;
            statusEl.innerText = 'Update failed. Please try again.';
        } finally {
            setLoading(false);
        }
    };

    // Enhanced theme-based styling
    const getMainClass = () => {
        return theme === 'light'
            ? 'bg-gradient-to-b from-gray-50 to-white'
            : 'bg-gradient-to-b from-gray-900 to-gray-950';
    };

    const getHeaderClass = () => {
        return theme === 'light'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
            : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-xl';
    };

    const getCardClass = () => {
        return theme === 'light'
            ? 'bg-white shadow-lg border border-gray-100 rounded-xl'
            : 'bg-gray-800/80 shadow-xl border border-gray-700 rounded-xl backdrop-blur-sm';
    };

    const getInputClass = () => {
        return theme === 'light'
            ? 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'
            : 'bg-gray-700/50 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner';
    };

    const getDisabledInputClass = () => {
        return theme === 'light'
            ? 'bg-gray-50 border-gray-200 text-gray-600 shadow-sm'
            : 'bg-gray-700/30 border-gray-700 text-gray-400 shadow-inner';
    };

    const getTabHeaderClass = () => {
        return theme === 'light'
            ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
            : 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700';
    };

    const getTabButtonClass = (isActive) => {
        if (isActive) {
            return theme === 'light'
                ? 'text-blue-700 border-blue-600 bg-white shadow-sm'
                : 'text-blue-300 border-blue-500 bg-gray-800 shadow-inner';
        } else {
            return theme === 'light'
                ? 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-white/50'
                : 'text-gray-400 border-transparent hover:text-blue-400 hover:bg-gray-700/50';
        }
    };

    const getLabelClass = () => {
        return theme === 'light'
            ? 'text-gray-800 font-semibold'
            : 'text-gray-200 font-semibold';
    };

    const getBorderClass = () => {
        return theme === 'light'
            ? 'border-gray-200'
            : 'border-gray-700';
    };

    const getDividerClass = () => {
        return theme === 'light'
            ? 'border-gray-100'
            : 'border-gray-700';
    };

    if (!designer || Object.keys(designer).length === 0) {
        return (
            <>
                <Hd />
                <main className={`min-h-screen transition-colors duration-300 ${getMainClass()} pt-16 sm:pt-22`}>
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-center items-center min-h-[70vh]">
                            <div className="text-center px-4 max-w-md">
                                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/30'}`}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-10 h-10 text-yellow-600" />
                                </div>
                                <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'
                                    }`}>Designer Profile Not Found</h2>
                                <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    Please log in to access your designer profile information.
                                </p>
                                <Link
                                    to="/designer/login"
                                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${theme === 'light'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                        : 'bg-blue-700 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    Go to Designer Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <Foot />
            </>
        );
    }
    console.log(designer);

    return (
        <>
            <Hd />
            <main className={`min-h-screen transition-colors duration-300 ${getMainClass()} pt-20 pb-12`}>
                {/* Enhanced Header Section */}
                <header className={`relative z-10 border-b shadow-xl px-4 ${getHeaderClass()}`}>
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'light' ? 'bg-white/20' : 'bg-gray-800/30'}`}>
                                        <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-white' : 'text-white'
                                            }`}>
                                            Profile Management
                                        </h1>
                                        <p className={`mt-1 text-sm ${theme === 'light' ? 'text-blue-100' : 'text-gray-300'
                                            }`}>Manage your designer account settings and preferences securely</p>
                                    </div>
                                </div>
                            </div>
                            <nav className="flex justify-center lg:justify-end">
                                <ol className="flex items-center space-x-3 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <li>
                                        <Link to="/designer/home" className={`hover:text-blue-200 transition-colors duration-300 flex items-center ${theme === 'light' ? 'text-white' : 'text-gray-200'
                                            }`}>
                                            <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-2" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li className="flex items-center">
                                        <span className={`mx-2 ${theme === 'light' ? 'text-blue-200' : 'text-gray-500'
                                            }`}>/</span>
                                        <span className={`font-semibold truncate ${theme === 'light' ? 'text-white' : 'text-gray-200'
                                            }`}>
                                            {designer.name}
                                        </span>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className=" mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                        {/* Left Sidebar - Enhanced Profile Card */}
                        <div className="xl:col-span-1">
                            <div className={`${getCardClass()} p-6`}>
                                {/* Profile Image Section */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        <div className="relative group">
                                            {!designer.pic || designer.pic === '' ? (
                                                <img
                                                    className="w-32 h-32 rounded-xl mx-auto border-4 shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                    src="/img/user.webp"
                                                    alt="Designer profile"
                                                />
                                            ) : (
                                                <img
                                                    className="w-32 h-32 rounded-xl mx-auto border-4 shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                                    src={`${designer.pic}`}
                                                    alt="Designer profile"
                                                />
                                            )}
                                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'light' ? '' : 'from-white/5'}`}></div>
                                            {profileLoading && (
                                                <div className={`absolute inset-0 bg-opacity-80 rounded-xl flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-gray-900'
                                                    }`}>
                                                    <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-blue-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 shadow-lg flex items-center justify-center ${theme === 'light' ? 'bg-green-500 border-white' : 'bg-green-600 border-gray-800'}`}>
                                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    <h3 className={`text-xl font-bold mt-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'
                                        }`}>
                                        {designer.name || 'Designer'}
                                    </h3>
                                    <p className={`text-sm mt-1 font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                                        }`}>Certified Dental Designer</p>
                                    <div className="flex items-center justify-center mt-2 space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-600 text-sm font-medium">Active & Online</span>
                                    </div>
                                </div>

                                {/* Client Info Section */}
                                <div className="space-y-4 mb-6">
                                    <div className={`flex justify-between items-center py-3 px-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-gray-700/50'}`}>
                                        <span className={`font-medium flex items-center text-sm ${getLabelClass()}`}>
                                            <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-blue-500 mr-2" />
                                            Designer ID
                                        </span>
                                        <span className={`font-bold px-3 py-1 rounded-md text-sm ${theme === 'light' ? 'text-gray-800 bg-white shadow-sm' : 'text-white bg-gray-800 shadow-inner'
                                            }`}>
                                            #{designer.desiid}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between items-center py-3 px-4 rounded-lg ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'}`}>
                                        <span className={`font-medium flex items-center text-sm ${getLabelClass()}`}>
                                            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-purple-500 mr-2" />
                                            Member Since
                                        </span>
                                        <span className={`font-semibold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-white'
                                            }`}>
                                            {designer.desi_added_date || 'Not Specified'}
                                        </span>
                                    </div>
                                </div>

                                {/* Account Status Button */}
                                {designer.status !== 'active' ? (
                                    <button className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mb-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center ${theme === 'light'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                        }`}>
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                                        Activate Designer Account
                                    </button>
                                ) : (
                                    <button className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mb-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${theme === 'light'
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                                        }`}>
                                        Deactivate Account
                                    </button>
                                )}

                                {/* Profile Picture Upload Section */}
                                <div className="space-y-4">
                                    <p id="profilestatus" className="w-full text-center text-sm"></p>
                                    <div>
                                        <label className={`text-sm font-semibold mb-3 flex items-center ${getLabelClass()}`}>
                                            <FontAwesomeIcon icon={faCamera} className="w-4 h-4 mr-2 text-blue-500" />
                                            Update Profile Image
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                name="profile_pic"
                                                accept='image/*'
                                                onChange={handleFileChange}
                                                disabled={profileLoading}
                                                className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'light'
                                                    ? 'bg-gray-50 border-gray-300 text-gray-700 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white hover:file:from-blue-600 hover:file:to-blue-700'
                                                    : 'bg-gray-800/50 border-gray-600 text-gray-300 file:bg-gradient-to-r file:from-blue-600 file:to-blue-700 file:text-white hover:file:from-blue-700 hover:file:to-blue-800'
                                                    }`}
                                            />
                                            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${profileLoading ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                                                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-blue-500 animate-spin" />
                                            </div>
                                        </div>
                                        <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            Recommended: Square image, max 2MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Designer Details */}
                        <div className="xl:col-span-3">
                            <div className={`${getCardClass()} overflow-hidden`}>
                                {/* Enhanced Tab Header */}
                                <div className={`px-6 py-4 border-b ${getTabHeaderClass()}`}>
                                    <nav className="flex space-x-1">
                                        <button
                                            onClick={() => setActiveTab('personal')}
                                            className={`font-semibold px-6 py-3 rounded-lg border-b-2 transition-all duration-300 flex items-center ${getTabButtonClass(activeTab === 'personal')}`}
                                        >
                                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                                            Designer Details
                                        </button>
                                    </nav>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <input type="hidden" name="email" value={form.email} />

                                        {/* Responsive Grid Layout */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Professional Information */}
                                            <div className="space-y-6">
                                                {/* Row 1 */}
                                                <div className="flex flex-col space-y-2">
                                                    <label className={`font-semibold text-sm uppercase tracking-wider flex items-center ${getLabelClass()}`}>
                                                        <FontAwesomeIcon icon={faUserTie} className="w-4 h-4 text-blue-500 mr-2" />
                                                        Designation
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="designation"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${getInputClass()}`}
                                                        value={form.designation}
                                                        onChange={handleProfile}
                                                        placeholder="Enter your designer title"
                                                    />
                                                </div>


                                                {/* Row 3 */}
                                                <div className="flex flex-col space-y-2">
                                                    <label className={`font-semibold text-sm uppercase tracking-wider flex items-center ${getLabelClass()}`}>
                                                        <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-blue-500 mr-2" />
                                                        Mobile Contact
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="mobile"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${getInputClass()}`}
                                                        value={form.mobile}
                                                        onChange={handleProfile}
                                                        placeholder="Enter mobile number"
                                                    />
                                                </div>
                                            </div>

                                            {/* Laboratory & Medical Details */}
                                            <div className="space-y-6">
                                                {/* Row 1 */}
                                                <div className="flex flex-col space-y-2">
                                                    <label className={`font-semibold text-sm uppercase tracking-wider flex items-center ${getLabelClass()}`}>
                                                        <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-blue-500 mr-2" />
                                                        Professional Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 cursor-not-allowed ${getDisabledInputClass()}`}
                                                        value={form.email}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            {/* Full Width Fields */}
                                            {/* Row 5 - Password field with enhanced design */}
                                            <div className="flex flex-col space-y-2">
                                                <label className={`font-semibold text-sm uppercase tracking-wider flex items-center ${getLabelClass()}`}>
                                                    <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-blue-500 mr-2" />
                                                    New Password
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-12 ${getInputClass()}`}
                                                        placeholder="Enter new password for security update"
                                                        value={form.password}
                                                        onChange={handleProfile}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 p-2 rounded-lg ${theme === 'light'
                                                            ? 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                                                            : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={showPassword ? faEyeSlash : faEye}
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                </div>
                                                <p className={`text-sm mt-2 flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                                    }`}>
                                                    <FontAwesomeIcon icon={faKey} className="w-3 h-3 text-blue-400 mr-2" />
                                                    Leave blank to maintain current password security
                                                </p>
                                            </div>
                                        </div>

                                        {/* Enhanced Submit Section */}
                                        <div className={`pt-6 border-t ${getBorderClass()}`}>
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className={`text-sm text-center lg:text-left ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                                    }`}>
                                                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-blue-500" />
                                                        <span>Profile Last Updated: {designer.last_updated || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-stretch lg:items-end gap-3">
                                                    <p id="status" className="w-full text-center lg:text-right text-sm"></p>
                                                    <button
                                                        disabled={formStatus === 0 || loading}
                                                        type="submit"
                                                        className={`cursor-pointer text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center text-sm lg:text-base w-full lg:w-auto ${formStatus === 0 || loading
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "hover:bg-blue-600"
                                                            } ${theme === 'light'
                                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                                                : 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900'
                                                            }`}>
                                                        {loading ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                                                                Processing Update...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                                                                Save Designer Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Foot />
        </>
    )
}