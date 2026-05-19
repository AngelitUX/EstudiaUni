import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { TESTS_LOCALIZAR } from './tests-localizar';
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

// ── MATERIAS ─────────────────────────────────────────────
const MATERIAS = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1',         title: 'Matemática 1',        slug: 'matematica-1',        icon: '📐', order: 2, isActive: true },
  { id: 'mat2',         title: 'Matemática M2',       slug: 'matematica-2',        icon: '✏️', order: 3, isActive: true },
  { id: 'historia',     title: 'Historia y Cs. Soc.', slug: 'historia',            icon: '🏛️', order: 4, isActive: true },
  { id: 'ciencias',     title: 'Ciencias',            slug: 'ciencias',            icon: '🧬', order: 5, isActive: true },
];

// ── CAPÍTULOS ─────────────────────────────────────────────
// Títulos genéricos reutilizables en cualquier materia
const CAPITULOS = [
  {
    id: 'cap-localizar',
    materiaId: 'comp-lectora',
    title: 'Habilidad: Localizar',
    introduccion: 'Localizar es la habilidad de identificar y extraer información explícita de un texto. La clave es rastrear la información tal como aparece escrita, sin interpretarla.',
    order: 1,
  },
  {
    id: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Habilidad: Interpretar',
    introduccion: 'Interpretar consiste en establecer significados a partir de las relaciones entre distintas partes del texto. Implica inferir, relacionar ideas y determinar el significado de expresiones.',
    order: 2,
  },
  {
    id: 'cap-evaluar',
    materiaId: 'comp-lectora',
    title: 'Habilidad: Evaluar',
    introduccion: 'Evaluar es reflexionar y juzgar el texto analizando su forma, la intención del autor, la calidad de sus argumentos y los recursos que usa.',
    order: 3,
  },
  {
    id: 'cap-mat1-1',
    materiaId: 'mat1',
    title: 'Números y Proporcionalidad',
    introduccion: 'Domina los conceptos básicos de conjuntos numéricos y razones.',
    order: 1,
  },
  {
    id: 'cap-mat2-1',
    materiaId: 'mat2',
    title: 'Álgebra Superior y Geometría M2',
    introduccion: 'Aprende sistemas de ecuaciones complejos, logaritmos y geometría analítica.',
    order: 1,
  },
  {
    id: 'cap-historia-1',
    materiaId: 'historia',
    title: 'Historia de Chile y el Mundo',
    introduccion: 'Analiza los procesos históricos, políticos, económicos y sociales contemporáneos.',
    order: 1,
  },
  {
    id: 'cap-ciencias-1',
    materiaId: 'ciencias',
    title: 'Biología Celular y Ecosistemas',
    introduccion: 'Comprende las diferencias entre células procariontes y eucariontes, y sus organelos.',
    order: 1,
  },
];

// ── PLACEHOLDER para tests ─────────────────────────────────
function makePlaceholderTest(seccionId: string, testId: string) {
  return {
    id: testId,
    seccionId,
    contexto_base: '[PLACEHOLDER] El contenido de este texto se agregará en la próxima fase de desarrollo.',
    preguntas: [
      {
        id: parseInt(testId.replace(/\D/g, '')) || Math.floor(Math.random() * 9000) + 1000,
        enunciado: '[PLACEHOLDER] ¿Cuál es la idea principal del texto?',
        preambulo_texto: null,
        preambulo_imagen_url: null,
        formula_latex: null,
        tipo_alternativas: 'texto',
        alternativas: { A: 'Alternativa A (placeholder)', B: 'Alternativa B (placeholder)', C: 'Alternativa C (placeholder)', D: 'Alternativa D (placeholder)' },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! Este es un nodo placeholder. El contenido real se agregará pronto.',
        feedback_error: 'Respuesta incorrecta. Este es un nodo placeholder. El contenido real se agregará pronto.',
      }
    ]
  };
}

