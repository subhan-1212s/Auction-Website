const express = require('express');
const SellerRequest = require('../models/SellerRequest');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const router = express.Router();

// Request to become seller
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if a request already exists
    const existingRequest = await SellerRequest.findOne({ user: req.user.id, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending seller request.' });
    }

    // Create new request
    const request = new SellerRequest({
      user: req.user.id
    });
    await request.save();

    res.status(200).json({ 
      success: true, 
      message: 'Seller request submitted! Please wait for admin approval.',
      data: request
    });
  } catch (error) {
    console.error('Seller Request Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all requests (admin only)
router.get('/', auth, async (req, res, next) => {
  if (req.user.role !== 'admin') return next(new ErrorResponse('Access denied', 403));
  try {
    const requests = await SellerRequest.find().populate('user', 'name email').sort('-requestedAt');
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
});

// Approve/reject request (admin only)
router.put('/:id', auth, async (req, res, next) => {
  if (req.user.role !== 'admin') return next(new ErrorResponse('Access denied', 403));
  try {
    const { status } = req.body;
    const request = await SellerRequest.findById(req.params.id);
    if (!request) return next(new ErrorResponse('Request not found', 404));

    request.status = status;
    request.reviewedAt = Date.now();
    request.reviewedBy = req.user.id;
    await request.save();

    if (status === 'approved') {
      const targetUser = await User.findById(request.user);
      if (targetUser && targetUser.role === 'user') {
        targetUser.role = 'seller';
      }
      targetUser.isApproved = true;
      await targetUser.save();
    }

    res.json({ success: true, message: `Request ${status}` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
