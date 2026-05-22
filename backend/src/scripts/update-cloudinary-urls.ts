import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
  });
}

const db = admin.firestore();

async function updateCloudinaryUrls() {
  console.log('Iniciando actualización de URLs a Cloudinary...');
  const preguntasRef = db.collection('preguntas');
  const snapshot = await preguntasRef.get();
  
  if (snapshot.empty) {
    console.log('No se encontraron preguntas en la base de datos.');
    return;
  }

  let updatedCount = 0;
  let batch = db.batch();
  let operationCount = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.imageUrl && data.imageUrl.startsWith('assets/images/')) {
      // data.imageUrl = 'assets/images/B-2024-IMAGENES/71.png'
      // target = 'https://res.cloudinary.com/dqm3syhwr/image/upload/imagenes/B-2024-IMAGENES/71.png'
      
      const newUrl = data.imageUrl.replace('assets/images/', 'https://res.cloudinary.com/dqm3syhwr/image/upload/imagenes/');
      
      batch.update(doc.ref, { imageUrl: newUrl });
      updatedCount++;
      operationCount++;

      // Commit batches of 500 (Firestore limit)
      if (operationCount === 500) {
        batch.commit();
        batch = db.batch();
        operationCount = 0;
        console.log(`Lote commiteado. Total actualizados hasta ahora: ${updatedCount}`);
      }
    }
  });

  if (operationCount > 0) {
    await batch.commit();
    console.log(`Lote final commiteado. Total actualizados: ${updatedCount}`);
  } else {
    console.log(`Finalizado. Total actualizados: ${updatedCount}`);
  }
}

updateCloudinaryUrls().catch(console.error);
