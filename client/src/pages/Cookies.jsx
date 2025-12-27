import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Cookies() {
    const [prefs, setPrefs] = useState({
        essential: true,
        analytics: true,
        marketing: false,
        personalization: true
    });

    const handleSave = () => {
        toast.success('Preferences saved successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-gray-100"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl shadow-sm">
                            <FiSettings size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-luxury font-black text-gray-900 tracking-tighter">Cookie Config</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage Your Digital Footprint</p>
                        </div>
                    </div>

                    <p className="text-gray-500 font-medium mb-12 leading-relaxed">
                        We use cookies to enhance your luxury bidding experience. Some are essential for the platform to function, while others help us provide a more personalized journey. Configure your preferences below.
                    </p>

                    <div className="space-y-6">
                        <CookieToggle
                            title="Essential Cookies"
                            desc="Required for logging in, secure transactions, and core platform stability."
                            enabled={prefs.essential}
                            locked={true}
                        />
                        <CookieToggle
                            title="Analytics & Performance"
                            desc="Help us understand how elite bidders use the platform so we can optimize the interface."
                            enabled={prefs.analytics}
                            onChange={(val) => setPrefs({ ...prefs, analytics: val })}
                        />
                        <CookieToggle
                            title="Personalization"
                            desc="Remember your favorite artists, brand preferences, and bidding history settings."
                            enabled={prefs.personalization}
                            onChange={(val) => setPrefs({ ...prefs, personalization: val })}
                        />
                        <CookieToggle
                            title="Marketing & Advertising"
                            desc="Allow us to notify you about exclusive private events and high-value asset drops."
                            enabled={prefs.marketing}
                            onChange={(val) => setPrefs({ ...prefs, marketing: val })}
                        />
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-4">
                        <FiInfo className="text-orange-500 mt-1 flex-shrink-0" />
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Your preferences are stored locally on your device. Clearing your browser cache may reset these settings to their defaults. For more information, please see our <a href="/privacy" className="text-orange-600 font-bold hover:underline">Privacy Policy</a>.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleSave}
                            className="px-12 py-5 bg-[#1A1A1A] text-white font-black rounded-full hover:bg-gray-800 transition-all text-xs uppercase tracking-widest shadow-xl shadow-gray-200"
                        >
                            Save Preferences
                        </button>
                        <button className="px-12 py-5 bg-white text-gray-500 font-bold rounded-full border border-gray-200 hover:bg-gray-50 transition-all text-xs uppercase tracking-widest">
                            Accept All
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function CookieToggle({ title, desc, enabled, onChange, locked }) {
    return (
        <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-orange-200 transition-all">
            <div className="max-w-[80%]">
                <h3 className="font-black text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{desc}</p>
            </div>
            <button
                disabled={locked}
                onClick={() => onChange(!enabled)}
                className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${enabled ? 'bg-orange-600' : 'bg-gray-200'} ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-all flex items-center justify-center ${enabled ? 'translate-x-6' : 'translate-x-0'}`}>
                    {enabled ? <FiCheck size={12} className="text-orange-600" /> : <FiX size={12} className="text-gray-400" />}
                </div>
            </button>
        </div>
    );
}
