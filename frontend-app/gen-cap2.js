const fs = require('fs');

// We will construct the new sections as a huge string
let out = 
      // LEVEL 1: GUIA
      {
        id: 'sec-2-0-guia',
        title: 'Interpretar textos',
        introduccion: 'Interpretar implica establecer significados a partir de las relaciones entre las diferentes partes del texto. Aprenderás a reconocer la función de los elementos textuales, determinar el significado de expresiones connotativas y establecer conclusiones.',
        guia_titulo: 'Resumen del Capítulo',
        guia_contenido: 'En este capítulo desarrollarás la capacidad de <b>interpretar</b>. Esto significa ir más allá de lo literal y deducir conclusiones, identificar el propósito de un párrafo, o entender el lenguaje figurado.',
        datos_claves: [
          'La interpretación siempre debe basarse en <b>pistas textuales</b>, no en opiniones propias.',
          'Diferenciar entre idea principal (lo central) e ideas secundarias (ejemplos, descripciones) es vital.',
          'Presta atención a las citas, ejemplos y figuras retóricas: siempre cumplen un <b>propósito</b>.'
        ],
        order: 1,
        level: 1,
        isSlideGuide: true,
        tags: ['lectura', 'guia'],
        test: {
          id: 'test-2-0-guia',
          contexto_base: null,
          preguntas: []
        }
      },
      // LEVEL 2: PRO TIP 1
      {
        id: 'sec-2-protip-1',
        title: '¿Inferir o Suponer?',
        introduccion: 'La PAES mide tu capacidad de <b>inferir</b>, no de suponer. Una inferencia es una conclusión lógica y necesaria derivada de pistas textuales. Una suposición es un salto imaginativo basado en tus conocimientos previos. ¡Nunca uses tus conocimientos previos para responder!',
        datos_claves: [
          'Si la alternativa requiere que asumas algo que no dice el texto, <b>descártala</b>.',
          'Busca las huellas o marcas textuales que justifiquen tu inferencia.'
        ],
        order: 2,
        level: 2,
        isProTip: true,
        test: { id: 'test-2-protip-1', contexto_base: null, preguntas: [] }
      },
