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

Packaging regressions also check the production inventory, retained notices, social URL validation and security-header configuration. Browser checks cover the footer's keyboard focus, contrast, responsive layout and 200%-equivalent zoom reflow (a halved CSS viewport).

Browser tests use installed Chrome or Edge on Windows; on other systems set `LOCKLENS_BROWSER_PATH` to an installed Chromium executable. The test server binds to `127.0.0.1:5173`; stop any other preview on that port first. Tests do not download a browser. Local screenshots and test output remain under `.test-artifacts/`.

Read [analysis methods and limitations](docs/ANALYSIS.md) for composition definitions, NIST references and the generation probability derivation. The app bundle including the estimator and dictionaries is approximately 1,661 KiB (831 KiB gzip).

## Creator profiles

Edit `src/config/creator.ts` to configure confirmed public HTTPS profile URLs. GitHub points to `https://github.com/savija-code`. LinkedIn and Facebook are `null` and produce no public links until confirmed. Canonical platform hosts are checked; credentials, tracking queries and fragments are rejected. These definitions are public client configuration, never a place for secrets. Links use a new tab with `noopener`, `noreferrer` and a no-referrer policy; no social scripts or embeds are loaded.

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
- [Ownership and licensing review](docs/OWNERSHIP.md)
- [Earlier public source inventory](docs/PUBLIC_REPOSITORY_MANIFEST.md)

## Build artifacts

`dist/` is generated locally and excluded from Git. A private development repository can power the public static website; its repository settings do not hide files delivered to browsers. Serve only `dist/` over HTTPS. Relative asset paths support subpath hosting. JavaScript and all five stylesheets are minified; source maps are disabled. The build preserves the MIT license and dependency notices and emits Cloudflare Pages headers matching `vercel.json`.

`scripts/production-files.mjs` explicitly lists deployable files and reviewed `public/` assets. New or stale unreviewed files cause the build to fail without deleting them. Register any actual required runtime assets there before deployment. Internal notes, tests, screenshots, environment files and source maps cannot silently enter the package. See the [release guide](docs/RELEASE.md) for inventory, CSP and provider setup. No deployment is performed by the build.

## Attribution

LockLens uses a custom TypeScript interface for local password generation and analysis. No paid visual assets, remote fonts, API keys or third-party CDNs are used.

Designed & Developed by Savija Rumeth. Third-party components and datasets retain their respective copyrights and licenses; see [third-party notices](THIRD_PARTY_NOTICES.txt), including attribution for the English dictionary's OpenSubtitles-derived data. The build also retains these notices in `dist/THIRD_PARTY_NOTICES.txt`.

## License

LockLens source code is released under the [MIT License](LICENSE), copyright (c) 2026 Savija Rumeth. This project license does not replace the licenses or ownership notices of third-party dependencies and datasets.

The footer copyright reservation is expressly subject to these existing grants. Keeping ongoing source development private does not revoke MIT permissions already granted. See the [ownership review](docs/OWNERSHIP.md) before considering separate terms for future original additions.
