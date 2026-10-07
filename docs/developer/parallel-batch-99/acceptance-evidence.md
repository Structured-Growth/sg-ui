# Batch 99: D-05–D-09 acceptance evidence

Read-only criterion assessment on 2026-10-07. Inspected baseline/head:
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (assigned pushed `codex/dev`
baseline). This is **not a runtime-tested head**. Managed isolation completed
before the first edit at
`/Users/thomashall/.codex/worktrees/batch99-acceptance-evidence/sg-ui`;
branch `codex/batch99-acceptance-evidence`. Exclusive changed path: this report.
Primary checkout, image-upload work and other worktrees were preserved.

The [parent criteria](../react-aria-master-task-list.md) remain unchecked.
“Supported” below means the narrow definition/documentation criterion is
established by retained Git source, not that its surrounding D/U/X/Z parent is
accepted. The coordinator alone decides acceptance and integration. No inventory
M-row review or source-removal audit is repeated here.

## Per-ID matrix

| ID and criterion | Current evidence and disposition | Remaining gate / owner |
| --- | --- | --- |
| D-05: coordinated light/dark, readable states | **Partial.** S1 defines paired semantic roles with distinct light/dark aliases: light action blue700/onAction white versus dark blue400/onAction slate900; surface, muted text, danger, border and focus are likewise independently assigned. S2 emits scoped light/dark/system values. S3 checks nine declared foreground/background combinations in each mode, with 4.5 text/action/error and 3 focus/border thresholds. S7 scopes ordinary text color. These establish coordination and the intended contrast assertions; no fresh execution or complete state readability proof is claimed. E1 retains reports of representative light/dark axe scans, not a current complete catalog state matrix. | Coordinator schedules exact-head, retained three-engine rendered evidence across enabled/hover/pressed/focus/selected/error/loading/read-only/disabled appearances, surfaces and densities, including transparency and nested scopes. Declared token pairs do not cover every rendered combination or host override. Manual/device/AT output remains separate; do not infer it from axe or DOM status. |
| D-06: spacing/sizing/radius/elevation/border/icon/motion scale and intentional button/card reconciliation | **Partial.** S1 provides space1–4 (0.25/0.5/0.75/1rem), compact/comfortable control heights (2/2.75rem), control/field radii (0.625/0.375rem), focus width/offset, overlay shadow/layers and 120ms motion duration. S8 Button and S9 Surface share controlRadius; S10 Card composes Surface and S11 ClassCardFrame composes Card, so the current button/card radius discrepancy is removed by a shared variable, rather than separate component values. S14 documents icon default 1em/strokeWidth 2 and old numeric size mappings. Borders still use local 1px widths; S8 uses an independent 800ms spinner duration. Shared vocabulary exists, but this inspection did not establish a complete scale/rationale for border, icon and motion exceptions or an explicit intentional button/card design decision. | Design/foundation owner records the scale, sanctioned exceptions and rationale for the unified card/button versus field radii. Missing documentation is not evidence of an actual rendering defect or authorization to change every value. Minimal follow-up documentation allowlist: `docs/developer/react-aria-architecture.md`, `docs/developer/react-aria-icons.md`, `docs/developer/react-aria-card-frames.md`; check exact token/CSS references and resulting design rationale. Reserve no production edit unless that review establishes a specific inconsistency. |
| D-07: heading/body/label/caption/table/code roles, bodyAlt2 replacement, no augmentation | **Supported by source definition.** S1/S4/S5 define six heading roles, body1/body2, bodyAlt2 (0.875rem, 1.45, 500), subtitle1/2, caption, overline, button and monospace code. Label uses shared labelSize/labelLineHeight/labelWeight. S12 Table defines body2 table text, labelWeight header and label caption; S13 catalog grid deliberately uses labelSize/labelLineHeight. The table role is a component mapping, not a `TypographyVariant="table"` promise. S6 exports owned prop/variant/element types through public primitives, and S15 explicitly maps removed augmentation to owned roles. The replacement retains the public bodyAlt2 spelling, now owned, rather than requiring a rename or module augmentation. Scoped source search found no `declare module`, retired UI or styling-engine imports in Typography/public primitive/theme paths. | No missing definition found for this ID. Emitted declarations and clean packed consumers were not generated/executed here; a future packaging gate must validate its own exact output/head. Font readability and reflow remain D-05/D-09 gates. This supports only D-07, not blanket design-system or accessibility acceptance. |
| D-08: semantic HTML independent of visual typography | **Supported by retained documentation and source.** S16 says not to let semantic heading level depend on visual text role; S17 repeats that rule for component authors. S4 separates `as` from `variant`, defaults `as` to p for every visual variant and uses native `createElement(as)`. S18 asserts h2 semantics with h1 appearance and no h1 node. S19 provides the existing SemanticHeading story with that same mapping. Neither visual variant nor font size chooses a heading level. | No missing documentation/contract found for this ID. Inspected assertion is not a fresh test pass. Host authors still choose document hierarchy; this does not certify every composition or spoken AT navigation. Broad U/X acceptance remains open. |
| D-09: rem sizing and tolerance for zoom/text spacing/long labels/font substitution | **Partial.** All typography-size tokens in S1 use rem and S5 consumes the corresponding variables with unitless line heights and overflow-wrap:anywhere. FontFamily supplies Geist/Geist Fallback/system fallbacks and code has a monospace stack. S8 uses minimum control height and a wrapping label. E2 retains a native modal spec for 320 CSS pixels and 200% root text plus spacing overrides in light/dark, including complete native focus visibility; E1 reports historical representative executions. These are bounded layout/text-enlargement cases, not actual browser-chrome zoom or proof of font substitution across the catalog. | Coordinator reserves validation for actual browser zoom, long/localized labels, text-spacing overrides and substituted fonts across important controls/layouts/densities. Font fallback declaration alone does not prove substituted glyph metrics fit. Full engine/device/AT matrix remains open. No observed failing behavior justifies a production handoff from this inspection. |

