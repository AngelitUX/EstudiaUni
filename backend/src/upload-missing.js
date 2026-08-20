const cloudinary = require('cloudinary').v2;

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

const uploadImages = async () => {
  const images = [
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1-5.jpg', folder: 'quimica/cap1', id: 'sec-1-5' },
    { file: 'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\Imagenes Guia\\1-6.jfif', folder: 'quimica/cap1', id: 'sec-1-6' }
  ];

  for (const img of images) {
    try {
      console.log(`Uploading ${img.file}...`);
      const result = await cloudinary.uploader.upload(img.file, { folder: img.folder, public_id: img.id, overwrite: true });
      console.log(`URL for ${img.id}: ${result.secure_url}`);
    } catch (err) {
      console.error(`Error uploading ${img.file}:`, err.message);
    }
  }
}

uploadImages();
