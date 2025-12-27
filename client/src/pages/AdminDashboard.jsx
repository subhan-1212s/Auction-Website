import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiBox, FiActivity, FiDollarSign, FiTrash2, FiUserCheck, FiUserX, FiCheckCircle, FiXCircle, FiGrid, FiList, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, activeAuctions: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, requestsRes, productsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/seller-requests'),
        axios.get('/api/admin/products')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setSellerRequests(requestsRes.data.data.filter(req => req.status === 'pending'));
      setProducts(productsRes.data.data);
      console.log('Fetched products:', productsRes.data.data);
      console.log('Products count:', productsRes.data.data.length);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSellerRequest = async (requestId, status) => {
    try {
      await axios.put(`/api/seller-requests/${requestId}`, { status });
      toast.success(`Request ${status} successfully`);
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update request');
    }
  };

  const handleUserBlock = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/block`);
      toast.success('User status updated');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this auction permanently?')) {
      try {
        console.log('Deleting product:', productId);
        const response = await axios.delete(`/api/admin/products/${productId}`);
        console.log('Delete response:', response);
        toast.success('Auction removed');
        fetchAdminData();
      } catch (error) {
        console.error('Delete error:', error);
        console.error('Error response:', error.response);
        toast.error(error.response?.data?.message || 'Failed to remove auction');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-red-100 max-w-md">
          <FiAlertTriangle className="mx-auto text-red-500 mb-6" size={64} />
          <h2 className="text-2xl font-black text-gray-900 mb-4">RESTRICTED ACCESS</h2>
          <p className="text-gray-500 mb-8">This zone is reserved for platform administrators only.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-2">
                <FiActivity /> Control Center
              </div>
              <h1 className="text-4xl font-black tracking-tight">System Administration</h1>
              <p className="text-gray-400 mt-2 font-medium italic">Monitoring platform integrity and commercial flows.</p>
            </div>

            <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10">
              {[
                { id: 'stats', label: 'Overview', icon: FiGrid },
                { id: 'users', label: 'Users', icon: FiUsers },
                { id: 'products', label: 'Auctions', icon: FiBox },
                { id: 'requests', label: 'Requests', icon: FiUserCheck },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <tab.icon /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', val: stats.totalUsers, icon: FiUsers, color: 'bg-blue-500' },
            { label: 'Live Auctions', val: stats.activeAuctions, icon: FiActivity, color: 'bg-green-500' },
            { label: 'Catalog Size', val: stats.totalProducts, icon: FiBox, color: 'bg-purple-500' },
            { label: 'Gross Revenue', val: `₹${stats.totalRevenue?.toLocaleString()}`, icon: FiDollarSign, color: 'bg-orange-500' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>
              <div className={`${stat.color} p-3 rounded-xl w-fit mb-4 text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}><stat.icon size={20} /></div>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stat.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Overview Tables */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FiUsers className="text-blue-600" /> Latest Users</h3>
                <div className="space-y-4">
                  {users.slice(0, 5).map(u => (
                    <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className="w-10 h-10 rounded-full border border-gray-200" alt="" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase text-gray-500">{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FiBox className="text-purple-600" /> New Listings</h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map(p => (
                    <div key={p._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-purple-100 hover:bg-white transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={p.images[0] || 'https://via.placeholder.com/100'} className="w-10 h-10 rounded-lg object-cover border border-gray-200" alt="" />
                        <div className="truncate">
                          <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium italic">by {p.seller?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <p className="font-black text-gray-900 text-sm">₹{p.currentBid?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-gray-900">User Management</h2>
                <div className="relative flex-1 max-w-sm">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-0 text-sm font-medium" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">User Details</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Role</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} className="w-10 h-10 rounded-full" alt="" />
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isBlocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-xs font-bold text-gray-600 capitalize">{u.role}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleUserBlock(u._id)} className={`p-2 rounded-lg transition-colors ${u.isBlocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                              {u.isBlocked ? <FiUserCheck size={16} /> : <FiUserX size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Live Auctions ({products.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
                {products.map(p => (
                  <div key={p._id} className="bg-gray-50 rounded-2xl border border-gray-100 p-4 hover:border-blue-200 transition-all flex flex-col">
                    <div className="flex gap-4 mb-4">
                      <img src={p.images[0] || 'https://via.placeholder.com/200'} className="w-20 h-20 object-cover rounded-xl border border-white" alt="" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{p.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 italic">Seller: {p.seller?.name || 'System'}</p>
                        <p className="text-lg font-black text-blue-600 mt-2">₹{p.currentBid?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <button onClick={() => window.open(`/auctions/${p._id}`, '_blank')} className="flex-1 py-2 bg-white text-gray-700 font-bold text-xs rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">View Live</button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h2 className="text-2xl font-black text-gray-900">Seller Onboarding</h2>
              </div>
              <div className="p-8 space-y-4">
                {sellerRequests.length > 0 ? sellerRequests.map(req => (
                  <div key={req._id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-gray-900">{req.user?.name}</h4>
                      <p className="text-sm text-gray-500">{req.user?.email}</p>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-2">{req.category || 'General'} Seller Request</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleSellerRequest(req._id, 'approved')} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all">
                        <FiCheckCircle /> Approve
                      </button>
                      <button onClick={() => handleSellerRequest(req._id, 'rejected')} className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all">
                        <FiXCircle /> Refuse
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                      <FiUserCheck size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400">All caught up!</h3>
                    <p className="text-gray-400 max-w-xs mx-auto text-sm">There are no pending seller verification requests at the moment.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
