const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

async function run() {
  console.log('🔄 Extrayendo datos de Firestore a mocks locales...');
  
  const materiasSnap = await db.collection('lp_materias').get();
  const materias = materiasSnap.docs.map(d => ({id: d.id, ...d.data()}));
  
  const capitulosSnap = await db.collection('lp_capitulos').get();
  const capitulos = [];
  
  for (const capDoc of capitulosSnap.docs) {
    const capData = { id: capDoc.id, ...capDoc.data() };
    const seccionesSnap = await capDoc.ref.collection('secciones').get();
    capData.secciones = [];
    
    for (const secDoc of seccionesSnap.docs) {
      const secData = { id: secDoc.id, ...secDoc.data() };
      
      // Tests are stored in root lp_tests collection, referenced by testId
      if (secData.testId) {
        const testDoc = await db.collection('lp_tests').doc(secData.testId).get();
        if (testDoc.exists) {
          secData.test = { id: testDoc.id, ...testDoc.data() };
        }
      }
      capData.secciones.push(secData);
    }
    capData.secciones.sort((a, b) => a.order - b.order);
    capitulos.push(capData);
  }
  
  const mocksDir = path.join(__dirname, '../../frontend-app/src/assets/mocks');
  if (!fs.existsSync(mocksDir)) fs.mkdirSync(mocksDir, { recursive: true });
  
  fs.writeFileSync(path.join(mocksDir, 'materias-mock-local.json'), JSON.stringify(materias, null, 2));
  fs.writeFileSync(path.join(mocksDir, 'capitulos-mock-local.json'), JSON.stringify(capitulos, null, 2));
  
  console.log('✅ Extracción completada exitosamente.');
}

run().catch(console.error);
