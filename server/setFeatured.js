const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = 'mongodb+srv://mohamedsubhan155:SUBHAN1212S@auction-ai.yqevviv.mongodb.net/smart_auction_db?retryWrites=true&w=majority&appName=auction-ai';

async function setFeaturedProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Reset any existing featured products (just in case)
        await Product.updateMany({}, { isFeatured: false });

        // Select 5 premium items from different categories to be featured
        const featuredNames = [
            'Rolex Submariner Date',
            'Apple iPhone 15 Pro Max - 256GB',
            'Porsche 911 GT3 RS',
            'Charizard 1st Edition PSA 10',
            'Lionel Messi Signed World Cup Cleats'
        ];

        const result = await Product.updateMany(
            { name: { $in: featuredNames } },
            { $set: { isFeatured: true } }
        );

        console.log(`Successfully set ${result.modifiedCount} products as featured!`);
        process.exit(0);
    } catch (err) {
        console.error('Error setting featured products:', err);
        process.exit(1);
    }
}

setFeaturedProducts();
