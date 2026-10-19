# Packed package acceptance

This bounded A-18/E-08/R-03–R-05/R-09/X-20/Z-08 slice checks the current
single-package distribution. It does not close the broader migration gates.
Source and freshly packed output outrank historical checklist state.

## Executable coverage

`pnpm check` rebuilds `dist` before `scripts/check-package.mjs` imports every
explicit JavaScript export and each individual icon wildcard module. Existing
checks validate owned declarations, preserved source client directives, compiled
CSS layers and absence of retired implementation references.

The package check now packs and extracts the actual tarball. Every emitted
JavaScript file, declaration, stylesheet, source map and asset must be present
with identical bytes. Packed export conditions and CSS side effects must equal
the reviewed manifest. LICENSE, README and third-party notices must be retained
unchanged, and unexpected top-level source/configuration directories fail.
The extracted emitted implementation receives the same retired-reference audit.
The temporary audit directory is removed after success or failure.

The foundation consumer installs the tarball without automatically installing
peers, then checks the existing API fixture against installed declarations with
TypeScript 5.9.3 and React types matching React 18.3.1 or React 19.2.3. That fixture
covers generic grid columns, native refs, owned callback payloads and deliberate
negative API cases. It uses `skipLibCheck`, so this is consumer API evidence,
not a promise that all third-party declaration internals compile unchecked.
No wider supported TypeScript version range has been established by this slice.

Each of these imports receives a separate Vite production library build:

- `/tokens`, `/theme`, `/primitives` (Typography), `/icons/AddIcon`
- `/hooks`, `/adapters`, `/i18n`
- `/components/Button`, `/components/ClassCardFrame`
- `/components/AppDataGrid`

The audit inspects resolved module IDs before minification instead of searching
for engine names in minified output. Every entry must avoid Lexical modules;
entries other than the grid must also avoid TanStack and catalog grid modules.
Each build explicitly imports `/styles.css` and must emit one stylesheet with
scoped tokens. These checks catch accidental barrel traversal even when a
bundler could eventually prune that traversal. They cover representative exports
from each listed subpath, not every possible consumer composition.

Existing foundation SSR, React 19 Flight, production CSS and icon pruning checks
remain. Existing editor fixtures positively require retained Lexical code and
reject retired runtime packages. See [runtime evidence](react-aria-runtime-ci.md)
and [server boundaries](react-aria-server-components.md) for their exact scope.
These commands build hydration entries; browser hydration is established only
when browser checks are separately executed.

## Distribution and import boundaries

The [import recipes and distribution decision](react-aria-import-boundaries.md) retain the existing package and explicit component subpaths, following the target architecture. Fourteen actual installed-consumer production probes establish the bounded module graphs and intentional editor/grid positive controls. Root convenience imports retain their broader resolution graph and can tree-shake unused engines.

Granular imports avoid editor code in basic consumer module graphs; they do not remove the ten direct Lexical dependencies from installation. The measured editor-exclusive installed closure and the separate core/editor package alternative are documented in the decision. This migration retains compatibility and accepts that installation cost. It does not claim optional editor installation, component-split CSS or establish new package names. A future lightweight-install requirement would need the documented package split and clean-install compatibility checks.

The tarball retains retired names in preserved third-party notices (including
Emotion and the former component/grid packages). The current README has no
retired-name matches. The notice matches are legal references, not emitted
implementation or dependency requirements. Z-08 is consequently partial;
Z-05/Z-06 must reconcile provenance and notices after an attribution review.
This assignment does not delete or rewrite legal notices.

## Validation record

Results for this slice are recorded in [the packaging batch report](parallel-batch-01/packaging.md).
Local checks do not establish a subsequent CI run, publication readiness,
a broader TypeScript matrix, or browser/device/assistive-technology acceptance.

## Current acceptance inventory — 2026-10-16

The [first final-acceptance batch](archive/2026-10-18-task-lists/react-aria-final-acceptance.md) captures the
modified `dev` checkout, package metadata, runtime/declaration export names and
direct icon modules. Its fresh package audit imports declared routes, typechecks
the existing consumer fixture and verifies packed bytes against the current build.
It does not close the remaining editor presentation or broad release gates.


## Reviewed immutable-consumer execution

After the coordinator has frozen a reviewed tarball, the integrated-script launcher
runs the existing five scopes serially and retains their independent installed
fixtures, commands, stdout/stderr, installed graphs, browser artifacts and hashes:

```sh
node packages/ui/scripts/run-acceptance-consumers.mjs \
  --tarball /absolute/reviewed-candidate.tgz \
  --expected-sha256 REVIEWED_64_CHARACTER_SHA256 \
  --output /absolute/new-consumer-evidence --browser
```

Use the existing validation lease and supported Node22.12/24 window. The launcher
checks the reviewed hash before any consumer install, copies the current integrated
scripts and existing assertions, and does not build/pack shared library output.
The driver-only tool symlink does not replace independent tarball installations.
Existing output paths are rejected. `--only foundation18,foundation19` (or editor18,
editor19,next19) supports bounded continuations; keep original failed receipts.
Next always executes browsers; Vite hydration requires `--browser`. The reviewed wave-04 current-candidate matrix passed all five scopes and their
three-engine hydration flows against tarball SHA-256
`4af68cf00eca568596d2acc0b057b67e94700428c23be444cd6049ef2a228959`.
The receipt is `packages/ui/artifacts/wave04-current-consumers/matrix.json`;
installed declaration checks separately passed both React generations with
`skipLibCheck` enabled and disabled. This evidence does not
supply owner package-split decisions, CI/release approval, or new support promises.
