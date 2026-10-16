# Fix 12 — bounded local-link repair for A-W-19

Status: **partial**. Reviewed shared modified `dev`, HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`, 2026-10-16.
Read root AGENTS.md, final-acceptance execution ledger, the original A-W-19
checklist row and wave-02-13 report/parser/evidence. No acceptance counts or
shared ledgers were changed.

Applied one concrete edit: `docs/github-setup.md:138` now links
`../packages/ui/release.config.mjs` instead of `../release.config.mjs`.
The original root target is absent; the new target is an existing regular file.
Only the Markdown URL changed. No command, API, release or license prose changed.
Root manifest references remain intact.

[link-mapping.json](link-mapping.json) saves the exact source/target resolution,
source before/after and target SHA-256 hashes, wave-evidence hash and every remaining
missing target with source line and disposition. [before.json](before.json) and
[after.json](after.json) save all 439 corpus input hashes and exact missing records.
[audit.py](audit.py) is the one-shot reproduction of the parser and applied mapping;
it intentionally asserts the original link before editing and should not be rerun
against the already-fixed document without adapting the application step.

The bounded audit uses wave-02-13's exact 439-file corpus and inline-link regex,
excluding fenced blocks. It reproduces all **119 original missing records**, with
zero additional missing records. Current corpus has 3,733 local inline links versus
wave-02-13's 3,721; existing intervening documentation edits account for the changed
corpus bytes. After this repair, **118 missing records remain**. Across the immediate
before/after hashes only `docs/github-setup.md` changed. This is path-existence
verification, not heading or Markdown rendering validation.

All remaining records are preserved: 110 in excluded parallel reports, seven in
dated acceptance snapshots and one in the excluded central progress ledger. The
seven dated snapshot findings are three retired stories in
`react-aria-inventory-contract-reconciliation.md`, three retired AppButton/story
paths in `react-aria-migration-inventory-acceptance.md`, and the former root release
config in `react-aria-release-gate-audit.md`. These documents explicitly bind their
claims to older exact baselines; changing their links would alter historical receipts.
No replacement is invented. The full exact paths, including excluded report links,
are machine-readable in `remaining_missing`. None of the specifically reserved
noncentral guide files has a missing inline target in this corpus; the central
`react-aria-progress.md` finding remains coordinator-owned. This does not certify
other forms of links in reserved documents.

Validation: direct source/target existence assertions passed; all immediate corpus
hashes compared; `git diff --check -- docs/github-setup.md docs/developer/final-acceptance/fix-12`
passed; the source diff contains one URL replacement. Existing wave receipts were
read rather than rerun. No install, server, build, unit/native/browser/consumer suite,
Git staging/commit/push, version/publication action, delegation or cross-thread
message occurred. No fresh remote CI, manual, legal, device or AT result is claimed.

Original obligation remains: “Check all local doc links, exported example types,
referenced file paths, and commands; docs-only updates do not require unrelated UI
tests.” This bounded change only progresses the eligible local path portion.

Successors for the coordinator:

- Retain/classify the exact 118 historical/excluded records against original source
  identities and approved fixture mappings; missing historical artifacts are not
  silently relabeled as current passes. Any explanatory companion mapping must
  preserve original receipt text and links.
- Validate heading anchors, reference-style and HTML links and inline source paths
  separately, including the reserved guides. No such coverage follows from this regex.
- Against the frozen freshly built package, compile displayed public snippets and
  resolve referenced commands/script cwd using the existing wave successor. Coordinate
  source/API/native evidence and final closure; do not repeat unrelated suites.

A-W-19 stays partial until the complete original requirement has evidence.
