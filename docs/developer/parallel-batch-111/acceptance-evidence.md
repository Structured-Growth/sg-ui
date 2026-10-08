# Batch 111: U-08/U-09/U-10/U-17/U-18 acceptance evidence

Read-only assessment dated 2026-10-07 against reviewed `codex/dev`
`e43bf604be74e0daf731bc990e6c3097f05ed89b`. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-111-acceptance/sg-ui`.
Only this report is changed. No parent checkbox, production module, historical
report, shared configuration or ledger is changed. Root owns acceptance/integration.
These are distinct unchecked parent criteria, not another M-row inventory review.

## Per-ID matrix

| Criterion | Disposition at assessed head | Exact supporting scope | Remaining gate / owner |
| --- | --- | --- | --- |
| U-08 | **Partial**, with retained native evidence for removed-opener recovery | `Dialog.tsx` owns title Heading, description IDREF, four dismissal reasons, native ref and recovery; React Aria ModalOverlay/Modal/Dialog supply modal interaction. `AppModal.tsx` composes owned chrome/actions. Dialog/AppModal unit assertions cover initial/return focus, dismissal locks and nested Escape. `batch01-dialogs.spec.ts` specifies three-level containment, dismissal order, outside/Close reasons and reflow. Retained shard below establishes nine Chromium removed-opener cases at its actual candidate head; relevant Dialog/spec/story blobs match this baseline. | Scroll locking/background interaction are delegated to the engine, but the inspected specs do not directly assert background native wheel/scroll prevention and complete background interaction isolation/restoration. Require a bounded native check before closure; Firefox/WebKit recovery, device and spoken nested-modal order remain open. No production defect established by this inspection. |
| U-09 | **Partial; actual contract capability missing** | `Tabs.tsx` exposes automatic/manual activation, controlled/default selection and disabled items. React Aria generates tablist/tab/panel roles and reciprocal associations. CSS supplies focus outline, disabled style and horizontal overflow; focus calls `scrollTabIntoView`. `Tabs.test.tsx` and `batch05-tabs-overflow.spec.ts` specify disabled skipping, RTL arrows, Home/End, native panel focus and 100/200% overflow. | `TabsProps` has no orientation prop, and CSS/API are horizontal only. Vertical Up/Down navigation/layout cannot be accepted from horizontal tests. Root must decide/assign owned vertical contract. Historical two-engine result is not a baseline run; actual browser zoom, device/AT and current Firefox evidence remain open. |
| U-10 | **Partial; narrow owned contract supported by current source** | `Link.tsx` selects native external links and adds deduplicated noopener/noreferrer for case-insensitive new-tab targets. `adapters/Link.tsx` retains real anchors/custom host Link and routes eligible unmodified internal clicks only after consumer cancellation; downloads/modifiers/targets remain native. `Breadcrumbs.tsx` supplies named nav/ordered ancestors and final aria-current page. Link/Breadcrumbs/navigation unit sources and adapter/browser specs specify these contracts. | Historical external/native-download and new-tab passes have exact reports but the sampled raw artifacts are absent (below). No fresh run at baseline. Real host router implementations and device/AT remain host/coordinator acceptance. No new defect demonstrated; no need to repeat existing implementation tests merely to create this report. |
| U-17 | **Partial** | Shared `tokens.json` owns focus width/offset/color and compact 2rem/comfortable 2.75rem control heights. Button, TextField, Checkbox, Switch, RadioGroup and Tabs CSS consume focus/control tokens and disabled selectors. TextField/Checkbox/RadioGroup supply native validation associations; Switch deliberately has no required/error contract. `Status.tsx` supports explicit off/polite/assertive announcement and atomic meaningful changes; Progress deliberately uses progress semantics without a live region. Existing composed/native specs specify pointer/keyboard, validation and disabled behavior. | Shared CSS tokens do not prove every computed target dimension, contrast, density, theme, forced-color state or all primitive behavior. Inline links need a target-size/spacing exception decision; no blanket control-height inference. DOM status/aria-live presence does not prove spoken output/order. Coordinator owns complete cross-primitive browser matrix; manual AT/device owner must supply actual results. No blanket status API change is justified. |
| U-18 | **Partial** | `TextField.tsx` forwards name/autocomplete/form and native validity, requests value changes only on native edits, and uses `useStandaloneFormReset` with delegated-prevention/reassociation cleanup. Checkbox/Switch/RadioGroup use named native inputs with owned controlled/default contracts. `batch01-forms.spec.ts` specifies exact FormData, required blocking, submit/reset, read-only inclusion, disabled omission and host rejection. `batch05-native-reset.spec.ts`, `batch11-standalone-reset.spec.ts` and per-control specs extend prevented/reset/association coverage. Button native submit/reset transaction coverage already exists. | autocomplete attribute forwarding is not profile autofill/password-manager execution. Require actual populated-profile autofill observation and controlled/uncontrolled synchronization, submit values and host callback behavior. Broader form-associated/date/select controls must retain their own current evidence; representative four-control form cannot close every primitive. Physical input/AT, implicit-submit matrix and current engine checks remain open. No source defect asserted from absent autofill evidence. |

## Retained native evidence inspected directly

The existing batch-52 report names candidate `cc6f92f...`, but the raw pool record
at its cited location actually identifies **`4987a1fe046c37f2e612d6de159aa09e1e840043`**.
This report attributes evidence to the raw record, not that prose head.

Pool location:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/afadf38b-8476-4c9b-a10e-2a78d786822d/`.
Read `evidence.json`, `dialog-removed-opener/evidence.json` and
`dialog-removed-opener/results.json` without running any job. Pool status is
**failed** for other scopes; its completed dialog shard is **passed**,
Chromium only, 9 expected / 0 skipped / 0 unexpected / 0 flaky.
Node v24.19.0, darwin 27.0.0; shard interval 2026-10-07
12:28:06.568–12:28:16.274 America/Chicago (17:28 UTC).
Recorded source tree `8a50029c7df81a98e395dfaa8c3e447d7d0e8927`;
source digest `f51549571de652b8a8be38addfc49b31da7c903aba36c7e4f0301385bc752b79`;
shard/final build digest
`101bdd11ab686d9bad4c31857100322d960ee4edfcd19068dc77c1c06aec7a3e`.
The pool records owned commands settled. This is a retained historical shard,
not whole-pool success or a fresh baseline full matrix. Git blob comparisons show
identical baseline/candidate Dialog implementation, Dialog unit test, removed-opener
spec and AppModal story. Engine/package/harness/other dependencies are not thereby
certified identical; no Firefox/WebKit/device/AT inference is made.

