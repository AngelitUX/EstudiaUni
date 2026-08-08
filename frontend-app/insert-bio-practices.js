/**
 * Inserta 6 niveles de práctica en las subramas de Biología caps 1, 2 y 3.
 * Cada práctica va justo ANTES del nivel isProTip de su subrama.
 *
 * Estructura requerida por el componente seccion-biologia-detail.component.ts:
 *   - match-pairs:  { title, description, pairs: [{id, left, right, hint}] }
 *   - categorize:   { title, description, categories: [{id, label}], items: [{id, text, category, hint}] }
 *   - fill-blanks:  { title, description, items: [{id, textBefore, textAfter, options, correctOption, hint}] }
 */
const fs = require('fs');
const path = './src/assets/mocks/capitulos-mock-local.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// ====================================================================
// DEFINICIÓN DE LAS 6 PRÁCTICAS NUEVAS
// ====================================================================
const newPractices = [

  // ──────────────────────────────────────────────────────
  // CAP 1 - SUBRAMA 1: ORGANELOS CELULARES
  // Insertar ANTES de: sec-cbio-1-org-tips
  // ──────────────────────────────────────────────────────
  {
    insertBeforeId: 'sec-cbio-1-org-tips',
    capId: 'cap-cbio-1',
    seccion: {
      id: 'prac-cbio-1-org',
      title: '🧫 Práctica: Identifica los Organelos',
      order: 3.5,
      status: 'locked',
      materiaId: 'ciencias-biologia',
      tags: ['capitulo: 1', 'subcapitulo: organelos', 'admin-pool-biologia'],
      isPractice: true,
      practiceType: 'categorize',
      practiceData: {
        title: '🧫 Clasificador: Organelos Vegetales vs Animales',
        description: 'Clasifica cada organelo o estructura según si está presente en células vegetales, animales, o en ambas.',
        categories: [
          { id: 'animal', label: '🐾 Solo Animal' },
          { id: 'vegetal', label: '🌿 Solo Vegetal' }
        ],
        items: [
          { id: 1,  text: 'Centrosoma (centro organizador de microtúbulos para la mitosis)',   category: 'animal',  hint: 'Las células vegetales no tienen centrosoma típico.' },
          { id: 2,  text: 'Pared celular de celulosa',                                          category: 'vegetal', hint: 'Los animales tienen solo membrana plasmática, sin pared.' },
          { id: 3,  text: 'Cloroplastos (fotosíntesis)',                                        category: 'vegetal', hint: 'Solo los organismos fotosintéticos tienen cloroplastos.' },
          { id: 4,  text: 'Vacuola central de gran tamaño',                                     category: 'vegetal', hint: 'Da turgencia a la célula vegetal. Los animales tienen vacuolas pequeñas.' },
          { id: 5,  text: 'Lisosomas (digestión intracelular)',                                  category: 'animal',  hint: 'Las células vegetales usan la vacuola central para degradar material.' },
          { id: 6,  text: 'Plasmodesmos (canales de comunicación entre células)',               category: 'vegetal', hint: 'Equivalente a las uniones en hendidura de células animales.' },
          { id: 7,  text: 'Cilios y flagelos de estructura 9+2',                               category: 'animal',  hint: 'Muchas células animales (espermios, células respiratorias) los tienen.' }
        ]
      }
    }
  },

  // ──────────────────────────────────────────────────────
  // CAP 1 - SUBRAMA 2: TRANSPORTE CELULAR
  // Insertar ANTES de: sec-cbio-1-trans-tips
  // ──────────────────────────────────────────────────────
  {
    insertBeforeId: 'sec-cbio-1-trans-tips',
    capId: 'cap-cbio-1',
    seccion: {
      id: 'prac-cbio-1-trans',
      title: '🚪 Práctica: Tipos de Transporte Celular',
      order: 8.5,
      status: 'locked',
      materiaId: 'ciencias-biologia',
      tags: ['capitulo: 1', 'subcapitulo: transporte', 'admin-pool-biologia'],
      isPractice: true,
      practiceType: 'match-pairs',
      practiceData: {
        title: '🔗 Pares: Mecanismos de Transporte Celular',
        description: 'Conecta cada mecanismo o concepto de transporte con su descripción correcta.',
        pairs: [
          { id: 1, left: 'Difusión Simple',          right: 'Paso de moléculas pequeñas de alta a baja concentración sin proteínas ni energía', hint: 'Gases como O₂ y CO₂ usan esta vía.' },
          { id: 2, left: 'Difusión Facilitada',       right: 'Paso de moléculas a favor del gradiente usando proteínas de canal o transportadoras', hint: 'La glucosa ingresa a las células por aquaporinas o proteínas GLUT.' },
          { id: 3, left: 'Ósmosis',                   right: 'Difusión del solvente (agua) a través de una membrana semipermeable', hint: 'El agua se mueve hacia el compartimiento de mayor soluto.' },
          { id: 4, left: 'Transporte Activo',         right: 'Mueve moléculas en contra del gradiente de concentración consumiendo ATP', hint: 'La bomba Na⁺/K⁺ ATPasa es el ejemplo clásico.' },
          { id: 5, left: 'Endocitosis',               right: 'La célula engulle material externo formando una vesícula',               hint: 'Los macrófagos fagocitan bacterias por endocitosis.' },
          { id: 6, left: 'Exocitosis',                right: 'La célula expulsa material al exterior mediante fusión de vesícula con membrana', hint: 'Así se secretan neurotransmisores y hormonas.' },
          { id: 7, left: 'Célula en solución hipotónica', right: 'El agua entra → la célula se hincha (turgencia o lisis)', hint: 'Peligro para células animales: pueden estallar (hemólisis).' }
        ]
      }
    }
  },

  // ──────────────────────────────────────────────────────
  // CAP 2 - SUBRAMA 1: SISTEMA NERVIOSO
  // Insertar ANTES de: sec-cbio-2-nerv-tips
  // ──────────────────────────────────────────────────────
  {
    insertBeforeId: 'sec-cbio-2-nerv-tips',
    capId: 'cap-cbio-2',
    seccion: {
      id: 'prac-cbio-2-nerv',
      title: '🧠 Práctica: Sistema Nervioso',
      order: 4.5,
      status: 'locked',
      materiaId: 'ciencias-biologia',
      tags: ['capitulo: 2', 'admin-pool-biologia'],
      isPractice: true,
      practiceType: 'fill-blanks',
      practiceData: {
        title: '⚡ Completar: Neuronas e Impulso Nervioso',
        description: 'Selecciona la palabra correcta para completar cada afirmación sobre el sistema nervioso.',
        items: [
          {
            id: 1,
            textBefore: 'La parte de la neurona que recibe las señales de otras neuronas se llama',
            textAfter: '.',
            options: ['dendrita', 'axón', 'mielina', 'sinapsis'],
            correctOption: 'dendrita',
            hint: 'Las dendritas son las "antenas receptoras" de la neurona.'
          },
          {
            id: 2,
            textBefore: 'La vaina de mielina que recubre el axón permite que el impulso nervioso viaje',
            textAfter: ',  saltando de un nodo de Ranvier al siguiente.',
            options: ['más rápido', 'más lento', 'en ambas direcciones', 'sin consumir energía'],
            correctOption: 'más rápido',
            hint: 'La conducción saltatoria aumenta la velocidad de conducción hasta 100 m/s.'
          },
          {
            id: 3,
            textBefore: 'El espacio entre dos neuronas donde se transmite la señal química se denomina',
            textAfter: '.',
            options: ['sinapsis', 'axón', 'ganglio', 'nervio'],
            correctOption: 'sinapsis',
            hint: 'Los neurotransmisores cruzan la hendidura sináptica para transmitir la señal.'
          },
          {
            id: 4,
            textBefore: 'El Sistema Nervioso Autónomo Simpático prepara al organismo para la respuesta de',
            textAfter: ',  liberando adrenalina.',
            options: ['"lucha o huida"', '"descanso y digestión"', '"sueño y reparación"', '"aprendizaje y memoria"'],
            correctOption: '"lucha o huida"',
            hint: 'Aumenta la frecuencia cardíaca, dilata pupilas y moviliza energía.'
          },
          {
            id: 5,
            textBefore: 'El arco reflejo es una respuesta involuntaria que NO pasa por el',
            textAfter: 'y se procesa directamente en la médula espinal.',
            options: ['cerebro', 'ganglio', 'nervio motor', 'receptor'],
            correctOption: 'cerebro',
            hint: 'Por eso la rodilla salta antes de que "pienses" en hacerlo.'
          },
          {
            id: 6,
            textBefore: 'Las drogas depresoras del SNC como el alcohol',
            textAfter: 'la actividad neuronal, enlenteciendo los reflejos y la cognición.',
            options: ['disminuyen', 'aumentan', 'no afectan', 'estabilizan'],
            correctOption: 'disminuyen',
            hint: 'Potencian los neurotransmisores inhibidores como el GABA.'
          }
        ]
      }
    }
  },

  // ──────────────────────────────────────────────────────
  // CAP 2 - SUBRAMA 2: REPRODUCCIÓN Y SEXUALIDAD
  // Insertar ANTES de: sec-cbio-2-repr-tips
  // ──────────────────────────────────────────────────────
  {
    insertBeforeId: 'sec-cbio-2-repr-tips',
    capId: 'cap-cbio-2',
    seccion: {
      id: 'prac-cbio-2-repr',
      title: '🔬 Práctica: Reproducción y Ciclos',
      order: 9.5,
      status: 'locked',
      materiaId: 'ciencias-biologia',
      tags: ['capitulo: 2', 'admin-pool-biologia'],
      isPractice: true,
      practiceType: 'categorize',
      practiceData: {
        title: '🔀 Clasificador: Reproducción Sexual vs Asexual',
        description: 'Clasifica cada característica o ejemplo según corresponda a Reproducción Sexual o Asexual.',
        categories: [
          { id: 'sex',   label: '♀♂ Sexual' },
          { id: 'asex',  label: '🔄 Asexual' }
        ],
        items: [
          { id: 1,  text: 'Genera diversidad genética mediante recombinación',                    category: 'sex',  hint: 'La combinación de gametos de dos progenitores crea individuos únicos.' },
          { id: 2,  text: 'Bacterias que se dividen por fisión binaria',                          category: 'asex', hint: 'Producen clones genéticamente idénticos al progenitor.' },
          { id: 3,  text: 'Fecundación de un óvulo por un espermio',                             category: 'sex',  hint: 'Une dos gametos haploides (n) para formar un cigoto diploide (2n).' },
          { id: 4,  text: 'Planaria que se regenera tras ser cortada',                           category: 'asex', hint: 'Fragmentación: cada fragmento origina un nuevo individuo.' },
          { id: 5,  text: 'Requiere únicamente un progenitor',                                   category: 'asex', hint: 'Los organismos asexuales no necesitan pareja para reproducirse.' },
          { id: 6,  text: 'Involucra gametos haploides formados por meiosis',                    category: 'sex',  hint: 'La meiosis reduce el número cromosómico a la mitad para la reproducción sexual.' },
          { id: 7,  text: 'Propagación de plantas mediante esquejes o estolones',                category: 'asex', hint: 'Son copias genéticas exactas de la planta madre.' },
          { id: 8,  text: 'Produce descendencia con mayor variabilidad adaptativa',              category: 'sex',  hint: 'Es una ventaja evolutiva frente a cambios ambientales.' }
        ]
      }
    }
  },

  // ──────────────────────────────────────────────────────
  // CAP 3 - SUBRAMA 1: DIVISIÓN CELULAR
  // Insertar ANTES de: sec-cbio-3-cell-tips
  // ──────────────────────────────────────────────────────
  {
    insertBeforeId: 'sec-cbio-3-cell-tips',
    capId: 'cap-cbio-3',
    seccion: {
      id: 'prac-cbio-3-cell',
      title: '🔬 Práctica: Mitosis vs Meiosis',
      order: 3.5,
      status: 'locked',
      materiaId: 'ciencias-biologia',
      tags: ['capitulo: 3', 'admin-pool-biologia'],
      isPractice: true,
      practiceType: 'match-pairs',
      practiceData: {
        title: '🧬 Pares: Mitosis, Meiosis y Ciclo Celular',
        description: 'Conecta cada concepto del ciclo celular con su descripción correcta.',
        pairs: [
          { id: 1, left: 'Interfase',       right: 'Fase de preparación: la célula crece y duplica su ADN antes de dividirse',           hint: 'Incluye las fases G1, S y G2. Ocupa ~90% del ciclo.' },
          { id: 2, left: 'Mitosis',         right: 'División que genera 2 células hijas diploides idénticas (2n → 2n + 2n)',            hint: 'Función: crecimiento, reparación y reproducción asexual.' },
          { id: 3, left: 'Meiosis',         right: 'División que genera 4 células haploides con combinación genética única (2n → 4n)',   hint: 'Ocurre en gónadas para producir gametos.' },
          { id: 4, left: 'Crossing-over',   right: 'Intercambio de segmentos de cromátidas homólogas durante Profase I de meiosis',      hint: 'Causa principal de variabilidad genética en la reproducción sexual.' },
          { id: 5, left: 'Citocinesis',     right: 'División del citoplasma tras la división nuclear, produciendo dos células',          hint: 'Ocurre al final de la mitosis y de cada división meiótica.' },
          { id: 6, left: 'Punto de control G1/S', right: 'Verificación del tamaño celular y disponibilidad de nutrientes antes de copiar el ADN', hint: 'Si algo falla, la célula puede entrar en apoptosis.' }
        ]
      }
    }
  },

  // ──────────────────────────────────────────────────────
  // CAP 3 - SUBRAMA 2: BIOTECNOLOGÍA Y EVOLUCIÓN
  // Insertar ANTES de: sec-cbio-3-evo-tips
  // ──────────────────────────────────────────────────────
  {
    insertBeforeId: 'sec-cbio-3-evo-tips',
    capId: 'cap-cbio-3',
    seccion: {
      id: 'prac-cbio-3-evo',
      title: '🌿 Práctica: Evolución y Selección Natural',
      order: 8.5,
      status: 'locked',
      materiaId: 'ciencias-biologia',
      tags: ['capitulo: 3', 'admin-pool-biologia'],
      isPractice: true,
      practiceType: 'fill-blanks',
      practiceData: {
        title: '🦎 Completar: Teoría de la Evolución',
        description: 'Selecciona la opción correcta para completar cada concepto evolutivo clave.',
        items: [
          {
            id: 1,
            textBefore: 'La selección natural actúa sobre las',
            textAfter: 'de los individuos, favoreciendo a quienes mejor se adaptan al ambiente.',
            options: ['variaciones heredables', 'mutaciones espontáneas', 'generaciones futuras', 'especies extintas'],
            correctOption: 'variaciones heredables',
            hint: 'Darwin: la variación existe, es heredable, y el ambiente selecciona la más apta.'
          },
          {
            id: 2,
            textBefore: 'Las estructuras homólogas (como el brazo humano y la aleta de un delfín) son evidencia de un',
            textAfter: 'común entre las especies.',
            options: ['ancestro', 'ambiente', 'gen', 'fósil'],
            correctOption: 'ancestro',
            hint: 'Misma estructura básica, distinta función: evidencia de evolución divergente.'
          },
          {
            id: 3,
            textBefore: 'En la biotecnología, la técnica PCR (Reacción en Cadena de la Polimerasa) sirve para',
            textAfter: 'fragmentos específicos de ADN.',
            options: ['amplificar', 'destruir', 'silenciar', 'mutar'],
            correctOption: 'amplificar',
            hint: 'La PCR hace millones de copias de un segmento de ADN en pocas horas.'
          },
          {
            id: 4,
            textBefore: 'El aislamiento reproductivo entre poblaciones es un mecanismo clave para que ocurra la',
            textAfter: 'en el origen de nuevas especies.',
            options: ['especiación', 'mutación', 'selección artificial', 'deriva génica'],
            correctOption: 'especiación',
            hint: 'Si dos poblaciones no se mezclan, acumulan diferencias genéticas hasta ser especies distintas.'
          },
          {
            id: 5,
            textBefore: 'Los fósiles, la anatomía comparada y el ADN mitocondrial son tipos de',
            textAfter: 'de la evolución.',
            options: ['evidencias', 'teorías', 'hipótesis', 'leyes'],
            correctOption: 'evidencias',
            hint: 'Múltiples líneas independientes de evidencia apoyan la teoría evolutiva.'
          },
          {
            id: 6,
            textBefore: 'La deriva génica, a diferencia de la selección natural, es un cambio en las frecuencias alélicas debido al',
            textAfter: ',  especialmente marcado en poblaciones pequeñas.',
            options: ['azar', 'ambiente', 'fitness', 'apareamiento selectivo'],
            correctOption: 'azar',
            hint: 'El "Efecto fundador" y el "Cuello de botella" son ejemplos de deriva génica.'
          }
        ]
      }
    }
  }
];

// ====================================================================
// INSERCIÓN DE LAS PRÁCTICAS EN EL JSON
// ====================================================================
let inserted = 0;

newPractices.forEach(function(p) {
  // Encontrar el capítulo
  const cap = data.find(c => c.id === p.capId);
  if (!cap) { console.log('ERROR: no se encontró cap ' + p.capId); return; }

  // Encontrar el índice del tip PAES donde insertar ANTES
  const idx = cap.secciones.findIndex(s => s.id === p.insertBeforeId);
  if (idx === -1) { console.log('ERROR: no se encontró sección destino ' + p.insertBeforeId); return; }

  // Verificar que no exista ya
  if (cap.secciones.find(s => s.id === p.seccion.id)) {
    console.log('⚠ Ya existe: ' + p.seccion.id + ' (omitiendo)');
    return;
  }

  // Insertar
  cap.secciones.splice(idx, 0, p.seccion);
  console.log('✓ Insertado: ' + p.seccion.id + ' antes de ' + p.insertBeforeId + ' (índice ' + idx + ')');
  inserted++;
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ Completado. ' + inserted + '/6 prácticas insertadas.');
console.log('   JSON válido, total capítulos: ' + data.length);
