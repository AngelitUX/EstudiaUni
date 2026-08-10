import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  if (privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } else {
    // Intentar inicializar con la cuenta por defecto de GCP si está disponible
    admin.initializeApp();
  }
}

const db = admin.firestore();

// Archivo de mocks locales
const mockPath = path.join(__dirname, '../../frontend-app/src/assets/mocks/capitulos-mock-local.json');

async function uploadNewFeedbacks() {
  console.log('🚀 Iniciando proceso de migración de feedbacks de matemáticas (M1 y M2) a Firestore...');

  if (!fs.existsSync(mockPath)) {
    console.error(`❌ Error: No se encontró el archivo de mocks en: ${mockPath}`);
    process.exit(1);
  }

  const capitulos = JSON.parse(fs.readFileSync(mockPath, 'utf-8'));
  
  // Filtrar solo M1 y M2
  const mathCapIds = [
    'cap-m1-1-numeros', 'cap-m1-2-algebra', 'cap-m1-3-geometria', 'cap-m1-4-datos',
    'cap-m2-1-numeros', 'cap-m2-2-algebra', 'cap-m2-3-geometria', 'cap-m2-4-datos'
  ];

  const mathCapitulos = capitulos.filter((c: any) => mathCapIds.includes(c.id));
  console.log(`📚 Capítulos de matemáticas cargados localmente para subir: ${mathCapitulos.length}`);

  try {
    const capitulosRef = db.collection('lp_capitulos');
    const testsRef = db.collection('lp_tests');

    for (const cap of mathCapitulos) {
      console.log(`\n==================================================`);
      console.log(`⚙️ Procesando capítulo: ${cap.id} (${cap.title})`);

      // 1. Limpieza de secciones antiguas de este capítulo en Firestore
      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');
      console.log(`  🧹 Limpiando secciones anteriores de ${cap.id}...`);
      const oldSecs = await seccionesRef.get();
      for (const secDoc of oldSecs.docs) {
        // Limpiar el test correspondiente en lp_tests
        const secData = secDoc.data();
        if (secData.testId) {
          await testsRef.doc(secData.testId).delete();
          console.log(`    🗑️ Test borrado: ${secData.testId}`);
        }
        await secDoc.ref.delete();
      }
      console.log(`  ✅ Secciones antiguas eliminadas.`);

      // 2. Separar secciones para subida
      const { secciones, ...capituloData } = cap;

      // 3. Escribir/Actualizar el capítulo principal
      await capitulosRef.doc(cap.id).set(capituloData, { merge: true });
      console.log(`  ✅ Capítulo actualizado en lp_capitulos.`);

      // 4. Subir las nuevas secciones y sus respectivos tests con feedbacks conceptuales
      for (const sec of secciones) {
        const { test, ...seccionData } = sec;

        const secWithMetadata = {
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id,
          testId: test.id
        };

        // Crear documento de la sección
        await seccionesRef.doc(sec.id).set(secWithMetadata);

        // Crear documento del test con las preguntas
        await testsRef.doc(test.id).set({
          ...test,
          seccionId: sec.id
        });
        console.log(`  👉 Paso "${sec.title}" subido (sección y test).`);
      }
      console.log(`✅ Capítulo ${cap.id} completado con éxito.`);
    }

    console.log('\n🎉 ¡Proceso de migración a Firestore completado con éxito!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error durante la migración a Firestore:', error.message || error);
    process.exit(1);
  }
}

uploadNewFeedbacks();
