# Wave 03-25 — editor node and input successors

All four original leaves remain **partial**. This handoff supplies a ready-to-apply test patch, executable unit artifact, exact coordinator validation plan and concrete operator protocol. It closes no runtime acceptance leaf before integration/execution. No production defect was demonstrated; existing editor/floating-selection source and the no-highlight editing fix are preserved.

## Concrete deliverables

`editor-successors.patch` adds only these files, also supplied under `proposed-files/`:

- `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.acceptance-successors.test.ts`: two tests. The authored combination corpus extends the existing golden document with nested numbered/bullet lists, a merged header cell, decorative empty image alt and opaque Unicode asset IDs. Assertions compare unaffected nodes through a discrete text edit, reload and read-only transition, including public `link` spelling and host-input immutability. The second test characterizes unregistered-node reporting. It does not invent a version or recovery contract.
- `packages/ui/tests/browser/editor-selection-editing-successors.spec.ts`: two native-key-gesture cases using the existing rich-document fixture. Escape from Alt+F10 formatting must restore normal caret editing without a sticky toolbar/typing focus highlight; read-only must hide actions and reject text changes, then re-enable normal typing. There is no scripted DOM selection repair or synthetic composition in these cases.

`editorConfig.acceptance-successors.test.ts` is the runnable, pre-integration unit mirror. Only its production import paths differ from the proposed colocated file. `vitest.config.mjs` restricts discovery/cache to this directory. `check-artifacts.cjs` verifies syntax and mirror equality without writing shared outputs. `operator-validation.md` supplies concrete IME text/conversion/cancel/history steps, title/color commit expectations, physical clipboard/AT checks and presentation geometry review. `validation-plan.json` records exact commands and expected assertions.

## Evidence, commands and limits

Base HEAD: `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, dirty `dev`. `evidence.json` hashes inspected inputs and compares **48** overlapping files against wave-02-03: **48 unchanged, zero changed**. Prior report/results hashes match the assignment. This retains the prior source-specific F/T and native receipts at their original host/head/engine limits; it is not fresh unit/browser execution. Coordinator integration evidence was read and hashed; its BUG-0008–0012 scope supplies no new editor acceptance result and has zero overlapping editor inputs in this capture.

Executed from repository root with `/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node` (**Node 24.19.0**):

```sh
node docs/developer/final-acceptance/wave-03-25/check-artifacts.cjs
```

Passed two TypeScript transpilation syntax checks and import-normalized mirror equality. See `artifact-check.txt`. This is **not** a typecheck or test assertion result. The final `git apply --check` also passed without applying the patch; `patch-check.txt` records applicability/config/JSON checks.

Attempted with that same supported Node binary in both node positions:

```sh
node /tmp/sgui-calendar-validate.mjs node packages/ui/node_modules/vitest/vitest.mjs run --config docs/developer/final-acceptance/wave-03-25/vitest.config.mjs
```

The helper rejected admission with `EEXIST` for `/tmp/sgui-parallel-batch-01-validation.lock` **before Vitest started**. `unit-run-1.txt` preserves the exact failure. The helper was inspected first; no bypass, lease reclaim, repeated polling or broad test run followed. Shared builds, package installs, catalog generation and server startup were not performed. Browser assertions are proposed and may reveal failures after integration; no assertion is claimed green.

## Original leaves and remaining work

### A-M-25 — partial

Original: Reconcile FloatingTextSelectionToolbar final acceptance: Selection anchoring, focus preservation, overlay cleanup, keyboard access. Link its F-C25, T-C25 and V-C25 evidence and unresolved defects.

Retain F-C25/T-C25 mappings in `docs/developer/parallel-next100/next100-c25.md`, wave-02-03 report and the later docs-host receipt in `docs/developer/backlog-execution-2026-10-15.md`; the old pending native boundary note is superseded only as already recorded. Existing `inventory-selection-boundary.spec.ts` covers ancestor scroll, narrow collision, focused-action resize, offscreen return and document replacement. Do not duplicate these as fresh passes. Proposed browser tests address missing ordinary-editing transition assertions. **W03-C25-V / V-C25-04/05** still requires measured native geometry, reviewed screenshots and actual Arabic translated RTL names/order at the requested themes/densities. The existing fixtures need explicit translation/density host preparation before claiming those axes.

### A-M-34 — partial

Original: Reconcile PageRichTextEditorSection final acceptance: Editor composition, nodes/plugins, serialization and selection behavior. Link its F-C34, T-C34 and V-C34 evidence and unresolved defects.

Retain F-C34/T-C34 mappings in `docs/developer/parallel-next100/next100-c34.md` with later native clipboard/rich-document receipts as reconciled in wave-02-03. Proposed node and native cases are concrete additional evidence candidates, not whole-editor closure. **W03-C34-V / V-C34-04/05** still needs full composition geometry, table overflow, long translated controls, screenshots and RTL; **W03-C34-E** remains split among each command/trust/operator row in the prior command-and-trust matrix. E-04/06/07 are outside this chat's exclusive four leaves and are not silently closed here.

### A-E-02 — partial

Original: Preserve existing nodes/plugins: ImageNode, image insertion, horizontal-rule selection, editor configuration, and experience plugins; test saved-content round trips.

Retain the existing `editorConfig.test.ts`, serialization/ImageNode/insertion/rule tests, `editor-rich-document.spec.ts` and prior plugin mapping. The registered configuration and plugin composition were inspected; no plugin is removed or replaced by this patch. Proposed authored combinations preserve metadata and expose unknown-node errors, but are **not approved consumer documents**. **W03-E02-ROUNDTRIP** still requires owner-supplied supported saved-document/type/version inventory and malformed/unknown-version recovery policy, then only missing approved fixtures with actual edit/reload/read-only runtime comparisons. A serializer's willingness to preserve arbitrary JSON does not prove engine import accepts that schema.

### A-E-05 — partial

Original: Address IME composition, paste, keyboard shortcuts, read-only/disabled state, and toolbar accessibility without hijacking ordinary editing keys.

Retain unchanged native clipboard/ordinary-shortcut/read-only evidence and existing synthetic composition guards at their original limits. Proposed browser cases add Escape-to-typing and read-only invalidation successors. **W03-E05-IME** needs a real configured OS IME in content/title/color draft, with named versions, conversion/cancel/Enter/Escape outcomes and callback/caret records. **W03-E05-DEVICE-AT** needs actual physical clipboard and spoken/focus review on a named device/browser/AT. Those outcomes cannot be supplied through event simulation, DOM accessibility names or an authored run sheet. `operator-validation.md` makes the required work reproducible without fabricating it.

All artifacts stay inside this owner's directory. No central ledgers/counts, shared source, manifests, user server3000, personal workspace state, commits, branches, releases or publications were changed.
