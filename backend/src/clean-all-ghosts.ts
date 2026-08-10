import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    })
  });
}

const db = admin.firestore();

async function run() {
  const caps = await db.collection('lp_capitulos').get();
  
  // Nombres válidos que TENEMOS nosotros
  const validCaps = ['cap-1', 'cap-interpretar'];
  
  for (const doc of caps.docs) {
    if (!validCaps.includes(doc.id)) {
      console.log('🗑️ Deleting ghost chapter:', doc.id);
      
      // Delete sections of this chapter
      const secs = await doc.ref.collection('secciones').get();
      for (const sec of secs.docs) {
        await sec.ref.delete();
      }
      
      // Delete the chapter itself
      await doc.ref.delete();
    } else {
      console.log('✅ Keeping valid chapter:', doc.id);
    }
  }
}

run();
