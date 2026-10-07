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

Seven Chromium-validated native cases cover the same overlapping criteria and host disposal
boundaries, plus pending/current-error preservation. Native Enter drives page and
search controls; keyboard typing changes search criteria. Assertions check visible
rows, complete host snapshots, exact lifecycle traces, DOM aria-busy/error status,
and native focus. Native cases use no forced clicks, retries, injected focus repair,
or timing sleeps. Full-fixture unmount completion is measured in the composed tests;
removing/replacing individual hosts is covered by the Chromium-validated native spec.

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

## Coordinator-owned Chromium evidence

Coordinator executed the fresh pooled snapshot at testing-only candidate
`7248a80d79eb50a59a2e18b7bf461f8e9d26897c`. This shard passed **all 7 Chromium
cases**, each on retry 0, one worker, with zero skipped/unexpected/flaky cases and
no report-level errors. The exact recorded selection was:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/grid-server-response-races\.spec\.ts$' --project=chromium
```

The existing configuration supplied one worker and zero retries. Session `batch82`
used slot 2, port 6275, Node `v24.21.0`, pnpm `10.29.3`, Playwright `1.63.0`.
The fresh Storybook build and browser TypeScript check completed before the shards;
source and build digests remained identical through the native window.

Retained evidence root:
`/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51`.

- Root lifecycle/build evidence: `evidence.json`; build log: `build.log`.
- Seven-case JSON: `batch82/results.json`; native log: `batch82/browser.log`.
- Results JSON SHA-256:
  `b9033c14c1e4795ff6ba68549b9cb398697c4d634c97462aeeb67426ecb20b9d`.
- Storybook build SHA-256:
  `1fcc9f4a6330e7ac18bedc92715525e8d05de622679281919306bc48b7178b61`.
- Candidate source SHA-256:
  `74870b26ee17638871a0f7dd0d020d6521d5f1554c6feab8ea2204eeebe28680`.

Exact worker attribution is retained in `/tmp/sgui-wave41-native-attribution.json`.
Its batch82 record identifies implementation/test head
`364242198e1224bd949386288dc821aaaa12ca52`; this worker independently checked the
recorded bytes against its frozen files before making this report-only update:

| Frozen artifact | SHA-256 |
| --- | --- |
| Story | `0a96afb5d03369b77eb05ce5bb01ace549f4dcd3f997f17244c5fd76586bafc4` |
| Composed tests | `343a2475f2bbb457f0508b5ced3103170641c8f20af5736ca741af4917d32fbb` |
| Native spec | `d7ac446ee4c9944d9588642326062b70218fac101fc3accb3989ca124fd8c098` |

The root snapshot status is **failed** because the other fixture shards batch80,
batch81 and batch83 failed. This record accepts only this seven-case shard, and
does not claim pooled acceptance or integrate the whole testing candidate. The
coordinator reports review/integration of this worker's full individual history
into dev. The report update leaves all source, unit and native test bytes unchanged.
No worker test/build/browser rerun was needed or started.

Root cleanup records `owned commands settled`, zero remaining owned processes,
and unchanged candidate head/source/build. The coordinator released the native
scope. Firefox/WebKit remain pending at the batch checkpoint. Broad G/U/X/R/Z and
device/assistive-technology gates remain open; parent tasks are not marked complete.
