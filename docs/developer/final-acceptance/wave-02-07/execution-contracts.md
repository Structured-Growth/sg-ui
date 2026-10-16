# Wave 02-07 concrete acceptance contracts

These are reviewable successor specifications, not executed native/consumer results
or edits to shared implementation/guidance. Base `540f47d4059a9cea8890b80927f34f51ef2fbc3e`,
modified `dev`; exact inspected input bytes are in inspection.json. This file
advances the specific open C-16/17/19/20 successors from
`docs/developer/parallel-batch-105/acceptance-evidence.md` to bounded deliverables.
The coordinator allocates a stable build/pack/browser window for execution.

## D13: palette/state-color evaluation decision

Retain explicit reviewed sRGB hex palette entries and named semantic/component
aliases as the shipping format. Do not add runtime color interpolation for the
current palette/state system. This is an evaluation decision, not an assertion
that CSS color functions are unavailable in contemporary browsers.

| Option evaluated | Fit to the shipped pipeline | Decision |
| --- | --- | --- |
| Runtime color-mix state derivation | Would place algorithmic state colors outside the current literal palette -> semantic -> component graph. A generic mixing ratio does not establish contrast of the named foreground/background/focus pairs. The compiler currently validates literal 6/8-digit hex values, not expressions. | No present benefit establishes changing the contract. Keep explicit hover/pressed/selected values, existing pair tests and forced-color system mappings. |
| Runtime OKLCH values/interpolation | Would require a new token value grammar, gamut/fallback decisions and tests for every derived role; current runtime output needs neither interpolation nor gamut mapping. | Do not adopt as a mandatory CSS dependency in this slice. |
| Optional offline OKLCH/palette authoring | Could aid future palette generation while emitting the same literal reviewed sRGB values and aliases. Its generated result could use the current contrast checks without consumer/toolchain changes. | Allowed future experiment when a specific identity/state requirement justifies it; record authoring algorithm/gamut conversion and review emitted values. No such tool was added or validated here. |

The current fallback is the actual emitted literal/variable graph: no alternative
runtime color syntax must be supported to render the palette. Keep named contrast
checks and forced-color behavior. Any later optional runtime experiment must emit
a literal baseline first, guard enhancement with an exact `@supports (color: ...)`
condition, and test both branches' named pairs. Do not claim a mixing ratio makes
all consumer colors accessible. Existing FA-04 contrast tests are retained only
for their unchanged token/compiler/test inputs.

## D14: progressive enhancement and focus fallback

The base interface must preserve focus, controls, content and dismissal when an
optional enhancement is absent. The observed source has no anchor positioning,
style queries, view transitions, `transition-behavior` or `@starting-style`.
Keep existing measured JS overlay placement unless a separately evidenced task
introduces an optional CSS replacement. Presentation must not wait for a transition
completion event to commit state or return focus.

Concrete conditional gap **F14-01**:
`TextField.module.css:26` suppresses the decorated input outline unconditionally;
line 27 transfers the indicator to a `:has(...)` ancestor. In a selector engine
without `:has`, the latter rule is ignored but the more-specific suppression still
beats the generic input ring at line 33. This is source/cascade evidence of a
missing enhancement fallback, not a reproduced defect in configured engines or
a newly promised legacy-browser range.

`proposed-focus-fallback.patch` moves the suppression/ancestor indicator into
`@supports selector(:has(*))`, leaving the input ring as baseline. It is generated
against the recorded TextField CSS and **not applied**. Review the focus-outline
geometry for grouped and decorated fields before integration. Forced-color input
rules already remain outside this enhancement. The public label/ref/form/icon
contract is unchanged by this candidate.

Additional fallback question: Dialog CSS uses dvh sizes for full/XL; the sole
`@supports not (height: 100dvh)` rule supplies only the generic max-block-size.
Choose explicit full/XL vh block-size fallbacks if engines lacking dvh are in the
support policy, or document the dvh baseline. Do not infer legacy-engine support
from a current Playwright engine. No viewport behavior has been executed here.

