require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const currentUserEmail = 'mohamedsubhan155@gmail.com';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // 1. Delete previous demo products to keep it clean
    await Product.deleteMany({ name: /Super Fast Demo Auction/ });

    // 2. Find or Create a dummy seller (so user doesn't hit "cannot bid on own product" error)
    let seller = await User.findOne({ email: 'system@smartauction.com' });
    if (!seller) {
      seller = new User({
        name: "Smart Auction System",
        email: "system@smartauction.com",
        password: "systempassword123", // not used for login
        role: "seller",
        isApproved: true
      });
      await seller.save();
    }

    const demoProduct = new Product({
      name: "🚀 Super Fast Demo Auction (5 Mins)",
      description: "This is a demo product for testing the full auction winning flow. Bid now to see the magic happen in 5 minutes!",
      category: "Electronics",
      condition: "new",
      startingPrice: 100,
      currentBid: 0,
      minimumIncrement: 50,
      seller: seller._id,
      endTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      status: "active",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"],
      isFeatured: true
    });

    await demoProduct.save();
    console.log(`✅ Success: Functional Demo Auction created!`);
    console.log(`👤 Seller: Smart Auction System (system@smartauction.com)`);
    console.log(`⏰ Ends at: ${demoProduct.endTime}`);
    console.log(`🔗 Product ID: ${demoProduct._id}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
