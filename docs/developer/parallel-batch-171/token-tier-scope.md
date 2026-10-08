# Scoped token tier proof preparation — batch171

D-02/D-04 bounded preparation only. Native and packed-consumer proof remains
**unrun**. No parent gate, source integration or production acceptance is closed.
The coordinator owns independent review, integration/push and fresh focused
candidate browser proof under the active daily checkpoint policy.

## Checkout and prerequisite

- Managed isolated checkout: `/Users/thomashall/.codex/worktrees/7da1/sg-ui`.
- Clean detached initial HEAD: `1948d0b54688cf61dfa6708fd94cbc8ca6e21990`
  (the requested `codex/dev` baseline).
- New branch: `codex/batch171-token-tier-scope`.
- Reviewed prerequisite history: `fd1cfc3e1d2972e7ef077d4d1f82b7d29c05ffd7`.
- Normal non-fast-forward bootstrap merge, before edits:
  `68dc47b18b35a71d259e2f81efbb62b4428dbddc`.
- Bounded story/spec source commit: `b5a6ae40565468cc58fe9b0e0b43ae84f2474918`.
- Independent prerequisite source receipt:
  `/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/batch164-independent-review.json`.
  Its admission is provisional source admission; it does not contain native proof.

The prerequisite's seven files have zero diff against its reviewed head and match
its independent SHA-256 receipt. This batch writes only
`src/foundation/TokenTierScope.stories.tsx`,
`tests/browser/token-tier-scope.spec.ts` and this report. No shared ledger, master
list, state, CI, workflow or legal file changes; no primary or foreign worktree,
lease or process cleanup. No main, publication, force push or branch deletion.

## Prepared observable cases

The stories import literal exported `Provider`, `ThemeScope`, `AppButton`,
`Popover`, `Typography` and generated token contracts through relative source
paths. Production Storybook supplies scopes and token CSS; controls import their
compiled production styles. No runtime/public feature is added.

| Story ID suffix | Native case and concrete observations |
| --- | --- |
| `nested-overrides` | Parent action/hover/danger overrides; child source overrides; independently overridden raised surface and primary component slot. CSS-computed backgrounds test source/derived aliases, card versus plain/overlay separation, explicit dark boundary, real AppButton semantics and nested density geometry. |
| `switching` | Owned action callbacks switch light/dark/system and compact/comfortable. Browser color-scheme emulation checks all 41 semantic and 27 color component swatches against explicit light/dark comparison scopes. Inherited boundaries follow changes; fixed dark/compact stays fixed. Geometry uses computed min-height/padding normalized by native root font size. |
| `portaled-scope` | Native activation opens real Popover dialog outside its Provider DOM subtree. Portal theme/density and computed alias/control colors match the owner's custom variables; compact and nested comfortable geometry differ. Provider layout width does not propagate. Adjacent custom light scope retains its prior values, and Escape restores trigger focus. |
| `declared-pairs` | Native computed opaque sRGB swatches check the documented essential text/action/validation pairs at 4.5:1 and border/focus pairs at 3:1, in both default themes. Decorative/disabled pairs and custom host contrast are excluded. |
| `declared-pairs` (separate preference case) | Browser-emulated forced colors must actually match the media query. Existing owned button rules retain native keyboard focus ring, visible button boundary and disabled opacity/readability. No custom forced-color token contract or physical-device result is invented. |

Full prefix: `foundations-tokentierscope--`. Five test cases are prepared. These
are distinct from `FoundationCatalogue`'s baseline palette, spacing, native focus
and reduced-motion fixtures; no implementation JSON/compiler resolution is copied
into the driver. Explicit scope comparison tests live recomputation, while exact
RGB and override-isolation assertions independently constrain representative roles.
Swatch labels sit outside colored blocks to avoid presenting unrelated contrast
pairings as recommended text treatments.

Component aliases are declared role swatches, **not shipped component state
wiring**. For example the independent primary slot turns its swatch green, while
the actual AppButton still consumes the purple action role. Popover still consumes
its existing semantic surface. The browser cases deliberately preserve that
separation; they do not claim new button destructive/pressed or menu states.

## Retained targeted validation

