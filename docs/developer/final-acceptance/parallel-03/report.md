# Parallel 03: owned interaction/API acceptance

All three assigned architectural leaves are **complete for the inspected working-tree inputs**: A-A-04, A-A-05 and A-A-11. No implementation defect or escaping upstream interaction contract was found. These results do not close browser, device, assistive-technology, editor V, release or full API/default/deprecation acceptance. The coordinator must reconcile shared checklists; none were edited here.

Evidence is from modified `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, on 2026-10-16. The exact capture time and 851 audited input hashes are in [audit-evidence.json](audit-evidence.json). Reproduce the read-only analysis from the repository root with `node docs/developer/final-acceptance/parallel-03/audit.mjs`. This is an additional bounded AST/type-reference analysis, not a repeat of package, foundation or unit suites.

## Evidence retained and input reconciliation

- Reused FA-01's 238 concrete entry paths and TypeScript-resolved exported-name inventory from `../2026-10-16-inventory.json`; no new export-name inventory or runtime import execution.
- Compared all 1,778 FA-01 built-file hashes against current output: **zero changed or missing outputs**. Thus the declarations inspected here are the exact outputs backed by FA-01 and FA-04 package evidence.
- Reconciled FA-02 library inputs against the current checkout: exactly four differences, the DatePicker segment fixture and three range test files listed in `changedSource`. They match `../fa04-library-input-delta.json`; no new production source files. All production source and boundary/package scripts inspected here retain their FA-02 bytes.
- Reused `../fa02-foundations.txt`, plus the passing foundation-boundary tests/typechecking stages in `../fa04-original-check.txt`. The latter command eventually failed nine unit cases; do not call the overall transcript a green run. The corrected affected unit evidence is `../fa04-calendar-rerun.txt`.
- Reused `../fa01-package.txt` and `../fa04-package.txt`: package entry imports, consumer types, declaration checks and actual packed-output equality. No fresh package/consumer test was run.

## A-A-04 — complete

Original leaf (`react-aria-hardening-tasks.md:154`): “Keep React Aria imports inside the interaction implementation layer; consumers and higher-level compositions use SGUI contracts.”

The AST analysis examined 424 maintained production TypeScript/declaration files under `packages/ui/src` (tests, native fixtures and fixture directory excluded), including import declarations, reexports, import types, import-equals, literal dynamic imports and require calls. **93 React Aria/Stately module references in 31 files; zero outside the explicit interaction registry** in `packages/ui/scripts/check-foundations.mjs:9–49`. The complete references and paths are in `sourceImports` and `unregisteredAriaReferences`.

The locations are concrete interaction wrappers: experimental fields/collections/calendar/overlays; Button; AppDataGrid's owned interaction renderer; its drag handle; and the editor's DocumentContentEditable focus wrapper. The lower-level DateField/TimeField state hooks and RangeGestures calendar context remain inside registered interaction files. DateRangePicker's direct import is `useLocale`, used to format/parse its owned textbox; it does not import a collection or state object. Provider's locale bridge exposes owned ThemeScope props. Neither case requires the host to consume an engine object. The AppDataGrid processing module imports TanStack internally, independently of the React Aria interaction boundary.

Public routes resolve through 370 local declaration files; no public non-React external type reference occurs. Higher-level shells, toolbar/layout/editor compositions use owned controls and adapters. This agrees with the retained transitive foundation guard. Relevant source: `packages/ui/src/experimental/DateRangePicker/DateRangePicker.tsx:8,30`, `packages/ui/src/experimental/Provider/Provider.tsx:3–18`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`, and `packages/ui/src/components/PageRichTextEditorSection/DocumentContentEditable.tsx:3`.

Test evidence: existing `packages/ui/scripts/react-stately-boundaries.test.mjs` covers alternate import syntax, ordinary/transitive-helper rejection and declaration rejection; its execution is retained in FA-04's foundation stage. No new runtime test is necessary for this unchanged architectural result. No required successor; optional guard extension is recorded below.

## A-A-05 — complete

Original leaf (`react-aria-hardening-tasks.md:155`): “Define SGUI-owned props instead of extending or aliasing all upstream props wholesale; selectively map native HTML attributes and ref behavior.”

All **423 emitted declarations** were examined for external type references, with the 238 public routes' local declaration closure resolved separately. There are **zero React Aria/Stately, @react-types, @internationalized/date or TanStack declaration imports/reexports/import types**. All 42 interface heritage clauses and 175 explicit `on…` property signatures are retained for review in the evidence JSON. There is no wholesale engine prop extension/alias.

Concrete contracts: `packages/ui/src/components/Button/Button.tsx:8–21` selects native button/form attributes and declares owned variant/tone/density/loading plus `onPress(): void`. TextField selects native input attributes (including focus/blur) and defines its string value callback; Select/ComboBox declare readonly owned option records and string/null selected values. DatePicker inherits SGUI DateFieldProps; DateRangePicker omits one SGUI DateRangeSelector callback rather than extending upstream picker props. Native refs are emitted as React RefAttributes of DOM elements, e.g. Button HTMLButtonElement, Select HTMLButtonElement, ComboBox HTMLInputElement and DateField HTMLDivElement.

