# Wave 02-12 — packaging, CI, AI and release acceptance

Reviewed all 28 full original R leaves. Recommended results: **12 complete, 16 partial, 0 blocked**. Shared checklists/counts are coordinator-owned; this report edits none. These are criterion-specific recommendations, not production approval.

Base/current HEAD is `540f47d4059a9cea8890b80927f34f51ef2fbc3e` on the existing modified `dev` checkout. Exact input hashes, retained receipt hashes, selected output identities and external action declarations are in [evidence.json](evidence.json); machine-readable leaf decisions are in [results.json](results.json).

## Checks and evidence limits

Read original leaves, AGENTS, final acceptance/FA-01–04, packaging/runtime/server docs, all four current workflow files, templates, manifests, build/package/release/consumer scripts and prior relevant parallel reports. Reused FA-01's complete entry inventory, FA-02's dependency/import graph, FA-04 build/package/release receipts and parallel-01/03/06/07/12 results. Did not regenerate inventories, reinstall dependencies or rerun passed baseline suites.

Ran `python3 docs/developer/final-acceptance/wave-02-12/capture.py`: 43 selected inputs all have prior saved hashes. Only the three picker implementations and TextArea changed; selected tooling, workflow/configuration/guidance inputs match. Fourteen selected outputs still equal FA-01, including those four components. **Old dist is not evidence of the new implementation fixes.** This is a bounded delta, not a fresh full-source inventory.

Ran `node --test packages/ui/scripts/ai-component-scope.test.mjs`: **5 passed, 0 failed**; [transcript](ai-scope-tests.txt). These tests execute extracted workflow JavaScript using mocked IO/Git in a VM: path allowlist parity, hostile-looking task strings as data, required evidence sections and applied-patch/base/run receipt. They execute no Actions, shell task, Git mutation, network or credentials. This is necessary new AI-template logic evidence absent from the reused FA-04 chain. Local host is **Node26.5.0**; do not count it as supported Node22/24 conformance or live security/isolation evidence.

No build, shared output mutation, install, browser/native/heavy/consumer suite, server operation, remote CI/registry lookup, credential read, legal approval, commit/stage/push/tag/release or source/checklist edit occurred. Only this owned directory was written. Historical Actions receipts retain their exact heads and expiration observations; no claim is made that artifacts remain available today. The 20 editor V leaves remain open independently.

## Findings requiring coordination

- Current scripts provide real build/package/directive/owned-type guards and production release dependency sequencing. Unchanged FA-04 receipts support these implementation/configuration criteria at their saved inputs.
- Core/grid/editor public entry separation remains explicitly unfinished in the packaging acceptance record. Granular imports help; they do not settle install-time Lexical dependencies or root barrel behavior.
- `docs/github-setup.md` still names Storybook builds/artifacts/paths and says AI PR bodies are static, while actual workflows now build native docs fixtures and preserve detailed author evidence plus exact proposal receipts. Troubleshooting has the same old host commands. Templates still request stories.
- Actual npm ownership/publishing identity/provenance, branch protection/current check names, current Actions artifacts and default-token AI PR execution need owner/operator evidence. Configuration and local VM tests cannot provide it.
- Publication recovery was explicitly undefined. This wave supplies [a concrete review draft](release-recovery-draft.md); adoption and an offline drill remain required.

## Leaf decisions

### A-R-01 — complete

Original: Update the build to emit compiled CSS/assets and correct ESM/declarations; verify relative extensions and package consumer resolution.

Build checks generated tokens, removes dist, emits ESM/declarations/maps, rewrites relative module/CSS-map extensions and compiles CSS Modules/assets. The unchanged pipeline passed FA-04 build plus actual tarball/import resolution/type checks. Retained CSS pipeline tests cover deterministic class maps and emitted ESM. Completion is pipeline/output-format reconciliation at the saved artifact, not a fresh pack of concurrent fixes.

References: `packages/ui/scripts/build.mjs`; `packages/ui/scripts/css-modules.mjs`; `packages/ui/tsconfig.build.json`; `packages/ui/scripts/check-package.mjs`; `docs/developer/final-acceptance/fa04-library.txt`; `docs/developer/final-acceptance/fa04-package.txt`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No pipeline repair required. Coordinator must build and validate the newly changed picker/TextArea inputs before treating a resulting artifact as current; this remains the shared final package gate.

### A-R-02 — complete

