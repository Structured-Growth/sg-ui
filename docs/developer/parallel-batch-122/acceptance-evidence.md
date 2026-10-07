# Batch 122: X-03–X-06 acceptance evidence

Reviewed baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`),
2026-10-07. Managed isolated worktree:
`/Users/thomashall/.codex/worktrees/batch122-acceptance-evidence/sg-ui`.
Initial HEAD equaled the assigned baseline and the worktree was clean. This report
is the only edited file. Source, existing tests/stories, master acceptance,
ledgers, configuration and other reports remain read-only. Coordinator alone owns
integration and acceptance decisions.

## Per-ID disposition

All four parents are **partial**. No whole parent is supported, no new runtime
defect is established, and no additional test was manufactured. This is a fresh
read-only reconciliation of unchecked X criteria against the current baseline
and retained evidence, not another M-row inventory decision. Existing test code
is assertion coverage; it is not a passing execution. Matching component blobs
are limited provenance and do not establish unchanged transitive dependencies or
a current-head/full-matrix pass.

| Criterion | Narrow support at reviewed baseline | Retained executed evidence | Precise remaining gate and owner |
| --- | --- | --- | --- |
| **X-03** Names/descriptions, roles, state announcements, validation, heading hierarchy, landmarks, native form semantics | TextField composes Label/Input, description Text and FieldError, uses native validation and exposes name/form/required/readOnly/disabled. AppShell emits a native main; the host supplies navigation. AppPageHeader exposes headingLevel 1–6 (default 1), so the host owns document hierarchy. Dialog associates default title/description and permits an explicit accessible name for custom chrome. Status maps polite/assertive to status/alert with atomic live regions. The actual grid bridge writes native aria-busy. `batch01-forms.spec.ts` asserts native submit/reset, associated validation and submitted read-only versus omitted disabled values; `acceptance.spec.ts` asserts grid roles/states and four fixture axe scans per theme. | E1 link-modal shard: named initial field, invalid URL focus, aria-invalid and actual error ID in aria-describedby, corrected native Enter and return focus, 4 Chromium passes. E2 modal-boundaries shard: 12 Chromium passes, including nested dismissal and custom chrome. These are representative semantics, not a complete catalog review. | Current-head catalog/state names and IDREF audit, complete heading/landmark composition, native form matrix and retained axe output remain required. Spoken pending/error/success announcement timing needs named AT/browser sessions, especially empty versus retained busy grids. Library owners fix owned semantics; hosts own supplied labels, headings, landmarks and announcement content. DOM role/live-region presence cannot certify speech. |
| **X-04** Initial/return focus, removal/reorder/update recovery, trap and nested dismissal | Dialog implements parent recovery after removed child openers, preserves successful host focus and scopes scrolling; Dialog unit assertions include repeated Tab trapping. Existing native specs cover nested Escape ordering, surviving and removed openers, grid updates and host reorder. | E2 removed-opener shard: 9 Chromium passes for Escape/outside/Close, actual parent or host destination, two-frame stability, surviving child/page triggers and viewport hit testing. E2 modal-boundaries: 12 passes. Relevant Dialog runtime/story/spec blobs match baseline. | Fresh baseline focus matrix across supported engines, complete removal/reorder/update variants, focus traps in every modal composition and mixed nested overlays remain required. These shards do not cover every grid/control; baseline grid interaction blob differs from those historical candidates. Named manual AT/native-device checks remain open. Library owners own repair; hosts own explicit destinations and update/persistence timing. |
| **X-05** Sticky chrome, focused-control visibility, zoom/reflow/text spacing, scroll padding | `display-preferences.spec.ts` asserts all 20 fields and two footer actions at 320 CSS px and 200% root text with spacing overrides; full control bounds, panel/viewport intersection, center hit testing, stationary chrome where it fits, nested portal isolation and initial footer focus. Dialog's focus repair checks clipping ancestors and scrolls nearest only while the original focused descendant survives. Header CSS wraps custom chrome. | E1 dialog-header shard: 8 Chromium passes at ordinary/narrow/short/enlarged layouts, full bounds/hit testing and native Tab/Shift+Tab actions. CSS/story/spec match baseline but Dialog runtime subsequently changed. E3 page-header shard: 12 Firefox passes including both themes, 320px and 200% root text, reflow and visible actions. | Baseline replay of existing modal/display specs and other sticky catalog layouts, actual browser-chrome zoom, complete text-spacing/long-label/state matrix, independent scrollports/overlay collision and scroll-padding needs remain unverified here. Root text scaling/effective viewport width do not drive chrome zoom. Library layout owners and hosts supplying custom chrome share composition responsibility; physical devices/manual visual and AT acceptance remain open. |
| **X-06** Text/non-text contrast, visible focus, high contrast, reduced motion, non-color state meaning | Button uses focus tokens and forced-colors Highlight/ButtonText/GrayText; reduced motion removes transition/spinner animation. Progress has reduced-motion and forced-colors rules while retaining indeterminate semantics. Display spec checks actual forced-colors query application, system focus outline and pending/disabled indications. Page-header spec calculates inherited text contrast against primary/subpage surfaces (≥4.5). | E3 Firefox page-header passes include the actual inherited text/surface ratio assertions in both themes. This proves only those resolved combinations at that tested head. Current forced-colors/reduced-motion tests are inspected but no independently retained run is attributed to baseline here. | Complete rendered text **and non-text** contrast across variants/states/themes, focus ring contrast/visibility, catalog forced-colors and reduced-motion matrix, state meaning beyond color, actual OS high-contrast settings and named manual/device/AT sessions remain open. Header inherited-text ratio does not certify descendant icons, borders, disabled opacity or every token pair. Foundation/component owners own production styles; hosts own overrides. |

## Independently inspected retained artifacts

Artifact root prefix **A**:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/`.
For each entry below, this worker read root `evidence.json`, shard
`evidence.json`, actual `results.json` and the relevant existing spec. Root/source
and build digests initially and finally agree, and final head equals tested head.
Node is `v24.19.0`, Darwin. Actual test `projectName` entries establish the listed
engine; the JSON configuration listing three projects does not establish three
executed engines. Zero skipped/unexpected/flaky tests in each cited passing shard.
These local files are retained at inspection time, not permanently archived.

