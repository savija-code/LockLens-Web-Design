# Public source repository manifest

Snapshot: 2026-11-10. This source-only release contains **36 files** under the project ignore rules. The list below was checked against the actual workspace inventory.

The workspace has no Git repository metadata, index or staged files. This is a prospective public manifest, not a statement that files have been staged or a Git-index audit has passed. No Git initialization, commit, push, repository creation or deployment was performed.

## Public files

```text
.gitignore
LICENSE
README.md
THIRD_PARTY_NOTICES.txt
docs/ANALYSIS.md
docs/DESIGN_SYSTEM.md
docs/PRODUCT_SPEC.md
docs/PUBLIC_REPOSITORY_MANIFEST.md
docs/RELEASE.md
docs/SECURITY_AND_PRIVACY.md
index.html
package-lock.json
package.json
public/favicon.svg
scripts/bundle.mjs
scripts/copy-assets.mjs
scripts/dev-server.mjs
src/core/composition.ts
src/core/guidance.ts
src/core/password.ts
src/core/strength.ts
src/main.ts
src/styles/base.css
src/styles/components.css
src/styles/layout.css
src/styles/responsive.css
src/styles/tokens.css
src/ui/app.ts
src/ui/composition.ts
src/ui/icons.ts
src/ui/navigation.ts
src/ui/template.ts
tests/browser.test.mjs
tests/password.test.mjs
tests/strength.test.mjs
tsconfig.json
```

## Excluded local-only material

- `node_modules/`: installed dependencies.
- `/dist/`: generated site files, including the local production build.
- `.test-artifacts/`: compiler output, screenshots, test helpers and all local checkpoints/backups.
- `/internal/`: private walkthroughs, development history and review notes.
- `/docs/codex/` and `/AGENTS.md`: local implementation instructions.
- Environment secrets, local logs, temporary/backup files, compiler caches, coverage and OS metadata matched by `.gitignore`. The existing `.env.example` exception is reserved for nonsecret templates; no such file is present in this snapshot.

Excluded files remain on the computer. Source, public assets, tests, configuration, package metadata and technical security explanations are retained. `LICENSE` contains the standard MIT License, copyright (c) 2026 Savija Rumeth. `THIRD_PARTY_NOTICES.txt` preserves dependency and dataset ownership and terms separately.

## Tracking and publication boundary

No tracked-ignored-file determination or repository Git diff is possible until an actual worktree exists. This inventory applies the current project ignore patterns; future Git configuration or additional ignore rules may affect staging. After Git initialization is explicitly authorized, inspect the actual tracked, ignored, untracked and staged lists using the [release tracking checks](RELEASE.md#tracking-checks-after-git-is-explicitly-authorized). If an ignored file is already tracked, the documented `git rm --cached` procedure keeps its local copy. No untracking command has been run. Publishing requires separate explicit approval.
