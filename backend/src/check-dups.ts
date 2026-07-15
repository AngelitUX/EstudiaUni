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
  console.log('🔍 Revisando subcolecciones de secciones en lp_capitulos...');
  const capSnap = await db.collection('lp_capitulos').where('materiaId', '==', 'ciencias-quimica').get();
  for (const cap of capSnap.docs) {
    console.log(`\nCapítulo: ${cap.id}`);
    const secSnap = await cap.ref.collection('secciones').get();
    for (const sec of secSnap.docs) {
      console.log(`  Sección: ${sec.id} - ${sec.data().title}`);
    }
  }
}

check();
