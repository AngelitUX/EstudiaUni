import { v2 as cloudinary } from 'cloudinary';
import { configureCloudinary } from './cloudinary.config';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

configureCloudinary();

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
