const { initializeApp } = require('firebase/app');
const { getFirestore, updateDoc, collectionGroup, getDocs } = require('firebase/firestore');

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

const HISTORIA_SECTION_IMAGES = {
  // Capitulo 1
  'sec-hist-1-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/vyqnyijownlrane4caw2.jpg',
  'sec-hist-1-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905036/h8krgjj2g5o8nfw0zcb1.jpg',
  'sec-hist-1-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/zfr8xuvtisumjbojzai9.jpg',
  'sec-hist-1-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/tja4smjac8eqy59wzxhi.jpg',
  'sec-hist-1-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/ti4ukigu1zbauotp2cwi.jpg',
  // Capitulo 2
  'sec-hist-2-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/kzhldetgmmdybpkywibq.jpg',
  'sec-hist-2-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/t5uq3iqxuroiqc2tzw8j.jpg',
  'sec-hist-2-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/mp8ayvhpswr76ubywob1.jpg',
  'sec-hist-2-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/yyb8euucllngapwgxon0.webp',
  'sec-hist-2-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/oxf6xsjvlepxru9btgcp.png',
  // Capitulo 3
  'sec-hist-3-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/ogrrtgtcbzmw2ntpnlxu.jpg',
  'sec-hist-3-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/jxpyrsxsigferexii71j.webp',
  'sec-hist-3-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/gw4uepphynwaog3bph4t.jpg',
  'sec-hist-3-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/eramr3kfqbyrqp6qrpct.jpg',
  'sec-hist-3-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/vtg5txfooop05ulahr7c.jpg',
  // Capitulo 4
  'sec-hist-4-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/y4uzuo3kfgtgfa3mwu0j.jpg',
  'sec-hist-4-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/kei7irgbxklaibqbbxvc.jpg',
  'sec-hist-4-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/elottrpyhfyxth84bsw8.jpg',
  'sec-hist-4-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905045/ardr8kvu2sis5j2v4kqo.jpg',
  // Capitulo 5
  'sec-hist-5-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/ahfrpvle3kr0rwtekpkw.webp',
  'sec-hist-5-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/e2y8gqkm53jjo0fql4ko.jpg',
  'sec-hist-5-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/lflmpcg6lybq7elbnvas.png',
  'sec-hist-5-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/je4etlc1wgnxeuzdewjp.jpg'
};

async function updateFirestoreSections() {
  console.log('Buscando secciones en Firestore...');
  const seccionesSnap = await getDocs(collectionGroup(db, 'secciones'));
  console.log(`Encontradas ${seccionesSnap.docs.length} secciones en total.`);

  let count = 0;
  for (const docSnap of seccionesSnap.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;
    const capId = data.capituloId || '';
    const materiaId = data.materiaId || '';

    let imageUrl = HISTORIA_SECTION_IMAGES[docId];

    if (!imageUrl && (materiaId === 'historia' || capId.includes('hist'))) {
      const capNum = data.capituloId ? data.capituloId.replace('cap-hist-', '').replace('cap-historia-', '') : '';
      const order = data.order || 1;
      const key = `${capNum}-${order}`;
      if (HISTORIA_SECTION_IMAGES[key]) {
        imageUrl = HISTORIA_SECTION_IMAGES[key];
      }
    }

    if (imageUrl) {
      console.log(`Actualizando ${docId} con imageUrl: ${imageUrl}`);
      await updateDoc(docSnap.ref, { imageUrl });
      count++;
    }
  }

  console.log(`¡Actualización completada! ${count} documentos actualizados con imageUrl.`);
  process.exit(0);
}

updateFirestoreSections().catch(err => {
  console.error('Error al actualizar Firestore:', err);
  process.exit(1);
});
