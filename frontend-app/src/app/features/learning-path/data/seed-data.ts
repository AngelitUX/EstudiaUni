import { Materia, Capitulo } from '../models/paes.models';

export const MATERIAS: Materia[] = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '📐', order: 2, isActive: false },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 4, isActive: false },
];

export const CAPITULOS: Capitulo[] = [
  {
    id: 'cap-1',
    materiaId: 'comp-lectora',
    title: 'Textos No Literarios: Informes y Artículos',
    introduccion: 'Los textos no literarios son fundamentales en la PAES. Aprenderás a localizar, interpretar y evaluar información en informes estadísticos y artículos de opinión.',
    order: 1,
    secciones: [
      {
        id: 'sec-1-1',
        capituloId: 'cap-1',
        materiaId: 'comp-lectora',
        title: '1. Rastrear e Interpretar Datos Demográficos',
        introduccion: '¡Prepárate para tu primer desafío! 🚀 Los informes estadísticos suelen intimidar, pero esconden patrones claros. Tu misión aquí es rastrear información específica e interpretar la relación entre los párrafos.',
        datos_claves: [
          'Identifica las definiciones clave: Cuando un texto presenta un concepto nuevo (como "transición demográfica"), subraya inmediatamente qué significa y cuáles son sus etapas.',
          'Busca los marcadores temporales: Frases como "A mediados del siglo XX" o "En la etapa avanzada" son pistas directas para encontrar respuestas de localización.',
          'Compara perspectivas: Si el texto cita a distintos autores o instituciones (ej: Miró vs. CEPAL), anota mentalmente en qué se diferencian.'
        ],
        order: 1,
        test: {
          id: 'test-1-1',
          seccionId: 'sec-1-1',
          contexto_base: 'Generalmente, el envejecimiento demográfico es visto como una consecuencia inevitable de la transición hacia una población que presenta bajas tasas de crecimiento demográfico... La teoría de la transición demográfica da cuenta de las transformaciones acontecidas en la estructura de la población... En los años posteriores, debido a los importantes cambios... se han planteado nuevos indicadores y etapas para la definición del proceso de transición demográfica. Estos están basados en las tasas de fecundidad y la esperanza de vida de la población... Bajo esta premisa, las cuatro etapas de la transición demográfica se definen como moderada, plena, avanzada y muy avanzada (CEPAL, 2008). A mediados del siglo XX, las mejoras en las condiciones de vida... produjeron descensos importantes en la mortalidad... En situaciones de altas tasas de fecundidad, el descenso de la mortalidad de los más jóvenes implica un acelerado crecimiento de la población. [...] En cuanto la fecundidad y la mortalidad infantil continúan descendiendo paulatinamente, la estructura etaria de la población comienza a envejecer lentamente, entrando a una etapa plena de la transición demográfica... ampliando así el tamaño de la población económicamente activa. Esta situación ha sido denominada como el "bono demográfico"...',
          preguntas: [
            { id: 1, enunciado: 'Con respecto al análisis demográfico, ¿cuál es la relación establecida entre el primer y segundo párrafo?', alternativas: { A: 'El primero presenta el problema del envejecimiento de la población; el segundo muestra formas de medir su alcance.', B: 'El primero explica las tasas de crecimiento poblacional de Europa; el segundo las compara con las de América Latina.', C: 'El primero define la transición demográfica; el segundo plantea los indicadores que permiten observarla en un territorio.', D: 'El primero categoriza los factores de medición demográfica; el segundo explica las razones por las que estos han sido reemplazados.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente deducción! 🧠 El primer párrafo establece el marco teórico (qué es la transición), y el segundo detalla cómo se mide mediante indicadores como la fecundidad y la esperanza de vida.', feedback_error: '¡Ojo con la estructura! 👀 Vuelve a leer el inicio de ambos párrafos. El primero habla de qué es este proceso, mientras que el segundo menciona específicamente que se han planteado "nuevos indicadores y etapas".' },
            { id: 2, enunciado: 'A diferencia de Miró, ¿qué indicador considera la CEPAL al definir las etapas de transición demográfica?', alternativas: { A: 'La estructura por edades.', B: 'La tasa de fecundidad.', C: 'La tasa de mortalidad.', D: 'La esperanza de vida.' }, respuesta_correcta: 'D', feedback_acierto: '¡Muy bien rastreado! 🎯 El texto es explícito: mientras Miró miraba la disminución de la mortalidad, la CEPAL introdujo los indicadores basados en "las tasas de fecundidad y la esperanza de vida".', feedback_error: '¡Casi! 🕵️‍♂️ Vuelve al segundo párrafo y busca la mención a la CEPAL. Fíjate en qué factores dice que se basan sus nuevos indicadores.' },
            { id: 3, enunciado: '¿Cuál es una de las características de la etapa incipiente de la transición demográfica?', alternativas: { A: 'Alta mortalidad infantil.', B: 'Aumento de la esperanza de vida.', C: 'Acelerado crecimiento de la población.', D: 'Bajo índice de fecundidad.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! 🏆 En el texto se indica literalmente que el descenso de la mortalidad joven junto con altas tasas de fecundidad da como resultado un "acelerado crecimiento de la población".', feedback_error: '¡Cuidado con la línea de tiempo! ⚠️ Lee el tercer párrafo donde se describe la etapa incipiente de mediados del siglo XX.' },
            { id: 4, enunciado: 'A partir de la lectura, ¿qué implica el "bono demográfico" para una sociedad?', alternativas: { A: 'Que aumenta su población en edad laboral.', B: 'Que entrega incentivos para aumentar la natalidad.', C: 'Que impulsa el incremento de la esperanza de vida.', D: 'Que intenta frenar el envejecimiento de la población.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! 💼 El "bono demográfico" es la situación favorable que se da cuando se amplía el "tamaño de la población económicamente activa".', feedback_error: 'Te desviaste un poco. 🧭 Busca el concepto entre comillas ("bono demográfico") en el texto.' },
            { id: 5, enunciado: 'Según la lectura, ¿en cuál de las etapas de transición demográfica la economía se ve beneficiada por el tamaño de la población económicamente activa?', alternativas: { A: 'En la etapa plena.', B: 'En la etapa incipiente.', C: 'En la etapa avanzada.', D: 'En la etapa moderada.' }, respuesta_correcta: 'A', feedback_acierto: '¡Conexión perfecta! ✨ Vinculaste correctamente el aumento de la población activa con la "etapa plena de la transición demográfica".', feedback_error: '¡Un pequeño resbalón! 🧩 Busca dónde se menciona a la "población económicamente activa" y revisa qué nombre se le da a esa etapa.' }
          ]
        }
      },
      {
        id: 'sec-1-2',
        capituloId: 'cap-1',
        materiaId: 'comp-lectora',
        title: '2. Sintetizar y Evaluar Textos Expositivos',
        introduccion: '¡Avanzamos al siguiente nivel! 🧗‍♂️ Ahora que sabes localizar, pondremos a prueba tu capacidad de sintetizar cómo se organiza la información y extraer características clave.',
        datos_claves: [
          'Analiza la estructura global: Fíjate cómo el autor ordena sus ideas. ¿Va de lo general a lo particular? ¿Define primero y luego da ejemplos?',
          'Distingue la etapa: En textos con secuencias o clasificaciones, asegúrate de no mezclar las características de una etapa con las de otra.',
          'Sigue el hilo conductor: Las preguntas de evaluación requieren que entiendas el propósito de cada párrafo en relación con el texto completo.'
        ],
        order: 2,
        test: {
          id: 'test-1-2',
          seccionId: 'sec-1-2',
          contexto_base: 'A medida que las tasas globales de fecundidad continúan reduciéndose... la reducción de los niveles de mortalidad comienza a hacerse extensiva a todos los grupos de edades, lo cual es acompañado por una esperanza de vida que comienza a superar los 75 años, dando paso a la etapa avanzada de la transición demográfica... la proporción de población en edades mayores sobre el total de la población comienza a aumentar, impulsando así el proceso de envejecimiento poblacional... Finalmente, en una etapa muy avanzada de la transición demográfica es posible ubicar aquellos países que bajaron muy tempranamente sus niveles de fecundidad...',
          preguntas: [
            { id: 6, enunciado: 'De acuerdo con la lectura, ¿en qué etapa de transición demográfica la esperanza de vida comienza a superar los 75 años?', alternativas: { A: 'En la etapa muy avanzada.', B: 'En la etapa moderada.', C: 'En la etapa avanzada.', D: 'En la etapa plena.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! 🎯 Localizaste el dato exacto. El texto asocia directamente la esperanza de vida superior a 75 años con la etapa avanzada.', feedback_error: '¡Casi caes en la trampa! 🕵️‍♂️ Vuelve a leer prestando atención al número "75".' },
            { id: 7, enunciado: '¿Cuál es una característica de la etapa avanzada de la transición demográfica?', alternativas: { A: 'El aumento de las tasas de fecundidad.', B: 'El estancamiento de la estructura etaria.', C: 'El incremento del reemplazo generacional.', D: 'El envejecimiento de las cohortes dominantes.' }, respuesta_correcta: 'D', feedback_acierto: '¡Muy bien interpretado! 🧠 El texto detalla que en esta etapa las cohortes dominantes "comienzan a tener cada vez una mayor cantidad de años".', feedback_error: '¡Ojo! ⚠️ En la etapa avanzada la fecundidad baja, no sube. Busca qué sucede con las "cohortes dominantes".' },
            { id: 8, enunciado: '¿De qué manera se organiza la información respecto de las etapas de transición demográfica?', alternativas: { A: 'Se expone una discusión teórica y luego se ejemplifican estas etapas con la situación de América Latina.', B: 'Se explican los criterios que definen las etapas propuestas por la CEPAL y luego se detallan las características demográficas de dichas etapas.', C: 'Se contrastan distintas definiciones de las etapas y luego se presenta el informe de la CEPAL.', D: 'Se presenta la evolución en la concepción de las etapas y luego se establece la visión actual de la CEPAL.' }, respuesta_correcta: 'B', feedback_acierto: '¡Gran capacidad de síntesis! 📊 Identificaste la estructura global: primero los criterios, luego el desglose etapa por etapa.', feedback_error: '¡Mira el panorama completo! 🦅 ¿El autor contrasta autores o establece reglas para luego explicar cada etapa?' }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-2',
    materiaId: 'comp-lectora',
    title: 'Textos No Literarios: Artículos de Opinión',
    introduccion: 'Los artículos de opinión son uno de los tipos de texto más frecuentes en la PAES. Aprenderás a distinguir la postura del autor, interpretar anécdotas y evaluar el propósito de los ejemplos.',
    order: 2,
    secciones: [
      {
        id: 'sec-2-1',
        capituloId: 'cap-2',
        materiaId: 'comp-lectora',
        title: '1. Localizar e Interpretar Opiniones',
        introduccion: '¡Bienvenido a un nuevo tipo de texto! 📰 Aquí trabajaremos con artículos periodísticos de opinión. Tu desafío no es solo rastrear hechos, sino entender la postura y actitud del autor.',
        datos_claves: [
          'Identifica el tono: Presta atención a los adjetivos y exclamaciones del autor. ¿Está criticando, celebrando, cuestionando o solo informando?',
          'Separa la anécdota del argumento: Los autores suelen usar historias cortas al principio para introducir su idea principal.',
          'Citas de autoridad: Cuando un autor cita a otra persona, usualmente lo hace para validar su propio punto o establecer una comparación.'
        ],
        order: 1,
        test: {
          id: 'test-2-1',
          seccionId: 'sec-2-1',
          contexto_base: 'En una entrevista reciente, Claudio Magris... recordaba la anécdota... de que cuando hace quince años enseñaba en un college de Estados Unidos, "solo cinco o seis estudiantes en una clase de 36 sabían quién fue Stalin". Y añadía que ese tipo de ignorancia... se estaba acentuando... [...] En un momento del curso, estaba explicando algo que involucraba al francés Henri Poincaré... una de las figuras cumbres de la matemática... En opinión de Jean Dieudonné... "Si los descubrimientos de Poincaré en la teoría de números no son iguales a los de Gauss, sus logros en la teoría de funciones son al menos del mismo nivel". [...] Por el contrario, muchos de los grandes nombres del pasado en física o en biología forman parte de su historia... pero en general sus logros han sido mejorados sustancialmente... Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble, Mendel a Watson y Crick...',
          preguntas: [
            { id: 9, enunciado: 'Una estudiante afirma que el artículo ofrece la idea de que el conocimiento es una construcción colectiva. ¿Qué cita permite justificar esta apreciación?', alternativas: { A: '«Poincaré es la figura más importante en la teoría de las ecuaciones diferenciales y es el matemático que, después de Newton, efectuó el trabajo más destacado en mecánica celeste».', B: '«En opinión de Jean Dieudonné, un matemático notable él mismo, "ambos eran matemáticos universales en el sentido supremo..."».', C: '«pero en general sus logros han sido mejorados sustancialmente... Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble...».', D: '«Desde entonces he constatado que hay muchas personas... que no saben quién fue James Clerk Maxwell...».' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente inferencia! 🧱 La cita muestra cómo un científico toma el trabajo de otro para avanzar, evidenciando construcción colectiva.', feedback_error: 'Piénsalo de nuevo. 🤔 "Construcción colectiva" significa que el trabajo de uno sirve de base para el siguiente.' },
            { id: 10, enunciado: '¿Cuál es la actitud del emisor en relación con el problema de la "memoria corta"?', alternativas: { A: 'Crítica, pues considera que los intelectuales incumplen el rol de modelos culturales.', B: 'Controversial, pues cree que hay áreas disciplinares menospreciadas.', C: 'Cuestionadora, pues cree que la educación carece de una perspectiva integradora de los acontecimientos pasados.', D: 'Pesimista, pues considera que el sistema educativo tiene limitaciones para abordar los referentes históricos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien captado! 🕵️‍♀️ El emisor cuestiona cómo la falta de conocimientos desconecta a las generaciones de su pasado cultural.', feedback_error: '¡Cuidado! ⚠️ El autor no culpa a los intelectuales ni es solo pesimismo. Está cuestionando la desconexión cultural.' },
            { id: 11, enunciado: 'Considerando la información del artículo, ¿a quién le podría resultar útil su lectura?', alternativas: { A: 'A una persona que busca mejorar la enseñanza de la ciencia en el sistema educativo.', B: 'A una persona que busca conocer los aportes de los principales exponentes de las ciencias.', C: 'A una persona que busca comprender los hitos más relevantes de la matemática.', D: 'A una persona que busca justificar la importancia del conocimiento histórico de una disciplina.' }, respuesta_correcta: 'D', feedback_acierto: '¡Exacto! 📖 El propósito central del artículo es reflexionar sobre por qué no debemos olvidar la historia detrás de las disciplinas.', feedback_error: 'Enfócate en el mensaje de fondo. 💡 El autor usa nombres de científicos para argumentar por qué es importante recordarlos históricamente.' },
            { id: 12, enunciado: '¿Para qué se menciona la anécdota de Magris en el primer párrafo?', alternativas: { A: 'Para cuestionar la escasa profundización del discurso educativo.', B: 'Para criticar el desinterés intelectual de las nuevas generaciones.', C: 'Para ejemplificar los vacíos académicos del sistema educativo actual.', D: 'Para ilustrar el desconocimiento juvenil de acontecimientos históricos.' }, respuesta_correcta: 'D', feedback_acierto: '¡Perfecto! 🎯 La anécdota de estudiantes que no conocen a Stalin funciona como ilustración de esa "memoria corta".', feedback_error: 'Revisa la función del párrafo. 🔍 Una anécdota casi siempre sirve para ilustrar un punto.' },
            { id: 13, enunciado: 'Según la opinión de Dieudonné, ¿en qué área Gauss supera a Poincaré?', alternativas: { A: 'En las ecuaciones diferenciales.', B: 'En la teoría de las funciones.', C: 'En la teoría de los números.', D: 'En la mecánica celeste.' }, respuesta_correcta: 'C', feedback_acierto: '¡Rastreo impecable! 🔍 Dieudonné indica: "Si los descubrimientos de Poincaré en la teoría de números no son iguales a los de Gauss...".', feedback_error: '¡Es una pregunta literal! 📖 Busca el nombre "Dieudonné" y lee en qué teoría los descubrimientos de Poincaré "no son iguales" a los de Gauss.' }
          ]
        }
      },
      {
        id: 'sec-2-2',
        capituloId: 'cap-2',
        materiaId: 'comp-lectora',
        title: '2. Evaluar Propósitos y Relaciones',
        introduccion: 'Seguimos con el artículo de opinión. Las preguntas se centrarán en tu habilidad para interpretar por qué el autor menciona ciertos ejemplos y evaluar las diferencias entre los campos de la ciencia.',
        datos_claves: [
          'Propósito de las preguntas retóricas: Cuando un autor pregunta algo como "¿Maxwell, quién fue Maxwell?", no busca respuesta literal, sino demostrar un punto.',
          'Comparaciones clave: Si el texto contrasta dos áreas (como matemáticas vs. biología), anota la diferencia principal que el autor establece.'
        ],
        order: 2,
        test: {
          id: 'test-2-2',
          seccionId: 'sec-2-2',
          contexto_base: 'Y esto sucedía en Matemáticas, la disciplina en la que posiblemente perduren más, tengan más presencia, sean de más permanente actualidad grandes nombres del pasado que forjaron problemas... Por el contrario, muchos de los grandes nombres del pasado en física o en biología... sus logros han sido mejorados sustancialmente... Newton dejó paso a Einstein, Ptolomeo a Copérnico y este a Hubble... Para comunicarse hace falta una cierta cultura común, que sirva de eslabón entre generaciones...',
          preguntas: [
            { id: 14, enunciado: '¿Con qué finalidad el emisor cuenta la anécdota sobre Poincaré?', alternativas: { A: 'Para criticar el escaso interés de las nuevas generaciones por conocer a quienes marcaron un precedente.', B: 'Para evidenciar las razones por las que es necesario que las nuevas generaciones conozcan a quienes transformaron el mundo.', C: 'Para argumentar que la educación debe reconocer los logros de figuras que han sido olvidadas.', D: 'Para demostrar que existen figuras fundamentales en el desarrollo de las ciencias que resultan desconocidas para las nuevas generaciones.' }, respuesta_correcta: 'D', feedback_acierto: '¡Excelente lectura entre líneas! 🎭 La historia sirve como prueba de la preocupante pérdida de memoria histórica.', feedback_error: '¡Cuidado con sobreinterpretar! 🧠 El autor constata un hecho, no da razones de por qué es importante.' },
            { id: 15, enunciado: '¿Por qué el emisor señala la importancia de reconocer el aporte de matemáticos relevantes?', alternativas: { A: 'Porque sus trabajos permiten la aplicación de enfoques multidisciplinarios.', B: 'Porque sus contribuciones son útiles para abordar problemáticas vigentes.', C: 'Porque sus teorías enriquecen el razonamiento lógico de los estudiantes.', D: 'Porque sus modelos contribuyen al desarrollo de otras áreas científicas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! 🏆 Las conjeturas del pasado "no han perdido contemporaneidad", es decir, siguen vigentes.', feedback_error: '¡Vuelve al texto! 🔍 El autor dice que ellos forjaron problemas que "no han perdido contemporaneidad".' },
            { id: 16, enunciado: 'Según la lectura, ¿quién mejoró los logros de Copérnico?', alternativas: { A: 'Ptolomeo.', B: 'Watson.', C: 'Mendel.', D: 'Hubble.' }, respuesta_correcta: 'D', feedback_acierto: '¡Rastreo perfecto! 🎯 "Ptolomeo a Copérnico y este a Hubble".', feedback_error: 'Sigue la cadena. 🧬 Busca "Ptolomeo a Copérnico y este a...".' },
            { id: 17, enunciado: '¿En qué se diferencian los logros de la matemática de los logros de la biología?', alternativas: { A: 'En que los logros de la matemática son aplicables a otras disciplinas, mientras que los de la biología están restringidos.', B: 'En que los logros de la matemática siguen siendo empleados a pesar del paso de los años, mientras que los de la biología se transforman con el tiempo.', C: 'En que los logros de la matemática son valorados por quienes pertenecen a dicha área, mientras que los de la biología son reconocidos universalmente.', D: 'En que los logros de la matemática permiten comprender contextos abstractos, mientras que los de la biología explican contextos concretos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante comparación! ✨ La matemática tiene "permanente actualidad", mientras que la biología/física cambian.', feedback_error: 'Compara los párrafos. ⚖️ Matemática: "permanente actualidad". Biología/física: "mejorados sustancialmente".' }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-interpretar',
    materiaId: 'comp-lectora',
    title: 'Habilidad 2: Interpretar',
    introduccion: 'Interpretar es la habilidad más evaluada en la PAES de Competencia Lectora (~40%). Aprenderás a inferir información implícita, comprender vocabulario en contexto, interpretar figuras retóricas y relacionar ideas entre párrafos.',
    order: 3,
    secciones: [
      {
        id: 'sec-int-1',
        capituloId: 'cap-interpretar',
        materiaId: 'comp-lectora',
        title: '1. Inferir Información Implícita',
        introduccion: '¡Bienvenido a la habilidad más importante de la PAES! 🧠 Aquí el texto NO te da la respuesta directamente. Tu misión es deducir lo que el autor sugiere a partir de las pistas que deja.',
        datos_claves: [
          'Busca marcas textuales: adjetivos, verbos específicos, comparaciones y tono general del texto. Cada palabra es una pista.',
          'Distingue entre lo explícito y lo implícito: si puedes señalar exactamente dónde está la respuesta, es localizar. Si debes \"armar\" la respuesta, es interpretar.',
          'Cuidado con la sobreinterpretación: la inferencia debe estar respaldada por el texto, no por tu conocimiento general.'
        ],
        order: 1,
        test: {
          id: 'test-int-1',
          seccionId: 'sec-int-1',
          contexto_base: 'La sala de espera del hospital estaba en silencio. María apretaba entre sus manos un sobre cerrado que le habían entregado hace diez minutos. No lo había abierto. A su lado, su hermana le tocaba el hombro con suavidad, sin decir nada. Al fondo, un reloj de pared marcaba cada segundo con un sonido que parecía amplificarse en el vacío del pasillo. María miró el sobre, luego la ventana. Afuera, la lluvia caía sin prisa.\n\nCuando el médico apareció por la puerta, María se puso de pie de golpe. \"Doctora —dijo con voz temblorosa—, ¿puedo pasar a verlo?\". La doctora la miró un instante, suspiró y asintió lentamente. María dejó el sobre en la silla y caminó hacia la puerta con pasos cortos, como si sus piernas dudaran de cada movimiento.',
          preguntas: [
            { id: 1001, enunciado: '¿Qué se puede inferir sobre el contenido del sobre que María sostiene?', alternativas: { A: 'Contiene instrucciones para un tratamiento médico.', B: 'Contiene resultados o información médica relevante que María teme conocer.', C: 'Es una carta personal de un familiar lejano.', D: 'Son documentos administrativos del hospital.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente inferencia! 🧠 Las marcas textuales (no abrir el sobre, el contexto hospitalario, la actitud temerosa) sugieren que contiene información médica que María no se atreve a leer.', feedback_error: 'Busca las pistas: ¿Por qué María no abre el sobre? ¿Dónde está? ¿Cómo se comporta? Todo sugiere miedo a recibir malas noticias médicas.' },
            { id: 1002, enunciado: 'A partir de la descripción del segundo párrafo, ¿qué se puede inferir sobre el estado emocional de María?', alternativas: { A: 'Está impaciente y quiere irse del hospital.', B: 'Se siente aliviada porque la doctora le dio buenas noticias.', C: 'Experimenta angustia e incertidumbre ante la situación de un ser querido.', D: 'Está molesta con el personal médico por la demora.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! 🎯 \"Voz temblorosa\", \"pasos cortos\", \"como si sus piernas dudaran\"... todas son marcas textuales de angustia e incertidumbre.', feedback_error: 'Relee las acciones de María: voz temblorosa, pasos cortos y dubitativos. ¿Qué emoción expresan?' },
            { id: 1003, enunciado: '¿Qué función cumple la mención de la lluvia y el reloj en el primer párrafo?', alternativas: { A: 'Informar sobre las condiciones climáticas y la hora del día.', B: 'Crear una atmósfera de tensión y espera angustiosa.', C: 'Comparar el paso del tiempo con la velocidad de la lluvia.', D: 'Demostrar que María se distrae fácilmente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Gran interpretación! ✨ El reloj que \"amplifica\" su sonido y la lluvia \"sin prisa\" son recursos que el autor usa para transmitir la tensión de la espera.', feedback_error: 'Piensa en el efecto que producen estos elementos. ¿Añaden información factual o crean una atmósfera emocional?' },
            { id: 1004, enunciado: '¿Qué sugiere la reacción de la doctora cuando María le pregunta si puede pasar?', alternativas: { A: 'Que la doctora está cansada de trabajar largas horas.', B: 'Que la situación del paciente podría ser delicada o grave.', C: 'Que la doctora no reconoce a María como familiar.', D: 'Que las visitas no están permitidas a esa hora.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 🔍 El suspiro y la mirada de la doctora antes de asentir \"lentamente\" son marcas de una situación difícil.', feedback_error: 'Fíjate en las acciones de la doctora: mirar, suspirar, asentir lentamente. ¿Qué comunican estas acciones?'}
          ]
        }
      },
      {
        id: 'sec-int-practice-vocab',
        capituloId: 'cap-interpretar',
        materiaId: 'comp-lectora',
        title: '🧩 Vocabulario Contextual',
        introduccion: '¡Hora de entrenar! 💪 Practica la técnica de sustitución: lee el fragmento y elige qué significa la palabra según su contexto.',
        datos_claves: [],
        order: 2,
        isPractice: true,
        practiceType: 'vocabulary-context',
        test: { id: 'test-int-pv', seccionId: 'sec-int-practice-vocab', contexto_base: null, preguntas: [] }
      },
      {
        id: 'sec-int-2',
        capituloId: 'cap-interpretar',
        materiaId: 'comp-lectora',
        title: '2. Interpretar Lenguaje Figurado',
        introduccion: '🎭 Los textos literarios en la PAES están llenos de metáforas, comparaciones e ironías. Aquí aprenderás a descifrar el significado real detrás del lenguaje figurado.',
        datos_claves: [
          'Metáfora vs. Comparación: La metáfora dice \"A es B\" (\"sus ojos eran estrellas\"), la comparación usa \"como\" (\"sus ojos brillaban como estrellas\"). Ambas requieren que traduzcas el sentido figurado.',
          'Contexto emocional: Las figuras retóricas siempre transmiten una emoción o actitud. Pregúntate: ¿qué SIENTE el hablante al usar esta expresión?',
          'Ironía PAES: La ironía dice lo contrario de lo que significa. Detecta el tono: si el contexto contradice las palabras, es ironía.'
        ],
        order: 3,
        test: {
          id: 'test-int-2',
          seccionId: 'sec-int-2',
          contexto_base: 'Pasarán los años y las estaciones; otros labios\nbesarán las mismas tazas que nosotros usamos;\notros ojos verán el mismo cielo\nque ahora nos parece tan nuestro.\n\nLa casa que hoy nos cobija,\ncon sus paredes que guardan nuestras voces,\nserá algún día la casa de otros,\ny nuestras risas serán solo ecos\nque el viento olvidará.\n\nPero hoy, aquí, mientras la tarde\ntiñe de oro las ventanas,\nnada de eso importa.\nHoy somos dueños del mundo\ny el mundo cabe en esta mesa.\n\n— Fragmento poético adaptado',
          preguntas: [
            { id: 1005, enunciado: '¿Qué figura retórica predomina en la expresión \"nuestras risas serán solo ecos que el viento olvidará\"?', alternativas: { A: 'Hipérbole, porque exagera el volumen de las risas.', B: 'Personificación, porque atribuye al viento la capacidad de olvidar.', C: 'Comparación, porque compara las risas con ecos.', D: 'Antítesis, porque contrapone risa y olvido.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! 🎭 El viento no puede \"olvidar\", eso es una acción humana. Al atribuírsela al viento, tenemos una personificación.', feedback_error: 'Fíjate en quién realiza la acción de \"olvidar\". ¿El viento puede olvidar? Esa atribución de una cualidad humana a algo no humano se llama personificación.' },
            { id: 1006, enunciado: '¿Cómo se puede interpretar la expresión \"el mundo cabe en esta mesa\"?', alternativas: { A: 'Que la mesa es muy grande y puede contener muchas cosas.', B: 'Que todo lo que importa al hablante está reunido en ese momento, en ese lugar.', C: 'Que el hablante tiene una visión reducida del mundo.', D: 'Que están comiendo alimentos de todo el mundo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante interpretación! ✨ Es una metáfora: el \"mundo\" del hablante es la gente y el momento que comparte en esa mesa. Todo lo importante está ahí.', feedback_error: 'No lo tomes literal. \"El mundo\" no se refiere al planeta sino a lo que tiene valor para el hablante. ¿Qué cabe en esa mesa?' },
            { id: 1007, enunciado: '¿Cuál es el tema central del poema?', alternativas: { A: 'La importancia de cuidar el medio ambiente para las futuras generaciones.', B: 'La nostalgia por un pasado que ya no volverá.', C: 'La valoración del momento presente frente a la fugacidad del tiempo.', D: 'La crítica a una sociedad que olvida sus tradiciones.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! 🎯 El poema reconoce que todo pasará (estrofas 1-2) pero afirma que \"hoy, aquí... nada de eso importa\". Es un canto al presente.', feedback_error: 'Lee la tercera estrofa: \"Pero hoy, aquí... nada de eso importa\". ¿Qué actitud toma el hablante ante el paso del tiempo?' },
            { id: 1008, enunciado: '¿Qué sentido tiene la expresión \"la tarde tiñe de oro las ventanas\"?', alternativas: { A: 'Que las ventanas están pintadas de color dorado.', B: 'Que la luz del atardecer baña las ventanas con tonos cálidos.', C: 'Que el sol es tan intenso que daña las ventanas.', D: 'Que están decorando la casa para una celebración.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! 🌅 \"Teñir de oro\" es una metáfora visual que describe la luz dorada del atardecer sobre las ventanas. Hermoso, ¿no?', feedback_error: 'Piensa literalmente: ¿qué produce un efecto \"dorado\" en las ventanas al final del día? La luz del atardecer.' }
          ]
        }
      },
      {
        id: 'sec-int-3',
        capituloId: 'cap-interpretar',
        materiaId: 'comp-lectora',
        title: '3. Relaciones entre Ideas',
        introduccion: '🔗 ¿Qué conecta un párrafo con otro? Las relaciones lógicas son la columna vertebral de cualquier texto argumentativo. En esta lección, dominarás la habilidad de identificar causa-efecto, problema-solución y comparaciones.',
        datos_claves: [
          'Los conectores son tu mapa: \"sin embargo\" = contraste, \"por lo tanto\" = consecuencia, \"además\" = adición, \"en cambio\" = oposición. Subráyalos mentalmente.',
          'No todos los conectores son explícitos: a veces la relación está implícita. Si un párrafo plantea un problema y el siguiente ofrece una medida, hay relación problema-solución aunque no diga \"la solución es\".',
          'General → Particular: Si el primer párrafo da una idea amplia y el segundo da un ejemplo concreto, esa es la relación.'
        ],
        order: 4,
        test: {
          id: 'test-int-3',
          seccionId: 'sec-int-3',
          contexto_base: 'La deforestación en la Amazonía ha alcanzado niveles críticos en la última década. Según datos del Instituto Nacional de Investigaciones Espaciales (INPE), solo en 2022 se perdieron más de 11.500 kilómetros cuadrados de selva, equivalentes a la superficie de una ciudad como Estambul. Las principales causas incluyen la expansión de la ganadería extensiva, la agricultura industrial de soja y la extracción ilegal de madera.\n\nSin embargo, las consecuencias van mucho más allá de la pérdida de árboles. La destrucción del bosque tropical altera los ciclos hídricos regionales, reduce la biodiversidad y libera grandes cantidades de dióxido de carbono almacenado, acelerando el calentamiento global. Investigadores de la Universidad de São Paulo han advertido que, de continuar al ritmo actual, la Amazonía podría alcanzar un \"punto de no retorno\" en el que dejaría de funcionar como regulador climático.\n\nAnte este escenario, diversos gobiernos latinoamericanos han firmado acuerdos de cooperación para frenar la deforestación. Brasil, en particular, implementó el Plan de Acción para la Prevención y Control de la Deforestación, que combina vigilancia satelital, multas a infractores y apoyo a comunidades indígenas que actúan como guardianes del bosque.',
          preguntas: [
            { id: 1009, enunciado: '¿Qué relación lógica se establece entre el primer y el segundo párrafo?', alternativas: { A: 'El primero presenta las soluciones; el segundo describe el problema.', B: 'El primero expone las causas del problema; el segundo detalla sus consecuencias.', C: 'El primero compara la deforestación con otros fenómenos; el segundo la contextualiza históricamente.', D: 'El primero presenta datos científicos; el segundo ofrece opiniones de expertos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! 🔗 El primer párrafo identifica las CAUSAS (ganadería, soja, extracción), y el segundo párrafo detalla las CONSECUENCIAS (ciclos hídricos, biodiversidad, CO₂). Es una relación causa-efecto.', feedback_error: 'Relee: ¿Qué hace el primer párrafo? Describe qué provoca la deforestación. ¿Y el segundo? Describe qué produce la deforestación. Eso es causa → efecto.' },
            { id: 1010, enunciado: '¿Qué función cumple el tercer párrafo en relación con los dos anteriores?', alternativas: { A: 'Resume los puntos principales de los párrafos anteriores.', B: 'Contradice la gravedad del problema presentado.', C: 'Presenta las acciones propuestas como respuesta al problema descrito.', D: 'Introduce un tema completamente nuevo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! 🎯 El tercer párrafo es la \"solución\" en la estructura problema-consecuencia-solución. El conector \"Ante este escenario\" marca la transición.', feedback_error: '¿Qué significa la frase \"Ante este escenario\"? Es un marcador de respuesta/solución al problema descrito anteriormente.' },
            { id: 1011, enunciado: 'En el contexto del segundo párrafo, ¿qué significa la expresión \"punto de no retorno\"?', alternativas: { A: 'Un límite geográfico que no se puede cruzar.', B: 'Un momento en que los viajes a la Amazonía serían imposibles.', C: 'Un umbral crítico tras el cual el daño sería irreversible.', D: 'Una fecha específica calculada por científicos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! 🧠 En contexto, \"punto de no retorno\" = umbral/límite irreversible. Si lo cruzas, ya no puedes volver atrás. Usa la técnica de sustitución para confirmarlo.', feedback_error: 'Aplica la técnica de sustitución: reemplaza \"punto de no retorno\" por cada alternativa en la oración original. ¿Cuál mantiene el sentido?' },
            { id: 1012, enunciado: '¿Qué se puede inferir sobre el rol de las comunidades indígenas mencionadas en el tercer párrafo?', alternativas: { A: 'Son las principales responsables de la deforestación.', B: 'Son aliados estratégicos en la protección de la selva.', C: 'Están en conflicto con los gobiernos latinoamericanos.', D: 'Son beneficiarios pasivos de las políticas ambientales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente inferencia! 🌿 El texto los llama \"guardianes del bosque\" y dice que reciben \"apoyo\", lo que implica un rol activo y estratégico en la conservación.', feedback_error: '¿Cómo los describe el texto? \"Guardianes del bosque\" + reciben apoyo = rol activo y positivo en la protección.' }
          ]
        }
      },
      {
        id: 'sec-int-4',
        capituloId: 'cap-interpretar',
        materiaId: 'comp-lectora',
        title: '4. Sintetizar Información Global',
        introduccion: '🦅 El nivel más alto de interpretación: integrar ideas de distintas partes del texto para construir una comprensión global. Aquí demostrarás que puedes ver el \"panorama completo\".',
        datos_claves: [
          'Lee estratégicamente: Primero haz una lectura rápida para captar la estructura general. Luego relee las partes relevantes para la pregunta.',
          'El propósito del texto: Pregúntate siempre \"¿Para qué fue escrito esto?\" La respuesta sintetiza el mensaje global.',
          'Integra, no copies: La síntesis combina ideas de varios párrafos. Si la respuesta viene de un solo párrafo, probablemente no es síntesis.'
        ],
        order: 5,
        test: {
          id: 'test-int-4',
          seccionId: 'sec-int-4',
          contexto_base: 'La inteligencia artificial (IA) ha dejado de ser un tema exclusivo de los laboratorios tecnológicos para instalarse en el centro del debate educativo. Mientras algunos académicos celebran sus posibilidades como herramienta pedagógica, otros advierten sobre los riesgos de una dependencia tecnológica que podría debilitar habilidades cognitivas fundamentales.\n\nUn estudio reciente de la Universidad de Stanford reveló que estudiantes que utilizan asistentes de IA para redactar ensayos muestran una mejora del 35% en la estructura de sus textos, pero experimentan una reducción del 20% en su capacidad de argumentación original cuando escriben sin ayuda tecnológica. \"La herramienta complementa, pero no debe sustituir el proceso de pensamiento\", señaló la investigadora principal del estudio, Dra. Elena Vásquez.\n\nEn Chile, el Ministerio de Educación ha adoptado una postura intermedia. Su plan \"IA en el Aula 2025\" promueve el uso de inteligencia artificial como apoyo al aprendizaje, pero establece que las evaluaciones formales deben realizarse sin acceso a estas herramientas. La medida busca garantizar que los estudiantes desarrollen competencias propias sin renunciar a los beneficios de la tecnología.\n\nNo obstante, organizaciones de docentes han planteado que el verdadero desafío no es regular la IA, sino capacitar a los profesores para integrarla de manera efectiva. \"Sin formación docente, cualquier política será letra muerta\", declaró el presidente del Colegio de Profesores.',
          preguntas: [
            { id: 1013, enunciado: '¿Cuál es la idea central que articula todo el texto?', alternativas: { A: 'La IA es perjudicial para la educación y debe prohibirse.', B: 'El debate sobre cómo integrar la IA en la educación requiere equilibrar sus beneficios con la preservación de habilidades autónomas.', C: 'Los estudiantes chilenos están más preparados que los de otros países para usar IA.', D: 'Las universidades deben reemplazar a los profesores con sistemas de IA.' }, respuesta_correcta: 'B', feedback_acierto: '¡Síntesis perfecta! 🏆 Has integrado las ideas de los 4 párrafos: debate (P1), evidencia de beneficios/riesgos (P2), postura intermedia (P3) y desafíos pendientes (P4).', feedback_error: 'La idea central no está en un solo párrafo. Debes integrar: hay un debate (P1), con evidencia a favor y en contra (P2), una postura intermedia (P3) y desafíos (P4). ¿Qué tienen en común?' },
            { id: 1014, enunciado: 'Según el texto, ¿qué paradoja revela el estudio de Stanford?', alternativas: { A: 'Que la IA es más creativa que los humanos.', B: 'Que la IA mejora un aspecto del escribir (estructura) pero debilita otro (argumentación propia).', C: 'Que los estudiantes prefieren la escritura manual a la digital.', D: 'Que Stanford está en contra del uso de IA.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! ⚖️ El estudio muestra que la IA mejora la forma (+35% estructura) pero puede debilitar el fondo (-20% argumentación original). Esa es la paradoja.', feedback_error: 'Busca los porcentajes en el segundo párrafo: +35% y -20%. ¿Qué mejora y qué empeora? Ahí está la paradoja.' },
            { id: 1015, enunciado: '¿Qué relación existe entre la postura del Ministerio de Educación (P3) y la del Colegio de Profesores (P4)?', alternativas: { A: 'Son contradictorias: el Ministerio apoya la IA y el Colegio la rechaza.', B: 'Son complementarias: el Ministerio regula el uso y el Colegio señala la condición para que funcione.', C: 'Son idénticas: ambos quieren prohibir la IA en evaluaciones.', D: 'Son irrelevantes entre sí: abordan temas diferentes.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante! 🔗 El Ministerio pone las reglas (cómo usar IA), y el Colegio señala el prerrequisito (capacitar docentes). Se complementan.', feedback_error: 'El Ministerio dice \"usemos IA pero regulemos\". El Colegio dice \"la regulación no sirve si no se capacita a los profesores\". ¿Se contradicen o se complementan?' },
            { id: 1016, enunciado: '¿Qué significa la expresión \"cualquier política será letra muerta\" en el contexto del cuarto párrafo?', alternativas: { A: 'Que las políticas se escriben en papel y no digitalmente.', B: 'Que sin formación docente, las regulaciones existirán pero no tendrán efecto real.', C: 'Que los profesores se niegan a leer las nuevas políticas.', D: 'Que las políticas educativas tienen una vigencia limitada.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto vocabulario en contexto! 📖 \"Letra muerta\" = normativa que existe formalmente pero no se aplica ni tiene impacto real.', feedback_error: 'Aplica sustitución: \"Sin formación docente, cualquier política será [ineficaz/sin efecto]\". ¿Cuál alternativa se acerca a eso?' }
          ]
        }
      },
      {
        id: 'sec-int-practice-connect',
        capituloId: 'cap-interpretar',
        materiaId: 'comp-lectora',
        title: '🧩 Conectores Lógicos',
        introduccion: '¡Último desafío del capítulo! 🏁 Los conectores son las \"señales de tránsito\" del texto. Practica eligiendo el conector correcto para cada oración.',
        datos_claves: [],
        order: 6,
        isPractice: true,
        practiceType: 'connectors',
        test: { id: 'test-int-pc', seccionId: 'sec-int-practice-connect', contexto_base: null, preguntas: [] }
      }
    ]
  }
];
