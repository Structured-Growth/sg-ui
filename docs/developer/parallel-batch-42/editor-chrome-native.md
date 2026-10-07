# M-22/M-23 F6b combined native editor chrome

Authorized bounded evidence slice, 2026-10-07. Reviewed baseline
`3c31ee6daae917ad82fbd2bd882c203f381d75dd`; attached isolated worktree
`/Users/thomashall/.codex/worktrees/batch42-editor-chrome-native/sg-ui`, branch
`codex/batch42-editor-chrome-native`. Only the two authorized component directories,
`tests/browser/inventory-editor-chrome.spec.ts`, and this report are writable.
No runtime implementation change or reproduced product defect is claimed.

Read the [Batch30 review](../parallel-batch-30/inventory-acceptance-13-24.md),
[editor contract](../react-aria-editor-layout.md), existing seven toolbar/five
chrome tests and stories, and the [validation policy](../react-aria-development-validation.md).
Existing standalone command/title tests are preserved. Added two live replacement
unit regressions and one composed native fixture/spec for the uncovered F6b cases.

## Composition and native coverage submitted

The `NativeHostComposition` story composes the actual ContentEditorChrome,
DocumentEditorToolbar, owned Button/Menu and one unchanged native host editor.
One host owns controlled heading, pressed state, zoom, callback availability and
editor focus. It does not implement Lexical formatting or recreate library keyboard
interaction. Chrome File emits its actual HTML button anchor. The host's controlled
Menu has a visible Document commands trigger, which is its positioning/restoration
anchor; this deliberately does **not** assert positioning at Chrome's external
anchor. Host dismissal/action schedules editor focus after Menu's native trigger
restoration. Host timer cleanup is included. Arbitrary host overlay implementations
and external-anchor positioning are outside this evidence.

Four submitted Chromium cases combine light/dark with 320px normal text or 640px
viewport/200% root font size (an effective narrow enlarged-text layout). They assert
heading callback after native selection with stable editor focus and unchanged text,
controlled Bold, File keyboard action/pointer dismissal, callback counts, native
anchor identity, live read-only/pending/unavailable replacements retaining editor
identity/focus and pressed state, usable zoom, optional-group removal/restoration,
disabled placeholders, wrapped component boundaries and unobscured focused controls.
The host editor is presentation-only; these cases do not certify selection commands,
rich-document transformation, caret restoration, Lexical or a second scroll owner.
Programmatic `.click()` is used only to request host state replacement without moving
editor focus; actual library command/overlay cases use native keyboard/pointer input.
200% root font size is not physical-device zoom or manual assistive-technology proof.

## Observed local checks

Runtime: Node `v24.21.0`, pnpm `10.29.3`. Admission used atomic install slot0 and
light slot0 owner tokens; leases were released only after matching the owning token.
`pnpm install --frozen-lockfile` passed (2.5s; existing pnpm esbuild build-script warning).

- `pnpm exec vitest run src/components/DocumentEditorToolbar/DocumentEditorToolbar.test.tsx src/components/ContentEditorChrome/ContentEditorChrome.test.tsx --maxWorkers=1`: final 14/14 passed.
- `pnpm typecheck`: passed production/story types.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed browser types.
- `pnpm foundations:check`: passed owned imports/layers/tokens.
- `pnpm tokens:check`: passed generated token consistency.

Preserved initial red evidence: `/tmp/sgui-editor-chrome42-unit.log` had 13 passed,
1 failed because the new test asserted zero arguments for a replacement toolbar
callback; the Button supplies its press argument. Classification: test expectation
defect, not a demonstrated product regression. Corrected assertion checks one
replacement-handler call and zero old-handler calls. Final evidence:
`/tmp/sgui-editor-chrome42-unit-rerun.log`. Other logs have prefix
`/tmp/sgui-editor-chrome42-` (install/types/browser-types/foundation/tokens).

## Immutable coordinator handoff and limits

Focused browser args: `tests/browser/inventory-editor-chrome.spec.ts --project=chromium`.
Fresh built Storybook and Chromium execution are **pending coordinator immutable
pool validation**, not a local pass. Source/spec/report freeze at the submitted
commit for that run. Coordinator owns integration and exact tested-head evidence.
No independent Storybook build, browser/heavy run, full check, packed consumer
matrix, GitHub CI/title dispatch, main change or publication occurred here.
Firefox/WebKit remain batch-checkpoint pending. M-22/M-23 whole-row acceptance,
broader E/G/U/X/R/Z, manual/device/AT and selection/overlay trust boundaries remain
open. Any shared Menu/Select issue requires an exclusively reserved successor;
no shared implementation is writable in this slice.


## Pre-admission fixture correction

Original prepared head `06a3eef74c829538c7c83d7196e0066943ba6a26` is preserved.
Coordinator independent read-only review identified a deterministic fixture
precondition mismatch before native pool admission: each state-loop iteration
physically clicks Zoom in, which leaves focus there, while the next virtual host
update expected editor focus without first establishing it. Classification:
fixture/expectation defect found by inspection; no native failure or product
focus-restoration defect is claimed.

The corrected spec explicitly focuses the editor and verifies settled focus before
**each** host prop update. It retains real Zoom activation, value and callback-count
assertions, and explicitly verifies that Zoom retains focus after its click. This
does not add product focus restoration. Only this report and the owned browser spec
changed. Targeted browser TypeScript checking passed again under the matching-owned
light slot lease; log `/tmp/sgui-editor-chrome42-browser-types-correction.log`.
Fresh Chromium remains coordinator-pending, with the same focused args.


## Wave22 red evidence and owned correction

Coordinator tested prepared head `4e8d24484fba51f2bbc5d86622cc7be3f4f43b2b`
as byte-identical owned files in clean shared candidate
`e6270941ea8828d8868fef0798451a599a9db25f`. Fresh Storybook was built once by the
coordinator; runtime Node24, Chromium shard editor-chrome-native, port6320.
Observed **0 passed / 4 failed / 0 skipped / 0 flaky**. All four stopped at the same
first-item focus assertion after File opened the controlled Menu; subsequent
return-focus/state/geometry assertions did not execute. Original candidate,
source/build hashes and artifacts remain preserved. Attribution:
`/tmp/sgui-batch45-candidate-source-attribution.json`. Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/`;
shard `editor-chrome-native/evidence.json`, `browser.log` and retained traces.

Trace DOM records a visible menu container with tabindex0 and an item with
tabindex-1/no committed item. Installed Menu-trigger implementation inspection
shows that trigger Enter/ArrowDown sets first-item strategy; external controlled
open changes bypass that trigger path. The fixture's Chrome File callback only
sets open=true. Classification: fixture/expectation defect (unestablished native
keyboard-entry strategy), not demonstrated shared Menu or toolbar/chrome product
regression. No shared implementation is changed.

The corrected owned spec first asserts settled native menu-container focus, then
sends native ArrowDown before asserting first-item focus and native Enter action.
All host editor-return assertions, request counts, dismissal and remaining live
state/geometry checks are retained. This tests actual native keyboard entry rather
than programmatically focusing an item or weakening focus requirements. Source
story remains unchanged. Browser TypeScript checking passed again under an owned
light lease, log `/tmp/sgui-editor-chrome42-browser-types-wave22-correction.log`.
The corrected head awaits coordinator fresh native validation; the original wave22
failure remains red and is not represented as a pass. No independent heavy/native
run or unchanged retry occurred.
