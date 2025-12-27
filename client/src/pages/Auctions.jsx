import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiTag, FiLayout, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Motors', 'Collectibles', 'Art', 'Sports'];

export default function Auctions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const currentCategory = searchParams.get('cat') || 'All';
  const currentSearch = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || '-createdAt';
  const currentSeller = searchParams.get('seller');

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        let url = `/api/products?sort=${currentSort}`;

        if (currentCategory === 'Deals') {
          // For Deals, show cheapest items first effectively acting as "All" sorted
          if (currentSort === '-createdAt') url = `/api/products?sort=currentBid`;
        } else if (currentCategory !== 'All') {
          url += `&category=${currentCategory}`;
        }

        if (currentSearch) url += `&search=${currentSearch}`;
        if (currentSeller) url += `&seller=${currentSeller}`;

        const res = await axios.get(url);
        setAuctions(res.data.data);
      } catch (err) {
        console.error('Error fetching auctions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, [currentCategory, currentSearch, currentSort, currentSeller]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('cat');
    else newParams.set('cat', cat);
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4 py-8">

        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Auctions</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {currentSearch ? `Search Results for "${currentSearch}"` : currentSeller ? 'Seller Store' : currentCategory === 'All' ? 'Live Auctions' : currentCategory}
              </h1>
              <p className="text-gray-500 mt-2 font-medium">{auctions.length} items found</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-400'}`}><FiGrid /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400'}`}><FiList /></button>
              </div>
              <div className="relative group">
                <select
                  value={currentSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="currentBid">Price: Low to High</option>
                  <option value="-currentBid">Price: High to Low</option>
                  <option value="endTime">Ending Soonest</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">

          {/* Sidebar / Top Filters - Responsive Design */}
          <aside className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white p-4 lg:p-0 rounded-xl lg:bg-transparent border border-gray-100 lg:border-none shadow-sm lg:shadow-none">
              <h3 className="text-[10px] md:text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <FiLayout className="text-[#D4AF37]" /> Categories
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`whitespace-nowrap flex-shrink-0 text-left px-4 py-2 lg:px-3 lg:py-2 rounded-full lg:rounded-md transition-all text-[11px] font-bold uppercase tracking-wider ${currentCategory === cat ? 'bg-[#1A1A1A] text-white shadow-lg' : 'bg-gray-50 lg:bg-white text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block p-6 bg-[#1A1A1A] rounded-2xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="font-luxury italic text-xl mb-3 relative z-10">Sell Smarter.</h4>
              <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-widest leading-loose relative z-10">List your premium items and reach elite collectors instantly.</p>
              <Link to="/create" className="block w-full text-center bg-[#D4AF37] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#1A1A1A] transition-all relative z-10">Start Selling</Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-10">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}
              >
                <AnimatePresence>
                  {auctions.map((item, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      key={item._id}
                      className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover-luxury-card group relative ${viewMode === 'list' ? 'flex' : ''}`}
                    >
                      {/* Image Area */}
                      <div className={`relative overflow-hidden bg-gray-50 ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                        <img
                          src={item.images[0] || 'https://via.placeholder.com/400'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <span className="bg-white/90 backdrop-blur-sm shadow-sm text-gray-900 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-tight flex items-center gap-1 border border-gray-100">
                            <FiTag className="text-blue-600" /> {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-700 group-hover:underline line-clamp-2 min-h-[40px]">
                          {item.name}
                        </h3>

                        <div className="mt-auto pt-4 space-y-3">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1">Current Bid</p>
                              <p className="text-xl font-black text-gray-900">₹{(item.currentBid || item.startingPrice).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ending In</p>
                              <p className={`text-xs font-bold ${new Date(item.endTime) - new Date() < 3600000 ? 'text-red-600' : 'text-gray-600'}`}>
                                {formatTimeLeft(item.endTime)}
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/auctions/${item._id}`}
                            className="block w-full py-2.5 text-center bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-[#333] transition-all shadow-sm hover-luxury-button"
                          >
                            Bid Now
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && auctions.length === 0 && (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="text-5xl mb-4">🔦</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No matching auctions</h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm">We couldn't find any live auctions matching your current filters. Try broadening your search.</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function formatTimeLeft(endTime) {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return 'Ended';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `${Math.floor(h / 24)}d left`;
  return `${h}h ${m}m left`;
}
