# Wave 02-07 — styles, interaction risks and performance

Date: 2026-10-16. Modified `dev`, base HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. **Recommended: three complete,
seven partial, zero blocked.** Completion concerns the full original requirement,
not historical checkbox status. Only this owned directory was written; source,
shared checklists/counts, previous reports, release state and user server are untouched.
Coordinator review is required to reconcile shared acceptance counts.

| Leaf | Status | Concrete result |
| --- | --- | --- |
| A-C-13 | complete | Evaluated runtime color-mix/OKLCH versus the owned literal palette pipeline; retain reviewed literal states and existing named contrast/fallback behavior. |
| A-C-14 | partial | No mandatory anchor/style-query/view-transition dependency; identified a `:has` focus-fallback gap and supplied an unapplied review patch. |
| A-C-15 | partial | Classified every outline-suppression candidate in the retained library CSS set; empty grid-shell fallback has no local focus indicator, and decorated input enhancement needs a safe baseline. |
| A-C-16 | partial | Supplied the previously missing interruption/cancellation/focus specification; current native execution/adoption still required. |
| A-C-17 | partial | Reconciled token/portal source contract; supplied one combined menu/tooltip/editor/dialog hit-test/focus case missing from prior subsets. |
| A-C-19 | partial | Enumerated actual inline-style surfaces and defined a response-header CSP verification protocol; no strict-CSP test result exists. |
| A-C-20 | partial | Retained distribution/compiler evidence; current stylesheet differs from FA-01, and current-artifact consumer dedup/pruning proof remains outstanding. |
| A-C-21 | complete | CSS Modules remains the deliberate default, compiled by package tooling without a consumer authoring-toolchain requirement. |
| A-B-09 | complete | Six-part source risk audit delivered below with two concrete focus findings and explicit native/label/contrast/sticky follow-ups; no conformance claim. |
| A-B-10 | partial | Added fresh bounded local SSR timings and a stylesheet-byte reference; production consumer/editor bundles and browser initial/update distributions remain unmeasured. |

## Evidence, execution and input limits

Read every original leaf from the current `react-aria-hardening-tasks.md` (B-09/10
at lines 164–165; C leaves at 207–214). Reused FA-01–04, the previous parallel-07
architecture report and parallel-05/09/10/11/12 scoped results. The older
`parallel-batch-105/acceptance-evidence.md` explicitly leaves C-16/17/19/20 partial;
[execution-contracts.md](execution-contracts.md) advances its specific successors
with a full transition table, one combined overlay sequence, CSP header protocol
and consumer/measurement receipt design. It does not repeat their missing-run
finding as if it were new execution.

New checks actually performed:

1. `python3 docs/developer/final-acceptance/wave-02-07/inspect.py` — exit 0.
   [inspection.json](inspection.json) hashes 162 selected source/config/docs inputs.
   It reuses parallel-11's 86 CSS paths and FA-02's saved import graph; it does not
   recapture the repository inventory. Differences from retained FA-02/04 in this
   scope: hardening checklist, final-acceptance ledger and **TextArea.module.css**.
   All 45 source inputs in the SSR closure match the saved inputs; none of the four
   concurrently repaired components belongs to that closure. TextArea CSS is
   reviewed at its new recorded hash, not grandfathered by old CSS evidence.
2. The scoped feature review finds **zero runtime color-mix/OKLCH matches**, one
   `@supports` rule, zero anchor/style-query/view-transition feature matches,
   five outline-suppression declaration lines, 48 focus-indicator candidate lines,
   12 motion-related lines in four files, eight z-index lines and two sticky rules.
   These are textual feature/candidate counts, not a parser completeness guarantee
   or counts of unique components. Relevant actual source was read and classified.