## Exact retained source provenance

Each entry is a Git blob at the inspected baseline above. Links locate the
reviewed source; blob identities make the evidence independent of later edits.
The source files are retained artifacts for definition claims. They are not
browser-result artifacts, and test source is never counted as a pass.

| Ref | Source | Git blob |
| --- | --- | --- |
| S1 | [tokens.json](../../../src/foundation/tokens.json) | `64113cf0b2117e9bf1c2982bfe44c05a2ba59cee` |
| S2 | [generated scope tokens](../../../src/foundation/tokens.css) | `b36050c8871253823b4a9deb8d146936a14222ec` |
| S3 | [token assertions](../../../scripts/tokens.test.mjs) | `c06e8cbe72a0460ab9f54198bea95d3c74bf2b01` |
| S4 | [Typography contract/implementation](../../../src/experimental/Typography/Typography.tsx) | `43b138e03504fba2620868b448df834bf298ffea` |
| S5 | [Typography CSS](../../../src/experimental/Typography/Typography.module.css) | `fbb4558cc025883846e6deb99792e5cc839f506e` |
| S6 | [public primitive exports](../../../src/components/primitives/index.ts) | `43de81eedf14f9fc4119ff29cf9ae99cb8245c4f` |
| S7 | [scope ordinary text CSS](../../../src/foundation/ThemeScope.module.css) | `f697d375173ab1ca5c3bbe2a464d660dc3b7ee8c` |
| S8 | [Button CSS](../../../src/experimental/Button/Button.module.css) | `cccf005e0bdee43ac22d8f8830523938ce5167f6` |
| S9 | [Surface CSS](../../../src/experimental/Surface/Surface.module.css) | `138edde127995739e5c8c38b5ae72231eaaeddb2` |
| S10 | [Card composition](../../../src/experimental/Card/Card.tsx) | `2958daed3352aa00eee3d85153de2dd97be0ec7d` |
| S11 | [ClassCardFrame composition](../../../src/components/ClassCardFrame/ClassCardFrame.tsx) | `89a99b92463c1a6dbb9350fdd7a2d4ddadeb9a71` |
| S12 | [Table CSS roles](../../../src/experimental/Table/Table.module.css) | `4c2522c41fef3fb42902cc1cfd4cfbe0a20534b5` |
| S13 | [catalog grid text CSS](../../../src/components/AppDataGrid/ownedGridInteraction.module.css) | `5755e97b79b1befefca13e7b76126869ddfa9aa3` |
| S14 | [icon mapping/defaults](../react-aria-icons.md) | `f2524b342566b5727f41267a9990eb405c0a6f32` |
| S15 | [theme augmentation mapping](../react-aria-theme.md) | `f4c013be5314931ed051863eeb1ead6501594772` |
| S16 | [architecture semantic rule](../react-aria-architecture.md) | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| S17 | [component architecture](../component-architecture.md) | `802b8086c11e2c28460596214775653f75ac886d` |
| S18 | [Typography existing assertions](../../../src/experimental/Typography/Typography.test.tsx) | `b85f5309f928f2fac492def9f6d263070e167973` |
| S19 | [Typography existing stories](../../../src/experimental/Typography/Typography.stories.tsx) | `18d14d3174a5307ef09e8baa152c1c433735cf19` |
| E1 | [browser evidence and limits](../react-aria-browser-acceptance.md) | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
| E2 | [existing display-preference assertions](../../../tests/browser/display-preferences.spec.ts) | `cd5204cc7ab2f3deacc4da235198498138316dc7` |

