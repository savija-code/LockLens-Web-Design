import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { transform } from 'esbuild';
import { assertFileSet, listFiles, productionFiles, publicFiles, styleFiles } from './production-files.mjs';

// Fail closed on stale or unreviewed assets, preserving them for owner review.
assertFileSet(listFiles('public'), publicFiles);
if (existsSync('dist')) assertFileSet(listFiles('dist'), productionFiles, false);
mkdirSync('dist/assets/styles', { recursive: true });
cpSync('index.html', 'dist/index.html');
cpSync('LICENSE', 'dist/LICENSE');
for (const file of publicFiles) cpSync(`public/${file}`, `dist/${file}`);
for (const file of styleFiles) {
  const output = await transform(readFileSync(`src/styles/${file}`, 'utf8'), {
    loader: 'css', minify: true, sourcemap: false, legalComments: 'eof', target: 'es2022'
  });
  writeFileSync(`dist/assets/styles/${file}`, output.code);
}
const { headers } = JSON.parse(readFileSync('vercel.json', 'utf8'));
writeFileSync('dist/_headers', `/*\n${headers[0].headers.map(header => `  ${header.key}: ${header.value}`).join('\n')}\n`);