3. Ran existing `measure-migration-proofs.mjs` by absolute path with **cwd inside
   this owned directory**, no `--record` and no consumer arguments — exit 0 in under
   one second. [ssr-reference.json](ssr-reference.json) is the full raw output;
   [ssr-stderr.txt](ssr-stderr.txt) is empty. The script created only empty nested
   `docs/developer/migration-baseline` directories here; it never overwrote the
   canonical old record. This was a new bounded measurement, not a rerun of a
   completed full/unit/browser/consumer suite.
4. [ssr-attestation.json](ssr-attestation.json) verifies all 45 source inputs and
   selected compiled JS remained byte-stable across that run. The compiled JS/
   declarations/class maps in this closure match FA-01. **styles.css does not**:
   the current hash is `c57e98081847b7a4d9474c3085cb410e570de1393f79dc38fcdc2421dda4547b`.
   CSS is not loaded by this renderToString benchmark. This separately changing
   output is not represented as a current package/build/consumer pass.
5. `node .../verify-focus-patch.mjs` — first invocation failed before checking CSS
   because its new helper had an incorrect relative module-resolution path. Corrected
   that helper inside this directory; the next invocation passed. It parses the
   original and in-memory candidate with installed PostCSS, confirms suppression
   is guarded only in the candidate and the baseline input ring remains. Result:
   [focus-patch-structure.json](focus-patch-structure.json). It never applies the
   [patch](proposed-focus-fallback.patch), compiles shared output or proves native
   computed focus. This is the only new isolated structural assertion.

New local Node execution used **26.5.0**, Darwin arm64, Apple M4. It supplies local
analysis/SSR/structural evidence only, not supported Node 22/24 matrix acceptance.
The retained FA-04 Node 24 invocation passed foundation tests/typecheck and later
failed four calendar suites; only its documented affected rerun reconciles those
failures. Unchanged token/compiler and relevant unit evidence is reused; no full
suite was repeated. Older native/CI summaries remain tied to their recorded heads
and sometimes absent raw `/tmp` artifacts. No remote CI was queried. No build,
installation, pack, native/browser/consumer suite or shared output mutation ran here.

## Final concurrency delta

After the measurement and initial report, the final hash check detected later edits
in AGENTS, DateField.tsx, DateFieldControl.tsx, TextDateField.tsx and TextArea CSS.
[post-review-delta.json](post-review-delta.json) records old/new SHA-256 values and
any selected output changes at that check. Latest AGENTS additions were read; they
describe the owned Clear guards/TextArea decorative frame and do not change this
report-only task. The source/JS stayed stable **during** the SSR measurement, as
attested, but the later three DateField edits affect the rangeTwoMonths workload.
Its timing represents that measured snapshot, not the newer source. No other
newer source/build synchronization or current-head package/SSR pass is inferred.
The source audit is likewise bounded to its recorded inputs, with later changes
explicitly retained rather than silently extending its scope.

## A-C-13 — complete: evaluate color-mix/OKLCH without regressing fallback

Full original requirement: evaluate color-mix/OKLCH for palette tooling/state
colors and preserve tested fallback/contrast behavior for supported browsers.

The evaluation and bounded decision are recorded in **D13** of execution-contracts.
The current `tokens.mjs:29–44` accepts six/eight-digit hex colors, resolves owned
aliases and rejects unsupported values. `tokens.json` owns explicit identity/state
values; components consume aliases. No inspected shipping CSS requires either
color function. Runtime interpolation would require a new token grammar/fallback/
gamut and named-pair review without an evidenced current consumer benefit. Optional
offline palette authoring can remain a future experiment emitting the same literals.
Retain literal shipping colors and explicit hover/pressed/selected roles.

`tokens.test.mjs:24–57` protects named light/dark text/action/error/focus pairs;
FA-04's 32 foundation-test receipt includes this passing case at unchanged token/
compiler/test hashes. Generated tokens supply the actual literal/variable fallback;
forced-color overrides remain system-owned. The evaluation adds no optional syntax,
new supported-browser range, runtime palette algorithm or claim about arbitrary
host overrides. All-browser rendered contrast remains a separate obligation.