// ── SECCIONES CAP 1: LOCALIZAR (6 nodos) ────────────────────
const SECCIONES_CAP1 = [
  { id: 'loc-1', capituloId: 'cap-localizar', materiaId: 'comp-lectora', order: 1, testId: 'test-loc-1',
    title: 'Rastrear info en textos informativos',
    introduccion: 'La respuesta está literal en el texto. Tu misión es encontrar la información exacta que se pide, usando palabras clave de la pregunta como guía.',
    datos_claves: ['**Busca las palabras clave** de la pregunta dentro del texto.','La respuesta puede usar **sinónimos** — no siempre las mismas palabras.','**Descarta** las opciones que mezclan info de diferentes partes.'] },
  { id: 'loc-2', capituloId: 'cap-localizar', materiaId: 'comp-lectora', order: 2, testId: 'test-loc-2',
    title: 'Rastrear info en textos narrativos',
    introduccion: 'En los textos literarios también hay preguntas de localización: ¿qué dijo un personaje? ¿Qué ocurrió primero? Tu trabajo es rastrear ese dato en el relato.',
    datos_claves: ['**Ubica el fragmento exacto** donde ocurre la acción o se dice algo.','No interpretes — solo **localiza** lo que el texto dice directamente.','Los **diálogos y descripciones** son fuentes frecuentes de preguntas literales.'] },
  { id: 'loc-syn', capituloId: 'cap-localizar', materiaId: 'comp-lectora', order: 3, testId: 'test-loc-syn',
    isPractice: true, practiceType: 'synonyms',
    title: '🧠 Práctica: Sinónimos',
    introduccion: '¡Entrena tu cerebro para detectar sinónimos! En este mini-juego conectarás palabras con su equivalente. Dominar esto es clave para la PAES.',
    datos_claves: ['Un **sinónimo** es una palabra diferente con el mismo significado.','La **paráfrasis** reformula una idea completa con otras palabras.','Practicar sinónimos te hace **más rápido** detectando respuestas en la PAES.'] },
  { id: 'loc-3', capituloId: 'cap-localizar', materiaId: 'comp-lectora', order: 4, testId: 'test-loc-3',
    title: 'Paráfrasis en textos informativos',
    introduccion: 'La PAES reformula la información del texto. El enunciado dice lo mismo que el texto pero con otras palabras. Tu trabajo es reconocer esa equivalencia.',
    datos_claves: ['Una **paráfrasis** expresa la misma idea con palabras diferentes.','Busca la **opción que mantiene el significado** aunque cambie las palabras.','Si la opción agrega o cambia información, está **mal**.'] },
  { id: 'loc-4', capituloId: 'cap-localizar', materiaId: 'comp-lectora', order: 5, testId: 'test-loc-4',
    title: 'Paráfrasis en textos narrativos',
    introduccion: 'En textos literarios, los sinónimos y paráfrasis aparecen en preguntas sobre el significado de palabras en contexto o en reformulaciones de lo que dijo o sintió un personaje.',
    datos_claves: ['El significado de una palabra depende del **contexto** en que aparece.','**Reemplaza** la palabra en la oración y ve cuál alternativa mantiene el sentido.','El lenguaje literario puede ser **connotativo** — no siempre literal.'] },
  { id: 'loc-boss', capituloId: 'cap-localizar', materiaId: 'comp-lectora', order: 6, testId: 'test-loc-boss', isBoss: true,
    title: '⚔️ Desafío: Localizar información',
    introduccion: '¡Es hora de demostrar todo lo que aprendiste sobre localizar! Este desafío cuenta con dos textos de nivel avanzado con 12 preguntas de alta dificultad. Necesitas responder al menos 10 correctamente (80%) para avanzar.',
    datos_claves: ['Este desafío contiene **dos textos informativos de alta complejidad**.','Aplica todo lo que sabes: **busca palabras clave**, reconoce **paráfrasis** y descarta distractores.','Necesitas responder **al menos 10 preguntas correctamente** para aprobar el capítulo.'] },
];