Deliverable **W207-C14**: adopt the reviewed enhancement contract in the current
architecture guide, integrate/review the candidate focus fallback or deliberately
document the selector baseline, and resolve full/XL fallback policy. Use an isolated
CSS fallback fixture that removes/does not apply the enhancement rule to verify the
baseline ring, alongside native focus checks in the configured engines. No full
suite is needed for the small implementation correction.

## D15: remaining visible-focus obligation

Source risk **F15-01**: AppDataGridShell's `.content` has `outline:none` and no
matching owned focus rule. The wrapper is `tabIndex=-1`; page-entry and removed-card
repair can deliberately choose it when no row/card survives
(`AppDataGridShell.tsx:174–189,224–225`). This is a source-confirmed missing local
indicator on a possible focus destination. It is not a browser failure receipt;
normal nonempty row/card targets have their own rules.

Deliverable **W207-C15**:

1. Add one bounded case to `packages/ui/tests/browser/batch05-grid-shell-state.spec.ts`
   (or the existing shell-focus spec owning that fixture): enter keyboard modality,
   focus a card action, have the host remove the final card, and record the active
   element, accessible label, computed outline/border/box-shadow, clipping bounds
   and `elementFromPoint` result. Repeat a page response becoming empty, and assert
   an outside host focus destination is preserved. Keep the native fixture/data
   minimal. A browser result determines whether the source gap is visible to users.
2. If the shell fallback really owns focus, provide a token-backed visible indicator
   for that destination (or choose a meaningful surviving focus target), avoiding
   a blanket ring on text editing. Preserve native refs/controlled callbacks.
3. Exercise decorated field base/enhanced ring from D14, Menu item/empty-menu focus,
   and editor keyboard-entry versus ordinary typing using existing
   `editor-focus-presentation.spec.ts`. Require visible/unclipped ring in light/dark
   and forced colors; host focus and sibling state must remain unchanged.

Retain current tests. Do not equate jsdom focus identity or a CSS selector's
existence with a visible native outline. Link this receipt to A-B-09 without
pretending that B-09's source risk audit fixes the findings.

## D16: motion, interruption and focus contract ready for adoption

The following closes the missing **specification** portion of the historical
C-16 successor. Native execution/adoption remains outstanding.

| Event | Required resulting state / timing | Evidence to retain |
| --- | --- | --- |
| Button hover/press interrupted | CSS reflects the latest state immediately; no queued action or transition-end callback. Background interpolation may stop/reverse naturally. | Final hover/pressed state and exactly one owned onPress per activation. |
| Reduced-motion preference changes during spinner/progress/navigation animation | Current running CSS animation stops under the media rule. Loading/pending semantics and focus stay intact; no application action is synthesized. Restore ordinary animation only when preference returns and the state still requires it. | Computed transition/animation names and duration, pending aria state and active element before/after live media change. |
| SideNavigation forward then Back before 120ms elapses | Navigation's current menu wins. Old view is unavailable for input. Back focus is the current menu's intended control; no delayed callback moves focus into the removed view. | Menu identity, visible/tabbable items, callback count, active element, then the same state after two animation frames plus the configured duration. |
| IconPanelNavigation A -> B -> close rapidly | Only accepted activeId remains displayed. Mounted hidden panels retain their draft state but cannot receive Tab focus. If focus was inside the departing panel, it returns to the surviving selected trigger or the original close trigger. A stable main-content focus destination must not be stolen. | Independent panel content, hidden flags, accepted controlled state and focus after every transition and settlement. |
| Collapse open -> close -> reopen | Native hidden/unmount contract wins immediately; no exit delay. Kept children retain local state, unmountOnCollapse children do not. Host controls where focus goes if its focused descendant is removed. | Hidden/inactive tab stops, draft preservation/remount behavior and no stale timer. |
| Dialog/Popover dismissal then immediate reopen or host replacement | Dismissal callback reflects the actual reason once. Existing React Aria focus restoration runs; Dialog's one-frame removed-opener repair may only recover lost/inert focus in the surviving parent. It must preserve valid host/other-overlay focus. An old cleanup must not focus a detached/replaced opener. | Nested dialog count, active element and connection/inert status at dismissal, next frame and after immediate reopen/replacement. |
| Tooltip pending open/close then keyed trigger replacement/unmount | Old delayed callback cannot reach the host or describe the replacement trigger. Tooltip never captures focus as an interactive overlay. | aria-describedby lifetime, callback counts, no detached tooltip, active trigger identity after timers settle. |

