import { Seccion } from '../models/paes.models';

// ════════════════════════════════════════════
// NODO 4 — Sinónimos y paráfrasis (Texto narrativo)
// ════════════════════════════════════════════
export const NODO4_PARÁFRASIS_NARRATIVO: Seccion = {
  id: 'loc-n4',
  capituloId: 'cap-localizar',
  materiaId: 'comp-lectora',
  title: 'Paráfrasis en textos narrativos',
  introduccion: '🎭 Último nodo antes del Jefe Final. Ahora combinas paráfrasis + narrativa. Las alternativas reformulan acciones y descripciones del relato.',
  guia_titulo: '❓ ¿Cómo funciona la paráfrasis en cuentos?',
  guia_contenido: 'En un relato, el texto dice "corrió despavorido" y la alternativa correcta dice "huyó con miedo". Mismo evento, distintas palabras. Enfócate en QUÉ ocurrió, no en CÓMO lo dijo el autor.',
  datos_claves: [
    '🎬 **Tip 1:** Traduce las **acciones del personaje a tus propias palabras**. Si tu resumen coincide con una alternativa, esa es la correcta.',
    '🌄 **Tip 2:** Las descripciones de ambiente también se parafrasean: "la noche cayó sobre el valle" puede aparecer como "oscureció en la zona".'
  ],
  order: 4,
  test: {
    id: 'test-loc-n4',
    seccionId: 'loc-n4',
    contexto_base: 'El viejo Tomás despertó antes del alba y preparó café en la cocina de leña. Desde la ventana observó cómo la escarcha cubría los pastizales del fundo como un manto plateado. Tomó su bastón de coigüe y salió al corral, donde las ovejas se apiñaban unas contra otras buscando calor. Contó veintitrés cabezas; faltaba una. Recorrió el cerco perimetral hasta encontrar un hueco en la esquina norte, donde el alambre había cedido por el óxido. Siguió las huellas sobre el barro helado durante casi una hora, cuesta arriba por el sendero que conducía al estero. Encontró a la oveja atrapada entre unos matorrales de zarzamora, con la lana enredada en las espinas. La liberó con paciencia, cortando rama por rama con su cuchillo, y la cargó sobre sus hombros para el camino de regreso. Cuando llegó al fundo, el sol ya asomaba tibio tras los cerros.',
    preguntas: [
      {
        id: 10,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: '¿Cómo logró Tomás rescatar a la oveja según el texto?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'La atrajo con alimento hasta sacarla de los matorrales.',
          B: 'Removió la vegetación espinosa de forma cuidadosa usando una herramienta cortante.',
          C: 'Pidió ayuda a un vecino para cortar las ramas.',
          D: 'Tiró de la oveja con fuerza hasta liberarla del arbusto.'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '🎯 ¡Paráfrasis detectada! El texto dice "cortando rama por rama con su cuchillo" → la B dice "removió la vegetación espinosa usando una herramienta cortante". Mismo evento, otras palabras.',
        feedback_error: 'Lee la escena del rescate. "Cortando rama por rama con su cuchillo" → ¿qué alternativa reformula esa acción sin usar las mismas palabras? 🔄'
      },
      {
        id: 11,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: '¿Qué permitió a Tomás descubrir la causa de la desaparición de la oveja?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'El ladrido de sus perros le indicó la dirección correcta.',
          B: 'La inspección de la barrera perimetral reveló una abertura en el cercado.',
          C: 'Observó a la oveja escapar desde la ventana de su cocina.',
          D: 'Un vecino le informó que vio a la oveja subir por el cerro.'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '🏆 ¡Excelente! "Recorrió el cerco perimetral hasta encontrar un hueco" → la B parafrasea: "inspección de la barrera perimetral reveló una abertura en el cercado". Cerco = barrera, hueco = abertura.',
        feedback_error: 'Busca qué hizo Tomás después de contar las ovejas. "Recorrió el cerco" y encontró "un hueco". ¿Qué alternativa dice lo mismo con otras palabras? 🧩'
      },
      {
        id: 12,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: 'De acuerdo con el relato, ¿en qué condiciones climáticas se desarrolla la historia?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'En un día lluvioso con vientos fuertes.',
          B: 'En una jornada de temperaturas bajo cero con suelo congelado.',
          C: 'En una tarde calurosa de verano.',
          D: 'En una mañana nublada con amenaza de tormenta.'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '❄️ ¡Bien hecho! "Escarcha", "barro helado", "buscando calor" → todo indica temperaturas bajo cero y suelo congelado. La B parafrasea correctamente el ambiente.',
        feedback_error: 'Recopila las pistas del clima: "escarcha", "manto plateado", "barro helado", ovejas "buscando calor". ¿Qué alternativa describe esas condiciones con sinónimos? 🌡️'
      }
    ]
  }
};

