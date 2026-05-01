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

// ── NUEVAS SECCIONES ──────────────────────────────────────────────────────────
const NUEVAS_SECCIONES = [
  // CAP LOCALIZAR
  {
    id: 'loc-3',
    capituloId: 'cap-localizar',
    materiaId: 'comp-lectora',
    title: 'Reconocer la función de un elemento textual',
    introduccion: 'Algunos elementos del texto (ejemplos, citas, comparaciones, notas al pie) no solo entregan información — cumplen una función dentro del texto. Esta tarea pide que identifiques PARA QUÉ está ese elemento ahí.',
    datos_claves: [
      'Los ejemplos sirven para ilustrar o concretar una idea abstracta.',
      'Las citas de autoridad sirven para validar o reforzar el argumento del autor.',
      'Las anécdotas introductorias sirven para contextualizar o captar la atención del lector.',
    ],
    order: 3,
    testId: 'test-loc-3',
  },
  // CAP INTERPRETAR
  {
    id: 'int-5',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Organización de las ideas en la lectura',
    introduccion: 'El autor organiza las ideas siguiendo una lógica: de lo general a lo particular, de la causa al efecto, del problema a la solución. Reconocer esa organización te ayuda a comprender el texto globalmente.',
    datos_claves: [
      'Estructuras comunes: definición → ejemplo, problema → causas → solución, tesis → argumentos.',
      'Conectores como "sin embargo", "por lo tanto" y "además" revelan la lógica del texto.',
      'Pregunta: ¿qué hace cada párrafo respecto del anterior? ¿Agrega, contrasta, ejemplifica?',
    ],
    order: 5,
    testId: 'test-int-5',
  },
  {
    id: 'int-6',
    capituloId: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Interpretar textos literarios: personajes y conflicto',
    introduccion: 'En los textos narrativos, la PAES evalúa tu comprensión de los personajes, sus motivaciones, el conflicto central y cómo el narrador presenta los hechos. No es suficiente recordar qué pasa — debes entender por qué.',
    datos_claves: [
      'El conflicto humano suele ser el corazón del relato: tensión interna o externa del personaje.',
      'Las acciones y el diálogo de un personaje revelan sus motivaciones más que sus descripciones.',
      'El narrador puede ser confiable o no — su perspectiva afecta cómo interpretas los hechos.',
    ],
    order: 6,
    testId: 'test-int-6',
  },
  // CAP EVALUAR
  {
    id: 'ev-4',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Juzgar la información: hechos vs. opiniones',
    introduccion: 'Los textos mezclan hechos verificables con opiniones del autor. Saber distinguirlos es clave para evaluar la calidad y credibilidad de un texto. Un hecho puede comprobarse; una opinión expresa un punto de vista.',
    datos_claves: [
      'Los hechos usan verbos como "es", "ocurrió", "registra" + datos concretos.',
      'Las opiniones usan verbos como "creo", "parece", "debería" + juicios de valor.',
      'Cuidado: una opinión expresada con tono seguro NO se convierte en hecho.',
    ],
    order: 4,
    testId: 'test-ev-4',
  },
  {
    id: 'ev-5',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Evaluar fallas en la argumentación',
    introduccion: 'No todos los argumentos son válidos. La PAES evalúa si puedes identificar cuando un autor exagera, usa estereotipos, hace generalizaciones injustificadas o apela solo a los sentimientos en vez de razones.',
    datos_claves: [
      'Generalización: usar "todos", "siempre", "nunca" sin evidencia suficiente.',
      'Argumento ad hominem: atacar al oponente en vez de al argumento.',
      'Apelación a la emoción: usar el miedo o la compasión como sustituto de la razón.',
    ],
    order: 5,
    testId: 'test-ev-5',
  },
  {
    id: 'ev-6',
    capituloId: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Relacionar el texto con nuevos contextos',
    introduccion: 'La habilidad más compleja del Evaluar: aplicar la información del texto a una situación nueva o relacionarla con otro texto. Debes ir más allá del texto mismo.',
    datos_claves: [
      'Primero comprende bien la idea central del texto original.',
      'Luego busca cuál de las alternativas presenta una situación análoga o relacionada.',
      'No busques contenido idéntico — busca la misma lógica o relación en un contexto distinto.',
    ],
    order: 6,
    testId: 'test-ev-6',
  },
];

