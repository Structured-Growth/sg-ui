# M-17 responsive grid/card native transitions — F3

Status: targeted local checks passed; fresh coordinator Chromium proof pending.
This is the bounded F3 evidence slice from the [batch30 inventory review](../parallel-batch-30/inventory-acceptance-13-24.md).
Whole M-17, Firefox/WebKit, manual zoom/device/assistive-technology and broad G/U/X/R/Z acceptance remain open.

## Isolation and scope

Created and attached managed worktree before edits:
`/Users/thomashall/.codex/worktrees/batch46-grid-shell-responsive/sg-ui`.
Clean exact base verified: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
Branch: `codex/batch46-grid-shell-responsive`.
Story/spec commit: `2976e032e8b462f7aa0df412990378799351bf70`.
A separate report commit freezes the ready candidate; coordinator receives its exact SHA.

Changed files:

- `src/components/AppDataGridShell/AppDataGridShell.stories.tsx`
- `tests/browser/inventory-grid-shell-responsive.spec.ts`
- `docs/developer/parallel-batch-46/grid-shell-responsive.md`

Production shell/grid/model/controller/Menu remain unchanged. Existing [client shrink proof](../parallel-batch-14/client-page-shrink.md)
and [controlled shell state evidence](../parallel-batch-05/grid-shell-state.md) were read before writing.
The new cases do not repeat shrink, sorting, reset or rejected-state scenarios.
The existing `inventory-shell-responsive.spec.ts` belongs to AppShell; this task uses the distinct grid-shell filename.

## Native composition

`NativeResponsiveTransitions` is a deterministic host composition with one controlled
criteria object, controlled view mode and host response state. Footer requests accept
one complete `onStateChange` snapshot; view changes do not emit criteria requests.
Host Alt+P/E/R shortcuts change pending/error/ready without transferring focus into
fixture actions. Rows are supplied in server mode, with a known four-row total and
size two; no network races or application-data fetching are simulated.

Four focused cases combine light/dark with normal/200% root text. They resize the
same live composition 760 → 320 → 760 → 320px, activate view triggers with real
Tab/Enter, assert selected trigger focus, and inspect focus outline, hit testing,
viewport bounds and overflow ancestor clipping. They cover cards/list pending/error,
native Retry, accepted list next-page first-cell focus, accepted cards previous-page
first-card focus, retained selection and one toolbar/footer. Pending changes and
subsequent widening preserve the accepted card focus. Every footer acceptance has
an exact host request count; no locator.focus, DOM focus injection or synthetic
selection is used. Root-text enlargement is automated evidence, not manual browser zoom.

Source SHA-256 frozen for attribution:

- Story: `e304c9fcc5e01377f792c621128965c9f788616765d78ba0ed49a007130abfed`
- Spec: `a48c0fdc54777f19dbb26d0bf8e391b813175bfee1b191dea1b8b5acbfe1df0e`

## Targeted local validation

Node `24.19.0` at the requested bundled runtime, pnpm `10.29.3`, Vitest `4.1.11`,
TypeScript `5.9.3`, React `19.2.3`. Commands executed inside this worktree through
`/tmp/sgui-batch46-run.mjs`, which uses canonical atomic acquireInstallSlot /
acquireLightSlot and token-verifying releaseLease in finally. Vitest has one worker.

| Command | Outcome / immutable local log |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed; no manifest/lockfile changes. `/tmp/sgui-batch46-install-3.log` |
| `pnpm exec vitest run src/components/AppDataGridShell/AppDataGridShell.test.tsx --maxWorkers=1` | 21 passed / 1 file. `/tmp/sgui-batch46-units.log` |
| `pnpm exec tsc --noEmit` | Passed. `/tmp/sgui-batch46-source-types.log` |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Passed. `/tmp/sgui-batch46-browser-types.log` |
| `pnpm foundations:check` | Passed import/layer/token guards. `/tmp/sgui-batch46-foundations.log` |
| `git diff --check` | Passed before source commit. |

Two initial install admissions found both slots occupied and exited before running
pnpm: `/tmp/sgui-batch46-install.log`, `/tmp/sgui-batch46-install-2.log`. They are
resource-admission failures, not product failures. A later admission succeeded;
no foreign tokens/locks/processes were released. No native regression or failing
behavior is classified before real execution. Existing historical red shrink and
engine evidence remains preserved in its original reports.

## Frozen coordinator handoff and remaining proof

Focus args: `tests/browser/inventory-grid-shell-responsive.spec.ts --project=chromium`.
Coordinator alone creates the reviewed mutually disjoint testing candidate and
fresh immutable Storybook/build/server/native run. This worker ran no independent
browser/build/server, full check, consumer matrix, GitHub CI/title, dev integration,
main merge, publish, versions or permission/secret change.

Source/head/report scope remains frozen and reserved through the fresh Chromium
result. Record actual tested candidate SHA, matching owned-file hashes and immutable
run evidence in a report-only follow-up commit after coordinator releases the freeze.
A candidate pass permits review for provisional integration; it does not mean the
candidate is accepted dev or close cross-engine/whole-row gates. Firefox/WebKit
remain coordinator batch-checkpoint work. Concrete native failures require diagnosis
as product, fixture/driver/expectation, environment or unclassified, retaining red
logs/traces and original assertions before any correction.
