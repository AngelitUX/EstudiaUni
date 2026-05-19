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

// ── TEXTO BASE ────────────────────────────────────────────────
const TEXTO_AGUA = 'Durante los últimos años, diversas campañas de concientización han promovido el uso responsable del agua. Gracias a estas iniciativas, el consumo de agua en los hogares ha disminuido considerablemente.';

// ── NODO int-1 — DATOS ACTUALIZADOS ──────────────────────────
const SECCION_INT_1 = {
  id: 'int-1',
  capituloId: 'cap-interpretar',
  materiaId: 'comp-lectora',
  order: 1,
  isBoss: false,
  testId: 'test-int-1',
  title: 'Establecer relaciones entre ideas (Texto informativo)',
  // Mini guía
  guia_titulo: '¿Cómo relacionar ideas en un texto?',
  guia_contenido: 'Los textos no solo entregan información, también conectan ideas. Estas relaciones pueden ser: causa → consecuencia, problema → solución o idea → ejemplo. Tu tarea es identificar cómo se conectan las ideas entre sí.',
  introduccion: 'Los textos no solo entregan información, también conectan ideas. Estas relaciones pueden ser: causa → consecuencia, problema → solución o idea → ejemplo.',
  datos_claves: [
    '🔗 **Busca conectores**: "porque", "por lo tanto", "debido a", "gracias a".',
    '🧠 Pregúntate: **"¿qué provoca esto?"** o **"¿para qué ocurre?"**',
    '📖 **No leas frases aisladas**, mira la relación entre ellas.',
    '⚠️ **No confundas ideas separadas** con ideas relacionadas causalmente.',
  ],
};

// ── TEST int-1 — PREGUNTAS REALES ─────────────────────────────
const TEST_INT_1 = {
  id: 'test-int-1',
  seccionId: 'int-1',
  contexto_base: TEXTO_AGUA,
  preguntas: [
    {
      id: 2101, // Usando el prefijo 2 por el capitulo 2
      enunciado: '¿Cuál es la causa de la disminución del consumo de agua según el texto?',
      preambulo_texto: TEXTO_AGUA,
      preambulo_imagen_url: null,
      formula_latex: null,
      tipo_alternativas: 'texto',
      alternativas: {
        A: 'El aumento de la población',
        B: 'Las campañas de concientización',
        C: 'La falta de agua potable',
        D: 'El cambio climático',
      },
      respuesta_correcta: 'B',
      feedback_acierto: '✅ Correcto. El texto indica que las campañas de concientización provocaron la disminución del consumo de agua.',
      feedback_error: '❌ Incorrecto. Debías identificar la relación causa–consecuencia. Busca qué acción provoca la disminución del consumo y reconoce la idea que cumple ese rol en el texto.',
    },
    {
      id: 2102,
      enunciado: '¿Qué consecuencia se menciona en el texto?',
      preambulo_texto: TEXTO_AGUA,
      preambulo_imagen_url: null,
      formula_latex: null,
      tipo_alternativas: 'texto',
      alternativas: {
        A: 'Se crearon nuevas campañas',
        B: 'Disminuyó el consumo de agua',
        C: 'Aumentó la contaminación',
        D: 'Se prohibió el uso del agua',
      },
      respuesta_correcta: 'B',
      feedback_acierto: '✅ Correcto. El texto señala como consecuencia la disminución del consumo de agua.',
      feedback_error: '❌ Incorrecto. Debías identificar el efecto de una acción. Busca en el texto qué ocurre como resultado de las campañas mencionadas.',
    },
    {
      id: 2103,
      enunciado: '¿Cuál de las siguientes opciones expresa la relación presente en el texto?',
      preambulo_texto: TEXTO_AGUA,
      preambulo_imagen_url: null,
      formula_latex: null,
      tipo_alternativas: 'texto',
      alternativas: {
        A: 'Las campañas provocaron una reducción en el consumo de agua',
        B: 'El consumo de agua aumentó por las campañas',
        C: 'Las campañas no tuvieron efecto en el consumo',
        D: 'El consumo de agua generó campañas',
      },
      respuesta_correcta: 'A',
      feedback_acierto: '✅ Correcto. La alternativa expresa la misma relación de causa y consecuencia presente en el texto.',
      feedback_error: '❌ Incorrecto. Debías reconocer la relación entre las ideas. Identifica qué provoca qué en el texto y busca la alternativa que mantenga esa misma conexión.',
    },
  ],
};

async function updateNode() {
  console.log('🔄 Actualizando nodo int-1 (Capítulo 2) con contenido real...\n');

  // Actualizar sección
  await db
    .collection('lp_capitulos')
    .doc('cap-interpretar')
    .collection('secciones')
    .doc('int-1')
    .set(SECCION_INT_1);
  console.log('✅ Sección int-1 actualizada en cap-interpretar');

  // Actualizar test
  await db.collection('lp_tests').doc('test-int-1').set(TEST_INT_1);
  console.log('✅ Test test-int-1 actualizado con 3 preguntas reales');

  console.log('\n🎉 ¡Nodo 1 del Capítulo 2 completo y listo!');
}

updateNode().catch(console.error);
