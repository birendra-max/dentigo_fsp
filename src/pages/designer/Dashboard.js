import { useEffect, useState, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/designerapi';
import { ThemeContext } from "../../Context/ThemeContext";
import {
    faTasks,
    faPauseCircle,
    faCalendarDay,
    faCalendarCheck,
    faFileAlt,
    faHourglassHalf,
    faCheckCircle,
    faFlag,
    faClipboardList,
    faExclamationCircle,
    faCalendar,
    faSyncAlt,
    faChevronRight,
    faXmark,
    faLightbulb,
    faHeart,
    faStar
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const { theme } = useContext(ThemeContext);
    const [cases, setCases] = useState(null);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        async function fetchCardsData() {
            try {
                const data = await fetchWithAuth('/all-cases-data-count', {
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
                    href: "/designer/today_cases",
                    title: "Today's Cases",
                    subtitle: "Active for today",
                    count: cases.today_cases,
                    color: "from-amber-500 to-yellow-500",
                    icon: faCalendarCheck,
                    accent: "bg-amber-500",
                    priority: "high",
                    iconSize: "text-lg"
                },
                {
                    id: "home",
                    href: "/designer/home",
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
                    href: "/designer/in_progress",
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
                    href: "/designer/completed_case",
                    title: "Completed Cases",
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
                    href: "/designer/rush_cases",
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
                    href: "/designer/qc_required",
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
                    href: "/designer/case_on_hold",
                    title: "Case On Hold",
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
                    href: "/designer/canceled_case",
                    title: "Cancelled Cases",
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
                    href: "/designer/all_cases",
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
                    href: "/designer/yesterday_cases",
                    title: "Yesterday's Cases",
                    subtitle: "Previous day",
                    count: cases.yesterday_cases,
                    color: "from-cyan-500 to-sky-500",
                    icon: faCalendarDay,
                    accent: "bg-cyan-500",
                    priority: "low",
                    iconSize: "text-lg"
                },
                {
                    id: "weekly",
                    href: "/designer/weekly_case",
                    title: "Weekly Cases",
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
                    href: "/designer/redesign_cases",
                    title: "Redesign Cases",
                    subtitle: "Revision needed",
                    count: cases.redesign,
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
                                            {/* Solid white icon */}
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
            </section>
        )
    }
}