# A-A-06 / A-A-07 acceptance reconciliation

Both assigned leaves are **partial**. No acceptance checkbox is closed. Source base is
dev HEAD 540f47d4059a9cea8890b80927f34f51ef2fbc3e with the existing uncommitted
working tree, inspected on 2026-10-16. This report compares against the full original
A-06/A-07 wording in react-aria-scope-ledger.md:126–127 and the corresponding
A-A-06/A-A-07 leaves in react-aria-hardening-tasks.md:156–157.

## Evidence and execution limits

- Read AGENTS.md and react-aria-final-acceptance.md before analysis. No source,
  shared ledger, generated metadata, dependency, build, server or release changes.
  Final audit files live only in this parallel-04 directory.
- [Input reconciliation](input-reconciliation.json): 994 maintained library/config
  and root-manifest inputs compared to FA-02 inputHashes with FA-04's four recorded
  corrections applied; **zero deltas and zero new library source files**. Includes
  all library tests, scripts, runtime source and styles present in that snapshot,
  plus the lockfile. This comparison is dated, not a frozen-checkout guarantee.
- Reuse [FA-04 original check](../fa04-original-check.txt), its
  [four-file delta](../fa04-library-input-delta.json), and
  [affected rerun](../fa04-calendar-rerun.txt). The original command failed nine
  cases; the corrected affected rerun passed ten cases. The accepted ledger
  reconciles 1,738 cases in 279 suites for those inputs. This audit does not
  represent the original all-in-one command as passing, or rerun those suites.
- New isolated jsdom audit: [test source](acceptance.test.tsx),
  [configuration](vitest.config.mjs), [initial transcript](reproduction.log),
  [one-case correction](select-correction.log). Initial run: 10 passed, one
  harness query failed because Select's accessible name includes the value
  ("Active Status"). Only that case was rerun after correcting its query:
  one passed, ten deliberately filtered/skipped. Combined evidence covers
  **11 distinct passing characterizations**, six of which demonstrate defects.
  Passing a defect characterization is not a product acceptance result.
- Commands, from packages/ui:
  `pnpm exec vitest run --config ../../docs/developer/final-acceptance/parallel-04/vitest.config.mjs`;
  correction adds `-t 'EXCEPTION:'`. One worker, cache disabled. No broad test,
  build, browser, consumer, installation or server command was run.
- These are Node 26.5.0 / React 19.2.3 / jsdom results (Vitest 4.1.11), not browser, touch-device,
  hydration, spoken-AT or all-supported-version conformance. Node/pnpm/React
  versions and durable evidence hashes are recorded in results.json. Node 26 is
  outside the configured Node 22/24 CI matrix; this run adds no Node 22/24 proof.
- Historical Button Chromium/WebKit evidence at frozen head
  0c6fc7664e1faffee0071ac55e48390603bfd748 is described in
  [parallel-batch-13/control-button.md](../../parallel-batch-13/control-button.md).
  It used the removed Storybook host. Its two passing cases are retained as
  historical evidence, not claimed as current docs-host execution.

## A-A-06 — partial

Original obligation: standardize controlled/uncontrolled pairs, defaults, callbacks,
null/empty semantics, disabled/read-only/loading and stable IDs. Substantial owned
contracts exist, but the confirmed disabled/read-only defect below prevents closure.

Paths in the following table are under packages/ui/src. Tests are reused from
FA-04 unless explicitly identified as the new isolated audit.

