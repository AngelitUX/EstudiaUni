const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');

const apiKey = 'AIzaSyCy4dAomJ1iol8iqtz0usySE_UhY-LM1lA';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function main() {
    console.log('Uploading SOLUCION PDF to Gemini...');
    const uploadResult = await fileManager.uploadFile(
        'src/pruebasDemre/L-2025-SOLUCION.pdf',
        {
            mimeType: 'application/pdf',
            displayName: 'L-2025 Solution',
        }
    );
    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Extrae la tabla de respuestas correctas de este documento.
    Devuelve estrictamente un JSON object donde las llaves sean el número de pregunta (como string) y el valor sea la letra de la respuesta correcta (A, B, C, D o E).
    Ejemplo: {"1": "A", "2": "C", ...}
    Solo devuelve el JSON, sin markdown.
    `;

    console.log('Generating answers JSON...');
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
    const cleanJson = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    
    fs.writeFileSync('src/pruebasDemre/l-2025-answers.json', cleanJson);
    console.log('Answers saved in src/pruebasDemre/l-2025-answers.json');
}

main().catch(console.error);
