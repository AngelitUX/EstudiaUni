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

async function cleanup() {
  console.log('🧹 Limpiando datos de química...');

  try {
    // 1. Limpiar tests de química
    const testsSnap = await db.collection('lp_tests').where('materiaId', '==', 'ciencias-quimica').get();
    for (const doc of testsSnap.docs) {
      await doc.ref.delete();
      console.log(`🗑️ Eliminado de lp_tests: ${doc.id}`);
    }

    // 2. Limpiar capítulos y sus subcolecciones de secciones
    const capSnap = await db.collection('lp_capitulos').where('materiaId', '==', 'ciencias-quimica').get();
    for (const cap of capSnap.docs) {
      const seccionesSnap = await cap.ref.collection('secciones').get();
      for (const sec of seccionesSnap.docs) {
        await sec.ref.delete();
        console.log(`🗑️ Eliminada sección: ${sec.id}`);
      }
      await cap.ref.delete();
      console.log(`🗑️ Eliminado capítulo: ${cap.id}`);
    }

    console.log('✅ Limpieza finalizada.');
  } catch (error) {
    console.error('❌ Error limpiando:', error);
  }
}

cleanup();
