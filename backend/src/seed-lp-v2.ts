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

// ── MATERIAS ─────────────────────────────────────────────────────────────────
const MATERIAS = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '📐', order: 2, isActive: false },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 4, isActive: false },
];

// ── CAPÍTULOS ─────────────────────────────────────────────────────────────────
const CAPITULOS = [
  {
    id: 'cap-localizar',
    materiaId: 'comp-lectora',
    title: 'Habilidad 1: Localizar',
    introduccion: 'Localizar es la habilidad de identificar, reconocer y extraer información explícita de un texto. La clave es rastrear la información tal como aparece escrita, sin interpretarla.',
    order: 1,
  },
  {
    id: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Habilidad 2: Interpretar',
    introduccion: 'Interpretar consiste en establecer significados a partir de las relaciones entre distintas partes del texto. Implica inferir, relacionar ideas y determinar el significado de expresiones.',
    order: 2,
  },
  {
    id: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Habilidad 3: Evaluar',
    introduccion: 'Evaluar es reflexionar y juzgar el texto analizando su forma o contenido, la intención del autor, la calidad de sus argumentos y los recursos que usa.',
    order: 3,
  },
];

// ── SECCIONES + TESTS ─────────────────────────────────────────────────────────

const SECCIONES_CAP1 = [
  {
    id: 'loc-1',
    capituloId: 'cap-localizar',
    materiaId: 'comp-lectora',
    title: 'Extraer información explícita',
    introduccion: 'La pregunta tiene la respuesta literal en el texto. Solo debes rastrear la coincidencia entre lo que se pregunta y lo que dice el texto, incluso si usa sinónimos o paráfrasis.',
    datos_claves: [
      'La respuesta está en el texto tal como está escrita — no necesitas interpretar.',
      'Busca palabras clave de la pregunta en el texto y lee el contexto cercano.',
      'Cuidado con los distractores que mezclan información de otras partes del texto.',
    ],
    order: 1,
    testId: 'test-loc-1',
  },
  {
    id: 'loc-2',
    capituloId: 'cap-localizar',
    materiaId: 'comp-lectora',
    title: 'Identificar datos específicos',
    introduccion: 'Preguntas como "según el texto, ¿cuándo/dónde/quién...?" requieren rastrear un dato preciso. La clave es ubicar el fragmento correcto sin confundirlo con información similar.',
    datos_claves: [
      'Las preguntas de datos numéricos, nombres o fechas siempre tienen respuesta literal.',
      'Si la información aparece varias veces, verifica el contexto exacto que pide la pregunta.',
      'Los sinónimos en la pregunta te guían hacia el fragmento correcto del texto.',
    ],
    order: 2,
    testId: 'test-loc-2',
  },
];

