# Batch180: F-P23-03 manual vertical Tabs source correction

## Bootstrap and ownership

Managed isolated worktree `/Users/thomashall/.codex/worktrees/manual-tabs-source-fix/sg-ui`
started from `codex/dev` at `770946944a17f8ed8dca848be79c75b523f857ec`.
Before edits, normal merge of testing-only `c770682e931eff06462c9c11da1ce6dd76d63269`
produced bootstrap `a4385973434ea8f653be842fdbfa67247ec882cd` (both parents retained).
Branch: `codex/batch180-manual-tabs-source-fix`. Final cumulative product delta is
only Tabs.tsx and its existing colocated test. The helper and Batch179 browser spec
remain byte-identical to bootstrap. No CSS, stories, other owners, central acceptance
records, dev/main integration, browser/build, CI, push or publication changes.

## Diagnosis from retained evidence and installed implementation

Immutable coordinator evidence:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence/functionality-manual-tabs/manual-tabs-corrected`.
The settled browser log fails **End must preserve ancestor scroll**, host top 109
instead of 0. Trace call@67 sends native End at 1160.574ms. The 1166.186ms snapshot
already shows History focused and owning list top 240. At 1205.342ms the host top
is 109. This is a product failure despite the two-frame settlement observation;
it is not evidence that the host was intended to scroll.

Installed React Aria 3.52.1 provides the precise automatic/manual distinction:

- `dist/private/selection/useSelectableCollection.mjs`: `navigateToKey`, `home`
  and `end` update focusedKey, but fall through to `return false` when
  `selectOnFocus` is false. Automatic activation replaces selection and returns
  undefined for the same accepted navigation.
- `dist/private/interactions/createKeyboardShortcutHandler.mjs`: false maps to
  `shouldPreventDefault: false` and continued propagation. Undefined from an
  existing shortcut maps to prevented default. Thus manual navigation changes
  focus **and leaves native key scrolling enabled**, including End/Home.
- `useSelectableItem.mjs` focuses through focusSafely. Separately,
  `useSelectableCollection` schedules owning-list reveal followed by
  `scrollIntoViewport` in requestAnimationFrame. The owned focus-capture helper
  writes only the list axis and cannot cancel the native key default. Settlement
  waits observe movement; they cannot prevent it.

The default-prevention defect is confirmed by an actual cancelable key event in
an owned Tabs unit composition. Trace snapshots do not capture native scroll call
stacks; the fresh coordinator browser case must establish that this correction
also preserves the full native host invariant. No claim that the viewport helper
alone caused the 109-pixel displacement is made.

## Final correction

A bubbling handler on the owning strip runs after React Aria's manual handler.
For manual vertical Tabs, it prevents default only for plain ArrowUp, ArrowDown,
Home and End from a direct, enabled tab in that strip. React Aria continues to own
focus, disabled skipping, wrapping and activation. Modifier/composition events,
Space/Enter, panel/host events, automatic activation and horizontal paths retain
their existing handling. No stopPropagation, prototype/method override, ancestor
scroll restoration, timeout, forced click or global default suppression remains.
The original list-only reveal helper is unchanged.

The existing controlled manual vertical unit case now asserts native default
prevention and exact focus destinations for the four keys while retaining selected
Details until explicit Space activation and host acceptance. Alt+End remains
unprevented. Total affected unit cases remains 14; no new smoke case or matrix.
The Batch179 browser spec retains native arrows, End/Home, Enter/Space, two-frame
settlement and every six-value ancestor/other-strip invariant unchanged.

An initial local method-bridge candidate was abandoned after the deeper shortcut
return-value diagnosis; its red unit log is retained under `artifacts/batch180/attempt1`.
A second red unit attempt correctly detected that the added four-key sequence ended
on Details before the existing Access Space assertion. The fixture now explicitly
navigates back to Access; the existing selection assertion is intact. That red log
is retained under `attempt2`. Neither attempt launched a browser. Final cumulative
source contains no method bridge.

## Exact-head targeted validation

Tested source head: `6562ed59e4c0a426b2eea8f31379a2061394e76d`.
The subsequent report-only commit changes no tested source bytes.
Node v24.21.0 executable:
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
Actual pnpm executable: `/opt/homebrew/bin/pnpm`, with that Node first on PATH.
Raw argv, tested HEAD, leases, log hashes, process-group settlement, CPU/memory
samples and cleanup receipts are retained in ignored `artifacts/batch180`.

Frozen install exited 0 under canonical install slot0 and legacy slot-0, owner
`batch180-install-733d5efa-21cf-42ba-b88f-d5429fe80cf5`.
Log SHA-256: `0c239048891238aa32e35b11bad49213c05e2c1574b271b762e2197478631772`.
The first receipt wrapper mistakenly read a void helper return after the successful
install; its receipt was reconciled from the existing resources file without
rerunning installation. Matching leases had already released.

Final light checks used canonical slot1 and legacy slot-1, owner
`batch180-light-41dfc520-3ee1-4fa1-9fdd-2531212c658a`. All commands exited 0 and
owned process groups settled. Matching leases released; foreign light slot0 untouched.

| Actual pnpm arguments | Result | stdout/stderr SHA-256 |
| --- | --- | --- |
| `exec vitest run src/experimental/Tabs/Tabs.test.tsx src/components/AppPageTabs/AppPageTabs.test.tsx --maxWorkers=1` | 14 tests pass | `931aea7549568c69c3c7d1547ee4286dd20ee4772ffd095ebc8e45acf50ed830` |
| `typecheck` | exit 0 | `6842d71eb1f22c60375759b774aee6336b43fbafb2c820d392c9eff8a49837d0` |
| `exec tsc --noEmit -p tests/browser/tsconfig.json` | exit 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `foundations:check` | exit 0 | `020900f2182f5870c0dbdd0aa3709cdbc3969c08f73e193bc315b538af15d50d` |
| `tokens:check` | exit 0 | `4ab5dda0b5197e60c78060e7326b70588dc8e2beb8ed9ec1a75894b405144c08` |

Existing AppPageTabs hyperlink case emits jsdom's unsupported navigation diagnostic;
both unit files exit 0. `git diff --check` passes.

Source SHA-256:

- Tabs.tsx: `82d0e741e5d422f04074a34241e5f263fb0a22abed0df9912968109bf06c693e`
- scrollTabIntoView.ts (unchanged): `5730dbfc9024dd98ff9381d716bafb62c230b3fbaf289016b27e6d327b410618`
- Tabs.test.tsx: `f9a4b7af5c6d063e8d2a367b8b83536f7c170eeeddf452d49e978c7f5d59c058`
- tabs-vertical-orientation.spec.ts (unchanged): `fda34e12ec0f7ed0ab86dbfce72071b3387c12c6201d35fe2123c56d07bb0210`

## Coordinator handoff

Review cumulative diff against bootstrap, then fresh-build and run only Chromium
`vertical manual owns overflow and Up/Down focus in en-US$`. Retain the existing
automatic and horizontal RTL greens without reruns. No local browser or Storybook
build was performed. F-P23-03 remains open until exact-byte native proof; cross-engine,
physical-device, assistive-technology and broader acceptance remain pending. The
final scope fixes the evidenced plain-key flow; it does not establish all modal
viewport, modified-key or rapid-key behavior.
