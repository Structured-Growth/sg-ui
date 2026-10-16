This directory contains a runnable proposed consumer matrix and a review patch.
Run from the repository root after the coordinator freezes and hashes a candidate.
No integration is necessary to execute `run-matrix.mjs`: it stages these proposed
script mirrors with the existing public API fixture and browser assertions.
`immutable-consumers.patch` is for later review/integration into package scripts.

Use Node22 >=22.12 or Node24 with pnpm10.29.3 selected on PATH. Obtain the validation
lease before installations/builds/browser work. Do not overlap with another pack,
source/build-output writer or consumer run. The existing lease wrapper was inspected;
it owns both heavy and legacy locks. Do not reclaim an occupied lease.

```sh
node --version
pnpm --version
node /tmp/sgui-calendar-validate.mjs node docs/developer/final-acceptance/wave-03-32/run-matrix.mjs --tarball /absolute/frozen-candidate.tgz --output /absolute/new-evidence-node24 --browser
```

Repeat on Node22.12.0 using the **same tarball** and a new output directory. The
runner rejects existing output directories and unsupported Node versions. For
bounded follow-up, use `--only foundation18,foundation19` or `--only editor19`.
Five scopes run serially, with zero retry logic in the driver. Foundation18/19
run installed positive/negative API compilation, isolated import graphs, CSS
proofs, ordinary SSR, production Vite, and optionally browser SSR/hydration.
Foundation19 additionally executes the official React Flight proof. Editor18/19
retain existing SSR/editor interaction assertions. Next19 always executes the
existing production browser fixture. Omitting --browser does not establish Vite
browser hydration. Keep required engines chromium,firefox,webkit selected.

Every consumer installs a private copy of the one hash-verified tarball. The staged
driver symlinks only its test tools to repository node_modules; consumer dependency
resolution uses its own installation. Drivers/artifacts live under the new evidence
directory. No shared build/pack/server is started. The fixtures retain their own
pnpm-lock.yaml, actual installed graph, API/types receipts and output. The driver
keeps stdout/stderr, scripts/fixture hashes, per-subpath module IDs and CSS evidence,
all consumer asset hashes, and browser failure traces/screenshots. Installs use
existing pinned manifests and generate **new retained consumer lockfiles**; this is
repeatable candidate validation, not a claim of registry resolution reproducibility
without those captured lockfiles. Preserve the whole output directory when saving
results; matrix.json contains hashes, not replacement copies of those files.

The installed type scanner checks every packaged .d.ts against the existing owned
upstream-type deny patterns. The existing package-consumer.tsx preserves generic,
ref, callback and negative API assertions. Both React-version-matched type sets use
TS5.9.3, strict, skipLibCheck, Bundler and react-jsx. A broader TS support range and
no-skipLibCheck policy require an explicit support decision and later execution.
The CSS proof requires identical emitted stylesheet hashes between a side-effect-only
entry and a repeated/root/granular/dynamic composition. Existing engine/vector
pruning assertions remain separate and unchanged. Root import graphs are not
claimed to isolate heavyweight dependencies; granular graphs retain that contract.

Lightweight preparation checks, without pack/install/build/browser execution:

```sh
python3 docs/developer/final-acceptance/wave-03-32/inspect.py
node --test docs/developer/final-acceptance/wave-03-32/consumer-artifact.test.mjs
git apply --check docs/developer/final-acceptance/wave-03-32/immutable-consumers.patch
```
