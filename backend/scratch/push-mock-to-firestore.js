const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const serviceAccountPath = path.join(__dirname, '../firebase-admin-key.json');
if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    console.log('🔑 Usando archivo de credenciales local firebase-admin-key.json...');
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath))
    });
  } else {
    console.log('🔑 Usando credenciales de variables de entorno...');
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }
}

const db = admin.firestore();

async function run() {
  console.log('🚀 [EstudiaUni] Iniciando subida masiva de datos locales a Firestore...');

  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  const materiasPath = path.join(mocksDir, 'materias-mock-local.json');
  const capitulosPath = path.join(mocksDir, 'capitulos-mock-local.json');

  if (!fs.existsSync(materiasPath) || !fs.existsSync(capitulosPath)) {
    console.error('❌ Error: No se encontraron los archivos mock locales en frontend-app.');
    process.exit(1);
  }

  const materias = JSON.parse(fs.readFileSync(materiasPath, 'utf8'));
  const capitulos = JSON.parse(fs.readFileSync(capitulosPath, 'utf8'));

  // 1. Subir Materias
  console.log('\n🌱 Subiendo materias a "lp_materias"...');
  for (const mat of materias) {
    if (mat.id === 'mat1' || mat.id === 'mat2') {
      await db.collection('lp_materias').doc(mat.id).set(mat);
      console.log(`   ✅ Materia subida: ${mat.title} (${mat.id})`);
    } else {
      console.log(`   ⚠️ Ignorando materia no matemática: ${mat.title} (${mat.id})`);
    }
  }

  // 2. Subir Capítulos, Secciones y Tests
  console.log('\n📖 Procesando capítulos, secciones y tests...');
  const capitulosRef = db.collection('lp_capitulos');
  const testsRef = db.collection('lp_tests');

  for (const cap of capitulos) {
    if (cap.materiaId !== 'mat1' && cap.materiaId !== 'mat2') {
      console.log(`   ⚠️ Ignorando capítulo de otra materia: ${cap.title} (${cap.materiaId})`);
      continue;
    }
    const { secciones, ...capituloData } = cap;

    // Subir Capítulo
    await capitulosRef.doc(cap.id).set(capituloData);
    console.log(`\n📂 Capítulo: ${cap.title} (${cap.id})`);

    const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');

    // Limpiar secciones antiguas para evitar duplicados huérfanos
    const oldSecs = await seccionesRef.get();
    for (const doc of oldSecs.docs) {
      await doc.ref.delete();
    }

    // Subir cada sección y su correspondiente test
    for (const sec of secciones) {
      const { test, ...seccionData } = sec;

      if (test) {
        // Subir Test a la colección raíz lp_tests
        await testsRef.doc(test.id).set({
          ...test,
          seccionId: sec.id
        });
        seccionData.testId = test.id;
      }

      // Asegurar campos de enlace
      seccionData.materiaId = cap.materiaId;
      seccionData.capituloId = cap.id;

      // Subir Sección
      await seccionesRef.doc(sec.id).set(seccionData);
      console.log(`   ⚡ Paso: ${sec.title} -> Test: ${test ? test.preguntas.length + ' preguntas' : 'Sin preguntas'}`);
    }
  }

  console.log('\n🎉 ¡PROCESO FINALIZADO CON ÉXITO! Todos los datos locales se han subido y ordenado en Firestore.');
}

run().catch(error => {
  console.error('❌ Error durante la subida:', error);
  process.exit(1);
});
