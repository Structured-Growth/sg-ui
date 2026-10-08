# Batch 161: repeatable license inventory capability (L-08 partial)

Inspection/validation date: 2026-10-07 (America/Chicago). Assigned baseline:
`d5aec9b`, isolated managed checkout
`/Users/thomashall/.codex/worktrees/2846/sg-ui`, owned branch
`codex/batch161-license-inventory`. Initial status was clean and detached; branch
creation preceded edits. Coordinator alone reviews, integrates and accepts.

The retained [batch 98 report](https://github.com/Structured-Growth/sg-ui/blob/7335e41c35ea0af07f72b133ced92e04e1e896ca/docs/developer/parallel-batch-98/acceptance-evidence.md), read
from Git commit `7335e41c35ea0af07f72b133ced92e04e1e896ca`, identifies the actual
missing repeatable resolved inventory and ownership workflow. Current L-08 still
requires both. This change adds the check and a proposed workflow, with owner
appointment explicitly held. Architecture and commercial/legal guidance were read;
neither a manifest nor retained notices were treated as complete legal evidence.

## Implemented bounded capability

- [Checker](../../../scripts/check-license-inventory.mjs): Node-built-in-only,
  read-only local manifest/pnpm v9 locked/installed inventory; sorted relative
  paths and input/legal/metadata/asset hashes; direct runtime/optional/dev,
  consumer peer realizations, shared transitive reachability and unclassified
  locked scopes; peer-qualified snapshot edges retain optional flags.
- Missing/stale/mismatched metadata and legal evidence remain findings. Conflicting
  installed license/provenance instances are ambiguous. Notice-heading references
  compare exact identities/strings without claiming legal text accuracy, SPDX
  equivalence or authority to remove historical notices.
- Literal distribution roots and binary/image/font/media asset candidates receive
  hashes and explicitly unknown provenance. Missing build output, symlinks and
  unsupported patterns remain unresolved; no packed-artifact completeness claim.
- [Fixtures](../../../scripts/check-license-inventory.test.mjs): inert temporary
  inputs, deterministic output across different roots, unchanged legal/input bytes,
  shared scopes, scoped packages/cycles/optional edges, equal/conflicting peer
  instances, missing inputs, mismatches, unknown assets and CLI status semantics.
- [Usage/governance proposal](../react-aria-license-inventory.md): proposed owner,
  legal reviewer and update triggers; actual repository-owner decision remains held.

## Exact validation receipt

Tested implementation head: `1b02d1e4636ecf34745ce5f80cddbdaa1024344f`.
The working tree was clean at this commit before targeted execution.
Runtime: **Node 24.21.0**, binary
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
The canonical `acquireLightSlot` helper admitted
`/tmp/sgui-light-validation-slots/slot1`, owner
`batch161:1b02d1e:targeted:95822`, with its legacy transition guard. The complete
lease was passed to `releaseLease` in `finally`; exact-owner release succeeded.
No install was needed, so no install slot or dependency installation was used.

Commands executed under that lease, each exit **0**:

```sh
node --check scripts/check-license-inventory.mjs
node --check scripts/check-license-inventory.test.mjs
node --test scripts/check-license-inventory.test.mjs
```

Result: **10 tests, 10 pass, 0 fail/skipped/cancelled**. An earlier eight-fixture
iteration also passed; it is superseded by this exact-head receipt. Fixture CLIs
verified statuses 0/1/2. No real repository inventory run is claimed: this isolated
checkout has no installed dependency tree. The checker reports absent installation
as missing evidence; complete current dependency-license evidence still requires
an already installed frozen tree and owner review in a separately admitted task.
Raw targeted test output is retained in this chat's tool results, not a fabricated
external artifact. The final documentation-only evidence commit follows the tested
head and corrects the master-task anchor; checker and fixture blobs are unchanged.

| Path at tested head | Git blob |
| --- | --- |
| `scripts/check-license-inventory.mjs` | `d562e9bd2c3283dc619f25e304be7538eb46f39d` |
| `scripts/check-license-inventory.test.mjs` | `0e3cd543463a626a4122fddbfd75ca31c54ba802` |
| `package.json` (unchanged) | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `pnpm-lock.yaml` (unchanged) | `d312a82ec958b0badc4633899ec4510cbb655648` |
| `LICENSE` (unchanged) | `9dbc843502f2b1e8f74ed4c4940c471e7cca8acd` |
| `THIRD_PARTY_NOTICES.md` (unchanged) | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |

`git diff --check` passed. A relative-link check initially found that the batch 98
report is not in this checkout; both links were corrected to its retained exact Git
commit. Local documentation links/paths and anchors were then checked against
retained files/headings; the linked batch 98 blob was confirmed using `git ls-tree`
(remote web availability was not tested). The change is restricted to the four authorized new paths; no
manifest, lockfile, dependency, workflow, production source, LICENSE, notice or
commercial-term edit occurred. No approval automation, package installs, network
fetches, builds, browsers, full `pnpm check`, publication or production acceptance
ran. No extra agents were used.

## Remaining full gates

L-08 capability is supplied; actual ownership appointment/approval is still held.
L-01/L-02/L-04/L-05/L-07 require actual dependency and shipped-code/asset provenance,
notice and legal review. Metadata strings/hashes do not establish compatibility,
license authenticity or asset authorization. No all-licenses-safe conclusion is
made. Final tarball/bundled/copied/generated/inline-code and font provenance review,
commercial approval, L-09 governance and broad R/Z production gates remain open.
This tooling change supplies no new native, browser, device, assistive-technology
or whole G/K/E/U/X/R/Z acceptance evidence, and does not waive their remaining gates.
