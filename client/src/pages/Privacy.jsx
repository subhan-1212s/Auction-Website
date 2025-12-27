import React from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiLock, FiDatabase, FiSmartphone } from 'react-icons/fi';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-gray-100"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-sm">
                            <FiEye size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-luxury font-black text-gray-900 tracking-tighter">Privacy Policy</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Version 2.0 · Dec 2024</p>
                        </div>
                    </div>

                    <div className="space-y-12 text-gray-600 leading-loose">
                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiDatabase className="text-purple-500" /> 1. Information We Collect
                            </h2>
                            <p>
                                We collect personal information that you provide to us when registering for an account, such as your name, email address, physical address, and payment information. We also collect data about your interactions with the platform, including bidding history and asset preferences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiLock className="text-purple-500" /> 2. Data Security & Encryption
                            </h2>
                            <p>
                                Security is our top priority. All sensitive information, including financial data and authentication tokens, is encrypted using industry-standard protocols. We employ multi-layered security architectures to protect your data from unauthorized access, disclosure, or alteration.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiSmartphone className="text-purple-500" /> 3. Mobile Device Information
                            </h2>
                            <p>
                                To provide a seamless cross-device experience, we collect information about the mobile devices you use to access the platform. This includes device models, operating systems, and unique device identifiers to optimize performance and prevent fraudulent activity.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiEye className="text-purple-500" /> 4. Third-Party Sharing
                            </h2>
                            <p>
                                We do not sell your personal data to third parties. We may share limited information with trusted service providers, such as payment processors (Stripe) and logistics partners, solely for the purpose of fulfilling your transactions and providing support.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiEye className="text-purple-500" /> 5. Your Rights
                            </h2>
                            <p>
                                You have the right to access, correct, or delete your personal information at any time via your account settings. For enterprise-level data portability requests, please contact our specialized privacy support team.
                            </p>
                        </section>
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 italic text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Smart Auction Global is committed to global data privacy standards, <br /> including GDPR and CCPA compliance where applicable.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
