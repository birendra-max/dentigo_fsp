import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { DesignerContext } from "../../Context/DesignerContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

export default function Login() {
    const navigate = useNavigate();
    const { setDesigner } = useContext(DesignerContext);

    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const d = localStorage.getItem("designer");
        const token = localStorage.getItem("token");
        if (d && token) navigate("/designer/home");
    }, [navigate]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${config.API_BASE_URL}/designer/validate-designer`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Tenant": "dentigo" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.status === "success" && data.designer?.desiid) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("designer", JSON.stringify(data.designer));
                localStorage.setItem("base_url", data.base_url);
                setDesigner(data.designer);
                navigate("/designer/home");
            } else {
                setStatus({ type: "error", message: data.message || "Invalid credentials" });
            }
        } catch {
            setStatus({ type: "error", message: "Network error. Try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#041421] p-4">
            <div className="
                w-full max-w-[1200px] 
                h-auto lg:h-[470px] 
                bg-[#042333] 
                rounded-xl 
                border border-cyan-400/40 
                shadow-[0_0_25px_rgba(0,255,255,0.4)] 
                overflow-hidden 
                flex flex-col lg:flex-row 
                relative">

                {/* LEFT PANEL — Designer Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center relative z-20 px-6 py-10">
                    <div className="w-full max-w-[400px] text-white">

                        <h2 className="text-3xl font-bold text-center mb-8">Designer Login</h2>

                        {status.message && (
                            <div className={`text-center text-sm mb-4 ${
                                status.type === "error" ? "text-red-400" : "text-green-400"
                            }`}>
                                {status.message}
                            </div>
                        )}

                        {/* USERNAME */}
                        <div className="mb-6">
                            <label className="text-sm mb-1 block">Username</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faUser} className="absolute left-2 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/40 py-2 pl-8 outline-none text-white"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-8">
                            <label className="text-sm mb-1 block">Password</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faLock} className="absolute left-2 top-3 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/40 py-2 pl-8 pr-10 outline-none text-white"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-2 text-gray-400 hover:text-white"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* REMEMBER + LOGIN BUTTON */}
                        <div className="flex justify-between items-center mb-6">
                            <label className="flex items-center text-xs text-gray-300">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={form.remember}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Remember me
                            </label>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="
                                    px-6 py-2 
                                    bg-gradient-to-b from-[#33deff] to-[#0aa3bf] 
                                    text-white rounded-full 
                                    shadow-lg 
                                    disabled:opacity-50"
                            >
                                {isSubmitting ? "Please wait..." : "Login"}
                            </button>
                        </div>

                        <p className="text-left text-sm text-gray-300">
                            Don’t have an account?
                            <span className="text-cyan-400 ml-1 cursor-pointer">Sign Up</span>
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL — Logo + Welcome */}
                <div className="
                    w-full lg:w-1/2 
                    bg-black 
                    relative 
                    flex items-center justify-center 
                    overflow-hidden 
                    py-10 px-4">

                    {/* Skew divider (desktop only) */}
                    <div className="
                        hidden lg:block 
                        absolute left-0 top-0 w-0 h-0 
                        border-t-[470px] border-t-[#042333]
                        border-r-[100px] border-r-transparent 
                        z-10">
                    </div>

                    {/* Right Content */}
                    <div className="relative z-20 text-center flex flex-col items-center">

                        <img 
                            src="/img/logo.png" 
                            alt="Logo" 
                            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[25vw] lg:h-[25vh] object-contain mb-4 drop-shadow-xl"
                        />

                        <h2 className="text-3xl text-white font-extrabold leading-tight tracking-wide">
                            WELCOME BACK!
                        </h2>

                        <p className="text-sm mt-4 opacity-90 text-white">
                            © 2024 Dentigo Pvt Ltd. All rights reserved.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
