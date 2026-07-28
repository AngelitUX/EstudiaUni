module.exports = [
      // PRO TIP 1
      {
        id: 'sec-2-protip-1',
        title: '¿Inferir o Suponer?',
        introduccion: 'La PAES mide tu capacidad de <b>inferir</b>, no de suponer. Una inferencia es una conclusión lógica y necesaria derivada de pistas textuales. Una suposición es un salto imaginativo basado en tus conocimientos previos. ¡Nunca uses tus conocimientos previos para responder!',
        datos_claves: [
          'Si la alternativa requiere que asumas algo que no dice el texto, <b>descártala</b>.',
          'Busca siempre las huellas o marcas textuales que justifiquen tu inferencia.'
        ],
        isProTip: true,
        test: { id: 'test-2-protip-1', contexto_base: null, preguntas: [] }
      },
      // PRACTICA RAPIDA 1
      {
        id: 'sec-2-prac-1',
        title: 'Rastreo de Pistas',
        introduccion: 'Práctica rápida de inferencias locales.',
        isPractice: true,
        test: {
          id: 'test-2-prac-1',
          contexto_base: 'Juan miró el reloj ansiosamente, tomó su maletín de cuero y corrió hacia el andén. Las puertas se estaban cerrando.',
          preguntas: [
            {
              id: 2001,
              enunciado: '¿Qué se puede inferir localmente del texto?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Juan iba a tomar un avión.', B: 'Juan estaba llegando tarde a su tren o metro.', C: 'Juan perdió el transporte.', D: 'Juan estaba escapando de alguien.' },
              respuesta_correcta: 'B',
              feedback_acierto: 'Correcto. "Andén" y "puertas cerrando" son pistas textuales de un tren/metro, y "ansiosamente" más "corrió" indican atraso.',
              feedback_error: 'Incorrecto. Busca las pistas textuales ("andén", "reloj").'
            }
          ]
        }
      },
      // PRACTICA RAPIDA 2
      {
        id: 'sec-2-prac-2',
        title: 'Conclusiones Mayores',
        introduccion: 'Práctica rápida de inferencias globales.',
        isPractice: true,
        test: {
          id: 'test-2-prac-2',
          contexto_base: 'El uso excesivo de plásticos de un solo uso está ahogando nuestros océanos. A pesar de las advertencias científicas y las campañas ecologistas, la producción mundial sigue aumentando. Las alternativas biodegradables existen, pero las grandes industrias se resisten al cambio por motivos de rentabilidad.',
          preguntas: [
            {
              id: 2002,
              enunciado: '¿Cuál es la conclusión global (tesis implícita) del texto?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Los plásticos biodegradables son muy caros de producir.', B: 'La crisis de los océanos se debe a la falta de campañas ecologistas.', C: 'Los intereses económicos de las industrias obstaculizan la solución al problema del plástico.', D: 'La ciencia no ha logrado encontrar una alternativa al plástico.' },
              respuesta_correcta: 'C',
              feedback_acierto: 'Excelente. La idea global une el problema (océanos ahogados), la solución disponible (biodegradables) y el obstáculo principal (rentabilidad de las industrias).',
              feedback_error: 'Incorrecto. Debes sintetizar la idea que engloba todo el párrafo, no solo una parte.'
            }
          ]
        }
      },
      // PRO TIP 2
      {
        id: 'sec-2-protip-2',
        title: 'El truco de las palabras raras',
        introduccion: 'En la PAES, a menudo te pedirán interpretar el sentido de una palabra o frase ("¿En qué sentido se usa X?"). El truco es <b>nunca</b> responder con el significado de diccionario de la palabra, sino con el significado que toma <b>dentro de ese contexto específico</b>.',
        datos_claves: [
          'Reemplaza mentalmente la palabra por la alternativa y lee la oración completa. ¿Mantiene el sentido?',
          'Cuidado con las palabras de uso múltiple o con sentido connotativo (figurado).'
        ],
        isProTip: true,
        test: { id: 'test-2-protip-2', contexto_base: null, preguntas: [] }
      },
      // PRACTICA RAPIDA 3
      {
        id: 'sec-2-prac-3',
        title: 'Vocabulario en Contexto',
        introduccion: 'Práctica rápida de significado contextual.',
        isPractice: true,
        test: {
          id: 'test-2-prac-3',
          contexto_base: 'La decisión del gobierno cayó como un balde de agua fría sobre los manifestantes.',
          preguntas: [
            {
              id: 2003,
              enunciado: '¿En qué sentido se utiliza la expresión "cayó como un balde de agua fría"?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Para indicar que los manifestantes se resfriaron.', B: 'Para expresar que la decisión apagó el entusiasmo o causó decepción abrupta.', C: 'Para mostrar que la decisión fue muy refrescante y positiva.', D: 'Para señalar que llovió durante la manifestación.' },
              respuesta_correcta: 'B',
              feedback_acierto: 'Correcto. Es una expresión connotativa que significa una sorpresa desagradable o decepción.',
              feedback_error: 'Incorrecto. Recuerda analizar el sentido figurado (connotativo) de la frase en el contexto.'
            }
          ]
        }
      },
      // PRO TIP 3
      {
        id: 'sec-2-protip-3',
        title: 'La Idea Principal',
        introduccion: 'Discriminar la información fundamental (idea principal) de la accesoria (detalles) es vital. La idea principal responde a la pregunta: <b>¿De qué trata principalmente el párrafo o texto?</b>',
        datos_claves: [
          'Un buen truco es imaginar que tienes que resumir el texto en un tweet de una sola línea. Lo que escribas será la idea principal.',
          'Las ideas principales suelen estar al principio o al final de los párrafos. Los ejemplos, fechas y nombres específicos casi siempre son ideas accesorias.'
        ],
        isProTip: true,
        test: { id: 'test-2-protip-3', contexto_base: null, preguntas: [] }
      },
      // PRACTICA RAPIDA 4
      {
        id: 'sec-2-prac-4',
        title: 'Tesis vs Detalles',
        introduccion: 'Práctica rápida de jerarquía de ideas.',
        isPractice: true,
        test: {
          id: 'test-2-prac-4',
          contexto_base: 'La inteligencia artificial ha revolucionado múltiples sectores. Por ejemplo, en la medicina, algoritmos como Watson ayudan a diagnosticar enfermedades raras. En la agricultura, los drones monitorean los cultivos. Sin embargo, su rápido avance plantea desafíos éticos.',
          preguntas: [
            {
              id: 2004,
              enunciado: '¿Cuál es una idea accesoria en el texto?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'La inteligencia artificial trae beneficios pero también retos éticos.', B: 'La inteligencia artificial ha revolucionado múltiples sectores.', C: 'Algoritmos como Watson ayudan a diagnosticar enfermedades raras.', D: 'El avance de la tecnología es demasiado rápido.' },
              respuesta_correcta: 'C',
              feedback_acierto: 'Correcto. Mencionar a "Watson" es un ejemplo específico (idea accesoria) para apoyar la idea principal de que la IA ha revolucionado la medicina.',
              feedback_error: 'Incorrecto. Busca el detalle específico o ejemplo, esa es la idea accesoria.'
            }
          ]
        }
      },
      // PRO TIP 4
      {
        id: 'sec-2-protip-4',
        title: '¿Para qué sirve esto?',
        introduccion: 'Cuando la prueba pregunta "¿Con qué propósito el autor menciona X?", te están evaluando la <b>función</b> de un elemento textual. Los autores no ponen palabras al azar; todo tiene una intención.',
        datos_claves: [
          'Las <b>citas de expertos</b> suelen usarse para dar autoridad o respaldo a una afirmación.',
          'Los <b>ejemplos</b> sirven para clarificar o ilustrar un concepto complejo.',
          'Las <b>preguntas retóricas</b> buscan hacer reflexionar al lector o introducir un tema.'
        ],
        isProTip: true,
        test: { id: 'test-2-protip-4', contexto_base: null, preguntas: [] }
      },
      // PRACTICA RAPIDA 5
      {
        id: 'sec-2-prac-5',
        title: 'Analizando el Propósito',
        introduccion: 'Práctica rápida sobre la función de citas y ejemplos.',
        isPractice: true,
        test: {
          id: 'test-2-prac-5',
          contexto_base: 'El sueño es fundamental para el aprendizaje. Según el Dr. Walker, profesor de neurociencia en UC Berkeley, "dormir antes de aprender prepara el cerebro para crear nuevas memorias, como si fuera una esponja seca".',
          preguntas: [
            {
              id: 2005,
              enunciado: '¿Con qué propósito el autor incluye la cita del Dr. Walker?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Para explicar cómo funcionan las esponjas marinas.', B: 'Para demostrar que las universidades investigan sobre el cerebro.', C: 'Para respaldar con una fuente de autoridad la idea de que el sueño es vital para aprender.', D: 'Para criticar los métodos de enseñanza actuales.' },
              respuesta_correcta: 'C',
              feedback_acierto: 'Exacto. Es un argumento de autoridad clásico para darle credibilidad a la tesis del autor.',
              feedback_error: 'Incorrecto. Recuerda que las citas de expertos (Dr., Profesor, Universidad) suelen cumplir la función de respaldar o dar autoridad.'
            }
          ]
        }
      },
      // PRO TIP 5
      {
        id: 'sec-2-protip-5',
        title: 'El Tono del Emisor',
        introduccion: 'El tono revela la actitud emocional o intelectual del autor hacia el tema que está tratando. Puede ser irónico, crítico, reflexivo, objetivo, entusiasta, pesimista, etc.',
        datos_claves: [
          'Fíjate en los <b>adjetivos</b> que usa el autor. No es lo mismo decir "esta política" que "esta nefasta política".',
          'Identificar el tono te ayuda muchísimo a entender la intención global del texto.'
        ],
        isProTip: true,
        test: { id: 'test-2-protip-5', contexto_base: null, preguntas: [] }
      },
      // LECCION NUEVA: Actitud y Tono
      {
        id: 'sec-2-9',
        title: 'Actitud y Tono',
        introduccion: 'Aprenderemos a descifrar la perspectiva subjetiva del autor.',
        guia_titulo: 'Interpretando la Actitud',
        guia_contenido: 'Aunque un texto parezca objetivo, las palabras elegidas (adjetivación) revelan la postura del emisor. Si un autor describe un proyecto como "ambicioso", tiene un tono esperanzador; si lo describe como "desmesurado", tiene un tono crítico.',
        datos_claves: [
          'Tono Crítico: Enjuicia negativamente.',
          'Tono Irónico: Dice lo contrario de lo que piensa para burlarse.',
          'Tono Objetivo: Ausencia de marcas valorativas (típico en noticias).'
        ],
        tags: ['tono', 'actitud', 'emisor'],
        test: {
          id: 'test-2-9',
          contexto_base: 'Es francamente "maravilloso" ver cómo las autoridades han pavimentado la misma calle tres veces este año, mientras el hospital sigue sin insumos básicos. ¡Qué gran gestión de nuestros recursos!',
          preguntas: [
            {
              id: 2006,
              enunciado: '¿Cuál es el tono predominante del emisor en el fragmento?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Elogioso', B: 'Objetivo', C: 'Irónico', D: 'Pesimista' },
              respuesta_correcta: 'C',
              feedback_acierto: 'Correcto. El uso de comillas en "maravilloso" y la exclamación final son claros marcadores de ironía (dice algo positivo pero en realidad está criticando).',
              feedback_error: 'Incorrecto. Lee el contraste entre la calle pavimentada y el hospital sin insumos. Las alabanzas ("maravilloso", "gran gestión") no son sinceras.'
            }
          ]
        }
      },
      // PRACTICA RAPIDA 6
      {
        id: 'sec-2-prac-6',
        title: 'Identificando el Tono',
        introduccion: 'Práctica rápida de identificación de tonos.',
        isPractice: true,
        test: {
          id: 'test-2-prac-6',
          contexto_base: 'Tal vez, si nos detuviéramos un momento a mirar el cielo estrellado, recordaríamos lo pequeños que somos frente a la inmensidad del cosmos, y nuestras preocupaciones diarias perderían algo de su abrumador peso.',
          preguntas: [
            {
              id: 2007,
              enunciado: '¿Qué tono adopta el emisor?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Informativo', B: 'Reflexivo', C: 'Sarcástico', D: 'Agresivo' },
              respuesta_correcta: 'B',
              feedback_acierto: 'Correcto. Invita a la meditación y al pensamiento profundo sobre nuestra existencia.',
              feedback_error: 'Incorrecto. No está entregando datos crudos ni atacando a nadie, está invitando a pensar.'
            }
          ]
        }
      },
      // LECCION: Practica Final de Tono (Join)
      {
        id: 'sec-2-10-join',
        title: 'Práctica: Tono y Perspectiva',
        introduccion: 'Pon a prueba tu habilidad para detectar tonos e intenciones.',
        isPractice: true,
        tags: ['practica'],
        test: {
          id: 'test-2-10-join',
          contexto_base: 'El informe detalla que las emisiones de carbono se redujeron un 2% este trimestre. Sin embargo, este descenso es insignificante si consideramos que la meta era un 15%. La complacencia de los directivos es alarmante.',
          preguntas: [
            {
              id: 2008,
              enunciado: '¿Cómo cambia el tono del emisor a lo largo del texto?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'De objetivo a crítico', B: 'De crítico a esperanzador', C: 'De irónico a pesimista', D: 'De entusiasta a apático' },
              respuesta_correcta: 'A',
              feedback_acierto: 'Exacto. Empieza con un dato objetivo ("se redujeron un 2%") y termina emitiendo un juicio ("insignificante", "complacencia alarmante").',
              feedback_error: 'Incorrecto. Observa la diferencia entre la primera oración (un dato crudo) y las últimas (juicios de valor).'
            }
          ]
        }
      },
      // PRO TIP 6
      {
        id: 'sec-2-protip-6',
        title: 'Perspectiva del Autor',
        introduccion: 'Cuando identifiques el tono, pregúntate inmediatamente: ¿Desde qué posición me habla el autor? ¿Es un experto, un ciudadano indignado, un poeta, un científico?',
        datos_claves: [
          'El contexto y el vocabulario te ayudarán a construir el perfil de quién escribe.',
          'Esta perspectiva influye directamente en las conclusiones que quiere que saques del texto.'
        ],
        isProTip: true,
        test: { id: 'test-2-protip-6', contexto_base: null, preguntas: [] }
      },
      // PRACTICA RAPIDA 7
      {
        id: 'sec-2-prac-7',
        title: 'Perspectiva y Subjetividad',
        introduccion: 'Última práctica antes del jefe final.',
        isPractice: true,
        test: {
          id: 'test-2-prac-7',
          contexto_base: 'Como vecinos del sector histórico, exigimos que se detenga la construcción de la nueva torre habitacional. No solo destruirá la estética del barrio, sino que colapsará las alcantarillas.',
          preguntas: [
            {
              id: 2009,
              enunciado: '¿Desde qué perspectiva habla el emisor?',
              tipo_alternativas: 'texto',
              alternativas: { A: 'Desde la de un arquitecto experto', B: 'Desde la de un residente afectado', C: 'Desde la de un funcionario municipal', D: 'Desde la de un historiador objetivo' },
              respuesta_correcta: 'B',
              feedback_acierto: 'Correcto. El uso de "Como vecinos del sector" y las preocupaciones (estética, alcantarillas) marcan la perspectiva de un residente.',
              feedback_error: 'Incorrecto. Lee la primera frase del texto: "Como vecinos...".'
            }
          ]
        }
      }
];