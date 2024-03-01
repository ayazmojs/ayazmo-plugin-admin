const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'dist');

fs.copySync(srcDir, destDir, {
  filter: (src, dest) => src.endsWith('.json'),
});