const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

async function deleteCollection(collectionRef) {
  const snapshot = await collectionRef.get();
  for (const doc of snapshot.docs) {
    await doc.ref.delete();
  }
}

async function run() {
  console.log('🧹 [EstudiaUni] Iniciando eliminación de capítulos huérfanos...');

  const orphanIds = ['cap-mat1-1', 'cap-mat2-1'];

  for (const capId of orphanIds) {
    const capRef = db.collection('lp_capitulos').doc(capId);
    const capSnap = await capRef.get();

    if (capSnap.exists) {
      console.log(`\n❌ Encontrado capítulo huérfano: ${capId} ("${capSnap.data().title}")`);

      // 1. Eliminar secciones en la subcolección
      const seccionesRef = capRef.collection('secciones');
      const secSnap = await seccionesRef.get();
      console.log(`   - Eliminando ${secSnap.size} secciones...`);
      for (const secDoc of secSnap.docs) {
        const secData = secDoc.data();
        
        // Si la sección tiene un testId, eliminar el test correspondiente de lp_tests
        if (secData.testId) {
          const testRef = db.collection('lp_tests').doc(secData.testId);
          const testSnap = await testRef.get();
          if (testSnap.exists) {
            await testRef.delete();
            console.log(`     - Test eliminado: ${secData.testId}`);
          }
        }
        
        await secDoc.ref.delete();
      }

      // 2. Eliminar el documento de capítulo
      await capRef.delete();
      console.log(`   - Capítulo ${capId} eliminado con éxito de Firestore.`);
    } else {
      console.log(`\nℹ️ El capítulo ${capId} no existe en Firestore.`);
    }
  }

  console.log('\n🎉 ¡Limpieza de capítulos huérfanos finalizada con éxito!');
}

run().catch(error => {
  console.error('❌ Error durante la limpieza:', error);
  process.exit(1);
});
