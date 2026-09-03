/**
 * Verificacion de PRODUCCION: comprueba, contra lo que hay realmente en
 * Firestore (no contra content/), que el banco de preguntas esta sano y que
 * los tres modulos que lo consumen tienen contenido suficiente.
 *
 * SOLO LECTURA. Uso: node tools/pool-preguntas/verificar-firestore.js
 *
 * A diferencia de verificar-modulos.js (que lee la fuente versionada), este
 * script incluye tambien las preguntas cargadas antes por el panel admin, que
 * son las que la app realmente sirve hoy.
 */
const path = require('path');
const { validarPregunta, TEMAS_POR_MATERIA } = require('./schema');

const RAIZ = path.join(__dirname, '..', '..');
const BACKEND = path.join(RAIZ, 'backend');
require(path.join(BACKEND, 'node_modules/dotenv')).config({ path: path.join(BACKEND, '.env') });
const admin = require(path.join(BACKEND, 'node_modules/firebase-admin'));

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) { console.error('Faltan credenciales en backend/.env'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

let fallos = 0;
const fallo = (m) => { console.log('   ✖ ' + m); fallos++; };

function normalizeMateriaId(id) {
  if (!id) return '';
  const norm = id.toLowerCase().trim();
  if (norm === 'mat1' || norm === 'matematicas-m1' || norm === 'math-m1' || norm === 'm1') return 'mat1';
  if (norm === 'mat2' || norm === 'matematicas-m2' || norm === 'm2') return 'mat2';
  if (norm === 'comp-lectora' || norm === 'competencia-lectora' || norm === 'lectura') return 'comp-lectora';
  if (norm === 'historia' || norm === 'historia y cs. sociales' || norm === 'historia y cs. soc.') return 'historia';
  if (norm === 'ciencias') return 'ciencias';
  return norm;
}

(async () => {
  const snap = await admin.firestore().collection('pool_preguntas').get();
  const pool = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`\n=== ${pool.length} documentos leidos de Firestore ===\n`);

  // 1. Esquema: ¿todas cumplen lo que exige el importador del panel admin?
  console.log('1) ESQUEMA (mismas reglas que el importador del panel)');
  let conErrores = 0;
  for (const q of pool) {
    const errs = validarPregunta(q, q.id);
    if (errs.length) { conErrores++; if (conErrores <= 5) fallo(errs[0]); }
  }
  if (conErrores === 0) console.log('   ✔ Las ' + pool.length + ' preguntas cumplen el esquema.');
  else fallo(`${conErrores} pregunta(s) con problemas de esquema.`);

  // 2. Temas fuera del catalogo: se guardan igual, pero NO aparecen en el
  //    selector de Mini Ensayos, asi que quedan invisibles para el estudiante.
  console.log('\n2) TEMAS FUERA DEL CATALOGO (quedarian invisibles en Mini Ensayo)');
  const huerfanas = pool.filter(q => !(TEMAS_POR_MATERIA[q.materiaId] || []).includes(q.tema));
  if (huerfanas.length === 0) console.log('   ✔ Ninguna. Todos los temas coinciden con AdminService.temasPorMateria.');
  else huerfanas.slice(0, 10).forEach(q => fallo(`${q.id}: materia "${q.materiaId}" con tema "${q.tema}"`));

  // 3. Duplicados en toda la coleccion (nuevas + las cargadas antes a mano).
  console.log('\n3) DUPLICADOS EN TODA LA COLECCION');
  const vistos = new Map();
  let dups = 0;
  for (const q of pool) {
    const clave = `${(q.preambulo_texto || '').trim()}||${(q.enunciado || '').trim()}`.toLowerCase();
    if (vistos.has(clave)) { dups++; if (dups <= 5) fallo(`${q.id} repite el enunciado de ${vistos.get(clave)}`); }
    else vistos.set(clave, q.id);
  }
  if (dups === 0) console.log('   ✔ Sin enunciados repetidos.');

  // 4. Mini Ensayo: la UI permite pedir 30 preguntas de UN SOLO tema.
  console.log('\n4) MINI ENSAYO (tope de la UI: 30 preguntas, un solo tema posible)');
  for (const [materiaId, temas] of Object.entries(TEMAS_POR_MATERIA)) {
    const total = pool.filter(q => q.materiaId === materiaId).length;
    if (total === 0) { console.log(`   ${materiaId}: vacia (la UI muestra "No hay preguntas disponibles")`); continue; }
    const det = temas.map(t => {
      const n = pool.filter(q => q.materiaId === materiaId && q.tema === t).length;
      if (n < 30) fallo(`${materiaId} / ${t}: ${n} preguntas (< 30, la sesion se recortaria)`);
      return `${t}=${n}`;
    });
    console.log(`   ✔ ${materiaId} (${total}): ${det.join(', ')}`);
  }

  // 5. Mente Veloz: filtra solo por materia, normalizando ambos lados.
  console.log('\n5) MENTE VELOZ (filtra por materia normalizada)');
  for (const m of ['comp-lectora', 'mat1', 'mat2', 'historia', 'ciencias-biologia', 'ciencias-fisica', 'ciencias-quimica']) {
    const n = pool.filter(q => normalizeMateriaId(q.materiaId) === normalizeMateriaId(m)).length;
    if (n < 20) fallo(`Mente Veloz: la materia "${m}" solo encuentra ${n} preguntas`);
    else console.log(`   ✔ ${m}: ${n} preguntas`);
  }

  // 6. Distribucion de la letra correcta en toda la coleccion.
  console.log('\n6) DISTRIBUCION DE LA RESPUESTA CORRECTA (global)');
  const d = { A: 0, B: 0, C: 0, D: 0 };
  pool.forEach(q => d[q.respuesta_correcta]++);
  const pico = Math.max(...Object.values(d)) / pool.length;
  console.log(`   A=${d.A} B=${d.B} C=${d.C} D=${d.D}  (maximo ${(pico * 100).toFixed(1)}%)`);
  if (pico > 0.32) fallo(`Una letra concentra el ${(pico * 100).toFixed(1)}% de las respuestas: es adivinable por patron.`);
  else console.log('   ✔ Sin sesgo explotable (el azar puro seria 25%).');

  // 7. Imagenes externas: si el host falla, la pregunta queda irresoluble.
  console.log('\n7) IMAGENES EXTERNAS');
  const conImg = pool.filter(q => q.preambulo_imagen_url);
  if (conImg.length === 0) console.log('   ✔ Ninguna pregunta depende de una imagen externa.');
  for (const q of conImg) {
    try {
      const r = await fetch(q.preambulo_imagen_url, { method: 'HEAD' });
      if (!r.ok) fallo(`${q.id}: imagen HTTP ${r.status} — la pregunta es irresoluble`);
      else console.log(`   ✔ ${q.id}: imagen OK`);
    } catch (e) { fallo(`${q.id}: imagen inalcanzable (${e.message})`); }
  }

  console.log(fallos === 0
    ? '\n✔ TODO EN ORDEN: el banco esta sano y los modulos tienen contenido suficiente.\n'
    : `\n✖ ${fallos} problema(s). Ver detalle arriba.\n`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
