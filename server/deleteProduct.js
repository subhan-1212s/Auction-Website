const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/smart-auction')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Find and delete iPhone 15 product
    const result = await Product.deleteMany({ 
      name: { $regex: /iphone.*15/i } 
    });
    
    console.log(`Deleted ${result.deletedCount} product(s) matching "iPhone 15"`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