Passive native wrappers intentionally retain native HTML attribute surfaces: Box, Typography, List, Divider, ThemeScope and Link. Their inheritance is from React DOM attributes, not upstream widget props; their implementations forward those attributes to native elements/owned adapter. Link's native click cancellation is the expressly documented navigation contract (`react-aria-architecture.md:69–71`), separate from Button's parameterless activation. The wrapper/ref mappings are documented in `react-aria-primitives.md:21–51`. This leaf does not require removing native event types or native attributes from passive wrappers.

Test evidence: retained package consumer typecheck and the explicit boundary rejection tests above; relevant unchanged behavior tests include Button/Button.test.tsx, experimental/Select/Select.test.tsx, experimental/ComboBox/ComboBox.test.tsx and experimental/DateField/DateField.test.tsx (paths relative to packages/ui/src). Their prior execution is covered by FA-04; no new test run claimed. Full signatures/defaults/deprecations remain A-B-05/A-Z-13 and are not closed here. No required successor for this leaf.

## A-A-11 — complete

Original leaf (`react-aria-hardening-tasks.md:161`): “Avoid exposing upstream collection/state objects, date object classes, grid column types, or unstable event payloads without an explicit reviewed contract.”

The complete declaration scan and public transitive closure show no upstream collection, state, date-class or grid-engine type dependencies. Source conversion paths agree with that declaration boundary:

| Boundary | Owned result / source reference |
| --- | --- |
| Button press | Parameterless callback; `components/Button/Button.tsx:38–40` discards upstream press payload. |
| Select / ComboBox selection | String/null; `experimental/Select/Select.tsx:44`, `experimental/ComboBox/ComboBox.tsx:53` convert keys with String. |
| ToggleButtonGroup / TagGroup | String arrays; `experimental/ToggleButton/ToggleButton.tsx:49`, `experimental/TagGroup/TagGroup.tsx` map sets/keys before host callbacks. |
| AsyncMultiSelect | Owned MultiSelectOption array; `experimental/AsyncMultiSelect/AsyncMultiSelect.tsx:19,53,75` maps selection to host-supplied option records. |
| Calendar / DateField / TimeField | Gregorian ISO date strings/arrays or time strings/null; `experimental/Calendar/Calendar.tsx:46–65`, `experimental/DateField/DateField.tsx:101–103`, `experimental/TimeField/TimeField.tsx:105–107`. Private segment helpers hold state hooks. |
| Date ranges / availability | Owned `{start,end}` string record, string reasons and owned endpoint context; `experimental/DateRangeSelector/date-contract.ts`, corresponding emitted declaration. No class crosses this boundary. |
| Grid columns/state | `experimental/DataGrid/types.ts` declares GridColumn/GridState; `components/AppDataGrid/types.ts` aliases locally owned model/presentation types. ReadonlySet/Set<string> are standard ID collections, not React Aria collection/state objects. GridValue's JavaScript Date is native, not an upstream date class. |
| Grid reorder | Experimental grid emits source/target string IDs and before/after (`experimental/DataGrid/DataGrid.tsx:49`); AppDataGrid emits owned row/ID/position record (`components/AppDataGrid/ownedGridInteraction.tsx:231–253`), not its drag event. |

Source paths in the table are relative to `packages/ui/src`. Reviewed design context: `react-aria-architecture.md:59–71`, `react-aria-grid-decision.md` “Authoritative ownership”, and `react-aria-calendar-contracts.md`.

The all-output declaration scan also found internal Lexical types in editor helper declarations. None is reachable from any declared public entry; `publicNonReactExternalReferences` is empty. The public editor's `onLexicalChange(unknown)` is documented serialized content, not a live EditorState/event escape: `components/PageRichTextEditorSection/lexical/ExperienceEditorPlugins.tsx:28–30` calls `editorState.toJSON()`, and `react-aria-editor-section.md:45–58` explicitly preserves the serialized document contract. This architectural result does not approve the serialized schema's long-term stability or close the separate editor leaves.

Test evidence: retained declaration/consumer checks and boundary negative tests; existing Calendar/DateField/TimeField, ToggleButton, TagGroup, grid interaction/model and editor tests establish their named smoke assertions at FA-04 inputs. Source inspection adds no native/browser/device/AT conformance. No required successor for this leaf.

## Specific successor and limits

**P03-GUARD-01 (optional hardening, not a current API escape):** `packages/ui/scripts/check-package.mjs:10` rejects engine names but omits `@internationalized/date`. Add that module family to the owned-declaration rejection guard and a synthetic negative fixture in `scripts/react-stately-boundaries.test.mjs`. Reproduction: inspect `assertOwnedDeclaration`'s regex and compare it with a declaration such as `export type { CalendarDate } from '@internationalized/date';`—the module spelling does not match the current guard. This report's independent AST scan includes that family and found zero current instances. Keep a deliberate distinction between the native JavaScript Date grid value and upstream date classes. This successor improves future enforcement and is not needed to make the current three architectural leaves conform.

These are static architectural acceptance results with dated package/unit evidence. No new tests, builds, dependency installs, browser sessions, server changes, commits, shared metadata/checklist edits or release actions occurred. Changes to production source, declarations, dependency resolution, registry or exports invalidate the affected conclusions and require a scoped recheck. New export paths require updating the reused entry inventory before rerunning the public-closure part of the audit.
