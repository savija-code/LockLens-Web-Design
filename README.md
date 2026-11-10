# LockLens — Private Password Security Workspace

A responsive browser password generator and educational strength analyzer. Generation and analysis run locally, with separate pattern estimates, character composition, length guidance and generation provenance. Estimates are not safety guarantees; the project has not undergone an independent security audit.

## Current scope

- Modern responsive interface with generator and analyzer views.
- Selectable upper/lowercase, digits, symbols; default length 20, normal 8–40 and Advanced Length 41–64; optional ambiguous-character exclusion; batches of 1/5/10.
- Browser Web Crypto random generation, unbiased selection with rejection sampling, each selected character category represented, and unbiased Fisher–Yates shuffle.
- Password reveal/hide, per-item copy and regenerate.
- Locally bundled zxcvbn-ts with common/English dictionaries and keyboard graphs for both generated and entered text. Estimates and detected patterns are separate from NIST verifier-length guidance.
- Character composition shows actual length and category presence independently of strength. Only verified LockLens batches show a generator pool, calculated from their saved settings; entered text never inherits it.
- Frozen generation metadata and a conservative process bound that accounts for category coverage and shuffling. Entered passwords have unknown provenance, regardless of appearance.
- No analysis/generation network calls, accounts, API keys, password storage, database or third-party runtime services. Initial site files, including the bundled estimator/dictionaries, are requested from the host.

## Run locally

Requirements: Node.js 20+, npm. Development tools are TypeScript, esbuild and playwright-core. Runtime estimator packages are bundled at build time; the static site needs no Node server in production.

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. `npm run dev` builds and starts the local static preview server. It **does not hot reload**: after changing TypeScript or CSS, run `npm run build` and refresh. The preview server is a development tool; production hosting serves static files from `dist/`.

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`. Use `npm ci` to reproduce the locked dependency versions.

## Tests

```bash
npm run check
npm test
```

`test` runs the production build, core regressions and browser regressions. `test:unit` and `test:browser` can run separately after a build. TypeScript emits the modules used by tests to the ignored `.test-artifacts/compiled/` directory; only the bundled app and static assets are delivered in `dist/`.

Browser tests use installed Chrome or Edge on Windows; on other systems set `LOCKLENS_BROWSER_PATH` to an installed Chromium executable. The test server binds to `127.0.0.1:5173`; stop any other preview on that port first. Tests do not download a browser. Local screenshots and test output remain under `.test-artifacts/`.

Read [analysis methods and limitations](docs/ANALYSIS.md) for composition definitions, NIST references and the generation probability derivation. The app bundle including the estimator and dictionaries is approximately 1,657 KiB (829 KiB gzip).

## What this is not

- It is not a password manager or cracking tool.
- The analyzer provides an approximate guess-resistance assessment, not real-world crack times, uniqueness verification, a breach lookup or a safety guarantee. Common/English dictionaries cannot cover all languages or personal context.
- A generated password might be exposed through the OS clipboard after copying. Clipboard management is user responsibility.
- Generated secrets are held in memory only while the page is open; avoid entering active account credentials when testing analyzer.

## Documentation

- [Product scope](docs/PRODUCT_SPEC.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Security and privacy boundaries](docs/SECURITY_AND_PRIVACY.md)
- [Analysis methods](docs/ANALYSIS.md)
- [Release review and static hosting](docs/RELEASE.md)
- [Public source repository manifest](docs/PUBLIC_REPOSITORY_MANIFEST.md)

## Build artifacts

This is a source-code repository: `dist/` is generated locally and excluded from Git. Rebuild after cloning or changing source, and serve only `dist/`. Relative asset paths support hosting under a repository subpath. The build copies the HTML, styles, favicon and MIT License, bundles the app with its dictionaries, and retains dependency notices. It does not ship development prompts, internal notes, test modules or source maps.

## Attribution

Custom interface and logic created as an initial design/implementation foundation. No paid visual assets, fonts, bundled TTS models, API keys or third-party CDNs are used.

Designed & Developed by Savija Rumeth. Third-party components and datasets retain their respective copyrights and licenses; see [third-party notices](THIRD_PARTY_NOTICES.txt), including attribution for the English dictionary's OpenSubtitles-derived data. The build also retains these notices in `dist/THIRD_PARTY_NOTICES.txt`.

## License

LockLens source code is released under the [MIT License](LICENSE), copyright (c) 2026 Savija Rumeth. This project license does not replace the licenses or ownership notices of third-party dependencies and datasets.
