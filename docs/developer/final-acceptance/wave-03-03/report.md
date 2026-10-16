# Wave 03-03 — state, naming and composition contracts

Result: **three partial leaves; no automatic checklist/count change**. A reviewable
patch adds consumer contract guidance, links it from adoption guidance, and adds
five focused regression cases. Strict source type assertions pass on Node 24 with
15 independently confirmed expected rejections. Five new Vitest/jsdom cases pass.
Production source, tests and documentation outside this directory were not edited.
The patch remains unapplied and requires coordinator review/integration.

## Deliverables

- `public-contracts.patch` and `proposed-files/`: ready-to-apply new
  `docs/developer/react-aria-public-composition-contracts.md`, adoption-checklist
  link, and `packages/ui/src/experimental/public-contracts.acceptance.test.tsx`.
- The guide defines control/default/null/empty ownership, grid slice/reset and
  normalization exceptions, editorKey document lifetime, repeated row/editor/nav
  names, trigger versus popup names, host descriptions/IDs, native ref targets,
  supported slots/styles and arbitrary renderer responsibilities. It explicitly
  distinguishes TagGroup's host-owned items from selected-value APIs, Checkbox
  label refs from native inputs, and APIs without generic ref/style props.
- `public-contracts.runtime.test.tsx` is the proposed test with only source import
  specifiers made absolute so it can execute without integrating shared files.
  `vitest.config.mjs` uses the existing setup and owned cache path. It makes JSX
  automatic because this staged test is outside packages/ui's tsconfig ancestry.
- `contracts.typecheck.tsx`, `typecheck.cjs`, `typecheck.json`: all 11 prior naming/
  contract rejections retained; four new rejections cover Checkbox input-ref misuse,
  TextField/TextArea null values and unsupported Menu refs. Valid assignments cover
  explicit empty text, native label refs, AppShell slots/style and editor anchors.
- `input-reconciliation.json`, `hash-comparison.txt` and `reconcile-evidence.mjs`:
  exact saved receipt comparison plus inspected source hashes. No new export scan.
- `validation-plan.json`: exact commands/assertions and coordinator integration /
  packed/native/AT residual requirements.

## Accepted evidence reused without rerunning it

All **112 coordinator-integration input hashes, 1,778 library output hashes and
292 private fixture output hashes match** the current files. Retain that receipt's
Node 24 build/declaration, package audit, generated docs/source validation and
bounded desktop Chromium/Firefox/WebKit results. Its current 21 executions are
seven cases per engine, retaining unaffected cases and replacing the three datetime
cases with enriched receipts; they are not 24 distinct cases. This is bounded
BUG-0008–0012 evidence, not whole-library or physical-device/AT acceptance.

The earlier coordinator-fixes receipt still matches 11/12 source inputs and
1,752/1,778 outputs. Its forms-dates source and 26 later calendar/date-field outputs
are superseded by the final integration receipt, whose complete saved sets match.
Do not label that older output set wholly current. Exact deltas are retained.

This resolves the assigned BUG-0008/0009 receipt-reconciliation successors. The
Calendar TS2322 failure retained by wave-02-15 was corrected in the coordinator
integration; the new strict source program now has zero diagnostics. No production
fix was duplicated. Prior reports/results are immutable; their hashes are retained.

## New validation

Runtime: **Node 24.21.0, TypeScript 5.9.3, Vitest 4.1.11 / jsdom**.
Both executable checks used `/tmp/sgui-calendar-validate.mjs`, inspected before use.

From repository root, supported-runtime type check:

```sh
node /tmp/sgui-calendar-validate.mjs node docs/developer/final-acceptance/wave-03-03/typecheck.cjs
```

`typecheck-attempt.txt`: pass, zero diagnostics across 34 source inputs; stripping
expect-error directives confirms all 15 rejected assignments. This is source type
evidence, not a packed consumer run. Exact input hashes are in `typecheck.json`.

From `packages/ui`, staged focused test:

```sh
node /tmp/sgui-calendar-validate.mjs node node_modules/vitest/vitest.mjs run --config ../../docs/developer/final-acceptance/wave-03-03/vitest.config.mjs
```

`unit-rerun.txt`: **5/5 pass**, one file, no retries, 1.02 seconds. Assertions:

