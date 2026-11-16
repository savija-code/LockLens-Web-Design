import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const styleFiles = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'responsive.css'];
// Review additions explicitly so public/ never becomes a catch-all deployment copy.
export const publicFiles = ['favicon.svg'];
export const productionFiles = [
  'index.html', 'LICENSE', 'THIRD_PARTY_NOTICES.txt', '_headers', 'assets/main.js',
  ...publicFiles, ...styleFiles.map(name => `assets/styles/${name}`)
];

export function listFiles(root, prefix = '') {
  if (!prefix && lstatSync(root).isSymbolicLink()) throw new Error('Deployment roots cannot be symbolic links.');
  return readdirSync(join(root, prefix), { withFileTypes: true }).flatMap(entry => {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not deployment assets: ${path}`);
    if (entry.isDirectory()) return listFiles(root, path);
    if (!entry.isFile()) throw new Error(`Unsupported deployment entry: ${path}`);
    return [path];
  }).sort();
}

export function assertFileSet(actual, allowed, requireAll = true) {
  const unexpected = actual.filter(path => !allowed.includes(path));
  const missing = requireAll ? allowed.filter(path => !actual.includes(path)) : [];
  if (unexpected.length || missing.length) {
    throw new Error(`Deployment inventory mismatch. Unexpected: ${unexpected.join(', ') || 'none'}. Missing: ${missing.join(', ') || 'none'}. Review the file list; no files were removed.`);
  }
}
