import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assessGeneratedPassword, assessPassword, MAX_ANALYSIS_LENGTH } from '../.test-artifacts/compiled/core/strength.js';
import { lengthGuidance } from '../.test-artifacts/compiled/core/guidance.js';
import { DEFAULT_OPTIONS, generateBatch, generationProvenance } from '../.test-artifacts/compiled/core/password.js';
import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import * as english from '@zxcvbn-ts/language-en';
import { analyzeComposition } from '../.test-artifacts/compiled/core/composition.js';

const referenceEstimator = new ZxcvbnFactory({ dictionary: { ...common.dictionary, ...english.dictionary }, graphs: common.adjacencyGraphs, translations: english.translations, maxLength: 256 });

const diagnosticSamples = {
  numeric: '12345678', common: 'password123', substituted: 'P@ssw0rd2026!',
  repeated: 'abababababababababab', shortLower: 'nhfckczbnua', shortMixed: '9V3rnz8KeBa',
  longLower: 'iyrsgkeqqyctoajwhnnj', longMixed: 'Ylxl7R#ttXboemeqgWQ#'
};

test('diagnostic fixtures preserve estimator scores, guess estimates and warning priority', () => {
  for (const value of Object.values(diagnosticSamples)) {
    const expected = referenceEstimator.check(value);
    const actual = assessPassword(value);
    assert.equal(actual.score, expected.score);
    assert.equal(actual.guessesLog10, expected.guessesLog10);
    assert.equal(actual.warning, expected.feedback.warning ?? '');
    if (expected.feedback.warning) {
      assert.equal(actual.summary, expected.feedback.warning);
      assert.deepEqual(actual.suggestions, expected.feedback.suggestions);
    }
    assert.equal(actual.provenance.source, 'external');
    assert.equal(actual.provenance.minEntropyBits, undefined);
    assert.equal(actual.provenance.alphabetSize, undefined);
  }
});

test('long repetition has fewer modeled guesses than the random-looking twenty-character fixtures', () => {
  const repeated = assessPassword(diagnosticSamples.repeated);
  assert.ok(repeated.weaknesses.some(pattern => /Repeated/.test(pattern)));
  assert.ok(repeated.warning.length > 0);
  for (const value of [diagnosticSamples.longLower, diagnosticSamples.longMixed]) {
    const longer = assessPassword(value);
    assert.equal(longer.composition.length, repeated.composition.length);
    assert.ok(repeated.guessesLog10 < longer.guessesLog10);
    assert.ok(repeated.score < longer.score);
    assert.equal(lengthGuidance(value), lengthGuidance(diagnosticSamples.repeated));
  }
});

test('equal estimator bands can contain different guess estimates with independent length guidance', () => {
  for (const [shortValue, longValue] of [
    [diagnosticSamples.shortLower, diagnosticSamples.longLower],
    [diagnosticSamples.shortMixed, diagnosticSamples.longMixed]
  ]) {
    const short = assessPassword(shortValue);
    const long = assessPassword(longValue);
    assert.equal(short.score, long.score);
    assert.ok(short.guessesLog10 < long.guessesLog10);
    assert.match(lengthGuidance(shortValue), /15-character/);
    assert.match(lengthGuidance(longValue), /Meets/);
    assert.deepEqual(assessPassword(shortValue), short);
    assert.deepEqual(assessPassword(longValue), long);
  }
});

function generateWithTestDraws(options, draws) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  let position = 0;
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: {
    getRandomValues(buffer) {
      assert.ok(position < draws.length, 'Unexpected extra random draw');
      buffer[0] = draws[position++];
      return buffer;
    }
  } });
  try {
    const batch = generateBatch(options);
    assert.equal(position, draws.length);
    return batch;
  } finally { Object.defineProperty(globalThis, 'crypto', original); }
}

test('repeated, dictionary, keyboard and sequence patterns receive low estimates', () => {
  for (const sample of ['abababababababababab', 'abcabcabcabcabcabcabc', 'password123', 'qwertyuiop', '12345678901234567890', 'aaaaaaaaaaaaaaaaaaaa']) {
    const result = assessPassword(sample);
    assert.ok(result.score <= 1);
    assert.notEqual(result.label, 'Strong');
    assert.ok(result.suggestions.length > 0);
    assert.deepEqual(result.composition, analyzeComposition(sample));
  }
});

test('short unpredictable inputs can score above weak without changing length guidance', () => {
  const sample = 'm9$K2!vR8@xQ';
  const before = assessPassword(sample);
  assert.ok(before.score >= 2);
  assert.match(lengthGuidance(sample), /NIST.*single-factor/);
  assert.match(lengthGuidance(sample), /estimate is separate/);
  assert.deepEqual(assessPassword(sample), before);
  assert.match(lengthGuidance('abababababababababab'), /Meets/);
  assert.ok(assessPassword('abababababababababab').score <= 1);
});

