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

async function deleteOldChapter() {
  console.log('🧹 Limpiando capítulo antiguo...');
  const oldCapId = 'cap-historia-1';
  
  try {
    const seccionesSnap = await db.collection('lp_capitulos').doc(oldCapId).collection('secciones').get();
    for (const doc of seccionesSnap.docs) {
      await doc.ref.delete();
      console.log(`🗑️ Eliminada sección antigua: ${doc.id}`);
    }
    await db.collection('lp_capitulos').doc(oldCapId).delete();
    console.log(`🗑️ Eliminado capítulo antiguo: ${oldCapId}`);
  } catch (err) {
    console.error('Error al limpiar:', err);
  }
}

deleteOldChapter();
