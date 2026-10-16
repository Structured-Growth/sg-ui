# Fix 01 — A-D-01 token schema documentation

**P08-D01-SCHEMA complete. A-D-01 is recommended complete for its original source/schema obligation**, subject to coordinator review/integration. No shared checklist or acceptance count was edited. This does not close other token, browser, device, AT, legal or release requirements.

Base: shared modified `dev` checkout, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Changes are working-tree documentation, not a committed/released artifact.

## Actual change

Updated [the maintained source guide](../../react-aria-token-roles.md) rather than writing another replacement audit:

- Documents all nine required groups, flat records, required `$type`/`$value`, ignored extra fields, six literal forms and validation limitations.
- Specifies whole-token aliases, allowed tier direction, paired keys/types/topology, naming/CSS conversion/collisions and deterministic ordering limits.
- Corrects the pre-adoption component wording and flattened-density claim; covers pointer/touch/auto, coarse-pointer CSS, inherited scope defaults and overlay scope ownership.
- Separates private base records from generated public CSS/references/metadata; includes exact generation/check commands and cwd.
- Restores the missing `textSubtle` row so the complete semantic table covers all 42 current roles; labels the component mapping table as selected rather than exhaustive.
- Compares against the primary [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) (reviewed 2026-10-16), especially sections 5–8 and 9.6. Explicitly records adapted representations and unsupported forms. No interchange/conforming-reader promise or adapter was added.

The original A-D-01 asks for one reviewable source and a documented schema compatible with DTCG where appropriate. Existing single-source implementation remains unchanged; this fix supplies its missing current documentation and bounds the DTCG claim. General DTCG interchange is not a shipped contract. If interchange becomes a requirement, an adapter and representation/round-trip fixtures are required before promising it.

## Validation and retained evidence

New bounded check from repository root:

```sh
node docs/developer/final-acceptance/fix-01/validate-doc.mjs
```

Pass: all nine source groups represented; all 42 semantic table values match recursive source resolution; 34 selected component mappings match authored aliases; three local documentation links exist; four documented interaction defaults match source. The script writes only `fix-01/doc-validation.json`.

Five selected token inputs match SHA-256 hashes retained in `parallel-08/input-reconciliation.json`: authored JSON, compiler, token tests, generated CSS and generated TypeScript. Current ThemeScope is separately hashed and inspected; no retained comparison is asserted for that file. See [doc-validation.json](doc-validation.json) for exact hashes, time and runtime. This comparison permits reuse of the corresponding retained token evidence; it is not a new full source/build inventory.

Reused, without rerunning:

- `../parallel-08/report.md` reconciles the source/generation findings and retained evidence; its A-D-01 documentation gap is the fix implemented here.
- `../fa04-original-check.txt:5–55`: token/foundation guards and 32 foundation tests passed, including token tests; the enclosing command later failed unrelated calendar cases, so it is not described as wholly green.
- `../fa04-retained-docs-build.txt:11–28`: eight theme graph tests passed in retained evidence, not a new docs build.

`git diff --check -- docs/developer/react-aria-token-roles.md docs/developer/final-acceptance/fix-01` passed. New check is a documentation/data assertion and hash comparison, not execution of the token suite or a supported-runtime matrix. It imports no compiler, mutates no generated output, and runs no server/build/browser/consumer suite. `results.json` records touched-file hashes; its own recursive hash is intentionally omitted.

## Remaining requirements and boundaries

Only the named successor and the original A-D-01 source/schema obligation are substantiated here. Expanded token/component tests, native computed styles, nested portals, visual/state/density/interaction combinations, forced colors, custom-host/alpha contrast, physical devices and actual assistive technology remain subject to their separate acceptance leaves. Numeric pair tests do not establish universal conformance. Production validation and remote CI must run against the eventual reviewed head; no remote CI, legal approval, release readiness or waiver of the 20 editor V leaves is claimed.

No runtime source/API, package metadata, dependencies, generated output, shared checklist/ledger, other report or source snapshot was edited. No install, stage, commit, push, cleanup, worktree, version, tag, release, or user-server action occurred.