| Concern | Observed contract and source | Explicit behavior evidence / limits |
| --- | --- | --- |
| Text values | experimental/TextField/TextField.tsx: value/defaultValue/onValueChange(string); undefined chooses internal state, default empty string. Native reset restores latest default without edit requests; controlled value remains host-owned. TextArea has the same string contract. | TextField.test.tsx:20,28,59,77,86,110,131,142 cover edits, host rejection, latest defaults, canceled reset and external form reassociation. TextArea/TextArea.test.tsx retained. Null is not a declared text value. |
| Boolean fields | Checkbox and Switch use checked/defaultChecked/onCheckedChange(boolean), default false. Mixed Checkbox is presentation independent of checked form value. Disabled inherited fieldsets are checked before label changes; readOnly blocks editing. | Checkbox/Checkbox.test.tsx:17,24,48,60,89,103,123,133,143; Switch/Switch.test.tsx:15,21,28,43,57. Collection Checkbox slot="selection" deliberately inherits the collection authority rather than local state. |
| Single selection | Select/Select.tsx and ComboBox/ComboBox.tsx declare string IDs or null; undefined is uncontrolled, null explicitly clears, labels do not identify records. RadioGroup value accepts null but defaultValue and change callback are string-only. | Select.test.tsx:9,17,28; ComboBox.test.tsx:50,64,77; RadioGroup.test.tsx:22,49,65,84. Removed/disabled radio selections preserve host authority without inventing a replacement request. |
| Multiple selection and loading | AsyncMultiSelect value/defaultValue contain selected records; empty array clears, null is not declared. Query is separately host-controlled. Loading/error blocks result selection, while selected-token removal/query editing remain separate operations. | AsyncMultiSelect.test.tsx:45,56,68,99,116,136,198. Source AsyncMultiSelect.tsx:48–94 keeps selected records outside search results, repeated hidden fields and busy state. Loading is not a universal disabled flag. |
| Search | SearchField value/defaultValue/onValueChange(string) defaults empty; native reset silent; loading/error suppress results, query remains editable. Result selection and full-search callbacks are separate actions. | SearchField.test.tsx:8,17,26. Source SearchField.tsx:67–93,114–126. No null query contract. |
| Actions | Button disabled blocks focus/action; loading suppresses action and retains focus; default type button, variant filled, tone primary, density inherited. SplitAction also closes/blocks its secondary menu during loading/disabled. | components/Button/Button.test.tsx:10,23,46,77 and public-contract tests; experimental/SplitAction/SplitAction.test.tsx. Loading is available only where declared; no universal loading/readOnly prop should be invented. |
| Toggle state | ToggleButton selected/defaultSelected/onSelectedChange(boolean); ToggleButtonGroup selectedIds/defaultSelectedIds/onSelectionChange(string[]), single default, allowEmpty=true. | ToggleButton.test.tsx:10,19,28,36,54,66,85 and next100 defaults/remount case. The new audit additionally supplies both action and selection callbacks together. |
| Visibility / tab state | Menu, Popover, Tooltip own open/defaultOpen/onOpenChange; Disclosure expanded/defaultExpanded/onExpandedChange; Tabs value/defaultValue/onValueChange and enabled-item fallback for missing uncontrolled state. Dialog is explicitly controlled open/onDismiss, Pagination controlled zero-based page/onPageChange. | Menu.test.tsx:88; Popover.test.tsx:48; Tooltip.test.tsx:48,61; Disclosure.test.tsx:21,34; Tabs.next100-regression.test.tsx:11. These intentionally differ by domain, not by upstream event type. |
| Dates / time | DateField/DatePicker/TimeField and range families use ISO strings or owned range records/null; undefined chooses uncontrolled; drafts are distinct from committed values. New PeriodPicker/DateTimeRangePicker/DateRangeComparisonPicker also use explicit undefined checks and default null. | DateField/TextDateField.test.tsx:8,22; TimeField/TextTimeField.test.tsx:8,17,31; DatePicker.native-transactions.test.tsx:68; DateRangePicker.controlled-transactions.test.tsx and FA-04 affected rerun. No universal promise that incomplete drafts equal cleared committed values. |
| Stable identity | React useId names/associations in Checkbox, Switch, RadioGroup, Disclosure, SearchField and range inputs; collection IDs are stable host records, not labels. React Aria supplies associations for its wrapped controls. | RadioGroup.test.tsx:22,49; Tabs.next100-regression.test.tsx:11; ToggleButton.test.tsx:66; Tooltip.test.tsx:48; independent field/reset tests above. This does not establish native hydration IDs for every public control. |
| Grid / host compositions | State authority belongs to the host or documented persisted view state; components need not offer every uncontrolled counterpart. See react-aria-grid-contracts.md "State authority and transactions", plus AppPageTabs, AppModal and editor-specific contracts. | Full grid/editor all-export matrix was not independently reconciled here. Their separate A-G/A-E leaves and 20 editor V leaves remain open. |

### Confirmed defect P04-F1: Clear bypasses a newly disabled/read-only host

Affected implementations:

- experimental/PeriodPicker/PeriodPicker.tsx:34,44.
- experimental/DateTimeRangePicker/DateTimeRangePicker.tsx:38,46.
- experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx:39,47.

Reproduction: render a non-required picker with an existing default selection;
open its panel; rerender the same mounted instance with disabled=true or
readOnly=true; activate Clear. All **six** cases retain an enabled Clear button
and request onValueChange(null) exactly once. The uncontrolled selection clears.
Expected: no edit request or committed-value mutation once disabled/readOnly.
The trigger and Apply are blocked, but the already-open panel persists; Clear only
checks required, and accept/change has no disabled/readOnly guard.
The isolated audit asserts the actual faulty behavior, making it reproducible.

Successor P04-S1: fix all three Clear disabled expressions and defend their commit
boundaries against disabled/readOnly. Preserve permissible Cancel/dismissal and
controlled authority. Transfer six assertions to colocated regression tests with
expected zero callback/unchanged selection, including a rejecting controlled host;
add a focused docs-owned native transition check only for the changed flow.
Do not rerun unrelated completed suites.

### Read-only focus exception P04-F2

