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

async function cleanupTopLevel() {
  console.log('🧹 Limpiando colecciones erróneas top-level...');
  const colecciones = ['capitulos', 'secciones', 'tests'];
  
  for (const col of colecciones) {
    const snap = await db.collection(col).where('materiaId', '==', 'ciencias-quimica').get();
    for (const doc of snap.docs) {
      await doc.ref.delete();
      console.log(`🗑️ Eliminado de ${col} (top-level): ${doc.id}`);
    }
  }

  // Materias top-level
  const matDoc = await db.collection('materias').doc('ciencias-quimica').get();
  if (matDoc.exists) {
    await matDoc.ref.delete();
    console.log(`🗑️ Eliminada materia top-level`);
  }
}

cleanupTopLevel();
