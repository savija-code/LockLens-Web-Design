export type CharacterComposition = {
  length: number;
  categoryCount: number;
  counts: { upper: number; lower: number; numbers: number; symbols: number };
};


export function analyzeComposition(value: string): CharacterComposition {
  const counts = { upper: 0, lower: 0, numbers: 0, symbols: 0 };
  let length = 0;
  for (const character of value) {
    length++;
    if (/[\p{Lu}\p{Lt}]/u.test(character)) counts.upper++;
    else if (/\p{Ll}/u.test(character)) counts.lower++;
    else if (/\p{N}/u.test(character)) counts.numbers++;

    else counts.symbols++;
  }
  return { length, categoryCount: Object.values(counts).filter(count => count > 0).length, counts };
}
