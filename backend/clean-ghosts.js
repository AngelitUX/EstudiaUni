const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const db = admin.firestore();

async function clean() {
  const capRef = db.collection('lp_capitulos').doc('cap-interpretar');
  
  const ghostIds = [
    'sec-2-6-inf', 'sec-2-6-nar', 
    'sec-2-7-inf', 'sec-2-7-nar', 
    'sec-2-8-join', 
    'sec-2-9-inf', 'sec-2-9-nar'
  ];

  for (const id of ghostIds) {
    await capRef.collection('secciones').doc(id).delete();
    console.log('Deleted section:', id);
    
    // Also delete tests
    const testId = id.replace('sec-', 'test-');
    await db.collection('lp_tests').doc(testId).delete();
    console.log('Deleted test:', testId);
  }
  console.log('Done cleaning ghost nodes');
}
clean();