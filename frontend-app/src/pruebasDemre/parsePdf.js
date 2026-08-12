const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Set GEMINI_API_KEY before running this script.');
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function main() {
    console.log('Uploading PDF to Gemini...');
    const uploadResult = await fileManager.uploadFile(
        'src/pruebasDemre/M1-2024.pdf',
        {
            mimeType: 'application/pdf',
            displayName: 'M1-2024 Exam',
        }
    );
    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Eres un experto procesando documentos. Extrae las 65 preguntas de esta prueba de matemáticas.
    Devuelve estrictamente un JSON array con la siguiente estructura, sin texto markdown alrededor, solo el JSON:
    [
      {
        "id": "q1",
        "order": 1,
        "ensayoId": "m1",
        "subject": "m1",
        "stem": "texto de la pregunta...",
        "imageUrl": "", // dejar vacío por ahora
        "options": [
          { "id": "A", "text": "opción A" },
          { "id": "B", "text": "opción B" },
          { "id": "C", "text": "opción C" },
          { "id": "D", "text": "opción D" }
        ],
        "correctAnswer": "A", // puedes inferirla o dejarla vacía
        "explanation": "explicación" // dejar vacía
      }
    ]
    `;

    console.log('Generating JSON content...');
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri
            }
        },
        { text: prompt }
    ]);

    const jsonString = result.response.text();
    // Limpiamos los backticks del JSON (```json ... ```) si es que están
    const cleanJson = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    fs.writeFileSync('src/pruebasDemre/preguntas.json', cleanJson);
    console.log('JSON guardado en preguntas.json');
}

main().catch(console.error);