Original: Remove blanket client-directive injection; preserve directives for interactive components and keep eligible presentation/token modules server-compatible. Source/output guard and packed React 19 Flight evidence; [server/client packaging](react-aria-server-components.md).

No blanket client injection remains. Per-source directives survive compilation; package AST checks require explicit client boundaries for client React APIs and exact source/output directive parity. Tokens and eligible presentation modules remain server-compatible; ThemeScope/Provider and interactive modules are client boundaries. All four changed implementations still start with use client. Historical Flight receipts remain dated and are not a new Flight run. The source guard/build contract itself is unchanged.

References: `packages/ui/scripts/build.mjs:10`; `packages/ui/scripts/check-package.mjs:20`; `docs/developer/react-aria-server-components.md`; `docs/developer/final-acceptance/fa04-package.txt`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No implementation successor. Reconcile stale AppButton mention in the server-packaging guide with Button during R-DOC below; representative fresh Flight remains R-08.

### A-R-03 — partial

Original: Design root and granular entry points for core, theme/tokens/styles, primitives, icons, hooks, adapters, i18n, grid, editor and learning compositions.

Existing root, components, theme, tokens, stylesheet, primitives, icons, hooks, adapters, i18n and many granular component paths are inventoried in FA-01. However the packaging record explicitly leaves a fully separated core/grid/editor design open. Root and components convenience barrels expose editors; Lexical remains directly installed for every consumer. Existing component subpaths do not alone settle the complete domain-entry architecture.

References: `packages/ui/package.json:22`; `packages/ui/src/index.ts`; `docs/developer/react-aria-package-acceptance.md`; `docs/developer/parallel-batch-01/packaging.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-ENTRY: maintainer must decide/document the supported core/grid/editor/learning entry design and whether editor dependency installation is split; implement any approved export/package/build changes with a breaking migration map and isolated packed entry graphs. Preserve existing paths unless explicitly approved.

### A-R-04 — partial

Original: Ensure barrels do not accidentally pull interactive/heavyweight dependencies into presentation-only imports or make server consumers import all editors.

Ten representative granular Vite entry audits inspect module IDs for Lexical/TanStack/catalog traversal, not just minified strings. Historical packaging receipt passed those checks, but is tied to 6ec39e6; it does not certify this working tree. Root/components intentionally traverse heavyweight exports and are not server isolation boundaries. Prior I-S1 bundle receipt is still open, not repeated here.

References: `packages/ui/src/index.ts`; `packages/ui/src/components/index.ts`; `packages/ui/scripts/test-foundation-consumer.mjs:180`; `docs/developer/react-aria-package-acceptance.md`; `docs/developer/final-acceptance/parallel-12/report.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-ENTRY plus R-CONSUMER: retain current packed per-entry graph/CSS receipts for tokens/theme/presentation/hooks/adapters/i18n/basic control/grid and editor; explicitly test intended root/server import behavior. Coordinate I-S1 rather than repeating a second bundle matrix.

### A-R-05 — complete

Original: Update `files`, `exports`, `types`, and `sideEffects` for CSS and new output; remove the old augmentation entry and ensure required CSS survives bundlers.

files limits shipped content to dist/LICENSE/notices (README/package metadata are pack defaults); ESM/types exports are explicit; styles.css and CSS sideEffects survive packaging. Old theme augmentation entry is absent. Actual packed-byte equality/export/side-effect/notices checks passed FA-04 for the saved build. CSS pipeline tests and historical production consumer receipts support the configured mechanism. Source fixes have not altered packaging metadata.

References: `packages/ui/package.json:12`; `packages/ui/scripts/check-package.mjs:79`; `packages/ui/scripts/CSSPipeline.next100-regression.test.mjs`; `docs/developer/final-acceptance/fa04-package.txt`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No metadata repair required. Fresh consumer/build acceptance for concurrent fixes belongs to R-CONSUMER; no current bundled CSS execution is claimed.

### A-R-06 — complete

Original: Preserve React/React DOM as peers and decide correct direct/peer placement for each new dependency; remove all retired packages from every dependency section.

React/ReactDOM remain peers for 18.3.1/19 and local dev inputs; interaction/date, Lucide, TanStack and Lexical are runtime direct dependencies, with test/build/release tooling in development. Owned public APIs avoid requiring upstream types from hosts. FA-02 resolved graph contains no retired MUI/Emotion packages; manifests/lockfile remain hash-identical. Dependency installation size/editor separation is an explicit separate architecture decision, not silently claimed solved here.

