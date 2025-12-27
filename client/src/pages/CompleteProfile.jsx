import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMapPin, FiTruck, FiShield, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CompleteProfile() {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (user && !user.needsProfileUpdate) {
            navigate('/dashboard');
        }
        if (user?.address) {
            setFormData({
                phone: user.phone || '',
                street: user.address.street || '',
                city: user.address.city || '',
                state: user.address.state || '',
                zipCode: user.address.zipCode || '',
                country: user.address.country || 'India'
            });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.phone || !formData.street || !formData.city) {
            return toast.error('Please fill in all required fields');
        }

        setLoading(true);
        try {
            await updateProfile({
                phone: formData.phone,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                }
            });
            toast.success('Profile completed! You can now start bidding.');
            navigate('/dashboard');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr]">
                    {/* Left: Branding & Info */}
                    <div className="bg-[#1A1A1A] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <FiShield className="text-[#D4AF37] mb-6" size={40} />
                            <h2 className="text-3xl font-black tracking-tight mb-4">Secure Your<br />Account</h2>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                To protect our community and ensure successful delivery, we require a verified phone number and shipping address.
                            </p>
                        </div>

                        <div className="mt-10 space-y-4 relative z-10">
                            <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-[#D4AF37]">
                                <FiTruck /> Trusted Delivery
                            </div>
                            <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                <FiShield /> Anti-Fraud System
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Right: Form */}
                    <div className="p-10">
                        <h3 className="text-xl font-black text-gray-900 mb-8">Complete Your Profile</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <FiPhone size={12} className="text-blue-500" /> Phone Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <FiMapPin size={12} className="text-red-500" /> Street Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Street name, landmark..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    value={formData.street}
                                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mumbai"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">State</label>
                                    <input
                                        type="text"
                                        placeholder="Maharashtra"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none"
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Zip Code</label>
                                <input
                                    type="text"
                                    placeholder="400001"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none"
                                    value={formData.zipCode}
                                    onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#1A1A1A] text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all duration-500 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? 'Securing...' : <>Save & Continue <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
