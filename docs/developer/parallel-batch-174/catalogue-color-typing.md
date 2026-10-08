# Batch 174: catalogue color fixture typing blocker

Classification: **test fixture typing blocker**, supporting F-S02-01,
F-S02-04 and F-P23-03. This correction does not establish product functionality
acceptance or native browser acceptance.

## Bootstrap and ownership

Worker: `/Users/thomashall/.codex/worktrees/c36e/sg-ui`, branch
`codex/batch174-catalogue-color-typing`. The isolated managed worker started clean
at `c0602df46c3f521811c1895a37fa9a932733e6ab`. Normal
`git merge --no-edit e321266fe86cb273f8ed5cfee7f726cc3ac1cd13` fast-forwarded to
that exact testing-only candidate before source edits. Its held token/Tabs sources
are testing inputs, never dev acceptance. No primary/integration checkout changed.

Exclusive source writes are `tests/browser/foundation-catalogue.spec.ts` and this
report. Keep this scope reserved until coordinator review/proof. The source-only
correction commit is `4bcf565846af1ee5dc14caa1bef0c02e88cbc744`; the final report
commit changes documentation only.

The prior candidate's units, source types, foundation guards and fresh Storybook
were reported passed; browser types failed at the catalogue helper's `slice` and
`length` on `string | number` before any browsers ran. This report attributes that
prior evidence to the candidate, rather than rerunning or claiming it as worker
proof. Its receipt is:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence/functionality-token-tabs/targeted/receipt.json`.

## Correction

Expanded base tokens include numeric scales and string values for other token
kinds. The palette helper now looks up references without an unchecked key cast,
requires referenced tokens to have `$type: color`, then narrows the resolved value
with `typeof` and six-/eight-digit hex validation before parsing channels. Missing,
non-color, numeric or malformed values fail explicitly with the semantic token
name. Valid colors retain the existing RGB/RGBA conversion and alpha rounding.
All palette/contrast expectations and test cases are unchanged. Tokens and Tabs
are untouched; their bootstrap bytes were independently compared after the fix.

## Exact targeted validation

One browser TypeScript invocation passed, exit 0 with no diagnostics, at clean
source head `4bcf565846af1ee5dc14caa1bef0c02e88cbc744` on 2026-10-08
13:00:36–13:00:40 UTC. Node was `v24.21.0`, executable:
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
The wrapper prepended that executable's directory to PATH for child Node processes.
Actual executable and argv (each line below is one argv array):

```json
["/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node", "/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.mjs", "install", "--frozen-lockfile"]
["/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node", "/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.mjs", "exec", "tsc", "--noEmit", "-p", "tests/browser/tsconfig.json"]
```

Dependencies were absent, so the conditional frozen-lockfile install ran once and
passed under owned `/tmp/sgui-install-slots/slot0` plus its `slot-0` bridge.
Browser types ran once under owned canonical
`/tmp/sgui-light-validation-slots/slot1` plus its `slot-1` bridge. Owner:
`batch174:01a11b98-75c6-7ae1-b8a7-80e1adab9a9a:5a229a97-5dc5-439e-87d4-425f5e1827fd`.
Both process groups settled; both owned leases were released.
Foreign batch85 `slot0/owner` stayed byte-identical, 49 bytes, SHA256
`86c3cb0d27f3e25fdc7986e329d748a4aaa89be3228d3fa7739625b55149dedd`.
No build, native browser, full check or matrix ran in this worker.

## Retained bytes and logs

Durable evidence directory:
`/Users/thomashall/.codex/visualizations/2026/10/08/01a11b98-75c6-7ae1-b8a7-80e1adab9a9a/batch174`.
The original ignored worktree copies are `artifacts/batch174/`.
The receipt records actual argv, source head, runtime, resource samples,
owner leases, settlement and outcomes. `targeted.mjs` retains the runner.
`bootstrap-manifest.json` records the exact byte counts/SHA256 of all 18 candidate
bootstrap changes plus the catalogue spec; the spec bytes are retained separately
as `foundation-catalogue.bootstrap.spec.ts`.

| Evidence | SHA256 |
| --- | --- |
| `receipt.json` | `a112b2257968ff886ff8af9973b56c6ad9b2609b1181a1463a8013644693007e` |
| `install.log` | `3261c09194b2f51a1587eff25cb22a5d9129b74b45a8ab4678ec7316f98727b8` |
| `install.log.resources.json` | `b8cd5a1ed4e4ca5ef26eae35bb6af1fa7a1866e7bdc94f5d7112d8f543fb721b` |
| `browser-types.log` (empty, successful) | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `browser-types.log.resources.json` | `46d8c76c5318de90e4ea4c1571cd772ada8707a6eedfdf95a05655bebaef98e0` |
| Post-bootstrap catalogue spec, 15,673 bytes | `d854e256ecf3c5b1b9f9fc6107adbd84a52aceb379a7900d538f6f1e6964ad66` |
| Corrected catalogue spec, 16,229 bytes | `745fa77e5ced2bb6ab1c91e17e8e39f68532834dbc7c3a5d33d04a5e1dac77c1` |

## Remaining proof

The compile blocker is corrected. Fresh focused candidate browser proof remains
pending with the coordinator; earlier red evidence remains intact. Chromium,
Firefox/WebKit, device and assistive-technology acceptance and whole F/T/V or
historical parent gates are not closed by this test fixture correction. Follow
[development validation](../react-aria-development-validation.md) and
[parallel browser validation](../react-aria-parallel-browser-validation.md).
