# Fix 11 — publish reconciled calendar limits

Completed **K16-publish-reconciled-limits**, the documentation successor of A-K-16. No shared ledger, checklist or count was changed. This report proposes closure only of that named publication successor; the coordinator owns final A-K-16 reconciliation. No calendar behavior, browser, clipboard or AT gate closes here.

Original A-K-16 obligation: “Publish feature limits honestly; React Aria provides useful building blocks, not a complete recurrence or resource-scheduling engine.” Read the exact row in `react-aria-hardening-tasks.md` and retained K-16 history in `react-aria-scope-ledger.md`; the historical checkmark is not inherited acceptance. The wave-02-11 publication successor requires: “Replace outdated initial scope/availability/preset paragraphs using the supplied report wording; retain the meaningful experimental, matrix, native clipboard/AT and host-owned timezone/business-policy limitations. State shipped comparison/Gregorian period features, narrow English relative grammar and availability-callback gaps until fixed.”

## Actual edits

Only `docs/developer/react-aria-calendar-contracts.md` and this fix directory were written. The guide now incorporates wave-02-11's supplied scope and accessibility wording, adapted to the current shared source:

- States existing experimental arbitrary multiple dates, inclusive ranges, local datetime/time fields, Gregorian week/month/quarter/year selection and atomic comparison modes. Distinguishes month/year navigation from selecting a whole period, inclusive adjacent previous-period length from previous-year endpoint clamping, and host custom policies from library calculations.
- Replaces pressed Button/visible-description/bordered-card preset prose with single-select rows, checkmark/selected background, associated visually hidden descriptions and keyboard operation. Preserves side/above/end placement, disabled availability rules and the default Apply versus immediate commit distinction.
- Clarifies initial day-range completion in either direction under every click policy, separate from completed-range adjustment/restart/active-endpoint rules, fixed duration and whole-period activation. Keeps explicit Apply/Cancel and controlled authority; immediate mode does not undo earlier commits on Cancel.
- Publishes BUG-0010/K04 and BUG-0011/K17 successors. Their concurrent candidate-validation and callback-reason plumbing is visible in inspected source; neither is claimed validated. Links the original wave review and dispatch until coordinator integration supplies affected results.
- Keeps civil serialization, explicit reporting reference dates, timezone/DST disambiguation, bounded English relative grammar, localized digits/weekday distinctions, dependency-free relative engine, fiscal/business/holiday host policy and recurrence/resource/booking/persistence exclusions.
- Separates historical batch61/FA-04 evidence from present contracts and explicitly limits native clipboard, paste/autofill, replacement-host browser, locale/calendar/device/touch/zoom and spoken AT claims. Preserves complete date names, hidden supplemental decorations and private association cleanup boundaries. The old `#initial-scope-and-accessibility-limits` fragment remains an explicit anchor for historical inbound links.

`contract.patch` records only this conversation's delta against its incoming already-modified guide; it does not imply ownership of the existing checkout changes.

## Exact source/target checks

Base HEAD: `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, branch `dev`, dirty shared checkout. `input-receipt.json` captures 24 inspected inputs individually with SHA-256, including instructions, final execution ledger, full original obligation rows, wave report/results/probe, dispatch, public export barrel and the relevant source. No built-output freshness is inferred.

Target before SHA-256: `5ecd4a8cc05e993f946e999be0736093f05ebef82db8e0244c7b5a97e95bbf02`.

Target after SHA-256: `f9827337a07c98681410bed8259269b238723906941cc012bc0efb62c0b4ecbf`.

Executed from repository root:

```sh
python3 docs/developer/final-acceptance/fix-11/check.py
```

Exit 0: **16/16 documentation/source checks passed; 9/9 local guide links and their heading anchors resolve; zero inspected input hashes drifted** at the recorded check time. `checks.json` stores the exact assertions, paths, timestamp and post-edit target hash. Source checks cover actual ListBox rendering, reverse completion and click policies, public composition exports, inclusive comparison arithmetic, year shifts, period units/week starts and pending availability plumbing. These are text/source inspections, not executed interaction assertions. Also reviewed the complete scoped patch and checked the obsolete phrases were removed. Historical receipt files were read/reused, never rewritten or rerun.

## Remaining obligations and successors

- **BUG-0010 / K04-datepicker-entry-parity**: coordinator reviews and integrates typed/segmented/datetime availability parity, accepted values/form validity and the affected results from fix-08. Source existence here does not establish acceptance.
- **BUG-0011 / K17-callback-reason-access**: coordinator reviews/integrates dynamic reason access and replacement/removal behavior from fix-09, then records bounded native/AT evidence.
- **K07-paste-contract**, **K05-native-reflow-focus**, **K05-announcement-observation** and **K17-native-and-AT**: retain the wave-02-11 prerequisites and evidence boundaries. Trusted clipboard events, a fresh frozen source/build/fixture host and named operator AT/browser/platform observations require their separate work.
- **K12 selected-composition behavior** and remaining calendar/locale/device acceptance stay coordinator-owned. Publishing existing feature contracts is not proof of all their implementation behavior.

No runtime/generated files, other reports or shared counts were edited. No stage, commit, push, version, release, install, server, build, broad suite, native/browser/consumer run, remote CI, legal review, manual/device/AT result, agent/thread spawn or message to another conversation was performed. Documentation-only validation follows the repository's guidance-only policy and the assigned task boundary.
