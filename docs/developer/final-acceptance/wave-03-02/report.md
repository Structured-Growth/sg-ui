# A-A-03 cycle extraction and maintained enforcement proposal

**Partial: implementation and regression artifacts are ready; integration and supported-runtime validation remain.** No acceptance ledger/count changes were made. Only `wave-03-02` was written.

Original requirement: “A-A-03 Reconcile original `A-03`: Define one-way dependency boundaries; prevent root-barrel imports from internal implementations and prevent circular imports. Historical status: open.”

## Concrete patch

`cycle-enforcement.patch` contains thirteen files, mirrored under `proposed-files/`:

- Extract the **current**, byte-preserved `DateFieldProps`, `TimeFieldProps`, `SGLinkProps` and `SGNavigationAdapter` contracts into three dependency leaves. Both renderers/context import those leaves. Existing implementation modules retain type reexports, preserving the shipped experimental/date/time and root/adapter export paths. The DateField extraction retains the coordinator's revised validity contract and all implementation changes.
- Add `packages/ui/scripts/check-source-graph.mjs`. It scans all production TS/JS source (including declaration modules), resolves references with TypeScript and the library's compiler options, rejects internal references resolving to the package root at any depth or through aliases, and rejects all strongly connected components. Static imports, reexports, side effects, import types, import-equals, `require` and dynamic imports are covered. Nonliteral module references fail rather than disappear. Unresolved local module references and production-to-fixture references fail; external packages and CSS/assets are outside the local module-cycle graph.
- Add `check-source-graph.test.mjs`, including mutations of the **real** navigation/date/time source graph, plus acyclic reexports; two-node, three-node and self cycles; deep three-parent/directory root paths, renamed compiler alias and package root; type/dynamic/side-effect/import-equals forms; nonliteral/unresolved references; and test/native-fixture exclusion. The actual plural `native-fixtures` barrel is excluded too.
- Invoke the graph and its regression runner from existing `foundations:check`, replacing its shallow root-import regex. No manifest/workflow change is needed; existing interaction/layer/token checks remain.
- Document maintained cycle policy and commands in `component-architecture.md`. Both erased-type and runtime-capable cycles are prohibited; there is no type-cycle waiver.

Runtime classification is intentionally conservative: explicitly erased type syntax is removed from the runtime graph; unmarked imports are retained even if a compiler could infer erasure. Inline type-only import/export specifiers respect `verbatimModuleSyntax`, which can preserve empty runtime module evaluations. Runtime SCCs and full SCCs involving type edges are reported separately; a mixed SCC containing a runtime subcycle is not mislabeled “type-only.” No bundler execution, external dependency-cycle, CSS-cycle, browser, device or AT claim follows from this source graph.

## Evidence and prior-result reconciliation

`input-reconciliation.json` verifies both wave-02-15 report/result hashes against the assignment. Five of its six proposal inputs are unchanged. DateField changed from `e6d15d31…` to `431d304e…`, matching the accepted coordinator integration receipt; TextDateField also matches that receipt. The saved parallel-02 graph has 413 unchanged and eleven changed source inputs, with no added/removed production modules under the corrected fixture policy. The graph was refreshed specifically to validate the changed inputs and new enforcement, rather than treating old results as current.

Final pure-Node checks use **Node 26.5.0 / TypeScript 5.9.3**, outside the supported Node 22/24 execution matrix:

| Check | Result |
| --- | --- |
| `node docs/developer/final-acceptance/wave-03-02/validate.mjs` | Pass. Current 424-module graph has exactly three type-involving SCCs and zero runtime SCCs/root violations. Proposed 427-module, 1,152-edge overlay has zero SCCs/root violations. All policy/real-source mutation assertions pass. |
| `node docs/developer/final-acceptance/wave-03-02/typecheck.mjs` | Pass. Baseline and proposed source-only noEmit programs have zero diagnostics. Eight exported/direct type-contract views compare equally, including property types/optionality. All six changed implementation modules have byte-identical `transpileModule` JavaScript. This is not a built/packed artifact comparison. |
| `git apply --check docs/developer/final-acceptance/wave-03-02/cycle-enforcement.patch` | Pass; patch was **not applied**. Empty successful stdout is preserved in `patch-check.txt`. |

`graph-validation.json` hashes every inspected production module before/after the overlay. `typecheck.json` records compiler input hashes, contract signatures and emitted comparison hashes. `patch-input-hashes.json` pins all patch preconditions; `artifact-hashes.json` pins delivered files. Local mirror `packages/ui/node_modules` is only a validation symlink to the existing installed dependencies and is not included in the patch.

Three **harness** failures are retained: the first assumed date types were exported from root, the second assumed they were on primitives, and the third used repository-root type-library resolution instead of the package cwd. Existing exports were inspected, comparisons narrowed to real shipped paths, and the compiler host cwd corrected. The saved failure logs and cwd-failure JSON are not represented as passing checks; the final receipts above are separate successful executions. No library defect or assertion was suppressed.

## Remaining successor and limits

The coordinator must review/recheck current patch hashes, integrate the patch, run supported Node 22/24 graph/regression/foundation/type checks and the existing three affected component suites, then build and validate public/packed declarations. Exact commands, assertions and catalog/package follow-ups are in `validation-plan.json`. Shared unit execution was not attempted while the inspected legacy lease was occupied; no lease was reclaimed or bypassed. No shared installation/build/catalog generation/server startup, broad suite, production source change, central ledger change, Git mutation, publication or external approval occurred. User server 3000 and `.obsidian/workspace.json` were untouched.

The accepted BUG-0008–0012/coordinator runtime receipts remain bounded historical evidence for their exact hashes. This proposal does not extend those receipts to unintegrated source. **A-A-03 remains partial until applied and validated**; no other A/V/future leaf is assessed.
