const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const motorsData = [
  {
    name: '2023 Porsche 911 GT3 RS',
    description: 'The ultimate track weapon. Weissach Package, Carbon Ceramic Brakes, and Magnesium wheels. Finished in Ice Grey Metallic with Pyro Red accents. A naturally aspirated masterpiece revving to 9,000 RPM.',
    category: 'Motors',
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', 
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
    ],
    startingPrice: 25000000,
    currentBid: 28500000,
    bidCount: 5,
    minimumIncrement: 100000,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    isFeatured: true,
    status: 'active'
  },
  {
    name: '2024 Ducati Panigale V4 SP2',
    description: 'The darker side of sportbikes. Winter Test livery, brushed aluminum tank, carbon fiber wheels, and dry clutch. Numbered series. 1,103 cc Desmosedici Stradale engine delivering 215.5 hp.',
    category: 'Motors',
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800'
    ],
    startingPrice: 3800000,
    currentBid: 3800000,
    bidCount: 0,
    minimumIncrement: 50000,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: '1967 Ford Mustang Shelby GT500',
    description: 'Classic American Muscle. Restored to perfection. Nightmist Blue with Wimbledon White Le Mans stripes. 428 Police Interceptor V8 engine. A true collector\'s item with matching numbers.',
    category: 'Motors',
    condition: 'used',
    images: [
      'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800'
    ],
    startingPrice: 15000000,
    currentBid: 16200000,
    bidCount: 8,
    minimumIncrement: 100000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Lamborghini Aventador SVJ Roadster',
    description: 'One of 800 produced. V12 naturally aspirated engine. ALA 2.0 active aerodynamics. Finished in Verde Mantis. 0-100 km/h in 2.9 seconds. Full PPF protection applied since delivery.',
    category: 'Motors',
    condition: 'used',
    images: [
      'https://images.unsplash.com/photo-1544605935-a50d2f0dd6df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?auto=crop&fit=crop&q=80&w=800'
    ],
    startingPrice: 55000000,
    currentBid: 58000000,
    bidCount: 12,
    minimumIncrement: 200000,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-auction')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Find an admin or first user to be the seller
    let seller = await User.findOne({ role: 'admin' });
    if (!seller) {
      seller = await User.findOne();
    }

    if (!seller) {
      console.error('No user found to assign products to. Please register a user first.');
      process.exit(1);
    }

    console.log(`Assigning products to seller: ${seller.name} (${seller.email})`);

    for (const product of motorsData) {
      const existing = await Product.findOne({ name: product.name });
      if (!existing) {
        await Product.create({ ...product, seller: seller._id });
        console.log(`Created: ${product.name}`);
      } else {
        console.log(`Skipped (already exists): ${product.name}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