Required successor: none for this evaluation leaf. Future runtime color enhancement
must start with a literal baseline and an exact feature guard plus both branches'
named-pair checks. Those future features are not implemented or accepted here.

## A-C-14 — partial: progressive enhancement

Full original requirement: define progressive enhancement with @supports and avoid
unconditional limited-support anchor positioning, style queries or transitions.

Source contains no listed experimental positioning/query/transition dependencies;
overlays retain JS measurement/placement. `Dialog.module.css:21` has a negative
dvh support fallback. D14 now states a concrete base-interface/enhancement contract.
However, **F14-01** is an actual conditional cascade gap: TextField lines 26–27
remove the input ring outside any guard but replace it using `:has`. If that
selector is unsupported, the replacement is ignored and more-specific suppression
beats generic line 33. No current configured browser failure or legacy support
promise is inferred from this source fact.

The unapplied patch guards only suppression and replacement with
`@supports selector(:has(*))`; its PostCSS structure passes the isolated assertion.
Read-only/forced-color/source-context behavior still needs review when integrating.
Full/XL Dialog dvh block-size fallback policy is also unspecified; the existing
negative rule only supplies generic max-block-size.

Required successor **W207-C14**, fully specified in D14: adopt current enhancement
policy, review/integrate the candidate or explicitly state the selector baseline,
resolve full/XL viewport fallback policy and retain targeted native/fallback evidence.
No shared source was changed and this leaf is not closed by an unapplied patch.

## A-C-15 — partial: preserve visible focus

Full original requirement: use :focus-visible or owned accessible focus attributes
and preserve visible focus when replacing outline suppression.

Owned CSS consistently uses :focus-visible/data-focus-visible/data-focused and
control token rings. The B-09 table below classifies all five suppression lines.
Editor typing's unoutlined boundary is deliberate, with keyboard entry and its
separate named scroll viewport retaining a ring; `DocumentContentEditable.tsx`
uses useFocusRing rather than turning every text insertion into navigation focus.
`editor-focus-presentation.spec.ts` explicitly distinguishes typing from Tab entry,
but its source alone is not a fresh browser result.

**F15-01**: AppDataGridShell `.content` removes the outline and has no local
replacement selector. It is a real potential programmatic focus target on empty
page/card fallback (`AppDataGridShell.tsx:174–189,224–225`). Normal row/card targets
have rings. D15 records a reproducible host-final-card-removal/page-empty sequence
and exact computed/focus/clipping assertions, not an asserted native failure.
F14-01 also prevents an unconditional all-supported-fallback conclusion.

Required successor **W207-C15**: bounded empty-shell/focus characterization and fix
or alternative focus target if confirmed, plus existing decorated field/menu/editor
native checks in light/dark/forced colors. Keep keyboard indicators visible without
reintroducing a box during ordinary typing. Existing jsdom focus assertions cannot
establish ring visibility, clipping or spoken feedback.

## A-C-16 — partial: motion interruption and focus timing

Full original requirement: define reduced-motion transitions, interruption/
cancellation and focus timing without adding a motion runtime solely for CSS effects.

Button/Progress/SideNavigation/IconPanelNavigation are the only motion-bearing CSS
files in this inspected library set; each has a reduced-motion rule. Shared navigation
motion resolves to 120ms; button spinner and indeterminate progress have explicit
status-animation durations. Collapse uses hidden/unmount immediately. The manifest/
lockfile search has no dedicated motion/framer/gsap/react-transition package.
Dialog's removed-opener repair waits one frame after native restoration/inert
cleanup and preserves valid host/other-overlay focus; it does not await exit CSS.
Tooltip guards callbacks from detached/key-replaced triggers.

