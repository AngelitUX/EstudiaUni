import * as admin from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

admin.initializeApp({
  projectId: 'estudiauni-local',
});
const db = admin.firestore();


const NUEVOS_CAPITULOS = [
  // ─── CIENCIAS TÉCNICO PROFESIONAL ───
  {
    id: 'cap-ctp-biologia',
    materiaId: 'ciencias-tp',
    title: 'Biología TP: Células y Funciones',
    introduccion: 'Domina los conceptos de organización celular, procesos biológicos, herencia y evolución aplicados al contexto técnico profesional.',
    order: 1,
    secciones: [
      {
        id: 'sec-ctp-bio-1',
        title: '1. Organización y Estructura Celular',
        introduccion: 'Aprende sobre la estructura y función de los principales organelos en procariontes y eucariontes.',
        datos_claves: [
          'El flagelo es una estructura que permite la movilidad en bacterias como la E. coli.',
          'El retículo endoplasmático liso (REL) participa en funciones metabólicas como la síntesis de lípidos y desintoxicación.'
        ],
        order: 1,
        testId: 'test-ctp-bio-1'
      },
      {
        id: 'sec-ctp-bio-2',
        title: '2. Procesos y Funciones Biológicas',
        introduccion: 'Comprende el funcionamiento de sistemas biológicos como el sistema nervioso y el reproductivo.',
        datos_claves: [
          'Las células beta pancreáticas secretan insulina, vital para regular la glucosa en sangre.',
          'Los preservativos son métodos de barrera con alta efectividad para prevenir infecciones de transmisión sexual como el VIH.'
        ],
        order: 2,
        testId: 'test-ctp-bio-2'
      }
    ]
  },
  {
    id: 'cap-ctp-fisica',
    materiaId: 'ciencias-tp',
    title: 'Física TP: Ondas, Mecánica y Energía',
    introduccion: 'Analiza fenómenos ondulatorios, cinemática, dinámica y electricidad en situaciones prácticas.',
    order: 2,
    secciones: [
      {
        id: 'sec-ctp-fis-1',
        title: '1. Fenómenos Ondulatorios',
        introduccion: 'Entiende cómo las ondas interactúan con diferentes medios y su aplicación tecnológica.',
        datos_claves: [
          'La reflexión ocurre cuando una onda rebota en una superficie, manteniendo su frecuencia.',
          'La refracción es el cambio de dirección de una onda al pasar de un medio a otro.'
        ],
        order: 1,
        testId: 'test-ctp-fis-1'
      }
    ]
  },
  {
    id: 'cap-ctp-quimica',
    materiaId: 'ciencias-tp',
    title: 'Química TP: Estructura y Reacciones',
    introduccion: 'Estudia la composición de la materia, compuestos orgánicos y las relaciones estequiométricas.',
    order: 3,
    secciones: [
      {
        id: 'sec-ctp-qui-1',
        title: '1. Estructura Atómica y Propiedades',
        introduccion: 'Identifica los componentes del átomo y los diferentes cambios físicos y químicos de la materia.',
        datos_claves: [
          'El modelo de Rutherford demostró que el átomo está formado principalmente por espacio vacío, con un núcleo denso.',
          'La condensación de vapor de agua es un cambio físico, mientras que la combustión es un cambio químico.'
        ],
        order: 1,
        testId: 'test-ctp-qui-1'
      }
    ]
  }
];

