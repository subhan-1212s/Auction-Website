const Product = require('../models/Product');
const Bid = require('../models/Bid');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get user specific dashboard stats
// @route   GET /api/analytics/user-stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    const activeBids = await Bid.countDocuments({ bidder: req.user.id });
    
    // Won auctions (where user is the winner and status is ended or sold)
    const wonAuctions = await Product.countDocuments({ winner: req.user.id, status: { $in: ['ended', 'sold'] } });

    // Total spent (sum of all completed payments by user)
    const payments = await Payment.aggregate([
      { $match: { buyer: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Active listings (if seller)
    const activeListings = await Product.countDocuments({ seller: req.user.id, status: 'active' });

    // Total earnings (sum of all completed payments where user is the seller)
    const earnings = await Payment.aggregate([
      { $match: { seller: req.user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const salesCount = await Order.countDocuments({ seller: req.user.id, status: { $in: ['paid', 'shipped', 'delivered'] } });

    res.status(200).json({
      success: true,
      data: {
        activeBids,
        wonAuctions,
        totalSpent: payments[0]?.total || 0,
        activeListings,
        totalEarnings: earnings[0]?.total || 0,
        salesCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get platform stats
// @route   GET /api/analytics/stats
// @access  Private/Admin
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalBids = await Bid.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalBids,
        totalOrders,
        totalRevenue: revenue[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
};
