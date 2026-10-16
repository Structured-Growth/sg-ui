# Fix 04 — A-A-19 dependency upgrade guidance

Date: 2026-10-16. Shared working `dev` base:
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`; this is documentation-only
working-tree evidence. Recommended disposition: **P07-A19-DOC complete and
A-A-19 complete**, subject to coordinator review/integration. No shared checklist,
ledger or acceptance counts were edited.

Original leaf: “Document package dependency placement, supported versions,
upgrade policy, and deduplication requirements for React Aria and date utilities.”
This closes that documentation obligation, not a performed dependency upgrade,
runtime matrix, operational security policy or production acceptance.

## Actual changes

Edited only `docs/developer/react-aria-dependency-upgrades.md` outside this report
directory. The guide now:

- Identifies `packages/ui/package.json` as authoritative for runtime/peer/dev/export
  contracts, keeps the root lockfile, and distinguishes the root forwarding/tooling
  manifest from the private docs manifest.
- States the exact runtime interaction/date pins (React Aria Components 1.21.1,
  React Aria 3.52.1, React Stately 3.50.0, @internationalized/date 3.12.4), React/DOM
  peer range `^18.3.1 || ^19.0.0`, local React/DOM dev inputs 19.2.3, dev-only
  CSS compilation, and docs/fixture-only Next/Flight placement. These match the
  retained manifest/lockfile combination; they are not upstream support/security
  or latest-version claims.
- Replaces active Storybook/stories instructions with website playgrounds and
  source-backed examples, colocated source-context fixtures and docs-owned native
  scenarios. Its only remaining Storybook mention explicitly records removal.
  Names root `build:browser-docs` then selected `test:browser`, direct-script cwd
  `packages/ui`, the static host/server, and separate production docs checks.
- Preserves shared build/fixture leases, serial packed fixtures, stable `dist`,
  and no rebuilding during native suites or attested snapshots. Links the current
  development validation policy and retains complete production/manual gates.
- Uses `dev` as the development base/integration branch. Retains human approval
  for major/minor production promotion, automated versioning, breaking-change
  review and no ordinary-upgrade authority to push/merge main, tag or publish.
- Defines coordinated compatible interaction/state/date upgrades, graph/peer-path
  review, compatible deduplication, date identity concerns, and the prohibition
  on forcing incompatible overrides. Distinguishes FA-02 name/version observations
  from physical-instance, peer-context or consumer singleton certification.
- Explains that consumers own their lockfiles, reproducible installation and
  affected host build/SSR/hydration/interaction validation. The workspace lockfile
  does not constrain every consumer graph. Host timezone/locale/reference dates,
  availability, authorization and persistence policies remain host-owned.

## Validation and reused evidence

`python3 docs/developer/final-acceptance/fix-04/validate.py` passed **55 bounded
checks**, including **19 local links** and heading anchors. The script verifies
exact interaction/date placement and importer lock resolutions, React peers/dev
inputs, CSS compilation and private docs placement, root command forwarding,
fixture/consumer paths, Playwright host/engines and CI runtime/cwd/host commands.
It checks that the root/library/docs manifests and lockfile match
retained FA-02/parallel-07 hashes. See [validation.json](validation.json) for the
exact inputs and check results. No installed dependency topology was rescanned.

`git diff --check -- docs/developer/react-aria-dependency-upgrades.md docs/developer/final-acceptance/fix-04`
passed. Final report metadata is parseable JSON and its touched-file hashes were
verified after writing. `results.json` records hashes for the guide, report,
validator, before-hash receipt and validation receipt; it intentionally excludes
its own recursive hash.

Reused [parallel-07](../parallel-07/report.md)'s identified P07-A19-DOC gap and
[input receipt](../parallel-07/input-receipt.json), plus the saved
[FA-02 inventory](../2026-10-16-source-inventory.json). No broad inventory, build,
install, dependency mutation, unit/browser/packed-consumer suite, registry/advisory
lookup or remote CI run was performed. Existing runtime evidence remains dated
and limited to its recorded inputs; this fix asserts no coverage of concurrently
changing picker/TextArea code, other library source or newly built outputs.
The validator initially found that parallel-07's selected input list omits the docs
manifest; it now uses FA-02 for that manifest and parallel-07 for its selected inputs.
That was a receipt lookup correction, not a product/configuration failure.

## Remaining requirements

A-L-09 owner/backup, cadence, confidential intake, urgency/escalation, backport/EOL
and disclosure decisions remain explicitly awaiting human decisions. This fix
supplies neither legal approval nor a security/SLA guarantee. Any actual upgrade
still requires its candidate graph/peer-path review, lockfile regeneration/frozen
installation, license/notice and release-impact review, affected tests and packed
consumer/native checks, and complete production validation before approved release.
Outstanding browser engines, physical devices, IME, spoken assistive technology,
manual/legal gates and the 20 editor V leaves remain separate requirements.
P07-CALENDAR-DOC belongs to the calendar documentation owner and is unchanged here.
No staging, commit, push, worktree, cleanup, version, release, server operation or
additional conversation/agent occurred in this fix.
