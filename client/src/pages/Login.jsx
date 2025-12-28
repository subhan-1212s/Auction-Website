import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (step === 1) {
        // Step 1: Login with Credentials
        const res = await login(email, password);
        if (res?.requireOtp) {
          setStep(2);
          toast.success(`OTP sent to ${res.email}`);
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      } else {
        // Step 2: Verify OTP
        await verifyOtp(email, otp);
        toast.success('Login verified successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: Branding & Visuals */}
      <div className="hidden lg:flex w-[45%] bg-gray-900 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e40af_0%,transparent_50%)] opacity-40"></div>
        <div className="relative z-10 w-full max-w-lg">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="w-16 h-16 bg-blue-600 rounded-3xl mb-8 flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <FiLock className="text-white text-2xl" />
            </div>
            <h1 className="text-6xl font-black text-white leading-tight tracking-tighter mb-6">Unleash the <br /><span className="text-blue-500">Value Within.</span></h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12">Join India's most trusted auction network. Buy or sell anything with the power of real-time bidding.</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-white mb-1">1.2M+</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Bidders</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-white mb-1">₹45Cr+</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Trade Volume</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{step === 1 ? 'Sign In' : 'Security Check'}</h2>
            <p className="text-gray-500 font-medium mt-2">{step === 1 ? 'Access your personalized auction portal.' : `Enter the 6-digit OTP sent to ${email}`}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 ? (
              // STEP 1: Email & Password
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Enterprise Email</label>
                  <div className="relative group">
                    <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Secure Password</label>
                  <div className="relative group">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-100 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-gray-900 outline-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
              </div>
            ) : (
              // STEP 2: OTP Entry
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">One-Time Password</label>
                  <div className="relative group">
                    <FiCheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 transition-colors" />
                    <input
                      type="text"
                      required
                      maxLength="6"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-blue-500 bg-blue-50/10 focus:ring-4 focus:ring-blue-500/5 transition-all font-black text-gray-900 text-2xl tracking-[0.5em] outline-none text-center"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-sm font-bold text-gray-600">Secure session</span>
                </label>
                <Link to="/forgot" className="text-sm font-black text-blue-600 hover:text-blue-700">Recovery Access?</Link>
              </div>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {step === 1 ? <><FiArrowRight /> Verify Credentials</> : <><FiCheckCircle /> Confirm Identity</>}
                </>
              )}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors text-sm"
              >
                Cancel & Return
              </button>
            )}
          </form>

          {step === 1 && (
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 font-bold text-sm">New to the network? <Link to="/register" className="text-blue-600 hover:underline">Provision account</Link></p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
