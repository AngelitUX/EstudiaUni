/**
 * Auditoria SOLO LECTURA de la coleccion `pool_preguntas` en Firestore.
 * No escribe ni borra nada: solo .get(). Uso: node tools/pool-preguntas/audit-firestore.js
 */
const path = require('path');
const { validarPregunta } = require('./schema');

const RAIZ = path.join(__dirname, '..', '..');
const BACKEND = path.join(RAIZ, 'backend');
require(path.join(BACKEND, 'node_modules/dotenv')).config({ path: path.join(BACKEND, '.env') });
const admin = require(path.join(BACKEND, 'node_modules/firebase-admin'));

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) { console.error('Faltan credenciales en backend/.env'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('pool_preguntas').get();
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`\n=== AUDITORIA pool_preguntas (${docs.length} documentos) ===\n`);

  const hallazgos = [];
  const porEnunciado = new Map();
  const imagenes = [];

  for (const q of docs) {
    // Mismas reglas que exige el importador del panel admin.
    const errs = validarPregunta(q, `${q.id}`);
    errs.forEach(e => hallazgos.push(['SCHEMA', e]));

    const clave = `${(q.preambulo_texto || '').trim()}||${(q.enunciado || '').trim()}`.toLowerCase();
    if (porEnunciado.has(clave)) hallazgos.push(['DUPLICADO', `${q.id} repite el enunciado de ${porEnunciado.get(clave)}`]);
    else porEnunciado.set(clave, q.id);

    if (q.preambulo_imagen_url) imagenes.push({ id: q.id, url: q.preambulo_imagen_url });

    // Un feedback identico al otro no ensena nada distinto al que acierta y al que falla.
    if (q.feedback_acierto && q.feedback_error && q.feedback_acierto.trim() === q.feedback_error.trim()) {
      hallazgos.push(['FEEDBACK', `${q.id}: feedback_acierto y feedback_error son identicos.`]);
    }
    if (q.feedback_error && /^(la respuesta correcta es|correcta:)/i.test(q.feedback_error.trim())) {
      hallazgos.push(['FEEDBACK', `${q.id}: feedback_error revela la respuesta en vez de dar una pista.`]);
    }
  }

  // Imagenes externas: si el host desaparece, la pregunta queda sin su contexto.
  console.log(`Imagenes externas referenciadas: ${imagenes.length}`);
  for (const img of imagenes) {
    let estado;
    try {
      const r = await fetch(img.url, { method: 'HEAD' });
      estado = r.status;
      if (!r.ok) hallazgos.push(['IMAGEN', `${img.id}: la imagen responde ${r.status} — ${img.url}`]);
    } catch (e) {
      estado = 'ERROR';
      hallazgos.push(['IMAGEN', `${img.id}: la imagen no se pudo alcanzar (${e.message}) — ${img.url}`]);
    }
    const host = (() => { try { return new URL(img.url).host; } catch { return '?'; } })();
    console.log(`   ${String(estado).padStart(5)}  ${img.id}  (${host})`);
    if (host && !host.endsWith('cloudinary.com') && host !== '?') {
      hallazgos.push(['IMAGEN', `${img.id}: imagen alojada fuera de Cloudinary (${host}); el resto del proyecto usa Cloudinary y ese host puede cambiar o bloquear hotlinking.`]);
    }
  }

  console.log(`\n--- ${hallazgos.length} hallazgo(s) ---`);
  const porTipo = {};
  hallazgos.forEach(([t, m]) => { (porTipo[t] = porTipo[t] || []).push(m); });
  for (const t of Object.keys(porTipo).sort()) {
    console.log(`\n[${t}] (${porTipo[t].length})`);
    porTipo[t].forEach(m => console.log('   - ' + m));
  }
  if (!hallazgos.length) console.log('   Sin problemas detectados.');
  console.log('\n(Este script no modifico nada.)\n');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
