# Batch 134: final acceptance evidence review

Assigned criteria: Z-08, Z-10, Z-12, Z-13, Z-15. Inspected 2026-10-07 at the
reviewed baseline `e43bf604be74e0daf731bc990e6c3097f05ed89b` (H below).
Managed isolated worktree: `/Users/thomashall/.codex/worktrees/batch-134-acceptance/sg-ui`.
Branch: `codex/batch-134-acceptance-evidence`. Only this report is changed.
The coordinator alone accepts criteria, edits canonical records and integrates.

**All five parent criteria remain partial.** Current source supports narrower
implementation/documentation claims, but no fresh final-head package/declaration
artifact or complete conversation/decision/release reconciliation was established.
This review does not repeat M-row inventory reviews 29/30/31 or the earlier removal
and public API audits. It identifies what their retained evidence can establish
at H, and what still prevents these distinct final criteria from closing.

## Per-ID evidence matrix

| Criterion | Supported at H | Evidence level and exact provenance | Remaining required gate / owner |
| --- | --- | --- | --- |
| Z-08 | The current manifest has only React/React DOM peers and no retired foundation dependencies. The checked-in package guard recursively scans emitted text including maps, compares packed dist bytes/exports/CSS metadata, and preserves README/license/notices. A fresh source search found only the five legal notice headings among the queried source/manifest/lock/README/legal paths. | Source inspection at H: package.json, lockfile, scripts/check-package.mjs, README and notices; Git blobs below. Historical packaging report names base `9f153642e827a14033d646cf0160730c0793bdfc`, implementation `6ec39e6`, Node 24.21.0 and 1,648 emitted files. It does not give a full tested-head hash for that working-tree run or retain its tarball in this worktree. | Coordinator must build and audit an actual frozen final-head tarball, retain its digest/file inventory and dependency graph, inspect README/notices and all asset formats, and reconcile Z-05/Z-06 legal/provenance requirements. Source configuration and a historical pass cannot establish released-byte identity or complete transitive installation state. |
| Z-10 | All 37 current component directories are registered in the strict owned source guard (no missing/extra directory). The guard follows relative dependencies from the root, primitives/icons, theme and presets. Current hook/preset/adapter source has owned contracts and corresponding migration guides. | Fresh read-only directory-set comparison at H, guard inspection and additional hook/preset/adapter source reads. This proves registration and the inspected API boundaries, not guard execution or acceptance of every exported helper. Existing M-row evidence remains with its original owners. | Coordinator must reconcile every current public symbol/helper and intentional removal against the immutable baseline and documented replacement/release impact. Especially preserve the M-10/M-14/M-30 intent decisions and existing feature/device/AT gates. No whole-component migration flag substitutes for acceptance. |
| Z-12 | Master section 20 records a 2026-10-05 conversation coverage review. Imported-principle mapping explicitly preserves grid/filter/modal/translation conventions while omitting application-only policy. Current validation policy preserves full production acceptance while permitting targeted dev checks. | Retained master and agent-guidance blobs at H; fresh comparison with component architecture and development policy. Original conversation corpus and learner-platform instruction file were not independently retrieved here. | Coordinator must compare actual conversation commitments with the final plan, record disputed-clause dispositions and reconcile the concrete validation-guidance conflict below. The retained 2026-10-05 review is documentation-delivery evidence, not a complete final conversation acceptance review. |
| Z-13 | Immutable baseline API snapshot, current consumer mappings, explicit export routes and breaking-marked migration commits are retained. Fresh source inspection resolves the old F-03 root-export finding: component barrel now exports AppDataGridViewState and root forwards it. | Source at H and reachable Git commit subjects; exact snapshot/barrel/release-policy blobs below. No emitted declaration or packed API fixture was generated or executed. Historical audit was at `d0fcc6298004ad23d1a75480b216b39142e6df96`, not H. | Coordinator must compare final emitted declarations against baseline and guides for every public change, validate packed imports, account for every breaking change and verify the actual production squash/release marking. A correctly marked aggregate dev commit does not prove the eventual main commit or complete per-symbol migration coverage. |
| Z-15 | Dependency choices and explicit feature limits exist in manifest/guides; reports retain exact historical heads, failures and engine limits. Master still leaves the assigned final criteria unchecked, and dev policy explicitly retains production/manual/device/AT requirements. | Fresh reads of master, package/feature/runtime/release reports at H; Git history supplies integration commits, not PR completion or accepted evidence. Historical release audit is at `d8342a1b76c2fffe986ecce22252c8282873dbf1`. | Coordinator must produce the final accepted evidence/decision/PR/deferred-work record at its frozen head, preserve every unchecked required item and explain approved deferrals without relabeling requirements optional. Live PR completion, artifact availability, owner release prerequisites and full matrix/manual acceptance were not reverified here. |

