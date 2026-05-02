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

// ── TEXTO BASE (compartido por las 3 preguntas) ───────────────
const TEXTO_BIBLIOTECA = 'La Biblioteca Nacional de Chile fue fundada en 1813, durante el gobierno de José Miguel Carrera. Inicialmente funcionó en dependencias del antiguo Convento de la Compañía de Jesús. En 1925 se trasladó a su edificio actual en la Alameda, en Santiago. Actualmente alberga más de siete millones de documentos entre libros, manuscritos, mapas y fotografías.';

// ── NODO loc-1 — DATOS ACTUALIZADOS ──────────────────────────
const SECCION_LOC1 = {
  id: 'loc-1',
  capituloId: 'cap-localizar',
  materiaId: 'comp-lectora',
  order: 1,
  testId: 'test-loc-1',
  title: 'Rastrear información explícita (Texto informativo)',
  // Mini guía
  guia_titulo: '¿Qué significa rastrear información explícita?',
  guia_contenido: 'La información explícita es aquella que aparece directamente en el texto. No necesitas interpretar ni inferir, solo buscar y reconocer. Puede aparecer con las mismas palabras o con sinónimos y paráfrasis simples.',
  introduccion: 'La información explícita es aquella que aparece directamente en el texto. No necesitas interpretar ni inferir, solo buscar y reconocer.',
  datos_claves: [
    '🔍 **Busca palabras clave** de la pregunta en el texto para ubicar rápidamente la respuesta.',
    '📌 **Lee con atención fechas, nombres y lugares** — son los datos que más aparecen en preguntas literales.',
    '⚠️ **No te dejes confundir** por información similar pero de otra parte del texto — los distractores son trampas frecuentes.',
  ],
};

// ── TEST loc-1 — PREGUNTAS REALES ─────────────────────────────
const TEST_LOC1 = {
  id: 'test-loc-1',
  seccionId: 'loc-1',
  contexto_base: TEXTO_BIBLIOTECA,
  preguntas: [
    {
      id: 101,
      enunciado: '¿Dónde funcionó inicialmente la Biblioteca Nacional?',
      preambulo_texto: TEXTO_BIBLIOTECA,
      preambulo_imagen_url: null,
      formula_latex: null,
      tipo_alternativas: 'texto',
      alternativas: {
        A: 'En la Alameda de Santiago',
        B: 'En el Palacio de La Moneda',
        C: 'En el Convento de la Compañía de Jesús',
        D: 'En la Universidad de Chile',
      },
      respuesta_correcta: 'C',
      feedback_acierto: '✅ Correcto. El texto indica explícitamente que funcionó inicialmente en el Convento de la Compañía de Jesús.',
      feedback_error: '❌ Incorrecto. La Alameda corresponde a su ubicación actual (desde 1925), no la inicial. La respuesta está en la segunda oración del texto.',
    },
    {
      id: 102,
      enunciado: '¿En qué año fue fundada la Biblioteca Nacional de Chile?',
      preambulo_texto: TEXTO_BIBLIOTECA,
      preambulo_imagen_url: null,
      formula_latex: null,
      tipo_alternativas: 'texto',
      alternativas: {
        A: '1925',
        B: '1813',
        C: '1900',
        D: '1850',
      },
      respuesta_correcta: 'B',
      feedback_acierto: '✅ Correcto. El texto indica explícitamente que la Biblioteca Nacional fue fundada en 1813, primera oración.',
      feedback_error: '❌ Incorrecto. No confundas 1925 (traslado) con 1813 (fundación). La respuesta está en la primera oración del texto.',
    },
    {
      id: 103,
      enunciado: '¿Qué ocurrió en 1925 según el texto?',
      preambulo_texto: TEXTO_BIBLIOTECA,
      preambulo_imagen_url: null,
      formula_latex: null,
      tipo_alternativas: 'texto',
      alternativas: {
        A: 'Se fundó la Biblioteca Nacional',
        B: 'Se trasladó a su edificio actual',
        C: 'Se construyó el Convento de la Compañía de Jesús',
        D: 'Se cerró la Biblioteca Nacional',
      },
      respuesta_correcta: 'B',
      feedback_acierto: '✅ Correcto. El texto señala explícitamente que en 1925 la Biblioteca Nacional se trasladó a su edificio actual en la Alameda.',
      feedback_error: '❌ Incorrecto. El año 1813 corresponde a la fundación; 1925 corresponde al traslado. Busca el número en el texto.',
    },
  ],
};

async function updateNode() {
  console.log('🔄 Actualizando nodo loc-1 con contenido real...\n');

  // Actualizar sección
  await db
    .collection('lp_capitulos')
    .doc('cap-localizar')
    .collection('secciones')
    .doc('loc-1')
    .set(SECCION_LOC1);
  console.log('✅ Sección loc-1 actualizada');

  // Actualizar test
  await db.collection('lp_tests').doc('test-loc-1').set(TEST_LOC1);
  console.log('✅ Test test-loc-1 actualizado con 3 preguntas reales');

  console.log('\n🎉 ¡Nodo 1 completo y listo!');
}

updateNode().catch(console.error);
