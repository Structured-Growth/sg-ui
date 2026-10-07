# M-17 responsive grid/card native transitions — F3

Latest status: **all four focused Chromium cases passed in wave29**, with no
retries, skips or flaky cases. Exact tested candidate:
`f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`; exact attributed worker head:
`5a229b259c7ce61d09ec6de2c8dc08302b1202fd`. This report-only finalization preserves
all prior red evidence and unchanged implementation/story/spec/unit bytes.
Coordinator review/provisional integration and cross-engine/manual gates remain separate.
This is the bounded F3 evidence slice from the [batch30 inventory review](../parallel-batch-30/inventory-acceptance-13-24.md).
Whole M-17, Firefox/WebKit, manual zoom/device/assistive-technology and broad G/U/X/R/Z acceptance remain open.

## Isolation and scope

Created and attached managed worktree before edits:
`/Users/thomashall/.codex/worktrees/batch46-grid-shell-responsive/sg-ui`.
Clean exact base verified: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
Branch: `codex/batch46-grid-shell-responsive`.
Story/spec commit: `2976e032e8b462f7aa0df412990378799351bf70`.
A separate report commit freezes the ready candidate; coordinator receives its exact SHA.

Changed files:

- `src/components/AppDataGridShell/AppDataGridShell.stories.tsx`
- `tests/browser/inventory-grid-shell-responsive.spec.ts`
- `docs/developer/parallel-batch-46/grid-shell-responsive.md`

Production shell/grid/model/controller/Menu remain unchanged. Existing [client shrink proof](../parallel-batch-14/client-page-shrink.md)
and [controlled shell state evidence](../parallel-batch-05/grid-shell-state.md) were read before writing.
The new cases do not repeat shrink, sorting, reset or rejected-state scenarios.
The existing `inventory-shell-responsive.spec.ts` belongs to AppShell; this task uses the distinct grid-shell filename.

## Native composition

`NativeResponsiveTransitions` is a deterministic host composition with one controlled
criteria object, controlled view mode and host response state. Footer requests accept
one complete `onStateChange` snapshot; view changes do not emit criteria requests.
Host Alt+P/E/R shortcuts change pending/error/ready without transferring focus into
fixture actions. Rows are supplied in server mode, with a known four-row total and
size two; no network races or application-data fetching are simulated.

Four focused cases combine light/dark with normal/200% root text. They resize the
same live composition 760 → 320 → 760 → 320px, activate view triggers with real
Tab/Enter, assert selected trigger focus, and inspect focus outline, hit testing,
viewport bounds and overflow ancestor clipping. They cover cards/list pending/error,
native Retry, accepted list next-page first-cell focus, accepted cards previous-page
first-card focus, retained selection and one toolbar/footer. Pending changes and
subsequent widening preserve the accepted card focus. Every footer acceptance has
an exact host request count; no locator.focus, DOM focus injection or synthetic
selection is used. Root-text enlargement is automated evidence, not manual browser zoom.

Source SHA-256 frozen for attribution:

- Story: `e304c9fcc5e01377f792c621128965c9f788616765d78ba0ed49a007130abfed`
- Spec: `a48c0fdc54777f19dbb26d0bf8e391b813175bfee1b191dea1b8b5acbfe1df0e`

## Targeted local validation

Node `24.19.0` at the requested bundled runtime, pnpm `10.29.3`, Vitest `4.1.11`,
TypeScript `5.9.3`, React `19.2.3`. Commands executed inside this worktree through
`/tmp/sgui-batch46-run.mjs`, which uses canonical atomic acquireInstallSlot /
acquireLightSlot and token-verifying releaseLease in finally. Vitest has one worker.

| Command | Outcome / immutable local log |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed; no manifest/lockfile changes. `/tmp/sgui-batch46-install-3.log` |
| `pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.test.tsx --maxWorkers=1` | 21 passed / 1 file. `/tmp/sgui-batch46-units.log` |
| `pnpm exec tsc --noEmit` | Passed. `/tmp/sgui-batch46-source-types.log` |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Passed. `/tmp/sgui-batch46-browser-types.log` |
| `pnpm foundations:check` | Passed import/layer/token guards. `/tmp/sgui-batch46-foundations.log` |
| `git diff --check` | Passed before source commit. |

