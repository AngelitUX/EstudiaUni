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

async function updateCompLectoraImage() {
  await db.collection('lp_materias').doc('comp-lectora').update({
    imageUrl: 'assets/images/subjects/comp-lectora.png'
  });
  console.log('✅ Comprensión Lectora image updated in Firestore');
}

updateCompLectoraImage().catch(console.error);
