# Wave 03-10 — touch targets and pointer alternatives

Four assigned leaves remain **partial**. This packet supplies a ready-to-apply nine-file patch for two concrete gaps, four focused unit cases, three native browser cases and exact coordinator validation steps. No production files, central ledgers or acceptance counts were changed. The coordinator must integrate and validate the patch before any runtime closure.

## Substantive changes

`implementation.patch` and `proposed-files/` contain:

- TagGroup remove buttons now use the existing minimum-target token in both dimensions. Current compact touch styling raises height to 44px but leaves width at the compact control height (32px before padding/border effects). The proposed rule uses `max(control-height, control-minimum-target-size)` for width as well. No pointer media query or new token is duplicated.
- Both DataGrid renderers gain a private shared Width popover with exact CSS-pixel entry and Narrower/Wider by one pixel buttons. The latter provide a single-pointer path without typing or dragging. Bounds/fixed columns are respected. Requests use existing complete-width snapshots and the shared flexible-fill retention policy. Reopening reads effective host width, preserving rejection and external changes. The generic renderer measures the actual column when opening, falling back to configured state for an unmeasurable table; the catalog renderer uses its current measured allocation.
- Two new test files provide four cases: exact/step widths and host rejection; invalid/bounded/fixed operations; one shared caller test for each renderer checking sibling widths and rejecting-host control. No interaction engine is mocked.
- The existing docs-owned TagGroup fixture gains independent compact/comfortable auto/touch scopes containing Button, IconButton, Checkbox, Switch, Menu and removable tags. The browser spec measures actual rectangles/hit testing/neighbor overlap, asserts activation and a surviving tag's focus ring, and separately verifies a one-pixel width change without drag in each grid renderer. These cases are prepared, not executed.
- Component-specific AppDataGrid/DataGrid usage guidance describes the width actions, host snapshot ownership and effective-width behavior. Existing examples acquire the controls through the public components. Generated composition/API metadata remains coordinator work after a fresh package build.

## Evidence and validation

Read AGENTS.md, final-acceptance ledger, assignment and prior reports/results, coordinator integration evidence, README, migration and component architecture guidance. `input-evidence.json` records sequential SHA-256 captures and receipt checks. All eight assigned prior report/result references match their assignment hashes. Of 106 inspected source/test/style inputs, all 26 also present in wave-02-09 match; all 45 present in coordinator inputHashes match. The other inputs have no comparison entry in those bounded baselines. This does not establish a whole-host/transitive output identity.

Reused evidence remains unchanged and bounded: wave-02-09/15 source/retained test analyses; coordinator BUG-0008–0012 integration receipts; existing reorder native cases, including explicitly emulated touchscreen Move behavior. Coordinator's 21 desktop-engine executions concern its seven named integration cases, not a new target-size audit. No old FA aggregate count was recast as a fresh test pass. No shared build, install, browser/server or broad suite was launched; user server3000 was untouched.

Executed on bundled **Node 24.19.0**:

- `node docs/developer/final-acceptance/wave-03-10/check-proposed.mjs`: zero syntax/transpile diagnostics across seven proposed TypeScript files; virtual-overlay production typecheck passes against current transitive source, with no emission. Receipt: `typecheck-proposed.txt`. The first harness invocation omitted project ambient CSS and node type roots; preserved in `typecheck-harness-first-failure.txt`, then corrected in the checker.
- `git apply --check docs/developer/final-acceptance/wave-03-10/implementation.patch`: passed, read-only. No patch applied.
- Focused unit attempts used the inspected `/tmp/sgui-calendar-validate.mjs` lease wrapper. `unit-proposed.txt`, `unit-proposed-run.txt`, `unit-final.txt` and `unit-assertions-fixed.txt` preserve occupied-lease refusals. `unit-harness-first-failure.txt` preserves initial mirror bare-import failure; `unit-assertions.txt` preserves a directory-import resolution failure. The isolated config now resolves package imports through the real workspace and checks that fallback paths are files. **No unit assertion ran; no unit pass is claimed.** Run the final config under a free lease or integrate and run the normal colocated suites.

`validation-plan.json` names all commands, assertions, build/fixture prerequisites and external successors. Browser geometry, popup layout/focus, actual callback execution and physical touch remain unvalidated for this patch.

## Original leaf decisions

### A-D-12 — partial

Original requirement: Make important touch controls comfortably operable; density must not erase minimum hit areas or keyboard focus indicators. Historical status: open.

The proposed TagGroup width fix addresses a concrete one-dimensional minimum-target gap. The prepared coarse-capability fixture covers real Button/IconButton/checkbox/switch/menu/tag target geometry and activation at both densities, auto and explicit touch. Unchanged scope/token inputs retain their prior evidence. Required successors: integrate, build and execute those engine checks; inspect complete focus clipping/edge geometry; record named physical-device comfort/activation separately. No physical hardware result is available.

### A-U-17 — partial

Original requirement: Provide consistent focus ring, target size, disabled styling, validation, status announcement, and pointer/keyboard interactions across primitives. Historical status: open.

The patch improves target consistency and adds owned, translated field validation for the new width action. Existing Checkbox/Switch/RadioGroup/IconButton/TagGroup and scope/token inputs in the captured baseline are unchanged. Four prepared unit cases and the geometry spec cover a bounded successor, not every public primitive or status announcement. Required successors: remaining primitive-by-state focus/disabled/error/status/pointer/keyboard evidence, affected unit/native checks after integration, and named spoken-AT status evidence. DOM/syntax/type checks do not supply speech or contrast results.

### A-X-07 — partial

Original requirement: Verify target size/spacing against WCAG requirements and aim for comfortable primary touch targets; test coarse-pointer use rather than shrinking every hit area with density. Historical status: open.

The proposed tag fix preserves the token policy; prepared browser checks assert >=44 CSS px width/height for selected touch controls, no neighboring remove-action overlap and active center hit tests. Explicit-touch and emulated auto coarse capability are recorded separately in attachments. Required successors: execute fresh-host cases; measure remaining calendar days, inline links, resize handles and other uncovered usage, including spacing and applicable exception rationale. A 44px comfort check is not a blanket conformance audit. Real-device evidence is separate from engine emulation.

### A-X-08 — partial

Original requirement: Provide both keyboard and single-pointer non-drag alternatives for drag operations where required; keyboard support alone does not satisfy every dragging requirement. Historical status: open.

Current grid source has no width-entry/step UI; existing ColumnResizer source and keyboard tests alone do not establish an equivalent pointer path. The proposed exact-width/one-pixel controls supply one through both renderers, with complete host snapshots and fill/bound policies retained. Native activation/focus still needs execution after integration.

Reuse existing grid row Move and page menu Move alternatives for their original tested inputs. Calendar source explicitly supports fixed-length click-to-start; that bounded source behavior is not proof of equivalent variable/bounded whole-range movement. Required successors: execute proposed width unit/native tests; calendar owner proves fields-hidden, variable/bounded duration and active-endpoint move equivalence under host rejection/constraints (or adds an owned action); editor owner reconciles active drag/resize and host extensions. No keyboard-only or field-presence claim closes those paths.

No checklist/count updates, release, remote CI, device certification or external approval is implied.
