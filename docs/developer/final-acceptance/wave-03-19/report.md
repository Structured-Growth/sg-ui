# Wave 03-19 — selector/menu native contract successors

Prepared two reviewable patches containing three private fixture additions and five focused Playwright cases. Both patches pass `git apply --check`. The proposed files typecheck against current built public declarations. **All four original A leaves remain partial**: patches are not integrated and no browser execution occurred.

## Scope and safety

Only `docs/developer/final-acceptance/wave-03-19` was written. Production source, shared tests/fixtures, ledgers, generated catalogs, manifests, lockfiles and personal workspace state were not edited. No server, build, install, unit suite, browser session, Git mutation or publication was started. Read-only listener inspection found user port 3000 and no fixture host on 3100/6173; port 3000 was untouched. The validation lease helper was read; no supported-runtime unit execution was necessary for test-only proposals, so no lease was claimed.

Read AGENTS.md, the final acceptance ledger, assignment and prior wave-02-08/09 reports/results, and coordinator-integration/evidence.json. Current starting accounting remains 153 A / 20 V / 6 future; no count or checklist edits. BUG-0008–0012 and closed A-G-02/A-K-16 are not reopened.

## Concrete delivery

- `selector-contract-fixtures.patch`: adds `NativeContracts` exports to existing Select, ComboBox and Menu private scenario modules. Select/ComboBox use duplicate labels with IDs `01`/`1`, native forms/reset, descriptions and host-controlled null that declines selection while recording its request. Menu records command requests so Space activation and Escape non-activation are observable. Fixtures use compiled public imports and existing Provider decorators. Existing fixtures/assertions remain intact.
- `selector-contract-tests.patch`: adds `packages/ui/tests/browser/wave03-selector-contracts.spec.ts`, with five bounded cases: Select, ComboBox, Menu, Popover and Tooltip. Includes a mounted IDREF resolver for names/descriptions/active options/controls across portals.
- `proposed-files/`: exact target-file mirrors for review; patch contents correspond to these files. No public API or production fix is proposed because this scoped review did not establish a production defect.
- `selector-contracts.config.cjs`: runner for the five new cases plus three existing bounded cases (ComboBox disabled-keyboard, Async host race and Async busy lifecycle), eight cases/engine, 24 planned executions. Requires an explicit existing frozen host, rejects user port 3000, has no webServer launcher, one worker and zero retries.
- `matrix-delta.md`: key/identity/form/name matrix, retained evidence and exact residual scope. `validation-plan.json` specifies ordered coordinator integration, required fresh fixture build, host provenance and exact commands.

## Validation and input reuse

`node docs/developer/final-acceptance/wave-03-19/check-artifacts.cjs` passes with zero diagnostics for three fixture mirrors and the native spec. It overlays proposed files at logical repository paths in memory and uses current built public declarations. Runtime: **Node v26.5.0 / TypeScript 5.9.3**. This is static compiler evidence; it is not supported Node 22/24 behavioral evidence. `static-types.txt` retains output. The initial checker failed Node type lookup because its current directory was the repository root; `static-types-first-failure.txt` is retained. Correcting the checker workspace directory resolved it without changing production code.

`git apply --check docs/developer/final-acceptance/wave-03-19/selector-contract-fixtures.patch docs/developer/final-acceptance/wave-03-19/selector-contract-tests.patch` passes, recorded in `patch-check.txt`. It only checks application context and never applies the changes.

