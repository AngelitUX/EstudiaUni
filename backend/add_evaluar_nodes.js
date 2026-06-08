const admin = require('firebase-admin');
require('dotenv').config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
}

const db = admin.firestore();

async function addEvaluarNodes() {
    const colRef = db.collection('lp_capitulos/cap-evaluar/secciones');
    
    console.log('Adding new Evaluar nodes...');

    await colRef.add({
      capituloId: 'cap-evaluar',
      materiaId: 'comp-lectora',
      title: 'Comparar posturas en Textos Pareados',
      introduccion: 'Aprende a analizar cómo dos textos distintos abordan el mismo tema, un clásico de la PAES.',
      datos_claves: ['Identifica puntos en común', 'Identifica discrepancias fundamentales'],
      order: 99, // temporary, will be reordered
      isPractice: false,
      testId: null
    });

    await colRef.add({
      capituloId: 'cap-evaluar',
      materiaId: 'comp-lectora',
      title: 'Detectar prejuicios y creencias subyacentes',
      introduccion: 'Identifica sesgos culturales o estereotipos que transmite el emisor o los personajes.',
      datos_claves: ['Analiza los adjetivos y etiquetas que se usan', 'Cuestiona lo que el autor asume como verdad absoluta'],
      order: 99,
      isPractice: false,
      testId: null
    });

    await colRef.add({
      capituloId: 'cap-evaluar',
      materiaId: 'comp-lectora',
      title: 'Juzgar la solidez de un argumento',
      introduccion: 'No basta con identificar la tesis, evalúa si la evidencia entregada realmente la justifica.',
      datos_claves: ['¿La evidencia es objetiva o subjetiva?', '¿La fuente es confiable?'],
      order: 99,
      isPractice: false,
      testId: null
    });

    await colRef.add({
      capituloId: 'cap-evaluar',
      materiaId: 'comp-lectora',
      title: 'Práctica: Textos Pareados',
      introduccion: 'Pon a prueba tu capacidad de evaluar posturas múltiples y polifonía.',
      datos_claves: [],
      order: 99,
      isPractice: true,
      practiceType: 'paired-texts',
      testId: null
    });

    console.log('New Evaluar nodes added successfully!');
}

addEvaluarNodes()
    .then(() => process.exit(0))
    .catch(console.error);
