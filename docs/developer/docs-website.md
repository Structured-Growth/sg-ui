# Next.js docs workspace

The public repository is a pnpm workspace. `packages/ui` remains the only
publishable UI library. `apps/docs` is a private Next.js App Router application
using compiled public SGUI exports and `/styles.css`. Next.js is not a UI runtime
or peer dependency. Library scripts and existing browser specs live with the UI
workspace; the docs app owns public examples and the separate native fixture host.

## Website boundaries and identity

Use owned Box, Stack, Surface, Typography, Link and controls to compose the site.
HTML/body and native forms remain framework/semantic hosts. Next routing is supplied
through SGNavigationProvider. The shell's right icon rail contains section-wide demo settings and page-supplied component documentation; demo settings select identity/appearance/contrast; local density controls use owned APIs;
app-owned token overrides are supplied as Provider style so portals inherit them.
Do not change library defaults to brand the docs app. CSS Modules own only website
layout. No external font request, runtime styling engine or copied MUI UI is used.

## Playground control alignment

The shared Example panel wraps prop controls in a docs-owned layout scope. Row
Stacks bottom-align their children so standalone checkbox/switch targets align
with the input box beneath a neighboring field label, including wrapped rows.
Responsive Stacks restore stretch alignment when they become columns. Keep this
layout policy out of Checkbox padding and live preview/source styling; consumer
forms can use Stack `align="end"` for the same simple labeled-field row pattern.

## Examples and Storybook transition

MUI X's public docs workspace is the structural reference. The current catalog has
90 routes and 360 source-backed examples covering all 200 public React component
and icon export names, including aliases, compound children and host providers.
Pages include adjustable prop playgrounds, density comparisons, state/variant
matrices and local host workflows. Forms/date controls have independent compact,
comfortable and host-flow sections; AppModal has 12 size/content/workflow examples.
The icon page searches the 95 SVG icons and supports sizing, stroke and labels.

Catalog metadata is generated from the literal entries in the four component-family
modules. Server routes use that metadata; client family chunks load the appropriate
playground. Both the component index and expandable sidebar are searchable.
`catalog:check` rejects undocumented public component exports. Register every new
component and provide meaningful controls plus current copyable source.

Storybook runtime, configuration, dependencies and original story files have been
removed. `apps/docs/native-fixtures` now owns the isolated React browser host, built
with Vite from compiled public exports (plus a bounded private compiled allowlist
for historical grid proofs). This test bundle is separate from the public Next.js
site. The library keeps source-context unit fixtures under `*.native-fixture*` so
colocated tests retain the same React context instances.

The [scenario ledger](docs-fixture-migration.md) maps all 102 existing native specs
to their preserved fixture IDs and provenance. IDs retain their historical spelling;
execution now uses `/fixtures/?id=...` and owned render/play receipts. Assertions
continue to exercise the real production components. Every new public example
belongs to the website; new isolated native scenarios belong to the private host.

Production docs Playwright checks visit every catalog route, reject browser errors,
compile rendered source snippets before/after control changes, exercise search and
navigation, and check representative mobile layouts. Existing palette/system/
forced-color, dialog/focus and clipboard assertions remain. The migrated native
suite retains Chromium, Firefox and WebKit; its executed evidence is recorded in
the retirement receipt below when validation completes.

## Versions and licensing

The manifest in `apps/docs/content/navigation.ts` currently contains development
only. No release is fabricated. Later releases should build isolated immutable docs
snapshots using the matching library tag and examples; version navigation preserves
the current route, with deployment fallback for missing pages. Do not bundle all
historical package versions into one app. Archive publication and purchasing are
future workflow work, not implemented by this skeleton. Existing commercial terms
and notices are unchanged. There is no license-key enforcement or checkout yet.

## Commands

Run installation at repository root with `pnpm install --frozen-lockfile`.
Root `pnpm dev:docs`, `build:docs`, `check:docs` and `test:docs` build the library
before docs. Restart/rebuild when changing the UI package during this initial setup;
`pnpm build:watch` in a second terminal rebuilds the public package and generated
prop/composition metadata after source, stylesheet or build-input changes. Keep
`pnpm dev` in the first terminal for the Next.js server. Builds are serialized and
wait for active browser validation. Source edits received during a build queue
another build. A failed compile waits for the next edit. Token-source changes
still require `pnpm tokens:generate` before the checked build can succeed. `pnpm check` and `build:browser-docs` forward to UI. `pnpm test:browser` executes
the standalone native host; `pnpm test:docs` executes the public Next.js site.
Direct library scripts run with `packages/ui` as cwd. Full checkpoint coordinators
must select that workspace and record the move before continuing historical plans;
frozen prior worktree receipts must not be rewritten or reused as current passes.

## Delivery checklist