// ── GUÍAS DE ESTUDIO PARA LOCALIZAR ──────────────────────────
const GUIAS_LOC: Record<string, { guia_titulo: string; guia_contenido: string }> = {
  'loc-1': { guia_titulo: '¿Qué aprenderás?', guia_contenido: 'Dominarás la técnica de escaneo rápido en textos informativos: identificar palabras clave en la pregunta, buscarlas en el texto y verificar que la alternativa diga exactamente lo mismo. Trabajarás con un texto real sobre demografía.' },
  'loc-2': { guia_titulo: '¿Qué aprenderás?', guia_contenido: 'Practicarás localización en textos narrativos: rastrear qué hizo un personaje, qué dijo, qué vio. En los relatos, la información se esconde entre descripciones y diálogos. Tu ojo entrenado la encontrará.' },
  'loc-3': { guia_titulo: '¿Qué aprenderás?', guia_contenido: 'La PAES no siempre usa las mismas palabras del texto. Aprenderás a detectar cuándo una alternativa dice lo mismo con otras palabras (paráfrasis) y cuándo cambia el significado. Trabajarás con un texto sobre cambio climático.' },
  'loc-4': { guia_titulo: '¿Qué aprenderás?', guia_contenido: 'En textos literarios, las palabras tienen significados que dependen del contexto. Aprenderás a reemplazar una palabra por sus posibles sinónimos y elegir el que mantiene el sentido original del relato.' },
  'loc-boss': { guia_titulo: '⚔️ Desafío Final', guia_contenido: 'Este desafío contiene dos textos informativos de nivel avanzado con 12 preguntas de localización directa, sinónimos y paráfrasis. Necesitas al menos 10 aciertos (80%) para completar el capítulo. Lee con mucha atención antes de responder.' },
};


