/**
 * Construye los documentos RESUMEN que permiten a la app mostrar conteos sin
 * leer colecciones enteras:
 *
 *   1. pool_preguntas_meta/summary
 *      { updatedAt, total, byMateria: { <materiaId>: { total, temas: { <tema>: n } } } }
 *      -> lo usan Mini Ensayo (temas disponibles) y Mente Veloz (conteo por materia)
 *         para NO cargar las ~1.200 preguntas solo para contar.
 *
 *   2. Campos en cada lp_materias/{id}:
 *      { chapterCount, sectionCount, sectionCountByChapter: { <capId>: n } }
 *      -> los usa la Ruta de Aprendizaje para calcular progreso / "N Lecciones"
 *         sin el getDocs(collectionGroup('secciones')) de 401 lecturas.
 *
 * Uso:
 *   node tools/meta/build-meta.js            -> SIMULACION (no escribe, muestra el diff)
 *   node tools/meta/build-meta.js --commit   -> escribe de verdad
 *
 * Garantias deliberadas:
 *  · SOLO escribe pool_preguntas_meta/summary y campos en lp_materias/*.
 *    Ningun otro documento. Ningun .delete().
 *  · En lp_materias usa merge:true — no pisa el resto del documento.
 *  · Es de solo lectura sin --commit.
 *
 * Correr tras cada re-siembra de contenido (pool o Ruta). El panel de admin
 * ademas reconstruye pool_preguntas_meta solo tras cada edicion de preguntas.
 *
 * Credenciales: FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
 * en backend/.env (mismo patron que tools/pool-preguntas/upload.js).
 */
const path = require('path');

const RAIZ = path.join(__dirname, '..', '..');
const BACKEND = path.join(RAIZ, 'backend');
const commit = process.argv.includes('--commit');

async function main() {
  require(path.join(BACKEND, 'node_modules/dotenv')).config({ path: path.join(BACKEND, '.env') });
  const admin = require(path.join(BACKEND, 'node_modules/firebase-admin'));

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    console.error('Faltan FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY en backend/.env');
    process.exit(1);
  }
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  const db = admin.firestore();

  console.log(`Proyecto: ${projectId}`);
  console.log(commit ? 'MODO: ESCRITURA REAL (--commit)\n' : 'MODO: SIMULACION (sin --commit no se escribe nada)\n');

  // ─────────────────────────────────────────────────────────────────────────
  // 1. pool_preguntas_meta/summary
  // ─────────────────────────────────────────────────────────────────────────
  const poolSnap = await db.collection('pool_preguntas').select('materiaId', 'tema').get();
  const byMateria = {};
  poolSnap.forEach(d => {
    const { materiaId, tema } = d.data();
    if (!materiaId) return;
    byMateria[materiaId] = byMateria[materiaId] || { total: 0, temas: {} };
    byMateria[materiaId].total++;
    if (tema) byMateria[materiaId].temas[tema] = (byMateria[materiaId].temas[tema] || 0) + 1;
  });
  const poolMeta = {
    updatedAt: new Date().toISOString(),
    total: poolSnap.size,
    byMateria,
  };
  console.log('=== pool_preguntas_meta/summary ===');
  console.log(`  total: ${poolMeta.total}`);
  for (const [m, v] of Object.entries(byMateria)) {
    console.log(`  ${m}: ${v.total}  (${Object.keys(v.temas).length} temas)`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Conteos de secciones por materia -> lp_materias/*
  // ─────────────────────────────────────────────────────────────────────────
  const capsSnap = await db.collection('lp_capitulos').get();
  const materiaAgg = {}; // materiaId -> { chapterCount, sectionCount, sectionCountByChapter }
  for (const cap of capsSnap.docs) {
    const mat = cap.data().materiaId;
    if (!mat) continue;
    const secs = await cap.ref.collection('secciones').get();
    materiaAgg[mat] = materiaAgg[mat] || { chapterCount: 0, sectionCount: 0, sectionCountByChapter: {} };
    materiaAgg[mat].chapterCount++;
    materiaAgg[mat].sectionCount += secs.size;
    materiaAgg[mat].sectionCountByChapter[cap.id] = secs.size;
  }
  console.log('\n=== lp_materias/* (merge de conteos) ===');
  const matSnap = await db.collection('lp_materias').get();
  const knownMaterias = new Set(matSnap.docs.map(d => d.id));
  for (const [m, v] of Object.entries(materiaAgg)) {
    const exists = knownMaterias.has(m);
    console.log(`  ${m}: caps=${v.chapterCount} secs=${v.sectionCount}` + (exists ? '' : '  ⚠ sin doc en lp_materias (se creara con merge)'));
  }
  const totalSecs = Object.values(materiaAgg).reduce((a, v) => a + v.sectionCount, 0);
  console.log(`  (total secciones: ${totalSecs})`);

  if (!commit) {
    console.log('\nSIMULACION: nada escrito. Repite con --commit para aplicar.');
    process.exit(0);
  }

  // ─── Escritura ───
  await db.collection('pool_preguntas_meta').doc('summary').set(poolMeta);
  console.log('\n✔ pool_preguntas_meta/summary escrito.');

  const batch = db.batch();
  for (const [m, v] of Object.entries(materiaAgg)) {
    batch.set(db.collection('lp_materias').doc(m), {
      chapterCount: v.chapterCount,
      sectionCount: v.sectionCount,
      sectionCountByChapter: v.sectionCountByChapter,
      metaUpdatedAt: new Date().toISOString(),
    }, { merge: true });
  }
  await batch.commit();
  console.log(`✔ ${Object.keys(materiaAgg).length} docs lp_materias actualizados (merge).`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
