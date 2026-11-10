import { build } from 'esbuild';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'eof',
  outfile: 'dist/assets/main.js'
});

const licenses = [
  ['@zxcvbn-ts/core', 'LICENSE.txt'],
  ['@zxcvbn-ts/language-common', 'LICENSE.txt'],
  ['@zxcvbn-ts/language-en', 'LICENSE.txt'],
  ['@zxcvbn-ts/language-en', 'NOTICE.md'],
  ['@zxcvbn-ts/language-en', 'THIRD_PARTY_LICENSES.md'],
  ['@zxcvbn-ts/dictionary-compression', 'LICENSE'],
  ['fastest-levenshtein', 'LICENSE.md']
];
writeFileSync('dist/THIRD_PARTY_NOTICES.txt', licenses.map(([name, file]) => `${name} / ${file}\n${readFileSync(`node_modules/${name}/${file}`, 'utf8')}`).join('\n\n'));
const size = statSync('dist/assets/main.js').size;
const compressed = gzipSync(readFileSync('dist/assets/main.js')).length;
console.log(`Local app bundle: ${(size / 1024).toFixed(0)} KiB (${(compressed / 1024).toFixed(0)} KiB gzip).`);
