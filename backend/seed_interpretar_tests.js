// ── TESTS REALES PARA CAP INTERPRETAR ──────────────────────────
// Contenido PAES-quality para los 12 nodos del Capítulo 2
// Temario PAES: Relaciones entre ideas, inferencias, síntesis,
// estructura textual, función de ejemplos/citas, tesis/argumentos,
// personajes/conflicto, tiempo/espacio narrativo, desafío final.

const admin = require('firebase-admin');
require('dotenv').config();

const pk = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: pk,
    })
  });
}

const db = admin.firestore();

const TESTS_INTERPRETAR = {

  // ── NODO int-1: Establecer relaciones entre ideas (Texto informativo) ──
  'test-int-1': {
    id: 'test-int-1',
    seccionId: 'int-1',
    contexto_base: `La memoria humana no funciona como una grabadora fiel. Cada vez que recordamos un evento, no recuperamos un archivo estático, sino que reconstruimos activamente la experiencia a partir de fragmentos almacenados. Esta naturaleza reconstructiva hace que los recuerdos sean susceptibles a modificaciones, adiciones e incluso invenciones. El psicólogo Frederick Bartlett fue pionero en demostrar, en la década de 1930, que las personas tienden a adaptar sus recuerdos para hacerlos coherentes con sus conocimientos y expectativas previas.

Décadas más tarde, la investigadora Elizabeth Loftus profundizó este fenómeno con sus estudios sobre los "falsos recuerdos". En experimentos clásicos, logró implantar recuerdos de eventos que nunca ocurrieron en la vida de los participantes, simplemente mediante sugerencias verbales o la presentación de fotografías alteradas. Sus hallazgos tienen implicancias directas en el ámbito judicial, donde el testimonio de testigos oculares ha sido históricamente considerado como una prueba de gran peso, a pesar de su alta falibilidad demostrada por la ciencia.

La memoria, entonces, no es un espejo del pasado, sino una construcción activa influida por el conocimiento previo, las emociones, el contexto social y la información recibida después del evento original. Comprender esta fragilidad es fundamental, tanto para el sistema legal como para la psicología educativa, donde los métodos de enseñanza deben considerar cómo los estudiantes realmente procesan y retienen la información.`,
    preguntas: [
      {
        id: 1101,
        enunciado: '¿Cuál es la relación entre el primer y el segundo párrafo del texto?',
        alternativas: {
          A: 'El primero describe la memoria humana; el segundo refuta sus conclusiones con investigaciones modernas.',
          B: 'El primero establece la naturaleza reconstructiva de la memoria; el segundo profundiza en el tema con investigaciones específicas.',
          C: 'El primero presenta un problema histórico; el segundo propone soluciones para el sistema judicial.',
          D: 'El primero introduce a Bartlett; el segundo contrasta su teoría con la de Loftus.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente! 🧠 El primer párrafo sienta las bases conceptuales (la memoria es reconstructiva), y el segundo profundiza con los experimentos de Loftus sobre falsos recuerdos.',
        feedback_error: 'Identifica qué plantea cada párrafo por separado. El primero introduce una idea general; el segundo la desarrolla con un caso concreto.'
      },
      {
        id: 1102,
        enunciado: '¿Qué relación existe entre los hallazgos de Loftus y el sistema judicial?',
        alternativas: {
          A: 'Sus estudios demuestran que los testimonios judiciales deben ser eliminados como medio de prueba.',
          B: 'Sus estudios cuestionan la confiabilidad del testimonio de testigos oculares en procesos judiciales.',
          C: 'Sus estudios apoyan el uso del testimonio de testigos como prueba principal en juicios.',
          D: 'Sus estudios confirman que la memoria judicial es más precisa que la memoria cotidiana.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! ⚖️ El texto indica que el testimonio tiene "alta falibilidad demostrada por la ciencia", lo que pone en cuestión su peso como prueba.',
        feedback_error: 'No confundas la crítica con la solución. El texto no propone eliminar el testimonio, sino cuestionar su confiabilidad.'
      },
      {
        id: 1103,
        enunciado: 'La expresión "la memoria no es un espejo del pasado" es una metáfora que significa:',
        alternativas: {
          A: 'La memoria borra rápidamente los recuerdos desagradables.',
          B: 'Los recuerdos pueden ser falsos, pero se sienten como verdaderos.',
          C: 'La memoria no reproduce los hechos con exactitud, sino que los reconstruye.',
          D: 'El pasado no puede ser recordado con precisión después de muchos años.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Perfecto! 🪞 Un espejo reproduce fielmente la realidad. Decir que la memoria NO es un espejo implica que no reproduce con exactitud, sino que construye.',
        feedback_error: 'Piensa en qué hace un espejo: refleja fielmente. Si la memoria NO es un espejo, ¿qué significa eso sobre cómo funciona?'
      },
      {
        id: 1104,
        enunciado: '¿Cuál es el propósito principal del tercer párrafo en relación con el texto completo?',
        alternativas: {
          A: 'Refutar las conclusiones de Bartlett y Loftus con nuevas evidencias científicas.',
          B: 'Resumir y extender las implicancias del fenómeno descrito en los párrafos anteriores.',
          C: 'Proporcionar soluciones definitivas al problema de la memoria falible.',
          D: 'Introducir un nuevo problema no relacionado con los párrafos anteriores.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 🎯 El tercer párrafo sintetiza ("La memoria, entonces...") y amplía las consecuencias hacia el derecho y la educación.',
        feedback_error: 'Lee el inicio del tercer párrafo: "La memoria, entonces...". Esa palabra de cierre indica que resume lo anterior y extrae consecuencias.'
      }
    ]
  },

  // ── NODO int-2: Establecer relaciones entre ideas (Texto narrativo) ──
  'test-int-2': {
    id: 'test-int-2',
    seccionId: 'int-2',
    contexto_base: `La señora Elvira llegó al pueblo de noche, sin equipaje y con los zapatos cubiertos de barro. La dueña de la pensión, una mujer ancha de brazos y pocas palabras, la observó de arriba abajo antes de abrirle la puerta. "Cuarto al fondo, segunda planta", dijo. "El desayuno se sirve a las ocho. No después."

A la mañana siguiente, Elvira bajó a desayunar a las ocho y diez. La dueña puso la tetera sobre la mesa sin mirarla. Un gato entró por la ventana abierta y se sentó entre las dos. Nadie lo expulsó.

Por la tarde, Elvira preguntó si había trabajo en el pueblo. La dueña tardó un momento en responder: "Depende de lo que sepa hacer". Elvira dijo que sabía coser, cocinar y cuidar plantas enfermas. La dueña la miró de otro modo. No exactamente con calidez, pero tampoco con la misma dureza de la noche anterior. "Venga mañana a las siete", fue todo lo que dijo.`,
    preguntas: [
      {
        id: 1201,
        enunciado: '¿Cuál es la relación entre la actitud de la dueña al principio y al final del relato?',
        alternativas: {
          A: 'Pasa de la hostilidad abierta a la simpatía declarada.',
          B: 'Se mantiene igual de distante e indiferente durante todo el relato.',
          C: 'Evoluciona desde la frialdad inicial hacia una actitud levemente más receptiva.',
          D: 'Comienza siendo amistosa y se vuelve desconfiada al conocer a Elvira.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Excelente lectura del personaje! 👁️ Al inicio la dueña apenas abre la puerta y es seca; al final la mira "de otro modo" y le ofrece la posibilidad de trabajar.',
        feedback_error: 'Compara el comportamiento de la dueña en el primer párrafo con el último. ¿Cambió algo, aunque sea levemente?'
      },
      {
        id: 1202,
        enunciado: '¿Qué función narrativa cumple la escena del gato en el segundo párrafo?',
        alternativas: {
          A: 'Interrumpe el conflicto entre las dos mujeres, creando un momento de tregua silenciosa.',
          B: 'Simboliza la hostilidad de la dueña hacia la visitante forastera.',
          C: 'Demuestra que la pensión tiene malas condiciones higiénicas.',
          D: 'Establece un contraste humorístico con la seriedad del relato.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Lectura profunda! 🐱 El gato entra sin ser rechazado por ninguna de las dos, creando un instante compartido neutral que suaviza la tensión inicial.',
        feedback_error: 'Fíjate que "Nadie lo expulsó": ambas mujeres toleran al gato. ¿Qué podría significar ese breve momento compartido en el contexto de su relación?'
      },
      {
        id: 1203,
        enunciado: 'La expresión "la miró de otro modo" al final del relato significa que la dueña:',
        alternativas: {
          A: 'La observó con desconfianza ante las habilidades declaradas por Elvira.',
          B: 'Cambió su percepción inicial y comenzó a ver a Elvira con cierto interés.',
          C: 'Decidió rechazar la propuesta de trabajo de Elvira definitivamente.',
          D: 'Reconoció a Elvira como una persona conocida del pueblo.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien inferido! 🔍 El narrador aclara que ese nuevo modo de mirar no era calidez, pero tampoco "la misma dureza de la noche anterior": algo cambió.',
        feedback_error: 'El narrador precisa qué tipo de mirada era y qué no era. ¿Qué se puede deducir de ese cambio sutil?'
      },
      {
        id: 1204,
        enunciado: '¿Qué se puede inferir sobre la situación de Elvira al llegar al pueblo?',
        alternativas: {
          A: 'Viene de unas vacaciones y busca alojamiento temporal.',
          B: 'Es una inspectora enviada por las autoridades locales.',
          C: 'Llega en condiciones precarias y necesita trabajo urgentemente.',
          D: 'Conoce de antemano a la dueña de la pensión.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Inferencia correcta! 💡 "Sin equipaje, con los zapatos cubiertos de barro" y su búsqueda inmediata de trabajo al día siguiente sugieren una situación de necesidad.',
        feedback_error: 'Junta las pistas: sin equipaje, de noche, buscando trabajo al otro día. ¿Qué cuadro sugieren en conjunto?'
      }
    ]
  },

  // ── NODO int-3: Deducir inferencias (Texto informativo) ──
  'test-int-3': {
    id: 'test-int-3',
    seccionId: 'int-3',
    contexto_base: `El agua cubre aproximadamente el 71% de la superficie terrestre, pero menos del 3% de ella es agua dulce. De ese escaso porcentaje, más del 68% se encuentra congelado en glaciares y casquetes polares, lo que la hace inaccesible para el consumo humano inmediato. El agua subterránea almacenada en acuíferos representa otro 30%, y solo el 0,3% del agua dulce total fluye en ríos y lagos, que son las principales fuentes de abastecimiento para la mayor parte de la humanidad.

Frente a este panorama, la escasez hídrica afecta actualmente a más de 2.000 millones de personas en el mundo, según datos de la ONU, y se proyecta que para el año 2025 la mitad de la población mundial podría vivir en zonas de alta presión sobre el recurso hídrico. Chile no escapa a esta tendencia: la denominada "megasequía" que afecta la zona central del país desde 2010 es considerada por los científicos como el evento de déficit hídrico más prolongado en 500 años de registros paleoclimáticos.

A pesar de la urgencia de la crisis, el consumo doméstico de agua per cápita en el mundo ha aumentado sostenidamente en las últimas décadas, impulsado por el crecimiento urbano, los cambios en los hábitos de consumo y la expansión de actividades industriales y agrícolas con alta demanda hídrica.`,
    preguntas: [
      {
        id: 1301,
        enunciado: 'A partir de los datos del primer párrafo, ¿qué se puede inferir?',
        alternativas: {
          A: 'La humanidad enfrenta un serio desafío para acceder al agua dulce disponible en el planeta.',
          B: 'Las tecnologías actuales son capaces de convertir el agua salada en agua potable de manera eficiente.',
          C: 'Los glaciares son la principal fuente de agua potable para la población mundial.',
          D: 'La contaminación de ríos y lagos es el problema más grave del acceso al agua.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Inferencia impecable! 💧 Si solo el 0,3% del agua dulce total está realmente disponible, se puede concluir que el acceso es extremadamente limitado.',
        feedback_error: 'Los datos muestran que casi toda el agua dulce está congelada o bajo tierra. ¿Qué conclusión lógica se puede sacar sobre la disponibilidad real del recurso?'
      },
      {
        id: 1302,
        enunciado: 'Del segundo párrafo se puede inferir que la megasequía en Chile es:',
        alternativas: {
          A: 'Un fenómeno causado exclusivamente por actividades humanas locales.',
          B: 'Un evento de una magnitud excepcional y sin precedentes recientes.',
          C: 'Un problema que afecta principalmente a la Patagonia chilena.',
          D: 'Un fenómeno cíclico que se repite cada cincuenta años aproximadamente.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 🌵 "El evento de déficit hídrico más prolongado en 500 años de registros" indica una magnitud extraordinaria y sin precedentes en ese lapso.',
        feedback_error: 'Lee la descripción: "el más prolongado en 500 años". ¿Qué significa eso respecto a lo que ha ocurrido antes en ese período?'
      },
      {
        id: 1303,
        enunciado: 'El tercer párrafo permite inferir que la crisis del agua:',
        alternativas: {
          A: 'Se resolverá naturalmente con el aumento de lluvias proyectado para las próximas décadas.',
          B: 'Se agrava porque la demanda de agua sigue creciendo a pesar de la escasez.',
          C: 'Afecta principalmente a zonas rurales sin acceso a tecnología de riego.',
          D: 'Es fundamentalmente un problema de distribución, no de cantidad disponible.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 📈 Si la disponibilidad es escasa y el consumo "ha aumentado sostenidamente", la brecha entre oferta y demanda se amplía, agravando la crisis.',
        feedback_error: 'Conecta los dos primeros párrafos (el agua escasea) con el tercero (el consumo aumenta). ¿Qué consecuencia se desprende de esa combinación?'
      },
      {
        id: 1304,
        enunciado: 'Del texto completo, se puede inferir que el principal desafío global respecto al agua es:',
        alternativas: {
          A: 'Explorar técnicas para extraer agua de los glaciares antárticos.',
          B: 'Equilibrar una demanda creciente con una disponibilidad extremadamente limitada.',
          C: 'Disminuir la presencia de sal en los océanos para aumentar el agua potable.',
          D: 'Construir más represas en zonas de alta precipitación.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Síntesis perfecta! 🌍 El texto combina la escasez del recurso con el aumento del consumo, dejando en claro que el reto es equilibrar oferta y demanda.',
        feedback_error: 'Sintetiza los tres párrafos: el agua disponible es poca (párrafo 1), la crisis ya afecta a millones (párrafo 2), y el consumo sigue aumentando (párrafo 3).'
      }
    ]
  },

  // ── NODO int-4: Deducir inferencias (Texto narrativo) ──
  'test-int-4': {
    id: 'test-int-4',
    seccionId: 'int-4',
    contexto_base: `El abuelo no había hablado en tres días. No por enojo, sino porque estaba escuchando. Así lo entendió Valentina cuando lo vio sentado junto a la ventana mirando el jardín donde nada ocurría: ni pájaros, ni viento, ni lluvia. Solo la luz quieta de la tarde.

Valentina le llevó un vaso de agua. Él lo aceptó sin apartar la vista del jardín. Bebió lentamente y devolvió el vaso vacío. "Hay un árbol en ese jardín que ya no dará fruta", dijo por fin. "Lo sé porque lo planté yo."

Ella no entendió de inmediato. Pero esa noche, mientras escuchaba los pasos de su abuelo por el pasillo a las tres de la mañana, creyó comprender algo que no podía nombrar todavía. Se prometió a sí misma que al día siguiente le preguntaría sobre ese árbol. Cuando amaneció, el cuarto de su abuelo estaba vacío y ordenado. Sobre la almohada había una moneda antigua.`,
    preguntas: [
      {
        id: 1401,
        enunciado: '¿Qué se puede inferir sobre el estado emocional del abuelo durante los tres días de silencio?',
        alternativas: {
          A: 'Estaba molesto con Valentina por alguna razón no declarada.',
          B: 'Estaba inmerso en una reflexión profunda o proceso interior significativo.',
          C: 'Sufría una enfermedad que le impedía hablar físicamente.',
          D: 'Esperaba que Valentina tomara la iniciativa de iniciar la conversación.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien inferido! 🌅 El narrador aclara que no era enojo: "estaba escuchando". Mirar un jardín quieto durante días sugiere una reflexión o proceso interior.',
        feedback_error: 'El narrador descarta explícitamente el enojo. ¿Qué otra razón podría explicar ese silencio contemplativo frente a un jardín donde "nada ocurría"?'
      },
      {
        id: 1402,
        enunciado: 'Cuando el abuelo dice "Hay un árbol en ese jardín que ya no dará fruta", probablemente se refiere a:',
        alternativas: {
          A: 'Un problema de plagas que afecta a los árboles del jardín.',
          B: 'Su propio final de vida, usando el árbol como metáfora de sí mismo.',
          C: 'El descuido del jardín por parte de la familia en los últimos años.',
          D: 'Un recuerdo de su infancia ligado a ese árbol específico.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura profunda! 🌳 "Lo planté yo" conecta al abuelo con el árbol. Si el árbol "ya no dará fruta", es una metáfora de su propio ciclo de vida llegando a su fin.',
        feedback_error: 'El abuelo dice que "lo planté yo". ¿Qué te sugiere esa identificación del abuelo con el árbol, en el contexto de su silencio y contemplación?'
      },
      {
        id: 1403,
        enunciado: '¿Qué se puede inferir del final del relato (cuarto vacío, moneda en la almohada)?',
        alternativas: {
          A: 'El abuelo salió a comprar provisiones muy temprano en la mañana.',
          B: 'El abuelo fue internado de urgencia durante la noche.',
          C: 'El abuelo se fue o murió, dejando la moneda como despedida o legado.',
          D: 'Valentina había tenido un sueño y nada de lo narrado ocurrió realmente.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Excelente! 💰 El cuarto "vacío y ordenado" y la moneda antigua sobre la almohada son indicios de una partida definitiva, ya sea la muerte o una despedida planeada.',
        feedback_error: 'Un cuarto "vacío y ordenado" sugiere una partida intencional. La moneda antigua como único objeto dejado tiene carácter de legado o despedida. ¿Qué cuadro completo forman estas pistas?'
      },
      {
        id: 1404,
        enunciado: 'La expresión "algo que no podía nombrar todavía" sugiere que Valentina:',
        alternativas: {
          A: 'Tenía problemas de lenguaje para expresar sus emociones claramente.',
          B: 'Presentía una verdad sobre su abuelo que aún no lograba articular racionalmente.',
          C: 'Desconocía el significado de la moneda que encontraría al día siguiente.',
          D: 'No quería aceptar que su abuelo podría estar enfermo.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 💭 La comprensión emocional e intuitiva suele preceder a la comprensión racional. Valentina percibe algo verdadero que aún no puede formular con palabras.',
        feedback_error: '"No poder nombrar" no es un problema de lenguaje, es una comprensión intuitiva que aún no se ha vuelto consciente. ¿Qué "presiente" Valentina sobre su abuelo?'
      }
    ]
  },

  // ── NODO int-5: Sintetizar idea principal (Texto informativo) ──
  'test-int-5': {
    id: 'test-int-5',
    seccionId: 'int-5',
    contexto_base: `El concepto de "huella ecológica" fue desarrollado en los años noventa por los investigadores Mathis Wackernagel y William Rees como una herramienta para medir el impacto ambiental de las actividades humanas. En términos simples, la huella ecológica calcula cuánta área de tierra y agua biológicamente productiva necesita una persona, una ciudad o un país para producir los recursos que consume y para absorber los residuos que genera.

Según el informe del Global Footprint Network de 2023, la humanidad actualmente utiliza el equivalente a 1,75 planetas Tierra para sostener su nivel de consumo. Esto significa que estamos consumiendo los recursos naturales a una velocidad mayor de la que el planeta puede regenerarlos. El "Día de Sobrecarga de la Tierra" —la fecha del año en que la humanidad ha consumido todos los recursos que la Tierra puede producir de forma sostenible en un año— ocurrió en 2023 el 2 de agosto, dejando el resto del año en "deuda ecológica".

Distintos países tienen huellas muy diferentes. Estados Unidos tiene una huella ecológica de aproximadamente 8 hectáreas por persona, mientras que la de un ciudadano promedio de India es de 1,2 hectáreas. Chile se ubica en torno a las 3,4 hectáreas per cápita. Estas diferencias reflejan los distintos patrones de consumo, los modelos energéticos y las dietas de cada sociedad.`,
    preguntas: [
      {
        id: 1501,
        enunciado: '¿Cuál es la idea principal del texto?',
        alternativas: {
          A: 'La huella ecológica es un concepto científico que mide el impacto humano sobre el planeta, evidenciando que el consumo actual supera la capacidad de regeneración de la Tierra.',
          B: 'Estados Unidos tiene la huella ecológica más alta del mundo, lo que lo convierte en el principal responsable del deterioro ambiental.',
          C: 'El Día de Sobrecarga de la Tierra es el indicador más importante para medir el cambio climático global.',
          D: 'La huella ecológica de Chile es mayor a la del promedio mundial, lo que representa un problema urgente.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Síntesis perfecta! 🌱 La idea central articula la herramienta (huella ecológica) con su hallazgo principal (consumimos más de lo que el planeta puede regenerar).',
        feedback_error: 'La idea principal debe abarcar el texto completo, no un detalle específico. ¿Cuál opción sintetiza tanto el concepto como su implicancia más importante?'
      },
      {
        id: 1502,
        enunciado: 'La expresión "deuda ecológica" en el segundo párrafo se refiere a:',
        alternativas: {
          A: 'El dinero que los países desarrollados deben pagar por sus emisiones de CO₂.',
          B: 'El déficit entre los recursos consumidos y la capacidad regenerativa del planeta.',
          C: 'Los préstamos internacionales para financiar proyectos medioambientales.',
          D: 'La obligación moral de reducir el consumo individual en un 50%.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 💸 Después del "Día de Sobrecarga", consumimos recursos que la Tierra no puede regenerar a tiempo: eso es una "deuda" con el planeta.',
        feedback_error: 'El término "deuda" aquí es una metáfora. Si ya consumimos los recursos del año antes de que este termine, ¿qué le estamos "debiendo" al planeta?'
      },
      {
        id: 1503,
        enunciado: '¿Cuál es la función del tercer párrafo en relación con el texto?',
        alternativas: {
          A: 'Introduce un nuevo problema ambiental no abordado en los párrafos anteriores.',
          B: 'Refuta los datos del segundo párrafo con estadísticas más recientes.',
          C: 'Ilustra con ejemplos concretos las diferencias en el impacto ambiental entre países.',
          D: 'Propone soluciones para reducir la huella ecológica a nivel global.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Exacto! 📊 El tercer párrafo aporta cifras concretas de distintos países para mostrar cómo varía la huella ecológica según el modelo de desarrollo.',
        feedback_error: 'El tercer párrafo da cifras de países específicos. ¿Qué propósito cumple aportar esos ejemplos concretos en el texto?'
      },
      {
        id: 1504,
        enunciado: 'De acuerdo con el texto, ¿qué factores explican las diferencias en la huella ecológica entre países?',
        alternativas: {
          A: 'El nivel de tecnología satelital y la eficiencia de los sistemas de reciclaje.',
          B: 'Los patrones de consumo, los modelos energéticos y las dietas.',
          C: 'La densidad poblacional y el acceso a agua potable.',
          D: 'La inversión en energías renovables y el control de la natalidad.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Localización exacta! 🔍 "Estas diferencias reflejan los distintos patrones de consumo, los modelos energéticos y las dietas de cada sociedad."',
        feedback_error: 'El texto lista explícitamente las causas de estas diferencias en la última oración del tercer párrafo.'
      }
    ]
  },

  // ── NODO int-6: Sintetizar idea principal (Texto narrativo) ──
  'test-int-6': {
    id: 'test-int-6',
    seccionId: 'int-6',
    contexto_base: `Cuando cumplió ochenta años, mi abuela decidió aprender a nadar. Nadie en la familia lo tomó en serio hasta que apareció en la piscina municipal con su gorro de hule floreado y su traje de baño azul marino de los años setenta.

El instructor, un joven de veinte y tantos años que se llamaba Rodrigo, no supo qué hacer al principio. Le explicó los ejercicios del modo en que siempre lo hacía: rápido, con demostraciones breves, esperando que los alumnos imitaran. Mi abuela lo miraba con paciencia y luego le pedía que repitiera. Rodri terminó explicándole cada movimiento tres o cuatro veces, y con mucha más calma de la que usaba normalmente.

Tardó seis semanas en lograr flotar. No fue fácil para ninguno de los dos. Pero el día que mi abuela cruzó el largo de la piscina sin detenerse, Rodrigo aplaudió desde el borde. Ella salió del agua, se quitó el gorro y le dijo: "¿Ves? Nunca es tarde. Y tampoco es tan difícil si uno tiene a alguien que no se rinde." Rodrigo se quedó callado. Esa tarde, después de la clase, llamó a su madre a quien llevaba dos años sin hablarle.`,
    preguntas: [
      {
        id: 1601,
        enunciado: '¿Cuál es la idea central del relato?',
        alternativas: {
          A: 'Los adultos mayores tienen la capacidad de aprender cualquier destreza física.',
          B: 'La perseverancia y el acompañamiento transforman no solo al aprendiz, sino también a quien enseña.',
          C: 'Los instructores jóvenes deben adaptar sus métodos a los adultos mayores.',
          D: 'La natación es una actividad que beneficia a personas de todas las edades.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Síntesis poderosa! 🌊 El relato muestra cómo la abuela aprende a nadar, pero también cómo Rodrigo aprende una lección de vida que lo lleva a reconciliarse con su madre.',
        feedback_error: 'El relato no termina con la abuela nadando: termina con Rodrigo llamando a su madre. ¿Qué nos dice eso sobre quién también cambió en esta historia?'
      },
      {
        id: 1602,
        enunciado: 'La frase final "llamó a su madre a quien llevaba dos años sin hablarle" sugiere que:',
        alternativas: {
          A: 'Rodrigo encontró en la abuela a una figura materna que le recordó su familia.',
          B: 'El ejemplo de la abuela impulsó a Rodrigo a resolver un conflicto personal pendiente.',
          C: 'Rodrigo quería contarle a su madre el logro de su alumna más inusual.',
          D: 'La abuela le pidió a Rodrigo que se reconciliara con su madre antes de terminar la clase.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien inferido! 📞 Las palabras de la abuela —"nunca es tarde" y "alguien que no se rinde"— calaron en Rodrigo y lo llevaron a actuar en su propia vida.',
        feedback_error: 'Conecta las palabras de la abuela ("nunca es tarde", "alguien que no se rinde") con la acción posterior de Rodrigo. ¿Qué motivó esa llamada?'
      },
      {
        id: 1603,
        enunciado: '¿Qué transformación ocurre en el personaje de Rodrigo a lo largo del relato?',
        alternativas: {
          A: 'Pasa de ser un instructor eficiente a uno que pierde la paciencia con los alumnos difíciles.',
          B: 'Pasa de ser impaciente y mecánico a adoptar una actitud más calmada y reflexiva.',
          C: 'Pasa de admirar a su madre a sentir que no la necesita después de conocer a la abuela.',
          D: 'No experimenta ninguna transformación real, ya que la historia se centra en la abuela.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura precisa del personaje! 🧑‍🏫 Al inicio explica rápido y con demostraciones breves; al final explica con "mucha más calma de la que usaba normalmente".',
        feedback_error: 'Compara cómo es Rodrigo al inicio del relato con cómo actúa al final. ¿Cambió su manera de enseñar? ¿Y su vida personal?'
      },
      {
        id: 1604,
        enunciado: '¿Qué función narrativa cumple el detalle del "traje de baño azul marino de los años setenta"?',
        alternativas: {
          A: 'Indica que la abuela es muy pobre y no puede comprar ropa nueva.',
          B: 'Caracteriza a la abuela como alguien auténtico que no se preocupa por las apariencias.',
          C: 'Sugiere que la abuela era una nadadora profesional en su juventud.',
          D: 'Crea un contraste cómico que resta seriedad al resto del relato.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura perceptiva! 👙 Usar un traje antiguo sin importarle la moda revela a una persona auténtica, segura de sí misma y sin pretensiones, lo que refuerza su personalidad.',
        feedback_error: 'No es un dato económico ni histórico: es un detalle de caracterización. ¿Qué dice de una persona el hecho de aparecer en público con ropa de décadas atrás sin avergonzarse?'
      }
    ]
  },

  // ── NODO int-7: Comprender estructura del texto (Texto informativo) ──
  'test-int-7': {
    id: 'test-int-7',
    seccionId: 'int-7',
    contexto_base: `¿Por qué dormimos? Durante siglos, el sueño fue considerado un estado pasivo, una simple pausa en la actividad consciente. Sin embargo, la neurociencia moderna ha revelado que dormir es uno de los procesos más activos y vitales que realiza nuestro organismo.

Durante el sueño profundo, el cerebro activa el sistema glinfático, una red de canales que limpia los desechos metabólicos acumulados durante la vigilia, entre ellos la proteína beta-amiloide, cuya acumulación excesiva está relacionada con el desarrollo del Alzheimer. Paralelamente, el hipocampo transfiere la información del día hacia la corteza cerebral para su almacenamiento a largo plazo, proceso fundamental para la consolidación de la memoria.

En la fase REM (Movimiento Rápido de Ojos), el cerebro procesa las emociones vividas durante el día y practica con escenarios creativos y de resolución de problemas, lo que explica por qué muchos artistas e inventores han reportado que sus mejores ideas llegaron tras una noche de sueño. La privación crónica de sueño, en contraste, reduce la capacidad inmunológica, altera la regulación del cortisol y la insulina, y aumenta significativamente el riesgo de enfermedades cardiovasculares.

En suma, dormir no es perder el tiempo: es invertirlo en la reparación, la memoria y el bienestar integral del organismo.`,
    preguntas: [
      {
        id: 1701,
        enunciado: '¿Cómo está organizado el texto estructuralmente?',
        alternativas: {
          A: 'Presenta un problema y ofrece una serie de soluciones prácticas paso a paso.',
          B: 'Plantea una pregunta y la responde explicando los procesos que ocurren durante el sueño.',
          C: 'Compara dos teorías opuestas sobre el sueño y concluye cuál es la más aceptada.',
          D: 'Narra cronológicamente los descubrimientos científicos sobre el sueño desde la antigüedad.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 🧩 El texto abre con una pregunta ("¿Por qué dormimos?") y los párrafos siguientes la responden detallando los procesos del sueño.',
        feedback_error: 'Identifica la primera oración del texto. ¿Es un problema, una comparación, una narración o una pregunta? Y los párrafos siguientes, ¿qué hacen con ella?'
      },
      {
        id: 1702,
        enunciado: '¿Cuál es la función del primer párrafo respecto al resto del texto?',
        alternativas: {
          A: 'Resume las conclusiones que se desarrollarán en los párrafos siguientes.',
          B: 'Presenta la visión tradicional del sueño y la contrasta con el enfoque científico actual.',
          C: 'Describe el método de investigación utilizado por los neurocientíficos.',
          D: 'Proporciona estadísticas sobre los trastornos del sueño a nivel mundial.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 📖 El primer párrafo contrasta la visión antigua ("estado pasivo") con la visión moderna de la neurociencia ("proceso activo y vital").',
        feedback_error: 'Lee el primer párrafo: introduce "lo que se creía antes" y "lo que la ciencia moderna dice ahora". Esa es su función.'
      },
      {
        id: 1703,
        enunciado: '¿Qué función cumple el último párrafo en la estructura del texto?',
        alternativas: {
          A: 'Introduce una nueva idea sobre el sueño no abordada anteriormente.',
          B: 'Plantea una pregunta de investigación para futuros estudios.',
          C: 'Sintetiza la idea central de todo el texto en una conclusión breve.',
          D: 'Refuta los datos presentados en los párrafos anteriores.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Exacto! 🏁 "En suma" es un marcador de cierre. El último párrafo resume en una frase la tesis central: dormir es un proceso vital, no una pérdida de tiempo.',
        feedback_error: 'El conector "En suma" señala que lo que sigue es una síntesis. ¿Qué función tiene eso en la estructura del texto?'
      },
      {
        id: 1704,
        enunciado: 'La mención a la privación crónica de sueño en el tercer párrafo cumple la función de:',
        alternativas: {
          A: 'Cambiar el tema hacia las enfermedades cardiovasculares.',
          B: 'Reforzar la importancia del sueño al mostrar las consecuencias negativas de su ausencia.',
          C: 'Introducir una excepción a los beneficios descritos en el párrafo anterior.',
          D: 'Contradecir la tesis del primer párrafo sobre la actividad cerebral en el sueño.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien identificado! ⚖️ Al mostrar lo que ocurre sin sueño (enfermedades, baja inmunología), el texto refuerza por contraste la importancia de dormir bien.',
        feedback_error: 'Si el texto habla de los beneficios del sueño, ¿qué función cumple enumerar los daños de no dormir? ¿Contradice o refuerza?'
      }
    ]
  },

  // ── NODO int-8: Reconocer función de ejemplos y citas (Texto informativo) ──
  'test-int-8': {
    id: 'test-int-8',
    seccionId: 'int-8',
    contexto_base: `La empatía, entendida como la capacidad de comprender y compartir los estados emocionales de otros, ha sido considerada históricamente como una virtud esencialmente humana. Sin embargo, la etología moderna —la ciencia del comportamiento animal— ha documentado manifestaciones de conductas empáticas en una amplia variedad de especies.

El primatólogo Frans de Waal, uno de los investigadores más reconocidos en este campo, describe cómo los chimpancés consuelan activamente a congéneres que han perdido una pelea, acercándose para abrazarlos o acicalarlos. "La empatía no es un lujo de los humanos civilizados: está grabada en nuestra biología de mamíferos", afirma de Waal. Sus observaciones sugieren que las raíces de la empatía son evolutivas y preexisten al lenguaje y la cultura.

Otro caso documentado es el de los elefantes, que muestran comportamientos de duelo colectivo ante la muerte de un miembro de su manada: rodean el cuerpo, lo tocan con sus trompas y pueden permanecer junto a él durante horas. Los delfines, por su parte, han sido observados sosteniendo a congéneres heridos o enfermos en la superficie del agua para impedir que se ahoguen, incluso durante largos períodos.

Estas evidencias sugieren que la empatía, lejos de ser una conquista exclusiva de la civilización humana, podría ser un mecanismo evolutivo compartido por diversas especies sociales como forma de fortalecer los vínculos del grupo.`,
    preguntas: [
      {
        id: 1801,
        enunciado: '¿Cuál es la función de la cita de Frans de Waal ("La empatía no es un lujo...")?',
        alternativas: {
          A: 'Contradice la tesis del texto, al afirmar que la empatía es exclusivamente humana.',
          B: 'Añade la autoridad de un especialista para respaldar la idea de que la empatía tiene raíces biológicas.',
          C: 'Introduce una hipótesis alternativa que el resto del texto refuta.',
          D: 'Resume la conclusión del texto sin aportar nueva información.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 📣 La cita de un primatólogo reconocido da autoridad científica a la afirmación de que la empatía es una capacidad biológica, no solo cultural.',
        feedback_error: 'Cuando un texto cita a un experto, ¿qué suele buscar el autor? Piensa en el efecto que tiene usar las palabras de un especialista reconocido.'
      },
      {
        id: 1802,
        enunciado: '¿Qué función cumplen los ejemplos de los elefantes y los delfines en el tercer párrafo?',
        alternativas: {
          A: 'Refutan las observaciones de Frans de Waal con casos contradictorios.',
          B: 'Amplían la evidencia presentada, mostrando que la empatía no se limita a los primates.',
          C: 'Demuestran que los mamíferos acuáticos son más empáticos que los terrestres.',
          D: 'Introducen un tema nuevo sobre la inteligencia animal no relacionado con la empatía.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien identificado! 🐘🐬 Los nuevos ejemplos amplían el alcance de la evidencia: si chimpancés, elefantes y delfines muestran empatía, la evidencia es más sólida.',
        feedback_error: 'El texto ya presentó los chimpancés. ¿Para qué agrega elefantes y delfines? ¿Para contradecir, para ampliar o para cambiar el tema?'
      },
      {
        id: 1803,
        enunciado: 'El ejemplo del duelo colectivo de los elefantes sirve principalmente para:',
        alternativas: {
          A: 'Demostrar que los elefantes tienen rituales culturales similares a los humanos.',
          B: 'Ilustrar una manifestación concreta de empatía en una especie no primate.',
          C: 'Comparar el duelo animal con los rituales funerarios de distintas culturas humanas.',
          D: 'Refutar la idea de que la empatía requiere lenguaje para expresarse.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Exacto! 🐘 El ejemplo de los elefantes es un caso concreto (ilustración) de que la empatía existe en especies distintas a los primates.',
        feedback_error: 'Un ejemplo sirve para ilustrar una afirmación. ¿Qué idea general está ilustrando este comportamiento de los elefantes?'
      },
      {
        id: 1804,
        enunciado: '¿Qué relación existe entre el primer párrafo y el resto del texto?',
        alternativas: {
          A: 'El primero afirma que la empatía es humana; el resto refuta esa idea con ejemplos animales.',
          B: 'El primero resume lo que el resto del texto desarrollará en detalle.',
          C: 'El primero propone una hipótesis que el resto del texto demuestra ser incorrecta.',
          D: 'El primero describe la metodología científica y el resto presenta los resultados.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Estructura bien comprendida! 🔄 El primer párrafo presenta la visión tradicional (empatía = humana), y el resto la refuta con evidencia científica de otras especies.',
        feedback_error: 'Lee el primer párrafo con cuidado: ¿presenta como verdad definitiva que la empatía es humana o la introduce para luego cuestionar esa idea?'
      }
    ]
  },

  // ── NODO int-9: Identificar tesis y argumentos (Texto informativo) ──
  'test-int-9': {
    id: 'test-int-9',
    seccionId: 'int-9',
    contexto_base: `El debate sobre la semana laboral de cuatro días ha ganado terreno en los últimos años, impulsado por evidencias que apuntan a que trabajar menos tiempo puede aumentar, paradójicamente, la productividad. En 2022, el mayor experimento controlado sobre el tema —realizado en el Reino Unido con 61 empresas y casi 3.000 trabajadores— concluyó que el 92% de las empresas participantes mantendrá el modelo de forma permanente tras verificar que la productividad no solo no disminuyó, sino que en muchos casos mejoró.

Desde la perspectiva del bienestar, los trabajadores reportaron menores niveles de estrés y agotamiento, mejor calidad del sueño y una percepción de mayor control sobre su tiempo personal. Estas mejoras se traducen, a largo plazo, en menor ausentismo laboral y menores costos asociados a problemas de salud mental derivados del trabajo.

Los críticos de este modelo argumentan que no es aplicable a todos los sectores: industrias como la salud, el comercio minorista o la manufactura tienen una demanda continua que no puede comprimirse en cuatro días sin afectar la calidad del servicio. Además, señalan que la semana de cuatro días podría intensificar la carga de trabajo diaria, anulando sus beneficios.

Sin embargo, sus defensores replican que el debate no debe centrarse en reducir horas, sino en rediseñar cómo se trabaja: eliminar reuniones innecesarias, reducir la burocracia y aumentar la autonomía de los equipos. Con esas condiciones, la jornada reducida puede funcionar en sectores diversos.`,
    preguntas: [
      {
        id: 1901,
        enunciado: '¿Cuál es la tesis principal que defiende el texto?',
        alternativas: {
          A: 'La semana de cuatro días es una medida necesaria e inmediatamente aplicable en todos los sectores económicos.',
          B: 'La reducción de la jornada laboral, bien implementada, puede aumentar la productividad y el bienestar sin disminuir la calidad del trabajo.',
          C: 'Los trabajadores deben tener poder de decisión sobre sus horarios para ser más productivos.',
          D: 'Las empresas del Reino Unido son más eficientes que las de otros países por adoptar nuevos modelos laborales.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Tesis bien identificada! 💼 El texto argumenta que trabajar menos días puede ser beneficioso para productividad y bienestar, si se implementa correctamente.',
        feedback_error: 'Busca la postura central que el texto defiende a lo largo de todos sus párrafos. ¿Es una afirmación absoluta o una que presenta condiciones?'
      },
      {
        id: 1902,
        enunciado: '¿Cuál de los siguientes es un argumento que el texto presenta A FAVOR de la semana de cuatro días?',
        alternativas: {
          A: 'No es aplicable a sectores como la salud o el comercio minorista.',
          B: 'Puede intensificar la carga de trabajo diaria, anulando sus beneficios.',
          C: 'El 92% de las empresas que la probaron decidieron mantenerla por sus resultados positivos.',
          D: 'Requiere eliminar reuniones y reducir burocracia, lo que no siempre es posible.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! 📊 El dato del experimento del Reino Unido es el argumento empírico central que respalda la tesis favorable a la semana de cuatro días.',
        feedback_error: 'Distingue los argumentos a favor de los argumentos en contra. Las opciones A, B y D corresponden a objeciones o límites del modelo.'
      },
      {
        id: 1903,
        enunciado: '¿Cuál es la función del tercer párrafo en la estructura argumentativa del texto?',
        alternativas: {
          A: 'Introduce la tesis principal del texto sobre la semana de cuatro días.',
          B: 'Presenta los contraargumentos de los críticos del modelo.',
          C: 'Resume los datos del experimento realizado en el Reino Unido.',
          D: 'Propone una solución alternativa a la semana de cuatro días.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien identificado! ⚖️ El tercer párrafo introduce la voz de "los críticos" con sus objeciones: inaplicabilidad en ciertos sectores e intensificación de la jornada.',
        feedback_error: 'Fíjate en la expresión "Los críticos de este modelo argumentan...". ¿Qué función cumple incluir la voz de los críticos en un texto argumentativo?'
      },
      {
        id: 1904,
        enunciado: 'La réplica de los defensores en el último párrafo funciona como:',
        alternativas: {
          A: 'Una concesión que acepta plenamente las críticas del tercer párrafo.',
          B: 'Una respuesta que reencuadra el debate y matiza los límites señalados por los críticos.',
          C: 'Una refutación absoluta que invalida todas las objeciones planteadas anteriormente.',
          D: 'Una síntesis neutral entre las posiciones a favor y en contra.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Análisis preciso! 🎯 Los defensores no niegan los problemas, sino que replantean el enfoque: "no se trata de reducir horas, sino de rediseñar el trabajo".',
        feedback_error: 'Los defensores no dicen "los críticos están equivocados". ¿Qué hacen exactamente? ¿Conceden, reencuadran o niegan las objeciones?'
      }
    ]
  },

  // ── NODO int-10: Analizar personajes y conflicto (Texto narrativo) ──
  'test-int-10': {
    id: 'test-int-10',
    seccionId: 'int-10',
    contexto_base: `—¿Y si estamos cometiendo un error? —dijo Camila sin levantar la vista de la mesa.

Mauricio dejó el tenedor. Era la tercera vez esta semana que ella decía eso, en distintas formas. Primera vez: "A veces pienso que nos adelantamos". Segunda: "¿Tú crees que estamos listos?" Ahora, directamente, el error.

—No sé qué quieres que te diga —respondió él, con una calma que costaba más de lo que parecía.

—Que me digas lo que piensas de verdad.

Mauricio miró la ventana. Afuera había un árbol que perdía las últimas hojas de otoño. Pensó, sin decirlo, que él también sentía algo que no sabía cómo nombrar. No era arrepentimiento. Era más como el vértigo de estar parado en un borde sin saber si lo que había al otro lado era un abismo o una pradera.

—Pienso que no existe la decisión perfecta —dijo al fin—. Pienso que uno elige y luego hace que funcione.

Camila levantó la vista. No sonrió. Pero tampoco siguió mirando la mesa.`,
    preguntas: [
      {
        id: 2001,
        enunciado: '¿Cuál es el conflicto central del relato?',
        alternativas: {
          A: 'Una pareja discute sobre a quién le corresponde tomar decisiones en la relación.',
          B: 'Dos personajes enfrentan la duda e incertidumbre ante una decisión importante que ya tomaron.',
          C: 'Un personaje intenta convencer al otro de que tome una decisión que ha evitado.',
          D: 'Una pareja discute sobre un error cometido en el pasado que afecta su presente.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Conflicto bien identificado! 🎭 No discuten sobre qué decidir, sino que ya tomaron una decisión y ambos, especialmente Camila, dudan si fue la correcta.',
        feedback_error: 'La decisión ya fue tomada. El conflicto no es "qué hacer" sino algo que ocurre después de haber actuado. ¿Cuál es ese conflicto?'
      },
      {
        id: 2002,
        enunciado: 'La "calma que costaba más de lo que parecía" de Mauricio revela que:',
        alternativas: {
          A: 'Mauricio está seguro de su decisión y no desea debatirla nuevamente.',
          B: 'Mauricio también tiene dudas, pero las oculta para no ampliar el conflicto.',
          C: 'Mauricio está molesto con Camila por repetir siempre la misma queja.',
          D: 'Mauricio desconoce el motivo de la angustia de Camila.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura profunda del personaje! 🎭 El narrador luego confirma que Mauricio "también sentía algo que no sabía cómo nombrar", lo que valida que oculta sus propias dudas.',
        feedback_error: 'El narrador dice que su calma "costaba". ¿Qué implica que algo cueste? Y más adelante, ¿qué revela el narrador sobre los sentimientos internos de Mauricio?'
      },
      {
        id: 2003,
        enunciado: 'La metáfora del borde ("estar parado en un borde sin saber si hay un abismo o una pradera") ilustra:',
        alternativas: {
          A: 'El miedo de Mauricio a tomar nuevas decisiones en el futuro.',
          B: 'La incertidumbre de Mauricio sobre si la decisión tomada resultará bien o mal.',
          C: 'La distancia emocional que Mauricio siente respecto a Camila.',
          D: 'La indecisión de Mauricio sobre si decirle la verdad a Camila o no.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Metáfora bien interpretada! 🏔️ El "abismo" representa el fracaso; la "pradera" el éxito. El vértigo es no saber cuál de los dos espera al otro lado de la decisión tomada.',
        feedback_error: 'El vértigo es ante lo desconocido: ¿saldrá bien o mal lo que ya hicieron? No es sobre nuevas decisiones ni sobre Camila, sino sobre el resultado de una acción pasada.'
      },
      {
        id: 2004,
        enunciado: '¿Qué comunica el final del relato ("No sonrió. Pero tampoco siguió mirando la mesa")?',
        alternativas: {
          A: 'Camila acepta plenamente las palabras de Mauricio y se reconcilian.',
          B: 'Camila continúa sin estar convencida, pero la respuesta de Mauricio le genera un leve cambio.',
          C: 'Camila decide terminar la conversación al sentir que Mauricio no entiende su preocupación.',
          D: 'Camila admite que tenía razón Mauricio desde el principio.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura matizada! 🌅 El final no es de resolución plena (no sonrió) ni de cierre hermético (ya no mira la mesa). Es un cambio sutil, un pequeño movimiento hacia adelante.',
        feedback_error: 'El narrador niega la sonrisa (no hay alivio total) pero también señala que algo cambió. ¿Cuál es ese estado intermedio?'
      }
    ]
  },

  // ── NODO int-11: Interpretar tiempo y espacio (Texto narrativo) ──
  'test-int-11': {
    id: 'test-int-11',
    seccionId: 'int-11',
    contexto_base: `El mercado de la ciudad vieja abrió por última vez un jueves de febrero. Lo supe mucho después, cuando alguien que vivía en ese barrio me mostró una fotografía en blanco y negro: puestos de fruta, un toldo de rayas, mujeres con bolsos de mimbre. La foto tenía fecha en el reverso: 1974.

Cuando yo llegué al barrio, en la década de los noventa, el mercado ya era un estacionamiento. Los adoquines originales seguían ahí, debajo del asfalto, según me contó don Beto, que había vendido especias durante treinta años en el puesto del rincón. "El aroma todavía sale a veces, con el calor", decía. No sé si era cierto. Pero lo creía.

Hoy, ese mismo espacio es una galería de arte contemporáneo con paredes blancas y luz cenital. Los adoquines están expuestos en el suelo de vidrio, visibles pero intocables, como piezas de museo. Una placa en la entrada explica la historia del lugar en tres párrafos. Algunos visitantes la leen; la mayoría no.`,
    preguntas: [
      {
        id: 2101,
        enunciado: '¿Cuántas épocas diferentes se mencionan en el relato?',
        alternativas: {
          A: 'Dos: el pasado del mercado y el presente de la galería.',
          B: 'Tres: 1974 (mercado), los años noventa (estacionamiento) y el presente (galería).',
          C: 'Cuatro: la fundación del mercado, su cierre, el estacionamiento y la galería.',
          D: 'Solo una: la época actual del narrador.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura del tiempo precisa! ⏳ El texto recorre 1974 (mercado), la década de los noventa (estacionamiento) y el presente (galería de arte).',
        feedback_error: 'Lee cada párrafo y determina a qué época corresponde. El narrador va pasando de una a otra. ¿Cuántas puede identificar?'
      },
      {
        id: 2102,
        enunciado: '¿Qué efecto produce el espacio sobre los personajes y la memoria en el relato?',
        alternativas: {
          A: 'El espacio es neutro; lo que importa es solo la perspectiva subjetiva del narrador.',
          B: 'El espacio acumula capas de historia que distintas personas experimentan de modo diferente.',
          C: 'El espacio demuestra que la modernización destruye inevitablemente la identidad cultural.',
          D: 'El espacio solo tiene significado para quienes vivieron directamente en él.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien! 🗺️ El mismo lugar fue mercado, estacionamiento y galería: distintas personas en distintas épocas lo experimentan de maneras completamente diferentes.',
        feedback_error: 'Piensa en qué significa para don Beto, para el narrador y para los visitantes de la galería. ¿El espacio tiene el mismo sentido para todos ellos?'
      },
      {
        id: 2103,
        enunciado: 'La imagen de los adoquines "visibles pero intocables, como piezas de museo" sugiere:',
        alternativas: {
          A: 'Que la galería está bien preservada y respeta el patrimonio arquitectónico del lugar.',
          B: 'Que el pasado del lugar está presente físicamente, pero ya no es accesible ni vivo.',
          C: 'Que los visitantes de la galería son indiferentes al valor histórico del edificio.',
          D: 'Que los adoquines serán eventualmente restaurados a su estado original.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Imagen bien interpretada! 🪨 Los adoquines están ahí (el pasado existe), pero bajo vidrio, inaccesibles (ya no es parte de la vida cotidiana). La memoria es visible pero no habitable.',
        feedback_error: '"Visibles pero intocables" es una tensión: están presentes pero ya no se pueden tocar ni usar. ¿Qué dice eso sobre la relación entre el presente y el pasado del lugar?'
      },
      {
        id: 2104,
        enunciado: 'El detalle "algunos visitantes la leen; la mayoría no" al final del relato tiene como función:',
        alternativas: {
          A: 'Criticar la mala educación histórica en las ciudades contemporáneas.',
          B: 'Evidenciar que la historia del lugar permanece desconocida para la mayoría.',
          C: 'Añadir un tono irónico sobre la ineficacia de las galerías de arte como espacios culturales.',
          D: 'Señalar que la placa explicativa está mal ubicada dentro de la galería.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Lectura perceptiva! 📜 La placa con la historia existe, pero la mayoría pasa sin leerla: el pasado está disponible, pero la memoria colectiva no lo recupera activamente.',
        feedback_error: 'El dato es específico: la historia está escrita, pero la mayoría no la lee. ¿Qué dice eso sobre la relación de los visitantes (y la sociedad) con la memoria del lugar?'
      }
    ]
  },

  // ── BOSS: Desafío Final Capítulo 2 ──
  'test-int-boss': {
    id: 'test-int-boss',
    seccionId: 'int-boss',
    contexto_base: `📖 TEXTO I: El silencio de las ciudades

Las ciudades modernas producen ruido de manera incesante: tráfico, obras, sirenas, publicidad sonora y el murmullo constante de millones de vidas simultáneas. Sin embargo, los especialistas en psicología ambiental han comenzado a estudiar un fenómeno paradójico: el ruido urbano no solo perturba el descanso, sino que también fragmenta la atención, reduce la capacidad de memoria de trabajo y debilita la creatividad de las personas expuestas a él de forma crónica.

Un estudio publicado en 2021 por investigadores de la Universidad de Michigan demostró que breves periodos de silencio —de tan solo dos minutos— producen un efecto más relajante en el sistema nervioso que escuchar música relajante, medido a través de indicadores de presión arterial, frecuencia cardíaca y tensión muscular. Estos hallazgos han impulsado iniciativas en ciudades como Helsinki y Ámsterdam para incorporar "zonas de silencio" en parques y espacios públicos.

La paradoja profunda, sin embargo, es que el silencio se ha vuelto un bien escaso y, en ciertos contextos, un privilegio. Quienes viven en barrios de altos ingresos tienen mayor acceso a zonas verdes tranquilas, viviendas con buen aislamiento acústico y trabajo en ambientes controlados. Las comunidades de menores ingresos, ubicadas frecuentemente cerca de autopistas, aeropuertos o zonas industriales, sufren una exposición desproporcionada al ruido crónico y a sus consecuencias cognitivas y de salud.

--- DIVISION_TEXTOS ---

📖 TEXTO II: El ruido como narrativa

El escritor y compositor John Cage sostenía que el silencio no existe: "Siempre habrá algo que ver, algo que oír. De hecho, por más que tratemos de lograr el silencio, no podemos." Su obra más famosa, 4'33" (1952), consiste en que el intérprete permanece sin tocar su instrumento durante cuatro minutos y treinta y tres segundos: el "silencio" de la sala, con sus toses, susurros y ruidos ambientales, se convierte en la música.

Esta perspectiva artística invierte la lógica convencional: el ruido deja de ser el problema y se convierte en el fenómeno a escuchar. Los sonidos cotidianos —un ventilador, los pasos de alguien en el piso de arriba, el motor de un refrigerador— adquieren, bajo esta mirada, una textura y un significado propios. Cage argumentaba que la apertura al entorno sonoro es una forma de atención plena y presencia en el mundo.

Sin embargo, el filósofo y crítico musical Theodor Adorno cuestionó esta perspectiva: para Adorno, la estetización del ruido cotidiano ignora su dimensión política y social. Celebrar el sonido urbano como "música" sin cuestionar quién está expuesto involuntariamente a él y quién puede elegir escucharlo convierte en arte aquello que para muchos es una condición impuesta de vida.`,
    preguntas: [
      {
        id: 2201,
        texto_index: 0,
        enunciado: '¿Cuál es la idea principal del Texto I?',
        alternativas: {
          A: 'Las ciudades modernas deben eliminar completamente el ruido para mejorar la salud de sus habitantes.',
          B: 'El ruido urbano crónico perjudica la cognición y la salud, y el acceso al silencio está inequitativamente distribuido.',
          C: 'Los estudios científicos sobre el ruido son insuficientes para generar políticas públicas efectivas.',
          D: 'Las ciudades de Europa lideran las iniciativas mundiales de reducción del ruido urbano.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Síntesis perfecta del Texto I! 🌆 El texto desarrolla dos ideas: el daño cognitivo del ruido crónico y la desigualdad en el acceso al silencio.',
        feedback_error: 'El Texto I tiene dos partes: los efectos del ruido (párrafos 1 y 2) y la desigualdad en el acceso al silencio (párrafo 3). Busca la opción que sintetice ambas.'
      },
      {
        id: 2202,
        texto_index: 0,
        enunciado: 'Del tercer párrafo del Texto I se puede inferir que:',
        alternativas: {
          A: 'Las personas de bajos ingresos son más resistentes al ruido debido a su adaptación al entorno.',
          B: 'La exposición al ruido crónico constituye una forma de desigualdad social con consecuencias cognitivas.',
          C: 'Los barrios de altos ingresos son más ruidosos debido a su mayor actividad económica.',
          D: 'Los gobiernos locales tienen la obligación legal de garantizar el silencio a todos sus ciudadanos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Inferencia correcta! ⚖️ Si los barrios pobres sufren más ruido y sus consecuencias negativas, y los ricos tienen más acceso al silencio, el ruido es una dimensión más de la desigualdad.',
        feedback_error: 'El tercer párrafo conecta el nivel socioeconómico con el nivel de exposición al ruido. ¿Qué conclusión más amplia se puede inferir de esa relación?'
      },
      {
        id: 2203,
        texto_index: 0,
        enunciado: 'En el Texto I, la expresión "el silencio se ha vuelto un bien escaso y un privilegio" significa que:',
        alternativas: {
          A: 'El silencio es algo que la tecnología moderna puede producir artificialmente.',
          B: 'El acceso a entornos tranquilos está reservado principalmente a quienes tienen mayores recursos.',
          C: 'El silencio es un fenómeno natural que desaparece con el avance de la urbanización.',
          D: 'Las personas prefieren el ruido al silencio en contextos de vida moderna.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien interpretado! 🏙️ "Bien escaso" = hay poco; "privilegio" = solo algunos pueden acceder a él. El tercer párrafo confirma que son quienes viven en barrios de altos ingresos.',
        feedback_error: 'Un "privilegio" es algo que tienen unos y no todos. ¿Quiénes tienen acceso al silencio según el texto? ¿Y quiénes no?'
      },
      {
        id: 2204,
        texto_index: 1,
        enunciado: '¿Cuál es el argumento central de la perspectiva de John Cage sobre el silencio?',
        alternativas: {
          A: 'El silencio absoluto es el estado ideal para la creación musical.',
          B: 'El silencio no existe: lo que llamamos silencio es en realidad el sonido del entorno.',
          C: 'La música debe eliminar los ruidos ambientales para que el oyente pueda concentrarse.',
          D: 'El ruido urbano es una forma de agresión contra la sensibilidad artística.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 🎼 Cage afirma que el silencio es imposible y que lo que percibimos como tal son los sonidos del entorno que normalmente ignoramos.',
        feedback_error: 'Busca la cita directa de Cage y la descripción de su obra 4\'33". ¿Cuál es su tesis sobre el silencio?'
      },
      {
        id: 2205,
        texto_index: 1,
        enunciado: 'La crítica de Adorno a Cage puede resumirse como:',
        alternativas: {
          A: 'La obra de Cage es musicalmente inferior a la música clásica occidental.',
          B: 'Cage ignora la dimensión social y política del ruido al convertirlo en objeto estético.',
          C: 'El silencio en los conciertos es una condición necesaria para la experiencia musical.',
          D: 'La música concreta es superior a la música silenciosa propuesta por Cage.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien! 🎭 Adorno señala que estetizar el ruido sin cuestionar quién lo padece involuntariamente convierte en arte lo que para otros es una imposición.',
        feedback_error: 'Adorno no critica la calidad musical de Cage, sino algo político. ¿Qué olvida Cage según Adorno cuando trata el ruido como arte?'
      },
      {
        id: 2206,
        texto_index: 1,
        enunciado: '¿Qué relación existe entre la crítica de Adorno (Texto II) y el tercer párrafo del Texto I?',
        alternativas: {
          A: 'Ambos argumentan que el ruido tiene un valor artístico subvalorado por la sociedad.',
          B: 'Ambos señalan la dimensión social y política del ruido: no todos están expuestos a él del mismo modo ni por elección.',
          C: 'Ambos proponen que el ruido debe ser regulado por organismos internacionales.',
          D: 'No existe relación entre ambos textos en este punto, ya que abordan temas completamente distintos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Conexión intertextual excelente! 🔗 El Texto I muestra que el ruido afecta desproporcionalmente a los más vulnerables; Adorno critica que no todos "eligen" escucharlo. Ambos apuntan a la desigualdad.',
        feedback_error: 'Compara la idea de Adorno ("no todos pueden elegir escucharlo") con el párrafo 3 del Texto I ("las comunidades de menores ingresos sufren exposición desproporcionada"). ¿En qué coinciden?'
      },
      {
        id: 2207,
        texto_index: 0,
        enunciado: '¿Cuál es la función del dato del estudio de la Universidad de Michigan en el Texto I?',
        alternativas: {
          A: 'Introduce una nueva hipótesis sobre los efectos del ruido que contradice la idea principal.',
          B: 'Aporta evidencia científica concreta que sustenta la afirmación de que el silencio tiene beneficios medibles para la salud.',
          C: 'Demuestra que la música relajante es ineficaz como terapia para el estrés urbano.',
          D: 'Establece las bases del programa de zonas de silencio de Ámsterdam.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Perfecto! 📊 El estudio proporciona datos objetivos y medibles (presión arterial, frecuencia cardíaca) que validan científicamente los beneficios del silencio.',
        feedback_error: 'Los datos científicos en un texto informativo tienen una función clara: ¿para qué sirve que el autor cite ese estudio específicamente?'
      },
      {
        id: 2208,
        texto_index: 1,
        enunciado: 'En el Texto II, la descripción de la obra 4\'33" de Cage sirve para:',
        alternativas: {
          A: 'Demostrar que la música contemporánea rechaza el uso de instrumentos tradicionales.',
          B: 'Ilustrar concretamente la tesis de Cage de que el silencio no existe y los sonidos del entorno son la obra.',
          C: 'Criticar la tendencia de los artistas modernos a provocar al público con obras sin contenido.',
          D: 'Establecer la superioridad del arte experimental sobre la música clásica.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Función del ejemplo bien identificada! 🎵 El ejemplo de 4\'33" ilustra en la práctica lo que Cage afirma en teoría: sin tocar el instrumento, los sonidos del entorno se vuelven la música.',
        feedback_error: 'Un ejemplo ilustra una idea. ¿Qué tesis de Cage demuestra en la práctica la obra 4\'33"?'
      }
    ]
  }
};

async function seedTests() {
  const batch = db.batch();

  for (const [testId, testData] of Object.entries(TESTS_INTERPRETAR)) {
    const ref = db.collection('lp_tests').doc(testId);
    batch.set(ref, testData, { merge: true });
    console.log(`✅ Preparando: ${testId} — ${testData.preguntas.length} preguntas`);
  }

  await batch.commit();
  console.log('\n🎉 Todos los tests del Capítulo 2 (interpretar) guardados correctamente.');
}

seedTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
