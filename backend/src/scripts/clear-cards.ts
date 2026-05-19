import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function clearCards() {
  console.log('Clearing datos_claves for sections in cap-localizar...');
  
  const seccionesRef = db.collection('lp_capitulos').doc('cap-localizar').collection('secciones');
  const snapshot = await seccionesRef.get();
  
  if (snapshot.empty) {
    console.log('No sections found in cap-localizar');
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    console.log(`Clearing datos_claves for: ${doc.id}`);
    batch.update(doc.ref, { datos_claves: [] });
  });

  await batch.commit();
  console.log('✅ All 5 tarjetas (datos_claves) in cap-localizar have been emptied in Firestore.');
}

clearCards().catch(console.error).finally(() => process.exit(0));
