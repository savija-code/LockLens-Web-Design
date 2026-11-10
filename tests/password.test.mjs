import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_OPTIONS, activeAlphabetSize, generateBatch, generatePasswords, lengthBounds, validateLength, validateOptions } from '../.test-artifacts/compiled/core/password.js';

test('normal and advanced length bounds reject fractional and non-finite values', () => {
  assert.deepEqual(lengthBounds(false), { min: 8, max: 40 });
  assert.deepEqual(lengthBounds(true), { min: 41, max: 64 });
  for (const advanced of [false, true]) {
    const { min, max } = lengthBounds(advanced);
    for (const length of [min, max]) assert.equal(validateLength(length, advanced), null);
    for (const length of [min - 1, max + 1, min + 0.5, NaN, Infinity]) assert.ok(validateLength(length, advanced));
  }
  assert.equal(DEFAULT_OPTIONS.length, 20);
});

test('all category combinations, exclusions, lengths and supported counts preserve guarantees', () => {
  const sets = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()-_=+[]{};:,.?' };
  let checked = 0;
  for (let mask = 1; mask < 16; mask++) for (const excludeAmbiguous of [false, true]) {
    for (const length of [8, 20, 40, 41, 64]) for (const count of [1, 5, 10]) {
      const options = { ...DEFAULT_OPTIONS, length, count, excludeAmbiguous };
      Object.keys(sets).forEach((key, index) => options[key] = Boolean(mask & (1 << index)));
      const groups = Object.entries(sets).filter(([key]) => options[key]).map(([, chars]) => [...chars].filter(c => !excludeAmbiguous || !'O0oIl1|'.includes(c)).join(''));
      const values = generatePasswords(options);
      assert.equal(values.length, count);
      for (const value of values) {
        // Assertions report only booleans or counts, never generated secret values.
        assert.equal(value.length, length);
        assert.ok([...value].every(c => groups.join('').includes(c)));
        assert.ok(groups.every(group => [...value].some(c => group.includes(c))));
        checked++;
      }
    }
  }
  assert.equal(checked, 2400);
});

test('invalid options are rejected at the core boundary', () => {
  const invalid = [null, {}, { ...DEFAULT_OPTIONS, upper: 'yes' }, { ...DEFAULT_OPTIONS, excludeAmbiguous: 1 },
    ...[7, 65, 20.1, NaN, Infinity, '20'].map(length => ({ ...DEFAULT_OPTIONS, length })),
    ...[0, 2, 11, 1.5, NaN, '5'].map(count => ({ ...DEFAULT_OPTIONS, count })),
    { ...DEFAULT_OPTIONS, upper: false, lower: false, numbers: false, symbols: false }];
  for (const options of invalid) {
    assert.ok(validateOptions(options));
    assert.throws(() => generatePasswords(options));
  }
});

test('generated metadata remains tied to the batch after controls change', () => {
  const options = { ...DEFAULT_OPTIONS };
  const batch = generateBatch(options);
  const alphabet = activeAlphabetSize(batch.options);
  options.symbols = false;
  options.length = 8;
  options.excludeAmbiguous = true;
  assert.equal(batch.options.length, 20);
  assert.equal(batch.options.symbols, true);
  assert.equal(activeAlphabetSize(batch.options), alphabet);
  assert.notEqual(activeAlphabetSize(options), alphabet);
  assert.equal(batch.passwords[0].length, 20);
  assert.ok(Object.isFrozen(batch.options));
});

test('rejection sampling discards the incomplete interval and shuffle moves category positions', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  let calls = 0;
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: {
    getRandomValues(buffer) { buffer[0] = calls++ === 0 ? 0xffffffff : 0; return buffer; }
  } });
  try {
    const options = { ...DEFAULT_OPTIONS, upper: false, lower: false, symbols: false, length: 8 };
    const [value] = generatePasswords(options);
    assert.equal(calls, 16); // 8 picks + 7 shuffle draws + 1 rejected draw for a pool of 10.
    assert.ok(/^0{8}$/.test(value));
    calls = 1;
    const [shuffled] = generatePasswords({ ...DEFAULT_OPTIONS, length: 8 });
    assert.ok(/[a-z]/.test(shuffled[0]));
    assert.ok(/[A-Z]/.test(shuffled[7]));
  } finally { Object.defineProperty(globalThis, 'crypto', original); }
});

test('missing crypto fails explicitly, without an insecure fallback', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: undefined });
  try { assert.throws(() => generatePasswords(DEFAULT_OPTIONS), /Secure randomness is unavailable/); }
  finally { Object.defineProperty(globalThis, 'crypto', original); }
});
