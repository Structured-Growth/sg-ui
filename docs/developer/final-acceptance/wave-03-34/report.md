# Wave 03-34: current consumer guidance and documentation integrity

Prepared on modified dev, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Only `docs/developer/final-acceptance/wave-03-34/` was written. **12 current guide/template patches are ready for review; all six original A leaves remain partial until integration and their named residuals are complete.** No ledger/count change or release action.

## Reviewable deliverables

`current-guidance.patch` and `proposed-files/` contain exact current-base edits. `patch-inputs.json` records base/result SHA-256 values. The patch passes `git apply --check` and remains unapplied. `prepare.py` reproduces it from matching inputs.

The patch replaces stale story/build instructions, adds the independent Example/playground/template recipe and baseline smoke limits, documents current defaults and removed AppButton imports, updates AI proposal scope/report guidance, corrects direct library-script cwd and the license checklist anchor, updates issue/PR wording, and separates current dependencies from historical notices. It preserves dated Storybook evidence and original extraction provenance.

## Validation and evidence reuse

The bounded proposed-guide audit checks **161 local links**, **39 manifest script references**, and **9 direct-script paths** with zero current scoped issues. It checks heading fragments and explicit reference-style/HTML forms where present. The fresh inline-path scan covers 440 documents / 3757 links and still finds **118 historical/excluded missing targets**, recorded individually rather than rewritten. The one prior maintained broken path is already fixed in shared source. One additional real stale heading link was found in the license guide and corrected in the patch.

`check-types.cjs` compiled the proposed migration example plus grid/native-callback contract assertions with **zero diagnostics** (TypeScript 5.9.3, Node v26.5.0); all three negative directives were consumed. The **25 consumed built declaration hashes match coordinator-integration evidence: True**. This is a pure compiler result against existing output, not a fresh supported-runtime build, browser or AT result. Python audit used Python 3.9.6. Exact commands/stdout/exit codes: `validation-log.json`.

`input-comparison.json` records prior/current input comparisons. Reused prior reports only for their stated documentation/provenance scope; exact report hashes match the assignment. Current dependency-upgrade guide already has coordinator improvements, so stale prior replacements were skipped rather than overwriting it. `initial-findings.json` preserves a labeled summary of corrected audit findings/false positives. No install/build/catalog generation/server/browser/lease acquisition or shared Git mutation occurred.

## Original leaf results

### A-W-06 — partial

- [ ] A-W-06 Reconcile original `W-06`: Update the source-guidance mapping to show each retained/adapted/omitted rule and why app database/API/login policies remain outside SGUI. Historical status: open.

Replaced positive new-story instructions in the source-guidance mapping with ordinary docs examples/native fixtures and production scopes. Preserved original source commit and omitted database/API/login rationale.

**Residual:** W06-INTEGRATE: review/apply docs/agent-guidance-migration.md hunk and run bounded link audit.

**Evidence:** `patch-inputs.json`, `audit-result.json`, `types-result.json`, `input-comparison.json`, `validation-log.json`; exact commands and runtimes above. Proposed patch still needs integration.

### A-W-07 — partial

- [ ] A-W-07 Reconcile original `W-07`: Create one canonical component recipe: owned props, native attributes/refs, React Aria mapping, tokens/CSS, stories, behavior tests, public export, and acceptance criteria. Historical status: open.

Recipe now requires independent Example owners, prop playgrounds, copyable public source, Button template/documentation and catalog registration. Baseline smoke coverage is explicitly 1–3 meaningful cases; later regression/hardening stays separate.

**Residual:** W07-INTEGRATE: review/apply canonical recipe hunk and recheck live policy links.

**Evidence:** `patch-inputs.json`, `audit-result.json`, `types-result.json`, `input-comparison.json`, `validation-log.json`; exact commands and runtimes above. Proposed patch still needs integration.

### A-W-13 — partial

