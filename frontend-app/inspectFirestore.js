const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function inspectData() {
    console.log('Fetching capitulos...');
    const capSnap = await getDocs(collection(db, 'lp_capitulos'));
    for (const capDoc of capSnap.docs) {
        console.log(`Capitulo: ${capDoc.id} - ${capDoc.data().title}`);
        const secSnap = await getDocs(collection(db, `lp_capitulos/${capDoc.id}/secciones`));
        for (const secDoc of secSnap.docs) {
            const data = secDoc.data();
            console.log(`  Seccion: ${secDoc.id} - ${data.title}`);
            if (data.title.toLowerCase().includes('localizar')) {
                console.log(`    datos_claves:`, data.datos_claves);
            }
        }
    }
    process.exit(0);
}

inspectData().catch(console.error);
