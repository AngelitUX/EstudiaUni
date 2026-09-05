/**
 * Comprueba (solo lectura) que los resúmenes que escribe build-meta.js siguen
 * cuadrando con Firestore: `pool_preguntas_meta/summary` y los campos
 * `sectionCount` de `lp_materias`.
 *
 *   node tools/meta/verify-meta.js
 *
 * Correr tras `build-meta.js --commit`, o para diagnosticar si Mini Ensayo /
 * Mente Veloz / la Ruta muestran conteos raros.
 */
const path = require('path');
const B = path.join(__dirname, '..', '..', 'backend');
require(path.join(B, 'node_modules/dotenv')).config({ path: path.join(B, '.env') });
const admin = require(path.join(B, 'node_modules/firebase-admin'));
admin.initializeApp({ credential: admin.credential.cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
})});
const db = admin.firestore();

(async () => {
  let fail = 0;
  const check = (cond, msg) => { console.log((cond ? '  ✔ ' : '  ✖ ') + msg); if (!cond) fail++; };

  // pool_preguntas_meta/summary
  const metaSnap = await db.doc('pool_preguntas_meta/summary').get();
  check(metaSnap.exists, 'pool_preguntas_meta/summary existe');
  if (metaSnap.exists) {
    const meta = metaSnap.data();
    const realTotal = (await db.collection('pool_preguntas').count().get()).data().count;
    check(meta.total === realTotal, `total: resumen ${meta.total} == real ${realTotal}`);
    const real = {};
    (await db.collection('pool_preguntas').select('materiaId', 'tema').get()).forEach(d => {
      const m = d.data().materiaId; if (!m) return;
      real[m] = real[m] || { total: 0, temas: {} };
      real[m].total++;
      const t = d.data().tema; if (t) real[m].temas[t] = (real[m].temas[t] || 0) + 1;
    });
    for (const m of Object.keys(real)) {
      check(meta.byMateria[m] && meta.byMateria[m].total === real[m].total,
        `${m}: resumen ${meta.byMateria[m] && meta.byMateria[m].total} == real ${real[m].total}`);
    }
  }

  // lp_materias.sectionCount
  const caps = await db.collection('lp_capitulos').get();
  const secsByMateria = {};
  for (const c of caps.docs) {
    const m = c.data().materiaId; if (!m) continue;
    secsByMateria[m] = (secsByMateria[m] || 0) + (await c.ref.collection('secciones').get()).size;
  }
  for (const [m, n] of Object.entries(secsByMateria)) {
    const d = (await db.doc('lp_materias/' + m).get()).data() || {};
    check(d.sectionCount === n, `lp_materias/${m}.sectionCount: ${d.sectionCount} == real ${n}`);
  }

  console.log(fail ? `\n${fail} DESAJUSTE(S) — corre: node tools/meta/build-meta.js --commit` : '\nTodo cuadra.');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