References: `packages/ui/package.json:239`; `docs/developer/react-aria-architecture.md:164`; `docs/developer/final-acceptance/2026-10-16-source-inventory.json`; `docs/developer/final-acceptance/parallel-07/report.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No placement change required under the current single-package contract; preserve R-ENTRY and parallel-07 dependency-guide corrections.

### A-R-07 — partial

Original: Regenerate the lockfile through the package manager and inspect resolved transitive dependencies, overrides, patched dependencies and optional packages.

Reused FA-02 installed graph (586 identities/985 observed edges) and unchanged lockfile/manifests. Lockfile version 9 and integrity fields are present; bounded text check finds no top-level overrides/patchedDependencies and records optional-package markers. Historical packaging batch reports frozen install with no lock delta, but current package-manager regeneration provenance and peer/optional physical topology have not been established by this report. No hand edit or install was attempted.

References: `pnpm-lock.yaml`; `pnpm-workspace.yaml`; `docs/developer/final-acceptance/2026-10-16-source-inventory.json`; `docs/developer/parallel-batch-01/packaging.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-LOCK: on the next authorized dependency maintenance run preserve package-manager generation/frozen-install receipt, inspect importers/resolutions, overrides/patched and platform-optional selections plus peer contexts; explain intentional/no lock delta and bind exact manifest/lock/runtime hashes. Do not regenerate an unchanged lock solely to create a new timestamp.

### A-R-08 — partial

Original: Verify packed artifacts rather than only source imports; install the tarball in clean Vite and Next.js/SSR consumer fixtures and build production output.

Clean fixture scripts pack the already built package, install a file tarball without automatic peers, and build production Vite/SSR/Flight or Next output; no checkout aliases are used. Prior receipts prove their named old heads. FA-04 checks extracted tarball equality, but does not rerun clean Vite/Next fixtures; the four changed source implementations are not in the old dist bytes.

References: `packages/ui/scripts/test-foundation-consumer.mjs`; `packages/ui/scripts/test-editor-consumer.mjs`; `packages/ui/scripts/test-next-consumer.mjs`; `docs/developer/react-aria-runtime-ci.md`; `docs/developer/final-acceptance/fa04-package.txt`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-CONSUMER: coordinator performs one serial current-artifact validation across supported React18/19 Vite foundation/editor, React19 Flight and Next production/browser fixtures after final source build; retain manifest/source/output identity, command/runtime/engine/logs and actual packed bytes. Never rebuild dist while fixtures read it.

### A-R-09 — partial

Original: Test published type declarations with supported TypeScript versions and ensure no retired imports/augmentation or accidental private upstream types escape.

FA-01 runtime/declaration parity and parallel-03 AST public closure found no public non-React upstream type escape; FA-04 consumer typecheck passes for its output. Installed-tarball fixture pins TS5.9.3 and React-matched types with skipLibCheck. No broader supported TS range/matrix or unchecked third-party declaration guarantee was established. Current changed APIs require new output reconciliation. Existing guard omits @internationalized/date spelling, although prior independent closure found no actual escape.

References: `packages/ui/scripts/check-package.mjs`; `packages/ui/scripts/package-consumer.tsx`; `packages/ui/scripts/test-foundation-consumer.mjs:175`; `docs/developer/final-acceptance/parallel-03/report.md`; `docs/developer/react-aria-package-acceptance.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-TYPES: decide explicit supported TS versions/options, retain current-artifact installed-package positive/negative API compilation on that range, and update contract snapshot only for changed declarations. Preserve optional P03-GUARD-01 rejection improvement without representing it as a known current leak.

### A-R-10 — complete

Original: Keep the supported Node/runtime requirements explicit; reconcile development, CI, AI and release Node versions where their tool requirements differ. [Runtime matrix](react-aria-runtime-ci.md).

Published engine >=22.12.0 is distinguished from Node24 development/release tooling. CI selects exact22.12.0 and24; AI/title/release use .nvmrc24; pnpm10.29.3 is declared. Runtime guidance explains semantic-release25 needs a newer publishing runtime than consumer minimum. This reconciles promises/configuration and preserves FA-03; local Node26 VM evidence is expressly outside supported-runtime conformance.

References: `.nvmrc`; `package.json`; `packages/ui/package.json`; `.github/workflows/ci.yml`; `.github/workflows/ai-code.yml`; `.github/workflows/release.yml`; `docs/developer/react-aria-runtime-ci.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No runtime policy successor; current supported-runtime execution remains the production gate.

