# Wave 03-05 — granular imports and heavy boundaries

Delivered two ready-to-apply patches with five implementation fixes, a source
regression guard, a focused packed-module auditor and concrete import/package
guidance. **All five assigned leaves remain partial until their stated review or
runtime successors finish.** No shared implementation, manifest, build output,
ledger or server was changed. Root API and all existing public exports are preserved.

## Concrete finding and fix

Five implementation files import the complete SGUI icon barrel: DataToolbar,
SideNavigation, DataGridDragHandle, ownedGridParts and ownedGridInteraction.
`direct-icon-imports.patch` changes only those imports to the corresponding
individual modules. `payload-verification.json` proves that the five parsed
implementation bodies and named local import bindings are unchanged.

The read-only runtime-reference traversal covers all **238 concrete JavaScript
export paths**, including both icon wildcard families. It follows relative static
imports/reexports and literal dynamic imports, excludes type-only references and
stops at external package specifiers. There are zero unresolved relative references.
It does not execute code, traverse upstream package internals, tree-shake or certify
module evaluation/Flight behavior. The proposed graph overlays only owned mirrors.

| Consumer entry | Current SGUI icon modules reached | Proposed |
| --- | ---: | ---: |
| SideNavigation | 97 | 7 |
| DataToolbar | 97 | 14 |
| AppDataGrid | 97 | 8 |
| AppDataGridShell | 97 | 18 |
| LearnerClassesDataGrid | 97 | 11 |
| AppDataGridRowDnd | 97 | 1 |

These are traversal counts including helper modules ending in `Icon`, not bundled
glyph counts. Root and `/components` intentionally retain their full API graph.
Button reaches no SGUI icon module or Lexical/TanStack dependency. Individual
`/icons/AddIcon` reaches one SGUI icon wrapper. `/primitives` reaches React Aria
interaction modules, but no Lexical/TanStack module. ClassCardFrame reaches only
React/JSX external imports. Grid and editor entries retain their expected engines.

The new source guard fails on exactly the five current barrel imports (expected
exit 1, retained in `guard-before.txt`) and passes on the five proposed files
(`guard-proposed.txt`). This is **not** a full post-integration guard pass. Both
patches pass `git apply --check`; both new scripts pass `node --check`.

## Package assessment and reviewable decision

`install-footprint.json` measures the current resolved runtime dependency closure:
48 directories, 79,051,504 regular-file bytes. The ten direct Lexical roots account
for 32 editor-exclusive directories and **9,250,028 bytes**. Without those roots,
the same closure has 16 directories and 69,801,476 bytes. Peer dependencies are not
traversed; installed optional dependencies are included; nested node_modules and
symlinks are excluded from per-package byte sums. This is logical unpacked file
weight, including maps/types/licenses, not compressed tarball, network transfer,
fresh installation evidence or a complete core-only package measurement.

`guard-and-recipes.patch` adds an exact supported import matrix and proposes keeping
the existing package for compatibility, with individual paths as domain boundaries.
No speculative `/core`, `/grid`, `/editor`, `/learning` aliases are added. The proposal
explicitly accepts mandatory Lexical installation for the existing package, subject
to maintainer review. If zero editor installation is required, it prescribes a
separate core/editor package design while retaining the current package as umbrella;
merely marking Lexical optional cannot protect eager root reexports. The proposal
records CSS/scope, public type, release, notices and migration work required by a split.
No human package decision is fabricated, and no dependency change is proposed.

## Leaf dispositions

### A-A-18 — partial

Original: Keep heavyweight modules out of basic-control dependency paths; decide
which require separate subpaths versus separate packages.

Current emitted/source graphs expand the old ten-root review to all 238 concrete
export routes. Basic Button/theme/tokens/hooks/adapters/i18n/ClassCardFrame paths
have no Lexical/TanStack reachability. Fixed accidental SGUI catalog traversal is
provided as an unapplied five-file patch. The exact package recommendation and
installation-cost comparison are ready for review.

Remaining: integrate patches; run the source guard and focused packed auditor;
maintainer records the existing-package installation tradeoff or approves the split
alternative. No runtime closure from virtual graphs.

### A-E-08 — partial

Original: Put editor-only dependencies behind a granular import boundary and assess
whether separate packages are required to avoid mandatory installation weight.

