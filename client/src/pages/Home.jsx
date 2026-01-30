import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowRight, FiCheckCircle, FiHeart, FiStar, FiRefreshCcw, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const DEALS = [
  { id: 1, title: 'Apple iPhone 15 Pro, 256GB - Titanium', price: '₹1,19,900', img: '/products/iphone_15pro.png' },
  { id: 2, title: 'Sony WH-1000XM5 Wireless Headphones', price: '₹26,990', img: '/products/sony_xm5.png' },
  { id: 3, title: 'Samsung Galaxy Watch 6 - 44mm', price: '₹29,999', img: '/products/samsung_watch6.png' },
  { id: 4, title: 'Nike Air Jordan 1 Retro High OG', price: '₹16,995', img: '/products/nike_jordan1.png' },
  { id: 5, title: 'Rolex Submariner Date - 41mm Oyster', price: '₹9,45,000', img: '/products/rolex_submariner.png' },
  { id: 6, title: 'Adidas Ultraboost Light Running Shoes', price: '₹18,999', img: '/products/adidas_ultraboost.png' },
];


const CATEGORIES = [
  { name: 'Watches', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400' },
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400' },
  { name: 'Fashion', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Motors', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400' },
  { name: 'Collectibles', img: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=400' },
  { name: 'Art', img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sports', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400' },
];

const BRANDS = [
  { name: 'Rolex', logo: '/brands/rolex.png' },
  { name: 'Apple', logo: 'https://cdn.simpleicons.org/apple' },
  { name: 'Nike', logo: 'https://cdn.simpleicons.org/nike' },
  { name: 'Sony', logo: 'https://cdn.simpleicons.org/sony/000000' },
  { name: 'Adidas', logo: 'https://cdn.simpleicons.org/adidas' },
  { name: 'Samsung', logo: 'https://cdn.simpleicons.org/samsung' }
];

// Mock featured auction data (fallback when API fails)
const MOCK_FEATURED = [
  { _id: '1', name: 'Rolex Submariner Date - 41mm Steel', currentBid: 945000, startingPrice: 850000, bidCount: 12, images: ['/products/rolex_submariner.png'] },
  { _id: '2', name: 'Apple MacBook Pro 16" M3 Max', currentBid: 289990, startingPrice: 250000, bidCount: 8, images: ['/products/macbook.jpg'] },
  { _id: '3', name: 'Nike Air Jordan 1 Retro High OG', currentBid: 16995, startingPrice: 12000, bidCount: 24, images: ['/products/nike_jordan1.png'] },
  { _id: '4', name: 'Sony WH-1000XM5 Wireless Headphones', currentBid: 26990, startingPrice: 22000, bidCount: 15, images: ['/products/sony_xm5.png'] },
  { _id: '5', name: 'Samsung Galaxy Watch 6', currentBid: 29999, startingPrice: 24000, bidCount: 9, images: ['/products/samsung_watch6.png'] }
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const [featured, setFeatured] = useState([]);
  const [endingSoon, setEndingSoon] = useState([]);
  const [motors, setMotors] = useState([]);
  const [watches, setWatches] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recently viewed from local storage
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(recent);

    const fetchHomeData = async () => {
      try {
        const [featuredRes, endingRes, motorsRes, watchesRes] = await Promise.all([
          axios.get('/api/products?isFeatured=true&limit=5'),
          axios.get('/api/products?sort=endTime&limit=10'),
          axios.get('/api/products?category=Motors&limit=4&sort=-createdAt'),
          axios.get('/api/products?category=Watches&limit=4&sort=-createdAt')
        ]);
        setFeatured(featuredRes.data.data);
        setEndingSoon(endingRes.data.data);
        setMotors(motorsRes.data.data);
        setWatches(watchesRes.data.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
        // Use mock data as fallback when API fails
        setFeatured(MOCK_FEATURED);
        setEndingSoon(MOCK_FEATURED);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <main className="bg-white snap-y snap-mandatory overflow-x-hidden pt-4 md:pt-0">

      {/* 1. HERO BANNER - Responsive full-page/stacked view */}
      <section className="snap-section flex flex-col justify-center bg-white border-b border-gray-100 px-4 py-8 md:py-0">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-[#f3f4f6] min-h-[500px] md:h-[80vh] flex flex-col md:flex-row items-center px-6 md:px-20 lg:px-32 transition-all duration-700 hover:shadow-2xl">
            <div className="relative z-10 max-w-2xl py-12 md:py-0 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-[#1A1A1A] text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-8 rounded-full"
              >
                Limited Edition
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-luxury italic font-black mb-6 md:mb-8 text-[#1A1A1A] leading-[1] md:leading-[0.9] tracking-tighter"
              >
                Summer <br /> <span className="not-italic text-[#D4AF37] drop-shadow-sm">Exclusives.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-500 mb-8 md:mb-12 font-medium leading-relaxed max-w-md mx-auto md:mx-0"
              >
                Acquire the extraordinary. Our curated collection of rare assets is now live for elite collectors.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center md:justify-start"
              >
                <Link to="/auctions" className="px-8 md:px-12 py-4 md:py-5 bg-[#1A1A1A] text-white font-black rounded-full hover:bg-[#333] transition-all duration-500 shadow-2xl inline-flex items-center justify-center gap-4 text-xs md:text-sm uppercase tracking-[0.2em] group hover-luxury-button">
                  Explore Now <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/auctions" className="px-8 md:px-12 py-4 md:py-5 border-2 border-[#1A1A1A] text-[#1A1A1A] font-black rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 inline-flex items-center justify-center text-xs md:text-sm uppercase tracking-[0.2em] hover-luxury-button">
                  View Catalog
                </Link>
              </motion.div>
            </div>

            {/* Product Image - Responsive handling */}
            <div className="w-full md:w-1/2 flex items-center justify-center pb-12 md:pb-0 relative overflow-hidden h-[300px] md:h-full">
              <div className="absolute w-[80%] md:w-[120%] h-[80%] md:h-[120%] bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse"></div>
              <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" className="relative w-[70%] sm:w-[60%] md:w-[90%] h-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.15)] -rotate-6 md:-rotate-12 transition-transform duration-[2s] hover:rotate-0 hover:scale-105" alt="Tech" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY VIEW - Responsive Grid */}
      <section className="snap-section flex flex-col justify-center bg-[#fdfdfd] py-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-4 text-center">
          <div className="mb-12 md:mb-20">
            <h2 className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] md:tracking-[0.5em] text-[#D4AF37] mb-3 md:mb-4">Elite Curation</h2>
            <h2 className="text-4xl md:text-7xl font-luxury font-black text-[#1A1A1A] tracking-tighter">Explore Categories</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto px-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                key={i}
              >
                <Link
                  to={`/auctions?cat=${cat.name}`}
                  className="flex flex-col items-center gap-4 md:gap-6 group cursor-pointer perspective-1000 transform hover-tilt"
                >
                  <div className="w-full aspect-square md:w-48 md:h-48 rounded-2xl md:rounded-3xl bg-white shadow-xl md:shadow-2xl border border-gray-100 flex items-center justify-center group-hover:border-[#D4AF37] overflow-hidden relative transform group-hover:scale-110 transition-all duration-700">
                    <img src={cat.img} className="w-full h-full object-cover brightness-100 group-hover:brightness-110 transition-all duration-700" alt={cat.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                      <span className="text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest">Discover</span>
                    </div>
                  </div>
                  <span className="font-luxury italic text-xl md:text-2xl text-gray-400 text-center leading-tight group-hover:text-[#D4AF37] group-hover:-translate-y-1 transition-all duration-500">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED AUCTIONS - Responsive Slider-like Grid */}
      <section className="snap-section flex flex-col justify-center bg-white py-20">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 border-b border-gray-50 pb-8 text-center md:text-left gap-6">
            <div>
              <h2 className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] md:tracking-[0.5em] text-[#D4AF37] mb-3 md:mb-4">Live Now</h2>
              <h2 className="text-3xl md:text-5xl font-luxury font-black text-[#1A1A1A] tracking-tighter">Featured Auctions</h2>
            </div>
            <Link to="/auctions" className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-full hover:bg-gray-800 transition-all uppercase text-[9px] md:text-[10px] tracking-widest">View All Assets</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-10">
            {featured.length > 0 ? featured.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                key={item._id}
              >
                <Link to={`/auctions/${item._id}`} className="bg-white p-3 rounded-2xl border border-gray-50 hover-luxury-card group flex flex-col h-full">
                  <div className="aspect-[4/5] mb-4 md:mb-6 relative overflow-hidden rounded-xl bg-gray-50">
                    <img src={item.images?.[0] || '/products/iphone.jpg'} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#1A1A1A]/80 backdrop-blur-md text-white px-2.5 py-1 text-[7px] font-black uppercase rounded-full tracking-tighter">Premium</span>
                    </div>
                  </div>
                  <h3 className="text-base md:text-lg font-luxury font-black text-gray-900 leading-[1.1] mb-3 group-hover:text-[#D4AF37] transition-colors line-clamp-2 h-10 md:h-12">{item.name}</h3>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="font-black text-lg md:text-2xl text-[#1A1A1A]">₹{(item.currentBid || item.startingPrice).toLocaleString()}</div>
                    <div className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.bidCount || 0} Bids</div>
                  </div>
                </Link>
              </motion.div>
            )) : (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-50 rounded-2xl animate-pulse"></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. BRAND OUTLET - Responsive Grid */}
      <section className="snap-section flex flex-col justify-center bg-[#fdfdfd] border-t border-gray-100 py-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 text-center">
          <div className="mb-12 md:mb-20">
            <h2 className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] text-[#D4AF37] mb-4">Official Partners</h2>
            <h2 className="text-4xl md:text-7xl font-luxury font-black text-[#1A1A1A] tracking-tighter">Luxury Outlet</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-12">
            {BRANDS.map((brand, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={i}
                className="aspect-[3/2] bg-white border border-gray-50 rounded-2xl md:rounded-3xl flex items-center justify-center p-6 md:p-12 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-[#D4AF37] transition-all duration-700 cursor-pointer group hover-tilt"
              >
                <Link to={`/auctions?search=${brand.name}`} className="w-full h-full flex items-center justify-center">
                  <img src={brand.logo} className="max-h-12 md:max-h-16 w-full object-contain transition-all duration-700 transform group-hover:scale-110" alt={brand.name} />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 md:mt-24">
            <Link to="/auctions" className="text-[#1A1A1A] font-black uppercase text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.3em] border-b-2 border-[#D4AF37] pb-2 hover:text-[#D4AF37] transition-all">Explore All Collections</Link>
          </div>
        </div>
      </section>

      {/* --- NORMAL SCROLLING AREA --- */}

      {/* 4.1 ENDING SOON - Responsive Grid */}
      <section className="py-20 px-6 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-luxury font-black text-gray-900 tracking-tighter">Ending Soon</h2>
          <Link to="/auctions?sort=endTime" className="text-[#D4AF37] font-bold hover:underline text-sm uppercase">See all auctions</Link>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {endingSoon.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              key={item._id}
            >
              <Link to={`/auctions/${item._id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group relative flex flex-col hover-luxury-card h-full">
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 group-hover:text-red-500 z-10 transition-colors"><FiHeart /></button>
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <img src={item.images?.[0] || '/products/iphone.jpg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#D4AF37] line-clamp-2 h-10">{item.name}</h3>
                  <div className="mt-auto">
                    <div className="font-black text-lg text-gray-900 mb-1">₹{(item.currentBid || item.startingPrice).toLocaleString()}</div>
                    <div className="text-[9px] text-red-600 font-black uppercase tracking-widest border-t border-red-50 pt-2 transition-all">
                      Ends {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4.2 SMART AUCTION MOTORS - Premium Dynamic Showcase */}
      <section className="py-20 px-6 max-w-[1440px] mx-auto border-t border-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 text-center md:text-left">
          <div className="w-full md:w-auto">
            <h2 className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] text-[#D4AF37] mb-3">The Garage</h2>
            <h2 className="text-3xl md:text-5xl font-luxury font-black text-gray-900 tracking-tighter">Smart Auction Motors</h2>
          </div>
          <Link to="/auctions?cat=Motors" className="px-8 py-3 border-2 border-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase text-[10px] tracking-widest">
            View Showroom
          </Link>
        </div>

        {motors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {motors.map((car, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                key={car._id}
                className="group relative h-[280px] md:h-[320px] lg:h-[360px] rounded-xl md:rounded-[1.5rem] overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <Link to={`/auctions/${car._id}`}>
                  <div className="absolute inset-0 bg-gray-900 transition-transform duration-700 group-hover:scale-105">
                    <img src={car.images?.[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80'} className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-700" alt={car.name} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <div className="flex justify-between items-end">
                      <div className="flex-1 min-w-0 pr-2 md:pr-4">
                        <div className="bg-[#D4AF37] text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1 md:mb-2">
                          Premium
                        </div>
                        <h3 className="text-sm md:text-base lg:text-lg font-luxury font-black text-white leading-tight mb-1 truncate">{car.name}</h3>
                        <div className="text-base md:text-lg lg:text-xl font-black text-white">₹{car.currentBid?.toLocaleString()}</div>
                      </div>
                      <div className="shrink-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                          <FiArrowRight size={12} className="md:size-[14px] -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-16 text-center">
            <h3 className="text-xl font-bold text-gray-400">Loading showroom...</h3>
          </div>
        )}
      </section>

      {/* 4.2.1 LUXURY TIMEPIECES - Exclusive Watch Collection */}
      <section className="py-20 px-6 max-w-[1440px] mx-auto border-t border-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 text-center md:text-left">
          <div className="w-full md:w-auto">
            <h2 className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] text-[#D4AF37] mb-3">Timeless Elegance</h2>
            <h2 className="text-3xl md:text-5xl font-luxury font-black text-gray-900 tracking-tighter">Luxury Watches</h2>
          </div>
          <Link to="/auctions?cat=Watches" className="px-8 py-3 border-2 border-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase text-[10px] tracking-widest">
            View Collection
          </Link>
        </div>

        {watches.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {watches.map((watch, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                key={watch._id}
                className="group relative h-[320px] md:h-[360px] lg:h-[380px] rounded-xl md:rounded-[1.5rem] overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <Link to={`/auctions/${watch._id}`}>
                  <div className="absolute inset-0 bg-gray-100 transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
                    <img src={watch.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={watch.name} />
                  </div>

                  <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-4 md:p-6 border-t border-gray-100 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-2 md:pr-4">
                        <div className="bg-blue-50 text-blue-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1 md:mb-2">
                          {watch.brand || 'Luxury'}
                        </div>
                        <h3 className="text-sm md:text-base font-luxury font-black text-gray-900 leading-tight mb-1 truncate">{watch.name}</h3>
                        <div className="text-base md:text-lg font-black text-[#1A1A1A]">₹{watch.currentBid?.toLocaleString()}</div>
                      </div>
                      <div className="shrink-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
                          <FiArrowRight size={12} className="md:size-[14px] -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-16 text-center">
            <h3 className="text-xl font-bold text-gray-400">Loading collection...</h3>
          </div>
        )}
      </section>

      {user && recentlyViewed.length > 0 && (
        <section className="py-20 px-6 max-w-[1440px] mx-auto border-t border-gray-50">
          <h2 className="text-3xl md:text-4xl font-luxury font-black text-gray-900 mb-12 tracking-tighter text-center md:text-left">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
            {recentlyViewed.map((item) => (
              <Link to={`/auctions/${item._id}`} key={item._id} className="group cursor-pointer flex flex-col">
                <div className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl mb-4 overflow-hidden items-center flex justify-center p-6 group-hover:shadow-lg transition-all">
                  <img src={item.image} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                </div>
                <div className="text-gray-900 font-bold text-[11px] md:text-xs hover:text-[#D4AF37] transition-colors line-clamp-2 h-8 leading-tight">{item.name}</div>
                <div className="font-black text-[#1A1A1A] mt-2 text-sm">₹{item.price?.toLocaleString()}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. TRUST BANNER - Optimized stack */}
      <section className="bg-white border-t border-b border-gray-200 py-12">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-[#1A1A1A] border border-gray-100 shadow-sm mb-4"><FiRefreshCcw size={24} /></div>
            <h3 className="font-bold text-gray-900 mb-2 truncate max-w-full">Money Back Guarantee</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed px-4 md:px-8">Shop with absolute confidence. We protect your premium acquisitions.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-[#1A1A1A] border border-gray-100 shadow-sm mb-4"><FiTruck size={24} /></div>
            <h3 className="font-bold text-gray-900 mb-2 truncate max-w-full">Secure Global Logistics</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed px-4 md:px-8">Expert handling for high-value assets. White-glove delivery available.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-[#1A1A1A] border border-gray-100 shadow-sm mb-4"><FiCheckCircle size={24} /></div>
            <h3 className="font-bold text-gray-900 mb-2 truncate max-w-full">Expert Authentication</h3>
            <p className="text-gray-500 text-[11px] leading-relaxed px-4 md:px-8">Multi-point verification by industry specialists for every luxury item.</p>
          </div>
        </div>
      </section>


    </main>
  )
}
