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
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

async function run() {
  console.log('Fetching news decoration URLs...');
  const decorRef1 = await db.collection('fotosDecoraciones').doc('noticia1_seccion_noticias').get();
  const decorRef2 = await db.collection('fotosDecoraciones').doc('noticia2_seccion_noticias').get();
  const decorRef3 = await db.collection('fotosDecoraciones').doc('noticia3_seccion_noticias').get();

  const url1 = decorRef1.exists ? decorRef1.data()?.url : '';
  const url2 = decorRef2.exists ? decorRef2.data()?.url : '';
  const url3 = decorRef3.exists ? decorRef3.data()?.url : '';

  const defaultNews = [
    {
      title: 'Inscripción PAES 2026: DEMRE lanza dura advertencia por cambio clave',
      source: 'El Mostrador',
      date: '2026-05-19',
      dateText: '19 de mayo, 2026',
      excerpt: 'El DEMRE advirtió sobre la importancia del cambio de clave del usuario en el portal de inscripción, ya que olvidar o errar en este paso podría dejar a los postulantes fuera del proceso regular.',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      icon: '⚠️',
      tag: '¡Advertencia!',
      linkUrl: 'https://www.elmostrador.cl/datos-utiles/2026/05/19/inscripcion-paes-2026-demre-lanza-dura-advertencia-por-cambio-clave-que-podria-dejarte-fuera/',
      imageUrl: url1
    },
    {
      title: 'Comenzó el periodo de inscripción a la PAES de invierno 2026',
      source: 'Ministerio de Educación',
      date: '2026-03-04',
      dateText: '4 de marzo, 2026',
      excerpt: 'Hasta el martes 17 de marzo a las 13:00 horas, las y los egresados de enseñanza media podrán inscribirse para rendir la prueba de invierno los días 15, 16 y 17 de junio.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      icon: '❄️',
      tag: 'PAES Invierno',
      linkUrl: 'https://www.mineduc.cl/comenzo-el-periodo-de-inscripcion-a-la-paes-de-invierno-2026-admision-2027/',
      imageUrl: url2
    },
    {
      title: 'PAES Invierno 2026: cuándo es y cómo hacer la inscripción',
      source: 'Iplacex',
      date: '2026-03-05',
      dateText: '5 de marzo, 2026',
      excerpt: 'La PAES de invierno ya tiene fechas confirmadas. Revisa cuándo es, cómo funciona el proceso de inscripción y los detalles importantes que debes conocer para prepararte adecuadamente.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      icon: '📝',
      tag: 'Guía Práctica',
      linkUrl: 'https://www.iplacex.cl/blog/paes-invierno-2026-cuando-es-y-como-hacer-la-inscripcion',
      imageUrl: url3
    }
  ];

  console.log('Seeding news to Firestore...');
  const batch = db.batch();
  for (const news of defaultNews) {
    const docRef = db.collection('news').doc();
    batch.set(docRef, news);
  }

  await batch.commit();
  console.log('Successfully seeded news with Cloudinary URLs!');
}

run().catch(console.error);
