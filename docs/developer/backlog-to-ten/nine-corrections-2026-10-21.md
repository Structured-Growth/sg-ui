# Nine corrective subtasks — 2026-10-21

The user requested nine easy corrections, followed by tests of the complete
batch. These are nine completed, bounded children of existing backlog entries.
They are not nine closed original acceptance gates. The active parent count
remains **19**; no manual review, rights decision, hosting choice, live default-token
run or production approval is inferred. Source is the uncommitted working tree
based on `98c678d6`, including the preceding CI browser-setup and menu-adoption work.

| Completed leaf | Correction | Source and focused evidence |
| --- | --- | --- |
| A-Z-15-a | Repair all nine broken maintained-documentation references as one task. Correct two moved ledger URLs; identify five unavailable underlying artifacts without inventing replacement evidence. | [Availability and recorded identities](../evidence-availability.md); document-link fixtures and full maintained-documentation audit. The three references to the missing commitment report are one shared evidence problem, not three tasks. |
| A-R-12-b | Reject downloaded Node 24 CI evidence when packed-consumer browser provisioning was missing, skipped or failed. | `packages/ui/scripts/verify-ci-downloads.mjs` and its Node 24 fixture/mutations. |
| A-R-21-a | Reject proposal symlinks, gitlinks and executable files at both capture and fresh validation, allowing ordinary file changes/deletions. | `.github/workflows/ai-code.yml`, `ai-component-scope.test.mjs`, and CI enforcement mutations. Git raw metadata is checked without executing the proposed files. |
| A-R-23-a | Fail structural validation if the returned draft-head output or required SHA/PR identity check is missing, skipped or unrelated. | `check-ci-release-enforcement.mjs` and six identity/output mutations. Existing real default-token draft evidence remains pending. |
| A-L-01-a | Report empty/whitespace-only installed legal files even when a sibling NOTICE exists. | `check-license-inventory.mjs` and the empty-license fixture; legal bytes and hashes are retained. |
| A-L-04-a | Report duplicate exact notice headings while retaining both attribution sections. | `check-license-inventory.mjs` and duplicate-identity fixture. No automatic notice deletion or legal equivalence judgment. |
| A-Z-06-a | Prevent a documented installed package instance from masking another instance with no legal evidence. | `check-packed-license-evidence.py` and its two-instance fixture. |
| DOCS-005-l-a | Add a build-time audit of active dependency/lock/CI/source references and fixture manifest/registry consistency, preserving historical story identities. | `check-docs-host.mjs`, its positive/negative fixtures and the new docs `host:check` build prerequisite. |
| DOCS-007-a | Preserve available routes when switching documentation versions; fall back to the selected release overview for absent routes, with an accessible notice and generated route manifest. | `documentation-versioning.mjs`, `DocsShell.tsx`, `generate-documentation-routes.mjs`, three unit cases and two production Chromium cases. Hosting and immutable deployment remain pending. |

## Combined validation

All production corrections were in place before the combined batch tests. The
fallback notice was refined to subscribe to query-only navigation through a
Suspense boundary; a fresh final build includes that refinement. The final
browser case verifies that clicking Overview on the same pathname clears the
notice, as well as subsequent navigation to Installation.

From the repository root:

```sh
node --test packages/ui/scripts/check-document-links.test.mjs packages/ui/scripts/check-maintained-documentation.test.mjs packages/ui/scripts/check-license-inventory.test.mjs packages/ui/scripts/ai-component-scope.test.mjs packages/ui/scripts/check-ci-release-enforcement.test.mjs packages/ui/scripts/verify-ci-downloads.test.mjs packages/ui/scripts/check-docs-host.test.mjs apps/docs/scripts/documentation-versioning.test.mjs
python3 packages/ui/scripts/check-packed-license-evidence.test.py
node packages/ui/scripts/check-docs-host.mjs
pnpm build:docs
pnpm --filter @structured-growth/docs exec playwright test tests/documentation-versioning.spec.ts tests/grouped-navigation.spec.ts tests/dropdown-sizing.spec.ts --grep 'missing versioned|built route|sidebar|unlabelled visual search|Structured Growth|compact application|website compact'
```

Results: **69 JavaScript tests, six Python tests and nine Chromium browser cases
pass**. The fresh library/docs production build, docs typechecking, theme/API
checks and catalog checks pass: 98 pages, 209 public names and 173 isolated
example owners. The exported route manifest contains 104 canonical routes.
The final source audit covers 1,106 files, 123 mapped modules and 513 registered
scenario IDs, with no defined findings. This checks registry consistency, not
every scenario's behavior or original assertion preservation.

The document audit's original nine broken references are corrected. A full audit
also explicitly includes new, still-untracked Markdown files; the normal CLI
discovers tracked Markdown only. Recorded digests for all five unavailable
artifacts match their surviving manifest/reconciliation records. Missing raw
reports remain missing; surviving hashes/reviews are not substituted for raw
execution evidence.

The current license inventory covers 585 locked packages and still reports
108 findings, including missing legal-file/provenance evidence for
`client-only@0.0.1`. The new empty-file and duplicate-heading checks add no
findings on the current installation. Fixture passes are not license approval,
and no commercial terms or third-party notice text changed.

Local runtime: Node 26.5.0 and pinned pnpm 10.29.3. Production builds/browser
checks held the shared validation leases and did not rebuild during a suite.
These targeted results do not establish the supported Node 22/24 matrix,
Firefox/WebKit, physical-device or spoken-AT acceptance, an authenticated live
AI workflow, or an official exact-head Actions artifact packet. No deployment,
publication, main promotion, setting change or external message was performed.

## Remaining parent work

The original parent descriptions in the [unified backlog](../backlog.md) retain
their scope. In particular, DOCS-007 needs a confirmed host, immutable URL policy,
actual release deployment and host-level fallback validation; DOCS-005-l and
A-R-12 need the full exact-head production/artifact matrix. License parents need
the remaining provenance/rights/notices review, and A-R-21/23 need actual trusted
execution evidence. A-Z-15 still needs complete acceptance reconciliation.
