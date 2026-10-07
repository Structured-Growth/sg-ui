# Batch 136: paragraph command focus ownership

Task references: M-26/M-28/M-34 and open E-02/E-04 native editor acceptance.
Exact parent: `9846ad0fe2e055243f35948115ac691ff2706900`.
Scope: `tests/browser/editor-paragraph-transactions.spec.ts` and this report.
Root/coordinator alone integrates and accepts; this slice makes no acceptance claim.

## Retained actual failure

Evidence root:
`/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/editor-paragraph`.
Read `results.json`, `evidence.json` and both retained `traces/*/trace.zip`
archives, including their `1-trace.trace` snapshots and API records.
The HTML report is `report/index.html` under that root.
Evidence build digest:
`f0ca5109991ffb3da6faa8d9a0ee946639dc4a3522660366e1494c113df966d1`.

The Chromium run began at `2026-10-07T21:52:36.010Z`; both light and dark
cases failed (zero expected, two unexpected, zero skipped/flaky). Both reach
Center Align through a trusted trigger click, Home/ArrowDown, focused radio item
and Enter. Menu disappearance passes (`call@62`). The next assertion at old
line 65 (`call@64`) fails because the Center Align trigger is inactive.
The post-Enter (`call@60` after) snapshots show the first paragraph centered,
its bold text/color retained, and the adjacent paragraph still right-aligned,
italic, Georgia and indent 2 in saved JSON. This is retained observation, not
proof of the test's later exact document/history/selection assertions: execution
stops before those assertions. The snapshots do not record `activeElement`, so
they alone do not prove which element owns final focus or the final range offsets.

## Classification and bounded correction

This is a wrong final-focus expectation in the composed driver, not evidence of
a production focus defect. The [formatting toolbar contract](../react-aria-formatting-toolbar.md#retained-host-contract)
assigns Lexical commands, selection restoration, document mutations and history
to the host. Chooser focus restoration permits subsequent host editor focus;
it does not require a composed editor command to leave focus on a menu trigger.
The [editor menu contract](../react-aria-editor-menus.md) likewise leaves editor
state/selection to the host. The [selection toolbar contract](../react-aria-editor-layout.md)
describes the editor-focus result for its formatting preparation path; that
floating-toolbar sequencing is not an assertion that this paragraph menu uses
the same preparation helper.

At the exact parent, `PageRichTextEditorSection.impl.tsx` dispatches
`FORMAT_ELEMENT_COMMAND`, `INDENT_CONTENT_COMMAND` and `OUTDENT_CONTENT_COMMAND`
from the alignment callbacks. It does not add `SKIP_SELECTION_FOCUS_TAG`.
Read-only inspection of the retained installed Lexical implementation confirms
`updateDOMSelection` in `node_modules/lexical/Lexical.dev.mjs` focuses the root
when reconciling an unchanged native range whose root lacks focus, unless that
tag suppresses it. `node_modules/@lexical/rich-text/LexicalRichText.dev.mjs`
handles these commands against the existing selection and changes block
format/indent. Thus editor contenteditable is the expected final native focus
owner; standalone menu trigger restoration is not the final composed contract.
This source-based classification does not infer a successful native rerun.

Replace only `expect(trigger).toBeFocused()` with
`expect(editor).toBeFocused()` after menu closure, with an ownership comment.
The assertion remains strict. No focus injection, selection mutation, forced
pointer click, command workaround or production edit is added. Complete saved
JSON comparisons, adjacent paragraph checks, inline formatting, undo/redo,
saved reload, diagnostics and native `rget p` selection at offsets 2/8 within
the first paragraph remain unchanged.

## Validation and coordinator follow-up

No install, build, typecheck, tests, browser/performance, global lease or CI
commands were run, as explicitly required for this bounded successor. Only
source/contracts and retained evidence were inspected. Diff review verifies
the assertion replacement and preserved surrounding checks; it is not runtime
validation. Native proof remains coordinator-owned: rerun the exact corrected
spec against the coordinator's fresh build, preserving both themes and all
assertions. Any subsequent failure must be classified from its actual evidence.
No E gate is closed here and no success is inferred.
