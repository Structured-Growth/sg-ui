# Daily dfe9d8a raw artifact recovery

Decision: **HOLD original raw-artifact authentication**. This bounded retention search recovered **0 of 910** recorded raw-file references; all 910 remain missing. No native leaf, new pass, current matrix or full checkpoint closure is claimed. No raw receipt was reconstructed from a summary.

The search was observed at `2026-10-09T01:56:55.568758+00:00`. The historical execution head is `dfe9d8a67f7df4cb41c4ad6192115c60e7ba4f5c`. The report-only managed worktree is `/Users/thomashall/.codex/worktrees/daily-dfe9d8a-raw-recovery/sg-ui`. This work does not own continuation source/API changes.

## Evidence and retained source/build

The machine-readable [recovery inventory](/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/daily-dfe9d8a-raw-artifact-recovery.json) contains every original path and expected SHA256, individual shard availability, bounded searched roots, archive observations and rejected hash-only matches. Its SHA256 is `5e1897cca248ff9b08256249c88fbaf3c13d21387d036c3b66b163a8117f343f`.

The [original daily summary](/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/daily-checkpoint-dfe9d8a.json) and [historical independent review](/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/daily-checkpoint-dfe9d8a-independent-review.json) remain prior verification history. The 909 historical raw hash entries plus the separately pinned original raw manifest give 910 expected references: 901 real-run/retention references and 9 original checkpoint-fixture files. These counts exclude the immutable Storybook build. New continuation fixture archives are not original real checkpoint outcomes.

The [independent source/build recovery review](/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/daily-dfe9d8a-source-recovery-independent-review.json) establishes the separate recovered source prerequisite: 1,448 tracked files at the original head, source digest `f4ab7c120623d8fb464e28bf9e4998e0208d78388962830777021faca0be3c9c`. Its build digest is `0b6f83f0f727c1b93b6263235f35d8a86e4d9788cd9d96ca515f8e716c26b3aa`. This search observed 389 files and 7 subdirectories in the retained Storybook tree; the original artifact root contains only those build files. The build was neither copied nor modified. Source reconstruction does not authenticate missing execution receipts or silently relocate original identity.

## Missing continuation inputs

All paths below are relative to `/Users/thomashall/.codex/worktrees/daily-checkpoint-dfe9d8a/sg-ui/artifacts/daily-checkpoint-dfe9d8a` and are missing. The current read-only inspected `createContinuationManifest` / `prepareFrozenContinuation` API requires the original plan, daily checkpoint evidence, pool aggregate and settlement audit. The external daily summary embeds parsed checkpoint evidence but cannot replace the exact original `dailyPath` byte stream.

| Input | Original relative path | Recorded SHA256 |
| --- | --- | --- |
| planPath | `plan.json` | `59232bb0e46b9b377f60f159419f9b914cc77415c9b7c342b19645a9d6691dd5` |
| dailyPath | `checkpoint/992fc164-38c6-4e1c-a4d4-68f8ef491163/evidence.json` | `08e8ed821d1ba26df79e4c635d39f81d521de7db45351dfbbc61b76cc973acd0` |
| poolPath | `browser/e0e11c20-a019-4fad-ba50-44f008f4a6ff/evidence.json` | `35531706493aca4035ffef8724f0de9ea441c04a13a089c9e9c43b52f8139ea2` |
| auditPath | `settlement-audit.json` | `1af6d76d88e721d7a33d982f273ad11c5c8dcbfc92f01d8e8b1cf14bb7fa4b6f` |
| retention reference | `raw-sha256-manifest.json` | `d905636de34db768f406f8e5a661f54f44cf652f59405f277dc5a924b052688f` |
| retention reference | `cleanup-receipt.json` | `2fd1ef1d6a2595ee41806cf53f630f5bd887e0a07e9e62b2c2e917c66bb0eede` |

