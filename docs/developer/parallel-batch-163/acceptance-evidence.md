# Batch 163: passive packed editor format attribution preparation

Prepared 2026-10-07 (America/Chicago) in isolated managed worktree
`/Users/thomashall/.codex/worktrees/3a15/sg-ui`, verified clean and detached at
exact baseline `b153b86f8c5c2af4b67a4c2f418cd07f966e3898` before creating
`codex/batch163-packed-format-attribution`. Owned scope is this report and
`scripts/fixtures/editor-packed-browser/editor.spec.mjs` only.

## Retained failure and classification

Read the durable coordinator review
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/packed160-first-native-cause-review.json`
and retained red failure JSON, React 18 log and evidence references under its
`native-evidence/packed160-first/` sibling. Candidate
`8f8c445e4705e9e3c52de9e22e3cc7b1e8ecc90f` ran React 18.3.1 / Chromium:
earlier formatting, serialization/reload, read-only and editorKey replacement
assertions passed. Visible Bold was false; the trusted ControlOrMeta+B step
completed, but Bold remained false through the five-second strict assertion.
Final focus and append assertions never ran. React 19 remains UNRUN.

Cause remains **UNCLASSIFIED**. The review finds no source evidence of lost
RichTextPlugin formatting registration across editable updates. Native focus,
selection and key delivery were missing from that run; saved bold text does not
establish the collapsed Lexical insertion format. No production defect is claimed.

## Diagnostic-only fixture change

Set `SGUI_PACKED_EDITOR_FORMAT_ATTRIBUTION=1` for the coordinator's fresh packed
consumer diagnostic run. Off/default mode installs no observer and creates no
records. The server-markup case is untouched. The hydrated case captures before
and after read-only/enable-editing toggles, the final editor click, End navigation
and conditional Bold shortcut, plus the strict Bold precondition and verification
exit. The exit capture runs in `finally`, including an assertion failure.

Each snapshot records stable per-observer node identities and native DOM paths;
active element/editor attributes; native selection anchor/focus nodes, offsets,
selected text, collapse/range count and editor containment; course-section toolbar
pressed states and DOM visibility; raw public serialization and parsed JSON.
Passive capture listeners retain keydown/keyup target identities, active element,
key/code/modifiers, repeat/trusted state and cancellation at capture. Cancellation
is read again from the retained event at the next snapshot after the native
keyboard operation, avoiding a capture-listener microtask that could precede later
listeners. No listener prevents, stops or replays events.

Unique JSON files are persisted after every boundary under ignored
`artifacts/packed-browser/editor-format-attribution-<uuid>.json`, including runtime,
page title/URL and engine for correlation with runner metadata. Both
`diagnosticOnly: true` and `acceptanceEvidence: false` explicitly prevent treating
these observations as acceptance. Snapshot read errors are recorded as diagnostic
errors. Listeners/handles are removed at exit; boundary records already written
remain if a later assertion fails. Existing runner red screenshot/trace retention
is unchanged.

The fixture has no public access to Lexical selection kind/format or update
ordering. It does not inspect private editor objects, invent an internal selection,
or add a production diagnostic API. DOM selection, toolbar state and serialized
node format are distinct observations. Added read/evidence round trips can affect
timing; a diagnostic result cannot prove an uninstrumented timing sequence.
No focus/selection setters, Lexical mutations, waits, retries, forced input or
replacement keyboard actions were added. The pre-existing read-only `editor.focus()`
and every original action/assertion remain unchanged. Stripping only diagnostic
additions and the try/finally indentation reproduces the exact baseline spec bytes.
Spec SHA-256: `ae43137766f454ebb18fd13f006038430bd8a0bcb5bd1be71e5e0c3c2ec39373`.

## Targeted preparation validation

Runtime: Node **24.21.0**, pnpm **10.29.3**, with Node's directory prefixed on
PATH. Canonical helper imported read-only from
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/scripts/browser-validation-pool.mjs`:
`acquireInstallSlot`, `acquireLightSlot`, `runOwnedCommand`, `releaseLease`.
Unique owners include chat `01a1194b-d506-7831-9c99-9be045e7160a`, batch163 and
purpose. Install owned slot0; light checks owned slot1. Exact returned leases were
released after commands settled; foreign slot0 was untouched.

- PASS: `pnpm install --frozen-lockfile`; ignored esbuild build scripts reported.
- PASS: `node --test scripts/fixtures/editor-packed-browser/integrity.test.mjs`
  (4/4): strict serialization rejection, packed wiring, JSX parse and syntax.
- PASS: `pnpm exec tsc -p scripts/fixtures/editor-packed-browser/tsconfig.json`.
- PASS: `node --test /tmp/sgui-batch163-passive.test.mjs` (2/2), a temporary
  offline jsdom harness extracting the actual helper bytes. Disabled mode makes
  no page calls. Enabled mode preserves focus, native selection and DOM, records
  host cancellation without changing it, persists on a simulated failure and
  removes listeners. Synthetic events exist only in this offline harness;
  `isTrusted: false` and mock engine are retained. This is not native acceptance.
- PASS: `python3 /tmp/sgui-batch163-preservation.py` baseline byte comparison
  and `git diff --check`.

Canonical command manifest: `/tmp/sgui-batch163-validation.log`; per-command logs
and resource manifests: `/tmp/sgui-batch163-{install,passive,integrity,types}.log`
and `.log.resources.json`. Each final command reports exit 0 and settled ownership.
The first temporary wrapper mistakenly expected a return value from the helper
(which returns void on success); installation itself passed and its lease was
released. The wrapper was corrected before later checks. The first types check
found two path traversal typings; that red is preserved in
`/tmp/sgui-batch163-types-first-red.log` and its resource manifest. Both typings
were corrected and the final types check passed. No failing check was waived.
Temporary offline harness SHA-256:
`2057973bafc47f294ee06675a6dfef585dd991a6c153a6534959663c23144a2d`.

## Coordinator handoff and open acceptance

No build, pack, browser or broad suite was run here. The coordinator owns one
fresh React 18 / Chromium diagnostic candidate with the opt-in enabled, preserving
all strict assertions and the original red. No duplicated green or React 19 run
is requested in this preparation. X-17/X-20/R-01/Z-11 and broader editor/native,
Firefox/WebKit, device, IME and AT acceptance remain open. Stop after attribution
preparation; no production/image-upload/state/workflow changes, push, merge or
publication. The completion report carries the exact commit and source/report
hashes outside this report to avoid self-referential hashing.
