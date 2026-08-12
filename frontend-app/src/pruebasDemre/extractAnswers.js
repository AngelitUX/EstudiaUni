const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Set GEMINI_API_KEY before running this script.');
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function main() {
    console.log('Uploading Solutions PDF to Gemini...');
    const uploadResult = await fileManager.uploadFile(
        'M1-INVIERNO-2024-SOLUCION.pdf',
        {
            mimeType: 'application/pdf',
            displayName: 'M1-INVIERNO-2024 Solutions',
        }
    );
    console.log(`Uploaded file as: ${uploadResult.file.uri}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
    Eres un experto leyendo pautas de corrección. Extrae ÚNICAMENTE las alternativas correctas (A, B, C o D) de las 65 preguntas de esta prueba (claves/respuestas).
    Devuelve estrictamente un JSON array de strings con las 65 letras en orden (de la pregunta 1 a la 65).
    Ejemplo: ["A", "C", "D", "B", "A", ...]
    No agregues ningún texto, solo el JSON array.
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
    const cleanJson = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    fs.writeFileSync('respuestas.json', cleanJson);
    console.log('Respuestas guardadas en respuestas.json');
}

main().catch(console.error);
