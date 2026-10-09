# Fresh focused proof against a retained snapshot

The source-recovery review authenticates the exact recovered `dfe9d8a` tree
(1448 tracked files) and the original immutable Storybook (389 files). It does
not recover the 910 missing original raw references. `runFrozenContinuation`
continues to require those originals and refuses their absence. This separate
API creates **new focused proof**, without asserting any old install, check,
typecheck, consumer or browser pass. Historical failed/canceled/unrun outcomes
remain unchanged. Follow the [development policy](../react-aria-development-validation.md)
and [pool policy](../react-aria-parallel-browser-validation.md).

`prepareRetainedSnapshotFreshProof(request)` in
`scripts/run-development-checkpoint.mjs` performs read-only authentication;
`runRetainedSnapshotFreshProof(request, poolOptions)` in
`scripts/browser-validation-pool.mjs` authenticates the same request and invokes
the shared production scheduler. Invoke from the reviewed candidate on Node 24:

```sh
node scripts/run-development-checkpoint.mjs fresh-proof /absolute/reviewed-config.json
```

The config permits exactly `request` and `poolOptions`. The latter permits
`queueFile`, `queueOwner`, `max`, `firstPort` and `budget`. Production uses the
canonical queue, bridge, four light slots and browser/port leases. `max` must be
at most eight; the exact budget is `{ "maxLoad1": 24,
"maxSystemRSSBytes": 29360128000 }`. Playwright retains one worker, zero retries
and isolated servers. Output is fixed to ignored
`artifacts/retained-snapshot-fresh-proof` in the candidate. No CLI dependency
seams, installation or Storybook build are admitted. Existing install helpers
remain capped at two; dependency installation is separate coordinator work.

The request is a coordinator-reviewed local attestation, not a signature or
hostile-user trust boundary. Its fields are:

- `retained`: exactly `recovery`, `independentReview`, `historicalReview`, each
  `{ path, sha256 }`. Use the durable `daily-dfe9d8a-source-recovery.json`, its
  independent review, and `daily-checkpoint-dfe9d8a-independent-review.json`.
  All must be exact regular files at canonical paths. Recovery and independent
  review identities, source/build digests, file inventories and report hash must
  agree. Every recovered source byte is checked against both its inventory and
  committed blob; complete tracked path sets, clean HEAD and immutable build
  bytes/counts are verified. Historical reviews provide exclusion evidence only.
- `candidate`: `{ worktree, head, sourceDigest }`, a separate clean committed
  checkout. Source deltas versus the retained tree must be complete and explicit.
- `deltas`: `{ path, kind, before, after }` with SHA256s and `before: null` for
  additions. Allowed kinds match the bounded continuation: three supervisor
  scripts, Markdown under docs, colocated/script/consumer tests, and new top-level
  browser specs. Production source, stories, existing browser specs, dependencies,
  lockfile and configs stay byte-identical. No deletion is allowed. Imported
  supervisors must equal candidate bytes. Evidence records hashes for all three
  scripts, Playwright/browser type configs and selected specs.
- `shards`: exact snapshot grammar with explicit specs/projects and optional
  bounded `grep`. Existing files must be listed as genuinely unrun in the pinned
  historical review. All historical started files, including green and canceled
  shards, are excluded conservatively. New specs require reviewed `new-spec`
  deltas and coordinator review that they do not repeat accepted behavior.
- `expectedCases`: complete map from shard ID to reviewed
  `{ file, id, project, title }` tuples. Every file/project pair must be covered;
  duplicate, filtered-out or prior accepted identities fail before admission.
  Actual successful result tuples must match exactly.
- `priorProofs`: explicit array of `{ path, sha256 }` aggregate receipts for all
  earlier successful fresh proofs. Their owner files, session evidence, result
  tuples, log hashes and settled command resource receipts are authenticated.
  Prior cases are excluded. Unknown output directories in this candidate and
  failed/unsettled history are refused. The coordinator must supply complete
  history across other checkouts; automatic discovery covers this candidate only.

The scheduler rechecks retained/candidate source bytes, immutable build and all
pins during execution and completion. It runs **one new browser typecheck** under
an owned light slot before admitting a native wave, even when the selected
specs existed previously. It serves the original build directly without copying,
chmod, rebuilding or changing its original source. Evidence has mode
`retained-snapshot-fresh-proof`, `freshProof`/`freshProofFinal` and separate fresh
command hashes; it is not a continuation or checkpoint aggregate. Owned-command
cancellation, detached-server tracking and lease retention on unresolved ownership
are inherited from the shared scheduler; foreign resources remain untouched.

This bounded contract supports new tests consuming existing frozen stories.
It does not admit fixture/config overlays or compile a modified Storybook.
If a required remaining-T case needs new stories, keep it unrun until a separately
reviewed test-only overlay contract authenticates that fixture build. Native
scope selection and execution belong to the coordinator after independent API
review. Worker Node fixtures use an inert executable and isolated resources;
they do not establish live browser, real typecheck, consumer, device or AT proof.
