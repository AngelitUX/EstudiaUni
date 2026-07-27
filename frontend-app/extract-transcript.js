const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/IIfie/.gemini/antigravity-ide/brain/527103e7-5087-43fa-81f7-ddcfd2b004ea/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('replace_file_content') && line.includes('sec-2-1-inf')) {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
            fs.writeFileSync('C:/EstudiaUnicl/frontend-app/extracted_cap2.txt', JSON.stringify(tc.args, null, 2));
            console.log('Extracted to extracted_cap2.txt');
            return;
          }
        }
      }
    }
  }
  console.log('Not found');
}
processLineByLine();