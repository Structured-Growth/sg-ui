# Batch 94: A-07–A-10 acceptance evidence

Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (requested
reviewed/pushed codex/dev prerequisite). Review date: 2026-10-07.
Managed worktree: `/Users/thomashall/.codex/worktrees/batch94-acceptance-evidence/sg-ui`.
This is a fresh read-only source/contract/evidence review at that exact head,
not a fresh runtime matrix or parent acceptance decision. Only this report is
changed. Root owns checklist/ledger updates, integration and any follow-up assignment.

## Per-criterion disposition

“Supported definition” below means the requested API/requirements are specified
and matched the inspected source. It does not mean every catalog control was
runtime accepted. The master rows remain untouched. This review does not repeat
inventory 29/30/31 whole M-row reviews or claim new passes for existing proof cases.

| ID and exact criterion | Disposition at reviewed head | Concrete support and remaining gate |
| --- | --- | --- |
| A-07: Specify native click versus normalized press semantics without surprising consumers; prevent duplicate callback invocation and document keyboard/touch activation. | **Partial: definition/implementation supported; consumer guide contradiction actionable.** | [Architecture](../react-aria-architecture.md#owned-contracts) specifies one `onPress()` with no native click companion; [Button](../../../src/experimental/Button/Button.tsx) has no public onClick and chooses exactly one callback path. Ordinary actions use internal React Aria press; submit/reset omit that handler and use guarded native click capture before the form default. The [button guide](../react-aria-button.md) documents pointer/keyboard/touch and native form ordering, but its ContentEditorChrome paragraph still claims legacy MouseEvent callbacks/unmigrated composition. Current [chrome source](../../../src/components/ContentEditorChrome/ContentEditorChrome.tsx) instead declares `onPress(anchor: HTMLButtonElement)` and uses an owned Button/ref. Correct that contradictory consumer mapping before proposing definition closure. Historical native evidence is bounded as below; no current-head runtime pass, physical touch or spoken AT claim. |
| A-08: Define public variant, size, tone, density, placement, dismissal-reason, and validation contracts independently of any foundation. | **Supported definition in the reviewed contracts; parent owner review required.** | Button literal unions own `filled/outlined/text`, `primary/neutral`; ThemeScope owns compact/comfortable. Dialog and AppModal own six sizes (different documented defaults md/sm); Popover owns md/lg and four logical placements; Tooltip owns eight placements. Dialog's four dismissal strings reach AppModal through an owned alias. TextField/Select/RadioGroup/DateField expose owned required/invalid/error/value/bounds options; native validation is an internal mapping. [Proof contracts](../react-aria-proof-controls.md), [primitive mappings](../react-aria-primitives.md), [modal guide](../react-aria-modal-shells.md) and [calendar contract](../react-aria-calendar-contracts.md) define these meanings. No inspected public prop interface extends interaction-engine props; internal imports are not public vocabularies. No universal size or validation enum is invented. Host final validation and durable persistence remain host-owned. No additional runtime gate is implied by this definition-only criterion; emitted declarations/full catalog acceptance are separate evidence. |
| A-09: Define accessible naming and description requirements for icon-only and compound controls; choose typed requirements where practical. | **Supported definition with explicit host responsibilities; parent owner review required.** | Architecture and [recipe](../react-aria-component-recipe.md) require names and associated errors/descriptions. IconButton requires `label: string`, omits competing aria-name props, hides the icon wrapper and retains native aria-describedby via Button. TextField's union requires visible label or aria-label; ButtonGroup, Menu, Select and RadioGroup require labels; Popover requires title. Menu links its explicit label and error IDs; field descriptions/errors use associated slots. Dialog/AppModal intentionally allow optional naming with translated generic fallback; guides tell hosts to supply meaningful title/aria-label and label custom headers. [Icon guide](../react-aria-icons.md) separates decorative and meaningful standalone icons. Generic Button cannot statically infer whether ReactNode children are icon-only, so its naming requirement is documented rather than incorrectly claimed as enforced. String types do not validate nonempty meaningful translations. Host naming and actual spoken name/description quality need host review/manual AT for broader accessibility acceptance, not a fabricated automated pass. |
| A-10: Define composition and escape hatches: supported slots/parts, render callbacks, refs, className/part classes, CSS variables, and native style where needed. | **Supported definition in the reviewed contracts; parent owner review required.** | Architecture documents stable data-sgui-part hooks, native styles/classes, CSS layers and variables. Button owns start/end decorative slots and native button ref/class/style. Dialog/AppModal own header/footer/body slots, native dialog ref and separate body/surface styling. ContentEditorChrome owns rightSlot/native div ref and anchor callback. Grid columns own `renderCustomCell(row)` and shell cards own `renderCard(row)`; no engine renderer payload escapes. ThemeScope's ScopeStyle admits `--sgui-*` properties and only these propagate to portals, not layout styles or arbitrary ancestor stylesheet values. The [API reconciliation](../react-aria-public-api-reconciliation.md) precisely limits native ref targets and export routes. Menu/Popover do not expose arbitrary ref/class/style/slot bags; TextField offers root/input classes but no native style prop. These are bounded APIs, not implied missing universal escape hatches. Generated classes/private engine DOM are not supported hooks. Future extension requests require an API-owner decision and demonstrated composition need. |

## Current source observations versus actual execution evidence

Read existing assertions, not merely test names:

- [Button tests](../../../src/experimental/Button/Button.test.tsx) assert exactly
  three callbacks for click/Enter/Space, native ref identity, disabled/pending
  blocking and explicit form participation. Parameterized submit/reset cases clear
  the event array between gestures and assert exactly `[press, nativeAction]`.
- [Native button spec](../../../tests/browser/batch13-control-button.spec.ts) uses
  real keyboard/mouse on the existing NativeFormTransitions story. It checks
  pending draft/focus retention, zero events while pending/disabled, replacement
  callback and exact resumed reset/submit ordering. It already covers the identified
  duplicate form-activation hazard; another spec would duplicate it.
- [IconButton tests](../../../src/experimental/IconButton/IconButton.test.tsx)
  assert action naming, hidden icon semantics, description continuity across
  loading/label changes, exact activation counts and native external form ownership.
  [Chrome tests](../../../src/components/ContentEditorChrome/ContentEditorChrome.test.tsx)
  assert callbacks receive the same native button anchor for click/Enter/Space,
  form-safe behavior and disabled/loading/unavailable blocking.
- Colocated stories supply deterministic existing fixtures. This worker neither
  executed those tests/stories nor added a browser spec. No demonstrated new native
  regression or fixture gap warrants new test code in this assignment.

The [retained button report](../parallel-batch-13/control-button.md) records the
initial failed run at `d6e77073be8797bdbac131fa55b2518a450fb179`, then corrected
Chromium/WebKit 2-pass execution at `0c6fc7664e1faffee0071ac55e48390603bfd748`.
Git object comparison here confirms the Button implementation, test, story and
browser spec blobs at that historical corrected head are identical to those at
the reviewed head (hashes below). This establishes unchanged reviewed files,
not equivalence of all transitive dependencies or a current-head execution.
Firefox was not selected in that run. No result is extrapolated to touch or AT.

Historical raw evidence was recorded under
`/Users/thomashall/.codex/worktrees/batch13-control-button/sg-ui/artifacts/browser-pool/eff31a65-03c7-4663-877e-9bca8a541041/`
(`evidence.json`, `results.json`, plus logs/report), and local repair log
`/tmp/batch13-control-button-native-after.log`. Exact-file existence checks here
found both JSON files and that repair log **absent**; their raw contents were not
revalidated. The committed report remains readable Git evidence, not retained
raw results. This new worktree also has no `artifacts/browser-results.json` or
`artifacts/browser-report/index.html`.

The [IconButton report](../parallel-batch-13/control-iconbutton.md) records
Node 26.5.0 unit/type evidence at `2c326a094fffa8177d98f31e1dc7e687358e2f9b`,
not a supported-runtime/browser matrix. Its browser-spec path was only an allowed
future path: `tests/browser/batch13-control-iconbutton.spec.ts` does **not** exist
at the reviewed head. Do not interpret that report's allowlist as an executed spec.
The [batch-02 report](../parallel-batch-02/architecture-docs.md) is prior docs-only
reconciliation at baseline `9554f1eb6a6f630e98f21eec6bdb6fa592450064`, not native proof.

[CI configuration](../../../.github/workflows/ci.yml) retains
`sgui-browser-node-24` for **14 days**, with `artifacts/browser-report/`,
`artifacts/browser-traces/`, `artifacts/browser-results.json` and
`artifacts/packed-browser/`; Storybook is a separate 14-day artifact.
[Browser guidance](../../../tests/browser/README.md) and
[Playwright config](../../../playwright.config.ts) require Chromium/Firefox/WebKit,
one worker, no retries and a freshly built static fixture. No specific CI run ID
or downloadable artifact was inspected here. Local `/tmp` and ignored artifact
paths have no guaranteed retention; committed report blobs remain in Git history.

## Actionable exclusive handoff

1. **A-07 consumer documentation correction:** minimal new follow-up allowlist
   only `docs/developer/react-aria-button.md`. Replace the stale ContentEditorChrome
   paragraph with its current owned `onPress(anchor)`/native-ref mapping and link
   [editor layout contracts](../react-aria-editor-layout.md). Targeted check:
   read the current chrome props/action/tests and guide mappings, verify local
   links, then `git diff --check`. No source change or new runtime test is needed.
   This worker cannot edit that guide under its exclusive allowlist.
2. **If the coordinator requires fresh duplicate-callback execution:** use existing
   `tests/browser/batch13-control-button.spec.ts` at a frozen source head in its
   exclusive native window, with fresh static Storybook and exact commands/head,
   immutable digest, JSON results and retained artifact location. Include Firefox
   in a supported environment; local launch limitations are prerequisites, not
   acceptance. This is an existing-check request, not a new fix assignment.
3. **Broader physical touch/AT prerequisites:** owner supplies a physical touch
   device/browser pair and records one action per tap, keyboard/virtual activation,
   pending/disabled blocking and submit/reset ordering; an AT tester supplies actual
   screen reader/browser versions and verifies meaningful action/group/dialog names,
   descriptions/error association and pending announcements. DOM descriptions and
   emulation do not meet these gates. No legal gate is specified by A-07–A-10;
   licensing approval remains separately owned and was not changed or waived.

No actionable production implementation gap was demonstrated. Optional naming
fallbacks and deliberately absent universal style bags are documented constraints,
not authorization to expand APIs. Root alone decides whether supported definitions
satisfy the parent criteria, after reconciling the specific A-07 contradiction.

## Review validation and ownership

Performed only Git/files/source/link inspection: verified exact baseline, reviewed
README/migration/component architecture before analysis, read relevant contracts,
source/props/refs/stories/assertions and retained reports, compared historical blobs,
checked exact artifact existence and CI retention configuration. Local report links
and changed-path ownership are checked before commit; final commit/status are sent
to the coordinator because a report cannot contain its own commit hash.

Not run: install, typecheck, guards, unit/browser tests, Storybook/build/pack,
performance, global leases, CI commands or workflow dispatch. No current runtime
pass is claimed. No shared source/config/master acceptance/ledger/generator/other
report edits, other worktree mutation, publication, merge or PR creation.

## Immutable evidence manifest

All paths below are relative to repository root; hashes are Git blob SHA-1 from
`git rev-parse e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>`.
This records the reviewed inputs, not newly emitted declarations or build outputs.

| Input | Git blob |
| --- | --- |
| `src/experimental/Button/Button.tsx` | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| `src/experimental/Button/Button.test.tsx` | `f9aad2486d3e8ec6ecca44cb3fd2f20ac81f8bdd` |
| `src/experimental/Button/Button.stories.tsx` | `38be82c23d7e7a1acdfd4b358addb4029b6c0329` |
| `src/components/AppButton/AppButton.tsx` | `390012b3f4b1724f3d9b9f60b4a1832e8b9f5cc7` |
| `src/experimental/IconButton/IconButton.tsx` | `4e138431786d5c5166a54fab22171824960fdf0c` |
| `src/experimental/IconButton/IconButton.test.tsx` | `38b4d4588479b0a23965a071422a149b0008dc6f` |
| `src/experimental/TextField/TextField.tsx` | `de1f43a5e341da219f3aa353ed90bc1b13b6308e` |
| `src/experimental/Select/Select.tsx` | `e4d05fbdef870aec23f46fbe34deef6bc723f62e` |
| `src/experimental/RadioGroup/RadioGroup.tsx` | `a4066df47f478d815a3f9be10fe2fa3f6b54be40` |
| `src/experimental/ButtonGroup/ButtonGroup.tsx` | `51a1ccdc929654f454afec16e8d1aa594ef5c414` |
| `src/experimental/Menu/Menu.tsx` | `60ebffe51e492d220465271c2b783c422ccc716a` |
| `src/experimental/Popover/Popover.tsx` | `a892ebeb2665f432c635619bc2be43ee5abcb174` |
| `src/experimental/Tooltip/Tooltip.tsx` | `487f588c887a21f4365e700ad8272c04fa4bcb6f` |
| `src/experimental/Dialog/Dialog.tsx` | `b0bd1ef6109dba186bc881854339da68ec896284` |
| `src/experimental/DateField/DateField.tsx` | `559fd4918096a536452e8ebd57abc48a84e1a619` |
| `src/components/AppModal/AppModal.tsx` | `82b09b4104fd0d5c14dd4d63c4fca20bcbe3fc16` |
| `src/components/ContentEditorChrome/ContentEditorChrome.tsx` | `8313b32bcb67e6c07fbab4e59f4f634be89ea020` |
| `src/components/ContentEditorChrome/ContentEditorChrome.test.tsx` | `eae8ffa189d5b3198769a172699f655f59ad03df` |
| `src/components/AppDataGrid/ownedGridColumns.ts` | `5c5ae8541622c9689db5ed74d5eaf1c1c5f8f18d` |
| `src/components/AppDataGridShell/AppDataGridShell.tsx` | `32310c5053ef335e38709f1650a7909be214722f` |
| `src/foundation/ThemeScope.tsx` | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| `src/adapters/Link.tsx` | `d5ed5662009771f4283760af377191d9c7a1da71` |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `docs/developer/react-aria-architecture.md` | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| `docs/developer/react-aria-button.md` | `f649306ebd479ca18cf77aab1f6864f8147dbfc9` |
| `docs/developer/react-aria-primitives.md` | `e3d7832c63d99f33f312935b69d7447dc6268d6b` |
| `docs/developer/react-aria-proof-controls.md` | `cdab2ff6b34438f02fdeaa0784b76c2169b0b107` |
| `docs/developer/react-aria-modal-shells.md` | `294a3e1d9882a565f95ebc793af42d786cbc3ba3` |
| `docs/developer/react-aria-calendar-contracts.md` | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| `docs/developer/react-aria-icons.md` | `f2524b342566b5727f41267a9990eb405c0a6f32` |
| `docs/developer/react-aria-component-recipe.md` | `651d3a10138372c9863363426821efb86bc7d85e` |
| `docs/developer/react-aria-public-api-reconciliation.md` | `98165e3f545ddc7a3d08a5f0301ac8b0814d56b1` |
| `docs/developer/react-aria-editor-layout.md` | `c7c0228e179ba261892997109fcb630bc93be3fd` |
| `docs/developer/parallel-batch-02/architecture-docs.md` | `839e963080033f45ea396d51525f4bcf1f00a7e9` |
| `docs/developer/parallel-batch-13/control-button.md` | `d0ff259ad7b8c4384d2bea8d86ef040222435e46` |
| `docs/developer/parallel-batch-13/control-iconbutton.md` | `1b304d7bda5bbed00cbbf764d75056aceac026db` |
| `tests/browser/batch13-control-button.spec.ts` | `b2664dfd3c6c49da852d7e3278f8c819370a2118` |
| `tests/browser/README.md` | `82b8b0806d5a9a95c60ebcea85f7f67875f900da` |
| `playwright.config.ts` | `ef2fb5556b35d18e74c7c02cdc512e92f2964223` |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