// ── SECCIONES CAP 2: INTERPRETAR (12 nodos) ──────────────────
const SECCIONES_CAP2 = [
  { id: 'int-1', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 1, testId: 'test-int-1',
    title: 'Establecer relaciones entre ideas (Texto informativo)',
    introduccion: 'Identifica cómo se conectan dos partes del texto: ¿el segundo párrafo ejemplifica al primero? ¿Lo contradice? ¿Lo amplía? La relación lógica es la clave.',
    datos_claves: ['Lee el **inicio de cada párrafo** — ahí está la idea principal.','Relaciones frecuentes: **causa/efecto, problema/solución, general/particular**.','El primer párrafo suele **presentar** el tema; el segundo lo **desarrolla**.'] },
  { id: 'int-2', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 2, testId: 'test-int-2',
    title: 'Establecer relaciones entre ideas (Texto narrativo)',
    introduccion: 'En textos literarios, las ideas también se relacionan: acciones que causan consecuencias, contrastes entre personajes, el ambiente que explica la actitud de alguien.',
    datos_claves: ['Identifica si hay una relación de **causa y efecto** entre acciones.','Los **contrastes** entre personajes o situaciones son relaciones clave.','La descripción del ambiente puede **explicar** el estado emocional de los personajes.'] },
  { id: 'int-3', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 3, testId: 'test-int-3',
    title: 'Deducir inferencias (Texto informativo)',
    introduccion: 'Una inferencia es una conclusión que el texto sugiere sin decirla. Debes unir pistas del texto para llegar a una idea no escrita directamente.',
    datos_claves: ['La respuesta **no está escrita tal cual** — debes deducirla.','Busca **dos o más ideas** que juntas lleven a la conclusión.','Descarta opciones que **exageran o agregan** info que el texto no da.'] },
  { id: 'int-4', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 4, testId: 'test-int-4',
    title: 'Deducir inferencias (Texto narrativo)',
    introduccion: 'En literatura, inferimos lo que siente un personaje, lo que pasará después o el mensaje del autor a partir de las pistas del relato.',
    datos_claves: ['Las **acciones y diálogos** de los personajes revelan sus emociones sin decirlas.','El **final del texto** suele confirmar o negar lo que puedes inferir.','**No interpretes en exceso** — la inferencia debe estar respaldada por el texto.'] },
  { id: 'int-5', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 5, testId: 'test-int-5',
    title: 'Sintetizar idea principal (Texto informativo)',
    introduccion: 'La idea principal no es un detalle ni un ejemplo — es la idea que resume el propósito central del texto. Todos los párrafos la apoyan.',
    datos_claves: ['La idea principal suele estar al **inicio o final** del texto.','Los **ejemplos y datos** son secundarios — no son la idea principal.','Si puedes **resumir el texto en una oración**, esa es la idea principal.'] },
  { id: 'int-6', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 6, testId: 'test-int-6',
    title: 'Sintetizar idea principal (Texto narrativo)',
    introduccion: 'En textos literarios, la idea principal puede ser el tema central o la enseñanza del relato (no siempre explícita).',
    datos_claves: ['El **tema** de un texto literario es la idea que atraviesa toda la historia.','No confundas el **argumento** (qué pasa) con el **tema** (de qué trata en profundidad).','El **título** a veces es una pista directa sobre la idea principal.'] },
  { id: 'int-7', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 7, testId: 'test-int-7',
    title: 'Comprender estructura del texto (Texto informativo)',
    introduccion: '¿Cómo organizó el autor sus ideas? ¿Va de lo general a lo particular? ¿Presenta un problema y luego una solución? Reconocer la estructura te ayuda a entender el propósito de cada parte.',
    datos_claves: ['Estructuras comunes: **problema/solución, causa/efecto, comparación, cronológica**.','El **primer párrafo** suele anunciar la estructura del texto completo.','Identifica los **conectores** (sin embargo, por lo tanto, finalmente) — son pistas de estructura.'] },
  { id: 'int-8', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 8, testId: 'test-int-8',
    title: 'Reconocer función de ejemplos y citas (Texto informativo)',
    introduccion: 'Los autores usan ejemplos y citas con un propósito: ilustrar, demostrar, contrastar o reforzar un argumento. Tu trabajo es identificar para qué sirve cada uno.',
    datos_claves: ['Un **ejemplo** casi siempre sirve para ilustrar una idea más abstracta.','Una **cita de autoridad** refuerza el argumento del autor.','Pregunta siempre: ¿**para qué** menciona esto el autor en este punto del texto?'] },
  { id: 'int-9', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 9, testId: 'test-int-9',
    title: 'Identificar tesis y argumentos (Texto informativo)',
    introduccion: 'En textos argumentativos, el autor defiende una posición (tesis) y la apoya con argumentos. Identificarlos es clave para entender la lógica del texto.',
    datos_claves: ['La **tesis** es la posición central que el autor defiende.','Los **argumentos** son las razones que apoyan la tesis.','Los argumentos pueden ser datos, ejemplos, citas o razonamientos lógicos.'] },
  { id: 'int-10', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 10, testId: 'test-int-10',
    title: 'Analizar personajes y conflicto (Texto narrativo)',
    introduccion: 'Los personajes actúan movidos por motivaciones. El conflicto es la tensión central del relato. Entender ambos es clave para las preguntas más complejas de literatura.',
    datos_claves: ['Las **motivaciones** de un personaje se deducen de sus acciones y palabras.','El **conflicto** puede ser externo (persona vs persona) o interno (persona vs sí mismo).','Cómo **resuelve** el personaje el conflicto revela su carácter.'] },
  { id: 'int-11', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 11, testId: 'test-int-11',
    title: 'Interpretar tiempo y espacio (Texto narrativo)',
    introduccion: 'El cuándo y el dónde no son simples datos: el ambiente físico y temporal crea atmósfera, explica comportamientos y refuerza el significado del relato.',
    datos_claves: ['El **espacio** puede crear una atmósfera que refleja el estado emocional del texto.','Los **saltos en el tiempo** (flashbacks, anticipaciones) tienen un propósito narrativo.','Relaciona el contexto temporal/espacial con las **acciones y emociones** de los personajes.'] },
  { id: 'int-boss', capituloId: 'cap-interpretar', materiaId: 'comp-lectora', order: 12, testId: 'test-int-boss', isBoss: true,
    title: '⚔️ Desafío: Interpretar textos',
    introduccion: '¡El gran desafío de interpretación! Pondrás a prueba todas tus habilidades: inferencias, relaciones, estructura, tesis y análisis literario. Necesitas responder todo correctamente para avanzar.',
    datos_claves: ['Este desafío mezcla **textos informativos y narrativos**.','Aplica todas las estrategias: **relaciona, infiere, sintetiza, analiza**.','Cada pregunta tiene un único tipo de habilidad — **identifica cuál es** antes de responder.'] },
];

