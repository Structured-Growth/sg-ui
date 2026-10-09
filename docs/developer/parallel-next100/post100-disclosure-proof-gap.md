# Disclosure proof-gap reconciliation (post100-disclosure-proof-gap)

Tested frozen head: `29ccb59d1df86988e7438b97fb6d663706f9f6c9`. Source tree: `54d23315b9f6545fa5d4dd4154ab919e8bd3d2d8`.

The two existing Disclosure test files passed unchanged: **2 files, 7 cases** (5 behavior, 2 SSR), zero failures/skips/retries. This supplies exact-head execution evidence for T-P28-01/02/90/91; independent coordinator review and T marking remain pending. No tests, implementation or stories were added or changed.

The earlier six light-slot admission refusals remain UNRUN. The historical seven-case report still has an unknown unit execution head. This run resolves the admission prerequisite with fresh evidence; it does not relabel historical outcomes.

## Commands and resource settlement

Node: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node` (v24.21.0); cwd: `/Users/thomashall/.codex/worktrees/post100-disclosure-proof-gap/sg-ui`.

- install: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /opt/homebrew/lib/node_modules/pnpm/bin/pnpm.mjs install --frozen-lockfile` — passed (exit 0).
  Canonical lease `/tmp/sgui-install-slots/slot0` and compatibility claim `/tmp/sgui-install-slots/slot-0`, owner `post100-disclosure-proof-gap:51867591-d575-447b-91ab-dfcdaf2e2d6e`. One admission attempt. Group `53854` settled; terminal owned processes `[]`; signal errors `[]`. Owner-only release at `2026-10-09T01:16:02.003Z`.
  Raw log: `/tmp/post100-disclosure-proof-gap-install.log` (SHA-256 `c4631db7904d418e68090a99ae9eccebd234f39dbdd89c2456f593e8199e6efb`); resources: `/tmp/post100-disclosure-proof-gap-install.log.resources.json` (SHA-256 `d6071d92f1a5431a56dea3f5401fc14fed77364201750a7f5ddc3d48489e8402`).

