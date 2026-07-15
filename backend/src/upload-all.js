const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'dqm3syhwr', 
  api_key: '469121327526224', 
  api_secret: 'VuuszgyIVRd-sTA0u-pVsE-9u-0' 
});

const uploadImages = async () => {
  const images = [
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\cap1.webp', folder: 'quimica/cap1', id: 'cap1_new' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\cap 2.jpg', folder: 'quimica/cap2', id: 'cap2_new' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\cap 3.avif', folder: 'quimica/cap3', id: 'cap3_new' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\cap 4.jpg', folder: 'quimica/cap4', id: 'cap4_new' }
  ];

  const guideDir = 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia';
  const files = fs.readdirSync(guideDir);

  for (const f of files) {
    if (f.match(/^\d+[-.]\d+\./)) {
      const parts = f.split(/[-.]/);
      const capId = parts[0];
      const secId = parts[1];
      images.push({
        file: path.join(guideDir, f),
        folder: `quimica/cap${capId}`,
        id: `sec-${capId}-${secId}`
      });
    }
  }

  const mapping = {};

  for (const img of images) {
    if (fs.existsSync(img.file)) {
      try {
        console.log(`Uploading ${img.file}...`);
        const result = await cloudinary.uploader.upload(img.file, { folder: img.folder, public_id: img.id, overwrite: true });
        console.log(`URL for ${img.id}: ${result.secure_url}`);
        mapping[img.id] = result.secure_url;
      } catch (err) {
        console.error(`Error uploading ${img.file}:`, err.message);
      }
    } else {
      console.log(`File not found: ${img.file}`);
    }
  }

  fs.writeFileSync('C:\\Users\\lucas\\.gemini\\antigravity-ide\\brain\\21408e29-8f99-481a-8d70-550d8eefbcc3\\scratch\\image_mapping.json', JSON.stringify(mapping, null, 2));
  console.log('Done mapping.');
}

uploadImages();
