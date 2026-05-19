import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();
const MATERIA_ID = 'mat2';

// ---------------------------------------------------------------------------
// GENERADOR DE PREGUNTAS BASE (2 preguntas por paso, estructura placeholder)
// Será reemplazado por el seeder FASE 2 con preguntas reales PAES M2.
// ---------------------------------------------------------------------------
function generarPreguntasBase(stepCode: string, tema: string): any[] {
  return [
    {
      id: parseInt(stepCode + '01'),
      enunciado: `[Placeholder] Pregunta introductoria sobre: ${tema}.`,
      alternativas: { A: 'Opción A', B: 'Opción B', C: 'Opción C', D: 'Opción D' },
      respuesta_correcta: 'A',
      feedback_acierto: '¡Correcto!',
      feedback_error: 'Revisa la teoría de este paso.'
    },
    {
      id: parseInt(stepCode + '02'),
      enunciado: `[Placeholder] Pregunta de aplicación sobre: ${tema}.`,
      alternativas: { A: 'Opción A', B: 'Opción B', C: 'Opción C', D: 'Opción D' },
      respuesta_correcta: 'B',
      feedback_acierto: '¡Muy bien!',
      feedback_error: 'Recuerda los conceptos clave del tema.'
    }
  ];
}

// ---------------------------------------------------------------------------
// ESTRUCTURA COMPLETA DE MATEMÁTICAS M2 — 4 CAPÍTULOS, 26 PASOS
// ---------------------------------------------------------------------------
const CAPITULOS = [

  // ═══════════════════════════════════════════════════════════
  // CAPÍTULO 1: NÚMEROS (6 Pasos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cap-m2-1-numeros',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Números',
    introduccion: 'Profundiza en los números reales, matemática financiera (AFP, créditos) y logaritmos con sus propiedades.',
    order: 1,
    secciones: [
      // Unidad: Conjunto de los números reales
      {
        id: 'sec-m2-1-1', title: '1. Operaciones en el conjunto de los números reales',
        order: 1, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-1-1', preguntas: generarPreguntasBase('5101', 'Operaciones en reales') }
      },
      {
        id: 'sec-m2-1-2', title: '2. Problemas con números reales en diversos contextos',
        order: 2, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-1-2', preguntas: generarPreguntasBase('5102', 'Problemas con reales') }
      },
      // Unidad: Matemática financiera
      {
        id: 'sec-m2-1-3', title: '3. Problemas financieros: AFP y jubilación',
        order: 3, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-1-3', preguntas: generarPreguntasBase('5103', 'AFP y jubilación') }
      },
      {
        id: 'sec-m2-1-4', title: '4. Créditos hipotecarios y de consumo',
        order: 4, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-1-4', preguntas: generarPreguntasBase('5104', 'Créditos hipotecarios y consumo') }
      },
      // Unidad: Logaritmos
      {
        id: 'sec-m2-1-5', title: '5. Potencias, raíces y logaritmos: propiedades',
        order: 5, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-1-5', preguntas: generarPreguntasBase('5105', 'Propiedades de logaritmos') }
      },
      {
        id: 'sec-m2-1-6', title: '6. Problemas con logaritmos en diversos contextos',
        order: 6, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-1-6', preguntas: generarPreguntasBase('5106', 'Problemas con logaritmos') }
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CAPÍTULO 2: ÁLGEBRA Y FUNCIONES (5 Pasos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cap-m2-2-algebra',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Álgebra y Funciones',
    introduccion: 'Explora sistemas con múltiples soluciones, funciones potencia/exponencial/logarítmica y funciones trigonométricas.',
    order: 2,
    secciones: [
      // Unidad: Sistemas de ecuaciones lineales (2x2)
      {
        id: 'sec-m2-2-1', title: '1. Sistemas con única, infinitas o sin solución',
        order: 1, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-2-1', preguntas: generarPreguntasBase('5201', 'Tipos de solución en sistemas 2x2') }
      },
      // Unidad: Función potencia, exponencial y logarítmica
      {
        id: 'sec-m2-2-2', title: '2. Gráficos de función potencia, exponencial y logarítmica',
        order: 2, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-2-2', preguntas: generarPreguntasBase('5202', 'Gráficos de funciones avanzadas') }
      },
      {
        id: 'sec-m2-2-3', title: '3. Problemas con función potencia, exponencial y logarítmica',
        order: 3, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-2-3', preguntas: generarPreguntasBase('5203', 'Problemas de funciones avanzadas') }
      },
      // Unidad: Funciones Trigonométricas
      {
        id: 'sec-m2-2-4', title: '4. Gráficos de las funciones seno y coseno',
        order: 4, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-2-4', preguntas: generarPreguntasBase('5204', 'Gráficos de seno y coseno') }
      },
      {
        id: 'sec-m2-2-5', title: '5. Problemas con funciones trigonométricas seno y coseno',
        order: 5, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-2-5', preguntas: generarPreguntasBase('5205', 'Problemas con seno y coseno') }
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CAPÍTULO 3: GEOMETRÍA (8 Pasos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cap-m2-3-geometria',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Geometría',
    introduccion: 'Domina homotecia, trigonometría en triángulos, relaciones métricas en circunferencias, esferas y posiciones de rectas.',
    order: 3,
    secciones: [
      // Unidad: Homotecia
      {
        id: 'sec-m2-3-1', title: '1. Problemas de homotecia en figuras planas',
        order: 1, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-1', preguntas: generarPreguntasBase('5301', 'Homotecia') }
      },
      // Unidad: Razones trigonométricas en triángulos rectángulos
      {
        id: 'sec-m2-3-2', title: '2. Razones trigonométricas: seno, coseno y tangente',
        order: 2, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-2', preguntas: generarPreguntasBase('5302', 'Razones trigonométricas') }
      },
      {
        id: 'sec-m2-3-3', title: '3. Problemas con razones trigonométricas',
        order: 3, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-3', preguntas: generarPreguntasBase('5303', 'Problemas trigonométricos') }
      },
      // Unidad: Relaciones métricas en la circunferencia
      {
        id: 'sec-m2-3-4', title: '4. Ángulos y arcos en la circunferencia',
        order: 4, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-4', preguntas: generarPreguntasBase('5304', 'Ángulos y arcos') }
      },
      {
        id: 'sec-m2-3-5', title: '5. Cuerdas y secantes en la circunferencia',
        order: 5, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-5', preguntas: generarPreguntasBase('5305', 'Cuerdas y secantes') }
      },
      {
        id: 'sec-m2-3-6', title: '6. Problemas con relaciones métricas en la circunferencia',
        order: 6, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-6', preguntas: generarPreguntasBase('5306', 'Problemas en circunferencia') }
      },
      // Unidad: Esferas
      {
        id: 'sec-m2-3-7', title: '7. Área de superficie y volumen de la esfera',
        order: 7, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-7', preguntas: generarPreguntasBase('5307', 'Área y volumen de esfera') }
      },
      // Unidad: Rectas en el plano
      {
        id: 'sec-m2-3-8', title: '8. Rectas y posiciones relativas en el plano',
        order: 8, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-3-8', preguntas: generarPreguntasBase('5308', 'Posiciones de rectas') }
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CAPÍTULO 4: PROBABILIDAD Y ESTADÍSTICA (7 Pasos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cap-m2-4-datos',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Probabilidad y Estadística',
    introduccion: 'Analiza medidas de dispersión, probabilidad condicional, combinatoria y modelos probabilísticos (binomial y normal).',
    order: 4,
    secciones: [
      // Unidad: Medidas de dispersión
      {
        id: 'sec-m2-4-1', title: '1. Medidas de dispersión de conjuntos de datos',
        order: 1, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-1', preguntas: generarPreguntasBase('5401', 'Medidas de dispersión') }
      },
      {
        id: 'sec-m2-4-2', title: '2. Problemas con medidas de dispersión',
        order: 2, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-2', preguntas: generarPreguntasBase('5402', 'Problemas de dispersión') }
      },
      // Unidad: Probabilidad condicional
      {
        id: 'sec-m2-4-3', title: '3. Probabilidad condicional y sus propiedades',
        order: 3, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-3', preguntas: generarPreguntasBase('5403', 'Probabilidad condicional') }
      },
      // Unidad: Permutación y combinatoria
      {
        id: 'sec-m2-4-4', title: '4. Concepto de permutación y combinatoria',
        order: 4, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-4', preguntas: generarPreguntasBase('5404', 'Permutación y combinatoria') }
      },
      {
        id: 'sec-m2-4-5', title: '5. Problemas de permutación y combinatoria',
        order: 5, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-5', preguntas: generarPreguntasBase('5405', 'Problemas de combinatoria') }
      },
      // Unidad: Modelos probabilísticos
      {
        id: 'sec-m2-4-6', title: '6. Problemas con modelos binomiales',
        order: 6, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-6', preguntas: generarPreguntasBase('5406', 'Distribución binomial') }
      },
      {
        id: 'sec-m2-4-7', title: '7. Problemas con distribución normal',
        order: 7, introduccion: '', datos_claves: [],
        test: { id: 'test-m2-4-7', preguntas: generarPreguntasBase('5407', 'Distribución normal') }
      },
    ]
  }
];

// ---------------------------------------------------------------------------
// SEEDER PRINCIPAL — FASE 1
// ---------------------------------------------------------------------------
async function seedFirestore() {
  console.log('🌱 Starting Matemática M2 — FASE 1: Estructura Base...');

  try {
    // 1. Crear la materia mat2
    await db.collection('lp_materias').doc(MATERIA_ID).set({
      id: MATERIA_ID,
      title: 'Competencia Matemática 2 (M2)',
      descripcion: 'Matemáticas avanzadas PAES: números reales, finanzas, logaritmos, funciones trascendentes, trigonometría, geometría avanzada y estadística inferencial.',
      isActive: true,
      order: 2
    }, { merge: true });
    console.log(`✅ Materia asegurada: ${MATERIA_ID}`);

    const capitulosRef = db.collection('lp_capitulos');

    // 2. Limpiar capítulos anteriores de M2
    console.log('🧹 Limpiando capítulos anteriores de Matemáticas M2...');
    const oldCaps = await capitulosRef.where('materiaId', '==', MATERIA_ID).get();
    for (const doc of oldCaps.docs) {
      const secciones = await doc.ref.collection('secciones').get();
      for (const secDoc of secciones.docs) {
        await secDoc.ref.delete();
      }
      await doc.ref.delete();
      console.log(`  🗑️ Capítulo borrado: ${doc.id}`);
    }

    // 3. Insertar la nueva estructura completa
    for (const cap of CAPITULOS) {
      const { secciones, ...capituloData } = cap;
      await capitulosRef.doc(cap.id).set(capituloData);
      console.log(`✅ Capítulo seeded: ${cap.id}`);

      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');

      for (const sec of secciones) {
        const { test, ...seccionData } = sec;

        await seccionesRef.doc(sec.id).set({
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id,
          testId: test.id
        });

        await db.collection('lp_tests').doc(test.id).set({
          ...test,
          seccionId: sec.id
        });
        console.log(`  ✅ Sección seeded: ${sec.id}`);
      }
    }

    console.log('\n🎉 FASE 1 COMPLETA: Arquitectura M2 lista en Firestore!');
    console.log('   → Próximo paso: ejecutar seed-mates-m2-questions.ts para inyectar preguntas reales PAES M2.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during M2 seed:', error);
    process.exit(1);
  }
}

seedFirestore();
