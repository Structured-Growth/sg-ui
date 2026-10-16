# Parallel 10 acceptance reconciliation

Captured: 2026-10-16T22:35:25.277612+00:00. Base: `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, `dev`, shared modified checkout. File hashes and structured findings are in [results.json](results.json).

**Outcome: A-D-11 complete; A-D-12, A-D-16 and A-D-17 partial.** These are recommendations for coordinator reconciliation; no shared checklist or acceptance count was changed. No implementation defect was demonstrated. The partial statuses preserve unverified parts of each original obligation.

## Evidence and execution limits

Read AGENTS.md and the final acceptance ledger, then evaluated the exact full original leaves in `docs/developer/react-aria-hardening-tasks.md:189–195`. Only this directory was written. No tests, browser sessions, builds, installs, shared output changes, commits, staging, server actions or release operations were performed.

Reused FA-01–04 rather than repeating them: FA-04 records the original failed full command, corrected four calendar suites, all 1,738 passing current-input cases by reconciliation, and separate package/build stages. ThemeScope/Provider/Menu input bytes remain unchanged relative to FA-02; baseline unit evidence is retained rather than rerun. This is unit/source evidence, not native or hydration execution.

SHA-256 comparison covers 40 explicitly reviewed inputs: 34 unchanged from FA-02, two changed, four acceptance logs absent from the earlier source snapshot. Changed inputs: `docs/developer/react-aria-hardening-tasks.md`, `docs/developer/backlog-execution-2026-10-15.md`. The structured receipt records exact old/current hashes. Documentation changes do not by themselves require a behavioral rerun.

Historical browser evidence is preserved as dated narrative, not recertified: `backlog-execution-2026-10-15.md:193` records 16 foundation/token cases per engine after host/assertion reconciliation; `:370` records 16 control configurations per engine, explicit touch and enlarged text. Historical base is modified `d3201f0f0ca68aa006a880a2f63a9dd8d8c8845e`; current acceptance base is modified `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. All six named local foundation/control-bounds artifact directories are absent. Current source hashes are not historical tested-host hashes. Do not silently upgrade these receipts to current native execution.

## A-D-11 — complete

**Full obligation:** Define compact/comfortable independently of brand; preserve compact menu compatibility explicitly; document general default.

- ThemeScope context defaults to light/comfortable/auto and independently inherits or overrides theme, density and interaction mode.
- Generic Menu has no compact default; its portal uses density ?? scope density. DataToolbarSelectionMenu, InsertContentMenuControl, TextAlignMenuControl and TextStyleMenuControl explicitly request compact compatibility.
- Architecture lines 84–87 and theme density section document the general comfortable default and separate density from color identity. Compact/comfortable control defaults are 32/44px with 12/14px control text and 8/16px horizontal padding at a 16px root.

**Source references:** `docs/developer/react-aria-theme.md`; `docs/developer/react-aria-architecture.md`; `docs/developer/component-architecture.md`; `packages/ui/src/foundation/ThemeScope.tsx`; `packages/ui/src/experimental/Menu/Menu.tsx`; `packages/ui/src/components/DataToolbar/components/DataToolbarSelectionMenu.tsx`; `packages/ui/src/components/InsertContentMenuControl/InsertContentMenuControl.tsx`; `packages/ui/src/components/TextAlignMenuControl/TextAlignMenuControl.tsx`; `packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.tsx`.

**Test/evidence references:** `packages/ui/src/foundation/ThemeScope.test.tsx`; `packages/ui/src/foundation/ThemeScope.next100-regression.test.tsx`; `packages/ui/src/experimental/Menu/Menu.next100-regression.test.tsx`; `packages/ui/tests/browser/token-tier-scope.spec.ts:85`.

**Evidence limit:** Source/hash reconciliation plus retained FA-04 unit baseline; historical bounded token/density native receipt retained separately. Closure is definition/compatibility policy, not all-component visual acceptance.

**Successor:** None for this definition/compatibility leaf. Separate touch, overlay, hydration and component presentation gates remain independent.

## A-D-12 — partial

**Full obligation:** Important touch controls comfortably operable without density erasing minimum hit areas or keyboard focus.

- Shared target floor is 2.75rem; explicit touch and auto under any-pointer:coarse set the floor. Explicit pointer remains a host override. Button uses minimum block and inline targets; TextField/Checkbox/Switch/Menu use minimum block targets; their focus rules remain present.
- Existing control geometry test covers themes/densities/directions with explicit pointer/touch modes and enlarged text, plus real selection/checkbox/switch actions. It asserts field height >=44, not every target width or native auto policy.
- No implementation defect proved by this inspection. Broad target/device conformance cannot be inferred from CSS or explicit touch fixtures.

**Source references:** `docs/developer/react-aria-theme.md:85`; `packages/ui/src/foundation/tokens.css:2154`; `packages/ui/src/components/Button/Button.module.css:8`; `packages/ui/src/experimental/TextField/TextField.module.css:9`; `packages/ui/src/experimental/Menu/Menu.module.css:6`.

**Test/evidence references:** `packages/ui/tests/browser/hardening-control-geometry.spec.ts`; `packages/ui/tests/browser/foundation-catalogue.spec.ts`; `docs/developer/backlog-execution-2026-10-15.md:370`.

**Evidence limit:** Historical bounded 16-config-per-engine control-bounds receipt retained; source contracts unchanged against FA-02 where captured. No new native, physical-device, AT or target conformance execution.

