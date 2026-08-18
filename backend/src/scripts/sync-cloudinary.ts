import { v2 as cloudinary } from 'cloudinary';
import { configureCloudinary } from './cloudinary.config';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

configureCloudinary();

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

async function run() {
  console.log('Fetching all resources from Cloudinary (imagenes folder)...');
  
  let resources: any[] = [];
  let nextCursor = undefined;
  
  do {
    const result = await cloudinary.search
      .expression('folder:imagenes/*')
      .max_results(500)
      .next_cursor(nextCursor)
      .execute();
      
    resources = resources.concat(result.resources);
    nextCursor = result.next_cursor;
    console.log(`Fetched ${resources.length} resources so far...`);
  } while (nextCursor);

  console.log(`Total Cloudinary resources fetched: ${resources.length}`);
  
  const mapping = new Map<string, string>();
  
  for (const res of resources) {
    // res.asset_folder is like "imagenes/B-2024-IMAGENES"
    // res.public_id is like "77_twjubk"
    
    if (res.asset_folder && res.asset_folder.startsWith('imagenes/')) {
      const folderName = res.asset_folder.split('/')[1]; // e.g., "B-2024-IMAGENES"
      const fileNameWithRandom = res.public_id; // e.g., "77_twjubk"
      
      const originalFileNumber = fileNameWithRandom.split('_')[0]; // "77"
      
      const expectedOldUrl = `assets/images/${folderName}/${originalFileNumber}.png`;
      mapping.set(expectedOldUrl, res.secure_url);
    }
  }
  
  console.log(`Built mapping for ${mapping.size} images.`);
  
  console.log('Fetching all questions from Firestore...');
  const snapshot = await db.collection('preguntas').get();
  
  let updatedCount = 0;
  let batch = db.batch();
  let currentBatchSize = 0;
  let totalBatches = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Reverse engineer if it's already a wrong cloudinary URL
    let expectedOldUrl = '';
    
    if (data.imageUrl && data.imageUrl.startsWith('assets/images/')) {
        expectedOldUrl = data.imageUrl;
    } else if (data.imageUrl && data.imageUrl.includes('res.cloudinary.com')) {
        // e.g., https://res.cloudinary.com/dqm3syhwr/image/upload/imagenes/B-2024-IMAGENES/1.png
        const match = data.imageUrl.match(/\/imagenes\/([^\/]+)\/(\d+)\.png$/);
        if (match) {
            const folderName = match[1]; // B-2024-IMAGENES
            const originalFileNumber = match[2]; // 1
            expectedOldUrl = `assets/images/${folderName}/${originalFileNumber}.png`;
        }
    }
    
    if (expectedOldUrl) {
      const secureUrl = mapping.get(expectedOldUrl);
      if (secureUrl && secureUrl !== data.imageUrl) { // Only update if it's different!
        batch.update(doc.ref, { imageUrl: secureUrl });
        updatedCount++;
        currentBatchSize++;
        
        if (currentBatchSize === 500) {
          await batch.commit();
          batch = db.batch();
          totalBatches++;
          console.log(`Committed batch ${totalBatches} (${updatedCount} total updates)`);
          currentBatchSize = 0;
        }
      }
    }
  }

  if (currentBatchSize > 0) {
    await batch.commit();
    totalBatches++;
    console.log(`Committed final batch ${totalBatches} (${updatedCount} total updates)`);
  }

  console.log(`Finished! Successfully updated ${updatedCount} questions with their correct Cloudinary URLs.`);
}

run().catch(console.error);
