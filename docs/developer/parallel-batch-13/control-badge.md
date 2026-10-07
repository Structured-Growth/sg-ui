# Batch 13 control-badge completion report

Assignment: bounded U-02/X-03 Badge content, host labels and decorative hiding.
Baseline verified before edits: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed isolated worktree was created and attached at that exact baseline:
`/Users/thomashall/.codex/worktrees/batch13-control-badge/sg-ui`.
Branch: `codex/batch13-control-badge`.
Draft PR: [#69](https://github.com/Structured-Growth/sg-ui/pull/69), base `codex/dev`,
attached to this chat. Primary and all other worktrees preserved.

Exclusive write allowlist: `src/experimental/Badge/`,
`tests/browser/batch13-control-badge.spec.ts`, and this report. Only Badge.tsx,
Badge.test.tsx, Badge.stories.tsx and this report changed. The allowed browser
file was not needed or created. No shared guidance, barrels, configuration,
workflow, checklist, licensing or dependencies changed.

## Demonstrated defect and bounded fix

Existing tests already cover zero, host-formatted `999+`, native span refs and
independently named attached buttons. The remaining-controls contract specifies
accessible text with no implicit action or live region. Prior U-12 completion
evidence in the progress record covers those existing presentation/ref/name
tests, not nameable host labels on the Badge wrapper.

The new regression reproduced a named overflow badge with a separately named
button. `aria-label` on the generic span did not expose a nameable group.
The pre-fix run failed that regression: 1 failed, 3 passed. Badge now supplies
`role="group"` when the host supplies `aria-label` or `aria-labelledby`, allowing
the host's complete count/name to differ from abbreviated visible content.
The child button retains its own accessible name. Removing the label returns
the wrapper to plain text semantics. `aria-hidden` still hides the whole wrapper
and its descendants; hosts should put a decorative Badge inside their independently
named action, rather than hiding an action contained inside the Badge.

No cap, zero suppression, hidden prop, live region or label generation was added.
The host owns maximum/overflow formatting and translation. Owned props, native
span refs and styles are preserved. A new story illustrates 0, 99, `99+` with
the full host label, and a decorative Badge inside a named Button.

## Validation and exact-head attribution

Implementation commit: `c4159fccc1988991abf495a3a3cf495b4a217478`.
Tests/guards ran on the assigned baseline plus exactly the implementation diff
committed there. The final report-only commit/head is sent to the coordinator
after pushing, avoiding a self-referential SHA in this report.

Runtime: Node 24.21.0 via `/tmp/sgui-run24.mjs`, pnpm 10.29.3, React 19.2.3,
Vitest 4.1.11, jsdom 26.1.0, TypeScript 5.9.3. Default Node 26.5.0 was queried
only for environment provenance; checks used Node 24. The runtime helper selects
the existing Node 24 executable recorded in `/tmp/sgui-node24-path.log`.

Commands and outcomes:

```sh
git rev-parse HEAD
git switch -c codex/batch13-control-badge
rg --files -g AGENTS.md
cat AGENTS.md docs/developer/react-aria-development-validation.md
node /tmp/sgui-run24.mjs install --frozen-lockfile
node /tmp/sgui-run24.mjs exec vitest run src/experimental/Badge/Badge.test.tsx --maxWorkers=1
node /tmp/sgui-run24.mjs typecheck
node /tmp/sgui-run24.mjs foundations:check
node /tmp/sgui-run24.mjs tokens:check
git diff --check
```

Frozen install passed with 608 packages, no lockfile changes. Targeted Vitest
before fix: 1 file failed, 1 test failed / 3 passed (log:
`/tmp/sgui-batch13-control-badge-before.log`). After fix: 1 file passed, all 4
tests passed. Typecheck, owned import/layer/token guard, generated-token check
and whitespace check passed. Root AGENTS.md was the only instruction file.
Relevant remaining-controls/architecture contracts, existing stories/tests and
U-12 progress plus previous inventory reports were inspected before the fix.

Install concurrency used atomic mkdir under `/tmp/sgui-install-slots` (limit 2);
Vitest used atomic mkdir under `/tmp/sgui-light-validation-slots` (limit 4),
unique owner tokens and owner-matching release, maxWorkers=1. Occupied-slot
attempts exited 73 and were treated as queued, never passed; waits were 30 seconds.
No foreign locks/slots were removed or workers stopped. No heavy/browser lock
was claimed; the browser-pool review and priority file were not bypassed.

## Limits and next scope

This is fresh jsdom role/name regression evidence, not native accessibility-tree
or spoken screen-reader acceptance. No native timing/layout/focus behavior changed,
so no Storybook build, browser/packed-consumer suite or full pnpm check was run.
No Firefox retry, CI/title wait, rerun, dispatch or workflow change occurred.
No merge, main change or publication occurred. Broad U/X and other acceptance
IDs, manual/device/AT checks remain open.

Next bounded scope: native accessibility-tree and spoken AT verification of
named/decorative badges composed with independently named actions, including
host-controlled content changes. Any shared contract clarification belongs in
`docs/developer/react-aria-remaining-controls.md` under coordinator ownership;
that outside-allowlist file remains untouched. A native check must use an approved
browser-pool/lock path and freshly built stories. No additional product defect
or wider change is claimed by this slice.
