const fs = require('fs');
let content = fs.readFileSync('node_modules/ai/dist/index.js', 'utf8');
let match = content.match(/inputSchema/g);
console.log("inputSchema count:", match ? match.length : 0);
let idx = content.indexOf('inputSchema');
console.log(content.substring(idx - 100, idx + 200));
