import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { assessPassword } from '../.test-artifacts/compiled/core/strength.js';

let browser;
let server;
const origin = 'http://127.0.0.1:5173';

before(async () => {
  // Use a locally installed browser; tests never download one.
  const executablePath = process.env.LOCKLENS_BROWSER_PATH || [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
  ].find(existsSync);
  if (!executablePath) throw new Error('Set LOCKLENS_BROWSER_PATH to a local Chromium executable.');
  server = spawn(process.execPath, ['scripts/dev-server.mjs'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Preview server exited: ${code}`)));
    server.stdout.once('data', resolve);
  });
  browser = await chromium.launch({ executablePath, headless: true });
});

after(async () => {
  await browser?.close();
  server?.kill();
});

async function withPage(width, run, setup) {
  const context = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', () => errors.push('Browser runtime error'));
  page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
  await context.route('**/*', route => route.request().url().startsWith(`${origin}/`) ? route.continue() : route.abort());
  try {
    await setup?.(page);
    await page.goto(origin);
    await page.waitForFunction(() => document.getElementById('password-meta')?.textContent.includes('20 characters') || document.getElementById('generator-error')?.textContent.includes('unavailable'));
    await run(page, requests);
    assert.equal(errors.length, 0);
    assert.ok(requests.every(request => request.url.startsWith(`${origin}/`) && request.method === 'GET'));
  } finally { await context.close(); }
}

test('normal/advanced bounds, invalid input and result metadata remain synchronized', async () => {
  await withPage(1440, async page => {
    assert.equal(await page.locator('#length-slider').getAttribute('max'), '40');
    await page.locator('#advanced-length').check();
    assert.equal(await page.locator('#length-number').inputValue(), '41');
    await page.locator('#length-number').fill('64');
    await page.locator('#generate-btn').click();
    assert.match(await page.locator('#password-meta').textContent(), /64 characters/);
    await page.locator('#advanced-length').uncheck();
    assert.equal(await page.locator('#length-number').inputValue(), '40');
    await page.locator('#length-number').fill('8');
    await page.locator('#generate-btn').click();
    assert.match(await page.locator('#password-meta').textContent(), /8 characters/);
    const alphabet = await page.locator('#stat-alphabet').textContent();
    await page.locator('#symbols').uncheck();
    await page.locator('#ambiguous').check();
    await page.locator('#reveal-btn').click();
    assert.equal(await page.locator('#stat-alphabet').textContent(), alphabet);
    await page.locator('#length-number').fill('8.5');
    await page.locator('#generate-btn').click();
    assert.match(await page.locator('#generator-error').textContent(), /whole-number/);
    assert.match(await page.locator('#password-meta').textContent(), /8 characters/);
    await page.locator('#length-number').fill('8');
    for (const id of ['upper', 'lower', 'numbers']) await page.locator(`#${id}`).uncheck();
    await page.locator('#generate-btn').click();
    assert.match(await page.locator('#generator-error').textContent(), /at least one/);
  });
});

test('analyzer separates guess resistance and length guidance without network or storage writes', async () => {
  await withPage(1024, async (page, requests) => {
    await page.locator('#analyzer-tab').click();
    const requestCount = requests.length;
    await page.locator('#analyzer-input').fill('abababababababababab');
    assert.ok(Number(await page.locator('#analyzer-score').textContent()) <= 1);
    assert.match(await page.locator('#analyzer-length-guidance').textContent(), /Meets/);
    await page.locator('#analyzer-input').fill('m9$K2!vR8@xQ');
    assert.ok(Number(await page.locator('#analyzer-score').textContent()) >= 2);
    assert.match(await page.locator('#analyzer-length-guidance').textContent(), /15-character/);
    await page.locator('#analyzer-input').fill('<img src=x onerror=alert(1)>');
    assert.equal(await page.locator('#analysis-checks img').count(), 0);
    await page.locator('#analyzer-reveal').click();
    assert.equal(await page.locator('#analyzer-input').getAttribute('type'), 'text');
    assert.equal(requests.length, requestCount);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.equal(await page.evaluate(() => document.cookie), '');
  });
});

