const katex = require('katex');
const text = '$n = \\frac{m}{MM}$';
console.log('Text characters:');
for(let i=0; i<text.length; i++) console.log(text[i]);
try {
  console.log(katex.renderToString(text));
} catch(e) {
  console.log('ERROR:', e.message);
}
