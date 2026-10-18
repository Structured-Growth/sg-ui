
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
legal text, and lists every regular archive member with a hash. It also reports
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