All commands ran with this exact executable:
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`,
version `v24.21.0`. Frozen installation reports pnpm `10.29.3`.
The canonical helper acquired only owned install/light slots with UUID owner
receipts, retaining the legacy transition claims and releasing after verified
process-group settlement. Foreign light slot0 was not adopted or removed.
No heavy/browser lock was acquired.

| Label | Node argv (separate argument array) | Owned canonical lease / owner | Result |
| --- | --- | --- | --- |
| `install` | `["/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs", "install", "--frozen-lockfile"]` | `/tmp/sgui-install-slots/slot0` / `batch171:6f59f3ed-7c41-49fa-a7b9-c3b5b04d0d17` | 0; settled `True`; released |
| `types` | `["node_modules/typescript/bin/tsc", "--noEmit", "-p", "/tmp/sgui-batch171-types.json"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch171:eac4a515-80b9-42f0-9e16-a74dcceaa9dc` | 0; settled `True`; released |
| `foundations` | `["scripts/check-foundations.mjs"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch171:575c9583-7c7a-4a80-bb9b-3b05253d81b2` | 0; settled `True`; released |
| `tokens` | `["scripts/tokens.mjs", "--check"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch171:252176c7-33d8-4446-914a-0022560285ac` | 0; settled `True`; released |
| `final-types` | `["node_modules/typescript/bin/tsc", "--noEmit", "-p", "/tmp/sgui-batch171-types.json"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch171:38bc4643-be36-4aa5-a820-e0f44ca77155` | 0; settled `True`; released |

| `corrected-types` | `["node_modules/typescript/bin/tsc", "--noEmit", "-p", "/tmp/sgui-batch171-types.json"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch171:3efb798f-424b-4afe-b124-fd1ad9d043f8` | 0; settled `True`; released |
| `corrected-foundations` | `["scripts/check-foundations.mjs"]` | `/tmp/sgui-light-validation-slots/slot1` / `batch171:2956a9bd-2ef5-4678-b558-f7e41f883987` | 0; settled `True`; released |

The targeted external TypeScript config includes only the new story/spec and CSS
module declarations, resolving their source dependencies under repository compiler
settings. It does not typecheck all stories or claim clean packed/public-consumer
declarations. Initial and final types passed. Final review then caught an unrun
fixture expectation error: `actionPressed` aliases `actionHover`, not `action`.
Distinct parent/child action-hover overrides now verify that chain and its hover/
pressed component slots independently of default action. Corrected targeted types
and foundation guards passed with final source hashes. No red command was
suppressed; earlier type passes did not prove the mistaken runtime expectation.
Source review also corrected compact height to the declared `2rem` before checks.
The install log retains the pnpm ignored-esbuild-build-script warning; no build
execution is inferred from installation.

Initial checks ran at bootstrap HEAD with new files present before commit.
Corrected types/guard receipts ran at `9bfe228f4660c9c5e77545dadfa33b5ada1886a7`
with corrected source present before its commit. They record both final source
file hashes and all seven prerequisite file hashes; the corrected source commit
contains those exact bytes. The token guard checked the unchanged prerequisite.
No unrelated unit suite is needed for a proof-only fixture
addition. `git diff --check` and prerequisite zero-diff inspection also passed.

Each label has retained raw log `/tmp/sgui-batch171-<label>.log`, command receipt
`/tmp/sgui-batch171-<label>.log.receipt.json` and sampled process-group/resources
`/tmp/sgui-batch171-<label>.log.resources.json`. Receipts retain runtime path/version,
argv, exact precommit HEAD, owner claims, timestamps, raw-log/resource SHA-256,
exit result and released leases. Resources report exit 0, settled true and no
signal errors for every command. Consolidated evidence:
`/tmp/sgui-batch171-evidence.json` (SHA-256 `82b9ae9522ee021c7d2f9114d3e402d43362466522f7d330b3bdc9965b63641e`).

External wrapper/config hashes:

- `/tmp/sgui-batch171-command.mjs`: `276714d307333f0c3da3a11f7bde670277c3888cd63f83ea0a59ab686387f97e`
- `/tmp/sgui-batch171-types.json`: `455ff9cb105c0f11c73646f5f46e4cbe724345aefab14f70fa984116c0b19fa9`

Final validated source/prerequisite hashes:

- `src/foundation/TokenTierScope.stories.tsx`: `57fa7feeb6a18ac5cde46d034dc9c190e8e69e8a12e5b25551cc1aad5f088024`
- `tests/browser/token-tier-scope.spec.ts`: `2d381784f7eaf20751c473b8821dbc1ea608bffb66d3c51b04d522e2ef75bcf2`
- `src/foundation/tokens.json`: `1b22596dbf77a1904ac1c01026089b55190fb417a2ab6e00ddddce9b636c1d94`
- `src/foundation/tokens.css`: `fb01cc9285d81c8a66412fc1af5a1d9ab9e157b3a4346a067989fa11890e6196`
- `src/foundation/tokens.generated.ts`: `45e07cc11684334d9ba3784562b8872bb4dcd9a66312d564b7b6d845b41c3d20`
- `scripts/tokens.mjs`: `821917699a2f18876902e6bda1c310e0dc0f2daa2f08c98813af9fd682bbfca1`
- `scripts/tokens.test.mjs`: `561b03d3d71dddd294067f3f01fb8f27f7a345286df8106f32be038c03136b59`
- `docs/developer/react-aria-token-roles.md`: `9f952aa80baae50ea1741732828d2d660a5a190b683d2ef345d80b657ebe8de9`
- `docs/developer/parallel-batch-164/token-tiers-semantic-states.md`: `e4ea7aba20efd4451671f6578a7381ce8c8d9c73e2c184737a8041dae1d1bb86`
- `scripts/browser-validation-pool.mjs`: `d0df14616b329d24f3356bcb73788c294d1f3ff95892ec7e664a5cc458ade323`
- `pnpm-lock.yaml`: `786f56018e5278bc36f59b02d0c2d2ee0ab2df7fc7883178aeb4b9deb3d13438`

Retained receipt-file hashes (log/resource hashes are inside each receipt and
consolidated evidence):

- `/tmp/sgui-batch171-install.log.receipt.json`: `94a38c9612f29eec45ef52e9487e5c3967294fb5101632b3217497a16312271a`
- `/tmp/sgui-batch171-types.log.receipt.json`: `318a3404ff666cba2b91745aad42f9e366874786f6f8f1c184d5d3efe20c8e25`
- `/tmp/sgui-batch171-foundations.log.receipt.json`: `b95bb881c968892cb2320124a9b17c9d01da6185c6d870d933fffd2b7b543ddc`
- `/tmp/sgui-batch171-tokens.log.receipt.json`: `c1bd0f025e0e6cb43b30c6dbbfdf3b3d74d590092e56081a74daac5139c697b4`
- `/tmp/sgui-batch171-final-types.log.receipt.json`: `1f8dfef2ced2ba82f98fabd9cdce945efda9b02324960bdd517998db454be47f`

- `/tmp/sgui-batch171-corrected-types.log.receipt.json`: `60f281f6d56efdc89e7c3d20e81f5ed6ff5efc46fbf7c370a35a9ec7c138cf3a`
- `/tmp/sgui-batch171-corrected-foundations.log.receipt.json`: `33054e9512de7fadefb88ddcb60e70d8256fbc698c74af3750ef89bb72a8e75c`

## Pending coordinator proof and acceptance limits

No independent `pnpm check`, production build, Storybook build, browser launch or
packed React 18/19/Next consumer was run because the daily full checkpoint is
active. All five native cases, all three engines, contrast computation, forced-color
emulation and visual/manual review are unrun. A capability failure to emulate
forced colors must remain failed/unavailable evidence, not a normal-color pass.
No physical device, OS high-contrast setting, enlarged text, assistive-technology
speech or broader D/U/X/R/Z acceptance is claimed.

After independent source review, the coordinator can freeze a fresh candidate and
select `tests/browser/token-tier-scope.spec.ts` as an owned shard under the
[parallel browser policy](../react-aria-parallel-browser-validation.md), building
fresh static Storybook once and respecting its queue/leases. Retain new execution
receipts/traces and classify driver/fixture, product and environment failures.
Actual packed `/tokens` import/declaration consumer proof for `tokenTiers`,
`SemanticTokenName` and `ComponentTokenName` remains a separate pending gate.
See [token roles](../react-aria-token-roles.md) and
[development validation](../react-aria-development-validation.md).
