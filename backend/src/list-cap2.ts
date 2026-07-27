import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey }) });
const db = admin.firestore();
async function list() {
  const secs = await db.collection('lp_capitulos').doc('cap-interpretar').collection('secciones').orderBy('order').get();
  secs.docs.forEach(s => console.log('order:', s.data().order, '| id:', s.id, '| title:', s.data().title));
  console.log('TOTAL:', secs.size);
}
list();