test('meter notes explain the highest band and estimator warnings stay prominent without score overrides', async () => {
  await withPage(390, async (page, requests) => {
    for (const prefix of ['score', 'analyzer']) {
      assert.equal(await page.locator(`#${prefix}-meter`).getAttribute('aria-describedby'), `${prefix}-estimator-note`);
      const note = await page.locator(`#${prefix}-estimator-note`).textContent();
      assert.match(note, /4\/4 is the highest estimator band/);
      assert.match(note, /equal scores can differ in resistance/);
      assert.match(note, /No breach check or safety guarantee/);
    }
    await page.locator('#analyzer-tab').click();
    const requestCount = requests.length;
    for (const value of ['password123', 'P@ssw0rd2026!', 'abababababababababab']) {
      const expected = assessPassword(value);
      assert.ok(expected.warning.length > 0);
      await page.locator('#analyzer-input').fill(value);
      assert.equal(await page.locator('#analyzer-score').textContent(), String(expected.score));
      assert.equal(await page.locator('#analyzer-summary').textContent(), `Warning: ${expected.warning}`);
      assert.match(await page.locator('#analyzer-summary').getAttribute('class'), /assessment-warning/);
      assert.match(await page.locator('#analyzer-length-guidance').textContent(), value.length < 15 ? /15-character/ : /Meets/);
    }
    const value = 'nhfckczbnua';
    const expected = assessPassword(value);
    assert.equal(expected.warning, '');
    await page.locator('#analyzer-input').fill(value);
    assert.equal(await page.locator('#analyzer-score').textContent(), String(expected.score));
    assert.equal(await page.locator('#analyzer-summary').textContent(), expected.summary);
    assert.equal(await page.locator('#analyzer-summary').evaluate(node => node.classList.contains('assessment-warning')), false);
    await page.locator('#analyzer-input').fill('');
    assert.equal(await page.locator('#analyzer-summary').evaluate(node => node.classList.contains('assessment-warning')), false);
    assert.equal(requests.length, requestCount);
  });
});

