import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || 'estudiauni';
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (privateKey && clientEmail) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  admin.initializeApp({ projectId });
}

const db = admin.firestore();

async function check() {
  const caps = await db.collection('lp_capitulos').where('materiaId', '==', 'ciencias-biologia').get();
  for (const doc of caps.docs) {
    const secs = await doc.ref.collection('secciones').get();
    for (const sec of secs.docs) {
      console.log('Sec:', sec.id, sec.data().title);
      console.log('  testId:', sec.data().testId);
    }
  }
}

check().catch(console.error);
