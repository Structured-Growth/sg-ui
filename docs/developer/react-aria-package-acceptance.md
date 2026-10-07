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
- `/components/AppButton`, `/components/ClassCardFrame`
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

## Boundaries still requiring decisions

Granular imports avoid editor code in basic consumer module graphs, but the
manifest still declares `lexical` and `@lexical/*` as direct dependencies. A basic
consumer installs those packages. E-08 therefore remains open for a separate
editor package or another explicitly approved dependency/installation design.
Changing dependencies, exports or build entry points is outside this slice.

The root and `/components` barrels intentionally expose editors as well as
presentation components. They are convenience entry points rather than isolated
presentation boundaries. Use granular component entry points when dependency
traversal or server boundaries matter. A fully separated core/grid/editor public
entry-point design remains R-03/R-04 work.

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
