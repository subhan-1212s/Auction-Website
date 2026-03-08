const mongoose = require('mongoose');
const Order = require('./models/Order');
const Bid = require('./models/Bid');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/smart_auction_db';

async function resetStats() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Delete all orders (This resets Spent and Earnings/Sales)
        const orderRes = await Order.deleteMany({});
        console.log(`Deleted ${orderRes.deletedCount} orders.`);

        // Delete all bids (This resets Active Bids and Spent calculations if derived from bids)
        const bidRes = await Bid.deleteMany({});
        console.log(`Deleted ${bidRes.deletedCount} bids.`);

        console.log('User statistics successfully reset to 0!');
        process.exit(0);
    } catch (err) {
        console.error('Error resetting stats:', err);
        process.exit(1);
    }
}

resetStats();
