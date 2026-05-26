import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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

async function uploadSlides() {
  console.log('🚀 Iniciando subida de diapositivas interactivas a Firebase...');
  
  // Usamos el mock local como fuente para las slides
  const mockPath = path.join(__dirname, '../../frontend-app/src/assets/mocks/capitulos-mock-local.json');
  const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));

  const capitulosRef = db.collection('lp_capitulos');

  try {
    for (const cap of mockData) {
      if (cap.slides && cap.slides.length > 0) {
        console.log(`📡 Subiendo slides para el capítulo: ${cap.id} (${cap.title})`);
        
        const capDocRef = capitulosRef.doc(cap.id);
        const capDoc = await capDocRef.get();
        
        if (!capDoc.exists) {
          console.warn(`  ⚠️ Capítulo ${cap.id} no existe en Firestore. Saltando.`);
          continue;
        }

        await capDocRef.update({
          slides: cap.slides,
          quizzes: cap.quizzes || {}
        });
        
        console.log(`  ✅ Slides actualizadas para ${cap.id}`);
      }
    }
    
    console.log('🎉 Proceso de subida de slides completado con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la subida:', error);
    process.exit(1);
  }
}

uploadSlides();