Historical batch-105's missing full specification is now supplied as **D16's
seven-row transition/ownership table**: interruption, live preference changes,
rapid forward/back, rail replacement/close, Collapse, dismiss/reopen/host replacement,
and delayed Tooltip cleanup. Existing `display-preferences.spec.ts:108–125`,
`inventory-modal-boundaries.spec.ts`, Dialog/Tooltip/IconPanelNavigation tests cover
subsets. Current-head rapid reversal/combined focus native evidence is still absent.

Required successor **W207-C16**: adopt the table in maintained guidance and execute
only the missing bounded sequences plus existing preference/modal cases, with
source+host hashes and frame/media/focus observations. No old reported CI result is
promoted to new three-engine execution; devices/AT remain independent.

## A-C-17 — partial: stacking and portal ownership

Full original requirement: specify overlay stacking/portal ownership without
maximum-integer z-index values and test nested dialog/menu/tooltip/editor overlays.

`react-aria-proof-controls.md:65` and `ThemeScope.tsx:23–49` define nearest scope
propagation while excluding ancestor layout styles. Tokens resolve overlay=1400,
popover=1410. The eight z-index lines comprise the seven overlay/toolbar uses of
owned layer variables and one local sticky month-header z-index 1. No inspected
maximum-integer layer is used. Host arbitrary layer overrides remain host decisions.

Existing acceptance nested-dialog/popover and portal-direction tests plus separate
Tooltip/editor tests do not demonstrate the complete combined stack, pointer hit
testing, background inertness or editor selection return. Prior partial remains
open. **D17** supplies a single public-component composition and five exact stages,
including scope change/sibling isolation; it can share P10-D16-01 evidence.

Required successor **W207-C17**: register that native fixture, add the bounded
combined spec and execute at a stable host/build in required engines. Retain portal
parents, computed layers, actual hit targets, dismissal order and focus/selection
results. Source z-index ordering alone is not proof of visual ownership.

## A-C-19 — partial: CSP verification

Full original requirement: verify CSP including inline styles needed for placement/
dynamic values; do not claim strict support without tests.

Current guide explicitly leaves strict CSP unverified. Source confirms ThemeScope
inline custom properties, host Dialog slots, Popover underlay/placement/trigger
width, engine collection/search placement, rail width and floating editor toolbar
left/top/maxWidth. Native style escape hatches and Lexical formatting/images are
additional host policy inputs. Compiled CSS and absence of a runtime stylesheet
engine do not remove these surfaces or establish a particular header's behavior.

Prior batch-105 had no HTTP-header consumer/violation result. **D19** now specifies
candidate restrictive/allowed-inline-style/image policies, the exact dynamic
surfaces to exercise and required evidence: actual response headers, early
securitypolicyviolation capture, runtime errors, startup/geometry/focus outcomes,
policy exceptions and immutable package/source hashes. Policies are proposals for
owner review, not certified deployment settings; no script-unsafe allowance is
implied by inline-style placement.

Required successor **W207-C19**: owner selects supported header policy/asset rules;
coordinator allocates pack/browser window for the isolated production HTTP fixture.
Keep restrictive characterization failures visible. No test or policy approval was
invented here; strict CSP stays unclaimed.

## A-C-20 — partial: distribution and consumer CSS/tree shaking

Full original requirement: verify compiled CSS distribution, consumer production
builds, deduplication/tree-shaking and retention of CSS as a side effect.

FA-04 and parallel-11 already establish the dated compiler/distribution contract:
PostCSS Modules compiles namespaced class maps and one public stylesheet; package
exports `./styles.css` and marks `./dist/**/*.css` side-effectful. Unchanged compiler/
manifest tests are retained. `test-foundation-consumer.mjs:184–209,286–296` implements
ten isolated Vite entry graphs, one retained CSS asset, engine-boundary and unused
vector pruning assertions. Their existence is not current execution.

