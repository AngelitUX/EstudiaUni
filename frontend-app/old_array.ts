

      // ── NODO GUÍA: QUÉ ES INTERPRETAR ──
      {
        id: 'sec-2-0-guia', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 1, order: 1, tags: ['subcapitulo:Introducción'],
        isSlideGuide: true,
        title: '¿Qué es Interpretar?',
        introduccion: 'Interpretar va más allá de lo que el texto dice literalmente. Debes comprender qué quiso decir el autor, para qué sirve cada parte del texto y cuál es su postura ante el tema.',
        guia_titulo: 'Localizar vs Interpretar',
        guia_contenido: `<p><strong>Localizar</strong> = encontrar la información tal como aparece escrita en el texto.</p><p><strong>Interpretar</strong> = comprender el significado implícito, las relaciones entre ideas y la intención del autor. Exige ir un paso más allá.</p><p>En la PAES, Interpretar representa cerca del <strong>35% de las preguntas</strong> y es la habilidad que más diferencia los puntajes altos de los puntajes medios.</p><ul><li>En <strong>textos informativos</strong>: busca la tesis, los conectores lógicos y la relación entre párrafos.</li><li>En <strong>textos narrativos</strong>: busca las motivaciones de los personajes, la atmósfera y el tema central.</li><li>La respuesta <strong>siempre</strong> debe justificarse con evidencia del propio texto.</li></ul>`,
        datos_claves: [
          'En textos informativos: busca la tesis, los conectores lógicos y la relación entre párrafos.',
          'En textos narrativos: busca las motivaciones de los personajes, la atmósfera y el tema central.',
          'La respuesta siempre debe justificarse con evidencia del propio texto.',
        ],
        test: {
          id: 'test-2-0-guia', seccionId: 'sec-2-0-guia',
          contexto_base: '«El hielo glaciar no miente. Cada capa es un año, y los gases atrapados dentro son la memoria exacta de la atmósfera de ese tiempo.»',
          preguntas: [
            { id: 200, enunciado: '¿Cuál es el propósito central de este breve fragmento?', alternativas: { A: 'Informar sobre el proceso físico de formación del hielo.', B: 'Argumentar que el hielo glaciar es una fuente confiable de información histórica.', C: 'Narrar cómo un científico estudia el hielo.', D: 'Describir la composición química del hielo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La expresión "el hielo no miente" y la metáfora de "memoria exacta" revelan que el autor busca persuadir al lector sobre la fiabilidad del hielo como fuente histórica.', feedback_error: 'Fíjate en el tono: "no miente", "memoria exacta". Estas son expresiones valorativas que revelan la intención del autor.' },
          ]
        }
      },

      // ── RAMA INFORMATIVA NIVEL 1: INFERENCIAS ──
      {
        id: 'sec-2-1-inf', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 2, order: 2, tags: ['subcapitulo:Textos Informativos'],
        title: 'Inferencias · Informativos',
        introduccion: 'En los textos informativos, muchas ideas no se dicen directamente: se dan a entender. Una inferencia válida se desprende lógicamente del texto sin distorsionar su sentido.',
        datos_claves: [
          'Una inferencia NUNCA inventa información: se basa en lo que el texto SÍ dice.',
          'Descarta las opciones que exageran o agregan datos que el texto no sugiere.',
          'Los conectores como "por lo tanto", "en consecuencia" y "sin embargo" son señales de inferencias fuertes.',
          'Pregúntate: ¿podría deducir esto sin leer el texto? Si la respuesta es sí, probablemente es inválida.',
        ],
        test: {
          id: 'test-2-1-inf', seccionId: 'sec-2-1-inf',
          contexto_base: 'El plástico de un solo uso tarda entre 400 y 1.000 años en descomponerse en el medio ambiente. Sin embargo, el 91% de los plásticos generados en el mundo nunca ha sido reciclado. Solo en el año 2021 se produjeron 380 millones de toneladas métricas de plástico a nivel global, cifra que representa más del doble de lo producido en el año 2000. Según un informe de la ONU, si las tendencias actuales continúan, para el año 2050 habrá en los océanos más plástico que peces en términos de peso. Los investigadores advierten que el microplástico ya ha sido detectado en la sangre humana, en el agua potable de la mayoría de los países y en el interior de organismos que habitan a más de 10.000 metros de profundidad en las fosas oceánicas.',
          preguntas: [
            { id: 201, enunciado: '¿Cuál de las siguientes afirmaciones se puede INFERIR a partir del texto?', alternativas: { A: 'La producción de plástico disminuyó después del año 2000.', B: 'El reciclaje es suficiente para resolver el problema del plástico si se aplica correctamente.', C: 'El problema de la contaminación por plástico tiene un alcance global y afecta ecosistemas remotos.', D: 'Los océanos ya tienen más plástico que peces en la actualidad.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! El texto menciona plástico en fosas oceánicas a 10.000 metros, en sangre humana y en océanos de todo el mundo, lo que permite inferir un alcance global y remoto.', feedback_error: 'La opción D exagera: el texto dice que ESO PODRÍA pasar en 2050 si las tendencias continúan, no que ya ocurrió. La inferencia válida debe respetar lo que el texto dice.' },
            { id: 202, enunciado: '¿Qué se puede concluir sobre la producción de plástico entre 2000 y 2021?', alternativas: { A: 'Se redujo a la mitad.', B: 'Se duplicó con creces.', C: 'Se mantuvo estable.', D: 'Se triplicó.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! El texto dice que la cifra de 2021 "representa más del doble de lo producido en el año 2000". Eso significa que se duplicó (o superó el doble).', feedback_error: 'Busca en el texto la comparación específica entre el año 2000 y 2021. La respuesta está dicha casi literalmente.' },
            { id: 203, enunciado: 'Según el texto, ¿qué implica el hecho de que el microplástico se haya detectado en la sangre humana?', alternativas: { A: 'Que el plástico ahora forma parte del ciclo sanguíneo de forma natural.', B: 'Que la contaminación por plástico ha alcanzado el interior del organismo humano.', C: 'Que todos los seres humanos del mundo están enfermos por culpa del plástico.', D: 'Que el microplástico es inofensivo para la salud.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente inferencia! La detección en sangre implica que la contaminación ya está dentro del cuerpo humano. El texto no dice que cause enfermedades, solo que fue detectado.', feedback_error: 'La clave es no exagerar: el texto dice "detectado", no que cause enfermedades. ¿Qué conclusión directa se puede sacar de que algo extraño aparezca en la sangre?' },
            { id: 204, enunciado: '¿Cuál es el propósito principal del texto?', alternativas: { A: 'Describir el proceso de descomposición del plástico.', B: 'Comparar la producción de plástico de distintos países.', C: 'Advertir sobre la magnitud y gravedad del problema de la contaminación plástica.', D: 'Proponer soluciones para reducir el consumo de plástico.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! El texto no propone soluciones ni compara países: acumula datos alarmantes para transmitir la gravedad del problema. Su propósito es advertir.', feedback_error: 'Ningún párrafo propone qué hacer. El texto solo presenta datos. ¿Con qué propósito se acumulan datos alarmantes uno tras otro?' },
          ]
        }
      },

      // ── RAMA NARRATIVA NIVEL 1: INFERENCIAS ──
      {
        id: 'sec-2-1-nar', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 2, order: 3, tags: ['subcapitulo:Textos Narrativos'],
        title: 'Inferencias · Narrativos',
        introduccion: 'En los textos narrativos, las inferencias revelan lo que el personaje siente, piensa o busca sin que el narrador lo diga directamente. Debes leer entre líneas.',
        datos_claves: [
          'Las acciones y palabras de un personaje revelan su estado emocional sin necesidad de que se declare explícitamente.',
          'Los detalles del ambiente (clima, luz, color) suelen reflejar el estado interno del narrador o personaje.',
          'Una inferencia literaria válida tiene respaldo en el texto, aunque sea indirecto.',
          'El silencio de un personaje o lo que elige no decir también es información significativa.',
        ],
        test: {
          id: 'test-2-1-nar', seccionId: 'sec-2-1-nar',
          contexto_base: 'Cuando Irene llegó a casa de su madre, encontró el jardín sin podar por primera vez en veinte años. La puerta estaba entreabierta y una taza con café a medio tomar descansaba sobre la mesa del comedor, fría ya. Llamó en voz alta, pero el silencio le respondió con el mismo peso que una piedra. Recorrió cada habitación sin prisa, como quien no quiere encontrar lo que busca, hasta que se detuvo frente al sillón favorito de su madre, aún hundido por la costumbre de ese cuerpo que ya no estaría.',
          preguntas: [
            { id: 205, enunciado: '¿Qué se puede inferir sobre la situación de la madre de Irene?', alternativas: { A: 'Está de viaje y volverá pronto.', B: 'Ha fallecido o ha desaparecido de manera abrupta.', C: 'Está enojada con Irene y no quiere verla.', D: 'Está durmiendo en otra habitación de la casa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Los indicios se acumulan: jardín sin podar, puerta entreabierta, café frío y especialmente "ese cuerpo que ya no estaría" permiten inferir que la madre ya no está, probablemente falleció.', feedback_error: 'Lee el último detalle: "ese cuerpo que ya no estaría". Combínalo con el café frío y el jardín abandonado.' },
            { id: 206, enunciado: '¿Cuál es el estado emocional de Irene mientras recorre la casa?', alternativas: { A: 'Enojo y frustración.', B: 'Indiferencia y calma.', C: 'Temor y resistencia ante lo que puede encontrar.', D: 'Alegría y expectativa.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La frase "como quien no quiere encontrar lo que busca" revela que Irene teme lo que puede descubrir.', feedback_error: 'La clave está en la frase "como quien no quiere encontrar lo que busca". ¿Qué emoción describe esa actitud de ir despacio, aplazando el descubrimiento?' },
            { id: 207, enunciado: '¿Para qué sirve el detalle del jardín sin podar en el texto?', alternativas: { A: 'Para describir el estilo de vida de la madre.', B: 'Para mostrar que la madre era descuidada por naturaleza.', C: 'Para señalar que algo fuera de lo normal ha ocurrido, ya que la madre siempre lo mantuvo cuidado.', D: 'Para indicar que el texto transcurre en invierno.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente análisis! "Sin podar por primera vez en veinte años" rompe la rutina establecida, señalando una ruptura abrupta en la vida normal de la madre.', feedback_error: 'El texto dice "por primera vez en veinte años". No es descuido habitual, sino una ruptura de la norma. ¿Qué función narrativa tiene esa ruptura?' },
            { id: 208, enunciado: '¿Qué transmite la comparación "el silencio le respondió con el mismo peso que una piedra"?', alternativas: { A: 'Que la casa era muy pequeña y sus paredes eran gruesas.', B: 'Que el silencio era agradable y reparador para Irene.', C: 'Que la ausencia de respuesta tiene una presencia física y opresiva para Irene.', D: 'Que nadie vivía en la casa hacía mucho tiempo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! La comparación convierte el silencio en algo tangible y pesado. Transmite la sensación opresiva de la ausencia.', feedback_error: 'Es una comparación (símil). El silencio "responde" y tiene "peso como una piedra". ¿Qué sensación produce algo que aplasta?' },
          ]
        }
      },

      // ── RAMA INFORMATIVA NIVEL 2: RELACIONES LÓGICAS ──
      {
        id: 'sec-2-2-inf', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 3, order: 4, tags: ['subcapitulo:Textos Informativos'],
        title: 'Relaciones entre Ideas · Informativos',
        introduccion: 'En un texto bien estructurado, cada párrafo cumple una función respecto a los demás: ejemplifica, contrasta, amplía, causa o concluye. Identificar estas relaciones es fundamental para la PAES.',
        datos_claves: [
          'Causa-Efecto: "por esta razón", "en consecuencia", "lo que produjo".',
          'Contraste: "sin embargo", "a pesar de", "por el contrario", "aunque".',
          'Ejemplificación: "por ejemplo", "como es el caso de", "esto se observa en".',
          'Generalización-Especificación: de una afirmación general a un caso concreto.',
          'La pregunta clave: ¿qué función lógica tiene este párrafo respecto al anterior?',
        ],
        test: {
          id: 'test-2-2-inf', seccionId: 'sec-2-2-inf',
          contexto_base: 'La revolución industrial transformó radicalmente las estructuras económicas y sociales de Europa durante el siglo XIX. Las ciudades crecieron de forma acelerada a medida que los trabajadores rurales migraban en busca de empleo en las fábricas. Sin embargo, este crecimiento no trajo aparejado un aumento equivalente en las condiciones de vida: los barrios obreros se caracterizaban por el hacinamiento, la falta de saneamiento y jornadas laborales de hasta dieciséis horas diarias. Como consecuencia, comenzaron a surgir los primeros movimientos obreros organizados, que reclamaban mejores salarios, reducción de la jornada laboral y protección para mujeres y niños trabajadores. Estos movimientos, aunque reprimidos en sus inicios, sentarían las bases de los derechos laborales modernos que hoy damos por sentados.',
          preguntas: [
            { id: 209, enunciado: '¿Qué relación existe entre el tercer y cuarto párrafo del texto?', alternativas: { A: 'El cuarto párrafo contradice la información presentada en el tercero.', B: 'El cuarto párrafo es la consecuencia de lo descrito en el tercero.', C: 'El cuarto párrafo ejemplifica el crecimiento de las ciudades.', D: 'El cuarto párrafo presenta una causa del fenómeno descrito en el tercero.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El conector "Como consecuencia" establece explícitamente una relación causa-efecto: las malas condiciones (tercero) llevaron al surgimiento de movimientos obreros (cuarto).', feedback_error: 'Observa el conector al inicio del cuarto párrafo: "Como consecuencia". Ese conector define la relación lógica entre ambos párrafos.' },
            { id: 210, enunciado: '¿Cuál es la función del conector "Sin embargo" en el texto?', alternativas: { A: 'Introduce un ejemplo del crecimiento industrial.', B: 'Presenta una conclusión lógica del argumento anterior.', C: 'Establece un contraste entre el crecimiento urbano y las condiciones de vida.', D: 'Resume la información del párrafo anterior.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! "Sin embargo" siempre introduce un contraste. Aquí contrasta el crecimiento de las ciudades con las malas condiciones de vida de los obreros.', feedback_error: '"Sin embargo" es un conector adversativo: introduce algo que contradice o matiza lo anterior. ¿Qué idea contradice en este contexto?' },
            { id: 211, enunciado: '¿Cuál es la idea principal de todo el texto?', alternativas: { A: 'La revolución industrial mejoró las condiciones de vida de todos los trabajadores europeos.', B: 'La industrialización generó crecimiento urbano, pero también condiciones que dieron origen a los movimientos obreros y los derechos laborales actuales.', C: 'Los movimientos obreros surgieron como resultado de la migración del campo a la ciudad.', D: 'La falta de saneamiento fue el principal problema de las ciudades industriales del siglo XIX.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! La idea principal integra toda la cadena causal: industrialización → crecimiento urbano → malas condiciones → movimientos obreros → derechos laborales.', feedback_error: 'La idea principal debe cubrir TODO el texto. ¿Cuál abarca el argumento completo?' },
            { id: 212, enunciado: '¿Qué función cumple el último párrafo respecto al texto completo?', alternativas: { A: 'Introduce nuevos datos sobre la situación actual de los derechos laborales.', B: 'Presenta una consecuencia a largo plazo de los movimientos obreros, cerrando el arco argumentativo del texto.', C: 'Contradice la información presentada en los párrafos anteriores.', D: 'Ejemplifica cómo funciona un movimiento obrero moderno.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante! El último párrafo cierra el arco del texto: desde la revolución industrial hasta los derechos que "hoy damos por sentados".', feedback_error: 'El último párrafo menciona "derechos laborales modernos que hoy damos por sentados". ¿Eso introduce algo nuevo o concluye algo anterior?' },
          ]
        }
      },

      // ── RAMA NARRATIVA NIVEL 2: RELACIONES EN EL RELATO ──
      {
        id: 'sec-2-2-nar', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 3, order: 5, tags: ['subcapitulo:Textos Narrativos'],
        title: 'Relaciones entre Ideas · Narrativos',
        introduccion: 'En los textos narrativos, las relaciones entre ideas se expresan a través de la estructura del relato: las acciones tienen causas, el ambiente afecta a los personajes, y los conflictos se encadenan.',
        datos_claves: [
          'En narrativa, la causa de una acción casi siempre está en la historia previa del personaje.',
          'El ambiente (espacio, clima, época) puede ser causa de comportamientos o reflejo del estado emocional.',
          'Un conflicto desencadena otros conflictos: identifica la cadena de causa-efecto en la trama.',
          'La resolución (o falta de ella) también es una consecuencia de todo lo que vino antes.',
        ],
        test: {
          id: 'test-2-2-nar', seccionId: 'sec-2-2-nar',
          contexto_base: 'Después de doce años de silencio, Luis escribió una carta. La dejó sobre la mesa de la cocina, con su nombre escrito en el sobre con la letra de siempre, esa que su padre le había enseñado trazando cada letra con una regla. Había pensado en llamar por teléfono, pero la voz lo traicionaría. Había pensado en ir en persona, pero la vergüenza lo detuvo en la puerta tres veces distintas. La carta era lo más honesto que podía dar: palabras elegidas con tiempo, sin la torpeza del momento. No pedía perdón. Solo explicaba por qué se había ido.',
          preguntas: [
            { id: 213, enunciado: '¿Por qué Luis eligió escribir una carta en lugar de llamar o ir en persona?', alternativas: { A: 'Porque no tenía el número de teléfono de su padre.', B: 'Porque una carta le permitía expresarse con mayor control y honestidad, sin quedar expuesto por su voz o su vergüenza.', C: 'Porque le habían prohibido el contacto directo.', D: 'Porque quería que el mensaje llegara más rápido.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El texto lo explica directamente: la voz lo traicionaría (llamar), la vergüenza lo detuvo (ir en persona), y la carta eran "palabras elegidas con tiempo, sin la torpeza del momento".', feedback_error: 'El texto explica las tres razones claramente. ¿Por qué descartó cada opción y qué ventaja le daba la carta?' },
            { id: 214, enunciado: '¿Qué relación existe entre el detalle de la letra enseñada con regla y el resto del texto?', alternativas: { A: 'Muestra que Luis fue un niño muy desordenado.', B: 'Establece un vínculo afectivo entre Luis y su padre, que contrasta con el distanciamiento actual.', C: 'Indica que el padre de Luis era muy estricto y autoritario.', D: 'Sirve solo para describir el estilo de escritura de Luis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente análisis! La letra enseñada por el padre es un recuerdo afectivo que conecta a Luis con él, contraste poderoso con los "doce años de silencio".', feedback_error: '¿Por qué el narrador menciona quién le enseñó esa letra? No es un dato casual. Relaciona ese recuerdo con el contexto de la carta.' },
            { id: 215, enunciado: '¿Cuál es el propósito de la carta que escribe Luis?', alternativas: { A: 'Pedir disculpas por haberse ido.', B: 'Anunciar que regresará pronto.', C: 'Explicar las razones por las que se alejó, sin pedir perdón.', D: 'Reclamarle algo a su padre.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! El texto lo indica explícitamente: "No pedía perdón. Solo explicaba por qué se había ido."', feedback_error: 'Las últimas dos oraciones del texto responden directamente esta pregunta.' },
            { id: 216, enunciado: '¿Qué sugieren los "doce años de silencio" sobre la relación entre Luis y su destinatario?', alternativas: { A: 'Que Luis estuvo de viaje por trabajo durante ese tiempo.', B: 'Que la relación se interrumpió de manera prolongada y significativa, con una razón importante detrás.', C: 'Que el destinatario nunca quiso retomar el contacto.', D: 'Que Luis perdió la memoria y no recordaba a su familiar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Doce años no es un alejamiento casual. Su duración y el hecho de que Luis necesite una carta para "explicar por qué se fue" implican una ruptura significativa.', feedback_error: '¿Por qué alguien necesita explicar por escrito una ausencia de 12 años? Eso implica que la separación tuvo una razón poderosa.' },
          ]
        }
      },

      // ── PRÁCTICA CONJUNTA: CONECTORES LÓGICOS ──
      {
        id: 'sec-2-3-join', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 4, order: 6, tags: ['subcapitulo:Práctica'],
        title: '🧩 Práctica: Conectores Lógicos',
        introduccion: 'Los conectores lógicos son el "pegamento" del texto: revelan cómo las ideas se relacionan entre sí. Dominarlos te permite interpretar cualquier tipo de texto con mucha mayor precisión.',
        datos_claves: [
          'CAUSA: porque, ya que, dado que, puesto que, pues.',
          'CONSECUENCIA: por lo tanto, en consecuencia, de modo que, por ende.',
          'CONTRASTE: sin embargo, a pesar de, aunque, no obstante, pero.',
          'ADICIÓN: además, asimismo, también, por otra parte.',
          'EJEMPLIFICACIÓN: por ejemplo, como es el caso de, tal como.',
          'CONCLUSIÓN: en conclusión, en resumen, finalmente, en definitiva.',
        ],
        test: {
          id: 'test-2-3-join', seccionId: 'sec-2-3-join',
          contexto_base: 'Los conectores lógicos son fundamentales para entender cómo se relacionan las ideas en un texto. A continuación, responde las preguntas basándote en el uso correcto de estos conectores.',
          preguntas: [
            { id: 225, enunciado: '«El alumno estudió toda la noche; _________, reprobó el examen.» ¿Qué conector establece correctamente la relación entre las ideas?', alternativas: { A: 'porque', B: 'por lo tanto', C: 'además', D: 'sin embargo' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto! "Sin embargo" introduce un contraste: esperaríamos que el estudio resultara en aprobación, pero ocurrió lo contrario.', feedback_error: 'Estudiar mucho y reprobar es una situación contradictoria. ¿Qué tipo de conector marca una contradicción o giro inesperado?' },
            { id: 226, enunciado: '«La deforestación elimina el hábitat de miles de especies; _________, muchas están en peligro de extinción.» ¿Qué conector es más apropiado?', alternativas: { A: 'no obstante', B: 'por consiguiente', C: 'aunque', D: 'por ejemplo' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! "Por consiguiente" indica que el peligro de extinción es la consecuencia directa de la deforestación. Es una relación causa-efecto.', feedback_error: 'La segunda oración es el resultado lógico de la primera. ¿Qué tipo de conector expresa que algo es consecuencia de lo anterior?' },
            { id: 227, enunciado: '«Los pingüinos son aves. _________, no pueden volar.» ¿Qué relación lógica se establece?', alternativas: { A: 'Causa: el hecho de ser aves es la causa de no volar.', B: 'Contraste: ser ave generalmente implica volar, pero los pingüinos son una excepción.', C: 'Conclusión: el no volar es la conclusión lógica de ser ave.', D: 'Adición: se agrega un dato más sobre los pingüinos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante! El conector adecuado sería "sin embargo", porque ser ave generalmente implica poder volar. Los pingüinos son una excepción que establece un contraste.', feedback_error: 'No volar no es lo "normal" en un ave: es la excepción. ¿Qué relación lógica se establece cuando algo contradice lo que esperamos?' },
            { id: 228, enunciado: '«Chile tiene una gran variedad de climas. _________, en el norte está el desierto de Atacama y en el sur, la Patagonia.» ¿Cuál conector completa la idea?', alternativas: { A: 'En consecuencia', B: 'Sin embargo', C: 'Por ejemplo', D: 'Puesto que' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La segunda parte entrega casos concretos que demuestran la variedad de climas. El conector de ejemplificación "por ejemplo" es el adecuado.', feedback_error: 'El Atacama y la Patagonia son casos específicos que ilustran la variedad de climas. ¿Qué conector introduce ejemplos concretos de una afirmación general?' },
          ]
        }
      },

      // ── RAMA INFORMATIVA NIVEL 3: IDEA PRINCIPAL Y SÍNTESIS ──
      {
        id: 'sec-2-4-inf', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 5, order: 7, tags: ['subcapitulo:Textos Informativos'],
        title: 'Idea Principal y Síntesis · Informativos',
        introduccion: 'Sintetizar consiste en identificar la idea central del texto o de un párrafo, separándola de los detalles de apoyo. Es una de las habilidades más evaluadas en la PAES.',
        datos_claves: [
          'La idea principal NO es el tema. La idea principal es la afirmación más importante del texto.',
          'Las ideas secundarias apoyan, ejemplifican o desarrollan la idea principal, pero no son la respuesta.',
          'Si puedes eliminar una idea sin que el texto pierda su argumento central, es secundaria.',
          'La opción incorrecta más frecuente es una idea que SÍ aparece en el texto pero solo es un detalle de apoyo.',
        ],
        test: {
          id: 'test-2-4-inf', seccionId: 'sec-2-4-inf',
          contexto_base: 'La Antártica es el continente más frío, más seco y más ventoso del planeta. Su capa de hielo almacena aproximadamente el 70% del agua dulce del mundo y su grosor promedio supera los 2.000 metros. Sin embargo, más allá de estos datos geográficos, la Antártica ocupa un lugar central en el estudio del cambio climático. Los núcleos de hielo extraídos de sus capas más profundas permiten a los científicos reconstruir el clima terrestre de hasta 800.000 años atrás, incluyendo concentraciones de gases de efecto invernadero, temperaturas y eventos volcánicos. Esta información es invaluable para comprender cómo el clima ha cambiado en el pasado y para construir modelos precisos que proyecten escenarios futuros. En este sentido, la pérdida acelerada de la masa de hielo antártico no es solo una pérdida geográfica: es una amenaza directa para nuestra capacidad de entender y anticipar el cambio climático.',
          preguntas: [
            { id: 217, enunciado: '¿Cuál es la idea principal del texto?', alternativas: { A: 'La Antártica es el continente más frío y seco del planeta y alberga el 70% del agua dulce mundial.', B: 'Los núcleos de hielo antártico permiten reconstruir el clima de hasta 800.000 años atrás.', C: 'La Antártica es fundamental para el estudio del cambio climático y su pérdida de hielo representa una amenaza para dicho conocimiento.', D: 'El grosor promedio de la capa de hielo antártico supera los 2.000 metros.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! Las opciones A y D son datos de apoyo. La B es un detalle específico. Solo C sintetiza el argumento completo del texto: el valor de la Antártica para el estudio climático y la amenaza de su pérdida.', feedback_error: 'La idea principal debe cubrir TODO el texto. Las opciones A, B y D son verdaderas pero solo aparecen en una parte. ¿Cuál cubre el argumento completo?' },
            { id: 218, enunciado: '¿Cuál de las siguientes ideas es SECUNDARIA respecto a la idea principal?', alternativas: { A: 'La Antártica es clave para entender el cambio climático.', B: 'La pérdida del hielo antártico amenaza el conocimiento científico.', C: 'El grosor promedio de la capa de hielo es de 2.000 metros.', D: 'Los núcleos de hielo revelan datos climáticos del pasado.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! El grosor es un dato geográfico de apoyo del primer párrafo. Si lo elimináramos, el texto conserva su argumento principal intacto.', feedback_error: 'Elimina mentalmente cada opción del texto. ¿Cuál puede quitarse sin debilitar el argumento del autor? Esa es la idea secundaria.' },
            { id: 219, enunciado: '¿Qué función cumple el primer párrafo respecto al resto del texto?', alternativas: { A: 'Presenta la conclusión del texto.', B: 'Describe los datos geográficos básicos de la Antártica, contextualizando su importancia antes de introducir el argumento central.', C: 'Contrasta la Antártica con otros continentes.', D: 'Resume el impacto del cambio climático en la Antártica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! El primer párrafo presenta datos geográficos generales, pero la frase "Sin embargo, más allá de estos datos" señala que lo que sigue es el argumento real. El primer párrafo contextualiza.', feedback_error: 'Fíjate en la frase "Sin embargo, más allá de estos datos geográficos...". Ese conector indica que los datos anteriores eran solo el contexto.' },
            { id: 220, enunciado: '¿Qué se puede concluir a partir de la última oración del texto?', alternativas: { A: 'La pérdida del hielo antártico es el principal causante del calentamiento global actual.', B: 'Sin la Antártica, sería imposible vivir en el planeta.', C: 'La desaparición del hielo antártico amenaza tanto datos científicos históricos como la capacidad de predecir escenarios climáticos futuros.', D: 'Los científicos ya saben todo lo necesario sobre el cambio climático gracias a los núcleos de hielo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! La última oración dice que perder el hielo es "una amenaza directa para nuestra capacidad de entender y anticipar el cambio climático". Eso implica tanto el conocimiento histórico como la proyección futura.', feedback_error: 'La última oración habla de "entender Y anticipar". ¿Cuál opción recoge ambas dimensiones?' },
          ]
        }
      },

      // ── RAMA NARRATIVA NIVEL 3: TEMA E IDEA CENTRAL ──
      {
        id: 'sec-2-4-nar', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 5, order: 8, tags: ['subcapitulo:Textos Narrativos'],
        title: 'Tema e Idea Central · Narrativos',
        introduccion: 'En los textos narrativos, el tema es el asunto del relato (la soledad, la memoria, la injusticia). La idea central es lo que el texto quiere DECIR sobre ese tema. Son cosas distintas.',
        datos_claves: [
          'El TEMA es un sustantivo o frase corta: "la pérdida", "la identidad", "la traición".',
          'La IDEA CENTRAL es la afirmación que el texto hace sobre ese tema: "la pérdida puede transformar nuestra forma de entender el mundo".',
          'El tema se extrae fácilmente. La idea central requiere interpretar el mensaje completo del texto.',
          'La idea central suele manifestarse en el clímax o en las últimas líneas del relato.',
        ],
        test: {
          id: 'test-2-4-nar', seccionId: 'sec-2-4-nar',
          contexto_base: 'El abuelo había guardado silencio toda la vida sobre la guerra. Sus manos, que en algún momento sujetaron un fusil, ahora construían pájaros de madera para sus nietos. Nunca contó nada, pero los pájaros eran cada vez más pequeños, más frágiles, como si cada uno contuviera un pedazo de algo que se estaba acabando. El día que murió, encontraron cientos de ellos en una caja bajo su cama. Cada uno tenía un nombre escrito en la base, con una fecha. Nadie supo nunca qué significaban. Nadie preguntó a tiempo.',
          preguntas: [
            { id: 221, enunciado: '¿Cuál es el tema central de este relato?', alternativas: { A: 'La artesanía en madera como tradición familiar.', B: 'La guerra y sus consecuencias físicas en los soldados.', C: 'La memoria silenciada y lo que se pierde cuando nadie pregunta.', D: 'La relación entre abuelos y nietos en tiempos modernos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! El relato gira en torno al silencio del abuelo sobre su pasado y la imposibilidad de recuperarlo después de su muerte. "Nadie preguntó a tiempo" sintetiza la pérdida de la memoria.', feedback_error: 'Los pájaros y la guerra son detalles. ¿Qué es lo que el texto lamenta? ¿Qué se perdió cuando el abuelo murió?' },
            { id: 222, enunciado: '¿Qué representan los pájaros de madera en el relato?', alternativas: { A: 'Son un simple pasatiempo del abuelo en su vejez.', B: 'Son metáforas de los recuerdos y las personas que el abuelo cargó en silencio durante toda su vida.', C: 'Son juguetes que el abuelo fabricaba para vender.', D: 'Representan la libertad que el abuelo nunca tuvo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante! Cada pájaro tiene nombre y fecha. Son demasiado numerosos y personales para ser un pasatiempo casual. Representan memorias cargadas en silencio.', feedback_error: 'Los pájaros tienen nombre y fecha en la base. Hay cientos de ellos. ¿Puede un simple pasatiempo generar algo así?' },
            { id: 223, enunciado: '¿Cuál es la idea central que transmite el relato?', alternativas: { A: 'La guerra destruye la capacidad de comunicación de los combatientes.', B: 'Los recuerdos traumáticos se expresan de forma indirecta y se pierden cuando nadie hace las preguntas correctas a tiempo.', C: 'Los abuelos siempre guardan secretos de sus familias.', D: 'La artesanía es una forma de superar el trauma de la guerra.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! La idea central combina el trauma expresado de forma indirecta (los pájaros), el silencio (nunca contó nada) y la pérdida irrecuperable ("Nadie preguntó a tiempo").', feedback_error: 'La idea central debe integrar: el silencio del abuelo, los pájaros como expresión indirecta y la frase final. ¿Qué opción los une a todos?' },
            { id: 224, enunciado: '¿Cuál es el efecto de la última oración "Nadie preguntó a tiempo"?', alternativas: { A: 'Critica directamente a los familiares del abuelo por ser descuidados.', B: 'Introduce una moraleja explícita sobre la importancia de hablar con los ancianos.', C: 'Genera una sensación de pérdida irreparable y cierra el relato con un lamento implícito.', D: 'Sugiere que hay una continuación de la historia en otro texto.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! La última oración no culpa ni moraliza: lamenta. El uso de "a tiempo" implica que ya es demasiado tarde, generando una sensación de pérdida definitiva.', feedback_error: 'La oración no culpa ("nadie" es neutral). Es un cierre. ¿Qué sentimiento provoca saber que algo importante ya no podrá recuperarse?' },
          ]
        }
      },

      // ── PRÁCTICA CONJUNTA: VOCABULARIO EN CONTEXTO ──
      {
        id: 'sec-2-5-join', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 6, order: 9, tags: ['subcapitulo:Práctica'],
        title: '🧩 Práctica: Vocabulario en Contexto',
        introduccion: 'El vocabulario en contexto consiste en determinar el significado de una palabra según cómo se usa en el texto, no su definición de diccionario. Es una de las preguntas más frecuentes en la PAES.',
        datos_claves: [
          'Nunca elijas la definición de diccionario sin antes verificar que tiene sentido EN ESE contexto específico.',
          'Sustituye mentalmente la palabra por cada alternativa y elige la que mantiene el sentido del texto.',
          'Las palabras polisémicas (varios significados) son las más difíciles: "capital", "banco", "pata", "cabo".',
          'El contexto inmediato (la oración) y el contexto amplio (el párrafo) determinan el significado.',
        ],
        test: {
          id: 'test-2-5-join', seccionId: 'sec-2-5-join',
          contexto_base: 'Determina el significado preciso de la palabra o expresión en MAYÚSCULAS según cómo se usa en cada fragmento.',
          preguntas: [
            { id: 237, enunciado: '«El discurso del presidente fue LAPIDARIO: en tres frases, terminó con cualquier posibilidad de negociación.» El término "lapidario" significa en este contexto:', alternativas: { A: 'Relacionado con el trabajo de las piedras preciosas.', B: 'Breve, definitivo y contundente, sin dejar lugar a réplica.', C: 'Relacionado con los epitafios o inscripciones funerarias.', D: 'Lento y pesado como el movimiento de una piedra.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Aunque "lapidario" viene de "lápida", en este contexto describe un discurso definitivo y contundente que "terminó con cualquier posibilidad de negociación".', feedback_error: 'Sustituye la palabra por cada alternativa. ¿Cuál tiene sentido si el discurso "terminó con cualquier posibilidad" en tres frases?' },
            { id: 238, enunciado: '«La empresa tomó CARTAS EN EL ASUNTO cuando el problema se hizo público.» Esta expresión significa:', alternativas: { A: 'La empresa envió comunicados escritos a sus clientes.', B: 'La empresa decidió intervenir y tomar acción frente al problema.', C: 'La empresa contrató a un equipo de abogados.', D: 'La empresa redactó un informe sobre la situación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! "Tomar cartas en el asunto" es una expresión idiomática que significa intervenir activamente en algo. No tiene relación literal con cartas escritas.', feedback_error: '"Tomar cartas en el asunto" es idiomático: su significado no es literal. ¿Qué sugiere el contexto sobre la actitud de la empresa?' },
            { id: 239, enunciado: '«La arqueóloga encontró el CABO del hilo que les permitiría desenredar el misterio.» El término "cabo" se usa aquí con el significado de:', alternativas: { A: 'Un trozo o fragmento pequeño de algo.', B: 'Un rango militar menor.', C: 'Un accidente geográfico de la costa.', D: 'El extremo o punta de algo que permite continuar.' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto! En este contexto, "cabo" es el extremo de un hilo. La metáfora de "encontrar el cabo del hilo" significa encontrar el punto de partida para resolver algo complejo.', feedback_error: '"Cabo" tiene varios significados. Aquí está combinado con "hilo" y "desenredar el misterio". ¿Qué parte de un hilo te permite empezar a desenredarlo?' },
            { id: 240, enunciado: '«Después de meses de incertidumbre, la investigación científica ARROJÓ resultados sorprendentes.» La palabra "arrojó" significa aquí:', alternativas: { A: 'Tiró o lanzó algo con fuerza.', B: 'Demostró valentía en condiciones difíciles.', C: 'Produjo o reveló como resultado.', D: 'Desechó o eliminó información innecesaria.' }, respuesta_correcta: 'C', feedback_acierto: '¡Brillante! "Arrojar" en contextos científicos significa "producir como resultado" o "revelar". La investigación no lanzó nada físicamente: reveló resultados.', feedback_error: 'La investigación "arrojó resultados". Una investigación no puede lanzar nada físicamente. ¿Qué hace una investigación con sus resultados?' },
          ]
        }
      },
      // ── RAMA INFORMATIVA NIVEL 7: JERARQUÍA DE IDEAS ──
      {
        id: 'sec-2-6-inf', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 7, order: 10, tags: ['subcapitulo:Textos Informativos'],
        title: 'Jerarquía de Ideas · Informativos',
        introduccion: 'Identificar la jerarquía de ideas significa distinguir entre la información fundamental (idea principal) y la accesoria (ejemplos, detalles, explicaciones).',
        datos_claves: [
          'Identifica el orden de importancia: tesis > argumentos principales > ejemplos/datos.',
          'Las ideas accesorias pueden eliminarse sin alterar el mensaje fundamental del texto.',
          'Cuidado con las preguntas trampa que presentan una idea secundaria correcta como si fuera la principal.',
        ],
        test: {
          id: 'test-2-6-inf', seccionId: 'sec-2-6-inf',
          contexto_base: 'El uso intensivo de pantallas antes de dormir afecta negativamente la calidad del sueño humano. Esto se debe principalmente a que la luz azul emitida por dispositivos como teléfonos móviles, tabletas y computadoras inhibe la secreción de melatonina, la hormona responsable de regular el ciclo circadiano. Por ejemplo, un estudio reciente demostró que leer en un e-reader retroiluminado retrasa el inicio del sueño en un promedio de 20 minutos en comparación con leer un libro impreso. Por consiguiente, los especialistas recomiendan establecer un "toque de queda digital" al menos una hora antes de ir a la cama.',
          preguntas: [
            { id: 260, enunciado: 'En relación con la jerarquía del texto, ¿qué función cumple la mención del estudio sobre los e-readers?', alternativas: { A: 'Es la idea principal que busca advertir sobre el peligro de los e-readers.', B: 'Es una idea accesoria que sirve como ejemplo específico para ilustrar la idea fundamental.', C: 'Es la conclusión a la que llega el autor tras analizar la melatonina.', D: 'Es una tesis que se busca refutar con el "toque de queda digital".' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El estudio es solo un ejemplo (idea secundaria/accesoria) usado para apoyar la afirmación fundamental sobre cómo la luz azul inhibe la melatonina.', feedback_error: 'Fíjate que la oración empieza con "Por ejemplo". ¿Qué jerarquía tiene un ejemplo respecto a la idea central?' },
            { id: 261, enunciado: '¿Cuál de las siguientes corresponde a la información más importante (fundamental) del fragmento?', alternativas: { A: 'Leer en un e-reader retrasa el inicio del sueño en unos 20 minutos.', B: 'Los especialistas recomiendan un "toque de queda digital".', C: 'La luz azul de las pantallas altera la secreción de melatonina y, por tanto, afecta la calidad del sueño.', D: 'Los teléfonos móviles son los dispositivos que emiten más luz azul.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! La opción C resume la tesis principal y su causa directa. Las demás opciones son conclusiones derivadas, ejemplos o afirmaciones que ni siquiera están en el texto.', feedback_error: 'La información fundamental es aquella sin la cual el texto perdería su sentido principal. ¿De qué trata realmente todo el párrafo?' }
          ]
        }
      },

      // ── RAMA NARRATIVA NIVEL 7: JERARQUÍA DE IDEAS ──
      {
        id: 'sec-2-6-nar', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 7, order: 11, tags: ['subcapitulo:Textos Narrativos'],
        title: 'Jerarquía de Eventos · Narrativos',
        introduccion: 'En narrativa, jerarquizar implica separar los eventos clave (núcleos) que hacen avanzar la trama, de los eventos accesorios (catálisis) que solo sirven para describir, ambientar o retrasar la acción.',
        datos_claves: [
          'Eventos principales (Núcleos): Acciones fundamentales sin las cuales la historia no tiene sentido ni avanza.',
          'Eventos accesorios (Catálisis): Descripciones, pensamientos o acciones secundarias que enriquecen el relato.',
          'Al resumir un cuento, debes enfocarte únicamente en los eventos principales.',
        ],
        test: {
          id: 'test-2-6-nar', seccionId: 'sec-2-6-nar',
          contexto_base: 'Lucía abrió la vieja puerta de roble, que chirrió pesadamente, levantando una nube de polvo iluminada por el sol de la tarde. En la pared del fondo, colgaban los tres retratos descoloridos de sus ancestros. Sin embargo, no prestó atención a nada de eso; sus ojos se fijaron de inmediato en la pequeña caja fuerte incrustada bajo el escritorio. Sabía que allí dentro encontraría, por fin, el testamento que probaría la traición de su hermano. Caminó con paso firme, ignorando el crujido de las tablas del suelo, e introdujo la combinación que había memorizado.',
          preguntas: [
            { id: 262, enunciado: '¿Cuál de los siguientes es un evento accesorio en el relato?', alternativas: { A: 'Lucía entró a la habitación abriendo la puerta.', B: 'La puerta levantó una nube de polvo iluminada por el sol.', C: 'Lucía se enfocó en la caja fuerte.', D: 'Lucía introdujo la combinación de la caja.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El polvo iluminado por el sol es una descripción ambiental. Si la omites, la historia principal (Lucía entrando a buscar el testamento) sigue avanzando igual.', feedback_error: 'Un evento accesorio es aquel que puede eliminarse sin que la trama pierda su sentido principal. ¿Cuál de esas opciones es puramente descriptiva?' },
            { id: 263, enunciado: '¿Qué información es la MÁS importante (núcleo) para entender las acciones del personaje?', alternativas: { A: 'La antigüedad de los retratos y el ruido de la puerta.', B: 'La búsqueda del testamento para probar una traición.', C: 'El sonido que hacen las tablas del suelo al caminar.', D: 'El horario en el que se desarrolla la acción (la tarde).' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! El motivo que impulsa toda la escena y la trama es probar la traición de su hermano. Esa es la información jerárquicamente fundamental.', feedback_error: '¿Por qué Lucía está en esa habitación? ¿Qué busca? Esa motivación es el núcleo de la escena.' }
          ]
        }
      },

      // ── RAMA INFORMATIVA NIVEL 8: FUNCIÓN DE ELEMENTOS ──
      {
        id: 'sec-2-7-inf', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 8, order: 12, tags: ['subcapitulo:Textos Informativos'],
        title: 'Función de Citas y Ejemplos · Informativos',
        introduccion: 'Interpretar implica reconocer POR QUÉ el autor incluye un elemento textual específico. Las citas, ejemplos, cifras o analogías siempre tienen un propósito.',
        datos_claves: [
          'Ejemplos: Sirven para aclarar, concretar o ilustrar una idea abstracta o general.',
          'Citas de expertos: Se usan como argumento de autoridad para dar respaldo y credibilidad a una tesis.',
          'Preguntas frecuentes: ¿Con qué propósito se menciona a X en el párrafo 3? ¿Para qué el autor cita a Y?',
        ],
        test: {
          id: 'test-2-7-inf', seccionId: 'sec-2-7-inf',
          contexto_base: 'El trabajo remoto ha demostrado aumentar la productividad en ciertos sectores, pero también genera problemas de desconexión emocional. La Dra. Laura Méndez, socióloga organizacional de la Universidad de Oxford, afirma: "Cuando perdemos los espacios intersticiales, como la charla casual en el pasillo o el café compartido, perdemos el tejido invisible que sostiene la innovación colaborativa". Así, lo que ganamos en eficiencia individual, muchas veces lo sacrificamos en creatividad colectiva.',
          preguntas: [
            { id: 264, enunciado: '¿Con qué propósito el autor cita a la Dra. Laura Méndez?', alternativas: { A: 'Para ejemplificar que el trabajo remoto aumenta la productividad.', B: 'Para respaldar con una opinión experta (autoridad) la idea de que el trabajo remoto genera problemas de desconexión emocional y afecta la creatividad.', C: 'Para demostrar que las universidades están en contra del trabajo remoto.', D: 'Para definir qué son los espacios intersticiales en la arquitectura de oficinas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! La cita actúa como un argumento de autoridad. La experta de Oxford avala la tesis del autor sobre la pérdida del tejido social y la creatividad.', feedback_error: 'Fíjate en quién es la Dra. Méndez (socióloga organizacional de Oxford). ¿Para qué suele un autor citar a un experto de una universidad prestigiosa?' },
            { id: 265, enunciado: '¿Qué función cumple la mención de "la charla casual en el pasillo o el café compartido"?', alternativas: { A: 'Describir las únicas actividades que se realizaban en las oficinas antiguas.', B: 'Ejemplificar de manera concreta a qué se refiere el concepto abstracto de "espacios intersticiales".', C: 'Argumentar que los empleados pierden demasiado tiempo tomando café.', D: 'Proponer una solución para los problemas del trabajo remoto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Son ejemplos concretos que ilustran un concepto más académico y abstracto ("espacios intersticiales"), haciéndolo comprensible.', feedback_error: 'Estos son ejemplos cotidianos puestos inmediatamente después del concepto "espacios intersticiales". ¿Qué hacen los ejemplos frente a un concepto complejo?' }
          ]
        }
      },

      // ── RAMA NARRATIVA NIVEL 8: FUNCIÓN DE ELEMENTOS ──
      {
        id: 'sec-2-7-nar', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 8, order: 13, tags: ['subcapitulo:Textos Narrativos'],
        title: 'Función de Figuras Retóricas · Narrativos',
        introduccion: 'En literatura, las palabras tienen un sentido connotativo (simbólico, figurado). Reconocer la función de metáforas, comparaciones y personificaciones es clave para interpretar el significado profundo del texto.',
        datos_claves: [
          'Metáfora: Traslada el significado de un concepto a otro para destacar una cualidad oculta (ej. "el invierno de su vida").',
          'Comparación: Establece un símil explícito usando nexos (como, cual, parece).',
          'Personificación: Atribuir cualidades humanas a objetos o elementos de la naturaleza para enfatizar una atmósfera.',
        ],
        test: {
          id: 'test-2-7-nar', seccionId: 'sec-2-7-nar',
          contexto_base: 'La ciudad devoraba a sus habitantes con una lentitud meticulosa. Sus calles, como venas endurecidas, palpitaban de asfalto y humo, mientras los rascacielos vigilaban la miseria desde las alturas con sus cientos de ojos de cristal ciegos.',
          preguntas: [
            { id: 266, enunciado: '¿Qué función cumple la expresión "La ciudad devoraba a sus habitantes"?', alternativas: { A: 'Indicar literalmente que existía canibalismo en esa urbe.', B: 'Personificar a la ciudad como un ente destructivo y hostil que consume la energía o la vida de las personas.', C: 'Señalar que en la ciudad había muchos lugares para comer.', D: 'Demostrar que la ciudad estaba creciendo geográficamente de manera muy rápida.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! Es una metáfora/personificación que otorga a la ciudad características de un monstruo u opresor, creando una atmósfera opresiva.', feedback_error: 'Recuerda que en literatura se usa un lenguaje figurado (connotativo). Una ciudad no puede devorar literalmente. ¿Qué sensación transmite esa imagen?' },
            { id: 267, enunciado: '¿Con qué propósito se compara a las calles con "venas endurecidas"?', alternativas: { A: 'Para explicar el sistema de alcantarillado.', B: 'Para sugerir que la ciudad es un organismo vivo, pero enfermo, viejo o carente de fluidez vital.', C: 'Para indicar que las calles estaban pavimentadas con asfalto rojo.', D: 'Para mostrar la buena conectividad vial del lugar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Al usar "venas", refuerza la metáfora de la ciudad como un cuerpo, y al decir "endurecidas", sugiere falta de vida, enfermedad o frialdad.', feedback_error: 'Una vena sana es flexible y transporta vida. Una vena "endurecida" sugiere lo contrario. ¿Qué nos dice eso sobre la ciudad entendida como un organismo?' }
          ]
        }
      },

      // ── PRÁCTICA CONJUNTA: FUNCIONES Y JERARQUÍA ──
      {
        id: 'sec-2-8-join', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 9, order: 14, tags: ['subcapitulo:Práctica Mixta'],
        title: '🧩 Práctica: Jerarquía y Funciones',
        introduccion: '¡Pon a prueba tu capacidad de jerarquizar información y reconocer funciones retóricas en un mismo texto mixto!',
        datos_claves: [
          'Aplica todo lo aprendido: diferencia lo principal de lo secundario.',
          'Analiza POR QUÉ el autor usó ciertas palabras figuradas.',
          'Recuerda: la función siempre depende del sentido del texto completo.',
        ],
        test: {
          id: 'test-2-8-join', seccionId: 'sec-2-8-join',
          contexto_base: 'La memoria humana no es un disco duro, sino un archivero desordenado que un empleado perezoso reescribe cada vez que abrimos un cajón. Numerosos estudios cognitivos han demostrado el fenómeno de la "reconsolidación": cada vez que recordamos un evento, el cerebro vuelve a grabarlo, y en ese proceso, es susceptible a cambios. Por ejemplo, en el célebre experimento de Elizabeth Loftus sobre testigos oculares, el simple hecho de cambiar la palabra "golpear" por "estrellar" en una pregunta, alteró drásticamente el recuerdo de la velocidad de los vehículos. Así, nuestra identidad, sostenida sobre esos recuerdos, es más un cuento en constante edición que una fotografía fiel.',
          preguntas: [
            { id: 268, enunciado: '¿Cuál es la información de mayor jerarquía (idea principal) del texto?', alternativas: { A: 'El cerebro vuelve a grabar los eventos y es susceptible a cambios.', B: 'La memoria humana no funciona como un disco duro de computadora.', C: 'La memoria humana es reconstructiva y maleable, por lo que nuestros recuerdos y nuestra identidad están en constante alteración.', D: 'El experimento de Elizabeth Loftus demostró que los testigos cambian de opinión.' }, respuesta_correcta: 'C', feedback_acierto: '¡Brillante! La opción C sintetiza tanto la maleabilidad de la memoria (tesis inicial) como su consecuencia en la identidad (conclusión final).', feedback_error: 'Busca la opción que una la tesis inicial (la memoria se reescribe) con la conclusión final (nuestra identidad es un cuento en edición). Las demás son incompletas.' },
            { id: 269, enunciado: '¿Qué función cumple la mención del experimento de Elizabeth Loftus?', alternativas: { A: 'Constituye la idea central del texto.', B: 'Actúa como un ejemplo concreto que ilustra y comprueba la tesis sobre cómo la memoria cambia al ser recordada.', C: 'Tiene el propósito de criticar la fiabilidad de los juicios penales.', D: 'Sirve para explicar la diferencia entre "golpear" y "estrellar".' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Está introducido explícitamente con "Por ejemplo", y su función es aportar evidencia empírica a la afirmación abstracta anterior sobre la reconsolidación.', feedback_error: 'Observa las palabras que preceden al experimento: "Por ejemplo...". ¿Qué función indica ese conector?' },
            { id: 270, enunciado: '¿Con qué propósito el emisor usa la expresión "un archivero desordenado que un empleado perezoso reescribe"?', alternativas: { A: 'Para criticar la pereza intelectual de las personas.', B: 'Para establecer una metáfora que haga comprensible y gráfica la forma inexacta y reconstructiva en que funciona la memoria.', C: 'Para defender el trabajo de los oficinistas y archiveros.', D: 'Para comparar la capacidad de memoria del cerebro con un archivo físico de papel.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! Es una figura retórica (metáfora) que ayuda a visualizar un concepto cognitivo complejo de manera cotidiana, enfatizando la falta de precisión del proceso.', feedback_error: '¿Por qué un autor científico usaría una imagen tan cotidiana e irreal? Busca la opción que explique cómo una metáfora ayuda a la comprensión.' }
          ]
        }
      },

      // ── DESAFÍO FINAL ──
      {
        id: 'sec-2-boss', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 10, order: 15, tags: ['subcapitulo:Evaluación Final'],
        isBoss: true,
        title: '⚔️ Desafío Final: Interpretar',
        introduccion: '¡Has llegado al Desafío Final del Capítulo 2! Este texto combina todas las habilidades de interpretación: inferencias, relaciones lógicas, idea central, tesis y argumentos, vocabulario en contexto y análisis del emisor.',
        datos_claves: [
          'Lee todo el texto antes de responder: algunas preguntas abarcan el texto completo.',
          'Para preguntas de inferencia: no inventes, deduce solo lo que el texto sugiere.',
          'Para preguntas de vocabulario: sustituye la palabra en el contexto y verifica el sentido.',
          'Para preguntas de actitud del emisor: busca el tono y los recursos expresivos que usa.',
          '¡Confía en lo que aprendiste durante el capítulo!',
        ],
        test: {
          id: 'test-2-boss', seccionId: 'sec-2-boss',
          contexto_base: 'Vivimos en la era de la información y, paradójicamente, en la era de la desinformación. Nunca antes habíamos tenido acceso a tantas fuentes, tantos datos, tanta ciencia disponible en tiempo real. Y sin embargo, la desconfianza hacia las instituciones científicas y académicas ha alcanzado niveles que habrían resultado impensables hace treinta años. La paradoja tiene una explicación que incomoda: no fue el acceso a más información lo que nos hizo más críticos, sino el acceso a información que confirma lo que ya creemos. Cada plataforma digital aprende a mostrarnos lo que queremos ver, reforzando nuestras convicciones en lugar de cuestionarlas. El resultado es una sociedad de burbujas cognitivas, donde la discrepancia se interpreta como amenaza y el desacuerdo como traición. Pero la historia de la ciencia es precisamente la historia de aquellos que se atrevieron a estar en desacuerdo: Galileo, Darwin, Einstein, todos encontraron resistencia de sus contemporáneos. La diferencia es que ellos ofrecieron evidencia. Hoy, con demasiada frecuencia, el único argumento es la intensidad del sentimiento.',
          preguntas: [
            { id: 241, enunciado: '¿Cuál es la tesis principal del texto?', alternativas: { A: 'El exceso de información en internet es la causa principal del analfabetismo.', B: 'Vivimos en una paradoja donde la abundancia de información coexiste con una creciente desinformación y desconfianza en la ciencia.', C: 'Las plataformas digitales deberían ser reguladas por el Estado para evitar la desinformación.', D: 'Galileo, Darwin y Einstein son los únicos científicos que merecen ser recordados.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La tesis se formula en las primeras dos oraciones: la paradoja de información abundante + desinformación creciente. El resto del texto son los argumentos que explican esa paradoja.', feedback_error: 'La tesis debe cubrir el argumento central del texto completo. El texto no propone regular internet ni exalta solo a esos científicos.' },
            { id: 242, enunciado: '¿Cuál es el significado de "burbujas cognitivas" en el contexto del texto?', alternativas: { A: 'Espacios físicos donde se discute ciencia de forma aislada.', B: 'Entornos informativos donde la persona solo recibe información que confirma sus propias creencias.', C: 'Errores de pensamiento producidos por el exceso de información.', D: 'Plataformas digitales diseñadas para aislar a los usuarios.' }, respuesta_correcta: 'B', feedback_acierto: '¡Brillante! El texto lo explica en la oración anterior: "Cada plataforma... reforzando nuestras convicciones en lugar de cuestionarlas."', feedback_error: 'El texto explica qué produce las burbujas justo antes de mencionar el término. Vuelve a la oración anterior. Ahí está su definición contextual.' },
            { id: 243, enunciado: '¿Qué función cumple la mención de Galileo, Darwin y Einstein en el texto?', alternativas: { A: 'Ejemplificar que la resistencia a las nuevas ideas es histórica, pero se superó con evidencia, en contraste con el discurso emocional actual.', B: 'Demostrar que la ciencia siempre ha sido perseguida por el Estado.', C: 'Argumentar que solo los genios pueden descubrir la verdad.', D: 'Mostrar que el desacuerdo intelectual nunca tiene solución.' }, respuesta_correcta: 'A', feedback_acierto: '¡Excelente! El autor usa a estos científicos para establecer un contraste: ellos también enfrentaron resistencia, pero la superaron con evidencia. Hoy, en cambio, solo se tiene "la intensidad del sentimiento".', feedback_error: 'Fíjate en la frase que sigue: "La diferencia es que ellos ofrecieron evidencia. Hoy... solo el sentimiento." Ese contraste es la función del ejemplo.' },
            { id: 244, enunciado: '¿Cuál es la actitud del emisor frente al fenómeno que describe?', alternativas: { A: 'Optimista: cree que la situación mejorará con el tiempo y la educación.', B: 'Crítica y preocupada: señala una contradicción peligrosa de la sociedad actual sin ofrecer una solución explícita.', C: 'Neutral: solo presenta datos sin tomar posición.', D: 'Irónica pero indiferente: describe el problema como algo inevitable.' }, respuesta_correcta: 'B', feedback_acierto: '¡Perfecto! El emisor usa "paradójicamente", "incomoda", "impensables" y afirma que el único argumento hoy es "la intensidad del sentimiento". Todo revela preocupación y postura crítica.', feedback_error: '¿Propone soluciones el texto? No. ¿Es neutral? No: toma posición clara. ¿Qué tipo de actitud corresponde a alguien que diagnostica un problema con preocupación?' },
            { id: 245, enunciado: '¿Qué se puede INFERIR de la expresión "no fue el acceso a más información lo que nos hizo más críticos"?', alternativas: { A: 'Tener más información siempre conduce a mejores decisiones.', B: 'Acceder a más información no garantiza un pensamiento más riguroso o crítico.', C: 'El autor cree que deberíamos tener acceso a menos información.', D: 'La información científica es inferior a la de las redes sociales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La afirmación niega la idea de que "más información = más pensamiento crítico". La inferencia válida es que la cantidad de información no garantiza la calidad del razonamiento.', feedback_error: 'El texto no dice que debería haber menos información. Niega una ecuación: cantidad de info ≠ calidad del pensamiento.' },
            { id: 246, enunciado: '¿Cuál es el argumento central que explica la paradoja del texto?', alternativas: { A: 'Las personas no leen suficiente para aprovechar la información disponible.', B: 'Las plataformas digitales están diseñadas para mostrar contenido que refuerza las creencias del usuario, dificultando el pensamiento crítico.', C: 'Los medios de comunicación tradicionales son más confiables que las redes sociales.', D: 'La ciencia es demasiado compleja para ser comprendida por el público general.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! El texto explica la paradoja: las plataformas "aprenden a mostrarnos lo que queremos ver, reforzando nuestras convicciones". Ese mecanismo algorítmico es el argumento central.', feedback_error: 'La explicación de la paradoja está en la mitad del texto. ¿Cuál es el mecanismo que el autor identifica como responsable?' },
            { id: 247, enunciado: '¿Qué relación lógica establece la palabra "paradójicamente" en la primera oración?', alternativas: { A: 'Introduce una causa que explica el fenómeno de la desinformación.', B: 'Indica que lo que sigue contradice lo que normalmente esperaríamos de la situación descrita.', C: 'Resume lo que se explicará en los párrafos siguientes.', D: 'Establece una comparación entre el pasado y el presente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! "Paradójicamente" siempre introduce algo inesperado o contradictorio. Esperaríamos que más información llevara a menos desinformación, pero ocurre lo contrario.', feedback_error: '"Paradójicamente" señala algo inesperado o contradictorio. ¿Qué contradicción introduce aquí?' },
            { id: 248, enunciado: 'De acuerdo con el texto, ¿qué diferencia a los científicos mencionados de quienes hoy difunden desinformación?', alternativas: { A: 'Los científicos eran más inteligentes y mejor educados.', B: 'Los científicos tenían apoyo institucional que les permitía superar la resistencia.', C: 'Los científicos sustentaban su disidencia en evidencia, mientras que hoy se usa la intensidad emocional como argumento.', D: 'Los científicos no usaban medios digitales para difundir sus ideas.' }, respuesta_correcta: 'C', feedback_acierto: '¡Brillante! El texto lo dice explícitamente: "La diferencia es que ellos ofrecieron evidencia. Hoy... el único argumento es la intensidad del sentimiento."', feedback_error: 'Busca la frase "La diferencia es que..." y lee lo que viene después.' },
            { id: 249, enunciado: '¿Con cuál de las siguientes afirmaciones estaría de acuerdo el autor del texto?', alternativas: { A: 'El pensamiento crítico se desarrolla naturalmente cuando se tiene acceso a internet.', B: 'La intensidad con que se cree algo es una forma válida de argumentar.', C: 'El desacuerdo intelectual es valioso cuando se basa en evidencia, pero peligroso cuando solo se basa en emociones.', D: 'Las plataformas digitales han mejorado la calidad del debate público.' }, respuesta_correcta: 'C', feedback_acierto: '¡Perfecto! El texto valora el desacuerdo de los científicos (sustentado en evidencia) y critica el desacuerdo emocional actual. La opción C sintetiza exactamente esa distinción.', feedback_error: 'El autor critica el debate emocional y valora la evidencia. ¿Cuál opción refleja esa posición sin exagerar ni contradecir lo que el texto dice?' },
            { id: 250, enunciado: '¿Cuál sería el mejor título para este texto?', alternativas: { A: 'Los peligros de internet en el mundo moderno.', B: 'Galileo, Darwin y Einstein: lecciones para el siglo XXI.', C: 'La paradoja informativa: cuando más datos no significa más verdad.', D: 'Cómo las plataformas digitales controlan nuestra mente.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! Un título debe capturar la idea principal completa. La opción C recoge la paradoja central (más información ≠ más verdad) sin exagerar ni reducir el argumento.', feedback_error: 'El título debe reflejar el argumento COMPLETO del texto. Descarta los que se centran en un solo detalle. ¿Cuál captura la paradoja central?' },
          ]
        }
      },
    