### A-R-11 — complete

Original: Extend `pnpm check` and CI with necessary token/CSS/import-boundary/type/API checks, browser interactions, accessibility, package consumers, and performance smoke checks. Both runtime jobs, eight packed consumers and 45 browser gates pass at `83b8dae2`; [runtime evidence](react-aria-runtime-ci.md). Broader framework/device budgets remain separate tasks.

check chains foundation/import/token/CSS/unit/type/release/build/package stages. CI additionally builds native docs fixtures, runs three-engine browser/axe/performance checks on Node24, serial packed consumers and Next, plus a separate public docs job. Historical83b8dae2 receipt establishes the original executable gate; FA-04 supplies bounded retained local evidence. Completion is the requested extension/wiring, not current all-suite or device/AT acceptance.

References: `packages/ui/package.json:224`; `.github/workflows/ci.yml`; `packages/ui/tests/browser/acceptance.spec.ts:120`; `packages/ui/tests/browser/acceptance.spec.ts:140`; `docs/developer/react-aria-runtime-ci.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No missing listed check category identified in wiring. Current end-to-end run and required-context enforcement remain R-CI/R-PROTECT; do not interpret dev CI pause as production validation.

### A-R-12 — partial

Original: Keep Storybook builds and official tarballs as Actions artifacts; record artifact names, retention, and validation results. Both runtime jobs and six unexpired artifacts verified at `c78a24e`, run 37559276148; [artifact evidence](react-aria-runtime-ci.md).

Current YAML uploads official package tarballs, replacement native-docs fixtures, logs and browser evidence with14-day retention; required output uploads fail on absence. Historicalc78a24e artifacts and IDs remain valid dated evidence, not verified available artifacts now. Active setup guidance still advertises sgui-storybook names and build-storybook. No current docs-fixture Actions artifact was inspected.

References: `.github/workflows/ci.yml:63`; `docs/developer/react-aria-runtime-ci.md`; `docs/github-setup.md:46`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-DOC corrects active artifact/build naming while preserving dated historical tables. R-CI must provide actual current producing run, artifact IDs/hashes/expiry and validation conclusions for packages and native-docs fixtures; owner/operator verifies retrieval rather than assuming continued availability.

### A-R-13 — complete

Original: Preserve release sequencing: full required checks pass before semantic-release publishes on main, with correct concurrency and full tag history.

Release only runs on main (including manual dispatch main guard), needs the complete reusable CI validate job, uses noncancelling sgui-release concurrency and fetch-depth0 before semantic-release. Config releases only main. No dev publish or automatic prerelease branch is configured. Failed validation prevents the dependent release job. External review/protection enforcement and owner credentials are distinct unverified prerequisites.

References: `.github/workflows/release.yml`; `.github/workflows/ci.yml`; `packages/ui/release.config.mjs`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No sequencing change required. Preserve R-PROTECT and R-OWNER prerequisites before any approved main promotion; no release was executed.

### A-R-14 — complete

Original: Preserve Conventional Commit PR-title validation, squash title/footer guidance, release-policy tests, and automatic patch/minor/major inference.

Production-bound PR-title workflow validates env-delivered title through commitlint safely; dev exclusions match approved pause. Squash guidance preserves ! or BREAKING CHANGE footer. Four retained FA-04 tests establish fix/perf patch, feat minor, either breaking marker major, highest impact wins and nonrelease types null. Semantic-release analyzer/notes use conventionalcommits; no manual version inference substituted.

References: `.github/workflows/pr-title.yml`; `commitlint.config.mjs`; `packages/ui/release.config.mjs`; `packages/ui/scripts/release-policy.test.mjs`; `docs/developer/final-acceptance/fa04-release.txt`; `.github/pull_request_template.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No release-rule repair required; eventual squashed release commit/owner decision remains R-15/R-28. Unchanged passing policy tests were not rerun.

### A-R-15 — partial

Original: Mark breaking public API removals appropriately; if a release already exists, migration needs a major bump, while a first publication follows the configured initial-release policy.

