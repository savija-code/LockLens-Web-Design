# LockLens — Security and Privacy Boundaries

## What currently exists

- `src/core/password.ts` uses Web Crypto `crypto.getRandomValues()` with rejection sampling to avoid modulo bias.
- Enabled categories each contribute a random character; a Fisher–Yates shuffle randomizes category placement.
- Option validation checks length, count and at least one enabled group. Selected pools may be filtered for ambiguous characters.
- Passwords are held in ephemeral JavaScript memory for UI display; not written to localStorage, cookies, IndexedDB or a network endpoint.
- `src/core/strength.ts` uses locally bundled zxcvbn-ts with common/English dictionaries and keyboard graphs for both views. It is an estimate, not a safety guarantee or breach checker.
- Immutable generated batches retain trusted in-runtime provenance and a conservative process probability bound. Entered passwords never inherit this provenance. Length guidance is independent of the estimate; see [analysis methods and limitations](ANALYSIS.md).

## Developer obligations

1. Never use `Math.random()` for generation or log/trace generated secrets.
2. Keep DOM updates with sensitive values via `textContent`, not unsafe dynamic HTML or hidden query parameters.
3. User-selected inputs require bounds validation even if browser controls show limits.
4. Avoid any third-party scripts, analytics, CDNs, fonts or remote API by default.
5. Don't introduce environment secrets into client-side bundles. Public code can always be inspected.
6. Avoid describing passwords as “unbreakable,” “guaranteed safe” or verified unique.
7. Copy uses the system clipboard; clearing clipboard can be unreliable and could overwrite user content, so do not silently clear it.
8. Generated password uniqueness per account is the user's responsibility; avoid auto-storage of secret values.
9. Add a Content Security Policy and review XSS/accessibility risks before public launch; current build is a design foundation, not a security audit.
10. If a future external breach API is considered, it needs an opt-in privacy design and a documented network-data threat model first.

## Security-focused review checklist for Codex

- Verify group coverage and allowable character pool across 1000+ trials.
- Verify randomized order and rejection sampling; be mindful that deterministic repeatable unit tests should mock a crypto provider only in test context.
- Test invalid lengths, non-integer inputs, zero categories, boundary lengths, ambiguous exclusions, all-count options.
- Verify an analyzer input never leaves the current runtime; not recorded in URL, persistent storage or logs.
- Verify generator/analyzer working without server requests once loaded.
- Check all user values are assigned as text, not interpreted as markup.
- Document limitations clearly in README and UI.

## Reference standards to consult during production hardening

NIST SP 800-63B (2025 revision); OWASP Authentication Cheat Sheet; MDN Web Crypto API documentation; web accessibility standards WCAG 2.2. Verify current versions when implementing.
