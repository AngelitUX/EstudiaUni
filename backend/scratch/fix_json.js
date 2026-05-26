const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('frontend-app/src/assets/mocks/capitulos-mock-local.json');
let content = fs.readFileSync(jsonPath, 'utf8');

console.log('Original content size:', content.length, 'characters');

// Let's identify where the first JSON parse error is
function findParseError(str) {
  try {
    JSON.parse(str);
    return null; // No error!
  } catch (e) {
    return e;
  }
}

let error = findParseError(content);
if (!error) {
  console.log('JSON is already valid!');
  process.exit(0);
}

console.log('Initial parse error:', error.message);

// Let's fix the invalid backslashes.
// In a valid JSON string, any backslash must be followed by:
// " \ / b f n r t or uXXXX
// Any backslash followed by anything else (like \lambda, \cdot, etc.) is invalid.
// We can use a regex to replace backslashes that are NOT part of a valid escape sequence.
// Let's analyze carefully:
// We want to find a backslash '\' that:
// 1. Is not followed by [\"\\/bfnrt]
// 2. Is not followed by u[0-9a-fA-F]{4}
// To do this reliably, we can iterate character by character.
// Or we can replace common LaTeX macros that are definitely causing problems:
// like \lambda, \cdot, \theta, \Delta, \vec, \frac, \sqrt, \times, etc.

let fixed = content;

// Let's write a character-by-character scanner to escape invalid backslashes inside JSON strings.
function escapeInvalidBackslashes(jsonStr) {
  let result = '';
  let inString = false;
  let i = 0;
  
  while (i < jsonStr.length) {
    const char = jsonStr[i];
    
    if (char === '"' && jsonStr[i - 1] !== '\\') {
      inString = !inString;
      result += char;
      i++;
      continue;
    }
    
    if (inString && char === '\\') {
      // Check if it is a valid escape sequence:
      // \", \\, \/, \b, \f, \n, \r, \t
      const nextChar = jsonStr[i + 1];
      const isValidSimpleEscape = ['"', '\\', '/', 'b', 'f', 'n', 'r', 't'].includes(nextChar);
      const isValidUnicodeEscape = nextChar === 'u' && /^[0-9a-fA-F]{4}$/.test(jsonStr.substring(i + 2, i + 6));
      
      if (isValidSimpleEscape) {
        result += '\\' + nextChar;
        i += 2;
      } else if (isValidUnicodeEscape) {
        result += '\\' + jsonStr.substring(i + 1, i + 6);
        i += 6;
      } else {
        // This is an invalid backslash (like \lambda or \cdot), we need to double it: \\
        result += '\\\\';
        i++;
      }
    } else {
      result += char;
      i++;
    }
  }
  return result;
}

console.log('Attempting character scanner fix...');
fixed = escapeInvalidBackslashes(content);

error = findParseError(fixed);
if (!error) {
  console.log('Success! JSON is now perfectly valid!');
  fs.writeFileSync(jsonPath, fixed, 'utf8');
} else {
  console.error('Character scanner fix failed:', error.message);
  
  // Let's try to locate the position and print context
  const match = error.message.match(/at position (\d+)/);
  if (match) {
    const pos = parseInt(match[1], 10);
    console.log('Error context around position ' + pos + ':');
    console.log(fixed.substring(Math.max(0, pos - 100), Math.min(fixed.length, pos + 100)));
  }
}
