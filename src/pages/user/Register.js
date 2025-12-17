import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import config from '../../config';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        labname: '',
        contact: '',
        occlusion: '',
        anatomy: '',
        pontic: '',
        remark: '',
        designation: ''
    });

    useEffect(() => {
        const savedFormData = localStorage.getItem('registerFormData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }

        const savedMessage = localStorage.getItem('registerMessage');
        if (savedMessage) {
            setMessage(JSON.parse(savedMessage));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('registerFormData', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        localStorage.setItem('registerMessage', JSON.stringify(message));
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const requiredFields = ['name', 'email', 'password', 'mobile', 'labname'];
            const missingFields = [];

            for (const field of requiredFields) {
                if (!formData[field]?.trim()) {
                    const fieldName = field === 'labname' ? 'Lab Name' :
                        field.charAt(0).toUpperCase() + field.slice(1);
                    missingFields.push(fieldName);
                }
            }

            if (missingFields.length > 0) {
                setMessage({
                    text: `Please fill in all required fields: ${missingFields.join(', ')}`,
                    type: "error"
                });
                setLoading(false);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setMessage({ text: "Please enter a valid email address", type: "error" });
                setLoading(false);
                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'X-Tenant': 'dentigo'
            };

            const dataToSend = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                mobile: formData.mobile.trim(),
                labname: formData.labname.trim(),
                designation: formData.designation.trim(),
                contact: formData.contact.trim() || '',
                occlusion: formData.occlusion.trim() || '',
                anatomy: formData.anatomy.trim() || '',
                pontic: formData.pontic.trim() || '',
                remark: formData.remark.trim() || ''
            };

            const response = await fetch(`${config.API_BASE_URL}/admin/add-client`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(dataToSend),
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Invalid JSON response from server');
            }

            if (data.status === "success") {
                setMessage({
                    text: data.message || "Client added successfully!",
                    type: "success"
                });

                localStorage.removeItem('registerFormData');

                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    mobile: '',
                    labname: '',
                    contact: '',
                    occlusion: '',
                    anatomy: '',
                    pontic: '',
                    remark: '',
                    designation: ''
                });

            } else if (data.status === "Error") {
                if (data.message === "User Already Exists") {
                    setMessage({
                        text: "This email is already registered.",
                        type: "error"
                    });
                } else if (data.message === "Required fields are missing") {
                    setMessage({
                        text: "Please fill in all required fields.",
                        type: "error"
                    });
                } else if (data.message === "Invalid Request") {
                    setMessage({
                        text: "Invalid request method.",
                        type: "error"
                    });
                } else {
                    setMessage({
                        text: data.message || "Error adding client.",
                        type: "error"
                    });
                }
            } else {
                setMessage({
                    text: data.message || "Unexpected response from server.",
                    type: "error"
                });
            }

        } catch (error) {
            setMessage({
                text: "Network error.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const clearMessage = () => {
        setMessage({ text: "", type: "" });
        localStorage.removeItem('registerMessage');
    };

    return (
        <div className="min-h-screen bg-[#041421] p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div className="flex items-center">
                            <img
                                src="/img/logo.png"
                                alt="Logo"
                                className="w-16 h-12 md:w-24 md:h-16 mr-4 object-cover"
                            />
                            <h2 className="text-white text-lg md:text-xl font-bold">Create New Account</h2>
                        </div>
                        <div className="text-gray-300 text-xs md:text-sm">Trial Case Registration</div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 md:p-5">
                        <div className="mb-6">
                            <h3 className="text-white text-lg font-semibold mb-2 border-l-4 border-blue-400 pl-2">
                                Required Information
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Fill in all required fields to register a new user.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-white text-sm mb-1">Full Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter full name"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Email <span className="text-red-400">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter email address"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Password <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                                            placeholder="Enter password"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                                            disabled={loading}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Phone Number <span className="text-red-400">*</span></label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter phone number"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Lab Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="labname"
                                        value={formData.labname}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter lab name"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Designation (optional)"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white text-lg font-semibold border-l-4 border-blue-400 pl-2">
                                    Default Design Parameters
                                </h3>
                                <span className="text-gray-400 text-xs">(Optional)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-white text-sm mb-1">Contact</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Contact value (optional)"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Occlusion</label>
                                    <input
                                        type="text"
                                        name="occlusion"
                                        value={formData.occlusion}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Occlusion value (optional)"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Anatomy</label>
                                    <input
                                        type="text"
                                        name="anatomy"
                                        value={formData.anatomy}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Anatomy (optional)"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm mb-1">Pontic</label>
                                    <input
                                        type="text"
                                        name="pontic"
                                        value={formData.pontic}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Pontic value (optional)"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-white text-sm mb-1">Remarks</label>
                                    <textarea
                                        name="remark"
                                        value={formData.remark}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Any remarks or notes (optional)"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                            {/* Message on left - only shows when there's a message */}
                            {message.text && (
                                <div className={`flex-1 w-full sm:w-auto p-3 rounded-lg ${message.type === "success"
                                    ? "bg-green-500/20 border border-green-500 text-green-300"
                                    : "bg-red-500/20 border border-red-500 text-red-300"
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start flex-1">
                                            <div className="flex-1">
                                                <p className="whitespace-pre-line text-sm">{message.text}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={clearMessage}
                                            className="ml-2 text-gray-400 hover:text-white text-sm flex-shrink-0"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Button always on right side - with or without message */}
                            <div className={`${message.text ? 'sm:ml-4' : 'sm:ml-auto'} flex-shrink-0`}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-5 py-2.5 text-white font-semibold rounded-lg shadow-lg text-sm ${loading
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full inline-block"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Client Account"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;