Current HEAD is feat! and explicitly records AppButton/AppButtonProps removal and Button migration. Consumer mapping docs describe additional breaking props, but parallel-01 still leaves exhaustive defaults/historical API delta reconciliation open. FA-01 local tag inventory is empty; no remote registry/tag release-state claim follows. README states initial1.0.0 policy, while existing-release changes must preserve major inference.

References: `docs/developer/final-acceptance/parallel-06/button-breaking-commit.txt`; `docs/migration.md:77`; `README.md:140`; `docs/developer/final-acceptance/parallel-01/report.md`; `packages/ui/release.config.mjs`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-BREAKING: finish normalized historical API/default/removal ledger, map every breaking delta to migration instructions and eventual squash markers; owner verifies actual published/tag state and records whether first publication or subsequent major policy applies. Do not hand-edit versions.

### A-R-16 — complete

Original: Plan a coherent migration branch/PR sequence so incomplete migration commits do not accidentally publish incompatible intermediate APIs; use documented prerelease policy only if deliberately configured.

Development integrates into dev; codex/dev is retired. Reviewed/validated major/minor production promotion needs explicit human approval. Release config/workflow only target main, so incomplete ordinary dev integration cannot publish through the checked-in release path. No prerelease branch exists; none is implicitly assumed. Accepted leaf/evidence tracking provides reviewable task sequence.

References: `AGENTS.md:1`; `README.md:20`; `.github/workflows/release.yml`; `packages/ui/release.config.mjs`; `docs/developer/react-aria-development-validation.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No branch-policy change required. R-28 owner must explicitly approve the final release-bound promotion and its consequence; configuration does not prove branch protection.

### A-R-17 — partial

Original: Verify npm scope ownership, public access, trusted-publishing/token setup, GitHub release/tag permissions, provenance requirements, and commercial notices before publication.

Public access/registry and contents/id-token source permissions are declared; setup explicitly leaves npm ownership, tokens/trusted publisher, effective npm CLI and repository settings unverified. NPM_TOKEN is referenced, not inspected. Provenance env is conditional on public repository; that is configuration, not successful attestation. Commercial/license retention evidence is not owner legal approval.

References: `docs/github-setup.md:57`; `packages/ui/package.json:216`; `.github/workflows/release.yml`; `LICENSE`; `packages/ui/THIRD_PARTY_NOTICES.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-OWNER: authorized owner records scope/package control, publishing route/2FA or trusted-publisher binding/effective CLI, GitHub tag/release permissions, provenance requirement and successful safe prerequisite verification, commercial/notices approval. Record redacted statuses and owner/date; do not copy secrets or publish as a test.

### A-R-18 — complete

Original: Keep local builds for validation only; do not publish locally, edit tracked versions manually, add changesets, or claim owner configuration is already done.

Instructions retain local validation-only builds, automatic semantic-release versions, no local publishing, no hand versions/changesets and reporting unverified owner setup. Current manifest remains0.0.0-development. This conversation only wrote owned evidence and ran inert tests; no install/build/release/Git mutation was performed. This is compliance in the reviewed scope, not proof of all past external operations.