`input-evidence.json` contains 91 scoped input/module/fixture SHA-256 rows and artifact hashes. All **33** overlapping wave-02-08 inputs and **27** overlapping wave-02-09 inputs match; all **36** overlapping coordinator built-library/fixture output hashes match. This supports retaining unchanged scoped prior unit/contract evidence. It does not establish full transitive host equivalence, and no old receipt is relabelled as a new native run. Evidence is working-tree based at HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e` on `dev`.

`node docs/developer/final-acceptance/wave-03-19/check-runner.cjs` also passes: eight cases match Playwright full-title strings, three engines are configured, and missing-origin/user-port3000 inputs reject before browser execution. This is configuration inspection only; `runner-check.txt` retains output. All eight saved assignment report/result hash comparisons match in `prior-receipt-check.json`.

## Original leaves and outcomes

### A-U-06 — partial

- [ ] A-U-06 Reconcile original `U-06`: Implement Select and searchable ComboBox/Autocomplete; define value identity, filtering ownership, empty/loading/error, multiple selection where required, and disabled options. Historical status: open.

Prepared Select and ComboBox native identity/filter/reset/host-authority cases with public-import fixture additions; reused existing AsyncMultiSelect race/busy tests. No production defect was established by static review.

Evidence: `input-evidence.json`, `matrix-delta.md`, `static-types.txt`, `patch-check.txt`, both patches and `validation-plan.json`. Commands/runtime/hashes are recorded above and in `results.json`. Proposed patches still need integration; no native acceptance closed.

Remaining successors:

- Integrate patches, build frozen fixture host, run eight-case engine selection and save raw native evidence.
- Record actual option/busy speech and physical mobile entry separately when required.

### A-U-07 — partial

- [ ] A-U-07 Reconcile original `U-07`: Implement Menu/MenuItem, submenus when required, Popover, and Tooltip; distinguish menu commands from arbitrary form content in a popover. Historical status: open.

Prepared flat Menu keyboard/callback test plus Popover named-dialog/form-content and Tooltip supplementary-description tests. Explicitly retained required standalone hierarchy gap; no unsupported submenu API introduced.

Evidence: `input-evidence.json`, `matrix-delta.md`, `static-types.txt`, `patch-check.txt`, both patches and `validation-plan.json`. Commands/runtime/hashes are recorded above and in `results.json`. Proposed patches still need integration; no native acceptance closed.

Remaining successors:

- HM-F-01–04 owned drilldown implementation and public examples/Back focus remain unimplemented.
- Run focused Menu/Popover/Tooltip cases; retain matching native autofocus/lifetime receipts or execute their missing bounded cases.

### A-X-02 — partial

- [ ] A-X-02 Reconcile original `X-02`: Define keyboard contracts and verify Tab/Shift+Tab, arrows, Home/End, Enter/Space, Escape, and typeahead where appropriate. Historical status: open.

Added exact selected-control key matrix and runnable tests distinguishing editable ComboBox cursor/text behavior from Select/Menu collection keys. New Menu case asserts disabled endpoints, both arrows, Home/End, two typeahead lifetimes, Space callback once, Enter/Escape/Tab dismissal.

Evidence: `input-evidence.json`, `matrix-delta.md`, `static-types.txt`, `patch-check.txt`, both patches and `validation-plan.json`. Commands/runtime/hashes are recorded above and in `results.json`. Proposed patches still need integration; no native acceptance closed.

Remaining successors:

- Run prepared native cases on integrated frozen host.
- Complete remaining editor/grid and other component keyboard paths using their own targeted fixtures and exact receipts.

### A-X-03 — partial

- [ ] A-X-03 Reconcile original `X-03`: Verify accessible names/descriptions, roles, state announcements, validation, heading hierarchy, landmarks, and native form semantics. Historical status: open.

Prepared native accessible-description/role/heading checks, live IDREF resolution through portals, stable string-ID FormData/reset and controlled authority checks. This is bounded selector/overlay coverage, not an all-library semantic audit.

Evidence: `input-evidence.json`, `matrix-delta.md`, `static-types.txt`, `patch-check.txt`, both patches and `validation-plan.json`. Commands/runtime/hashes are recorded above and in `results.json`. Proposed patches still need integration; no native acceptance closed.

Remaining successors:

- Run native semantic/form cases and diagnose exact failing states before acceptance.
- Complete composed route headings/landmarks/validation and actual AT speech evidence; do not infer speech from DOM/live-region state.

## Required coordinator next step

Apply the reviewed patches only during coordinator integration, build/register the added private fixture exports once, freeze that host/output and run the eight-case engine selection from `validation-plan.json`. Save raw results, traces, stdout/stderr and source/host/output hashes. A failure remains open and should produce a bounded fix; the prepared tests must not be counted as passing.

HM-F-01–04 remains a separate real implementation gap: standalone sliding drilldown, Back focus/controlled path, public examples/exports and visual motion proof. The scope explicitly excludes flyout submenus. These flat Menu tests do not implement or close it. Remaining full-library keyboard, composed heading/landmark/validation, spoken AT and physical device requirements also remain open.