- [ ] A-W-13 Reconcile original `W-13`: Publish a consumer migration guide mapping imports, removed styling props, theme objects, typography, grid types, pagination/selection, icons and changed defaults. Historical status: open.

Added current import/removal/default/compatibility map and a typechecked native-ref/Button example. Public grid Set<string>/pagination shape assertions and rejected retired props accompany the guide. Retained existing theme/typography/icon/grid/host migration table.

**Residual:** W13-INTEGRATE: apply migration hunk; W13-FINAL-MAP: reconcile complete versioned public breaking/default map with API acceptance owner; no exhaustive all-export map claimed.

**Evidence:** `patch-inputs.json`, `audit-result.json`, `types-result.json`, `input-comparison.json`, `validation-log.json`; exact commands and runtimes above. Proposed patch still needs integration.

### A-W-17 — partial

- [ ] A-W-17 Reconcile original `W-17`: Update component architecture, GitHub setup, commercial licensing, package fixtures, issue/PR templates, and troubleshooting for final behavior. Historical status: open.

Patched current branch/build/artifact/cwd guidance and issue/PR evidence wording. Setup now matches current AI prompt allowlist/report/receipt. Commercial text distinguishes configured public distribution and current dependency declarations from retained historical notices. Existing historical runtime receipts are preserved.

**Residual:** W17-INTEGRATE: review/apply guide/template hunks. Owner separately verifies actual repository/npm settings; counsel reviews commercial terms and exact artifact attribution.

**Evidence:** `patch-inputs.json`, `audit-result.json`, `types-result.json`, `input-comparison.json`, `validation-log.json`; exact commands and runtimes above. Proposed patch still needs integration.

### A-W-18 — partial

- [ ] A-W-18 Reconcile original `W-18`: Document known limitations, deferred features, support policy, deprecated names, release impact, and the cost/responsibility of eventually replacing React Aria. Historical status: open.

Existing limits/engine replacement cost preserved. Migration now links explicit pending support/backport/cadence/owner/intake decisions and distinguishes preserved compatibility exports from a deprecation schedule. No operational decisions or approvals fabricated.

**Residual:** W18-OWNER: record supported-release/backport window, review cadence/accountable maintainer and confidential intake/disclosure policy; W18-API: reconcile full release-impact/default/public-experimental map.

**Evidence:** `patch-inputs.json`, `audit-result.json`, `types-result.json`, `input-comparison.json`, `validation-log.json`; exact commands and runtimes above. Proposed patch still needs integration.

### A-W-19 — partial

- [ ] A-W-19 Reconcile original `W-19`: Check all local doc links, exported example types, referenced file paths, and commands; docs-only updates do not require unrelated UI tests. Historical status: open.

Bounded proposed-guide audit passed links/anchors/reference/HTML forms, manifest script names and direct-script paths; found and repaired a real stale current anchor. Fresh all-doc inline-path scan retains exactly 118 missing historical/excluded targets. Compiled new guide snippet and public type contract assertions; no blanket snippet/runtime acceptance claimed.

**Residual:** W19-INTEGRATE: apply current fixes; W19-DISPLAYED-SOURCE: run existing catalog browser source compilation at frozen integrated build; W19-BROAD-LINKS: broad reference/HTML/anchor/inline-code checks outside maintained scope remain unperformed.

**Evidence:** `patch-inputs.json`, `audit-result.json`, `types-result.json`, `input-comparison.json`, `validation-log.json`; exact commands and runtimes above. Proposed patch still needs integration.

## Coordinator handoff

Review matching-base hunks and execute `validation-plan.json` in the authorized validation window. Reuse unchanged declaration/package receipts within their bounds. The existing catalog test is the requested route/source compilation gate after an integrated frozen build; it has not run here. Broader all-document reference/HTML/anchor and inline-code source-path certification is still open. No full repository link/type/command or operational support acceptance is inferred. Owner support decisions, actual administration and counsel review remain external.