References: `AGENTS.md:468`; `README.md:130`; `packages/ui/package.json:3`; `.github/pull_request_template.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No successor for this policy/scope obligation; retain owner gates.

### A-R-19 — complete

Original: Keep the AI workflow task scope and patch allowlist aligned; architecture/package/workflow/agent changes currently require ordinary maintainer PRs rather than the component-only AI path.

Prompt limits semantic work to components/docs examples/native scenarios and excludes architecture/foundation/theme/adapters/i18n/hooks/experimental/shared contracts/public exports/models/package/workflow/agent changes. Both capture and proposal enforce the same normalized path predicate. Five inert VM tests pass, including allowed component/docs paths and denied shared paths, task data and receipt checks. Passing a path guard cannot establish semantic review of every proposed component edit.

References: `.github/workflows/ai-code.yml:35`; `.github/workflows/ai-code.yml:51`; `.github/workflows/ai-code.yml:83`; `packages/ui/scripts/ai-component-scope.test.mjs`.

Checks performed: Read both inline guards and prompt; ran node --test packages/ui/scripts/ai-component-scope.test.mjs (5/5) with mocked IO/VM on Node26.5.0; captured exact workflow/test hashes.

Successor: No boundary-code repair shown. R-DOC must align stale setup prose with actual workspace paths; broader real workflow isolation remains R-21.

### A-R-20 — partial

Original: Add task IDs, owned API requirements, story/behavior criteria, and validation evidence to AI task templates and generated PR expectations.

Task/PR templates carry IDs, observable behavior, owned contracts/host boundaries, evidence and remaining gates. Generated AI body now preserves five nonempty evidence sections and appends exact base/patch SHA/run/check receipt; inert tests verify missing sections fail. However setup still says generated body is a static summary requiring separate R-20 work, names removed Storybook and outdated allowed paths; templates still request stories rather than current docs examples/native fixtures.

References: `.github/ISSUE_TEMPLATE/ui-change.yml`; `.github/pull_request_template.md`; `.github/workflows/ai-code.yml:105`; `packages/ui/scripts/ai-component-scope.test.mjs`; `docs/github-setup.md:101`.

Checks performed: Read issue/PR templates, generated prompt/body receipt and stale guide; ran five inert AI workflow tests, including required nonempty sections and exact patch receipt.

Successor: R-DOC: adopt exact replacement wording in report for current workspace/examples/fixtures and generated evidence body; validate links/commands/template requirements against AI VM tests. No UI suite needed for prose-only correction.

### A-R-21 — partial

Original: Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals.

Default permissions are contents:read, write contents/PR granted only to separate proposal job; checkout persist-credentials:false, task/title transported as env/file data, implementation sandbox workspace-write/drop-sudo, separate validation and draft:true. No auto-merge step exists. VM checks preserve hostile-looking strings as data. Actual third-party action execution, model/API secret isolation, generated-code validation in write-permission proposal job and repository token restrictions have not been audited dynamically.

References: `.github/workflows/ai-code.yml`; `.github/workflows/pr-title.yml`; `packages/ui/scripts/ai-component-scope.test.mjs`; `docs/github-setup.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-AI-SECURITY: maintainer/security owner reviews action source at resolved commits, token access by job/step and untrusted patch execution, approved path semantics and artifact trust; preserve a harmless live fixture receipt demonstrating permission isolation/fail-closed draft flow. Do not claim VM source tests establish credential containment or expose credentials.

### A-R-22 — complete

Original: Document the existing manual Actions AI trigger; an issue/label trigger is a separate decision, not already implemented or implied by the issue template.

Workflow has only workflow_dispatch with required task and main-only implementation. UI form explicitly says submission does not start implementation; manual Actions main selection is documented. No issue/label event is configured. Other stale paragraphs do not change the accurate trigger statement.

References: `.github/workflows/ai-code.yml:3`; `.github/ISSUE_TEMPLATE/ui-change.yml:8`; `docs/github-setup.md:88`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: No trigger successor; any issue/label automation needs a separate explicit decision.

### A-R-23 — partial

Original: Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events.

Proposal independently validates title, pnpm check and native fixture build before draft creation and records the applied working-tree base plus patch hash, not a future PR commit. It does not run full native/browser/packed matrix. Actual default-token draft event/check behavior and owner approval of pending runs were not observed. Documentation correctly refuses to infer a pass from an absent PR event, but contains stale Storybook names.

References: `.github/workflows/ai-code.yml:120`; `.github/workflows/ai-code.yml:131`; `docs/github-setup.md:111`; `docs/troubleshooting/validation.md:11`; `packages/ui/scripts/ai-component-scope.test.mjs`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-AI-LIVE: authorized operator exercises a harmless default-token draft, captures final PR head, event/check contexts and actual full validation or explicit workflow-call dispatch on that exact patch/head; records pending/missing runs and required approval. Keep independent proposal receipt and do not conflate it with full CI. R-DOC corrects obsolete command names.

### A-R-24 — partial

Original: Update workflow timeouts/artifact handling as browser checks expand; cache by lockfile and avoid stale build outputs masking missing CSS or dependencies.

CI has30-minute matrix and20-minute docs limits; AI30/15 and release15. setup-node pnpm caching follows the lockfile; frozen install and clean dist removal prevent straightforward stale output reuse. Browser reports/traces/JSON/packed evidence and logs upload even on failure; package/native-fixture outputs require success. Current expanded matrix timing/timeout sufficiency and actual artifact completeness have no new live receipt. Active guide still refers to Storybook.

