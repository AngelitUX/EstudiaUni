const fs = require("fs");
let content = fs.readFileSync("frontend-app/src/app/features/learning-path/data/seed-data.ts", "utf-8");

// We need to re-number the `order:` for cap-1 sections so they are sorted by `level` then by `order`.
// Actually, it's easier to just find the `sec-1-8-nar` and `sec-1-7-tip` blocks and swap their order values.

content = content.replace(/id:\s*'sec-1-7-tip'[\s\S]*?order:\s*8/, match => match.replace("order: 8", "order: 9"));
content = content.replace(/id:\s*'sec-1-8-nar'[\s\S]*?order:\s*9/, match => match.replace("order: 9", "order: 8"));

fs.writeFileSync("frontend-app/src/app/features/learning-path/data/seed-data.ts", content);
console.log("Fixed orders for sec-1-7-tip and sec-1-8-nar");