No motion runtime is justified by these simple CSS effects. The manifest/lockfile
has no dedicated motion/framer/gsap/react-transition dependency. Button/Progress
use duration constants for their status animations; navigation uses 120ms shared
motion. Focus recovery uses effect/frame ownership, not animation completion.

Deliverable **W207-C16**: adopt this table in the maintained motion/overlay contract;
add only the missing rapid-reversal/rail/reopen cases to existing fixture/spec owners.
Reuse `display-preferences.spec.ts:108` for live reduction and
`inventory-modal-boundaries.spec.ts` for removed opener/host focus. Execute these
bounded cases at one source+host hash in Chromium/Firefox/WebKit. Preserve exact
frame/media/focus observations and failures. Physical-device/AT behavior stays
separate; no hard timing SLA follows from 120ms source tokens.

## D17: one combined overlay ownership case

Current layer contract: dialog overlay 1400; popover/menu/tooltip/selection toolbar
1410; each detached root receives owned visual/locale/custom-variable scope. Equal
layers and DOM insertion order do not prove combined hit testing or focus ownership.

Deliverable **W207-C17**: add one composition fixture under
`apps/docs/native-fixtures/scenarios/acceptance/OverlayOwnership.fixture.tsx`,
register through the maintained native registry generator, and one bounded spec
`packages/ui/tests/browser/overlay-ownership.spec.ts`. It must use public SGUI
components and a real PageRichTextEditorSection within AppModal, a menu/tooltip
trigger and a child dialog. Do not create a new overlay engine or private-source
consumer shortcut.

Sequential assertions in that single composition:

1. Open the outer modal by keyboard; background is not keyboard-interactive and
   initial focus is visible. Record portal parent/scope/theme/density and actual
   computed z-index plus bounding rectangles.
2. Open menu from inside modal, then focus its tooltip-capable trigger where
   appropriate. Tooltip supplements the action name; background remains inert.
   Assert actual topmost target with `elementFromPoint`, not z-index alone.
3. Close menu; select/format text in the editor and open its link/image dialog.
   Confirm selected content survives, the dialog is topmost and menu/tooltip do
   not steal focus. Escape closes only the top dismissible interactive overlay.
4. Close/reopen child rapidly, remove the child opener and optionally focus a host
   destination. Parent focus recovery follows D16; late cleanup preserves valid
   host focus. Finally dismiss parent and verify outer trigger return/scroll unlock.
5. Run the same composed sequence with a nested visual scope change while open and
   a sibling scoped control. Assert tokens/dir/density on active portals update
   according to the owned contract and the sibling remains independent.

Use light/dark and required engines, within a stable docs-native build lease.
Existing nested Popover and separate editor/tooltip tests remain useful subset
coverage; none is a current combined execution receipt. This artifact may share
scoped-portal evidence with P10-D16-01 rather than scheduling a duplicate case.

## D19: CSP verification boundary and executable protocol

No strict CSP compatibility is established. Inline CSS Modules are not the issue:
the package distributes a stylesheet, while dynamic host/interaction surfaces
still emit inline style attributes or style properties. Relevant concrete inputs:
ThemeScope custom variables, Dialog host style slots, Popover underlay/placement/
trigger width, Menu/Select/ComboBox/SearchField engine placement, rail width,
floating toolbar left/top/maxWidth and host Lexical document formatting/image URLs.
Do not infer whether a particular header blocks all of these from source alone.

Deliverable **W207-C19**: coordinator assigns a packed production HTTP fixture
(e.g. `packages/ui/scripts/test-csp-consumer.mjs`) and a stable pack/browser window.
The following is a proposed test policy contract, not an approved support promise:

