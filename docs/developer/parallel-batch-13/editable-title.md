# Editable title host read-only transition

Status: focused fix complete, including required Chromium/WebKit native evidence.
Draft PR: https://github.com/Structured-Growth/sg-ui/pull/75 (base `codex/dev`).

## Isolation and scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-editable-title/sg-ui`.
- Branch: `codex/batch13-editable-title`.
- Original product/unit head: `9cb0cedcceb480c11aea49c30d6c30c9418f8681`.
- Final source/story/spec head: `de3fb725003fc20118bded5f0121d1cfeb102849`.
- Native tested head: `d6a964fb3e855ec9d743e52680fd9a9cafdcf1a1`.
- Exclusive write allowlist: `src/components/EditableTitleField/`,
  `tests/browser/batch13-editable-title.spec.ts`, this report.
- Assignment labels M-11/U-05; canonical repository inventory labels this component
  M-24 (M-11 is CardCollectionWithFooter, U-05 checkbox/switch/radio composition).
  No shared task statuses changed.

## Demonstrated defect and fix

Baseline tests already cover trim/Enter, blur, async focus, Escape, empty/unchanged
values, duplicate pending saves, rejection/retry, initial read-only and IME Enter.
Previous M-24 completion records in `react-aria-progress.md` include native
successful/rejected save and cancellation evidence. Those cases were not reenacted
as new regressions.

The new combination is rejected persistence followed by live host read-only
revocation. Baseline retained a writable input and permitted subsequent Enter/blur
retry despite the host flag. Active inputs now receive `readOnly` and `save` stops
while the host flag is true. Draft/error context remains visible, Escape still
cancels, and the host title remains authoritative. Already-started host persistence
is not cancelled. The public API has no separate disabled prop; pending loading and
read-only retain existing APIs.

One added unit regression checks live revocation after rejection, blocked typing
and Enter/blur saves, Escape cancellation, and latest host title. One changed-state
story exposes host revocation. Two browser cases (light/dark) check actual keyboard,
focus retention, blur suppression, Escape, disabled edit trigger and reopening.

## Validation

Runtime: Node 24.21.0, pnpm 10.29.3. Install used atomic owned slot0 under
`/tmp/sgui-install-slots` (global limit 2), with matching-owner release.
Vitest used atomic owned slot0 under `/tmp/sgui-light-validation-slots` (limit 4),
`--maxWorkers=1`, with matching-owner release. Busy slots were queued, never stolen.

- `pnpm install --frozen-lockfile`: pass; existing esbuild ignored-build-script warning.
- `pnpm exec vitest run src/components/EditableTitleField/EditableTitleField.test.tsx --maxWorkers=1`:
  baseline with new test: 1 failed / 9 passed; fixed: 10 passed / 1 file.
- `pnpm typecheck`: pass.
- `pnpm foundations:check`: pass.
- `git diff --check`: pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- Coordinator-run fresh `pnpm exec storybook build --output-dir <run>/storybook`: pass.
- Coordinator-run `pnpm exec playwright test tests/browser/batch13-editable-title.spec.ts --project=chromium --project=webkit`:
  4 passed, 0 skipped, 0 unexpected failures, 0 flaky, 0 global errors.
  Light/dark cases exercise actual read-only keyboard input, native focus retention,
  Enter/Tab commit suppression, Escape, disabled edit trigger and clean reopening.

Logs: `/tmp/batch13-editable-title-{install,baseline,fixed,typecheck,foundations}.log`.
Unit tests ran on the exact product/unit content subsequently committed as `9cb0ced`;
the story/spec refinement `de3fb72` passed typechecks and the final native run.
No API/style/token/build/export/dependency changes. Full suites and broad acceptance
were not rerun under the user-authorized targeted policy. GitHub dev CI/title is
paused; no wait, rerun, dispatch or re-enablement.

## Shared prerequisite and native pool evidence

Coordinator explicitly authorized the normal full-ancestry merge of reviewed
`6b9da4423f1e6675c37571d5552474da25e90258` into this same managed worktree.
Merge `d6a964fb3e855ec9d743e52680fd9a9cafdcf1a1` completed without conflicts.
These shared pool docs/scripts/config changes are an authorized prerequisite,
separate from the exclusive editable-title source scope. No harness copying,
history graft, replacement worktree or source reversion was used.

The coordinator froze this clean checkout, ran the approved pair, and explicitly
released it afterward. Worker did not launch a standalone build/server/browser or
alter the queue. Global lock ownership and queue authority remained with the
coordinator. Pool slot 0 used port 6273; runtime Node 24.21.0, pnpm 10.29.3,
Playwright 1.63.0 on Darwin. Native run source tree:
`3c2af5a2991481412b10a222523364c16012b87e`.
Build digest before/after:
`3c0dfd1567af7d425e72b8329176d3ea9d0a169f6bc9c575865aacb9956ac9ae`.
Evidence final head matches tested head; final tracked status is clean.

Evidence directory (absolute):
`/Users/thomashall/.codex/worktrees/batch13-editable-title/sg-ui/artifacts/browser-pool/8dce103b-d8ec-4a53-9813-0eb8c5a476db/`.
`evidence.json` records commands, hashes, owner, port, runtime and cleanup;
`results.json` records all four passing cases. Only this report changes after
native execution; no unchanged reruns were performed.

## Remaining limits and follow-ups

Required focused Chromium/WebKit native evidence is complete. Firefox was not
selected and remains unverified; no unchanged Firefox retries occurred. No manual/device/assistive-technology or broad task IDs
are closed. Callback replacement does not cancel already-started host work;
existing operation captures its original callback, later retry uses latest props.
This patch does not add host network cancellation or a disabled prop. No broader
source changes are needed for the demonstrated defect. Shared contract/checklist
reconciliation is coordinator-owned outside this allowlist.
