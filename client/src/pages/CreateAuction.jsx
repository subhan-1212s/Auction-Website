import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiDollarSign, FiClock, FiTag, FiType, FiPlus, FiX, FiInfo, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addMinutes, addHours, addDays } from 'date-fns';

export default function CreateAuction() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    subCategory: '',
    condition: 'new',
    startingBid: '',
    durationValue: '24',
    durationUnit: 'hours',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      return toast.error('Maximum 5 images allowed');
    }

    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('Please upload at least one image');

    setLoading(true);
    const data = new FormData();

    // Calculate expiry date
    let expiryDate;
    const value = parseInt(formData.durationValue);
    if (formData.durationUnit === 'minutes') expiryDate = addMinutes(new Date(), value);
    else if (formData.durationUnit === 'days') expiryDate = addDays(new Date(), value);
    else expiryDate = addHours(new Date(), value);

    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('expiryDate', expiryDate.toISOString());

    images.forEach(img => {
      data.append('images', img);
    });

    try {
      await axios.post('/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Auction listing live!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Create Listing</h1>
            <p className="text-gray-500 font-medium mt-1">Setup your auction parameters and reach thousands of buyers.</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors"><FiX size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FiType className="text-[#D4AF37]" /> Item Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Product Title</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. iPhone 15 Pro Max - 256GB - Titanium"
                    className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4AF37] transition-all font-bold text-sm md:text-base text-gray-900 outline-none"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Detailed Description</label>
                  <textarea
                    name="description"
                    required
                    rows="6"
                    placeholder="Include condition, specs, original packaging info..."
                    className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D4AF37] transition-all font-medium text-sm text-gray-900 outline-none resize-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FiUploadCloud className="text-[#D4AF37]" /> Media & Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <AnimatePresence>
                  {previews.map((src, i) => (
                    <motion.div key={src} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative group aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-gray-100">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><FiX size={14} /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {images.length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl md:rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:bg-orange-50/10 transition-all gap-2">
                    <FiPlus size={24} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Add Photo</span>
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" className="hidden" />
              <p className="text-[10px] text-gray-400 mt-4 font-bold flex items-center gap-1"><FiInfo /> Professional photos with white backgrounds perform 40% better.</p>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FiDollarSign className="text-green-600" /> Pricing & Format</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Starting Bid (₹)</label>
                  <input
                    type="number"
                    name="startingBid"
                    required
                    placeholder="0"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-green-500 transition-all font-black text-2xl text-gray-900 outline-none"
                    value={formData.startingBid}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Auction Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="durationValue"
                      required
                      min="1"
                      className="w-1/2 px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-900 outline-none"
                      value={formData.durationValue}
                      onChange={handleChange}
                    />
                    <select
                      name="durationUnit"
                      className="w-1/2 px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-900 outline-none appearance-none cursor-pointer"
                      value={formData.durationUnit}
                      onChange={handleChange}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2 font-medium">Set any time limit. Minimum 1 minute.</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><FiTag className="text-purple-600" /> Classification</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Category</label>
                  <select name="category" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold outline-none cursor-pointer" value={formData.category} onChange={handleChange}>
                    {['Electronics', 'Fashion', 'Art', 'Collectibles', 'Motors', 'Home & Garden'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['new', 'used', 'refurbished'].map(cond => (
                      <button key={cond} type="button" onClick={() => setFormData({ ...formData, condition: cond })} className={`py-2.5 rounded-xl font-bold text-xs capitalize border transition-all ${formData.condition === cond ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'}`}>
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <><FiCheckCircle size={20} /> Publish Auction</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
