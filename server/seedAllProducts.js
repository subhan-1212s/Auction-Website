require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const productsData = [
  // ================= 1. ELECTRONICS (5 Products) =================
  {
    name: 'Apple iPhone 15 Pro Max (256GB - Natural Titanium)',
    category: 'Electronics',
    subCategory: 'Smartphones',
    condition: 'new',
    description: 'Brand new Apple iPhone 15 Pro Max featuring aerospace-grade titanium design, A17 Pro chip, customizable Action button, and 5x Telephoto camera.',
    startingPrice: 115000,
    currentBid: 122000,
    bidCount: 4,
    minimumIncrement: 1000,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    category: 'Electronics',
    subCategory: 'Audio',
    condition: 'new',
    description: 'Industry-leading noise canceling headphones with 8 microphones, Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours battery life.',
    startingPrice: 22000,
    currentBid: 24500,
    bidCount: 3,
    minimumIncrement: 500,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
    category: 'Electronics',
    subCategory: 'Laptops',
    condition: 'new',
    description: 'Ultimate workstation powerhouse with M3 Max 16-core CPU and 40-core GPU, Liquid Retina XDR display, and up to 22 hours of battery life.',
    startingPrice: 260000,
    currentBid: 275000,
    bidCount: 6,
    minimumIncrement: 2000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Sony PlayStation 5 Console (Digital Edition)',
    category: 'Electronics',
    subCategory: 'Gaming',
    condition: 'new',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    startingPrice: 40000,
    currentBid: 44000,
    bidCount: 5,
    minimumIncrement: 500,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Canon EOS R6 Mark II Full-Frame Mirrorless Camera',
    category: 'Electronics',
    subCategory: 'Cameras',
    condition: 'new',
    description: 'High performance 24.2 MP full-frame sensor, 40 fps electronic shutter, Dual Pixel CMOS AF II, and 4K 60p uncropped video recording.',
    startingPrice: 185000,
    currentBid: 198000,
    bidCount: 2,
    minimumIncrement: 1500,
    durationDays: 1.0,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },

  // ================= 2. FASHION (5 Products) =================
  {
    name: 'Nike Air Jordan 1 Retro High OG "Chicago Lost & Found"',
    category: 'Fashion',
    subCategory: 'Footwear',
    condition: 'new',
    description: 'Iconic sneaker inspired by the original 1985 release. Premium aged leather upper, encapsulated Air unit, and retro vintage packaging.',
    startingPrice: 15000,
    currentBid: 18500,
    bidCount: 7,
    minimumIncrement: 500,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Louis Vuitton Monogram Keepall 50 Bandoulière Duffel',
    category: 'Fashion',
    subCategory: 'Bags',
    condition: 'new',
    description: 'Classic luxury travel canvas duffel with natural cowhide leather trim, double zip closure, removable shoulder strap, and polished brass hardware.',
    startingPrice: 140000,
    currentBid: 155000,
    bidCount: 4,
    minimumIncrement: 2000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Gucci GG Marmont Matelassé Leather Tote Bag',
    category: 'Fashion',
    subCategory: 'Bags',
    condition: 'new',
    description: 'Soft matelassé chevron leather with Double G hardware, microfiber lining with suede-like finish, and versatile sliding chain strap.',
    startingPrice: 85000,
    currentBid: 92000,
    bidCount: 3,
    minimumIncrement: 1000,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Ray-Ban Classic Aviator Sunglasses (Gold Frame / G-15 Green Lens)',
    category: 'Fashion',
    subCategory: 'Accessories',
    condition: 'new',
    description: 'Timeless aviator styling crafted in polished gold metal, offering 100% UV protection and exceptional clarity.',
    startingPrice: 8500,
    currentBid: 10200,
    bidCount: 2,
    minimumIncrement: 200,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Adidas Yeezy Boost 350 V2 Zebra',
    category: 'Fashion',
    subCategory: 'Footwear',
    condition: 'new',
    description: 'Primeknit upper in white and black striped pattern with SPLY-350 red branding and translucent full-length Boost midsole.',
    startingPrice: 22000,
    currentBid: 26000,
    bidCount: 5,
    minimumIncrement: 500,
    durationDays: 1.0,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },

  // ================= 3. MOTORS (5 Products) =================
  {
    name: 'Porsche 911 GT3 RS Supercar (Guards Red)',
    category: 'Motors',
    subCategory: 'Supercars',
    condition: 'used',
    description: 'Track-focused aerodynamic masterpiece with a 4.0-liter naturally aspirated 6-cylinder engine producing 518 HP, Weissach Package included.',
    startingPrice: 28000000,
    currentBid: 29500000,
    bidCount: 9,
    minimumIncrement: 100000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Ducati Panigale V4 S Superbike',
    category: 'Motors',
    subCategory: 'Motorcycles',
    condition: 'new',
    description: '1,103 cc Desmosedici Stradale engine outputting 215.5 HP, Öhlins electronic suspension, lightweight forged aluminum wheels.',
    startingPrice: 2800000,
    currentBid: 3100000,
    bidCount: 4,
    minimumIncrement: 20000,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'BMW M4 Competition Coupe (Isle of Man Green)',
    category: 'Motors',
    subCategory: 'Sports Cars',
    condition: 'new',
    description: '503 HP M TwinPower Turbo inline 6-cylinder engine, M xDrive all-wheel-drive system, carbon fiber bucket seats.',
    startingPrice: 12500000,
    currentBid: 13200000,
    bidCount: 6,
    minimumIncrement: 50000,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Harley-Davidson Fat Boy 114 Cruiser',
    category: 'Motors',
    subCategory: 'Motorcycles',
    condition: 'new',
    description: 'Milwaukee-Eight 114 V-Twin engine, satin chrome finishes, wide Lakester solid disc wheels, signature LED headlamp.',
    startingPrice: 1950000,
    currentBid: 2100000,
    bidCount: 3,
    minimumIncrement: 10000,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: '1967 Ford Mustang Eleanor Fastback Classic',
    category: 'Motors',
    subCategory: 'Classic Cars',
    condition: 'used',
    description: 'Fully restored vintage muscle car with a 427 V8 engine, Tremec 5-speed manual transmission, side pipes, and pepper gray finish.',
    startingPrice: 16500000,
    currentBid: 17800000,
    bidCount: 8,
    minimumIncrement: 100000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },

  // ================= 4. WATCHES (5 Products) =================
  {
    name: 'Rolex Submariner Date (Oystersteel 126610LN)',
    category: 'Watches',
    subCategory: 'Luxury Watches',
    condition: 'new',
    description: 'Legendary diver watch featuring a black Cerachrom bezel, 41mm Oystersteel case, black dial with chromalight display, and Calibre 3235 movement.',
    startingPrice: 1100000,
    currentBid: 1250000,
    bidCount: 11,
    minimumIncrement: 10000,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Omega Speedmaster Professional Moonwatch',
    category: 'Watches',
    subCategory: 'Chronographs',
    condition: 'new',
    description: 'The famous chronograph tested and flight-qualified by NASA for all manned space missions. Co-Axial Master Chronometer Calibre 3861.',
    startingPrice: 550000,
    currentBid: 620000,
    bidCount: 5,
    minimumIncrement: 5000,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Patek Philippe Nautilus 5711/1A Blue Sunburst Dial',
    category: 'Watches',
    subCategory: 'Luxury Watches',
    condition: 'new',
    description: 'Ultra-rare steel Nautilus with iconic horizontally embossed blue dial, luminescent indices, and self-winding Calibre 26-330 S C.',
    startingPrice: 6500000,
    currentBid: 7200000,
    bidCount: 14,
    minimumIncrement: 50000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Audemars Piguet Royal Oak Chronograph 41mm',
    category: 'Watches',
    subCategory: 'Luxury Watches',
    condition: 'new',
    description: 'Stainless steel case with "Grande Tapisserie" pattern dial, integrated bracelet, and automatic manufacture Calibre 4401.',
    startingPrice: 3800000,
    currentBid: 4150000,
    bidCount: 7,
    minimumIncrement: 25000,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'TAG Heuer Monaco Calibre 11 Automatic Chronograph',
    category: 'Watches',
    subCategory: 'Chronographs',
    condition: 'new',
    description: 'Square steel case made famous by Steve McQueen, blue sunray dial with silver sub-dials and vintage perforated black leather strap.',
    startingPrice: 420000,
    currentBid: 465000,
    bidCount: 3,
    minimumIncrement: 3000,
    durationDays: 1.0,
    images: ['https://images.unsplash.com/photo-1619785292559-a15caa28bde6?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },

  // ================= 5. COLLECTIBLES (5 Products) =================
  {
    name: '1999 Pokémon Base Set 1st Edition Charizard Holo (PSA 9 MINT)',
    category: 'Collectibles',
    subCategory: 'Trading Cards',
    condition: 'used',
    description: 'Holy Grail Pokemon card certified PSA 9 MINT grade. Flawless holofoil background, crisp corners, and vivid original coloring.',
    startingPrice: 350000,
    currentBid: 420000,
    bidCount: 9,
    minimumIncrement: 5000,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Michael Jordan 1986 Fleer Rookie Card #57 (PSA 9 MINT)',
    category: 'Collectibles',
    subCategory: 'Sports Cards',
    condition: 'used',
    description: 'Iconic Michael Jordan rookie card graded PSA 9. Perfect centering, sharp borders, and untouched surface gloss.',
    startingPrice: 850000,
    currentBid: 980000,
    bidCount: 12,
    minimumIncrement: 10000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Vintage Marvel Amazing Spider-Man #1 (1963 Key Comic)',
    category: 'Collectibles',
    subCategory: 'Comics',
    condition: 'used',
    description: 'Historic key comic book issue featuring Spider-Man\'s first solo series title, CGC graded 6.5 Fine+ condition with off-white pages.',
    startingPrice: 1200000,
    currentBid: 1350000,
    bidCount: 7,
    minimumIncrement: 15000,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: '19th Century Victorian Brass Nautical Telescope',
    category: 'Collectibles',
    subCategory: 'Antiques',
    condition: 'used',
    description: 'Authentic 1880s mahogany and polished brass draw telescope with original wooden tripod mount and functional glass lenses.',
    startingPrice: 75000,
    currentBid: 88000,
    bidCount: 4,
    minimumIncrement: 1000,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Original Star Wars Luke Skywalker Lightsaber Prop (Signed by Mark Hamill)',
    category: 'Collectibles',
    subCategory: 'Movie Memorabilia',
    condition: 'used',
    description: 'Full-scale replica Graflex lightsaber hand-signed by Mark Hamill with Certificate of Authenticity (COA) from Beckett Authentication.',
    startingPrice: 220000,
    currentBid: 260000,
    bidCount: 6,
    minimumIncrement: 2500,
    durationDays: 1.0,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },

  // ================= 6. ART (5 Products) =================
  {
    name: 'Original Oil Canvas Painting - "Sunset Horizon Expression"',
    category: 'Art',
    subCategory: 'Paintings',
    condition: 'new',
    description: 'Hand-painted large format oil on gallery wrapped canvas. Rich textured impasto technique capturing golden hour lighting.',
    startingPrice: 180000,
    currentBid: 210000,
    bidCount: 5,
    minimumIncrement: 2000,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Modern Bronze Fine Art Sculpture - "Silence & Motion"',
    category: 'Art',
    subCategory: 'Sculptures',
    condition: 'new',
    description: 'Lost-wax cast solid bronze abstract figure mounted on black marble pedestal, edition 3 of 10 signed by contemporary sculptor.',
    startingPrice: 320000,
    currentBid: 360000,
    bidCount: 4,
    minimumIncrement: 5000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Limited Edition Modernist Wave Lithograph Print',
    category: 'Art',
    subCategory: 'Prints',
    condition: 'new',
    description: 'Museum-quality archival pigment print on cotton rag paper, numbered 12/50, accompanied by artist certificate.',
    startingPrice: 95000,
    currentBid: 110000,
    bidCount: 3,
    minimumIncrement: 1000,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Renaissance Style Classic Portrait Oil Artwork',
    category: 'Art',
    subCategory: 'Paintings',
    condition: 'used',
    description: 'Fine art reproduction executed in traditional glaze layers on linen canvas, encased in a hand-gilded antique gold wood frame.',
    startingPrice: 450000,
    currentBid: 520000,
    bidCount: 8,
    minimumIncrement: 5000,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Contemporary Acrylic Expressionist Canvas - "Urban Pulse"',
    category: 'Art',
    subCategory: 'Paintings',
    condition: 'new',
    description: 'Vibrant multi-layered acrylic artwork with metallic accents, ready to hang, measures 48 x 36 inches.',
    startingPrice: 210000,
    currentBid: 245000,
    bidCount: 6,
    minimumIncrement: 2500,
    durationDays: 1.0,
    images: ['https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },

  // ================= 7. SPORTS (5 Products) =================
  {
    name: 'Signed Lionel Messi Argentina 2022 World Cup Final Jersey (Beckett COA)',
    category: 'Sports',
    subCategory: 'Memorabilia',
    condition: 'new',
    description: 'Official Adidas Argentina shirt autographed by Lionel Messi following the 2022 FIFA World Cup victory. Verified with Beckett hologram.',
    startingPrice: 450000,
    currentBid: 520000,
    bidCount: 10,
    minimumIncrement: 5000,
    durationDays: 2.0,
    images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Wilson Pro Staff RF97 Autograph Roger Federer Tennis Racket',
    category: 'Sports',
    subCategory: 'Equipment',
    condition: 'new',
    description: 'Precision engineered carbon fiber racket built to Roger Federer specifications, 340g unstrung weight, matte black finish.',
    startingPrice: 35000,
    currentBid: 42000,
    bidCount: 4,
    minimumIncrement: 500,
    durationDays: 1.5,
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true
  },
  {
    name: 'Autographed Kobe Bryant Official NBA Leather Basketball (PSA/DNA)',
    category: 'Sports',
    subCategory: 'Memorabilia',
    condition: 'used',
    description: 'Spalding official NBA leather basketball hand-signed by Black Mamba Kobe Bryant. Includes PSA/DNA full letter of authenticity.',
    startingPrice: 650000,
    currentBid: 780000,
    bidCount: 12,
    minimumIncrement: 10000,
    durationDays: 3.0,
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Titleist Scotty Cameron Special Select Newport 2 Putter',
    category: 'Sports',
    subCategory: 'Golf',
    condition: 'new',
    description: 'Tour-proven heel-and-toe weighted blade putter milled in the USA from 303 stainless steel with soft tri-sole design.',
    startingPrice: 48000,
    currentBid: 55000,
    bidCount: 3,
    minimumIncrement: 500,
    durationDays: 2.5,
    images: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  },
  {
    name: 'Signed MS Dhoni India ODI Cricket Bat (Match Grade English Willow)',
    category: 'Sports',
    subCategory: 'Memorabilia',
    condition: 'used',
    description: 'Grade 1 English Willow cricket bat personally signed by Captain Cool MS Dhoni with tamper-proof authenticity certificate.',
    startingPrice: 380000,
    currentBid: 440000,
    bidCount: 7,
    minimumIncrement: 5000,
    durationDays: 1.0,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Find Admin User to assign as seller
    const adminUser = await User.findOne({ email: 'mohamedsubhan155@gmail.com' });
    if (!adminUser) {
      console.error('❌ Admin user mohamedsubhan155@gmail.com not found. Run testAdminUser.js first!');
      process.exit(1);
    }

    console.log(`✅ Using seller ID from Admin user: ${adminUser.email}`);

    // 2. Clear old/empty products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products from database.');

    // 3. Transform and insert 35 high-quality products
    const now = new Date();
    const formattedProducts = productsData.map((item) => {
      // Calculate end time strictly between 1 and 3 days from now
      const endTime = new Date(now.getTime() + item.durationDays * 24 * 60 * 60 * 1000);

      return {
        name: item.name,
        description: item.description,
        category: item.category,
        subCategory: item.subCategory,
        condition: item.condition,
        startingPrice: item.startingPrice,
        currentBid: item.currentBid,
        bidCount: item.bidCount,
        minimumIncrement: item.minimumIncrement,
        seller: adminUser._id,
        startTime: now,
        endTime: endTime,
        status: 'active',
        images: item.images,
        isFeatured: item.isFeatured,
        brand: item.name.split(' ')[0]
      };
    });

    const inserted = await Product.insertMany(formattedProducts);
    console.log(`\n🎉 SUCCESS! Inserted ${inserted.length} premium products across 7 categories.`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Print summary per category
    const categories = ['Electronics', 'Fashion', 'Motors', 'Watches', 'Collectibles', 'Art', 'Sports'];
    for (const cat of categories) {
      const count = inserted.filter(p => p.category === cat).length;
      console.log(`  📦 Category '${cat}': ${count} products (Active duration: 1-3 days)`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
