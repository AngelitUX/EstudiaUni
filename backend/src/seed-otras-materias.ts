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

const NUEVOS_CAPITULOS = [
  // ─── MATEMÁTICA 1 ───
  {
    id: 'cap-m1-numeros',
    materiaId: 'mat1',
    title: 'Números y Proporcionalidad',
    introduccion: 'Domina los conceptos básicos de conjuntos numéricos, porcentajes y razones.',
    order: 1,
    secciones: [
      {
        id: 'sec-m1-num-1',
        title: '1. Porcentajes en la Vida Diaria',
        introduccion: 'Los porcentajes son clave en la PAES. Aprende a calcular descuentos, aumentos e interés simple.',
        datos_claves: [
          'Un porcentaje es una fracción de 100: 20% es lo mismo que 20/100 o 0.2.',
          'Para calcular el precio final con un descuento del X%, multiplica el precio original por (1 - X/100).'
        ],
        order: 1,
        testId: 'test-m1-num-1'
      }
    ]
  },
  {
    id: 'cap-m1-algebra',
    materiaId: 'mat1',
    title: 'Álgebra y Funciones',
    introduccion: 'Trabaja con expresiones algebraicas, ecuaciones y funciones lineales.',
    order: 2,
    secciones: [
      {
        id: 'sec-m1-alg-1',
        title: '1. Ecuaciones Lineales y Gráficos',
        introduccion: 'Interpreta problemas de la vida real mediante ecuaciones y comprende la pendiente.',
        datos_claves: [
          'La forma principal de la ecuación de la recta es y = mx + n, donde m es la pendiente.',
          'Una pendiente positiva indica crecimiento; una negativa, decrecimiento.'
        ],
        order: 1,
        testId: 'test-m1-alg-1'
      }
    ]
  },

  // ─── HISTORIA Y CIENCIAS SOCIALES ───
  {
    id: 'cap-hist-chile',
    materiaId: 'historia',
    title: 'Historia de Chile: Siglo XIX y XX',
    introduccion: 'Analiza los procesos políticos, económicos y sociales que configuraron el Chile contemporáneo.',
    order: 1,
    secciones: [
      {
        id: 'sec-hist-chi-1',
        title: '1. El Ciclo del Salitre',
        introduccion: 'Comprende el impacto económico del salitre tras la Guerra del Pacífico y la Cuestión Social.',
        datos_claves: [
          'El salitre generó grandes ingresos al Estado, que se invirtieron en infraestructura, pero la riqueza estuvo mal distribuida.',
          'La "Cuestión Social" refiere a las precarias condiciones de vida y trabajo de los sectores populares a fines del siglo XIX.'
        ],
        order: 1,
        testId: 'test-hist-chi-1'
      }
    ]
  },

  // ─── CIENCIAS (BIOLOGÍA) ───
  {
    id: 'cap-cien-biologia',
    materiaId: 'ciencias',
    title: 'Biología: Organización y Estructura Celular',
    introduccion: 'Comprende las diferencias entre células procariontes y eucariontes, y sus organelos.',
    order: 1,
    secciones: [
      {
        id: 'sec-cien-bio-1',
        title: '1. Tipos de Células',
        introduccion: 'Aprende a distinguir las características clave de procariontes y eucariontes (animal y vegetal).',
        datos_claves: [
          'Las células procariontes no tienen núcleo definido ni organelos membranosos.',
          'Las células eucariontes vegetales poseen pared celular de celulosa y cloroplastos, ausentes en las animales.'
        ],
        order: 1,
        testId: 'test-cien-bio-1'
      }
    ]
  }
];

