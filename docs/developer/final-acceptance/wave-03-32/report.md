# Wave 03-32: immutable installed-consumer matrix

All six assigned acceptance leaves remain **partial**. Delivered a reviewable
six-file package-script patch, proposed-file mirrors, a runnable isolated matrix
driver, two artifact-identity tests and an exact coordinator validation plan.
This implements the missing reproducible execution path; it does not claim its
unperformed installed-consumer runtime results. Only wave-03-32 was changed.

The original requirements are retained verbatim per leaf in results.json and
assignment.json. No checklist/count changes, source integration, shared build,
install, pack, browser, server, Git mutation, publication or external messaging
occurred. The user server3000 and personal workspace file were untouched.

## Evidence reconciliation

Read AGENTS, final acceptance, assignment, the four prior reports and their assigned
leaf results, and coordinator-integration/evidence.json. Every prior report/results
hash matches assignment. At the inspection timestamp, all **112 recorded coordinator
inputs, 1,778 built library files, 292 private-fixture outputs and 15 receipts**
match their saved hashes. inspection.json records individual hashes and comparisons
with the prior consumer input receipts. These are hash checks of those scopes,
not a fresh compilation or an inventory of all changing working-tree source.

Retain the coordinator's Node24 package import/type/equality pass at its recorded
input/output identity. Its explicit limits exclude an installed-consumer matrix.
The old wave02 warning about then-stale output does not override the later
coordinator build receipt; conversely that later build does not supply missing
React18/19 installs, production consumers or hydration. No completed package or
broad suite was rerun here.

## Concrete implementation

immutable-consumers.patch changes three existing consumer drivers and adds three
helpers. Existing interaction, SSR, Flight, icon-pruning and isolated-subpath
assertions remain. Ordinary script invocation still supports its existing pack
behavior. External mode accepts one tarball plus required SHA256, copies its exact
bytes separately into each fixture, and never reads/rebuilds live dist. Hash mismatch
fails before install. A private fixture root retains Next output instead of deleting
it; child command output is preserved for failure diagnosis.

run-matrix.mjs stages the proposed scripts and current unchanged fixture assertions
into a new evidence directory, runs foundation18, foundation19, editor18, editor19
and Next19 serially, and captures logs, script/fixture hashes, installed dependency
graphs and consumer asset hashes. The test driver's node_modules symlink supplies
harness tools only. Each consumer installs independently from the file tarball;
there are no consumer source aliases/workspace links. Browser artifacts remain
inside the staged driver. No patch application is necessary to run this proposal.

New consumer-css-proof.mjs builds a stylesheet-only entry and a composition with
root, granular, repeated and dynamic imports. It requires exactly one emitted CSS
asset in each and identical CSS hashes, retained tokens/classes and unchanged
sideEffects metadata. The ten existing granular build assertions now save module
IDs/assets. These proofs are runnable additions, **not executed production results**.

consumer-types-proof.mjs scans the actual installed declarations with the existing
package guard's upstream-type deny patterns, hashes declarations and saves exact
React, React DOM, matching type-package and TS versions. Existing API positive and
expected-negative compilation retains strict/Bundler/react-jsx with skipLibCheck.
This does not validate all third-party declaration internals or expand supported
TypeScript versions beyond the existing 5.9.3 fixture pin. The prior optional
@internationalized/date guard enhancement is not silently represented as shipped
by this same-pattern scanner, nor as evidence of a known current leak.

## Per-leaf outcome and successor

| Original leaf | Result delivered | Remaining acceptance |
| --- | --- | --- |
| A-C-20 | Current compiled distribution/package evidence retained; concrete mixed/dynamic CSS equality and module-graph receipts added. | Execute installed production builds and inspect CSS/graph/pruning receipts on the frozen candidate. |
| A-R-08 | One immutable tarball now feeds clean Vite foundation/editor and Next fixtures; preserve failures/output. | Execute five serial installed scopes on supported runtimes, including ordinary SSR, React19 Flight and Next production/browser. |
| A-R-09 | Installed declaration scan/version receipt plus unchanged positive/negative API fixture. | Execute TS5.9.3 with both matching React type sets; explicitly settle any broader supported TS range/options and validate it. No all-TS5 or no-skipLibCheck claim. |
| A-X-17 | Exact React18.3.1/19.2.3 fixtures share tarball identity and retain type/runtime versions. | Execute both versions' SSR and three-engine hydrated behavior on Node22.12/24. |
| A-X-20 | Retains generic/ref/payload/negative assertions; saves installed declaration and isolated CSS/module evidence. | Run those assertions against actual installed candidate, reconcile any changed contract, preserve all receipts. |
| A-Z-09 | Retains core/grid/date/editor fixture behavior and adds full installed dependency-graph capture/retired-package check. | Demonstrate independent installs/builds/SSR/hydration with no retired foundation/style runtime. Lexical remains supported. |

## Checks actually run

preparation-checks.txt/json contain exact commands and exit codes. Local runtime
was **Node26.5.0**, used only for lightweight helper tests and syntax checks:

- Two artifact tests pass: independent identical-byte copies remain stable after
  input replacement; a wrong hash rejects before any install.
- All six proposed .mjs files and the matrix driver pass node --check.
- git apply --check immutable-consumers.patch passes without applying it.
- inspect.py passes the scoped historical/coordinator hash comparisons above.

This is preparation evidence, not supported Node22/24 consumer acceptance. No
native, AT, physical device, remote CI, legal or release result is implied. There
were no failed consumer runs to reconcile because none was launched. The installed
CSS/type helpers and matrix orchestration remain runtime-unvalidated proposals.

README.md provides the runnable coordinator command and artifact layout;
validation-plan.json specifies both supported Node targets, three browser engines,
expected assertions per original leaf and failure retention. Use the existing
validation lease, one frozen candidate, new output directories and no concurrent
build/pack. Reuse the same results across all six leaves; do not run six duplicate
matrices. A support-policy decision for additional TS versions is the only owner
input; the concrete existing pinned matrix can run independently. Shared patch
integration and actual acceptance reconciliation remain coordinator work.
