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

// Carga dinámica en tiempo de ejecución para evitar que tsc altere la estructura de dist
// tslint:disable-next-line:no-var-requires
const { MATERIAS, CAPITULOS } = require('../../frontend-app/src/app/features/learning-path/data/seed-data');

async function seedFirestore() {
  console.log('🌱 Starting learning path seed...');

  try {
    // 1. Materias
    const materiasRef = db.collection('lp_materias');
    for (const materia of MATERIAS) {
      await materiasRef.doc(materia.id).set(materia);
      console.log(`✅ Materia seeded: ${materia.id}`);
    }

    // 2. Capitulos & Secciones
    const capitulosRef = db.collection('lp_capitulos');
    for (const cap of CAPITULOS) {
      const { secciones, ...capituloData } = cap;
      await capitulosRef.doc(cap.id).set(capituloData);
      console.log(`✅ Capítulo seeded: ${cap.id}`);

      // Secciones collection under capitulo
      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');
      
      // Borrar nodos antiguos para evitar duplicados y fantasmas
      const oldSecciones = await seccionesRef.get();
      for (const doc of oldSecciones.docs) {
        await doc.ref.delete();
      }
      console.log(`🧹 Limpiadas secciones antiguas de ${cap.id}`);

      for (const sec of secciones) {
        const { test, ...seccionData } = sec;

        // Add materiaId and capituloId back for easier querying
        const secWithIds: any = {
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id
        };

        if (test) {
          secWithIds.testId = test.id; // Link to test
        }

        await seccionesRef.doc(sec.id).set(secWithIds);
        console.log(`✅ Sección seeded: ${sec.id}`);

        // 3. Tests (stored in a separate root collection)
        if (test) {
          const testsRef = db.collection('lp_tests');
          await testsRef.doc(test.id).set({
            ...test,
            seccionId: sec.id
          });
          console.log(`✅ Test seeded: ${test.id}`);
        }
      }
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
  }
}

seedFirestore();
