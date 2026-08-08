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
  const caps = ["cap-1", "cap-interpretar", "cap-localizar", "cap-evaluar"];
  for (const c of caps) {
    const doc = await db.collection("lp_capitulos").doc(c).get();
    if (!doc.exists) continue;
    const data = doc.data();
    if (data.materiaId !== "comp-lectora") continue;
    const secs = await doc.ref.collection("secciones").get();
    console.log(`Chapter ${c} (${data.title}) has ${secs.size} lessons.`);
  }
}
run();