- units: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node node_modules/vitest/vitest.mjs run src/experimental/Disclosure/Disclosure.test.tsx src/experimental/Disclosure/Disclosure.ssr.test.tsx --maxWorkers=1 --pool=threads --retry=0 --reporter=verbose` — passed (exit 0).
  Canonical lease `/tmp/sgui-light-validation-slots/slot1` and compatibility claim `/tmp/sgui-light-validation-slots/slot-1`, owner `post100-disclosure-proof-gap:3412f6d7-01ea-411e-8926-cdd1a209cd43`. One admission attempt. Group `53982` settled; terminal owned processes `[]`; signal errors `[]`. Owner-only release at `2026-10-09T01:16:03.279Z`.
  Raw log: `/tmp/post100-disclosure-proof-gap-units.log` (SHA-256 `6f8dfd51acc3f1c2f379610fdb9e00b6ecac6c0372f85ef34cf24b7935e25708`); resources: `/tmp/post100-disclosure-proof-gap-units.log.resources.json` (SHA-256 `03b5148fc5a3902100c14d8e550cfadf25e994b024e5232772cbc3cd1ed11fd7`).

The local `ownedNode24` wrapper enforced the absolute Node24 executable and used deployed `acquireInstallSlot`, `acquireLightSlot`, `runOwnedCommand` and `releaseLease` APIs. No substitute roots, unleased validation or retry loop. Installation used `/opt/homebrew/bin/pnpm` resolved to its native script with `--frozen-lockfile`. Assertions and timeouts were unchanged.

## Leaf evidence map

| Leaf | Existing passed cases |
| --- | --- |
| T-P28-01 | `src/experimental/Disclosure/Disclosure.test.tsx:10` — toggles a named linked panel using keyboard and excludes collapsed children from tab order; `src/experimental/Disclosure/Disclosure.test.tsx:21` — keeps controlled expansion authoritative and restores focus when the host collapses focused content; `src/experimental/Disclosure/Disclosure.test.tsx:34` — keeps independent state and disables expansion requests |
| T-P28-02 | `src/experimental/Disclosure/Disclosure.test.tsx:10` — toggles a named linked panel using keyboard and excludes collapsed children from tab order; `src/experimental/Disclosure/Disclosure.ssr.test.tsx:7` — renders expanded navigation and linked disclosure state without browser globals |
| T-P28-90 | `src/experimental/Disclosure/Disclosure.test.tsx:10` — toggles a named linked panel using keyboard and excludes collapsed children from tab order; `src/experimental/Disclosure/Disclosure.test.tsx:55` — keeps nested requests independent, heading semantics and child ref lifetime host-owned; `src/experimental/Disclosure/Disclosure.ssr.test.tsx:7` — renders expanded navigation and linked disclosure state without browser globals |
| T-P28-91 | `src/experimental/Disclosure/Disclosure.test.tsx:21` — keeps controlled expansion authoritative and restores focus when the host collapses focused content; `src/experimental/Disclosure/Disclosure.test.tsx:34` — keeps independent state and disables expansion requests; `src/experimental/Disclosure/Disclosure.test.tsx:39` — preserves outside focus after a focused child is removed before host collapse; `src/experimental/Disclosure/Disclosure.test.tsx:55` — keeps nested requests independent, heading semantics and child ref lifetime host-owned |

## Input authentication

All listed pre/post SHA-256 inputs matched. The worktree was clean before and after execution. The tested git tree authenticates the frozen repository, including transitive implementation; the hashes below identify the direct implementation, composition, tests and execution inputs.

| Input | SHA-256 |
| --- | --- |
| `src/experimental/Disclosure/Disclosure.module.css` | `becd7049da0f47dd10ae46a74dadfd40867ce59081901af1b0dd0a258e221fa1` |
| `src/experimental/Disclosure/Disclosure.ssr.test.tsx` | `7bea6a28259ab9f84cb0a68903dfcfa08578af1875258cbddf04cf48a8a58501` |
| `src/experimental/Disclosure/Disclosure.stories.tsx` | `750eaa7012e83f294e162c16cd2ba8d39bc41a8f11e220f0692e71a127cbabfa` |
| `src/experimental/Disclosure/Disclosure.test.tsx` | `ffef18af09a8d1eae5a2bff60203116eab5b822f410544ac1008465ad7ea7c4e` |
| `src/experimental/Disclosure/Disclosure.tsx` | `b9a4727633636ead8c8d5b9e10b813c24adc3ff6db926c12bce1b40e7bf9d54a` |
| `src/experimental/Navigation/Navigation.tsx` | `d2a8c4bd6cc6ccf273f1763fb4b871a52fd7ee1efb6041fdd95b34ac5b673d60` |
| `src/experimental/List/List.tsx` | `86789c8b4974410cb0f87d077b565374c3b4f51a9aab5f8dfdde16a65705cace` |
| `src/experimental/Provider/Provider.tsx` | `b4437ea9566122c1bf67b6b75a4317a46ad831943f69cef818ab1d67a18f0b9d` |
| `scripts/browser-validation-pool.mjs` | `d0df14616b329d24f3356bcb73788c294d1f3ff95892ec7e664a5cc458ade323` |
| `scripts/vitest.setup.ts` | `934423f290e0c24449113d75fd4afee4d3039df2482c13ced64b6262f5e9112e` |
| `vitest.config.ts` | `dc98d777c10fc8a9a56d4fac1fe083d5080a225d03b17116b79526361d764142` |
| `package.json` | `7fe8d0820a8999c0a4ef2159f7626ca76361b66c9b1b9c46ef206d25e6e3ae11` |
| `pnpm-lock.yaml` | `786f56018e5278bc36f59b02d0c2d2ee0ab2df7fc7883178aeb4b9deb3d13438` |

## Retained report and limits

Machine report: `/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/post100-disclosure-proof-gap.json`. It includes the reconciliation input hash, exact argv/head, per-case outcomes, resource samples/groups, lease ownership and release timestamps, raw-log hashes and leaf mappings.

This is focused runtime behavior and SSR evidence. It is not compiler/declaration, packed consumer, native browser, matrix, manual/device/assistive-technology or whole acceptance evidence. No Storybook build, browser run or full check occurred. Shared backlog/state/guards/exports/tokens/configuration remained untouched. No push, merge or publication.
