# Wave 03 / 40 — commitments and completion gates

All four assigned leaves remain **partial**: A-Z-11, A-Z-12, A-Z-15 and A-Z-16.
This delivers a concrete proposed ledger patch, a complete original-ID ownership
join, an unmet commitment/gate map and a tested completion guard. No acceptance
closure or central count change is proposed. Starting count remains 153 A,
20 editor V and six future leaves. Production/source files were not edited.

## Evidence and substantive reconciliation

Read AGENTS.md, final-acceptance execution, assignment/prior report/results and
coordinator integration evidence first. Current shared dirty dev base is
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. HEAD alone does not identify this
working tree. [evidence.json](evidence.json) captures time, Python runtime and
selected inspected source/declaration/guidance SHA-256 hashes.

The prior wave-02-14 report/results match all expected assignment hashes.
Compared every hash group in the coordinator integration receipt: **112/112
recorded inputs, 1,778/1,778 library outputs, 292/292 private fixture outputs,
15/15 receipt files unchanged**, zero missing. This supports retaining their
original bounded results; it is not a new full dependency-input inventory or
runtime execution. The receipt's selected inputs do not cover every unrelated
source. Prior stale-output warnings are superseded for the integrated five fixes;
no request to refix BUG-0008–0012 or reopen A-G-02/A-K-16 is made.

[recorded-calendar-search-commitments.json](recorded-calendar-search-commitments.json)
preserves 26 CAL-/SEARCH-STANDARD execution sections, exact text, starting line and
section hash. They are repository records of commitments/delivery, not original
human transcripts or new validation. [commitment-gate-map.json](commitment-gate-map.json)
joins them and editor/architecture/release commitments to shipped APIs, named
original acceptance leaves, owner numbers and concrete missing proof:

- Calendar: owned ISO/civil/time values, referenceDate and explicit timezone/DST;
  text versus segment/datetime grammar; range Apply/Cancel/reset/host authority;
  presets, periods/comparison, layout and gestures. Integrated availability/reason
  fixes remain accepted within their scopes. Full paste/autofill/locale/calendar,
  real zoom/touch and spoken AT evidence remain distinct. Period/comparison APIs
  do not select recurrence, resource scheduling or booking persistence.
- Search: public SearchField options actually expose controlled/default query,
  host-filtered and standalone modes, result selection/submit/retry and native
  links. CatalogNavigation/CatalogIndex import it publicly. DataToolbar still
  uses its separate TextField search contract; no claim of all-search replacement
  is supported. SEARCH-STANDARD records three baseline cases and fourteen
  production Chromium cases; that execution record alone does not supply a new
  current engine/device/AT matrix or complete receipt input closure.
- Editor: shipped PageRichTextEditorSection uses lexicalValue/onLexicalChange,
  editorKey, configurable controls, readOnly and an optional host upload promise.
  Host persistence, network cancellation, data authorization and returned assets
  remain host responsibilities. Owners 23–26 handle exact editor successors;
  all twenty editor light/dark/density/narrow-content and translated/RTL V leaves
  are retained individually in the ownership artifact. A passing AST/DOM/native
  subset does not close those visual/language reviews.
- Principles: owned public contracts/tokens/styles, React Aria internal,
  TanStack processing, host adapters/i18n, scope/styles loading and Button/onPress
  are current direction. The old validation-policy contradiction was already
  repaired. M10 previous/next/link intent, M14 card actions/fallbacks and M30
  typeface attribution still need actual owner dispositions through owners
  16/22/24; do not remove clauses or invent new APIs to force closure.

[ownership-map.json](ownership-map.json) references **all other 39 assignments**
without taking their scopes. It verifies that the 40 assignments cover each of
153 original open A leaves exactly once, retaining original statements. Twenty
editor V statements are mapped to related acceptance owners, explicitly as
additional required V evidence rather than new assignment authority. Six future
IDs stay exactly FUT-A-20, FUT-D-21, FUT-G-24 and FUT-K-13/14/15. No required leaf
is reclassified as future. Peer report completion is intentionally not inferred
from dispatch or mutable progress while this wave runs.

## Per-leaf disposition

| Leaf | Result | Concrete residual successor |
| --- | --- | --- |
| A-Z-11 | Partial: retain unchanged integrated build/type/package/docs/focused-browser evidence and original failures. | Owners 8–15,17–19,23–32,36,39 join missing exact-candidate runtime/operator/visual/SSR/performance/support results. All twenty editor V remain required. Configured CI is not an execution. Storybook is replaced by the approved docs/native host, with original assertions retained. |
| A-Z-12 | Partial: repository-recorded calendar/search/editor/principle commitments mapped to shipped source and remaining leaves. | Coordinator supplies complete actual human commitment/approval coverage and owner decisions, especially M10/M14/M30. Repository execution prose cannot establish exhaustive conversation coverage. |
| A-Z-15 | Partial: all original remaining requirements/owners, explicit future scope and bounded accepted receipts joined. | Reconcile actual integrated peer results/patches, final dependency/feature decisions and actual completed PR/commit/run identities. Dirty dev work is not a completed PR. |
| A-Z-16 | Partial/open: completion guard is false for this snapshot. | All required A/editor V, commitment/decision, production evidence, legal/owner and explicit human release gates must be satisfied. No migration-complete or publishing claim. |

Original full checklist statements, per-leaf evidence/commands/runtime/limits and
successors are retained in [results.json](results.json).

## Reviewable patch and validation

[ledger-update.patch](ledger-update.patch) appends the concrete proposed
[ledger section](proposed-ledger-section.md) to final acceptance execution. It
keeps the four leaves open, records unchanged integration evidence, explains
calendar/search/editor boundaries and names final gates. **Not applied.** Review
and rebase it after coordinator integrations; do not overwrite concurrent count
updates. No runtime fix patch is needed for this synthesis assignment.

[gates.py](gates.py) is a local coordinator aid, not a production workflow or an
authoritative ledger engine. It refuses completion when A/V evidence is empty,
partial, blocked or patch-only, or any explicit commitment, decision/PR,
production, legal/owner or human-release gate is absent. Its positive synthetic
fixture only tests the predicate; it does not assert any real approval exists.

Executed from repository root:

```sh
python3 docs/developer/final-acceptance/wave-03-40/reconcile.py
python3 docs/developer/final-acceptance/wave-03-40/finalize.py
python3 -m unittest discover -s docs/developer/final-acceptance/wave-03-40 -p test_reconciliation.py -v
```

Three meaningful reconciliation/guard tests pass; [validation.txt](validation.txt)
retains their output. They are source/evidence integrity tests, not library
behavior, native accessibility or release checks. Reconcile/finalize write only
this owner's directory. No shared installs/builds/catalog generation, server,
product unit suite/browser run, git mutation, settings action, messaging,
subagent, release/version/tag/publish operation occurred.

One read-only shell probe included an unmatched `*Search*` zsh glob and exited
with `no matches found`; corrected with `rg` over existing directories, which
located CatalogNavigation/CatalogIndex. This was not a failed product check.
No failure evidence was relabeled green.

[validation-plan.json](validation-plan.json) gives coordinator commands,
preconditions and expected assertions for the remaining calendar/search/editor/
consumer/operator gates. Reuse unchanged results and run changed or missing
scopes only under coordinator ownership. Legal/administrative/human approval
requires actual external owner evidence; a command or local test cannot supply it.

Read-only `git apply --check` passed for the proposed ledger patch at capture;
this does not apply it or validate concurrent future integrations.
