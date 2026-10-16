# Wave 03-16: navigation behavior probes

**0 complete, 3 partial.** Prepared a cleanly applicable fixture/spec/documentation patch for the actionable H-02/H-03 successors. No production implementation change is justified by the inspected contracts. No native execution, acceptance closure or checklist/count change is claimed. A-M-10 retains its explicit requirement-decision successor.

Only this directory was written. The shared dirty dev checkout, other owners' work, generated registries/manifests, user workspace and server 3000 were preserved. No install/build/server startup, unit/native suite, lease mutation, Git mutation or release action occurred.

## Reviewable deliverables

- `routing-probes.patch`: extends the existing private Routing fixture with independently stateful navigate-only/custom-Link compositions of Menu, Breadcrumbs, SideNavigation and styled Link; adds six focused browser cases; clarifies composed routing ownership in host-adapter documentation. Existing fixture exports and browser assertions remain intact; no registry generation is needed to discover another export.
- `proposed-files/`: exact intended three-file mirrors. `navigation-composed.spec.ts` also provides an easy-to-read copy of the proposed browser spec.
- `validation-plan.json`: exact coordinator integration/build/type/browser commands and expected assertions. The six new cases produce 18 planned executions across the three configured desktop engines, plus two existing adapter cases per engine to check the extended fixture. These are planned counts, not passes.
- `check-proposals.cjs` / `proposal-typecheck.json`: read-only TypeScript overlay at intended repository paths, checked against current built public declarations. Final result: zero diagnostics, Node v26.5.0, TypeScript 5.9.3. This does not execute browser behavior or establish Node22/24 support.
- `input-receipt.json` / `capture-inputs.py`: exact current hashes and bounded input comparisons. All 36 parallel-13 scoped inputs match; all 28 saved ExperiencePageNavigator runtime-closure inputs match wave-02-01; all 53 direct scoped built files match coordinator-integration. No assertion about the entire transitive dependency/output graph follows.
- `patch-check.json`: `git apply --check` exit 0; patch unapplied. Earlier checker setup/import errors are retained in `proposal-typecheck-first-failure.txt` and `proposal-typecheck-initial-diagnostics.json`; corrected checker/imports subsequently passed.

## A-H-02 — partial

Original requirement (verbatim assignment):

> Reconcile original `H-02`: Verify modifier clicks, downloads, external links, targets, default prevention, and navigation callback ordering through browser tests. Exact-byte transfers and native semantics in all three engines, CI 37560065588; browser evidence. Historical status: checked.

Retain historical exact-byte empty/named/boolean transfers and native-link assertions from [browser acceptance](../../react-aria-browser-acceptance.md), at their original head/host. The [parallel-13 report](../parallel-13/report.md) explicitly records the older implementation delta and missing raw historical artifact. Unchanged current source hashes preserve that reconciliation; they cannot turn the historical browser run into a fresh docs-host matrix. The earlier one-case custom-router Chromium receipt remains bounded to its original environment. No generic transfer audit was repeated.

Concrete remaining probes now exist: both adapter modes assert pointer and Enter consumer→navigate→prevented bubble ordering and cancellation; actual ControlOrMeta and target=_blank popups; a same-origin relative named download with exact saved bytes, filename and failure outcome; download=false routing; explicit external native activation. The relative download deliberately reaches the host CustomLink, unlike an absolute data URL that bypasses it. Browser attachments retain raw popup URLs, saved download, callback snapshots and browser errors. No synthetic click is presented as a native modifier result.

Source review found the existing implementation already invokes consumer onClick first, respects defaultPrevented, preserves native bypasses and prevents default before navigate. CustomLink owns its own equivalent policy by public contract; SGUI adds no second handler. Therefore this patch adds executable evidence rather than an unsupported production change.

Remaining: coordinator integrates and executes the focused cases using one immutable fresh fixture host, Node22/24, configured engines, no retries. Reconcile actual results/hashes before any leaf closure. Patch-only/typecheck success does not close runtime acceptance.

## A-H-03 — partial

Original requirement:

