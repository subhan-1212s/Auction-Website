const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGODB_URI = 'mongodb+srv://mohamedsubhan155:SUBHAN1212S@auction-ai.yqevviv.mongodb.net/smart_auction_db?retryWrites=true&w=majority&appName=auction-ai';

const productsData = [
    // Watches
    { name: 'Rolex Submariner Date', category: 'Watches', description: 'Classic dive watch with an Oyster bracelet.', currentBid: 850000, condition: 'new', image: '/products/rolex_submariner.png' },
    { name: 'Omega Speedmaster Moonwatch', category: 'Watches', description: 'Legendary chronograph worn on the moon.', currentBid: 450000, condition: 'new', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600' },
    { name: 'Patek Philippe Nautilus', category: 'Watches', description: 'Elegant and highly sought-after sports watch.', currentBid: 2500000, condition: 'used', image: 'https://images.unsplash.com/photo-1549971842-8c886eeb1e34?auto=format&fit=crop&q=80&w=600' },
    { name: 'Audemars Piguet Royal Oak', category: 'Watches', description: 'Iconic octagonal bezel luxury piece.', currentBid: 3200000, condition: 'new', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tag Heuer Monaco', category: 'Watches', description: 'Square-cased classic racing watch.', currentBid: 350000, condition: 'used', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600' },

    // Electronics
    { name: 'Apple iPhone 15 Pro Max - 256GB', category: 'Electronics', description: 'Flagship smartphone in Natural Titanium.', currentBid: 120000, condition: 'new', image: '/products/iphone_15pro.png' },
    { name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', description: 'Industry-leading noise canceling headphones.', currentBid: 24000, condition: 'new', image: '/products/sony_xm5.png' },
    { name: 'Apple MacBook Pro M3 Max', category: 'Electronics', description: 'High-performance laptop for professionals.', currentBid: 280000, condition: 'new', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600' },
    { name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', description: 'Premium Android smartphone with AI features.', currentBid: 115000, condition: 'new', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sony PlayStation 5 Console', category: 'Electronics', description: 'Next-gen gaming console with DualSense controller.', currentBid: 45000, condition: 'new', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=600' },

    // Fashion
    { name: 'Nike Air Jordan 1 Retro High', category: 'Fashion', description: 'Classic streetwear sneakers.', currentBid: 16000, condition: 'new', image: '/products/nike_jordan1.png' },
    { name: 'Adidas Ultraboost Light', category: 'Fashion', description: 'Comfortable performance running shoes.', currentBid: 14000, condition: 'new', image: '/products/adidas_ultraboost.png' },
    { name: 'Louis Vuitton Keepall Bandoulière 50', category: 'Fashion', description: 'Luxury travel duffel bag.', currentBid: 250000, condition: 'new', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600' },
    { name: 'Gucci Marmont Leather Belt', category: 'Fashion', description: 'Signature double G buckle belt.', currentBid: 35000, condition: 'new', image: 'https://images.unsplash.com/photo-1620794108216-9524022eb619?auto=format&fit=crop&q=80&w=600' },
    { name: 'Hermès Birkin 30 Bag', category: 'Fashion', description: 'Highly sought-after luxury handbag.', currentBid: 1800000, condition: 'new', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600' },

    // Motors
    { name: 'Porsche 911 GT3 RS', category: 'Motors', description: 'Track-focused high performance sports car.', currentBid: 35000000, condition: 'used', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600' },
    { name: 'Ducati Panigale V4 S', category: 'Motors', description: 'Premium Italian superbike.', currentBid: 2800000, condition: 'new', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600' },
    { name: 'Mercedes-Benz G-Class AMG 63', category: 'Motors', description: 'Luxury heavy-duty SUV.', currentBid: 28000000, condition: 'used', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tesla Model S Plaid', category: 'Motors', description: 'Ultra-fast electric sedan.', currentBid: 15000000, condition: 'new', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=600' },
    { name: 'Harley-Davidson Fat Boy', category: 'Motors', description: 'Iconic cruiser motorcycle.', currentBid: 1800000, condition: 'used', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600' },

    // Collectibles
    { name: 'Charizard 1st Edition PSA 10', category: 'Collectibles', description: 'Holy grail of Pokemon trading cards.', currentBid: 12000000, condition: 'used', image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vintage 1977 Star Wars Figures Set', category: 'Collectibles', description: 'Original unboxed action figures.', currentBid: 450000, condition: 'used', image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Superman #1 Comic Book (CGC 8.0)', category: 'Collectibles', description: 'The origin of Superman, highly graded.', currentBid: 25000000, condition: 'used', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600' },
    { name: 'Signed Michael Jordan Jersey', category: 'Collectibles', description: 'Authentic 1998 Bulls jersey signed by MJ.', currentBid: 3500000, condition: 'used', image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=600' },
    { name: 'Antique 19th Century Globe', category: 'Collectibles', description: 'Hand-painted historical world globe.', currentBid: 120000, condition: 'used', image: 'https://images.unsplash.com/photo-1524661135-423995f22e0b?auto=format&fit=crop&q=80&w=600' },

    // Art
    { name: 'Abstract Ocean Canvas', category: 'Art', description: 'Large modern abstract blue textured painting.', currentBid: 45000, condition: 'new', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bronze Stallion Sculpture', category: 'Art', description: 'Hand-cast bronze horse sculpture, edition 1/10.', currentBid: 250000, condition: 'new', image: 'https://images.unsplash.com/photo-1554188248-986ba0724f86?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vintage French Exhibition Poster', category: 'Art', description: 'Original lithograph poster from 1920 Paris.', currentBid: 85000, condition: 'used', image: 'https://images.unsplash.com/photo-1574514578964-b9034cce4231?auto=format&fit=crop&q=80&w=600' },
    { name: 'Contemporary Minimalist Oil Painting', category: 'Art', description: 'Original black and white canvas by emergent artist.', currentBid: 65000, condition: 'new', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600' },
    { name: 'Street Art Aerosol on Brick Panel', category: 'Art', description: 'Authentic panel section from urban exhibition.', currentBid: 125000, condition: 'used', image: 'https://images.unsplash.com/photo-1499892477393-f67587eba736?auto=format&fit=crop&q=80&w=600' },

    // Sports
    { name: 'Signed Virat Kohli Cricket Bat', category: 'Sports', description: 'Bat used during the 2019 World Cup.', currentBid: 1500000, condition: 'used', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600' },
    { name: 'Titleist Pro V1 Golf Balls (Box signed by Tiger Woods)', category: 'Sports', description: 'Mint condition signed box.', currentBid: 350000, condition: 'new', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=600' },
    { name: 'Professional Carbon Fiber Road Bike', category: 'Sports', description: 'Tour de France tier racing bicycle.', currentBid: 450000, condition: 'used', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Lionel Messi Signed World Cup Cleats', category: 'Sports', description: 'Iconic match-worn boots.', currentBid: 4500000, condition: 'used', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vintage Heavyweight Boxing Championship Belt', category: 'Sports', description: 'Replica 1990s world title belt.', currentBid: 120000, condition: 'new', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600' },

    // Jewelry
    { name: '2 Carat Diamond Engagement Ring', category: 'Jewelry', description: 'VVS1 clarity round cut diamond on platinum band.', currentBid: 1250000, condition: 'new', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600' },
    { name: 'Cartier Love Bracelet', category: 'Jewelry', description: '18K Yellow Gold iconic bracelet with diamonds.', currentBid: 650000, condition: 'new', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vintage Tiffany & Co. Pearl Necklace', category: 'Jewelry', description: 'Authentic Akoya pearls with silver clasp.', currentBid: 320000, condition: 'used', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600' },
    { name: 'Emerald and Diamond Halo Earrings', category: 'Jewelry', description: '5 Carat total Colombian emeralds.', currentBid: 850000, condition: 'new', image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bulgari B.zero1 Ring', category: 'Jewelry', description: 'Four-band ring in 18kt rose gold with black ceramic.', currentBid: 180000, condition: 'new', image: 'https://images.unsplash.com/photo-1605100804763-247f67b454bf?auto=format&fit=crop&q=80&w=600' },

    // Home & Garden
    { name: 'Herman Miller Eames Lounge Chair', category: 'Home & Garden', description: 'Classic mid-century modern leather and wood chair.', currentBid: 450000, condition: 'new', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vintage Persian Silk Rug', category: 'Home & Garden', description: 'Hand-knotted 8x10 authentic rug.', currentBid: 350000, condition: 'used', image: 'https://images.unsplash.com/photo-1549488344-c1555191c9b6?auto=format&fit=crop&q=80&w=600' },
    { name: 'Dyson V15 Detect Absolute', category: 'Home & Garden', description: 'Latest capable cordless vacuum.', currentBid: 45000, condition: 'new', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=600' },
    { name: 'Weber Genesis Smart Gas Grill', category: 'Home & Garden', description: 'Premium outdoor BBQ appliance.', currentBid: 120000, condition: 'new', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Chesterfield Genuine Leather Sofa', category: 'Home & Garden', description: 'Classic tufted brown leather 3-seater.', currentBid: 180000, condition: 'new', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=600' },
];

async function seedMassProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Find admin user
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin user found to attach products to!');
            process.exit(1);
        }

        const adminId = admin._id;

        // Set expiry date to exactly 1 day from now
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        console.log(`Seeding 45 products for Admin: ${admin.email}...`);

        let count = 0;
        for (const item of productsData) {
            await Product.create({
                name: item.name,
                description: item.description,
                category: item.category,
                startingPrice: Math.floor(item.currentBid * 0.8), // starting price is 80% of current bid
                currentBid: item.currentBid,
                bidCount: Math.floor(Math.random() * 15),
                minimumIncrement: 1000,
                endTime: tomorrow,
                images: [item.image],
                status: 'active',
                seller: adminId,
                condition: item.condition
            });
            count++;
        }

        console.log(`Successfully created ${count} products!`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding products:', err);
        process.exit(1);
    }
}

seedMassProducts();
