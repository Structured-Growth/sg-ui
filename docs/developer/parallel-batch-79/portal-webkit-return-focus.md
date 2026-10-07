# Batch 79 portal WebKit return-focus evidence

Bounded H-06/U-19 follow-up: the historical en-US portal return-focus failure
**did not reproduce** in the coordinator's fresh single-case WebKit run. All
retained strict focus assertions passed; no source/spec change is warranted by
this result. This report does not establish the historical cause or broad acceptance.

## Ownership and historical evidence

Reviewed baseline and actual tested head:
`78cb4406356733fd22333f791b137f3bcadbf3fb`.
Isolated managed report worktree:
`/Users/thomashall/.codex/worktrees/batch79-portal-webkit-return-focus/sg-ui`.
Branch: `codex/batch79-portal-webkit-return-focus`.
Exclusive changed file: `docs/developer/parallel-batch-79/portal-webkit-return-focus.md`.
Source, story, spec, harness, dependencies and configuration remain unchanged.
The primary image-upload work and all existing worktrees were preserved.

The requested [standalone reset report](../parallel-batch-11/standalone-form-reset.md)
contains no portal failure detail. The available historical passage is instead in
[batch05 native-reset validation](../parallel-batch-05/native-reset.md#validation),
lines 72–78 at the reviewed baseline. It records Linux CI
[37626736273](https://github.com/Structured-Growth/sg-ui/actions/runs/37626736273)
at worker head `c4364dfb2761ee01be03005cb9a6c88fce79dd8a`: nine native-reset
cases passed, but the overall run had 20 browser passes and one WebKit en-US
portal failure, expecting `en-US actions` focused and receiving inactive.

That committed narrative is available evidence; raw historical results/trace were
not retrieved. It does not identify which of three actions-focus assertions failed.
The historical cause therefore remains unclassified among product,
fixture/driver/expectation, and environment. Earlier
[portal evidence](../parallel-batch-05/portal-direction.md#validation) records
four Chromium/WebKit passes after child-dismissal synchronization, separately
from this later Linux failure. Neither historical record proves current failure.

## Exact retained case and expected contract

Spec: `tests/browser/batch05-portal-direction.spec.ts`.
Case title: `en-US retains independent visual direction and locale in nested portals`.
The story is `migration-proofs-provider--explicit-portal-directions`, at 320×640.
English interaction locale initially has RTL visual direction, dark theme and
compact density; reversing visual direction retains the locale and scope.

The existing test requires these native focus transitions:

1. Keyboard opening the nested actions menu focuses `Review settings`.
2. Escape returns focus to `en-US actions` while the settings dialog remains visible.
3. Activating `Reverse visual direction` updates the portal direction and returns
   focus to `en-US actions`.
4. Reopening then escaping removes the menu and focuses `en-US actions` before
   the parent Escape is sent.
5. Parent Escape removes the settings dialog and focuses `Open en-US`.

These assertions reflect the retained owned Menu/Popover nested-dismissal contract;
no expectation was weakened and no extra probe/test was introduced.

## Actual coordinator execution

Coordinator wave40 ran once against the frozen reviewed dev snapshot on macOS
(`darwin`, OS release `27.0.0`), Node `v24.19.0`, pnpm `10.29.3`, Playwright `1.63.0`.
The known engine-specific historical failure authorized this early WebKit check.

Actual browser command (suffix title filter accounts for project/file prefixes):

```sh
pnpm exec playwright test '(?:^|/)tests/browser/batch05-portal-direction\.spec\.ts$' --project=webkit --grep 'en-US retains independent visual direction and locale in nested portals$'
```

Fresh Storybook build and browser TypeScript check passed once before execution.
The supervisor selected exactly **one WebKit case**, passed with **retry 0**,
including every strict actions/trigger focus assertion. No unchanged retry ran.
Slot 0 used loopback port 6863. Total execution was 39.194 seconds;
browser command/window was approximately 3.634 seconds. Swap stayed zero.

Evidence token: `4335714e-28de-48d3-9072-b09aca81fdda`.
Retained coordinator artifact root:
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/artifacts/browser-pool/4335714e-28de-48d3-9072-b09aca81fdda/`.
`evidence.json`, `build.log`, `types.log`, and
`batch79-portal-webkit/browser.log` hold the execution evidence.

- Initial/final HEAD: `78cb4406356733fd22333f791b137f3bcadbf3fb`.
- Source Git tree: `d80c45af6a3b705f20d064e48d4ccc6a308efef2`.
- Initial/final source digest: `0e78725a82281909a87509d0aa10bf523aad2e9279517cc809dd04db42d2d097`.
- Initial/final build digest: `360038cb210c3a8d549f83c6eb4504b87ea5bf2afe1ef58db9b5606f39ec3697`.
- Final coordinator Git status: clean.

The artifact was read directly for this report. The report author ran no browser,
build, install, full suite, config copy or lock acquisition. Documentation validation
checks relative links, exact exclusive diff and `git diff --check`; this report-only
commit does not alter the tested source and requires no unchanged browser rerun.

## Cleanup and acceptance limits

Supervisor owner: `browser-snapshot:35282:bdd303bb-33c2-42f8-bbef-12bda6c467d1`.
Evidence records owned commands settled and no owned processes remaining.
Coordinator reports heavy/legacy locks absent and removal of only its own first
queue entry. The report author did not remove locks, processes, artifacts or worktrees.

This single current-head macOS pass cannot explain the historical Linux failure
or establish universal WebKit reliability. Arabic portal behavior, the whole engine,
Chromium/Firefox/full matrix, manual/native devices, assistive technology and broad
H/G/U/X/R/Z acceptance remain unverified/open in this slice. If the failure recurs,
reserve a bounded owned Menu/Popover nested return-focus investigation tied to the
exact failing transition and retained raw trace before classifying or fixing it.
Automatic dev CI/title checks remain paused; none were dispatched, waited,
rerun or re-enabled. No main integration, publishing or force operations occurred.

Coordinator final documentation verification: all 3 relative links/anchors passed; exclusive report-only diff and `git diff --check` passed. Exact retained native evidence fields matched. This is documentation verification, not another browser execution.