> Reconcile original `H-03`: Integrate React Aria routing where needed behind the existing host adapter; avoid two competing navigation systems or a runtime Next.js dependency. Historical status: open.

Menu uses React Aria interactions but routes eligible hrefs through the existing adapter navigate function. Breadcrumbs/SideNavigation leaf links compose the shared Link and may delegate to the host custom Link. These are paths to one host owner; Menu need not instantiate the custom Link. Menu's onAction is a notification, and host handlers must avoid also routing the same href. The documentation patch makes this boundary explicit and fixes its removed story-file reference. No library/framework dependency or new router provider is introduced.

The composed fixture and first browser case implement the previously missing H03-COMPOSED successor: pointer/Enter exact one-route counts, one SideNavigation select/Menu action notification, Menu replace, disabled route item semantics, accepted pathname/current-link presentation, host pathname replacement without navigation, retained DOM anchor identity and focus via forwarded ref. Other new cases exercise native bypass and cancellation under custom delegation. The host is an in-memory representative adapter, not a framework history/backend simulation; framework-specific acceptance remains outside this criterion.

Existing Menu/adapter unit assertions are reused because the inspected inputs match parallel-13; they are DOM evidence only. Remaining: integrate, build and execute the new native composition cases. Do not add a second router or a runtime Next dependency merely to satisfy wording. No runtime result is asserted here.

## A-M-10 — partial

Original requirement:

> Reconcile ExperiencePageNavigator final acceptance: Previous/next boundaries, labels, disabled states, link/action semantics. Link its `F-C10`, `T-C10` and `V-C10` evidence and any unresolved defects.

The shipped public contract still supplies pages/activePageKey plus select/add/remove/rename/reorder callbacks, translated labels and readOnly mutation suppression. It has no previous/next or href model. Its first/last Move up/down constraints are **reorder boundaries**, not adjacent route navigation. ReadOnly still permits page selection. The saved 28-file runtime closure, all four unit files and four native fixture/spec inputs also match wave-02-01 in the input receipt; no redundant authoring-list tests or invented API changes were added.

Retain F-C10/T-C10 baseline/regression reconciliation from [wave-02-01](../wave-02-01/report.md#a-m-10--partial), the [page navigation contract](../../react-aria-page-navigation.md), and [inventory contract disposition](../../react-aria-inventory-contract-reconciliation.md). Retain V-C10 native authoring-list/presentation evidence in the same prior report and [HB-14](../../react-aria-hardening-execution.md), including accepted/rejected host edits, localized names, menu commands and focus. These do not fulfill absent previous/next/link clauses. Historical unavailable raw artifacts remain unavailable; no new runtime was inferred.

Remaining external evidence: a product/API owner must explicitly approve authoring-list scope with disposition of previous/next and link clauses, or approve a separate adjacent-navigation contract. No such decision was present in assignment/prior reports/coordinator evidence. This requirement mismatch blocks that successor, while the full leaf remains partial with its accepted authoring evidence intact. An agent cannot fabricate owner approval. Once decided, coordinator can reconcile the criterion or assign the approved API/examples/native behavior work. H-02/H-03 probes remain independent and ready to integrate.

## Checks and limits

Actually executed: focused file/guidance reads; saved-hash comparisons; `node docs/developer/final-acceptance/wave-03-16/check-proposals.cjs`; `python3 docs/developer/final-acceptance/wave-03-16/capture-inputs.py`; `git apply --check docs/developer/final-acceptance/wave-03-16/routing-probes.patch`. The last two checks are read-only outside this directory. Lease helper was inspected; a foreign calendar-options lease was observed, with its exact owner recorded in input-receipt.json. No claim was acquired, bypassed or reclaimed. Only installed Node26.5.0 was used for pure TypeScript tooling, not a unit/runtime support assertion.

Native browser/device/AT/real zoom, framework history, complete packed/production validation and human release/legal approval are not supplied by these artifacts. Coordinator receipt for BUG0008–0012 and A-G02/A-K16 remains untouched. Starting count153 A /20 V /6 future is not revised by this report.
