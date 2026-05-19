const { execSync } = require('child_process');

const cmds = [
  'node scratch/fix-generators.js',
  'npx ts-node src/seed-mates-m1-numeros-final.ts',
  'node scratch/pull-firestore-to-mock.js',
  'node scratch/generate-algebra-dataset.js',
  'node scratch/generate-geometria-dataset.js',
  'node scratch/generate-datos-dataset.js',
  'node scratch/extract-all-answers.js'
];

for (const cmd of cmds) {
  console.log(`\n\n>>> Executing: ${cmd}`);
  execSync(cmd, { cwd: __dirname + '/..', stdio: 'inherit' });
}
console.log('\n\n✅✅✅ PIPELINE COMPLETED SUCCESSFULLY! ✅✅✅');