Two initial install admissions found both slots occupied and exited before running
pnpm: `/tmp/sgui-batch46-install.log`, `/tmp/sgui-batch46-install-2.log`. They are
resource-admission failures, not product failures. A later admission succeeded;
no foreign tokens/locks/processes were released. No native regression or failing
behavior is classified before real execution. Existing historical red shrink and
engine evidence remains preserved in its original reports.

## Frozen coordinator handoff and remaining proof

Focus args: `tests/browser/inventory-grid-shell-responsive.spec.ts --project=chromium`.
Coordinator alone creates the reviewed mutually disjoint testing candidate and
fresh immutable Storybook/build/server/native run. This worker ran no independent
browser/build/server, full check, consumer matrix, GitHub CI/title, dev integration,
main merge, publish, versions or permission/secret change.

Source/head/report scope remains frozen and reserved through the fresh Chromium
result. Record actual tested candidate SHA, matching owned-file hashes and immutable
run evidence in a report-only follow-up commit after coordinator releases the freeze.
A candidate pass permits review for provisional integration; it does not mean the
candidate is accepted dev or close cross-engine/whole-row gates. Firefox/WebKit
remain coordinator batch-checkpoint work. Concrete native failures require diagnosis
as product, fixture/driver/expectation, environment or unclassified, retaining red
logs/traces and original assertions before any correction.


## Wave23 retained failure and bounded corrections

Actual tested coordinator candidate: `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`.
Immutable run root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/grid-shell-responsive/`.
Read `evidence.json`, `results.json`, failure screenshots, error contexts and trace
snapshots directly. Attribution `/tmp/sgui-batch45-candidate-wave23-attribution.json`
confirms this worker's original story/spec/report bytes in the tested candidate.
Outcome **0 passed / 4 failed**, 0 skipped/flaky. The source/build remained immutable
and all sessions/owned leases settled. Earlier coordinator pre-browser PATH failure
and retained cleanup EPERM are environment/cleanup evidence, not native proof.
Actual wave23 child Node runtime was 24.19.0 with corrected PATH.

Two underlying product issues account for the four native failures:

1. Both normal-text cases reached accepted page zero and the expected rows/request
   count, but `course-1` wrapper was inactive at spec line 112. The screenshot shows
   **Open Course 1** with the focus indicator; trace snapshots show card scrollTop 28.
   Stale focused-card action repair runs before accepted footer-entry repair. Chromium
   releases focus from the newly disabled Previous button; card repair then focuses
   the new card's button, and the footer effect sees another active owner and exits.
   A targeted regression reproduces the native body-focus condition explicitly in
   jsdom (which does not blur disabled controls), and fails before correction:
   **1 failed / 21 passed**, `/tmp/sgui-batch46-footer-red.log`.
2. Both 200% cases fail visibleFocus on the Cards trigger during initial narrow resize
   (spec line 58). The screenshot shows the large footer covering the wrapped toolbar,
   with no usable content viewport in the fixed-height host. The owned shell allowed
   toolbar shrinking and content collapse without an outer scroll fallback. This is
   actual constrained-shell chrome overlap, not an engine launch or selector issue.

Correction commit `4f6379e6a80ed7151a2053f1cbf4bcbe16fcf85f` changes only the owned
shell implementation/CSS/tests. Footer-entry focus now precedes stale card repair;
it resets the actual card-list scroll region (`data-sgui-part="grid-cards"`), focuses
the first wrapper with preventScroll and reveals it within the shell fallback viewport.
Shell chrome no longer shrinks over content, content retains a minimum four owned
control heights, and the shell itself can scroll when chrome/content cannot fit.
A native ResizeObserver reveals its existing keyboard focus by adjusting only shell
scrollTop; it never changes active focus or host scroll. Normal roomy shells retain
independent grid/card content scrolling. No shared grid/controller/Menu change.
The original four browser cases and their assertions are **byte-identical**, with
SHA-256 `a48c0fdc54777f19dbb26d0bf8e391b813175bfee1b191dea1b8b5acbfe1df0e`.

Additional changed files in the final scope:

- `src/components/AppDataGridShell/AppDataGridShell.tsx`
- `src/components/AppDataGridShell/AppDataGridShell.module.css`
- `src/components/AppDataGridShell/AppDataGridShell.test.tsx`

Correction validation uses the same canonical token-owned light wrapper / Node24:

- `pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.test.tsx --maxWorkers=1`:
  **23 passed / 1 file**, `/tmp/sgui-batch46-correction-units-2.log`. Covers the reproduced
  footer/removal race, actual card-scroll reset, resize reveal without focus transfer,
  outside focus ownership and observer cleanup. The initial observer test shared one
  disconnect spy across shell/grid observers and failed its once count; it now identifies
  the shell's own observed instance and asserts that instance disconnects once.
  Retained `/tmp/sgui-batch46-correction-units.log`: 22 passed / 1 fixture-assertion failure.
- `pnpm exec tsc --noEmit`: passed, `/tmp/sgui-batch46-correction-types.log`.
- `pnpm foundations:check`: passed, `/tmp/sgui-batch46-correction-foundations.log`.
- `git diff --check`: passed before correction commit.

Correction SHA-256:

- Implementation: `25746a95d0d1213599f25adf7cf0d54f1b393457338e08ab03b7b42077b659dd`
- CSS: `a762a2ca66b3d201bfc677442665269ec482c1fbef94910ae603654f8273eae8`
- Units: `827c756a26dd8ed99858e5f4a5785b3da67fb2d7d12ab07ec0a835f2d5dad3a5`

Coordinator released wave23 freeze for bounded corrections; this worker refreezes
source/head/report for fresh corrected candidate proof with the **unchanged focus args**.
No unchanged retry, independent native/build/server or assertion weakening occurred.
CSS geometry and native ResizeObserver timing remain unverified until that run.
Source scope stays reserved; Firefox/WebKit/checkpoint and manual/device/AT/whole M-17
acceptance remain open. No dev integration is claimed.


## Wave27 retained evidence and responsive fixture correction

Actual tested coordinator candidate: `4987a1fe046c37f2e612d6de159aa09e1e840043`.
Immutable run root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/afadf38b-8476-4c9b-a10e-2a78d786822d/grid-shell-responsive/`.
Read results, shard evidence, light enlarged screenshot and trace snapshot attributes.
Outcome **2 passed / 2 failed**, 0 skipped/flaky. Both normal theme cases passed;
both enlarged theme cases failed the strict visible/unclipped/indicator predicate
at spec line 101 after accepted list footer entry. Coordinator reports immutable
clean source/build and all commands settled, no resource abort.
Shard build digest: `101bdd11ab686d9bad4c31857100322d960ee4edfcd19068dc77c1c06aec7a3e`.
Window: `2026-10-07T17:28:06.561Z`–`2026-10-07T17:28:26.534Z`.

