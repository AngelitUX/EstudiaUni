import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});
const db = admin.firestore();

async function run() {
  console.log('Renaming Comp Lectora docs...');
  const tests = await db.collection('lp_tests').get();
  
  for (const t of tests.docs) {
    if (t.id.startsWith('test-loc-') || t.id.startsWith('test-int-') || t.id.startsWith('test-ev-')) {
      const oldId = t.id;
      const newId = oldId.replace('test-', 'test-cl-');
      const data = t.data();
      data.id = newId;
      // Convert loc-1 to sec-cl-loc-1
      data.seccionId = data.seccionId.replace(/^(loc|int|ev)-/, 'sec-cl-$1-');
      await db.collection('lp_tests').doc(newId).set(data);
      await db.collection('lp_tests').doc(oldId).delete();
      console.log('Moved test', oldId, 'to', newId);
    }
  }

  const caps = await db.collection('lp_capitulos').get();
  for (const c of caps.docs) {
    if (c.id === 'cap-localizar' || c.id === 'cap-interpretar' || c.id === 'cap-evaluar') {
      const oldId = c.id;
      const newId = oldId.replace('cap-', 'cap-cl-');
      const data = c.data();
      data.id = newId;
      await db.collection('lp_capitulos').doc(newId).set(data);

      const secs = await db.collection('lp_capitulos').doc(oldId).collection('secciones').get();
      for (const s of secs.docs) {
        const secOldId = s.id;
        const secNewId = 'sec-cl-' + secOldId;
        const sData = s.data();
        sData.id = secNewId;
        sData.capituloId = newId;
        sData.testId = sData.testId.replace('test-', 'test-cl-');
        await db.collection('lp_capitulos').doc(newId).collection('secciones').doc(secNewId).set(sData);
        await db.collection('lp_capitulos').doc(oldId).collection('secciones').doc(secOldId).delete();
        console.log('  Moved sec', secOldId, 'to', secNewId);
      }
      
      await db.collection('lp_capitulos').doc(oldId).delete();
      console.log('Moved cap', oldId, 'to', newId);
    }
  }
}

run().then(() => console.log('Done')).catch(console.error);