| Evidence | Tested head / location below A | Actual result | results.json SHA256 |
| --- | --- | --- | --- |
| E1 | `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`; `16f6feff-4479-4f37-8c96-451b694ba457/dialog-header-reflow/` | Chromium 8 expected; overall pool **failed** for other scopes | `cc1d4fc7a9425ebba315388d9942dc75d7c6cff23c75edc7c1aa9d42cdd9ee4b` |
| E1 validation | same head/run; `link-modal-native/` | Chromium 4 expected; overall pool **failed** | `7439af728a34ec16a5356095845722db2ffa0817f3d03078c9faca1c753cb293` |
| E2 | `4987a1fe046c37f2e612d6de159aa09e1e840043`; `afadf38b-8476-4c9b-a10e-2a78d786822d/dialog-removed-opener/` | Chromium 9 expected; overall pool **failed** for grid-shell/pointer scopes | `5aa37457a93bad6cf6573727041ab5629f9ca4e8ac32ae7a356ab43fa09b1c94` |
| E2 composition | same head/run; `modal-native-boundaries/` | Chromium 12 expected; overall pool **failed** | `40d461930ab33756271675c75508f475fd6a7145fae3f51e1d6199236b12904c` |
| E3 | `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`; `693cd1a1-28f1-4986-b345-258b4621c480/page-header-firefox-gap/` | Firefox 12 expected; overall pool passed | `a4a95bab0d296d18f8c5e8afcd25a9528de6a0ac24a3314761d549d80e9f8582` |