The remaining failure is **fixture/expectation setup**, distinct from the two prior
product defects. The screenshot shows Course 3 with a visible focus outline; the
assertion that the cell is focused already passed. The trace retains grid scrollTop
7 and scrollLeft 90 at failure. The dedicated fixture reused a `minWidth: 200` first
name column from the general grid story. At 320px with 200% root text, Storybook's
2rem outer scope padding is 64px on each side, leaving a 192px host and approximately
190px bordered grid viewport. A 200px cell cannot satisfy complete-cell unclipping
inside that viewport. This is the configured horizontal grid overflow contract;
it is not a missing outline, wrong active element or environment failure. The
screenshot visibly clips one side of the cell outline.

Correction `7d99e97293999fe67ec5d9ff2b94923a9e2b4853` changes only the dedicated
responsive story's first name column to `minWidth: 160`, with supported `truncate:
false` to preserve readable multiline body text. Remaining columns still require
horizontal overflow. The first cell now has a feasible complete-focus target in
that narrow padded host. No viewport enlargement, changed padding, synthetic
focus, relaxed predicate, test skip/retry or production grid modification was used.
All original four browser assertions remain byte-identical. Prior production
correction implementation/CSS/unit hashes above remain unchanged.

- Story SHA-256: `bc05725c9d9a7a128876ea8cba3d5666412d7b90f0b34a34623d8a1492294454`.
- Spec SHA-256: `a48c0fdc54777f19dbb26d0bf8e391b813175bfee1b191dea1b8b5acbfe1df0e`.
- Token-owned `pnpm exec tsc --noEmit`: passed, `/tmp/sgui-batch46-wave27-source-types.log`.
- Token-owned `pnpm foundations:check`: passed, `/tmp/sgui-batch46-wave27-foundations.log`.
- `git diff --check`: passed before fixture commit.

The 23 passing shell units apply to the unchanged production correction; no
redundant unit rerun was used to claim new native geometry proof. Source/head/report
refrozen and reserved for the coordinator's next fresh candidate Chromium run with
unchanged focused spec args. Whole/manual/device/AT and Firefox/WebKit remain open.


## Wave28 downstream pending-card failure and correction

Actual tested candidate: `24f9b4abb6ae39675b5bdf9abe8c9764a14a059e`.
Immutable run root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3/grid-shell-responsive/`.
Selection was the existing spec, Chromium, exact affected-case `--grep "200% text"`;
**0 passed / 2 failed**, 0 skipped/flaky in the executed selection. The normal-text
cases were outside this run; their prior wave27 pass remains historical evidence.
Read shard results/evidence, light screenshot and retained frame snapshots. The
coordinator confirms clean immutable source/build, settled commands and no resource
abort. Digest `de160daed84eb81439957ab5fe4a760f5405a517f60cdb66a0111167dda23248`;
window `2026-10-07T17:45:23.692Z`–`2026-10-07T17:45:39.992Z`.