## Execution and artifact limits

Fresh test executions: **zero**. No install, test, typecheck, build, pack,
Storybook, browser, performance, global lease or CI command ran. No new native
spec is prepared: existing fixtures already cover representative enlargement;
the remaining D-05/D-09 work is a wider acceptance matrix, not a demonstrated
missing native regression to manufacture in this assignment.

E1 records Linux CI run [37560065588](https://github.com/Structured-Growth/sg-ui/actions/runs/37560065588)
at `83b8dae2148002e79d2df331fd105c274f97ca96`, 45/45 across
Chromium/Firefox/WebKit with 24 axe scans, and artifact ID `11456069764`, reported
expiry 2026-10-21 02:10:07 UTC. That older suite is representative evidence only;
its exact head predates this baseline. The remote run/expiry was **not reverified**
here. Its downloaded directory `/tmp/sgui-ci-83b8dae2-artifacts` is absent locally.
The E1-reported `/tmp/sgui-display-complete-browser-results.json`,
`/tmp/sgui-display-complete-browser.log` and
`/tmp/sgui-calendar-final-browser-results.json` are also absent, as is this
isolated checkout's `artifacts/browser-results.json`. Retained report text is
not replacement raw evidence. E1's local 54/54 display-preference result lacks
an exact full tested-head identity in that section, so it cannot establish a
current-head pass. Local historical Chromium/WebKit subsets do not establish
Firefox; the documented Mac Firefox launch limitation remains separate from
the historical Linux result. Browser-source assertions do not establish manual
device settings, physical touch, screen-reader output or host customization.

Read-only checks actually performed: `git status --short`, `git rev-parse HEAD`,
`git branch --show-current`, `git remote -v`, `rg --files -g AGENTS.md`, focused
`rg`/`cat`/`sed` inspection of the linked source/contracts/evidence, `git ls-tree
HEAD` blob verification, and Python `Path.exists()` checks for the five artifact
paths above. Only root AGENTS.md was discovered. README, migration and component
architecture were read before changes. Some guessed paths/globs did not exist;
the report cites only verified paths, not those failed probes.

Report validation: relative links resolve; all 21 listed blobs match the
baseline tree; `git diff --check` is clean. This guidance-only validation does
not assert runtime support on any Node/React/engine version. No acceptance
ledger, master checkbox, shared config, source, story or test was edited.
No merge, publication, workflow/secret/credential access or worktree deletion
occurred. D-05/D-06/D-09 remain partial; D-07/D-08 are narrow source-supported
recommendations for coordinator review, with no whole-parent closure.
