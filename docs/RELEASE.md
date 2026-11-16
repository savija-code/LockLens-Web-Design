# Private-source static hosting preparation

This guide prepares the current application for a future public static website backed by a privately maintained source repository. It does not initialize Git, change remotes, commit, push, publish or deploy.

## Validate locally

Run on the production build machine:

```bash
npm ci
npm run check
npm test
```

On Windows PowerShell use npm.cmd. The test command builds, runs core/packaging regressions and uses an installed Chromium browser for browser tests. The Node preview server is loopback-only and serves the same security headers for local verification; it is not a production server.

## Production output

Serve only dist/ over HTTPS. The explicit inventory is:

```text
index.html
favicon.svg
LICENSE
THIRD_PARTY_NOTICES.txt
_headers
assets/main.js
assets/styles/tokens.css
assets/styles/base.css
assets/styles/layout.css
assets/styles/components.css
assets/styles/responsive.css
```

JavaScript and all five CSS files are minified with esbuild. Source maps are explicitly disabled. Required project and dependency/data license notices stay readable. The app bundle includes the estimator and its dictionaries, approximately 1,661 KiB (831 KiB gzip). Enable gzip or Brotli at the host. Asset filenames are not hashed, so the prepared policy uses no-cache, allowing conditional revalidation rather than stale immutable caching.

scripts/production-files.mjs lists reviewed files and public assets. Unreviewed public files or stale distribution files cause a build error without deleting anything. Review each extra file before changing the list; never add broad wildcard copies. This protects against accidental test, screenshot, internal-note, environment-file or source-map publication. It is a packaging boundary, not a general secret detector: secrets must never enter client source or public configuration in the first place. Compiler/test modules remain in .test-artifacts/compiled/.

No Worker, passphrase word-list or report-export source/assets were available for functional verification in this supplied implementation. No such features were added, replaced or removed. If these runtime assets are incorporated later, explicitly register and verify their output paths and preserve their dataset notices. The present inventory must not be reported as proof that those additional features work.

## Provider configuration

For Cloudflare Pages, choose the intended private source repository in the provider dashboard, use npm run build, and set the output directory to dist. The build emits dist/_headers from the reviewed security-header settings in vercel.json. Cloudflare applies this file to static responses; it does not configure custom Function responses.

For Vercel, vercel.json declares a static build and output directory, without credentials, repository identity or project IDs. It supplies the same headers. Choose the intended private source repository and domain separately. The configuration file does not perform deployment by itself.

Do not deploy the project root or enable optional analytics, social embeds, remote fonts or injected third-party scripts. Optional preview toolbars may be blocked by this policy; do not weaken production CSP to accommodate them. A public website exposes its delivered JavaScript, CSS and assets even if source development is private. Minification is not an anti-inspection mechanism.

## Security-header policy

The prepared response headers are shared between Vercel, Cloudflare static output and the local preview:

```text
Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), clipboard-read=()
Cross-Origin-Opener-Policy: same-origin
Cache-Control: no-cache
```

The policy permits same-origin script/style/font/image resources and same-origin Worker scripts. connect-src self permits local static resources such as a same-origin word-list fetch if an implementation needs it; it does not mean passwords are sent anywhere. Current generation and analysis make no requests after initial loading. worker-src does not allow blob: workers. Only add that scheme if an actual reviewed Worker implementation requires it; none was verified here. No unsafe-inline or unsafe-eval is required. Clipboard writing remains available; clipboard reading is not needed.

Before deployment, verify the actual host responses, correct script/style/Worker MIME types, HTTPS redirects and caching at the chosen domain and any subpath. Consider Strict-Transport-Security only after confirming the domain serves HTTPS reliably; includeSubDomains/preload require a separate domain-wide decision. Header configuration has been tested locally, not on a deployed host.

## Privacy and ownership review

Existing generator/analyzer inputs are kept in browser memory, assigned through safe DOM APIs and not intentionally logged, persisted, put in URLs or submitted to a backend. Copy can leave sensitive values in OS clipboard history or clipboard sync; the UI warns that the clipboard may retain them. Extensions, screen sharing and compromised devices are outside the app's control. Strength scores are estimates, not security guarantees.

Social profiles are ordinary opt-in external navigations with noreferrer/noopener and no-referrer. Only the confirmed GitHub URL is rendered. They make no requests during page rendering. The host may record normal static-file access metadata; its logging and privacy settings require owner review. Report exports could not be audited without an export implementation; do not claim that future downloaded reports are automatically private or erased.

LICENSE and existing MIT grants remain intact; THIRD_PARTY_NOTICES.txt retains separate dependency and OpenSubtitles-derived dataset attribution. See [OWNERSHIP.md](OWNERSHIP.md). A private repository does not revoke previous license grants. No EFF list or notice was present to verify, so its provenance and attribution remain a specific follow-up if used.

## Owner decisions and readiness

The local static package and verified tools can be tested with the prepared headers. Remaining owner decisions are confirmed LinkedIn/Facebook URLs, the intended private repository, provider/domain, host logging, HTTPS/HSTS scope and any proposed separate license for new original contributions. Additional runtime assets/features require their own functional and notice verification. A deployed-host review, current dependency-advisory review, other-browser checks and an independent security/accessibility assessment remain outstanding. No production-audited or deployment-complete claim is made.

References: [Cloudflare static headers](https://developers.cloudflare.com/pages/configuration/headers/), [Vercel security headers](https://vercel.com/docs/cdn-security/security-headers), [MDN worker-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/worker-src).
