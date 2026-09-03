/**
 * Adopta hacia la fuente versionada una pregunta que hoy vive en Firestore con
 * OTRO `createdBy` (las cargadas a mano por el panel admin / `migration-script`).
 *
 * Por que hace falta un script aparte: `upload.js` se salta a proposito todo
 * documento cuyo `createdBy` no sea el de esta tanda, para no pisar contenido
 * ajeno. Esa proteccion es correcta, pero impide corregir una de esas preguntas
 * desde `content/`. Este script es la excepcion explicita: pisa el documento
 * ENTERO con lo que diga `content/pool-preguntas/**`, `createdBy` incluido, de
 * modo que a partir de ahi `upload.js` pase a administrarla como una mas.
 *
 * Garantias:
 *  · Solo toca la coleccion `pool_preguntas`.
 *  · Solo toca los ids que se le pasen por argumento. Nunca hace un barrido.
 *  · El id tiene que existir en `content/` (si no, aborta): asi la version
 *    versionada es siempre la que queda en la base, no al reves.
 *  · Imprime el antes/despues campo por campo antes de escribir.
 *  · Simulacion por defecto. Escribe solo con --commit.
 *
 * Uso:
 *   node tools/pool-preguntas/adoptar.js test-m1-alg-1-q1
 *   node tools/pool-preguntas/adoptar.js test-m1-alg-1-q1 --commit
 */
const fs = require('fs');
const path = require('path');
const { validarPregunta, aDocumentoFirestore, CREATED_BY } = require('./schema');

const RAIZ = path.join(__dirname, '..', '..');
const CONTENIDO = path.join(RAIZ, 'content', 'pool-preguntas');
const BACKEND = path.join(RAIZ, 'backend');

const COMMIT = process.argv.includes('--commit');
const IDS = process.argv.slice(2).filter((a) => !a.startsWith('--'));

if (IDS.length === 0) {
  console.error('Uso: node tools/pool-preguntas/adoptar.js <id> [<id>...] [--commit]');
  process.exit(1);
}

require(path.join(BACKEND, 'node_modules/dotenv')).config({ path: path.join(BACKEND, '.env') });
const admin = require(path.join(BACKEND, 'node_modules/firebase-admin'));

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) {
  console.error('Faltan credenciales de Firebase en backend/.env');
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

/** Carga todas las preguntas de content/pool-preguntas/**.json indexadas por id. */
function cargarContenido() {
  const porId = new Map();
  for (const materia of fs.readdirSync(CONTENIDO)) {
    const dir = path.join(CONTENIDO, materia);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const archivo of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const ruta = path.join(dir, archivo);
      for (const q of JSON.parse(fs.readFileSync(ruta, 'utf8'))) {
        porId.set(q.id, { q, ruta: path.relative(RAIZ, ruta) });
      }
    }
  }
  return porId;
}

/** JSON con las llaves ordenadas, para que un cambio de ORDEN no se lea como cambio de contenido. */
function estable(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v !== 'object' || Array.isArray(v)) return JSON.stringify(v);
  return JSON.stringify(Object.keys(v).sort().reduce((acc, k) => ((acc[k] = v[k]), acc), {}));
}

function resumen(v) {
  if (v === null || v === undefined) return '(vacio)';
  if (typeof v === 'object') return JSON.stringify(v);
  const s = String(v);
  return s.length > 90 ? s.slice(0, 90) + '…' : s;
}

(async () => {
  const contenido = cargarContenido();
  const db = admin.firestore();

  console.log(`\nProyecto: ${projectId} · Coleccion: pool_preguntas`);
  console.log(COMMIT ? 'MODO: ESCRITURA REAL (--commit)' : 'MODO: SIMULACION (sin --commit no se escribe nada)');

  const aEscribir = [];

  for (const id of IDS) {
    console.log(`\n─── ${id} ───`);

    const entrada = contenido.get(id);
    if (!entrada) {
      console.error(`  ✖ ABORTA: el id no existe en content/pool-preguntas/. Agregalo ahi primero.`);
      process.exit(1);
    }
    const errs = validarPregunta(entrada.q, id);
    if (errs.length) {
      console.error(`  ✖ ABORTA: la version en ${entrada.ruta} no pasa el validador:`);
      errs.forEach((e) => console.error('     - ' + e));
      process.exit(1);
    }

    const snap = await db.collection('pool_preguntas').doc(id).get();
    if (!snap.exists) {
      console.error(`  ✖ ABORTA: el documento no existe en Firestore. Para altas nuevas usa upload.js.`);
      process.exit(1);
    }
    const previo = snap.data() || {};
    const ahora = new Date().toISOString();
    const nuevo = aDocumentoFirestore(entrada.q, ahora);
    // Adoptar no es crear: la pregunta ya existia. Se conserva su fecha de
    // creacion original (la del panel admin) y solo se marca la modificacion.
    nuevo.createdAt = previo.createdAt || entrada.q.createdAt || ahora;

    if (previo.createdBy === CREATED_BY) {
      console.log(`  · Ya es de esta tanda (createdBy=${CREATED_BY}). upload.js ya la administra; nada que adoptar.`);
      continue;
    }

    console.log(`  Fuente versionada: ${entrada.ruta}`);
    console.log(`  createdBy: "${previo.createdBy}"  →  "${nuevo.createdBy}"`);
    console.log('  Cambios de contenido:');
    let cambios = 0;
    for (const campo of Object.keys(nuevo)) {
      if (campo === 'updatedAt') continue;
      const a = estable(previo[campo]);
      const b = estable(nuevo[campo]);
      if (a !== b) {
        cambios++;
        console.log(`    ${campo}:`);
        console.log(`      antes:   ${resumen(previo[campo])}`);
        console.log(`      despues: ${resumen(nuevo[campo])}`);
      }
    }
    if (cambios === 0) console.log('    (ninguno: solo cambia el createdBy)');

    aEscribir.push({ id, nuevo });
  }

  if (aEscribir.length === 0) {
    console.log('\nNada que hacer.\n');
    process.exit(0);
  }

  if (!COMMIT) {
    console.log(`\nSimulacion terminada. Se pisarian ${aEscribir.length} documento(s).`);
    console.log('Para aplicar de verdad:  node tools/pool-preguntas/adoptar.js ' + IDS.join(' ') + ' --commit\n');
    process.exit(0);
  }

  const batch = db.batch();
  for (const { id, nuevo } of aEscribir) {
    batch.set(db.collection('pool_preguntas').doc(id), nuevo);
  }
  await batch.commit();
  console.log(`\n✔ Listo. ${aEscribir.length} documento(s) adoptado(s). Desde ahora upload.js los administra.\n`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
