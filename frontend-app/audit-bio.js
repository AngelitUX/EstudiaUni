const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/assets/mocks/capitulos-mock-local.json'));

const bioCaps = data.filter(c => c.materiaId === 'ciencias-biologia').slice(0, 3);

bioCaps.forEach(function(cap, ci) {
  console.log('\n======================================');
  console.log('CAP ' + (ci+1) + ': ' + cap.title + ' [id=' + cap.id + ']');
  console.log('======================================');
  cap.secciones.forEach(function(sec, si) {
    const flags = [];
    if (sec.isProTip) flags.push('PROTIP');
    if (sec.isPractice) flags.push('PRACTICE('+sec.practiceType+')');
    if (sec.isBoss) flags.push('BOSS');
    if (sec.isSlideGuide) flags.push('SLIDE');
    const tag = sec.tags ? sec.tags.join(',') : '';
    console.log('  [' + si + '] id=' + sec.id + ' | order=' + sec.order + ' | ' + (flags.length ? '['+flags.join('|')+'] ' : '') + sec.title + (tag ? '  [tags: '+tag+']' : ''));
  });
});