const NUEVOS_TESTS = [
  // CIENCIAS TÉCNICO PROFESIONAL
  {
    id: 'test-ctp-bio-1',
    seccionId: 'sec-ctp-bio-1',
    contexto_base: 'Una investigación comprobó que al mutar genéticamente una estructura de la bacteria E. coli, esta le permite adherirse a ciertas superficies y mantenerse rotando constantemente como una hélice. En este contexto, se propone que formar un nanodispositivo con dichas bacterias, dispuestas de forma alineada por el interior de la superficie de un tubo, facilitaría el desplazamiento de fluidos viscosos o difíciles de mover.',
    preguntas: [
      {
        id: 1,
        enunciado: 'En relación con la información anterior, ¿cuál de las siguientes opciones señala correctamente la estructura bacteriana que se manipuló para conformar este nanodispositivo?',
        alternativas: { A: 'El flagelo.', B: 'La cápsula.', C: 'La pared celular.', D: 'La membrana plasmática.' },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! El flagelo es la estructura que otorga movilidad y la capacidad de rotar como una hélice a bacterias como E. coli.',
        feedback_error: 'Revisa las funciones de los organelos. ¿Qué estructura celular procarionte está directamente asociada a la movilidad y rotación?'
      },
      {
        id: 2,
        enunciado: 'Un estudio en hepatocitos de rata muestra que existen intensidades de radiación infrarroja que generan un efecto sobre la función del retículo endoplásmico liso (REL) de estas células. Para esto, los hepatocitos de distintas ratas son estimulados durante 15 días consecutivos con distintas intensidades de radiación infrarroja, lo que causa modificaciones en el volumen del REL. Al respecto, ¿cuál de las siguientes opciones corresponde a una variable dependiente de este experimento?',
        alternativas: { A: 'La intensidad de radiación infrarroja.', B: 'El tiempo de irradiación.', C: 'El volumen del REL.', D: 'La línea celular utilizada.' },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Excelente! La variable dependiente es aquella que se mide u observa para ver cómo cambia en respuesta a la variable independiente (la intensidad de radiación).',
        feedback_error: 'La variable dependiente es el resultado o efecto que se está midiendo en el estudio. Piensa en qué es lo que se modifica según la radiación.'
      }
    ]
  },
  {
    id: 'test-ctp-bio-2',
    seccionId: 'sec-ctp-bio-2',
    contexto_base: null,
    preguntas: [
      {
        id: 3,
        enunciado: 'Una patología que afecta a las células β pancreáticas es la diabetes tipo 2 (D2), que se caracteriza por una deficiencia en la secreción de insulina, generando un aumento de glucosa en la sangre. Por otra parte, varios estudios han identificado alteraciones estructurales y funcionales de las células  en personas con D2, las cuales aumentan la secreción de somatostatina, hormona que incrementa el déficit de insulina. Considerando estos antecedentes, un equipo médico plantea un "análisis morfológico de células  en humanos, en los cuales se aplicarán técnicas de detección de insulina y somatostatina en secciones del páncreas de individuos diabéticos y no diabéticos". ¿A qué componente de la investigación científica corresponde el texto entre comillas?',
        alternativas: { A: 'Al objetivo.', B: 'Al marco conceptual.', C: 'Al diseño experimental.', D: 'Al procedimiento experimental.' },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! El texto describe cómo se llevará a cabo el estudio (comparando individuos, aplicando técnicas específicas), lo cual corresponde al diseño experimental.',
        feedback_error: 'Presta atención a lo que describe la frase. No es una meta final ni un paso a paso detallado, sino la forma general en que estructurarán el estudio.'
      }
    ]
  },
  {
    id: 'test-ctp-fis-1',
    seccionId: 'sec-ctp-fis-1',
    contexto_base: 'Un grupo de estudiantes hace incidir un rayo luminoso desde el aire hacia el vidrio y mide la frecuencia del rayo incidente, reflejado y refractado.',
    preguntas: [
      {
        id: 4,
        enunciado: 'A partir de lo anterior, ¿cuál de los siguientes objetivos de investigación se relaciona directamente con el procedimiento realizado?',
        alternativas: { A: 'Comprobar si en el instante de la incidencia hay reflexión y refracción simultáneamente.', B: 'Comprobar si en el instante de la incidencia hay absorción de color del rayo incidente.', C: 'Comprobar si los rayos incidente, reflejado y refractado, están en mismo plano.', D: 'Comprobar si los rayos incidente, reflejado y refractado, tienen el mismo color.' },
        respuesta_correcta: 'D',
        feedback_acierto: '¡Bien! La frecuencia de la luz determina su color. Si miden la frecuencia, están buscando comprobar si el color se mantiene en los rayos.',
        feedback_error: 'Recuerda qué propiedad física de la luz está directamente relacionada con la frecuencia que midieron.'
      }
    ]
  },
  {
    id: 'test-ctp-qui-1',
    seccionId: 'sec-ctp-qui-1',
    contexto_base: null,
    preguntas: [
      {
        id: 5,
        enunciado: 'A comienzos del siglo XX, un científico propuso un modelo atómico formado por un núcleo y electrones girando a su alrededor. Este modelo surgió de experimentos donde hizo colisionar partículas positivas alfa contra una lámina delgada de oro, encontrando que la gran mayoría de las partículas alfa que colisionaron con la lámina no modificaron su trayectoria original. Sumado a lo anterior, una cantidad de una en cien mil partículas alfa no logró atravesar la lámina de oro, desviándose en dirección opuesta, y una cantidad aún menor de partículas alfa cambiaron su trayectoria al atravesar la lámina. De acuerdo con lo descrito anteriormente, ¿cuál de las siguientes inferencias es correcta?',
        alternativas: { A: 'El átomo está formado principalmente por espacio vacío.', B: 'El átomo tiene un núcleo que ocupa todo el volumen atómico.', C: 'El átomo tiene electrones que se repelen con las partículas alfa.', D: 'El átomo tiene partículas en su núcleo de carga contraria a las partículas alfa.' },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! Como la gran mayoría de las partículas atravesó la lámina sin desviarse, Rutherford concluyó que el átomo es en su mayor parte espacio vacío.',
        feedback_error: 'Si casi todas las partículas pasan de largo sin chocar con nada, ¿qué nos dice eso sobre la estructura principal del átomo?'
      }
    ]
  }
];

async function seedCienciasTP() {
  console.log('🌱 Iniciando seed de Ciencias - Técnico Profesional...\n');

  const materiaId = 'ciencias-tp';

  // Asegurar que la materia esté activa
  await db.collection('lp_materias').doc(materiaId).set({ isActive: true }, { merge: true });
  console.log(`✅ Materia ${materiaId} activada/creada.`);

  // 1. Borrar capítulos antiguos de esta materia
  const capsRef = db.collection('lp_capitulos');
  const capsSnapshot = await capsRef.where('materiaId', '==', materiaId).get();
  for (const doc of capsSnapshot.docs) {
    // Borrar secciones
    const secSnap = await doc.ref.collection('secciones').get();
    for (const sDoc of secSnap.docs) {
      await sDoc.ref.delete();
    }
    await doc.ref.delete();
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

  console.log('\n🎉 Seed de Ciencias TP completado exitosamente.');
}

seedCienciasTP().catch(console.error);
