const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dqm3syhwr', 
  api_key: '469121327526224', 
  api_secret: 'VuuszgyIVRd-sTA0u-pVsE-9u-0' 
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
