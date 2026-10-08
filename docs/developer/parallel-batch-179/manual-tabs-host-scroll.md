# Batch179: F-P23-03 manual Tabs native-scroll correction candidate

## Bootstrap and scope

Managed isolated worktree `/Users/thomashall/.codex/worktrees/manual-tabs-host-scroll/sg-ui`
started from `codex/dev` at `e4e60bd`. Before edits it fast-forwarded to testing-only
`49e58e6b41af84e943590df518a870f733bdc8fc`. This brings held Batch170 and other
prepared sources into this candidate; it does not accept them into dev. Branch:
`codex/batch179-manual-tabs-host-scroll`. Only the assigned browser spec and this
report changed. Batch170 CSS, stories, documentation and product source are intact.

## Retained failure and classification

Coordinator evidence lives at
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence/functionality-final-five/pool/tabs-functionality`.
Its Chromium manual vertical en-US case ended with host scrollTop 47 instead of 0.
Window and other-list values stayed zero. The automatic vertical en-US and default
horizontal RTL cases passed and are retained without rerunning them here.

Trace inspection places the first recorded host scrollTop 47 immediately after
Enter activates Details following Home: call@157 Home starts at 1883.563ms;
call@165 Enter starts at 1890.597ms; the 1893.706ms snapshot contains host top 47.
The ending call@175 returns `[0, 0, 0, 47, 0, 0]`. The red trace/log are unchanged.

Installed React Aria 3.52.1 `useSelectableCollection` schedules its owning-list and
native viewport scroll pass in requestAnimationFrame after focusedKey changes.
The fixture previously advanced on synchronous focus/visibility alone, before that
scheduled pass necessarily completed. The owned helper itself only writes the
owning list axis. This establishes a missing settlement observation in the fixture;
it does **not** conclusively attribute the 47-pixel movement to fixture sequencing.
Underlying failure classification remains **unclassified pending fresh native proof**,
with a fixture sequencing candidate. No product fix or native pass is claimed.

The existing case now observes two animation frames after focus, then polls full
vertical visibility. This permits the queued focus-scroll frame to run before the
next action. It does not reset scroll, dispatch fake events or replace native keys.
The six-value window/host/other-list equality remains unchanged and is additionally
asserted after ArrowDown, Space, End, History activation, Home and Details activation.
Details selection is awaited before reverse wrapping. Any actual ancestor movement
will fail at its initiating transition. No new smoke case was added.

## Exact-head lightweight evidence

Tested candidate source head: `3e3bf1621931dd1e55b05b270a87b140fe642110`.
Node v24.21.0 executable:
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
Actual command executable `/opt/homebrew/bin/pnpm` with this Node first on PATH.
Raw argv, HEAD, lease ownership, exit and log hashes are retained in ignored
`artifacts/batch179/install.json` and `artifacts/batch179/light.json`.

Frozen install used canonical install slot0 and legacy slot-0, owner
`batch179-install-d55d9280-0608-4344-b0ac-c73711e2f0f6`, exit 0.
Install log SHA-256: `fbd027d628c69c6163fdbfde85f07d1d353eb78f554da25449c3d609484b6556`.
Light checks used canonical slot1 and legacy slot-1, owner
`batch179-light-e2967ba7-bbc0-42a4-8977-49ff3ca88ff4`. Matching leases were released;
foreign slot0 was untouched.

| Actual pnpm arguments | Result | stdout/stderr SHA-256 |
| --- | --- | --- |
| `exec vitest run src/experimental/Tabs/Tabs.test.tsx src/components/AppPageTabs/AppPageTabs.test.tsx --maxWorkers=1` | 14 tests pass | `ec02cbc706966ecd022fa0b98dc03c90c9ba3b9861751df229110fded74db2f2` |
| `typecheck` | exit 0 | `25a7907f9a28b4d826acc5e2f6b859c3974cbd3b1ed207e65a9bf2228e689514` |
| `exec tsc --noEmit -p tests/browser/tsconfig.json` | exit 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `foundations:check` | exit 0 | `e2278691df9cc34451df918e2aae38ee6ebf35db41b8dd0087b9b94e21d41fd2` |
| `tokens:check` | exit 0 | `65a2edcdcd360c40ad9debd52e21532e0d887ff46264c5229fa7361959012a88` |

The existing AppPageTabs hyperlink case logs jsdom's unsupported navigation
message; both unit files exit 0. `git diff --check` passes.

Source SHA-256:

- Tabs.tsx (unchanged): `6e2a35d4cd78f005d9465fbe8d99de9b05340492ee6327458a298e9af81ce847`
- scrollTabIntoView.ts (unchanged): `5730dbfc9024dd98ff9381d716bafb62c230b3fbaf289016b27e6d327b410618`
- Tabs.test.tsx (unchanged): `04c8f74c5f5c3ebf6cb7706a2897ce4b34c179ffc9accab649cc7efadab49567`
- tabs-vertical-orientation.spec.ts: `fda34e12ec0f7ed0ab86dbfce72071b3387c12c6201d35fe2123c56d07bb0210`

## Coordinator handoff and limits

No local Storybook build, browser run, full matrix, central state write, dev/main
integration, push or publication occurred. Coordinator should fresh-build and run
only `vertical manual owns overflow and Up/Down focus in en-US$` in Chromium.
Retain the two earlier green cases. A red intermediate invariant establishes the
next bounded product diagnosis; a green result supports the settled manual primary
flow, with rapid consecutive-key behavior outside that observation. Review the
classification before acceptance. F-P23-03 remains open until coordinator review
and fresh Chromium proof; Firefox/WebKit/device/AT and broad gates remain pending.
