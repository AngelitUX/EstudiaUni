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

async function updateGuides() {
  console.log('🔄 Iniciando actualización de Guías de M1 en Firestore...');
  
  const guideDataPath = path.join(__dirname, 'guide-data.json');
  const guideDataRaw = fs.readFileSync(guideDataPath, 'utf-8');
  const guideData = JSON.parse(guideDataRaw);

  const capitulosRef = db.collection('lp_capitulos');

  try {
    for (const [capId, capData] of Object.entries(guideData)) {
      const capDocRef = capitulosRef.doc(capId);
      const capDoc = await capDocRef.get();
      
      if (!capDoc.exists) {
        console.warn(`⚠️ Capítulo ${capId} no encontrado. Saltando.`);
        continue;
      }

      // Actualizar la introducción del capítulo
      await capDocRef.update({
        introduccion: (capData as any).introduccion
      });
      console.log(`✅ Capítulo actualizado: ${capId}`);

      // Actualizar las secciones
      const secData = (capData as any).secciones;
      for (const [secId, secContent] of Object.entries(secData)) {
        const secDocRef = capDocRef.collection('secciones').doc(secId);
        const secDoc = await secDocRef.get();
        
        if (secDoc.exists) {
          await secDocRef.update({
            introduccion: (secContent as any).introduccion,
            datos_claves: (secContent as any).datos_claves || []
          });
          console.log(`  ✅ Sección actualizada: ${secId}`);
        } else {
          console.warn(`  ⚠️ Sección ${secId} no encontrada en ${capId}.`);
        }
      }
    }
    
    console.log('🎉 Actualización de Guías completada con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
    process.exit(1);
  }
}

updateGuides();