Current docs tasks DOCS-005-l and DOCS-007 are tracked only in the
[unified backlog](backlog.md). DOCS-005 is their migration rollup, not another
active leaf. [Completed checklist and transition snapshot](archive/2026-10-18-task-lists/docs-website.md#delivery-checklist).

## Active transition plan — 2026-10-14

This section preserves migration guidance and evidence. Current work is listed
only in [the unified backlog](backlog.md); the dated checkbox inventory is archived.

The Next.js website is the permanent documentation and UI design environment.
Author new public examples in `apps/docs`, with prop playgrounds and current
copyable source. Use real exported SGUI components for both website chrome and
previews. The website's Structured Growth identity is independent from the Material,
Apple Human Interface and Editorial demonstrations. Each demo retains light/dark,
system preferences and increased contrast; density belongs to individual examples.
All 102 native browser spec files now target the docs-owned fixture host. Storybook
is removed; fixture provenance and previous acceptance receipts remain recorded. Catalog completion does not establish public-facing scenario parity. Preserved
native scenarios are mapped separately, and their execution receipts remain
separate from the public-example reconciliation.

The migration sequenced DOCS-005-a/b/c before dependent families and transferred
each family as a bounded scenario/spec migration with numbered scenario leaves. Existing React Aria F/T/V/A priority and counts
remain unchanged; this work moves existing evidence to a new host rather than
adding broad coverage ahead of its assigned phase. DOCS-012 records the completed bounded
UI design token pipeline; DOCS-006/007/008 retain their independent deliverables.

### DOCS-005: retire Storybook without losing behavior coverage

The transferred scenario checklist is archived. DOCS-005-l remains in the
[unified backlog](backlog.md); accepted transfer evidence follows below.

### DOCS-005-b: bounded public-example parity follow-ups

All twelve public scenarios are implemented in existing independent Example owners. The [source-backed disposition table](docs-fixture-migration.md#public-example-parity-audit--docs-005-b) identifies each component, copied source and focused browser case. The [2026-10-15 receipt](archive/2026-10-18-task-lists/backlog-execution-2026-10-15.md#website-scenario-completion) retains their original focused execution; the latest accepted production catalog run verifies 98 routes and 1,284 current setup/initial/changed source snapshots. Neither count implies a public duplicate for every private fixture or a fresh rerun of the older interaction suite.

The owning page playgrounds and reference panels remain independent. Saved image URLs and timezone/persistence/request policies are host responsibilities; local mocks disclose their limits. The required dueAt string/Date contract is preserved using its existing unavailable-date fallback. No Storybook runtime or private diagnostic UI is restored. See [W10 reconciliation and bounded validation](final-acceptance/wave-04/02/public-example-parity/receipt.json) for source hashes, retained evidence and the fresh production build plus twelve passing focused Chromium flows. Initial runner working-directory failures remain recorded, and only their eleven affected cases were rerun. Broader production/AT/release gates remain separate.

### DOCS-012: consistent UI design token layers

The [token pipeline guide](theme-token-pipeline.md) records the implemented and
validated bounded baseline. Its completed checklist is archived; technical
decisions and evidence remain available.

Planning completion is not implementation completion. Checked migration leaves
have the source deliverables described in the retirement receipt; execution and
remaining reconciliation leaves close only with their named evidence. DOCS-012
is complete for the bounded token-pipeline baseline; its receipt records the limits.
Historical receipts below retain their original commands, hosts and results.

## Validation receipt — 2026-10-14

Working changes based on `ddb624fdad1289be71be62da06fe2908a2386a03`; no commit,
push, deployment or publication performed. Node 24.19.0, pnpm 10.29.3.

- Frozen workspace installation passed after resolving the new lockfile.
- Full `pnpm check` passed: 257 Vitest files / 1,640 tests, foundation/token/import
  guards, source/story typecheck, four release tests, ESM/declarations and packed
  output/public API checks. Log: `/tmp/sgui-workspace-node24-check.log`.
- Fresh transitional Storybook build passed with existing upstream warnings:
  `/tmp/sgui-workspace-storybook.log` (initial build used host Node 26.5.0).
- Production Next.js build and typechecking passed on Node 24; nine routes,
  including the not-found route, are prerendered. `/tmp/sgui-docs-build.log`.
- One production Chromium docs smoke passed, including visible-label checkbox
  activation, disabled state, host navigation, dark portal identity, docs primary
  color, save/focus restoration and 375px overflow. `/tmp/sgui-docs-browser.log`.
  The first run's native-input click was intercepted by its styled indicator;
  corrected the driver to use the visible label and retained checked/disabled
  assertions. No production checkbox change or forced click was used.
- Screenshot review caught host padding overrides from Box's default inline
  padding; docs now supplies owned padding props/native layout style. Final mobile
  screenshot: `/tmp/sgui-docs-dark-mobile.png`.
- Five AI scope guard tests and eleven license-inventory tests passed; workspace
  importer selection keeps the UI manifest distinct from docs dependencies.
- Five entry documents: 75 local links checked, zero document defects. License and
  third-party notice copies are byte-identical; `git diff --check` passed.

The existing 102-spec library browser matrix, packed Next/Vite runtime consumers,
Firefox/WebKit docs smoke and remote CI were not rerun. Local package/tarball checks
are not those browser consumers. Existing migration acceptance remains unchanged.
Frozen historical checkpoints require new workspace-aware plans; prior receipts
retain their original identity. The docs app's localhost preview is not a deployment.

## Example density and theme direction — 2026-10-14

Density is no longer a header control. The docs shell uses the default comfortable
scope. Button examples expose a local density prop and independently scoped compact
and comfortable Button/TextField comparisons. Theme appearance (light/dark/system)
is distinct from identity: docs identity currently overrides semantic tokens;
future example identities can supply their own light/dark token sets through scoped
style. Keep docs navigation stable while example identities vary. The existing
ColorTheme union remains appearance only; alternate identities are not additional
values of that prop. No alternate identity is implemented by this density change.

Density follow-up validation: docs typecheck and fresh production build passed on
Node 24.19.0. The existing Chromium smoke passed with added assertions for absence
of header density and presence of both local comparison scopes; existing callback,
disabled, themed portal, save/focus and overflow assertions remain. Logs:
`/tmp/sgui-docs-density-build.log`, `/tmp/sgui-docs-density-browser.log`. No library
source change or broader browser acceptance is claimed.

## Prop playgrounds and current-example source — 2026-10-14

Every component docs page must include an interactive prop playground, and every
example must pair preview and copyable source using `apps/docs/components/Example.tsx`.
The source generator includes real public imports, React state, stylesheet, Provider,
current theme tokens, and current props; user strings are JSX expressions with JSON
serialization. Button and Dialog pages implement this contract. Button variant/tone
rows, both density scopes, content states and native form each have their own source.
Keyboard-expandable code uses owned Disclosure and AppButton; copy errors leave
selectable code and a visible fallback message. Instructions are in root AGENTS.md.

The source smoke compiles all currently displayed snippets against built package
exports and exercises native clipboard copying after changing a consumer label.
A docs page is not complete until its playground and source panels exist. The per-component rollout below is completed by DOCS-011; historical receipts below
retain their original validation scope.

### Per-component playground rollout

Source-panel validation: Node 24 docs typecheck and fresh production build passed.
The existing Chromium smoke passed, compiling nine rendered source snippets against
the built package, checking quoted/brace/angle-bracket label serialization, changed
density-field content and light/dark source updates, and comparing native clipboard
bytes with the exact displayed code after the Copy code gesture. It retains prior
callback, disabled, themed dialog, focus and narrow-width assertions. Logs:
`/tmp/sgui-docs-source-build.log`, `/tmp/sgui-docs-source-browser.log`. Clipboard
read/write permissions are granted by the test context; the app requests no grants.
Firefox/WebKit and all-library example coverage remain pending.

## Website versus demonstration scopes — 2026-10-14

The docs shell is fixed to the Structured Growth identity/light mode. It no longer
has a header theme switch. ComponentExamples owns page-local identity and mode
settings; Example applies them only to a nested live-preview ThemeScope. Example
settings, prop controls, headings and source/copy panels remain in the website
scope. Density comparisons similarly scope the preview rather than their frame.
Portals inherit the preview theme through SGUI's owned scope bridge.

The initial isolation slice offered Structured Growth and SGUI Default, with
light/dark modes; the identities/system/contrast continuation below expands it. SGUI Default resets the inherited website overrides with CSS `revert-layer`
so the owned library token layer applies, including in portals. Snippets include
the exact selected tokens, mode and density. That slice did not implement system appearance or increased contrast; the
continuation below does. Its historical verification scope remains unchanged.

Isolation validation: Node 24 docs typecheck and fresh production build passed.
The single production Chromium smoke passed: Structured Growth/dark and SGUI
Default/dark previews have their respective actual computed button colors; website
header tokens, navigation and source-panel appearance remain light/Structured
Growth; dialog portals inherit both selected identities. Nine generated snippets
still typecheck; source settings, native clipboard bytes, host callbacks, focus
and narrow-width checks remain. An initial ambiguous header selector matched
the dialog header too; it now identifies the website header by its documentation
content. No assertions were removed. Logs: `/tmp/sgui-docs-isolation-build.log`,
`/tmp/sgui-docs-isolation-browser.log`. Library source and acceptance counts did
not change; Firefox/WebKit and high-contrast/system modes are not claimed.

## Identities, appearance, contrast and system preferences — 2026-10-14

  appearance/contrast, increased palettes and OS forced-color precedence.

Identities: Structured Growth (indigo), SGUI Default (owned palette), Editorial
(warm palette, serif typography and smaller corners). Appearance: system/light/dark.
Contrast: system/standard/increased. Both system options are the initial defaults.
Native matchMedia subscriptions respond to changes without reload and unsubscribe
on unmount; useSyncExternalStore retains a deterministic light/standard server and
hydration snapshot. Explicit appearance/contrast override their respective system
preferences, except that forced-colors always retains the user's system palette.

The higher-contrast palettes target at least 7:1 for named normal/muted text and
button-label pairs, and 3:1 for named border/focus pairs against preview surfaces.
Focus width increases to 3px. These bounded measurements do not certify whole-site
or all-component WCAG conformance. OS colors use Canvas/CanvasText, ButtonText and
Highlight/HighlightText, without disabling browser forced-color adjustment. In OS
forced-colors the browser may recolor the website shell too, as the user intends;
ordinary demo selections never change website identity.

Every copied example includes the selected identity's light/dark standard/increased
and system-color tokens, complete preference subscriptions and explicit override
logic. Examples use public package APIs and preserve identity/mode/density for
portals. The library's ColorTheme API remains light/dark/system; contrast/identity
are app-owned token profiles, not newly introduced upstream public types.

References: [enhanced contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html),
[prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast).

DOCS-009 validation on Node 24.19.0/pnpm 10.29.3: docs typecheck and fresh production
Next.js build pass. All three targeted tests pass in production Chromium: palette
ratios across three identities/two appearances, live system-preference changes and
manual overrides, forced-color emulation with native keyboard focus, Editorial
increased-contrast dialog portal text/action colors, and existing website isolation,
clipboard and nine generated-source compilation checks. Logs:
`/tmp/sgui-docs-modes-build.log`, `/tmp/sgui-docs-modes-browser.log`. Whitespace and
entry-link checks pass. No library runtime change, publication or broad migration
acceptance is claimed. Browser-emulated preferences are not physical OS/device
or spoken assistive-technology acceptance; Firefox/WebKit were not rerun.

## Shared Demo settings toolbar — 2026-10-14

DemoSettingsProvider lives in the root DocsShell, above route children. It owns
identity, appearance, contrast and native preference subscriptions. One website-
styled DemoSettingsToolbar appears below the main header. Component pages consume
shared settings without mounting their own provider or control panel. The existing
Example scope still limits settings to live previews and their portals, while
source generation reflects current shared choices. Density remains example-local.
Client-side navigation preserves all three selections, including via non-component
pages. A full reload/new tab starts with the system defaults; no storage/backend
persistence was added. Earlier page-local owner descriptions are historical slices
superseded by this section. No library runtime or migration acceptance changes.

DOCS-010 validation: Node 24 docs typecheck and fresh Next.js production build
passed. All three existing targeted checks passed, including one toolbar/no old
appearance heading, shared identity/appearance/contrast across client navigation
from Buttons through Theming to Dialogs, scoped preview/dialog colors, unchanged
website palette, native system/forced-color behavior, nine generated snippet
compilations and clipboard bytes. Narrow viewport overflow remains checked. Logs:
`/tmp/sgui-docs-toolbar-build.log`, `/tmp/sgui-docs-toolbar-browser.log`. Source
links/whitespace pass. No extra test matrix, backend storage, package runtime change
or migration acceptance is claimed.

## Complete public component catalog — DOCS-011, 2026-10-14

Delivered 90 component routes / 269 live examples. The export guard covers all
200 current public React component/icon names from root, components, experimental,
primitives, theme, adapters and translation entry points. Compound children and
aliases share the owning component page. Historical Typefaces maps to Typography;
CardPaginationFooter maps to its public AppPaginationFooter export;
AppDataGridRowDnd maps to DataGridDragHandle and the host-accepted grid reorder
composition. Noncomponent utility functions/constants are not promised separate
playgrounds; grid factory helpers and activity-icon mapping have composed examples.

Every route has a prop playground and at least two source panels. Per-family modules
contain independent interaction state, owned density scopes, realistic local data,
loading/empty/restricted action examples and public imports. The source scaffold
uses reserved SGUI appearance variable names to avoid collisions with host state.
Labels with quotes, angle brackets and braces remain valid JSX after editing.
No API, authentication, upload endpoint, publication or commercial licensing change.

Validation: Node 24.19.0 / pnpm 10.29.3 frozen installation, catalog generation and
export guard, TypeScript and fresh production Next build passed. All five production
Chromium checks passed: every route rendered without console/page errors; all 538
initial/changed snippets compiled; native clipboard bytes matched the displayed
source; inherited scopes, system changes/explicit overrides/forced colors and
portal focus retained prior assertions. Search, sidebar navigation and representative
375px grid/calendar/editor layouts passed. The learner server-mode example locally
responds to page requests with the matching dataset slice. Source and diagnostics
receipts: `/tmp/sgui-catalog-sources.json`, `/tmp/sgui-catalog-diagnostics.json`.

Working tree is based on `ddb624fdad1289be71be62da06fe2908a2386a03`; changes are
uncommitted. This closes the 84 DOCS-PLAY leaf tasks and DOCS-011 only. Remaining
legacy Storybook fixture transfer, full generated API reference, release archives
and library watch mode remain separately tracked. No F/T/V/A library acceptance
counts, previous evidence receipts or native/AT acceptance claims change.

Final tested docs-file manifest: 44 TS/TSX/MJS/CSS/JSON files, aggregate SHA-256
`34ee6c8c8640008af5ed06dafd126be037614eb5124739907af5ac4d0180bf19`.
Individual hashes: `/tmp/sgui-docs-catalog-tested-files.sha256`. Final browser log:
`/tmp/sgui-docs-catalog-browser.log` (5 checks, 23.0s). Documentation link audit:
3 affected guidance files / 124 local links, zero defects. `git diff --check` passed.

## Material and Apple demo identities — 2026-10-14

The user requested replacing the Structured Growth and SGUI Default demo choices.
The toolbar now offers Material Design (default), Apple Human Interface and the
existing Editorial alternative. Material uses purple tonal surfaces, rounded actions
and a Roboto/system fallback stack. Apple uses system typography, neutral surfaces,
blue accents and smaller rounded controls. These are SGUI token-based interpretations
of the design languages; their interaction implementations remain SGUI-owned.
References: [Material color roles](https://m3.material.io/styles/color/the-color-system)
and [Apple HIG](https://developer.apple.com/design/human-interface-guidelines).
No font downloads, component dependencies or library-default changes are introduced.
The fixed Structured Growth website scope is unchanged. All demo identities retain
light/dark/system appearance, standard/increased/system contrast and forced colors;
copied source embeds their matching palettes. Earlier named-identity receipts above
are historical. The theming page describes the current options.
Validation: fresh Next.js production build/type/export guards passed. All five
production Chromium checks passed (16.7s), including all 90 routes / 538 source
snapshots, Material and Apple shape/color assertions, removal of retired picker
options, Apple dialog portal/source/navigation inheritance, contrast/system/forced
colors and existing clipboard/mobile checks. Website brand assertions remain.

## Transition backlog planning receipt — 2026-10-14

PLAN-DOCS-001 is complete. Updated the docs checklist, master task list,
regression/hardening host guidance and AGENTS.md to target the website. Added
12 Storybook migration/removal leaves and six token-layer leaves; implementation
leaves remain open. Confirmed the current native inventory contains 102 spec files.
Documentation-only validation: five affected files, 497 local links, zero defects;
`git diff --check` passed. No runtime code, tests, CI gates or acceptance totals changed.

## Storybook retirement receipt — 2026-10-14

Storybook is structurally retired. Removed its configuration, dependencies, scripts,
CI build references, original story files and unused source-only helpers. All **425**
scenario identities remain in the private docs fixture registry, including all **164**
IDs referenced by the **102** original native specs. Nineteen source-context unit
fixtures preserve React context identity; the package excludes those files from its
distribution. No Storybook imports, dependencies, `/iframe.html` routes or old build
commands remain in active source, package metadata, lockfile or CI. Legal notices and
historical acceptance receipts remain intact.

The existing tests were migrated and reconciled before new public-site tests ran.
The first full three-engine run executed 1,521 cases: **1,505 passed, 14 failed and
two existing skips**. The failures exposed timing assumptions and actual focus/popup
issues; their assertions and diagnostic checks were retained. Bounded follow-ups
resolved every reported failure:

- Popup collision, portal direction and responsive modal checks: **123/123** across
  Chromium, Firefox and WebKit. Owned popup updates coalesce into animation frames
  and avoid writes when the anchor geometry is unchanged.
- Grid shell focus/reflow: **12/12** across all engines. Focus entering its local
  viewport is revealed without taking outside focus or moving sibling regions.
- Select sizing and editor chrome: **27/27** across all engines, including the
  WebKit observer-cycle failure. A private owned sizing adapter schedules updates
  outside native observer delivery while retaining React Aria positioning. The new
  sizing case covers collision, text growth, resize, ancestor scroll, RTL and reopen.
- Shell/navigation/toolbar and controlled calendar reset: **102/102**, all engines,
  each existing case repeated twice. AppShell remains server eligible; its private
  client main-region leaf reveals clipped controls. Accepted reset repairs only
  stranded body focus after closing, preserving host/outside focus.
- Token-scope checks: **15/15**. WebKit emulates the forced-colors preference but
  lacks `forced-color-adjust`; its unsupported CSS capability is recorded separately.
  Native focus, readable disabled text, opacity and visible boundaries still run.

These are a full initial run plus bounded corrections on later source, **not a claim
of a single all-green final 1,521-case run**. Full production/main CI remains required.
Logs/results: `/tmp/sgui-retirement-native-matrix.log`,
`/tmp/sgui-popover-native-results.json`, `/tmp/sgui-grid-focus-gates/results.json`,
`/tmp/sgui-select-results-actual.json`, `/tmp/sgui-shell-reset-final-results.json` and
`/tmp/sgui-root-token-results.json`. Original failures are retained in the initial
native report rather than overwritten by the passing corrections.

The full library check passed **257 files / 1,640 unit tests**, plus release,
type/import/token/style, build and public package checks. Subsequent source fixes
passed their affected unit sets (29 Select/popup cases, 32 grid cases, 16 shell/reset
cases, 12 owned Popover cases and the retained insertion-host case) and final
foundation guards. Runner/checkpoint policy checks passed 59 cases with two explicit
server-test gates skipped; the new canonical-root/escaping-symlink server regression
was separately executed and passed. Fresh frozen installation, library/native-host
builds and production Next.js build passed. Final packed **React 18.3.1 and 19.2.3**
consumer checks passed public API/subpath, SSR and hydration-fixture builds; React 19
also passed Flight with the exact private main-region client reference.

After the existing failures were resolved, all **eight public docs checks passed**,
including three new tests for async selection/loading/failure/retry source and copied
bytes, date/time/density/segment source and copied bytes, and production fixture
isolation. All 90 routes and 269 examples rendered; **538 initial/changed source
snapshots** compiled. Public `/fixtures/` endpoints return 404, and public Next.js
manifests/bundles omit the native host. Evidence:
`/tmp/sgui-retirement-public-docs.log`, `/tmp/sgui-retirement-final-next-build.log`,
`/tmp/sgui-retirement-final-consumer18.log`,
`/tmp/sgui-retirement-final-consumer19.log` and
`/tmp/sgui-retirement-final-foundation-guard.log`.

The private host is 284 files / 2,706,636 bytes; JS/CSS is 2,487,191 bytes and
763,219 bytes independently gzip-compressed. This is test-host cost, not public
website or library payload. Existing native performance thresholds and exact download
bytes are unchanged; no host-specific baseline was relaxed. Measurements:
`/tmp/sgui-retirement-native-payload.json`.

Working tree remains based on `ddb624fdad1289be71be62da06fe2908a2386a03`, uncommitted.
Final runtime-input manifest: 1,094 files, aggregate SHA-256
`5cea146a495fd00be1ca2517653020b045c961ddeccd752345596e713425e93c`,
individual hashes in `/tmp/sgui-retirement-final-source.json`. Node 24.19.0 and
pnpm 10.29.3. The local production preview was restarted on port 3000. No publish,
deployment, licensing change or F/T/V/A acceptance-count change occurred.
DOCS-005-b01–b12 remain public-example enhancements with preserved native evidence;
they are not missing fixture transfers or a remaining Storybook dependency. DOCS-005-l
retains complete production-gate execution before main acceptance; this development
receipt does not close that broader gate.

Final guidance validation: 14 affected entry/architecture documents, 1,003 local
links, zero broken targets; `git diff --check` passed. The scenario ledger links
this receipt separately from its preserved historical evidence.

## Menu corner alignment — 2026-10-14

The shared Menu highlight now derives its radius from the popup radius minus its
border and inner padding, rather than the unrelated field radius. Its scrolling
menu surface also follows the popup's inner curve. This keeps focused/selected
backgrounds inside rounded corners without hiding the popup's overflow or removing
the inset keyboard focus outline. Small-radius identities clamp safely to zero.

Validation: 14 existing Menu unit cases and foundation/style guards passed; fresh
library and production docs builds passed. A focused production browser probe
passed all 36 combinations of Material/Apple/Editorial, light/dark, compact/
comfortable and Chromium/Firefox/WebKit. It measured nested corner geometry and
retained first/last-item keyboard focus, Escape dismissal and trigger restoration.
Theme/density changes were awaited through committed scopes and rendered frames
before opening the menu. The rounded Material menu screenshot was visually checked.
Evidence: `/tmp/sgui-menu-radius-unit.log`, `/tmp/sgui-menu-radius-guard.log`,
`/tmp/sgui-menu-radius-build.log`, `/tmp/sgui-menu-radius-browser-results.json` and
`/tmp/sgui-menu-rounded-highlight.png`. Production preview restarted on port 3000.
No broader acceptance gate was closed by this visual correction.

## Component usage guidance — 2026-10-14

DOCS-013 is complete. All 90 component pages now show a fixed-website-scope usage
panel before their examples: a specific "When to use" description, practical "How
to use" instructions and related-component links. Four content-family JSON files
provide 306 instructions grounded in the shipped public props, contracts and host
responsibilities. Aliases and compound exports share their owning page's guidance.
Dialog and AppModal explain their shared modal behavior and differing composition
levels; Popover, Menu, Tooltip and editor dialogs explain their distinct tasks.

The panel uses public SGUI Surface, List, typography and links. `catalog:check`
requires guidance for each route, rejects stale/duplicate entries and validates
related links. AGENTS.md requires guidance to stay current with component contracts.
Playwright's existing catalog check now verifies the usage headings and instruction
list on every route. Playground and server-example selectors use their named regions
so the inserted documentation panel does not displace interaction coverage.

Validation: catalog/type checks and the production Next.js build passed. All eight
public docs browser checks passed in 19.7 seconds, including every route, 269
examples and 538 initial/changed compilable source snapshots. Existing appearance,
clipboard, async/date flows and production fixture isolation remain checked.
Dialog-to-AppModal related navigation and 375px mobile layout also passed; desktop
and mobile usage panels were visually inspected. No library implementation or
public API changed; unrelated library unit/native suites were not rerun.
Logs: `/tmp/sgui-component-usage-types.log`, `/tmp/sgui-component-usage-build.log`,
`/tmp/sgui-component-usage-browser.log`, `/tmp/sgui-component-usage-visual.log`.
Screenshots: `/tmp/sgui-dialog-usage-desktop.png` and
`/tmp/sgui-dialog-usage-mobile.png`. Local preview restarted on port 3000.

## Independent example matrices — 2026-10-14

DOCS-014 is complete. Playground configuration is local to its own preview;
reference panels use fixed configurations and their own host state. Reference
instances reuse the same implementation where useful, without inheriting the
playground's props or freezing rendered children/callbacks. Global demo identity,
appearance and contrast remain intentionally shared across the page.

ButtonGroup now has 12 named examples: its playground, eight horizontal/vertical
× compact/comfortable × joined/separate references, filled and text action groups,
and long-content/disabled/pending actions. Each fixed group owns its action result
and matching source; natural-width layout shows the group shape clearly.
Tabs, Stack and Navigation add supported layout/density/activation/direction
combinations. RadioGroup and ToggleButtonGroup show both orientations and densities
at once with independent selection. Editor/catalog pages add fixed activation,
hierarchy, navigation, viewport, read-only and host-flow configurations without
inventing unsupported props. Data examples isolate reference state and add fixed
table/card density and loading/empty/error cases. AppButton's variant matrices now
compare both tones at both densities and own their counters separately from its
playground. The dedicated AppModal examples retain their existing independent state.

The catalog grows from 269 to **360 examples** across the same 90 routes / 200
public export names. AGENTS.md requires fixed reference configurations, local
playground controls and meaningful supported combinations for future documentation.
Existing all-route browser coverage now asserts that editing playground controls
leaves every reference source unchanged. A new ButtonGroup test verifies all eight
matrix configurations and physical horizontal/vertical geometry, changes playground
orientation/density/label independently, activates one reference without changing
its siblings, and copies the source for that reference's current action state.

Validation: catalog/type guards and production Next.js builds passed. Final public
browser suite: **9/9 passed in 23.0 seconds**, all 90 routes / 360 examples and **720
initial/changed compilable source snapshots**. Mobile coverage includes ButtonGroup,
Tabs, RadioGroup and ToggleButtonGroup alongside existing large compositions.
Existing theme/contrast, clipboard, async/date and private-fixture isolation checks
remain intact. Horizontal compact and vertical comfortable fixed groups were
visually inspected; the initial review exposed unintended parent stretching, which
was corrected with owned Stack alignment and checked again in the final build.
No library implementation or public API changed. Production preview restarted on
port 3000; no broader library acceptance gate closed.

Evidence: `/tmp/sgui-example-matrices-types.log`,
`/tmp/sgui-example-matrices-build.log`, `/tmp/sgui-example-matrices-browser-final.log`,
`/tmp/sgui-group-horizontal-compact.png` and `/tmp/sgui-group-vertical-comfortable.png`.
Public-example parity follow-ups under DOCS-005-b retain their separate criteria;
additional variants alone do not establish every historical composed workflow.

## Component-only source receipt — 2026-10-14

DOCS-015 follows the user's revised source-panel requirement and supersedes earlier
receipts requiring repeated palette/system-preference setup in copied component
examples. `examples/source.ts` now emits public component imports, required React
state and component JSX. It omits the demo palettes, appearance/contrast resolution,
media subscriptions, stylesheet import and automatic theme Provider. Imports for
explicit density scopes or documented Provider/override examples remain only when
used by the example itself. Applications load styles and provide their theme once,
as explained in installation/theming guidance. Live demo themes and portals still
use the existing theme pipeline; ordinary theme selections leave component snippets
unchanged. Prop changes and interaction state still update source and clipboard.

Updated AGENTS.md, source callers and the theming page to preserve this boundary.
The catalog browser check explicitly rejects demo theme boilerplate from every
component snippet; the existing production smoke verifies source stays identical
while identity/appearance changes and verifies the actual preview still changes.

Validation: docs typecheck and production build pass; `pnpm --filter
@structured-growth/docs exec playwright test` passes 10/10 (26.5s), including all
90 routes, 360 component examples and 720 initial/changed compilable source
snapshots, plus three explicit theme-override snapshots. Log:
`/tmp/sgui-component-source-tests.log`. Preview restored at port 3000. Library
runtime, licensing and broader acceptance counts are unchanged.

## Component composition receipt — 2026-10-14

DOCS-016 adds a Contains section to all 90 component pages alongside when/how
usage. Lists show the next documented UI component boundary, without recursively
flattening its descendants. Each child links to its documentation; compound
components with different compositions have separate named sections and same-page
anchors. Alias groups with identical children share a list. Leaf components and
application-supplied content are described explicitly; configuration factories are
not presented as rendered components.

`component-composition.mjs` resolves owned public symbols and private renderer
helpers from working library source at catalog generation/check time. The website
imports only generated metadata, not library source. Public component boundaries
stop traversal. Native elements, upstream interaction internals and host slots do
not become documented children. An explicit mapping preserves the public
AppDataGrid boundary for the shell's private ComposedAppDataGrid entry. Noncomponent
factories/hooks are not component boundaries. Updating library composition requires
regeneration; catalog checks reject stale metadata. AGENTS.md records this policy.

AppDataGridShell contains AppDataGrid, AppPaginationFooter, Button, DataToolbar,
Progress and Status. The shell does not list the grid's Checkbox or the footer's
Pagination as direct children. The grid and footer list those on their own pages.
AppShell's navigation/main content remain application-provided, rather than being
misrepresented as fixed SideNavigation or other arbitrary component children.

Validation: docs typecheck and final production build pass. The production docs
browser suite passes 11/11 (30.3s), checking Contains coverage/links across all
90 pages, preserved 360 examples/720 source snapshots, the shell → grid → footer →
pagination navigation, exclusion of grandchildren, host-content separation, distinct
List/ListItemText children and same-page CircularProgress → Progress navigation.
Log: `/tmp/sgui-composition-tests.log`. Visually inspected the grid shell's Contains
section; preview restored at port 3000. Library APIs, runtime, licensing and broader
F/T/V/A acceptance counts are unchanged.

## Grouped navigation receipt — 2026-10-14

DOCS-017 replaces the flat All components list with ten expandable categories:
Buttons & actions, Form components, Text & content, Data grids & tables, Cards &
collections, Dialogs & overlays, Navigation & layout, Rich text editors, Feedback &
progress, and Themes & integration. Child links are visually indented. Existing
primary documentation links remain available. Every catalog page belongs to one
category, enforced by the catalog guard using `component-navigation.json`.

The current route's category opens automatically and its link retains aria-current.
Users can expand/collapse groups with the owned Disclosure control; other groups
retain their state during client navigation. Search stays visible and filters across
category names, component titles and public aliases, revealing matching groups and
showing an empty-results message when needed. Clearing search restores group state.
The fixed website theme and demo settings remain separate. AGENTS.md records the
navigation coverage and interaction requirements.

Validation: docs typecheck and production build pass; the docs browser suite passes
12/12 (29.6s). Evidence includes all 90 catalog routes/720 source snapshots, keyboard
expansion, cross-group alias search, active-page selection after navigation, empty
search results, and narrow-screen navigation without horizontal overflow. Existing
catalog navigation smoke was updated for persistent grouped search. Log:
`/tmp/sgui-grouped-nav-tests.log`. Visually inspected the grouped sidebar on
AppDataGridShell; local preview restored at port 3000. No library APIs, licensing,
release or broader acceptance counts changed.

## Stable overlay layout receipt — 2026-10-14

DOCS-018 prevents content width changes when menus, selects and dialogs lock
page scrolling. The document reserves a stable scrollbar gutter. WebKit's classic
custom-scrollbar case still dropped that gutter under overflow:hidden, so a
docs-only layout hook measures the unlocked document width and constrains the
body to the same available width. It preserves the measured gutter while locked,
updates on resize/restoration, and cleans up its observers/style on unmount.
Observer updates run in an animation frame and write only changed values. Native
scroll locking, overlay placement, focus restoration and library scopes remain.
There is no global host-style change in the UI package or copied component code.

Validation: final production build and docs TypeScript checks pass. The full docs
browser suite passes 14/14 (33.6s), including 90 catalog routes and 720 source
snapshots. Bounded scrollbar cases pass at 1280px and 375px in Chromium, Firefox
and WebKit, measuring the header, sidebar, main content and every preview before,
during and after menu/select/dialog opening. They verify Escape focus restoration,
viewport growth and restoration, and no horizontal document overflow. The native
fixture initializes custom scrollbar mode before sampling (WebKit requires an
initial overflow transition); equality assertions remain exact. Initial CSS-only
WebKit failures were resolved by the layout constraint, not weaker assertions.
The six-engine/width cases passed initially; after adding resize coverage,
Chromium's two cases passed in the 14-test suite and Firefox/WebKit's four cases
passed again (7.2s). Logs: `/tmp/sgui-scrollbar-docs-tests.log` and
`/tmp/sgui-scrollbar-resize-tests.log`. The separate
`playwright.scrollbars.config.ts` bounds the three-browser run to this spec.
Preview restored at port 3000. Library APIs, releases, licensing and broad native/
physical-device/assistive-technology acceptance counts are unchanged.

## Independent example state receipt — 2026-10-14

DOCS-019 closes the reported Owned Button reference-state leak. Earlier separation
of the playground from reference examples did not fully separate every reference
block. A composed Save draft action and the density comparison still shared the
same action state. Each panel now mounts its own state-owning component. The
composed button example displays its own status and source; pressing Save draft
leaves the comparison and playground unchanged.

Audited every example family. Split multi-panel owners in presentation components,
data/catalog components and the AppButton page, including individually mounted
compact/comfortable AppButton examples. Forms, date and editor scenarios already
mount separate single-panel owners; their structure was retained. All 124 example
templates now have one Example block per named component owner; they instantiate
the existing 360 catalog examples. Visual demo settings remain intentionally shared.
Local controls, action/selection/open state, drafts, queries, pagination, errors and
source snapshots remain confined to their own example instance. Contents within
one comparison block may share that block's state; separate blocks do not.

The catalog guard rejects multiple Example blocks under one owner and inline mapped
panels capturing page state. It covers ordinary and self-closing JSX. Three guard
cases verify independent owners pass, multiple blocks fail, and inline mapped
examples fail. `examples:check` runs these guard cases from catalog:check and hence
build/typecheck. AGENTS.md now explicitly requires independently mounted state
owners and sibling preview/source preservation.

Validation: docs typecheck and production build pass; the isolation guard passes
124 templates, with 3/3 guard tests. The Save draft regression and full-catalog
interaction sweep pass 2/2 (24.9s). Across all 90 routes, 260 panel interactions
preserved every sibling source; 136 updated the current source locally. The sweep
covers editable fields, checkboxes, enabled actions and overlay opening/dismissal;
static/read-only panels are covered by ownership/catalog checks. Existing docs
checks pass 14/14 separately (33.0s), including all 360 examples and 720
initial/changed compilable source snapshots. Logs:
`/tmp/sgui-independent-isolation-tests.log` and
`/tmp/sgui-independent-docs-tests.log`. Preview restored at port 3000. Library APIs,
licensing, releases and broader acceptance counts are unchanged.

## Development branch integration — 2026-10-14

All workspace changes were committed for development integration. GitHub's existing
branch is `codex/dev` (no `dev` branch existed). Preserved its additional retained-
snapshot fresh-proof commits rather than replacing their history. Resolved the
validation-pool/checkpoint conflicts by retaining fresh-proof evidence/admission
rules together with library-relative paths and the docs static server. Updated the
new immutable-build fixture from iframe.html to the existing docs index.html.
Local pnpm cache is ignored. Staged whitespace checks pass.

Affected validation scripts: `pnpm --filter @structured-growth/sg-ui exec node
--test scripts/browser-validation-pool.test.mjs scripts/run-development-checkpoint.test.mjs`
passes: 63 passing cases, 2 existing skips, 0 failures (18.3s). Log:
`/tmp/sgui-dev-integration-tests-passed.log`. This integration adds no new UI behavior
beyond the preceding documented implementation; production acceptance remains
separate from this development-branch push.

## Sliding component navigation — DOCS-020, 2026-10-14

DOCS-020 supersedes DOCS-017's inline disclosure interaction. The root sidebar
shows Components, the ten purpose-based categories and the general documentation
links. Choosing a category replaces the navigation list with that category's
component pages and a Back to Components button. Forward and Back use opposite
short horizontal entry transitions, with reduced-motion support. Back returns
keyboard focus to the category that opened the level. Search and the development
notice stay outside the changing level; shell dimensions remain unchanged.

The current route derives its category on direct load, client navigation and
browser history navigation. Each component page still belongs to exactly one
category in `component-navigation.json`. Root Back navigation remains available
without changing the content route. The previous Buttons/Dialogs shortcuts no
longer duplicate category navigation.

Search retains its accessible name without a visible field title. Typing opens a
bounded dropdown of actual pages matched by title or public export alias across
all categories. Results show their category for context and navigate directly;
selection clears search and reveals the destination category with its Back button.
Arrow keys enter/traverse results, Escape dismisses them and returns focus to the
field, and leaving the search region dismisses the dropdown. Empty results are
announced. Search results use page titles as accessible link names.

This is a docs-owned composition of public SGUI Button, TextField, Link, typography
and icons. It does not ship a new library panel API or close the reusable panel
extraction tasks in the [drilldown scope](hierarchical-menu-scope.md).

Validation: production docs build (including TypeScript), theme checks, catalog
coverage and example isolation guards pass. The focused Chromium suite passes
6/6: both catalog checks (90 routes, 360 examples and 720 initial/changed source
snapshots), category/Back navigation, search and history navigation, and stable
overlay geometry at 1280px and 375px. Sidebar root/child/search screenshots were
inspected; the transition viewport reserves space for button focus outlines.
This is bounded website validation, not new library or manual-device acceptance.

## Mixed SideNavigation playground — DOCS-021, 2026-10-14

DOCS-021 replaces the SideNavigation playground's whole-menu expand/drilldown
selector with one mixed model. Course tools expands inline; its Course settings
child drills down to a level containing expandable Notifications and another
Advanced settings drilldown. Organization provides a sibling drilldown with a
native People destination and expandable Teams. Overview is a direct link; the
footer combines expanding Resources with a Contact support action. Account choices
retain their existing host-adapter availability rules.

The playground keeps content and density controls. Two independent mixed-menu
references show compact and comfortable density, replacing the four single-mode
references. Each panel owns its selected action and demo route. A local
SGNavigationProvider demonstrates route changes without leaving the docs page;
copyable source includes that adapter, model and host state. Usage guidance now
explains that childBehavior belongs to each branch, rather than the whole menu.

Validation: production docs build, TypeScript, theme/catalog/isolation checks pass.
The two catalog browser checks pass across 90 routes, 358 examples and 716
initial/changed source snapshots. The focused mixed-menu browser check passes:
inline expansion, nested drilldown and Back, local links/actions, independent
reference state/source, source compilation and exact clipboard content. Inspected
the playground preview screenshot. This changes docs examples only, with no
library API changes or new broad migration acceptance claim.

## Flush SideNavigation frame — DOCS-022, 2026-10-14

SideNavigation's playground and density references now remove the shared preview's
outer padding and use a zero-padding host sized to its navigation content. The
menu starts against the preview's inner top/left border. The library moves inline
spacing from the scrolling container to each content section, allowing the footer
separator to reach both menu edges while retaining item/heading spacing. Header
separators already span the surface. Copied examples match the new host sizing.

Validation: library build/typecheck and foundation guards pass; all 54 existing
SideNavigation tests pass. Production docs build and three focused browser checks
pass, including 90 catalog routes/716 source snapshots. Geometry assertions verify
flush placement and full-width header/footer separators in the playground and
both density references. Mixed navigation, isolated state, source compilation and
clipboard checks remain passing. Inspected the updated preview screenshot.

## Remove redundant example readouts — DOCS-023, 2026-10-14

Removed auxiliary selected/current/committed-value summaries, press counters,
generic last-action messages and raw state dumps from the button, primitive,
form/date, editor/navigation and data examples. SideNavigation now renders the
menu without a selected-ID or simulated-route footer. Formatting, color and
indent examples rely on their actual controls/content rather than boolean/value
readouts. Copied source removes the same markup and retains working host callbacks.

Loading, failures/retry, real form/dialog result feedback, account identity,
translation demonstrations and clipboard announcements remain where they explain
the primary flow. Built-in selection indicators and bulk row selection counts
remain component UI. Agent guidance now discourages decorative debug readouts.

Validation: production docs build, TypeScript, theme/catalog/isolation checks pass.
The full browser run passed 15 checks; three failures were corrected in test
navigation assumptions and the new debug guard's account-identity classification.
Targeted reruns passed all five checks in those three files. All 18 distinct
browser checks are passing across those runs, including 90 routes, 358 examples,
716 source snapshots, 258 isolated panel interactions, selected/checked native
state, callbacks captured in current source and clipboard equality. Existing
assertions now verify component/source state instead of removed debug text.
Inspected the clean SideNavigation preview. No library behavior/API changes in
this slice; broader migration acceptance remains separate.

## Component-page demo settings — DOCS-024, 2026-10-14

The shared Demo settings toolbar now renders inside DocPage, below the component
introduction and above usage/example sections. It occupies only the main content
column. Removed the shell-level toolbar below the global header; it no longer
extends over the sidebar. A catalog-route guard limits it to the 90 actual
component pages, excluding the home page, component index, installation, theming,
release history, licensing and missing component routes.

DemoSettingsProvider remains layout-owned, preserving identity, appearance and
contrast across client navigation, including visits to general documentation.
Theming's token explorer still consumes that shared context; its guidance links
to component pages for changing settings. No per-example selectors were added.
Updated agent guidance and appearance/theme-pipeline tests for this ownership.

Validation: production docs build, TypeScript and theme/catalog/isolation guards
pass. Nine focused browser checks pass, including all 90 routes/716 source
snapshots, absence on six general routes, main-column placement below the heading
at desktop/mobile widths, persistence through theming and component navigation,
overlay geometry and scoped theme portals. Inspected the component-page toolbar
screenshot. No library API or release changes.

## Top-level general pages — DOCS-025, 2026-10-14

General site pages now live at `/installation`, `/theming`, `/releases` and
`/licensing`. Component catalog/index/detail URLs retain `/docs/components`.
Moved the four App Router pages, corrected their relative imports, and updated
navigation, homepage links, browser scenarios and the token-pipeline guide.
Permanent 308 redirects from the old `/docs/<page>` URLs preserve query strings
and bookmarked access. Licensing content and terms remain unchanged.

Validation: production docs build, TypeScript and theme/catalog/isolation guards
pass. Eight focused browser checks pass, including legacy redirects/query strings,
root navigation/current-page state, installation's homepage entry point, shared
demo-setting persistence and absence on general pages, theme portals and all
90 component routes/716 source snapshots. No component URLs or library APIs changed.

## Sidebar ordering — DOCS-026, 2026-10-14

The sidebar now orders Overview, a full-width horizontal divider, component
search, the component menu/index and categories, a second full-width divider,
Installation, Theming, Release history and Licenses. Licenses retains `/licensing`
and its commercial-license page content. Overview and the general-page links sit
outside the sliding component panel, so they remain available within a category.
Search and Back behavior, category grouping and canonical routes are preserved.

Validation: production docs build, TypeScript and theme/catalog/isolation guards
pass. Eight focused browser checks pass, covering exact sidebar control order,
both dividers' edge alignment, general-link access from a child level, keyboard
Back focus, direct search, redirects and stable overlay geometry at desktop/mobile
widths. Catalog validation covers all 90 routes/716 source snapshots. Inspected
the reordered sidebar screenshot. No library API or licensing-term changes.

## Independent scrolling panes — DOCS-027, 2026-10-14

The docs shell now uses a bounded viewport grid with the header/footer outside
its scrolling layout. Sidebar and main content have separate overflow regions
and contained wheel behavior; the document itself stays still. Narrow layouts
stack a height-limited navigation pane above a separately scrolling main pane.
The sidebar is keyboard-focusable; route changes reset main scrolling without
resetting navigation scrolling. Existing document gutter/width compensation and
native overlay locks remain in place. Search results are constrained for the
shorter narrow-screen navigation pane.

AppShell already provides independent main scrolling and SideNavigation owns
its menu scroller. Its navigation wrapper now also handles overflowing arbitrary
host navigation. No new mode prop is needed for the default behavior. A new
source-backed AppShell reference shows 30 courses and 24 lesson paragraphs in a
bounded host, with independent local selection state. Usage/shell guidance
explains viewport defaults and native style height/blockSize for embedded hosts.

Validation: library build/typecheck, foundation guards and all 10 existing
AppShell tests pass. Production docs build and theme/catalog/isolation guards
pass. The 24-check browser suite passes, including real wheel scrolling of each
docs pane at 1280px/375px, separate AppShell menu/main positions, route reset,
90 routes/718 source snapshots, 259 isolated panel interactions, overlays,
responsive geometry and theme portals. Inspected the scrolled AppShell reference.
This is bounded automated evidence, not broad manual-device acceptance.

## Square Structured Growth sidebar — DOCS-028, 2026-10-14

The fixed Structured Growth docs sidebar explicitly uses zero border radius,
overriding its generic Surface rounding. This targets the website navigation
container; demo identities continue to own their preview styling. Production docs
build and all three existing sidebar browser checks pass. Inspected the refreshed
sidebar screenshot; no new tests or library API changes were needed.

## Structured Growth navy/gold/cream identity — DOCS-029, 2026-10-14

Replaced the fixed website's indigo/white palette with colors observed in the
Structured Growth logo/site, complemented by Notre Dame academic palette guidance
and Anthropic-inspired cream surfaces. The
[website color guide](structured-growth-style-guide.md) distinguishes measured
source values from SGUI adaptations and describes accessible usage. Navy carries
text/actions, gold is a restrained header/selection accent, and cream/warm cream
separate the main canvas from navigation and subdued panels. Bright gold is not
used as small text or the sole focus indicator. Dark, increased-contrast and
forced-color maps remain complete; other demo identities retain their palettes.

Validation: production docs build, TypeScript and all seven theme graph/contrast
checks pass, including selected/hover/pressed pairs. Ten focused browser checks
pass, covering 90 component routes/718 source snapshots, fixed-shell isolation,
portal themes, responsive layout, sidebar navigation and system/forced colors.
Inspected the refreshed component-page screenshot. No library-default palette,
public API, logo asset, licensing or release changes.

## Theming framework guide — DOCS-030, 2026-10-14

Rewrote `/theming` around the system's structure rather than descriptions of
external design systems. The page starts with a dependency overview, then explains
global theme decisions, semantic roles, raw palettes, palette-to-semantic mapping,
application scopes and overrides. Component aliases bridge semantics to styles;
examples explain coordinated foreground/state pairs and the reach of palette,
semantic and component-token changes. Provider/ThemeScope, inherited variables,
portals, host ownership, increased contrast and forced colors are grounded in the
shipped contracts. Removed the external design-system tours/reference links.

The existing live token inspector and source-backed override example remain.
Inspector wording now describes the dependency chain, and its palette disclosure
shows the active palette rather than listing every demo identity. The button link
now describes inspecting themed controls. No palette or component behavior changed.

Validation: production docs build, TypeScript and theme/catalog/isolation guards
pass. Five focused browser checks pass, including the six-section hierarchy,
absence of the prior design-system narrative, public routes, page-local settings,
semantic/component overrides, copied source and scoped theme portals across modes.
Inspected the rewritten page screenshot.

## Viewport shell overflow containment — DOCS-031, 2026-10-14

Fixed the extra document scrollbar around the independently scrolling docs panes.
The shell already fit the viewport, but an absolutely positioned, visually hidden
checkbox helper used the body as its containing block and extended the document's
scroll area. Positioned the shell and its sidebar/main scroll containers so those
helpers remain contained by the intended panes. Native overlay scroll locking and
the stable document gutter remain intact.

Validation: production docs build, TypeScript and theme/catalog/isolation guards
pass. Eight focused browser checks pass: independent docs/AppShell scrolling,
viewport containment before and after focusing a below-fold checkbox at desktop
and narrow widths, stable overlay geometry, and themed portals. The live dev page's
document height now matches its 720px viewport (previously 3716px), while main
content retains its own scroll area. Inspected desktop and narrow screenshots.

## Website footer moved into navigation — DOCS-032, 2026-10-14

Removed the Structured Growth website's shell footer and its grid row. The sidebar
now ends with the development notice, View on GitHub link and commercial-license
notice, using available space before that group when the navigation is short.
Long navigation keeps the group reachable in the sidebar's independent scroll area.
The reusable AppShell's optional footer contract remains available.

Validation: production docs build and its TypeScript/theme/catalog/isolation guards
pass. Seven focused browser checks pass across desktop and narrow widths, including
sidebar information placement, absent shell footer, viewport containment,
independent scrolling and native overlay scroll-lock geometry. Inspected the updated
desktop screenshot; `git diff --check` passes.

## Narrower sidebar and contextual scrollbar — DOCS-033, 2026-10-14

Reduced the website's desktop sidebar from 16rem to 15rem. Its native scrollbar
uses thin width and a stable gutter; on hover-capable fine-pointer devices the
thumb is transparent while idle and revealed by sidebar hover or focus within.
Scrolling remains enabled throughout. Coarse/touch devices retain native visible
scrollbar styling, and forced colors restore automatic system colors. The change
is CSS-only and uses the fixed website's existing border token.

Validation: production docs build and its TypeScript/theme/catalog/isolation guards
pass. All 11 focused browser cases pass across independent scrolling, viewport
containment, category navigation/search, full-width dividers and overlay geometry.
The new case checks 240px sidebar width, idle/hover/focus colors, unchanged link
geometry and forced-color restoration. Updated the navigation-order expectation
to include the GitHub link moved in DOCS-032 after its initial failure exposed that
stale assertion. Inspected the narrower sidebar screenshot.

## Structured Growth background hover feedback — DOCS-034, 2026-10-14

The fixed website's links now use its existing surface-hover token for background
feedback without underlines. Current-page navigation retains its selected
background and gold marker without the underline. Existing buttons retain their
background hover treatment. Keyboard focus outlines remain intact, and the
website selectors exclude live preview links so example identities and explicit
Link underline props continue to demonstrate their shipped behavior.

Validation: production docs build and TypeScript/theme/catalog/isolation guards
pass. All four focused navigation browser checks pass, including hover backgrounds,
absent navigation underlines, keyboard focus and retained demo-link underlines.
Inspected the hover screenshot.

## Wider website sidebar — DOCS-035, 2026-10-14

Increased the website's desktop navigation column from 15rem to 17rem (240px to
272px at the default root size). The shell's CSS grid owns the allocation; narrow
screens retain the existing single-column layout. No new component prop is needed
for this application-specific sizing. The reusable SideNavigation retains its
17.5rem default, collapsed sizing and native className/style customization.

Validation: production docs build and its TypeScript/theme/catalog/isolation guards
pass. All 10 focused navigation/scroll browser checks pass, including the updated
272px width assertion, hover/focus geometry, responsive containment and independent
scrolling. Inspected the wider desktop sidebar screenshot.

## Content-sized Select and ComboBox popups — DOCS-036, 2026-10-14

Fixed the shared Select/ComboBox popup style that constrained option lists to the
trigger width. Popups now use max-content width, with the trigger as a minimum
when space permits and a viewport-minus-2rem maximum. Border-box sizing includes
popup borders in that bound. Long labels can wrap at the viewport limit rather
than forcing every label into the width of a short selected value such as `h1`.
Updated Select/ComboBox usage guidance; public props and callbacks are unchanged.

Validation: library and production docs builds pass, including docs
TypeScript/theme/catalog/isolation guards. All 12 existing Select, positioning and
ComboBox unit tests pass. Four focused browser checks pass: typography dropdown
labels stay on one line with `h1` selected at desktop/narrow widths, popup bounds
fit the viewport, selection and focus restoration work, and overlay layout remains
stable. Inspected the reproduced dropdown screenshot after the fix.

## Typography text tones and terminology — DOCS-037, 2026-10-14

Added `accent` and `subtle` Typography tones while retaining `primary` as an exact
compatibility alias for accent. Muted remains supporting text; subtle is intended
for supplementary metadata. Added palette-backed `textSubtle` semantics and the
`typographySubtleText` component alias through the owned token generator. All
website identities include standard, increased and forced-color mappings; the
semantic inventory is now 42 roles. Subtle meets 4.5:1 on named standard text
surfaces and converges with muted for 7:1 increased contrast and OS colors.

Updated the prop playground, added an independent source-backed tone comparison,
and documented the distinction between text tones, action priority, visual
variants, HTML semantics and composition roles such as eyebrow. Button APIs and
existing primary-tone behavior remain unchanged.

Validation: library and production docs builds, foundation import/layer/token
guards, nine token-generation/contrast checks, seven app theme checks and all 18
existing Typography unit/regression cases pass. Six focused browser cases pass,
covering new tones/alias, theme/system changes, increased/forced colors, source
compilation/copy and dropdown sizing. Corrected an initial new browser locator to
match the Select's value-first accessible name, and updated the theme inventory
count assertion for the added semantic role. Inspected the tone comparison.

## Live dropdown stylesheet reconciliation — DOCS-038, 2026-10-14

Investigated the repeated typography dropdown wrapping in the user's existing
Chrome tab. CSSOM inspection confirmed that tab still loaded the earlier
`inline-size: var(--trigger-width)` rule, with a 73px popup, 56px client area and
four/five text fragments for body1/body2/bodyAlt2. A fresh Chrome tab loading the
same development route received the current content-sized rule: the `h2` trigger
remained 73px while its popup measured 114px, with all three labels on one line.
No further dropdown implementation or sidebar changes were needed.

Expanded the existing dropdown browser check to cover native and explicitly
17px always-visible popup scrollbars at desktop and narrow widths. All four cases
pass, including readable labels, viewport bounds, selection and focus restoration.
When changing the compiled library stylesheet during docs development, rebuild
the package and fully reload an already-open docs tab before judging live CSS;
client navigation alone may retain the previously loaded stylesheet. Verify the
affected live browser as well as the fresh production test host.

## Quiet dropdown scrollbars — DOCS-039, 2026-10-14

Applied the website sidebar's scrollbar policy to shared Select/ComboBox popups
and Menu scroll containers: thin native bars, transparent tracks, stable gutters,
and thumbs revealed by hover or focus within on fine-pointer hover devices.
Each library component uses its owned border alias for the thumb. Touch devices
retain native visibility, and forced colors restore automatic system coloring.
The docs navigation search results use the same policy. Native scroll behavior,
content-sized popup widths and focus indicators remain intact.

Validation: library and production docs builds and foundation boundary guards
pass, along with the docs theme/catalog/isolation checks. All 10 focused browser
cases pass, including thin/stable dropdown styles, forced-color restoration,
readable labels with native/classic scrollbars, search/navigation and overlay
geometry at desktop/narrow widths. Inspected the refreshed dropdown screenshot.

## Main scrollbar aligned to the shell edge — DOCS-040, 2026-10-14

Moved the docs page padding and 72rem reading-width constraint from the main
scroll container into an inner Box. The main pane now fills the remaining shell
column, placing its vertical scrollbar at the shell's right edge on wide screens
while preserving the previous content width and left alignment. Kept native
overlay locking, document gutter compensation, independent pane scrolling and
main scroll reset intact.

Validation: production docs build and TypeScript/theme/catalog/isolation guards
pass. All 10 focused browser cases pass, including right-edge alignment and
reading-width preservation at 1920/1536px, independent scrolling and viewport
containment, and overlay geometry at 1920/1280/375px. Inspected the DataGrid route
screenshot corresponding to the reported layout.

## None / global-default demo theme — DOCS-041, 2026-10-14

Added None — global defaults to the demo theme selector without changing its
initial selection. The baseline uses generated public `defaultThemeTokens`
snapshots from the library token source, resetting inherited website shared/color
values while leaving density and component aliases scope-owned. No handcrafted
default palette or runtime stylesheet removal is involved. All existing semantic
roles, including warning/error/success/info and neutral actions, already have
default colors. Added the baseline to the token inspector, with complete standard,
increased and forced-color maps, and documented its meaning on `/theming` and in
the token pipeline guide. Existing named identities and website styling remain.

Validation: library and production docs builds and foundation guards pass. Ten
token checks and eight theme/contrast checks pass, including generated-default
parity and named contrast pairs. All five focused browser cases pass: exact
baseline token parity, density, appearance/contrast/system changes, route
persistence, portals, website isolation and source compilation/copy across all
demo options. Adapted the Node-only theme graph test loader to inject the
ESM-only public token module after its initial require-based import failed.
Inspected the global-default preview screenshot.

## Shared scoped scrollbar appearance — DOCS-042, 2026-10-14

Centralized scrollbar appearance in the owned Scrollbars CSS module. ThemeScope
and portal visual roots compose its scoped class, applying the same thin native
bars, transparent tracks and hover/focus thumb visibility to content, navigation,
menus, dropdowns and dialog content. A generated `scrollbarThumb` component alias
references the border semantic, so theme scopes and local overrides control the
color. Coarse pointers keep native visibility and forced colors restore automatic
system colors. Replaced per-dropdown and website-only color/width rules with the
shared policy; containers still own overflow, sizing and gutter allocation.

Validation: library and production docs builds and foundation guards pass. All
21 focused token/CSS pipeline checks and 17 browser cases pass, including main/nav
hover isolation, keyboard focus, forced colors, dropdown label width, embedded
AppShell scrolling, dialog portal styling, right-edge placement and overlay
geometry at wide/desktop/narrow widths. Inspected the main-pane screenshot using
the shared default styles rather than injected scrollbar appearance.

## Single full-width DataGrid example — DOCS-043, 2026-10-14

Replaced the experimental DataGrid's native rows-per-page select with shared
SGUI Select. Its options include 5/10/25/50/100 and the current custom size;
changes reset page zero and preserve the existing combined-state callback.
Unspecified column widths now share available space instead of defaulting to
180px each. Flexible columns default to a 120px minimum for readable headers on
narrow screens; explicitly sized columns retain the previous 80px minimum unless
the host supplies minWidth. Explicit widths, resizing and internal horizontal
overflow remain supported.

The processing-grid page now contains one interactive Course data grid Example
with controlled host state and current copyable source. Removed its prop-control
panel and two-grid independence demonstration at the user's request. Recorded
this single-page playground exception in AGENTS and catalog metadata/guards;
all other component pages retain their playground requirements. Regenerated
composition metadata to include Select, and updated usage guidance.

Validation: library/docs builds, foundation guards, all nine existing DataGrid
unit/regression cases and 11 browser cases pass. The production catalog rendered
all 90 routes and compiled 718 initial/changed source snapshots. Focused desktop
and narrow checks cover one example/grid, full available width, readable minimum
columns, shared dropdown options, page reset, search, source compilation/copy and
no document horizontal overflow. After screenshot review tightened flexible-column
minimums, rebuilt both packages and reran the two affected browser cases and nine
unit cases successfully. Inspected desktop and narrow screenshots.

## AppDataGrid retains a fill column after resizing — DOCS-044, 2026-10-14

Enforced the user's fill-column invariant in the catalog grid width allocator.
When no uncommitted flex column remains, an available data column absorbs the
remaining container space even if its definition has a numeric width. On a
resize that would commit every data column, release another data column's width
override so the newest requested width is preserved and a fill column survives
future container changes. Prefer data columns over action-menu columns; selection
and drag utility allocations stay outside the flexible budget. Minimum/maximum
bounds and narrow-container overflow remain intact. Updated width callback and
configuration guidance to explain released keys in complete width snapshots.

Validation: library/docs builds, foundation guards, and all 35 targeted column,
layout-controller and interaction unit cases pass. Two browser flows pass in the
reported List compact reference and its comfortable counterpart: shrink Course,
shrink Status, then grow and shrink the viewport, checking redistribution and a
filled container throughout. Corrected the new test's initial slider locator to
include the interaction engine's contextual accessible-name suffix. Inspected
the post-resize compact reference screenshot.

## Shared grid sizing and fixed-column guidance — DOCS-045, 2026-10-15

Moved fill-column selection, bounded allocation and resize-snapshot retention into
one private DataGrid sizing core used by DataGrid and AppDataGrid. The smaller
DataGrid now commits only the actively resized column rather than freezing every
React Aria measured width. Both retain a fill column through sequential resizing
and container changes. Fixed columns (equal minWidth/maxWidth) and action-menu
utilities are excluded from fill selection; uncapped data columns take priority.
Added maxWidth to the smaller GridColumn contract and passed it to the renderer.
All-fixed/all-capped configurations respect their bounds and can leave unused space.

Documented preferred width, min/max limits, fixed 96px action-column configuration,
uncapped fill columns, narrow-screen overflow and complete callback snapshots in
both DataGrid and AppDataGrid pages' How to use guidance. Updated developer contracts
and agent guidance to name the shared policy and preserve fixed-column limits.

Validation: library/docs builds, foundation boundaries, 45 focused unit cases and
five production browser cases pass. Browser coverage includes the reported page's
pointer resize of every data column, viewport growth/shrink, source compilation,
shared pagination dropdown, desktop/narrow layouts and visible sizing guidance;
the catalog reference passes sequential keyboard resize in both densities. The
initial narrow resize expectation was corrected to distinguish minimum-width
overflow from unused space, and source toggles now explicitly scroll into view.
Inspected the post-resize DataGrid screenshot.

## Button documentation flow trial — DOCS-046, 2026-10-15

Applied the requested flow only to /docs/components/owned-button: minimal text-only
Button overview, When/How guidance, Contains with optional icon-slot explanation,
reverse-composition Used In links, public prop table, shared Demo settings and prop
playground, then 13 individually named/numbered examples. The playground starts
without icons and exposes startIcon/endIcon independently alongside label,
variant, tone, density, disabled and loading. Documented native form, accessibility,
styling and ref props in the table rather than inventing unsupported controls.

Examples cover treatments, icon placements, disabled/loading, neutral tone, both
densities, grouped actions, a host press callback and native submit/reset. They
retain individual source panels and interaction owners. Added explicit Example
anchor support and a linked example index; preserve existing example numbers and
anchors when extending this trial. Used In derives direct parents from existing
composition metadata; Contains retains actual implementation children and labels
application-supplied slots separately. Other component pages retain their flow.

Validation: docs typecheck/build, theme/catalog/isolation guards pass. The production
catalog rendered 90 routes and compiled 742 initial/changed source snapshots.
Four focused browser cases pass: page order/props/reverse links/anchors, icon
controls/current source/copy/loading behavior, narrow layout and independent
press/form state including native reset. Corrected the new icon-test locator to
match the dropdown's value-before-label accessible name. Inspected desktop intro,
playground and mobile prop-table screenshots. Updated the catalog source-isolation
assertion to locate the playground source instead of assuming it is the first panel.

Button trial follow-up: the user requested a bare overview. It now renders only
the shared themed preview box and Button, with an accessible region name but no
visible heading, outer example card or source disclosure. Added a previewOnly
presentation to Example, scoped to this overview; the playground and 13 numbered
examples keep their source panels. The docs build and focused page-flow/source
browser check pass with 14 source snippets; the first numbered example still
provides the basic button source.

## Button trial relationships and top settings bar — DOCS-047, 2026-10-15

Removed visible When to use/How to use guidance from the Button trial, preserving
its catalog metadata. Contains now links to optional icon content, with Used In
links immediately after it at the bottom, following every numbered example.
Moved the single shared Demo settings toolbar into a full-width bar before the
Button page heading. Other routes retain their current ordering. Recorded this
user-approved page-specific exception in agent guidance and updated browser
assertions without relaxing the requirements for other component routes.

Validation: docs build and three production browser cases pass, covering the
new order/top settings/relationship links, narrow layout and all 90 catalog routes
with 740 initial/changed source snapshots. Inspected the updated desktop page.

Button trial follow-up: removed the example-index explanation and the entire
numbered link index at the user's request. Individual named/numbered examples,
anchors and source panels remain. Updated the focused test to assert the removed
content is absent and navigate directly to a retained anchor. Docs typecheck,
theme/catalog/isolation checks pass; no browser rerun for this text-only removal.

Button trial follow-up: replaced visible numbered example titles with
“Button: …” (for example, “Button: Neutral filled action”). Preserved existing
anchor IDs for old links. Source/copy labels inherit the new titles. Updated
usage/agent guidance and affected test locators. Docs typecheck and
catalog/theme/isolation checks pass; no browser rerun for this label-only change.

## Reveal quiet scrollbars during native scrolling — DOCS-048, 2026-10-15

Added active-scroll visibility to the shared scrollbar policy. Provider/ThemeScope
owners share one passive document capture listener, including their scoped portal
roots. Every native element scroll marks that element active and refreshes a
one-second idle timeout; CSS shows its thumb independently of hover/focus state.
This supports wheel, keyboard, drag and middle-button autoscroll through the same
native scroll signal rather than relying on pointer re-entry. Unrelated elements
are ignored, and the last owner clears the listener, attributes and timers.
Preserved native refs, SSR markup, forced colors, gutters and overlay scroll locks.

Validation: five targeted activity/scope unit cases, foundation guards and fresh
library/docs builds pass. Nine browser cases pass: page/sidebar wheel activity
with hover/focus absent, keyboard scrolling, native portal scrolling, idle hiding,
forced colors, dropdown sizing and overlay geometry at desktop/narrow widths.
The physical middle-button/window-switch gesture itself was not reproduced in
the harness; the underlying native scroll event path is covered.

## Combined Button component documentation — DOCS-049, 2026-10-15

Expanded the Button prop-reference surface into one Documentation section containing
Setup, Props, Behavior and accessibility, and Host responsibilities. Included a
public-import application setup snippet plus installation/theming links. Explained
keyboard/press behavior, disabled versus pending focus, decorative icon slots,
ARIA attributes, native form actions and application ownership of async state,
validation, persistence, translation and accessible outcomes. The prop table now
labels React.AriaAttributes as accessibility attributes. The section stays within
the fixed website theme; preview source panels still omit application-level setup.
The minimal overview, top settings bar and bottom relationship links remain.

Validation: docs build and catalog/theme/isolation guards pass. Two focused browser
cases pass, checking all four subsections in the same region, public setup source
compilation, references, retained example sources/anchors and narrow-screen width.
Inspected the updated desktop overview. No component behavior changed.

## Native scrollbar first-drag investigation — DOCS-050, 2026-10-15

Added two real native-thumb regressions for page and navigation: wheel-scroll,
mouse down on the thumb, hold beyond the one-second idle delay, then move twice
without releasing. Both pass against the current implementation. The first test
attempts were invalid because headless Chromium launches with --hide-scrollbars;
the file now explicitly omits that flag so native painting/hit testing is enabled.
A permanently visible-thumb comparison had the same invalid-harness failure.
No production behavior was changed based on that result.

The reported inactive-window sequence may be native macOS/Chrome activation:
Chromium's Cocoa acceptsFirstMouse and Chrome's delegate default to accepting
ordinary page mouse events only in the active window. Synthetic browser input
cannot establish whether a physical activation click is discarded by macOS.
Requested confirmation whether the issue also occurs with Chrome already active.
Sources: [Chromium Cocoa input handling](https://github.com/chromium/chromium/blob/main/content/app_shim_remote_cocoa/render_widget_host_view_cocoa.mm)
and [Chrome macOS delegate](https://github.com/chromium/chromium/blob/main/chrome/browser/renderer_host/chrome_render_widget_host_view_mac_delegate.mm).

User confirmation: activating Chrome through its title bar first allows the thumb
to be dragged with one click. This matches the native window-activation boundary;
retain current SGUI behavior and the two passing active-window drag regressions.

## Shared component page template — DOCS-051, 2026-10-15

Applied the approved Button page structure across all 90 catalog routes, including
the dedicated AppButton/AppModal pages: one shared Demo settings bar above the
heading, bare themed overview, combined Documentation, playground, named examples,
and linked Contains/Used In sections at the bottom. Removed the old visible
When/How renderer. Component-specific guidance remains in component-usage and
feeds behavior/accessibility and host responsibilities; setup includes public
imports, application scope and installation/theming links. Button retains its
hand-written detail. DataGrid retains its single source-backed working example
in place of prop controls/reference scenarios, alongside the template overview.

ComponentCatalogPage owns the structure. ExamplePresentation selects overview,
playground and reference views of existing state-owning examples; separate mounts
keep the overview independent without copying component implementations. The
shared Example owns the bare-preview presentation and prefixes reference headings
with the component name. Existing source/copy labels and Button anchors remain
stable. Phase layout removes unrelated wrapper headings and bounds large overview
previews without clipping overlay portals. Relationship lists retain one-level
composition boundaries and derive direct parents, including valid compound anchors.

Added component-api generation from built public declarations, with requiredness,
callback/type signatures, owned documentation comments and implementation defaults.
Transparent wrapper defaults are inherited, while explicit wrapper defaults win.
Identical export contracts share a table; compound contracts and factory parameters
remain separate. Native/React attributes are available in a disclosure. Metadata
has no private filesystem paths. Build the library before catalog generation;
root dev/build/check docs commands already do so. Do not hand-edit component-api.json.
Change public contracts/JSDoc and component-specific guidance at their sources.

Validation: docs build, catalog/theme/isolation guards and three API-generator
contract tests pass. All 48 docs browser cases pass. The catalog rendered all
90 routes and compiled 830 setup/initial/changed example source snapshots;
267 panel interactions preserved every sibling source snapshot. Desktop/narrow
layouts, overlays, themes/forced colors, clipboard source, navigation, grids and
native scrollbar drags retain their assertions. Updated selectors to accept exact
catalog component prefixes while excluding expanded Show source regions; the
initial loose suffix selector caused one ambiguity, fixed before the full rerun.
Inspected the shared AppButton desktop page. No library public API changed.

## Optional AppShell right column — DOCS-052, 2026-10-15

AppShell now accepts optional `rightNavigation`. It renders after main with the same
scrolling wrapper as left navigation and a mirrored inner divider for a directly
supplied nav. Omission preserves the existing two-column shell. Each supplied
SideNavigation keeps its own width, collapse state, accessible name and menu state.
At 40rem and below, left/main/right stack in document order; with both sides present,
each navigation region is capped at 30% of the bounded shell height. Main content
is retained when the optional column changes or the layout resizes.

The AppShell page includes a Show right navigation playground control, a fixed
left/right navigation example, and a three-pane scrolling example with matching
copyable source. Public prop metadata and catalog composition were regenerated.

Validation: all 11 colocated AppShell tests pass; library and production docs
builds pass, including catalog, theme, isolation and API guards. All eight focused
independent-scroll browser cases pass. The new browser case verifies omission,
playground/source updates, desktop placement and divider, separate wheel scrolling
for all three panes, independent collapse, narrow stacking without main remount or
horizontal overflow, and compilation of every displayed AppShell example source.
Initial browser failures were test selector/attribute assumptions, corrected to
use the visible checkbox label, source code locator and existing collapsed value.

## Icon rail and sliding tool panels — DOCS-053, 2026-10-15

Added public IconPanelNavigation as an independent owned composition. The persistent
icon-only rail opens one non-modal panel at a time, supports start/end placement,
controlled or uncontrolled opening, disabled items and a constrained panel width.
Clicking the active icon, Close, or unhandled Escape inside the panel closes it.
Labels supply accessible names/tooltips; closing restores trigger focus. Hidden
panels stay mounted to retain local drafts. Rail and panel body scroll separately
with shared scope scrollbars. Reduced motion removes animation and forced colors
retain an active outline. Colors use four generated component aliases.

The new `/docs/components/icon-panel-navigation` page uses the shared component
template with prop playground, independent named source-backed examples, both
sides and densities, and AppShell integrations. One example opens separate Courses
and People page menus using the host routing adapter; another keeps SideNavigation
and the right-side tool rail independent. The library owns no routes or account
model. Public API/composition metadata and purpose navigation were regenerated.
See [the component contract](react-aria-icon-panel-navigation.md).

Validation: three colocated smoke tests, owned foundation import/layer/token guard,
library build, production docs build and catalog/theme/API/isolation guards pass.
Three icon-rail browser cases and eight existing independent-scroll/shell cases
pass. The production catalog check renders all 91 routes and compiles 851 public
setup/initial/edited source snapshots. The catalog caught unsafe width-attribute
serialization for quoted text; it now uses a JSX string expression. Layout checks
use reduced motion; tooltip hover explicitly enters after scrolling the trigger
into view. Inspected desktop and narrow browser captures. No dependencies added.

## AppShell icon navigation examples — DOCS-054, 2026-10-15

The AppShell component page now includes the three icon navigation compositions:
separate icon-selected page menus, a primary left icon rail, and a right tools rail
beside an independent SideNavigation. Both component pages reuse a stateless
example group; each panel still mounts its own state owner and matching copyable
source. No library contract changed.

Validation: production docs build and catalog/theme/API/isolation guards pass.
All three icon navigation browser cases pass; the menu/routing case now exercises
both component pages, verifies sibling rail drafts remain independent, and compiles
all displayed source on both pages after interactions. `git diff --check` passes.

## Website right tools rail — DOCS-055, 2026-10-15

The persistent DocsShell now renders IconPanelNavigation with exactly two tools on
component routes: BrushIcon opens shared Demo settings, and DescriptionIcon opens
Page documentation. Both start closed. The component section supplies settings
from the existing DemoSettingsProvider, retaining identity/appearance/contrast
across client navigation and visits to general docs. General pages and the catalog
index omit the rail.

Each component route registers its server-rendered setup/props/behavior/host content
through PageDocumentation. The shell matches registration to the current pathname
and guards cleanup against clearing a newer page's registration. The owned Button
page supplies its specific documentation through the same slot. Documentation and
settings were removed from main content; overview, playground, named examples and
Contains/Used In retain their existing independent state. Page navigation updates
the open documentation panel and resets its scroll position.

Desktop panels reduce the main reading area; at 52rem and below, the same non-modal
panels overlay that area while retaining a visible rail. Width uses the stable docs
layout constraint, including classic gutters. Main, left navigation and right panel
scroll independently. Prop tables keep a readable minimum width inside their own
horizontal scroller. Native focus/tooltip/Escape, reduced-motion, forced-color and
shared scrollbar behavior come from IconPanelNavigation and existing SGUI scopes.
BrushIcon is a public owned SVG wrapper over the existing Lucide dependency and is
registered in the icon catalog. No dependencies added.

Validation: owned foundation import/layer/token checks, library build, 109 existing
icon cases and production docs build pass. The full browser run passed 49/52; the
remaining cases assumed inline grid guidance or synchronous example loading. They
now open page documentation and wait for actual scrollable content, preserving
the original assertions. A fresh 13-case rerun passes those cases plus the affected
appearance, Button, grid, scrollbar and catalog checks. All 91 component routes
render; 857 public setup/initial/edited source snapshots compile. Desktop/narrow
checks verify closed defaults, two tools, independent scrolling, overlay geometry,
return focus, preferences across navigation, current-page documentation and scroll
reset. Existing full-run overlay/gutter, clipboard, isolated examples, resizing,
menu, theme and native scrollbar-drag checks passed. Inspected desktop/narrow
screenshots after the readable-table change. `git diff --check` passes.

## Structured Growth neutral surfaces and navigation — 2026-10-15

The owner’s Figma sidebar screenshot supersedes the cream surface treatment in
DOCS-029. The fixed identity now uses white canvas/sidebar/overlays, cool-gray
subdued and hover surfaces, pale-blue selection, navy text/actions and restrained
gold accents. The app-owned palette, semantic maps, shape settings and current
style/theming guides reflect that direction. Other demo identities stay independent.

The docs menu uses public SGUI leading icons, regular labels, 6px corners and
consistent 44px rows. SideNavigation shares icon alignment/sizing, row spacing,
regular-weight links/buttons and inherited density; hover and selection have
separate generated component aliases. Its examples include host-owned icon
resolution in both the preview and copyable source.

During validation, opening the mobile settings Select reproduced a 1px horizontal
scroll of the outer layout grid. Using overflow: clip on that non-scrolling grid
prevents focus from scrolling it; main/sidebar/tools still own their independent
scroll areas and native overlay locking remains enabled.

Validation: library and production docs builds, foundation/token guards, 34 affected
SideNavigation unit/helper tests, 10 token-generator tests, eight theme/contrast
checks and docs catalog/source guards pass. All 19 focused production Chromium
checks pass, covering category/search navigation, icon geometry, matching menu row
heights, copyable source, appearance/forced-color isolation, mobile/desktop scroll
locking and independent pane scrolling. Reviewed desktop/menu screenshots.
Broader browser/device acceptance is not claimed. Changes remain local; no release
or publication was performed.

## Compact desktop application chrome — 2026-10-15

The owner’s side-by-side comparison calls for a desktop application layer. The
navigation scale is now independent of global reading/form typography: 12px
labels, 16px leading icons, 8px icon gaps and 32px docs rows with no extra row gap.
Reusable SideNavigation uses generated size aliases and 32px compact / 36px
comfortable rows. Coarse-pointer devices retain 44px targets. Rem-based values
scale with enlarged text; the brand navy/gold and neutral surfaces are retained.

The fixed header is now a compact toolbar with a 14px brand label and 32px version
picker. Its label and documentation description remain accessible but visually
hidden. Sidebar gutters are 8px, the gold keyline is 1px, and content padding is
16–32px. Component previews retain their independent density and theme settings.

Validation: library/docs production builds, 34 affected navigation unit/helper
tests, foundation/token guards, ten token generator tests, eight theme/contrast
checks and catalog/source guards pass. All 20 focused Chromium checks pass,
including desktop label/icon/row dimensions, compact/comfortable row heights,
touch targets, 200% text enlargement, keyboard navigation, theme isolation,
scroll locking and independent panes. Updated the intentional content-inset
assertion from 64px to 32px. Visually reviewed the compact toolbar/sidebar.
Changes remain local and uncommitted; no release or publication was performed.

## Theme-sized density and interaction policy — 2026-10-15

The owner authorized revising the early sizing model. Provider, ThemeScope and
AppThemeProvider now accept independent interactionMode auto/pointer/touch,
defaulting to inherited auto. CSS resolves auto through any-pointer: coarse, so
mixed touch/mouse hardware gets touch sizing conservatively; explicit host choices
remain local. SSR markup requires no capability reads. The policy never disables
any input method, expands navigation, or chooses a responsive layout.

The token graph adds paired pointer/touch dimension maps and a typed interaction
tier. Compact/comfortable dimensions now reference shared theme size values.
Default active interaction roles stay outside baseline identity snapshots. The
shared target floor reaches common buttons, icon buttons, fields, selection
controls, menu options, tabs, pagination and navigation. SideNavigation icons use
16px pointer / 20px touch defaults. Removed duplicated coarse-pointer sizing rules
from SideNavigation and the docs shell; the website consumes the same roles.

Provider and ThemeScope playgrounds expose interaction independently from density,
with portaled menus. A source-backed theme example demonstrates compact spacing
with 48px targets and 24px navigation icons. Theming/architecture guidance and
public API tables describe inheritance, theme overrides, hybrid hardware and
host-owned preference persistence. Minimum dimensions permit content-driven growth;
compact text fields can exceed 32px to fit their text, padding and borders.

Validation: library/docs production builds, foundation guards, 65 focused scope,
provider, button, field, menu and navigation unit tests, and 11 token-generator
checks pass. Existing 22 focused production Chromium checks pass for theme modes,
forced colors, default identity, keyboard navigation and scrolling. Three new
sizing checks pass for explicit policies/portals, touch-capable desktop emulation,
and theme-defined target/icon overrides. Both catalog browser checks pass, including
91 routes and 861 compiled public setup/initial/changed source snapshots. Physical
iPad/device and assistive-technology acceptance remain separate. No release,
publication or commit was performed.

## Compact matching right tools menu — 2026-10-15

Aligned the website’s right tools rail with its compact left navigation: 16px
icons, 32px buttons, 4px outer padding and a 40px rail. Touch policy yields 20px
icons, 44px buttons and a 52px rail. IconPanelNavigation now uses generated
navigation/interaction size aliases instead of fixed 24px icons and a 56px rail.
Its panel headings/close controls and spacing use the same compact scale.

The website tools live inside a compact ThemeScope with 12px control text so
its dropdowns and tooltips inherit consistent sizing. Demo settings have tighter
spacing. Narrow-screen grid width, panel offset and available panel width derive
from the same rail calculation. Main/demo scopes stay independent.

Validation: library/docs production builds, three IconPanelNavigation unit tests,
foundation/token guards and all 20 focused production Chromium checks pass.
The checks verify rail/button/icon geometry on pointer and touch-capable desktop
contexts, panel opening/dismissal/focus, retained drafts, theme isolation,
responsive overlays, scroll locking and independently scrolling panes. Changes
remain local and uncommitted.

## Backlog scenario completion — 2026-10-15

DOCS-005-b and its twelve scenario leaves, DOCS-006 and DOCS-008 now have
implementation and focused evidence. The final fresh production docs build and
21 Chromium checks passed, covering all 90 routes and 904 public setup and
initial/changed example source snapshots. API/isolation/theme checks passed
15 Node tests; catalog validation covers 201 public component/icon names.
The watch command completed three serialized public builds/metadata generations,
including a queued source change, then shut down cleanly with unchanged source
content and released validation leases. See the
[task-to-evidence receipt](archive/2026-10-18-task-lists/backlog-execution-2026-10-15.md).

DOCS-007 remains open pending the hosting target and implementation;
DOCS-005-l and its parent retain the complete final production-matrix gate.
These development checks do not close those gates or authorize a release.

## Version-route fallback preparation — 2026-10-21

DOCS-007-a now exports the current canonical route list at
`/documentation-routes.json` during catalog generation. After a release host is
confirmed, register its exact version ID, immutable base URL and that release's
own route list in `apps/docs/content/navigation.ts`. Never use the current dev
route list to claim which routes an older deployment contains. The current
selector still offers development only; no release deployment is invented.

Version navigation uses `documentationVersionTarget`: an available route stays
inside the selected deployment's base path; an absent route opens that release's
overview with a bounded, plain-text fallback notice. Invalid/mutable version
identities, unsafe base URLs and missing route manifests fail closed. The notice
tracks query-only navigation as well as pathname changes. Host-level URL
immutability and deployment configuration remain DOCS-007's outstanding scope.

The production docs build now runs `pnpm host:check` before catalog generation.
This audits active manifests, lock identities, CI/source references and native
manifest/registry mappings while retaining original story identities as data.
It supplements the complete DOCS-005-l matrix; it does not execute native cases.
See the [combined correction/test receipt](backlog-to-ten/nine-corrections-2026-10-21.md).
