// ── TESTS REALES PARA CAP EVALUAR ──────────────────────────
// Contenido PAES-quality para los 15 nodos del Capítulo 3
// Temario PAES: Intención del autor, tono y postura, calidad de la información,
// forma del texto, recursos del lenguaje, recursos visuales, contexto,
// solidez de argumentos, prejuicios, y textos pareados.

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

const TESTS_EVALUAR = {

  // ── NODO ev-1: Detectar intención del autor (Texto informativo) ──
  'test-ev-1': {
    id: 'test-ev-1',
    seccionId: 'ev-1',
    contexto_base: `La obsolescencia programada no es un error de diseño; es una estrategia fundacional del modelo de consumo contemporáneo. Desde que en 1924 el cártel Phoebus decidió limitar intencionalmente la vida útil de las ampolletas a 1.000 horas, la industria ha perfeccionado el arte de fabricar productos diseñados para fallar. Hoy lo vemos en teléfonos cuyas baterías no pueden reemplazarse, en impresoras que bloquean su funcionamiento tras un número predeterminado de páginas, y en software que deja de ser compatible de la noche a la mañana.

Mientras las empresas celebran ciclos de innovación cada vez más cortos bajo la bandera del progreso tecnológico, el verdadero costo de este modelo permanece oculto. Cada año se generan más de 50 millones de toneladas de basura electrónica a nivel global, un volumen tóxico que termina mayoritariamente en vertederos informales en países en vías de desarrollo.

Revertir esta tendencia no pasa por esperar a que las corporaciones tengan una súbita crisis de conciencia, sino por exigir legislación estricta sobre el "derecho a reparar", fomentar la economía circular y penalizar fiscalmente la fabricación de productos desechables. El progreso real no es comprar un teléfono nuevo cada año, sino diseñar uno que dure una década.`,
    preguntas: [
      {
        id: 3101,
        enunciado: '¿Cuál es la intención principal del autor del texto?',
        alternativas: {
          A: 'Describir objetivamente la historia de la obsolescencia programada desde 1924.',
          B: 'Denunciar la estrategia de la obsolescencia programada y promover un cambio en la regulación y el consumo.',
          C: 'Explicar los problemas técnicos que impiden que las baterías de los teléfonos duren más tiempo.',
          D: 'Criticar a los consumidores por comprar dispositivos electrónicos de forma compulsiva.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 🎯 El autor no solo expone un problema (denuncia), sino que en el último párrafo hace un llamado explícito a la acción (exigir legislación, fomentar economía circular).',
        feedback_error: 'Identifica la tesis en el último párrafo. ¿El autor solo expone datos o tiene un propósito persuasivo y crítico respecto a la industria?'
      },
      {
        id: 3102,
        enunciado: '¿Qué actitud adopta el autor frente a las empresas tecnológicas?',
        alternativas: {
          A: 'Comprensiva ante la necesidad de innovación.',
          B: 'Crítica y escéptica frente a sus verdaderas motivaciones.',
          C: 'Neutral y meramente informativa sobre sus procesos de diseño.',
          D: 'Esperanzada en que cambiarán sus prácticas de forma voluntaria.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente! 🧐 Expresiones como "celebran bajo la bandera del progreso" y "esperar a que tengan una súbita crisis de conciencia" denotan escepticismo y crítica aguda.',
        feedback_error: 'Lee la frase: "no pasa por esperar a que las corporaciones tengan una súbita crisis de conciencia". ¿Qué revela esa ironía sobre lo que el autor piensa de ellas?'
      },
      {
        id: 3103,
        enunciado: 'El propósito del segundo párrafo es:',
        alternativas: {
          A: 'Ejemplificar cómo funcionan técnicamente los teléfonos modernos.',
          B: 'Exponer las consecuencias ambientales y sociales del modelo de consumo descrito.',
          C: 'Explicar por qué los países en desarrollo producen más basura electrónica.',
          D: 'Defender la necesidad de ciclos de innovación más cortos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 🌍 El segundo párrafo muestra el "verdadero costo oculto": 50 millones de toneladas de basura y su impacto en países vulnerables.',
        feedback_error: 'El primer párrafo explica qué es la obsolescencia. El segundo habla de "basura electrónica" y "vertederos". ¿Cuál es su función en la argumentación?'
      },
      {
        id: 3104,
        enunciado: 'Cuando el autor afirma "El progreso real no es comprar un teléfono nuevo cada año, sino diseñar uno que dure una década", pretende:',
        alternativas: {
          A: 'Redefinir el concepto de progreso, oponiéndolo al consumismo corporativo.',
          B: 'Convencer a los lectores de que no compren teléfonos móviles.',
          C: 'Demostrar que la tecnología del pasado era superior a la actual.',
          D: 'Promover la creación de una nueva empresa de tecnología.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Exacto! 💡 El autor toma una palabra que la industria usa para vender ("progreso") y le da un nuevo significado ético y sustentable.',
        feedback_error: 'El autor contrapone dos ideas de "progreso". ¿Busca eliminar los teléfonos o busca cambiar cómo entendemos el avance tecnológico?'
      }
    ]
  },

  // ── NODO ev-2: Detectar intención del autor (Texto narrativo) ──
  'test-ev-2': {
    id: 'test-ev-2',
    seccionId: 'ev-2',
    contexto_base: `La casa de remates estaba llena cuando subastaron el reloj de bolsillo del abuelo. Él mismo lo había empeñado en 1998, cuando las heladas mataron la cosecha de paltas y los bancos cerraron el grifo del crédito. "Es solo metal", nos dijo aquella vez, sin mirarnos, mientras guardaba el recibo amarillo en su billetera gastada. "Lo que importa es la tierra."

Veinticinco años después, la tierra ya no era nuestra. Un consorcio agroindustrial compró el valle entero parcela por parcela. Al abuelo le dio un infarto el mismo día que firmó la escritura, como si su corazón hubiera estado conectado directamente a las raíces de los paltos que vio morir.

Yo estaba en la última fila de la sala de remates. El martillero comenzó en cien mil pesos. Un hombre de traje gris alzó la paleta. Doscientos mil. Una mujer con joyas discretas ofreció trescientos. Yo tenía mis ahorros apretados en el bolsillo, tres billetes arrugados que apenas sumaban treinta mil. "Es solo metal", me repetí en voz baja, mientras el martillo caía, adjudicando el reloj a alguien que jamás conocería el peso de aquella helada. Me di la vuelta y salí a la calle. Hacía frío.`,
    preguntas: [
      {
        id: 3201,
        enunciado: '¿Cuál es la intención narrativa principal del relato?',
        alternativas: {
          A: 'Explicar el funcionamiento de las casas de remate y el mercado de antigüedades.',
          B: 'Denunciar las prácticas monopolísticas de los consorcios agroindustriales.',
          C: 'Transmitir el sentido de despojo material y emocional de una familia campesina.',
          D: 'Demostrar que los objetos materiales tienen más valor que la tierra.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Excelente comprensión! 💔 El texto usa la pérdida del reloj y de la tierra para evocar la tristeza, la impotencia y el despojo de una historia familiar.',
        feedback_error: 'El texto no es un reportaje económico. Se centra en el reloj, el abuelo, la tierra perdida y la impotencia del narrador. ¿Qué sentimiento busca provocar?'
      },
      {
        id: 3202,
        enunciado: 'El narrador repite la frase del abuelo "Es solo metal" al final del relato con el propósito de:',
        alternativas: {
          A: 'Convencerse a sí mismo de que la pérdida del reloj no tiene importancia, aunque sienta lo contrario.',
          B: 'Burlarse de la inocencia de su abuelo por creer que la tierra tenía más valor.',
          C: 'Justificar ante el lector por qué no tenía suficiente dinero para la subasta.',
          D: 'Aceptar felizmente que el reloj quede en manos de personas ricas.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Bien interpretado! 🗣️ La repite "en voz baja" como un consuelo inútil. Sabe que no es solo metal, porque representa la historia de sacrificio de su abuelo.',
        feedback_error: 'Fíjate en el contexto: el narrador ve que no puede pagar y murmura la frase mientras pierde el reloj. ¿Es una burla o es un intento de consolarse?'
      },
      {
        id: 3203,
        enunciado: 'La metáfora "como si su corazón hubiera estado conectado directamente a las raíces de los paltos" tiene la intención de:',
        alternativas: {
          A: 'Explicar médicamente las causas del infarto del abuelo.',
          B: 'Ilustrar el vínculo profundo y vital del abuelo con su tierra.',
          C: 'Criticar la falta de atención médica en las zonas rurales.',
          D: 'Mostrar que la agricultura es una labor físicamente desgastante.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Exacto! 🌱 La metáfora poética une la vida del abuelo (el corazón) con la vida de la tierra (las raíces), mostrando que al perder una, perdió la otra.',
        feedback_error: 'Es una figura literaria, no un diagnóstico médico. ¿Qué nos dice esa conexión sobre la relación entre el campesino y su parcela?'
      },
      {
        id: 3204,
        enunciado: 'El contraste entre el "hombre de traje gris" o la "mujer con joyas" y los "tres billetes arrugados" del narrador cumple la función de:',
        alternativas: {
          A: 'Explicar las reglas económicas de una subasta pública.',
          B: 'Visibilizar la brecha social entre quienes compran por lujo y quienes pierden por necesidad.',
          C: 'Sugerir que los compradores del reloj eran los mismos que compraron la tierra.',
          D: 'Mostrar que el narrador no sabía administrar su dinero.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! ⚖️ El texto opone visualmente la riqueza (traje, joyas, altas sumas) a la pobreza del narrador, subrayando el sentido de injusticia del despojo.',
        feedback_error: 'Identifica los elementos opuestos: traje/joyas vs. billetes arrugados. ¿Qué aspecto de la sociedad está destacando sutilmente el autor?'
      }
    ]
  },

  // ── NODO ev-3: Identificar tono y postura (Texto informativo) ──
  'test-ev-3': {
    id: 'test-ev-3',
    seccionId: 'ev-3',
    contexto_base: `La promesa de la inteligencia artificial general (AGI, por sus siglas en inglés) nos ha sido vendida como la panacea última. Los magnates de Silicon Valley, con el fervor de predicadores iluminados, nos aseguran que delegar el control de nuestras infraestructuras, nuestra educación y nuestras decisiones morales a algoritmos de caja negra es el paso natural en la evolución humana.

Es difícil no mirar esta narrativa con, al menos, un poco de cinismo. La misma industria que diseñó redes sociales adictivas que fragmentaron el tejido democrático ahora nos pide confianza ciega para construir mentes sintéticas. Argumentan que los "guardarraíles éticos" serán suficientes, mientras despiden en masa a sus propios equipos de ética y seguridad para acelerar el lanzamiento de productos no probados.

No se trata de caer en el ludismo o de negar los avances médicos y científicos que el aprendizaje automático ya está logrando. El problema no es la herramienta matemática, sino la arquitectura de poder que la rodea. Permitir que un puñado de corporaciones sin supervisión democrática defina los límites del conocimiento y la verdad no es progreso; es una claudicación.`,
    preguntas: [
      {
        id: 3301,
        enunciado: '¿Cuál es el tono principal que domina el texto?',
        alternativas: {
          A: 'Entusiasta y esperanzador.',
          B: 'Crítico, escéptico y advirtiente.',
          C: 'Neutral y estrictamente académico.',
          D: 'Melancólico y resignado.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Tono captado! 🧐 El uso de palabras como "vendida como panacea", "fervor de predicadores", "cinismo" y "claudicación" revela una actitud muy crítica y alerta.',
        feedback_error: 'Fíjate en las palabras clave: "fervor de predicadores", "cinismo", "confianza ciega", "claudicación". ¿Qué emoción o actitud reflejan?'
      },
      {
        id: 3302,
        enunciado: '¿Cuál es la postura del autor frente al desarrollo de la Inteligencia Artificial?',
        alternativas: {
          A: 'De rechazo absoluto, proponiendo la prohibición de toda tecnología algorítmica.',
          B: 'De preocupación, cuestionando no la tecnología en sí, sino el monopolio de poder y la falta de ética de las empresas que la desarrollan.',
          C: 'De total apoyo, siempre y cuando se demuestre su utilidad en el campo de la medicina.',
          D: 'De indiferencia, ya que considera que su impacto real ha sido exagerado por el marketing.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Postura bien definida! ⚖️ En el párrafo 3 lo aclara: "No se trata de caer en el ludismo... El problema no es la herramienta matemática, sino la arquitectura de poder".',
        feedback_error: 'Lee el último párrafo. El autor hace una distinción clara entre "la herramienta matemática" y "la arquitectura de poder".'
      },
      {
        id: 3303,
        enunciado: 'La frase "con el fervor de predicadores iluminados" se utiliza con un propósito:',
        alternativas: {
          A: 'Descriptivo, para mostrar las creencias religiosas de los programadores.',
          B: 'Irónico, para criticar cómo los líderes tecnológicos presentan sus productos como una salvación mesiánica.',
          C: 'Admirativo, para alabar la convicción y pasión de los creadores de tecnología.',
          D: 'Objetivo, para señalar que la inteligencia artificial se está volviendo una nueva religión formal.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente! 🎭 Es una metáfora irónica. Compara a los magnates con líderes sectarios que venden una salvación absoluta ("panacea"), cuestionando así su racionalidad y honestidad.',
        feedback_error: 'Piensa en cómo se percibe usualmente a un "predicador iluminado" que "vende una panacea". ¿Es una comparación que busca elogiar o criticar?'
      },
      {
        id: 3304,
        enunciado: '¿Qué función argumentativa cumple la mención a las "redes sociales adictivas" en el segundo párrafo?',
        alternativas: {
          A: 'Demostrar que la tecnología siempre tiene efectos secundarios impredecibles.',
          B: 'Cuestionar la credibilidad moral de la industria, usando sus errores pasados como precedente.',
          C: 'Explicar cómo se entrenan los actuales modelos de inteligencia artificial.',
          D: 'Sugerir que la inteligencia artificial se utilizará exclusivamente para el entretenimiento.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Análisis argumentativo correcto! 🕵️‍♂️ Usa el historial negativo de la industria (redes sociales) para justificar por qué no deberíamos darles "confianza ciega" ahora.',
        feedback_error: 'Si alguien te pide confianza ciega para el futuro, pero en el pasado cometió un daño grave y no lo reparó, ¿para qué mencionas ese daño pasado en el debate?'
      }
    ]
  },

  // ── NODO ev-4: Identificar tono y postura (Texto narrativo) ──
  'test-ev-4': {
    id: 'test-ev-4',
    seccionId: 'ev-4',
    contexto_base: `Querido director de departamento:

Me dirijo a usted con la profunda alegría de comunicarle que, tras cuidadosa deliberación, he decidido rechazar la generosa oferta de trabajar setenta horas semanales por el prestigio que, según me indicó, acarrea el puesto de coordinador junior. 

Entiendo que, en los tiempos que corren, el privilegio de sacrificar los fines de semana, ignorar a mi familia y desarrollar una úlcera antes de los treinta años es una oportunidad que muchos jóvenes talentosos matarían por obtener. Sé bien que el "salario emocional" de ver mi nombre en un organigrama debería ser suficiente compensación para pagar el alquiler y la cuenta del supermercado, aunque lamentablemente mi arrendador carece de esa misma sensibilidad corporativa.

Le deseo el mayor de los éxitos en su incesante búsqueda de un candidato que posea la flexibilidad de un gimnasta, la lealtad de un perro y la tolerancia al sueño de un murciélago. Estoy seguro de que la cultura del "ponte la camiseta" pronto dará sus frutos.

Atentamente,
El ex-pasante.`,
    preguntas: [
      {
        id: 3401,
        enunciado: 'El tono general de la carta puede clasificarse como:',
        alternativas: {
          A: 'Formal y respetuoso.',
          B: 'Sarcástico y mordaz.',
          C: 'Melancólico y arrepentido.',
          D: 'Agresivo e insultante.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien captado! 🎭 El autor dice lo contrario de lo que piensa ("profunda alegría", "privilegio de sacrificar") para evidenciar lo absurdo de la oferta laboral.',
        feedback_error: 'Fíjate en frases como "el privilegio de desarrollar una úlcera". ¿Lo dice en serio o está usando una figura retórica para burlarse?'
      },
      {
        id: 3402,
        enunciado: '¿Cuál es la postura real del ex-pasante frente al "salario emocional"?',
        alternativas: {
          A: 'Lo considera una recompensa valiosa, pero insuficiente en su caso particular.',
          B: 'Lo acepta como una norma válida en las corporaciones modernas.',
          C: 'Lo considera un engaño empresarial para evadir la responsabilidad de pagar un sueldo digno.',
          D: 'Cree que debería complementarse con bonos de alimentación.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Exacto! 💸 Al señalar que "mi arrendador carece de esa sensibilidad" para aceptar el salario emocional como pago, expone que es un concepto inútil para la vida real.',
        feedback_error: 'Lee la frase: "el salario emocional... debería ser suficiente compensación... aunque mi arrendador carece de esa sensibilidad". ¿Qué revela sobre la utilidad real de ese "salario"?'
      },
      {
        id: 3403,
        enunciado: 'En el contexto de la carta, la expresión "ponte la camiseta" hace referencia a:',
        alternativas: {
          A: 'El código de vestimenta informal de la empresa.',
          B: 'La exigencia de trabajar en exceso sin retribución económica proporcional.',
          C: 'La participación obligatoria en los equipos deportivos de la compañía.',
          D: 'La lealtad que los trabajadores deben tener hacia sus compañeros de equipo.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 👕 En el mundo laboral, "ponerse la camiseta" suele ser un eufemismo tóxico para normalizar el trabajo extra no remunerado, que es lo que el autor critica.',
        feedback_error: 'Considera todo lo que el autor rechazó (70 horas, perder fines de semana). ¿Qué significa "ponerse la camiseta" para la empresa que le ofreció el trabajo?'
      },
      {
        id: 3404,
        enunciado: 'Al desearle al director un candidato con "la tolerancia al sueño de un murciélago", el autor busca:',
        alternativas: {
          A: 'Mostrar sus conocimientos de zoología.',
          B: 'Exagerar humorísticamente las exigencias inhumanas del puesto.',
          C: 'Sugerir que el puesto requiere trabajar en el turno de noche.',
          D: 'Insultar directamente la inteligencia del director.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 🦇 A través de la hipérbole (exageración), evidencia que lo que la empresa pide no es talento humano, sino resistencia biológica imposible.',
        feedback_error: 'Es una exageración (hipérbole). ¿Qué está intentando demostrar el autor sobre las condiciones de trabajo que le ofrecieron?'
      }
    ]
  },

  // ── NODO ev-5: Evaluar calidad de la información (Texto informativo) ──
  'test-ev-5': {
    id: 'test-ev-5',
    seccionId: 'ev-5',
    contexto_base: `Mito: "Las vacunas causan autismo"

Uno de los fraudes científicos más dañinos de la medicina moderna comenzó en 1998, cuando la prestigiosa revista The Lancet publicó un estudio del médico británico Andrew Wakefield. El artículo sugería un vínculo directo entre la vacuna triple vírica (sarampión, paperas y rubéola) y el desarrollo de autismo en niños. Tras la publicación, las tasas de vacunación cayeron dramáticamente en varios países europeos y los casos de sarampión —una enfermedad mortal y altamente contagiosa— reaparecieron.

Sin embargo, la calidad del estudio de Wakefield era insostenible. Investigaciones posteriores del periodista Brian Deer y del Consejo Médico General del Reino Unido revelaron falencias críticas. Primero: la muestra del estudio era minúscula y no representativa (solo 12 niños). Segundo: no existía un grupo de control para comparar resultados. Tercero, y más grave: se descubrió que Wakefield había falseado historiales médicos y recibido financiamiento oculto de abogados que preparaban demandas contra los fabricantes de vacunas.

En 2010, tras múltiples investigaciones independientes que analizaron a millones de niños en todo el mundo sin encontrar relación estadística alguna entre vacunas y autismo, The Lancet se retractó oficialmente y eliminó el artículo de sus registros. A Wakefield se le retiró su licencia médica. Pese a que el consenso científico global es abrumador, la desinformación generada por ese único artículo manipulado sigue circulando en redes sociales décadas después.`,
    preguntas: [
      {
        id: 3501,
        enunciado: '¿Por qué la información presentada originalmente por Wakefield carecía de validez científica, según el texto?',
        alternativas: {
          A: 'Porque el autismo no era una condición reconocida médicamente en 1998.',
          B: 'Porque The Lancet era una revista de divulgación general, no científica.',
          C: 'Por errores metodológicos graves (muestra pequeña, sin grupo control) y manipulación de datos por conflicto de interés.',
          D: 'Porque las vacunas analizadas no se aplicaban en el Reino Unido en ese momento.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! 🔬 El segundo párrafo enumera las fallas de calidad: muestra minúscula (12 niños), falta de grupo control, datos falseados y financiamiento con conflicto de interés.',
        feedback_error: 'Localiza en el segundo párrafo las razones específicas por las que las investigaciones posteriores determinaron que el estudio original tenía "falencias críticas".'
      },
      {
        id: 3502,
        enunciado: '¿Qué criterio de calidad de la información se vio vulnerado por el "financiamiento oculto de abogados" que recibió Wakefield?',
        alternativas: {
          A: 'La objetividad y ausencia de sesgos o conflictos de interés.',
          B: 'La actualidad y vigencia temporal de los datos.',
          C: 'La claridad en la redacción del artículo.',
          D: 'La accesibilidad pública a la información.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Excelente evaluación! ⚖️ Si quien investiga recibe dinero en secreto de partes interesadas en el resultado (abogados demandantes), la investigación pierde toda objetividad.',
        feedback_error: 'Piénsalo así: si una tabacalera financia en secreto un estudio sobre si fumar es dañino, ¿qué regla básica de la ciencia se rompe?'
      },
      {
        id: 3503,
        enunciado: 'El contraste entre los "12 niños" del estudio de Wakefield y los "millones de niños" de las investigaciones posteriores sirve para:',
        alternativas: {
          A: 'Mostrar que la incidencia de autismo ha aumentado a millones en la última década.',
          B: 'Criticar a The Lancet por publicar estudios extensos en lugar de casos clínicos específicos.',
          C: 'Destacar la superioridad estadística de la evidencia que refutó el mito.',
          D: 'Demostrar que es más fácil investigar a mucha gente que a grupos pequeños.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Bien! 📊 En ciencia, el tamaño de la muestra determina la fiabilidad. Un estudio con 12 niños tiene un margen de error enorme frente a uno con millones de casos confirmados.',
        feedback_error: 'Compara la solidez de una conclusión basada en observar a 12 personas versus observar a millones. ¿Qué demuestra ese contraste metodológico?'
      },
      {
        id: 3504,
        enunciado: 'Del texto se infiere que en la actualidad la información sobre vacunas y autismo en redes sociales:',
        alternativas: {
          A: 'Refleja con exactitud el consenso de la comunidad médica global.',
          B: 'Se basa en nuevos estudios que validaron la teoría de Wakefield.',
          C: 'Ha sido completamente eliminada gracias a la retractación de la revista.',
          D: 'Sobrevive basada en creencias emocionales pese a haber sido refutada científicamente.'
        },
        respuesta_correcta: 'D',
        feedback_acierto: '¡Inferencia precisa! 📱 El texto cierra diciendo que, a pesar de las pruebas abrumadoras en contra, "la desinformación sigue circulando en redes sociales".',
        feedback_error: 'Lee la última oración del texto. ¿Qué ocurre con la desinformación en redes sociales actualmente a pesar de los desmentidos científicos?'
      }
    ]
  },

  // ── NODO ev-6: Analizar forma del texto ──
  'test-ev-6': {
    id: 'test-ev-6',
    seccionId: 'ev-6',
    contexto_base: `La crisis climática ya no es una amenaza lejana: está aquí.
Las cifras son claras. En 2023, la temperatura media global fue 1.45 °C superior a los niveles preindustriales. El hielo marino antártico alcanzó su mínimo histórico.

PERO LOS LÍDERES GLOBALES SIGUEN DEBATBIENDO MIENTRAS EL RELOJ AVANZA.

¿Qué necesitamos?
1. Reducción inmediata de emisiones fósiles.
2. Financiamiento para adaptación en países vulnerables.
3. Voluntad política real, no solo declaraciones conjuntas vacías.

«La ventana de oportunidad para asegurar un futuro habitable se está cerrando rápidamente», advirtió el Panel Intergubernamental del Cambio Climático (IPCC). Si no actuamos ahora, las próximas generaciones heredarán un mundo irreconocible.`,
    preguntas: [
      {
        id: 3601,
        enunciado: '¿Qué función cumple el uso de letras MAYÚSCULAS en el tercer párrafo?',
        alternativas: {
          A: 'Indicar que se trata del título secundario de la publicación.',
          B: 'Transmitir un tono de urgencia, alarma o indignación frente a la inacción.',
          C: 'Diferenciar las opiniones del autor de los datos científicos.',
          D: 'Cumplir con las normas ortográficas para citas institucionales.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 📢 En la escritura contemporánea, las mayúsculas sostenidas actúan como el equivalente visual de un grito, enfatizando la urgencia y la frustración.',
        feedback_error: 'Piensa en cómo "suenan" las mayúsculas cuando lees en internet o en un manifiesto. ¿Están ahí por gramática o para generar un efecto emocional?'
      },
      {
        id: 3602,
        enunciado: 'La organización del texto mediante una lista numerada (1, 2, 3) tiene el propósito de:',
        alternativas: {
          A: 'Explicar cronológicamente cómo se desarrolló el cambio climático.',
          B: 'Presentar de manera clara, sintetizada y pragmática las soluciones exigidas.',
          C: 'Ocupar más espacio en la página para que el artículo parezca más extenso.',
          D: 'Clasificar los tipos de contaminación desde la menos grave a la más grave.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien! 📝 Las viñetas o listas rompen los párrafos largos y permiten que el lector identifique rápidamente las acciones concretas y directas que propone el autor.',
        feedback_error: 'Observa el contenido de la lista. Son acciones ("Reducción", "Financiamiento", "Voluntad"). ¿Qué ventaja tiene presentarlas numeradas en lugar de en un párrafo largo?'
      },
      {
        id: 3603,
        enunciado: 'La pregunta "¿Qué necesitamos?" antes de la lista cumple la función retórica de:',
        alternativas: {
          A: 'Demostrar que el autor no tiene la solución al problema y busca ayuda.',
          B: 'Cuestionar si realmente vale la pena intentar salvar el planeta.',
          C: 'Funcionar como un conector que guía la atención del lector hacia la propuesta de soluciones.',
          D: 'Interrogar directamente a la organización del IPCC para que tome medidas.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Exacto! ❓ Es una pregunta retórica organizativa. El autor no espera que el lector responda; la usa para transitar de la descripción del problema a las soluciones.',
        feedback_error: 'El autor se pregunta y se responde a sí mismo inmediatamente. ¿Para qué le sirve hacer eso estructuralmente en el texto?'
      },
      {
        id: 3604,
        enunciado: '¿Cuál es el efecto de iniciar el texto con oraciones cortas y directas ("La crisis... está aquí", "Las cifras son claras")?',
        alternativas: {
          A: 'Crear un ritmo acelerado y un tono asertivo que capte la atención inmediatamente.',
          B: 'Demostrar que el autor tiene un vocabulario limitado y escribe con simpleza.',
          C: 'Evitar dar demasiada información científica que pueda confundir al lector.',
          D: 'Imitar el estilo de escritura de los informes científicos internacionales.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Análisis formal brillante! ⏱️ La sintaxis corta y cortante crea un ritmo rápido, contundente y genera sensación de hecho irrefutable (asertividad).',
        feedback_error: 'Lee esas dos oraciones en voz alta. Son como golpes. ¿Qué efecto busca causar ese ritmo tan cortado en la primera línea de un texto sobre una crisis?'
      }
    ]
  },

  // ── NODO ev-7: Evaluar recursos del lenguaje ──
  'test-ev-7': {
    id: 'test-ev-7',
    seccionId: 'ev-7',
    contexto_base: `El uso del plástico de un solo uso es un cáncer que hace metástasis en nuestros océanos. Cada minuto, el equivalente a un camión de basura repleto de plásticos es vomitado hacia el mar, asfixiando corales y estrangulando lentamente la biodiversidad marina.

Nos han vendido el "reciclaje" como el santo grial de la ecología, la pastilla mágica que nos permite seguir consumiendo sin culpa. Pero la realidad es terca y los números no mienten: menos del 9% de todo el plástico producido en la historia ha sido reciclado. El resto yace en el fondo marino, transformándose en microplásticos invisibles que hoy nadan en la sangre de los peces y, paradójicamente, terminan de regreso en nuestros propios platos.

Seguir creyendo que las limpiezas de playas solucionarán el problema es intentar vaciar el océano con una cucharita mientras dejamos la llave del agua abierta. La única salida real es cerrar la llave de producción.`,
    preguntas: [
      {
        id: 3701,
        enunciado: 'La metáfora "es un cáncer que hace metástasis" en el primer párrafo tiene el efecto de:',
        alternativas: {
          A: 'Explicar los componentes tóxicos que liberan los plásticos en el agua.',
          B: 'Atenuar la gravedad del problema para no alarmar al lector.',
          C: 'Asociar el problema del plástico con una enfermedad mortal, expansiva e incontrolable.',
          D: 'Criticar los malos hábitos alimenticios que causan problemas de salud en humanos.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Bien evaluado! 🦠 El cáncer y la metástasis evocan algo destructivo que se propaga por todo el sistema (el océano) y amenaza la vida de forma inminente.',
        feedback_error: '¿Qué emociones e ideas asociamos con la palabra "cáncer" y "metástasis"? El autor transfiere esa misma gravedad al problema del plástico.'
      },
      {
        id: 3702,
        enunciado: '¿Qué recurso retórico se utiliza en la frase "es vomitado hacia el mar, asfixiando corales y estrangulando lentamente"?',
        alternativas: {
          A: 'Personificación, otorgando verbos violentos y orgánicos a acciones inanimadas.',
          B: 'Ironía, diciendo lo contrario de lo que ocurre en realidad.',
          C: 'Eufemismo, suavizando un concepto desagradable.',
          D: 'Pregunta retórica, para hacer reflexionar al lector.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! 🌊 La basura no "vomita" ni "estrangula" literalmente. El uso de estos verbos orgánicos y violentos (personificación/animización) intensifica el drama ecológico.',
        feedback_error: 'Observa los verbos: vomitar, asfixiar, estrangular. Son acciones físicas de seres vivos aplicadas al plástico. ¿Cómo se llama esa figura?'
      },
      {
        id: 3703,
        enunciado: 'El uso de expresiones como "santo grial" y "pastilla mágica" al referirse al reciclaje busca:',
        alternativas: {
          A: 'Alabar los logros tecnológicos de la industria del reciclaje.',
          B: 'Ironizar sobre la fe ciega e ingenua que la sociedad ha depositado en una falsa solución.',
          C: 'Vincular el cuidado del medio ambiente con creencias religiosas antiguas.',
          D: 'Demostrar que reciclar requiere un esfuerzo casi milagroso.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente lectura del sarcasmo! 🪄 Ambas frases remiten a soluciones mágicas irreales. El autor critica que veamos el reciclaje como una salvación divina que no requiere esfuerzo.',
        feedback_error: 'Un "santo grial" o una "pastilla mágica" son soluciones de fantasía, que arreglan todo sin esfuerzo. ¿El autor cree que el reciclaje es realmente así?'
      },
      {
        id: 3704,
        enunciado: 'La analogía final ("intentar vaciar el océano con una cucharita mientras dejamos la llave del agua abierta") ilustra que:',
        alternativas: {
          A: 'Limpiar las playas es una actividad perjudicial para el ecosistema marino.',
          B: 'El problema de la contaminación no tiene ninguna solución técnica posible.',
          C: 'Las acciones paliativas son inútiles y ridículas si no se ataca la causa raíz (la producción).',
          D: 'Faltan voluntarios para las campañas de recolección de basura.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Exacto! 🥄 La cucharita es el esfuerzo minúsculo (limpiar), la llave abierta es el problema de origen (producción). La imagen visual resume el argumento lógico: atacar el origen.',
        feedback_error: 'Imagina la escena de la cucharita y la llave de agua. ¿Qué representa la llave? ¿Qué nos dice la escena sobre dónde deberíamos centrar nuestro esfuerzo?'
      }
    ]
  },

  // ── NODO ev-8: Evaluar recursos visuales (Texto informativo) ──
  'test-ev-8': {
    id: 'test-ev-8',
    seccionId: 'ev-8',
    contexto_base: `[El siguiente texto corresponde al análisis de un informe de salud pública que incluye tablas y gráficos]

El reciente informe del Ministerio de Salud sobre tabaquismo adolescente presenta un panorama de contrastes. El "Gráfico 1: Consumo histórico (2010-2023)" muestra una curva de descenso evidente: pasamos de un 35% de prevalencia en escolares a un 12%. El gráfico está coloreado en verde claro y utiliza un diseño minimalista.

Sin embargo, en la página siguiente, la "Tabla 4: Nuevos dispositivos" muestra datos preocupantes en letras rojas y negritas. Allí se desglosa el uso de vaporizadores (e-cigarettes). Mientras el cigarrillo tradicional cae, la tabla revela que un 28% de los escolares probó un vaporizador el último mes, con la cifra más alta en la columna de alumnos de 14 años. 

Las campañas publicitarias de estos dispositivos, tal como muestra la Infografía Aétrica incluida en el anexo, utilizan colores de neón, estética de videojuegos y sabores dulces (mango, algodón de azúcar) para atraer a este público específico. La infografía cruza la inversión publicitaria en redes sociales con los picos de ventas, mostrando que ambas líneas suben en paralelo de forma casi idéntica.`,
    preguntas: [
      {
        id: 3801,
        enunciado: 'El uso de "letras rojas y negritas" en la Tabla 4 tiene el propósito comunicativo de:',
        alternativas: {
          A: 'Hacer que la tabla combine estéticamente con el resto del documento.',
          B: 'Alertar visualmente al lector sobre la gravedad de los datos de consumo de vaporizadores.',
          C: 'Diferenciar los datos del año 2023 de los datos de la década anterior.',
          D: 'Cumplir con un formato estándar obligatorio para los documentos de salud pública.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 🔴 El color rojo en occidente y en documentos técnicos suele codificar alerta o peligro. Las negritas enfatizan el dato. Ambos recursos advierten sobre la gravedad.',
        feedback_error: 'En el contexto de un informe de salud, ¿qué suele significar poner un dato en color rojo y destacado frente a gráficos en "verde claro"?'
      },
      {
        id: 3802,
        enunciado: '¿Por qué el autor del texto contrasta el Gráfico 1 con la Tabla 4?',
        alternativas: {
          A: 'Para demostrar que los informes de salud pública son contradictorios y poco confiables.',
          B: 'Para evidenciar que la victoria sobre el cigarrillo tradicional es parcial, ya que el problema se desplazó a los vaporizadores.',
          C: 'Para criticar el diseño minimalista de los gráficos gubernamentales modernos.',
          D: 'Para sugerir que los escolares están mintiendo en las encuestas de consumo.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Bien analizado! 📉📈 El contraste visual (gráfico bajando vs. tabla alarmante) refleja un fenómeno social: se dejó de fumar tabaco, pero se empezó a vapear en tasas altas.',
        feedback_error: 'El Gráfico 1 muestra buenas noticias (cae el tabaco tradicional). La Tabla 4 muestra malas noticias (aumenta el vaporizador). ¿Qué conclusión se saca al ponerlos juntos?'
      },
      {
        id: 3803,
        enunciado: '¿Qué información aporta la "Infografía" mencionada en el tercer párrafo respecto al problema?',
        alternativas: {
          A: 'Detalla los daños químicos a los pulmones causados por los sabores dulces.',
          B: 'Establece una correlación visual directa entre el marketing dirigido a jóvenes y el aumento de ventas.',
          C: 'Muestra los precios de los vaporizadores comparados con el cigarrillo tradicional.',
          D: 'Compara las leyes de publicidad entre distintos países latinoamericanos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Exacto! 📊 La infografía "cruza la inversión publicitaria con los picos de ventas" mostrando que "suben en paralelo". Esto evidencia visualmente causa y efecto (marketing = más consumo).',
        feedback_error: 'Lee la última oración del texto, donde se describe qué líneas cruza la infografía y cómo se comportan esas líneas.'
      },
      {
        id: 3804,
        enunciado: 'La mención a "colores de neón y estética de videojuegos" describe recursos visuales utilizados por las tabacaleras para:',
        alternativas: {
          A: 'Reducir el costo de producción de los envases.',
          B: 'Ocultar los componentes químicos de los dispositivos.',
          C: 'Apelar específicamente a códigos visuales atractivos para niños y adolescentes.',
          D: 'Diferenciar el producto de los cigarrillos tradicionales de los abuelos.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Inferencia correcta! 🎮 La estética de videojuegos y colores neón no es accidental: es un diseño visual estratégicamente dirigido para captar a un grupo etario joven.',
        feedback_error: '¿Quiénes son los consumidores principales de videojuegos y productos con sabores a algodón de azúcar? El diseño visual del producto está apuntando a ellos.'
      }
    ]
  },

  // ── NODO ev-9: Relacionar con el contexto (Texto informativo) ──
  'test-ev-9': {
    id: 'test-ev-9',
    seccionId: 'ev-9',
    contexto_base: `[Artículo publicado en un diario nacional en octubre de 1918]

Ha llegado a nuestros puertos el temido huésped que asola Europa. Ayer se confirmaron los primeros casos de la gripe "española" en Valparaíso y Santiago. Las autoridades sanitarias, tratando de evitar el pánico, aseguran que la enfermedad es leve y que bastan los remedios de la abuela, purgantes y reposo, para alejar el peligro.

Sin embargo, los partes diarios del Cementerio General cuentan otra historia. Las campanas no dejan de doblar y las carretas de las funerarias no dan abasto. Las escuelas han sido cerradas sin fecha de retorno y los teatros muestran sus butacas vacías. En los barrios populares, donde el hacinamiento y la falta de alcantarillado son la norma, familias enteras yacen postradas en conventillos mal ventilados.

Es urgente que el Estado abandone su actitud displicente. No podemos enfrentar un flagelo mundial de esta magnitud con paños fríos y discursos optimistas. Se requieren cordones sanitarios, hospitales de emergencia y limpieza pública financiada por las arcas fiscales, antes de que la capital se convierta en una gran fosa común.`,
    preguntas: [
      {
        id: 3901,
        enunciado: 'Considerando que el texto fue escrito en 1918, la mención de "los barrios populares, donde el hacinamiento y la falta de alcantarillado son la norma" refleja:',
        alternativas: {
          A: 'Una invención del autor para exagerar el impacto de la enfermedad.',
          B: 'El contexto social de la "cuestión social" en Chile a principios del siglo XX, marcado por la precariedad urbana.',
          C: 'Una crítica exclusiva a las familias campesinas que migraban sin recursos.',
          D: 'Un problema sanitario que ya había sido resuelto pero resurgió por la pandemia.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Conexión de contexto perfecta! 🏘️ La mención de conventillos, hacinamiento y falta de higiene describe las condiciones de vida de la clase obrera en el Chile de principios del siglo XX (la "Cuestión Social").',
        feedback_error: 'Piensa en las clases de historia sobre Chile a inicios de 1900. ¿Cómo vivían los obreros en las grandes ciudades? El texto está usando esa realidad concreta como factor de riesgo.'
      },
      {
        id: 3902,
        enunciado: '¿Qué actitud tenían las autoridades sanitarias de la época frente a la epidemia, según el autor?',
        alternativas: {
          A: 'Sobreaccionaban, cerrando la ciudad cuando no era necesario.',
          B: 'Implementaban medidas modernas basadas en la ciencia médica avanzada.',
          C: 'Minimizaban la gravedad del problema ("actitud displicente", "remedios de abuela").',
          D: 'Culpaban a los países europeos por la llegada de la enfermedad.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! 🏛️ El autor critica la "actitud displicente" de las autoridades, quienes decían que era leve y recomendaban "purgantes y reposo" mientras la gente moría.',
        feedback_error: 'Lee el primer y el último párrafo. ¿Qué decían las autoridades para "evitar el pánico" y qué les exige el autor que abandonen?'
      },
      {
        id: 3903,
        enunciado: 'El uso de la frase "los partes diarios del Cementerio General cuentan otra historia" es un recurso para:',
        alternativas: {
          A: 'Desmentir con hechos luctuosos el discurso optimista del gobierno.',
          B: 'Proponer nuevas políticas de administración de cementerios.',
          C: 'Demostrar que la contabilidad urbana en 1918 era muy precisa.',
          D: 'Criticar los altos precios de las carretas funerarias.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Bien evaluado! 🪦 La "otra historia" es la realidad de las muertes, que contrasta dramáticamente y desmiente la narrativa oficial de que "la enfermedad es leve".',
        feedback_error: '¿Cuál es la "primera historia"? (Que la enfermedad es leve). ¿Qué hacen los datos del cementerio con esa primera historia oficial?'
      },
      {
        id: 3904,
        enunciado: 'Las exigencias del autor al final del texto evidencian que, en el contexto de la época, él aboga por:',
        alternativas: {
          A: 'Que la medicina natural reemplace a la medicina científica.',
          B: 'Un Estado benefactor e intervencionista que asuma la responsabilidad de la salud pública.',
          C: 'Que la empresa privada se haga cargo de construir hospitales de emergencia.',
          D: 'El abandono de la ciudad capital para evitar contagios masivos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente inferencia histórica! 🏛️ Pedir "hospitales financiados por arcas fiscales" y "cordones sanitarios" es exigir que el Estado tome un rol activo y protector, algo que en 1918 aún estaba en debate.',
        feedback_error: '¿A quién le exige el autor "limpieza pública financiada por arcas fiscales"? Eso implica pedir que una institución específica asuma el gasto y la acción.'
      }
    ]
  },

  // ── NODO ev-10: Relacionar con el contexto (Texto narrativo) ──
  'test-ev-10': {
    id: 'test-ev-10',
    seccionId: 'ev-10',
    contexto_base: `[Fragmento de un cuento escrito en Chile, década de 1950]

Don Evaristo miró la carta mecanografiada que le había llegado desde el Ministerio de Educación en Santiago. La sostuvo con ambas manos bajo la luz amarillenta de la única ampolleta que colgaba en la escuela rural. "Señor Director", empezaba. Era irónico que lo llamaran así, considerando que él era el director, el único profesor de los seis grados, el portero y, en los inviernos crudos, el encargado de conseguir leña para que los niños no tiritaran sobre los pupitres de pino.

La carta anunciaba el envío de "modernos materiales didácticos consistentes en un mapamundi actualizado y dos cajas de tiza blanca". Nada decía del techo que se llovía en la esquina norte. Nada decía de los zapatos rotos con los que los niños del fundo caminaban cinco kilómetros cruzando el barro cada mañana.

Dobló el papel con cuidado, casi con reverencia, y lo guardó en el cajón de su escritorio de madera cruda. "Modernos materiales", murmuró para sí mismo. Luego tomó un trozo de carbón y se volvió hacia la vieja pizarra despintada para preparar la lección de sumas del día siguiente.`,
    preguntas: [
      {
        id: 3001,
        enunciado: '¿Qué realidad educativa y social del contexto de la época (1950) refleja el relato?',
        alternativas: {
          A: 'La alta inversión del Estado en infraestructura para los colegios campesinos.',
          B: 'El abandono material, la pobreza y la falta de recursos de la educación pública en zonas rurales.',
          C: 'El exceso de burocracia en el ministerio que impedía la entrega de materiales modernos.',
          D: 'La negativa de los profesores rurales a adoptar nuevas metodologías pedagógicas.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Exacto! 🏚️ El texto expone las carencias extremas del Chile rural de mediados del siglo XX: escuelas unidocentes, goteras, niños con zapatos rotos caminando kilómetros y falta de recursos básicos.',
        feedback_error: 'Enumera los elementos que describe el texto: un profesor hace todo el trabajo, hay goteras, los niños tienen zapatos rotos, la pizarra está despintada. ¿Qué panorama nos muestra eso?'
      },
      {
        id: 3002,
        enunciado: 'La reacción de Don Evaristo de murmurar "Modernos materiales" revela una actitud de:',
        alternativas: {
          A: 'Gratitud y emoción por la ayuda recibida desde la capital.',
          B: 'Ironía y amargura ante la desconexión del Ministerio con la realidad urgente de su escuela.',
          C: 'Envidia porque las escuelas de Santiago recibían mejores cosas.',
          D: 'Confusión, al no entender cómo usar un mapamundi.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Muy bien interpretado! 📝 Repite las palabras del burócrata con ironía, marcando el absurdo de enviar "un mapamundi actualizado" a una escuela donde lo que urge es tapar goteras y abrigar a los niños.',
        feedback_error: 'Considera el contraste entre lo que manda el ministerio (mapa y tiza) y lo que realmente necesita la escuela (techo, leña, zapatos). ¿Cómo se siente el profesor ante esa diferencia?'
      },
      {
        id: 3003,
        enunciado: 'El hecho de que Don Evaristo prepare la lección usando "un trozo de carbón" en lugar de tiza cumple la función narrativa de:',
        alternativas: {
          A: 'Demostrar visualmente la precariedad extrema con la que trabaja diariamente.',
          B: 'Criticar la mala calidad de la tiza enviada por el Ministerio.',
          C: 'Mostrar una antigua técnica pedagógica de enseñanza matemática.',
          D: 'Resaltar la afición del profesor por el dibujo al carbóncillo.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! 🪨 Usar carbón de la estufa para escribir en la pizarra es la evidencia máxima de la falta de recursos básicos y el ingenio para sobrevivir en la precariedad.',
        feedback_error: 'Si alguien escribe en la pizarra con carbón en lugar de tiza, ¿qué nos está diciendo el autor sin usar palabras sobre las condiciones de esa escuela?'
      },
      {
        id: 3004,
        enunciado: 'El contraste espacial entre "Santiago" (de donde viene la carta) y la "escuela rural" simboliza en el relato:',
        alternativas: {
          A: 'El avance tecnológico de la ciudad versus la ignorancia del campo.',
          B: 'La distancia burocrática y la miopía del poder central frente a la marginalidad de las provincias.',
          C: 'La rápida industrialización del país durante el siglo XX.',
          D: 'El deseo de los campesinos de migrar hacia los centros urbanos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente lectura del contexto! 🏛️ Santiago representa al Estado central que manda "cartas mecanografiadas" formales, pero es miope a la cruda y húmeda realidad del campo ("la marginalidad").',
        feedback_error: 'La carta escrita a máquina desde la capital con lenguaje formal ("Señor Director") choca con la realidad del barro y las goteras. ¿Qué problema histórico del Estado representa ese choque?'
      }
    ]
  },

  // ── NODO ev-11: Juzgar la solidez de un argumento ──
  'test-ev-11': {
    id: 'test-ev-11',
    seccionId: 'ev-11',
    contexto_base: `[Columna de opinión sobre políticas de transporte urbano]

Es imperativo que nuestra ciudad prohíba inmediatamente la circulación de scooters eléctricos (monopatines) en las calles y veredas. Quienes defienden estos dispositivos argumentan que son una alternativa ecológica y descongestionan el tráfico. Sin embargo, su argumento no se sostiene cuando observamos la realidad empírica.

En primer lugar, los scooters son extremadamente peligrosos. Según un reporte de la sala de urgencias del Hospital Central, las lesiones por accidentes en scooter han aumentado un 40% en el último año. Mi propio sobrino se fracturó el brazo la semana pasada intentando esquivar un bache. Si esto le ocurrió a él, que es un joven deportista con buenos reflejos, imaginen el peligro mortal que representan para una persona de la tercera edad que camine por la vereda.

Además, los usuarios de estos aparatos son conocidos por su total desprecio por las normas del tránsito. Nunca usan casco, cruzan con luz roja y dejan los scooters tirados en medio de la vía pública, obstaculizando el paso a las sillas de ruedas. Permitir su uso es equivalente a legalizar la anarquía en nuestras calles. Por lo tanto, la prohibición total es la única medida lógica que protegerá a los peatones vulnerables.`,
    preguntas: [
      {
        id: 3011,
        enunciado: '¿Cuál es la principal falacia metodológica del autor al utilizar el ejemplo de su sobrino?',
        alternativas: {
          A: 'Usa una experiencia personal y anecdótica (un solo caso) para generalizar sobre la peligrosidad del transporte para toda la población.',
          B: 'Asume incorrectamente que los jóvenes deportistas tienen mejores reflejos que los adultos.',
          C: 'Miente sobre la existencia de baches en las calles de la ciudad.',
          D: 'Culpa al scooter por un accidente que en realidad fue causado por el estado del pavimento.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Argumentación evaluada! 🧠 La anécdota personal ("mi sobrino se fracturó") puede ser emotiva, pero es una falacia (evidencia anecdótica) si se usa como prueba científica universal.',
        feedback_error: 'Pregúntate: ¿El accidente de una sola persona en la familia del autor es prueba estadística suficiente para concluir que un transporte es inherentemente peligroso?'
      },
      {
        id: 3012,
        enunciado: '¿Cómo se puede evaluar la calidad del dato proporcionado en el segundo párrafo ("han aumentado un 40%")?',
        alternativas: {
          A: 'Es un argumento irrefutable porque menciona a un hospital.',
          B: 'Es sólido, ya que el 40% es una cifra estadísticamente significativa en cualquier contexto.',
          C: 'Es débil y engañoso, porque un aumento porcentual no informa sobre los números absolutos (ej. pasar de 10 a 14 casos también es un 40%).',
          D: 'Es falso, porque los hospitales no llevan registros de los medios de transporte de los accidentados.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! 📊 Las cifras porcentuales sin contexto ("aumentó un 40%") pueden magnificar problemas pequeños. Si hubo 5 accidentes y ahora hay 7, aumentó un 40%, pero no es una crisis de salud pública.',
        feedback_error: 'Un aumento del 100% de 1 accidente a 2 accidentes suena alarmante pero son solo 2 casos. ¿Por qué dar porcentajes sueltos debilita la solidez de un dato numérico?'
      },
      {
        id: 3013,
        enunciado: 'En el tercer párrafo, la afirmación "los usuarios de estos aparatos son conocidos por su total desprecio por las normas" constituye:',
        alternativas: {
          A: 'Un hecho comprobado por la ciencia.',
          B: 'Una premisa válida basada en la observación objetiva de la realidad urbana.',
          C: 'Una generalización apresurada y prejuiciosa que asume que todos los usuarios actúan igual.',
          D: 'Una conclusión lógica derivada del aumento de accidentes.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Bien identificado! 🚫 Es una falacia de generalización apresurada ("todos son infractores") que se usa para polarizar y atacar al grupo entero.',
        feedback_error: 'El autor usa palabras como "conocidos por su total desprecio", "Nunca usan casco". ¿Está describiendo objetivamente la realidad o exagerando una conducta generalizándola a todos?'
      },
      {
        id: 3014,
        enunciado: 'La comparación "Permitir su uso es equivalente a legalizar la anarquía en nuestras calles" funciona en la argumentación como:',
        alternativas: {
          A: 'Una analogía jurídica precisa aplicable al derecho de tránsito.',
          B: 'Una falacia de pendiente resbaladiza y apelación al miedo, que exagera las consecuencias.',
          C: 'Una conclusión equilibrada tras analizar las ventajas y desventajas.',
          D: 'Un respaldo teórico basado en estudios de sociología urbana.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Exacto! 😱 Decir que usar un monopatín lleva a la "anarquía" es una exageración dramática (falacia de la pendiente resbaladiza) diseñada para asustar al lector y forzar la prohibición.',
        feedback_error: '¿Saltar del uso de monopatines al caos social y la "anarquía" es un paso lógico o una exageración tremenda para manipular las emociones del lector?'
      }
    ]
  },

  // ── NODO ev-12: Comparar posturas en Textos Pareados ──
  'test-ev-12': {
    id: 'test-ev-12',
    seccionId: 'ev-12',
    contexto_base: `📖 TEXTO 1
La implementación de la jornada escolar completa (JEC) en los años 90 fue un error de diseño monumental cuyas consecuencias pagamos hoy. La idea teórica era loable: mantener a los estudiantes más tiempo en el colegio para alejarlos de los riesgos de la calle e igualar las oportunidades de aprendizaje entre ricos y pobres. Sin embargo, en la práctica, los colegios públicos carecían (y carecen) de la infraestructura deportiva, artística y de descanso necesaria para sostener a un niño ocho horas en el recinto. 

El resultado ha sido la transformación de las escuelas en guarderías de hacinamiento, donde el tiempo adicional se utiliza simplemente en más horas de matemáticas y lenguaje, agotando mentalmente a alumnos y profesores. Los índices de estrés adolescente se han disparado, y las brechas de aprendizaje, lejos de cerrarse, se han mantenido intactas. Necesitamos reducir la jornada y devolverle a los jóvenes el tiempo para el juego libre, la vida comunitaria y el desarrollo de intereses propios fuera de las paredes del aula.

--- DIVISION_TEXTOS ---

📖 TEXTO 2
Criticar la jornada escolar completa (JEC) basándose únicamente en los problemas de implementación es tener una mirada de corto plazo y profundo sesgo de clase. Quienes abogan por "devolver el tiempo libre" a los estudiantes asumen que, a las 2 de la tarde, un adolescente de un sector vulnerable volverá a una casa segura, con adultos presentes y estímulos culturales a su disposición. Esa es la realidad de los sectores acomodados, no la del Chile real.

Para miles de estudiantes, la escuela es el único entorno que les garantiza un almuerzo caliente, protección contra entornos barriales dominados por el narcotráfico y un espacio para socializar de forma estructurada. Es innegable que la JEC requiere mejoras urgentes: necesitamos inyectar recursos para talleres deportivos, psicólogos, arte y música, transformando esas horas extra en verdadero desarrollo integral. Pero desmantelar la JEC y enviar a los jóvenes vulnerables a la calle a mitad del día, argumentando "estrés académico", es un retroceso social inaceptable que solo ensanchará la desigualdad que la política intentaba combatir.`,
    preguntas: [
      {
        id: 3021,
        texto_index: -1,
        enunciado: '¿En qué punto central respecto a la Jornada Escolar Completa (JEC) ESTÁN DE ACUERDO ambos autores?',
        alternativas: {
          A: 'En que la JEC debe ser eliminada y reemplazada por educación en el hogar.',
          B: 'En que la JEC ha logrado igualar completamente los resultados académicos entre distintas clases sociales.',
          C: 'En que la implementación actual de la JEC tiene deficiencias, como la falta de infraestructura y talleres diversos.',
          D: 'En que la JEC ha aumentado la delincuencia en los barrios vulnerables.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Comparación precisa! 🤝 Ambos coinciden en el diagnóstico técnico: faltan talleres, arte, deporte e infraestructura (el Texto 1 dice que "carecían de infraestructura deportiva, artística", el Texto 2 pide "talleres deportivos, arte y música").',
        feedback_error: 'Busca el diagnóstico del problema en cada texto. El Texto 1 dice "carecían de infraestructura deportiva, artística". El Texto 2 dice "necesitamos recursos para talleres deportivos... arte y música". Ambos ven la misma falla técnica.'
      },
      {
        id: 3022,
        texto_index: -1,
        enunciado: 'La principal DISCREPANCIA (desacuerdo) entre los autores radica en:',
        alternativas: {
          A: 'La solución al problema: el Texto 1 propone reducir la jornada, mientras que el Texto 2 propone mantenerla pero financiarla y mejorarla.',
          B: 'Las causas del problema: el Texto 1 culpa a los profesores, mientras que el Texto 2 culpa al narcotráfico.',
          C: 'El impacto en la salud: el Texto 1 niega el estrés estudiantil, mientras que el Texto 2 cree que es el problema central.',
          D: 'El propósito original de la ley: el Texto 1 afirma que fue un error desde la idea, el Texto 2 cree que fue mala solo en la práctica.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! ⚔️ Frente al mismo problema (mala implementación), sacan conclusiones opuestas: el T1 pide retroceder ("reducir la jornada"), y el T2 pide avanzar ("inyectar recursos y mantenerla").',
        feedback_error: 'Identifica la conclusión final de cada autor. ¿Qué propone hacer el Texto 1 al final del segundo párrafo? ¿Qué propone el Texto 2 al final de su argumentación?'
      },
      {
        id: 3023,
        texto_index: -1,
        enunciado: '¿Cómo responde implícitamente el argumento del Texto 2 a la propuesta de "tiempo para juego libre" planteada en el Texto 1?',
        alternativas: {
          A: 'Acepta que el juego libre es necesario, pero argumenta que debe realizarse solo los fines de semana.',
          B: 'La descalifica por tener un "sesgo de clase", señalando que el tiempo libre en sectores vulnerables no significa juego seguro, sino exposición a la calle.',
          C: 'Propone que el juego libre sea evaluado con notas dentro de la malla curricular.',
          D: 'Niega que los adolescentes necesiten tiempo de ocio en su desarrollo psicológico.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Intertextualidad captada! 🧠 El T2 ataca el argumento del T1 directo al hueso: "quienes abogan por devolver el tiempo libre asumen que volverán a una casa segura... eso es sesgo de clase".',
        feedback_error: 'Revisa el primer párrafo del Texto 2. El autor responde directamente a la idea de "tiempo libre", argumentando que esa romantización asume privilegios que los alumnos vulnerables no tienen.'
      },
      {
        id: 3024,
        texto_index: -1,
        enunciado: 'Según el Texto 2, reducir la jornada basándose en el argumento del "estrés académico" (mencionado en el Texto 1) es un error porque:',
        alternativas: {
          A: 'El estrés académico es un invento de las nuevas generaciones.',
          B: 'La verdadera función de la JEC en sectores vulnerables es también de protección social y bienestar básico, no solo académica.',
          C: 'Los estudios demuestran que más horas de matemáticas curan el estrés adolescente.',
          D: 'Los colegios privados tienen jornadas aún más largas.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente análisis! 🛡️ El T2 argumenta que la escuela brinda almuerzo y protección frente al narcotráfico; por ende, cerrar antes (por temas académicos o de estrés) quita una red de seguridad vital a niños pobres.',
        feedback_error: 'Lee el segundo párrafo del Texto 2. ¿Qué otras cosas, aparte de estudiar, entrega la escuela a los alumnos vulnerables (almuerzo, protección)?'
      }
    ]
  },

  // ── NODO ev-13: Detectar prejuicios y creencias subyacentes ──
  'test-ev-13': {
    id: 'test-ev-13',
    seccionId: 'ev-13',
    contexto_base: `[Entrevista a un director corporativo sobre políticas de teletrabajo]

"Nosotros tomamos la decisión de volver a la presencialidad total en la oficina de cinco días a la semana. Durante la pandemia probamos el modelo híbrido y el teletrabajo, y aunque algunos números de productividad individual se mantuvieron, la cultura de la empresa se estaba desmoronando. 

Siendo totalmente honesto, el problema del teletrabajo es el compromiso. Cuando la gente está en su casa, en buzo, con la televisión prendida de fondo o cuidando a los niños, no tiene la mentalidad de 'tiburón' que exige el mercado actual. Pierden el hambre de ascender. Los verdaderos líderes de nuestra organización son los que llegan a la oficina a las 8:00 AM, interactúan en los pasillos y están visibles cuando se necesita tomar una decisión difícil. 

He notado especialmente que el talento joven se ha ablandado. Las nuevas generaciones exigen 'equilibrio vida-trabajo' antes de haber demostrado que merecen ese privilegio. La oficina construye carácter, disciplina y orden; trabajar desde el sofá de la casa construye conformidad."`,
    preguntas: [
      {
        id: 3031,
        enunciado: '¿Qué creencia subyacente (asunción) guía la argumentación del director corporativo respecto al trabajo en casa?',
        alternativas: {
          A: 'Asume que los sistemas informáticos hogareños son inseguros para los datos de la empresa.',
          B: 'Asume automáticamente que el entorno doméstico (hogar, ropa cómoda, familia) es incompatible con la concentración, el esfuerzo y el éxito profesional.',
          C: 'Asume que el transporte público quita demasiadas horas a la jornada laboral.',
          D: 'Asume que el teletrabajo es ilegal en el contexto laboral actual.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Prejuicio detectado! 👁️‍🗨️ El director equipara estar en casa ("en buzo", "cuidando niños") con perder el compromiso y volverse "conforme". Asocia erróneamente la formalidad física con el desempeño.',
        feedback_error: 'Lee el segundo párrafo. El director menciona estar "en buzo" o "cuidando niños". ¿Qué valor de rendimiento le otorga a esos elementos domésticos?'
      },
      {
        id: 3032,
        enunciado: 'La afirmación "Las nuevas generaciones exigen equilibrio vida-trabajo antes de haber demostrado que merecen ese privilegio" revela un prejuicio generacional. ¿En qué consiste este prejuicio?',
        alternativas: {
          A: 'En creer que los jóvenes son más inteligentes en el uso de la tecnología que los mayores.',
          B: 'En suponer que el tiempo libre y el respeto a la vida personal son recompensas que deben ganarse mediante el sacrificio extremo, y que los jóvenes son "blandos" por exigirlos como derechos básicos.',
          C: 'En considerar que las nuevas generaciones deberían jubilarse a una edad más tardía.',
          D: 'En afirmar que los jóvenes actuales no tienen formación académica suficiente para el mercado.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente evaluación ética! ⚖️ El hablante trata un derecho (el equilibrio vida-trabajo) como un "privilegio" que debe comprarse con sacrificio y agotamiento (cultura del sobreesfuerzo).',
        feedback_error: 'La frase clave es llamar "privilegio" a algo que los jóvenes reclaman como derecho. ¿Qué opina el autor sobre las generaciones que no quieren sacrificar su vida por la empresa?'
      },
      {
        id: 3033,
        enunciado: '¿Qué falacia lógica comete el entrevistado al definir a los "verdaderos líderes"?',
        alternativas: {
          A: 'Ataca a la competencia (ad hominem) en lugar de defender a su propia empresa.',
          B: 'Confunde la causa con el efecto (falsa causalidad): cree que llegar temprano te hace líder, cuando es el liderazgo el que te hace madrugar.',
          C: 'Equipara falsamente la "visibilidad" física (llegar a las 8 AM, estar en el pasillo) con la competencia y el liderazgo real.',
          D: 'Usa estadísticas falsas y números inventados para apoyar su idea.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Bien! 🕴️ Es el sesgo de "presentismo". El director mide el liderazgo no por los resultados o habilidades, sino por quién se deja ver en la oficina (la apariencia del trabajo).',
        feedback_error: 'El director dice que los líderes son los que "llegan a las 8 AM" y "están visibles en los pasillos". ¿Esas acciones definen realmente la capacidad de liderar un equipo o solo describen presencia física?'
      },
      {
        id: 3034,
        enunciado: 'El uso de la expresión "mentalidad de tiburón" por parte del director sugiere un modelo de negocios basado en:',
        alternativas: {
          A: 'La sostenibilidad y protección de la fauna marina.',
          B: 'La agresividad competitiva, la ambición desmedida y la depredación comercial.',
          C: 'El trabajo colaborativo y horizontal entre los empleados.',
          D: 'La adaptación flexible a las nuevas tecnologías y entornos virtuales.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Interpretación de lenguaje figurado! 🦈 Un tiburón es un depredador agresivo que nunca deja de moverse. El director usa este cliché para glorificar la competitividad despiadada.',
        feedback_error: 'Piensa en las características de un tiburón. ¿Es un animal que colabora, descansa o es un depredador implacable? ¿Qué nos dice eso de la cultura de su empresa?'
      }
    ]
  },

  // ── NODO test-ev-14: Práctica de Textos Pareados (Como Test Normal) ──
  'test-ev-14': {
    id: 'test-ev-14',
    seccionId: 'Gliipc206l6s7iYLoLlZ', // El ID del nodo "Práctica: Textos Pareados"
    contexto_base: `📖 TEXTO A (Fragmento sobre urbanismo)
El automóvil particular fue la peor idea del siglo XX para el diseño de nuestras ciudades. Durante setenta años, hemos demolido barrios históricos, talado parques y ensanchado calles hasta convertirlas en ríos de asfalto, todo para acomodar máquinas que pasan el 95% de su vida útil estacionadas. 

La dependencia del auto ha generado un tejido urbano hostil donde el peatón es un estorbo. El modelo de "ciudad dispersa" obliga a la gente a viajar kilómetros diarios solo para ir al trabajo o comprar pan. La única solución urbana viable para el siglo XXI es la "Ciudad de los 15 minutos": reestructurar los barrios para que escuelas, comercios y salud estén a un cuarto de hora caminando o en bicicleta, declarando la guerra total al vehículo privado en los centros urbanos. El auto debe volver a ser lo que era en sus inicios: un lujo innecesario.

--- DIVISION_TEXTOS ---

📖 TEXTO B (Respuesta en foro de movilidad)
Es muy fácil aplaudir la utopía europea de la "Ciudad de los 15 minutos" desde una oficina de arquitectura céntrica. Los teóricos del urbanismo que abogan por "declarar la guerra al auto" olvidan convenientemente que las ciudades latinoamericanas no fueron planificadas como París o Ámsterdam. 

En nuestras capitales, la periferia concentra la pobreza y el centro concentra las oportunidades laborales y los servicios de calidad. Para una enfermera que vive en Puente Alto y trabaja en el sector oriente en turno de noche, el automóvil que logró comprarse con años de sacrificio no es un "lujo innecesario", es una herramienta de seguridad, dignidad y supervivencia que la salva de un transporte público ineficiente e inseguro. Penalizar o prohibir el uso del automóvil sin antes garantizar equidad territorial, transporte público de primer nivel y seguridad en las calles periféricas, es una política elitista disfrazada de ecologismo.`,
    preguntas: [
      {
        id: 3041,
        texto_index: -1,
        enunciado: '¿Cuál es la postura principal del Texto A respecto a la planificación de las ciudades?',
        alternativas: {
          A: 'Considera que se deben construir más carreteras subterráneas para descongestionar la superficie.',
          B: 'Culpa al transporte público por haber destruido los barrios históricos.',
          C: 'Afirma que el auto arruinó el diseño urbano y propone reestructurar las ciudades para basarlas en distancias caminables.',
          D: 'Propone que los automóviles solo sean utilizados para viajar fuera de las ciudades.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Correcto! 🚶‍♂️ El Texto A acusa al automóvil de destruir la ciudad y propone la "Ciudad de los 15 minutos" (todo a distancia de caminata o bicicleta) como única salida.',
        feedback_error: 'Resume el argumento del Texto A: ¿Quién es el enemigo para el autor y qué modelo de ciudad propone para el siglo XXI?'
      },
      {
        id: 3042,
        texto_index: -1,
        enunciado: '¿Cómo refuta el Texto B la propuesta de la "Ciudad de los 15 minutos" sugerida en el Texto A?',
        alternativas: {
          A: 'Señala que caminar 15 minutos es perjudicial para la salud en ciudades muy contaminadas.',
          B: 'Argumenta que en Latinoamérica la desigualdad territorial hace inviable ese modelo, pues las oportunidades no están cerca de la periferia.',
          C: 'Afirma que las bicicletas son más peligrosas que los automóviles particulares.',
          D: 'Defiende a las empresas automotrices por ser un motor clave de la economía local.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente contraste! 🗺️ El Texto B evidencia que la propuesta del A es una "utopía europea", porque en Latinoamérica las distancias son enormes debido a la segregación económica (periferia pobre vs centro rico).',
        feedback_error: 'Lee el segundo párrafo del Texto B. ¿Qué característica específica de las ciudades latinoamericanas menciona como obstáculo para la ciudad de 15 minutos?'
      },
      {
        id: 3043,
        texto_index: -1,
        enunciado: 'Respecto al automóvil particular, la diferencia de enfoque entre ambos autores es que:',
        alternativas: {
          A: 'El Texto A lo ve como una herramienta de trabajo, mientras el Texto B lo ve como un elemento de lujo.',
          B: 'Ambos autores concuerdan en que es un medio altamente contaminante, pero difieren en cómo reciclarlo.',
          C: 'El Texto A lo define como un "lujo innecesario" y destructor de espacios, mientras el Texto B lo defiende como una necesidad de seguridad y supervivencia para sectores vulnerables.',
          D: 'El Texto A cree que pasará de moda, mientras el Texto B cree que evolucionará a motores eléctricos.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Análisis comparativo preciso! 🚗 Para el urbanista (T1), el auto es un cáncer estético y espacial. Para el trabajador periférico (T2), el auto suple las carencias del Estado (seguridad, transporte malo).',
        feedback_error: 'Busca la expresión "lujo innecesario" en el Texto A y fíjate cómo le responde exactamente el Texto B usando esas mismas comillas ("lujo innecesario"). ¿Qué significado le da cada uno?'
      },
      {
        id: 3044,
        texto_index: -1,
        enunciado: 'El Texto B utiliza el ejemplo de "la enfermera que vive en Puente Alto y trabaja en el sector oriente" para:',
        alternativas: {
          A: 'Humanizar su argumento y demostrar con un caso concreto cómo las políticas anti-auto afectan desproporcionadamente a la clase trabajadora.',
          B: 'Criticar al gremio de la salud por su falta de compromiso ecológico.',
          C: 'Demostrar que las mujeres conducen de manera más segura durante los turnos de noche.',
          D: 'Exigir la construcción de hospitales más cerca de los barrios periféricos.'
        },
        respuesta_correcta: 'A',
        feedback_acierto: '¡Correcto! 🏥 El ejemplo le pone rostro al problema social ("política elitista disfrazada de ecologismo"). Aterriza la discusión teórica de arquitectura a la dura realidad del trabajador de a pie.',
        feedback_error: 'El Texto B critica que las soluciones se piensan desde "una oficina céntrica". ¿Para qué le sirve entonces poner como ejemplo a una persona real, con nombre de oficio y comunas específicas?'
      }
    ]
  },

  // ── BOSS FINAL CAPÍTULO 3 ──
  'test-ev-boss': {
    id: 'test-ev-boss',
    seccionId: 'ev-boss',
    contexto_base: `📖 TEXTO 1: Los algoritmos no tienen prejuicios
La automatización de las decisiones mediante Inteligencia Artificial es el mayor avance en la equidad social desde los derechos civiles. Tradicionalmente, la contratación de personal, la aprobación de créditos bancarios o la asignación de fianzas en tribunales estaban sujetas al juicio humano. Y el ser humano es inherentemente defectuoso: un juez puede ser más severo si tiene hambre, un reclutador puede descartar un currículum por un apellido extranjero, y un banquero puede negar un préstamo por sexismo.

La matemática pura, sin embargo, no tiene raza, género ni humor. Cuando entregamos estas decisiones a sistemas de aprendizaje automático (Machine Learning), eliminamos el factor humano. El algoritmo solo evalúa patrones estadísticos puros de éxito y riesgo. Es eficiencia ciega y neutral. Resistirse a la implementación de sistemas de selección algorítmica por miedo a la tecnología es retrasar la posibilidad de construir, por fin, una sociedad verdaderamente meritocrática y objetiva.

--- DIVISION_TEXTOS ---

📖 TEXTO 2: La matemática armada
Afirmar que los algoritmos son neutrales por estar basados en matemáticas es una falacia de falsa objetividad que la analista de datos Cathy O'Neil denomina "Armas de Destrucción Matemática". La Inteligencia Artificial no piensa en el vacío; aprende a partir de datos históricos. 

Si un algoritmo de contratación revisa el historial de una empresa tecnológica que, durante décadas, priorizó contratar a hombres blancos egresados de ciertas universidades privadas, el sistema matemático no cuestionará si esa política era injusta o racista. Simplemente concluirá matemáticamente: "El patrón de éxito en esta empresa es ser hombre y blanco". Por lo tanto, el algoritmo penalizará automáticamente los currículums de mujeres o minorías, no por "odio", sino por optimización estadística del pasado.

La IA no elimina el sesgo humano; lo automatiza, lo codifica y, lo peor de todo, lo esconde bajo la ilusión de la infalibilidad matemática, haciendo que la discriminación sea mucho más difícil de probar y combatir en un tribunal.`,
    preguntas: [
      {
        id: 3051,
        texto_index: 0,
        enunciado: '¿Cuál es el argumento central del autor del Texto 1 para defender la inteligencia artificial?',
        alternativas: {
          A: 'Los algoritmos operan más rápido y reducen los costos laborales de las empresas.',
          B: 'Los algoritmos están exentos de sesgos emocionales y prejuicios sociales, por lo que garantizan decisiones más justas y neutrales que las humanas.',
          C: 'La inteligencia artificial fue creada específicamente para corregir los errores del sistema judicial.',
          D: 'Las máquinas eventualmente desarrollarán conciencia moral para juzgar mejor a los humanos.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Correcto! 🤖 El autor del T1 sostiene que la matemática "no tiene raza ni género", asumiendo que eliminar la intervención humana elimina automáticamente el prejuicio (meritocracia ciega).',
        feedback_error: 'Identifica la tesis del Texto 1 en el segundo párrafo. El autor compara los errores humanos (hambre, racismo, sexismo) con la "matemática pura". ¿Qué concluye de esa comparación?'
      },
      {
        id: 3052,
        texto_index: 1,
        enunciado: 'En el Texto 2, ¿qué función cumple el ejemplo del "historial de una empresa tecnológica"?',
        alternativas: {
          A: 'Demostrar que las empresas tecnológicas son superiores en sus métodos de reclutamiento.',
          B: 'Ilustrar cómo la IA replica y perpetúa estadísticamente los prejuicios históricos ocultos en los datos con los que es entrenada.',
          C: 'Criticar las políticas de admisión de las universidades privadas mencionadas.',
          D: 'Probar que el algoritmo puede volverse emocionalmente rencoroso contra las mujeres.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Excelente evaluación del recurso! 📊 El T2 usa este ejemplo para destruir la idea de neutralidad: si le das datos racistas/machistas del pasado, la matemática escupirá discriminación optimizada, disfrazada de objetividad.',
        feedback_error: 'El ejemplo muestra una empresa que históricamente discriminó. ¿Qué hace el algoritmo cuando lee ese historial? ¿Lo corrige o lo imita matemáticamente?'
      },
      {
        id: 3053,
        texto_index: -1,
        enunciado: 'Al comparar ambos textos, se evidencia que sostienen concepciones opuestas sobre "el dato" o la "matemática". ¿Cuál de las siguientes opciones describe correctamente esta oposición?',
        alternativas: {
          A: 'El Texto 1 cree que la matemática es una ciencia exacta; el Texto 2 cree que las matemáticas no tienen utilidad social.',
          B: 'El Texto 1 considera que los datos matemáticos son puros y neutrales; el Texto 2 argumenta que los datos están cargados de la historia social e injusticias del ser humano que los generó.',
          C: 'Ambos textos concuerdan en que los algoritmos son neutrales, pero difieren en cómo deben programarse.',
          D: 'El Texto 1 cree que la matemática puede equivocarse; el Texto 2 cree en su infalibilidad.'
        },
        respuesta_correcta: 'B',
        feedback_acierto: '¡Análisis profundo exitoso! ⚖️ Esta es la brecha fundamental: el T1 ve la matemática como un escudo contra el prejuicio humano; el T2 ve la matemática algorítmica como un espejo que refleja el prejuicio humano preexistente.',
        feedback_error: 'Revisa cómo define cada uno a la "matemática". El T1 dice "no tiene raza ni género". El T2 dice "aprende a partir de datos históricos" llenos de injusticias. ¿Qué nos dice eso sobre su naturaleza?'
      },
      {
        id: 3054,
        texto_index: -1,
        enunciado: '¿Cómo evalúa el Texto 2 la conclusión del Texto 1 de que el algoritmo construye una "sociedad meritocrática y objetiva"?',
        alternativas: {
          A: 'La acepta, pero propone que se implemente de manera más lenta para no asustar a la gente.',
          B: 'La rechaza argumentando que la tecnología no ha avanzado lo suficiente para lograr la automatización total.',
          C: 'La denuncia como una "falsa objetividad" o ilusión que en realidad vuelve la discriminación más peligrosa e invisible.',
          D: 'Ignora la conclusión y se centra en los costos económicos de programar IA.'
        },
        respuesta_correcta: 'C',
        feedback_acierto: '¡Intertextualidad perfecta! 🔍 El Texto 2 destroza la premisa del T1, advirtiendo que la IA, al disfrazar los sesgos de "matemática infalible", hace que la discriminación sea más difícil de detectar y combatir.',
        feedback_error: 'Fíjate en las últimas líneas del Texto 2. ¿Qué pasa con el sesgo cuando pasa a ser operado por la IA? ¿Se vuelve "meritocrático" o se "esconde bajo la ilusión de la infalibilidad"?'
      }
    ]
  }

};

async function seedTests() {
  const batch = db.batch();

  for (const [testId, testData] of Object.entries(TESTS_EVALUAR)) {
    const ref = db.collection('lp_tests').doc(testId);
    batch.set(ref, testData, { merge: true });
    console.log(`✅ Preparando: ${testId} — ${testData.preguntas.length} preguntas`);
  }

  await batch.commit();
  console.log('\\n🎉 Todos los tests del Capítulo 3 (evaluar) guardados correctamente.');
}

seedTests()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
