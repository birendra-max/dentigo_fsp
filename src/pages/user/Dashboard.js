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
    faSun
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
                statusEl.className = 'mb-4 w-full px-4 py-2 text-sm font-medium border rounded-lg border-green-400 bg-green-100 text-green-700';
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
                statusEl.className = 'mb-4 w-full px-4 py-2 text-sm font-medium border rounded-lg border-red-400 bg-red-100 text-red-700';
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
                { id: "home", href: "/user/home", title: "New Cases", count: cases.new_cases, color: "from-cyan-500 to-blue-600", icon: faBox },
                { id: "progress", href: "/user/in_progress", title: "In Progress", count: cases.progress, color: "from-amber-500 to-orange-600", icon: faClock },
                { id: "canceled", href: "/user/canceled_case", title: "Cancelled Cases", count: cases.canceled, color: "from-rose-500 to-pink-600", icon: faBan },
                { id: "completed", href: "/user/completed_case", title: "Completed Cases", count: cases.completed, color: "from-emerald-500 to-green-600", icon: faCheckDouble },
                { id: "rush", href: "/user/rush_cases", title: "Rush Cases", count: cases.rush, color: "from-violet-500 to-purple-600", icon: faRunning },
                { id: "qc", href: "/user/qc_required", title: "QC Required", count: cases.qc, color: "from-orange-500 to-red-500", icon: faClipboardCheck },
                { id: "hold", href: "/user/case_on_hold", title: "Case On Hold", count: cases.hold, color: "from-slate-500 to-gray-600", icon: faHandPaper },
                { id: "all_c", href: "/user/all_cases", title: "All Cases", count: cases.all, color: "from-indigo-500 to-blue-700", icon: faBriefcase },
                { id: "yesterday", href: "/user/yesterday_cases", title: "Yesterday's Cases", count: cases.yesterday_cases, color: "from-sky-500 to-cyan-600", icon: faCalendarDay },
                { id: "today", href: "/user/today_cases", title: "Today's Cases", count: cases.today_cases, color: "from-yellow-500 to-amber-600", icon: faSun },
                { id: "weekly", href: "/user/weekly_case", title: "Weekly Cases", count: cases.weekly_cases, color: "from-fuchsia-500 to-purple-600", icon: faCalendarWeek },
                { id: "Redesign", href: "/user/redesign_cases", title: "Redesign Cases", count: cases.redesign_cases, color: "from-teal-500 to-emerald-600", icon: faRedo },
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

    // Theme-based background classes
    const getBackgroundClass = () => {
        return theme === 'dark'
            ? 'bg-gray-800/70 text-white'
            : 'bg-indigo-50 text-gray-800';
    };

    const getCardClass = () => {
        return theme === 'dark'
            ? 'bg-gray-800/70 backdrop-blur-sm text-white hover:bg-gray-700/70 border-gray-700/50'
            : 'bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white border-gray-200/50';
    };

    const getModalClass = () => {
        return theme === 'dark'
            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700/50 text-white'
            : 'bg-white/90 backdrop-blur-sm border-gray-200/50 text-gray-800';
    };

    const getTextAreaClass = () => {
        return theme === 'dark'
            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400'
            : 'bg-white/50 border-gray-300/50 text-gray-800 placeholder-gray-500';
    };

    const getButtonClass = () => {
        return theme === 'dark'
            ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50';
    };

    const getTextClass = () => {
        return theme === 'dark'
            ? 'text-gray-300'
            : 'text-gray-600';
    };

    const getCountClass = () => {
        return theme === 'dark'
            ? 'text-white'
            : 'text-gray-900';
    };

    // Single shape for all items (yesterday cases shape)
    const getCardShape = () => {
        return {
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' // Octagon shape
        };
    };

    if (cards && cards != null) {
        return (
            <section className={`p-6 ${getBackgroundClass()}`}>
                {/* Cards Grid - Single Shape Design */}
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cards.map((card, idx) => (
                        <Link
                            key={idx}
                            to={card.href}
                            className={`
                                rounded-2xl p-5 transition-all duration-300 cursor-pointer border
                                ${getCardClass()}
                                hover:shadow-2xl hover:-translate-y-1
                                transform hover:scale-[1.02]
                                group relative overflow-hidden
                            `}
                            id={card.id}
                        >
                            {/* Animated background effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-white/10 group-hover:to-transparent transition-all duration-500"></div>

                            <div className="relative flex items-start gap-4">
                                {/* Octagon Shape Icon Container - Same for all */}
                                <div
                                    className="flex-shrink-0 w-16 h-16"
                                >
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={getCardShape()}
                                    >
                                        <div className={`w-full h-full bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                            <FontAwesomeIcon
                                                icon={card.icon}
                                                className="text-white text-lg transform group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium tracking-wide uppercase ${getTextClass()} mb-1`}>
                                        {card.title}
                                    </p>
                                    {card.count !== null ? (
                                        <h3 className={`text-2xl font-bold ${getCountClass()}`}>
                                            {card.count}
                                            <span className="text-xs font-normal ml-2 opacity-75">cases</span>
                                        </h3>
                                    ) : (
                                        <h3 className={`text-2xl font-bold ${getCountClass()}`}>
                                            0
                                            <span className="text-xs font-normal ml-2 opacity-75">cases</span>
                                        </h3>
                                    )}

                                    {/* Decorative line */}
                                    <div className="mt-3 w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                                </div>

                                {/* Arrow indicator */}
                                <div className={`text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>


                {/* Feedback Modal - Modern Design */}
                <div
                    id="feedbackModal"
                    className={`${showModal ? 'flex' : 'hidden'} fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4`}
                >
                    <div className={`border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden ${getModalClass()}`}>
                        {/* Modal background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 rounded-full translate-y-20 -translate-x-20"></div>
                        </div>

                        <div className="relative p-8">
                            <button
                                onClick={handleCloseModal}
                                className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-all ${getButtonClass()}`}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>

                            <div className="text-center mb-6">
                                <div
                                    className="inline-flex items-center justify-center w-16 h-16 mb-4"
                                    style={getCardShape()}
                                >
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faLightbulb} className="text-2xl text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Share Your Thoughts
                                </h3>
                                <p className={`mt-2 ${getTextClass()}`}>
                                    Help us improve your experience
                                </p>
                            </div>

                            <p id="status"></p>

                            <form className="space-y-6" id="feedbackform">
                                <div>
                                    <label className={`block mb-3 text-sm font-medium ${getTextClass()}`}>
                                        Your Feedback
                                    </label>
                                    <textarea
                                        ref={feedBackaRef}
                                        rows="4"
                                        name="feedback"
                                        value={form.feedback}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none text-sm transition-all ${getTextAreaClass()}`}
                                        placeholder="We value your input. What can we do better?"
                                    ></textarea>
                                </div>

                                {/* Star Rating */}
                                <div>
                                    <label className={`block mb-3 text-sm font-medium ${getTextClass()}`}>
                                        Rate Your Experience
                                    </label>
                                    <div className="flex items-center justify-center space-x-4">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => setForm((prev) => ({ ...prev, likes: num }))}
                                                type="button"
                                                className="group relative"
                                            >
                                                <div
                                                    className={`
                                                        w-12 h-12 flex items-center justify-center
                                                        transition-all duration-300 transform hover:scale-110 rounded-full
                                                        ${form.likes >= num
                                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_8px_32px_rgba(250,204,21,0.3)]'
                                                            : theme === 'dark'
                                                                ? 'bg-gray-700/50 border border-gray-600/50 hover:bg-yellow-500/20'
                                                                : 'bg-white/50 border border-gray-300/50 hover:bg-yellow-50'
                                                        }
                                                    `}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        className={`text-xl ${form.likes >= num ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`}
                                                    />
                                                </div>
                                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs px-3 py-1 rounded-lg bg-black/80 text-white whitespace-nowrap">
                                                    {num} star{num > 1 ? 's' : ''}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {form.likes > 0 && (
                                        <div className={`mt-4 p-3 rounded-xl text-center ${theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                {form.likes === 1 ? '⭐ Terrible - We need to improve!'
                                                    : form.likes === 2 ? '⭐⭐ Poor - We can do better'
                                                        : form.likes === 3 ? '⭐⭐⭐ Average - Getting there'
                                                            : form.likes === 4 ? '⭐⭐⭐⭐ Good - Almost perfect!'
                                                                : '⭐⭐⭐⭐⭐ Excellent - Love it!'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={saveFeedback}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button - Modern */}
                <div className="fixed bottom-8 right-8 z-40">
                    <button
                        onClick={handleOpenModal}
                        className="group relative cursor-pointer"
                    >
                        {/* Outer ring animation */}
                        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-ping opacity-20"></div>

                        {/* Main button with octagon shape */}
                        <div
                            className="relative w-16 h-16 shadow-2xl hover:shadow-3xl 
               transition-all duration-300 transform hover:scale-110 
               flex items-center justify-center group-hover:rotate-12 
               rounded-full"
                        >
                            <div className="w-full h-full rounded-full bg-gradient-to-br 
                    from-blue-600 to-purple-700 flex items-center 
                    justify-center">
                                <FontAwesomeIcon icon={faHeart} className="text-2xl text-white" />
                            </div>
                        </div>


                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                                Share Feedback
                                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
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
                    <Loder status="" />
                    <p className={`mt-4 ${getTextClass()}`}>Loading dashboard data...</p>
                </div>
            </div>
        )
    }
}