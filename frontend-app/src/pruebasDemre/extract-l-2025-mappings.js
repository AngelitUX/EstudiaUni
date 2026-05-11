const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const fs = require('fs');

const apiKey = 'AIzaSyCy4dAomJ1iol8iqtz0usySE_UhY-LM1lA';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function main() {
    console.log('Uploading L-2025 PDF to Gemini...');
    const uploadResult = await fileManager.uploadFile(
        'src/pruebasDemre/L-2025.pdf',
        {
            mimeType: 'application/pdf',
            displayName: 'L-2025 Exam',
        }
    );
    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Analiza este documento de la prueba de Lenguaje (Competencia Lectora).
    Identifica los textos de lectura y qué rango de preguntas pertenece a cada texto.
    Devuelve estrictamente un JSON array de objetos con esta estructura:
    [
      { "textNumber": 1, "startQuestion": 1, "endQuestion": 10 },
      ...
    ]
    Solo devuelve el JSON, sin markdown.
    `;

    console.log('Generating mappings...');
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
    
    fs.writeFileSync('src/pruebasDemre/l-2025-mappings.json', cleanJson);
    console.log('Mappings saved in src/pruebasDemre/l-2025-mappings.json');
}

main().catch(console.error);
