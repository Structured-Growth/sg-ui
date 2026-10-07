# Batch 142: comfortable enlarged-text card containment

Parent links: M-09 / U-07. This is a bounded successor correction, not broad
acceptance closure. Existing native case titles retain their historical M-11 ID.

## Ownership and baseline

Isolated managed worktree: `/Users/thomashall/.codex/worktrees/b563/sg-ui`.
Branch: `codex/batch142-card-collection-containment`.
Starting clean head: `164421fd639608a4afcfc013adda1d80ebf80cc7`.
Coordinator state read before editing reserved batch142's five-file allowlist;
prior card-collection workers had released ownership. Only the CSS, existing
story, browser spec and this unique report changed. The allowed colocated unit
file is unchanged: jsdom cannot establish native fractional scroll geometry.
The exact clean commit and complete file hashes accompany the completion receipt.
No shared state/acceptance files were changed.

## Frozen red evidence and attribution

The evidence root confirms actual frozen checkpoint head
`c7e4863c922e7b94fb9fef143307343850993bff`, rather than the successor baseline.
Relevant collection sources/spec have no diff between those heads.
Read both coordinator review JSON files; the additional-native review contains
no further collection group.

Root evidence:
`/Users/thomashall/.codex/worktrees/reviewed-dev-fw-checkpoint-43/sg-ui/artifacts/browser-pool/74a00435-d263-40f8-bb40-57fac90a4818/evidence.json`
SHA-256: `1219120bd3640fad7013862fa4673f9bee5d528f3f325855cc05f8a5b043128a`.

Its `card-collection-native/results.json` SHA-256 is
`9cebbea221ca5d900ed969e1e804c528c732171d2010fca0b6b2437bcbf99ab1`.
The frozen shard reports 10 expected / 2 unexpected cases. Both failures are
WebKit comfortable-density resize cases, light and dark. Each reaches native
Course 2 focus and then fails complete-control containment: bottom `374.5625`
against the existing `<= 374` bound (grid bottom plus 1px). Footer checks after
that point are unreached in those two cases.

Retained light/dark trace.zip SHA-256 respectively:
`1074a6aa6dbe4e940861b57147088d0baf5dc63b3ca3f1d56c4da06a2be6a032` /
`04d8f8c9f67760cf1dd6b179ceaa3578855dbd193b931577b60075f2f14a1031`.
The light `1-trace.trace` entry SHA-256 is
`efee0e66fec976ec70106dbc11332bc50d584a8ebdae0d819a5d4693ab09eaf6`;
its native `keyboardPress` Tab completes and `toBeFocused` passes. The after-Tab
snapshot (`call@557`) shows Course 2 `data-focused` / `data-focus-visible` and
actual grid `scrollTop: 355`. The corresponding dark after-Tab snapshot
(`call@559`) also records that focused input and scroll position. The retained
light screenshot was visually inspected. This is not a failed reach precondition
or evidence of an engine launch failure.

Static product attribution: the old minimum was
`max(controlHeight, textHeight + focusAllowance)`. At 200% text, comfortable
controlHeight is `2.75rem = 88px`, textHeight is
`32 * 1.6 + 2 * 8 + 2 = 69.2px`, and focusAllowance is
`2 * (4 + 4) = 16px`. Thus the old grid minimum is 88px and omits the
focus allowance when the density branch wins. Compact selects the 85.2px
text-plus-focus branch. The frozen CSS bytes match that old expression.
The native fractional result exposes this density-specific sizing gap; no
rounding or broader tolerance is justified. This attribution supports the
bounded product correction below. Its actual native outcome remains UNRUN.

## Prepared change

Move focusAllowance outside `max(controlHeight, textHeight)`. Comfortable at
200% now has a 104px minimum; compact's 85.2px minimum is unchanged. This retains
space around the complete density-sized control before footer chrome consumes
the remaining height. Existing root scrolling handles oversized footer chrome.
No footer API, callback, typography/token, host sizing or focus injection changes.

The existing native scenario now attaches focused input/grid/collection rectangles,
client/scroll metrics, computed grid minimum and outline inset before asserting
containment. A new regression assertion requires room for the complete input plus
both focus insets. Existing native Tab, full-control upper/lower bounds (including
the original 1px allowance), keyed identity/draft, footer reach, callback and
horizontal-overflow checks are retained. Fractional rectangles remain unrounded.
The NativeCollection story documents this enlarged-text/density interaction.

## Validation receipt and pending checks

Read-only state/source/trace review and `git diff --check` completed. All executable
unit, source/browser type, foundation/token, Storybook and browser checks are
**UNRUN** under the dispatch constraint; coordinator owns actual validation.
No installs, builds, browser launches, resource/queue mutations, CI operations,
merge, push or publication were performed.

Coordinator checks pending on the reviewed frozen successor bytes:

- Existing CardCollectionWithFooter unit suite; source and browser types plus
  relevant foundation/token guard for the CSS change.
- Fresh Storybook build, then `tests/browser/inventory-card-collection.spec.ts`
  in Chromium and specifically WebKit comfortable light/dark; retain compact
  and affected Firefox evidence as required by the checkpoint policy.
- Inspect the new native geometry receipt and unchanged footer/native bounds.

A green targeted result would establish only this partial M-09/U-07 slice.
Broad U/X/R/Z, physical-device and assistive-technology acceptance remains open.

## Prepared code/fixture SHA-256

| File | SHA-256 |
| --- | --- |
| `src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css` | `f0240db6240a5167336a514eb10bf18479fcd924d81347359afcd57a5d5428a4` |
| `src/components/CardCollectionWithFooter/CardCollectionWithFooter.stories.tsx` | `bcf1d4dedfad491f2acdb8064bd117be1528c184decef311671dcd4297fb96c2` |
| `tests/browser/inventory-card-collection.spec.ts` | `6160bb73d31a57299d5a604462886d4ef6696c43469a16032999918c4d2faf2a` |
