import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiShoppingBag, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentStatus = ({ type: propType }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null); // 'success' or 'failed'
    const [orderData, setOrderData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const type = propType || searchParams.get('type'); // Use prop or query param
    const orderId = searchParams.get('orderId');
    const msg = searchParams.get('msg');

    useEffect(() => {
        if (type === 'success') {
            setStatus('success');
            // In a real scenario, we might want to fetch order details here
            setLoading(false);
        } else {
            setStatus('failed');
            setErrorMsg(msg || 'Transaction was declined by the bank or cancelled by user.');
            setLoading(false);
        }
    }, [type, orderId, msg]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-gray-500 animate-pulse">Confirming Payment Status...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center p-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-sm shadow-xl overflow-hidden"
            >
                {status === 'success' ? (
                    <div className="text-center p-8 pt-12">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle size={48} />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Order Placed Successfully!</h1>
                        <p className="text-gray-500 text-sm font-medium mb-8">
                            Your payment was successful. We've sent a confirmation email to your registered address.
                        </p>

                        <div className="bg-gray-50 rounded-sm p-4 mb-8 text-left border border-gray-100">
                            <div className="flex justify-between text-[12px] font-bold mb-1">
                                <span className="text-gray-400 uppercase">Order ID</span>
                                <span className="text-gray-900">{orderId || 'SM-' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-[12px] font-bold">
                                <span className="text-gray-400 uppercase">Status</span>
                                <span className="text-green-600 uppercase">Confirmed</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/dashboard?tab=orders')}
                                className="w-full py-4 bg-[#2874F0] text-white font-black text-[13px] uppercase tracking-wide shadow-lg hover:bg-[#1e5ebf] transition-all rounded-sm flex items-center justify-center gap-2"
                            >
                                Track My Order <FiArrowRight />
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 bg-white text-gray-700 font-black text-[13px] uppercase tracking-wide border border-gray-200 hover:bg-gray-50 transition-all rounded-sm flex items-center justify-center gap-2"
                            >
                                Continue Shopping <FiShoppingBag />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8 pt-12">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiXCircle size={48} />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Payment Failed</h1>
                        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                            {errorMsg}
                        </p>

                        <div className="p-4 bg-red-50/50 border border-red-100 rounded-sm mb-8">
                            <p className="text-[11px] text-red-600 font-bold uppercase">Reason</p>
                            <p className="text-[13px] text-red-900 font-medium">{errorMsg}</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full py-4 bg-[#fb641b] text-white font-black text-[13px] uppercase tracking-wide shadow-lg hover:bg-[#e65a19] transition-all rounded-sm flex items-center justify-center gap-2"
                            >
                                Retry Payment <FiRefreshCw />
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 bg-white text-gray-700 font-black text-[13px] uppercase tracking-wide border border-gray-200 hover:bg-gray-50 transition-all rounded-sm flex items-center justify-center gap-2"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                        <FiCheckCircle className="text-blue-600" /> 100% Authentic
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                        <FiCheckCircle className="text-blue-600" /> Secure SSL
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentStatus;
