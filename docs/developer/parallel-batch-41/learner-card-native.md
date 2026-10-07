# M-15 F2 learner-card native due/action evidence

Reviewed base: `3c31ee6daae917ad82fbd2bd882c203f381d75dd`.
Managed isolated worktree created and attached before writes:
`/Users/thomashall/.codex/worktrees/batch41-learner-card-native/sg-ui`.
Branch: `codex/batch41-learner-card-native`. Date: 2026-10-07.

The coordinator confirmed LearnerClassCard is **M-15**; M-14 is
InstructorClassCard, as recorded in the [batch-30 review](../parallel-batch-30/inventory-acceptance-13-24.md).
The initial assignment's M-14 label was a typo. This evidence follows M-15 F2's
existing learner due/actions scope; neither row is newly accepted. The broader
status criterion attribution and original owner/API menu/date intent remain held.
The prepared source/spec head is `ba658c54aa51f1f676afe3d3e3b5c05b9f91bbec`;
this follow-up corrects report attribution only and changes no native cases.

## Bounded additions

The [native fixture](../../../src/components/LearnerClassCard/LearnerClassCard.stories.tsx)
adds host-controlled locale/translator/due/destination changes and callback outputs.
The [spec](../../../tests/browser/inventory-learner-card.spec.ts) declares
`America/Chicago`, browser locale `en-US`, and fixed clock `2026-01-02T18:00:00Z`.
Host locales en-US/de-DE/ar-EG have literal browser ICU absolute-date expectations;
live translated, imminent and unavailable labels exercise the actual card composition.
Invalid locale plus missing host translation exercises English fallback. Action cases
cover explicit Details/Continue, Details falling back to Continue, and no destinations.
Native Enter/Tab/Space, callback counts, unchanged focused Details node, adapter
requests, real Continue popup URL/opener isolation and source focus are asserted.
The destination route is fulfilled by the test host; no application data is fetched.
The translation update uses a programmatic host-fixture button click specifically
to retain focused card identity; card activation uses native Playwright keyboard input.

No runtime/product changes or new unit tests. Existing Intl/hydration tests were read
and not rerun or duplicated. ClassCardFrame, presets, models, grid and adapters remain
read-only. No separate status API or speculative action/menu feature is introduced.

## Observed validation and retained failures

Runtime: bundled Node `v24.19.0`, pnpm `10.29.3`.
Installation acquired atomic `/tmp/sgui-install-slots/slot0`, own token only;
`pnpm install --frozen-lockfile` passed and the matching lease was released.
Light checks acquired `/tmp/sgui-light-validation-slots/slot0` with unique own tokens
and finally released only matching leases.

- `pnpm exec vitest run src/components/LearnerClassCard/LearnerClassCard.test.tsx --maxWorkers=1`: 3/3 passed, existing composed routing/progress/callback tests.
- Initial `pnpm exec tsc --noEmit`: failed TS2322 because the added Story annotation omitted required `args`. Fixture/type defect, not a product regression. Added explicit fixture args; no assertion weakened.
- Corrected `pnpm exec tsc --noEmit`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.

Fresh Chromium is pending the coordinator's immutable pool. Exact selection:
`tests/browser/inventory-learner-card.spec.ts --project=chromium` (7 cases).
No independent heavy/browser run, full check, Storybook build, consumer matrix,
GitHub CI/title dispatch or publication was performed. Source/spec/report are frozen
at the handoff commit during coordinator validation; native failures must retain
underlying product/fixture/environment/unclassified attribution before correction.
Firefox/WebKit remain checkpoint-owned; broad/manual/device/AT acceptance remains
held. Unit/type/guard passes alone are not native or whole-inventory acceptance.