The shared stylesheet currently differs from FA-01; FA-04 packed byte equality
therefore cannot certify these newer bytes. This wave measured it read-only as
262,149 raw bytes / 21,859 Python gzip level-9 bytes, a **distribution artifact**
reference, not consumer transfer or deduplication proof. Source also has changed
TextArea CSS; no source/build synchronization claim is made for the four repairs.

Required successor **W207-C20-B10**, detailed in D20: one frozen tarball/build receipt
with serial existing React 18/19 foundation/editor runs, saved module IDs/assets,
required token/classes and pruning, plus a bounded mixed/repeated/root/granular/
dynamic import case if broader deduplication is claimed. Preserve CSS side effects.
Coordinate with I-S1 so the same current-artifact receipt serves both scopes.

## A-C-21 — complete: CSS Modules authoring decision

Full original requirement: keep CSS Modules default; adopt vanilla-extract/utility
authoring only for evidenced benefit without imposing its tools on consumers.

`react-aria-architecture.md:4,112–124` and component architecture explicitly select
owned compiled CSS Modules. `css-modules.mjs:1–33` runs PostCSS/Modules during the
package build, emits ESM class maps and a public stylesheet. Metadata places those
authoring tools in development dependencies; consumers import compiled ESM/CSS,
not CSS Modules source. Retained FA-04 pipeline cases and parallel-11 prove that
contract at their bytes; new TextArea CSS does not introduce another authoring system.
No vanilla-extract/utility runtime/toolchain dependency was found in the inspected
library/root metadata/lockfile. The docs host may own its unrelated application
build tooling; that is not a library-consumer requirement.

Decision: retain this default. No evidenced benefit justifies introducing another
CSS authoring system in this task. Future proposals must demonstrate consumer
benefit and preserve toolchain-free compiled consumption, tokens and cascade.
Required successor: none for this decision leaf. C-20's current production-consumer
and CSS-asset evidence remains partial independently of this authoring decision.

## A-B-09 — complete: documented source risk audit, not conformance

Full original requirement: audit focus removal, hover-only triggers, drag-only
interactions, labels, contrast and sticky content; document findings without
claiming conformance from source inspection.

| Audit domain | Current evidence and disposition | Exact follow-up boundary |
| --- | --- | --- |
| Focus removal | Five suppression lines: editor editable -> owned keyboard ring and named viewport; TextField decorated input -> ancestor ring with F14-01 conditional gap; Menu container/item -> item[data-focused] ring (empty-container focus still needs native review); AppDataGridShell content -> F15-01 possible empty-focus gap. Other inspected controls use native/owned focus selectors. | W207-C14/C15. Retain distinct text-editing and navigation behavior; computed ring/clipping/hit-testing is native work. |
| Hover-only triggers | Tooltip has keyboard focus/description/Escape unit cases as well as hover. Actual actions remain Button/IconButton. CSS hover rules set feedback; the only fine-pointer hidden scrollbar thumb also appears on focus-within/activity and remains native/touch/forced-color visible. Select's hidden sizer, outside-month cells, inactive overflow tabs and hidden panels are sizing/inactive-content cases, not found hidden action affordances. | No concrete hover-only action defect established in this scope. Keep touch/keyboard actual affordance checks and missing contextual-label review; do not treat supplementary Tooltip on a disabled native button as a focusable control. |
| Drag-only interactions | Grid owned interaction exposes named Move up/down controls and keyboard column resizers. RangeGestures has Shift/Alt arrow alternatives, Escape/pointercancel and source ownership cleanup; typed fields/presets are additional paths. Existing reorder/native cases separate touch Move from real touch dragging. | No solely-drag primary operation identified in these inspected implementations. Native keyboard equivalence, physical long-press drag and spoken announcements remain open; source handlers do not prove them. |
| Labels/descriptions | Reuse parallel-05's contract audit: required field/IconButton naming, host row labels and translated action defaults are present; generic Button/Dialog exceptions, repeated/custom row actions and all-export compound-description ownership still need their dedicated audit. Tooltip is supplementary text, never the sole visible action API. | Preserve A-A-09's explicit consumer type/all-export naming successors. This is a risk finding, not a blanket all-library naming pass or AT output claim. TextArea BUG-0009's old icon finding is being repaired separately, not recertified here. |
| Contrast | Reuse unchanged token named-pair tests and parallel-08/09/10 findings. Literal alias graph, generated state roles and system forced colors are intentional. Native inline/custom callback content, host tokens, disabled opacity, decorations and all state/density combinations exceed those selected pair tests. | Keep rendered named-pair/increased/forced-color/device/AT acceptance separate. D13 adds no runtime mixing and therefore does not expand tested pair claims. |
| Sticky/obscuring content | Two sticky library rules: Tabs list at block-start 0 and scrolling calendar month header at 0/z1. Dialog and grid shell use bounded flex/scroll areas rather than adding global sticky chrome. Existing enlarged modal/native focus specs check subsets; editor floating toolbar and own scrollports can still occlude content. | Retain exact native enlarged-text/spacing/focus/hit-test receipts for tabs/month headers and nested scrollports. Parallel-09's actual zoom/font-substitution and the 20 editor V leaves stay open. |