E1 source/build digests:
`b6047a36c2eb6749f427c775e1f0c716225a303dd276fd272da6608de5efcc56` /
`1afdb63861962fc7858ba9c42ec5a7e7e5dcc9b89d4f02fad7d6d9ddead899ca`.
E2 source/build:
`f51549571de652b8a8be38addfc49b31da7c903aba36c7e4f0301385bc752b79` /
`101bdd11ab686d9bad4c31857100322d960ee4edfcd19068dc77c1c06aec7a3e`.
E3 source/build:
`6464ca63b43a916374529d26fd88b7cdefcd4efb82b0bcd2014618c1d9bbfe38` /
`d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`.

## Exact baseline source identity

Git blob IDs below were read using `git rev-parse <head>:<path>`; they identify
baseline bytes, not a new execution. Comparison columns refer only to that file.

| File | Baseline Git blob | Attribution limit |
| --- | --- | --- |
| [src/experimental/TextField/TextField.tsx](../../../src/experimental/TextField/TextField.tsx) | `de1f43a5e341da219f3aa353ed90bc1b13b6308e` | E1/E2/E3 equal |
| [src/components/AppShell/AppShell.tsx](../../../src/components/AppShell/AppShell.tsx) | `a0c051d6ab15253a739ee2b831a63741912728cb` | E1/E2/E3 equal |
| [src/components/AppPageHeader/AppPageHeader.tsx](../../../src/components/AppPageHeader/AppPageHeader.tsx) | `9f760230b1fbf1eec043a27b3605148fdbf2243c` | E3 equal |
| [src/components/AppPageHeader/AppPageHeader.module.css](../../../src/components/AppPageHeader/AppPageHeader.module.css) | `1fe3d6971a58e31e502509f8220bda3b1b55d664` | E3 equal |
| [src/components/AppPageHeader/AppPageHeader.stories.tsx](../../../src/components/AppPageHeader/AppPageHeader.stories.tsx) | `b177bf6fb6e98a97efe0fe45883e174e214d8aa1` | E3 equal |
| [src/experimental/Dialog/Dialog.tsx](../../../src/experimental/Dialog/Dialog.tsx) | `b0bd1ef6109dba186bc881854339da68ec896284` | E2/E3 equal; E1 differs (`a2f4c54612bc2f7f3edc7ace4c2a5253cd529e9e`) |
| [src/experimental/Dialog/Dialog.module.css](../../../src/experimental/Dialog/Dialog.module.css) | `2a303b80cad1fecea4558179fabe14e959f65bde` | E1/E2/E3 equal |
| [src/experimental/Dialog/Dialog.stories.tsx](../../../src/experimental/Dialog/Dialog.stories.tsx) | `5a71310e762a3e2d52bd678bab47971924993dc1` | E1/E2/E3 equal |
| [tests/browser/batch50-dialog-header-reflow.spec.ts](../../../tests/browser/batch50-dialog-header-reflow.spec.ts) | `68254e4ed431ada0d4dcd9cdd190cbdf48854456` | E1 equal |
| [tests/browser/batch52-dialog-removed-opener.spec.ts](../../../tests/browser/batch52-dialog-removed-opener.spec.ts) | `7f7007ce64f106f20d35e53839f3fcc1e9a9c2d0` | E2 equal |
| [tests/browser/batch10-page-header-reflow.spec.ts](../../../tests/browser/batch10-page-header-reflow.spec.ts) | `c5652e155212a2e57a0a521b6eca6f8ea66b95bf` | E3 equal |
| [tests/browser/acceptance.spec.ts](../../../tests/browser/acceptance.spec.ts) | `f11daf0511e310efbf365ade27ed482ddc6b5daa` | Inspected assertions only |
| [tests/browser/display-preferences.spec.ts](../../../tests/browser/display-preferences.spec.ts) | `cd5204cc7ab2f3deacc4da235198498138316dc7` | Inspected assertions only |
| [tests/browser/batch01-forms.spec.ts](../../../tests/browser/batch01-forms.spec.ts) | `3a4920ab06603c7681f2bc66c6a65b7027685e8a` | Inspected assertions only |
| [src/experimental/Button/Button.module.css](../../../src/experimental/Button/Button.module.css) | `cccf005e0bdee43ac22d8f8830523938ce5167f6` | Inspected production media rules |
| [src/experimental/Progress/Progress.module.css](../../../src/experimental/Progress/Progress.module.css) | `1f51077901370d9c9009604673bf44b0995fdd1c` | Inspected production media rules |
| [src/components/AppDataGrid/ownedGridInteraction.tsx](../../../src/components/AppDataGrid/ownedGridInteraction.tsx) | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` | E1/E2/E3 differ (`efaee02d06a21b68a70e0c7097e7252a9f1501b3`) |

## Evidence loss and historical limits

The [browser acceptance guide](../react-aria-browser-acceptance.md) and
[progress/status record](../parallel-batch-07/progress-status.md) retain historical
execution claims. The following cited local artifacts are **absent** on this host:

- `/tmp/sgui-display-complete-browser-results.json` and `/tmp/sgui-display-complete-browser.log`.
- `/tmp/sgui-ci-83b8dae2-artifacts` (download directory for historical CI head `83b8dae2148002e79d2df331fd105c274f97ca96`).
- `/Users/thomashall/.codex/worktrees/batch07-progress-status/sg-ui/artifacts/browser-pool/2f22bce2-9ec0-4e2d-a83c-98318a5a2414/evidence.json` (reported tested head `27c68b2d335743057c0e33741e3941828a8eb0d2`).

No artifact download/CI command was run. Historical CI retention/expiry claims
were not reverified remotely. Historical counts, browser engine failures and
repaired assertions remain historical, not reassigned to baseline. The retained
E3 Firefox execution proves that shard's native behavior; it neither certifies
all Firefox suites nor perpetuates an old global local-launch limitation after
later harness changes. See the [header record](../parallel-batch-10/page-header-reflow.md),
[header repair record](../parallel-batch-50/dialog-header-reflow.md),
[removed-opener record](../parallel-batch-52/dialog-removed-opener.md) and
[busy-state record](../parallel-batch-05/grid-busy.md) for original scope/owners.

## Checks performed and coordinator handoff

Performed: clean baseline/worktree identity checks; read exact master X-03–X-06
text; source/spec/report inspection; read-only retained pool/results inspection;
actual executed-engine enumeration; results SHA256; Git blob comparison with
three exact tested candidates; existence checks for cited lost artifacts; local
Markdown link existence and `git diff --check`. No installation, test, build,
pack, browser, performance, CI or lease commands were started. There is no
current-head execution or new native regression result from this worker.

No demonstrated missing production behavior justifies a source-fix allowlist.
No new browser file is needed: the genuine gaps are coverage/execution/manual
evidence and existing deterministic fixtures already cover representative slices.
Coordinator can reserve a fresh immutable baseline validation window for
`acceptance.spec.ts`, `display-preferences.spec.ts`, `batch01-forms.spec.ts`,
`batch52-dialog-removed-opener.spec.ts`, `batch50-dialog-header-reflow.spec.ts`,
`batch10-page-header-reflow.spec.ts`, plus independently owned grid focus/reorder
checks. This is a requested validation window, **UNRUN** in batch 122, with no
new story/source/config authorization. Record exact candidate/build/engine and
retain axe/media/geometry attachments; do not infer whole parents from a green
representative shard. Manual sessions need named AT/browser/OS, concrete state
transitions and actual zoom/high-contrast/device settings. If they expose a
product defect, the coordinator should assign a minimal component-exclusive
source/test scope with the observed repro. Keep X-03–X-06 unchecked here.