Recorded final fields: `finalHead=4987a1fe046c37f2e612d6de159aa09e1e840043`, `finalStatus=""` (clean), `finalSourceDigest=f51549571de652b8a8be38addfc49b31da7c903aba36c7e4f0301385bc752b79`.

| Retained JSON | SHA-256 of bytes inspected |
| --- | --- |
| `evidence.json` | `d4983f86bd31fbc9c747f80e537ca36f57ffce3d9fc22ca44d51efb5c0308eb8` |
| `dialog-removed-opener/evidence.json` | `a5ffe31d73210709cad22c2cda4cda0ee9e3db017a7c7d490f5b6480af5a865e` |
| `dialog-removed-opener/results.json` | `5aa37457a93bad6cf6573727041ab5629f9ca4e8ac32ae7a356ab43fa09b1c94` |

## Historical reports and artifact loss

| Record | Exact historical tested head / result claimed in record | Direct retention check now |
| --- | --- | --- |
| [Dialogs](../parallel-batch-01/dialogs.md) | implementation `4466db3`; report says 10 Chromium/WebKit passes, five Firefox launch failures | Report retained in Git; no exact raw dialog artifact revalidated in this assignment. The report does not give an exact final tested SHA, so implementation ancestry alone cannot identify its full runtime tree. |
| [Tabs](../parallel-batch-05/tabs-overflow.md) | `28a2f447b9b4d3b88eb0e4fc2a1350c7627f8d05`; 16 Chromium/WebKit passes, eight Firefox launch failures | Exact cited `/tmp/sgui-batch05-tabs-browser.log` absent. Source/spec Git blobs retained. |
| [Native forms](../parallel-batch-01/forms.md) | `ef74857739a818cb55b5c559e1084843e71d786b`; eight Chromium/WebKit passes, four Firefox launch failures | Exact cited `/tmp/sgui-batch01-forms-browser-rerun.log` absent. |
| [Link](../parallel-batch-13/control-link.md) | frozen `b9e981ffea6ea6ab0d77125172d480242b2645c7`; three engine passes claimed | Both evidence/results JSON absent at exact recovery-worktree pool `dd10086b-dd74-4279-ab72-13b99912f3f7`. |
| [Standalone reset](../parallel-batch-11/standalone-form-reset.md) | frozen `e1c922c94b87ec3232d328c97861eae0f2b904a2`; eight Chromium/WebKit passes claimed | Both evidence/results JSON absent at exact review-worktree pool `efd7fe1f-9c81-4198-943c-ae903c651f2c`. |
| [Button](../parallel-batch-13/control-button.md) | corrected frozen `0c6fc7664e1faffee0071ac55e48390603bfd748`; two Chromium/WebKit passes claimed | Both evidence/results JSON absent at exact task-worktree pool `eff31a65-03c7-4663-877e-9bca8a541041`. |

Historical failures and later reported corrections remain distinguished. Absent
local artifacts may exist elsewhere; no deletion, expiry, remote CI success or
recovered artifact is inferred. No remote CI inspection was performed. The
[general browser record](../react-aria-browser-acceptance.md) contains older CI
heads; none constitutes this baseline's full acceptance matrix.

## Minimal exclusive follow-up handoffs

- **U-09 actual missing vertical capability:** after root chooses the contract,
  source allowlist only `src/experimental/Tabs/Tabs.tsx`, `Tabs.module.css`,
  `Tabs.test.tsx`, `Tabs.stories.tsx`; a separately assigned uniquely named Tabs
  browser spec verifies vertical role/orientation, Up/Down disabled skipping,
  automatic/manual controlled selection, panel association and vertical overflow.
  Change `scrollTabIntoView.ts` only if the chosen layout needs vertical reveal.
  Targeted typing/import-token guard + Tabs unit/native checks; root owns public
  mappings if the experimental contract is exposed through another wrapper.
