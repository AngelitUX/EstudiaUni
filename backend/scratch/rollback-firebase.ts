import * as admin from 'firebase-admin';

// Ruta absoluta para evitar errores de resolución
const serviceAccount = require('c:/Users/Shila/Documents/Proy/estudiauni.cl/backend/firebase-admin-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function rollbackFirebase() {
  console.log('🧹 Iniciando limpieza de campos nuevos en Firebase...');
  
  const capitulosRef = db.collection('lp_capitulos');

  try {
    // Lista de IDs que tocamos o que podrían tener estos campos ahora
    const targetIds = ['cap-m1-1-numeros', 'cap-localizar'];

    for (const id of targetIds) {
      const docRef = capitulosRef.doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        console.log(`🗑️ Eliminando campos 'slides' y 'quizzes' de: ${id}`);
        await docRef.update({
          slides: admin.firestore.FieldValue.delete(),
          quizzes: admin.firestore.FieldValue.delete()
        });
      }
    }
    
    console.log('✅ Firebase ha sido restaurado (campos eliminados).');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la restauración:', error);
    process.exit(1);
  }
}

rollbackFirebase();