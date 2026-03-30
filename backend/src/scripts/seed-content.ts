/**
 * Seed script to populate Firestore with sample PAES content.
 * Run with: npm run seed
 *
 * NOTE: Requires FIREBASE_* environment variables to be configured.
 */
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  } as admin.ServiceAccount),
});

const db = app.firestore();

async function seed() {
  console.log('🌱 Starting seed...');

  // ========== MODULES ==========
  const mathM1Id = 'math-m1';
  const lecturaId = 'lectura';

  await db
    .collection('modules')
    .doc(mathM1Id)
    .set({
      title: 'Matemática M1 (Competencia Matemática 1)',
      subject: 'm1',
      description:
        'Módulo de Matemática M1 para la PAES. Incluye álgebra, funciones, geometría y probabilidades.',
      order: 1,
      iconUrl: '',
      totalTopics: 3,
      isActive: true,
    });

  await db
    .collection('modules')
    .doc(lecturaId)
    .set({
      title: 'Competencia Lectora',
      subject: 'lectura',
      description:
        'Módulo de Comprensión Lectora. Textos literarios y no literarios, vocabulario contextual.',
      order: 2,
      iconUrl: '',
      totalTopics: 3,
      isActive: true,
    });

  // ========== TOPICS - Math M1 ==========
  const mathTopics = [
    {
      id: 'algebra-basica',
      data: {
        title: 'Álgebra Básica y Ecuaciones',
        order: 1,
        prerequisiteTopicIds: [],
        content: {
          summary: 'Conceptos fundamentales de álgebra: expresiones algebraicas, ecuaciones de primer y segundo grado.',
          keyConceptsMarkdown: `# Álgebra Básica y Ecuaciones

## Expresiones Algebraicas
Una **expresión algebraica** combina números, variables y operaciones.

### Ejemplos:
- \`3x + 2\` → expresión lineal
- \`x² - 4x + 3\` → expresión cuadrática

## Ecuaciones de Primer Grado
**Forma:** \`ax + b = 0\`
**Solución:** \`x = -b/a\`

### Ejemplo Resuelto:
\`2x + 6 = 0\`
\`2x = -6\`
\`x = -3\`

## Ecuaciones de Segundo Grado
**Forma:** \`ax² + bx + c = 0\`
**Fórmula general:** \`x = (-b ± √(b²-4ac)) / 2a\`

### Discriminante (Δ = b² - 4ac):
- Δ > 0 → dos soluciones reales distintas
- Δ = 0 → una solución real (doble)
- Δ < 0 → sin soluciones reales`,
          examples: [
            'Resolver: 3x - 9 = 0 → x = 3',
            'Resolver: x² - 5x + 6 = 0 → x = 2 o x = 3',
          ],
          storageRefs: [],
        },
        difficultyLevel: 1,
        estimatedMinutes: 45,
      },
    },
    {
      id: 'funciones-lineales',
      data: {
        title: 'Funciones Lineales y Afines',
        order: 2,
        prerequisiteTopicIds: ['algebra-basica'],
        content: {
          summary: 'Funciones lineales, pendiente, intercepto, gráficos en el plano cartesiano.',
          keyConceptsMarkdown: `# Funciones Lineales y Afines

## Función Lineal
**Forma:** \`f(x) = mx + n\`
- **m** = pendiente (inclinación de la recta)
- **n** = intercepto con el eje Y

## Pendiente
La pendiente indica cuánto sube o baja la recta por cada unidad horizontal.

\`m = (y₂ - y₁) / (x₂ - x₁)\`

- m > 0 → recta creciente
- m < 0 → recta decreciente
- m = 0 → recta horizontal

## Gráfico
Para graficar: marcar el intercepto (0, n) y usar la pendiente para encontrar otro punto.`,
          examples: [
            'f(x) = 2x + 1 → pendiente 2, intercepto 1',
            'Recta por (1,3) y (4,9) → m = (9-3)/(4-1) = 2',
          ],
          storageRefs: [],
        },
        difficultyLevel: 1,
        estimatedMinutes: 40,
      },
    },
    {
      id: 'probabilidades',
      data: {
        title: 'Probabilidades y Estadística Básica',
        order: 3,
        prerequisiteTopicIds: ['algebra-basica'],
        content: {
          summary: 'Probabilidad clásica, eventos, estadística descriptiva básica.',
          keyConceptsMarkdown: `# Probabilidades y Estadística Básica

## Probabilidad Clásica
\`P(A) = casos favorables / casos totales\`

### Propiedades:
- 0 ≤ P(A) ≤ 1
- P(seguro) = 1
- P(imposible) = 0

## Estadística Descriptiva
- **Media** = suma de datos / n
- **Mediana** = valor central al ordenar
- **Moda** = valor más frecuente`,
          examples: [
            'Dado: P(par) = 3/6 = 1/2',
            'Media de {2,4,6} = (2+4+6)/3 = 4',
          ],
          storageRefs: [],
        },
        difficultyLevel: 2,
        estimatedMinutes: 50,
      },
    },
  ];

  for (const topic of mathTopics) {
    await db
      .collection('modules')
      .doc(mathM1Id)
      .collection('topics')
      .doc(topic.id)
      .set(topic.data);
  }

  // ========== TOPICS - Lectura ==========
  const lecturaTopics = [
    {
      id: 'comprension-literal',
      data: {
        title: 'Comprensión Literal',
        order: 1,
        prerequisiteTopicIds: [],
        content: {
          summary: 'Identificar información explícita en textos.',
          keyConceptsMarkdown: `# Comprensión Literal

## ¿Qué es?
La comprensión literal es la capacidad de identificar información **explícita** en un texto: datos, hechos, secuencias.

## Estrategias:
1. Subrayar datos clave
2. Identificar personajes, lugares, fechas
3. Reconocer la secuencia de eventos`,
          examples: [],
          storageRefs: [],
        },
        difficultyLevel: 1,
        estimatedMinutes: 30,
      },
    },
    {
      id: 'comprension-inferencial',
      data: {
        title: 'Comprensión Inferencial',
        order: 2,
        prerequisiteTopicIds: ['comprension-literal'],
        content: {
          summary: 'Deducir información implícita a partir del contexto.',
          keyConceptsMarkdown: `# Comprensión Inferencial

## ¿Qué es?
Deducir información que NO está dicha explícitamente pero se puede concluir del texto.

## Tipos de inferencias:
- **Causa-efecto:** ¿Por qué sucedió algo?
- **Comparación:** ¿En qué se parecen/diferencian?
- **Predicción:** ¿Qué pasará después?`,
          examples: [],
          storageRefs: [],
        },
        difficultyLevel: 2,
        estimatedMinutes: 40,
      },
    },
    {
      id: 'vocabulario-contextual',
      data: {
        title: 'Vocabulario Contextual',
        order: 3,
        prerequisiteTopicIds: ['comprension-literal'],
        content: {
          summary: 'Deducir el significado de palabras por su contexto.',
          keyConceptsMarkdown: `# Vocabulario Contextual

## Estrategia
1. Leer la oración completa
2. Identificar pistas contextuales
3. Proponer un sinónimo
4. Verificar que el sentido se mantiene`,
          examples: [],
          storageRefs: [],
        },
        difficultyLevel: 2,
        estimatedMinutes: 35,
      },
    },
  ];

  for (const topic of lecturaTopics) {
    await db
      .collection('modules')
      .doc(lecturaId)
      .collection('topics')
      .doc(topic.id)
      .set(topic.data);
  }

  // ========== QUESTIONS ==========
  const questions = [
    // Algebra questions
    {
      moduleId: mathM1Id,
      topicId: 'algebra-basica',
      type: 'paes_style',
      stem: 'Si 2x + 8 = 0, ¿cuál es el valor de x?',
      imageUrl: null,
      options: [
        { id: 'A', text: '-4' },
        { id: 'B', text: '4' },
        { id: 'C', text: '-8' },
        { id: 'D', text: '8' },
      ],
      correctOption: 'A',
      explanation: 'Despejando: 2x = -8, luego x = -8/2 = -4.',
      difficulty: 1,
      tags: ['algebra', 'ecuacion-lineal'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'algebra-basica',
      type: 'paes_style',
      stem: '¿Cuáles son las soluciones de x² - 5x + 6 = 0?',
      imageUrl: null,
      options: [
        { id: 'A', text: 'x = 1 y x = 6' },
        { id: 'B', text: 'x = 2 y x = 3' },
        { id: 'C', text: 'x = -2 y x = -3' },
        { id: 'D', text: 'x = 5 y x = 1' },
      ],
      correctOption: 'B',
      explanation: 'Factorizando: (x-2)(x-3) = 0, entonces x = 2 o x = 3.',
      difficulty: 1,
      tags: ['algebra', 'ecuacion-cuadratica'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'algebra-basica',
      type: 'paes_style',
      stem: 'El discriminante de 3x² + 2x + 5 = 0 es:',
      imageUrl: null,
      options: [
        { id: 'A', text: '64' },
        { id: 'B', text: '-56' },
        { id: 'C', text: '56' },
        { id: 'D', text: '-64' },
      ],
      correctOption: 'B',
      explanation: 'Δ = b² - 4ac = 4 - 60 = -56. No tiene soluciones reales.',
      difficulty: 2,
      tags: ['algebra', 'discriminante'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'algebra-basica',
      type: 'quiz',
      stem: 'Simplifica: 6x² / 2x',
      imageUrl: null,
      options: [
        { id: 'A', text: '3x' },
        { id: 'B', text: '3x²' },
        { id: 'C', text: '4x' },
        { id: 'D', text: '12x' },
      ],
      correctOption: 'A',
      explanation: '6x²/2x = 3x (dividir coeficientes y restar exponentes).',
      difficulty: 1,
      tags: ['algebra', 'simplificacion'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'algebra-basica',
      type: 'quiz',
      stem: 'Si x = -2, ¿cuánto vale 3x² - x + 1?',
      imageUrl: null,
      options: [
        { id: 'A', text: '11' },
        { id: 'B', text: '15' },
        { id: 'C', text: '9' },
        { id: 'D', text: '13' },
      ],
      correctOption: 'B',
      explanation: '3(-2)² - (-2) + 1 = 3(4) + 2 + 1 = 12 + 2 + 1 = 15.',
      difficulty: 1,
      tags: ['algebra', 'evaluacion'],
      source: 'Generada',
      isActive: true,
    },
    // Funciones lineales questions
    {
      moduleId: mathM1Id,
      topicId: 'funciones-lineales',
      type: 'paes_style',
      stem: '¿Cuál es la pendiente de la recta que pasa por (1, 3) y (4, 9)?',
      imageUrl: null,
      options: [
        { id: 'A', text: '1' },
        { id: 'B', text: '2' },
        { id: 'C', text: '3' },
        { id: 'D', text: '6' },
      ],
      correctOption: 'B',
      explanation: 'm = (9-3)/(4-1) = 6/3 = 2.',
      difficulty: 1,
      tags: ['funciones', 'pendiente'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'funciones-lineales',
      type: 'paes_style',
      stem: 'La función f(x) = -3x + 7 tiene intercepto en el eje Y igual a:',
      imageUrl: null,
      options: [
        { id: 'A', text: '-3' },
        { id: 'B', text: '7' },
        { id: 'C', text: '3' },
        { id: 'D', text: '-7' },
      ],
      correctOption: 'B',
      explanation: 'El intercepto en Y es el valor de n en f(x) = mx + n, es decir, 7.',
      difficulty: 1,
      tags: ['funciones', 'intercepto'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'funciones-lineales',
      type: 'quiz',
      stem: 'Una recta con pendiente negativa es:',
      imageUrl: null,
      options: [
        { id: 'A', text: 'Creciente' },
        { id: 'B', text: 'Horizontal' },
        { id: 'C', text: 'Decreciente' },
        { id: 'D', text: 'Vertical' },
      ],
      correctOption: 'C',
      explanation: 'Una pendiente m < 0 indica que la recta es decreciente.',
      difficulty: 1,
      tags: ['funciones', 'pendiente'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'funciones-lineales',
      type: 'quiz',
      stem: 'Si f(x) = 2x + 1, ¿cuánto vale f(3)?',
      imageUrl: null,
      options: [
        { id: 'A', text: '5' },
        { id: 'B', text: '6' },
        { id: 'C', text: '7' },
        { id: 'D', text: '8' },
      ],
      correctOption: 'C',
      explanation: 'f(3) = 2(3) + 1 = 6 + 1 = 7.',
      difficulty: 1,
      tags: ['funciones', 'evaluacion'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'funciones-lineales',
      type: 'paes_style',
      stem: '¿Cuál es la ecuación de la recta con pendiente 3 que pasa por el punto (0, -2)?',
      imageUrl: null,
      options: [
        { id: 'A', text: 'y = 3x - 2' },
        { id: 'B', text: 'y = -2x + 3' },
        { id: 'C', text: 'y = 3x + 2' },
        { id: 'D', text: 'y = -3x - 2' },
      ],
      correctOption: 'A',
      explanation: 'y = mx + n, con m = 3 y n = -2 (pasa por (0,-2)).',
      difficulty: 2,
      tags: ['funciones', 'ecuacion-recta'],
      source: 'Generada',
      isActive: true,
    },
    // Probabilidades questions
    {
      moduleId: mathM1Id,
      topicId: 'probabilidades',
      type: 'paes_style',
      stem: 'Al lanzar un dado de 6 caras, ¿cuál es la probabilidad de obtener un número mayor que 4?',
      imageUrl: null,
      options: [
        { id: 'A', text: '1/6' },
        { id: 'B', text: '2/6' },
        { id: 'C', text: '3/6' },
        { id: 'D', text: '4/6' },
      ],
      correctOption: 'B',
      explanation: 'Números mayores que 4: {5, 6} → 2 casos / 6 totales = 2/6 = 1/3.',
      difficulty: 1,
      tags: ['probabilidad', 'clasica'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'probabilidades',
      type: 'paes_style',
      stem: 'La media de los datos {3, 5, 7, 9, 11} es:',
      imageUrl: null,
      options: [
        { id: 'A', text: '5' },
        { id: 'B', text: '7' },
        { id: 'C', text: '9' },
        { id: 'D', text: '35' },
      ],
      correctOption: 'B',
      explanation: 'Media = (3+5+7+9+11)/5 = 35/5 = 7.',
      difficulty: 1,
      tags: ['estadistica', 'media'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'probabilidades',
      type: 'quiz',
      stem: '¿Cuál es la mediana de {2, 8, 4, 6, 10}?',
      imageUrl: null,
      options: [
        { id: 'A', text: '4' },
        { id: 'B', text: '6' },
        { id: 'C', text: '8' },
        { id: 'D', text: '5' },
      ],
      correctOption: 'B',
      explanation: 'Ordenados: {2, 4, 6, 8, 10}. El valor central es 6.',
      difficulty: 1,
      tags: ['estadistica', 'mediana'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'probabilidades',
      type: 'quiz',
      stem: 'La moda de {1, 2, 2, 3, 4, 4, 4, 5} es:',
      imageUrl: null,
      options: [
        { id: 'A', text: '2' },
        { id: 'B', text: '3' },
        { id: 'C', text: '4' },
        { id: 'D', text: '5' },
      ],
      correctOption: 'C',
      explanation: 'La moda es el valor que más se repite: 4 aparece 3 veces.',
      difficulty: 1,
      tags: ['estadistica', 'moda'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: mathM1Id,
      topicId: 'probabilidades',
      type: 'paes_style',
      stem: 'Se lanzan dos monedas. ¿Cuál es la probabilidad de obtener al menos una cara?',
      imageUrl: null,
      options: [
        { id: 'A', text: '1/4' },
        { id: 'B', text: '1/2' },
        { id: 'C', text: '3/4' },
        { id: 'D', text: '1' },
      ],
      correctOption: 'C',
      explanation: 'Casos totales: {CC, CS, SC, SS} = 4. Al menos una cara: {CC, CS, SC} = 3. P = 3/4.',
      difficulty: 2,
      tags: ['probabilidad', 'clasica'],
      source: 'Generada',
      isActive: true,
    },
    // Lectura questions
    {
      moduleId: lecturaId,
      topicId: 'comprension-literal',
      type: 'quiz',
      stem: 'En comprensión literal, ¿qué tipo de información se busca en el texto?',
      imageUrl: null,
      options: [
        { id: 'A', text: 'Información implícita' },
        { id: 'B', text: 'Opiniones del lector' },
        { id: 'C', text: 'Información explícita' },
        { id: 'D', text: 'Interpretaciones simbólicas' },
      ],
      correctOption: 'C',
      explanation: 'La comprensión literal se refiere a identificar la información explícita del texto.',
      difficulty: 1,
      tags: ['comprension', 'literal'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: lecturaId,
      topicId: 'comprension-literal',
      type: 'quiz',
      stem: '¿Cuál de las siguientes es una estrategia de comprensión literal?',
      imageUrl: null,
      options: [
        { id: 'A', text: 'Crear metáforas' },
        { id: 'B', text: 'Subrayar datos clave' },
        { id: 'C', text: 'Inventar un final alternativo' },
        { id: 'D', text: 'Comparar con otros textos' },
      ],
      correctOption: 'B',
      explanation: 'Subrayar datos clave es una estrategia fundamental de comprensión literal.',
      difficulty: 1,
      tags: ['comprension', 'estrategias'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: lecturaId,
      topicId: 'comprension-inferencial',
      type: 'quiz',
      stem: '¿Qué tipo de comprensión requiere deducir información no explícita?',
      imageUrl: null,
      options: [
        { id: 'A', text: 'Literal' },
        { id: 'B', text: 'Inferencial' },
        { id: 'C', text: 'Crítica' },
        { id: 'D', text: 'Textual' },
      ],
      correctOption: 'B',
      explanation: 'La comprensión inferencial implica deducir información que no está dicha explícitamente.',
      difficulty: 1,
      tags: ['comprension', 'inferencial'],
      source: 'Generada',
      isActive: true,
    },
    {
      moduleId: lecturaId,
      topicId: 'vocabulario-contextual',
      type: 'quiz',
      stem: 'En la oración "El erudito explicó la teoría con claridad", la palabra "erudito" puede reemplazarse por:',
      imageUrl: null,
      options: [
        { id: 'A', text: 'ignorante' },
        { id: 'B', text: 'sabio' },
        { id: 'C', text: 'confuso' },
        { id: 'D', text: 'joven' },
      ],
      correctOption: 'B',
      explanation: '"Erudito" significa persona con gran conocimiento, sinónimo contextual: "sabio".',
      difficulty: 1,
      tags: ['vocabulario', 'sinonimos'],
      source: 'Generada',
      isActive: true,
    },
  ];

  for (const q of questions) {
    await db.collection('questions').add(q);
  }

  console.log(`✅ Created ${questions.length} questions`);

  // ========== SIMULATION ==========
  // Get all math question IDs
  const mathQuestionsSnap = await db
    .collection('questions')
    .where('moduleId', '==', mathM1Id)
    .get();

  const mathQuestionIds = mathQuestionsSnap.docs.map((d) => d.id);

  await db.collection('simulations').add({
    title: 'Mini Ensayo PAES M1 - Práctica',
    subject: 'm1',
    questionIds: mathQuestionIds,
    totalQuestions: mathQuestionIds.length,
    timeLimitMinutes: 30,
    isPremiumOnly: false,
    createdAt: new Date(),
  });

  console.log('✅ Created sample simulation');
  console.log('🌱 Seed complete!');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
