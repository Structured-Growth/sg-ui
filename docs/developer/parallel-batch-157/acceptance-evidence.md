# Batch 157: W-19 bounded local document-link audit

Coordinator owns acceptance and integration. W-19 remains partial: this batch adds
repeatable local link checking, not all-document example, command, prose/backtick
path, remote destination or exported-type acceptance. No master checkbox changes.

## Scope and identity

Baseline: `e53b6e20f4a6dd56e27ab0402923f3b5f9024fc3` (`codex/dev` requested base).
Exact tested implementation head: `d6319b050fd6b43f0f7b1248c468d79f7a22f204`.
Isolated managed checkout:
`/Users/thomashall/.codex/worktrees/w19-document-links/sg-ui`.
Validation date: 2026-10-07 (America/Chicago).
This report is committed after the tested implementation; its own links receive a
separate focused audit. No runtime/UI behavior acceptance is implied.

Read [batch 132's actual gaps](../parallel-batch-132/acceptance-evidence.md) before
implementation. Its eight anchor mismatches and missing temporary JSON artifact
are reproduced below. Only the two new scripts and this report are changed.
Other reports, master documentation, dependencies, configuration and workflows
are untouched. No installation, build, browser, integration, push, publishing,
branch deletion or global configuration command ran.

| File at tested implementation head | Git blob | SHA-256 |
| --- | --- | --- |
| `scripts/check-document-links.mjs` | `0a4a1e162bb59e5fd2ced4e2c1c328caecb094d5` | `5a1f9ec0e2932d847970901e007117d7e0d906b02931524b5fd3f4fe92493a6d` |
| `scripts/check-document-links.test.mjs` | `7a8416467b4f60e5dae0db903e76fce394135d73` | `a8bea3f01e5639497d754596d3d7d74beb9f4a3242b7e2d175931f2fb69c9143` |

## Implemented bounded contract

[Checker](../../../scripts/check-document-links.mjs) uses Node built-ins only and
reads local files without rewriting them. By default `git ls-files -z` selects
tracked `.md`, `.markdown` and `.MD` documents. Explicit files and `--root` allow
focused audits; `--json` provides machine-readable findings. Every finding reports
one-based source line and column at the opening link/definition bracket. Definition
and reference usage findings are separate locations; unused definitions are checked.

It handles inline/image destinations, balanced nested parentheses, escaped
punctuation/brackets, angle destinations with spaces, optional titles, forward
full/collapsed/shortcut references with normalized labels, relative/absolute paths,
percent-encoded destinations, same-file fragments, ATX/setext heading anchors,
duplicate GitHub-style suffixes and HTML `id`/`name` anchors. Code fences, indented
code, matched inline code and HTML comments are excluded. Schemes (including
`file:`, `app:`, `data:` and mail links) and protocol-relative destinations are
excluded rather than fetched. Undefined explicit references, invalid percent
encoding, absent local paths and unresolved Markdown fragments are document defects.

Missing explicitly absolute temporary paths (`/tmp`, `/private/tmp`,
`/var/folders`, managed `.codex/worktrees`) are `temporary-artifact` findings.
Missing JSON/log/binary/media artifacts referenced from `parallel-batch-N` reports
are `historical-artifact` findings. These classifications are documented heuristics,
not proof of historical artifact contents or assertion validity. A relative missing
document remains a defect even when its checkout resides under `/tmp`. Retention
findings do not cause a failure exit or mark historical UI behavior failed.

Exit 0 means no document defects (retention findings may remain), exit 1 means
local document defects, and exit 2 means the audit could not complete.

This is a bounded parser, not a complete CommonMark/GitHub renderer. Complex block
nesting, multiline reference titles, all possible heading inline markup, MDX,
raw HTML `href`/`src`, autolinks and fragments on non-Markdown targets are outside
its claimed validation. Local slug derivation is not rendered GitHub verification.
Prose/backtick paths, shell semantics, commands, compiler examples, public example
types, remote URLs and artifact bytes remain open under broader W-19 acceptance.

## Validation and findings

Runtime: existing bundled Node `v24.19.0` at
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.
Used `acquireLightSlot('batch157-w19-exact-head')` and released its owned lease in
`finally`; no other worker leases or global state were changed.

- `node --test scripts/check-document-links.test.mjs`: **10/10 passed**, exit 0,
  at the exact implementation head above. Fixtures cover escaped/nested links,
  references and duplicate definitions, code/comment exclusion, heading duplicates,
  HTML anchors, CRLF locations, encoded paths, missing anchors/paths/references,
  external schemes, retention separation, read-only source preservation, CLI exit
  codes and Git-tracked default discovery excluding untracked files.
- `node scripts/check-document-links.mjs`: **260 tracked documents, 1,746 local
  destinations, 260 external destinations excluded; eight document defects and
  one retention finding**, exit 1. This expected nonzero result remains a real
  unresolved document-link finding; assertions were not weakened and findings
  were not repaired outside this worker's allowlist.
- `git diff --check`: passed before implementation commit; focused report check
  also required before the final report commit.

| Source location (line:column) | Finding |
| --- | --- |
| `docs/developer/react-aria-master-task-list.md:343:187` | M-21 missing reconciliation fragment |
| `docs/developer/react-aria-master-task-list.md:344:167` | M-13 missing reconciliation fragment |
| `docs/developer/react-aria-master-task-list.md:348:132` | M-06 missing reconciliation fragment |
| `docs/developer/react-aria-master-task-list.md:349:161` | M-19 missing reconciliation fragment |
| `docs/developer/react-aria-migration-inventory-acceptance.md:39:180` | M-06 missing same-file reconciliation fragment |
| `docs/developer/react-aria-migration-inventory-acceptance.md:46:267` | M-13 missing same-file reconciliation fragment |
| `docs/developer/react-aria-migration-inventory-acceptance.md:52:250` | M-19 missing same-file reconciliation fragment |
| `docs/developer/react-aria-migration-inventory-acceptance.md:54:314` | M-21 missing same-file reconciliation fragment |
| `docs/developer/parallel-batch-41/learner-card-native.md:68:3` | Temporary retention: absent `/tmp/sgui-batch45-candidate-source-attribution.json` |

Each requested fragment is `m-NN-criterion-reconciliation-2026-10-07`; current
heading derivation produces `m-NN-criterion-reconciliation--2026-10-07` because
removing the em dash leaves adjacent spaces. Root may repair those links or add
stable IDs under its separately owned scope. Missing temporary JSON is retained
artifact loss, not a failed behavior result. No missing historical bytes are
invented. Broader W-19 and G/K/E/U/X/R/Z acceptance remain open.
