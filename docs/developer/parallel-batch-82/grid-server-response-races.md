# Host-owned server response races (batch 82)

Task references: G-05, G-28, G-29. Baseline:
`007617d53600b258e001d69530fb74d672362222` (`codex/dev`).

## Bounded fixture

[Story](../../../src/components/AppDataGridShell/AppDataGridShell.server-response-races.stories.tsx),
[composed tests](../../../src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx),
and [native spec](../../../tests/browser/grid-server-response-races.spec.ts).

Story ID: `data-display-appdatagridshell-server-response-races--deferred-responses`.
The host starts with supplied rows; the first real request begins on a shell
criteria transaction. Both views own their criteria, rows, pending/error state,
and latest request identity independently. Each dispatch creates an actual deferred
promise. The transport controls settle that promise; they do not inject grid state,
repair focus, cancel older promises, use timers, or fetch data.

The host accepts criteria immediately, retains rows while pending, and guards every
response-driven state update with both latest-request identity and host availability.
A replacement mounts a new keyed host. Disposal leaves already dispatched promises
settleable and records the old host's unavailable state. A terminal handler records
an obsolete success/rejection without calling its React state setters. The shell
remains presentation-only; no production code or public API changes are needed.
See the [host response contract](../react-aria-catalog-grid.md).

Visible Resolve/Reject controls identify every dispatched request. Within each view,
Alt+1 resolves the oldest outstanding request, Alt+2 resolves the newest, and Alt+E
rejects the oldest. These host simulation keys let response completion occur while
native search or host-action focus stays in place. The lifecycle output records
individual page/search/state callbacks, dispatch criteria, settlement, commit,
discard and disposal. Each promise settles at most once.

## Regression assertions

Seven composed cases cover:

- Both independent views dispatch two unresolved page/search requests. Newer success
  commits rows; older success/error then settles without changing current rows,
  criteria, ready/error/pending status, search focus or the other view's pending state.
  The other view then commits its own newer response and discards its older error.
- Success/error after replacement or host removal records only settlement/discard,
  preserves outside host-action focus, issues no new requests, and cannot commit to
  the replacement. Entire-fixture unmount then settles the other view's promise with
  the same exact no-commit/no-redispatch trace assertion.
- An obsolete rejection cannot clear a newer pending request. After a still-newer
  rejection commits an error, an older success cannot replace that error or rows.

Seven native cases are prepared for the same overlapping criteria and host disposal
boundaries, plus pending/current-error preservation. Native Enter drives page and
search controls; keyboard typing changes search criteria. Assertions check visible
rows, complete host snapshots, exact lifecycle traces, DOM aria-busy/error status,
and native focus. Native cases use no forced clicks, retries, injected focus repair,
or timing sleeps. Full-fixture unmount completion is measured in the composed tests;
removing/replacing individual hosts is covered by the prepared native spec.

## Targeted local evidence

Node `v24.19.0`, pnpm `10.29.3`. Commands run from the isolated managed worktree
`/Users/thomashall/.codex/worktrees/batch82-server-races/sg-ui`, using the bundled
Node directory prepended to PATH for authoritative validation:

```sh
pnpm install --frozen-lockfile
pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.server-response-races.test.tsx src/components/AppDataGridShell/AppDataGridShell.test.tsx
pnpm exec tsc --noEmit
pnpm exec tsc --noEmit -p tests/browser/tsconfig.json
pnpm foundations:check
```

Install passed without tracked dependency changes. Unit tests: **31 passed across
2 files**, including 7 new cases and 24 existing shell cases. Source/browser
TypeScript and foundation import/layer/token checks passed. Logs:

- `/tmp/batch82-server-races-install.log`
- `/tmp/batch82-server-races-unit-node24.log`
- `/tmp/batch82-server-races-source-types-node24.log`
- `/tmp/batch82-server-races-browser-types-node24.log`
- `/tmp/batch82-server-races-foundations-node24.log`

An initial pass used ambient Node 26; the final authoritative checks above reran
under bundled Node 24. No production defect was demonstrated by these checks.

## Coordinator-owned native gate: pending

No Storybook build, browser run, packing, performance command, or CI dispatch was
started by this worker. The coordinator must build a fresh pooled Storybook snapshot
containing the frozen candidate, then run:

```sh
pnpm exec playwright test tests/browser/grid-server-response-races.spec.ts --project=chromium --workers=1 --retries=0
```

Use the coordinator's unique loopback port and artifact paths with the existing
browser configuration. Chromium is first; Firefox/WebKit remain deferred to the
batch checkpoint. The browser spec has passed TypeScript checking only; no native
runtime success is claimed. Broad G/U/X/R/Z and device/assistive-technology gates
remain open, and this record does not mark the parent tasks complete.
