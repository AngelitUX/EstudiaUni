import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, privateKey, clientEmail }) });
}

const db = admin.firestore();

const CLOUD = 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding';

async function run() {
  await db.collection('config').doc('branding').set({
    logoUrl: `${CLOUD}/LogoEstudiaUni`,
    logoProUrl: `${CLOUD}/LogoEstudiaUniPREMIUM`,
    focoMascotGif: `${CLOUD}/gif`,
    focoBiologiaGif: `${CLOUD}/focoBiologia`,
    focoFisicaGif: `${CLOUD}/focoFisica`,
    updatedAt: new Date(),
  }, { merge: true });
  console.log('config/branding written to Firestore.');
}

run().catch((e) => { console.error(e); process.exit(1); });
