# M-11 card collection native composition

Reviewed baseline: `4c9f859bad204a7d7fd2e3787aa6f293db268525`.
Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch36-card-collection-native/sg-ui`.
Branch: `codex/batch36-card-collection-native`.
Exclusive writes: CardCollectionWithFooter directory, the focused browser spec,
and this report. Shared footer/card frame and all other source remain read-only.

Read root AGENTS.md and [development validation](../react-aria-development-validation.md),
[batch29 inventory](../parallel-batch-29/inventory-acceptance-02-12.md),
[batch13 collection evidence](../parallel-batch-13/card-collection.md), and
[card pagination contract](../react-aria-card-pagination.md). M-11 remains held;
M-12 standalone footer acceptance and grid reset/shrink evidence are not repeated.
No architecture/API/style/product change was justified by inspected evidence.

## Added composition evidence

[NativeCollection story](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.stories.tsx)
has one host pagination owner, explicit accept/reject requests, complete keyed rows,
state replacements, and editable owned fields inside owned cards.
The [unit regression](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx)
proves withheld page/size requests preserve the cards/select and accepted size
changes request page zero before size and display the matching card slice/count.

[Focused native spec](../../../tests/browser/inventory-card-collection.spec.ts)
contains six cases: four light/dark × compact/comfortable container cases and two
state/pagination cases. It measures 800/780/760/360/320px container changes with a
260px host, the 22.5rem column threshold, no horizontal overflow, visible footer,
internal scrolling, stable input identity/draft/focus, native keyboard scroll at
200% root text sizing, and overlapping keyed card reorder. State cases ensure
loading/empty/ready replace cards/status without replacing the collection/footer,
loading disables navigation, and state changes do not request pagination.
Host rejection then acceptance checks cards, select, count, and exact reset order.
Actual browser zoom is distinct from root text sizing.

## Targeted validation and handoff

`pnpm install --frozen-lockfile` passed under token-owned installation slot0;
608 packages reused, no dependency/lockfile changes. The pre-existing package
manager warning about ignored esbuild scripts was retained; no permission setting
was changed. Token-owned light slot3 serialized the following commands:

- `pnpm exec vitest run src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx --maxWorkers=1`: **7/7 passed**.
- `pnpm typecheck`: **passed**.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: **passed**.

Only test/story/report changes land, so no additional foundation/token/build guard
is required by the targeted policy. No full check, Storybook build, browser server,
CI/title dispatch, consumer suite, merge or publication was started by this worker.
Slots are released only after matching this worker's owner token.

Coordinator request against the clean committed head: fresh immutable Storybook
pool, Chromium first, arguments
`tests/browser/inventory-card-collection.spec.ts --project=chromium --workers=1`.
Final exact head is provided in the authorized coordinator handoff because this
report cannot contain its own commit hash. Assigned source stays reserved pending
actual Chromium proof and any bounded corrections.

**Chromium: pending; Firefox/WebKit: pending coordinated batch checkpoint.**
No queued run counts as a pass. Preserve any red result and classify product,
fixture/driver/expectation, or environment cause before correction. No current
native failure is established. Spoken AT, physical-device behavior, browser chrome
zoom, and broad M/U/X/R/Z acceptance remain unverified. No master checkbox or
whole-row acceptance is upgraded by this patch.
