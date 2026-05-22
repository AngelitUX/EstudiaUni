import { v2 as cloudinary } from 'cloudinary';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

cloudinary.config({ 
  cloud_name: 'dqm3syhwr', 
  api_key: '469121327526224', 
  api_secret: 'VuuszgyIVRd-sTA0u-pVsE-9u-0' 
});

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();
const ASSETS_DIR = 'C:\\Users\\lucas\\Desktop\\proyecto\\estudiauni.cl\\frontend-app\\src\\assets\\img';

async function uploadFile(filePath: string, category: string) {
  const fileName = path.basename(filePath);
  const docId = path.parse(fileName).name + (category === 'root' ? '' : '_' + category.replace(' ', '_'));

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'decoraciones/' + category,
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    console.log(`Uploaded ${fileName} to Cloudinary: ${result.secure_url}`);

    await db.collection('fotosDecoraciones').doc(docId).set({
      name: fileName,
      category: category,
      url: result.secure_url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`Saved ${fileName} to Firestore fotosDecoraciones`);
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
  }
}

async function run() {
  const directories = [
    { path: ASSETS_DIR, category: 'root' },
    { path: path.join(ASSETS_DIR, 'seccion noticias'), category: 'seccion noticias' },
    { path: path.join(ASSETS_DIR, 'seccion opiniones'), category: 'seccion opiniones' }
  ];

  for (const dir of directories) {
    if (fs.existsSync(dir.path)) {
      const files = fs.readdirSync(dir.path);
      for (const file of files) {
        const fullPath = path.join(dir.path, file);
        if (fs.statSync(fullPath).isFile()) {
          await uploadFile(fullPath, dir.category);
        }
      }
    }
  }
  
  console.log('Finished uploading all decorative images!');
}

run().catch(console.error);
