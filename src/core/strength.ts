import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as englishDictionary, translations } from '@zxcvbn-ts/language-en';
import { generationProvenance, type GeneratedBatch } from './password.js';
import { analyzeComposition, type CharacterComposition } from './composition.js';

// zxcvbn measures its input limit in UTF-16 code units, not Unicode code points.
export const MAX_ANALYSIS_LENGTH = 256;

// All dictionaries and keyboard graphs are bundled locally; no network matchers.
const estimator = new ZxcvbnFactory({
  translations,
  graphs: adjacencyGraphs,
  dictionary: { ...commonDictionary, ...englishDictionary },
  maxLength: MAX_ANALYSIS_LENGTH
});

export type StrengthResult = {
  score: number;
  label: string;
  assessed: boolean;
  guessesLog10: number | null;
  warning: string;
  summary: string;
  suggestions: string[];
  weaknesses: string[];
  composition: CharacterComposition;
  provenance: {
    source: 'generated' | 'external';
    summary: string;
    minEntropyBits?: number;
    alphabetSize?: number;
  };
  checks: { label: string; passed: boolean; detail: string }[];
};

const patternDescriptions: Record<string, string> = {
  dictionary: 'Recognized words or common password fragments',
  repeat: 'Repeated characters or blocks',
  sequence: 'Predictable character sequences',
  wordSequence: 'Predictable word sequences',
  spatial: 'Keyboard patterns',
  date: 'Dates',
  regex: 'Familiar numeric patterns'
};

/** Pattern estimate only: unknown origin is never treated as proof of randomness. */
export function assessPassword(value: string): StrengthResult {
  const composition = analyzeComposition(value);
  const provenance: StrengthResult['provenance'] = { source: 'external', summary: 'Entered password - generation method unknown.' };
  if (!value || value.length > MAX_ANALYSIS_LENGTH) return {
    score: 0, assessed: false, label: value ? 'Not assessed' : 'No password', guessesLog10: null, warning: '',
    summary: value ? `Input exceeds the ${MAX_ANALYSIS_LENGTH}-character analysis limit (some characters count twice). No estimate is shown.` : 'Enter a test password for local feedback.',
    weaknesses: [], suggestions: [], composition, provenance, checks: []
  };
  const result = estimator.check(value);
  // Return descriptions, never matching tokens or raw estimator results.
  const weaknesses = [...new Set(result.sequence.map(match => patternDescriptions[match.pattern]).filter(Boolean))];
  const warning = result.feedback.warning ?? '';
  const suggestions = result.feedback.suggestions.length
    ? [...result.feedback.suggestions]
    : ['Use a unique password for every account and enable MFA when available.'];
  return {
    score: result.score,
    label: ['Very weak', 'Weak', 'Moderate', 'Good', 'Strong'][result.score],
    assessed: true,
    guessesLog10: result.guessesLog10,
    warning,
    summary: warning || (result.score < 3
      ? 'The estimator finds this relatively easy to guess. Choose a less predictable password.'
      : weaknesses.length
        ? 'The model estimates higher resistance overall, accounting for the recognized fragments.'
        : 'The model estimates higher resistance to common guessing strategies.'),
    suggestions, weaknesses, composition, provenance,
    checks: [
      { label: 'Detected patterns', passed: !weaknesses.length, detail: weaknesses.join('; ') || 'No recognized patterns in the estimated guessing strategy' },
      { label: 'Analysis method', passed: true, detail: 'Local zxcvbn-ts - common and English dictionaries' },
      { label: 'Generation provenance', passed: false, detail: provenance.summary }
    ]
  };
}

export function assessGeneratedPassword(batch: GeneratedBatch, index = 0): StrengthResult {
  const result = assessPassword(batch.passwords[index] ?? '');
  const generation = generationProvenance(batch, index);
  if (!generation) return result;
  result.provenance = {
    source: 'generated',
    summary: 'Generated here with Web Crypto from the saved configuration.',
    minEntropyBits: generation.minEntropyBits,
    alphabetSize: generation.alphabetSize
  };
  result.checks[2] = { label: 'Generation provenance', passed: true, detail: result.provenance.summary };
  return result;
}