const SECCIONES_CAP2 = [
  {
    id: 'int-1',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Establecer relaciones entre párrafos',
    introduccion: 'Esta tarea pide identificar cómo se conectan dos partes del texto: ¿el segundo ejemplifica al primero? ¿Lo contradice? ¿Agrega información? La relación lógica es la clave.',
    datos_claves: [
      'Lee el inicio de cada párrafo — ahí está la idea que lo rige.',
      'Relaciones frecuentes: causa/efecto, problema/solución, definición/ejemplo, general/particular.',
      'El primer párrafo suele presentar el tema; el segundo lo desarrolla o matiza.',
    ],
    order: 1,
    testId: 'test-int-1',
  },
  {
    id: 'int-2',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Elaborar inferencias',
    introduccion: 'Una inferencia es una conclusión que el texto sugiere sin decirlo directamente. Debes unir pistas del texto para llegar a una idea no escrita explícitamente.',
    datos_claves: [
      'La respuesta correcta no está escrita tal cual en el texto — debes deducirla.',
      'Busca dos o más ideas del texto que juntas lleven a la conclusión.',
      'Descarta las opciones que exageran o agregan información que el texto no da.',
    ],
    order: 2,
    testId: 'test-int-2',
  },
  {
    id: 'int-3',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Determinar el significado de expresiones',
    introduccion: 'El texto usa palabras o frases cuyo significado debes deducir del contexto. No es un diccionario — es el sentido que la expresión tiene en ESE texto.',
    datos_claves: [
      'Sustituye la expresión por cada alternativa y comprueba cuál mantiene el sentido del párrafo.',
      'El lenguaje connotativo (metáforas, frases hechas) no debe tomarse literalmente.',
      'El contexto antes y después de la expresión siempre da la pista.',
    ],
    order: 3,
    testId: 'test-int-3',
  },
  {
    id: 'int-4',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Sintetizar e identificar idea principal',
    introduccion: 'La idea principal no es un detalle ni un ejemplo — es la idea que resume el propósito central del texto o de una sección. Todos los demás párrafos la apoyan.',
    datos_claves: [
      'La idea principal suele estar al inicio o al final del texto/sección.',
      'Los ejemplos y datos son secundarios — no son la idea principal.',
      'Si puedes resumir el texto en una oración, esa es la idea principal.',
    ],
    order: 4,
    testId: 'test-int-4',
  },
];

const SECCIONES_CAP3 = [
  {
    id: 'ev-1',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Determinar la intención comunicativa',
    introduccion: '¿Para qué escribió esto el autor? ¿Para informar, persuadir, criticar, entretener? La intención se refleja en el tono, los recursos usados y el tipo de texto.',
    datos_claves: [
      'El propósito del autor se deduce del tipo de texto: artículo de opinión = persuadir/criticar.',
      'Las preguntas retóricas, las exclamaciones y los adjetivos valorativos revelan intención.',
      'La intención no es lo mismo que el tema — es el PARA QUÉ del texto.',
    ],
    order: 1,
    testId: 'test-ev-1',
  },
  {
    id: 'ev-2',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Evaluar la postura y actitud del emisor',
    introduccion: 'El emisor no es neutro — tiene una posición frente al tema. Debes identificar si es crítico, optimista, escéptico, irónico... y con qué evidencia del texto lo puedes demostrar.',
    datos_claves: [
      'La actitud se reconoce por los adjetivos, el tono y los verbos que usa el autor.',
      'Posiciones comunes: crítica, cuestionadora, pesimista, entusiasta, irónica.',
      'Siempre busca una cita del texto que justifique la actitud que eliges.',
    ],
    order: 2,
    testId: 'test-ev-2',
  },
  {
    id: 'ev-3',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Evaluar recursos lingüísticos y retóricos',
    introduccion: 'Los autores usan recursos como metáforas, comparaciones, preguntas retóricas, anécdotas o citas para lograr un efecto en el lector. Debes identificar cuál es ese efecto.',
    datos_claves: [
      'Anécdota al inicio = ilustrar un problema o introducir el tema.',
      'Comparaciones y metáforas = acercar una idea abstracta al lector.',
      'Preguntas retóricas = involucrar al lector o reforzar un argumento.',
    ],
    order: 3,
    testId: 'test-ev-3',
  },
];

// ── TESTS ─────────────────────────────────────────────────────────────────────

