import { v2 as cloudinary } from 'cloudinary';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * One-off migration: uploads the local Competencia Lectora ("Lenguaje") reading-text
 * and question images to Cloudinary, then rewrites the matching `preguntas` documents
 * in Firestore (imageUrl + readingText[]) to point at the resulting Cloudinary URLs.
 *
 * These images never made it into Cloudinary (they were never committed to git either),
 * so `preguntas` docs for the L-* exams still reference local paths like
 * `assets/images/L-2024-IMAGENES/texto1parte1.png`, which don't resolve in production.
 *
 * Usage:
 *   npx ts-node src/scripts/upload-lenguaje-images.ts            (uploads + writes Firestore)
 *   npx ts-node src/scripts/upload-lenguaje-images.ts --dry-run  (uploads to Cloudinary, no Firestore writes)
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqm3syhwr',
  api_key: process.env.CLOUDINARY_API_KEY || '469121327526224',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'VuuszgyIVRd-sTA0u-pVsE-9u-0',
});

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
  });
}

const db = admin.firestore();
const isDryRun = process.argv.includes('--dry-run');

const ASSETS_DIR = path.resolve(__dirname, '../../../frontend-app/src/assets/images');
const LENGUAJE_FOLDERS = [
  'L-2024-IMAGENES',
  'L-2025-IMAGENES',
  'L-2026-IMAGENES',
  'L-INVIERNO-2024-IMAGENES',
  'L-INVIERNO-2025-IMAGENES',
  'L-INVIERNO-2026-IMAGENES',
];

async function uploadFolder(folder: string, mapping: Map<string, string>) {
  const folderPath = path.join(ASSETS_DIR, folder);
  if (!fs.existsSync(folderPath)) {
    console.warn(`Carpeta no encontrada, se omite: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));
  console.log(`\n[${folder}] ${files.length} imagenes encontradas`);

  for (const file of files) {
    const localKey = `assets/images/${folder}/${file}`;
    const publicId = file.replace(/\.[^.]+$/, '');
    const filePath = path.join(folderPath, file);

    if (isDryRun) {
      mapping.set(localKey, `[dry-run] imagenes/${folder}/${publicId}`);
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `imagenes/${folder}`,
        public_id: publicId,
        overwrite: true,
      });
      mapping.set(localKey, result.secure_url);
      console.log(`  subida: ${file} -> ${result.secure_url}`);
    } catch (err: any) {
      console.error(`  ERROR subiendo ${file}: ${err.message}`);
    }
  }
}

async function updateFirestore(mapping: Map<string, string>) {
  console.log('\nBuscando documentos en la coleccion "preguntas"...');
  const snapshot = await db.collection('preguntas').get();

  let batch = db.batch();
  let batchSize = 0;
  let updatedDocs = 0;
  const usedKeys = new Set<string>();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates: Record<string, any> = {};

    if (typeof data.imageUrl === 'string' && mapping.has(data.imageUrl)) {
      updates.imageUrl = mapping.get(data.imageUrl);
      usedKeys.add(data.imageUrl);
    }

    if (Array.isArray(data.readingText)) {
      let changed = false;
      const newReadingText = data.readingText.map((entry: string) => {
        if (typeof entry === 'string' && mapping.has(entry)) {
          changed = true;
          usedKeys.add(entry);
          return mapping.get(entry);
        }
        return entry;
      });
      if (changed) updates.readingText = newReadingText;
    }

    if (Object.keys(updates).length > 0) {
      if (isDryRun) {
        console.log(`  [dry-run] actualizaria ${doc.id}:`, updates);
      } else {
        batch.update(doc.ref, updates);
        batchSize++;
        if (batchSize === 500) {
          await batch.commit();
          batch = db.batch();
          batchSize = 0;
        }
      }
      updatedDocs++;
    }
  }

  if (!isDryRun && batchSize > 0) {
    await batch.commit();
  }

  const unusedKeys = [...mapping.keys()].filter((k) => !usedKeys.has(k));
  return { updatedDocs, unusedKeys };
}

async function run() {
  console.log(isDryRun ? 'MODO DRY-RUN: no se subira nada a Cloudinary ni se escribira en Firestore.\n' : 'Subiendo imagenes de Lenguaje a Cloudinary...\n');

  const mapping = new Map<string, string>();
  for (const folder of LENGUAJE_FOLDERS) {
    await uploadFolder(folder, mapping);
  }

  console.log(`\nTotal de imagenes procesadas: ${mapping.size}`);

  const { updatedDocs, unusedKeys } = await updateFirestore(mapping);

  console.log(`\nDocumentos de "preguntas" actualizados: ${updatedDocs}`);
  if (unusedKeys.length > 0) {
    console.log(`\nImagenes subidas que no coinciden con ningun documento de Firestore (${unusedKeys.length}):`);
    unusedKeys.forEach((k) => console.log(`  - ${k}`));
  }

  console.log('\nListo.');
}

run().catch((err) => {
  console.error('Error fatal en la migracion:', err);
  process.exit(1);
});
