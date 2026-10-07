# Batch 13 — controlled navigation

Task references: bounded U-10/H-03 evidence; Navigation is also catalogued under U-11.

## Isolation and scope

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-navigation/sg-ui`.
Branch: `codex/batch13-control-navigation`. Draft PR base: `codex/dev`.
Draft PR: [#76](https://github.com/Structured-Growth/sg-ui/pull/76).
Tested implementation head: `986d09f67e56850f1de7b9ae5e94d5d6032b5a96`.
This completion report follows in a documentation-only commit; final head is
reported in the coordinator handoff rather than claiming a self-referential hash.

Exclusive write allowlist:

- `src/experimental/Navigation/`
- `tests/browser/batch13-control-navigation.spec.ts`
- `docs/developer/parallel-batch-13/control-navigation.md`

Changed only the colocated Navigation test and this report. Primary and other
worktrees preserved. No source, API, story, browser test, dependency, configuration,
shared guide, checklist or workflow changes.

## Finding and evidence

Read AGENTS.md, [development validation](../react-aria-development-validation.md),
[owned navigation contract](../react-aria-remaining-controls.md),
[host adapter contract](../react-aria-host-adapter-acceptance.md) and the
[previous adapter report](../parallel-batch-01/adapters.md), plus Navigation,
Link and adapter implementation/tests/stories and existing native adapter tests.

No in-scope product defect was demonstrated. Existing Navigation explicitly owns
`aria-current` from `current`; it neither infers selection from pathname nor accepts
navigation requests implicitly. The adapter reads current context on rerender.
Existing tests did not combine destination removal and callback replacement.
One meaningful composed test now covers:

- A mismatched provider pathname and unaccepted route request leave host current authoritative.
- Removal clears the old native ref and retains the surviving anchor/ref.
- Accepted current updates `aria-current`; href/target/rel/data attributes survive without leaking current/replace attributes.
- Activation reaches only the replacement router callback, including replace options.
- A host current destination absent from the collection leaves no falsely current anchor and emits no navigation request.

The new case passes the unchanged implementation. It is coverage, not a claimed
red-to-green defect fix. No changed product behavior requires a new story.
Existing HostRoutingAndExpansion and adapter Routing stories remain applicable.

## Validation

Runtime: Node `v26.5.0`, pnpm `10.29.3`, React `19.2.3`, Vitest `4.1.11`,
TypeScript `5.9.3`, jsdom `26.1.0` (installed frozen lockfile).

- `pnpm install --frozen-lockfile`: passed; 608 packages, no tracked lockfile change.
- `pnpm exec vitest run src/experimental/Navigation/Navigation.test.tsx src/experimental/Link/Link.test.tsx src/adapters/navigation.test.tsx --maxWorkers=1`: passed, 3 files / 14 tests (Navigation 3, Link 3, adapter 8).
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- Report's relative documentation links checked against repository files.

Install queued until atomic install slot0 was available; light validation likewise
queued until atomic slot0 was available. Both used unique owner token
`batch13-control-navigation-01a116b1` and were released only after matching that
token. Limits retained: two installs and four light validations, one Vitest worker.
Waits were at most 45 seconds; queued states were not counted as passes.

Existing modified/native link cases emit jsdom's unsupported navigation warning;
the unit run exits successfully. This establishes DOM/callback behavior, not native
navigation, timing, focus or spoken accessibility. No browser-dependent product
change was made, so no fresh Storybook/browser suite was requested. The existing
heavy lock and browser-priority queue were read and left undisturbed; no browser
pool bypass or Firefox retry. No pending validation process or owned slot remains.
Full check/Storybook/matrices omitted under the user's targeted development policy.
Dev GitHub CI/title runs remain paused; no dispatch, rerun, merge or publish.

## Limits and follow-ups

No broad U/H/X/R/Z, manual/device or assistive-technology ID is closed. Existing
batch01 native adapter evidence is historical and is not a fresh native pass at
this head. Real router implementations still own forwarding/ref/modifier behavior.

No necessary broader source change was found. A future separately scoped acceptance
task may cover `src/adapters/adapters.stories.tsx` and a new browser fixture for a
real host router replacing callbacks during Navigation item removal, including
host-chosen focus restoration. That belongs outside this allowlist and requires
its own exclusive assignment and approved browser pool scheduling.
