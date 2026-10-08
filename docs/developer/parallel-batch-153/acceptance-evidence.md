# Batch 153: D-20 authored foundation catalogue

Prepared October 7, 2026 from exact `codex/dev` base
`e53b6e20f4a6dd56e27ab0402923f3b5f9024fc3` in isolated managed worktree
`/Users/thomashall/.codex/worktrees/d20-foundation-catalogue/sg-ui`.
Ownership is limited to this record and
[src/foundation/FoundationCatalogue.stories.tsx](../../../src/foundation/FoundationCatalogue.stories.tsx).
Coordinator owns executable validation, integration and acceptance. No master
acceptance/state, production tokens, CSS, configuration or other source was edited.

## Exact criterion and gap review

[D-20](../react-aria-master-task-list.md) says:
“Publish foundation stories for palettes, typography, spacing, density, surfaces,
focus, and motion, all consuming production tokens.”

The integrated [batch 102 review](../parallel-batch-102/acceptance-evidence.md)
identified missing dedicated palette, spacing, focus and motion examples, an
insufficient surface catalogue and unverified publication. Before editing, source
inventory confirmed the reserved catalogue filename and its Storybook title were
absent at the supplied base. Existing ThemeScope, Typefaces, migration-proof
Button and Surface stories were inspected rather than duplicated wholesale.

Read repository AGENTS.md, [architecture](../react-aria-architecture.md),
[development validation](../react-aria-development-validation.md), generated
production tokens, their JSON source, ThemeScope, shared Storybook preview/config,
and the owned Box/Stack/Typography/Surface/Button/Progress implementations and CSS.
The existing Storybook glob includes the new file; its global Provider imports
production token CSS and supplies shared locale, visual direction and density.
Component imports load their production CSS Modules. No alternate theme or
preference override stylesheet is introduced.

## Source-authored coverage, not executable acceptance

| D-20 area | Concrete coverage | Remaining proof |
| --- | --- | --- |
| Palettes | `Palettes` displays all twelve generated semantic color tokens in explicit light/dark scopes, with readable labels outside decorative swatches and actual Typography tones/action pairs. | Visual review of both themes, contrast and forced-color behavior; publication. |
| Typography | Catalogue docs link the existing `Foundations/Typefaces` Defaults story. That story already renders all fifteen production roles including bodyAlt2 and production font-family metadata; no duplicate typography catalogue is added. New catalogue headings/text use owned Typography. | Review the linked rendered story and host font availability; publication. |
| Spacing | `Spacing` renders the complete four-step shared scale, source JSON lengths, token-sized bars and matching owned Surface padding. No duplicated literal spacing values. | Run authored play check for positive/increasing resolved bar widths; visual review with enlarged text. |
| Density | `Density` compares identical owned buttons under inherited compact/comfortable scopes in both themes; shows token names for control height/padding. | Run authored play check that both themes resolve larger comfortable height/padding; visual review. |
| Surfaces | `Surfaces` renders all six default/subtle × flat/outlined/raised combinations in both themes, using owned Surface variants, tokens and text roles. | Native/visual review of surface, divider, shadow and text; forced colors. |
| Focus | `KeyboardFocus` supplies primary/neutral/text actions, disabled traversal and a visible activation status; production focus width/offset/color token names are shown. No fake focused CSS/state is applied. | Run authored play check for keyboard focus-visible, Space activation, disabled skipping and Shift+Tab; native ring/forced-color review. |
| Motion | `MotionAndPreferences` includes real button hover/press transition, pending spinner, indeterminate linear/circular progress and determinate progress. Metadata displays the production motion duration. Instructions describe actual OS/browser preference changes, not a token/theme simulation. | Run authored play check for progress value semantics and circular animation conditional on actual reduced-motion media query; review button/linear/circular reduced motion and forced colors, including physical settings. |

Authored story IDs (not verified by a build):

- `foundations-foundation-catalogue--palettes`
- `foundations-foundation-catalogue--spacing`
- `foundations-foundation-catalogue--density`
- `foundations-foundation-catalogue--surfaces`
- `foundations-foundation-catalogue--keyboard-focus`
- `foundations-foundation-catalogue--motion-and-preferences`

The story play checks are meaningful executable candidates colocated in the only
owned source file. They are **UNRUN**. They do not certify native timing, all
preferences, accessibility or publication. No additional browser regression is
created solely to assert story existence, matching the batch 102 handoff.

## Static verification and coordinator handoff

Performed: exact base/clean-tree check before edits, filename/title inventory,
production API/token/Storybook wiring inspection, relative import/document link
existence review, changed-path review and `git diff --check`. These are static
checks, not type/import/token guard execution.

**UNRUN:** install, unit/story play tests, TypeScript, foundation/token guards,
Storybook build, browser/native/visual checks, packed consumers and publication.
No install/build/browser/heavy test or shared validation lock was used. No remote
CI, workflow setting, permissions, secrets, trigger, release or publication was
changed. The primary image-upload worktree and all other scopes were untouched.

Coordinator validation request: story TypeScript and foundation/token guards;
one freshly built supervised Storybook candidate; run the authored play checks
and inspect all six stories with light/dark, both densities, RTL, enlarged text,
reduced motion and forced colors. Preserve exact tested head/artifact and per-engine
limits. Verify a published Storybook artifact/URL separately. D-20 stays open
until the publication criterion and required review have actual evidence; this
record closes only the source-authoring gap. No master checkbox is changed.

Source file SHA-256:
`f24e5dc750b5b5d8f641671bee4df2aa5748cb4954d5493312b90292119ce94a`.
Source Git blob: `885617888749dcf6561117c6c02de690ad4ca1c5`.
The completion message records the final commit and both file hashes; this record
cannot embed its own final commit/hash without changing that identity.
