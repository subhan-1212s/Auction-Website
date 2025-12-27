const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TARGET_DIR = path.join(__dirname, '../client/public/products');

// Using highly reliable URLS for the fallbacks/missing items
const RELIABLE_URLS = {
  car: 'https://images.unsplash.com/photo-1552519507-da8b12b7cac4?auto=format&fit=crop&q=80&w=800', // Generic car
  shoe: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', // Red Nike
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', // Headphones
  art: 'https://images.unsplash.com/photo-1576016770956-debb63d92058?auto=format&fit=crop&q=80&w=800', // Art
  sport: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800', // Sport
  antique: 'https://images.unsplash.com/photo-1582560475093-4e4c277663ce?auto=format&fit=crop&q=80&w=800' // Stamp/Coin
};

const IMAGES = {
  // Fix Missing/Failed ones
  'headphones.jpg': RELIABLE_URLS.headphones,
  'jordan.jpg': RELIABLE_URLS.shoe,
  'safari.jpg': RELIABLE_URLS.car,
  'thar.jpg': RELIABLE_URLS.car,
  'ambassador.jpg': RELIABLE_URLS.car,
  
  'nataraja.jpg': RELIABLE_URLS.art,
  'husain.jpg': RELIABLE_URLS.art,
  'ravi_varma.jpg': RELIABLE_URLS.art,
  
  'coin.jpg': RELIABLE_URLS.antique,
  'stamp.jpg': RELIABLE_URLS.antique,
  'telescope.jpg': RELIABLE_URLS.antique,
  
  'bat_mrf.jpg': RELIABLE_URLS.sport,
  'ball.jpg': RELIABLE_URLS.sport,
  // Note: Existing valid ones like iphone.jpg, sony_tv.jpg are kept as is (no need to redownload if they exist, but overwriting is fine)
};

async function downloadImage(url, filename) {
  const filePath = path.join(TARGET_DIR, filename);
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000 
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Downloaded ${filename}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to download ${filename}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)){
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log('⬇️  Downloading missing/failed images...');
  // Only download the ones in IMAGES list above
  const promises = Object.entries(IMAGES).map(([filename, url]) => downloadImage(url, filename));
  await Promise.all(promises);
  console.log('✨ Image repair completed.');
}

main();
