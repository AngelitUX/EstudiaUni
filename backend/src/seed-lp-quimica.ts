import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { cap1 } from './quimica-cap1';
import { cap2 } from './quimica-cap2';
import { cap3 } from './quimica-cap3';
import { cap4 } from './quimica-cap4';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

const MATERIAS = [
  {
    id: 'ciencias-quimica',
    title: 'Ciencias - Química',
    description: 'Aprende los fundamentos de la estructura de la materia, compuestos orgánicos, reacciones químicas y disoluciones. Prepárate paso a paso para la PAES de Ciencias.',
    color: '#8A2BE2',
    image: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783913366/quimica/cap_1.webp',
    bgLightColor: '#F3E5F5',
    active: true,
    paesPercentage: 15,
  }
];

const CAPITULOS = [cap1, cap2, cap3, cap4];

async function runSeed() {
  console.log('🌱 Iniciando la creación de la nueva ruta MEGA extendida de Química (30 Lecciones y 150 Preguntas)...');

  try {
    for (const mat of MATERIAS) {
      await db.collection('lp_materias').doc(mat.id).set(mat, { merge: true });
      console.log(`✅ Materia seeded: ${mat.id}`);
    }

    const capitulosRef = db.collection('lp_capitulos');
    for (const cap of CAPITULOS) {
      const { secciones, ...capituloData } = cap;
      await capitulosRef.doc(cap.id).set(capituloData);
      console.log(`✅ Capítulo seeded: ${cap.id}`);

      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');
      for (const sec of secciones) {
        const { test, ...seccionData } = sec;
        
        const secWithIds = {
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id,
          testId: test.id 
        };
        
        await seccionesRef.doc(sec.id).set(secWithIds);
        console.log(`✅ Sección seeded: ${sec.id}`);

        if (test) {
          const testsRef = db.collection('lp_tests');
          await testsRef.doc(test.id).set({
            ...test,
            seccionId: sec.id
          });
          console.log(`✅ Test seeded: ${test.id}`);
        }
      }
    }

    console.log('🎉 Seed de Química MEGA completado con éxito!');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  }
}

runSeed();
