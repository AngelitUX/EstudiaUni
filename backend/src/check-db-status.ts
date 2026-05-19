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

async function checkStatus() {
  console.log('--- Checking Firestore collections for "mat1" ---');
  
  // 1. Check lp_materias for mat1
  const materiaDoc = await db.collection('lp_materias').doc('mat1').get();
  console.log('lp_materias (mat1):', materiaDoc.exists ? materiaDoc.data() : 'NOT FOUND');

  // 2. Check ALL lp_capitulos
  const capsSnap = await db.collection('lp_capitulos').get();
  console.log(`lp_capitulos: Found ${capsSnap.size} documents.`);
  capsSnap.docs.forEach(doc => {
    console.log(`  - Cap ID: ${doc.id}, MateriaId: ${doc.data().materiaId}, Title: ${doc.data().title || doc.data().nombre}`);
  });

  // 3. Check ALL lp_tests
  const testsSnap = await db.collection('lp_tests').get();
  console.log(`lp_tests: Found ${testsSnap.size} documents.`);
  testsSnap.docs.forEach(doc => {
    console.log(`  - Test ID: ${doc.id}`);
  });

  process.exit(0);
}

checkStatus();
