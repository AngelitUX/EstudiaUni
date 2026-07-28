const fs = require('fs');
const file = 'src/app/features/learning-path/data/seed-data.ts';
let text = fs.readFileSync(file, 'utf8');

// The file was read as default (Windows-1252) and saved as UTF-8.
// We can recover by converting the string to a Buffer using 'latin1', 
// and then reading that Buffer as 'utf8'.
let buf = Buffer.from(text, 'latin1');
let recovered = buf.toString('utf8');

// There might be some characters that don't perfectly roundtrip in latin1 if Windows-1252 was used,
// but let's check a sample.
console.log('Sample before:', text.substring(0, 100));
console.log('Sample after:', recovered.substring(0, 100));

// Just in case, let's look for a known bad string
const idx = text.indexOf('Â¿');
if (idx !== -1) {
    console.log('Found corrupted char at', idx);
    console.log('Before:', text.substring(idx, idx + 50));
    console.log('After:', recovered.substring(idx, idx + 50));
}

// Check if recovery makes sense
if (recovered.includes('¿')) {
    fs.writeFileSync(file, recovered, 'utf8');
    console.log('Successfully recovered and saved!');
} else {
    console.log('Recovery did not produce expected characters.');
}