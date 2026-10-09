# Attested frozen checkpoint continuation

This bounded API preserves the failed original checkpoint and runs explicitly
reviewed pending browser selections against its retained immutable Storybook.
The original nine green shards/90 cases, seven canceled shards, 86 unrun shards
and five unrun consumers remain historical dispositions; no aggregate checkpoint
or pending native leaf is completed by the Node fixtures below. Follow the
[development policy](../react-aria-development-validation.md) and
[pool policy](../react-aria-parallel-browser-validation.md).

`createContinuationManifest` remains a read-only reconstruction with
`resume.supported: false`. `prepareFrozenContinuation(request)` authenticates a
new execution request without taking leases. `runFrozenContinuation(request,
options)` in `scripts/browser-validation-pool.mjs` invokes that verifier and the
shared production wave scheduler. The checkpoint CLI adds:

```sh
node scripts/run-development-checkpoint.mjs continue /absolute/reviewed-config.json
```

The config has exactly `request` and `poolOptions`. Options permit the existing
queue/owner/port controls, `max` at most eight, and exactly the unchanged budget
`{ "maxLoad1": 24, "maxSystemRSSBytes": 29360128000 }`. Output is fixed to ignored
`artifacts/browser-continuation` within the candidate checkout. Production uses
canonical queue, bridge, four light slots, browser slots and owned command/server
settlement. The existing fixture-only third argument isolates resource paths in
Node tests; the CLI cannot supply it and it cannot replace evidence authentication.
No installation, Storybook build, extra Playwright worker or retry is admitted.

The request supplies these explicit reviewed claims:

- `original`: exact `planPath`, `dailyPath`, `poolPath`, `auditPath` for the original
  raw records. Checkpoint `worktree/stages` and earlier `cwd/commands` are supported.
- `pins`: unique `{ path, sha256 }` for every original input and present shard
  evidence/results/resources/owner file, original successful build/type/check log
  and resource receipt, and history records consumed by verification. Missing,
  altered, symlinked or unused pins fail. Review must authenticate these pins
  externally; they are trust anchors supplied by the coordinator, not signatures.
- `candidate`: separate clean committed `worktree`, exact `head`, complete
  `sourceDigest`. The imported pool/checkpoint/server bytes must equal candidate
  bytes, so invoke from the composed candidate checkout.
- `deltas`: every changed tracked file versus the original head as
  `{ path, kind, before, after }`, with SHA256 hashes and `before: null` for an
  addition. No deletion is admitted. Kinds are `supervisor` for the three named
  pool/checkpoint/server scripts, `test` for colocated tests/script tests/consumer
  test sources and consumer test tsconfigs, `documentation` for Markdown in docs,
  and `new-spec` for new top-level browser spec files. Existing browser specs,
  production source, stories, build config, dependencies and lockfiles must be
  byte-identical. Categories bound review; they never authorize unreviewed bytes.
- `shards`: existing exact snapshot shard grammar. Existing specs must belong to
  canceled/unrun original shards; new specs require an explicit reviewed addition.
  Whole accepted-green and acceptance-held files are excluded conservatively.
- `expectedCases`: map from each selected shard ID to the complete reviewed
  `{ file, id, project, title }` inventory, obtained from a reviewed list receipt.
  Actual result tuples must exactly match. Duplicate file/project/title tuples in
  accepted history or planned work are refused before admission.
- `history`: explicit `{ path, sha256 }` for every previous successful continuation
  receipt in this candidate output root, including corresponding pins. Results,
  counts, owner files and settled successful command receipts are authenticated;
  accepted cases are excluded transitively. Unknown output claims refuse reuse.

The original build must be the exact pool-owned `storybook` directory, with no
symlinks or writable entries. Original head/status/full digest and build digest,
original successful setup/check commands, source integrity and every original
shard report are authenticated. A resource-aborted aggregate can be reused while
retaining its red disposition. A source-integrity failure cannot. Cleanup must
have the exact original owner, empty unresolved/owned retained claims, absent
recorded groups/servers and free recorded ports. Those process/port observations
are probed again read-only; occupied identities refuse admission. The supervisor
never signals an old or foreign process or steals a lease.

A new spec causes one canonical-light-slot browser typecheck before any native
wave. Unchanged drivers reuse the original successful type prerequisite. Both
source digests, pins and the build digest are rechecked during scheduling and at
completion. New UUID outputs record original/candidate identities separately,
delta manifest hash, selected expected cases, excluded accepted cases, history,
resources/commands and settlement. Original evidence is never rewritten.

Limits: this is local reviewed-byte attestation, not a hostile-user trust boundary.
Coordinator review must provide complete history across different candidate
checkouts; automatic discovery covers only the current candidate output root.
Failed continuation history requires a separately reviewed cleanup protocol and
is deliberately refused by this bounded API. Consumer execution and full-checkpoint
aggregation are separate pending work. Node inert commands prove the admission
and reuse path, not live Playwright, a fresh build, or acceptance gates.
