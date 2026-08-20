import { v2 as cloudinary } from 'cloudinary';
import { configureCloudinary } from './cloudinary.config';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

configureCloudinary();

const ASSETS_DIR = path.resolve(__dirname, '../../../frontend-app/src/assets/img');
// focoBiologia.gif / focoFisica.gif were 31-36MB raw screen recordings — compressed via
// gifsicle (resize to 480w, lossy=100, 128 colors) to fit Cloudinary's 10MB upload cap.
const COMPRESSED_OVERRIDE_DIR = path.resolve(__dirname, '../../tmp-gif-compress');
const FOLDER = 'imagenes/branding';

const FILES = [
  'LogoEstudiaUni.png',
  'LogoEstudiaUniPREMIUM.png',
  'gif.gif',
  'focoBiologia.gif',
  'focoFisica.gif',
];

const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // Cloudinary's image upload cap on this plan

async function run() {
  const results: Record<string, string> = {};

  for (const file of FILES) {
    const compressedPath = path.join(COMPRESSED_OVERRIDE_DIR, file);
    const filePath = fs.existsSync(compressedPath) ? compressedPath : path.join(ASSETS_DIR, file);
    const baseName = path.parse(file).name;
    const sizeBytes = fs.statSync(filePath).size;

    console.log(`Uploading ${file} (${(sizeBytes / 1024 / 1024).toFixed(1)}MB${filePath === compressedPath ? ', compressed' : ''}) -> ${FOLDER}/${baseName} ...`);

    const resource: any = await cloudinary.uploader.upload(filePath, {
      folder: FOLDER,
      public_id: baseName,
      resource_type: 'image',
      overwrite: true,
    });

    // Build an optimized delivery URL: auto format (webp where supported) + auto quality.
    const optimizedUrl = cloudinary.url(`${FOLDER}/${baseName}`, {
      resource_type: 'image',
      secure: true,
      fetch_format: 'auto',
      quality: 'auto',
    });

    results[file] = optimizedUrl;
    console.log(`  -> raw: ${resource.secure_url}`);
    console.log(`  -> optimized: ${optimizedUrl}`);
  }

  console.log('\n=== RESULT MAP ===');
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