// ── SECCIONES CAP 3: EVALUAR (11 nodos) ──────────────────────
const SECCIONES_CAP3 = [
  { id: 'ev-1', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 1, testId: 'test-ev-1',
    title: 'Detectar intención del autor (Texto informativo)',
    introduccion: '¿Para qué escribió esto el autor? ¿Para informar, persuadir, criticar? La intención se refleja en el tono, los recursos usados y el tipo de texto.',
    datos_claves: ['El propósito se deduce del tipo de texto: **opinión = persuadir/criticar**.','**Preguntas retóricas, exclamaciones y adjetivos valorativos** revelan intención.','La intención no es el **tema** — es el **para qué** del texto.'] },
  { id: 'ev-2', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 2, testId: 'test-ev-2',
    title: 'Detectar intención del autor (Texto narrativo)',
    introduccion: 'En textos literarios, el autor también tiene una intención: conmover, reflexionar, criticar la sociedad, entretener. Esta intención se lee entre líneas.',
    datos_claves: ['La intención literaria suele expresarse a través del **tema** y el **tono** del relato.','Un relato puede **criticar una realidad social** sin decirlo directamente.','Analiza cómo **termina el texto**: finales abiertos, irónicos o trágicos revelan intención.'] },
  { id: 'ev-3', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 3, testId: 'test-ev-3',
    title: 'Identificar tono y postura (Texto informativo)',
    introduccion: 'El emisor no es neutro — tiene una posición frente al tema. Identifica si es crítico, optimista, escéptico o irónico, y con qué evidencia del texto lo puedes demostrar.',
    datos_claves: ['La postura se reconoce por los **adjetivos, el tono y los verbos** que usa el autor.','Posiciones comunes: **crítica, cuestionadora, pesimista, entusiasta, irónica**.','Siempre busca una **cita del texto** que justifique la postura que eliges.'] },
  { id: 'ev-4', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 4, testId: 'test-ev-4',
    title: 'Identificar tono y postura (Texto narrativo)',
    introduccion: 'En literatura, el tono es la actitud emocional del narrador frente a los hechos: melancólico, irónico, esperanzador. El tono le da el "color" al relato.',
    datos_claves: ['El **tono** se percibe en la selección de palabras y el tipo de descripciones.','Un **narrador irónico** dice lo contrario de lo que piensa realmente.','El tono puede **cambiar** a lo largo del relato, siguiendo la emoción de los personajes.'] },
  { id: 'ev-5', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 5, testId: 'test-ev-5',
    title: 'Evaluar calidad de la información (Texto informativo)',
    introduccion: 'No toda información en un texto es igual de válida. Debes evaluar si los argumentos son pertinentes, si hay falacias, si los datos son suficientes para sostener la tesis.',
    datos_claves: ['Un **buen argumento** es relevante, suficiente y no contradice la tesis.','Las **falacias** son argumentos que parecen válidos pero tienen errores lógicos.','Pregunta siempre: ¿el argumento **realmente apoya** la tesis o es un desvío?'] },
  { id: 'ev-6', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 6, testId: 'test-ev-6',
    title: 'Analizar forma del texto',
    introduccion: 'La forma incluye cómo está organizado el texto, qué tipo de texto es y cómo esa estructura contribuye al propósito del autor.',
    datos_claves: ['La **forma** (tipo de texto, estructura, extensión) sirve al propósito del autor.','Un texto expositivo y uno argumentativo tienen estructuras **distintas** con propósitos distintos.','Evalúa si la **organización** del texto facilita o dificulta la comprensión del mensaje.'] },
  { id: 'ev-7', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 7, testId: 'test-ev-7',
    title: 'Evaluar recursos del lenguaje',
    introduccion: 'Los autores usan metáforas, comparaciones, preguntas retóricas y otras figuras retóricas para generar efectos en el lector. Tu tarea es identificar qué efecto produce cada recurso.',
    datos_claves: ['**Anécdota al inicio** = ilustrar un problema o captar la atención.','**Comparaciones y metáforas** = acercar una idea abstracta al lector.','**Preguntas retóricas** = involucrar al lector o reforzar un argumento.'] },
  { id: 'ev-8', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 8, testId: 'test-ev-8',
    title: 'Evaluar recursos visuales (Texto informativo)',
    introduccion: 'Los textos informativos suelen incluir gráficos, tablas o imágenes. Evaluar su función es una habilidad específica de la PAES: ¿para qué está ese elemento visual?',
    datos_claves: ['Un gráfico puede **complementar, demostrar o contradecir** el texto verbal.','Pregunta: ¿qué información **agrega** el elemento visual que el texto no menciona?','Los recursos visuales también tienen un **propósito retórico** (persuadir, demostrar).'] },
  { id: 'ev-9', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 9, testId: 'test-ev-9',
    title: 'Relacionar con el contexto (Texto informativo)',
    introduccion: 'El texto no existe en el vacío. Relacionar el texto con su contexto histórico, social o cultural te permite evaluar su relevancia y la intención del autor con mayor profundidad.',
    datos_claves: ['El **contexto** puede explicar por qué el autor tomó ciertas decisiones.','Relacionar con el contexto **no significa agregar información externa** — usa las pistas del texto.','Evalúa si la postura del autor tiene sentido dado el **momento o situación** en que se enmarca.'] },
  { id: 'ev-10', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 10, testId: 'test-ev-10',
    title: 'Relacionar con el contexto (Texto narrativo)',
    introduccion: 'En literatura, el contexto histórico o cultural del relato puede ser clave para interpretar las decisiones del autor y el significado profundo de la obra.',
    datos_claves: ['El contexto literario da sentido a elementos que parecen **arbitrarios** en el relato.','Un texto escrito en dictadura puede tener un **sentido político** aunque no lo diga directamente.','Relaciona personajes y conflictos con el **contexto social** que el texto sugiere.'] },
  { id: 'ev-boss', capituloId: 'cap-evaluar', materiaId: 'comp-lectora', order: 11, testId: 'test-ev-boss', isBoss: true,
    title: '⚔️ Desafío: Evaluar textos',
    introduccion: '¡El gran desafío final de la campaña! Demostrarás que puedes detectar intenciones, evaluar recursos, analizar el tono y relacionar textos con su contexto. ¡Necesitas responder todo correctamente para completar la ruta!',
    datos_claves: ['Este desafío integra **todas las habilidades de evaluación**.','Lee cada texto con atención al **tono, los recursos y la estructura**.','Si apruebas este desafío, **completaste la campaña de Competencia Lectora**. 🏆'] },
];

