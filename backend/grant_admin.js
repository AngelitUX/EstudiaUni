const admin = require('firebase-admin');
require('dotenv').config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function grantAdmin(email) {
    try {
        console.log(`Looking up user by email: ${email}`);
        const userRecord = await auth.getUserByEmail(email);
        const uid = userRecord.uid;
        console.log(`User found! UID: ${uid}`);
        
        console.log(`Granting admin rights in Firestore...`);
        await db.collection('admins').doc(uid).set({
            email: email,
            grantedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`Successfully granted admin privileges to ${email}`);
    } catch (e) {
        console.error('Error granting admin:', e);
    }
}

grantAdmin('theanmog@gmail.com')
    .then(() => process.exit(0))
    .catch(console.error);