1. TextField and TextArea (two cases): controlled empty string overrides default;
   a rejecting host receives edit requests without losing authority; sibling local
   draft stays independent; distinct description/label IDs survive host rerender;
   decorative icon and inputClassName target are preserved; native form value tracks
   host acceptance.
2. Checkbox: two SSR-generated names/descriptions stay distinct on hydrateRoot with
   identifierPrefix; input nodes/IDs are retained, no recoverable hydration error,
   and each native label ref's control is the matching input.
3. AppDataGrid: host row labels name both repeated menu triggers; the selected
   popup has matching context; Details invokes exactly the chosen row once.
4. ContentEditorChrome: native root ref/class/style, host status slot, hidden icon,
   popup relationship and the actual HTMLButtonElement callback anchor are retained.

These are DOM-emulated contracts. They are not new browser hydration, spoken-name,
physical touch, zoom or accessibility-conformance results. No assertions or tests
were removed from shared files. After applying the patch the coordinator must run
its relative-import form under the repository config (command in validation plan).

`git apply --check .../public-contracts.patch` passes (`patch-check.txt`). No patch
was applied. An initial shell invocation used an incorrect relative log path and
never started validation. `unit-first.txt` preserves five harness failures (React
undefined from JSX ancestry); the staged config correction adds automatic JSX and
the final five-case run passes. `unit-second.txt`, `unit-third.txt`, `unit-final.txt`
preserve occupied-lease failures; no job started on those attempts, no lease was
bypassed/reclaimed and useful independent documentation/type work continued.
A missing optional esbuild module probe was replaced by the actual Vitest execution;
it was not a component failure or passing validation.

## Original leaves and remaining work

### A-A-06 — partial

Original requirement: Standardize controlled/uncontrolled pairs, defaults, change
callbacks, null/empty semantics, disabled/read-only/loading behavior, and stable IDs.

The patch supplies concrete reset/lifetime policy, controlled-empty field tests,
Checkbox hydration ID/ref tests, and grid/editor ownership exceptions. BUG-0008
final source/output/desktop receipts and Calendar type-failure reconciliation are
complete for their bounded scopes. Remaining: integrate the guide/test; verify its
relative-import test form; complete remaining public-control null/default/reset/ID
and control-mode exceptions outside the tested cases, including packed React 18/19
hydration and editor/grid lifetime transitions. Existing editor V leaves are not
closed by documenting editorKey. No new native or packed result is claimed.

### A-A-09 — partial

Original requirement: Define accessible naming and description requirements for
icon-only and compound controls; choose typed requirements where practical.

The patch specifies runtime nonempty contextual labels, trigger/menu separation,
compound field descriptions, row-action renderer ownership, repeated editor/nav
region names and host ID obligations. All prior omission rejections now pass in a
whole strict source program; five DOM cases verify representative repeated names
and associations. Remaining: integrate the guide/test and reconcile each remaining
public alias/compound callback boundary against the saved public-contract index;
custom renderer contents and nonempty translated labels need actual host evidence.
Type checks and getByRole do not establish spoken AT output.

### A-A-10 — partial

Original requirement: Define composition and escape hatches: supported slots/parts,
render callbacks, refs, className/part classes, CSS variables, and native style where
needed.

The patch records concrete supported ref/slot/style targets and intentional omissions,
private DOM limits, public token scopes and renderer ownership. New type assertions
reject the wrong Checkbox ref and invented Menu ref; the DOM cases cover actual
Checkbox label/input identity, input classes, field decorative slots, editor
status/root styling and callback anchors. BUG-0009's final implementation/CSS/docs/
output receipts are reconciled rather than rerun. Remaining: integrate the guide/
test, then finish per-alias/compound native-ref/part/style/render contract coverage
outside these representative boundaries; private DOM and arbitrary host content
cannot be certified by the old index. No regenerated declaration or source-copy
result was invented for this patch; matching final coordinator outputs are reused.

All proposed edits are documentation/tests; no new runtime API or architectural
change is proposed. No shared install/build/catalog generation/server, branch,
stage/commit/push/tag/version/publication or GitHub/npm settings operation occurred.
Personal Obsidian state and the user server on 3000 were untouched.