| Candidate response policy | Purpose / required outcome |
| --- | --- |
| External same-origin script/style; explicit `style-src-attr 'none'`, no unsafe-eval; default/object/base restrictions | Characterize a restrictive baseline. Retain violations and any geometry/focus/theme failures. A failure is expected characterization if a dynamic style surface is blocked, not permission to suppress diagnostics or claim support. |
| Same script/style policy with an explicitly reviewed allowance for necessary inline style attributes | Candidate documented deployment boundary. It must retain usable default/custom scope colors, overlay collision/repositioning, focus, editor formatting and viewport resize. No broad unsafe script allowance is justified by inline style placement. |
| Host-approved image policy with/without blob/data URLs | Distinguish temporary preview/blob and host asset URLs from packaged CSS/JS behavior. Report blocked sources separately; no implicit network/asset authorization is added. |

Use real response headers, no dev server/HMR or injected docs meta policy. Capture
`securitypolicyviolation` before application code, script/runtime errors, effective
headers, blocked directive/URI, full source/tarball/bundle hashes and visible
interaction/geometry results in each engine. Treat missing application startup as
a test outcome rather than no violations. Keep violations from each policy as
separate results. An owner must decide the supported policy and any nonce/hash/
image exceptions; no legal/security approval, new nonce API, style workaround or
service claim is implied. Execute only after the fixture/policy scope is authorized.

## D20 / B10: current-artifact consumer and performance evidence

This wave adds **SSR** timings only. It does not execute a production consumer.
`ssr-reference.json` is the raw result; `ssr-attestation.json` binds 45 unchanged
source closure inputs and their unchanged compiled JS to the benchmark. All
measurement writes occur inside this owned directory. The stylesheet changed
from FA-01 because shared output is evolving; old packed equality does not certify
new bytes. Never rebuild dist during another owner's packing/native work.

Deliverable **W207-C20-B10**:

1. Coordinator freezes candidate source/build/tarball and records source inputs,
   manifest/lockfile, CSS/JS maps, Node/pnpm/React/TS/bundler versions and hashes.
   Run existing foundation React 18/19 consumer scripts serially, plus editor
   consumers for their dedicated graph. Preserve full output, not only a summary.
2. Preserve module IDs and emitted asset inventory for the ten existing isolated
   public entry graphs in test-foundation-consumer.mjs: tokens, theme, primitives,
   AddIcon, hooks, adapters, i18n, Button, ClassCardFrame, AppDataGrid. Check no
   Lexical in basics and no TanStack/grid outside the grid graph. Editor graph must
   positively contain Lexical. Keep vector pruning and one retained stylesheet.
3. Add one mixed import fixture (root + granular + public CSS imported by two
   consumer modules) and a dynamic chunk opening an overlay/editor. Verify expected
   modules are pruned, required class/token rules survive, and CSS does not become
   duplicated across the tested asset graph. Compare selectors/asset references,
   not just number of CSS files. A split build may legitimately emit multiple CSS
   chunks; state exactly which shared rules repeat. Preserve `sideEffects` metadata.
4. Measure raw and gzip bytes per asset/entry with documented compression settings,
   separating shared React/runtime, basic control, grid and editor chunks. Store
   the built manifest/module map and tarball hash; raw per-module dist sizes alone
   cannot establish a production transfer/bundle result.
5. Use existing deterministic grid workload and a real editor fixture to record
   browser first usable render and post-action completion (sort/filter/page for
   grid; type/format for editor). Establish explicit navigation/request/paint and
   visible-result endpoints using performance marks or equivalent browser timing;
   record warmups/sample count/median/max, CPU/browser/viewport, rows/page size and
   content shape. Current acceptance.spec.ts's 15-second hang guard remains useful
   but does not substitute for this render/update distribution. Keep screenshots/
   output shape so an optimization cannot silently remove work.
6. Compare only like-for-like workloads at recorded hardware/runtime/build inputs.
   Existing early proof-page budgets and the new local SSR numbers are references,
   not consumer SLAs or proof of comparative engine performance. Hardware/CI and
   actual device latency remain separately scoped.

Coordinate this with I-S1 and the existing package/runtime gate owners to reuse one
immutable-artifact receipt instead of repeating equivalent builds. For the old
measure-migration-proofs.mjs, document root invocation via its package-relative
path or add an explicit output flag in a separate script-maintenance task: its
relative `docs/developer/migration-baseline` write directory follows cwd, so running
it from packages/ui with --record would not update the canonical root record.
