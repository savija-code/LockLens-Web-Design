# Branding and private-hosting preparation review

Date: 2026-11-12. Work was performed only in the current project. No Git initialization, remote changes, commits, pushes, publication, deployment, public-source import or repository fetch occurred.

## Exact source/configuration files changed

- `README.md`
- `docs/BRANDING_AND_HOSTING_REVIEW.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/OWNERSHIP.md`
- `docs/PUBLIC_REPOSITORY_MANIFEST.md`
- `docs/RELEASE.md`
- `docs/SECURITY_AND_PRIVACY.md`
- `package.json`
- `scripts/bundle.mjs`
- `scripts/copy-assets.mjs`
- `scripts/dev-server.mjs`
- `scripts/production-files.mjs`
- `scripts/verify-dist.mjs`
- `src/config/creator.ts`
- `src/styles/components.css`
- `src/ui/app.ts`
- `src/ui/branding.ts`
- `src/ui/icons.ts`
- `src/ui/template.ts`
- `tests/browser.test.mjs`
- `tests/production.test.mjs`
- `vercel.json`

Generated files under ignored dist/ were rebuilt. Ignored QA screenshots were saved under .test-artifacts/branding-desktop.png, branding-tablet.png, branding-mobile.png, about-desktop.png and legal-mobile.png.

## Social connections

The compact footer connection section publishes the confirmed GitHub profile only: https://github.com/savija-code. LinkedIn and Facebook remain null in src/config/creator.ts and have no visible placeholders or nonfunctional links. Confirmed canonical HTTPS platform URLs can be configured later. The validator rejects credentials, wrong hosts, custom ports, queries and fragments.

Each link has an accessible name, original local SVG, visible keyboard focus and hover states, target=_blank, rel=noopener noreferrer external and referrerpolicy=no-referrer. No icon dependency, embed, tracking pixel or social script was added. Rendering makes no social-network requests; following a profile is an intentional external navigation.

## Ownership and licensing decisions

LICENSE, THIRD_PARTY_NOTICES.txt and package-lock.json are byte-for-byte unchanged. No dependency was added. Existing MIT permissions, first-party copyright, dependency MIT notices and OpenSubtitles-derived ODC-BY attribution remain intact.

The visible copyright is “© 2026 Savija Rumeth. All rights reserved.” with an immediate qualifier: “Subject to existing MIT grants and third-party license terms.” Legal information links to the complete license and notices. No proprietary conversion or retroactive withdrawal of MIT rights is claimed. New contributions in this change inherit the current license; separate future terms need an explicit ownership/scope decision. See OWNERSHIP.md for the audit, contributor-rights limits and remaining dataset verification.

EFF word-list provenance/attribution could not be verified because no such file or notice was present in the supplied implementation. No attribution was removed or substituted.

## Production output inventory

The verified package contains exactly these 11 files:

| File | Bytes at verification |
| --- | ---: |
| LICENSE | 1070 |
| THIRD_PARTY_NOTICES.txt | 6349 |
| _headers | 497 |
| assets/main.js | 1700377 |
| assets/styles/base.css | 789 |
| assets/styles/components.css | 19742 |
| assets/styles/layout.css | 1433 |
| assets/styles/responsive.css | 3243 |
| assets/styles/tokens.css | 505 |
| favicon.svg | 390 |
| index.html | 915 |

JavaScript and all five stylesheets are minified. The bundle is approximately 1,661 KiB, or 831 KiB gzip when the host enables compression. Source maps and map references are excluded. The explicit public/output inventory rejects unreviewed or stale files without deleting them. Tests, internal notes, screenshots, source modules and environment files are outside the deployment file list.

vercel.json prepares a static build targeting dist/. The build emits equivalent Cloudflare Pages _headers. Both configurations include a same-origin CSP with worker-src self, referrer suppression, no MIME sniffing, framing denial, limited browser permissions, opener isolation and no-cache revalidation for non-hashed assets. The local preview applies the same security headers. See RELEASE.md for provider instructions, Worker restrictions and HTTPS/HSTS decisions. No anti-DevTools code or obfuscation was introduced; browser-delivered code remains inspectable.

## Privacy and security findings

All src/core files are byte-for-byte unchanged from the pre-change snapshot. Cryptographic generation, category guarantees, estimator thresholds, composition and provenance calculations were preserved.

Existing tests confirm local generator/analyzer behavior without additional analysis/generation requests, browser password persistence or unsafe input markup. The new branding does not collect input or create an account/API backend. Clipboard warnings remain, and privacy text explains clipboard history, extensions, compromised devices, host access logs and explicit external navigation. The asset inventory is a packaging guard, not a substitute for reviewing secrets in source.

Passphrase Generator, EFF assets, Web Worker analysis and Report exports were not available in the supplied runtime source for functional verification. Those features were not recreated, altered or removed, and are not reported as passing tests. Same-origin Worker permission in CSP is preparation, not proof of an implemented Worker.

## Test and visual results

- npm.cmd run check: passed.
- npm.cmd run build: passed, including inventory/source-map verification.
- npm.cmd run test:unit: 28 passed, including the original core regressions and new URL/packaging/header/notice checks.
- npm.cmd run test:browser: 13 passed in installed Chrome.
- Responsive checks cover 320, 390, 768, 1024 and 1440 CSS pixels.
- Zoom checks simulate 200% browser reflow by halving the CSS viewport. They are not a native browser-UI zoom test.
- Footer link contrast exceeds 4.5:1, keyboard focus is visible, and reduced motion suppresses transitions.
- Generator, analyzer, copy masking, navigation and input handling pass with the prepared CSP.
- Desktop, tablet, mobile and expanded Legal screenshots were visually inspected.

## Remaining owner inputs and readiness

Supply confirmed LinkedIn and Facebook URLs, choose the intended private repository/provider/domain, and review host logging and HTTPS/HSTS scope. Confirm ownership/contributor scope before proposing separate proprietary terms. Dataset notices and the additional runtime features identified above still need their actual implementation/assets verified.

The verified static package is prepared locally, not deployed. Production host response checks, other-browser/native-zoom checks, a fresh dependency-advisory review and an independent security/accessibility audit remain outside this validation. Public source repository settings and remote files are unchanged.

