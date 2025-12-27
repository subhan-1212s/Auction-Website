const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// Get all users
router.get('/users', auth, adminAuth, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// Block/Unblock user
router.put('/users/:id/block', auth, adminAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorResponse('User not found', 404));

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, data: user });
  } catch (err) {
    next(err);
  }
});

// Update user role
router.put('/users/:id/role', auth, adminAuth, async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return next(new ErrorResponse('User not found', 404));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Get all products (auctions)
router.get('/products', auth, adminAuth, async (req, res, next) => {
  try {
    const products = await Product.find().populate('seller', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
});

// Remove product (admin)
router.delete('/products/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new ErrorResponse('Product not found', 404));

    await Bid.deleteMany({ product: req.params.id });
    res.json({ success: true, message: 'Product and associated bids removed' });
  } catch (err) {
    next(err);
  }
});

// Get platform statistics
router.get('/stats', auth, adminAuth, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeAuctions = await Product.countDocuments({ status: 'active' });
    const totalBids = await Bid.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: 'completed' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        activeAuctions,
        totalBids,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
