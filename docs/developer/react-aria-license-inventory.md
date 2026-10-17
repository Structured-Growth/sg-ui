# Read-only dependency and license inventory

[The checker](../../packages/ui/scripts/check-license-inventory.mjs) reports repository
manifest declarations, pnpm v9 locked identities/edges, available installed package
metadata, legal-file hashes and distributed asset candidates. It supplies evidence
for review; it does not approve licenses, change notices or decide commercial terms.
See [L-01–L-09](react-aria-hardening-tasks.md),
[architecture policy](react-aria-architecture.md#dependency-and-license-policy),
[commercial guidance](../commercial-licensing.md) and the
[batch 98 gap record](https://github.com/Structured-Growth/sg-ui/blob/7335e41c35ea0af07f72b133ced92e04e1e896ca/docs/developer/parallel-batch-98/acceptance-evidence.md).

## Run and interpret

From the repository root with an already installed frozen-lockfile dependency tree:

```sh
node packages/ui/scripts/check-license-inventory.mjs packages/ui
node packages/ui/scripts/check-license-inventory.mjs /path/to/sg-ui/packages/ui
node --test packages/ui/scripts/check-license-inventory.test.mjs
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

The parser deliberately reads only pnpm v9 selected importer specifiers/resolutions (packages/ui in this workspace),
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
the separate existing [package audit](../../packages/ui/scripts/check-package.mjs).

## Ownership and update workflow

The dependency or asset change author owns the inventory/notice update for that
change. The author retains before/after inventory reports, exact input and legal
file hashes, the candidate archive digest and the disposition of new findings.
Repository maintainers review those reports and notice changes in the pull request
before integration. These are role-based repository responsibilities; a personal
appointment is not required to run or maintain the check.

Run the inventory when manifests/lockfiles or resolved metadata change; when
dependencies, install policy, copied/generated source, icons, fonts or media change;
and when reviewing the final package artifact. Authors must explain missing,
mismatched and ambiguous evidence. Maintainers verify the explanation, final
shipped code/assets and required attribution. Retain existing notices until the
associated code/assets and obligations are resolved. No script rewrites commercial
terms or declares legal compatibility. Escalate uncertain rights or commercial
terms to the repository owner's appropriate reviewer rather than inventing an
approval or silently suppressing findings.

The repeatable checker and role-based responsibilities satisfy L-08's inventory
and update-ownership scope. The actual report may exit1 with unresolved evidence;
that outcome is retained for review, not changed into a clean license result.
L-01/L-02/L-04 and other legal/provenance obligations retain their exact remaining
findings. The complementary [source policy guard](react-aria-governance-check.md)
checks configured publication, legal-copy and task-data boundaries. Follow
[targeted development validation](react-aria-development-validation.md) for code
changes; production acceptance retains its separately required gates.

## Join an existing archive to the reviewed license inventory

After the coordinator freezes fresh validated output and retains a candidate with
`node scripts/check-package.mjs --retain-packed=/absolute/new/evidence-directory`
(from `packages/ui`), use the read-only companion from the repository root:

```sh
python3 packages/ui/scripts/check-packed-license-evidence.py /path/to/sg-ui /path/to/candidate.tgz /path/to/license-inventory.json
```

This standard-library Python 3.9+ checker emits JSON to stdout. It never extracts
archives, installs, builds or writes legal files. It checks manifest/repository and
installed lock hashes against the inventory, hashes installed runtime/peer metadata
and legal evidence, compares packed/root/package legal bytes and whole normalized
legal text, and lists every regular archive member with a hash. Packed package metadata is
compared as a complete JSON object, allowing only pnpm's observed omission of the
development `packageManager` field; both raw hashes and this transformation are
recorded. All other metadata differences remain findings. It also reports
packed/current `dist` drift and missing current output files. Unsafe paths, duplicate
members, links, escaping local evidence and oversized members are invalid inputs.
Exit 0 means its defined byte checks pass, 1 means findings, and 2 means invalid
inputs; none is legal approval. A historical candidate may properly return 1.

This deliberately conservative supplemental-text check does not determine which
transitive packages are bundled or which notices are legally required. Missing
`client-only` legal evidence remains a finding until verified provenance is
obtained or its distribution is deliberately changed and validated. Copied code,
inline notices, Apache modified-file statements, fonts/icons, documentation bundles
and historical attribution require the separate designated reviewer disposition.
Current output equality alone does not establish a fresh build. Retain the exact
archive, report, inventory and their hashes; do not overwrite earlier evidence.

## Capture package-manager lock provenance in an isolated checkout

`check-lock-provenance.py` supplies capture and read-only verification modes.
Capture requires an otherwise idle, clean isolated checkout at the explicit head,
matching initial lock SHA-256, an exact repository pnpm version, development Node24,
and a new evidence directory outside that checkout. Acquire coordinator validation
leases before capture; the helper does not acquire leases or create a checkout.
It runs actual lock generation with lifecycle scripts disabled, rejects any changed
reviewed input before installation, then runs a normal frozen install and records
the physical installed graph. Frozen install runs the repository lifecycle scripts.
Review their trust before executing this explicit capture mode.

From the repository root after replacing every absolute path and digest:

```sh
python3 packages/ui/scripts/check-lock-provenance.py capture --repository /absolute/isolated-checkout --output /absolute/new-lock-evidence --expected-head FULL_40_HEX_HEAD --expected-lock-sha256 FULL_64_HEX_LOCK_DIGEST --node /absolute/node24 --pnpm /absolute/pnpm
python3 packages/ui/scripts/check-lock-provenance.py check --output /absolute/new-lock-evidence --expected-head FULL_40_HEX_HEAD --expected-lock-sha256 FULL_64_HEX_LOCK_DIGEST
python3 packages/ui/scripts/check-lock-provenance.test.py
python3 packages/ui/scripts/check-packed-license-evidence.test.py
```

Capture saves before-input bytes, generated and installed locks, ordered command
arguments, exact exit codes, stdout/stderr hashes/logs and a receipt after each
command. Failures and timeouts retain evidence and stop subsequent work. A changed
generated lock requires review of the retained before/after bytes before any new
candidate is accepted; the helper never silently accepts a changed resolution.
Check verifies those input/log identities, command order/flags and supported tool
versions without executing commands. Exit0/1/2 means defined checks pass/findings/
invalid inputs or failed capture. Treat captured logs as potentially sensitive
operator evidence; the helper does not print environment variables or credentials.

Local receipts cannot independently authenticate execution. Review transitive,
optional/platform, override and patched-dependency topology against the full lock
and compare installed selections per supported environment. One local graph does
not establish all optional-platform behavior, vulnerability status, licensing or
production release approval. The fixture-based tests exercise orchestration and
receipt failure handling; they do not constitute an actual repository install.
