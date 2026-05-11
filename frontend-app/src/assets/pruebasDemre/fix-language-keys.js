const fs = require('fs');
const path = require('path');

const languageKeys = {
  'l-2024': "1*C, 2D, 3A, 4D, 5C, 6B, 7B, 8D, 9C, 10A, 11B, 12A, 13B, 14B, 15*A, 16D, 17A, 18D, 19D, 20B, 21A, 22C, 23A, 24C, 25D, 26C, 27D, 28C, 29A, 30A, 31C, 32C, 33B, 34C, 35D, 36D, 37*B, 38C, 39B, 40A, 41B, 42B, 43A, 44C, 45D, 46*C, 47C, 48A, 49B, 50A, 51B, 52C, 53A, 54C, 55B, 56D, 57B, 58D, 59B, 60A, 61D, 62C, 63*C, 64D, 65C",
  'l-2025': "1B, 2A, 3*D, 4B, 5A, 6D, 7C, 8*D, 9D, 10*C, 11B, 12B, 13C, 14B, 15D, 16A, 17D, 18A, 19B, 20B, 21C, 22A, 23B, 24D, 25B, 26C, 27A, 28*B, 29D, 30C, 31B, 32C, 33*D, 34A, 35B, 36C, 37B, 38C, 39A, 40C, 41C, 42C, 43A, 44B, 45B, 46D, 47A, 48C, 49A, 50B, 51D, 52A, 53A, 54C, 55A, 56C, 57C, 58B, 59D, 60C, 61B, 62A, 63C, 64D, 65D",
  'l-2026': "1C, 2D, 3A, 4A, 5C, 6B, 7A, 8B, 9B, 10*B, 11C, 12B, 13D, 14D, 15A, 16B, 17A, 18C, 19A, 20B, 21C, 22*A, 23A, 24A, 25C, 26C, 27*D, 28B, 29A, 30C, 31A, 32B, 33D, 34C, 35C, 36B, 37A, 38C, 39*B, 40A, 41D, 42D, 43C, 44B, 45D, 46A, 47A, 48C, 49A, 50D, 51C, 52D, 53A, 54C, 55A, 56A, 57B, 58C, 59B, 60D, 61C, 62B, 63*C, 64D, 65C",
  'l-invierno-2024': "1B, 2C, 3C, 4D, 5B, 6C, 7A, 8A, 9D, 10*B, 11B, 12D, 13C, 14C, 15B, 16A, 17D, 18B, 19C, 20A, 21A, 22B, 23D, 24C, 25B, 26D, 27D, 28D, 29B, 30*C, 31A, 32D, 33B, 34D, 35B, 36B, 37A, 38C, 39C, 40*D, 41C, 42A, 43C, 44B, 45A, 46A, 47B, 48*D, 49A, 50B, 51C, 52D, 53C, 54D, 55A, 56A, 57C, 58D, 59A, 60C, 61B, 62B, 63*D, 64A, 65C",
  'l-invierno-2025': "1C, 2A, 3*B, 4D, 5C, 6B, 7B, 8C, 9B, 10D, 11C, 12A, 13D, 14A, 15C, 16*C, 17D, 18B, 19B, 20D, 21C, 22A, 23D, 24C, 25A, 26A, 27D, 28B, 29C, 30C, 31B, 32B, 33D, 34D, 35A, 36B, 37A, 38A, 39A, 40D, 41C, 42B, 43B, 44B, 45*A, 46A, 47C, 48C, 49B, 50A, 51D, 52B, 53C, 54A, 55*D, 56B, 57D, 58A, 59A, 60B, 61D, 62*D, 63C, 64A, 65C",
  'l-invierno-2026': "1C, 2D, 3C, 4A, 5A, 6C, 7D, 8B, 9C, 10*C, 11D, 12D, 13C, 14D, 15B, 16D, 17B, 18C, 19B, 20D, 21C, 22*A, 23*C, 24C, 25B, 26A, 27C, 28B, 29A, 30B, 31C, 32A, 33D, 34D, 35D, 36A, 37B, 38B, 39D, 40A, 41B, 42A, 43B, 44B, 45A, 46D, 47C, 48B, 49C, 50A, 51B, 52*A, 53A, 54D, 55C, 56A, 57A, 58*D, 59D, 60C, 61B, 62A, 63C, 64C, 65B"
};

const parseAnswers = (answersStr) => {
  const map = {};
  const pairs = answersStr.split(', ');
  pairs.forEach(p => {
    const match = p.match(/(\d+)([*]*)([A-E])/);
    if (match) {
      map[match[1]] = match[3];
    }
  });
  return map;
};

const assetsDir = path.resolve(__dirname, '../assets');

Object.keys(languageKeys).forEach(ensayoId => {
  const filePath = path.join(assetsDir, `${ensayoId}-preguntas-db.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const answerMap = parseAnswers(languageKeys[ensayoId]);

  data.forEach(q => {
    const orderNum = q.order.toString();
    if (answerMap[orderNum]) {
      q.correctAnswer = answerMap[orderNum];
      q.explanation = `La respuesta correcta es la ${answerMap[orderNum]}.`;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated keys for ${ensayoId}`);
});

console.log('Language keys fix complete.');