References: `.github/workflows/ci.yml`; `.github/workflows/ai-code.yml`; `packages/ui/scripts/build.mjs`; `docs/developer/react-aria-runtime-ci.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-CI: inspect exact current full-run durations, failure-upload contents and fresh-build identities, adjust timeouts only with measured evidence and preserve failing behavior/engine gates. R-DOC corrects artifact guidance. Never use cached dist as a substitute for current-source build.

### A-R-25 — partial

Original: Pin/review workflow dependencies according to repository policy and validate proposed workflow changes without weakening protections to make checks pass.

Bounded capture lists27 uses entries including local reusable workflow. External actions use major tags (checkout/setup/upload/download, codex-action@v1, create-pull-request@v7), no40-character commit pins. No explicit action pin/update policy was located in reviewed guidance. VM tests cover inline scripts, not YAML schema/remote action integrity. No workflow protections were changed or weakened.

References: `.github/workflows/ci.yml`; `.github/workflows/ai-code.yml`; `.github/workflows/release.yml`; `.github/workflows/pr-title.yml`; `AGENTS.md`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-ACTIONS: maintainer defines tag-versus-commit pinning/review/update policy, reviews resolved upstream action identities/permissions and validates YAML plus representative event paths. If pins are adopted, make a normal reviewed infrastructure PR with preserved protections; source tags alone are not immutable provenance.

### A-R-26 — partial

Original: Define recovery from failed or partially completed publication, tag/package mismatch, and rollback/deprecation of a bad release; do not overwrite published versions.

Existing troubleshooting expressly leaves publication recovery undefined; no recovery was invented as completed. This wave delivered a concrete maintainer-review draft covering absent/partial/mismatched registry/tag/release states, immutable versions, owner-reviewed completion/corrective release/deprecation or dist-tag decisions and post-action integrity verification. It authorizes no action and has not been adopted or exercised.

References: `docs/troubleshooting/validation.md:60`; `packages/ui/release.config.mjs`; `.github/workflows/release.yml`; `docs/developer/final-acceptance/wave-02-12/release-recovery-draft.md`.

Checks performed: Read release configuration/troubleshooting and wrote release-recovery-draft.md only inside owned directory; no publication/recovery command ran.

Successor: R-RECOVERY: maintainer adopts/reviews draft against installed release plugins, assigns release/incident owners, links maintained policy and records offline partial-failure state-table drill. Any live mutation remains separately human-approved; never overwrite versions/move public tags to manufacture success.

### A-R-27 — partial

Original: Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs.

Main pushes/non-dev PRs/workflow_call wire full validation, release waits for reusable validation and approved dev PR pause remains explicit. Setup lists Validate Node22.12.0/24 and conventional-title but omits new Next.js docs required-context review; caller prefixes can differ. Actual rulesets/protection and default-token AI PR checks are unverified, so configuration cannot close enforcement.

References: `.github/workflows/ci.yml`; `.github/workflows/pr-title.yml`; `.github/workflows/release.yml`; `docs/github-setup.md:10`; `.github/workflows/ai-code.yml`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-PROTECT: owner inspects exact current PR/main/reusable/AI check display contexts and required rulesets, includes Next.js docs where release-blocking, proves failure/missing checks block merge/release, preserves approved dev exception and records head/run/settings receipt. Do not alter protection from this audit.

### A-R-28 — partial

Original: Validate release configuration safely without publishing while implementing it; explicitly control whether final migration merges will trigger the first public release or a subsequent major release.

Safe analyzer/title tests pass at unchanged FA-04 inputs; no semantic-release publish/dry-run or remote state mutation was executed. Main-only automatic release consequence and first1.0.0 policy are documented, but local empty tags do not establish no published package. Complete breaking delta and explicit human decision for final release-bound merge remain pending.

References: `packages/ui/release.config.mjs`; `packages/ui/scripts/release-policy.test.mjs`; `docs/developer/final-acceptance/fa04-release.txt`; `README.md:140`; `AGENTS.md:1`.

Checks performed: Read original requirement and cited source; compared relevant saved input/output hashes and reused FA evidence.

Successor: R-RELEASE-DECISION: owner verifies remote tags/registry/last release without exposing credentials, reviews normalized breaking ledger and required final checks, and records explicit decision that an approved main promotion triggers first publication or subsequent release. If a safe release simulation is needed, use reviewed nonpublishing isolated fixtures; no local publish/version edits.
## Concrete documentation correction package (R-DOC)

The following text is ready for the coordinator/maintainer's documentation task. It is proposed replacement prose, not a modification to active guidance in this conversation.

For the active CI/build paragraph in `docs/github-setup.md` and troubleshooting:

> Each full library matrix job runs `pnpm check` and `pnpm build:browser-docs` from `packages/ui`, then executes the packed foundation/editor fixtures serially. Node 24 additionally executes Chromium, Firefox and WebKit native interactions/axe/performance checks, foundation hydration and the packed Next.js production/browser consumer. The separate Next.js docs job runs the root `pnpm check:docs` and `pnpm build:docs`, then the docs Chromium tests. Storybook has been removed. Historical Storybook receipts retain their original host names and do not become replacement-host browser evidence.

For current artifacts:

> Successful matrix jobs upload `sgui-package-node-22.12.0` / `sgui-package-node-24` and `sgui-browser-docs-node-22.12.0` / `sgui-browser-docs-node-24`. Logs use `sgui-validation-node-*`; browser evidence uses `sgui-browser-node-24`. All configured retention is 14 days. Verify actual producing run, exact head, artifact IDs, hashes and continued availability before reuse; absence or expiry is not a pass. Preserve the old dated artifact tables as historical evidence.

For AI scope and generated evidence:

> The component AI workflow permits `packages/ui/src/`, `apps/docs/examples/`, `apps/docs/native-fixtures/scenarios/`, `docs/` and `README.md`, subject to explicit shared-system exclusions in both patch guards and semantic maintainer boundaries. Foundation, theme, adapters, i18n, experimental implementations, hooks, shared architecture/contracts, public exports/models, dependencies/package/workflow/agent changes require maintainer work. It does not authorize all work merely because a path falls inside a permitted prefix. The proposal job checks the applied patch, title, `pnpm check` and `pnpm build:browser-docs` before opening a draft. Its body preserves Task IDs, Behavior and owned contracts, Examples and tests, Validation evidence and Unverified limitations, plus a workflow receipt binding the base and patch SHA-256 to completed commands/run. That receipt is not a tested future PR commit and does not establish the full browser/packed matrix or credential isolation.

For issue/PR evidence fields, replace requests for “stories” with:

> Docs playground/reference examples, source-context unit fixtures and docs-owned native scenarios covering changed props/states; exact behavior cases, source/copy correspondence, targeted commands/results and tested head/patch identity. Record omitted or failed checks and preserve separate broad acceptance requirements.

For local browser troubleshooting, active commands should be checked against `packages/ui/playwright.config.ts` and `build-browser-docs.mjs` when adopted. Build current docs-owned native fixtures (`pnpm build:browser-docs` from root), coordinate fixture/server ownership and run the bounded authorized selection. Do not preserve an obsolete Storybook port/host assertion by substituting a guessed replacement port. The source test helpers still use historical scenario IDs internally; preserve mapped assertions rather than renaming evidence to imply a new run.

For required-check guidance:

> Confirm current matrix display contexts, `Next.js docs`, `conventional-title` and any reusable caller prefix on an actual production-bound PR. An owner must inspect and record required ruleset contexts; this document does not assert they are configured. Preserve the explicit dev PR automatic-CI pause. A generated AI draft and its proposal receipt do not prove its future PR head has full required validation.

## Owner/operator evidence receipt schema

Use one redacted receipt per real verification, avoiding duplicate validation for an unchanged artifact. Fields required for R-CI/R-PROTECT/R-AI-LIVE/R-OWNER/R-RELEASE-DECISION:

| Field | Required observation |
| --- | --- |
| Identity | Exact commit plus working-tree delta/patch hash if applicable; library source digest and built/tarball integrity |
| Run | Event, ref, actor/owner, run/job URL, Node/pnpm/TS/browser versions and command/arguments |
| Outcome | Actual conclusions, failed/unrun/skipped scopes, runtime diagnostics; never infer from absent check |
| Artifacts | Name, ID, bytes/hash, producing run and observed expiry/retrieval; preserve failed receipts |
| Protection | Actual required context names/ruleset, reviewer authorization and evidence that failed/missing gates block production |
| AI identity | Applied patch/base and resulting PR head; generated-code execution and token/permission review; pending approval state |
| Publisher | Owner/date and redacted scope/package control, chosen token/OIDC route, effective CLI, tag/release rights and provenance requirement |
| Release decision | Verified last published/tag state, breaking-change reconciliation, final checks and explicit human-approved main-promotion consequence |

Empty/unknown owner cells remain open prerequisites. No secret/token value belongs in a receipt. A source/configuration recommendation cannot fill an observed-runtime or owner-approval field.
