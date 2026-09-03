/**
 * Sube el contenido de `content/pool-preguntas/` a la coleccion
 * `pool_preguntas` de Firestore.
 *
 *   node tools/pool-preguntas/upload.js             -> SIMULACION (no escribe)
 *   node tools/pool-preguntas/upload.js --commit    -> escribe de verdad
 *
 * Garantias deliberadas (no relajarlas sin pensarlo dos veces):
 *  · SOLO toca la coleccion `pool_preguntas`. Ninguna otra.
 *  · NUNCA borra un documento. No hay ningun .delete() en este archivo.
 *  · Usa el `id` del contenido como ID del documento (set con ID explicito),
 *    asi que re-ejecutarlo es idempotente: no duplica preguntas.
 *  · Un documento que ya existe con OTRO `createdBy` (las 29 preguntas
 *    cargadas a mano / por `migration-script`) se SALTA siempre. Solo se
 *    sobrescriben documentos creados por esta misma tanda.
 *  · Valida todo antes de escribir la primera pregunta; si algo no valida,
 *    aborta sin tocar nada.
 *
 * Credenciales: FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL /
 * FIREBASE_PRIVATE_KEY en backend/.env (mismo patron que tools-audit-firestore.js).
 */
const fs = require('fs');
const path = require('path');
const { validarPregunta, aDocumentoFirestore, CREATED_BY } = require('./schema');

const RAIZ = path.join(__dirname, '..', '..');
const BACKEND = path.join(RAIZ, 'backend');
const DIR_CONTENIDO = path.join(RAIZ, 'content', 'pool-preguntas');
const COLECCION = 'pool_preguntas';
const TAM_LOTE = 400; // Firestore admite 500 escrituras por batch; margen abajo.

const commit = process.argv.includes('--commit');

function listarArchivos(dir) {
  const salida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) salida.push(...listarArchivos(p));
    else if (e.name.endsWith('.json')) salida.push(p);
  }
  return salida;
}

function cargarYValidar() {
  const preguntas = [];
  const errores = [];
  const ids = new Set();
  for (const archivo of listarArchivos(DIR_CONTENIDO)) {
    const rel = path.relative(RAIZ, archivo);
    const datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    datos.forEach((q, i) => {
      const etiqueta = `${rel}[${i}]`;
      errores.push(...validarPregunta(q, etiqueta));
      if (q && q.id) {
        if (ids.has(q.id)) errores.push(`${etiqueta}: id duplicado "${q.id}".`);
        ids.add(q.id);
      }
      preguntas.push(q);
    });
  }
  if (errores.length) {
    console.error(`\n✖ ${errores.length} error(es) de validacion. No se subio nada.\n`);
    errores.slice(0, 40).forEach(e => console.error('  - ' + e));
    process.exit(1);
  }
  return preguntas;
}

async function main() {
  const preguntas = cargarYValidar();
  console.log(`\n${preguntas.length} preguntas validadas desde content/pool-preguntas/.`);

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

  console.log(`Proyecto: ${projectId} · Coleccion: ${COLECCION}`);
  console.log(commit ? 'MODO: ESCRITURA REAL (--commit)\n' : 'MODO: SIMULACION (sin --commit no se escribe nada)\n');

  // Foto del estado actual, para decidir que es alta, que es actualizacion y
  // que hay que respetar por ser de otra procedencia.
  const existentes = new Map();
  const snap = await db.collection(COLECCION).get();
  snap.forEach(d => existentes.set(d.id, d.data() || {}));
  console.log(`La coleccion tiene hoy ${existentes.size} documento(s).`);

  const altas = [];
  const actualizaciones = [];
  const protegidas = [];
  for (const q of preguntas) {
    const actual = existentes.get(q.id);
    if (!actual) altas.push(q);
    else if (actual.createdBy === CREATED_BY) actualizaciones.push(q);
    else protegidas.push({ q, createdBy: actual.createdBy });
  }

  console.log(`\n  Altas nuevas .................. ${altas.length}`);
  console.log(`  Actualizaciones (de esta tanda) ${actualizaciones.length}`);
  console.log(`  Saltadas por ser de otra fuente ${protegidas.length}`);
  if (protegidas.length) {
    protegidas.slice(0, 10).forEach(p => console.log(`     - ${p.q.id} (createdBy=${p.createdBy})`));
  }
  console.log(`  Documentos existentes que NO se tocan: ${existentes.size - actualizaciones.length}`);

  const aEscribir = [...altas, ...actualizaciones];
  if (!commit) {
    console.log(`\nSimulacion terminada. Se escribirian ${aEscribir.length} documento(s).`);
    console.log('Para aplicar de verdad:  node tools/pool-preguntas/upload.js --commit\n');
    process.exit(0);
  }

  const ahora = new Date().toISOString();
  let escritas = 0;
  for (let i = 0; i < aEscribir.length; i += TAM_LOTE) {
    const trozo = aEscribir.slice(i, i + TAM_LOTE);
    const batch = db.batch();
    for (const q of trozo) {
      const doc = aDocumentoFirestore(q, ahora);
      // Conserva el createdAt original si el documento ya existia.
      const previo = existentes.get(q.id);
      if (previo && previo.createdAt) doc.createdAt = previo.createdAt;
      batch.set(db.collection(COLECCION).doc(q.id), doc);
    }
    await batch.commit();
    escritas += trozo.length;
    console.log(`  ... ${escritas}/${aEscribir.length}`);
  }

  const final = await db.collection(COLECCION).get();
  console.log(`\n✔ Listo. ${escritas} documento(s) escritos. La coleccion tiene ahora ${final.size}.`);
  console.log('Recuerda: el panel admin y la app cachean el pool 6 h. Usa "Actualizar Datos"');
  console.log('en /admin o borra `pool_preguntas_cache` de localStorage para verlo al instante.\n');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
