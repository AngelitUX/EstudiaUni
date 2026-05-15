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

// ─── Helpers ───
async function deleteCollection(path: string) {
  const snap = await db.collection(path).get();
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  if (snap.size > 0) { await batch.commit(); console.log(`  🗑️  ${snap.size} docs borrados de ${path}`); }
}

async function deleteSubcollections() {
  const caps = await db.collection('lp_capitulos').get();
  for (const cap of caps.docs) {
    const secs = await db.collection(`lp_capitulos/${cap.id}/secciones`).get();
    const batch = db.batch();
    secs.docs.forEach(d => batch.delete(d.ref));
    if (secs.size > 0) { await batch.commit(); console.log(`  🗑️  ${secs.size} secciones borradas de ${cap.id}`); }
  }
}

// ─── MATERIAS ───
const MATERIAS = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '📐', order: 2, isActive: false },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 4, isActive: false },
];

// ─── CAP 1 DATA ───
// Instead of inlining all 20 questions, we load from the frontend compiled data
async function loadCapData() {
  const path = require('path');
  const { execSync } = require('child_process');
  const frontendDir = path.resolve(__dirname, '../../frontend-app');
  const outDir = path.resolve(frontendDir, 'dist-seed-temp');

  console.log('  📦 Compilando datos del frontend...');
  execSync(
    `npx tsc --outDir "${outDir}" --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck --declaration false ` +
    `src/app/features/learning-path/data/cap1-localizar-data.ts ` +
    `src/app/features/learning-path/data/cap1-localizar-nodos45.ts ` +
    `src/app/features/learning-path/models/paes.models.ts`,
    { cwd: frontendDir, stdio: 'pipe' }
  );

  const { CAP1_LOCALIZAR } = require(
    path.join(outDir, 'data/cap1-localizar-data.js')
  );

  // Cleanup
  const fs = require('fs');
  fs.rmSync(outDir, { recursive: true, force: true });
  console.log('  ✅ Datos cargados y temp limpiado');

  return CAP1_LOCALIZAR;
}

// ─── MAIN ───
async function seed() {
  console.log('\n🔥 SEED: Capítulo 1 — Habilidad de Localizar\n');

  // 1. Clean only cap-localizar data (NOT all collections)
  console.log('Paso 1: Limpiando datos de cap-localizar...');
  const locSecs = await db.collection('lp_capitulos/cap-localizar/secciones').get();
  for (const s of locSecs.docs) {
    // Delete related test
    const testId = s.data().testId;
    if (testId) await db.collection('lp_tests').doc(testId).delete().catch(() => {});
    await s.ref.delete();
  }
  if (locSecs.size > 0) console.log(`  🗑️  ${locSecs.size} secciones y tests de cap-localizar borrados`);
  console.log('  ✅ Datos de cap-localizar limpiados\n');

  // 2. Materias
  console.log('Paso 2: Subiendo materias...');
  for (const m of MATERIAS) {
    await db.collection('lp_materias').doc(m.id).set(m);
  }
  console.log(`  ✅ ${MATERIAS.length} materias subidas\n`);

  // 3. Load cap data
  console.log('Paso 3: Cargando datos del capítulo...');
  const cap = await loadCapData();

  // 4. Upload
  console.log('\nPaso 4: Subiendo capítulo, secciones y tests...');
  await db.collection('lp_capitulos').doc(cap.id).set({
    id: cap.id,
    materiaId: cap.materiaId,
    title: cap.title,
    introduccion: cap.introduccion,
    order: cap.order,
  });
  console.log(`  📖 Capítulo: ${cap.title}`);

  for (const sec of cap.secciones) {
    const test = sec.test;

    // Upload test
    await db.collection('lp_tests').doc(test.id).set({
      id: test.id,
      seccionId: test.seccionId,
      contexto_base: test.contexto_base,
      preguntas: test.preguntas,
    });
    console.log(`  🧪 Test: ${test.id} (${test.preguntas.length} preguntas)`);

    // Upload seccion
    await db.collection('lp_capitulos').doc(cap.id).collection('secciones').doc(sec.id).set({
      id: sec.id,
      capituloId: sec.capituloId,
      materiaId: sec.materiaId,
      title: sec.title,
      introduccion: sec.introduccion,
      guia_titulo: sec.guia_titulo || null,
      guia_contenido: sec.guia_contenido || null,
      datos_claves: sec.datos_claves,
      order: sec.order,
      isBoss: sec.isBoss || false,
      testId: test.id,
    });
    console.log(`  📝 Sección: ${sec.title}`);
  }

  console.log(`\n🎉 ¡Seed completado! ${cap.secciones.length} secciones subidas.\n`);
  process.exit(0);
}

seed().catch(err => { console.error('❌ Error:', err); process.exit(1); });
