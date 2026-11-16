import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { confirmedProfileUrl, creatorProfiles } from '../.test-artifacts/compiled/config/creator.js';
import { assertFileSet, listFiles, productionFiles, styleFiles } from '../scripts/production-files.mjs';

test('only confirmed canonical HTTPS social URLs can be published', () => {
  assert.equal(confirmedProfileUrl('github', creatorProfiles.github), 'https://github.com/savija-code');
  assert.equal(confirmedProfileUrl('linkedin', creatorProfiles.linkedin), null);
  assert.equal(confirmedProfileUrl('facebook', creatorProfiles.facebook), null);
  assert.equal(confirmedProfileUrl('linkedin', 'https://www.linkedin.com/in/confirmed-profile'), 'https://www.linkedin.com/in/confirmed-profile');
  assert.equal(confirmedProfileUrl('facebook', 'https://www.facebook.com/confirmed-profile'), 'https://www.facebook.com/confirmed-profile');
  for (const value of [null, '', '#', 'javascript:alert(1)', 'http://github.com/name', 'https://github.com',
    'https://github.com.evil.example/name', 'https://github.com@evil.example/name', 'https://user:pass@github.com/name',
    'https://github.com:8443/name', 'https://github.com/name?tracking=1', 'https://github.com/name#tracking']) {
    assert.equal(confirmedProfileUrl('github', value), null);
  }
});

test('production inventory rejects stale maps, secrets, tests and unreviewed files', () => {
  assertFileSet(listFiles('dist'), productionFiles);
  for (const extra of ['assets/main.js.map', '.env', 'tests/browser.test.mjs', 'internal/notes.md', 'screenshot.png', '.git/config']) {
    assert.throws(() => assertFileSet([...productionFiles, extra], productionFiles), /Deployment inventory mismatch/);
  }
  assert.throws(() => assertFileSet(productionFiles.filter(path => path !== 'LICENSE'), productionFiles), /Missing: LICENSE/);
  assertFileSet(['index.html'], productionFiles, false);
});

test('production CSS is minified, contains no source-map references and preserves notices', () => {
  for (const file of styleFiles) {
    const output = readFileSync(`dist/assets/styles/${file}`, 'utf8');
    const source = readFileSync(`src/styles/${file}`, 'utf8');
    assert.ok(output.length < source.length);
    assert.ok(!output.includes('sourceMappingURL'));
  }
  assert.equal(readFileSync('dist/LICENSE', 'utf8'), readFileSync('LICENSE', 'utf8'));
  const notices = readFileSync('dist/THIRD_PARTY_NOTICES.txt', 'utf8');
  assert.match(notices, /OpenSubtitles/);
  assert.match(notices, /ODC-BY/);
  assert.match(notices, /Copyright \(c\) 2012-2016 Dan Wheeler and Dropbox/);
});

test('static hosting headers permit local resources and deny external scripts and framing', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const headers = Object.fromEntries(config.headers[0].headers.map(header => [header.key, header.value]));
  const csp = headers['Content-Security-Policy'];
  for (const directive of ["script-src 'self'", "style-src 'self'", "worker-src 'self'", "connect-src 'self'", "frame-ancestors 'none'", "form-action 'none'"]) {
    assert.ok(csp.includes(directive));
  }
  assert.ok(!/unsafe-inline|unsafe-eval|blob:|https:/.test(csp));
  assert.equal(headers['Referrer-Policy'], 'no-referrer');
  const cloudflare = readFileSync('dist/_headers', 'utf8');
  for (const [key, value] of Object.entries(headers)) assert.ok(cloudflare.includes(`${key}: ${value}`));
});
