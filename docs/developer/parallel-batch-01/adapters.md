# Batch 01 — adapters

Assignment: adapters. Task IDs: H-01, H-03, H-04, H-05, U-10.

## Completed slice

SGLink preserves native anchors without a navigation provider. Absolute and
protocol-relative URLs and explicit schemes bypass navigate/custom router Link.
Existing relative route replace/cancellation/modifier/download/target behavior
is retained. Router attributes and anchor refs, live pathname, imperative replace,
server safety and exact asynchronous account callback ownership have regression
coverage. Two scoped stories demonstrate host routing and pending/error/retry
account policy. No credentials, application APIs, storage policy or competing
router were added.

## Files

- `src/adapters/Link.tsx`, `navigation.tsx`, `navigationContext.ts`
- `src/adapters/navigation.test.tsx`, `navigation.ssr.test.tsx`, `accounts.test.tsx`
- `src/adapters/adapters.stories.tsx`
- `tests/browser/batch01-adapters.spec.ts`
- `docs/developer/react-aria-host-adapter-acceptance.md`
- This report.

## Review location

Worktree: `/Users/thomashall/.codex/worktrees/batch01-adapters/sg-ui`.
Branch: `codex/batch01-adapters`, based on
`9f153642e827a14033d646cf0160730c0793bdfc`.
Primary checkout was not modified. Implementation commit:
`cd8f34a1bf7c755b80314a76135024f58e2aa403`.
Draft PR: [#5](https://github.com/Structured-Growth/sg-ui/pull/5).
This report is a subsequent documentation-only commit; the final branch head is
included in the coordinator handoff.

## Validation

- `pnpm install --frozen-lockfile`: passed, no tracked dependency changes.
- `pnpm exec vitest run src/adapters`: final run passed, four files / 24 tests.
- Local `pnpm check`: passed, 146 files / 979 tests plus foundation, token, type,
  release, build and package import/consumer declaration checks.
- Local `pnpm build-storybook`: passed. The initial browser run passed four
  Chromium/WebKit cases. Two Firefox cases failed before loading with
  "Could not find profile folder"; a worktree-local TMPDIR retry failed at the
  same launch stage. Firefox behavior is not validated locally.
- The final custom-router story was subsequently committed at `cd8f34a`.
  [CI run 37622107679](https://github.com/Structured-Growth/sg-ui/actions/runs/37622107679)
  confirms frozen install, `pnpm check` and Storybook build pass on both Node
  22.12 and Node 24 against this exact implementation commit. The complete Node
  22.12 job passed, including packed React 18.3/19 foundation/editor consumers.
  Node 24 browser/remaining consumers were still running at handoff; no browser
  success is inferred from an incomplete job.
- `git diff --check` and acceptance-document local link checks: passed.
- All local heavy validation and port 6173 use serialized under the shared
  atomic mkdir lock. No build ran during a browser suite. The final queued local
  rebuild was stopped before lock acquisition at the coordinator's request to
  give dev integration priority; no other worker's lock was removed.

No pending validation process remains in this chat, and no local lock is held.

## Limits and coordinator integration

No whole H/U/X/R/Z gate is claimed complete. H-03 evidence covers the existing
native styled Link route path and absence of a second routing owner, not a new
React Aria RouterProvider integration. H-05 account pending/retry policy remains
in the host/action composition; the adapter passes operation outcomes unchanged.
Shell pending/error UI, Breadcrumbs, real framework routers, real auth services,
physical devices and assistive technology remain outside this slice.

Suggested central guidance: link the host adapter acceptance record from the
master list/progress/component architecture; record the native fallback and
absolute destination bypass as owned adapter behavior. Shared guidance was not
edited. The explicit `external={false}` styled Link option cannot route absolute
URLs through SGLink; hosts needing that use imperative navigation.

Suggested next bounded assignment: audit a representative real host-router
integration plus nested Breadcrumbs/SideNavigation route changes, cancellation,
modified activation and ref focus, with consumer-only fixtures and no platform
runtime dependency.
