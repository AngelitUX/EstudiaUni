import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    })
  });
}

const db = admin.firestore();

async function run() {
  try {
    const caps = await db.collection("lp_capitulos").get();
    console.log("CHAPTERS IN FIRESTORE:");
    caps.docs.forEach(doc => console.log(doc.id, doc.data().title));
  } catch (e) {
    console.error("READ ERROR:", e);
  }
}
run();
