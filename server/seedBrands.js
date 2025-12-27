const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const brands = ['Rolex', 'Apple', 'Nike', 'Sony', 'Adidas', 'Samsung'];

const productTemplates = {
  Rolex: [
    { name: 'Rolex Submariner Date', category: 'Watches', price: 950000, img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rolex Daytona Panda', category: 'Watches', price: 2500000, img: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rolex GMT-Master II Pepsi', category: 'Watches', price: 1800000, img: 'https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rolex Day-Date 40 Gold', category: 'Watches', price: 3500000, img: 'https://images.unsplash.com/photo-1639016141384-cb64c0d49caa?auto=format&fit=crop&q=80&w=800' },
    { name: 'Rolex Oyster Perpetual 41', category: 'Watches', price: 650000, img: 'https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&q=80&w=800' }
  ],
  Apple: [
    { name: 'Apple MacBook Pro 16 M3 Max', category: 'Electronics', price: 349900, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
    { name: 'Apple iPhone 15 Pro Max Titanium', category: 'Electronics', price: 159900, img: 'https://images.unsplash.com/photo-1695048180490-30f10c662886?auto=format&fit=crop&q=80&w=800' },
    { name: 'Apple Watch Ultra 2', category: 'Electronics', price: 89900, img: 'https://images.unsplash.com/photo-1678911820864-a7407a5146c3?auto=format&fit=crop&q=80&w=800' },
    { name: 'Apple Admin Pro', category: 'Electronics', price: 349900, img: 'https://images.unsplash.com/photo-1569770218135-bea267ed7e8d?auto=format&fit=crop&q=80&w=800' },
    { name: 'Apple AirPods Max', category: 'Electronics', price: 59900, img: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800' }
  ],
  Nike: [
    { name: 'Nike Air Jordan 1 High Chicago', category: 'Fashion', price: 145000, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Nike Dunk Low Panda', category: 'Fashion', price: 18000, img: 'https://images.unsplash.com/photo-1637844525866-ab0e72251d27?auto=format&fit=crop&q=80&w=800' },
    { name: 'Nike Air Mag (Back to the Future)', category: 'Fashion', price: 2500000, img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800' },
    { name: 'Nike Off-White Jordan 1', category: 'Fashion', price: 450000, img: 'https://images.unsplash.com/photo-1556906781-9a412961d28c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Nike Air Max 97 Sean Wotherspoon', category: 'Fashion', price: 95000, img: 'https://images.unsplash.com/photo-1597043540263-737734475904?auto=format&fit=crop&q=80&w=800' }
  ],
  Sony: [
    { name: 'Sony PlayStation 5 Pro', category: 'Electronics', price: 54990, img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sony Alpha a7R V Camera', category: 'Electronics', price: 319990, img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sony WH-1000XM5 Noise Cancelling', category: 'Electronics', price: 26990, img: 'https://images.unsplash.com/photo-1625842268584-8f3bf9ff16a0?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sony Bravia XR 85" OLED TV', category: 'Electronics', price: 449990, img: 'https://images.unsplash.com/photo-1593784697956-614a9b03f963?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sony FE 70-200mm GM Lens', category: 'Electronics', price: 199990, img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800' }
  ],
  Adidas: [
    { name: 'Adidas Yeezy Boost 350 Turtle Dove', category: 'Fashion', price: 85000, img: 'https://images.unsplash.com/photo-1511556532299-8f6693829263?auto=format&fit=crop&q=80&w=800' },
    { name: 'Adidas Human Race NMD Pharrell', category: 'Fashion', price: 65000, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800' },
    { name: 'Adidas 4D Futurecraft', category: 'Fashion', price: 28000, img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Adidas x Gucci Gazelle', category: 'Fashion', price: 75000, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800' },
    { name: 'Adidas Ultra Boost 1.0 Cream', category: 'Fashion', price: 18000, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800' }
  ],
  Samsung: [
    { name: 'Samsung Galaxy S24 Ultra Titanium', category: 'Electronics', price: 129999, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800' },
    { name: 'Samsung Odyssey Ark 55" Monitor', category: 'Electronics', price: 219999, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800' },
    { name: 'Samsung Galaxy Z Fold 5', category: 'Electronics', price: 154999, img: 'https://images.unsplash.com/photo-1659114247548-df35a725b84a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Samsung The Frame TV 65"', category: 'Electronics', price: 114990, img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Samsung Galaxy Watch 6 Classic', category: 'Electronics', price: 34999, img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800' }
  ]
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-auction')
  .then(async () => {
    console.log('Connected to MongoDB');

    let seller = await User.findOne({ role: 'admin' });
    if (!seller) seller = await User.findOne();
    if (!seller) {
      console.error('No seller found. Create a user first.');
      process.exit(1);
    }

    console.log('Seeding brands...');

    for (const brand of brands) {
      if (!productTemplates[brand]) continue;
      
      for (const item of productTemplates[brand]) {
        // Check if exists
        const exists = await Product.findOne({ name: item.name });
        if (!exists) {
          await Product.create({
            name: item.name,
            description: `Brand new authentic ${item.name} from ${brand}. Full warranty included. Serialized unit.`,
            category: item.category,
            brand: brand,
            condition: 'new',
            images: [item.img],
            startingPrice: item.price,
            currentBid: item.price,
            minimumIncrement: Math.ceil(item.price * 0.05),
            seller: seller._id,
            endTime: new Date(Date.now() + (Math.floor(Math.random() * 7) + 2) * 24 * 60 * 60 * 1000), // Random 2-9 days
            status: 'active',
            isFeatured: Math.random() > 0.7
          });
          console.log(`Created: ${item.name}`);
        } else {
          // Update brand if missing
          if (!exists.brand) {
            exists.brand = brand;
            await exists.save();
            console.log(`Updated brand for: ${item.name}`);
          }
        }
      }
    }

    console.log('Brand seeding complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
