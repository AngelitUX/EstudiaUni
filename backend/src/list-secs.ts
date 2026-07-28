import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey }) });
const db = admin.firestore();
async function list() {
  const caps = await db.collection('lp_capitulos').get();
  for (const cap of caps.docs) {
    console.log('CAP:', cap.id);
    const secs = await db.collection('lp_capitulos').doc(cap.id).collection('secciones').orderBy('order').get();
    secs.docs.forEach(s => console.log('  sec:', s.id, '| order:', s.data().order, '| title:', s.data().title));
  }
}
list();