- **U-08 evidence gap:** test-only assignment for background interaction/scroll
  restoration and locks against existing NestedOverlays fixture. First establish
  whether the host page actually scrolls; do not add a vacuous wheel assertion or
  corrective test CSS. Production allowlist remains empty unless a failure
  identifies Dialog or AppModal as owner. Current removed-opener spec already
  covers recovery; root may queue its Firefox/WebKit engines without duplication.
- **U-17/U-18 manual evidence:** no source write required to collect spoken
  status/focus order or genuine browser-profile autofill. Record OS/browser/AT,
  input method, exact head and controlled/uncontrolled host acceptance. Attribute
  probes or synthetic value assignment must not substitute for these gates.

No optional `acceptance-pack-111.spec.ts` was added. Vertical Tabs requires source
contract work; autofill/AT require manual/profile evidence; existing native specs
already express the other bounded transactions. A new duplicated test would not
establish missing acceptance. No fresh test is reported passed or queued by this worker.

## Exact read-only checks and source identity

Performed: managed worktree creation at the pinned baseline, clean Git status/HEAD
inspection, README/migration/architecture reads, `rg` criteria/path/assertion
searches, direct source/CSS/test/story/report reads, exact artifact existence and
JSON/stat/hash inspection, and `git rev-parse <head>:<path>` identity comparisons.
No install, tests, typecheck, build, pack, browser, performance, global lease or CI
command ran. Final documentation checks verify relative links and whitespace.

The following retained Git blobs identify current evidence inputs, not execution:

| Path at assessed baseline | Git blob |
| --- | --- |
| [`src/experimental/Dialog/Dialog.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/Dialog/Dialog.tsx) | `b0bd1ef6109dba186bc881854339da68ec896284` |
| [`src/components/AppModal/AppModal.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/components/AppModal/AppModal.tsx) | `82b09b4104fd0d5c14dd4d63c4fca20bcbe3fc16` |
| [`src/components/AppModal/AppModal.stories.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/components/AppModal/AppModal.stories.tsx) | `82846596103dbcc3b8811b928837378b7a03cdae` |
| [`tests/browser/batch52-dialog-removed-opener.spec.ts`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/tests/browser/batch52-dialog-removed-opener.spec.ts) | `7f7007ce64f106f20d35e53839f3fcc1e9a9c2d0` |
| [`tests/browser/batch01-dialogs.spec.ts`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/tests/browser/batch01-dialogs.spec.ts) | `b8a9ac949241c6d0e8f753e4bc782e44fb7a6322` |
| [`src/experimental/Tabs/Tabs.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/Tabs/Tabs.tsx) | `1ebeec17270334ad7f52a32dd966ebd43595955a` |
| [`src/experimental/Tabs/Tabs.module.css`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/Tabs/Tabs.module.css) | `2339422bd3c8450ccde92972dd3c3cfcc3b1c33c` |
| [`tests/browser/batch05-tabs-overflow.spec.ts`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/tests/browser/batch05-tabs-overflow.spec.ts) | `d949a1c5357a123eeecc146e7e2399bd6ec9d3e8` |
| [`src/experimental/Link/Link.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/Link/Link.tsx) | `0eb6f15f598350a6b6e246eed3b7e59367dcae49` |
| [`src/adapters/Link.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/adapters/Link.tsx) | `d5ed5662009771f4283760af377191d9c7a1da71` |
| [`src/experimental/Breadcrumbs/Breadcrumbs.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/Breadcrumbs/Breadcrumbs.tsx) | `8c2c5ef1d21aaddd40624a25e5d2006d9818474d` |
| [`src/foundation/tokens.json`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/foundation/tokens.json) | `64113cf0b2117e9bf1c2982bfe44c05a2ba59cee` |
| [`src/experimental/Status/Status.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/Status/Status.tsx) | `58d1d5e1aba096e902199a2d71b5dd1a16325a8f` |
| [`src/experimental/TextField/TextField.tsx`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/TextField/TextField.tsx) | `de1f43a5e341da219f3aa353ed90bc1b13b6308e` |
| [`src/experimental/TextField/useStandaloneFormReset.ts`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/src/experimental/TextField/useStandaloneFormReset.ts) | `857ce2ff695b7dd44aff634250f0680cf471ae9c` |
| [`tests/browser/batch01-forms.spec.ts`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/tests/browser/batch01-forms.spec.ts) | `3a4920ab06603c7681f2bc66c6a65b7027685e8a` |
| [`tests/browser/batch11-standalone-reset.spec.ts`](https://github.com/Structured-Growth/sg-ui/blob/e43bf604be74e0daf731bc990e6c3097f05ed89b/tests/browser/batch11-standalone-reset.spec.ts) | `e30f8894d9309dcc20d399b8b448d7eb19e6d6b5` |

All five parent criteria stay open. Narrow source support and retained shard evidence
are offered for root review; no whole-parent acceptance is claimed.
