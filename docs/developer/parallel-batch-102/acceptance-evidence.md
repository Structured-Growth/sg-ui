# Batch 102: fresh parent-criterion evidence

Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` supplied baseline), October 7, 2026. Isolated managed worktree: `/Users/thomashall/.codex/worktrees/batch-102-evidence/sg-ui`. This report alone is the edit scope. Root coordinator owns acceptance, integration and validation windows; no master checkbox is changed.

This assesses D-18, D-19, D-20, C-03 and C-04 directly. Inventory M-row reviews, removal-audit completion and filenames are not substituted for these criteria. “Source-supported” below means the inspected contract exists at the reviewed Git head, not that a runtime test passed there. No install, tests, builds, packaging, browser, performance, global lease or CI job was executed in this assignment.

## Per-ID matrix

| ID | Disposition at reviewed head | Concrete evidence | Remaining gate / ownership |
| --- | --- | --- | --- |
| D-18 | Partial: real implementation and bounded retained native evidence | Button CSS disables transition/spinner animation under reduced motion, restores disabled opacity and uses ButtonText/Highlight/GrayText under forced colors. Progress CSS stops linear/circular animation without removing progress semantics; Canvas/CanvasText/Highlight retain track/fill distinctions. SideNavigation disables directional animations. `display-preferences.spec.ts` explicitly requires forced-colors capability and checks system focus, pending and disabled semantics; it is inspected source, not a current pass. The retained wave-29 Chromium shard below checks reduced-motion progress/steps at its own head. | Current-head native run of existing display-preferences cases, complete catalog/state review, physical high-contrast settings and manual/device/AT evidence remain. Firefox/WebKit evidence for the newer progress shard is pending. Do not transfer an older pass to this entire head. |
| D-19 | Source-supported CI mechanism; partial exact-head validation evidence | `compileTokens` validates lower-camel token keys, references, aliases and alias type compatibility, cycles, declared value types, required groups and theme/density pairing. Foundation guard parses token references and component CSS layers. Token tests require deterministic generated output and nine declared contrast pairs in each light/dark theme. `package.json` check runs foundation/token checks and foundation tests; CI invokes check on Node 22.12/24. | None of those commands was run here; exact reviewed-head CI/local results are absent in this worktree. Root can run the existing guards in its validation window. Contrast is limited to the enumerated pairs, not arbitrary states, alpha composition or consumer overrides. Generated palettes do not certify accessibility. Dev PR CI is intentionally excluded; production/main/reusable CI wiring is present. |
| D-20 | Actual missing authored coverage; partial implementation | Foundation ThemeScope stories show inherited/nested text; Typefaces shows all typography roles and production font-family metadata. Migration-proof Typography, Button ThemesAndDensity and Surface supply related examples. Storybook glob includes these stories; global Provider loads production tokens with shared class naming. | No dedicated palette, spacing scale, focus demonstration or motion/preference foundation stories were found. Surface has only Default; button density examples and incidental padding do not form the required foundation catalogue. Published current-head Storybook artifact/URL is unverified. Root should assign the bounded story handoff below. |
| C-03 | Fully source-supported owned contract (no whole runtime acceptance claim) | Generated theme/density CSS variables, ThemeScope scoped attributes and explicit custom-property inheritance, native style/class hooks, button variant/tone/state attributes and stable button part, dialog surface/body/header/footer parts and grid container/row/cell-content parts are present. Stack converts its dynamic gap through `spacingValue`; predictable direction/alignment states use attributes. Architecture documents supported CSS-variable/part/native-style escape hatches. | The criterion does not require every numeric layout value to become a custom property; native dynamic CSSProperties are an owned escape hatch. Source inspection establishes the mechanism; portal rendering, final emitted CSS/package and consumer override runtime acceptance remain separate broad gates, unrun here. |
| C-04 | Partial: inspected replacements and named mappings supported; exhaustive public styling-map acceptance unproven | Current src search finds no exact retired `sx`/`paperSx` API, positive retired foundation import or Mui selector. Baseline declared `sx` (grid), `paperSx` (modal), `headerSx`/`bodySx`/`footerSx` (card frame); replacement docs explicitly map those. Button, primitives, theme, layout/editor and grid docs describe native contracts and deliberate inherited-prop removal. Foundation guard rejects retired styling/imports transitively. | Complete baseline-to-current mapping of every inherited public styling prop has not been demonstrated by the grouped removal docs. Historical baseline, legal names and negative tests are not runtime remnants. Root owns a separate exhaustive mapping/declaration acceptance review; no product defect is inferred and no production-source fix is requested here. Exact-head guard/build/declaration/packed results remain unrun. |

## Retained evidence inspected, with limits

Read directly (not merely cited from a report):

`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/693cd1a1-28f1-4986-b345-258b4621c480/`

- Root `evidence.json` identifies tested candidate `f87c8d336932ea70ad3ab9eaea5e4e6b77bc40ec`, Node `24.19.0`, Darwin `27.0.0`, fresh Storybook build and browser typecheck commands. SHA-256: `7f6a4c09af4bde28aad03a98aa6fc6e774fb81beec8d40904b74dfe2679825b3`.
- `progress-steps-native-state/evidence.json` identifies Chromium only, four light/dark × compact/comfortable cases, slot 2/port 6555, status passed and build digest `d6a2c0f07f33e5ca842a98dbf9fe0f0f86b9700add97fdda68c4bcb87c9859f8`. SHA-256: `0416996572ff7e2d0f03495405e5f0a85c4b7613cc952c4eff445bad06ab542c`.
- `progress-steps-native-state/results.json`: expected 4, skipped 0, unexpected 0, flaky 0, top-level errors empty; duration 5715.234 ms. SHA-256: `104c82fa1bd305dcd9b945bc3d1715af649c5c1a3684bc2ecdf4f95b6c709c84`.
- Compared Git blob IDs between that candidate and the reviewed head: batch67 spec, Progress CSS, Button CSS and AppOperationSteps implementation are identical (see table). This establishes continuity of those four files only; it does not establish identical dependencies/served bytes or a fresh full-head pass. Other shards' 54 pooled cases are not D-18 acceptance evidence.

Artifact loss was checked explicitly: the older batch07 run directory `.../batch07-progress-status/sg-ui/artifacts/browser-pool/2f22bce2-9ec0-4e2d-a83c-98318a5a2414` exists but contains only `storybook/`; its `evidence.json` and `results.json` are absent. The historical `/tmp/sgui-ci-83b8dae2-artifacts` path in browser acceptance is absent. Their checked-in reports retain historical claims; those claims cannot supply current retained results or current engine coverage. No remote CI artifacts were fetched.

## Bounded handoffs, not edits in this assignment

D-20 missing foundation catalogue: reserve only NEW `src/foundation/FoundationCatalogue.stories.tsx` for a follow-up author. It can use existing Provider/ThemeScope, tokens, Typography, Surface, Button and Progress to demonstrate palettes, spacing, both densities, surface variants, keyboard focus and animation/reduced-motion guidance. Use production tokens; no new primitive, token, production CSS or shared configuration is necessary. Targeted validation request: story TypeScript and foundation import/token guards, then one fresh supervised Storybook build and visual/native review of the new story; verify published artifact separately. No new browser regression is justified merely to assert story existence.

D-18 validation request: existing `tests/browser/display-preferences.spec.ts` reduced-motion and forced-colors cases against one freshly built frozen candidate, with capability attachments and per-engine results retained. No new test file or source allowlist is needed. Physical OS contrast and spoken AT remain a human/device review, even if emulation passes.

D-19 request: existing `pnpm foundations:check`, `pnpm tokens:check`, `pnpm test:foundations` in root's scheduled window, with exact tested head and logs. No generator/test/config change requested.

C-04 evidence reconciliation: compare `docs/developer/migration-baseline/public-api.json` inherited and explicit styling surfaces with current owned declarations and existing component mapping guides. An exclusive NEW report path could be `docs/developer/parallel-batch-102/styling-map-followup.md` if root assigns it; all production remains read-only unless a specific missing mapping or behavior is proven. Broad removal inventory work is already covered elsewhere and should not be duplicated.

No optional acceptance-pack-102 native spec was created: existing deterministic tests already cover the identified preference behavior; the actual gap is authored foundation stories and acceptance evidence rather than an uncovered source regression.

## Exact read-only checks performed

- `git status --short`, `git rev-parse HEAD`, `git log -1`, managed worktree attachment/creation inspection.
- `rg --files` / `rg -n` across foundation, experimental/catalog source, stories, guard scripts, package scripts, CI workflow and linked acceptance/contract docs; read the relevant token generator/tests, preference spec, scope/button/progress/stack/dialog/grid sources and Storybook config.
- Exact retired-pattern search over `src/**/*.{ts,tsx,css}`; broad text search initially matched ordinary names such as `.tsx` and test descriptions, then the literal API/import/selector patterns were distinguished. No runtime retired styling surface found by that search; this is not an AST/declaration build result.
- Parsed the historical baseline declaration JSON to identify named explicit styling slots; inspected their replacement guides. Did not assume inherited upstream props were enumerated there.
- Read retained JSON manifests/results, calculated SHA-256 and compared four historical/current Git blob IDs. Inspected artifact-directory presence without launching or changing any prior worktree.
- Report validation: relative-link existence, Git diff whitespace and exclusive changed-path review. No UI/test execution.

## Source Git blobs at the reviewed head

Every link below resolves to a file inspected for this report; hashes are Git blob IDs from the exact baseline above, not test result hashes.

| Source / evidence | Git blob |
| --- | --- |
| [src/foundation/ThemeScope.tsx](../../../src/foundation/ThemeScope.tsx) | `ec330a71f6ee1f32ad10b717efe5a285094ca953` |
| [src/foundation/tokens.css](../../../src/foundation/tokens.css) | `b36050c8871253823b4a9deb8d146936a14222ec` |
| [src/foundation/ThemeScope.stories.tsx](../../../src/foundation/ThemeScope.stories.tsx) | `d52653b241378afac782cea9ebbc418f6c2d78e3` |
| [src/components/Typefaces/Typefaces.stories.tsx](../../../src/components/Typefaces/Typefaces.stories.tsx) | `aca68f85eb8d0d0003a4bce37196d3a00abcad21` |
| [scripts/tokens.mjs](../../../scripts/tokens.mjs) | `ffdeac9ea13db3107fa90eb3760cfae743b38bb5` |
| [scripts/tokens.test.mjs](../../../scripts/tokens.test.mjs) | `c06e8cbe72a0460ab9f54198bea95d3c74bf2b01` |
| [scripts/check-foundations.mjs](../../../scripts/check-foundations.mjs) | `ecc96a852355231cc7845642c589980825a6356d` |
| [package.json](../../../package.json) | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) | `d1d9f200e46767226b6022925c40358680cd40c5` |
| [.storybook/main.ts](../../../.storybook/main.ts) | `0774f805dda513b2422a02692c5f4ccec8d6c131` |
| [.storybook/preview.tsx](../../../.storybook/preview.tsx) | `b84d33831293a155cc571eef6545d7deed67b683` |
| [src/experimental/Button/Button.tsx](../../../src/experimental/Button/Button.tsx) | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| [src/experimental/Button/Button.module.css](../../../src/experimental/Button/Button.module.css) | `cccf005e0bdee43ac22d8f8830523938ce5167f6` |
| [src/experimental/Button/Button.stories.tsx](../../../src/experimental/Button/Button.stories.tsx) | `38be82c23d7e7a1acdfd4b358addb4029b6c0329` |
| [src/experimental/Progress/Progress.module.css](../../../src/experimental/Progress/Progress.module.css) | `1f51077901370d9c9009604673bf44b0995fdd1c` |
| [src/components/SideNavigation/SideNavigation.module.css](../../../src/components/SideNavigation/SideNavigation.module.css) | `6114fac274317446f612a6fe2be5c8afceb7745f` |
| [src/experimental/Surface/Surface.stories.tsx](../../../src/experimental/Surface/Surface.stories.tsx) | `d28b601a426238d8d6a5c72dd7446e25a2031cfc` |
| [src/experimental/Typography/Typography.stories.tsx](../../../src/experimental/Typography/Typography.stories.tsx) | `18d14d3174a5307ef09e8baa152c1c433735cf19` |
| [src/experimental/Stack/Stack.tsx](../../../src/experimental/Stack/Stack.tsx) | `5c30bca34069aa899c8e38479ade3bf7aaa7acb0` |
| [src/experimental/Dialog/Dialog.tsx](../../../src/experimental/Dialog/Dialog.tsx) | `b0bd1ef6109dba186bc881854339da68ec896284` |
| [src/components/AppDataGrid/ownedGridCells.tsx](../../../src/components/AppDataGrid/ownedGridCells.tsx) | `f1c3deb30e843e74b3b065d7e847374593acdd8d` |
| [tests/browser/display-preferences.spec.ts](../../../tests/browser/display-preferences.spec.ts) | `cd5204cc7ab2f3deacc4da235198498138316dc7` |
| [tests/browser/batch67-progress-steps-native-state.spec.ts](../../../tests/browser/batch67-progress-steps-native-state.spec.ts) | `8641f122af3fe786e51255c6ab9f147f4ee21cc4` |
| [src/components/AppOperationSteps/AppOperationSteps.tsx](../../../src/components/AppOperationSteps/AppOperationSteps.tsx) | `3c8a42fb3a17a1889dcb480ffdad0eeb5dd5b4c5` |
| [docs/developer/migration-baseline/public-api.json](../migration-baseline/public-api.json) | `26d82ff5765f1c667bc025e88ac107cc6f44ad99` |
| [docs/developer/react-aria-button.md](../react-aria-button.md) | `f649306ebd479ca18cf77aab1f6864f8147dbfc9` |
| [docs/developer/react-aria-modal-shells.md](../react-aria-modal-shells.md) | `294a3e1d9882a565f95ebc793af42d786cbc3ba3` |
| [docs/developer/react-aria-card-frames.md](../react-aria-card-frames.md) | `85c8934df5e2c6b328f80e158145934a67c29dac` |
| [docs/developer/react-aria-primitives.md](../react-aria-primitives.md) | `e3d7832c63d99f33f312935b69d7447dc6268d6b` |
| [docs/developer/react-aria-catalog-grid.md](../react-aria-catalog-grid.md) | `58c59e7e56139e470d13c5f759e23d918dc913e1` |
| [docs/developer/react-aria-architecture.md](../react-aria-architecture.md) | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| [docs/developer/react-aria-browser-acceptance.md](../react-aria-browser-acceptance.md) | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
| [docs/developer/parallel-batch-67/progress-steps-native-state.md](../parallel-batch-67/progress-steps-native-state.md) | `6e70ecea9fe80ab681243111a132b5fd632bad48` |
