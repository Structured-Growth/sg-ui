# Batch 13: control-status evidence review

## Scope and result

Assignment labels: U-11/X-03, live-region ownership and repeated status transitions.
Status itself is tracked under **U-13** in the master task list; U-11 describes
list/navigation/disclosure. This review does not change or close those IDs.

No demonstrated Status defect was found. No product, story or test changes were
made. Existing focused coverage is adequate for the assigned DOM ownership and
transition slice; it does not establish spoken screen-reader behavior. Adding a
second equivalent lifecycle harness would duplicate the existing composed test.

- Exact baseline and inspected implementation head:
  `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed isolated worktree:
  `/Users/thomashall/.codex/worktrees/batch13-control-status/sg-ui`.
- Branch: `codex/batch13-control-status`; draft PR base: `codex/dev`.
- Draft PR: [PR 55](https://github.com/Structured-Growth/sg-ui/pull/55).
- Initial evidence-report head: `3da4e48ea01b61d19a5504b75b1c49872ea5d41c`;
  the final metadata-only documentation commit is recorded in coordinator delivery.
- Exclusive write allowlist: `src/experimental/Status/`,
  `tests/browser/batch13-control-status.spec.ts`, and this report.
- Actual changed file: this report only. The final documentation commit and PR
  are recorded in the coordinator delivery; the evidence head above stays exact.

Isolation was created and attached with the managed worktree tool at the exact
baseline, verified with `git rev-parse HEAD`, then the branch was created before
any edits. Primary and other worktrees were preserved.

## Existing evidence

[Status implementation](../../../src/experimental/Status/Status.tsx) owns one
native div and directly maps the host's announcement request: default `off`,
polite `role=status`, or assertive `role=alert`. Atomicity is enabled for explicit
announcements. Its presentation tone does not independently activate a live
region, and the host owns content and translation. There is no timer, effect,
secondary announcer or state engine that repeats messages.

[Status tests](../../../src/experimental/Status/Status.test.tsx) contain two
existing tests: default quiet/native ref followed by polite then assertive
transitions, and SSR without browser globals. Existing
[stories](../../../src/experimental/Status/Status.stories.tsx) show quiet content,
an initially mounted empty polite region updated by a host action, and a danger
tone that remains quiet. Repeating the same host message is not a new state
transition; the API does not promise replay of identical speech.

[Grid status parts](../../../src/components/AppDataGrid/ownedGridParts.tsx)
compose this exact Status component, with a non-live Progress indicator and one
message span. Their
[existing tests](../../../src/components/AppDataGrid/ownedGridParts.test.tsx)
cover loading, refreshing, empty, no-results and host error transitions plus a
single retry request. The
[composed lifecycle regression](../../../src/components/AppDataGrid/ownedGridInteraction.test.tsx)
(`keeps one retained-row announcement through failure and host retry without
moving another grid's focus`) observes zero content mutations on an unchanged
pending rerender, one pending message, one assertive error region, host-authorized
retry-to-pending, completion removal and independent-grid isolation. Retry alone
does not establish new pending state.

[Existing native browser cases](../../../tests/browser/batch05-grid-busy.spec.ts)
cover repeated loading/refreshing requests, zero live-content mutations on an
unrelated host render, error/retry/success, and independent-grid ownership. The
[batch-05 completion record](../parallel-batch-05/grid-busy.md) reports two cases
passing in Chromium and two in WebKit at
`3219f168429cbadcc6d8300aa3a3a72490a1bda1`; Firefox failed before test-body entry.
Those are prior results, not fresh passes at this task's baseline. The completion
record already separates DOM mutation evidence from speech evidence.

The [owned progress/status contract](../react-aria-progress-avatar.md) specifies
keeping the region mounted before updating content and avoiding percentage-tick
announcements. The standalone story and composed tests exercise meaningful host
updates without adding another announcement owner.

## Validation and runtime

This is a guidance-only evidence review under the
[targeted development policy](../react-aria-development-validation.md). No
installation, Vitest, typecheck, Storybook build, browser run or full suite was
needed or performed. Fresh test counts: **0**. Historical counts are explicitly
identified above and are not promoted to new validation.

Observed host runtime: Node `v26.5.0`, pnpm `10.29.3`, macOS. This runtime was used
only for version inspection and Git/documentation commands, not UI validation.

Commands: managed `create_worktree`/`get_worktree_creation_status`;
`git rev-parse HEAD`; `git status --short`; `git switch -c codex/batch13-control-status`;
`cat`/`sed` reads of AGENTS.md, development validation, owned contracts, source,
tests and prior reports; `rg` evidence searches; `node --version`; `pnpm --version`;
local Markdown target verification; `git diff --check`; and changed-path review.
The report's relative link targets were verified on disk. Git whitespace checks
passed. An early glob search and a read of a guessed inventory path failed;
explicit existing paths were then used. These were inspection failures, not test
or product failures.

No install/light/heavy validation slots were claimed. The existing browser lock
and priority queue were inspected/respected; no browser-pool workaround, Firefox
retry, CI dispatch/wait/rerun, workflow changes or acceptance closure occurred.

## Limits and follow-ups

No actual screen-reader speech, native timing at this head, physical-device,
React 18, broad X-03 or whole U acceptance is claimed. Browser attributes and
mutation counts cannot establish whether a message is spoken once or at all.
Manual/device/AT and broad IDs remain open.

Next exact acceptance scope: a named screen-reader/browser pairing exercises the
existing MeaningfulAnnouncement and BusyLifecycle stories through mounted-empty
initial state, completion, repeated same-message requests separated by a genuine
pending state, error/retry, and independent owners. Record actual spoken output
and timing separately from DOM observations. Do not add a replay/timer API without
a demonstrated host requirement and a separate owned contract decision.

Outside-allowlist follow-up reserved for the coordinator: reconcile the dispatch
label U-11 to U-13 in its task ledger, retaining X-03 open. No shared guide,
checklist, source barrel, configuration, workflow or licensing edit is requested
by this evidence-only result.
