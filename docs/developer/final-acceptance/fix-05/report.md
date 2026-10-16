# Fix 05 — A-B-12 extraction continuity metadata

Implemented in shared modified `dev`, local HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, 2026-10-16. Only `docs/extraction-manifest.json` and this receipt directory were written. Shared acceptance counts/checklists remain coordinator-owned.

The named successor **A-B-12 / stale current presence and replacement-path metadata** is complete. The full A-B-12 leaf remains **partial**, with the specific story-lineage successor below explicit. No missing original file was classified as accidental runtime loss.

## Changes and validation

Reused `parallel-15/report.md` and `manifest-audit.json`, then repaired exactly their 36 stale rows: 32 removed stories now point to their exact docs-native migration-manifest fixture paths; three AppButton source/test/barrel rows describe the intentional Button rename; the AppButton story records related current examples with an explicit evidence limit. The original test replacement is `Button.public-contract.test.tsx`, established by exact local assertion continuity, rather than the audit's basename-only `Button.test.tsx` candidate. `presenceScope` now explains that historical `src/` destinations resolve under `packages/ui` and that replacement-host presence does not prove behavior equivalence.

All 201 original rows preserve source and destination strings, order, original repository, source commit and source root. All current flags match disk: **159 present, 42 absent, zero mismatches**. All **53 replacement references / 52 distinct files** exist, including replacements in the six previously recorded migrations. `changes.json` enumerates every edited row; `validation.json` retains every presence check, replacement hash and scoped input hash.

Executed `python3 docs/developer/final-acceptance/fix-05/repair.py` and bounded local Git reads. The script checks provenance, exact original row identity, path existence and hashes; it refuses an unexpected manifest state. No installation, build, unit suite, browser suite, consumer run or server operation occurred. Existing FA-01–04 and parallel-15 evidence remains dated evidence; no pass totals are restated as fresh execution.

## Button lineage finding

Local extraction commit `21adebd61bedfc6a1ed395fe664ff4be83896821` has `Default` and `Variants` stories. Owned-button migration commit `8f41479c6f2ea5822ff0c149e359e2c6e0893f13` adds `PendingAndDisabled` and `NativeForm`; the same story blob survives immediately before workspace/docs migration `530bbc00465d9dbf1e9948f8a2c01b2e51b1a479`. None of these inspected story versions contains `play`, `expect` or `assert` execution. These are example renderings, so an invented assertion migration is inappropriate.

The pre-workspace AppButton unit suite is byte-identical to current `packages/ui/src/components/Button/Button.public-contract.test.tsx` after substituting `AppButton` with `Button`. This proves local assertion continuity for pointer/Enter/Space activation and native ref/default type, disabled/pending suppression and pending focus, explicit native submit behavior, and server attributes/slots. It does not represent a new test run. Commit `540f47d` explicitly records the breaking removal of AppButton/AppButtonProps.

The docs-native manifest maps `packages/ui/src/experimental/Button/Button.stories.tsx` to the current Button fixture; it has **no exact AppButton story entry**. The current fixture's themes/density/pending/disabled examples and native form transitions, plus catalog examples, are proposed successors described individually in `button-lineage.json`. Their labels/event output differ. This receipt makes no assertion that the experimental story mapping establishes AppButton story provenance.

## Remaining requirements

**A-B-12/story-lineage:** attach original-platform evidence bound to source commit `8e63f1e16fc3d43d851908b312603a1099ca13d9`, or explicitly reconcile and accept the proposed AppButton story mappings in the separately owned migration metadata. That original-platform commit object is unavailable in this local SGUI repository. Local Git extraction history cannot independently prove its contents or original reference behavior. The migration manifest and original snapshots were left unchanged.

A-B-14 source/reference provenance, current behavior tests and browser/engine gates, physical-device and spoken-AT evidence, legal approval and production/release requirements remain separate. No remote CI, legal approval, full acceptance closure or production readiness is claimed. No staging, commit, push, worktree, version, tag or release action occurred.
