require('dotenv').config();
const mongoose = require('mongoose');
const Bid = require('./models/Bid');
const Product = require('./models/Product');

async function cleanOrphanedBids() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to DB');

    const bids = await Bid.find();
    console.log(`Found ${bids.length} total bids in database.`);

    let deletedCount = 0;
    for (const bid of bids) {
      const product = await Product.findById(bid.product);
      if (!product) {
        await Bid.deleteOne({ _id: bid._id });
        deletedCount++;
      }
    }

    console.log(`🧹 Cleaned up ${deletedCount} orphaned bids pointing to deleted products.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning bids:', err);
    process.exit(1);
  }
}

cleanOrphanedBids();