test('length guidance counts Unicode code points and treats fifteen as the advisory boundary', () => {
  assert.match(lengthGuidance('x'.repeat(14)), /15-character/);
  assert.match(lengthGuidance('x'.repeat(15)), /Meets/);
  assert.match(lengthGuidance('\u{1F512}'.repeat(8)), /15-character/);
  assert.match(lengthGuidance(''), /Enter a test password/);
});

test('all requested lengths and category configurations use the real estimator without a policy penalty', () => {
  for (const length of [8, 11, 14, 15, 20, 64]) {
    for (const categories of [
      { upper: true, lower: true, numbers: true, symbols: true },
      { upper: true, lower: false, numbers: false, symbols: false },
      { upper: false, lower: true, numbers: false, symbols: false },
      { upper: false, lower: false, numbers: true, symbols: false },
      { upper: false, lower: false, numbers: false, symbols: true },
      { upper: true, lower: false, numbers: true, symbols: false }
    ]) for (const excludeAmbiguous of [false, true]) {
      const batch = generateBatch({ ...DEFAULT_OPTIONS, ...categories, length, excludeAmbiguous });
      const value = batch.passwords[0];
      const generated = assessGeneratedPassword(batch);
      const entered = assessPassword(value);
      const expected = referenceEstimator.check(value);
      assert.equal(generated.score, expected.score);
      assert.equal(generated.guessesLog10, expected.guessesLog10);
      assert.equal(generated.guessesLog10, entered.guessesLog10);
      assert.equal(generated.warning, entered.warning);
      assert.equal(generated.score, entered.score);
      assert.deepEqual(generated.weaknesses, entered.weaknesses);
      assert.deepEqual(generated.composition, entered.composition);
      assert.equal(generated.composition.length, length);
      assert.equal(generated.composition.categoryCount, Object.values(categories).filter(Boolean).length);
      assert.equal(generated.provenance.source, 'generated');
      assert.equal(generated.provenance.alphabetSize, generationProvenance(batch).alphabetSize);
      assert.equal(entered.provenance.source, 'external');
      assert.equal(entered.provenance.minEntropyBits, undefined);
      assert.equal(entered.provenance.alphabetSize, undefined);
      assert.ok(generated.provenance.minEntropyBits > 0);
      assert.match(lengthGuidance(value), length < 15 ? /15-character/ : /Meets/);
    }
  }
});

test('composition describes actual characters, including Unicode, without retaining the input', () => {
  assert.deepEqual(analyzeComposition(''), { length: 0, categoryCount: 0, counts: { upper: 0, lower: 0, numbers: 0, symbols: 0 } });
  assert.deepEqual(analyzeComposition('aAa0!a'), { length: 6, categoryCount: 4, counts: { upper: 1, lower: 3, numbers: 1, symbols: 1 } });
  assert.deepEqual(analyzeComposition('lowercaseonly'), { length: 13, categoryCount: 1, counts: { upper: 0, lower: 13, numbers: 0, symbols: 0 } });
  // Uppercase/titlecase, lowercase, a Unicode number, then punctuation, space,
  // emoji, an uncased letter and a combining mark (each a separate code point).
  assert.deepEqual(analyzeComposition('\u00c9\u01c5\u00e9\u0663! \u{1F512}\u4e2d\u0301'), {
    length: 9, categoryCount: 4, counts: { upper: 2, lower: 1, numbers: 1, symbols: 5 }
  });
});

test('a long single-category generated fixture can outrank a short mixed-category one', () => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const longValue = 'vkmqzhtxrnpwfjcdsybgaule';
  const longBatch = generateWithTestDraws({ ...DEFAULT_OPTIONS, upper: false, numbers: false, symbols: false, length: longValue.length }, [
    ...Array.from(longValue, c => lower.indexOf(c)),
    ...Array.from({ length: longValue.length - 1 }, (_, i) => longValue.length - 1 - i)
  ]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?';
  const shortBatch = generateWithTestDraws({ ...DEFAULT_OPTIONS, length: 8 }, [
    10, 21, 7, 4, ...Array.from('M2!q', c => alphabet.indexOf(c)),
    ...Array.from({ length: 7 }, (_, i) => 7 - i)
  ]);
  const long = assessGeneratedPassword(longBatch);
  const short = assessGeneratedPassword(shortBatch);
  assert.equal(long.composition.categoryCount, 1);
  assert.equal(short.composition.categoryCount, 4);
  assert.equal(long.score, referenceEstimator.check(longBatch.passwords[0]).score);
  assert.equal(short.score, referenceEstimator.check(shortBatch.passwords[0]).score);
  assert.ok(long.score > short.score);
  assert.ok(Math.abs(long.provenance.minEntropyBits - longValue.length * Math.log2(26)) < 1e-10);
  assert.match(lengthGuidance(shortBatch.passwords[0]), /15-character/);
});

