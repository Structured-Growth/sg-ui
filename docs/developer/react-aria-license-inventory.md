# Read-only dependency and license inventory (L-08 partial)

[The checker](../../scripts/check-license-inventory.mjs) reports repository
manifest declarations, pnpm v9 locked identities/edges, available installed package
metadata, legal-file hashes and distributed asset candidates. It supplies evidence
for review; it does not approve licenses, change notices or decide commercial terms.
See [L-01–L-09](react-aria-master-task-list.md#5-licensing-and-dependency-governance),
[architecture policy](react-aria-architecture.md#dependency-and-license-policy),
[commercial guidance](../commercial-licensing.md) and the
[batch 98 gap record](parallel-batch-98/acceptance-evidence.md).

## Run and interpret

From a repository with an already installed frozen-lockfile dependency tree:

```sh
node scripts/check-license-inventory.mjs
node scripts/check-license-inventory.mjs /path/to/sg-ui
node --test scripts/check-license-inventory.test.mjs
```

Use the development Node 24 runtime. The checker uses only Node built-ins, reads
local files and prints JSON to stdout. It does not install, fetch, execute package
code, build, write reports or update legal material. If a saved report is useful,
the caller can redirect stdout to a separately chosen artifact location. An absent
installation still yields locked identities and explicit missing-evidence findings.
Installation/build preparation is a separate authorized task under the validation
lease policy, never a checker side effect.

Exit **0** means no defined evidence findings in these inputs, **1** means the JSON
contains findings, and **2** means invalid/unreadable inputs or unsupported usage.
None of these statuses is legal approval. Optional/platform packages absent from
the local installation produce missing-metadata findings rather than inferred
licenses. Findings are retained for owner review; there is no suppression list or
automatic safe-license allowlist. Unsupported lock identities, including workspace,
file, git and npm aliases, require a deliberate parser extension and fixtures.

The parser deliberately reads only pnpm v9 root importer specifiers/resolutions,
package identities and snapshot dependency/optional edges. It is not a general YAML
parser and does not evaluate integrity, engines, platform eligibility or peer range
satisfaction. Hashes identify exact input bytes. Installed lock bytes must match
the repository lock; whitespace-only differences are also reported for review.

## Separate evidence scopes

| Report field | Meaning and limits |
| --- | --- |
| `direct` | Manifest runtime, optional runtime and development declarations with locked specifier/resolution comparison; direct installed name/version checked independently |
| `peers` | Consumer-owned peer ranges and local locked realizations; these do not prove the entire supported React range |
| `packages` | Every locked identity, exact-version direct/transitive relationship, runtime/dev/peer-realization reachability and available physical pnpm store metadata |
| `lockedSnapshots` | Exact peer-qualified snapshot references and optional-edge flags; cycles are bounded and shared transitive packages retain every reachable scope |
| `metadata` | Package JSON hash, declared license/legacy licenses/repository, and top-level LICENSE/LICENCE/COPYING/NOTICE file paths/hashes; strings are retained without SPDX or compatibility judgments |
| `notices` | Recognized `## name version (license)` headings, their line numbers and locked identity match; missing direct runtime/peer references, stale/unparsed headings and exact metadata string differences are findings |
| `distributionRoots` / `assets` | Existing literal manifest `files` roots and image/font/media/PDF/WASM asset hashes; source provenance is explicitly unknown |
| `project.legalFiles` | Current LICENSE and THIRD_PARTY_NOTICES.md hashes, preserved as read-only evidence |

The physical pnpm store is inspected rather than resolving arbitrary package
exports. Duplicate peer instances retain separate paths. Different license,
repository or legal-file evidence for one name/version produces an ambiguity
finding; equal evidence can coexist. Locked packages with no reachable root are
`unclassified-locked`; installed packages absent from the lock are reported.
Paths are repository-relative and sorted, with no timestamp or absolute workspace
prefix, so identical inputs at different checkout paths produce identical JSON.

Notice headings are evidence references, not a text/license audit. Historical
headings may be intentionally retained. A stale reference does not authorize notice
removal. Transitive license obligations, attribution inside files, bundled code and
copied/generated assets still need review. The checker does not copy legal text
into the report or rewrite commercial material.

Manifest `files` roots are **candidates**, not a packed-artifact inventory. Globs,
negations, escaping paths and symlinks remain unresolved findings. It does not
follow distribution symlinks. Inline SVG/icon code, generated/copied JS, CSS asset
URLs, source maps, host-supplied fonts and assets outside the literal roots need
separate provenance review. A missing `dist` is a finding; the checker never builds
it. Root legal-file inspection does not prove packed byte preservation, which is
the separate existing [package audit](../../scripts/check-package.mjs).

## Proposed ownership and update workflow — owner decision held

Proposed responsible owner: the repository maintainer approving a dependency or
asset change retains an exact-head inventory and resolves evidence findings with
the change author. Proposed legal reviewer: the repository owner's designated
counsel/license reviewer approves notice and commercial-term decisions. These
roles are proposals, **not appointments or inferred approvals**. The repository
owner must name/accept responsible people and the workflow before L-08 ownership
can be accepted.

Proposed update triggers are manifest/lockfile or resolved metadata changes;
dependency upgrades or installation-policy changes; copied/generated icons,
fonts, media and other distributed assets; bundling/distribution-root changes;
and final release-artifact review. Keep before/after reports with exact commit and
input/legal-file hashes. Resolve missing/mismatched/ambiguous evidence explicitly;
do not infer compatibility from a package license string or clear a finding by
removing notices. Reviewers separately reconcile final shipped code/assets and
notices. Follow [targeted development validation](react-aria-development-validation.md)
for implementation changes; production acceptance retains its full gates.

This bounded checker supplies the previously missing repeatable capability.
L-08 owner assignment remains held. L-01/L-02/L-04/L-05/L-07 and final L/R/Z
legal, provenance, exact-artifact and production acceptance remain open; no
all-licenses-safe statement, publication authorization or commercial approval is
made. L-09 security/support governance is a separate task.
