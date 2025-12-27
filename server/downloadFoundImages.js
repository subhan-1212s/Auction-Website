const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TARGET_DIR = path.join(__dirname, '../client/public/products');

const IMAGES = {
  // 1. Gandhi Stamp (Wikimedia - Reliable)
  'stamp.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Stamp_India_1948_Gandhi_10Rs_Service_overprint.jpg',

  // 2. Jordan (Pexels - Reliable Red Sneaker)
  'jordan.jpg': 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 3. Gold Coin (Pexels - Gold Coins)
  'coin.jpg': 'https://images.pexels.com/photos/353347/pexels-photo-353347.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 4. Telescope (Pexels - Brass/Antique vibe)
  'telescope.jpg': 'https://images.pexels.com/photos/5690509/pexels-photo-5690509.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 5. Nataraja (Wikimedia)
  'nataraja.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Chola_Nataraja_at_LACMA.jpg/498px-Chola_Nataraja_at_LACMA.jpg',

  // 6. Ravi Varma (Wikimedia)
  'ravi_varma.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Raja_Ravi_Varma%2C_Shakuntala_looking_for_Dushyanta%2C_1870.jpg/640px-Raja_Ravi_Varma%2C_Shakuntala_looking_for_Dushyanta%2C_1870.jpg',

  // 7. Cricket Bat (Wikimedia)
  'bat_mrf.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Cricket_bat.jpg/640px-Cricket_bat.jpg',

  // 8. Husain Horses (Unsplash - Abstract Horses)
  'husain.jpg': 'https://images.unsplash.com/photo-1543835683-ec5466c988bf?auto=format&fit=crop&q=80&w=800'
};

async function downloadImage(url, filename) {
  const filePath = path.join(TARGET_DIR, filename);
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
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
  console.log('🔄 Downloading specific valid images...');
  const promises = Object.entries(IMAGES).map(([filename, url]) => downloadImage(url, filename));
  await Promise.all(promises);
  console.log('✨ Download completed.');
}

main();
