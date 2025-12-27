import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { SOCKET_URL } from '../config';
import { FiPackage, FiHeart, FiTrendingUp, FiSettings, FiBell, FiLogOut, FiArrowRight, FiCheckCircle, FiClock, FiMapPin, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const { user, logout, updateProfile, requestSellerRole } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [requesting, setRequesting] = useState(false);
  const [stats, setStats] = useState({ activeBids: 0, wonAuctions: 0, totalSpent: 0, activeListings: 0, totalEarnings: 0, salesCount: 0 });
  const [orders, setOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();

      const socket = io(SOCKET_URL);
      socket.emit('joinUser', user.id || user._id);

      socket.on('cart_update', () => {
        fetchDashboardData();
      });

      socket.on('sales_update', () => {
        fetchDashboardData();
        toast.success('New sale recorded!');
      });

      socket.on('notification', () => {
        fetchDashboardData();
      });

      return () => socket.disconnect();
    }
  }, [user]);

  const MiniOrderStatusTracker = ({ status }) => {
    const steps = ['paid', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);

    return (
      <div className="flex items-center gap-1 mt-3">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${i <= currentIndex ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-200'}`} />
              <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-[2px] mb-3 ${i < currentIndex ? 'bg-green-500' : 'bg-gray-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bidsRes, ordersRes, notifRes] = await Promise.all([
        axios.get('/api/analytics/user-stats'),
        axios.get('/api/bids/my-bids'),
        axios.get('/api/orders/my-orders'),
        axios.get('/api/notifications')
      ]);
      setStats(statsRes.data.data);
      setBids(bidsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setNotifications(notifRes.data || []);

      if (user.role === 'seller' || user.role === 'admin') {
        const [listingsRes, soldRes] = await Promise.all([
          axios.get('/api/products/me'),
          axios.get('/api/orders/sold-items')
        ]);
        setMyListings(listingsRes.data.data || []);
        setSoldOrders(soldRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">You're not signed in</h2>
        <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Sign In to Continue</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group cursor-pointer">
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-sm" alt="User" />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FiSettings className="text-white text-xl" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hi, {user.name.split(' ')[0]}!</h1>
              <p className="text-gray-500 font-medium">@{user.username || user.email.split('@')[0]} · {user.role.toUpperCase()}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  <FiMapPin className="text-blue-500" /> {user.address?.city || 'Address Not Set'}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                  <FiCheckCircle className="text-green-500" /> Verified Member
                </div>
              </div>
            </div>
            <div className={`md:ml-auto grid gap-4 md:gap-8 text-center border-l-0 md:border-l border-gray-100 md:pl-8 ${user.role === 'seller' || user.role === 'admin' ? 'grid-cols-3 md:grid-cols-6' : 'grid-cols-2 md:grid-cols-4'}`}>
              <div onClick={() => setActiveTab('bids')} className="cursor-pointer group hover:scale-105 transition-transform"><p className="text-xl font-black text-gray-900 group-hover:text-blue-600">{stats.activeBids}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Active Bids</p></div>
              <div onClick={() => setActiveTab('orders')} className="cursor-pointer group hover:scale-105 transition-transform"><p className="text-xl font-black text-gray-900 group-hover:text-blue-600">{stats.wonAuctions}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Won</p></div>
              <div onClick={() => setActiveTab('orders')} className="cursor-pointer group hover:scale-105 transition-transform"><p className="text-xl font-black text-gray-900 group-hover:text-blue-600">{stats.totalSpent > 0 ? `₹${stats.totalSpent.toLocaleString()}` : '₹0'}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Spent</p></div>

              {(user.role === 'seller' || user.role === 'admin') && (
                <>
                  <div onClick={() => setActiveTab('sales')} className="cursor-pointer group hover:scale-105 transition-transform"><p className="text-xl font-black text-green-600 group-hover:text-green-700">₹{stats.totalEarnings.toLocaleString()}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Earnings</p></div>
                  <div onClick={() => setActiveTab('sales')} className="cursor-pointer group hover:scale-105 transition-transform"><p className="text-xl font-black text-gray-900 group-hover:text-blue-600">{stats.salesCount}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sales</p></div>
                </>
              )}

              <div onClick={() => setActiveTab('selling')} className="cursor-pointer group hover:scale-105 transition-transform"><p className="text-xl font-black text-gray-900 group-hover:text-blue-600">{stats.activeListings}</p><p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Selling</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar - Responsive Strip */}
        <nav className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide no-scrollbar border-b border-gray-100 lg:border-none">
          {[
            { id: 'watchlist', label: 'Watchlist', icon: FiHeart },
            { id: 'bids', label: 'Active Bids', icon: FiTrendingUp },
            { id: 'orders', label: 'My Purchases', icon: FiPackage },
            ...(user.role === 'seller' || user.role === 'admin' ? [{ id: 'selling', label: 'My Listings', icon: FiTrendingUp }, { id: 'sales', label: 'My Sales', icon: FiPackage }] : []),
            { id: 'notifs', label: 'Notifications', icon: FiBell },
            { id: 'settings', label: 'Settings', icon: FiSettings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-6 py-3 lg:px-4 lg:py-3 rounded-full lg:rounded-xl font-black text-[11px] uppercase tracking-wider transition-all shadow-sm ${activeTab === item.id ? 'bg-[#1A1A1A] text-white shadow-xl scale-105 lg:scale-100' : 'bg-white lg:bg-transparent text-gray-500 hover:text-[#1A1A1A] hover:bg-white border border-gray-100 lg:border-none'}`}
            >
              <item.icon size={16} /> {item.label}
            </button>
          ))}
          <div className="hidden lg:block pt-4 border-t border-gray-200 mt-4">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all">
              <FiLogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1">
          {user.role === 'user' && (
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black mb-2">Ready to sell your premium assets?</h3>
                <p className="text-blue-100 font-medium text-sm md:text-base opacity-90">Join our elite seller community and reach thousands of collectors worldwide.</p>
              </div>
              <button
                disabled={requesting}
                onClick={async () => {
                  setRequesting(true);
                  try {
                    await requestSellerRole();
                    toast.success('Seller account activated! Redirecting...');
                    setTimeout(() => {
                      setActiveTab('selling');
                      navigate('/create');
                    }, 1500);
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to activate seller account');
                  } finally {
                    setRequesting(false);
                  }
                }}
                className="bg-white text-blue-700 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-lg whitespace-nowrap disabled:opacity-50 active:scale-95"
              >
                {requesting ? 'Activating...' : 'Start Selling Now'}
              </button>
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiHeart className="text-red-500 fill-red-500" /> My Watchlist
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {user.watchlist && user.watchlist.length > 0 ? user.watchlist.map(item => (
                  <Link to={`/auctions/${item._id}`} key={item._id} className="group flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all shadow-sm">
                    <img src={item.images[0]} className="w-20 h-20 object-cover rounded-lg" alt={item.name} />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600">{item.name}</h4>
                      <p className="text-lg font-black text-gray-900 mt-1">₹{item.currentBid.toLocaleString()}</p>
                      <p className="text-[10px] text-red-600 font-bold uppercase mt-1 flex items-center gap-1">
                        <FiClock /> {item.status === 'active' ? 'Ends Soon' : 'ENDED'}
                      </p>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    No items in watchlist. Start exploring!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bids' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-600" /> Active Bids
                </h2>
                <Link to="/auctions" className="text-sm font-bold text-blue-600 hover:underline">Find More Auctions</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4 text-center">Your Bid</th>
                      <th className="px-6 py-4 text-center">Current</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bids.map(bid => (
                      <tr key={bid._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/auctions/${bid.product._id}`} className="flex items-center gap-4">
                            <img src={bid.product.images[0]} className="w-10 h-10 rounded border" alt="" />
                            <span className="font-bold text-sm text-gray-900 hover:text-blue-600">{bid.product.name}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-sm">₹{bid.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center font-bold text-sm text-blue-600">₹{bid.product.currentBid.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${bid.amount >= bid.product.currentBid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {bid.amount >= bid.product.currentBid ? 'Winning' : 'Outbid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiPackage className="text-purple-600" /> My Purchases
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.length > 0 ? orders.map(order => (
                  <div key={order._id} className="p-5 border border-gray-100 rounded-3xl hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative">
                    <div className="flex gap-5 relative z-10">
                      <img src={order.product?.images[0]} className="w-20 h-20 object-cover rounded-2xl border border-gray-100" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{order.product?.name}</h4>
                        <p className="text-xl font-black text-gray-900 leading-none">₹{order.amount.toLocaleString()}</p>
                        <MiniOrderStatusTracker status={order.status} />
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-dashed border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={order.seller?.avatar || `https://ui-avatars.com/api/?name=${order.seller?.name}`} className="w-8 h-8 rounded-full border border-gray-100" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller</p>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-gray-900 leading-tight">{order.seller?.name}</span>
                            <span className="text-[9px] text-gray-500 font-medium">{order.seller?.phone || order.seller?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`mailto:${order.seller?.email}`} className="p-2.5 bg-gray-50 text-gray-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Email Seller">
                          <FiBell size={14} />
                        </a>
                        <Link to={`/invoice/${order.product?._id}`} className="p-2.5 bg-[#1A1A1A] text-white rounded-xl hover:bg-blue-600 transition-all">
                          <FiArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center text-gray-400 italic">You haven't purchased anything yet. Happy bidding!</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiPackage className="text-green-600" /> My Sales (Orders Received)
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {soldOrders.length > 0 ? soldOrders.map(order => (
                  <div key={order._id} className="p-6 border border-gray-100 rounded-[2rem] hover:border-green-100 hover:shadow-2xl hover:shadow-green-500/5 transition-all bg-gray-50/30">
                    <div className="flex gap-6 mb-6">
                      <img src={order.product?.images[0]} className="w-24 h-24 object-cover rounded-2xl border border-gray-100" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                            <h4 className="font-extrabold text-gray-900 leading-tight">{order.product?.name}</h4>
                            <p className="text-2xl font-black text-green-600">₹{order.amount.toLocaleString()}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.status}
                          </div>
                        </div>
                        <MiniOrderStatusTracker status={order.status} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-dashed border-gray-100">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Buyer Details</p>
                        <div className="flex items-center gap-2 mb-1">
                          <img src={order.buyer?.avatar || `https://ui-avatars.com/api/?name=${order.buyer?.name}`} className="w-6 h-6 rounded-full" />
                          <span className="font-bold text-xs text-gray-900">{order.buyer?.name}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">{order.buyer?.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shipping To</p>
                        <p className="text-[11px] text-gray-900 font-bold leading-relaxed">
                          {order.buyer?.address?.street}, {order.buyer?.address?.city}<br />
                          {order.buyer?.address?.state} - {order.buyer?.address?.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <p className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Update Status</p>
                      {['paid', 'shipped', 'delivered'].map(status => (
                        <button
                          key={status}
                          disabled={order.status === status}
                          onClick={async () => {
                            try {
                              await axios.put(`/api/orders/${order._id}/status`, { status });
                              toast.success(`Order marked as ${status}`);
                              fetchDashboardData();
                            } catch (err) {
                              toast.error('Failed to update status');
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === status ? 'bg-green-500 text-white cursor-default' : 'bg-white border border-gray-100 text-gray-500 hover:border-blue-500 hover:text-blue-600'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center text-gray-400 italic">No items sold yet. Keep listing!</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'selling' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FiPackage className="text-blue-600" /> My Auction Listings
                </h2>
                <Link
                  to="/create"
                  className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
                >
                  Create New Auction
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {myListings.length > 0 ? myListings.map(item => (
                  <div key={item._id} className="group border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all bg-white flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ${item.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'
                          }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="font-extrabold text-gray-900 text-sm mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h4>

                      <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-2xl">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Current Bid</p>
                          <p className="font-black text-blue-600">₹{item.currentBid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Bids</p>
                          <p className="font-black text-gray-900">{item.bidCount}</p>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ending</p>
                          <p className="text-[11px] font-bold text-gray-700">
                            {new Date(item.endTime) > new Date() ? new Date(item.endTime).toLocaleDateString() : 'Ended'}
                          </p>
                        </div>
                        <Link
                          to={`/auctions/${item._id}`}
                          className="p-3 bg-gray-100 text-gray-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <FiArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiPackage size={32} className="text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold mb-6 italic">You haven't listed any auctions yet.</p>
                    <Link to="/create" className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Start Listing Now →</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifs' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiBell className="text-[#D4AF37]" /> All Notifications
              </h2>
              <div className="space-y-4">
                {notifications.length > 0 ? notifications.map(notif => (
                  <div key={notif._id} className={`p-4 rounded-2xl border transition-all ${notif.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{new Date(notif.createdAt).toLocaleString()}</p>
                      </div>
                      {notif.type === 'auction_won' && (
                        <Link to={`/checkout/${notif.product}`} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-500/20">Pay Now</Link>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-gray-400 italic">No notifications found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl">
              <h2 className="text-xl font-black text-gray-900 mb-6">Profile Settings</h2>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                toast.success('Settings updated!');
              }}>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-0 font-bold" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                    <input type="text" defaultValue={user.address?.city} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-0 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Zip Code</label>
                    <input type="text" defaultValue={user.address?.zipCode} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-0 font-bold" />
                  </div>
                </div>
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Save Changes</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
