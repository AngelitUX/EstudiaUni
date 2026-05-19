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

const MATERIA_ID = 'mat1';

function generarPreguntasBase(pasoId: string, tema: string): any[] {
  return [
    {
      id: parseInt(pasoId.replace(/\D/g, '') + '01'),
      enunciado: `Pregunta introductoria sobre: ${tema}. ¿Cuál es el resultado de evaluar $2 + 3 \\cdot 4$?`,
      alternativas: { A: '$20$', B: '$14$', C: '$24$', D: '$10$' },
      respuesta_correcta: 'B',
      feedback_acierto: '¡Correcto! Respetaste la prioridad de las operaciones.',
      feedback_error: 'Recuerda que la multiplicación ($3 \\cdot 4 = 12$) se realiza antes que la suma ($2 + 12 = 14$).'
    },
    {
      id: parseInt(pasoId.replace(/\D/g, '') + '02'),
      enunciado: `Pregunta de aplicación sobre: ${tema}. Si $x = \\frac{1}{2}$, ¿cuál es el valor de $x^2$?`,
      alternativas: { A: '$\\frac{1}{4}$', B: '$1$', C: '$\\frac{1}{2}$', D: '$\\frac{1}{8}$' },
      respuesta_correcta: 'A',
      feedback_acierto: '¡Muy bien calculado!',
      feedback_error: 'Al elevar una fracción al cuadrado, se eleva tanto el numerador como el denominador: $\\frac{1^2}{2^2} = \\frac{1}{4}$.'
    }
  ];
}

