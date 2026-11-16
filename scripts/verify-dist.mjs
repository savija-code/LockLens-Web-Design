import { readFileSync, statSync } from 'node:fs';
import { assertFileSet, listFiles, productionFiles } from './production-files.mjs';

const files = listFiles('dist');
assertFileSet(files, productionFiles);
for (const file of files.filter(name => /\.(?:js|css)$/.test(name))) {
  const source = readFileSync(`dist/${file}`, 'utf8');
  if (/sourceMappingURL\s*=|sourceURL\s*=/.test(source)) throw new Error(`Source-map reference in production asset: ${file}`);
}
console.log('Verified production inventory:');
for (const file of files) console.log(`  ${file} (${statSync(`dist/${file}`).size} bytes)`);
