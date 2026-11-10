# Release review

LockLens is a static browser application. This document describes preparation and hosting; it does not authorize or automate publishing.

## Verify the source and build

```bash
npm ci
npm run check
npm test
npm run build
```

Use an installed Chromium browser for browser regressions, as described in the README. The test command builds first. Review source changes and the local regenerated distribution, then preview the result with `npm run dev`. On Windows, use `npm.cmd`. Generated `dist/` files stay on disk and are excluded from this source-code release.

Confirm generation, reveal/copy, batch controls, analyzer feedback, length guidance, keyboard navigation and mobile navigation. Compare screenshots with the approved baseline. Generation and analysis should make no requests after the static assets have loaded, and inputs must not enter browser storage, URLs or logs.

## Review what will be public

- Include the files in the [public source manifest](PUBLIC_REPOSITORY_MANIFEST.md): source, public assets, tests, scripts, configuration, package metadata, README, LICENSE, technical documentation and third-party notices.
- Keep `node_modules/`, `/dist/`, `.test-artifacts/`, `internal/`, local implementation prompts under `docs/codex/`, and `AGENTS.md` out of automatic staging. These local files are preserved and excluded by `.gitignore`, along with logs, temporary files and environment secrets. The `.env.example` exception is for nonsecret templates only.
- Ignore rules do not remove files already tracked by Git. Inspect the staged file list and diff explicitly before any future commit or publication.
- Keep `package.json` marked `private: true`; the site does not need to be published as an npm package.
- The runtime distribution contains `index.html`, `favicon.svg`, `LICENSE`, `THIRD_PARTY_NOTICES.txt`, `assets/main.js` and five CSS files. Compiler output used by tests belongs under `.test-artifacts/compiled/`.
- Browser source maps are not generated. Public source in the repository remains inspectable by design; never place secrets in source or configuration.
- Preserve the application credit, the root MIT License (copyright 2026 Savija Rumeth) and all third-party notices. Third-party ownership and licensing remain separate. When bundled dependencies change, review and refresh the tracked `THIRD_PARTY_NOTICES.txt` against the generated distribution notice.

## Tracking checks after Git is explicitly authorized

This workspace currently has no Git metadata, index or staged files. The manifest is an inventory filtered by the project ignore rules, not a claim that files have been staged. Git initialization, commits and publication have not been performed.

Once an existing Git worktree is available, inspect these read-only results before staging:

```bash
git ls-files --cached --ignored --exclude-standard
git ls-files --others --exclude-standard
git diff
git diff --cached
```

If the first command lists an ignored path that was already tracked, review it and use `git rm --cached -- path/to/file` or `git rm -r --cached -- path/to/directory` for that exact path. These index-only commands keep local files. They are proposed steps, not actions performed during this preparation. Do not use a working-tree removal or force-add ignored private files. Review the resulting staged diff and actual file list before committing.

## Static hosting

Serve only `dist/` over HTTPS with correct JavaScript, CSS and SVG content types. Relative URLs support subpath hosting. Enable gzip or Brotli when the host supports it; the bundled dictionaries dominate transfer size.

The Node preview server binds to loopback and uses `no-store`; it is not a production server. Do not deploy the workspace root, compiler output, tests, private notes or dependencies. No account, API endpoint, runtime environment secret or server-side password processing is needed.

Review a host-appropriate Content Security Policy and other response headers before public deployment. The application has no external script, font or API dependency. Host access logs may contain ordinary request metadata, while generated passwords and analyzer inputs must never be transmitted.

## Remaining release decisions

The source is prepared under the approved MIT License. Initializing version control, choosing a remote, committing, publishing and deploying still require explicit owner approval. Hosting configuration and fresh dependency advisory, additional-browser and independent accessibility/security reviews remain separate from source publication. The local checks do not establish production-audited status.
