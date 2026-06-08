const admin = require('firebase-admin');
const fs = require('fs');
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

async function reorderNodes(chapterId) {
    const snap = await db.collection(`lp_capitulos/${chapterId}/secciones`).get();
    let nodes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    nodes.sort((a, b) => a.order - b.order);
    
    let normalNodes = [];
    let practiceNodes = [];
    let finalChallenge = null;

    for (const n of nodes) {
        if (n.title.toLowerCase().includes('desafío')) {
            finalChallenge = n;
        } else if (n.isPractice) {
            practiceNodes.push(n);
        } else {
            normalNodes.push(n);
        }
    }

    let reordered = [];
    if (practiceNodes.length > 0 && normalNodes.length > 0) {
        const gap = Math.floor(normalNodes.length / practiceNodes.length);
        
        let normalIdx = 0;
        let practiceIdx = 0;
        
        while (normalIdx < normalNodes.length || practiceIdx < practiceNodes.length) {
            for (let i = 0; i < gap && normalIdx < normalNodes.length; i++) {
                reordered.push(normalNodes[normalIdx++]);
            }
            if (practiceIdx < practiceNodes.length) {
                reordered.push(practiceNodes[practiceIdx++]);
            }
        }
    } else {
        reordered = [...normalNodes, ...practiceNodes];
    }

    if (finalChallenge) {
        reordered.push(finalChallenge);
    }

    console.log(`\n--- Fixed Order: ${chapterId} ---`);
    for (let i = 0; i < reordered.length; i++) {
        const newOrder = i + 1;
        reordered[i].newOrder = newOrder;
        console.log(`[New Order: ${newOrder}] [ID: ${reordered[i].id}] ${reordered[i].title}`);
    }

    console.log(`Updating in DB for ${chapterId}...`);
    for (const n of reordered) {
        const ref = db.collection(`lp_capitulos/${chapterId}/secciones`).doc(n.id);
        await ref.update({ order: n.newOrder });
    }
    console.log('Update complete!');
}

async function run() {
    try {
        await reorderNodes('cap-interpretar');
        await reorderNodes('cap-evaluar');
        console.log("All done!");
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

run();
