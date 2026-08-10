import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqm3syhwr',
  api_key: process.env.CLOUDINARY_API_KEY || '469121327526224',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'VuuszgyIVRd-sTA0u-pVsE-9u-0',
});

const FILE_PATH = path.resolve(__dirname, '../../../frontend-app/src/assets/universidades-carreras.enriched.json');

async function run() {
  const resource = await cloudinary.uploader.upload(FILE_PATH, {
    folder: 'data',
    public_id: 'universidades-carreras',
    resource_type: 'raw',
    overwrite: true,
  });
  console.log('Uploaded to:', resource.secure_url);
}

run().catch((e) => { console.error(e); process.exit(1); });
