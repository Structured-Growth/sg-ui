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

## Fresh Chromium result and final report-only handoff

Wave22 ran on the separately managed shared test candidate
`e6270941ea8828d8868fef0798451a599a9db25f`, **not the worker head**.
Coordinator built fresh static Storybook and browser types once under Node
`v24.19.0`, then ran ten disjoint Chromium shards (supervisor maximum 16).
This shard used slot 6, port 6319, and the exact command selection:
`pnpm exec playwright test '(?:^|/)tests/browser/inventory-learner-card\.spec\.ts$' --project=chromium`.
Observed result: **7 passed, 0 unexpected, 0 skipped, 0 flaky**, no result errors.
Session ran 2026-10-07 16:45:02.782–16:45:10.689 UTC. Browser build digest:
`2a06f15980b85cd3f8eb36bc2ad8ce05693dc11aaafe52edc2c21b7ca10dc9ca`.
Coordinator reports clean candidate and unchanged source/build hashes after the wave.

Read evidence and actual result statistics:
- [Shard evidence](/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/learner-card-native/evidence.json)
- [Results](/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/learner-card-native/results.json)
- [Pool evidence](/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/evidence.json)
- [Source attribution](/tmp/sgui-batch45-candidate-source-attribution.json)

The attribution records worker head `632a64320b4fff039df69840a7aa3df7d00d61ec`
and exact owned-file byte equivalence to the candidate. Independently read/hash
verified before this final report-only edit:

| Owned file | SHA-256 at prepared worker/candidate |
| --- | --- |
| LearnerClassCard.stories.tsx | `1b4922964b9d31a546947f152130162dd09191d7dd2cae6631a5c40f51baf66c` |
| inventory-learner-card.spec.ts | `877e802f9cb8795274abfef0ae23a639e574653f19ba5361e59a194f75e76206` |
| This report before final result update | `cb2a908cf1aad18c5c0a335d2013cbd7a8c63ef88da450e01015394de43b5542` |

Source/spec stayed frozen during validation and remain unchanged in this handoff.
The report update occurs after the coordinator released the freeze. No repeated
checks or independent heavy/browser run followed this documentation-only update.
Initial TS2322 fixture failure above and earlier coordinator snapshots remain
historical red evidence; the fresh seven-case pass does not relabel them as passing.
No product failure was observed in this shard.

Coordinator alone reviews/integrates the worker history; shared candidate validation
is not dev integration or whole-row acceptance. No independent full check, Storybook
build, consumer matrix, GitHub CI/title dispatch or publication was performed.
Firefox/WebKit remain checkpoint-owned. Broader status attribution and
manual/device/AT acceptance remain held; M-15 is not newly accepted.
