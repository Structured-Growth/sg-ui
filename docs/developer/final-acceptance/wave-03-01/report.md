# Wave 03-01 — public defaults, contracts and breaking mappings

Delivered reviewable documentation changes and a checked consumer fixture for
A-B-05, A-A-08 and A-Z-13. **All three remain partial.** No checklist/count changes
or acceptance closure are proposed. Starting scope remains 153 A / 20 V / six
future leaves. Only this directory was written; the five-file patch is unapplied.

## Concrete changes

`consumer-guide.patch` and `proposed-files/` correct five consumer documents:

- Explain the actual omitted-selection break: pass `selection={false}` to retain
  the extracted wrapper's former presentation. Existing selection config Sets
  remain Sets; they do not need engine include/exclude conversion. A copyable
  public-import example exactly matches the checked compiler fixture.
- Replace stale claims that root catalog imports remain unmigrated, and clearly
  distinguish the historical preparatory grid batch from shipped integration.
  Replace obsolete Storybook/build instructions with the current docs-host and
  targeted development validation policy, preserving broad production gates.
- Add `react-aria-public-contracts.md`, covering component-specific domains,
  inherited density, overlay size/reason distinctions, field commit/message
  precedence, selection/persistence defaults and release review ownership.

The guide corrects a material error in prior wave-02-15 default evidence:
**DateField defaults to segments**, whereas DatePicker date-only entry and
TimeField default to text. The current calendar guide already correctly says so;
its existing prose needs no duplicate repair. This is a source reconciliation,
not a proposed library behavior change. `family-policy.md` attaches the correction
without rewriting prior evidence. It also records that TextDateField places an
availability reason before host error text, while TextTimeField does the reverse.

`breaking-change-map.json` has 19 concrete dispositions: eight retained candidate
mappings plus typography, spacing, frame slots, icon props, sort/mode, primitive
removals, preserved Provider/Class identities, image schema/policy, additive footer
handling and current availability composition. Each includes source/guide hashes,
actual recent local commit titles, whether source matches HEAD, release decision,
and proposed breaking title/footer where appropriate. It deliberately does not
assert that a proposed title is committed or that initial extraction was published.

`historical-dependency-boundary.json` resolves the exact old lock versions from
local initial-extraction Git blobs: MUI material/icons **7.3.11**, grid **8.29.3**,
Emotion react **11.14.0**, styled **11.14.1**. Peer ranges alone would have picked
the wrong MUI version. Their inherited declarations still require immutable
version-bound evidence; no upstream install/fetch was performed.

## Snapshot normalization and current-input reconciliation

Reused parallel-01's existing 469 contracts / 238 route lists / 678 candidates;
no export, dependency or extraction inventory was recaptured. New artifacts:

- `normalized-contracts.json`: all saved IDs/aliases/routes with owned visual and
  validation properties, source candidates and direct/composed default references.
  Exact declaration texts remain in the original snapshot.
- `normalized-defaults.json`: 194 direct public parameter defaults, 15 reviewed
  composed public defaults, five shared icon defaults, 25 implementation/helper
  parameter defaults, five local bindings, 431 derived fallback expressions and
  three superseded expressions. All 678 have explicit dispositions. Structural
  classification is not exhaustive indirect public-default acceptance.
- `reviewed-dispositions.json`: 20 manually followed private-composition/factory
  defaults plus three replaced date-field expressions. Private helper syntax is
  not itself a reason to dismiss its public composed behavior.
- `input-comparison.json`: 11 changed source inputs and four changed declaration
  inputs relative to parallel-01. Every coordinator input hash still matches.
- `declaration-deltas.json`: exact four declaration diffs. One internal grid
  predicate addition, two equivalent type-import syntax changes and one DateField
  comment correction; no changed public prop signature found in these four files.

All **370** reviewed declaration hashes equal the coordinator's retained built
output hashes. All **15** retained coordinator receipt hashes match. Its Node24
library/package/docs/composed/native results are reused only for their exact
recorded inputs and limits. The old wave-02-15 Calendar TS2322 is superseded by the
coordinator's preserved initial failure, private-helper type correction and passing
build; it is not an unresolved current finding here. No fresh build was launched.

## Checks and failures

See `command-results.json`, `verification.json` and `typecheck.json` for exact
commands, diagnostics and hashes. New execution used **Node26.5.0**, TypeScript
**5.9.3**, Python3 and local Git reads. It is static/compiler evidence, not a new
supported Node22/24 behavioral result or clean packed consumer.

```sh
node docs/developer/final-acceptance/wave-03-01/normalize.mjs
python3 docs/developer/final-acceptance/wave-03-01/map-breaking.py
python3 docs/developer/final-acceptance/wave-03-01/prepare-patch.py
node docs/developer/final-acceptance/wave-03-01/check-contracts.cjs
python3 docs/developer/final-acceptance/wave-03-01/check-evidence.py
```

All five pass. The consumer fixture has zero diagnostics and six separately
verified expected rejections: onClick, contained variant, invalid Popover size,
old dismissal reason, two-argument AppModal callback and numeric custom row ID.
The evidence checker verifies record identity/counts, current hashes, retained
receipts, exact source-snippet equality and `git apply --check` applicability.
It never applies the patch.

Two initial draft compiler failures are preserved in
`typecheck-initial-failure.json` and `typecheck-second-failure.json`. They exposed
incorrect fixture import scope, generic inference and missing getRowLabel; the
fixture was corrected using actual public exports/requirements. Draft schema/
Python syntax probes are recorded in `draft-failure-notes.txt`. No product
implementation/test was weakened, no broad suite failed here, and no failure is
relabeled a runtime pass.

## Original leaves and remaining deliverables

**A-B-05 — partial.** Original requirement: snapshot public props, callbacks,
models, defaults, subpaths and deprecations; identify actually breaking changes.
The saved snapshot is retained, current declaration deltas are explained, all
candidate syntax is disposed, and concrete migration mappings now exist. Remaining:
follow the 431 derived fallbacks plus relevant private state/context/CSS/composed
paths to actual per-symbol public semantic defaults; resolve historical inherited
APIs at the exact locked versions; join every historical/current symbol delta.
No blanket compatibility claim follows from this normalization.

**A-A-08 — partial.** Original requirement: define public variant, size, tone,
density, placement, dismissal-reason and validation contracts independently of any
foundation. The normalized owned property projection and proposed guide give
concrete component-specific domains and corrected family semantics. Remaining:
review the full alias/compound/context closure and validation timing/host-invalid/
commit precedence beyond these bounded source observations. Type checking proves
assignment compatibility, not native timing or conformance.

**A-Z-13 — partial.** Original requirement: reconcile the snapshot with final
declarations and consumer guide, ensuring every break has instructions and correct
Conventional Commit release marking. The 19-row mapping, current declaration join,
checked snippets and five-file patch advance this directly. Remaining: integrate
and review the patch, complete historical/public-default closure, and join the
actual final commits/squash title and release range to every intentional released
break. HEAD's existing `feat!:` marker is recorded but cannot cover all dirty or
unapplied changes by inference. No manual version/tag/publish action is authorized.

`validation-plan.json` gives exact coordinator actions and expected assertions.
No source/test/library output, central ledger, shared manifest or another owner's
evidence was modified. No install/build/server/browser launch, Git mutation,
network query, subagent/conversation or message to another chat occurred. Native,
AT/device, legal/admin and full production gates remain separate.
