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
    faSyncAlt,
    faPaperPlane,
    faSpinner,
    faCheck,
    faExclamationTriangle
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        show: false,
        type: '', // 'success' or 'error'
        message: '',
        icon: null
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const feedBackaRef = useRef(null);
    const token = localStorage.getItem('token');
    
    const saveFeedback = async () => {
        if (form.feedback.trim() === '') {
            feedBackaRef.current.focus();
            setSubmitStatus({
                show: true,
                type: 'error',
                message: 'Please enter your feedback before submitting.',
                icon: faExclamationTriangle
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({
            show: false,
            type: '',
            message: '',
            icon: null
        });

        try {
            const resp = await fetch(`${base_url}/save-feedback`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant': 'dentigo'
                },
                body: JSON.stringify(form),
            });

            const data = await resp.json();
            
            if (data.status === 'success') {
                setSubmitStatus({
                    show: true,
                    type: 'success',
                    message: data.message || 'Thank you for your valuable feedback!',
                    icon: faCheck
                });
                
                setForm({ feedback: "", likes: "" });
                document.getElementById('feedbackform').reset();
                
                // Clear star ratings visually
                const starButtons = document.querySelectorAll('button[onclick^="setForm"]');
                starButtons.forEach(btn => {
                    btn.classList.remove('bg-gradient-to-br', 'from-yellow-500', 'to-orange-500');
                    if (theme === 'dark') {
                        btn.classList.add('bg-gray-700');
                    } else {
                        btn.classList.add('bg-gray-100');
                    }
                });
                
                // Auto close after success
                setTimeout(() => {
                    setShowModal(false);
                    setSubmitStatus({
                        show: false,
                        type: '',
                        message: '',
                        icon: null
                    });
                    setIsSubmitting(false);
                }, 2000);
                
            } else {
                if (data.error === 'Invalid or expired token') {
                    alert('Invalid or expired token. Please log in again.');
                    navigate(logout);
                    return;
                }

                setSubmitStatus({
                    show: true,
                    type: 'error',
                    message: data.message || 'Failed to submit feedback. Please try again.',
                    icon: faExclamationTriangle
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setSubmitStatus({
                show: true,
                type: 'error',
                message: 'Network error. Please check your connection and try again.',
                icon: faExclamationTriangle
            });
            setIsSubmitting(false);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setForm({ feedback: "", likes: "" });
        setSubmitStatus({
            show: false,
            type: '',
            message: '',
            icon: null
        });
        setIsSubmitting(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setForm({ feedback: "", likes: "" });
        setSubmitStatus({
            show: false,
            type: '',
            message: '',
            icon: null
        });
        setIsSubmitting(false);
    };

    const handleStarClick = (num) => {
        if (isSubmitting) return;
        setForm((prev) => ({ ...prev, likes: num }));
        
        // Update star visuals
        const starButtons = document.querySelectorAll('.star-rating-button');
        starButtons.forEach((btn, index) => {
            if (index < num) {
                btn.classList.remove('bg-gray-700', 'bg-gray-100', 'hover:bg-gray-600', 'hover:bg-gray-200');
                btn.classList.add('bg-gradient-to-br', 'from-yellow-500', 'to-orange-500');
            } else {
                btn.classList.remove('bg-gradient-to-br', 'from-yellow-500', 'to-orange-500');
                if (theme === 'dark') {
                    btn.classList.add('bg-gray-700');
                } else {
                    btn.classList.add('bg-gray-100');
                }
            }
        });
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
                    icon: faFileAlt,
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
                    icon: faHourglassHalf,
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
                    icon: faCheckCircle,
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
                    icon: faFlag,
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
                    icon: faClipboardList,
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
                    icon: faPauseCircle,
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
                    icon: faExclamationCircle,
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
                    icon: faTasks,
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
                    icon: faCalendarCheck,
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
                    icon: faCalendar,
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
                    icon: faSyncAlt,
                    accent: "bg-emerald-500",
                    priority: "medium",
                    iconSize: "text-lg"
                },
            ];

            setCards(updatedCards);
        }
    }, [cases]);

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

    const getStatusColorClass = (type) => {
        if (type === 'success') {
            return theme === 'dark' 
                ? 'bg-green-900/30 border border-green-800 text-green-300' 
                : 'bg-green-50 border border-green-200 text-green-700';
        } else if (type === 'error') {
            return theme === 'dark' 
                ? 'bg-red-900/30 border border-red-800 text-red-300' 
                : 'bg-red-50 border border-red-200 text-red-700';
        }
        return '';
    };

    const getSubmitButtonClass = () => {
        const baseClass = "flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2";
        
        if (isSubmitting) {
            return theme === 'dark'
                ? `${baseClass} bg-blue-800/50 text-blue-300 cursor-not-allowed`
                : `${baseClass} bg-blue-400 text-white cursor-not-allowed`;
        }
        
        return `${baseClass} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm`;
    };

    if (cards && cards.length > 0) {
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

                {/* Feedback Modal - Enhanced Professional Design */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                        {/* Backdrop with blur */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
                            onClick={!isSubmitting ? handleCloseModal : undefined}
                        ></div>

                        {/* Modal Container */}
                        <div className={`relative w-full max-w-md rounded-xl shadow-2xl transform transition-all duration-300 scale-100 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20' : 'bg-gradient-to-br from-blue-100 to-indigo-100'}`}>
                                            <FontAwesomeIcon 
                                                icon={faLightbulb} 
                                                className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} 
                                            />
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-semibold ${getTitleClass()}`}>
                                                Share Your Feedback
                                            </h3>
                                            <p className={`text-xs ${getSubtitleClass()}`}>
                                                We value your opinion
                                            </p>
                                        </div>
                                    </div>
                                    {!isSubmitting && (
                                        <button
                                            onClick={handleCloseModal}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                            disabled={isSubmitting}
                                        >
                                            <FontAwesomeIcon icon={faXmark} className={getSubtitleClass()} />
                                        </button>
                                    )}
                                </div>

                                {/* Status Message - Professional Design */}
                                {submitStatus.show && (
                                    <div className={`mb-4 p-3.5 rounded-lg flex items-center gap-3 transition-all duration-300 ${getStatusColorClass(submitStatus.type)} animate-slide-down`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${submitStatus.type === 'success' 
                                            ? theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100' 
                                            : theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                            <FontAwesomeIcon 
                                                icon={submitStatus.icon} 
                                                className={submitStatus.type === 'success' 
                                                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                                    : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                                } 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium leading-tight">{submitStatus.message}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <form className="space-y-5" id="feedbackform">
                                    {/* Feedback textarea */}
                                    <div className="space-y-2">
                                        <label className={`block text-xs font-semibold ${getTitleClass()}`}>
                                            Your Feedback <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            ref={feedBackaRef}
                                            rows="4"
                                            name="feedback"
                                            value={form.feedback}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className={`w-full px-3.5 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm resize-none ${theme === 'dark'
                                                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
                                                : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
                                                }`}
                                            placeholder="What do you like about our service? What can we improve?"
                                        ></textarea>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Minimum 10 characters recommended
                                            </p>
                                            <p className={`text-xs ${form.feedback.length < 10 ? 'text-amber-500' : 'text-green-500'}`}>
                                                {form.feedback.length}/500
                                            </p>
                                        </div>
                                    </div>

                                    {/* Star Rating - Enhanced */}
                                    <div className="space-y-3">
                                        <label className={`block text-xs font-semibold ${getTitleClass()}`}>
                                            How would you rate your experience?
                                        </label>
                                        <div className="flex items-center justify-center space-x-1.5 mb-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => !isSubmitting && handleStarClick(num)}
                                                    disabled={isSubmitting}
                                                    className={`
                                                        star-rating-button
                                                        w-10 h-10 flex items-center justify-center rounded-lg
                                                        transition-all duration-200 transform hover:scale-110
                                                        ${form.likes >= num
                                                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-md'
                                                            : theme === 'dark'
                                                                ? 'bg-gray-700 hover:bg-gray-600'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                        }
                                                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                                        group relative
                                                    `}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        className={`text-sm ${form.likes >= num ? 'text-white' : theme === 'dark' ? 'text-gray-400 group-hover:text-yellow-400' : 'text-gray-400 group-hover:text-yellow-500'}`}
                                                    />
                                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 rounded-md bg-gray-900 text-white whitespace-nowrap shadow-lg">
                                                        {num === 1 ? 'Poor'
                                                            : num === 2 ? 'Fair'
                                                                : num === 3 ? 'Good'
                                                                    : num === 4 ? 'Very Good'
                                                                        : 'Excellent'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Rating Description */}
                                        {form.likes > 0 && (
                                            <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100'}`}>
                                                <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                    {form.likes === 1 ? '😞 Needs Improvement'
                                                        : form.likes === 2 ? '😕 Fair - Room for improvement'
                                                            : form.likes === 3 ? '🙂 Good - Met expectations'
                                                                : form.likes === 4 ? '😊 Very Good - Exceeded expectations'
                                                                    : '🤩 Excellent - Outstanding experience!'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3 pt-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            disabled={isSubmitting}
                                            className={`
                                                flex-1 px-3 py-2.5 rounded-lg font-medium transition-all text-sm 
                                                ${theme === 'dark'
                                                    ? 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                    : 'bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                                }
                                                ${getTitleClass()}
                                            `}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={saveFeedback}
                                            disabled={isSubmitting || form.feedback.trim().length < 1}
                                            className={getSubmitButtonClass()}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faPaperPlane} />
                                                    Submit Feedback
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Floating Feedback Button */}
                <div className="fixed bottom-6 right-6 z-40">
                    <button
                        onClick={handleOpenModal}
                        className="group relative cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {/* Glow effect */}
                        <div className={`absolute -inset-2 rounded-full animate-pulse opacity-20 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
                        
                        {/* Main button */}
                        <div className="relative w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 rounded-full overflow-hidden group-hover:rotate-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-full"></div>
                            
                            {/* Animated rings */}
                            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute inset-1 rounded-full border border-white/20 animate-ping opacity-30" style={{ animationDuration: '2s' }}></div>
                            
                            <div className="relative w-full h-full flex items-center justify-center">
                                {isSubmitting ? (
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        className="text-white text-sm animate-spin"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="text-white text-sm group-hover:scale-110 transition-transform duration-300"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Enhanced Tooltip */}
                        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <div className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-900 text-white border border-gray-800'}`}>
                                Share Feedback
                                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-inherit border-r border-b border-inherit"></div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Add CSS animations */}
                <style jsx>{`
                    @keyframes fade-in {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    @keyframes slide-down {
                        from {
                            transform: translateY(-10px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    @keyframes scale-in {
                        from {
                            transform: scale(0.95);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out;
                    }
                    .animate-slide-down {
                        animation: slide-down 0.3s ease-out;
                    }
                    .animate-scale-in {
                        animation: scale-in 0.3s ease-out;
                    }
                    .animation-delay-300 {
                        animation-delay: 300ms;
                    }
                `}</style>
            </section>
        )
    }
}