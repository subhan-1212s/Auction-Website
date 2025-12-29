const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // AI-Lite Fake User Detection
    const { detectFakeUser } = require('../utils/smartValidator');
    const validationResult = detectFakeUser(name, email);
    
    if (!validationResult.isValid) {
      return next(new ErrorResponse(validationResult.reason, 400));
    }

    let user = await User.findOne({ email });
    if (user) return next(new ErrorResponse('User already exists', 400));
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

// Login (Step 1: Validate Credentials & Send OTP)
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 1. Check User
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

    // 3. Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    
    console.log(`🔐 GENERATED OTP for ${email}: ${otp}`);

    // 4. Save to DB
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // 5. Send OTP Email (Asynchronous - don't wait for it to finish)
    const sendEmail = require('../utils/sendEmail');
    sendEmail({
      email: user.email,
      subject: 'Your Smart Auction Login OTP',
      message: `Your OTP is ${otp}`,
      otp: otp
    }).catch(err => console.error('Background Email Failed:', err));

    // 6. Response (Don't send token yet!)
    res.json({ 
      success: true, 
      message: 'OTP sent to your email',
      requireOtp: true,
      email: user.email
    });

  } catch (err) {
    next(err);
  }
});

// Verify OTP (Step 2: Check OTP & Issue Token)
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Issue Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    
    // Check if profile is complete (needs at least one address and phone)
    const isProfileComplete = !!(user.phone && user.addresses && user.addresses.length > 0);
    const needsProfileUpdate = !isProfileComplete && !user.hasSeenProfilePrompt;
    
    res.json({ 
      success: true,
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role, 
        isApproved: user.isApproved,
        avatar: user.avatar,
        address: user.address,
        needsProfileUpdate
      } 
    });
  } catch (err) {
    next(err);
  }
});

// Get Current User
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist', 'name currentBid images status');
    const isProfileComplete = !!(user.phone && user.addresses && user.addresses.length > 0);
    const needsProfileUpdate = !isProfileComplete && !user.hasSeenProfilePrompt;
    
    res.json({ 
      success: true, 
      data: {
        ...user.toObject(),
        needsProfileUpdate
      } 
    });
  } catch (err) {
    next(err);
  }
});

// Update Profile
router.put('/profile', auth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: req.body }, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Mark Profile Prompt as Seen
router.post('/profile/mark-prompt-seen', auth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { 
      $set: { hasSeenProfilePrompt: true } 
    }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// Add Address
router.post('/addresses', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorResponse('User not found', 404));

    const newAddress = {
      ...req.body,
      isDefault: user.addresses.length === 0 ? true : req.body.isDefault
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    next(err);
  }
});

// Delete Address
router.delete('/addresses/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    next(err);
  }
});

// Toggle Watchlist
router.post('/watchlist/:productId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const index = user.watchlist.indexOf(req.params.productId);

    if (index > -1) {
      user.watchlist.splice(index, 1);
    } else {
      user.watchlist.push(req.params.productId);
    }

    await user.save();
    res.json({ success: true, data: user.watchlist });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
