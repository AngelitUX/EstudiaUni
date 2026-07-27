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

async function check() {
  console.log('Buscando capitulos de comp-lectora...');
  const caps = await db.collection('lp_capitulos').where('materiaId', '==', 'comp-lectora').get();
  for (const doc of caps.docs) {
    console.log('Capítulo:', doc.id, '-', doc.data().title);
    const secs = await doc.ref.collection('secciones').get();
    console.log('  Secciones (' + secs.size + '):');
    for (const sec of secs.docs) {
      console.log('    - ' + sec.id + ' (' + sec.data().title + ')');
    }
  }
}

check();