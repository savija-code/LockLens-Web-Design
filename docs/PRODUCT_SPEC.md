# LockLens — Product Specification

## Product vision

A lightweight, private password-security workspace with a compact dark interface. The product focuses on generating unique credentials and explaining local strength estimates without accounts or remote password processing.

## Target users

People who want to create a unique password quickly, choose their own character constraints, or learn how password strength is assessed. Do not assume users understand cryptography.

## Release 0.1 — included

- Single responsive website with persistent left sidebar on desktop and a mobile menu.
- Generator and analyzer as separate tool views, with an integrated educational information area.
- Password length default 20, normal 8–40 and Advanced Length 41–64 with synchronized range/number/stepper controls.
- Four independent checkbox groups: A–Z, a–z, digits, and a curated symbol set.
- Optional removal of ambiguous characters; never generate from an empty pool.
- Generate batches of 1, 5 or 10 passwords. These are independent random attempts; duplicate outputs are possible.
- Copy, reveal/hide, regeneration; concise errors and toast feedback.
- Local zxcvbn-ts guess-resistance estimates with detected patterns and practical feedback. Independent length guidance and trusted generator provenance are explained in `docs/ANALYSIS.md`; no safety guarantees.
- Explain that 4/4 is the highest estimator band and equal scores can cover different guess resistance. Prioritize estimator warnings, including common-password variants and predictable patterns, without changing their scores.
- Compact character composition in both views: actual code-point length, categories present and category indicators derived from the password itself. Generator pool size is shown only for trusted LockLens batches using their saved configuration. Composition never changes the guess-resistance score.
- Oversized analyzer inputs are explicitly unassessed, with their actual length shown; never silently truncate a pasted password and score only its prefix.
- Responsive desktop, tablet and mobile UI without any external resources.

## Release 0.2 — proposed, NOT yet implemented

- Broader localization, estimator validation and compatibility testing beyond the locally bundled common/English estimator introduced in Phase 02.1.
- Broader feedback localization and accessibility validation.
- Expand the current core and Chromium regression suite with wider browser compatibility validation and an independent accessibility audit.
- More deliberate clipboard UX and optional time-limited clear only if feasible and transparent.
- GitHub Pages CI deployment and structured release notes.

## Out of scope

- Password cracking, guessing logins, device unlocking, scraping, breach searches in v0.1.
- Authenticated user accounts, database, cloud processing, password vault, server-side API.
- Native apps, EXE, mobile APK, offline voice packs, audio assistant, PWA/service workers until requested.
- AI models, analytics or background tasks.

## Key flows

1. Visit site: generator loads with a secure 20-character example generated live in the current browser.
2. Configure length, character groups and count; generate on demand.
3. Reveal or copy a result; password remains in memory only.
4. Switch to Analyzer and enter a **test** password to view local guidance.
5. Read security tips and privacy disclosures.

## Success criteria

- Generating 1000 passwords never produces length outside selected bounds or characters outside the selected pool.
- Every enabled character group appears in each generated password.
- No `Math.random()` in password generation; use unbiased cryptographic randomness.
- Invalid zero-category selection blocks generation with readable feedback.
- No network request when generating or analyzing; no persistence of secrets.
- Layout works on 320, 390, 768, 1024, 1440 pixel widths.
- Keyboard navigation, visible focus and readable compact type are maintained.

## Future decision log

Architecture chosen intentionally: TypeScript modules + direct DOM + custom CSS; no React, Python or backend needed for this scope. Revisit only if genuine functional complexity justifies it.
