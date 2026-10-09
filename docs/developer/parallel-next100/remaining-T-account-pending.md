# T-S05-02 account pending regression

Proposed leaf evidence for coordinator review. Tested base/head:
`1c8a4e4d2eb75479c5581c009eaacf5f3209aee4`, with the single new test below
present as an uncommitted addition during validation. Central checklists and
acceptance counts are unchanged by this worker.

## Reconciliation and contract

[F-S05-02](../react-aria-baseline-tasks.md) assigns awaiting callbacks, pending
presentation and repeat suppression to the host/composed action owner. The
[account adapter](../../../src/adapters/accounts.tsx) forwards original host
promises and permits independent requests; it has no private pending capability.
[SideNavigation](../react-aria-modal-shells.md) owns the consuming menu state.

The existing `guards concurrent async account operations and returns focus on
success` case in [SideNavigation.test.tsx](../../../src/components/SideNavigation/SideNavigation.test.tsx)
checks suppression but does not assert pending presentation. Other lifetime cases
assert disabled state for obsolete/current operations, without the complete
before-pending/duplicate/settled sequence. The prior
[S04/S05 report](next100-s04-s05.md) is historical evidence; its reported baseline
is `a58374738d82e09586e2088f314fa746518b9d39`. Original historical raw logs and
exact tested historical heads were not reconstructed or promoted to fresh proof.
The coordinator's `consolidation-new-proof-remaining-T-review.json` explicitly
holds T-S05-02 for the missing pending indication assertion.

## New bounded evidence

`T-S05-02 | targeted unit pass, proposed for independent review |
src/adapters/account.remaining-T-pending.test.tsx | base head above plus test SHA
below | 1 file / 1 case passed | JSDOM only | coordinator review/integration`.

The single [new test](../../../src/adapters/account.remaining-T-pending.test.tsx)
renders real SideNavigation with public account/navigation providers and the
public theme entry point. It checks enabled Logout before activation, the retained
accessible menu with Logout/Add account `aria-disabled="true"` before the host
promise completes, suppression of repeated Logout and Add account activation,
no premature navigation, and enabled actions after settlement and menu reopening.
The host callback runs exactly once. The host deliberately retains its session
fixture, allowing the reopened menu to prove pending cleared; persistence,
credentials, authentication and networking remain host-owned.

No existing source, tests, stories, exports, tokens or configuration changed.
Imports use direct adapter modules and public SideNavigation/theme entry points;
no root/private foundation barrel or interaction-engine imports were added.
No product defect was observed. No new story is needed for a test-only addition.

## Validation provenance

Node `v24.21.0`:
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
pnpm: `/opt/homebrew/bin/pnpm`.

- `pnpm install --frozen-lockfile`: exit 0; canonical install slot1 plus slot-1,
  owner `remaining-T-account-pending-install-90640`.
- `pnpm exec vitest run src/adapters/account.remaining-T-pending.test.tsx --maxWorkers=1 --pool=threads --retry=0`:
  exit 0; **1 file, 1 test passed**; canonical light slot1 plus slot-1,
  owner `remaining-T-account-pending-units-90991`. Default timeouts unchanged.

Both commands used deployed `acquireInstallSlot`/`acquireLightSlot` and
`runOwnedCommand`. Both process groups settled, final resource samples show no
owned processes, and exact-owner canonical/transition leases were released.
No occupied foreign slot was reclaimed, retry loop used or unleased work started.

Evidence directory:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/remaining-T-account-pending-evidence`.
External report: sibling `remaining-T-account-pending.json` retains receipts,
commands, admission, timestamps, resource settlement and SHA-256 digests.

| Artifact | SHA-256 |
| --- | --- |
| New test | `67613a6d6c07b7424111943249b33530605b6d076a09e7c5f91810b0d2ef05d0` |
| `install.log` | `5dfbc975e75c4c0a66bb7faafe83b0c52080e18fe5439d584ec75a7a5a59de90` |
| `units.log` | `d51943b5730224f071d6243e964a4146159ee4eadfa8f71d6ba0e3e24ba9a626` |
| `inputs.sha256.json` | `b2f97883c88932cf3de047b378e9c9737a692b59c52e02a23dddb3d8db73ce48` |

The input manifest conservatively hashes every tracked source/scripts file,
package/lock/Vitest/TypeScript configuration and the new test. It does not imply
every hashed file executed. Vitest's retained log reports totals; the exact named
case is mapped against its unchanged executed bytes, without a case-level trace.

JSDOM establishes accessible disabled attributes and callbacks, not CSS visual
presentation, browser focus, spoken assistive-technology or real account/network
behavior. No full check, Storybook, browser, packed consumer or engine matrix was
run. [H-05](../react-aria-scope-ledger.md), wider H/U/X/R/Z acceptance, V/hardening
and whole-parent closure remain separate. The coordinator owns independent review,
central checklist changes and dev integration.