const NUEVOS_TESTS = [
  // MATEMÁTICA 1
  {
    id: 'test-m1-num-1',
    seccionId: 'sec-m1-num-1',
    contexto_base: null,
    preguntas: [
      {
        id: 1,
        enunciado: 'Un pantalón cuesta $25.000, pero está con un 20% de descuento. Si al pagar en caja se aplica un recargo del 5% sobre el precio ya descontado por usar tarjeta de crédito, ¿cuál es el valor final a pagar?',
        alternativas: { A: '$19.000', B: '$20.000', C: '$21.000', D: '$21.250' },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! Primero calculamos el descuento: $25.000 * 0.8 = $20.000. Luego, aplicamos el recargo del 5% sobre ese monto: $20.000 * 1.05 = $21.000.',
        feedback_error: 'Revisa los pasos. Primero aplica el descuento al precio original, y luego aplica el recargo al nuevo precio, no al original.'
      }
    ]
  },
  {
    id: 'test-m1-alg-1',
    seccionId: 'sec-m1-alg-1',
    contexto_base: null,
    preguntas: [
      {
        id: 1,
        enunciado: 'Observa el siguiente gráfico de una función afín. ¿Cuál es la ecuación de la recta representada?',
        imagen_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Linear_Function_Graph.svg/1200px-Linear_Function_Graph.svg.png',
        alternativas: { A: 'y = 2x + 1', B: 'y = x/2 + 1', C: 'y = 2x - 1', D: 'y = -2x + 1' },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente! La recta intersecta al eje Y en y=1 (n=1) y por cada 2 unidades que avanza en X, sube 1 unidad en Y (m=1/2).',
        feedback_error: 'Fíjate en dónde cruza el eje Y (coeficiente de posición) y cuánto sube la recta cuando avanzas un espacio a la derecha (pendiente).'
      }
    ]
  },

  // HISTORIA
  {
    id: 'test-hist-chi-1',
    seccionId: 'sec-hist-chi-1',
    contexto_base: 'Durante la época del salitre en Chile (1880-1930), la economía nacional dependió casi exclusivamente de las exportaciones de este mineral. El Estado chileno cobraba un impuesto a la exportación, lo que multiplicó sus ingresos y permitió la expansión del aparato estatal y obras públicas. Sin embargo, en las salitreras del Norte Grande, los trabajadores vivían en condiciones de hacinamiento y se les pagaba con fichas que solo eran válidas en las pulperías de la misma empresa.',
    preguntas: [
      {
        id: 1,
        enunciado: 'Según el texto, ¿cuál fue una consecuencia económica directa para el Estado chileno producto del ciclo salitrero?',
        alternativas: { A: 'La nacionalización total de las empresas salitreras extranjeras.', B: 'La disminución de la burocracia y el gasto público estatal.', C: 'El aumento de los ingresos fiscales mediante el cobro de impuestos de exportación.', D: 'La erradicación de la pobreza gracias a la equitativa distribución de las ganancias.' },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Muy bien! El texto menciona explícitamente que el Estado cobraba un impuesto que multiplicó sus ingresos y permitió expandir el aparato estatal.',
        feedback_error: 'Vuelve a leer el segundo y tercer renglón del texto. Fíjate en cómo obtenía dinero el Estado.'
      }
    ]
  },

  // CIENCIAS
  {
    id: 'test-cien-bio-1',
    seccionId: 'sec-cien-bio-1',
    contexto_base: null,
    preguntas: [
      {
        id: 1,
        enunciado: 'Al observar una muestra de tejido bajo el microscopio, un estudiante nota la presencia de una pared celular rígida y grandes vacuolas centrales en las células. Basándose en estas observaciones, ¿a qué tipo de organismo pertenece probablemente la muestra?',
        imagen_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Plant_cell_structure_svg.svg/800px-Plant_cell_structure_svg.svg.png',
        alternativas: { A: 'A un animal vertebrado.', B: 'A una bacteria (procarionte).', C: 'A una planta (eucarionte vegetal).', D: 'A un hongo filamentoso.' },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! La pared celular (generalmente de celulosa) y las grandes vacuolas centrales son características distintivas de las células eucariontes vegetales.',
        feedback_error: 'Recuerda las diferencias estructurales. Las células animales no tienen pared celular, y las bacterias no tienen organelos membranosos como grandes vacuolas.'
      }
    ]
  }
];

async function seedOtrasMaterias() {
  console.log('🌱 Iniciando seed de Matemática 1, Historia y Ciencias...\n');

  // Asegurar que las materias estén activas
  const materiasActivas = ['mat1', 'historia', 'ciencias'];
  for (const matId of materiasActivas) {
    await db.collection('lp_materias').doc(matId).update({ isActive: true });
    console.log(`✅ Materia ${matId} activada.`);
  }

  // 1. Borrar capítulos antiguos de estas materias
  const capsRef = db.collection('lp_capitulos');
  for (const matId of materiasActivas) {
    const capsSnapshot = await capsRef.where('materiaId', '==', matId).get();
    for (const doc of capsSnapshot.docs) {
      // Borrar secciones
      const secSnap = await doc.ref.collection('secciones').get();
      for (const sDoc of secSnap.docs) {
        await sDoc.ref.delete();
      }
      await doc.ref.delete();
    }
  }

  // 2. Insertar Capítulos y Secciones
  console.log('\n📝 Insertando Capítulos y Secciones...');
  for (const cap of NUEVOS_CAPITULOS) {
    const capRef = db.collection('lp_capitulos').doc(cap.id);
    const capData = { ...cap };
    delete (capData as any).secciones;
    await capRef.set(capData);
    console.log(`  ➕ Capítulo: ${cap.id}`);

    for (const sec of cap.secciones) {
      await capRef.collection('secciones').doc(sec.id).set(sec);
      console.log(`    ➕ Sección: ${sec.id}`);
    }
  }

  // 3. Insertar Tests
  console.log('\n📝 Insertando Tests...');
  for (const test of NUEVOS_TESTS) {
    await db.collection('lp_tests').doc(test.id).set(test);
    console.log(`  ➕ Test: ${test.id}`);
  }

  console.log('\n🎉 Seed completado exitosamente.');
}

seedOtrasMaterias().catch(console.error);