This completes the requested **audit and findings** deliverable; it does not fix or
close the independent visible-focus/labels/contrast/reflow/native obligations.
Sources and all candidate lines are in inspection.json; contracts and test paths
are spelled out above and in results.json. The audit used the existing complete
CSS path inventory, not a fresh conformance tool or an assistive-technology session.

## A-B-10 — partial: added current local SSR measurements

Full original requirement: measure production consumer bundles/CSS/editor/grid
imports, initial render and interactive updates with reproducible fixtures.

Fresh local SSR evidence uses the existing deterministic workload and its three
warmups/nine samples. Values are milliseconds; the script's legacy `p90Ms` field
is actually the **maximum of nine sorted samples**, as its methodology states.

| SSR workload | Median | Maximum | HTML bytes |
| --- | ---: | ---: | ---: |
| 100 Buttons | 7.65 | 8.96 | 25,655 |
| 40 fields | 2.94 | 7.08 | 16,310 |
| 200 async options | 7.85 | 9.74 | 76,207 |
| 1,000 grid rows / 50 rendered | 16.97 | 30.34 | 88,237 |
| Two range-calendar months | 3.93 | 5.21 | 25,327 |

All samples use one Provider and built direct modules. The 45-source closure and
compiled JS stayed stable, none is a concurrently repaired component, and stderr
is empty. This supplements the old 2026-10-06 Apple M4/Node26 proof record. It is
not browser initial rendering/hydration, interaction latency or an editor workload;
`consumers` is explicitly empty. New CSS bytes are the separate artifact reference
under C-20, with compression settings different from the old Node default gzip.
The old script labels future optional consumer sizes in its general methodology,
but no consumer arguments/assets were supplied in this execution.

The medians lie below the historical machine-specific investigation bounds, but
this neither proves regression freedom nor establishes production budgets: library
content/output and environment have changed. Old consumer gzip sizes and old native
CI's 15-second grid hang smoke remain historical only. Full original leaf stays open.

Required successor **W207-C20-B10**: immutable production consumer asset/module maps,
separate basic/grid/editor byte measurements, editor SSR workload if claimed, and
browser first-usable-render/post-action distributions with precise endpoints and
hardware/browser/source/host receipts. Correct the measurement guide's workspace
invocation/output path before recording a new canonical baseline; this run deliberately
used an owned cwd without --record. No blanket performance, memory or device claim.

## Handoff and restrictions

[results.json](results.json) contains one record per assigned ID, exact original
wording, checks, source/test references, limits and required successors. The
[execution contracts](execution-contracts.md) and unapplied patch make remaining
work concrete for coordinator assignment. No required native/device/AT/legal/owner
approval or future production gate is waived. All 20 editor V leaves remain open.
