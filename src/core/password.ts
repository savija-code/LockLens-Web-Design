export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  count: number;
};

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 20,
  upper: true,
  lower: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
  count: 1
};

const CHARACTER_SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?'
} as const;
const AMBIGUOUS_CHARACTERS = new Set('O0oIl1|');
type CharacterGroup = keyof typeof CHARACTER_SETS;

export type GeneratedBatch = Readonly<{
  passwords: readonly string[];
  options: Readonly<PasswordOptions>;
}>;

const generatedBatches = new WeakSet<GeneratedBatch>();

function selectedGroups(options: PasswordOptions): string[] {
  return (Object.keys(CHARACTER_SETS) as CharacterGroup[])
    .filter(group => options[group])
    .map(group => [...CHARACTER_SETS[group]]
      .filter(character => !options.excludeAmbiguous || !AMBIGUOUS_CHARACTERS.has(character)).join(''));
}

export function lengthBounds(advanced: boolean): { min: number; max: number } {
  return advanced ? { min: 41, max: 64 } : { min: 8, max: 40 };
}

export function validateLength(value: number, advanced: boolean): string | null {
  const { min, max } = lengthBounds(advanced);
  return Number.isInteger(value) && value >= min && value <= max
    ? null : `Choose a whole-number length between ${min} and ${max}.`;
}

function randomIndex(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > 0x100000000) {
    throw new RangeError('Invalid random range.');
  }
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % maxExclusive;
}

function pick(characters: string): string {
  return characters[randomIndex(characters.length)];
}

export function validateOptions(options: PasswordOptions): string | null {
  if (!options || typeof options !== 'object') return 'Choose a valid password configuration.';
  if (['upper', 'lower', 'numbers', 'symbols', 'excludeAmbiguous'].some(key => typeof options[key as keyof PasswordOptions] !== 'boolean')) {
    return 'Character options must be enabled or disabled.';
  }
  if (!Number.isInteger(options.length) || options.length < 8 || options.length > 64) {
    return 'Choose a length between 8 and 64 characters.';
  }
  if (![1, 5, 10].includes(options.count)) {
    return 'Choose 1, 5 or 10 passwords.';
  }
  const selected = (Object.keys(CHARACTER_SETS) as CharacterGroup[]).filter(group => options[group]);
  if (!selected.length) return 'Select at least one character type.';
  if (selected.length > options.length) return 'Length must allow every selected character type.';
  return null;
}

export function generatePasswords(options: PasswordOptions): string[] {
  const error = validateOptions(options);
  if (error) throw new Error(error);
  if (!globalThis.crypto?.getRandomValues) throw new Error('Secure randomness is unavailable.');

  const groups = selectedGroups(options);
  const pool = groups.join('');
  if (!pool.length || groups.some(group => !group.length)) throw new Error('No available characters.');

  return Array.from({ length: options.count }, () => {
    // Guarantee each enabled group is represented before the unbiased shuffle.
    const result = groups.map(pick);
    while (result.length < options.length) result.push(pick(pool));
    for (let i = result.length - 1; i > 0; i--) {
      const j = randomIndex(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result.join('');
  });
}

export function generateBatch(options: PasswordOptions): GeneratedBatch {
  const snapshot = Object.freeze({ ...options });
  const batch = Object.freeze({ passwords: Object.freeze(generatePasswords(snapshot)), options: snapshot });
  generatedBatches.add(batch);
  return batch;
}

export function generationProvenance(batch: GeneratedBatch, index = 0): {
  alphabetSize: number; categoryCount: number; minEntropyBits: number;
} | null {
  if (!generatedBatches.has(batch) || !Number.isInteger(index) || index < 0 || index >= batch.passwords.length) return null;
  const groups = selectedGroups(batch.options);
  const sizes = groups.map(group => group.length);
  const alphabetSize = sizes.reduce((total, size) => total + size, 0);
  const length = batch.options.length;
  const categoryCount = sizes.length;
  const q = Math.floor(length / categoryCount);
  const r = length % categoryCount;
  // The forced category picks make outputs non-uniform. See docs/ANALYSIS.md for P(w).
  const logDenominator = sizes.reduce((total, size, i) => total + Math.log2(size) + Math.log2(length - i), 0)
    + (length - categoryCount) * Math.log2(alphabetSize);
  const logMaxCountProduct = (categoryCount - r) * Math.log2(q) + r * Math.log2(q + 1);
  return { alphabetSize, categoryCount, minEntropyBits: logDenominator - logMaxCountProduct };
}

export function activeAlphabetSize(options: PasswordOptions): number {
  return selectedGroups(options).reduce((size, group) => size + group.length, 0);
}