// ── SECCIONES PLACEHOLDER (OTRAS MATERIAS) ────────────────────
const SECCIONES_OTROS = [
  { id: 'sec-mat1-1', capituloId: 'cap-mat1-1', materiaId: 'mat1', order: 1, testId: 'test-mat1-1',
    title: 'Porcentajes en la Vida Diaria',
    introduccion: 'Aprende a calcular descuentos, aumentos e interés simple.',
    datos_claves: ['Un porcentaje es una fracción de 100', 'Descuento del X% multiplica por (1 - X/100)'] },
  { id: 'sec-mat2-1', capituloId: 'cap-mat2-1', materiaId: 'mat2', order: 1, testId: 'test-mat2-1',
    title: 'Logaritmos y Ecuaciones Exponenciales',
    introduccion: 'Domina las propiedades de los logaritmos y resolución de ecuaciones exponenciales.',
    datos_claves: ['log_b(a) = c equivale a b^c = a', 'Propiedades de multiplicación, división y potencias en logaritmos'] },
  { id: 'sec-historia-1', capituloId: 'cap-historia-1', materiaId: 'historia', order: 1, testId: 'test-historia-1',
    title: 'El Ciclo del Salitre',
    introduccion: 'Comprende el impacto económico del salitre tras la Guerra del Pacífico y la Cuestión Social.',
    datos_claves: ['El salitre generó grandes ingresos al Estado', 'La Cuestión Social refiere a las precarias condiciones laborales'] },
  { id: 'sec-ciencias-1', capituloId: 'cap-ciencias-1', materiaId: 'ciencias', order: 1, testId: 'test-ciencias-1',
    title: 'Tipos de Células',
    introduccion: 'Aprende a distinguir las características clave de procariontes y eucariontes (animal y vegetal).',
    datos_claves: ['Las células procariontes no tienen núcleo definido', 'Las células eucariontes vegetales poseen pared celular y cloroplastos'] },
];

