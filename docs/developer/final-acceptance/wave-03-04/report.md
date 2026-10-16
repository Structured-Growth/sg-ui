# Wave 03-04 — press and async diagnostics

Two original leaves remain **partial**, with a ready-to-integrate patch. Shared
source, tests, guides, ledgers and generated outputs were not edited. All authored
files are under this directory. No branch/release/Git mutation or server operation.
Base: dirty `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`.

## Substantive result

`actions.patch` fixes two actual runtime contract gaps: `ToggleButton` and
`DataGridDragHandle` declare parameterless `onPress`, but passed React Aria's
PressEvent through unchanged. Each proposed wrapper calls the host without
arguments. Existing selection, keyboard, refs, styles and drag slots stay intact.
No public type shape or dependency changes. `event-surface.md` reconciles related
public/composed contracts, including legacy callback names and native Link events.
The accepted fix-02 guidance remains intact.

The patch also adds host diagnostics ownership guidance and nine operation-specific
SideNavigation tests. All three operations (`logoutAccount`, `logoutAllAccounts`,
`onOrganizationChange`) cover Error-with-cause and opaque rejection identity,
one retained diagnostic/request, duplicate and competing-action suppression,
safe translated error, no failed navigation/session mutation, and explicit retry.
Three further cases retain the old host's diagnostic while its stale rejection
cannot clear or mutate the replacement owner's pending request. The host owns a
nonthrowing synchronous diagnostic sink; no logging service/error API is invented.
The current SideNavigation implementation passes these cases without modification.

A source-backed private fixture and three native cases are prepared for ordinary
press, reorder press, ContentEditorChrome anchor callbacks, distinct toggle
selection/press notifications, native submit/reset event order, and emulated
touch. These have **not** run in a browser. Existing pending/disabled/native form
and editor-anchor unit evidence is reused rather than duplicated.

## Validation actually performed

Runtime: cached **Node 24.21.0**, Vitest **4.1.11**, jsdom **26.1.0**, React **19.2.3**.
Exact dependency/executable hashes are in `runtime.json`. Only the new focused
suites ran through the existing `/tmp/sgui-calendar-validate.mjs` lease helper.

- Current implementation: **9 pass / 2 fail**, with the two expected activation
  argument failures preserving the actual leaked PressEvent. Receipt:
  `unit-characterization-final.txt`.
- Proposed isolated module mirrors: **11 pass across 3 suites**, exit 0.
  Receipt: `unit-proposed-esm.txt`. This does not claim applied-patch validation.
- Virtual TypeScript overlay at intended source/test/fixture/spec paths:
  **zero diagnostics**. Uses current source dependencies and existing compiled
  public declarations, no build/emission: `typecheck-proposals.json`.
- Seven proposed TS/TSX artifacts transpile without syntax diagnostics:
  `syntax-check.json`. `git apply --check actions.patch` passes; patch not applied.

After the green unit run, one test-only annotation widened the host wrapper args
from `string[]` to `(string | undefined)[]` to accept the optional account ID.
The final typecheck passes; `type-only-correction.json` proves emitted JavaScript
is identical to the green run. No runtime implementation changed after it.

Initial harness failures remain in the directory: out-of-tree package resolution,
Vitest require entry, JSX/runtime lookup, and a CJS/ESM React Aria context split.
The final harness resolves the actual ESM exports and passes without suppressing
errors. Two lease attempts returned EEXIST and launched no tests; no lease was
bypassed or reclaimed. `typecheck-first.txt` preserves the optional-ID diagnostic.
These harness/type preparation failures are distinguished in `results.json` from
the two real current-source callback failures.

## Original leaves and successors

**A-A-07:** Specify native click versus normalized press semantics without
surprising consumers; prevent duplicate callback invocation and document
keyboard/touch activation. **Partial.** The two leaks are reproduced and fixed in
the proposal; owned event-surface mapping and runnable native scenarios are supplied.
Coordinator must integrate the wrappers/tests/guidance and execute the focused
native suite after rebuilding its fixture. Physical touch and spoken AT remain
separate evidence; no DOM check is relabeled native or device/AT proof.

**A-H-05:** Define pending/error handling for asynchronous host actions without
duplicating requests or swallowing useful errors. **Partial, ready for maintained
policy adoption.** The chosen host boundary is documented in the proposed guide
and all nine operation-specific cases pass on current SideNavigation source.
Integrate the maintained contract/tests and confirm the affected integrated units
before reconsidering closure. No real authentication/diagnostic transport service
or persistence is represented.

## Handoff

`proposed-files/` mirrors all nine patch targets: two implementation wrappers,
three colocated tests, two guides, one private fixture and one native spec.
`validation-plan.json` provides exact commands, expected assertions, required
coordinator builds/leases/native checks and physical/AT limits. `vitest.config.mjs`
and `runnable/` reproduce the isolated current/proposed tests without applying
shared changes; cache output is scoped to this evidence directory.

`input-hashes.json`, `supplemental-hashes.json`, `hash-comparison.json` and the
compiler's transitive input hashes bind inspected inputs. Assigned wave-02 report
and results hashes and accepted fix-02 report match their retained receipts.
No passing broad acceptance suite was rerun. Coordinator-integration evidence
was read and reused with its recorded bounds; BUG0008–0012/A-G02/A-K16 were not
reopened. No install, library/docs build, catalog generation, native host startup,
packed-consumer execution, remote CI, physical device, AT, approval or publication
occurred. Central counts/checklists remain unchanged.
