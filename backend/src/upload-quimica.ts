import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';

cloudinary.config({ 
  cloud_name: 'dqm3syhwr', 
  api_key: '469121327526224', 
  api_secret: 'VuuszgyIVRd-sTA0u-pVsE-9u-0' 
});

const IMAGES = [
  'C:\\Users\\lucas\\Desktop\\Rutas\\Ruta Quimica\\cap 1.webp'
];

async function uploadImages() {
  console.log('Subiendo nuevas imágenes a Cloudinary...');
  for (const filePath of IMAGES) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'quimica',
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      console.log(`Subida: ${path.basename(filePath)} -> ${result.secure_url}`);
    } catch (err) {
      console.error(`Error al subir ${filePath}:`, err);
    }
  }
}

uploadImages();
