const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Credenciales desde backend/.env — antes estaban hardcodeadas aqui y el
// secreto quedo expuesto en el historial de git. Rotar en Cloudinary.
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('[Cloudinary] Faltan CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET en backend/.env');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

async function uploadImages() {
  const images = [
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\cap1.webp', folder: 'quimica/cap1', id: 'cap1_new' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1-1.jpg', folder: 'quimica/cap1', id: 'sec-1-1' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1-2.png', folder: 'quimica/cap1', id: 'sec-1-2' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1-3.avif', folder: 'quimica/cap1', id: 'sec-1-3' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1-4.avif', folder: 'quimica/cap1', id: 'sec-1-4' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1.7.jpg', folder: 'quimica/cap1', id: 'sec-1-7' }
  ];

  for (const img of images) {
    if (fs.existsSync(img.file)) {
      try {
        const result = await cloudinary.uploader.upload(img.file, { folder: img.folder, public_id: img.id, overwrite: true });
        console.log(`URL for ${img.id}: ${result.secure_url}`);
      } catch (err) {
        console.error(`Error uploading ${img.file}:`, err);
      }
    } else {
      console.log(`File not found: ${img.file}`);
    }
  }
}

uploadImages();
