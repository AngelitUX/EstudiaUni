import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const projectId = process.env.FIREBASE_PROJECT_ID || 'estudiauni';
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    admin.initializeApp({ projectId });
  }
}

const db = admin.firestore();

const data = [
  {
    docId: '1_como_funciona',
    name: '1Ruta.mp4',
    category: 'como funciona',
    url: 'https://res.cloudinary.com/dqm3syhwr/video/upload/f_gif,fl_animated/v1785742570/decoraciones/como_funciona/1_ruta.gif',
    mp4Url: 'https://res.cloudinary.com/dqm3syhwr/video/upload/v1785742570/decoraciones/como_funciona/1_ruta.mp4'
  },
  {
    docId: '2_como_funciona',
    name: '2Ensayos.mp4',
    category: 'como funciona',
    url: 'https://res.cloudinary.com/dqm3syhwr/video/upload/f_gif,fl_animated/v1785742574/decoraciones/como_funciona/2_ensayos.gif',
    mp4Url: 'https://res.cloudinary.com/dqm3syhwr/video/upload/v1785742574/decoraciones/como_funciona/2_ensayos.mp4'
  },
  {
    docId: '3_como_funciona',
    name: '3Consulta.mp4',
    category: 'como funciona',
    url: 'https://res.cloudinary.com/dqm3syhwr/video/upload/f_gif,fl_animated/v1785742576/decoraciones/como_funciona/3_consulta.gif',
    mp4Url: 'https://res.cloudinary.com/dqm3syhwr/video/upload/v1785742576/decoraciones/como_funciona/3_consulta.mp4'
  }
];

async function main() {
  console.log('Updating Firestore fotosDecoraciones for como funciona...');
  for (const item of data) {
    await db.collection('fotosDecoraciones').doc(item.docId).set({
      name: item.name,
      category: item.category,
      url: item.url,
      mp4Url: item.mp4Url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`Saved ${item.docId} to Firestore!`);
  }
  console.log('Firestore fotosDecoraciones successfully updated!');
}

main().catch(console.error);
