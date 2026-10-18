# Wave 04/01 — editor chrome and floating selection

Recommend **complete** for A-M-21, A-M-22, A-M-23 and A-M-25. Each prior named
successor now has accepted evidence. No component implementation gap or unresolved
component defect was found. [results.json](results.json) preserves every exact
original obligation, F/T/V mapping, source/evidence SHA-256 and disposition.
No additional test or implementation change is justified for these four leaves.

Delivered a two-target [documentation patch](documentation.patch) and exact
[replacement files](proposed-files). It corrects the contract's stale desktop
acceptance hold, documents visible-fragment anchoring after BUG-0013, and adds a
per-component acceptance record that links shipped contracts, exact unit/native
cases and HB-19/HB-20. This is substantive closure documentation, not another
unexecuted browser proposal. It does not repeat superseded wave-03 fixture patches.

## Original obligations and decisions

| ID | Original obligation | Recommendation and resolved successor |
| --- | --- | --- |
| A-M-21 | Reconcile DocumentEditorLayout final acceptance: Tokenized menu/toolbar/content layout and scroll boundaries. Link its `F-C21`, `T-C21` and `V-C21` evidence and any unresolved defects. | Complete. F/T retained; HB-19 resolves W03-C21-V and V-C21-04/05: tokenized regions, 320px theme/density/English/Arabic reflow, live slot replacement with preserved native draft/node/focus/scroll. |
| A-M-22 | Reconcile DocumentEditorToolbar final acceptance: Owned buttons/menus/toggles, formatting state, responsive overflow. Link its `F-C22`, `T-C22` and `V-C22` evidence and any unresolved defects. | Complete. F/T retained; HB-19 resolves W03-C22-V and V-C22-04/05: translated real heading/bold activation, wrapping optional groups, pressed/unavailable state and usable zoom. Deferred-heading lifetime tests remain intact. |
| A-M-23 | Reconcile ContentEditorChrome final acceptance: Menu composition, editor focus, disabled/loading actions, semantic structure. Link its `F-C23`, `T-C23` and `V-C23` evidence and any unresolved defects. | Complete. F/T retained; HB-19 resolves W03-C23-V and V-C23-04/05: named groups, title/action composition, host-dialog anchor and return focus, loading/unavailable suppression and RTL layout. Host selection ownership remains explicit. |
| A-M-25 | Reconcile FloatingTextSelectionToolbar final acceptance: Selection anchoring, focus preservation, overlay cleanup, keyboard access. Link its `F-C25`, `T-C25` and `V-C25` evidence and any unresolved defects. | Complete. F/T retained; HB-20 resolves W03-C25-V and V-C25-04/05 and fixes BUG-0013. Three-engine nested-boundary/focused-resize/offscreen/host-replacement results, exact-selection unit probes and cleanup assertions satisfy the named flows. Ordinary-editing wave-03 successor cases already passed all engines. |

No remaining concrete successor is required **within these four component
obligations**. Coordinator review and checklist reconciliation remain the final
administrative actions. Broader E/X/device/IME/trust/support/legal/production
obligations and six deferred future items remain separate.

## Evidence attribution

Baseline and current HEAD at capture:
`6c485ed79d0d6a521d188e5bde8315722296f518` on dev. Read AGENTS.md, master/baseline/
regression/hardening/final-acceptance records, original inventory acceptance,
wave-02-03, wave-03-23/25 and later integrated/follow-up evidence. The prior reports
were partial because presentation/RTL successors remained; HB-19/20 explicitly
resolve those successors. The active baseline/regression files record all F/T
complete; individual test mappings survive in next100-c21/c22/c23/c25.

[evidence.json](evidence.json) captures 220 initial source/evidence inputs,
including 75 files reached from the four component families by local import/export
traversal, and all retained HB-19/HB-20 logs/screenshots. It compares all 23 compact
receipt source rows. All HB-19 rows and all HB-20 implementation/assertion rows
match exactly. Since HB-19's commit, the traversed source changed only in the
floating implementation/test, both matched by HB-20. Shared Menu CSS is separately
matched to HB-20 and its 33 passing tab/overflow cases.

Retained outcomes, not new executions:

- HB-19: 9 cases across Chromium/Firefox/WebKit, encompassing 24 320px
  theme/density/locale configurations and 24 reviewed screenshots.
- HB-20: 24 primary configurations plus 12 affected Arabic continuation passes;
  48 reviewed Chromium captures at 360px and 150% text, 239 affected unit passes,
  18 focus/boundary passes, 33 tab/overflow passes. Of the 18, 12 are the four
  boundary cases across three engines and six are editor-focus presentation.
- Wave-03 follow-up: six specifically named Escape-to-typing/read-only-invalidation
  passes in native-final.log. The report's aggregate limitations remain intact;
  no whole-matrix green status is inferred from these six rows.

The compact receipts do not reproduce exact browser version strings. They remain
accepted historical engine/review receipts at their recorded source/build limits;
this handoff does not fabricate missing runtime metadata or re-review screenshots.
The graph traversal is not a full bundler/package-export graph. Hash equality is
not fresh execution or proof of all supported environments.

## Concurrent changes and verification

The initial strict receipt guard caught current full-file fixture drift. Inspection
shows only the unrelated ImageSources upload-retry scenario changed; the complete
HB-20 localized-presentation region and module imports are byte-identical to the
accepted committed fixture. [concurrent-fixture.diff](concurrent-fixture.diff) and
its region/hash disposition preserve this qualification. No changed upload behavior
is credited. A later strict check caught additive Calendar fixture-registry entries;
the verifier confirms every pre-existing accepted entry remains identical and records
the exact additive diff in [concurrent-registry.diff](concurrent-registry.diff).
Neither was changed or reverted by this owner.

Executed only lightweight read-only checks:

```sh
python3 docs/developer/final-acceptance/wave-04/01/verify.py
```

[checks.json](checks.json) and [verification.txt](verification.txt) record a pass:
original assignment IDs/text preserved; 75 source closure hashes checked; accepted
receipt inputs checked with the explicit fixture/registry qualifications; retained
named log outcomes found; two proposed Markdown targets have valid links and exact
hashes. The coordinator integrated the exact documentation targets while this
handoff was being finalized: the forward applicability guard recognizes the
already-integrated files and the reverse `git apply --check` passes. This owner
has written only within wave-04/01 and made no shared implementation/checklist,
index, branch, build, install, browser, simulator, commit or push changes.

[validation-plan.json](validation-plan.json) supplies runnable preflight/integration
instructions and bounded conditional unit/native commands if relevant behavior
changes later. For the delivered documentation-only patch, no new runtime job is
required. Do not apply the patch twice if verification says already integrated.

DOM, keyboard and screenshot results are not spoken screen-reader evidence.
Actual browser zoom, physical gestures, configured OS IME, physical clipboard,
consumer/support/owner/legal and release approvals retain their own obligations.

## Subsequent implementation assignment — A-M-27

After coordinator closure of the four original leaves, implemented the finite
successful-insertion announcement successor in [insertion/report.md](insertion/report.md).
The new [operation-result patch](insertion/operation-result.patch) contains two
unique files and additive manifest registration; static fixture/spec typechecking
and patch applicability pass. Native execution is coordinator-owned and pending.
This successor has its own [results](insertion/results.json) and does not reopen
or change the four original recommendations.
