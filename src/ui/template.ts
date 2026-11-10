import { icon } from './icons.js';
import { compositionSection } from './composition.js';
import { MAX_ANALYSIS_LENGTH } from '../core/strength.js';

function checkbox(id: string, title: string, sub: string, checked: boolean): string {
  return (
    `<label class="option-tile" for="${id}">` +
      `<span class="option-check">` +
        `<input type="checkbox" id="${id}" ${checked ? 'checked' : ''} />` +
        `<span class="check-box">${icon('check', 12)}</span>` +
      `</span>` +
      `<span class="option-copy">` +
        `<strong>${title}</strong>` +
        `<small>${sub}</small>` +
      `</span>` +
    `</label>`
  );
}

export function renderAppShell(): string {
  const estimateNote = '4/4 is the highest estimator band; equal scores can differ in resistance. Local zxcvbn-ts estimate. No breach check or safety guarantee.';
  return (
    `\n    <div class="app-shell">` +
      `\n      <aside class="sidebar" id="sidebar">` +
        `\n        <div class="brand">` +
          `<span class="brand-mark">${icon('shield', 21)}</span>` +
          `<div>` +
            `<strong>` +
              `locklens` +
              `<span class="brand-period">.</span>` +
            `</strong>` +
            `<small>SECURITY WORKSPACE</small>` +
          `</div>` +
        `</div>` +
        `\n        <div class="sidebar-section-title">WORKSPACE</div>` +
        `\n        <nav class="sidebar-nav" aria-label="Main navigation">` +
          `\n          <button class="side-link active" data-view="generator" aria-label="Password generator">` +
            `${icon('key', 17)}` +
            `<span>Password generator</span>` +
            `<span class="side-indicator"></span>` +
          `</button>` +
          `\n          <button class="side-link" data-view="analyzer" aria-label="Strength analyzer">` +
            `${icon('activity', 17)}` +
            `<span>Strength analyzer</span>` +
          `</button>` +
        `\n        </nav>` +
        `\n        <div class="sidebar-section-title section-title-two">RESOURCES</div>` +
        `\n        <nav class="sidebar-nav" aria-label="Resources">` +
          `\n          <a class="side-link" href="#security-notes" aria-label="Security notes">` +
            `${icon('book', 17)}` +
            `<span>Security notes</span>` +
          `</a>` +
          `\n          <a class="side-link" href="#privacy" aria-label="Privacy policy">` +
            `${icon('lock', 17)}` +
            `<span>Privacy approach</span>` +
          `</a>` +
        `\n        </nav>` +
        `\n        <div class="sidebar-bottom">` +
          `\n          <div class="sidebar-status">` +
            `<span class="status-dot"></span>` +
            `<div>` +
              `<strong>Local processing</strong>` +
              `<small>No account. No password storage.</small>` +
            `</div>` +
          `</div>` +
          `\n          <div class="sidebar-footer">` +
            `LOCKLENS / PREVIEW 0.1 ` +
            `<span>© 2026</span>` +
          `</div>` +
        `\n        </div>` +
      `\n      </aside>` +
      `\n      <button id="navigation-backdrop" class="navigation-backdrop" aria-label="Close navigation" tabindex="-1" hidden></button>` +
      `\n      <div class="main-column">` +
        `\n        <header class="topbar">` +
          `\n          <div class="topbar-left">` +
            `<button class="icon-button mobile-menu" id="menu-toggle" aria-label="Toggle navigation" aria-controls="sidebar" aria-expanded="false">${icon('menu', 19)}</button>` +
            `<div class="breadcrumb">` +
              `Workspace ` +
              `<span>/</span>` +
              ` <strong id="breadcrumb-title">Password generator</strong>` +
            `</div>` +
          `</div>` +
          `\n          <div class="topbar-right">` +
            `<span class="privacy-tag">${icon('lock', 13)} PRIVATE BY DESIGN</span>` +
            `<span class="topbar-divider"></span>` +
            `<span class="avatar" aria-label="LockLens workspace">L</span>` +
          `</div>` +
        `\n        </header>` +
        `\n        <main class="page-content" id="main-content">` +
          `\n          <div class="page-heading">` +
            `<div>` +
              `<div class="eyebrow">` +
                `<span class="eyebrow-dot"></span>` +
                ` SECURITY TOOLKIT ` +
                `<span class="eyebrow-line"></span>` +
                ` 01 / 02` +
              `</div>` +
              `<h1 id="page-title">` +
                `Create a stronger password` +
                `<span class="heading-accent">.</span>` +
              `</h1>` +
              `<p id="page-subtitle">A simple, private way to generate secure credentials — right in your browser.</p>` +
            `</div>` +
            `<div class="heading-corner">` +
              `<span>YOUR WORKSPACE</span>` +
              `<strong>` +
                `01` +
                `<span>/</span>` +
                `02` +
              `</strong>` +
            `</div>` +
          `</div>` +
          `\n          <div class="workspace-tabs" role="tablist" aria-label="Security tools">` +
            `<button class="tab active" data-view="generator" id="generator-tab" role="tab" aria-controls="generator-view" aria-selected="true" tabindex="0">${icon('key', 16)} Generator</button>` +
            `<button class="tab" data-view="analyzer" id="analyzer-tab" role="tab" aria-controls="analyzer-view" aria-selected="false" tabindex="-1">${icon('activity', 16)} Analyzer</button>` +
          `</div>` +
          `\n          <section class="workspace-view" id="generator-view" role="tabpanel" aria-labelledby="generator-tab" tabindex="0">` +
            `\n            <div class="workspace-grid">` +
              `\n              <div class="primary-stack">` +
                `\n                <section class="panel generator-panel" aria-labelledby="generator-title">` +
                  `\n                  <div class="panel-header">` +
                    `<div>` +
                      `<span class="section-kicker">01 — GENERATOR</span>` +
                      `<h2 id="generator-title">Your new password</h2>` +
                      `<p>Built with cryptographically secure randomness.</p>` +
                    `</div>` +
                    `<span class="panel-symbol">${icon('spark', 21)}</span>` +
                  `</div>` +
                  `\n                  <div class="password-output">` +
                    `<div class="output-top">` +
                      `<span class="mini-label">GENERATED PASSWORD</span>` +
                      `<span class="output-status">` +
                        `<i></i>` +
                        ` READY` +
                      `</span>` +
                    `</div>` +
                    `<div class="password-row">` +
                      `<output id="password-display" class="password-value" aria-live="polite">Generate to begin</output>` +
                      `<button class="icon-button" id="reveal-btn" aria-label="Show password" title="Show or hide password">${icon('eye', 18)}</button>` +
                    `</div>` +
                    `<div class="output-bottom">` +
                      `<span id="password-meta">Configure and generate a password</span>` +
                      `<div class="output-actions">` +
                        `<button class="small-action" id="copy-btn" title="Copy password">${icon('copy', 15)} Copy</button>` +
                        `<button class="small-action" id="regenerate-btn" title="Generate again">${icon('rotate', 15)} Refresh</button>` +
                      `</div>` +
                    `</div>` +
                  `</div>` +
                  `\n                  <div class="generator-divider"></div>` +
                  `\n                  <div class="field-heading">` +
                    `<div>` +
                      `<h3>Password length</h3>` +
                      `<span>Choose how many characters you need</span>` +
                    `</div>` +
                    `<div class="length-control">` +
                      `<button id="length-minus" aria-label="Decrease length">−</button>` +
                      `<input id="length-number" aria-describedby="generator-error" type="number" min="8" max="40" value="20" aria-label="Password length"/>` +
                      `<button id="length-plus" aria-label="Increase length">+</button>` +
                    `</div>` +
                  `</div>` +
                  `\n                  <input id="length-slider" class="length-slider" type="range" min="8" max="40" value="20" aria-label="Password length"/>` +
                  `<div class="slider-ends">` +
                    `<span id="slider-min">8 CHARACTERS</span>` +
                    `<span id="slider-max">40 CHARACTERS</span>` +
                  `</div>` +
                  `\n                  <label class="advanced-length">` +
                    `<input id="advanced-length" type="checkbox"/>` +
                    ` Advanced Length ` +
                    `<span>41–64 characters</span>` +
                  `</label>` +
                  `\n                  <div class="field-heading character-heading">` +
                    `<div>` +
                      `<h3>Character types</h3>` +
                      `<span>Select what your password can include</span>` +
                    `</div>` +
                    `<span class="field-hint">CUSTOMIZABLE</span>` +
                  `</div>` +
                  `\n                  <div class="option-grid">\n                    ${checkbox('upper', 'Uppercase', 'A B C ... Z', true)}\n                    ${checkbox('lower', 'Lowercase', 'a b c ... z', true)}\n                    ${checkbox('numbers', 'Numbers', '0 1 2 ... 9', true)}\n                    ${checkbox('symbols', 'Symbols', '! @ # $ % &', true)}\n                  </div>` +
                  `\n                  <div class="advanced-row">` +
                    `<label class="advanced-label">` +
                      `<input type="checkbox" id="ambiguous"/>` +
                      `<span class="small-check"></span>` +
                      `<span>` +
                        `Exclude similar-looking characters ` +
                        `<small>O, 0, I, l, 1</small>` +
                      `</span>` +
                    `</label>` +
                    `<span class="info-icon" title="Makes passwords easier to read, but reduces the number of available characters">${icon('info', 16)}</span>` +
                  `</div>` +
                  `\n                  <div class="generator-actions">` +
                    `<div class="batch-group">` +
                      `<label for="count-select">GENERATE</label>` +
                      `<select id="count-select" aria-label="Number of passwords">` +
                        `<option value="1">1 password</option>` +
                        `<option value="5">5 passwords</option>` +
                        `<option value="10">10 passwords</option>` +
                      `</select>` +
                    `</div>` +
                    `<button id="generate-btn" class="btn-primary">` +
                      `${icon('spark', 17)} Generate password ` +
                      `<span>${icon('arrow', 17)}</span>` +
                    `</button>` +
                  `</div>` +
                  `\n                  <p id="generator-error" class="field-error" role="alert"></p>` +
                `\n                </section>` +
                `\n                <section class="panel batch-panel" id="batch-panel" hidden>` +
                  `<div class="panel-header compact">` +
                    `<div>` +
                      `<span class="section-kicker">GENERATED SET</span>` +
                      `<h2>Additional passwords</h2>` +
                    `</div>` +
                    `<button class="text-button" id="clear-batch">Clear list</button>` +
                  `</div>` +
                  `<div id="batch-results" class="batch-list"></div>` +
                `</section>` +
              `\n              </div>` +
              `\n              <div class="secondary-stack">` +
                `\n                <section class="panel overview-panel" aria-labelledby="resistance-title">` +
                  `<div class="panel-header compact">` +
                    `<div>` +
                      `<span class="section-kicker">SECURITY OVERVIEW</span>` +
                      `<h2 id="resistance-title">Estimated Guess Resistance</h2>` +
                    `</div>` +
                    `${icon('activity', 19)}` +
                  `</div>` +
                  `<div class="resistance-heading">` +
                    `<strong id="score-label">Not analyzed</strong>` +
                    `<span id="score-number">—</span>` +
                    `<small>/ 4</small>` +
                  `</div>` +
                  `<div class="meter" id="score-meter" role="meter" aria-describedby="score-estimator-note" aria-label="Estimated guess resistance" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0">` +
                    `<span></span>` +
                    `<span></span>` +
                    `<span></span>` +
                    `<span></span>` +
                  `</div>` +
                  `<p class="resistance-summary" id="score-summary">Generate a password to see an estimate.</p>` +
                  `<p id="score-weaknesses" class="assessment-weaknesses"></p>` +
                  `<p id="score-advice" class="assessment-advice"></p>` +
                  `${compositionSection('score')}` +
                  `<div class="generation-provenance">` +
                    `<p id="score-provenance"></p>` +
                    `<details id="score-generation-details" hidden>` +
                      `<summary>Generation details</summary>` +
                      `<p id="score-generation-detail" class="panel-note"></p>` +
                    `</details>` +
                  `</div>` +
                  `<div class="panel-note" id="score-estimator-note">${icon('info', 15)} ${estimateNote}</div>` +
                `</section>` +
                `\n                <section class="panel length-panel" aria-labelledby="length-title">` +
                  `<span class="section-kicker">LENGTH &amp; GUIDANCE</span>` +
                  `<h2 id="length-title">Password Length &amp; Guidance</h2>` +
                  `<p class="length-count">` +
                    `<strong id="stat-length">—</strong>` +
                    ` characters` +
                  `</p>` +
                  `<p id="score-length-guidance" class="length-guidance">Generate a password to see length guidance.</p>` +
                `</section>` +
                `\n                <section class="insight-card">` +
                  `<div class="insight-decoration">${icon('shield', 86)}</div>` +
                  `<span class="insight-eyebrow">LOCKLENS INSIGHT</span>` +
                  `<div class="insight-icon">${icon('shield', 20)}</div>` +
                  `<h3>Privacy isn’t an extra feature.</h3>` +
                  `<p>Generation and analysis happen on your device. Your passwords are not sent to our server or stored in a database.</p>` +
                  `<a href="#privacy" class="insight-link">How we protect your privacy ${icon('arrow', 15)}</a>` +
                `</section>` +
                `\n                <section class="panel tip-panel">` +
                  `<div class="tip-icon">${icon('info', 17)}</div>` +
                  `<div>` +
                    `<h3>Make it unique.</h3>` +
                    `<p>Use a different password for every account, and turn on multi-factor authentication whenever available.</p>` +
                  `</div>` +
                `</section>` +
              `\n              </div>` +
            `\n            </div>` +
          `\n          </section>` +
          `\n          <section class="workspace-view" id="analyzer-view" role="tabpanel" aria-labelledby="analyzer-tab" tabindex="0" hidden>` +
            `\n            <div class="workspace-grid">` +
              `\n              <div class="primary-stack">` +
                `<section class="panel analyzer-panel">` +
                  `<div class="panel-header">` +
                    `<div>` +
                      `<span class="section-kicker">02 — ANALYZER</span>` +
                      `<h2>Check password strength</h2>` +
                      `<p>Local feedback without uploading your input.</p>` +
                    `</div>` +
                    `<span class="panel-symbol">${icon('activity', 21)}</span>` +
                  `</div>` +
                  `<label class="analyzer-input-label" for="analyzer-input">PASSWORD TO ANALYZE</label>` +
                  `<div class="analyzer-input-wrap">` +
                    `<input id="analyzer-input" type="password" aria-describedby="analyzer-limit" placeholder="Type a test password here" spellcheck="false" autocapitalize="off" autocomplete="off"/>` +
                    `<button class="icon-button" id="analyzer-reveal" title="Show or hide input" aria-label="Show password">${icon('eye', 18)}</button>` +
                  `</div>` +
                  `<p id="analyzer-limit" class="panel-note">Analysis limit: ${MAX_ANALYSIS_LENGTH} characters (some emoji count twice). Longer inputs are not scored.</p>` +
                  `<div class="analyzer-warning">${icon('lock', 15)} For added caution, use sample passwords here rather than active account passwords.</div>` +
                  `<div class="analyzer-result">` +
                    `<span class="sr-only">Estimated Guess Resistance</span>` +
                    `<div>` +
                      `<span class="mini-label">ESTIMATED GUESS RESISTANCE</span>` +
                      `<h3 id="analyzer-label">No password entered</h3>` +
                      `<p id="analyzer-summary">Start typing to see what makes a password stronger.</p>` +
                    `</div>` +
                    `<div class="inline-score">` +
                      `<strong id="analyzer-score">—</strong>` +
                      `<span>/ 4</span>` +
                    `</div>` +
                  `</div>` +
                  `<div class="meter analyzer-meter" id="analyzer-meter" role="meter" aria-describedby="analyzer-estimator-note" aria-label="Estimated guess resistance" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0">` +
                    `<span></span>` +
                    `<span></span>` +
                    `<span></span>` +
                    `<span></span>` +
                  `</div>` +
                  `<p id="analyzer-weaknesses" class="assessment-weaknesses"></p>` +
                  `<p class="panel-note" id="analyzer-estimator-note">${estimateNote}</p>` +
                  `${compositionSection('analyzer')}` +
                  `<div class="analyzer-length">` +
                    `<h3>Password Length &amp; Guidance</h3>` +
                    `<p>` +
                      `<strong id="analyzer-length">0</strong>` +
                      ` characters` +
                    `</p>` +
                    `<p id="analyzer-length-guidance" class="length-guidance"></p>` +
                  `</div>` +
                  `<p id="analyzer-provenance" class="generation-provenance"></p>` +
                  `<h3 class="recommendation-title">Suggestions</h3>` +
                  `<ul class="recommendations" id="analyzer-suggestions">` +
                    `<li>Try a long, unique password or generated passphrase.</li>` +
                  `</ul>` +
                `</section>` +
              `</div>` +
              `\n              <div class="secondary-stack">` +
                `<section class="panel checklist-panel">` +
                  `<div class="panel-header compact">` +
                    `<div>` +
                      `<span class="section-kicker">PASSWORD HEALTH</span>` +
                      `<h2>Security checks</h2>` +
                    `</div>` +
                    `${icon('shield', 19)}` +
                  `</div>` +
                  `<div id="analysis-checks" class="analysis-checks"></div>` +
                `</section>` +
                `<section class="insight-card insight-blue">` +
                  `<div class="insight-decoration">${icon('activity', 86)}</div>` +
                  `<span class="insight-eyebrow">GOOD TO KNOW</span>` +
                  `<div class="insight-icon">${icon('lock', 20)}</div>` +
                  `<h3>Longer beats complicated.</h3>` +
                  `<p>Length and unpredictability matter more than forcing a short password to contain every symbol.</p>` +
                  `<a href="#security-notes" class="insight-link">See security notes ${icon('arrow', 15)}</a>` +
                `</section>` +
              `</div>` +
            `\n            </div>` +
          `\n          </section>` +
          `\n          <section class="lower-content" id="security-notes" tabindex="-1">` +
            `<div class="lower-heading">` +
              `<div>` +
                `<span class="section-kicker">KNOW THE BASICS</span>` +
                `<h2>Security essentials</h2>` +
              `</div>` +
              `<span>Practical guidance, not scare tactics</span>` +
            `</div>` +
            `<div class="education-grid">` +
              `<article class="education-card">` +
                `<span class="education-number">01 / LENGTH</span>` +
                `<div class="education-icon">${icon('key', 20)}</div>` +
                `<h3>More characters, less guessing.</h3>` +
                `<p>For manually created passwords, favor length and uniqueness. Random generators help you avoid familiar patterns.</p>` +
              `</article>` +
              `<article class="education-card">` +
                `<span class="education-number">02 / UNIQUENESS</span>` +
                `<div class="education-icon">${icon('link', 20)}</div>` +
                `<h3>Don’t reuse passwords.</h3>` +
                `<p>A password leaked on one service should never unlock another. Use a trusted password manager to store unique logins.</p>` +
              `</article>` +
              `<article class="education-card">` +
                `<span class="education-number">03 / LAYERS</span>` +
                `<div class="education-icon">${icon('shield', 20)}</div>` +
                `<h3>Add an extra layer.</h3>` +
                `<p>Multi-factor authentication and passkeys help protect your accounts even if a password is exposed.</p>` +
              `</article>` +
            `</div>` +
          `</section>` +
          `\n          <section id="privacy" class="privacy-disclosure" tabindex="-1" aria-labelledby="privacy-title">` +
            `<h2 id="privacy-title">Privacy policy</h2>` +
            `<p>Generation and analysis run in this browser. Passwords stay in page memory; this app does not log them, save them to browser storage, or send them to a server. Copying places a password on your system clipboard, where it may remain after you leave.</p>` +
            `<p>Loading this site requests its HTML, scripts (including the estimator and dictionaries), styles and icon from the host. The host may record ordinary access logs such as IP addresses. Generating or analyzing makes no additional requests. There are no analytics, trackers, remote fonts, or external password checks.</p>` +
          `</section>` +
          `\n          <footer class="page-footer">` +
            `<div>` +
              `<strong>` +
                `locklens` +
                `<span class="brand-period">.</span>` +
              `</strong>` +
              `<span>Made for stronger habits, with privacy in mind.</span>` +
            `</div>` +
            `<div class="footer-credit">` +
              `<a href="#privacy">Privacy policy</a>` +
              `<span>Designed &amp; Developed by Savija Rumeth</span>` +
            `</div>` +
          `</footer>` +
        `\n        </main>` +
      `\n      </div>` +
    `\n    </div>` +
    `\n    <div id="toast" class="toast" role="status" aria-live="polite"></div>\n  `
  );
}

