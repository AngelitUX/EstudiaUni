import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey }) });
const db = admin.firestore();
async function clean() {
  const toDelete = ['sec-2-0-guia','int-1','int-2','int-3','int-4','int-5','int-6','int-7','int-8','int-9','int-10','int-11','int-boss','prac-int-vocab','prac-int-conn'];
  const capRef = db.collection('lp_capitulos').doc('cap-interpretar');
  for (const id of toDelete) {
    const ref = capRef.collection('secciones').doc(id);
    const doc = await ref.get();
    if (doc.exists) { await ref.delete(); console.log('Deleted:', id); }
    else { console.log('Not found:', id); }
  }
  console.log('Done');
}
clean();