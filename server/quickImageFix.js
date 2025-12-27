const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TARGET_DIR = path.join(__dirname, '../client/public/products');

const IMAGES_TO_FETCH = {
  'stamp.jpg': 'https://loremflickr.com/800/800/stamp',
  'jordan.jpg': 'https://loremflickr.com/800/800/sneaker',
  'coin.jpg': 'https://loremflickr.com/800/800/gold,coin',
  'telescope.jpg': 'https://loremflickr.com/800/800/telescope',
  'nataraja.jpg': 'https://loremflickr.com/800/800/statue',
  'ravi_varma.jpg': 'https://loremflickr.com/800/800/painting',
  'bat_mrf.jpg': 'https://loremflickr.com/800/800/cricket',
  'husain.jpg': 'https://loremflickr.com/800/800/abstract,art',
  'sony_tv.jpg': 'https://loremflickr.com/800/800/television',
  'headphones.jpg': 'https://loremflickr.com/800/800/headphones',
  'safari.jpg': 'https://loremflickr.com/800/800/suv',
  'thar.jpg': 'https://loremflickr.com/800/800/jeep',
  'ambassador.jpg': 'https://loremflickr.com/800/800/car,vintage'
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
        console.log(`✅ Fetched related image for ${filename}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to fetch image for ${filename}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)){
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log('🚀 Quickly fetching related images...');
  const promises = Object.entries(IMAGES_TO_FETCH).map(([filename, url]) => downloadImage(url, filename));
  await Promise.all(promises);
  console.log('✨ All related images prepared. Ready for bid/sell functionality!');
}

main();
