import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const db = admin.firestore();

async function clean() {
  console.log('Borrando capítulos duplicados...');
  const idsToDelete = ['cap-localizar', 'cap-2'];
  for (const id of idsToDelete) {
    const docRef = db.collection('lp_capitulos').doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      const secs = await docRef.collection('secciones').get();
      for (const sec of secs.docs) {
        await sec.ref.delete();
      }
      await docRef.delete();
      console.log('Eliminado: ' + id);
    }
  }
}

clean();