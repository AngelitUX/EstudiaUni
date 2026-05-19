const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

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

async function run() {
  const snap = await db.collection('lp_capitulos').get();
  console.log('--- Firestore Chapters ---');
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id} | Title: ${data.title} | MateriaID: ${data.materiaId}`);
  });
}

run().catch(console.error);
