import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
    storageBucket: `${projectId}.appspot.com`,
  });
}

const bucket = admin.storage().bucket();

async function setCors() {
  await bucket.setCorsConfiguration([
    {
      origin: ['*'],
      method: ['GET', 'HEAD'],
      responseHeader: ['*'],
      maxAgeSeconds: 3600,
    },
  ]);
  console.log('CORS config set!');
}

setCors().catch(console.error);
