# Parallel 08 — token acceptance reconciliation

Three assigned leaves are complete for their stated source/generation/CI obligations: **A-D-02, A-D-03, A-D-19**. **A-D-01 is partial** because the maintained documentation does not fully describe the current source schema or its DTCG compatibility boundary. These are recommendations to the coordinator; no shared checklist/count was changed.

Reviewed against the full original leaves reproduced in `docs/developer/react-aria-hardening-tasks.md:179–181,197` and the original D entries in `docs/developer/react-aria-scope-ledger.md`. Historical checkmarks were not used as closure evidence. Read repository AGENTS.md and `react-aria-final-acceptance.md`; the 20 editor V leaves remain independent and open. No production approval is inferred.

## Evidence and input boundary

Working branch `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, with existing uncommitted development source. The exact capture time, runtime, 107 selected source/configuration/document hashes, five built output hashes and evidence-log hashes are in [input-reconciliation.json](input-reconciliation.json). All 107 inputs match FA-02 (falling back to FA-01 for an otherwise absent generated-source entry); all five outputs match FA-01. There are no missing snapshot matches. Inputs include the token source, generator, generated files, token tests, CSS guard and tests, all inventoried library CSS Modules, CI/package scripts and the complete inventoried docs theme directory. This is a bounded comparison, not a new full repository inventory or a guarantee about files outside those inputs.

New check performed from repository root:

```sh
node docs/developer/final-acceptance/parallel-08/reconcile-inputs.mjs
```

This reads/hashes inputs and counts source records; it writes only this directory. It imports no compiler, executes no prior test suite, starts no server and rebuilds no shared output. The script is retained for review; rerunning intentionally updates only its dated audit artifact.

Reused evidence, without rerunning completed checks:

- `docs/developer/final-acceptance/fa04-original-check.txt:5–55`: foundations guard and stale-generation check passed; 32/32 foundation tests passed. This includes 11 tests from `scripts/tokens.test.mjs`, the disabled-reference token regression, and CSS guard/pipeline tests. The enclosing all-in-one command later failed nine unrelated calendar unit cases; this report does not describe that command as wholly green.
- `fa04-library-input-delta.json`: the four subsequent library changes are calendar tests/fixture only. None changes this audit's token/CI inputs. FA-04's affected rerun resolves those failures separately.
- `fa04-retained-docs-build.txt:11–28`: 8/8 theme graph tests passed in the retained preceding build. This is retained evidence, not a newly executed docs build. Current theme source and selected compiled public token outputs match their saved hashes.
- `fa04-library.txt` and `fa04-package.txt`: fresh build and package checks passed after the calendar reconciliation. FA-04 records zero differences in all 1,778 output hashes; this audit independently compares the four `dist/foundation/tokens.generated.*` artifacts and `dist/styles.css` only.

No new native/browser/device/AT or remote CI execution is claimed. These checks do not establish all component appearance/state combinations, custom host override contrast, alpha compositing or production acceptance. No install, staging, commit, worktree, push, release change or user-server action occurred.

## A-D-01 — partial

Original obligation: one reviewable source using a documented schema compatible with DTCG where appropriate.

Implemented evidence: `packages/ui/src/foundation/tokens.json` is the library's single authored token source. `packages/ui/scripts/tokens.mjs:4–6,10–47` reads that source and requires nine nonempty groups, camelCase token names, `$type` and `$value`, complete `{group.key}` aliases and validated literal types. Current literals use color hex strings, rem dimension strings, ms duration strings, finite numbers, font-family strings and restricted shadow strings. Source docs in `docs/developer/react-aria-token-roles.md:14–41` explain tier rules and alias behavior. The docs-owned identity palette is explicitly separate application configuration, not another authored source for built-in library defaults; None defaults derive from the public generated token exports.

Finding: the maintained tier guide is a historical slice. It omits pointer/touch groups and the public interaction tier, says shared/density CSS stays literal although density now preserves shared references, and says component CSS has not adopted the aliases. `theme-token-pipeline.md` documents later implementation but does not provide a complete record/value schema or identify the intended DTCG format revision and supported subset/deviations. `$type`/`$value` spelling alone is insufficient to certify compatibility. No external specification-conformance claim is made here.

Successor **P08-D01-SCHEMA**: update the maintained token source guide (and its entry link if needed) to document all nine groups, accepted token record fields/types/value forms, aliases, direction/parity/naming/collision rules, private base values versus emitted public references, and generator commands. State the selected DTCG compatibility target and explicitly document which representations are adapted or unsupported; reconcile any promised interoperability with fixtures or an adapter if necessary. Replace stale pre-adoption and flattened-density wording. Reproduce the gap by comparing guide lines 9–23 and its scoped-generation section against compiler lines 10,60–64,89–108. Documentation and any promised interoperability must be reviewed before closing A-D-01; this report is not a replacement source guide.

## A-D-02 — complete

Original obligation: separate palette/scale, semantic and component tiers, using aliases instead of duplicated values.

Actual source census: 60 base literals with **zero duplicate type/value pairs**; 80 shared aliases; 42 light and 42 dark semantic aliases; four aliases in each density group; two aliases in each pointer/touch group; 307 component aliases and no component literals. Each semantic map has 17 palette references and 25 same-theme references. Component targets are 291 semantic, seven shared, six density and three interaction references. Exact counts and input hashes are in the audit JSON.

`tokens.mjs:58–86` enforces alias-only roles, permitted tier direction, semantic color types, theme topology and emitted-name uniqueness. Canonical light/compact/pointer references become active scoped variables rather than forcing those settings. `tokens.test.mjs` tests base deduplication, alias-only components, direction/type/parity failures, metadata/CSS equality and scope rebinding; passing FA-04 evidence is retained above. `check-foundations.mjs:59–83` supplies generated names/semantic roles to `check-component-css.mjs:72–98`, which rejects unknown tokens, direct semantic color consumption and literal component colors. No implementation successor is required for this leaf. Schema documentation cleanup remains A-D-01; complete visual adoption/conformance belongs to other leaves.

## A-D-03 — complete

Original obligation: generate CSS custom properties and typed references deterministically, with validation.

`tokens.mjs:89–119` generates both checked-in outputs from the same parsed source, using stable source order and fixed selectors/tier order. `--sgui-*` names, scoped CSS, typed `tokens`/`TokenName`, semantic/component/interaction unions, default snapshots, tiers and component dependency metadata are generated. `generateTokens({check:true})` compares exact bytes without writing. Determinism here means identical source input produces identical output; arbitrary key reordering is not promised to produce canonical identical bytes.

Actual generated source contains typed public names (`tokens.generated.ts:439,691,1141`) and CSS aliases; five selected compiled outputs match saved hashes. Retained token tests verify exact generated-file equality, repeat compilation, no cross-compilation mutation, public metadata/CSS dependency parity and legacy resolved defaults. FA-04 build/package evidence covers emitted declarations/public imports. No implementation successor is required. Future relevant source/output changes must rerun only affected checks and record new input hashes; no present need to regenerate anything was found.

## A-D-19 — complete

Original obligation: CI validates references, names, types, aliases, cycles and contrast combinations, without asserting automatic palette contrast.

`tokens.mjs:10–86` implements the structural/name/type/reference/cycle checks. `tokens.test.mjs:11–109` exercises missing targets, cycles, malformed records, invalid dimensions/types, pairing, direction and emitted collisions; name validation itself is explicit at generator line 22. Declared built-in light/dark text/action/status pairs require 4.5:1 and essential border/focus pairs 3:1. These assertions are separate from palette generation. The 11 token test results and one token regression are present in FA-04's 32 passing foundation tests.

CI wiring is concrete: `.github/workflows/ci.yml:16–39` runs library `pnpm check` on Node 22.12.0/24; `packages/ui/package.json` sequences `foundations:check`, `tokens:check` and `test:foundations`. The docs job invokes root `check:docs` and `build:docs`; docs typecheck/build scripts invoke `theme:check`. `apps/docs/theme/theme-graph.test.mjs` checks five identities × two appearances × two contrasts plus forced OS mapping (21 maps, 42 roles), rejects missing/cyclic/literal semantic references, and independently tests named standard 4.5:1/3:1 and increased 7:1/3:1 pairs. Its eight passing tests are retained in the docs build transcript.

The library role guide and architecture explicitly limit contrast assertions to named pairs and require host override review. Neither generated palette existence nor forced-system color mapping is numeric/browser/AT certification. CI is configured for main pushes, PRs excluding dev and workflow calls; ordinary dev work does not trigger full validation. Completion here covers shipped validators/tests/CI wiring and retained matching local execution, **not a fresh remote matrix pass**. No implementation successor is required. The production checkpoint must still execute required CI against its eventual reviewed head, independently of this leaf.
