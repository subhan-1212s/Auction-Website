const express = require('express');
const { auth } = require('../middleware/auth');
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController');
const Payment = require('../models/Payment');

const router = express.Router();

// Create Payment Intent
router.post('/create-intent', auth, createPaymentIntent);

// Confirm Payment
router.post('/confirm', auth, confirmPayment);

// Paytm Routes
const { initiatePaytmTransaction, verifyPaytmTransaction } = require('../controllers/paymentController');
router.post('/paytm/initiate', auth, initiatePaytmTransaction);
router.post('/paytm/callback', verifyPaytmTransaction);

// Get payment history
router.get('/history', auth, async (req, res, next) => {
  try {
    const payments = await Payment.find({
      $or: [{ buyer: req.user.id }, { seller: req.user.id }]
    }).populate('product', 'name images')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .sort({ paidAt: -1 });
      
    res.json({ success: true, data: payments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
