import type { CharacterComposition } from '../core/composition.js';

type CompositionView = 'score' | 'analyzer';
const categories = [
  ['upper', 'Uppercase'], ['lower', 'Lowercase'],
  ['numbers', 'Numbers'], ['symbols', 'Symbols / other']
] as const;

export function compositionSection(prefix: CompositionView): string {
  const categoryCountId = prefix === 'score' ? 'stat-categories' : 'analyzer-categories';
  return `<section class="composition" aria-labelledby="${prefix}-composition-title">
    <h3 id="${prefix}-composition-title">Character composition</h3>
    <dl class="composition-stats">
      <div><dt>Actual length</dt><dd><strong id="${prefix}-composition-length">0</strong> <span>characters</span></dd></div>
      <div><dt>Categories present</dt><dd><strong id="${categoryCountId}">0</strong></dd></div>
    </dl>
    <ul class="composition-indicators" aria-label="Character categories">
      ${categories.map(([key, label]) => `<li class="composition-category" id="${prefix}-composition-${key}" data-present="false"${key === 'symbols' ? ' title="Includes punctuation, spaces, emoji and characters without upper/lower case"' : ''}><span class="composition-mark" id="${prefix}-${key}-mark" aria-hidden="true">—</span><span>${label}</span><span class="sr-only" id="${prefix}-${key}-presence">: absent</span></li>`).join('')}
    </ul>
    ${prefix === 'score' ? '<p class="composition-pool" id="score-composition-pool" hidden>Saved generator pool: <strong id="stat-alphabet">—</strong> possible characters.</p>' : ''}
    <p class="composition-note">Diversity describes the text, not its strength. Length and unpredictability matter.</p>
  </section>`;
}

export function updateComposition(prefix: CompositionView, composition: CharacterComposition, alphabetSize?: number): void {
  document.getElementById(`${prefix}-composition-length`)!.textContent = String(composition.length);
  document.getElementById(prefix === 'score' ? 'stat-categories' : 'analyzer-categories')!.textContent = String(composition.categoryCount);
  for (const [key] of categories) {
    const count = composition.counts[key];
    document.getElementById(`${prefix}-composition-${key}`)!.dataset.present = String(count > 0);
    document.getElementById(`${prefix}-${key}-mark`)!.textContent = count ? '✓' : '—';
    document.getElementById(`${prefix}-${key}-presence`)!.textContent = count ? `: present, ${count} character${count === 1 ? '' : 's'}` : ': absent';
  }
  if (prefix === 'score') {
    document.getElementById('score-composition-pool')!.hidden = alphabetSize === undefined;
    document.getElementById('stat-alphabet')!.textContent = alphabetSize === undefined ? '—' : String(alphabetSize);
  }
}
