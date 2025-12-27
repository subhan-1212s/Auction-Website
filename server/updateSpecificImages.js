const fs = require('fs');
const path = require('path');
const axios = require('axios');

const TARGET_DIR = path.join(__dirname, '../client/public/products');

// Sources: Wikimedia Commons (Reliable for historical/art), Pexels/Unsplash (Commercial/Generic)
const REPLACEMENTS = {
  // 1. Rare Mahatma Gandhi Service Stamp
  'stamp.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Gandhi_10rs_stamp.jpg/640px-Gandhi_10rs_stamp.jpg',
  
  // 2. Nike Air Jordan 1 Retro High OG - Chicago
  'jordan.jpg': 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800', // Red/White sneaker
  
  // 3. 1918 George V Gold Sovereign Coin
  'coin.jpg': 'https://images.pexels.com/photos/353347/pexels-photo-353347.jpeg?auto=compress&cs=tinysrgb&w=800', // Gold coin stack generic
  
  // 4. Antique Brass Marine Telescope
  'telescope.jpg': 'https://images.pexels.com/photos/5690509/pexels-photo-5690509.jpeg?auto=compress&cs=tinysrgb&w=800', // Antique brass object/telescope vibe
  
  // 5. Bronze Nataraja Statue - Chola Style
  'nataraja.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Chola_Nataraja_at_LACMA.jpg/498px-Chola_Nataraja_at_LACMA.jpg',
  
  // 6. Raja Ravi Varma "Shakuntala" Oleograph
  'ravi_varma.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Raja_Ravi_Varma%2C_Shakuntala_looking_for_Dushyanta%2C_1870.jpg/640px-Raja_Ravi_Varma%2C_Shakuntala_looking_for_Dushyanta%2C_1870.jpg',
  
  // 7. MRF Genius Grand Edition Cricket Bat
  'bat_mrf.jpg': 'https://images.unsplash.com/photo-1593341646782-e0b495cffd32?auto=format&fit=crop&q=80&w=800', // Cricket bat
  
  // 8. MF Husain "Horses" Limited Edition Print
  'husain.jpg': 'https://images.unsplash.com/photo-1452802422329-379659b8be88?auto=format&fit=crop&q=80&w=800', // Abstract running horses
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      },
      timeout: 10000
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Updated ${filename}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to update ${filename}:`, err.message);
  }
}

async function main() {
  console.log('🔄 Updating specific images from reliable sources...');
  const promises = Object.entries(REPLACEMENTS).map(([filename, url]) => downloadImage(url, filename));
  await Promise.all(promises);
  console.log('✨ Specific image updates completed.');
}

main();
