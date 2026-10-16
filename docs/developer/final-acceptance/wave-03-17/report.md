# Wave 03-17 — localization ICU and RTL

**A-H-08: partial. A-C-09: partial.** Prepared a six-path integration patch,
five focused native cases, a runnable deterministic built-output check, and an
explicit coordinator validation plan. No source outside this directory was edited.
No acceptance checklist/count was changed.

## Reviewable changes

`localization-direction.patch` is ready to apply after coordinator review;
`proposed-files/` mirrors all six target paths. `git apply --check` passes for the
recorded inputs; the patch has **not** been applied.

- SideNavigation CSS mirrors its forward/back signed offsets under `:dir(rtl)`.
  LTR retains +1rem/-1rem; RTL uses -1rem/+1rem. This follows the rendered scope
  direction, including deliberate host direction overrides. Reduced motion,
  duration, focus ownership, glyph mirroring and physical hit-test math remain
  unchanged. The new variables are local motion distances, not color tokens.
- Existing translation fixtures retain their original IDs and messages. They gain
  a status role/test boundary and fixed number/date content: 12345.5 and the instant
  2026-10-16T12:00:00Z. Arabic formatting runs through the adapter and public
  Provider; pseudo transforms preserve ICU formatting for date/number content.
- Existing SideNavigation fixture gains English and Arabic locale wrappers around
  its existing hierarchy. They supply locale through `SGTranslationProvider`,
  then public `Provider`, without setting DOM-only `dir`. Hierarchy labels remain
  the existing host content; the scope locale/direction and motion are under test.
- `translations-locale-acceptance.spec.ts` has one native case per English fallback,
  pseudo and Arabic scenario. It checks actual language/direction, exact counts
  0/1/2/3/11/100, localized digits and fixed date/number output, Enter/Space/clear,
  retained focus/visible keyboard outline, complete labels and 320 CSS-pixel
  containment. The final 150% root-size check is text enlargement, not real zoom.
- `navigation-locale-motion.spec.ts` has one case per locale. It samples native
  CSS animations paused at frame zero, verifies mirrored transforms, reverses
  before forward completes, checks restored Back-trigger focus, and verifies
  reduced-motion suppression. This tests direction/focus, not perceptual approval.
- The proposed i18n acceptance guide corrects retired Storybook/current-host prose,
  explains adapter-owned Provider locale and runtime-time-zone behavior, and keeps
  dated historical receipts and actual spoken-AT requirements explicit.

## Executed evidence

All new execution was lightweight local Node 26.5.0, **not** supported Node 22/24
validation and **not** a browser, DOM emulator, device or spoken-AT run.

1. `TZ=UTC node docs/developer/final-acceptance/wave-03-17/check-built-locale.mjs`
   passed **20 deterministic cases** against existing built public export routes.
   It extracts existing fixture message literals, validates variable parity,
   verifies all six Arabic plural categories including other=100, exact digits,
   fixed UTC date/number output, pseudo expansion, and server-renders public
   Provider with each adapter locale to assert `lang`/`dir` and translated content.
   `built-locale-results.json` records all output, Node/ICU versions, source/built
   hashes and prior comparisons; `built-locale.txt` is the raw successful output.
2. `node docs/developer/final-acceptance/wave-03-17/check-proposals.cjs` passed.
   TypeScript 5.9.3 overlays the two proposed fixtures/specs at their real paths
   against existing built public declarations: **zero diagnostics**. PostCSS
   parses proposed CSS and verifies RTL forward/back and retained reduced-motion
   declarations. `proposal-check-results.json` and `proposal-check.txt` retain
   scope and raw output. These checks establish syntax/types, not rendered motion.
3. `git apply --check docs/developer/final-acceptance/wave-03-17/localization-direction.patch`
   exited 0; `patch-check.txt` is empty success output. No apply was performed.

No failed component/build/test invocation occurred. Initial read-only discovery
commands found no Node 22/24 executable at the two queried Homebrew paths and one
old preview path; that discovery output was not interpreted as validation.

## Reused evidence and hashes

Read AGENTS.md, final-acceptance ledger, assignment, both prior reports/results,
wave-02 successor protocols, parallel-14 reconciliation, and coordinator integration
evidence. Starting scope remains 153 A / 20 editor V / six future, not 282.

`input-receipt.json` records exact current/proposed hashes, HEAD/branch, four prior
report/result hash comparisons (all match), and prior wave/coordinator comparisons.
The current ICU, adapter, Provider, ThemeScope and translation fixture hashes match
parallel-14's saved inputs. SideNavigation implementation/CSS, direction icons and
ThemeScope match wave-02-06. Selected existing compiled ICU, Provider and
SideNavigation class-map output match coordinator hashes; this does not certify
an unapplied CSS fix. Existing ICU variable/default parsing and dated unit evidence
are retained without a duplicate all-library formatter scan or broad suite.
The coordinator's seven-case picker/grid browser run does not cover these new
translation/motion assertions; no such result was inferred.

## A-H-08 — partial

Original: “Validate ICU variables, pluralization, selection counts, date/number
formatting, long labels, RTL, and pseudo-localized stories.” Historical status: open.

Concrete progress: new native specs and fixture additions cover the prior named
pseudo/Arabic/count/clear/date/number successors; deterministic current-built ICU
and public Provider server evidence passes. The new date/number assertion pins UTC
in the browser context; it does not change the formatter's runtime-zone contract.

Still required: integrate patch, build fresh fixtures on supported Node, execute
three focused scenario cases in the required desktop engines, inspect retained
reflow screenshots, and obtain actual English/Arabic spoken count/clear observations.
`operator-record.md` is explicitly unperformed and provides exact steps and empty
observation fields. DOM live-region updates cannot establish speech. No full leaf
closure is proposed from unapplied patch or SSR results.

## A-C-09 — partial

Original: “Use logical properties and direction-aware icons/placement for RTL; do
not assume physical left/right always means start/end.” Historical status: open.

Concrete progress: exact SideNavigation forward/back sign omission is corrected in
the unapplied patch. Existing logical sizing/borders, direction-aware icons and
physical viewport/hit-test coordinates are preserved. Two focused native cases
cover rendered scope direction, motion reversal, Back focus and reduced motion.

Still required: integrate/build and execute those cases. Existing editor V RTL
leaves and broader candidate portal/arrow/placement checks remain separately open;
this bounded navigation change cannot certify them. Relevant existing native
specs include `inventory-align-direction.spec.ts`,
`batch08-selector-direction.spec.ts`, and `popover-native-collision.spec.ts`.
Reuse unchanged receipts when attributable; execute only changed or missing scopes
against the coordinated candidate. No fabricated editor, portal, device or AT
result is supplied here.

`validation-plan.json` gives exact integration/build/native commands, assertions
and scope limits. `focused-native.config.mjs` starts no server, requires a leased
loopback host and rejects user port 3000. No install/build/registry generation,
server startup, Git mutation, message to another chat, or subagent occurred.
