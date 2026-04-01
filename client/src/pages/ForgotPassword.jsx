import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      if (res.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Recovery Access</h2>
        <p className="text-gray-500 font-medium mb-8">
          {step === 1 ? 'Enter your email to receive a password reset OTP.' : `Enter the OTP sent to ${email} and set a new password.`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Enterprise Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? 'Sending...' : <>Send Recovery Code <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">One-Time Password</label>
              <div className="relative group">
                <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 transition-colors" />
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-blue-200 bg-blue-50/30 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-black text-gray-900 tracking-[0.5em] text-center outline-none"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">New Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-gray-500 font-bold hover:text-gray-900 transition-colors text-sm"
            >
              Change Email
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/login" className="text-gray-500 font-bold hover:text-gray-900 transition-colors">Return to Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