## Current-source findings and bounded handoffs

### Z-08: emitted guard coverage is narrower than final package/legal acceptance

[Package guard](../../../scripts/check-package.mjs) recursively rejects retired
filenames and text for js/mjs/cjs/ts/css/json/map/svg/html/txt/md output; source
maps are included. It compares every dist file's bytes with the extracted pack,
checks exported modules and owned declarations, and restricts packed top-level
entries. README, LICENSE and notices are checked for unchanged inclusion; this is
not a legal reconciliation or a retired-text scan of those three files. Binary
assets get the byte comparison, not semantic/provenance inspection. The packaged
manifest's exports and sideEffects are compared; a complete installed dependency
closure is a separate consumer/dependency check.

Fresh `rg` inspection of src, package.json, pnpm-lock.yaml, README, LICENSE and
THIRD_PARTY_NOTICES found five positive retired-package headings in notices:
Emotion react/styled and the former icons/material/grid packages. No hit appeared
in the other queried paths for that explicit search pattern. This is a narrow
source text result, not a fresh emitted/package audit; it does not supersede the
broader classified [removal audit](../react-aria-removal-audit.md).

[Packaging acceptance](../react-aria-package-acceptance.md) explicitly leaves
legal attribution and final tarball acceptance open. Preserve notices until their
associated source/assets are reviewed. No notice deletion or package/source fix
is authorized by this report. Next validation belongs in the coordinator's
serialized window: fresh build/package audit and relevant packed consumers at an
exact frozen head, retaining tarball SHA-256, file list, logs and dependency graph.
No additional native fixture would close this criterion.

### Z-10: additional source boundaries, without redoing M-row reviews

The fresh set comparison returned `37 actual / 37 registered; unregistered=[];
missing=[]`. Registration alone proves no directory omitted from the guard list.
The guard source explicitly audits the root export graph and AdminDataGridOptions /
InstructorDataGridOptions, and checks public declarations for hooks, adapters,
i18n and utils in the package guard. Neither guard was run here.

Read [hook contracts](../react-aria-pagination-state.md) alongside
usePersistentState, usePersistentPaginationModel and pure paginationModel:
owned model/options, explicit storage opt-in and client boundaries have documented
breaking defaults. Read both actual preset modules (they live directly under
src/components, not under AppDataGrid/presets): translated factories, canonical
status constants, first/action visibility locks and preserved Class-named exports
match [preset mappings](../react-aria-grid-presets.md). Read navigation, context,
accounts and SGLink: React/native contracts and host callbacks replace framework
and account-service dependencies; native navigation fallback is guarded for SSR.
[Adapter acceptance](../react-aria-host-adapter-acceptance.md) explicitly limits its
scope. i18n and due-date/build-column helper imports were inspected; this is not an
exhaustive new behavioral acceptance of those utilities.

[Existing inventory acceptance](../react-aria-migration-inventory-acceptance.md)
and [cell/helper acceptance](../react-aria-grid-cell-acceptance.md) remain retained
records. The next Z-10 task is a final symbol/disposition join against baseline,
not another M-02–M-37 behavioral inventory. Include experimental-only routes,
non-component helpers and deliberate removals; do not infer public exports from
filenames. Runtime requirements remain with their assigned acceptance owners.

### Z-12: one concrete incompatible rule and unresolved intent