Select.tsx:60 makes its readOnly trigger isDisabled and aria-readonly. The isolated
audit verifies native disabled=true while FormData still contains the selected ID.
This is more restrictive than react-aria-adoption-checklist.md's general
"Read-only permits focus/copy" guidance. Picker button triggers also explicitly
disable for readOnly. This is an actual contract difference, not a claim that all
readonly controls behave identically or an automatic accessibility failure.

Successor P04-S2: reconcile the general guidance with the intended Select/picker
focus policy. Either document the exception precisely or implement focusable,
non-activating readonly triggers and validate focus/opening/form semantics.
Do not silently redefine disabled as readOnly across all controls.

Successor P04-S3: finish the all-public-control matrix, including grid/editor
state and default-mode transitions. Explicitly state that control mode remains
stable for a mount where required (already declared for Select/ComboBox).
Record per-component exceptions, null/empty/default/reset and ID/hydration evidence;
do not infer runtime support for controlled/uncontrolled switching from optional
props or useId source alone.

## A-A-07 — partial

Original obligation: specify native click versus normalized press, avoid duplicate
callbacks, document keyboard/touch activation. The central implementation and
focused behavior evidence agree; the stale consumer guidance and broader/native
limits below remain.

| Surface | Actual contract / duplicate handling | Evidence |
| --- | --- | --- |
| Button | onPress(): void; public props do not expose onClick or upstream events. Ordinary buttons use React Aria onPress only. Submit/reset buttons omit that handler and invoke onPress from one click capture before native form defaults. Loading reset changes native type to button and suppresses callback. | Button.tsx:10–40; Button.test.tsx:10,46,77; public-contract.test.tsx; historical two-engine receipt above. New programmatic click audit: button, submit and reset each invoke once; form event runs once only for submit/reset. |
| IconButton / ListItemButton | IconButton delegates ButtonProps and the same owned Button; ListItemButton is an owned Button wrapper. No independent native click plus press binding. | experimental/IconButton/IconButton.tsx; experimental/List/List.tsx; existing colocated action tests. |
| ToggleButton | onSelectedChange(boolean) and onPress() are distinct notifications. Supplying both legitimately runs each once, not one callback twice. | ToggleButton.tsx:10–21; new click/Enter/Space case yields three calls to each, selections true/false/true. Existing held-Space disabled-fieldset case asserts neither callback. |
| Links | Link extends native anchor attributes, including cancellable onClick(event); native modified-click/download/target behavior remains. SGLink calls the consumer click first and navigates only if unprevented, primary/unmodified, same-target internal navigation without download. | experimental/Link/Link.tsx; adapters/Link.tsx:14–20; Link/Link.test.tsx:9–38. Custom adapter Link owns forwarding/cancellation; it is not normalized onPress. |
| Menu and SplitAction | Menu onAction(id) is distinct from link navigation; selected item records are host-owned. SplitAction separates primary onPress and menu onAction, guarding secondary actions during loading. | Menu.tsx:67–91; Menu.next100-regression.test.tsx:11,34; SplitAction.tsx:19–30. Both navigation and host action for a link item are separate contracts, not automatically duplicate calls. |
| Search result / full search | Results with href use native Link onClick with primary/unmodified checks; action results use Button onPress. Input Enter with onSearch prevents native submit and requests full search; no fabricated click/press event enters host callbacks. | SearchField.tsx:81–93,124–126; SearchField.test.tsx:17,26. |
| Editor anchor callbacks | ContentEditorChrome now exposes onPress(anchor: HTMLButtonElement), obtains anchor from a ref, and renders owned Button. The anchor argument is an intentional composition contract, not the normalized Button event. | components/ContentEditorChrome/ContentEditorChrome.tsx:8–12,33–38; corresponding colocated tests retained in FA-04. |

### Confirmed documentation defect P04-F3

react-aria-button.md:42–45 incorrectly says ContentEditorChrome remains unmigrated,
uses a legacy button and sends a MouseEvent. Current source contradicts all three.
Successor P04-S4: replace that paragraph with the shipped owned Button and
onPress(anchor) mapping; explain native refs instead of event.currentTarget.
Also document ToggleButton's two distinct notification purposes, since both are
public and currently only selected/default/change are listed in remaining-controls.

Successor P04-S5: reconcile the remaining composed/public native-event surfaces
before claiming library-wide no-duplicate acceptance. Reuse the unchanged Button
tests and historical receipt, but keep old-host/head boundaries explicit.
Current docs-host keyboard/pointer and any required touch/AT checks need their
own scoped evidence; do not translate jsdom programmatic click into native AT
or a desktop engine into a physical touch-device result. No duplicate callback
defect was observed in this bounded slice.

No production acceptance, release, promotion or completion of the 20 V leaves is
claimed. The coordinator owns shared leaf counts and global defect-ID allocation.