Successful original check, Storybook build and browser typecheck logs **and their resource receipts** are also missing; the inventory records their six exact paths/hashes. All available original shard receipt pins would additionally need authentication: evidence, results where actually recorded, resources and owner. Cancelled shards full-013 and full-016 have no results.json hash in the historical review; a result must not be invented. The raw manifest and cleanup receipt are separately missing retention references. Original-source relocation remains a separate explicit API prerequisite owned by the continuation worker/coordinator.

## Per-shard actual raw availability

Each recorded executed shard has zero authenticated raw files available. The table preserves historical disposition and case count without converting it into current proof. Missing file counts include traces/report assets where recorded.

| Shard | Historical disposition | Historical accepted cases | Recorded files missing | Available |
| --- | --- | ---: | ---: | ---: |
| full-001 | historically accepted | 3 | 7 | 0 |
| full-002 | historically accepted | 3 | 7 | 0 |
| full-003 | historically accepted | 3 | 7 | 0 |
| full-004 | historically accepted | 3 | 7 | 0 |
| full-005 | historically accepted | 45 | 16 | 0 |
| full-006 | historically accepted | 3 | 7 | 0 |
| full-007 | historically accepted | 9 | 10 | 0 |
| full-008 | historically accepted | 15 | 7 | 0 |
| full-009 | cancelled | 0 | 174 | 0 |
| full-010 | cancelled | 0 | 238 | 0 |
| full-011 | cancelled | 0 | 191 | 0 |
| full-012 | cancelled | 0 | 42 | 0 |
| full-013 | cancelled | 0 | 4 | 0 |
| full-014 | historically accepted | 6 | 7 | 0 |
| full-015 | cancelled | 0 | 150 | 0 |
| full-016 | cancelled | 0 | 4 | 0 |

The historical 9 accepted shards / 90 cases remain history; 7 cancelled shards remain pending. The inventory also preserves the 86 unrun shard IDs/specs and 5 unrun consumer stages (foundation React 18/19, editor React 18/19 and Next consumer). Unrun stages have no executed outcome to recover.

## Bounded search and retention limit

The JSON enumerates 981 selected roots: the coordinator evidence directory, 51 existing managed-worktree `sg-ui/artifacts` directories, the repository `artifacts` path and 928 clearly SGUI temporary entries. Temporary enumeration inspected only immediate names containing `sgui` or `dfe9d8a`, or both `sg` and `checkpoint`, under `/tmp`, `/private/tmp` and the recorded macOS temporary directory. Some roots alias the same storage; these are selected-root counts, not unique physical locations.

Within those authorized roots, 46,415 file paths were inventoried and 3,152 regular files with a recorded basename were fully SHA256-hashed. Symlinks, `.git` and `node_modules` were excluded. Continuation fixture archives/directories were excluded as original evidence. Exact hash equality required original run/path provenance as well: 3,744 hash-to-reference collisions (including empty logs and generic Playwright state) were rejected. This is a collision count, not a recovered-file count.

Checkpoint/dfe9d8a-named archive paths were inspected by member-name inventory: 79 recognized ZIP/TAR archives had no original `daily-checkpoint-dfe9d8a` members; 1 candidates were not recognized complete ZIP/TAR archives. No foreign archive extraction occurred. Arbitrary renamed files and unnamed archive contents were not blanket-scanned. There were no read errors recorded. The inventory cannot prove absence outside these bounded locations.

No recovery directory was created because no copy met both hash and provenance requirements. No actor, disappearance time, archive policy or cause is established. The concrete blocker is unavailable original raw bytes; the prior verification summaries are retained history. Further progress requires an identified exact retained original archive/copy or a separately reviewed change to the continuation evidence contract, not another unchanged probe.

## Validation and scope

Validation covers report/schema counts, exact input hashes, per-shard totals, links/paths, and the single documentation delta. No UI tests were needed or run. No install, build, browser/native, consumer, full matrix, process signal, API/source/state/backlog edit, push, merge or deletion occurred. All existing source, build, evidence and worktrees were preserved.
