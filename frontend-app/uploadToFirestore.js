const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

// Firebase config from your environment
const firebaseConfig = {
    apiKey: "AIzaSyB3eISSPYcdGYf4l3LvZyADV6dL9l1OW5g",
    authDomain: "estudiauni.firebaseapp.com",
    projectId: "estudiauni",
    storageBucket: "estudiauni.firebasestorage.app",
    messagingSenderId: "976475724065",
    appId: "1:976475724065:web:586b9c2609d84674158660",
    measurementId: "G-LWHGWMQV8F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadQuestions() {
    console.log('Leyendo m1-preguntas-db.json...');
    const rawData = fs.readFileSync('src/pruebasDemre/m1-preguntas-db.json');
    const questions = JSON.parse(rawData);

    console.log(`Subiendo ${questions.length} preguntas a Firestore...`);
    
    let count = 0;
    for (const q of questions) {
        // We use the ID "m1-2024-qX" as the document ID
        const docRef = doc(db, 'preguntas', q.id);
        await setDoc(docRef, q);
        count++;
        if (count % 10 === 0) console.log(`Subidas ${count}/${questions.length}`);
    }

    console.log('¡Subeo completado!');
    process.exit(0);
}

uploadQuestions().catch(console.error);
