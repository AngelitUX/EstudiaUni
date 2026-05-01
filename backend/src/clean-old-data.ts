import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});
const db = admin.firestore();

// IDs válidos del nuevo seed
const VALID_MATERIA_IDS  = new Set(['comp-lectora', 'mat1', 'historia', 'ciencias']);
const VALID_CAPITULO_IDS = new Set(['cap-localizar', 'cap-interpretar', 'cap-evaluar']);
const VALID_TEST_IDS     = new Set([
  'test-loc-1','test-loc-2','test-loc-3',
  'test-int-1','test-int-2','test-int-3','test-int-4','test-int-5','test-int-6',
  'test-ev-1','test-ev-2','test-ev-3','test-ev-4','test-ev-5','test-ev-6',
]);

async function cleanOldData() {
  console.log('🔍 Listando documentos existentes...\n');

  // ── MATERIAS ──────────────────────────────────────────────────────────
  const materias = await db.collection('lp_materias').get();
  console.log(`lp_materias (${materias.size} docs):`);
  for (const doc of materias.docs) {
    const valid = VALID_MATERIA_IDS.has(doc.id);
    console.log(`  ${valid ? '✅' : '🗑️ BORRAR'} ${doc.id} — "${(doc.data() as any).title || ''}" `);
    if (!valid) await doc.ref.delete();
  }

  // ── CAPÍTULOS ──────────────────────────────────────────────────────────
  const caps = await db.collection('lp_capitulos').get();
  console.log(`\nlp_capitulos (${caps.size} docs):`);
  for (const cap of caps.docs) {
    const valid = VALID_CAPITULO_IDS.has(cap.id);
    console.log(`  ${valid ? '✅' : '🗑️ BORRAR'} ${cap.id} — "${(cap.data() as any).title || ''}" `);
    if (!valid) {
      // Borrar secciones anidadas primero
      const secciones = await cap.ref.collection('secciones').get();
      for (const s of secciones.docs) {
        console.log(`     🗑️ sub-sección: ${s.id}`);
        await s.ref.delete();
      }
      await cap.ref.delete();
    } else {
      // Listar secciones del capítulo válido
      const secciones = await cap.ref.collection('secciones').get();
      console.log(`     secciones (${secciones.size}): ${secciones.docs.map(s => s.id).join(', ')}`);
    }
  }

  // ── TESTS ──────────────────────────────────────────────────────────────
  const tests = await db.collection('lp_tests').get();
  console.log(`\nlp_tests (${tests.size} docs):`);
  for (const doc of tests.docs) {
    const valid = VALID_TEST_IDS.has(doc.id);
    console.log(`  ${valid ? '✅' : '🗑️ BORRAR'} ${doc.id}`);
    if (!valid) await doc.ref.delete();
  }

  console.log('\n🎉 Limpieza completada.');
}

cleanOldData();