test('composition and saved pool remain independent of later selections and fabricated provenance', () => {
  const options = { ...DEFAULT_OPTIONS, length: 20, excludeAmbiguous: true, count: 5, upper: false, numbers: false, symbols: false };
  const batch = generateBatch(options);
  const before = batch.passwords.map((_, index) => assessGeneratedPassword(batch, index));
  Object.assign(options, DEFAULT_OPTIONS);
  batch.passwords.forEach((_, index) => {
    const result = assessGeneratedPassword(batch, index);
    assert.deepEqual(result, before[index]);
    assert.equal(result.composition.categoryCount, 1);
    assert.deepEqual(result.composition.counts, { upper: 0, lower: 20, numbers: 0, symbols: 0 });
    assert.equal(result.provenance.alphabetSize, 24);
    assert.ok(Math.abs(result.provenance.minEntropyBits - 20 * Math.log2(24)) < 1e-10);
  });
  const fabricated = assessGeneratedPassword({ passwords: ['abc123!!'], options });
  assert.deepEqual(fabricated.composition, { length: 8, categoryCount: 3, counts: { upper: 0, lower: 3, numbers: 3, symbols: 2 } });
  assert.equal(fabricated.provenance.source, 'external');
  assert.equal(fabricated.provenance.alphabetSize, undefined);
  assert.equal(fabricated.provenance.minEntropyBits, undefined);
  assert.equal(assessGeneratedPassword({ ...batch }).provenance.alphabetSize, undefined);
});

test('an eleven-character generated fixture is not penalized by the length advisory', () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?';
  // Synthetic draws choose the mandatory categories, pool fill, then identity shuffle.
  const batch = generateWithTestDraws({ ...DEFAULT_OPTIONS, length: 11 }, [
    10, 21, 7, 4, ...Array.from('M2!qR9@', c => alphabet.indexOf(c)),
    ...Array.from({ length: 10 }, (_, i) => 10 - i)
  ]);
  const value = batch.passwords[0];
  const result = assessGeneratedPassword(batch);
  assert.equal(value.length, 11);
  assert.equal(result.score, referenceEstimator.check(value).score);
  assert.ok(result.score > 1);
  assert.equal(result.provenance.source, 'generated');
  assert.match(lengthGuidance(value), /15-character/);
});

test('trusted generation provenance never overrides a predictable output', () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?';
  const batch = generateWithTestDraws({ ...DEFAULT_OPTIONS, length: 20 }, [
    0, 0, 0, 0, ...Array.from('Aa0!'.repeat(4), c => alphabet.indexOf(c)),
    ...Array.from({ length: 19 }, (_, i) => 19 - i)
  ]);
  const value = batch.passwords[0];
  const result = assessGeneratedPassword(batch);
  assert.ok(value === 'Aa0!'.repeat(5));
  assert.equal(result.score, referenceEstimator.check(value).score);
  assert.ok(result.score <= 1);
  assert.ok(result.weaknesses.some(text => /Repeated/.test(text)));
  assert.equal(result.provenance.source, 'generated');
  assert.ok(result.provenance.minEntropyBits > 100);
  assert.match(lengthGuidance(value), /Meets/);
});

test('common substitutions and repeated common words do not become strong through length', () => {
  for (const value of ['P@ssw0rd!', 'Password123!', 'password'.repeat(8), 'P@ssw0rd!'.repeat(7)]) {
    const result = assessPassword(value);
    assert.equal(result.score, referenceEstimator.check(value).score);
    assert.ok(result.score <= 1);
    assert.ok(result.weaknesses.length > 0);
    assert.ok(result.suggestions.length > 0);
  }
});

test('long patterns remain weak; a short high-variety sample is scored by the estimator', () => {
  for (const length of [8, 11, 14, 15, 20, 64]) {
    const repeated = 'ab'.repeat(Math.ceil(length / 2)).slice(0, length);
    const result = assessPassword(repeated);
    assert.equal(result.score, referenceEstimator.check(repeated).score);
    assert.ok(result.score <= 1);
    assert.ok(result.weaknesses.some(text => /Repeated/.test(text)));
  }
  const short = 'm9$K2!vR8@x';
  assert.equal(short.length, 11);
  assert.equal(assessPassword(short).score, referenceEstimator.check(short).score);
  assert.ok(assessPassword(short).score > 1);
});