The narrower first-cell fixture now passes line 101. Both enlarged cases reach
accepted cards page zero and pass complete wrapper focus visibility at line 112.
After Alt+P inserts refreshing status, the **same focused wrapper** fails complete
visibility at line 115. The screenshot shows Course 1's outline and label, with
its button/remainder clipped at the footer; trace retains the same `course-1`
wrapper and `aria-busy="true"` card list. Focus/outline are preserved; the status
reduces the available card viewport. This is a **product layout defect**, distinct
from the resolved first-cell fixture mismatch. The shell's four-control-height
content minimum previously covered status plus cards together, so a wrapped
status could consume most of the minimum. Observing only the outer shell also
missed internal content resizing when its viewport size stayed fixed.

Correction `cb68e10a7169f4ed20220c6bdf499a860d472460` stays inside the original shell
allowlist. The card content minimum now adds the actual owned status block height
to the four-control-height card reservation. A native status ref/ResizeObserver
measures current wrapping and responds to resizing, with cleanup when status is
removed/replaced; it never changes host state. Status cannot shrink over the cards.
The existing shell focus observer now also observes content size, so inserting or
resizing status reveals its already focused card by scrolling the shell. Active
focus is unchanged; host scrolling and shared grid/controller/Menu remain untouched.

A targeted new regression verifies the measured reservation through pending status,
status resize/removal, content observation, cleanup and retained wrapper focus. A
selected regression against the previous implementation fails at missing 152px
status reservation (`/tmp/sgui-batch46-wave28-regression-red.log`, 1 failed; other
23 units intentionally unselected). This is diagnostic regression proof, not an
acceptance run with skipped cases. Final complete shell unit run has **24 passed /
1 file**, 0 skips, `/tmp/sgui-batch46-wave28-units-final.log`. An earlier corrected
complete run also passed 24 (`/tmp/sgui-batch46-wave28-units.log`).

Token-owned Node24 targeted commands:

- `pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.test.tsx --maxWorkers=1`: 24 passed.
- `pnpm exec tsc --noEmit`: passed, `/tmp/sgui-batch46-wave28-types.log`.
- `pnpm foundations:check`: passed, `/tmp/sgui-batch46-wave28-foundations.log`.
- `git diff --check`: passed before correction commit.

New frozen SHA-256 values:

- Implementation: `017c31eb1f3624b4723e4253fc8c127ec13d3dad1d98aaa3f67a4a82b2001395`.
- CSS: `8e887d61bfce69cc3a2abae2b3bc61a08c750dc9a45466b61ce50ce7f8768420`.
- Units: `38b6b8906bd5805374818d51dab0557a4b80932e359e64170846fcb8bc1a27ee`.
- Story unchanged: `bc05725c9d9a7a128876ea8cba3d5666412d7b90f0b34a34623d8a1492294454`.
- Strict spec unchanged: `a48c0fdc54777f19dbb26d0bf8e391b813175bfee1b191dea1b8b5acbfe1df0e`.

Source/head/report refrozen for fresh coordinator proof. Because production status
layout changed, all four cases are affected for the next focused Chromium selection:
`tests/browser/inventory-grid-shell-responsive.spec.ts --project=chromium`.
No unchanged native rerun, independent native/build/server, assertions weakened,
GitHub/production action or scope expansion occurred. Whole/manual/device/AT and
Firefox/WebKit remain open; geometry/native timing remains pending fresh proof.


## Final wave29 focused Chromium proof