[Component architecture](../component-architecture.md), Implementation and
validation, still says: “For code/build changes run `pnpm check` and
`pnpm build-storybook`”. The [development validation policy](../react-aria-development-validation.md)
and active AGENTS guidance explicitly say not to run the entire suite on every
task/dev integration, with Chromium-first provisional dev integration and later
multi-engine checkpoints. The latest authorized policy governs this assignment;
production full acceptance still applies. This is a documentation contradiction,
not evidence of missing product behavior.

Minimal exclusive follow-up allowlist, if coordinator assigns it:
`docs/developer/component-architecture.md` only, validation paragraph linked to
current policy. Targeted check: exact paragraph/policy comparison, local links and
`git diff --check`; no UI tests/builds. This report does not edit that file.

[Batch 75](../parallel-batch-75/inventory-contract-intent.md) preserves explicit
M-10 previous/next/link, M-14 menu/callback/date/icon and M-30 typeface attribution
questions at `39c2275b0f7a873a48eceb1c663ab0bd0016a7e7`. It does not establish an
owner disposition. No full original conversation corpus was audited in this
assignment, so “every conversation commitment” cannot be certified. Coordinator
must record the actual owner decisions and retain any additional approved
behavior as unmet work. No source allowlist is proposed without a specified
behavioral requirement.

### Z-13: source reconciliation updates an old finding, not its historical record

[Historical API reconciliation](../react-aria-public-api-reconciliation.md) lists
F-03 as omitted root/component reset-type export. At H, src/components/index.ts
line 69 explicitly reexports AppDataGridViewState; src/index.ts forwards the
component barrel, and granular grid index also exports it. The old finding is
resolved at the source-route level. Do not treat that old report's head as proof
of H's declarations or rewrite its historical provenance. The packed API fixture
currently imports the reset type from the granular route; packed root type
verification belongs to a subsequent coordinator validation window.

`git log HEAD --grep='!'` shows reachable major-marked migration commits,
including `51734ed691ac2b6c383b70c5152e32c1c22f33e5`,
`8f41479c6f2ea5822ff0c149e359e2c6e0893f13`,
`98b4f9ff7b2aa6ededd88dd5fe30ecde169320a2`,
`57abb6df848c424a39c7f4942ad25484926eee0e`,
`dd93c2c6bb1aff74f75267c9b826cfd49ae67822` and
`6bee8cf28e11a0d6a8b32780f5b673369f003dc1`.
Aggregate dev commit `bf2e412d8bc4893e55f5b16a7b12a919c0721053` has subject
`feat!: consolidate owned foundation migration on dev`. This supports retained
breaking intent. It does not certify all breaking changes, actual PR squash
messages, publication history or final semver inference. The [consumer guide](../../migration.md)
contains button/style/theme/grid/persistence/icon/editor/calendar mappings, but
only final declaration/snapshot reconciliation can establish completeness.
Do not alter the immutable historical snapshot.

### Z-15: retained evidence is historical and some local artifacts are absent

[Runtime record](../react-aria-runtime-ci.md) retains full tested head
`7f03a35108bbf861e9b123b646694f64b21bb369`, run 37560788949 and browser artifact
11456977272 with recorded expiration 2026-10-21 02:18:34 UTC. It explicitly says
later heads need their own result. It also records failures at later clipboard /
image-lifetime heads. None of these was downloaded or reverified here.
Historical run success, recorded artifact retention and current remote availability
are different evidence levels.

Read-only local existence checks found no dist, artifacts, test-results or
playwright-report in this fresh worktree. The packaging report's
`/tmp/sgui-packaging-check.log`, `/tmp/sgui-packaging-react18.log`, and runtime
`/tmp/sgui-ci-b63-browser` were also absent at inspection. This does not prove
remote artifacts are lost or that another worktree lacks them. It prevents this
review from certifying their actual bytes. No artifact was deleted or replaced.