**Successor P10-D12-01:** Add one bounded native auto-policy case in a coarse-capability context: compact Provider, Button/IconButton, checkbox/switch labels and menu option; verify media query, both target dimensions/hit activation and keyboard focus after opening the portal. Retain existing explicit touch geometry evidence.

**Review/reproduction:** Current hardening-control-geometry only loops mode pointer/touch and dimensions returns height but not width; inspect its test loop and touch assertion.

**Required result:** Durable dated source/host hashes and native receipt for auto policy; classify physical-device work separately and retain remaining specialized target obligations.

## A-D-16 — partial

**Full obligation:** Scoped theme/density roots and nested overrides; overlays receive correct scope and variables.

- ThemeScope merges parent custom --sgui-* style variables and inherited theme/density/interaction/dir/lang; useOverlayScope intentionally omits unrelated layout styles. Provider bridges host locale.
- Dialog, Popover, Tooltip, Menu, Select, ComboBox and SearchField attach scope to their detached roots; Menu and SearchField support explicit local density.
- Existing native portal test verifies a detached dark/compact dialog, custom semantic/component aliases, nested comfortable child, sibling isolation, no copied width and Escape focus return. It does not establish live nested scope changes for every detached overlay family.

**Source references:** `packages/ui/src/foundation/ThemeScope.tsx:18`; `packages/ui/src/foundation/ThemeScope.tsx:45`; `packages/ui/src/experimental/Provider/Provider.tsx`; `packages/ui/src/experimental/Dialog/Dialog.tsx:138`; `packages/ui/src/experimental/Popover/Popover.tsx:141`; `packages/ui/src/experimental/Menu/Menu.tsx:79`.

**Test/evidence references:** `packages/ui/src/foundation/ThemeScope.next100-regression.test.tsx`; `packages/ui/tests/browser/token-tier-scope.spec.ts:120`; `docs/developer/backlog-execution-2026-10-15.md:168`; `docs/developer/backlog-execution-2026-10-15.md:193`.

**Evidence limit:** FA-04 unchanged scope unit evidence reused. Historical three-engine foundation summary retained as historical only: its raw reports are absent locally, so a current immutable-host native attestation is not claimed.

**Successor P10-D16-01:** Recover original token-tier portal receipt/source+host manifest if available; otherwise coordinator should schedule only the existing scoped-portal case against its reconciled host, then one composed case that opens a child menu/tooltip while changing nearest scope tokens/density and verifies sibling isolation.

**Review/reproduction:** token-tier-scope.spec.ts:120 opens one fixed Dialog; ThemeScope.next100 regression updates nested DOM scopes but does not open a body portal.

**Required result:** Exact tested source/host hashes, native engine scope and current portal token/attribute results; no all-overlay or device claim from source inspection.

## A-D-17 — partial

**Full obligation:** Explicit light/dark/system, initial server theme, color-scheme and hydration without unwanted flashes/browser-global assumptions.

- ColorTheme is light|dark|system; default light is deterministic on server/client. System resolves in CSS prefers-color-scheme; generated scopes set color-scheme light/dark. ThemeScope does not inspect matchMedia/window/document during render; scrollbar DOM observation is effect-owned.
- Existing SSR ThemeScope test checks system markup and nested inheritance. Packed foundation browser fixture is explicitly dark and checks server scope identity/recoverable errors; it does not execute initial system preference coverage.
- CSS-based system resolution avoids effect-driven light-to-dark reconciliation once stylesheet is loaded. Host stylesheet arrival and host persisted-preference initialization remain outside that proof; no no-flash measurement was performed.

**Source references:** `packages/ui/src/foundation/ThemeScope.tsx:8`; `packages/ui/src/foundation/ThemeScope.tsx:18`; `packages/ui/src/foundation/tokens.css:770`; `packages/ui/src/foundation/tokens.css:1122`; `packages/ui/src/foundation/tokens.css:1124`; `docs/developer/react-aria-theme.md:19`.

**Test/evidence references:** `packages/ui/src/foundation/ThemeScope.test.tsx`; `packages/ui/scripts/test-foundation-consumer.mjs:83`; `packages/ui/scripts/test-foundation-consumer.mjs:302`; `docs/developer/react-aria-browser-acceptance.md:78`.

**Evidence limit:** Retained FA-04 SSR/unit baseline and historical packed consumer description; builds/package audits do not establish executed current-head system-theme hydration or first paint.

**Successor P10-D17-01:** Extend representative packed SSR fixture with theme=system and blocking production stylesheet; use light/dark preferences before navigation, compare no-JS first computed colors/color-scheme with hydrated colors, unchanged server root and zero recoverable errors. Also exercise preference change after hydration. Coordinator schedules bounded execution; do not rebuild or run consumers concurrently in this checkout.

**Review/reproduction:** test-foundation-consumer.mjs proof fixes Provider theme="dark"; current ThemeScope system test only renders to string.

**Required result:** Dated raw browser receipt plus package/source hashes for first styled frame and hydration; document host-selected initial-theme/stylesheet assumptions rather than claim arbitrary-host no-flash guarantees.

## Report validation

Parsed the structured JSON, verified four unique assigned leaf IDs and the 1 complete / 3 partial / 0 blocked totals, checked every recorded source path exists, and rehashed the 40 recorded inputs to detect changes while preparing this report. No library check was rerun because the relevant implementations match the saved baseline. Physical-device, assistive-technology, all-component target, editor V and arbitrary-host first-paint claims remain outside this report.
