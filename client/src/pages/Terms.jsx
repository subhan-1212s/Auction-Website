import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiFileText, FiCheckCircle } from 'react-icons/fi';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-gray-100"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                            <FiShield size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-luxury font-black text-gray-900 tracking-tighter">Terms of Service</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Last Updated: Dec 2024</p>
                        </div>
                    </div>

                    <div className="space-y-12 text-gray-600 leading-loose">
                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiFileText className="text-blue-500" /> 1. Acceptance of Terms
                            </h2>
                            <p>
                                Welcome to Smart Auction Global. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use this platform. We reserve the right to modify these terms at any time, and your continued use of the service constitutes acceptance of such changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-blue-500" /> 2. Eligibility & Registration
                            </h2>
                            <p>
                                Membership is limited to individuals who are at least 18 years of age and can form legally binding contracts under applicable law. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-blue-500" /> 3. Bidding & Auctions
                            </h2>
                            <p>
                                Bids are legally binding obligations. By placing a bid, you represent that you have the financial capacity to complete the transaction. Smart Auction Global reserves the right to reject any bid or cancel any auction at its sole discretion if fraudulent activity is suspected.
                            </p>
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm font-medium text-blue-800 italic">
                                Note: A buyer's premium may apply to certain high-value assets as specified in the individual listing details.
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-blue-500" /> 4. Seller Obligations
                            </h2>
                            <p>
                                Sellers must accurately describe all assets and provide high-resolution images. Misrepresentation of any item is grounds for immediate account suspension and potential legal action. Sellers are responsible for ensuring clear title or ownership of all listed assets.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-blue-500" /> 5. Limitation of Liability
                            </h2>
                            <p>
                                To the maximum extent permitted by law, Smart Auction Global shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services.
                            </p>
                        </section>
                    </div>

                    <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-400 font-medium">Have questions about our terms?</p>
                        <button className="mt-4 px-8 py-3 bg-[#1A1A1A] text-white font-black rounded-full hover:bg-gray-800 transition-all text-xs uppercase tracking-widest">
                            Contact Specialist
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