Package acceptance retains E-08 editor dependency-separation and R-03/R-04 entry
boundary decisions: granular traversal is bounded, but basic installations still
include Lexical dependencies. Migration guidance explicitly defers true pinning,
expansion/editing/spreadsheet and advanced scheduling/recurrence/fiscal features;
these declarations do not close any unchecked required task. The [release audit](../react-aria-release-gate-audit.md)
records draft PRs/settings at its old head and cannot establish current completed
PRs or owner publication prerequisites. Final decisions/accepted tests/PR status
need coordinator reconciliation. Chromium-only slices, missing Firefox/WebKit,
physical devices, actual IME, spoken AT and host responsibility stay visible.

## Checks actually performed

- Created/attached isolated managed worktree from exact H before edits; initial
  status was clean. Read README, migration, component architecture and the assigned
  master rows; inspected source/guards/guides/history listed above.
- Ran read-only `rg` searches/file inventories, explicit source reads,
  `git log HEAD`, `git show` and `git rev-parse HEAD:<path>`. Compared directory
  names against the guard's registered list using a small read-only Python script.
- Checked named local artifact paths for existence only. No remote Actions/PR
  status, artifact contents or publishing state was reverified.
- Two exploratory path guesses (singular foundation/baseline script names and
  AppDataGrid/preset/helper locations) were absent. Resolved actual tracked guard
  and preset paths before drawing conclusions; missing guessed names are not
  product findings. No acceptance assertion or check was skipped as a pass.
- Verified this report's relative local Markdown links, blob identities, changed
  path allowlist and whitespace before commit (results recorded below).

No install, test, build, pack, browser, performance, global lease, CI command or
workflow dispatch was run. No optional browser spec was added: no actual missing
native behavior was established by these final evidence criteria. All runtime
validation requests above are **UNRUN in batch 134** and require the coordinator's
serialized window. No production/source/config/master/ledger/other report,
primary image-upload worktree, license or notice was changed.

## Exact retained Git blobs

All identities below were read with `git rev-parse H:<path>`. These identify
source/report bytes, not executed test artifacts. Links resolve in the repository.