const CAPITULOS = [
  {
    id: 'cap-m1-1-numeros',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Números',
    introduccion: 'Domina las operaciones, orden y problemas de números enteros, racionales, porcentajes, potencias y raíces.',
    order: 1,
    secciones: [
      // Unidad: Conjunto de los números enteros y racionales
      { id: 'sec-m1-1-1', title: '1. Operaciones y orden en enteros', order: 1, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-1', preguntas: generarPreguntasBase('101', 'Operaciones con Enteros') } },
      { id: 'sec-m1-1-2', title: '2. Operaciones y comparación en racionales', order: 2, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-2', preguntas: generarPreguntasBase('102', 'Operaciones con Racionales') } },
      { id: 'sec-m1-1-3', title: '3. Problemas con enteros y racionales', order: 3, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-3', preguntas: generarPreguntasBase('103', 'Problemas en diversos contextos') } },
      // Unidad: Porcentaje
      { id: 'sec-m1-1-4', title: '4. Concepto y cálculo de porcentaje', order: 4, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-4', preguntas: generarPreguntasBase('104', 'Cálculo de porcentaje') } },
      { id: 'sec-m1-1-5', title: '5. Problemas que involucren porcentaje', order: 5, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-5', preguntas: generarPreguntasBase('105', 'Problemas de porcentaje') } },
      // Unidad: Potencias y raíces enésimas
      { id: 'sec-m1-1-6', title: '6. Propiedades de las potencias', order: 6, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-6', preguntas: generarPreguntasBase('106', 'Potencias de base racional') } },
      { id: 'sec-m1-1-7', title: '7. Descomposición y propiedades de raíces', order: 7, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-7', preguntas: generarPreguntasBase('107', 'Raíces enésimas') } },
      { id: 'sec-m1-1-8', title: '8. Problemas con potencias y raíces', order: 8, introduccion: '', datos_claves: [], test: { id: 'test-m1-1-8', preguntas: generarPreguntasBase('108', 'Problemas de potencias y raíces') } },
    ]
  },
  {
    id: 'cap-m1-2-algebra',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Álgebra y Funciones',
    introduccion: 'Aprende sobre expresiones algebraicas, proporciones, ecuaciones, sistemas de ecuaciones y funciones lineales/cuadráticas.',
    order: 2,
    secciones: [
      // Unidad: Expresiones algebraicas
      { id: 'sec-m1-2-1', title: '1. Productos notables', order: 1, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-1', preguntas: generarPreguntasBase('201', 'Productos notables') } },
      { id: 'sec-m1-2-2', title: '2. Factorizaciones y desarrollo de expresiones', order: 2, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-2', preguntas: generarPreguntasBase('202', 'Factorizaciones') } },
      { id: 'sec-m1-2-3', title: '3. Operatoria con expresiones algebraicas', order: 3, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-3', preguntas: generarPreguntasBase('203', 'Operatoria algebraica') } },
      { id: 'sec-m1-2-4', title: '4. Problemas con expresiones algebraicas', order: 4, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-4', preguntas: generarPreguntasBase('204', 'Problemas algebraicos') } },
      // Unidad: Proporcionalidad
      { id: 'sec-m1-2-5', title: '5. Proporción directa e inversa', order: 5, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-5', preguntas: generarPreguntasBase('205', 'Proporción') } },
      { id: 'sec-m1-2-6', title: '6. Problemas de proporcionalidad', order: 6, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-6', preguntas: generarPreguntasBase('206', 'Problemas de proporción') } },
      // Unidad: Ecuaciones e inecuaciones de primer grado
      { id: 'sec-m1-2-7', title: '7. Resolución de ecuaciones lineales', order: 7, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-7', preguntas: generarPreguntasBase('207', 'Ecuaciones lineales') } },
      { id: 'sec-m1-2-8', title: '8. Problemas de ecuaciones lineales', order: 8, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-8', preguntas: generarPreguntasBase('208', 'Problemas de ecuaciones') } },
      { id: 'sec-m1-2-9', title: '9. Resolución de inecuaciones lineales', order: 9, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-9', preguntas: generarPreguntasBase('209', 'Inecuaciones lineales') } },
      { id: 'sec-m1-2-10', title: '10. Problemas de inecuaciones lineales', order: 10, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-10', preguntas: generarPreguntasBase('210', 'Problemas de inecuaciones') } },
      // Unidad: Sistemas de ecuaciones lineales (2x2)
      { id: 'sec-m1-2-11', title: '11. Resolución de sistemas de ecuaciones (2x2)', order: 11, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-11', preguntas: generarPreguntasBase('211', 'Sistemas 2x2') } },
      { id: 'sec-m1-2-12', title: '12. Problemas de sistemas de ecuaciones', order: 12, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-12', preguntas: generarPreguntasBase('212', 'Problemas de Sistemas 2x2') } },
      // Unidad: Función lineal y afín
      { id: 'sec-m1-2-13', title: '13. Concepto de función lineal y afín', order: 13, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-13', preguntas: generarPreguntasBase('213', 'Función lineal y afín') } },
      { id: 'sec-m1-2-14', title: '14. Tablas y gráficos de función lineal y afín', order: 14, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-14', preguntas: generarPreguntasBase('214', 'Gráficos de funciones') } },
      { id: 'sec-m1-2-15', title: '15. Problemas de función lineal y afín', order: 15, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-15', preguntas: generarPreguntasBase('215', 'Problemas de funciones lineales') } },
      // Unidad: Función cuadrática
      { id: 'sec-m1-2-16', title: '16. Resolución y problemas de ecuaciones de 2do grado', order: 16, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-16', preguntas: generarPreguntasBase('216', 'Ecuaciones cuadráticas') } },
      { id: 'sec-m1-2-17', title: '17. Tablas y gráficos de la función cuadrática', order: 17, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-17', preguntas: generarPreguntasBase('217', 'Gráficos de parábolas') } },
      { id: 'sec-m1-2-18', title: '18. Puntos especiales: vértice y raíces', order: 18, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-18', preguntas: generarPreguntasBase('218', 'Vértice e intersecciones') } },
      { id: 'sec-m1-2-19', title: '19. Problemas de función cuadrática', order: 19, introduccion: '', datos_claves: [], test: { id: 'test-m1-2-19', preguntas: generarPreguntasBase('219', 'Problemas con parábolas') } }
    ]
  },
  {
    id: 'cap-m1-3-geometria',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Geometría',
    introduccion: 'Descubre las figuras geométricas, cálculo de áreas, volúmenes, teorema de Pitágoras, transformaciones isométricas y semejanza.',
    order: 3,
    secciones: [
      // Unidad: Figuras geométricas
      { id: 'sec-m1-3-1', title: '1. Teorema de Pitágoras', order: 1, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-1', preguntas: generarPreguntasBase('301', 'Teorema de Pitágoras') } },
      { id: 'sec-m1-3-2', title: '2. Perímetro y áreas de figuras planas', order: 2, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-2', preguntas: generarPreguntasBase('302', 'Perímetro y áreas') } },
      { id: 'sec-m1-3-3', title: '3. Problemas de perímetro y áreas', order: 3, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-3', preguntas: generarPreguntasBase('303', 'Problemas de figuras planas') } },
      // Unidad: Cuerpos geométricos
      { id: 'sec-m1-3-4', title: '4. Área de superficies de cuerpos', order: 4, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-4', preguntas: generarPreguntasBase('304', 'Área de cuerpos') } },
      { id: 'sec-m1-3-5', title: '5. Volumen de cuerpos geométricos', order: 5, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-5', preguntas: generarPreguntasBase('305', 'Volumen de cuerpos') } },
      { id: 'sec-m1-3-6', title: '6. Problemas de área y volumen', order: 6, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-6', preguntas: generarPreguntasBase('306', 'Problemas 3D') } },
      // Unidad: Transformaciones isométricas
      { id: 'sec-m1-3-7', title: '7. Puntos y vectores en el plano cartesiano', order: 7, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-7', preguntas: generarPreguntasBase('307', 'Vectores y plano') } },
      { id: 'sec-m1-3-8', title: '8. Rotación, traslación y reflexión', order: 8, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-8', preguntas: generarPreguntasBase('308', 'Transformaciones isométricas') } },
      { id: 'sec-m1-3-9', title: '9. Problemas de transformaciones', order: 9, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-9', preguntas: generarPreguntasBase('309', 'Problemas isométricos') } },
      // Unidad: Semejanza y proporcionalidad de figuras
      { id: 'sec-m1-3-10', title: '10. Semejanza y modelos a escala', order: 10, introduccion: '', datos_claves: [], test: { id: 'test-m1-3-10', preguntas: generarPreguntasBase('310', 'Semejanza') } }
    ]
  },
  {
    id: 'cap-m1-4-datos',
    materiaId: MATERIA_ID,
    title: 'Eje Temático: Probabilidad y Estadística',
    introduccion: 'Interpreta representaciones de datos, medidas de posición (cuartiles/percentiles) y reglas aditivas y multiplicativas de probabilidad.',
    order: 4,
    secciones: [
      // Unidad: Representación de datos
      { id: 'sec-m1-4-1', title: '1. Tablas de frecuencia absoluta y relativa', order: 1, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-1', preguntas: generarPreguntasBase('401', 'Tablas de frecuencia') } },
      { id: 'sec-m1-4-2', title: '2. Tipos de gráficos representativos', order: 2, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-2', preguntas: generarPreguntasBase('402', 'Gráficos') } },
      { id: 'sec-m1-4-3', title: '3. Promedio de un conjunto de datos', order: 3, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-3', preguntas: generarPreguntasBase('403', 'Promedio') } },
      { id: 'sec-m1-4-4', title: '4. Problemas con tablas y gráficos', order: 4, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-4', preguntas: generarPreguntasBase('404', 'Problemas estadísticos') } },
      // Unidad: Medidas de posición
      { id: 'sec-m1-4-5', title: '5. Cuartiles y percentiles', order: 5, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-5', preguntas: generarPreguntasBase('405', 'Medidas de posición') } },
      { id: 'sec-m1-4-6', title: '6. Diagrama de cajón', order: 6, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-6', preguntas: generarPreguntasBase('406', 'Boxplot') } },
      { id: 'sec-m1-4-7', title: '7. Problemas de medidas de posición', order: 7, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-7', preguntas: generarPreguntasBase('407', 'Problemas de cuartiles/percentiles') } },
      // Unidad: Reglas de las probabilidades
      { id: 'sec-m1-4-8', title: '8. Probabilidad de un evento', order: 8, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-8', preguntas: generarPreguntasBase('408', 'Probabilidad básica') } },
      { id: 'sec-m1-4-9', title: '9. Regla aditiva y multiplicativa', order: 9, introduccion: '', datos_claves: [], test: { id: 'test-m1-4-9', preguntas: generarPreguntasBase('409', 'Reglas de probabilidad') } }
    ]
  }
];

async function seedFirestore() {
  console.log('🌱 Starting Matematica M1 - CLEAN & RE-SEED...');

  try {
    // 1. Asegurar la materia
    await db.collection('lp_materias').doc(MATERIA_ID).set({ isActive: true }, { merge: true });
    console.log(`✅ Materia asegurada: ${MATERIA_ID}`);

    const capitulosRef = db.collection('lp_capitulos');

    // 2. Limpieza de capítulos anteriores de M1
    console.log('🧹 Limpiando capítulos antiguos de Matemáticas 1...');
    const oldCaps = await capitulosRef.where('materiaId', '==', MATERIA_ID).get();
    
    for (const doc of oldCaps.docs) {
      // Eliminar secciones anidadas
      const secciones = await doc.ref.collection('secciones').get();
      for (const secDoc of secciones.docs) {
        await secDoc.ref.delete();
      }
      // Eliminar el capítulo
      await doc.ref.delete();
      console.log(`  🗑️ Capítulo borrado: ${doc.id}`);
    }

    // 3. Iterar Capítulos e insertar la nueva estructura
    for (const cap of CAPITULOS) {
      const { secciones, ...capituloData } = cap;
      await capitulosRef.doc(cap.id).set(capituloData);
      console.log(`✅ Capítulo seeded: ${cap.id}`);

      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');
      
      // 4. Iterar Secciones (Pasos de la lección)
      for (const sec of secciones) {
        const { test, ...seccionData } = sec;
        
        const secWithIds = {
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id,
          testId: test.id
        };
        
        await seccionesRef.doc(sec.id).set(secWithIds);
        
        // 5. Inyectar el test con las 2 preguntas
        const testsRef = db.collection('lp_tests');
        await testsRef.doc(test.id).set({
          ...test,
          seccionId: sec.id
        });
        console.log(`  ✅ Sección seeded: ${sec.id}`);
      }
    }

    console.log('🎉 Seed de Arquitectura M1 completado y saneado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

// Iniciar
seedFirestore();
