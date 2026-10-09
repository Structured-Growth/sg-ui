# Assignment 173: checkpoint recovery preparation

Parents: R-01/Z-11. Baseline: `1948d0b54688cf61dfa6708fd94cbc8ca6e21990`.
Managed `/Users/thomashall/.codex/worktrees/b6e8/sg-ui` was clean, detached and
isolated before creation of `codex/batch173-checkpoint-recovery`. Only the four
assigned files changed. No source, pool implementation/tests, workflow, ledger,
queue, foreign lease, process, primary image upload or other worktree changed.

See [runner/recovery contract](../react-aria-checkpoint-recovery.md).

## Cause and execution boundary

The actual daily outer command receipt reports `null/SIGKILL` for the nested pool.
Its root resource guard breached the load ceiling and escalated after three seconds.
The nested aggregate remained `running` with empty persisted command/session arrays,
while per-shard reports and receipts survived. The audit records eight separately
detached servers and 17 retained claims. This is one infrastructure supervision
issue; these artifacts do not establish a product defect. The coordinator owns
current cleanup and has reported explicit remediation. The old audit remains
historical: this worker did not signal or inspect current process/lease identities.

The prepared runner delegates the browser stage directly to the exported pool.
Non-pool stages retain bounded owned-group cancellation and owner-only lease cleanup.
Failed pool stages retain a nested-server verification hold even with settled group
receipts. Missing/unreadable command receipts retain leases. No live checkpoint,
Storybook build, browser, consumer, native or acceptance execution occurred here.

## Read-only actual recovery manifest

Derived afresh from the original plan, daily evidence, pool run, every available
per-shard raw report/resource receipt and the owned-cleanup audit:

| Concern | Actual count |
| --- | --- |
| planned | 94 |
| acceptedGreen | 55 |
| completedReports | 56 |
| acceptanceHeld | 1 |
| incompleteOrUnrun | 38 |
| unrunConsumers | 5 |

The 56 completed reports total 715 expected, two skipped, zero unexpected and zero
flaky cases. `full-014` has ten expected passes and two skips and remains held;
the 55 accepted shards account for 705 attested passed cases. Firefox and WebKit
each skip `native denied clipboard write announces error and keeps keyboard focus`.
No skipped case is converted to accepted evidence. The 38 pending specs are
`full-057`–`full-094`: four failed interrupted receipts, four missing-final-evidence
shards and 30 unrun shards. Five consumers remain unrun:
foundation-react18, foundation-react19, editor-react18, editor-react19, next-consumer.

Original and current build SHA256:
`63ba039937bdf5a6e5ad4695ba9ed44c3dd686a11f07088f91da04be98699b4d`.
Original and current source digest:
`7b2100e6bf75cafa1432b3c5c195c501dbff71e508d8d7da8af42c28fde53fce`.
Original build path: `/Users/thomashall/.codex/worktrees/daily-oct08-frozen-checkpoint/sg-ui/artifacts/daily-browser-pool/730985b1-789c-4f02-ac23-d84f22cc244b/storybook`.
Current bytes match original attestations: `true`.

Resume remains **unsupported**: the exported `runFrozenSnapshot` always builds
a new tree. This manifest must not be executed through that API or its fixture seam.
Original-build reuse requires a separately reviewed exported pool contract. No
rebuild or source mutation is authorized as a substitute for original evidence.

Audit unresolved receipts: full-058, full-061, full-062, full-064. Its settled last-wave
command receipts are full-057, full-059, full-060, full-063; none certifies disappearance
of independently detached server groups. The historical server PIDs are
24908–24915, lease count 17 and root owner token
`browser-snapshot:22262:020ed01c-5bd0-449b-bc5e-8686745a992b`.
Current owner verification and any cleanup/continuation belong to the coordinator.

### Input provenance

| Artifact | SHA256 |
| --- | --- |
| `/tmp/sgui-daily-oct08-browser-plan.json` | `a58abb5d7f0bf362440a4daefdb17a7aa254e42a4f6dd455f3a1095a91ab382d` |
| `/Users/thomashall/.codex/worktrees/daily-oct08-frozen-checkpoint/sg-ui/artifacts/daily-oct08/evidence.json` | `bcea426b11eb5cb602d65ee250bab09aecbbc7aacc3d02edb6ca7538334f8250` |
| `/Users/thomashall/.codex/worktrees/daily-oct08-frozen-checkpoint/sg-ui/artifacts/daily-browser-pool/730985b1-789c-4f02-ac23-d84f22cc244b/evidence.json` | `7daf181468d84138cb4d393bc1fd60fa4a5204929ce9678957d394e4efeeff30` |
| `/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/daily-oct08-owned-cleanup-audit.json` | `a8026adfdede5bfa5de3c22d8919df9ff48e648ec388d1228874baad48d0366a` |

