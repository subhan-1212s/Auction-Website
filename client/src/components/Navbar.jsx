import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiBell, FiHeart, FiChevronDown, FiMenu, FiX, FiUser, FiUserPlus, FiCheck } from 'react-icons/fi'
import { GiGavel } from 'react-icons/gi'
import AuthContext from '../context/AuthContext'
import { SOCKET_URL } from '../config'
import { io } from 'socket.io-client'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuctionLogo = () => (
  <GiGavel size={22} className="transform -rotate-12 group-hover:rotate-0 transition-transform duration-300 ease-out" />
)

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wonProducts, setWonProducts] = useState([])

  const notifRef = useRef(null)
  const cartRef = useRef(null)
  const shopRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false)
      }
      if (shopRef.current && !shopRef.current.contains(event.target)) {
        setCatOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (user) {
      console.log('DEBUG Navbar User:', user);
      fetchNotifications()
      fetchWonItems()

      const socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true
      });

      const userId = user.id || user._id;
      socket.emit('joinUser', userId)

      socket.on('notification', (notif) => {
        setNotifications(prev => [notif, ...prev])
        if (notif.type === 'auction_won' || notif.type === 'payment_success') {
          fetchWonItems();
        }
        toast.success(notif.message, {
          icon: '🔔',
          duration: 5000,
          position: 'bottom-right'
        })
      })

      socket.on('cart_update', () => {
        console.log('🛒 Cart update event received');
        fetchWonItems();
      });

      // Add event listener for local cart updates (e.g., from Checkout)
      window.addEventListener('cartUpdated', fetchWonItems);

      return () => {
        socket.disconnect()
        window.removeEventListener('cartUpdated', fetchWonItems);
      }
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications')
      setNotifications(res.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchWonItems = async () => {
    if (!user) return
    try {
      const res = await axios.get('/api/products/won')
      setWonProducts(res.data.data)
    } catch (error) {
      console.error('Error fetching won items:', error)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // --- LUXURY REFINED NAVBAR (Responsive Optimization) ---
  return (
    <header className="font-premium text-[11px] text-gray-700 bg-white border-b border-gray-200 sticky top-0 z-[2000] shadow-md transition-all duration-300">

      {/* 1. TOP UTILITY BAR - Short & Clean */}
      <div className="border-b border-gray-50 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center h-[40px] md:h-[34px]">

          {/* Branding - Top Left */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm transition-transform duration-300 group-hover:scale-110">
                <GiGavel size={16} />
              </div>
              <span className="font-luxury font-black text-[#1A1A1A] tracking-tighter text-[16px] md:text-[18px] flex items-baseline leading-none group-hover:text-[#D4AF37] transition-colors duration-500">
                Smart<span className="text-[#D4AF37] ml-0.5 font-black group-hover:text-[#1A1A1A] transition-colors duration-500">Auction</span>
              </span>
            </Link>
            <div className="h-2.5 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            <span className="text-gray-400 text-[8px] uppercase font-bold tracking-widest hidden lg:block">Elite Bidding Experience</span>
          </div>

          {/* Auth & Utility Links - Top Right */}
          <div className="flex items-center gap-3 md:gap-4 font-medium text-gray-600">
            <div className="hidden md:flex items-center gap-4 border-r border-gray-200 pr-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors text-[9px] uppercase font-bold">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="hover:text-[#D4AF37] transition-colors">Sign in</Link>
                  <Link to="/register" className="hover:text-[#D4AF37] transition-colors">Register</Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/auctions" className="nav-link-premium hidden sm:block">Deals</Link>
              <Link to={user?.role === 'user' ? '/dashboard' : '/create'} className="nav-link-premium font-bold text-gray-800 hidden xs:block">Sell</Link>

              {/* Compact Account Badge */}
              <div className="group relative flex items-center ">
                <div className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-gray-50 border border-gray-100 rounded-full cursor-pointer hover:border-[#D4AF37] transition-all duration-300 group-hover:bg-white group-hover:shadow-sm">
                  <div className="w-5 h-5 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#D4AF37] shadow-sm overflow-hidden transform group-hover:scale-110 transition-transform">
                    {user?.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-black uppercase leading-none pt-0.5">
                        {user ? (user.name || user.username || user.email || 'U').charAt(0).toUpperCase() : <FiUser size={12} />}
                      </span>
                    )}
                  </div>
                  <span className="uppercase text-[9px] font-bold text-gray-700 hidden sm:inline truncate max-w-[80px]">
                    {user ? (user.name || user.username || 'User').split(' ')[0] : 'Account'}
                  </span>
                  <FiChevronDown className="text-gray-400 group-hover:text-[#D4AF37] transition-transform duration-300 group-hover:rotate-180 hidden sm:block" size={12} />
                </div>

                {/* Dropdown Menu - Desktop */}
                <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 hidden md:block">
                  <Link to="/dashboard?tab=watchlist" className="block px-4 py-2 hover:bg-gray-50 text-[11px] text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div> Watchlist
                  </Link>
                  <Link to="/dashboard?tab=orders" className="block px-4 py-2 hover:bg-gray-50 text-[11px] text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]"></div> Orders
                  </Link>
                  <Link to="/dashboard?tab=notifs" className="block px-4 py-2 hover:bg-gray-50 text-[11px] text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Notifications
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-blue-50 text-[11px] text-blue-600 font-bold flex items-center gap-2 border-t border-blue-50 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-[11px] text-red-500 font-bold flex items-center gap-2">
                    Logout
                  </button>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-600 hover:text-[#D4AF37] transition-colors p-1 flex items-center gap-1 group">
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Search & Icons) - Responsive Layout */}
      <div className="max-w-[1440px] mx-auto px-4 py-2 md:py-1.5 flex flex-col md:grid md:grid-cols-[180px_1fr_180px] items-center gap-3 md:gap-4 bg-white">

        {/* Shop - Left Column (Hidden on Mobile) */}
        <div className="hidden md:flex justify-start">
          <div className="relative" ref={shopRef}>
            <div
              className="flex items-center gap-1.5 text-gray-700 text-[12px] font-bold uppercase cursor-pointer hover:text-[#D4AF37] select-none group"
              onClick={() => setCatOpen(!catOpen)}
            >
              <span>Shop</span>
              <FiChevronDown className={`transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} size={12} />
            </div>

            {/* Formal Mega-Menu Dropdown */}
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-[550px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 z-[3000] origin-top-left"
                >
                  <div className="grid grid-cols-3 gap-10">
                    {['Electronics', 'Fashion', 'Art'].map((m) => (
                      <div key={m}>
                        <h4 className="font-luxury font-black text-gray-900 mb-4 text-[10px] uppercase border-b border-gray-100 pb-2 tracking-widest">{m}</h4>
                        <ul className="space-y-2 text-[11px] text-gray-500 font-medium">
                          <li><Link to={`/auctions?cat=${m}&sort=currentBid`} onClick={() => setCatOpen(false)} className="hover:text-[#D4AF37] hover:pl-1 transition-all flex items-center gap-2">Daily Deals</Link></li>
                          <li><Link to={`/auctions?cat=${m}&sort=-createdAt`} onClick={() => setCatOpen(false)} className="hover:text-[#D4AF37] hover:pl-1 transition-all flex items-center gap-2">New Listings</Link></li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Curated by Smart Auction Experts</p>
                    <Link to="/auctions" onClick={() => setCatOpen(false)} className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest border-b border-[#1A1A1A] pb-0.5 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">View Full Catalog</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SEARCH BAR - Dynamic Center Column */}
        <div className="flex justify-center w-full md:max-w-none">
          <div className="w-full max-w-2xl transition-all duration-500 ease-in-out group">
            <div className="relative flex h-9 md:h-8 border border-gray-200 rounded-md overflow-hidden bg-gray-50/50 transition-all duration-500 focus-within:bg-white focus-within:border-[#1A1A1A] focus-within:shadow-[0_0_15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center px-3 pointer-events-none">
                <FiSearch size={14} className="text-gray-400 group-focus-within:text-[#D4AF37] group-focus-within:scale-125 transition-all duration-500" />
              </div>
              <input
                type="text"
                placeholder="Search premium auctions..."
                className="flex-1 px-1 py-0 text-[12px] border-none outline-none text-gray-800 placeholder-gray-400 font-medium bg-transparent"
              />
              <button className="relative px-4 md:px-6 bg-[#1A1A1A] text-white font-bold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-[#333] transition-all duration-500 hover-luxury-button">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Icons - Right Column (Re-ordered/Hidden on Mobile) */}
        <div className="flex justify-between md:justify-end items-center gap-4 w-full md:w-auto mt-1 md:mt-0 px-2 md:px-0 border-t border-gray-50 pt-2 md:border-none md:pt-0 pb-1 md:pb-0">
          <div className="flex items-center gap-4">
            <div ref={notifRef} className="relative group cursor-pointer p-1 hover:bg-gray-50 rounded-full transition-colors" onClick={() => setNotifOpen(!notifOpen)}>
              <FiBell size={19} className={`${notifications.some(n => !n.isRead) ? 'text-[#D4AF37]' : 'text-gray-600'} group-hover:text-[#D4AF37] transition-colors`} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 md:left-auto md:right-0 mt-3 w-[95vw] md:w-72 max-w-[340px] bg-white border border-gray-100 shadow-2xl rounded-2xl py-4 z-[3000]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-5 mb-3 flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="font-luxury font-black text-[10px] uppercase tracking-widest text-gray-900">Notifications</span>
                      <button onClick={fetchNotifications} className="text-[9px] font-bold text-blue-600 hover:text-blue-700">Refresh</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto px-2 space-y-1">
                      {notifications.length > 0 ? notifications.slice(0, 5).map(n => (
                        <div key={n._id} onClick={() => markAsRead(n._id)} className={`p-3 rounded-xl transition-all cursor-pointer ${n.isRead ? 'opacity-50' : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/30'}`}>
                          <p className="text-[11px] font-bold text-gray-900 leading-snug">{n.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[9px] text-gray-400 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            {n.type === 'auction_won' && !n.isRead && (
                              <Link to={`/checkout/${n.product}`} className="bg-green-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter hover:bg-green-700">Pay Now</Link>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="py-8 text-center text-gray-400 text-[11px]">No notifications yet.</div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="mt-2 pt-2 px-5 border-t border-gray-50 text-center">
                        <Link to="/dashboard?tab=notifs" onClick={() => setNotifOpen(false)} className="text-[10px] font-black uppercase text-gray-500 hover:text-gray-900 tracking-widest">View All</Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div ref={cartRef} className="relative group cursor-pointer p-1 hover:bg-gray-50 rounded-full transition-all duration-300 flex items-center gap-2" onClick={() => setCartOpen(!cartOpen)}>
              <div className="relative">
                <FiShoppingCart size={21} className={`${wonProducts.length > 0 ? 'text-green-600' : 'text-gray-700'} group-hover:text-[#D4AF37] transition-colors`} />
                {wonProducts.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                    {wonProducts.length}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {cartOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 md:left-auto md:right-0 mt-3 w-[95vw] md:w-64 max-w-[300px] bg-white border border-gray-100 shadow-2xl rounded-2xl py-4 z-[3000]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-5 mb-3 flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="font-luxury font-black text-[10px] uppercase tracking-widest text-gray-900">Your Cart (Won Items)</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto px-4 space-y-3">
                      {wonProducts.length > 0 ? wonProducts.map(item => (
                        <div key={item._id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-[11px] font-bold text-gray-900 leading-tight mb-1">{item.name}</p>
                          <p className="text-[10px] text-blue-600 font-black mb-2">Final Bid: ₹{item.currentBid.toLocaleString()}</p>
                          {item.status === 'sold' ? (
                            <Link
                              to={`/dashboard?tab=orders`}
                              onClick={() => setCartOpen(false)}
                              className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                              <FiCheck /> Paid - Track Order
                            </Link>
                          ) : (
                            <Link
                              to={`/checkout/${item._id}`}
                              onClick={() => setCartOpen(false)}
                              className="block w-full text-center bg-green-600 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition-all"
                            >
                              Checkout Now
                            </Link>
                          )}
                        </div>
                      )) : (
                        <div className="py-6 text-center text-gray-400 text-[10px] italic">Your cart is empty. Win an auction to see items here!</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/dashboard" className="p-1 hover:bg-gray-50 rounded-full md:hidden">
              <FiHeart size={16} className="text-gray-600" />
            </Link>
          </div>
          <Link to="/create" className="text-[10px] font-bold uppercase text-[#D4AF37] md:hidden border border-[#D4AF37] px-3 py-1 rounded-full">Sell Now</Link>
        </div>
      </div>

      {/* 3. CATEGORY TABS - Luxury Navigation Strip (Hidden on Mobile) */}
      <div className="max-w-[1440px] mx-auto px-4 hidden md:block border-t border-gray-50">
        <div className="flex items-center justify-center gap-6 lg:gap-10 text-[11px] font-bold text-gray-400 py-3 uppercase tracking-[0.1em] lg:tracking-[0.15em]">
          {['Home', 'Motors', 'Electronics', 'Collectibles', 'Fashion', 'Sports', 'Art', 'Deals'].map((cat, i) => (
            <Link
              to={cat === 'Home' ? '/' : `/auctions?cat=${cat}`}
              key={i}
              className={`nav-link-premium transition-all relative group whitespace-nowrap pt-1 pb-2 ${i === 0 ? 'text-[#1A1A1A]' : ''}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* MOBILE MENU OVERLAY - Premium Redesign */}
      <div className={`md:hidden fixed inset-0 top-[0] bg-black/50 z-[2001] transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)}>
        <div
          className={`absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl flex flex-col p-6 transition-transform duration-500 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
            <span className="font-luxury font-black text-[#1A1A1A] text-[18px]">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <FiX size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-col gap-6 text-[14px] font-black text-[#1A1A1A] uppercase tracking-widest flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {[
              { label: 'Home', path: '/' },
              { label: 'Live Auctions', path: '/auctions' },
              { label: 'Sell Item', path: '/create' },
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'My Watchlist', path: '/dashboard' },
              { label: 'Settings', path: '/dashboard' }
            ].map((item) => (
              <Link key={item.label} to={item.path} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors border-b border-gray-50 pb-2">{item.label}</Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-600 transition-colors border-b border-blue-50 pb-2 flex items-center gap-2 text-blue-600 font-bold"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600"></div> Admin Panel
              </Link>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] uppercase text-gray-400 tracking-widest font-black mb-4">Categories</p>
              <div className="grid grid-cols-1 gap-2">
                {['Motors', 'Fashion', 'Electronics', 'Sports', 'Art', 'Collectibles'].map(c => (
                  <Link key={c} to={`/auctions?cat=${c}`} onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-[#D4AF37] flex justify-between items-center bg-gray-50/50 p-2 rounded-lg">
                    <span>{c}</span>
                    <FiChevronDown className="-rotate-90 text-gray-300" size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                  <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#D4AF37] font-black">{(user.name || user.username || 'U').charAt(0).toUpperCase()}</div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-gray-900">{user.name || user.username}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{user.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-colors">Sign Out</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 border-2 border-gray-900 text-gray-900 text-center rounded-xl font-black uppercase text-[10px] tracking-widest">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 bg-[#D4AF37] text-white text-center rounded-xl font-black uppercase text-[10px] tracking-widest">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  )
}
