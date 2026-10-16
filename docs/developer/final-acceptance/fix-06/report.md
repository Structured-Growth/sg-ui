# A-I-08 metadata fix — fix-06

**I-S3 complete; full A-I-08 remains partial/open.** This closes only the missing
Brush mapping and inexpensive parity-check successor from
[parallel-12](../parallel-12/report.md). No shared checklist or acceptance count
was edited.

## Changes

- Added `"Brush": "Paintbrush"` to
  `packages/ui/src/experimental/icons/icon-map.json` in the existing alphabetical order.
- Added `BrushIcon | Paintbrush` to the complete symbol table in
  `docs/developer/react-aria-icons.md`. Documented exact JSON key/value semantics,
  full public names in the table, compatibility names versus unique vectors, and
  excluded helper/factory/barrel modules.
- Added [check-icon-mapping.py](check-icon-mapping.py), a standard-library-only,
  read-only metadata guard. It compares every concrete `createIcon` wrapper with
  both mappings, checks exact imported vector names and wrapper identities,
  rejects duplicate JSON/table names, and fails for unclassified implementation
  files or drift from the reviewed 96-wrapper inventory. It is a manually invoked
  bounded guard, not new shared CI/runtime/test wiring.

## Validation

Run from repository root:

```sh
python3 docs/developer/final-acceptance/fix-06/check-icon-mapping.py > docs/developer/final-acceptance/fix-06/parity.json
git diff --check -- packages/ui/src/experimental/icons/icon-map.json docs/developer/react-aria-icons.md
```

Both exited 0. [parity.json](parity.json) records **96 implemented wrappers,
96 JSON mappings and 96 documentation mappings**, with no missing, unknown or
mismatched vector mappings. BrushIcon resolves to Paintbrush. `activityTypeIcon.tsx`
is a selector using existing wrappers; `createVector.tsx` is the factory;
`index.ts` is the reexport barrel. None adds another vector to that count.
The receipt hashes all 102 inspected inputs, including the guard itself; it
contains hashes only, not source snapshots. [results.json](results.json) hashes
all changed deliverables except itself, avoiding a recursive self-hash.

Working-tree base: `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, shared `dev`
checkout. This is bounded working-tree evidence; other conversations may change
unowned files. Only the two assigned maintained files and `fix-06/` were written.
No implementation, vector asset, notice, generated output, shared guard/test,
acceptance ledger or other report was edited. No install, build, broad test,
browser/consumer suite, server action, staging, commit, push or release action ran.

## Retained evidence and remaining requirements

Reuse parallel-12's completed A-I-01/02/03/06/07 reconciliation, including its
FA-01/FA-02/FA-04 inventory, unit/package and notice-retention references. Those
remain dated receipts; this metadata fix does not turn them into new executions.
This batch reran only static parity and whitespace validation and makes no new
bundle, visual or legal claim.

Keep A-I-08 open pending its other successors and owner reconciliation:

- **I-S1:** durable current-input production bundle/module-map evidence for
  granular/basic and representative toolbar/navigation consumers, including
  vector pruning, CSS side effects and exact input/output hashes.
- **I-S2:** symbol/usage direction policy and rendered optical size, weight,
  alignment, clipping, RTL transforms/overrides, density and named theme contrast
  checks, including forced colors.
- **I-S4:** bounded production docs icon-route browser evidence for gallery search,
  meaningful/decorative transitions, copy/source correspondence and independent
  state, with source/output/engine receipts.
- Existing runtime/unit receipts are retained, not newly executed here. Physical
  device and spoken assistive-technology validation remain separate requirements;
  static parity provides neither. Legal-owner final asset provenance review and
  broader legal acceptance remain explicit; retained notices are not legal approval.

No remote CI completion or production/release approval is claimed.
