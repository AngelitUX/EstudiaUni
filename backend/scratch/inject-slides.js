const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, '../../frontend-app/src/assets/mocks/capitulos-mock-local.json');
const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));

// ─── DATA LENGUAJE ───
const LENGUAJE_QUIZZES = {
  quiz1: [
    { key: 'A', text: 'Porque son los seres más resistentes a condiciones extremas.', correct: false, explain: '❌ Trampa: información real, pero no responde el "por qué" del apodo.' },
    { key: 'B', text: 'Porque miden entre 0,1 y 1,5 milímetros.', correct: false, explain: '❌ Trampa: dato numérico que desvía la atención.' },
    { key: 'C', text: 'Debido a su aspecto físico y su hábitat en zonas de humedad.', correct: true, explain: '✅ Paráfrasis: "aspecto físico" = "apariencia", "zonas de humedad" = "lugares húmedos".' },
  ],
  quiz2: [
    { key: 'A', text: 'Modificar las moléculas de agua.', correct: false, explain: '❌ El texto no habla de modificar moléculas.' },
    { key: 'B', text: 'Eliminar impurezas y microorganismos para hacerla segura.', correct: true, explain: '✅ Paráfrasis: "contaminantes" = "impurezas", "patógenos" = "microorganismos", "apta para consumo" = "segura".' },
    { key: 'C', text: 'Añadirle minerales esenciales para la salud.', correct: false, explain: '❌ Inventa información que el texto no contiene.' },
  ]
};

const LENGUAJE_SLIDES = [
  {
    icon: '🔍', title: '¿Qué significa "Localizar"?',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: '<p>Según el DEMRE, <strong>Localizar</strong> consiste en <span class="hl">identificar, reconocer y extraer información</span> que está escrita de forma textual (explícita) en la lectura.</p><p>Tu misión es simple:</p><div class="mini-cards"><div class="mc red">🚫 NO adivinar</div><div class="mc red">🚫 NO deducir</div><div class="mc red">🚫 NO opinar</div><div class="mc green">✅ SÍ buscar el dato exacto</div></div>'
  },
  {
    icon: '💡', title: 'La Regla de Oro',
    bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)',
    content: '<div class="big-rule"><p>"Si la respuesta <strong>no está en el texto</strong> — ya sea con las mismas palabras o con sinónimos — entonces es una <span class="hl-red">alternativa incorrecta</span>."</p></div><p>Esto distingue a Localizar de <em>Interpretar</em> (donde sí deduces) y de <em>Evaluar</em> (donde juzgas). Aquí solo <strong>buscas</strong>.</p><div class="callout">📊 Esta habilidad representa el <strong>~30% de las preguntas</strong> de Competencia Lectora. Dominarla = asegurar puntos "fáciles".</div>'
  },
  {
    icon: '📝', title: 'Ejercicio 1: Texto científico', interactive: true, quizId: 'quiz1',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.04), rgba(239,68,68,0.04))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: '<p><strong>¡Elige tu respuesta!</strong></p><div class="paes-text">📖 "Los <strong>tardígrados</strong> son los seres vivos más resistentes a condiciones extremas. Estos diminutos invertebrados, de entre 0,1 y 1,5 mm, son comúnmente conocidos como <strong>"osos de agua"</strong> por su <em>apariencia</em> y porque <em>viven en lugares húmedos</em> como musgos."</div><p>❓ ¿Por qué a los tardígrados se les conoce como "osos de agua"?</p>'
  },
  {
    icon: '🚀', title: '¡Estás listo!',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.08), rgba(255,200,0,0.06))',
    iconBg: 'linear-gradient(135deg, #ffc800, #ff9600)',
    content: '<div class="cta-inner"><span class="big-icon">🏆</span><p>Ya dominas la teoría y la técnica. Ahora entrena en la ruta con textos reales.</p></div>'
  }
];

// ─── DATA MATEMÁTICA ───
const MAT1_QUIZZES = {
  m1_quiz1: [
    { key: 'A', text: '4', correct: false, explain: '❌ ¡Cuidado con los signos! $4 - 6 = -2$.' },
    { key: 'B', text: '8', correct: true, explain: '✅ ¡Excelente! $2 - 3(-2) = 2 + 6 = 8$.' },
    { key: 'C', text: '-1', correct: false, explain: '❌ Recuerda la jerarquía: primero el paréntesis, luego la multiplicación.' },
    { key: 'D', text: '2', correct: false, explain: '❌ Revisa el cálculo paso a paso.' }
  ]
};

const MAT1_SLIDES = [
  {
    icon: '🔢', title: 'Conjuntos Numéricos',
    bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
    iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)',
    content: '<p>En la PAES de Matemática, los números son la base de todo. Debes dominar:</p><ul><li><strong>Enteros ($\\\\mathbb{Z}$):</strong> ..., $-2, -1, 0, 1, 2, ...$</li><li><strong>Racionales ($\\\\mathbb{Q}$):</strong> Fracciones y decimales.</li><li><strong>Reales ($\\\\mathbb{R}$):</strong> Incluye raíces e irracionales.</li></ul><div class="callout">🎯 La clave es no cometer errores de signos en operaciones básicas.</div>'
  },
  {
    icon: '⚡', title: 'Prioridad de Operaciones',
    bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
    iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)',
    content: '<p>Para no perderte, usa el método <strong>PAPOMUDAS</strong>:</p><ol><li><strong>PA</strong>réntesis</li><li><strong>PO</strong>tencias</li><li><strong>MU</strong>ltiplicación y <strong>DI</strong>visión</li><li><strong>A</strong>dición y <strong>S</strong>ustracción</li></ol><div class="example-box"><div class="ex-label">Ejemplo:</div><p>$5 + 2 \\\\cdot 3^2 = 5 + 2 \\\\cdot 9 = 5 + 18 = 23$.</p></div>'
  },
  {
    icon: '📝', title: 'Desafío Rápido', interactive: true, quizId: 'm1_quiz1',
    bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.04), rgba(88,204,2,0.04))',
    iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)',
    content: '<p>Aplica la jerarquía de operaciones:</p><p class="paes-text" style="font-size:1.2rem; text-align:center;">$2 - 3 \\\\cdot (4 - 6)$</p>'
  },
  {
    icon: '🎯', title: '¡Dominado!',
    bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.08), rgba(255,200,0,0.06))',
    iconBg: 'linear-gradient(135deg, #58cc02, #46a302)',
    content: '<div class="cta-inner"><span class="big-icon">📐</span><p>¡Has reforzado las bases! Estás listo para avanzar a los ejercicios de planteo.</p></div>'
  }
];

// Actualizar Mock
mockData.forEach(cap => {
  if (cap.id === 'cap-m1-1-numeros') {
    cap.slides = MAT1_SLIDES;
    cap.quizzes = MAT1_QUIZZES;
  }
});

fs.writeFileSync(mockPath, JSON.stringify(mockData, null, 2));
console.log('✅ Mock local actualizado con slides solo para Matemática M1.');
