# A-X-01: focused behavior-probe patch

Outcome: **partial; patch ready for coordinator review, integration and execution.** No original acceptance leaf is closed. Only `wave-03-39` contains new artifacts; the library test itself has not been changed.

Original requirement: “Replace implementation-mirroring tests with behavior tests where needed; avoid mocks that hide the very focus/keyboard behavior under migration.” Historical status: open.

## Concrete successor implemented

`behavior-probes.patch` changes only `packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx`. Its complete proposed file is under `proposed-files/` at that path. Seven existing cases remain; no wholesale rewrite or additional smoke count.

Four existing assertions search serialized editor JSON for numeric format flags. Three are positive-format checks: they could succeed if the wrong text, including the unselected suffix, received a format. The replacement probes inspect the actual editor's semantic bold/italic content and full text. The pointer command must render bold **Guide**, preserve plain ** text**, and keep the complete text **Guide text**. Enter and Space must apply bold/italic to that same selection and return focus to the editor. These checks do not depend on Lexical bit values or exact text-node segmentation. The fourth assertion (queued command cancelled by unmount) now checks unchanged text and public named format queries for all text nodes; it cannot inspect DOM after unmount.

The test still mounts real Lexical, real toolbar, real Button and Provider. It adds no interaction mocks. Existing synthetic Range geometry remains explicitly jsdom-only. Existing root.focus instrumentation deliberately models synchronous scroll reveal and is retained as characterization, not native evidence. Host style/ref assertions and the other five cases are preserved.

## Existing evidence and review limits

Read AGENTS.md, the final-acceptance ledger, assignment, wave-02-09 report/results/input evidence and coordinator-integration/evidence.json. `input-hashes.json` records exact inputs and available comparisons. The prior report/results hashes match the assignment. Three relevant prior wave inputs are unchanged: grid drop-focus instrumentation, native grid reorder spec, editor clipboard spec. Their prior bounded evidence is reused without rerunning them. Most toolbar-specific inputs were not hashed in wave-02-09; no false unchanged/current-runtime attribution is made for them. Current acceptance ledger differs, as expected after coordinator integration. BUG-0008–0012 and A-G-02/A-K-16 are not reopened.

The current PageRichTextEditorSection floating test delegates the real composer and plugins with editor-capture instrumentation. Other dialog/editor suites intentionally remove the floating toolbar. Neither class of test certifies unmocked native toolbar focus. Existing `inventory-selection-boundary.spec.ts` provides real selection, Alt+F10, focused resize, Enter formatting, unchanged sibling paragraph, offscreen focus/selection and host-replacement assertions. Existing `batch01-grid-reorder.spec.ts` provides actual keyboard drag cancellation/drop and focus/host-request assertions. Do not replace them with more jsdom probes. Attach a valid matching native receipt or run only these scopes once on the coordinator host; this wave has no native receipt or trusted pointer-drag claim. Editor V leaves remain open.

## Validation performed

- `git apply --check docs/developer/final-acceptance/wave-03-39/behavior-probes.patch`: passed against the current dirty checkout; no patch applied.
- Node 24.21.0 `syntax-check.mjs`: passed with zero TSX transpile diagnostics (`syntax-check.txt`). This is syntax checking only, not TypeScript semantic or behavior acceptance.
- Initial focused execution of an evidence-only test copy acquired the prescribed lease but failed import resolution before collecting tests: React was not resolvable from the evidence directory. `unit-probe-initial-resolution-failure.txt` preserves the failure. `prepare-probe.mjs` now provides the evidence-local dependency symlink and rewrites only relative source import locations; the proposed production test retains ordinary relative imports.
- Subsequent attempts were denied by the occupied canonical validation lease before Vitest started (`unit-probe-lease-occupied.txt`, `unit-probe-final.txt`). No bypass, reclaim, server, install, build, generation or broad suite. No unit pass is claimed; the final proposed assertions remain unexecuted.

Exact commands and expected assertions are in `validation-plan.json`. The disposable probe/config/prepare script let the coordinator validate before integration while writing only in this evidence directory. After applying the patch, run the normal original test instead. Patch/source hashes are recorded; check for concurrent changes before integration.

## Required successors

1. Review and integrate the one-file patch after checking the recorded target hash and current diff.
2. Acquire the existing validation lease on supported Node 22/24 and execute the focused seven-case suite; retain the complete log and fix any failed assertion without weakening selection-scope checks.
3. Reconcile native toolbar and grid drag receipts against their full source/fixture/output inputs; run only uncovered/changed cases on the coordinator's authorized host. No new browser server is needed for this patch review.
4. Keep A-X-01 partial until these checks and the bounded remaining assertion review are accepted. No central ledger, counts, release state or other owner's files were edited.