const TESTS: Record<string, any> = {
  'test-loc-1': {
    id: 'test-loc-1',
    seccionId: 'loc-1',
    contexto_base: 'El volcán Villarrica, ubicado en la región de La Araucanía, es uno de los más activos de Chile. Ha registrado más de 60 erupciones documentadas desde el siglo XVI, siendo la más reciente en 2015. Su cono simétrico y la presencia constante de un lago de lava lo convierten en un caso de estudio fundamental para la vulcanología latinoamericana.',
    preguntas: [
      { id: 1, enunciado: '¿Cuántas erupciones documentadas tiene el volcán Villarrica?', alternativas: { A: 'Más de 40', B: 'Más de 60', C: 'Exactamente 65', D: 'Más de 80' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El texto dice "más de 60 erupciones documentadas". La respuesta estaba explícita.', feedback_error: 'Vuelve al texto y busca el número exacto. La información está en la segunda oración.' },
      { id: 2, enunciado: '¿Desde qué siglo se documentan las erupciones del Villarrica?', alternativas: { A: 'Desde el siglo XIV', B: 'Desde el siglo XV', C: 'Desde el siglo XVI', D: 'Desde el siglo XVII' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! "desde el siglo XVI" es la información explícita del texto.', feedback_error: 'Busca la palabra "siglo" en el texto. La fecha aparece claramente en la segunda oración.' },
    ],
  },
  'test-loc-2': {
    id: 'test-loc-2',
    seccionId: 'loc-2',
    contexto_base: 'La Biblioteca Nacional de Chile fue fundada en 1813, durante el gobierno de José Miguel Carrera. Inicialmente funcionó en dependencias del antiguo Convento de la Compañía de Jesús. En 1925 se trasladó a su edificio actual en la Alameda, en Santiago. Actualmente alberga más de siete millones de documentos entre libros, manuscritos, mapas y fotografías.',
    preguntas: [
      { id: 3, enunciado: '¿En qué año fue fundada la Biblioteca Nacional de Chile?', alternativas: { A: 'En 1810', B: 'En 1813', C: 'En 1825', D: 'En 1925' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! "fundada en 1813" es dato explícito, primera oración.', feedback_error: 'No confundas 1813 (fundación) con 1925 (traslado al edificio actual). Lee la primera oración.' },
      { id: 4, enunciado: '¿Dónde funcionó inicialmente la Biblioteca Nacional?', alternativas: { A: 'En la Alameda de Santiago', B: 'En el Palacio de La Moneda', C: 'En el Convento de la Compañía de Jesús', D: 'En la Universidad de Chile' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! "dependencias del antiguo Convento de la Compañía de Jesús", segunda oración.', feedback_error: 'La Alameda es su ubicación ACTUAL (desde 1925), no la inicial. Lee la segunda oración.' },
    ],
  },
  'test-int-1': {
    id: 'test-int-1',
    seccionId: 'int-1',
    contexto_base: 'La inteligencia artificial ha transformado radicalmente la medicina diagnóstica. Los algoritmos actuales detectan ciertos tipos de cáncer con mayor precisión que muchos especialistas humanos. Sin embargo, su implementación masiva enfrenta obstáculos legales y éticos significativos: ¿quién es responsable si el algoritmo falla?',
    preguntas: [
      { id: 5, enunciado: '¿Cuál es la relación entre el primer y el segundo párrafo del texto?', alternativas: { A: 'El primero presenta un avance; el segundo describe sus limitaciones prácticas.', B: 'El primero define la IA; el segundo explica cómo funciona médicamente.', C: 'El primero critica la medicina; el segundo propone una solución tecnológica.', D: 'El primero y el segundo son contradictorios entre sí.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! El primer párrafo presenta el avance (IA detecta cáncer mejor). El segundo introduce la limitación (obstáculos legales y éticos).', feedback_error: 'El primer párrafo habla del ÉXITO de la IA. El segundo introduce el PROBLEMA de su implementación. ¿Qué relación lógica es esa?' },
    ],
  },
  'test-int-2': {
    id: 'test-int-2',
    seccionId: 'int-2',
    contexto_base: 'El español es la segunda lengua más hablada en Estados Unidos. En ciudades como Los Ángeles o Miami, es posible desenvolverse completamente en español en el comercio, la salud y la educación. Las proyecciones demográficas indican que para 2060, uno de cada tres estadounidenses tendrá origen hispano.',
    preguntas: [
      { id: 6, enunciado: '¿Qué se puede inferir del texto sobre el futuro del español en EE.UU.?', alternativas: { A: 'El español desplazará al inglés como idioma oficial.', B: 'El español ganará mayor presencia e influencia en la sociedad estadounidense.', C: 'El español quedará restringido a comunidades migrantes sin integración.', D: 'El español perderá hablantes debido a la asimilación cultural.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Combina las pistas: ya es la 2ª lengua, ya funciona en servicios cotidianos y para 2060 el 33% será de origen hispano. La conclusión lógica es mayor presencia.', feedback_error: 'No hay datos que sugieran que desplace al inglés ni que pierda hablantes. ¿Qué conclusión moderada se puede sacar de los tres datos juntos?' },
    ],
  },
  'test-int-3': {
    id: 'test-int-3',
    seccionId: 'int-3',
    contexto_base: 'La escritora comentó que escribir su primera novela fue "un parto largo y doloroso, pero del que nació algo que valió la pena". Tardó siete años en terminarla, enfrentando rechazos de varias editoriales antes de publicarla. Hoy, el libro es un bestseller traducido a veinte idiomas.',
    preguntas: [
      { id: 7, enunciado: 'En el contexto del texto, ¿qué significa la expresión "un parto largo y doloroso"?', alternativas: { A: 'Un proceso físicamente agotador que requirió hospitalización.', B: 'Un proceso creativo difícil y prolongado.', C: 'Una experiencia de maternidad que influyó en la novela.', D: 'Un método de escritura acelerado bajo presión editorial.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! "Parto" es una metáfora del proceso creativo. El contexto (7 años, rechazos) confirma que fue difícil y largo.', feedback_error: '"Parto" aquí es metáfora, no literal. El contexto (7 años de escritura, rechazos) te dice cómo interpretar la expresión.' },
    ],
  },
  'test-int-4': {
    id: 'test-int-4',
    seccionId: 'int-4',
    contexto_base: 'Las abejas son esenciales para la polinización de cultivos que representan el 35% de la producción mundial de alimentos. En la última década, sus poblaciones han disminuido alarmantemente en Europa y América del Norte, debido principalmente al uso de pesticidas, la pérdida de hábitat y las enfermedades parasitarias. Sin abejas, la producción de frutas, verduras y frutos secos colapsaría.',
    preguntas: [
      { id: 8, enunciado: '¿Cuál es la idea principal del texto?', alternativas: { A: 'Los pesticidas son el principal enemigo de las abejas en el mundo.', B: 'La disminución de las abejas representa una grave amenaza para la alimentación global.', C: 'El 35% de los alimentos del mundo depende exclusivamente de las abejas.', D: 'Las abejas de Europa están en mayor peligro que las de América del Norte.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! Todos los detalles del texto apoyan esta idea central: su importancia, su declive y las consecuencias.', feedback_error: 'El 35%, los pesticidas y la comparación Europa/América son detalles que apoyan la idea central. ¿Cuál es la idea que los resume a todos?' },
    ],
  },
  'test-ev-1': {
    id: 'test-ev-1',
    seccionId: 'ev-1',
    contexto_base: 'Los teléfonos inteligentes son, sin duda, la herramienta más transformadora de nuestra era. Han redefinido cómo trabajamos, nos comunicamos y nos entretenemos. Sin embargo, nadie eligió realmente este cambio: nos fue impuesto por la velocidad del mercado, sin pausa para reflexionar sobre sus consecuencias en la salud mental, especialmente en los jóvenes.',
    preguntas: [
      { id: 9, enunciado: '¿Cuál es la intención comunicativa principal del texto?', alternativas: { A: 'Informar objetivamente sobre el impacto de los smartphones en la sociedad.', B: 'Persuadir al lector de abandonar el uso del teléfono inteligente.', C: 'Reflexionar críticamente sobre la adopción acrítica de la tecnología.', D: 'Describir el funcionamiento técnico de los teléfonos inteligentes.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! El texto no solo informa — critica que "nadie eligió realmente este cambio" y señala consecuencias. Es reflexión crítica.', feedback_error: 'El texto no da instrucciones ni datos técnicos. Tiene un juicio de valor ("nos fue impuesto"). ¿Para qué hace eso el autor?' },
    ],
  },
  'test-ev-2': {
    id: 'test-ev-2',
    seccionId: 'ev-2',
    contexto_base: 'En una entrevista reciente, Claudio Magris recordaba que cuando enseñaba en un college de Estados Unidos, "solo cinco o seis estudiantes en una clase de 36 sabían quién fue Stalin". Añadía que ese tipo de ignorancia sobre sucesos que marcaron épocas del pasado se estaba acentuando, y que le impresionaba esa "memoria corta" de las nuevas generaciones.',
    preguntas: [
      { id: 10, enunciado: '¿Cuál es la actitud del emisor frente al problema de la "memoria corta"?', alternativas: { A: 'Crítica, pues considera que los intelectuales incumplen su rol de modelos culturales.', B: 'Indiferente, pues describe el fenómeno sin tomar partido.', C: 'Cuestionadora, pues cree que la educación carece de perspectiva histórica integradora.', D: 'Pesimista, pues considera que el problema no tiene solución posible.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien identificado! El autor cuestiona que la educación no transmita referentes históricos. No culpa a individuos ni es puramente pesimista.', feedback_error: 'El autor SÍ toma partido — le "impresiona" la memoria corta. Pero no dice que no tiene solución ni culpa solo a intelectuales. ¿Qué cuestiona exactamente?' },
    ],
  },
  'test-ev-3': {
    id: 'test-ev-3',
    seccionId: 'ev-3',
    contexto_base: 'El físico Carlo Rovelli abre su libro sobre el tiempo con esta imagen: "El tiempo es familiar e íntimo. Su furia nos lleva. Su apresurada sucesión de segundos, horas, años, nos lanza hacia la vida, luego nos arrastra hacia la nada... Lo habitamos como los peces habitan el agua."',
    preguntas: [
      { id: 11, enunciado: '¿Con qué intención el emisor incluye la comparación "lo habitamos como los peces habitan el agua"?', alternativas: { A: 'Para motivar al lector a explorar contenidos científicos complejos.', B: 'Para acercar una idea abstracta al lector mediante una imagen cotidiana.', C: 'Para demostrar que el tiempo es un concepto imposible de comprender.', D: 'Para establecer una diferencia entre los seres humanos y los animales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Los peces en el agua es una imagen concreta y familiar que sirve para explicar cómo vivimos en el tiempo sin notarlo — idea abstracta hecha simple.', feedback_error: 'Piensa: ¿por qué un físico usa una metáfora en vez de una fórmula? Porque quiere hacer accesible algo difícil. ¿Cuál alternativa describe eso?' },
    ],
  },
};

async function seed() {
  console.log('🌱 Seeding v2 learning path...');
  const batch = db.batch();

  // Materias
  for (const m of MATERIAS) {
    batch.set(db.collection('lp_materias').doc(m.id), m);
  }

  // Capítulos
  for (const c of CAPITULOS) {
    batch.set(db.collection('lp_capitulos').doc(c.id), c);
  }

  await batch.commit();
  console.log('✅ Materias y capítulos guardados');

  // Secciones
  const allSecciones = [...SECCIONES_CAP1, ...SECCIONES_CAP2, ...SECCIONES_CAP3];
  for (const s of allSecciones) {
    const { capituloId, ...secData } = s;
    await db.collection('lp_capitulos').doc(capituloId).collection('secciones').doc(s.id).set(s);
    console.log(`✅ Sección: ${s.id}`);
  }

  // Tests
  for (const [id, test] of Object.entries(TESTS)) {
    await db.collection('lp_tests').doc(id).set(test);
    console.log(`✅ Test: ${id}`);
  }

  console.log('🎉 Done!');
}

seed();
