# Public source repository manifest

The public GitHub repository uses a source-only layout. The **36 tracked files** below include the application, tests, configuration, licensing and technical documentation.

This manifest documents the public source set and its boundary with local-only material. Git's tracked file list remains the source of truth as the project evolves.

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
- Environment secrets, local logs, temporary/backup files, compiler caches, coverage and OS metadata matched by `.gitignore`. The `.env.example` exception is reserved for nonsecret templates.

Generated and private development files stay outside the tracked source set. `LICENSE` contains the standard MIT License, copyright (c) 2026 Savija Rumeth. `THIRD_PARTY_NOTICES.txt` preserves dependency and dataset ownership and terms separately.

## Maintaining the manifest

Check the actual tracked files and any tracked paths that match ignore rules:

```bash
git ls-files
git ls-files --cached --ignored --exclude-standard
```

Update this list when public files are added or removed. Ignore rules do not untrack existing files, so review the tracked list and staged diff before publishing updates. Keep generated builds and private development material excluded.
