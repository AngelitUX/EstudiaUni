import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey }) });
const db = admin.firestore();

const secciones = [
  { id: 'sec-2-1-inf', order: 2, title: 'Relaciones entre Ideas · Informativos' },
  { id: 'sec-2-1-nar', order: 3, title: 'Relaciones entre Ideas · Narrativos' },
  { id: 'sec-2-2-inf', order: 4, title: 'Inferencias · Informativos' },
  { id: 'sec-2-2-nar', order: 5, title: 'Inferencias · Narrativos' },
  { id: 'sec-2-3-join', order: 6, title: '🧩 Práctica: Conectores Lógicos' },
  { id: 'sec-2-4-inf', order: 7, title: 'Idea Principal · Informativos' },
  { id: 'sec-2-4-nar', order: 8, title: 'Tema e Idea Central · Narrativos' },
  { id: 'sec-2-5-join', order: 9, title: '🧩 Práctica: Vocabulario en Contexto' },
  { id: 'sec-2-6-inf', order: 10, title: 'Propósito y Función de Ejemplos · Informativos' },
  { id: 'sec-2-6-nar', order: 11, title: 'Motivaciones y Conflicto · Narrativos' },
  { id: 'sec-2-7-inf', order: 12, title: 'Tesis y Argumentos · Informativos' },
  { id: 'sec-2-7-nar', order: 13, title: 'Tono, Atmósfera y Narrador · Narrativos' },
  { id: 'sec-2-8-join', order: 14, title: '🧩 Práctica: Sinónimos y Reemplazo en Contexto' },
  { id: 'sec-2-9-inf', order: 15, title: 'Estructura y Recursos Retóricos · Informativos' },
  { id: 'sec-2-9-nar', order: 16, title: 'Tiempo y Espacio · Narrativos' },
  { id: 'sec-2-boss', order: 17, title: '⚔️ Desafío Final: Interpretar' },
];

const testIds = [
  'test-2-1-inf','test-2-1-nar','test-2-2-inf','test-2-2-nar','test-2-3-join',
  'test-2-4-inf','test-2-4-nar','test-2-5-join','test-2-6-inf','test-2-6-nar',
  'test-2-7-inf','test-2-7-nar','test-2-8-join','test-2-9-inf','test-2-9-nar','test-2-boss'
];

async function seed() {
  const capRef = db.collection('lp_capitulos').doc('cap-interpretar');
  for (const s of secciones) {
    await capRef.collection('secciones').doc(s.id).set({ id: s.id, capituloId: 'cap-interpretar', order: s.order, title: s.title }, { merge: true });
    console.log('✅ Sección:', s.id);
  }
  for (const t of testIds) {
    const secId = t.replace('test-', 'sec-');
    await capRef.collection('secciones').doc(secId).collection('tests').doc(t).set({ id: t, seccionId: secId }, { merge: true });
    console.log('  ✅ Test:', t);
  }
  console.log('🎉 Done');
}
seed();