# Ownership and licensing review

## Current scope

The existing `LICENSE` names Savija Rumeth, copyright 2026, and grants MIT permissions. `package.json` also declares MIT. Application TypeScript, CSS, HTML and scripts are first-party project material under that existing notice unless a file states otherwise. These files alone cannot establish the complete contributor, employment or asset-rights history; the owner must confirm that history before changing the license scope.

The owner identifies previously published application code as MIT. No public repository was fetched, imported or modified in this work, and no line-by-line publication provenance is claimed. Existing MIT permissions and required notices are preserved. This work does not assert that a private repository retracts rights in previously distributed code.

New branding/configuration/build files have no separate proprietary license in this change and remain subject to the current project license. If the owner later chooses proprietary terms for independently owned new contributions, explicitly identify the covered files and effective scope, confirm all contributors' rights, and preserve MIT notices for included MIT material. A blanket “all rights reserved” notice must not imply that existing MIT grants or dependency terms have been revoked. No proprietary conversion was performed here.

The visible wording is:

> © 2026 Savija Rumeth. All rights reserved.
> Subject to existing MIT grants and third-party license terms.

The accompanying Legal disclosure links to the complete MIT license and dependency notices. Browser-delivered JavaScript, CSS and assets remain inspectable. Minification reduces transfer size; it is not access control. Repository visibility is a separate hosting/source-management decision.

## Third-party material

`THIRD_PARTY_NOTICES.txt` and the generated distribution notice retain these components:

| Material | Notice/terms retained |
| --- | --- |
| zxcvbn-ts core, common and English language packages | MIT; Dan Wheeler/Dropbox and zxcvbn-ts copyrights |
| English common-word data derived from OpenSubtitles 2024 via OPUS | ODC-BY attribution; package NOTICE and THIRD_PARTY_LICENSES retained |
| dictionary-compression | MIT; zxcvbn-ts copyright |
| fastest-levenshtein | MIT; Kasper Unn Weihe copyright |

TypeScript, esbuild and playwright-core are development tools, not runtime libraries shipped as those tools in the website. Their installed package licenses remain with the dependencies. The new social SVG paths are local project artwork, with no icon library or social embed.

An EFF word-list file and its attribution were not present in the supplied source/assets/notices. No EFF notice was removed, invented or replaced. Its exact filename, provenance and supplied license/attribution must be verified before claiming that dataset is packaged. Do not substitute the OPUS notice for EFF attribution or assume that one website-wide license covers every downloaded dataset.

## Owner decisions

- Confirm any contributors or assets with additional ownership terms.
- Supply confirmed LinkedIn and Facebook profile URLs; only GitHub is currently public in the footer.
- Decide whether future original additions should have separate proprietary terms; the current MIT license is retained.
- Choose the private repository, hosting provider and domain independently. No repository or deployment settings were changed remotely.

Reference: the [MIT license text](https://opensource.org/license/mit) permits redistribution subject to retaining its copyright and permission notice. The local `LICENSE` and third-party files are the actual notices included in the distribution.
