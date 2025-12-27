import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiShield, FiUser, FiActivity, FiArrowLeft, FiCheckCircle, FiHeart, FiTag, FiAlertCircle, FiCheck, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import io from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import AuthContext from '../context/AuthContext';
import { SOCKET_URL } from '../config';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, toggleWatchlist } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [timeLeft, setTimeLeft] = useState('');
    const socketRef = useRef();

    const fetchBids = async () => {
        try {
            const bidsRes = await axios.get(`/api/bids/product/${id}`);
            setBids(bidsRes.data.data || []);
        } catch (err) {
            console.error('Error fetching bids:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data.data);
                fetchBids();
            } catch (err) {
                toast.error('Product not found');
                navigate('/auctions');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Socket Setup
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('joinProduct', id);

        socketRef.current.on('bid_update', ({ productId, currentBid, bidCount, winner }) => {
            if (productId === id) {
                setProduct(prev => ({ ...prev, currentBid, bidCount, winner }));
                fetchBids();
            }
        });

        socketRef.current.on('auction_ended', ({ productId, winner }) => {
            if (productId === id) {
                setProduct(prev => ({ ...prev, status: 'ended', winner }));
                toast.success(`Auction Ended! ${winner ? 'We have a winner!' : 'No bids placed.'}`, { duration: 5000 });
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [id, navigate]);

    // Save to Recently Viewed
    useEffect(() => {
        if (!product) return;

        const saveToHistory = () => {
            try {
                const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const newItem = {
                    _id: product._id,
                    name: product.name,
                    price: product.currentBid || product.startingPrice,
                    image: product.images?.[0] || 'https://via.placeholder.com/800x500',
                    viewedAt: new Date().toISOString()
                };

                // Remove duplicates of this item
                const filtered = history.filter(item => item._id !== product._id);

                // Add new item to front
                const updated = [newItem, ...filtered].slice(0, 6); // Keep last 6 items

                localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            } catch (err) {
                console.error('Failed to save recently viewed item:', err);
                // If corrupted, clear it to fix the crash
                localStorage.removeItem('recentlyViewed');
            }
        };

        saveToHistory();
    }, [product]);

    useEffect(() => {
        if (!product) return;
        const interval = setInterval(() => {
            const end = new Date(product.endTime);
            const now = new Date();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('ENDED');
                clearInterval(interval);
            } else {
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${h}h ${m}m ${s}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [product]);

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to place bids');

        const amount = parseFloat(bidAmount);
        const minBid = (product.currentBid || product.startingPrice) + (product.minimumIncrement || 1);

        if (amount < minBid) {
            return toast.error(`Minimum bid is ₹${minBid}`);
        }

        try {
            await axios.post('/api/bids', { productId: id, amount });
            setBidAmount('');
            toast.success('Bid placed successfully!');
            fetchBids();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error placing bid');
        }
    };




    const isInWatchlist = user?.watchlist?.some(item => (item?._id || item) === id);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <FiAlertCircle size={48} className="mb-4 text-orange-400" />
            <p className="text-xl font-bold">Product not found</p>
            <Link to="/auctions" className="mt-4 text-blue-600 font-bold hover:underline font-luxury">Explore Auctions</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        <FiArrowLeft className="mr-2" /> Back
                    </button>
                    <button
                        onClick={() => toggleWatchlist(id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isInWatchlist ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-600'}`}
                    >
                        <FiHeart className={isInWatchlist ? 'fill-current' : ''} />
                        {isInWatchlist ? 'Watching' : 'Watchlist'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-4 md:space-y-6">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="aspect-square md:aspect-[16/10] bg-gray-50 relative group">
                                <img src={product?.images?.[0] || 'https://via.placeholder.com/800x500'} alt={product.name} className="w-full h-full object-contain p-4 md:p-8" />
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{product?.category || 'General'}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${product.condition === 'new' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                        {product.condition}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1"><FiUser className="text-blue-500" /> {product?.seller?.name || 'Trusted Seller'}</div>
                                    <Link to={`/auctions?seller=${product?.seller?._id || product?.seller}`} className="flex items-center gap-1 font-medium text-blue-600 underline hover:text-blue-700 transition-colors">View Seller Store</Link>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-bold text-gray-900 mb-3">Item Description</h3>
                                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">{product.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bidding Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-500/5 border border-blue-50 sticky top-24">
                            {/* Timer Banner */}
                            <div className={`p-4 rounded-xl text-center mb-6 shadow-inner ${timeLeft === 'ENDED' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}>
                                <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold mb-1">
                                    {product.status === 'active' ? 'Auction Ends In' : 'Auction Finished'}
                                </p>
                                <div className="text-2xl font-mono font-bold flex items-center justify-center gap-2">
                                    <FiClock className={timeLeft !== 'ENDED' ? 'animate-pulse text-blue-400' : ''} /> {timeLeft}
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Current Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-blue-700">₹{((product.currentBid || product.startingPrice) || 0).toLocaleString()}</span>
                                    <span className="text-gray-400 text-sm font-medium">[{product?.bidCount || 0} bids]</span>
                                </div>
                            </div>

                            {product.status === 'active' ? (
                                <>
                                    <form onSubmit={handlePlaceBid} className="space-y-4 mb-6">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                            <input
                                                type="number"
                                                required
                                                disabled={timeLeft === 'ENDED'}
                                                className="w-full pl-8 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 text-xl font-extrabold bg-gray-50 transition-all placeholder:font-medium placeholder:text-gray-300"
                                                placeholder={`Min: ₹${(((product?.currentBid || product?.startingPrice) || 0) + (product?.minimumIncrement || 1)).toLocaleString()}`}
                                                value={bidAmount}
                                                onChange={e => setBidAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            disabled={timeLeft === 'ENDED'}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FiTag /> Place Your Bid
                                        </button>
                                    </form>


                                </>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
                                    <div className="flex items-center gap-3 text-gray-700 font-bold">
                                        <FiAlertCircle className="text-orange-500" /> This auction has ended
                                    </div>
                                    {product.winner && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                            <div className="flex flex-col gap-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <p className="text-[10px] uppercase font-black text-blue-600 tracking-widest">Congratulations to the Winner!</p>
                                                <div className="flex items-center gap-3">
                                                    <img src={product.winner?.avatar || `https://ui-avatars.com/api/?name=${typeof product.winner === 'object' ? product.winner.name : product.winner}`} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="" />
                                                    <div>
                                                        <p className="font-black text-gray-900 leading-none">{typeof product.winner === 'object' ? product.winner.name : product.winner}</p>
                                                        <p className="text-xs text-gray-400 mt-1">Won with ₹{(product?.currentBid || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {user && (product?.winner?._id === user.id || product?.winner === user.id) && (
                                                product.status === 'sold' ? (
                                                    <button
                                                        onClick={() => navigate('/dashboard?tab=orders')}
                                                        className="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <FiCheck /> Paid - View Order
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/checkout/${id}`)}
                                                        className="w-full py-4 bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <FiCheckCircle /> Proceed to Checkout
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}


                                </div>
                            )}

                            {/* Bid History Hook */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiActivity size={16} /> Recent Bids</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {bids.length > 0 ? bids.map((bid, i) => (
                                        <div key={bid._id} className={`flex justify-between items-center text-xs p-3 rounded-lg border transition-all ${i === 0 ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-transparent'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-500 animate-ping' : 'bg-gray-300'}`}></div>
                                                <span className="font-bold text-gray-700">{bid.bidder?.name || 'User'}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-extrabold text-gray-900">₹{(bid?.amount || 0).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {bid?.createdAt ? formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true }) : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-lg">No bids yet. Be the first!</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="text-[10px] text-green-600 flex items-center justify-center gap-1 font-bold uppercase bg-green-50 py-2 rounded-lg tracking-widest">
                                    <FiShield /> Certified Secure Auction
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
