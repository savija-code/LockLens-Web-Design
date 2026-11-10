import { DEFAULT_OPTIONS, generateBatch, lengthBounds, validateLength, validateOptions, type GeneratedBatch } from '../core/password.js';
import { assessGeneratedPassword, assessPassword } from '../core/strength.js';
import { icon } from './icons.js';
import { bindNavigation } from './navigation.js';
import { lengthGuidance } from '../core/guidance.js';
import { updateComposition } from './composition.js';
import { renderAppShell } from './template.js';

const state = {
  options: { ...DEFAULT_OPTIONS },
  passwords: [] as readonly string[],
  visible: false,
  advancedLength: false,
  generatedBatch: null as GeneratedBatch | null
};
const root = document.getElementById('app');
if (!root) throw new Error('App root is missing.');
const app = root;

let toastTimeout: number | undefined;
function toast(message: string): void {
  const node = document.getElementById('toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => node.classList.remove('show'), 2600);
}

function renderAnalysis(prefix: 'score' | 'analyzer', password: string): void {
  const result = prefix === 'score' && state.generatedBatch
    ? assessGeneratedPassword(state.generatedBatch) : assessPassword(password);
  updateComposition(prefix, result.composition, result.provenance.source === 'generated' ? result.provenance.alphabetSize : undefined);
  const summary = result.warning ? `Warning: ${result.warning}` : result.summary;
  document.getElementById(`${prefix}-summary`)?.classList.toggle('assessment-warning', Boolean(result.warning));
  setText(`${prefix}-weaknesses`, result.assessed ? `Detected patterns: ${result.weaknesses.join('; ') || 'none recognized by this model'}.` : '');
  setText(`${prefix}-provenance`, password ? result.provenance.summary : '');
  if (prefix === 'score') {
    setText('score-advice', result.suggestions.slice(0, 2).join(' '));
    const detail = document.getElementById('score-generation-detail')!;
    const bits = result.provenance.minEntropyBits;
    document.getElementById('score-generation-details')!.hidden = bits === undefined;
    detail.textContent = bits === undefined ? '' : `Generation process bound: at least ${Math.max(0, Math.floor(bits - 1e-10))} bits, assuming independent, uniform Web Crypto draws. Separate from the pattern estimate; no guarantee of safety.`;
  }
  const meter = document.getElementById(`${prefix}-meter`);
  if (meter) {
    meter.setAttribute('aria-valuenow', String(result.score));
    meter.setAttribute('aria-valuetext', password ? result.label : 'No password');
  }
  setText(`${prefix}-length-guidance`, lengthGuidance(password));
  if (prefix === 'analyzer') setText('analyzer-length', String(result.composition.length));
  else setText('stat-length', password ? String(result.composition.length) : '—');
  if (meter) meter.querySelectorAll('span').forEach((segment, index) => {
    segment.className = index < result.score ? `level-${result.score}` : '';
  });
  if (prefix === 'score') {
    setText('score-number', result.assessed ? String(result.score) : '—');
    setText('score-label', password ? result.label : 'Not analyzed');
    setText('score-summary', password ? summary : 'Generate a password to see an instant assessment.');
  } else {
    setText('analyzer-score', result.assessed ? String(result.score) : '—');
    setText('analyzer-label', password ? result.label : 'No password entered');
    setText('analyzer-summary', summary);
    const suggestions = document.getElementById('analyzer-suggestions');
    if (suggestions) suggestions.replaceChildren(...result.suggestions.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
    const checks = document.getElementById('analysis-checks');
    if (checks) checks.replaceChildren(...result.checks.map(check => {
      const row = document.createElement('div');
      row.className = 'analysis-check';
      const indicator = document.createElement('span');
      indicator.className = `check-icon ${check.passed ? 'good' : ''}`;
      indicator.innerHTML = icon(check.passed ? 'check' : 'info', 15);
      const content = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = check.label;
      const detail = document.createElement('small');
      detail.textContent = check.detail;
      content.append(title, detail);
      row.append(indicator, content);
      return row;
    }));
  }
}

function setText(id: string, value: string): void {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function formatPassword(password: string): string {
  return state.visible ? password : '•'.repeat(password.length);
}

function updatePasswordView(): void {
  const password = state.passwords[0] || '';
  setText('password-display', password ? formatPassword(password) : 'Generate to begin');
  setText('password-meta', password ? `${password.length} characters · generated locally` : 'Configure and generate a password');
  const showIcon = document.getElementById('reveal-btn');
  if (showIcon) {
    showIcon.innerHTML = icon(state.visible ? 'eyeoff' : 'eye', 18);
    showIcon.setAttribute('aria-label', state.visible ? 'Hide password' : 'Show password');
  }
  renderAnalysis('score', password);
  const batchPanel = document.getElementById('batch-panel');
  const batchResults = document.getElementById('batch-results');
  if (batchPanel && batchResults) {
    batchPanel.hidden = state.passwords.length <= 1;
    batchResults.replaceChildren();
    state.passwords.slice(1).forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'batch-item';
      const label = document.createElement('span');
      label.className = 'batch-index';
      label.textContent = String(index + 2).padStart(2, '0');
      const value = document.createElement('code');
      value.textContent = state.visible ? item : '•'.repeat(item.length);
      const button = document.createElement('button');
      button.className = 'icon-button';
      button.setAttribute('aria-label', `Copy password ${index + 2}`);
      button.innerHTML = icon('copy', 16);
      button.addEventListener('click', () => void copyPassword(item));
      row.append(label, value, button);
      batchResults.append(row);
    });
  }
}

async function copyPassword(password: string): Promise<void> {
  if (!password) return toast('Generate a password first.');
  try {
    await navigator.clipboard.writeText(password);
    toast('Password copied. Clipboard may retain it after you leave.');
  } catch {
    toast('Copy failed. Use a secure local browser context.');
  }
}

function generate(notify = true): void {
  const error = validateLength(Number((document.getElementById('length-number') as HTMLInputElement).value), state.advancedLength) ?? validateOptions(state.options);
  setText('generator-error', error ?? '');
  if (error) return;
  try {
    const batch = generateBatch(state.options);
    state.passwords = batch.passwords;
    state.generatedBatch = batch;
    state.visible = false;
    updatePasswordView();
    if (notify) toast(`${state.passwords.length} password${state.passwords.length === 1 ? '' : 's'} generated locally.`);
  } catch {
    setText('generator-error', 'Secure generation is unavailable in this browser context.');
  }
}

function updateLength(value: number): void {
  const error = validateLength(value, state.advancedLength);
  document.getElementById('length-number')?.setAttribute('aria-invalid', String(Boolean(error)));
  setText('generator-error', error ?? '');
  if (error) return;
  state.options.length = value;
  (document.getElementById('length-slider') as HTMLInputElement).value = String(state.options.length);
  (document.getElementById('length-number') as HTMLInputElement).value = String(state.options.length);
  setText('generator-error', validateOptions(state.options) ?? '');
}

function changeView(view: string): void {
  if (view !== 'generator' && view !== 'analyzer') return;
  document.getElementById('generator-view')!.hidden = view !== 'generator';
  document.getElementById('analyzer-view')!.hidden = view !== 'analyzer';
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    if (button.getAttribute('role') === 'tab') {
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    } else if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  setText('breadcrumb-title', view === 'generator' ? 'Password generator' : 'Strength analyzer');
  setText('page-title', view === 'generator' ? 'Create a stronger password.' : 'Understand password strength.');
  setText('page-subtitle', view === 'generator' ? 'A simple, private way to generate secure credentials — right in your browser.' : 'See useful feedback and improve your password habits — all on your device.');
}

function bindControls(): void {
  bindNavigation(changeView);
  document.getElementById('advanced-length')?.addEventListener('change', event => {
    state.advancedLength = (event.target as HTMLInputElement).checked;
    const { min, max } = lengthBounds(state.advancedLength);
    for (const id of ['length-number', 'length-slider']) {
      const input = document.getElementById(id) as HTMLInputElement;
      input.min = String(min);
      input.max = String(max);
    }
    setText('slider-min', `${min} CHARACTERS`);
    setText('slider-max', `${max} CHARACTERS`);
    updateLength(Math.max(min, Math.min(max, state.options.length)));
  });
  (document.getElementById('length-slider') as HTMLInputElement).addEventListener('input', event => updateLength(Number((event.target as HTMLInputElement).value)));
  (document.getElementById('length-number') as HTMLInputElement).addEventListener('change', event => updateLength(Number((event.target as HTMLInputElement).value)));
  document.getElementById('length-minus')?.addEventListener('click', () => updateLength(Math.max(lengthBounds(state.advancedLength).min, state.options.length - 1)));
  document.getElementById('length-plus')?.addEventListener('click', () => updateLength(Math.min(lengthBounds(state.advancedLength).max, state.options.length + 1)));
  (['upper', 'lower', 'numbers', 'symbols'] as const).forEach(key => {
    document.getElementById(key)?.addEventListener('change', event => {
      state.options[key] = (event.target as HTMLInputElement).checked;
      setText('generator-error', validateOptions(state.options) ?? '');
    });
  });
  document.getElementById('ambiguous')?.addEventListener('change', event => state.options.excludeAmbiguous = (event.target as HTMLInputElement).checked);
  document.getElementById('count-select')?.addEventListener('change', event => state.options.count = Number((event.target as HTMLSelectElement).value));
  document.getElementById('generate-btn')?.addEventListener('click', () => generate());
  document.getElementById('regenerate-btn')?.addEventListener('click', () => generate());
  document.getElementById('copy-btn')?.addEventListener('click', () => void copyPassword(state.passwords[0] || ''));
  document.getElementById('clear-batch')?.addEventListener('click', () => {state.passwords = state.passwords.slice(0, 1); updatePasswordView();});
  document.getElementById('reveal-btn')?.addEventListener('click', () => {state.visible = !state.visible; updatePasswordView();});
  document.getElementById('analyzer-input')?.addEventListener('input', event => renderAnalysis('analyzer', (event.target as HTMLInputElement).value));
  document.getElementById('analyzer-reveal')?.addEventListener('click', () => {
    const input = document.getElementById('analyzer-input') as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
    const button = document.getElementById('analyzer-reveal')!;
    button.innerHTML = icon(input.type === 'password' ? 'eye' : 'eyeoff', 18);
    button.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
  });
}

export function mountApp(): void {
  app.innerHTML = renderAppShell();
  bindControls();
  changeView('generator');
  renderAnalysis('analyzer', '');
  updatePasswordView();
  generate(false);
}