The existing `/components/PageRichTextEditorSection` boundary positively reaches
Lexical; basic paths do not. Installation assessment now quantifies the actual
editor-exclusive closure. The proposed decision explains that separate package
installation is required for consumers who must avoid Lexical installation, and
preserves the root API via the umbrella option. Current package still installs it.

Remaining: maintainer accepts the measured keep-one-package tradeoff or requests
the specific split; coordinator executes packed basic/editor positive and negative
controls and retains final packed bytes. No optionality or owner approval claimed.

### A-I-04 — partial

Original: Keep icons individually importable; avoid pulling an entire icon catalog
into basic components.

Both wildcard export families remain reachable and individually bounded in the
emitted SGUI graph. The five implementation fixes remove catalog traversal from
navigation/toolbar/grid consumers, with an AST regression guard. The packed auditor
requires retained AddIcon/Plus modules, absence of three unrelated rendered Lucide
glyphs, no SGUI catalog traversal from affected compositions, and emitted CSS.

Remaining: apply/build once and execute that auditor in the installed packed fixture.
Its syntax check and static counts do not prove production glyph pruning.

### A-R-03 — partial

Original: Design root and granular entry points for core, theme/tokens/styles,
primitives, icons, hooks, adapters, i18n, grid, editor and learning compositions.

The proposed guide supplies actual supported paths for every named domain, exact
consumer code and a compatibility-preserving package recommendation. It distinguishes
primitive interaction barrels from pure presentation paths, preserves the
CardPaginationFooter path/alias and disallows private dist/src recipes. No exports
were removed or invented.

Remaining: maintainer adopts the concrete package decision and guide; coordinator
validates the selected installed-tarball recipes. A later split needs the prescribed
package-name and breaking migration decisions, rather than an implicit rename.

### A-R-04 — partial

Original: Ensure barrels do not accidentally pull interactive/heavyweight dependencies
into presentation-only imports or make server consumers import all editors.

ClassCardFrame and tokens remain bounded presentation/data paths. Root/components
are intentionally convenience entry points; `/primitives` is explicitly an
interaction barrel. The icon imports are fixed in the proposed source. The auditor
records a supported root Button consumer separately from isolated imports, including
resolved and rendered modules so tree shaking cannot hide traversal.

Remaining: packed auditor execution plus retained attributable packed SSR/React19
Flight evidence for the current integrated candidate. A module graph is not server
execution, and source client directives do not make root a pure presentation boundary.

## Evidence identity and commands actually executed

Shared branch `dev`, base HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`;
analysis runtime **Node 26.5.0, Darwin arm64**. These pure-node/static checks are not
supported Node22/24 runtime-conformance evidence. Commands from repository root:

```sh
node docs/developer/final-acceptance/wave-03-05/inspect-boundaries.mjs
node docs/developer/final-acceptance/wave-03-05/measure-install.mjs
node docs/developer/final-acceptance/wave-03-05/verify-payload.mjs
node docs/developer/final-acceptance/wave-03-05/proposed-files/packages/ui/scripts/check-icon-import-boundaries.mjs packages/ui/src
node docs/developer/final-acceptance/wave-03-05/proposed-files/packages/ui/scripts/check-icon-import-boundaries.mjs docs/developer/final-acceptance/wave-03-05/proposed-files/packages/ui/src
```

The first three pass; the fourth intentionally fails on five current imports; the
fifth passes its five-file scope. `patch-check.json` records both exact patch checks
and both syntax checks with exit 0. Inspection scripts write only their owned JSON;
stdout was retained as `boundary-check.txt`, `install-check.txt`, `payload-check.txt`.

All **1,778 built-library files match** coordinator-integration's hashes, with no
missing or changed output. Its Node24 package/build receipt remains reusable within
its original scope; it does not include a fresh granular Vite module map. Prior
report/results hashes and companion input comparisons are captured in
`boundary-evidence.json`: wave02-05 28/35 equal, wave02-03 235/238 equal, wave02-15
911/921 equal, wave02-12 40/43 equal. Changed inputs are listed individually; old
source results are not globally promoted to this tree. The new graph captures
current reached source/emitted bytes. Historical Vite/SSR/browser receipts retain
their dated limits and were not relabeled current.

No install, library/docs build, unit suite, browser/server startup, Git mutation,
publication or external-owner verification occurred. `validation-plan.json` gives
bounded coordinator commands and acceptance assertions. Both patches still require
integration. No checklist/count update is authorized by this report.
