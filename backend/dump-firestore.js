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

async function dump() {
  const snapshot = await db.collection('lp_capitulos').doc('cap-interpretar').collection('secciones').get();
  snapshot.forEach(doc => {
      const d = doc.data();
      console.log(d.id, '| Lvl:', d.level, '| Ord:', d.order, '| Tit:', d.title);
  });
}
dump();