All **4 Chromium cases passed**, 0 unexpected failures, 0 skipped, 0 flaky and
retry index 0 for every result. Read actual root/shard `evidence.json`, `results.json`
and worker attribution directly; no new build/tests/browser/server ran during
report finalization.

Actual tested candidate: `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec` in
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`.
Immutable run root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480/`.
Scoped evidence/log/results under `grid-shell-responsive/`. The coordinator built
fresh Storybook once, typechecked browser sources once and ran five disjoint
shards; the other 50 passing cases are root evidence, not additional M-17 acceptance.

Actual command selection:
`pnpm exec playwright test (?:^|/)tests/browser/inventory-grid-shell-responsive\.spec\.ts$ --project=chromium`.
No grep filter: all four existing strict scenarios executed.

| Exact scenario suffix | Result |
| --- | --- |
| `(light, normal text)` | Passed, retry 0 |
| `(light, 200% text)` | Passed, retry 0 |
| `(dark, normal text)` | Passed, retry 0 |
| `(dark, 200% text)` | Passed, retry 0 |

These certify the bounded native composition: same-live-host width transitions,
keyboard view-trigger focus/indicators, accepted footer focus, one toolbar/footer
and retained selection, list/card pending/error state, native Retry, complete card
focus through pending status insertion and later widening. The original strict
focus/outline/hit-test/clipping assertions passed after the owned product and
responsive fixture corrections; none were removed, softened, skipped or injected
with browser focus/selection.

Shard session: `2026-10-07T18:02:43.488Z`–`2026-10-07T18:02:52.265Z`.
Playwright result duration: 7853.578ms. Node `24.19.0`, pnpm `10.29.3`, Playwright
`1.63.0`; port 6554. Root finished `2026-10-07T18:03:13.863Z`, cleanup states
`owned commands settled` and final owned process list is empty.

Root source HEAD/final HEAD both equal the actual tested candidate; final tracked
status is empty. Source digest before/after:
`6464ca63b43a916374529d26fd88b7cdefcd4efb82b0bcd2014618c1d9bbfe38`.
Build digest before/after and shard digest all match:
`d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`.

Worker attribution `/tmp/sgui-batch45-candidate-wave29-attribution.json` records
worker head `5a229b259c7ce61d09ec6de2c8dc08302b1202fd`, original exact base
`0186aff866d1b0b568817631f3d0da83ee0d49e3` and all six owned changed paths.
Current worker hashes were recomputed and match candidate attribution:

| Frozen file | SHA-256 |
| --- | --- |
| Shell implementation | `017c31eb1f3624b4723e4253fc8c127ec13d3dad1d98aaa3f67a4a82b2001395` |
| Shell CSS | `8e887d61bfce69cc3a2abae2b3bc61a08c750dc9a45466b61ce50ce7f8768420` |
| Shell units | `38b6b8906bd5805374818d51dab0557a4b80932e359e64170846fcb8bc1a27ee` |
| Responsive story | `bc05725c9d9a7a128876ea8cba3d5666412d7b90f0b34a34623d8a1492294454` |
| Original strict native spec | `a48c0fdc54777f19dbb26d0bf8e391b813175bfee1b191dea1b8b5acbfe1df0e` |

The old attributed report hash `396acb826697d7632da00fcdd7d99d5792d1dce725dff0620c943b816fb4ec45`
belongs to the pre-proof report at that worker head. Only this report changes in
finalization. The next report-only commit is not itself the tested candidate;
unchanged source/spec hashes provide exact attribution.

Wave23 0/4, wave27 2/4 and wave28 0/2 selected-case reds remain preserved above
with their immutable artifacts and distinct product/fixture/environment diagnoses.
Unit regression reds also remain recorded. No unchanged retries or replacement of
historical red evidence occurred. Latest corrected full shell units remain 24
passed, source/browser types and guards are recorded targeted evidence.

Coordinator alone performs exact-head review and individual provisional dev
integration. This worker has not merged/pushed dev, integrated the whole testing
candidate, created production acceptance or run GitHub CI/title/publication actions.
The bounded F3 Chromium proof is complete; **Firefox/WebKit for this new spec,
manual browser zoom/reflow, physical devices, assistive technology and whole M-17 /
broad G/U/X/R/Z acceptance remain open**. Automated 200% root text is not manual
browser zoom or screen-reader evidence. Source/story/spec/tests remain frozen at
the attributed bytes; only this unique report is finalized for coordinator delivery.
