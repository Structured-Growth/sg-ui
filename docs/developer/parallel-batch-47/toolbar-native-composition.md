# Batch47 — M-20 toolbar native composition (F5)

Exact reviewed base: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch47-toolbar-native-composition/sg-ui`.
Initial HEAD matched the requested base and the checkout was clean before edits.

This testing-only slice follows [batch30 F5](../parallel-batch-30/inventory-acceptance-13-24.md),
[toolbar contracts](../react-aria-data-toolbar.md),
[development validation](../react-aria-development-validation.md) and
[browser scheduling](../react-aria-parallel-browser-validation.md).
The supplied short filename `parallel-browser-validation.md` does not exist;
the linked `react-aria-` file is the repository's guidance.

## Scope and assertions

Only the authorized toolbar story, new colocated composition test, new browser
spec and this report change. Production toolbar, Menu, shell and parser are
read-only. Completed sort/filter/draft transactions are not repeated. Removed
option/delimiter decisions remain with their existing owner.

The host fixture composes the real selection menu through the toolbar's left
slot, controlled selected count/search/columns and deliberately rejected view
requests. Host outputs expose ordered callback payloads without fetching rows.
Both locked course/action columns remain visible. Reset restores the hideable
status column. Menu column query dismissal leaves toolbar search intact; explicit
clear and Escape close search, request empty text and restore the search trigger.
Selection and view actions must not submit the containing form.

Two unit cases exercise the composed fixture. Four browser cases pair selection
and columns/search flows at 360px LTR and 320px explicit visual RTL. Native Tab,
Space, Enter, ArrowDown and Escape drive focus; no script focus or selection is
injected. Portaled menu/dialog geometry and inherited visual direction, focused
menu items, restored triggers, exact callbacks and rejected view pressed state
are asserted. The RTL fixture retains the host's English interaction locale;
this is visual direction evidence, not Arabic locale/translation or spoken AT.

## Targeted local evidence

Node `v24.19.0` from the requested bundled runtime; pnpm `10.29.3`.

- `pnpm install --frozen-lockfile`: package installation passed under an atomic
  owned install slot. The initial wrapper erroneously used `lease.release()`;
  its cleanup threw after successful install. Corrected cleanup uses exported
  `releaseLease` and verifies the original exact owner before releasing it.
  This is a driver/environment cleanup error, not a product/test failure. No
  foreign slot was removed and no reinstall was needed.
- `pnpm exec vitest run src/components/DataToolbar/DataToolbar.native-composition.test.tsx src/components/DataToolbar/DataToolbar.test.tsx --maxWorkers=1`:
  **6 tests / 2 files passed**, one worker.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.

The lightweight commands held one atomic owned light slot and released it using
`releaseLease`. Initial source review corrected inherited-direction assertions
to CSS direction before any browser execution; portal ancestors own `dir`.
No native/build/server command ran in this worker. No full check, consumer matrix,
GitHub dispatch, integration, publication or acceptance update occurred.

## Frozen candidate handoff

Pending coordinator fresh Chromium proof against a reviewed disjoint candidate.
Focus args: `tests/browser/inventory-toolbar-composition.spec.ts --project=chromium`.
The coordinator alone owns fresh Storybook build, browser scheduling and candidate
attribution. Candidate/head/artifact evidence will be recorded after that result
in a report-only commit. Source scope remains reserved until fresh Chromium proof.
Firefox/WebKit are intentionally deferred to the batch checkpoint. Whole M-20,
broad native/manual/device/AT and cross-engine acceptance remain open.


## Verified wave23 Chromium result

The pending handoff above is historical; fresh proof completed on 2026-10-07.
The coordinator built and tested candidate
`c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05` in the managed shared candidate
worktree, rather than worker source head
`3fc8bf2627f2c17f09fddabefb7d1dbd00bb384c`.

Independently read the root/shard evidence, raw results and browser log. All four
Chromium cases passed, with zero unexpected, skipped or flaky cases and no global
errors. Root evidence records bundled Node `v24.19.0`, one fresh shared Storybook
build, browser typecheck and the exact anchored spec command:
`pnpm exec playwright test '(?:^|/)tests/browser/inventory-toolbar-composition\.spec\.ts$' --project=chromium`.
The coordinator supplied the supported child PATH; no worker native command ran.

- Immutable candidate source digest:
  `b6047a36c2eb6749f427c775e1f0c716225a303dd276fd272da6608de5efcc56`.
- Immutable build digest:
  `1afdb63861962fc7858ba9c42ec5a7e7e5dcc9b89d4f02fad7d6d9ddead899ca`.
- Root evidence:
  `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/evidence.json`.
- Shard evidence and adjacent raw results/log:
  `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/toolbar-native-composition/evidence.json`.
- Attribution: `/tmp/sgui-batch45-candidate-wave23-attribution.json`.

SHA256 independently matches local frozen files, candidate Git bytes and the
attribution for all four owned files (including this report before this append):

| File | Tested SHA256 |
| --- | --- |
| DataToolbar.stories.tsx | `3d90e662a24baba6146c0b3000feea8b05cd91fd8b4789b6c49f16ad94a5e864` |
| DataToolbar.native-composition.test.tsx | `79abf153495ee3b9baeda39e9d30524a7f6ccec6a435ca33497cc6b050eaae88` |
| inventory-toolbar-composition.spec.ts | `de176dcfcca8a3190d108233fa8388cae83d7348e640f5f683bac70a0b1d2e33` |
| Initial report | `bd4f0296dfffdd616f254ced84b82e06ce6129664c1305a7511a1f8ddb2151ae` |

Overall wave23 failed six other shards; their preserved red evidence does not
become a passing candidate or accepted dev snapshot. This report claims only the
four green toolbar cases. No underlying toolbar product defect was demonstrated.
Source/spec bytes remain unchanged; only this appended evidence changes in the
final commit. Firefox/WebKit, manual/device/AT and whole M-20/broad acceptance
remain pending. Coordinator retains integration and acceptance ownership.
