import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      <div className="hidden lg:flex w-1/3 bg-blue-600 p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black leading-tight mb-6">Join the Elite <br />Auction Circle.</h2>
          <div className="space-y-6">
            {[
              'Zero-latency bidding engine',
              'Secure cold-storage escrow',
              'Verified global sellers',
              'Real-time logistics tracking'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                <FiCheckCircle className="text-green-400" /> {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">© 2025 Smart Auction v2.0</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create Identity</h2>
            <p className="text-gray-500 font-medium mt-2">Initialize your global bidding profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Full Legal Name</label>
              <div className="relative group">
                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Enterprise Email</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Secret Key (Password)</label>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-100 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
              {isSubmitting ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiArrowRight /> Initialize Account</>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-bold text-sm">Already a member? <Link to="/login" className="text-blue-600 hover:underline">Verify Identity</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
