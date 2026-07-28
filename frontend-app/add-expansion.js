const fs = require('fs');
let data = fs.readFileSync('src/app/features/learning-path/data/seed-data.ts', 'utf8');

const newSections = 
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
        level: 9, order: 14, tags: ['subcapitulo:Práctica'],
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
;

// Find the boss node string to replace it and insert the new ones before it.
// We need to modify the boss node's level and order too.
const bossRegex = /\/\/\s*──\s*DESAFÍO FINAL\s*──\s*\{\s*id:\s*'sec-2-boss'[\s\S]*?level:\s*7,\s*order:\s*10,/;

if (bossRegex.test(data)) {
    const replacement = newSections + 
      // ── DESAFÍO FINAL ──
      {
        id: 'sec-2-boss', capituloId: 'cap-interpretar', materiaId: 'comp-lectora',
        level: 10, order: 15,;

    let finalData = data.replace(bossRegex, replacement);
    fs.writeFileSync('src/app/features/learning-path/data/seed-data.ts', finalData, 'utf8');
    console.log('Successfully expanded seed-data.ts!');
} else {
    console.log('Regex did not match. Let me check the content.');
    const idx = data.indexOf('id: \'sec-2-boss\'');
    console.log('Index of sec-2-boss:', idx);
    if(idx !== -1) {
       console.log('Context:', data.substring(idx - 100, idx + 100));
    }
}