### Exact shard disposition

Raw evidence root:
`/Users/thomashall/.codex/worktrees/daily-oct08-frozen-checkpoint/sg-ui/artifacts/daily-browser-pool/730985b1-789c-4f02-ac23-d84f22cc244b`.
Each row refers to `<root>/<id>/evidence.json`, `results.json` and
`browser.log.resources.json`; original reports remain in place. All plan shards
requested Chromium, Firefox and WebKit.

| ID | Spec | Disposition | Raw expected/skipped |
| --- | --- | --- | --- |
| full-001 | `tests/browser/acceptance-pack-113.spec.ts` | accepted-green | 3/0 |
| full-002 | `tests/browser/acceptance-pack-114.spec.ts` | accepted-green | 3/0 |
| full-003 | `tests/browser/acceptance-pack-117.spec.ts` | accepted-green | 3/0 |
| full-004 | `tests/browser/acceptance-pack-121.spec.ts` | accepted-green | 3/0 |
| full-005 | `tests/browser/acceptance.spec.ts` | accepted-green | 45/0 |
| full-006 | `tests/browser/batch01-adapters.spec.ts` | accepted-green | 9/0 |
| full-007 | `tests/browser/batch01-calendar.spec.ts` | accepted-green | 15/0 |
| full-008 | `tests/browser/batch01-dialogs.spec.ts` | accepted-green | 15/0 |
| full-009 | `tests/browser/batch01-forms.spec.ts` | accepted-green | 12/0 |
| full-010 | `tests/browser/batch01-grid-focus.spec.ts` | accepted-green | 15/0 |
| full-011 | `tests/browser/batch01-grid-reorder.spec.ts` | accepted-green | 9/0 |
| full-012 | `tests/browser/batch01-selectors.spec.ts` | accepted-green | 15/0 |
| full-013 | `tests/browser/batch05-grid-busy.spec.ts` | accepted-green | 6/0 |
| full-014 | `tests/browser/batch05-grid-clipboard.spec.ts` | acceptance-held | 10/2 |
| full-015 | `tests/browser/batch05-grid-shell-state.spec.ts` | accepted-green | 12/0 |
| full-016 | `tests/browser/batch05-native-reset.spec.ts` | accepted-green | 9/0 |
| full-017 | `tests/browser/batch05-portal-direction.spec.ts` | accepted-green | 6/0 |
| full-018 | `tests/browser/batch05-tabs-overflow.spec.ts` | accepted-green | 24/0 |
| full-019 | `tests/browser/batch06-grid-sort.spec.ts` | accepted-green | 6/0 |
| full-020 | `tests/browser/batch07-catalog-tabs.spec.ts` | accepted-green | 96/0 |
| full-021 | `tests/browser/batch07-progress-status.spec.ts` | accepted-green | 15/0 |
| full-022 | `tests/browser/batch08-grid-retry-focus.spec.ts` | accepted-green | 12/0 |
| full-023 | `tests/browser/batch08-selector-direction.spec.ts` | accepted-green | 6/0 |
| full-024 | `tests/browser/batch10-auth-shell-reflow.spec.ts` | accepted-green | 15/0 |
| full-025 | `tests/browser/batch10-card-frame-reflow.spec.ts` | accepted-green | 15/0 |
| full-026 | `tests/browser/batch10-page-header-reflow.spec.ts` | accepted-green | 36/0 |
| full-027 | `tests/browser/batch11-standalone-reset.spec.ts` | accepted-green | 12/0 |
| full-028 | `tests/browser/batch13-control-button.spec.ts` | accepted-green | 3/0 |
| full-029 | `tests/browser/batch13-control-buttongroup.spec.ts` | accepted-green | 6/0 |
| full-030 | `tests/browser/batch13-control-checkbox.spec.ts` | accepted-green | 6/0 |
| full-031 | `tests/browser/batch13-control-disclosure.spec.ts` | accepted-green | 3/0 |
| full-032 | `tests/browser/batch13-control-link.spec.ts` | accepted-green | 3/0 |
| full-033 | `tests/browser/batch13-control-radiogroup.spec.ts` | accepted-green | 9/0 |
| full-034 | `tests/browser/batch13-control-splitaction.spec.ts` | accepted-green | 12/0 |
| full-035 | `tests/browser/batch13-control-switch.spec.ts` | accepted-green | 3/0 |
| full-036 | `tests/browser/batch13-control-taggroup.spec.ts` | accepted-green | 3/0 |
| full-037 | `tests/browser/batch13-control-textarea.spec.ts` | accepted-green | 6/0 |
| full-038 | `tests/browser/batch13-control-timefield.spec.ts` | accepted-green | 9/0 |
| full-039 | `tests/browser/batch13-control-tooltip.spec.ts` | accepted-green | 6/0 |
| full-040 | `tests/browser/batch13-editable-title.spec.ts` | accepted-green | 6/0 |
| full-041 | `tests/browser/batch13-formatting-toolbar.spec.ts` | accepted-green | 18/0 |
| full-042 | `tests/browser/batch13-logout-lifetime.spec.ts` | accepted-green | 12/0 |
| full-043 | `tests/browser/batch14-async-busy.spec.ts` | accepted-green | 3/0 |
| full-044 | `tests/browser/batch14-client-page-shrink.spec.ts` | accepted-green | 9/0 |
| full-045 | `tests/browser/batch15-persistent-recovery.spec.ts` | accepted-green | 6/0 |
| full-046 | `tests/browser/batch17-menu-autofocus.spec.ts` | accepted-green | 9/0 |
| full-047 | `tests/browser/batch20-datefield-incomplete-reset.spec.ts` | accepted-green | 6/0 |
| full-048 | `tests/browser/batch25-timefield-reset.spec.ts` | accepted-green | 12/0 |
| full-049 | `tests/browser/batch50-dialog-header-reflow.spec.ts` | accepted-green | 24/0 |
| full-050 | `tests/browser/batch52-dialog-removed-opener.spec.ts` | accepted-green | 27/0 |
| full-051 | `tests/browser/batch61-keyboard-range-preview.spec.ts` | accepted-green | 6/0 |
| full-052 | `tests/browser/batch62-insert-menu-native-focus.spec.ts` | accepted-green | 15/0 |
| full-053 | `tests/browser/batch63-color-menu-native-transactions.spec.ts` | accepted-green | 24/0 |
| full-054 | `tests/browser/batch64-style-menu-native-selection.spec.ts` | accepted-green | 9/0 |
| full-055 | `tests/browser/batch65-side-navigation-native-flow.spec.ts` | accepted-green | 24/0 |
| full-056 | `tests/browser/batch66-instructor-card-native-presentation.spec.ts` | accepted-green | 9/0 |
| full-057 | `tests/browser/batch67-progress-steps-native-state.spec.ts` | failed | — |
| full-058 | `tests/browser/batch70-organization-switch-lifetime.spec.ts` | missing-final-evidence | — |
| full-059 | `tests/browser/batch77-document-heading-lifetime.spec.ts` | failed | — |
| full-060 | `tests/browser/calendar-native-locales.spec.ts` | failed | — |
| full-061 | `tests/browser/calendar.spec.ts` | missing-final-evidence | — |
| full-062 | `tests/browser/datepicker-native-transactions.spec.ts` | missing-final-evidence | — |
| full-063 | `tests/browser/display-preferences.spec.ts` | failed | — |
| full-064 | `tests/browser/editor-clipboard.spec.ts` | missing-final-evidence | — |
| full-065 | `tests/browser/editor-image-lifecycle.spec.ts` | unrun | — |
| full-066 | `tests/browser/editor-image-sources.spec.ts` | unrun | — |
| full-067 | `tests/browser/editor-links.spec.ts` | unrun | — |
| full-068 | `tests/browser/editor-mixed-formatting-history.spec.ts` | unrun | — |
| full-069 | `tests/browser/editor-paragraph-transactions.spec.ts` | unrun | — |
| full-070 | `tests/browser/editor-rich-document.spec.ts` | unrun | — |
| full-071 | `tests/browser/editor-upload-lifecycle.spec.ts` | unrun | — |
| full-072 | `tests/browser/foundation-catalogue.spec.ts` | unrun | — |
| full-073 | `tests/browser/grid-server-response-races.spec.ts` | unrun | — |
| full-074 | `tests/browser/image-upload-validation.spec.ts` | unrun | — |
| full-075 | `tests/browser/inventory-align-direction.spec.ts` | unrun | — |
| full-076 | `tests/browser/inventory-auth-embedded-host.spec.ts` | unrun | — |
| full-077 | `tests/browser/inventory-card-collection.spec.ts` | unrun | — |
| full-078 | `tests/browser/inventory-card-frame-resize.spec.ts` | unrun | — |
| full-079 | `tests/browser/inventory-editor-chrome.spec.ts` | unrun | — |
| full-080 | `tests/browser/inventory-editor-table-history.spec.ts` | unrun | — |
| full-081 | `tests/browser/inventory-grid-shell-responsive.spec.ts` | unrun | — |
| full-082 | `tests/browser/inventory-layout-replacement.spec.ts` | unrun | — |
| full-083 | `tests/browser/inventory-learner-card.spec.ts` | unrun | — |
| full-084 | `tests/browser/inventory-learner-grid-cells.spec.ts` | unrun | — |
| full-085 | `tests/browser/inventory-link-modal.spec.ts` | unrun | — |
| full-086 | `tests/browser/inventory-modal-boundaries.spec.ts` | unrun | — |
| full-087 | `tests/browser/inventory-pointer-reorder-invalidation.spec.ts` | unrun | — |
| full-088 | `tests/browser/inventory-selection-boundary.spec.ts` | unrun | — |
| full-089 | `tests/browser/inventory-shell-responsive.spec.ts` | unrun | — |
| full-090 | `tests/browser/inventory-toolbar-composition.spec.ts` | unrun | — |
| full-091 | `tests/browser/page-navigator-native-transactions.spec.ts` | unrun | — |
| full-092 | `tests/browser/popover-native-collision.spec.ts` | unrun | — |
| full-093 | `tests/browser/range-picker-controlled-transactions.spec.ts` | unrun | — |
| full-094 | `tests/browser/reorder.spec.ts` | unrun | — |

