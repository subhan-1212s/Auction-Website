const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TARGET_DIR = path.join(__dirname, '../client/public/products');

// Use Placehold.co for instant, lightweight images customized with text
const PLACEHOLDERS = {
  'jordan.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Nike+Jordan',
  'headphones.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Sony+Headphones',
  'safari.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Tata+Safari',
  'thar.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Mahindra+Thar',
  'ambassador.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Hindustan+Ambassador',
  
  'nataraja.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Bronze+Nataraja',
  'husain.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=MF+Husain+Art',
  'ravi_varma.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Raja+Ravi+Varma',
  
  'coin.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Antique+Coin',
  'stamp.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Vintage+Stamp',
  'telescope.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Antique+Telescope',
  
  'bat_mrf.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=MRF+Cricket+Bat',
  'ball.jpg': 'https://placehold.co/800x800/EFEFEF/333333.png?text=Cricket+Ball'
};

async function downloadImage(url, filename) {
  const filePath = path.join(TARGET_DIR, filename);
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 5000 // 5 seconds max
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Generated placeholder for ${filename}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to create placeholder for ${filename}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)){
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log('⚡ Generating fast placeholders...');
  const promises = Object.entries(PLACEHOLDERS).map(([filename, url]) => downloadImage(url, filename));
  await Promise.all(promises);
  console.log('✨ All placeholders created.');
}

main();
