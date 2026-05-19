import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

async function activateMateria() {
  console.log('Activating "mat1" in lp_materias...');
  await db.collection('lp_materias').doc('mat1').set({ isActive: true }, { merge: true });
  console.log('✅ Successfully activated "mat1" (Matemática 1) in Firestore!');
  process.exit(0);
}

activateMateria();