// ── NUEVOS TESTS ──────────────────────────────────────────────────────────────
const NUEVOS_TESTS: Record<string, any> = {
  'test-loc-3': {
    id: 'test-loc-3',
    seccionId: 'loc-3',
    contexto_base: 'El calentamiento global ha alterado los ciclos migratorios de decenas de especies. Un estudio de la Universidad de Cambridge documentó que las golondrinas árticas ahora llegan al norte de Europa tres semanas antes que en 1980. Este caso ilustra perfectamente cómo un cambio de temperatura de apenas dos grados puede reorganizar ecosistemas enteros.',
    preguntas: [
      { id: 12, enunciado: '¿Para qué se menciona el caso de las golondrinas árticas?', alternativas: { A: 'Para cuestionar la metodología del estudio de Cambridge.', B: 'Para ilustrar concretamente el impacto del calentamiento en los ciclos migratorios.', C: 'Para demostrar que las aves son más sensibles al clima que los mamíferos.', D: 'Para informar sobre los resultados de una investigación zoológica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El propio texto lo dice: "Este caso ilustra perfectamente cómo...". Es un ejemplo concreto de la idea general.', feedback_error: 'Lee la última oración: "Este caso ilustra perfectamente...". El texto mismo te dice cuál es la función del ejemplo.' },
      { id: 13, enunciado: '¿Cuántas semanas antes llegan hoy las golondrinas árticas en comparación con 1980?', alternativas: { A: 'Dos semanas antes', B: 'Cuatro semanas antes', C: 'Tres semanas antes', D: 'Una semana antes' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! "tres semanas antes" está explícito en la segunda oración.', feedback_error: 'El dato exacto está en la segunda oración. No confundas "tres semanas" con "dos grados" (que es la temperatura).' },
    ],
  },
  'test-int-5': {
    id: 'test-int-5',
    seccionId: 'int-5',
    contexto_base: 'La desigualdad educativa en Chile comienza antes de la sala de clases. Los niños de familias de menores ingresos llegan a primero básico con un vocabulario hasta tres veces menor que sus pares de familias acomodadas. Esta brecha inicial se amplía con los años: a los 15, los estudiantes de colegios particulares pagados obtienen en promedio 100 puntos más en el SIMCE que los de escuelas municipales.',
    preguntas: [
      { id: 14, enunciado: '¿Cómo se organiza la información en este texto?', alternativas: { A: 'Se describe un problema, luego se proponen soluciones concretas.', B: 'Se presenta una causa y luego se muestra cómo sus efectos se agravan con el tiempo.', C: 'Se comparan dos sistemas educativos para determinar cuál es superior.', D: 'Se refutan los argumentos de quienes niegan la desigualdad educativa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! La brecha de vocabulario inicial (causa/inicio) se amplía con los años (efecto que crece). Es una estructura causa → consecuencia progresiva.', feedback_error: 'No hay soluciones ni refutaciones. Identifica qué hace cada oración: ¿presenta un estado inicial o muestra cómo evoluciona?' },
    ],
  },
  'test-int-6': {
    id: 'test-int-6',
    seccionId: 'int-6',
    contexto_base: 'Aquella mañana, Pedro llegó al trabajo una hora antes que nadie. Acomodó su escritorio, revisó sus correos y esperó. Cuando su jefe entró, Pedro se puso de pie y, sin decir palabra, le entregó una carta. El jefe la leyó lentamente, levantó la vista y asintió. Pedro ya había recogido sus cosas.',
    preguntas: [
      { id: 15, enunciado: '¿Qué conflicto humano se expresa a través del relato?', alternativas: { A: 'La dificultad de comunicarse con los superiores en el trabajo.', B: 'La tensión entre la lealtad laboral y la necesidad de cambio personal.', C: 'La decisión de abandonar un trabajo, ejecutada con determinación.', D: 'La incapacidad de Pedro para adaptarse al ambiente laboral.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien interpretado! Pedro llegó antes, preparó todo y actuó con calma y decisión. El conflicto ya estaba resuelto — el texto muestra su ejecución.', feedback_error: 'Pedro no duda ni fracasa. Llegó antes, preparó su carta y actuó. ¿Qué conflicto resuelto muestra esa secuencia de acciones?' },
      { id: 16, enunciado: '¿Qué revelan las acciones de Pedro ("llegó una hora antes", "acomodó su escritorio", "esperó") sobre su estado?', alternativas: { A: 'Nerviosismo e inseguridad frente a lo que iba a hacer.', B: 'Premeditación y calma frente a una decisión tomada de antemano.', C: 'Entusiasmo por demostrar su puntualidad y orden al jefe.', D: 'Indiferencia respecto del resultado de su gestión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Llegar antes, prepararse y esperar tranquilamente indica que la decisión estaba tomada. Es calma, no nerviosismo.', feedback_error: 'Alguien nervioso no llega temprano a ORGANIZAR su salida. ¿Qué transmite llegar antes, prepararse y esperar en silencio?' },
    ],
  },
  'test-ev-4': {
    id: 'test-ev-4',
    seccionId: 'ev-4',
    contexto_base: 'Chile tiene el índice de lectura más bajo de Sudamérica: los chilenos leen en promedio 5,3 libros al año. Esto es una vergüenza nacional. A mi juicio, la tecnología es la principal responsable de esta crisis cultural, pues los jóvenes prefieren las pantallas a los libros. Si no revertimos esta tendencia, perderemos nuestra identidad como civilización letrada.',
    preguntas: [
      { id: 17, enunciado: '¿Cuál de las siguientes afirmaciones del texto es un hecho y no una opinión?', alternativas: { A: '"Esto es una vergüenza nacional."', B: '"los chilenos leen en promedio 5,3 libros al año."', C: '"la tecnología es la principal responsable de esta crisis cultural."', D: '"perderemos nuestra identidad como civilización letrada."' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El promedio de 5,3 libros es un dato verificable. Las otras tres son opiniones del autor expresadas con juicios de valor o predicciones.', feedback_error: 'Un hecho es verificable objetivamente. ¿Cuál de las opciones es un dato concreto que se puede comprobar, y no un juicio del autor?' },
    ],
  },
  'test-ev-5': {
    id: 'test-ev-5',
    seccionId: 'ev-5',
    contexto_base: 'Los videojuegos son una pérdida de tiempo absoluta. Todos los jóvenes que los juegan obtienen peores calificaciones y desarrollan conductas violentas. Además, cualquier persona que defienda los videojuegos simplemente no entiende de educación. Debemos prohibirlos en los hogares si queremos salvar a nuestra juventud.',
    preguntas: [
      { id: 18, enunciado: '¿Qué falla argumentativa contiene la afirmación "todos los jóvenes que los juegan obtienen peores calificaciones y desarrollan conductas violentas"?', alternativas: { A: 'Es una apelación a la autoridad sin fundamento.', B: 'Es una generalización sin evidencia que sustente el "todos".', C: 'Es un argumento ad hominem contra los jugadores.', D: 'Es una apelación a la emoción mediante el miedo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Usar "todos" sin evidencia científica que lo respalde es una generalización injustificada — una falla argumentativa clásica.', feedback_error: 'La palabra clave es "todos". ¿Es posible afirmar que TODOS los jugadores tienen peores notas sin evidencia? ¿Cómo se llama ese error lógico?' },
      { id: 19, enunciado: '¿Qué estrategia argumentativa usa la frase "cualquier persona que defienda los videojuegos simplemente no entiende de educación"?', alternativas: { A: 'Apelación a la emoción.', B: 'Argumento de autoridad.', C: 'Descalificación personal (ad hominem).', D: 'Generalización apresurada.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! En vez de refutar los argumentos a favor de los videojuegos, el autor ataca la competencia de quienes los defienden. Eso es ad hominem.', feedback_error: 'El autor no usa datos ni ataca directamente un argumento — ataca a LAS PERSONAS que tienen esa posición. ¿Cómo se llama esa falla?' },
    ],
  },
  'test-ev-6': {
    id: 'test-ev-6',
    seccionId: 'ev-6',
    contexto_base: 'La teoría de la transición demográfica explica que las sociedades pasan de altas tasas de natalidad y mortalidad a tasas bajas en ambas. Este proceso ocurrió primero en Europa durante la industrialización y luego se replicó, con distintas velocidades, en América Latina, Asia y África. La velocidad de la transición depende del desarrollo económico, la educación y el acceso a salud reproductiva.',
    preguntas: [
      { id: 20, enunciado: '¿En cuál de los siguientes países sería más probable que la transición demográfica ocurriera más lentamente, según la lógica del texto?', alternativas: { A: 'Un país con alto PIB, cobertura universal de salud y 95% de alfabetización.', B: 'Un país con bajo ingreso per cápita, acceso limitado a salud y alta tasa de analfabetismo.', C: 'Un país con tradición industrial fuerte y migraciones recientes del campo a la ciudad.', D: 'Un país con baja natalidad histórica y alto nivel de urbanización.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! El texto dice que la velocidad depende del desarrollo económico, la educación y el acceso a salud reproductiva. El país de opción B carece de los tres.', feedback_error: 'El texto da tres factores que aceleran la transición. ¿Cuál alternativa describe un país que NO tiene ninguno de esos tres factores?' },
    ],
  },
};

async function seedV2extra() {
  console.log('🌱 Seeding secciones adicionales v2...');
  for (const s of NUEVAS_SECCIONES) {
    await db.collection('lp_capitulos').doc(s.capituloId).collection('secciones').doc(s.id).set(s);
    console.log(`✅ Sección: ${s.id}`);
  }
  for (const [id, test] of Object.entries(NUEVOS_TESTS)) {
    await db.collection('lp_tests').doc(id).set(test);
    console.log(`✅ Test: ${id}`);
  }
  console.log('🎉 Done!');
}

seedV2extra();