// ════════════════════════════════════════════
// NODO 5 — Desafío Final: Localizar información
// ════════════════════════════════════════════
export const NODO5_DESAFIO_FINAL: Seccion = {
  id: 'loc-n5-boss',
  capituloId: 'cap-localizar',
  materiaId: 'comp-lectora',
  title: '🏆 Desafío Final: Localizar',
  introduccion: '🔥 ¡Llegaste al Jefe Final del capítulo! Has dominado el rastreo literal y la paráfrasis. Ahora enfrentarás 8 preguntas mezcladas con dos textos distintos. Tiempo sugerido: 15 minutos. ¡Demuestra todo lo que aprendiste!',
  guia_titulo: '💪 ¡Es hora del reto!',
  guia_contenido: 'Has entrenado rastreo literal y paráfrasis en textos informativos y narrativos. Este desafío mezcla TODO. Recuerda: scanning para literales, sinónimos para paráfrasis. ¡Tú puedes!',
  datos_claves: [
    '⏱️ **Estrategia:** Lee primero AMBOS textos rápidamente (1 min cada uno). Luego responde pregunta por pregunta haciendo scanning.',
    '🧠 **Recuerda:** Algunas preguntas serán literales (palabra por palabra) y otras parafraseadas (sinónimos). Identifica cuál es cuál antes de responder.'
  ],
  order: 5,
  isBoss: true,
  test: {
    id: 'test-loc-n5-boss',
    seccionId: 'loc-n5-boss',
    contexto_base: '**TEXTO 1 (Informativo):**\nEl telescopio espacial James Webb, lanzado en diciembre de 2021 por la NASA en colaboración con la Agencia Espacial Europea (ESA) y la Agencia Espacial Canadiense (CSA), comenzó a transmitir sus primeras imágenes científicas en julio de 2022. Con un espejo primario de 6,5 metros de diámetro, compuesto por 18 segmentos hexagonales bañados en oro, el Webb opera principalmente en el rango infrarrojo del espectro electromagnético. Su ubicación orbital, el punto de Lagrange L2 a 1,5 millones de kilómetros de la Tierra, le permite observar el universo sin interferencia térmica de nuestro planeta. Entre sus descubrimientos más relevantes destaca la detección de dióxido de carbono en la atmósfera del exoplaneta WASP-39b, anunciada en agosto de 2022. La doctora María Pérez-Montero, astrónoma del Instituto de Astrofísica de Canarias, calificó este hallazgo como "un paso decisivo hacia la búsqueda de señales de vida fuera del sistema solar".\n\n**TEXTO 2 (Narrativo):**\nSofía revisó por última vez su mochila antes de cruzar el portón de la estación de trenes. Llevaba su cuaderno de bocetos, tres lápices de grafito, una botella de agua y el sobre con los doscientos mil pesos que su abuela le había entregado la noche anterior. El tren hacia Temuco partía a las siete y cuarenta de la mañana. Encontró su asiento junto a la ventanilla del vagón número cuatro y, antes de que el tren se pusiera en marcha, sacó el cuaderno y dibujó el perfil de una mujer mayor que dormía en el asiento de enfrente. Durante las cuatro horas de viaje, completó siete dibujos: la mujer, un niño comiendo pan, el volcán Villarrica asomando entre nubes, las manos del revisor, un perro que ladraba en el andén de Chillán, un vendedor de empanadas y su propio reflejo en el vidrio. Al llegar a Temuco, guardó todo y bajó al andén con una sonrisa. Su tío Ernesto la esperaba con un cartel que decía "Bienvenida, artista".',
    preguntas: [
      {
        id: 13,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: '¿De qué material están bañados los segmentos del espejo del telescopio James Webb?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Plata',
          B: 'Titanio',
          C: 'Oro',
          D: 'Aluminio'
        },
        respuesta_correcta: 'C' as const,
        feedback_acierto: '🎯 ¡Rastreo literal perfecto! "18 segmentos hexagonales bañados en oro".',
        feedback_error: 'Busca en el Texto 1 la descripción del espejo primario. El material está mencionado de forma explícita. 🔍'
      },
      {
        id: 14,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: '¿Cuántos dibujos completó Sofía durante el viaje en tren?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Cinco',
          B: 'Seis',
          C: 'Siete',
          D: 'Ocho'
        },
        respuesta_correcta: 'C' as const,
        feedback_acierto: '✏️ ¡Perfecto! El texto dice "completó siete dibujos" y luego los enumera todos.',
        feedback_error: 'Busca en el Texto 2 la cifra exacta de dibujos. ¡Está escrita con letras! 📖'
      },
      {
        id: 15,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: 'Según el Texto 1, ¿qué sustancia fue identificada en la atmósfera de WASP-39b?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Oxígeno molecular',
          B: 'Un compuesto gaseoso formado por carbono y oxígeno',
          C: 'Vapor de agua',
          D: 'Metano'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '🧩 ¡Paráfrasis detectada! "Dióxido de carbono" = "compuesto gaseoso formado por carbono y oxígeno". Mismo elemento, descrito de otra forma.',
        feedback_error: 'El texto dice "dióxido de carbono". ¿Qué alternativa describe esa misma sustancia con otras palabras? Piensa en su composición química. 🔬'
      },
      {
        id: 16,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: 'De acuerdo con el Texto 2, ¿quién proporcionó el dinero que Sofía llevaba?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Su tío Ernesto',
          B: 'Su madre',
          C: 'Una familiar de generación anterior a sus padres',
          D: 'La propia Sofía con sus ahorros'
        },
        respuesta_correcta: 'C' as const,
        feedback_acierto: '🎭 ¡Bien! "Su abuela" = "familiar de generación anterior a sus padres". La C parafrasea el parentesco sin usar la palabra "abuela".',
        feedback_error: 'Busca quién le entregó el sobre con dinero. ¿Qué alternativa describe a esa persona con otras palabras sin decir su nombre? 🔄'
      },
      {
        id: 17,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: '¿A qué distancia de la Tierra se encuentra el telescopio James Webb?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: '150.000 kilómetros',
          B: '1,5 millones de kilómetros',
          C: '15 millones de kilómetros',
          D: '6,5 millones de kilómetros'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '🚀 ¡Dato literal! "El punto de Lagrange L2 a 1,5 millones de kilómetros de la Tierra".',
        feedback_error: 'Cuidado con los números: 6,5 es el diámetro del espejo. Busca la distancia asociada al "punto de Lagrange L2". 📏'
      },
      {
        id: 18,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: 'Según el Texto 2, ¿qué hizo Sofía antes de que el tren comenzara a moverse?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Se presentó con la mujer del asiento de enfrente.',
          B: 'Inició un retrato a lápiz de una pasajera que descansaba frente a ella.',
          C: 'Revisó el contenido del sobre con dinero.',
          D: 'Llamó a su tío para confirmar la hora de llegada.'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '🖊️ ¡Paráfrasis perfecta! "Sacó el cuaderno y dibujó el perfil de una mujer mayor que dormía" → "Inició un retrato a lápiz de una pasajera que descansaba". Dibujó = retrato, dormía = descansaba.',
        feedback_error: 'Lee qué hizo Sofía "antes de que el tren se pusiera en marcha". ¿Qué alternativa describe esa acción con sinónimos? 🎨'
      },
      {
        id: 19,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: 'Según la doctora Pérez-Montero, ¿cuál es la importancia del hallazgo en WASP-39b?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Confirma la existencia de vida extraterrestre.',
          B: 'Representa un avance significativo en la detección de indicios biológicos extraplanetarios.',
          C: 'Demuestra que el Webb supera a todos los telescopios anteriores.',
          D: 'Permite calcular la distancia exacta al exoplaneta.'
        },
        respuesta_correcta: 'B' as const,
        feedback_acierto: '🌟 ¡Paráfrasis nivel PAES! "Paso decisivo hacia la búsqueda de señales de vida fuera del sistema solar" → "avance significativo en la detección de indicios biológicos extraplanetarios". Paso decisivo = avance significativo, señales de vida = indicios biológicos, fuera del sistema solar = extraplanetarios.',
        feedback_error: 'Lee la cita de la doctora entre comillas. "Paso decisivo hacia la búsqueda de señales de vida fuera del sistema solar". ¿Qué alternativa dice lo mismo pero reformulado? 🧪'
      },
      {
        id: 20,
        preambulo_texto: null,
        preambulo_imagen_url: null,
        enunciado: '¿Cuánto duró el trayecto en tren de Sofía según el Texto 2?',
        formula_latex: null,
        tipo_alternativas: 'texto' as const,
        alternativas: {
          A: 'Tres horas',
          B: 'Cinco horas',
          C: 'Cuatro horas',
          D: 'Seis horas'
        },
        respuesta_correcta: 'C' as const,
        feedback_acierto: '🚂 ¡Literal! "Durante las cuatro horas de viaje". Rastreo directo.',
        feedback_error: 'Busca la mención del tiempo de viaje. El dato está escrito con letras, no con números. ⏱️'
      }
    ]
  }
};
