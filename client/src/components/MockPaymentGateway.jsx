import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiCheck, FiCreditCard, FiSmartphone, FiGlobe, FiX } from 'react-icons/fi';

const MockPaymentGateway = ({ isOpen, onClose, onSuccess, method, amount }) => {
    const [step, setStep] = useState('processing'); // processing, form, success
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('form');
        }
    }, [isOpen]);

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative"
                >
                    {step === 'form' && (
                        <>
                            {/* Header based on Method */}
                            <div className={`p-4 flex items-center justify-between text-white ${method === 'paytm' ? 'bg-[#002E6E]' :
                                method === 'card' ? 'bg-[#1A1F2C]' : 'bg-[#4B0082]'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {method === 'paytm' && <span className="font-bold text-lg tracking-wide">Paytm</span>}
                                    {method === 'card' && <span className="font-bold text-lg tracking-wide flex items-center gap-2"><FiCreditCard /> Secure Card</span>}
                                    {method === 'netbanking' && <span className="font-bold text-lg tracking-wide flex items-center gap-2"><FiGlobe /> Net Banking</span>}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] opacity-80 uppercase">Amount to Pay</p>
                                    <p className="font-bold text-lg">₹{amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* PAYTM UI */}
                                {method === 'paytm' && (
                                    <div className="text-center space-y-4">
                                        <p className="text-gray-500 text-sm">Scan QR code with your Paytm App without entering OTP</p>
                                        <div className="w-56 h-56 bg-white mx-auto rounded-2xl border border-gray-100 shadow-lg flex items-center justify-center relative overflow-hidden p-2">
                                            <img
                                                src="/upi_demo_qr.png"
                                                alt="Demo QR"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-2 text-left">
                                            <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Enter UPI ID</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="username@bank"
                                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:border-[#002E6E] outline-none transition-all pr-12"
                                                />
                                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#00B9F5] uppercase tracking-tighter">Verify</button>
                                            </div>
                                            <p className="text-[9px] text-gray-400 mt-2 italic">Example: user@paytm, name@okaxis</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                            <FiLock /> 100% Secure Transaction
                                        </div>
                                    </div>
                                )}

                                {/* CARD UI */}
                                {method === 'card' && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-gray-400">Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 border border-gray-200 rounded-md font-mono text-gray-700 focus:border-black outline-none transition-colors" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-gray-400">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full p-3 border border-gray-200 rounded-md font-mono text-gray-700 focus:border-black outline-none transition-colors" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase text-gray-400">CVV</label>
                                                <input type="password" placeholder="123" className="w-full p-3 border border-gray-200 rounded-md font-mono text-gray-700 focus:border-black outline-none transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* NET BANKING UI */}
                                {method === 'netbanking' && (
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Popular Banks</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'More'].map((bank) => (
                                                <div key={bank} className="p-3 border border-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all">
                                                    {bank}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handlePay}
                                    disabled={loading}
                                    className={`mt-8 w-full py-4 text-white font-black uppercase text-sm tracking-widest rounded-md shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' :
                                        method === 'paytm' ? 'bg-[#00B9F5] hover:bg-[#009ace]' :
                                            method === 'card' ? 'bg-black hover:bg-gray-800' : 'bg-[#4B0082] hover:bg-[#3a0063]'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>Pay ₹{amount.toLocaleString()}</>
                                    )}
                                </button>

                                <button onClick={onClose} className="mt-4 w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                                    Cancel Transaction
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="p-12 text-center bg-white">
                            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 animate-bounce">
                                <FiCheck size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Approved</h3>
                            <p className="text-gray-400 text-sm">Return to merchant...</p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MockPaymentGateway;