### Retained artifact hashes

Full generated manifest (contains per-shard hashes, command receipts, held case
identities and historical owner-token claims):
`/Users/thomashall/.codex/worktrees/b6e8/sg-ui/artifacts/batch173/continuation-manifest.json`.
SHA256: `df9ccb52ddb47333be0408011d0b53b1370c80b035b1f92564c3eaf757bb760c`.

The artifact is ignored local evidence and must be retained alongside the original
reports; the committed summary is not a replacement for the raw report bytes.

## Targeted validation

Node: `v24.21.0`; executable: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
Command: `node --test scripts/run-development-checkpoint.test.mjs`.
Exit: `0`, signal: `null`; eight tests passed, zero failed/skipped.
The command ran under a canonical owned four-slot light admission; its receipt
includes both canonical and transition owner tokens, released after settlement.
No install was needed. No foreign occupied slot was reclaimed.
The real inert supervisor fixture takes over three seconds before completing
separately detached child cleanup; the resource/deadline and unverifiable-probe
fixtures retain their distinct red/settled/held outcomes. The latter child was
independently confirmed gone by a native ESRCH probe before fixture-only release.
The manifest fixture preserves held reports, detects mutated build bytes and
rejects a falsely green skipped report.

| Tested source/artifact | SHA256 |
| --- | --- |
| `scripts/run-development-checkpoint.mjs` | `044f0680fe0a93ea90c109cc69387e426019c457b8a0d88c541975559ae53dab` |
| `scripts/run-development-checkpoint.test.mjs` | `30c644fba12ad46010b7c0797838c624675a1d89454998fe7882986e09359e1d` |
| `scripts/browser-validation-pool.mjs` | `d0df14616b329d24f3356bcb73788c294d1f3ff95892ec7e664a5cc458ade323` |
| `artifacts/batch173/tests.log` | `5f3757c28ab26ec6e808d0413a22a6ebe9328efd5a76c3e6e2897cfc0cbaf296` |
| `artifacts/batch173/validation-receipt.json` | `d5d2289d8c47a87c47a6f672d5df38253ee10584fb79945d572fc575c0b78eea` |