// ── HELPERS ───────────────────────────────────────────────────
function makeId(testId: string): number {
  const nums = testId.replace(/\D/g, '');
  return nums ? parseInt(nums.substring(0, 6)) : Math.floor(Math.random() * 89999) + 10000;
}

// ── MAIN ──────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding v3 learning path — Campaña Completa...\n');

  // 1. Borrar todo lo viejo
  console.log('🗑️  Limpiando datos antiguos...');
  const oldCaps = await db.collection('lp_capitulos').get();
  for (const cap of oldCaps.docs) {
    const secciones = await cap.ref.collection('secciones').get();
    for (const s of secciones.docs) await s.ref.delete();
    await cap.ref.delete();
  }
  const oldTests = await db.collection('lp_tests').get();
  for (const t of oldTests.docs) await t.ref.delete();
  console.log('✅ Datos antiguos eliminados\n');

  // 2. Materias
  const batch = db.batch();
  for (const m of MATERIAS) batch.set(db.collection('lp_materias').doc(m.id), m);
  await batch.commit();
  console.log('✅ Materias guardadas');

  // 3. Capítulos
  for (const c of CAPITULOS) {
    await db.collection('lp_capitulos').doc(c.id).set(c);
    console.log(`✅ Capítulo: ${c.id} — "${c.title}"`);
  }

  // 4. Secciones + Tests
  const allSecciones = [...SECCIONES_CAP1, ...SECCIONES_CAP2, ...SECCIONES_CAP3, ...SECCIONES_OTROS];
  for (const s of allSecciones) {
    // Add guía fields for Localizar nodes
    const guia = GUIAS_LOC[s.id];
    const secData: any = { ...s };
    if (guia) {
      secData.guia_titulo = guia.guia_titulo;
      secData.guia_contenido = guia.guia_contenido;
    }
    await db.collection('lp_capitulos').doc(s.capituloId).collection('secciones').doc(s.id).set(secData);

    // Use real tests for Localizar, placeholders for others
    const realTest = TESTS_LOCALIZAR[s.testId];
    if (realTest) {
      await db.collection('lp_tests').doc(s.testId).set(realTest);
    } else {
      const test = makePlaceholderTest(s.id, s.testId);
      test.preguntas[0].id = makeId(s.testId);
      await db.collection('lp_tests').doc(s.testId).set(test);
    }
    console.log(`  ✅ Nodo: ${s.id} — "${s.title}" ${realTest ? '(contenido real)' : '(placeholder)'}`);
  }

  console.log(`\n🎉 ¡Seed completado! ${allSecciones.length} nodos creados en ${CAPITULOS.length} capítulos.`);
}

seed().catch(console.error);
