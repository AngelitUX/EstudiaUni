const fs = require('fs');
let data = JSON.parse(fs.readFileSync('extracted_cap2.txt', 'utf8'));
if (data.ReplacementContent) {
    fs.writeFileSync('cap2_content.txt', data.ReplacementContent, 'utf8');
    console.log('Saved ReplacementContent to cap2_content.txt, length:', data.ReplacementContent.length);
}