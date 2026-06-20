const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const portfolioDir = path.join(__dirname, 'img', 'portfolio');
const imgDir = path.join(__dirname, 'img');

const portfolioImages = [
  'crm.jpg',
  'custom-crm.png',
  'hotel.jpg',
  'portofolio.png',
  'siluet_new.png',
  'travel.png'
];

async function optimizePortfolio() {
  console.log('--- Optimizing Portfolio Images ---');
  for (const img of portfolioImages) {
    const inputPath = path.join(portfolioDir, img);
    const baseName = path.basename(img, path.extname(img));
    const outputPath = path.join(portfolioDir, `${baseName}.webp`);

    console.log(`Processing: ${img} -> ${baseName}.webp`);
    try {
      await sharp(inputPath)
        .resize({ width: 1000, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const origSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      console.log(`  Done! Size reduced: ${(origSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (${((1 - newSize / origSize) * 100).toFixed(1)}% savings)`);
    } catch (err) {
      console.error(`  Error processing ${img}:`, err);
    }
  }
}

async function optimizeProfile() {
  console.log('\n--- Optimizing Profile Image ---');
  const inputPath = path.join(imgDir, 'profile.png');
  const tempPath = path.join(imgDir, 'profile_temp.png');
  const webpPath = path.join(imgDir, 'profile.webp');

  console.log(`Processing profile.png -> profile.webp (280x280 WebP)`);
  try {
    await sharp(inputPath)
      .resize(280, 280)
      .webp({ quality: 85 })
      .toFile(webpPath);
    const webpSize = fs.statSync(webpPath).size;
    console.log(`  Created profile.webp: ${(webpSize / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error('  Error creating profile.webp:', err);
  }

  console.log(`Optimizing original profile.png for OG:image (max 800px width PNG)`);
  try {
    await sharp(inputPath)
      .resize({ width: 800, withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 75 })
      .toFile(tempPath);
    
    // Replace original
    const origSize = fs.statSync(inputPath).size;
    fs.renameSync(tempPath, inputPath);
    const newSize = fs.statSync(inputPath).size;
    console.log(`  Updated profile.png! Size reduced: ${(origSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (${((1 - newSize / origSize) * 100).toFixed(1)}% savings)`);
  } catch (err) {
    console.error('  Error optimizing profile.png:', err);
  }
}

async function run() {
  await optimizePortfolio();
  await optimizeProfile();
}

run();
