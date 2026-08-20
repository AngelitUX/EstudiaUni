import { v2 as cloudinary } from 'cloudinary';
import { configureCloudinary } from './scripts/cloudinary.config';
import * as path from 'path';

configureCloudinary();

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
