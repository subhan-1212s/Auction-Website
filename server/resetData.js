const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Bid = require('./models/Bid');
const Notification = require('./models/Notification');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_auction_db';
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('✅ Connected to MongoDB');

    try {
        console.log('🗑️  Clearing data...');
        
        await Product.deleteMany({});
        console.log('✅ Removed all Products');

        await Order.deleteMany({});
        console.log('✅ Removed all Orders (Earnings reset)');

        await Bid.deleteMany({});
        console.log('✅ Removed all Bids');

        await Notification.deleteMany({});
        console.log('✅ Removed all Notifications');

        console.log('✨ Data reset complete!');
    } catch (err) {
        console.error('❌ Error clearing data:', err);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
}).catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
});
