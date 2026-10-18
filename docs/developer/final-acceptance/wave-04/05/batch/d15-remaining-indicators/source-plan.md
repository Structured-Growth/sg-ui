# D15 remaining structural indicators: source/light handoff

This finite task addresses HierarchicalMenu native current-page presentation and
MonthPicker/YearPicker selected choices. It does not close all D15. No ledger,
Git index/commit/branch/release, paused Apple file, build, host or baseline was
changed by this task.

## Concrete source correction

HierarchicalMenu positions its existing item and adds an absolute double start
bar for aria-current=page. The bar uses the existing menu-text component alias;
it does not reserve new layout space or shift label/icon content. Existing focus
outlines remain on the focused element. In forced colors the bar uses Highlight,
and the old selection-only focus-shaped outline is removed; actual focused
items retain their previous Highlight outline. Current page and keyboard focus
therefore remain separate structural presentations.

MonthPicker and both YearPicker button render paths add a private choice class
from their existing shared PeriodPicker CSS module. A selected choice gets an
absolute two-pixel inset ring, inheriting the Button's owned foreground through
currentColor. The ring uses Highlight in forced colors. It is noninteractive,
does not alter layout, and does not replace Button's independent focus outline.
No public prop/type/export or availability/selection callback is changed; text
entry mode has no choice ring. Existing selected filled tone remains.

The implementation uses owned aliases/inherited Button foreground and native
system colors, no palette literals or forced-color-adjust suppression. No new
strings or translation keys are needed for the CSS-only indicator. Existing ARIA
current/pressed semantics remain authoritative. Updated component usage and the
current applicability note describe the source change while keeping native and
broader-state acceptance pending.

## Completed light checks

Node 24.19.0, HEAD and exact working files are recorded in evidence.json:
- The three existing unit files pass all nine existing cases; no new test cases.
  Their meaningful cases now additionally verify selection survives focus
  movement: native menu Home to Help; month March to April; paged year 1984 to
  1985. Existing callbacks, constraints, read-only and keyboard cases are retained.
- Library, browser-spec and private-fixture TypeScript checks pass.
- Owned foundation import/layer/token guard and git diff --check pass.
- Component-usage JSON parses; fixture registry generation yields 499 IDs.

The native fixture uses one explicit production ThemeScope forwarding requested
theme, density and direction, avoiding the nested Provider reset found in the
prior D15 host. It supplies constrained/disabled month/year choices and native
current/noncurrent links. No live public playground or snippet prop is changed:
all existing source-backed component examples render these owned indicators.

## Exact proposed native lane, after source review

No build or browser run has started. Proposed coordinated lane:
1. One fresh library build to compile the CSS Modules and internal classes; then
   catalog:generate/check from fresh declarations. There is no public API or
   component composition change; generated files are expected to remain stable.
2. One fresh immutable private fixture build, with canonical legacy/heavy/6173
   claims; never use the user's 3000.
3. Run only structural-selection-indicators.spec.ts on Chromium, workers=1,
   retries=0. Exactly six cases: menu/month/year × standard/forced colors.
   Each observes only two combined contexts: light+compact+LTR and
   dark+comfortable+RTL. This is not a Cartesian matrix or all-browser claim.
4. Verify actual forced-colors media state, computed direction/control-height/
   color-scheme, structural pseudo geometry, independent keyboard outline,
   unchanged element dimensions, retained ARIA selected/current state and
   disabled constraints. Month/year activation transfers the indicator without
   geometry change. Year default scrolling is the native primary flow; the same
   private class covers paged mode whose meaningful unit case is retained.
5. Retain the context/geometry JSON and twelve targeted screenshot attachments
   (one per observed context), review the images and preserve any failures.
   Unsupported forced-color emulation is explicitly skipped, never replaced by
   standard mode or counted as passing forced-color evidence. No baseline update.

All six browser cases are authored/typechecked, not executed. Additional engines,
all variants, increased-contrast palettes and broad state applicability remain
separate from this finite task. Source review and coordinated lane admission are
the next actions; no permission question is needed for already authorized work.
