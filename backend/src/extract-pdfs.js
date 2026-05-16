const fs = require('fs');
const path = require('path');

async function extractPdf(filePath) {
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n\n';
  }
  const name = path.basename(filePath, '.pdf');
  const outPath = path.join(__dirname, `../../pdfs/ciencias/${name}.txt`);
  fs.writeFileSync(outPath, fullText, 'utf-8');
  console.log(`Extracted: ${name} (${fullText.length} chars)`);
}

async function main() {
  const pdfDir = path.join(__dirname, '../../pdfs/ciencias');
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
  for (const f of files) {
    await extractPdf(path.join(pdfDir, f));
  }
}

main().catch(console.error);