Source hashes identify the tested candidate before the evidence commit; the final
commit identifies the same source plus this report. No full `pnpm check`, entire
pool fixture suite, Storybook, browser matrix or packed consumers were run. Actual
full-check/native/consumer and parent acceptance results remain pending. Coordinator
alone reviews, integrates and pushes this history; no merge/push/PR/publication
was performed by this worker.

### Inert subprocess receipts

Retained logs/resource receipts and owner-retention fixture receipts:

| Artifact | SHA256 |
| --- | --- |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-RldG7q/command.log` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-RldG7q/command.log.resources.json` | `858fa39b848c6e724410904a0816a12354852cfb0eff1061a24c9e96bed31d74` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-YzFL7m/supervisor.log` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-YzFL7m/supervisor.log.resources.json` | `a9f71a13b3a23a888ed99a4c0fa0dffed9042e470797a0c56620a596d15187e3` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-lUqpdy/retained-lease.json` | `6a5d9577912990b3258169926fd2bc396a0ba37af882501eebea4cc04094e830` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-lUqpdy/unsettled.log` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-lUqpdy/unsettled.log.resources.json` | `7503c6337be0026cc6c3a92ec5b0f8f43f3f55ef7307a770581ea5c37f554b7b` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-qtFtrW/timeout.log` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `artifacts/batch173/fixtures/sgui-checkpoint-fixture-qtFtrW/timeout.log.resources.json` | `7fc3831988f77ae2c6c9771968d3304edb7f5b47dbfffbce051b34bc96f8ac35` |
