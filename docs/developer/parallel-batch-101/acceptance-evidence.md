# Batch 101: D-14–D-17 acceptance evidence

Read-only assessment on 2026-10-07 of exact reviewed baseline
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` supplied by coordinator).
All source/blob references below resolve at that commit. This is a distinct
review of unchecked design criteria, not another M-row migration inventory.
Only this report was changed. Coordinator alone owns acceptance, integration,
master/ledger updates and validation scheduling.

## Per-criterion decision matrix

| ID and criterion | Assessment at inspected head | Concrete retained proof | Precise remaining gate |
| --- | --- | --- | --- |
| D-14: primary/subpage surface hierarchy, card hierarchy, overlay elevation through semantic tokens | **Fully supported for the definition/source criterion.** | `tokens.json` defines light/dark surface, subtle surface, divider, backdrop, overlay/popover layer and overlay shadow. AppPageHeader maps primary to surface and default subpage to subtle. Surface defines default/subtle and flat/outlined/raised; Card defaults article/outlined. ClassCardFrame uses subtle header/footer. Dialog and Menu/Popover consume elevation/layer tokens. Exact blobs in registry below. | No current-head rendered verification performed. Raised cards and overlays intentionally share overlay-shadow; there is no separate multilevel card elevation scale. Source support does not establish contrast, forced-colors, visual approval, stacking/collision or broad U/X acceptance. Root must decide whether a richer elevation scale is required; the stated criterion does not require distinct shadow values. |
| D-15: complete hover/focus/pressed/selected/disabled/read-only/invalid/pending/empty/loading/error design; meaning independent of color | **Partial.** Representative source states and non-color signals exist; complete catalog applicability and state combinations are not established. | Button CSS maps hover/pressed, focus outline, disabled and pending; Button renders translated Pending progressbar. Menu/Checkbox expose selection checkmarks; TextField provides read-only input semantics, FieldError and native invalid semantics. OwnedGridStatus distinguishes loading/refreshing/empty/noResults/error using text and status/alert roles with optional retry. See explicit state table below. | Record which states apply to each control and audit relevant combinations across themes/densities/forced colors. In particular optional host error text must not be assumed present merely because `invalid` is true. No exhaustive non-color visual meaning or manual/AT approval is retained here. No missing production behavior was reproduced; do not convert this evidence gap into an invented implementation fix. |
| D-16: scoped theme/density roots, nested overrides, correct portal scope/variables | **Fully supported for the definition/source contract; native acceptance remains partial.** | ThemeScope context inherits unspecified settings; merges only `--sgui-*` styles into portal context. Provider bridges locale; `useOverlayScope` supplies theme/density/dir/lang/variables. Dialog, Menu, Popover, Select, ComboBox and Tooltip consume that bridge. Source tests cover independent mounts and nested portals. Batch 05 retains a bounded execution report with exact historical heads. | Current-head native assertions are UNRUN; inspected local historical artifacts are absent. Batch 05 explicitly records Firefox launch failure and only Chromium/WebKit assertion success. Full overlay lifecycle, system-theme media changes in open portals, all collisions, physical-device and spoken AT behavior remain outside this report. |
| D-17: light/dark/system, initial server theme, color-scheme, hydration without flashes/browser-global assumptions | **Partial overall; settings/server/CSS contract supported.** | ColorTheme is light/dark/system; default light/comfortable; render uses context and props without window/localStorage/matchMedia reads. tokens.css declares color-scheme and dark system media query. ThemeScope server test specifies stable system attributes. Packed fixture specifies initial dark scope, no-JS SSR and scope-node preservation on hydration. | Packed fixture is explicit dark, not a light/dark/system first-paint matrix. No retained current-head first-paint/no-flash result, delayed stylesheet/host preference coordination result or live OS preference transition result was inspected. Host owns global backgrounds, stylesheet loading, initial setting and persistence; library scope stability cannot certify host flashes. Representative historical hydration runs do not close this criterion for the current head or every host. |

“Fully supported” above describes a bounded design definition demonstrated by
actual source, not permission to check off the whole parent or assert full runtime
acceptance. None of these decisions marks broad D/U/X/R/Z or device/AT complete.

## D-15 concrete state evidence, without a catalog-wide claim

| State | Actual inspected design/observable signal | Limit |
| --- | --- | --- |
| Hover | Button `data-hovered` maps to semantic action-hover/subtle background. | Source styling, not executed pointer evidence here. |
| Focus | Button `data-focus-visible` draws width/offset outline; forced-colors maps to Highlight. | Native focus/contrast and all controls not rerun. |
| Pressed | Button `data-pressed` maps to action-hover/subtle. | Hover and pressed share backgrounds; do not claim distinct visual designs or a non-color pressed indicator. |
| Selected | Checkbox renders ✓/−; Menu renders checked state and sets selection semantics. | Does not prove every selectable catalog control. |
| Disabled | Native/React Aria disabled props, opacity/cursor and forced-colors GrayText. | Semantics exist; dimming alone is not proof of all non-color visual requirements. |
| Read-only | TextField maps `isReadOnly`, input readonly subtle surface; architecture specifies focus/copy. | A color change alone is not a visible explanatory label; host/composed labeling must be reviewed. |
| Invalid | TextField maps `isInvalid` and renders FieldError; Checkbox supports optional error text and invalid semantics. | Supplied error-message coverage does not demonstrate a useful visible explanation for every invalid input without host text. |
| Pending | Button renders named Pending progressbar/spinner; engine pending blocks activation. | Reduced motion removes animation while retaining progress semantics; spoken AT unverified. |
| Empty | OwnedGridStatus renders “No rows available” (separate no-results message). | Other catalog empty states not assessed exhaustively. |
| Loading | OwnedGridStatus renders translated Loading rows with named Progress. | Announcement output cannot be inferred from role/source alone. |
| Error | OwnedGridStatus renders default/host text with assertive Status and optional Retry. Menu exposes host error text. | Retry depends on host callback; full recovery compositions and manual reading not certified. |

Retained source tests specify meaningful assertions in Button.test.tsx (pending
focus/activation), TextField.test.tsx (labels/errors/read-only/disabled),
Menu.test.tsx (selected choices/error scope) and ownedGridParts.test.tsx
(distinct statuses). These files were inspected as test definitions, **not run**.
Existing display-preferences.spec.ts defines reduced-motion and forced-colors
checks including native focus width, pending and disabled semantics. It is not
a comprehensive D-15 state acceptance matrix and filename existence is not a pass.

## Exact Git blob registry

Paths are repository-relative; obtain exact content with
`git show e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>`.
These hashes were resolved using `git rev-parse HEAD:<path>`, not inferred from
migration status or report prose.

| Source/evidence path | Git blob |
| --- | --- |
| src/foundation/tokens.json | `64113cf0b2117e9bf1c2982bfe44c05a2ba59cee` |
| src/foundation/tokens.css | `b36050c8871253823b4a9deb8d146936a14222ec` |
| src/foundation/ThemeScope.tsx | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| src/foundation/ThemeScope.test.tsx | `d2a452011b3679297cf5c09f75f2999bc10f9c11` |
| src/experimental/Provider/Provider.tsx | `cb3e3de6f89932418f05fd793a4899bd8ff548ed` |
| src/experimental/Provider/Provider.portal.test.tsx | `872c535dd000b2f07152457213fcd08be5e7545f` |
| src/experimental/Popover/Popover.test.tsx | `59a1c553f7ce50bf86bf50bf9833594eeee364a5` |
| src/experimental/Surface/Surface.module.css | `138edde127995739e5c8c38b5ae72231eaaeddb2` |
| src/experimental/Card/Card.tsx | `2958daed3352aa00eee3d85153de2dd97be0ec7d` |
| src/components/ClassCardFrame/ClassCardFrame.module.css | `1f968959445d5e9f84d95d43a974c0b16fe8da96` |
| src/components/AppPageHeader/AppPageHeader.module.css | `1fe3d6971a58e31e502509f8220bda3b1b55d664` |
| src/experimental/Dialog/Dialog.module.css | `2a303b80cad1fecea4558179fabe14e959f65bde` |
| src/experimental/Popover/Popover.module.css | `a679c7fbda99bf28f7fdf637955eeb40b975b941` |
| src/experimental/Menu/Menu.module.css | `2f5371f35a24b6d6104864d9385f2d94c927752a` |
| src/experimental/Button/Button.tsx | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| src/experimental/Button/Button.module.css | `cccf005e0bdee43ac22d8f8830523938ce5167f6` |
| src/experimental/TextField/TextField.tsx | `de1f43a5e341da219f3aa353ed90bc1b13b6308e` |
| src/experimental/TextField/TextField.module.css | `bf558fdb356596f7357cde20c0a4c7fc52a1d798` |
| src/experimental/Checkbox/Checkbox.tsx | `5d4b8c2ad4af90ee897225ff4d5ebb9c2fdac9b3` |
| src/components/AppDataGrid/ownedGridParts.tsx | `ccdbb11cc12e1a15b8406be1317320d74e2eb3f3` |
| scripts/test-foundation-consumer.mjs | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| tests/browser/batch05-portal-direction.spec.ts | `f38e7e7293e5bf5a652b11321a98acbe02291d29` |
| tests/browser/display-preferences.spec.ts | `cd5204cc7ab2f3deacc4da235198498138316dc7` |
| docs/developer/react-aria-theme.md | `f4c013be5314931ed051863eeb1ead6501594772` |
| docs/developer/react-aria-server-components.md | `52750245160e7a0618483639eaefce58973e900c` |
| docs/developer/react-aria-runtime-ci.md | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| docs/developer/parallel-batch-05/portal-direction.md | `1e52f9cf7d6b67ad86b218ba3eaf6fe7a5c420e5` |

## Retained execution claims and artifact availability

- [Batch 05 report](../parallel-batch-05/portal-direction.md) records 68 files/366
  related unit assertions passing on `7f9e5124c99a50352c38cfa02a2d74d0edbb5644`.
  It records browser fixture build at that head, spec at
  `2d20123e4d3ce1688237fd45cef64943a3c901bf`, 4 Chromium/WebKit passes and 2
  Firefox launch failures before assertions; command exit 1. Runtime was Node
  24.19.0. Source `ThemeScope.tsx` and the browser spec have exactly equal blobs
  at that historical spec head and this baseline (verified). Equal individual
  blobs do not establish equal transitive dependencies/build or a fresh pass.
- [Runtime record](../react-aria-runtime-ci.md) cites historical server-fix head
  `b63ec58becedd246052c3a1e81acf590a97940d1`,
  [run 37562921075](https://github.com/Structured-Growth/sg-ui/actions/runs/37562921075),
  browser artifact ID `11458031025`, and packed React 18/19 SSR/hydration in
  Chromium/Firefox/WebKit. This is a retained repository claim, not independently
  fetched/revalidated remote evidence in this assignment. Its scope predates
  this baseline; no full current matrix is inferred.
- Actual filesystem existence inspection found these referenced evidence paths
  **ABSENT**: `/tmp/sgui-ci-b63-browser`, `/tmp/sgui-ci-7f03-browser`,
  `/tmp/sgui-batch05-portal-direction-browser-final.log`, and
  `/Users/thomashall/.codex/worktrees/batch05-portal-direction/sg-ui/artifacts`.
  Absence means this worker cannot inspect their JSON/logs/traces. It does not
  mean the historical results failed or the remote artifacts are deleted.
  Remote expiration/access was not checked. Reports' historical “unexpired”
  statements must not be reused as a fresh availability claim.

## Checks actually performed and root handoff

Read README, migration and component architecture; read exact D-14–D-17 master
criteria; inspected actual source/CSS/test definitions, theme/server contracts and
historical execution reports. Searched actual bridge callsites and state mappings,
resolved the Git blobs above, compared the two historical blobs explicitly, and
checked the four local artifact paths for existence. Created an attached isolated
managed worktree at the supplied baseline before edits, on
`codex/batch-101-acceptance`. Report links/path/blob consistency and
`git diff --check` are the only report-validation checks; no source tests ran.

No install/build/pack/browser/performance/global-lease/CI command was run. No
optional test was added: no runtime defect was reproduced and existing portal,
preference and packed hydration tests already cover bounded assertions. Do not
invent duplicate historical proofcases merely to create a new file.

Root validation window requests, **UNRUN**, preserving source ownership:

1. Reuse existing ThemeScope/Provider/Popover source tests and
   batch05-portal-direction browser cases against a single fresh root-owned
   Storybook build, retaining exact tested head, runtime, engine failures and
   JSON/traces. This can refresh D-16's bounded runtime evidence, not prove all
   portal or device/AT behavior.
2. Reuse packed SSR/hydration fixture to refresh explicit-dark D-17 evidence;
   a separate first-paint/system/media-transition matrix requires deliberate
   fixture ownership. Do not mistake final computed CSS for no-flash proof.
3. Assign a bounded D-15 applicability/combination design audit before expanding
   tests. If a missing non-color invalid/read-only indicator is demonstrated,
   propose exclusive ownership only of the affected control's implementation,
   CSS, story and colocated test; obtain a root-approved allowlist first. No
   production handoff or defect claim is made from optional props alone.

Host responsibilities stay explicit: theme preference persistence, document/body
styles, stylesheet availability, host error messages, data/error/retry ownership,
and supported locale policy. DOM roles and source semantics do not establish
spoken AT output. Broad parent acceptance and any integration remain with root.
