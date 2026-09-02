require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Bid = require('./models/Bid');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Notification = require('./models/Notification');
const Invoice = require('./models/Invoice');
const SellerRequest = require('./models/SellerRequest');
const User = require('./models/User');

async function resetDataPristine() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to DB');

    // 1. Delete all products
    const resProducts = await Product.deleteMany({});
    console.log(`🗑️ Removed ${resProducts.deletedCount} products.`);

    // 2. Delete all bids
    const resBids = await Bid.deleteMany({});
    console.log(`🗑️ Removed ${resBids.deletedCount} bids.`);

    // 3. Delete all orders
    const resOrders = await Order.deleteMany({});
    console.log(`🗑️ Removed ${resOrders.deletedCount} orders (purchases & sales).`);

    // 4. Delete all payments
    const resPayments = await Payment.deleteMany({});
    console.log(`🗑️ Removed ${resPayments.deletedCount} payments.`);

    // 5. Delete all notifications
    const resNotifs = await Notification.deleteMany({});
    console.log(`🗑️ Removed ${resNotifs.deletedCount} notifications.`);

    // 6. Delete all invoices & seller requests
    const resInvoices = await Invoice.deleteMany({});
    console.log(`🗑️ Removed ${resInvoices.deletedCount} invoices.`);

    const resSellerReqs = await SellerRequest.deleteMany({});
    console.log(`🗑️ Removed ${resSellerReqs.deletedCount} seller requests.`);

    // 7. Clear user watchlists & wishlists
    const resUsers = await User.updateMany({}, {
      $set: { watchlist: [], wishlist: [] }
    });
    console.log(`🧹 Cleaned watchlists/wishlists for ${resUsers.modifiedCount} users.`);

    console.log('\n✨ ALL PLATFORM DATA WIPED & RESET TO PRISTINE FRESH STATE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  • Active Products: 0');
    console.log('  • Active Bids: 0');
    console.log('  • My Purchases / Orders: 0');
    console.log('  • Total Spent: ₹0');
    console.log('  • Total Earnings: ₹0');
    console.log('  • Sales Count: 0');
    console.log('  • Notifications: 0');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting database:', err);
    process.exit(1);
  }
}

resetDataPristine();