| Path | Git blob at H |
| --- | --- |
| [docs/developer/react-aria-master-task-list.md](../../../docs/developer/react-aria-master-task-list.md) | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| [scripts/check-package.mjs](../../../scripts/check-package.mjs) | `744f86595899989d90edc6cf590a757534c58f17` |
| [scripts/check-foundations.mjs](../../../scripts/check-foundations.mjs) | `ecc96a852355231cc7845642c589980825a6356d` |
| [package.json](../../../package.json) | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| [pnpm-lock.yaml](../../../pnpm-lock.yaml) | `d312a82ec958b0badc4633899ec4510cbb655648` |
| [README.md](../../../README.md) | `0af615ed0dc6984d08b57aed8eea8ecb8ddce9a4` |
| [THIRD_PARTY_NOTICES.md](../../../THIRD_PARTY_NOTICES.md) | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |
| [LICENSE](../../../LICENSE) | `9dbc843502f2b1e8f74ed4c4940c471e7cca8acd` |
| [docs/developer/react-aria-removal-audit.md](../../../docs/developer/react-aria-removal-audit.md) | `0fcffdabebd08a1531bb8a16510a967157921482` |
| [docs/developer/react-aria-package-acceptance.md](../../../docs/developer/react-aria-package-acceptance.md) | `7cf0740449017e0e1bb8d9c9450b51de154076e1` |
| [docs/developer/parallel-batch-01/packaging.md](../../../docs/developer/parallel-batch-01/packaging.md) | `d70b458523df2351d5cab246b40466cd2acc9676` |
| [docs/developer/migration-baseline/public-api.json](../../../docs/developer/migration-baseline/public-api.json) | `26d82ff5765f1c667bc025e88ac107cc6f44ad99` |
| [docs/developer/react-aria-public-api-reconciliation.md](../../../docs/developer/react-aria-public-api-reconciliation.md) | `98165e3f545ddc7a3d08a5f0301ac8b0814d56b1` |
| [docs/migration.md](../../../docs/migration.md) | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| [docs/agent-guidance-migration.md](../../../docs/agent-guidance-migration.md) | `cb414d84c958ee0096c5754245421ff593e2f5c9` |
| [docs/developer/react-aria-development-validation.md](../../../docs/developer/react-aria-development-validation.md) | `93e7f6612b6b315f452636277d7140f318177a6d` |
| [docs/developer/component-architecture.md](../../../docs/developer/component-architecture.md) | `802b8086c11e2c28460596214775653f75ac886d` |
| [docs/developer/parallel-batch-75/inventory-contract-intent.md](../../../docs/developer/parallel-batch-75/inventory-contract-intent.md) | `29465cd9d957a237ce4d0dcf688ed8ce252df1ca` |
| [docs/developer/react-aria-release-gate-audit.md](../../../docs/developer/react-aria-release-gate-audit.md) | `b4cf9351ad301ba401eddc38446f257f286eebf7` |
| [docs/developer/react-aria-runtime-ci.md](../../../docs/developer/react-aria-runtime-ci.md) | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| [release.config.mjs](../../../release.config.mjs) | `ee46e0de3e7545768032184650f0e1cc97f2c006` |
| [scripts/release-policy.test.mjs](../../../scripts/release-policy.test.mjs) | `b1b6c0dfe4661475033d30ba968f4972484bdaf9` |
| [src/index.ts](../../../src/index.ts) | `4b0ea0e0ad7845f2a34e1820a490aa4b6986411f` |
| [src/components/index.ts](../../../src/components/index.ts) | `fd4f424ed4cb0a8ee3b7da1f70ccc3e06ec42122` |
| [src/components/AppDataGrid/index.ts](../../../src/components/AppDataGrid/index.ts) | `4d8134908caeb409dd64d3e3935125197ad2ad18` |
| [src/hooks/index.ts](../../../src/hooks/index.ts) | `924add6d71b1f6808316d91c3b19c27a71a0ea8f` |
| [src/hooks/paginationModel.ts](../../../src/hooks/paginationModel.ts) | `a930a0b0a2600b5dedc963a1717d79c8821296d7` |
| [src/hooks/usePersistentState.ts](../../../src/hooks/usePersistentState.ts) | `af48e9db8a583efbbe08fd290ef5a9d7eb8b8335` |
| [src/hooks/usePersistentPaginationModel.ts](../../../src/hooks/usePersistentPaginationModel.ts) | `bedcdea5d9b8ac2cc8ff35b310570057a9a1bb16` |
| [src/adapters/index.ts](../../../src/adapters/index.ts) | `422639cc475322b63cfcc62bd4561deec463007d` |
| [src/adapters/navigation.tsx](../../../src/adapters/navigation.tsx) | `e18b09cd0755f37192e8a91af6f961a62189e2c0` |
| [src/adapters/accounts.tsx](../../../src/adapters/accounts.tsx) | `205182f0161946cca99c8022a0c4c09543c4cef5` |
| [src/adapters/Link.tsx](../../../src/adapters/Link.tsx) | `d5ed5662009771f4283760af377191d9c7a1da71` |
| [src/components/AdminDataGridOptions.ts](../../../src/components/AdminDataGridOptions.ts) | `2149e949bb429adb23281748490efa29979a76da` |
| [src/components/InstructorDataGridOptions.ts](../../../src/components/InstructorDataGridOptions.ts) | `6289bbe308424625e079db723ffd440176736691` |
| [src/i18n/index.tsx](../../../src/i18n/index.tsx) | `3995019deab2fe0b5c1082320c06c73802a47ffb` |
| [src/utils/formatDueDateLabel.ts](../../../src/utils/formatDueDateLabel.ts) | `dfce16aa6abbed4fa0ea74f0257805b8a1b53431` |
| [src/components/DataToolbar/buildColumnOptions.ts](../../../src/components/DataToolbar/buildColumnOptions.ts) | `cfc11203c9fc6e4645a5ce9e4e2c4554cea5ae4d` |

## Report validation result

Read-only verification passed: 53 local Markdown links resolve and all 38 listed
Git blob IDs match H. The staged changed-path check is restricted to this report;
`git diff --cached --check` passed. No executable acceptance check was run.
