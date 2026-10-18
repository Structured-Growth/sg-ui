# Checkpoint regression findings — 2026-10-18

These findings belong to the existing grid/docs acceptance work; they do not
replace or waive a required checklist item.

- BUG-0014 (P2): mount the catalog AppDataGrid performance workload with 10,000
  rows, twenty columns and a 200-row page. The new selection-header DOM ref in
  state triggers another complete collection render. Same-host median initial
  frame opportunity increased from 354.4 ms to 476.1 ms, with all twelve samples
  retained. Expected: observe the header without a redundant state-driven grid
  render. The fix uses a stable callback ref and disconnects its prior observer on
  replacement/unmount. 39 focused unit cases and twelve trusted-target browser
  executions pass; repeated production measurement remains pending. Evidence:
  performance-05/comparison-catalog.json, grid-startup-unit-receipt.json,
  native-06/execution.json. Linked coverage: ownedGridInteraction.test.tsx,
  current-target-sizes.spec.ts, production measure-browser.mjs.
- BUG-0015 (P2): open the one-calendar preset reference at a 1440 px viewport.
  With hidden endpoint fields the natural calendar/preset footprint is 396 px,
  but the old 560 px container breakpoint forces the presets into a full row.
  Expected: side placement when the two actual panels fit, wrapping in DOM order
  when constrained. Reproduced by the preserved calendar-presets.spec.ts horizontal
  geometry assertion; reviewed docs-02/traces/calendar-presets-range-pre-fd692--responsive-draft-ownership-chromium/test-failed-1.png.
  Applied correction: native flex wrapping with a growing 12rem preset basis;
  remove the obsolete forced-full-row rule. Narrow stacking, keyboard order,
  preset selection, exact draft endpoints and host Apply/Cancel remain required.

BUG-0015 correction passes both one/two-month preset references, side/end placement,
RTL keyboard order and narrow layouts in docs-03. Native-08 passes twelve
light/dark calendar cases across all three engines. The documented clean preset
contract keeps descriptions associated for AT; its visible labels, rather than
the clipped description boxes, receive the preserved narrow-boundary check.

- BUG-0016 (P2): type a filter into a controlled ComboBox, select the matching
  option by keyboard, and accept its ID in the host. The deferred query-label
  effect presents a second input edit to the interaction owner and reopens the
  menu. Reconcile changed selected ID/label before rendering that owner instead;
  preserve the rejecting host's current label and form value. The existing native
  direction/keyboard flow remains the browser regression. One focused controlled
  selection smoke joins the retained unit set.
- BUG-0017 (P2): select a date-range preset then press Escape in a picker. The
  preset collection consumes Escape to clear its selected key, while its controlled
  draft retains the range, leaving the outer dialog open. Preset selection now
  leaves Escape to the containing overlay. The existing picker smoke adds the
  no-commit/dismissal check before its Cancel/Apply/reset sequence.
- BUG-0018 (P2): forced-color selected month/year/quarter buttons use Highlight for
  their inset marker against ButtonFace. Some system palettes provide less than
  3:1 contrast. Use the corresponding system ButtonText color; preserve OS palette
  ownership, geometry and independent focus rings. The retained structural and
  current-state native checks continue measuring the actual resolved contrast.

Native-09 retains 89 successes and19 failures without retries. Its32 popup
collision cases and16 control-geometry cases pass; remaining failures identify
additional historical calendar configuration or semantic locator drift and the
ComboBox/preset issues above. Fixture-only corrections pin historical navigation
and field presentation, keeping the new public defaults exercised in the245-case
production docs suite. The grid focus host now has separate selected/unselected
scenarios so later acceptance does not change earlier tests' initial state.

Native-13 passes155 cases with eight existing Chromium-only protocol skips and
retains twenty failures. Calendar keyboard entry, heading geometry, exact field
ordering, pointer hit sizes and popup gaps now pass across all three engines.
The additional Firefox failures expose BUG-0018 in the generic menu, navigation,
editor toolbar and color swatches: selection markers now use CanvasText or
ButtonText as appropriate while independent OS focus colors remain unchanged.

WebKit media emulation reports forced colors but CSS.supports reports no
forced-color-adjust property. Following the previously accepted wave03 system
indication proof, the corrected checks retain keyboard, selection, authored
system-color geometry and glyph checks and annotate only the unsupported UA
paint/adjustment branches. They do not skip whole forced-color cases or claim
paint contrast in an unimplemented engine branch. macOS WebKit link traversal
uses native Option+Tab rather than skipping the link.

Code-node typing can split a leading space into its own native history group.
The structured-content proof still sends the original actual keystrokes, records
that exact intermediate document, and requires full original-byte restoration
within those at most two observed groups. Redo restores the same intermediate and
final bytes, with all unrelated rich nodes and read-only/reload assertions retained.

Native-14 passes78 cases and retains three failures: the remaining rich/floating
formatting toolbar marker slots share BUG-0018 and receive the same ButtonText
correction. WebKit's toggle case also exposes an authored forced-media mismatch:
selected toggles use ButtonText/ButtonFace while unselected peers keep branded
paint when the engine lacks UA adjustment. Apply the same system text/surface to
all toggle hover/press states, retaining double selection geometry and separate
Highlight focus. This correction keeps the existing peer/color/contrast assertions.

The native-16/17 toggle captures retain the original screenshot assumptions:
macOS system ButtonFace is gray rather than white, and an initially suspected RTL clip discrepancy. Native19
metrics rule out a capture failure: the light label has measured9.27:1 paint
contrast. The dark-context failure is the old computed-style helper treating
translucent system colors as opaque RGB. The toggle proof therefore uses actual
screenshot glyph contrast, retaining raw styles for review. The corrected glyph proof crops the actual viewport
bitmap at the observed text Range, requires at least five pixels at each end of
the measured luminance distribution and retains the actual >=3:1 painted contrast
assertion. Invisible same-color text still fails; a gray system backplate does not
need to contain pure-white pixels. Both original full screenshots were reviewed.

- BUG-0019 (P2): direct PR CI uses github.sha, which identifies GitHub's synthetic
  merge commit while the producing run's API head_sha identifies the proposal.
  This prevents consistent immutable-head artifact verification. Select the
  proposal head explicitly for direct PRs and assert it in all runtime/native/docs
  jobs; keep exact-ref reusable callers and push-event SHA behavior. The current
  policy suite adds a mutation check for both checkout and its expected-head env.