test('provenance cannot be attached to copied or fabricated batches', () => {
  const options = { ...DEFAULT_OPTIONS, length: 11 };
  const batch = generateBatch(options);
  const before = assessGeneratedPassword(batch);
  options.length = 64;
  options.symbols = false;
  assert.deepEqual(assessGeneratedPassword(batch), before);
  assert.equal(assessGeneratedPassword({ ...batch }).provenance.source, 'external');
  assert.equal(assessGeneratedPassword({ passwords: ['ab'.repeat(10)], options }).provenance.source, 'external');
  assert.equal(generationProvenance(batch, -1), null);
  assert.equal(generationProvenance(batch, 1), null);
  assert.ok(Object.isFrozen(batch));
  assert.ok(Object.isFrozen(batch.passwords));
});

test('process bound accounts for category coverage and equals uniform sampling for one category', () => {
  for (const length of [8, 11, 14, 15, 20, 64]) {
    const digits = generateBatch({ ...DEFAULT_OPTIONS, length, upper: false, lower: false, symbols: false });
    assert.ok(Math.abs(generationProvenance(digits).minEntropyBits - length * Math.log2(10)) < 1e-10);
    const mixed = generateBatch({ ...DEFAULT_OPTIONS, length });
    assert.ok(generationProvenance(mixed).minEntropyBits < length * Math.log2(generationProvenance(mixed).alphabetSize));
  }
});

test('category-count enumeration independently confirms normalization and maximum output probability', () => {
  // Independently model pool-fill counts, then divide their mass among shuffled
  // outputs of that composition, rather than repeat the production bound formula.
  const factorial = n => n < 2 ? 1 : n * factorial(n - 1);
  for (const length of [8, 11, 14, 15, 20, 64]) {
    for (const sizes of [[10, 23], [26, 10, 23], [26, 26, 10, 23]]) {
      const batch = generateBatch({ ...DEFAULT_OPTIONS, length, upper: sizes.length >= 3, lower: sizes.length === 4 });
      const alphabet = sizes.reduce((sum, size) => sum + size, 0);
      assert.equal(generationProvenance(batch).alphabetSize, alphabet);
      let total = 0;
      let maxProbability = 0;
      function enumerate(counts, remaining) {
        if (counts.length < sizes.length - 1) {
          for (let n = 1; n <= remaining - (sizes.length - counts.length - 1); n++) enumerate([...counts, n], remaining - n);
          return;
        }
        const finalCounts = [...counts, remaining];
        const fillCounts = finalCounts.map(n => n - 1);
        const mass = factorial(length - sizes.length)
          * fillCounts.reduce((product, n, i) => product * (sizes[i] / alphabet) ** n / factorial(n), 1);
        const outcomes = factorial(length)
          * finalCounts.reduce((product, n, i) => product * sizes[i] ** n / factorial(n), 1);
        total += mass;
        maxProbability = Math.max(maxProbability, mass / outcomes);
      }
      enumerate([], length);
      assert.ok(Math.abs(total - 1) < 1e-10);
      assert.ok(Math.abs(-Math.log2(maxProbability) - generationProvenance(batch).minEntropyBits) < 1e-10);
    }
  }
});

test('empty input does not look assessed and unusually long inputs are bounded', () => {
  assert.equal(assessPassword('').label, 'No password');
  assert.equal(assessPassword('').guessesLog10, null);
  assert.equal(assessPassword('').warning, '');
  for (const value of ['x'.repeat(MAX_ANALYSIS_LENGTH), '\u{1F512}'.repeat(MAX_ANALYSIS_LENGTH / 2)]) {
    assert.equal(assessPassword(value).assessed, true);
  }
  for (const value of ['x'.repeat(MAX_ANALYSIS_LENGTH + 1), '\u{1F512}'.repeat(MAX_ANALYSIS_LENGTH / 2 + 1)]) {
    const result = assessPassword(value);
    assert.equal(result.assessed, false);
    assert.equal(result.guessesLog10, null);
    assert.equal(result.warning, '');
    assert.equal(result.composition.length, Array.from(value).length);
    assert.equal(result.composition.categoryCount, 1);
    assert.equal(result.label, 'Not assessed');
    assert.match(result.summary, /256/);
    assert.deepEqual(result.weaknesses, []);
    assert.deepEqual(result.suggestions, []);
    assert.deepEqual(result.checks, []);
  }
});
