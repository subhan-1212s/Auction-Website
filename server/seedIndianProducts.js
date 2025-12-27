require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected for seeding'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Indian Auction Products with Rupee Pricing (Expanded Catalog)
const indianProducts = [
  // --- MOTORS (5 Items) ---
  {
    name: 'Royal Enfield Classic 350 - Stealth Black',
    description: 'Iconic Royal Enfield Classic 350 motorcycle in pristine condition. Single owner, well-maintained, 12,000 km driven. Perfect for long rides across India. Comes with all original documents and accessories.',
    category: 'Motors',
    condition: 'used',
    startingPrice: 145000,
    currentBid: 158000,
    bidCount: 15,
    minimumIncrement: 2000,
    images: ['/products/royal_enfield.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Mahindra Thar 4x4 Hard Top - Diesel Automatic',
    description: '2023 Mahindra Thar LX 4WD Diesel Automatic. Rocky Beige color. Only 5000km driven. Off-road ready with custom bumper and winch. Under warranty. The ultimate Indian SUV.',
    category: 'Motors',
    condition: 'used',
    startingPrice: 1550000,
    currentBid: 1620000,
    bidCount: 8,
    minimumIncrement: 10000,
    images: ['/products/thar.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Tata Safari Storme Vx 4x4 - Classic White',
    description: 'Well-maintained Tata Safari Storme. The beast of Indian roads. 7-seater comfort, powerful Varicor 400 engine. 45,000km driven. Comprehensive insurance valid till next year.',
    category: 'Motors',
    condition: 'used',
    startingPrice: 650000,
    currentBid: 685000,
    bidCount: 12,
    minimumIncrement: 5000,
    images: ['/products/safari.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Vintage Hindustan Ambassador Mark 4 - 1985',
    description: 'Restored 1985 Hindustan Ambassador Mark 4. Black color, beige interiors. Original Isuzu engine. A piece of Indian history. Perfect for collectors and vintage rallies.',
    category: 'Motors',
    condition: 'used',
    startingPrice: 220000,
    currentBid: 245000,
    bidCount: 20,
    minimumIncrement: 2000,
    images: ['/products/ambassador.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Yamaha RD350 - High Speed Twin Cylinder',
    description: 'Legendary Yamaha RD350 (Rajdoot). Fully restored to stock condition. Japanese barrels. Provides the authentic 2-stroke adrenaline rush. Blue smoke classic.',
    category: 'Motors',
    condition: 'used',
    startingPrice: 350000,
    currentBid: 380000,
    bidCount: 25,
    minimumIncrement: 5000,
    images: ['/products/yamaha.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },

  // --- ELECTRONICS (5 Items) ---
  {
    name: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    description: 'Brand new sealed Apple iPhone 15 Pro Max with full warranty. Purchased from authorized Apple Store India. Includes all original accessories, box, and 1-year Apple India warranty.',
    category: 'Electronics',
    condition: 'new',
    startingPrice: 139900,
    currentBid: 145000,
    bidCount: 22,
    minimumIncrement: 1000,
    images: ['/products/iphone.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Sony Bravia 65" 4K OLED Smart TV - XR Series',
    description: 'Premium Sony Bravia OLED TV with Cognitive Processor XR. Stunning picture quality, perfect blacks, Google TV. 1 year old, excellent condition with 1 year remaining warranty.',
    category: 'Electronics',
    condition: 'used',
    startingPrice: 189990,
    currentBid: 195000,
    bidCount: 12,
    minimumIncrement: 2000,
    images: ['/products/sony_tv.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Canon EOS R6 Mark II Mirrorless Camera',
    description: 'Professional Canon EOS R6 Mark II full-frame mirrorless camera. Includes RF 24-105mm f/4-7.1 IS STM lens. Barely used, only 2000 shutter count. Perfect for professional photography.',
    category: 'Electronics',
    condition: 'used',
    startingPrice: 245000,
    currentBid: 258000,
    bidCount: 9,
    minimumIncrement: 3000,
    images: ['/products/camera_canon.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Apple MacBook Air 15" M2 Chip - Midnight',
    description: 'Supercharged by M2 chip. 15.3-inch Liquid Retina display. 8GB Unified Memory, 512GB SSD Storage. 1080p FaceTime HD camera. Up to 18 hours battery life. Sealed box pack.',
    category: 'Electronics',
    condition: 'new',
    startingPrice: 125000,
    currentBid: 132000,
    bidCount: 14,
    minimumIncrement: 1000,
    images: ['/products/macbook.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Sony PlayStation 5 Console (Disc Edition)',
    description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. Brand new Indian unit with warranty.',
    category: 'Electronics',
    condition: 'new',
    startingPrice: 48000,
    currentBid: 52500,
    bidCount: 45,
    minimumIncrement: 500,
    images: ['/products/ps5.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },

  // --- FASHION (5 Items) ---
  {
    name: 'Nike Air Jordan 1 Retro High OG - Chicago',
    description: 'Authentic Nike Air Jordan 1 in iconic Chicago colorway. Size US 9. Imported from USA, comes with original box, authentication certificate. Deadstock condition.',
    category: 'Fashion',
    condition: 'new',
    startingPrice: 24999,
    currentBid: 28500,
    bidCount: 31,
    minimumIncrement: 500,
    images: ['/products/jordan.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Sabyasachi Bridal Lehenga - Deep Red Velvet',
    description: 'Original Sabyasachi bridal lehenga with intricate Zardosi embroidery. Worn once for 3 hours. Pristine condition. Comes with Sabyasachi box and tag. Size Medium, can be altered.',
    category: 'Fashion',
    condition: 'used',
    startingPrice: 350000,
    currentBid: 385000,
    bidCount: 6,
    minimumIncrement: 5000,
    images: ['/products/lehenga.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Manyavar Mohey Mens Sherwani Set',
    description: 'Cream and Gold wedding sherwani from Manyavar. Size 40. Includes matching stole and churidar. Perfect for weddings and festive occasions. Excellent fabric quality.',
    category: 'Fashion',
    condition: 'used',
    startingPrice: 15000,
    currentBid: 18500,
    bidCount: 10,
    minimumIncrement: 500,
    images: ['/products/sherwani.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Ray-Ban Aviator Classic Sunglasses',
    description: 'Timeless Ray-Ban Aviators with Gold Frame and Green Classic G-15 lenses. Made in Italy. 100% UV protection. Includes leather case and cleaning cloth.',
    category: 'Fashion',
    condition: 'new',
    startingPrice: 6500,
    currentBid: 7200,
    bidCount: 18,
    minimumIncrement: 200,
    images: ['/products/rayban.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Gucci GG Marmont Leather Belt',
    description: 'Black leather belt with Double G buckle. Width 4cm. Size 90cm. Antique brass hardware. Made in Italy. Comes with dust bag and box. 100% Authentic.',
    category: 'Fashion',
    condition: 'new',
    startingPrice: 32000,
    currentBid: 35500,
    bidCount: 14,
    minimumIncrement: 500,
    images: ['/products/gucci_belt.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },

  // --- COLLECTIBLES (5 Items) ---
  {
    name: 'Traditional Kundan Polki Necklace Set - 22K Gold',
    description: 'Exquisite handcrafted Kundan Polki jewelry set with matching earrings. Authentic 22K gold with precious stones. Perfect for weddings and special occasions. Authenticity certificate included.',
    category: 'Collectibles',
    condition: 'new',
    startingPrice: 285000,
    currentBid: 312000,
    bidCount: 18,
    minimumIncrement: 5000,
    images: ['/products/kundan.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: '1918 George V Gold Sovereign Coin',
    description: 'Rare 1918 George V Gold Sovereign Coin minted in Bombay (marked I). 22K Gold, 7.98 grams. Excellent condition. Highly sought after by numismatists and investors.',
    category: 'Collectibles',
    condition: 'used',
    startingPrice: 55000,
    currentBid: 62000,
    bidCount: 28,
    minimumIncrement: 1000,
    images: ['/products/coin.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Vintage HMT Pilot Mechanical Watch',
    description: 'Classic HMT Pilot hand-winding mechanical watch. 17 Jewels. Black dial with luminous hands. Stainless steel case. A true Indian icon. Fully serviced and working perfectly.',
    category: 'Collectibles',
    condition: 'used',
    startingPrice: 4500,
    currentBid: 5800,
    bidCount: 35,
    minimumIncrement: 100,
    images: ['/products/watch_hmt.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Rare Mahatma Gandhi Service Stamp',
    description: 'Estd 1948 Mahatma Gandhi 10 Rupees Service Stamp. "SERVICE" overprint. Mint condition with original gum. Extremely rare philatelic item. Certificate of authenticity included.',
    category: 'Collectibles',
    condition: 'used',
    startingPrice: 25000,
    currentBid: 28000,
    bidCount: 9,
    minimumIncrement: 500,
    images: ['/products/stamp.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Antique Brass Marine Telescope',
    description: '19th Century style antique brass telescope with leather grip. clear optics. Extends to 15 inches. Comes with a dedicated wooden box with brass inlay work. Beautiful decorative piece.',
    category: 'Collectibles',
    condition: 'used',
    startingPrice: 8500,
    currentBid: 9200,
    bidCount: 16,
    minimumIncrement: 200,
    images: ['/products/telescope.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },

  // --- ART (5 Items) ---
  {
    name: 'Vintage Tanjore Painting - Lord Krishna',
    description: 'Authentic antique Tanjore painting of Lord Krishna. 100+ years old, traditional gold foil work with precious stones. Certified by art expert. Rare collectible piece with historical significance.',
    category: 'Art',
    condition: 'used',
    startingPrice: 125000,
    currentBid: 142000,
    bidCount: 14,
    minimumIncrement: 2000,
    images: ['/products/tanjore.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'MF Husain "Horses" Limited Edition Print',
    description: 'Signed limited edition lithograph of MF Husain\'s famous "Horses" series. Numbered 45/100. Framed in high-quality teak wood. Includes provenance documents.',
    category: 'Art',
    condition: 'new',
    startingPrice: 85000,
    currentBid: 92000,
    bidCount: 11,
    minimumIncrement: 1000,
    images: ['/products/husain.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'Hand-painted Madhubani Folk Art on Canvas',
    description: 'Intricate Madhubani (Mithila) painting depicting the "Tree of Life". Created by national award-winning artisan. Natural dyes usage. Size 24x36 inches. Unframed.',
    category: 'Art',
    condition: 'new',
    startingPrice: 12000,
    currentBid: 14500,
    bidCount: 22,
    minimumIncrement: 500,
    images: ['/products/madhubani.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Raja Ravi Varma "Shakuntala" Oleograph',
    description: 'Original vintage oleograph of Raja Ravi Varma\'s "Shakuntala Patra-lekhan". Printed at Ravi Varma Press, Lonavala in early 20th century. Good condition with minor aging marks.',
    category: 'Art',
    condition: 'used',
    startingPrice: 45000,
    currentBid: 48000,
    bidCount: 7,
    minimumIncrement: 1000,
    images: ['/products/ravi_varma.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Bronze Nataraja Statue - Chola Style',
    description: 'Magnificent 18-inch Bronze Nataraja statue cast using the traditional lost-wax method. Exquisite detailing in Chola style. Heavy solid bronze. Perfect for home altar or decor.',
    category: 'Art',
    condition: 'new',
    startingPrice: 38000,
    currentBid: 42000,
    bidCount: 16,
    minimumIncrement: 500,
    images: ['/products/nataraja.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },

  // --- SPORTS (5 Items) ---
  {
    name: 'Yonex Astrox 99 Pro Badminton Racket',
    description: 'Professional grade Yonex Astrox 99 Pro badminton racket. Used by PV Sindhu. Strung with BG80 at 28lbs. Includes original cover, grip, and extra strings. Excellent condition.',
    category: 'Sports',
    condition: 'used',
    startingPrice: 12999,
    currentBid: 14200,
    bidCount: 25,
    minimumIncrement: 200,
    images: ['/products/badminton.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'MRF Genius Grand Edition Cricket Bat',
    description: 'Grade 1 English Willow cricket bat. Endorsed by Virat Kohli. Thick edges, massive sweet spot. Professionally knocked in. Ready to play. Weighs 1180 grams.',
    category: 'Sports',
    condition: 'new',
    startingPrice: 28000,
    currentBid: 32500,
    bidCount: 30,
    minimumIncrement: 500,
    images: ['/products/bat_mrf.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  },
  {
    name: 'SG Test White Leather Cricket Ball (Box of 6)',
    description: 'Official SG Test White balls used in T20 matches. Superior quality alum tanned leather. Water resistant. Box of 6 balls. Brand new sealed.',
    category: 'Sports',
    condition: 'new',
    startingPrice: 4500,
    currentBid: 4800,
    bidCount: 12,
    minimumIncrement: 100,
    images: ['/products/ball.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Adidas Al Rihla Pro - FIFA World Cup Football',
    description: 'Official match ball of FIFA World Cup. Seamless surface for predictable trajectory. FIFA Quality Pro certified. Never used, kept as display piece.',
    category: 'Sports',
    condition: 'new',
    startingPrice: 8000,
    currentBid: 9500,
    bidCount: 19,
    minimumIncrement: 200,
    images: ['/products/football.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isFeatured: false,
    status: 'active'
  },
  {
    name: 'Signed India Cricket Jersey - 2011 World Cup',
    description: 'Authentic Nike India Cricket Jersey from 2011 World Cup winning team. Signed by MS Dhoni and Sachin Tendulkar. Framed with certificate of authenticity. Museum quality.',
    category: 'Sports',
    condition: 'used',
    startingPrice: 150000,
    currentBid: 210000,
    bidCount: 55,
    minimumIncrement: 5000,
    images: ['/products/jersey.jpg'],
    startTime: new Date(),
    endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isFeatured: true,
    status: 'active'
  }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🔄 Starting database seeding...\n');

    // Create or get demo seller
    let demoSeller = await User.findOne({ email: 'demo.seller@smartauction.in' });
    
    if (!demoSeller) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('Demo@123', 10);
      
      demoSeller = await User.create({
        name: 'SmartAuction Demo',
        username: 'SmartAuction Demo',
        email: 'demo.seller@smartauction.in',
        password: hashedPassword,
        role: 'seller'
      });
      console.log('✅ Created demo seller user');
    } else {
      console.log('✅ Using existing demo seller user');
    }

    // Add seller ID to all products
    const productsWithSeller = indianProducts.map(product => ({
      ...product,
      seller: demoSeller._id
    }));

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing products\n`);

    // Insert Indian products
    const result = await Product.insertMany(productsWithSeller);
    console.log(`✅ Successfully added ${result.length} Indian auction products!\n`);
    
    // Display summary
    console.log('📦 FEATURED PRODUCTS (6 items):');
    console.log('━'.repeat(80));
    result.filter(p => p.isFeatured).forEach(p => {
      console.log(`  ✨ ${p.name}`);
      console.log(`     💰 Current Bid: ₹${p.currentBid.toLocaleString('en-IN')} | 👥 ${p.bidCount} bids`);
      console.log(`     📍 Category: ${p.category} | ⏰ Ends in ${Math.ceil((p.endTime - Date.now()) / (1000 * 60 * 60 * 24))} days\n`);
    });

    console.log('\n📦 ALL PRODUCTS:');
    console.log('━'.repeat(80));
    result.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.category})`);
      console.log(`     ₹${p.currentBid.toLocaleString('en-IN')} | ${p.isFeatured ? '⭐ Featured' : 'Regular'}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database seeding completed successfully!');
    console.log('🌐 Refresh your browser at http://localhost:5173 to see the new items!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seeder
console.log('🚀 Smart Auction - Indian Products Seeder');
console.log('━'.repeat(80));
seedDatabase();
