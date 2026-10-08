# Live token transition proof correction — batch178

F-S02-01/F-S02-04 bounded primary-proof correction. Functionality closure remains
pending the coordinator's fresh failed-case proof. No dev or production acceptance.

## Isolated bootstrap and held history

- Managed worktree: `/Users/thomashall/.codex/worktrees/batch-178-token-transition/sg-ui`.
- Branch: `codex/batch-178-token-transition`.
- Initial `codex/dev` head: `e4e60bd8e890c5a6daa69b3dd2c3d2b6077bb39d`.
- Testing-only held candidate: `49e58e6b41af84e943590df518a870f733bdc8fc`.
- Normal non-fast-forward bootstrap merge before edits:
  `0598295ab68362dd24b07d7bf4d34bba37f41b95`.
- Corrected source commit: `b31997a4583808cfcf77d2492a13ba0cee879c19`.

The merged held sources are prerequisites for testing; this merge does not accept
them into dev. Existing [batch171 history](../parallel-batch-171/token-tier-scope.md)
is frozen. Read its independent receipt at
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/batch171-independent-review.json`
(SHA-256 `20185f57f94a5a6f9ea584b2ea33d83661ddd131dc4ee686c67c7feb704249d9`). It admitted prepared
source for coordinator proof, with no native pass inferred from its type receipts.
The story/spec hashes at bootstrap match that receipt; prerequisite token files
remain unchanged. This correction changes only the browser spec and this report,
within the three-file allowlist. No architecture or runtime implementation changes.

## Retained red proof and diagnosis

Coordinator run at held candidate `49e58e6b41af84e943590df518a870f733bdc8fc`:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence/functionality-final-five/pool/token-functionality`.
Its evidence.json retains Chromium selection argv, build digest
`28a57ed728a2b8e7346503d57ef4ca6c359f28865c34233b5df5bd6b91170cbc`, session,
port 7473 and settled failure. Its three-case token shard had two green cases and
one red live theme/density case. The green nested override and portal cases are
retained; neither is repeated here. The overall root eight-case proof had four
green/four red cases per dispatch; only this token failure is owned here.

Raw trace inspected:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence/functionality-final-five/pool/token-functionality/traces/token-tier-scope-live-ligh-9fdf7-ses-at-inherited-boundaries-chromium/trace.zip`
(SHA-256 `bd4afa514ca6fe4ee10a6c30e5b1287b48d5ca84c1e3e1dc654b6ac55b5b6702`).
Also read browser.log, evidence.json and the trace's event/resource records.

Classification: fixture assertion timing against the production CSS transition.
AppButton delegates to the owned Button. Both working source and captured native
CSS resource `resources/d36ef61e14ba38af89c2557b6feb2506b789eb23.css` declare
`transition: background-color var(--sgui-motion-duration)`; captured token resource
`resources/d27286651f4c3bc63b176d1a08d8bb9fa408ac82.css` resolves duration to `.12s`.
The first dark-theme click starts at trace time 1975.701 ms and finishes at
2012.488 ms. The button lookup for the failing sample starts at 2066.994 ms,
finishing at 2071.851 ms: about 91–96 ms after click start, within 120 ms.
Already-updated scope and inherited swatches equal the dark reference; the actual
button returned `rgb(76, 139, 240)` between light `rgb(29, 78, 216)` and expected
dark `rgb(96, 165, 250)`. This is consistent with the captured transition, rather
than evidence of a wrong endpoint alias. Fresh endpoint proof remains pending.

The correction replaces only the immediate actual-button background assertion
with Playwright `expect.poll` for the same exact `expected.action` value after each
native theme/preference change. The exact RGB reference assertions and all 68
alias equality assertions remain intact. No tolerance, timeout sleep, global
animation disabling, reduced-motion emulation or production CSS change.
The existing switching story already exercises the changed behavior and retains
production motion, so its bytes are unchanged.

## Targeted validation receipts

Runtime: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`,
`v24.21.0`. Frozen dependency install uses pnpm 10.29.3. Only owned canonical
install/light slots (with their legacy transition claims) were acquired. Both
commands exit 0 with settled process groups and released leases; no foreign
ownership cleanup or heavy/browser slot acquisition.

| Label | Actual Node argv | Lease / owner | Outcome |
| --- | --- | --- | --- |
| install | `["/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs", "install", "--frozen-lockfile"]` | `/tmp/sgui-install-slots/slot0` / `batch178:d2caa432-5f46-4d12-806f-e24e45fa77ab` | passed; released `2026-10-08T23:16:33.908Z` |
| types | `["node_modules/typescript/bin/tsc", "--noEmit", "-p", "/tmp/sgui-batch178-types.json"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch178:477bc4b1-0456-4ba2-ac06-36847d05aba6` | passed; released `2026-10-08T23:16:47.186Z` |

Types ran at bootstrap HEAD `0598295ab68362dd24b07d7bf4d34bba37f41b95` with the
corrected spec bytes present before source commit. External targeted config covers
the story, spec and CSS module declarations plus their imported dependencies.
No whole-suite or packed-consumer type claim. Corrected spec SHA-256:
`3863cb12400fcdb512612b9f202b6099a154844e9bcf7bd4e234d48eb45a986e`.
Unchanged story SHA-256: `57fa7feeb6a18ac5cde46d034dc9c190e8e69e8a12e5b25551cc1aad5f088024`.
`git diff --check` passed. No unit test is needed for this proof-driver-only change.

Raw logs and process-group resources: `/tmp/sgui-batch178-<label>.log` and
`/tmp/sgui-batch178-<label>.log.resources.json`; exact commands, tested head,
source hashes, runtime, owner and log/resource hashes are preserved in
`/tmp/sgui-batch178-<label>.log.receipt.json`.

- `/tmp/sgui-batch178-install.log`: `03a38f3029bc9a897d0424171151017bdd03b3d468f6a8c5b872c1b4bfd73dab`
- `/tmp/sgui-batch178-install.log.resources.json`: `2e825efe5c29efaa139bd0a6b2091595045e9c89b2a6f80bff6e943017be1bd4`
- `/tmp/sgui-batch178-install.log.receipt.json`: `be4610b7b8b353f24ee432d3171811c8026006d3de921be5eba9aa1cb3023aa5`
- `/tmp/sgui-batch178-types.log`: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- `/tmp/sgui-batch178-types.log.resources.json`: `07561f83a8245e70d1b9dba91ba3e615b51b75e2c6cad9d458a2cad99cd1c767`
- `/tmp/sgui-batch178-types.log.receipt.json`: `3e288baaf7c5f422a21c8d60acbab9066d004b37bb5b34ac12b192a6a0ec725d`
- `/tmp/sgui-batch178-command.mjs`: `92719704f45058f6b307858f657955bc1c4b9720caa3d00d9eabce6611f91f0a`
- `/tmp/sgui-batch178-types.json`: `9e8ae8ff18b8d32bcdcfbd8998bbfe11437d6d23924b6af842de154f63b4a3f3`

## Coordinator handoff

Build fresh shared candidate once, then run only:
`tests/browser/token-tier-scope.spec.ts --project=chromium --grep "live light dark system and density changes recompute all displayed aliases at inherited boundaries$"`.
Retain new exact head, build digest, runtime/argv, log hashes and traces. No local
Storybook build or browser run was performed. The two existing green token cases
remain retained evidence. Cross-engine, device, assistive-technology and broader
F/T/V or historical acceptance remain pending. No central checklist/state changes,
CI, main, publication, push, force push or merge into dev was performed.