test('eleven-character generation keeps provenance separate from policy and entered-text analysis', async () => {
  await withPage(1440, async (page, requests) => {
    const requestCount = requests.length;
    await page.locator('#length-number').fill('11');
    await page.locator('#generate-btn').click();
    const score = await page.locator('#score-number').textContent();
    const provenance = await page.locator('#score-provenance').textContent();
    const process = await page.locator('#score-generation-detail').textContent();
    assert.match(provenance, /Generated here with Web Crypto/);
    assert.match(await page.locator('#score-length-guidance').textContent(), /15-character/);
    assert.match(process, /process bound/i);
    await page.locator('#symbols').uncheck();
    await page.locator('#length-number').fill('20');
    await page.locator('#reveal-btn').click();
    assert.equal(await page.locator('#score-provenance').textContent(), provenance);
    assert.equal(await page.locator('#score-generation-detail').textContent(), process);
    assert.equal(await page.locator('#stat-length').textContent(), '11');
    await page.locator('#analyzer-tab').click();
    // Move the ephemeral test value entirely inside the page, without logging it.
    await page.evaluate(() => {
      const input = document.getElementById('analyzer-input');
      input.value = document.getElementById('password-display').textContent;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    assert.equal(await page.locator('#analyzer-score').textContent(), score);
    assert.match(await page.locator('#analyzer-provenance').textContent(), /generation method unknown/);
    assert.equal(requests.length, requestCount);
  });
});

test('composition shows actual text while pool size follows saved generation metadata', async () => {
  await withPage(1024, async (page, requests) => {
    const requestCount = requests.length;
    assert.equal(await page.locator('#score-composition-length').textContent(), '20');
    assert.equal(await page.locator('#stat-categories').textContent(), '4');
    assert.equal(await page.locator('#stat-alphabet').textContent(), '85');
    assert.equal(await page.locator('#score-generation-details').getAttribute('open'), null);
    for (const key of ['upper', 'lower', 'numbers', 'symbols']) {
      assert.equal(await page.locator(`#score-composition-${key}`).getAttribute('data-present'), 'true');
      assert.match(await page.locator(`#score-${key}-presence`).textContent(), /present/);
    }
    for (const id of ['upper', 'numbers', 'symbols']) await page.locator(`#${id}`).uncheck();
    await page.locator('#ambiguous').check();
    await page.locator('#length-number').fill('32');
    await page.locator('#reveal-btn').click();
    assert.equal(await page.locator('#score-composition-length').textContent(), '20');
    assert.equal(await page.locator('#stat-categories').textContent(), '4');
    assert.equal(await page.locator('#stat-alphabet').textContent(), '85');

    await page.locator('#generate-btn').click();
    assert.equal(await page.locator('#score-composition-length').textContent(), '32');
    assert.equal(await page.locator('#stat-length').textContent(), '32');
    assert.equal(await page.locator('#stat-categories').textContent(), '1');
    assert.equal(await page.locator('#stat-alphabet').textContent(), '24');
    assert.equal(await page.locator('#score-composition-lower').getAttribute('data-present'), 'true');
    for (const key of ['upper', 'numbers', 'symbols']) {
      assert.equal(await page.locator(`#score-composition-${key}`).getAttribute('data-present'), 'false');
      assert.match(await page.locator(`#score-${key}-presence`).textContent(), /absent/);
    }

    for (const id of ['upper', 'numbers', 'symbols']) await page.locator(`#${id}`).check();
    await page.locator('#analyzer-tab').click();
    await page.locator('#analyzer-input').fill('a11!');
    assert.equal(await page.locator('#analyzer-composition-length').textContent(), '4');
    assert.equal(await page.locator('#analyzer-categories').textContent(), '3');
    assert.equal(await page.locator('#analyzer-composition-upper').getAttribute('data-present'), 'false');
    for (const key of ['lower', 'numbers', 'symbols']) assert.equal(await page.locator(`#analyzer-composition-${key}`).getAttribute('data-present'), 'true');
    assert.equal(await page.locator('#analyzer-view .composition-pool').count(), 0);
    assert.match(await page.locator('#analyzer-provenance').textContent(), /generation method unknown/);
    await page.locator('#analyzer-input').fill('\u00c9\u00e9\u0663\u{1F512}');
    assert.equal(await page.locator('#analyzer-composition-length').textContent(), '4');
    assert.equal(await page.locator('#analyzer-length').textContent(), '4');
    assert.equal(await page.locator('#analyzer-categories').textContent(), '4');
    await page.locator('#analyzer-input').fill('');
    assert.equal(await page.locator('#analyzer-categories').textContent(), '0');
    assert.equal(await page.locator('#analyzer-composition-length').textContent(), '0');
    assert.equal(await page.locator('#analyzer-view .composition-category[data-present="true"]').count(), 0);
    assert.equal(requests.length, requestCount);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  });
});

test('oversized input is retained and unassessed, with actual length and no stale score', async () => {
  await withPage(390, async (page, requests) => {
    await page.locator('#analyzer-tab').click();
    const requestCount = requests.length;
    const input = page.locator('#analyzer-input');
    await input.fill('m9$K2!vR8@xQ');
    assert.ok(Number(await page.locator('#analyzer-score').textContent()) > 1);
    for (const value of ['x'.repeat(257), '\u{1F512}'.repeat(129)]) {
      await input.fill(value);
      assert.equal(await input.evaluate(node => node.value.length), value.length);
      assert.equal(await page.locator('#analyzer-length').textContent(), String(Array.from(value).length));
      assert.equal(await page.locator('#analyzer-composition-length').textContent(), String(Array.from(value).length));
      assert.equal(await page.locator('#analyzer-categories').textContent(), '1');
      assert.equal(await page.locator('#analyzer-label').textContent(), 'Not assessed');
      assert.equal(await page.locator('#analyzer-score').textContent(), '—');
      assert.match(await page.locator('#analyzer-summary').textContent(), /No estimate/);
      assert.equal(await page.locator('#analyzer-meter').getAttribute('aria-valuetext'), 'Not assessed');
      assert.equal(await page.locator('#analyzer-meter span[class^="level-"]').count(), 0);
      assert.equal(await page.locator('#analyzer-suggestions li').count(), 0);
      assert.equal(await page.locator('#analysis-checks').textContent(), '');
      assert.match(await page.locator('#analyzer-length-guidance').textContent(), /Meets/);
    }
    await input.fill('password123');
    assert.ok(Number(await page.locator('#analyzer-score').textContent()) <= 1);
    assert.notEqual(await page.locator('#analyzer-label').textContent(), 'Not assessed');
    await input.fill('');
    assert.equal(await page.locator('#analyzer-score').textContent(), '—');
    assert.equal(await page.locator('#analyzer-length').textContent(), '0');
    assert.equal(requests.length, requestCount);
  });
});

test('tab semantics, arrow keys, Home and End follow selection and focus', async () => {
  await withPage(1440, async page => {
    await page.locator('#generator-tab').focus();
    for (const [key, view] of [['ArrowRight', 'analyzer'], ['ArrowRight', 'generator'], ['End', 'analyzer'], ['Home', 'generator'], ['ArrowLeft', 'analyzer']]) {
      await page.keyboard.press(key);
      assert.equal(await page.locator(`#${view}-tab`).getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator(`#${view}-tab`).getAttribute('aria-controls'), `${view}-view`);
      assert.equal(await page.locator(`#${view}-view`).isVisible(), true);
      assert.equal(await page.evaluate(() => document.activeElement.id), `${view}-tab`);
      assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
    }
  });
});

test('mobile drawer is inert when closed, traps focus, closes with Escape/backdrop and links', async () => {
  await withPage(390, async page => {
    assert.equal(await page.locator('#sidebar').evaluate(node => node.inert), true);
    await page.locator('#menu-toggle').click();
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#sidebar').evaluate(node => node.contains(document.activeElement)), true);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#privacy');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.view), 'generator');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
    await page.locator('#menu-toggle').click();
    await page.locator('#navigation-backdrop').click({ position: { x: 360, y: 400 } });
    assert.equal(await page.locator('#sidebar').evaluate(node => node.inert), true);
    await page.locator('#menu-toggle').click();
    await page.locator('#sidebar a[href="#privacy"]').click();
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'privacy');
    assert.match(await page.locator('#privacy').textContent(), /ordinary access logs/);
    await page.locator('#menu-toggle').click();
    await page.locator('#sidebar [data-view="analyzer"]').click();
    assert.equal(await page.locator('#analyzer-view').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
    await page.setViewportSize({ width: 768, height: 950 });
    assert.equal(await page.locator('#sidebar').evaluate(node => node.inert), false);
    for (const link of await page.locator('#sidebar .side-link').all()) assert.ok(await link.getAttribute('aria-label'));
  });
});

test('generator and analyzer avoid page overflow at all required widths', async () => {
  for (const width of [320, 390, 768, 1024, 1440]) await withPage(width, async page => {
    for (const view of ['generator', 'analyzer']) {
      await page.locator(`#${view}-tab`).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflow at ${width}px in ${view}`);
    }
  });
});

test('copy does not reveal passwords; unavailable crypto reports a readable error', async () => {
  await withPage(1440, async page => {
    const masked = await page.locator('#password-display').textContent();
    await page.locator('#copy-btn').click();
    assert.match(await page.locator('#toast').textContent(), /Password copied/);
    assert.equal(await page.locator('#password-display').textContent(), masked);
    assert.equal(await page.evaluate(() => window.copyCount), 1);
  }, page => page.addInitScript(() => {
    window.copyCount = 0;
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { window.copyCount++; } } });
  }));
  await withPage(1440, async page => {
    assert.match(await page.locator('#generator-error').textContent(), /unavailable/);
    assert.equal(await page.locator('#password-display').textContent(), 'Generate to begin');
    assert.equal(await page.locator('#score-composition-pool').isVisible(), false);
    assert.equal(await page.locator('#stat-categories').textContent(), '0');
    assert.equal(await page.locator('#score-composition-length').textContent(), '0');
  }, page => page.addInitScript(() => Object.defineProperty(globalThis, 'crypto', { value: undefined })));
});
