# Parallel 05 — owned visual, naming and composition contracts

Date: 2026-10-16. Assigned leaves: **A-A-08, A-A-09, A-A-10**. All three remain **partial** against their full original obligations. This report records supported contracts and a concrete mismatch; it does not close a library-wide obligation on representative inspection.

## Evidence and boundaries

Read `AGENTS.md`, `react-aria-final-acceptance.md` and the complete A-A-08/09/10 entries in `react-aria-hardening-tasks.md`. Inspected architecture/proof/modal/token guidance, implementations and existing tests. Source base is modified `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. The companion `results.json` contains exact SHA-256 hashes for 89 inspected source/test/guidance files and eight reused evidence files. Of those 89 inputs, 87 match FA-02; only the shared final-acceptance ledger and hardening task list differ. That comparison is a dated read of a concurrent working tree, not an atomic snapshot or a commitment that inputs cannot subsequently change.

Reused FA-01's declaration/runtime export snapshot, FA-02's source inventory and foundation guard, and FA-04's preserved baseline/corrections/package evidence. FA-04's original full command **failed** nine cases in four calendar suites; its ledger combines 1,728 unaffected passing cases with ten corrected cases from the affected rerun, totaling 1,738. No new full green command is claimed. The inspected representative implementation/test files match FA-02; the four FA-04 input deltas concern calendar fixtures/tests outside the specific contract tests below. Existing tests are evidence of the assertions actually present and their recorded environment, not proof of missing assertions. Hash comparison here does not revalidate every transitive runtime dependency or regenerate declaration output.

No test runner, build, installation, browser, consumer, device or AT suite ran in this batch. No shared outputs or source were changed. Read/search/hash checks supplied necessary new contract reconciliation without repeating passed suites. Initial exploratory reads encountered nonexistent paths (`experimental/shared.ts`, a ThemeScope test glob under experimental, and AppDataGrid/models.ts); subsequent reads used `foundation/ThemeScope` and the actual grid types. These were read failures, not test failures.

## A-A-08 — partial: visual, placement, dismissal and validation contracts

Full obligation: define public variant, size, tone, density, placement, dismissal-reason and validation contracts independently of any foundation. The following are actual owned contracts, not a proposed universal vocabulary.

| Surface | Public contract and defaults | Source |
| --- | --- | --- |
| Button | `variant: filled / outlined / text`, default filled; `tone: primary / neutral`, default primary; optional `density`; no `size` prop. `onPress(): void`; form-safe button by default. | `packages/ui/src/components/Button/Button.tsx:10` |
| IconButton | Inherits Button's variants/tones/density, defaults text/neutral; required label and icon children. | `packages/ui/src/experimental/IconButton/IconButton.tsx:6` |
| Typography | Visual roles h1–h6, body1/body2/bodyAlt2, subtitle1/2, caption, overline, button, code. Defaults body1, `as=p`, tone default. Tones default/muted/subtle/accent/primary/danger; primary is accent compatibility, not action priority. | `packages/ui/src/experimental/Typography/Typography.tsx:3` |
| Scope | Density compact/comfortable; root defaults comfortable, nested unspecified settings inherit. InteractionMode auto/pointer/touch defaults auto; it is geometry policy, not disabled input modality. | `packages/ui/src/foundation/ThemeScope.tsx:7` |
| Dialog | Size xs/sm/md/lg/xl/full, default md. Controlled open; required `onDismiss(reason)` with escape/outside/close-button/dismiss. Escape/outside flags default enabled; showCloseButton defaults true. | `packages/ui/src/experimental/Dialog/Dialog.tsx:13` and function defaults |
| AppModal | Same size vocabulary, default sm; optional `onClose(reason)` aliases owned DialogDismissReason. `heightMode=auto` or sm/md/lg; explicit width/height/style are distinct from density. Separate disableBackdropClose/disableEscapeKeyDown default false; showCloseButton false. | `packages/ui/src/components/AppModal/AppModal.tsx:8` |
| Popover | placement bottom start/bottom end/top start/top end, default bottom start. size md/lg/content, default md. presentation popover/dialog/drawer/auto, default popover. Boolean onOpenChange, no dismiss-reason callback. | `packages/ui/src/experimental/Popover/Popover.tsx:18` |
| Menu | Same four placements, default bottom start. Optional density inherits nearest scope, not implicitly compact. Item tone default/danger is distinct from Button tone. Boolean onOpenChange; no reason API. | `packages/ui/src/experimental/Menu/Menu.tsx:11` |
| Tooltip | top/bottom/start/end plus four corner placements; default top. delay 700ms, closeDelay 100ms; boolean onOpenChange. No size/density or dismissal-reason prop. | `packages/ui/src/experimental/Tooltip/Tooltip.tsx:7` |
| TextField / TextArea | `required`, `invalid`, `errorMessage`, description, disabled/readOnly and native validation; TextField selects min/maxLength/pattern etc. TextArea deliberately omits pattern/type and adds rows (default 4). No exposed upstream validationBehavior option. | TextField.tsx:13; TextArea.tsx:11 |
| Select / ComboBox | required/invalid/errorMessage/description; internal native validation; option IDs, not labels, commit; null clears. No direct density or style prop in these interfaces. | Select.tsx:18; ComboBox.tsx:19 |
| DateField | kind date/datetime, entryMode segments/text; min/max, required/invalid/errorMessage and optional onValidityChange. Text mode and segmented handling have separate implementations; do not extrapolate TextField timing to them. | `packages/ui/src/experimental/DateField/DateField.tsx:16` |

All paths without a prefix in the last rows are under `packages/ui/src/experimental/<Component>/`. The architecture's “initial visual vocabulary” is an initial action vocabulary, not an enum shared by Typography, Menu, overlays or every catalog wrapper. Density inherits through scopes when a direct prop is absent. A placement preference is not a promise that collision handling preserves that side, nor does boolean open change imply an available dismissal reason.

Existing focused evidence: `Button.next100-regression.test.tsx` maps owned variants/tones/density; `Dialog.test.tsx` covers Escape/outside/close/generic dismissal and locks; `AppModal.test.tsx` checks custom slots, sizing, labels and dismissal; `TextField.test.tsx` covers associations/native validity/reset; `Select.test.tsx` and `ComboBox.test.tsx` cover descriptions and validation. These files were read, not rerun. `react-aria-proof-controls.md` and `react-aria-modal-shells.md` document host-controlled closing and native form policy. No new behavior proof for every size, placement or validation timing is implied.

Remaining closure work:

1. Reconcile all remaining exported component/alias/compound contracts against FA-01's type-resolved declarations and A-B-05's full signature work. This report does not exhaust all public variants, sizes and validation policies.
2. Explicitly reconcile validation feedback timing, host error precedence and commit guards across field compositions. Retain distinctions between native constraints, host `invalid`, date text drafts, segmented fields and range Apply; generic `invalid/errorMessage` presence does not settle those policies.
3. Reuse existing targeted evidence wherever those inputs remain unchanged. Run a bounded case only for an actual unresolved behavior or changed implementation; geometry/device/AT conformance belongs to its own leaves.

## A-A-09 — partial: accessible names and descriptions

Full obligation: define accessible naming/description requirements for icon-only and compound controls, using typed requirements where practical.

| Control | Actual naming/description contract | Enforcement limit |
| --- | --- | --- |
| IconButton | Required `label: string`; mapped to aria-label; icon children wrapped aria-hidden. Inherits aria-describedby. | Strings may still be empty. A runtime test whose title says “requires” demonstrates a valid named use, not a negative TypeScript test. |
| Button | Native AriaAttributes plus optional React children. Start/end icon slots hidden. Hosts must provide meaningful text, aria-label or aria-labelledby for icon-only usage. | Type accepts an unnamed or empty Button; it cannot determine whether arbitrary ReactNode children provide a name. No automatic icon-content requirement. |
| TextField / TextArea | Discriminated union requires label or aria-label; optional associated description/error and external aria-describedby. TextArea preserves union via distributive MultilineOptions. | No nonempty-string proof. Host referenced IDs must exist. |
| Select / ComboBox | Required visible label string; associated description/error. ComboBox dropdown button has translated Show options name. | No label-free aria-label-only shape in current interfaces. |
| Checkbox / Switch / RadioGroup | Required label; description associations are explicitly wired. Checkbox/Switch forwarded refs target labels, not inputs. | No general assumption that all form controls accept TextField's naming union. |
| Tabs | Required tablist label; items require labels, explicitly used as tab aria-label; icon slot hidden. | Host item content owns its internal names/description requirements. |
| Menu / Popover | Required menu label / popover title; trigger is separately supplied Button element and needs its own name. showTitle=false retains Popover title as dialog aria-label. | A named overlay does not name its trigger. |
| Tooltip | Plain supplementary content supplies trigger description via tooltip; native disabled actions do not become focusable. | Do not rely on tooltip text as the icon-only action name; it can be unavailable. |
| Dialog / AppModal | Optional title or aria-label; translated generic Dialog fallback. Description/subtitle associated by default header path. Custom header replaces default title/description rendering; host must supply meaningful naming/help. | Type permits neither meaningful title nor label. Custom headers require deliberate host naming; generic fallback prevents emptiness but is not contextual naming. |
| Calendar / DataGrid | Required calendar label; DataGrid label plus getRowLabel supply table/row action context. Calendar renderDayContent decorations hidden from name. | Host render callbacks must not supply their only meaningful information as aria-hidden decoration. |

Sources: respective inspected implementation interfaces/renderers; `Dialog.tsx:143` is the actual naming fallback/description association, and `AppModal.tsx:61` forwards title as aria-label for a custom header. Existing tests: IconButton.test.tsx (names/descriptions preserved across pending updates), TextField.test.tsx, TextArea.test.tsx (host plus local descriptions), Tooltip.test.tsx (description lifecycle), Tabs.next100-regression.test.tsx (local tab/panel wiring), and AppModal.test.tsx (custom header name). Full hashes are in results.json.

Remaining closure work: add focused consumer type assertions that unnamed IconButton and TextField/TextArea are rejected, label-free Select is rejected, and intended generic Button/Dialog exceptions remain accepted. Then finish the all-export compound-name/description ownership audit, including repeated row actions, editor controls, navigation rails and custom rendered content. Preserve host translation ownership and translated defaultMessage fallbacks for library-owned action labels. Do not close naming/browser/AT conformance from DOM tests or this source audit.

## A-A-10 — partial: composition and escape hatches

Full obligation: define supported slots/parts, render callbacks, refs, root/part classes, CSS variables and native style where needed. The API does not promise every hatch on every component.

| Surface | Supported composition / escape hatches | Native ref target / limits |
| --- | --- | --- |
| Button / IconButton | Button children/startIcon/endIcon, className/style, native selected attributes including slot; button part. IconButton children are decorative, required label names action. | HTMLButtonElement. No sx, polymorphic component/href or state-style callback. |
| TextField | start/end decorative slots; className root, inputClassName input; field/input/field-icon-control/field-start-icon/field-end-icon parts. | HTMLInputElement. No public style prop. Do not place controls inside aria-hidden icon slots. |
| TextArea | Root/input classes, rows, text content/value and description/error; **inherited icon props mismatch below**. | HTMLTextAreaElement. No public native style prop. |
| Select / ComboBox | Host option data and decorative start/end icons; root className. | Select HTMLButtonElement; ComboBox HTMLInputElement. Neither exposes a public style, inputClassName or item render callback. Internal ListBox render callbacks are not consumer APIs. |
| Tooltip | Button trigger + plain content string; root className/style; tooltip part. | HTMLDivElement for tooltip, separate from trigger ref. |
| Menu / Popover | Button trigger and owned item model / arbitrary children respectively. | No public forwardRef/className/style hook in these interfaces. Scope custom properties are the shared portal path. Do not invent partClasses or slotProps. |
| Dialog | children/header/footer; className/style on dialog, separate surfaceStyle/bodyClassName/bodyStyle; documented dialog-overlay/surface/header/body/footer part hooks. | HTMLElement dialog ref, not overlay or scroll body. |
| AppModal | children/headerContent/footerContent, primary/secondary action descriptors; className/style + body class/style. AppModal routes native style through Dialog.surfaceStyle. | HTMLElement dialog ref. Default action labels are strings and callbacks onPress; arbitrary replacement content uses header/footer slots. |
| Tabs | Item content/icons; root className/style; activation/orientation/overflow ownership. | HTMLDivElement root, not selected tab or panel. |
| ClassCardFrame | header/body/footer ReactNode; root and each named section class/style; width default 420; named class-card-* parts. | No forwarded ref. Falsy footer omitted. |
| CardCollectionWithFooter / AppDataGridShell | Host renderCard(row) returns ReactNode. | Render callback is public; internal engine objects are not needed to render a card. |
| Experimental DataGrid | GridColumn.renderCell(row), renderActions(row), getRowLabel(row). | No universal native root ref/class/style contract in DataGridProps. |
| Calendar | renderDayContent(DateOnly) returns decoration; availability callback and host ISO values. | No public forwarded ref, root style or root className prop in CalendarProps. |
| ThemeScope | Native div attributes/class, ScopeStyle permits native CSSProperties plus --sgui-* custom properties. | HTMLDivElement. Nested explicit scope variables copied to body portals; arbitrary ancestor CSS-computed variables/layout style are not captured. |

Sources are the matching component implementations, `experimental/DataGrid/types.ts` and `foundation/ThemeScope.tsx`. Existing focused evidence includes Button.public-contract.next100-regression.test.tsx, ClassCardFrame.test.tsx, Tabs.test.tsx, Popover.test.tsx (scope variables and portal inheritance) and AppModal.test.tsx. The architecture explicitly describes data-sgui-part/CSS variables as escape hatches, and the token pipeline describes generated owned tokens. This does not make private CSS-module class hashes, every internal DOM wrapper, or generated positioning variables stable extension contracts. Preserve package stylesheet loading and Provider/ThemeScope setup; layout styles do not propagate into body portals.

### Finding P05-01: TextArea accepts icon props without rendering icon slots

Source-confirmed mismatch at `packages/ui/src/experimental/TextArea/TextArea.tsx:11`: `MultilineOptions<TextFieldProps>` omits only type, pattern and inputClassName, so it retains startIcon/endIcon from TextField. The TextArea renderer destructures neither icon prop and provides no decorated-control/icon renderer. They remain in `...props` passed to AriaTextField. Its public type therefore advertises composition that its own renderer does not implement. This is a source finding; runtime DOM output was not executed in this batch.

Minimal reproduction for a focused follow-up, using the existing public experimental exports and an application already loading stylesheet/providing scope:

```tsx
import { TextArea } from '@structured-growth/sg-ui/experimental';

<TextArea
  label="Summary"
  startIcon={<span>Start decoration</span>}
  endIcon={<span>End decoration</span>}
/>
```

The declaration permits these props; the implementation has no icon nodes analogous to TextField's aria-hidden slots. Existing TextArea tests cover native values/reset, descriptions, validity and ref semantics but do not establish icon rendering.

Successor P05-01: explicitly omit unsupported TextArea icon props or implement owned decorative slots. Choose the intended API deliberately, add one focused public type/render case, and update generated declarations/docs examples if the contract changes. Verify that text-area naming/descriptions and native editing/reset remain preserved. Do not silently add interactive elements to an aria-hidden slot.

Remaining A-A-10 closure work beyond that finding: finish an export-resolved part/ref/style/render inventory for aliases and compound children using FA-01/A-B-05, document host responsibility for callback content, and cover intentional unsupported hatches with a small public type assertion. No blanket addition of style/ref props is proposed.

## Handoff

Three leaves reconciled in part; **zero acceptance closures claimed**. One concrete successor (P05-01), plus bounded completion tasks above. The 20 open editor V leaves, broader production/browser/device/AT obligations and release approval remain unchanged. Only this directory contains authored output; no source repair, shared checklist change, stage/commit/push or release operation occurred.
