import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Firebase admin is probably already initialized in the NestJS context if we run it via ts-node,
// but to make it a standalone script, let's initialize it here.
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
    storageBucket: `${projectId}.appspot.com`,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

const ASSETS_DIR = path.resolve(__dirname, '../../../frontend-app/src/assets/images');

async function uploadFile(filePath: string, destination: string): Promise<string> {
  await bucket.upload(filePath, {
    destination,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  const file = bucket.file(destination);
  await file.makePublic();
  
  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

async function scanAndUpload() {
  const folders = fs.readdirSync(ASSETS_DIR);
  
  for (const folder of folders) {
    const folderPath = path.join(ASSETS_DIR, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    console.log(`Processing folder: ${folder}`);
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;
      
      const filePath = path.join(folderPath, file);
      const destination = `images/${folder}/${file}`;
      
      try {
        const publicUrl = await uploadFile(filePath, destination);
        console.log(`Uploaded ${file} to ${publicUrl}`);
        
        // Update Firestore
        // The local imageUrl was typically 'assets/images/FOLDER/FILE.png'
        const localUrl = `assets/images/${folder}/${file}`;
        
        // Search in preguntas where imageUrl == localUrl
        const preguntasRef = db.collection('preguntas');
        const snapshot = await preguntasRef.where('imageUrl', '==', localUrl).get();
        
        if (!snapshot.empty) {
          const batch = db.batch();
          snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, { imageUrl: publicUrl });
          });
          await batch.commit();
          console.log(`Updated ${snapshot.size} preguntas for ${localUrl}`);
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }
  }
  
  console.log('Done!');
}

scanAndUpload().catch(console.error);
