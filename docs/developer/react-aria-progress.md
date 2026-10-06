# React Aria migration execution record

Started: 2026-10-05. Owner: Codex, local implementation for maintainer review.
Baseline commit: `21adebd61bedfc6a1ed395fe664ff4be83896821` on `main`.
No release tags were present and the working tree was clean before implementation.
No implementation commit, draft PR, merge or publication has been made yet.

## First implementation milestone

Implemented the foundation and button/field proof slice. At this first milestone
the catalog had not been converted; the migration remains **in progress**. The
[architecture decision](react-aria-architecture.md) records owned contracts,
dependency direction, stylesheet output and the temporary experimental entry point.

| Tasks | Evidence and disposition |
| --- | --- |
| B-01, B-02, B-06, B-14 | Captured initial state/package/API, read all required guidance, established a green baseline, left the learner platform unchanged. |
| B-03–B-05 | Partial inventory: [foundation references and public barrels](migration-baseline/inventory.json), [built public declarations](migration-baseline/public-api.json), [package metadata](migration-baseline/package.json). Defaults, DOM/focus audit and full transitive review remain open. |
| A-01, A-19, C-21 | Recorded implementation/dependency decisions in the architecture document. The grid engine decision is recorded below; final catalog API mappings remain open. |
| A-02–A-18, L | Partial implementation: explicit new layers, owned proof props and declarations, import guard, exact interaction dependency, retained commercial terms and added upstream Apache license. Remaining catalog mappings and full license inventory remain open. |
| D-01, D-03 | Reviewable typed token source, deterministic CSS/TypeScript generation, alias/type/cycle validation. |
| D-04–D-19 | Proof coverage only: light/dark/system, density, rem sizing, Geist fallback, text/action/border/focus roles, nested scopes, reduced motion, forced-colors rules and contrast checks for selected pairs. Full catalog tokens, portal inheritance and assistive-technology validation remain open. |
| C-01, C-02, C-05–C-07 | Compiled CSS Modules, emitted class maps/stylesheet, namespaced ordered layers, scoped normalization and documented imports/overrides. |
| C-09, C-15, C-16, C-18, C-20 | Partial: logical proof styles, focus/reduced-motion rules, import/token/layer checks and packed Vite CSS validation. RTL interaction, whole-catalog linting and full consumer matrix remain open. |
| P-01 | Styled button and labeled field proof, owned props, compiled output, Storybook, unit behavior and browser checks. This is a proof, not production catalog migration. |
| R-01–R-09, W | Partial: new modules preserve explicit client boundaries, pure tokens remain server importable, new subpaths and CSS side effects, declaration checks, a packed Vite fixture and consumer/guidance updates. Legacy build boundaries and Next.js/SSR consumers remain open. |

## Dialog and form proof continuation

Implemented P-02 with owned `Dialog`, `Popover`, `Tabs`, `ComboBox` and `Provider`
contracts. See the [control recipe and contracts](react-aria-proof-controls.md).
The composed Storybook form includes required validation, disabled tabs/options,
sticky tabs with independently scrolling panel content, and a nested form popover.
The host keeps drafts and submits them; the proof does not persist application data.

Portals now carry theme/density and explicit scope token overrides without layout
styles. The locale bridge takes the existing host translation locale and supplies
consistent interaction direction and language. This is new-control coverage for
D-16/C-17/H-06; the complete catalog and browser matrix remain open.

Every new control has colocated tests, including standalone popover tests as
requested. Component and integration coverage now includes:

| Control | Behavior coverage |
| --- | --- |
| Button | Pointer/Enter/Space activation once, refs, disabled/pending, native submit |
| TextField | Labels/descriptions/errors, controlled/uncontrolled values, read-only/disabled/required, serialization and native reset |
| ThemeScope | Nested settings and stable server markup |
| Provider | Host locale/direction in server markup; RTL keyboard integration through Tabs |
| Tabs | Automatic/manual activation, disabled skipping, controlled selection, RTL arrows |
| ComboBox | Filtering, keyboard selection, string ID serialization, disabled options, descriptions/errors, empty state, read-only/disabled |
| Dialog | Focus entry/containment/restoration, dismissal locks/reasons, local nested Escape, portal settings, assistive dismissal |
| Popover | Opening/focus/restoration, controlled state, portal inheritance including host RTL and token overrides |

The foundation check now requires test files for registered interaction controls.
jsdom's missing `CSS.escape` is supplied by a test-only standards polyfill; tests
execute real interaction components without substituting their behavior.

Browser verification caught and corrected a dismissal-reason mismatch caused by
native event timing. Final native Escape reports `escape`; after a nested popover
consumes Escape, a backdrop press reports `outside`. Focus restores to the trigger.
Also verified popup keyboard selection, dark portal surfaces, document overflow
locking, and panel scrolling (291px viewport with 880px content while the tab/header
positions remained fixed). Screen-reader, touch, zoom and full browser-matrix
verification remain open.

## Async, calendar and grid proof continuation

P-03–P-06 now have owned controls, colocated stories/tests and documented contracts.
The catalog still uses the old foundation; no catalog conversion is claimed.

| Control | Behavioral evidence |
| --- | --- |
| AsyncMultiSelect | Host query/results, aborted requests and late-response rejection, keyboard multi-selection, selection retained outside results, loading/error/retry/empty/read-only, 200 results, native values/reset and focus after removal |
| DateRangeSelector | Presets remain drafts; Apply/Cancel, two months, typed endpoints, inclusive min/max/unavailable rules, required/empty drafts, controlled commits and leap years |
| DateField | Keyboard segments, date/local datetime serialization, native reset, controlled values, descriptions/errors and read-only |
| TimeField | Clock seconds, controlled editing, serialization/reset and disabled submission |
| Calendar | Focus distinct from selection, leap-day keyboard selection, arbitrary multiple dates, removal, host RTL and keyboard-reachable unavailable reasons |
| DatePicker / DateRangePicker | Calendar/field synchronization, Apply/Cancel/Escape, focus return, host-owned values, serialization and native reset including host-prevented reset |
| Checkbox | Space once, mixed state, controlled/uncontrolled, form values/reset, disabled/read-only |
| DataGrid | Filter-before-sort/page, multi-sort priorities, server order/unknown totals, cross-page IDs, page selection, visibility locks, owned actions/reorder, keyboard resizing and drag cancellation |

Browser checks verified range selection from February 28 to leap day, async search
and selection of both Course 20 and Course 200, column width 180→190 using Enter/
Right, keyboard drag cancellation, and host-committed reorder from Course 1/Course
2 to Course 2/Course 1. Tests caught and fixed contextual selection labels and
collection caching during column hiding. Test-only zero geometry prevents reliable
ArrowDown list positioning in jsdom; Home/End selection is covered there, and
ArrowDown multi-selection was verified in-browser without interaction mocks.

See [calendar contracts and limits](react-aria-calendar-contracts.md) and
[grid ownership/candidate comparison](react-aria-grid-decision.md). P-09 selects
TanStack v8 row processing plus React Aria interaction, with SGUI public state and
no duplicated selection model. TanStack MIT notices were added without changing
SGUI's commercial license. P-10 retains one general interaction foundation.

## Icons, native presentation and action controls

Independent Lucide vectors now cover all 95 inventoried direct icon names, with
owned size/color/label/ref and RTL contracts. The upstream ISC and applicable
Feather MIT notices are retained. Activity icon overrides and fallbacks have
behavior tests. Individual icon subpaths are tested through the packed fixture;
unused catalog icons are absent from the basic consumer bundle. Existing public
icon barrels remain on the original implementation until catalog migration.

Typography, Box, Stack, Surface, Card/CardContent and Divider now have native,
server-renderable implementations and colocated stories/tests. IconButton,
ButtonGroup, command Menu and SplitAction have owned contracts, keyboard/ref/
loading coverage and portal scope inheritance. See the
[layout/action contracts](react-aria-layout-actions.md). Tests caught and fixed
menu context overriding the explicitly supplied accessible name.

Switch and RadioGroup additionally cover keyboard activation, disabled skipping,
controlled/read-only behavior, native values/reset and validation associations.
Select, TextArea, Link and Breadcrumbs also have tests covering option identity/
disabled choices, empty state, multiline/native form behavior, host routing and
current-page semantics. Malformed date/time values report validation instead of
throwing during render.

These additions are not yet evidence of complete U-01/U-02/U-05 acceptance or
catalog parity; responsive/zoom/touch verification and remaining controls are open.

Persistence now validates configured schemas and supports versioned migration,
storage selection, stable SSR/default snapshots, cross-tab events and working
memory fallbacks for blocked/quota-failing storage. A regression verifies local
storage clear events do not erase an unmounted session fallback. Pagination now
validates stored shapes before normalization; its inherited size policy remains
until replacement grid integration. See [persistent view state](persistent-view-state.md).

The [performance reference](react-aria-performance.md) records reproducible server
workloads, composed production assets and initial investigation budgets. Client
interaction/memory and slower-hardware measurements remain open.

## Validation evidence

Before implementation:

- `pnpm check`: 54 Vitest files, 227 tests, four release-policy tests, typecheck,
  ESM/declaration build and all existing package entry points passed.
- `pnpm build-storybook`: passed with the existing large-chunk warnings.

After the initial proof implementation, before the catalog continuation below:

- `pnpm install --frozen-lockfile`: passed after package-manager dependency updates.
- `pnpm check`: 92 Vitest files, 455 tests, four token/CSS tests and four release
  tests passed, together with import/layer/token checks, production/story typecheck,
  ESM/declaration build and package consumer checks.
- `pnpm build-storybook`: passed; existing catalog stories remain, with colocated proof
  story files added. Large-chunk warnings remain; this is not a performance result.
- Packed Vite fixture: real tarball import, one emitted CSS file, generated token
  and module selectors preserved, basic proof JavaScript excludes legacy/editor
  dependencies. The fixture explicitly disables peer auto-installation; this does
  not remove the current package's legacy peer requirements. The production output
  was also inspected in-browser: dark action colors and 44px comfortable height
  matched Storybook. The packed fixture now imports all dialog/form proof controls
  and checks that their overlay tokens survive the production stylesheet build.
- In-app browser: verified light/dark button colors, 44px comfortable and 32px
  compact heights, keyboard focus with a 2px visible outline, required email
  validation/focus, keyboard correction on blur and native form reset. Browser
  automation's synthetic fill did not commit native `change`; real keyboard entry
  did. Unit tests cover native reset, labels/descriptions/errors, controlled and
  uncontrolled values, refs, disabled/read-only/pending states, single pointer/
  Enter/Space activations and submit behavior.
- Server render tests cover the interaction controls, native values and labels,
  nested scope inheritance and stable system-theme markup without browser reads.
  These are not RSC or portal tests. Packed React 18.3.1 and 19.2.3 fixtures additionally
  render server HTML without browser globals and hydrate it in production builds.
  Browser checks preserve server-generated field IDs and open the hydrated dialog
  on both majors. A missing UTF-8 declaration in the initial fixture corrupted
  Unicode server text; fixing the fixture resolved the mismatch without suppressing
  hydration diagnostics. The full calendar/grid/editor hydration matrix remains open.

Local tools: Node 26.5.0 and pnpm 10.29.3. The repository's Node 24 development
target is unchanged; Node 24 runs remain to be verified; packed React 18.3/19 SSR and hydration proof
fixtures now pass the checks described above.
Apple's system Git was blocked by its Xcode license; bundled Git was used for
read-only status, tags and baseline capture without changing OS configuration.

## Owned controls and first catalog migrations

Completed locally on 2026-10-06, with source/stories/tests and consumer contracts.
No commit, draft PR, merge or publication has been made. The existing uncommitted
foundation work was preserved. This batch completes U-03 and U-11–U-16 and catalog
rows M-02, M-03, M-24 and M-35. U-07 gains Tooltip but stays open for the remaining
command-menu work. Most of U/M/E/G/K and the final X/R/Z gates remain open.

| Tasks | Implementation and acceptance evidence |
| --- | --- |
| U-03, M-35 | [Owned Typography](../../src/experimental/Typography/Typography.tsx), native semantics/ref and SSR tests, all typography roles including bodyAlt2/code. [Typefaces](../../src/components/Typefaces/Typefaces.stories.tsx) keeps the catalog and adds missing roles/dark mode using production tokens. |
| U-11 | [List](../../src/experimental/List/List.tsx), [Navigation](../../src/experimental/Navigation/Navigation.tsx), [Disclosure](../../src/experimental/Disclosure/Disclosure.tsx), [Collapse](../../src/experimental/Collapse/Collapse.tsx). Colocated stories and 11 behavior/SSR tests cover host routing, native roles, selected state, controlled/uncontrolled expansion, disabled state, tab order and focus restoration. Browser collapse removed the focused panel's input while preserving trigger focus. |
| U-12 | [Chip](../../src/experimental/Chip/Chip.tsx), [Badge](../../src/experimental/Badge/Badge.tsx), [TagGroup](../../src/experimental/TagGroup/TagGroup.tsx). Nine tests cover refs/names, group/item disabling, translated removal, keyboard next/previous/empty focus and pointer removal. Browser Delete moved React→Design focus; pointer removal moved to the list when only a disabled tag remained. |
| U-13, U-14 | [Progress](../../src/experimental/Progress/Progress.tsx), [Status](../../src/experimental/Status/Status.tsx), [Avatar](../../src/experimental/Avatar/Avatar.tsx), stories and behavior/SSR tests. Determinate/indeterminate semantics, optional announcements, name/ref, source replacement and image load/error. Browser native image success showed opacity 1/natural width 80 with a 40×40 root; native error removed the image and retained initials in the 48×48 large root. |
| U-15 | [Table](../../src/experimental/Table/Table.tsx) and [Pagination](../../src/experimental/Pagination/Pagination.tsx), six tests and stories. Native table refs/caption/headers, known/unknown totals, zero pages, boundaries, disabled state, form-safe keyboard actions and page-zero-before-size callbacks. Browser last-page navigation and size 25→50 reset Page 4→Page 1. |
| U-16 | [ToggleButton/ToggleButtonGroup](../../src/experimental/ToggleButton/ToggleButton.tsx), five behavior tests and stories. Native refs, controlled/uncontrolled selection, single/multiple selection, no form submission, disabled skipping, required selection, RTL and vertical arrows. Browser arrows moved focus independently, then Space committed Grid→Cards. |
| U-07 partial | [Tooltip](../../src/experimental/Tooltip/Tooltip.tsx), four behavior tests and stories. Focus description, hover, Escape/return focus, disabled state and portal visual/locale overrides; browser keyboard opening/dismissal. Submenus and broader overlay/browser checks stay open. |
| M-02, M-03 | [AppInlineProgress](../../src/components/AppInlineProgress/AppInlineProgress.tsx) and [AppOperationSteps](../../src/components/AppOperationSteps/AppOperationSteps.tsx) now use owned controls/icons/styles. Public names/props retained; percentage normalization, ordered steps, translated status text and accessible progress covered by behavior tests and updated stories. Non-finite inline values now become 0%; completed-step color now uses the action token. |
| M-24 | [EditableTitleField](../../src/components/EditableTitleField/EditableTitleField.tsx) now uses owned controls/icons/styles. Existing props and host-owned persistence preserved. Behavior/SSR and parent compatibility tests cover Enter/blur/Escape, trimming, duplicate pending saves, rejection/retry, IME and focus. Browser saved Updated course title and restored Edit title focus; rejection retained Retry title with aria-invalid and an associated error, Escape restored focus without another save. |

Contracts and integration changes are in [remaining controls](react-aria-remaining-controls.md)
and [progress/avatar](react-aria-progress-avatar.md). Migrated catalog controls require
`/styles.css` and an owned scope; this is a consumer integration change even with
preserved props. Granular `/components/AppInlineProgress`,
`/components/AppOperationSteps` and `/components/EditableTitleField` avoid resolving
the legacy catalog. Root/full catalog peers remain required until final removal.
Storybook supplies production owned scope alongside the legacy provider for mixed
compositions. The foundation guard now covers migrated directories and traverses
their relative implementation dependencies; declaration checks include them too.
Screenshot review also caught ordinary text inheriting the host's light-theme color
inside a dark scope. ThemeScope now sets its inherited text color through the scoped
text token, preserving explicit host style overrides and nested light/dark settings;
the foundation scope story covers plain and Typography text.

Validation for this continuation:

- `pnpm check`: 109 Vitest files / 509 tests, four foundation tests, four release
  tests, typecheck, token/import/layer checks, ESM/declaration build and all public
  package consumer checks passed.
- `pnpm build-storybook`: passed with existing directive/sourcemap and large-chunk
  warnings; no warning filters or check exemptions were added.
- Expanded packed React 18.3.1 and 19.2.3 fixtures: server render without browser
  globals, production build, one compiled stylesheet, no legacy/editor code in the
  bundle, and no auto-installed legacy peers passed. Fixtures now include new
  controls and all three migrated component subpaths.
- Production browser hydration on both React majors opened Disclosure, committed
  Cards selection and focused the migrated title input. Course field IDs stayed
  server-generated; no captured browser error/warning or hydration diagnostics.
- Native behavior checks above are representative in-app browser checks. Full
  Chrome/Firefox/WebKit, touch, zoom/reflow, screen-reader, visual regression,
  performance, Node 24 and Next.js verification remain open under X/R.

The following batch completes those card migrations below.

The successor chat was started for that batch. Final screenshot review's scoped
text-color correction passed the affected foundation/experimental/migrated tests
(56 files / 279 tests), package build and Storybook rebuild. A full rerun after
the successor began editing encountered intermediate card tests/stories; those
are part of the active next batch and must pass its full validation. No failing
checks were disabled or excluded. The earlier 509-test full pass above describes
the coherent first batch before those subsequent card edits.

## Card pagination and course cards

Completed on 2026-10-06: M-11, M-12, M-13, M-14 and M-15. The preceding uncommitted
foundation work was preserved and is included in [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1)
(branch `feat/react-aria-owned-foundation-cards`);
no merge or publication is authorized. See [card pagination contracts](react-aria-card-pagination.md)
and [frame/card mappings](react-aria-card-frames.md) for the breaking stylesheet/scope,
frame styling slots and page-size callback integrations. Public component names,
Class-prefixed contracts, routing, translation and host callbacks remain available.

| Task | Implementation and acceptance evidence |
| --- | --- |
| M-12 | [AppPaginationFooter](../../src/components/CardPaginationFooter/CardPaginationFooter.tsx) uses owned Pagination, translated range/page labels, normalized page/size/counts, unknown totals and disabled boundaries. Six behavior/SSR tests include namespace/values, page-zero-before-size ordering and form-safe keyboard activation. |
| M-11 | [CardCollectionWithFooter](../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx) uses responsive container columns, stable row keys, independent grid scrolling and translated host-replaceable empty/loading states. Six tests cover keyed identity, shrinking rows with consistent footer, controlled size/navigation, SSR and nested learner action/form composition. |
| M-13 | [ClassCardFrame](../../src/components/ClassCardFrame/ClassCardFrame.tsx) uses owned Card and tokenized slots, preserves 420/360 constants and allows container shrinkage. Three tests cover native article slots, optional footer, width and slot class/style overrides plus server rendering. |
| M-14 | [InstructorClassCard](../../src/components/InstructorClassCard/InstructorClassCard.tsx) uses owned avatar/typography/icons/host Link, status labels, archived metadata branch and retained action-label mappings. Three tests cover host keyboard routing, state/custom-label branches, translation values and SSR. No menu or persistence callback was present in its existing contract; none is invented. |
| M-15 | [LearnerClassCard](../../src/components/LearnerClassCard/LearnerClassCard.tsx) uses named Progress, owned actions/links/avatar/icons and the retained locale/due formatter. Three tests cover normalized displayed/accessible percentages including non-finite inputs, callback once, host Details routing, isolated Continue links/fallbacks, translation values and SSR. |

Each directory has updated colocated stories, including interactive pagination,
empty/loading states, composed course cards, narrow long names, frame slot styling
and light/dark examples. All five directories enter the transitive source/token/CSS
boundary check, owned declaration check, granular exports and packed consumer fixture.
AppPaginationFooter's granular path uses its existing CardPaginationFooter directory.

Final validation:

- pnpm check: 109 files / 516 tests passed, four foundation tests, four release tests,
  production/story typecheck, source/token/layer checks, clean rebuilt ESM/declarations,
  all package imports and consumer typings. The existing native-navigation jsdom
  limitation can emit a diagnostic in legacy/modified-click tests; assertions passed.
- pnpm build-storybook: passed after final story edits, with existing directive,
  sourcemap and large-chunk warnings; no check exemptions or warning filters.
- Packed React 18.3.1 and 19.2.3: SSR without browser globals, Vite production build,
  one compiled stylesheet, no legacy/editor bundle or auto-installed legacy peers.
  Expanded fixtures include all five granular card imports. Browser hydration rendered
  dark card surfaces and named 40% learner progress on both majors; hydrated Disclosure
  opened on both and captured error/warning logs were empty.
- Native in-app browser: collection Last page showed Courses 9–12 and 9-12 of 12;
  size 4→8 reset Page 3→Page 1 with Courses 1–8. Tab showed visible Next/Continue
  focus, Enter paginated. At 320px viewport, grid used one 256px track with no document
  horizontal overflow. Both card long-name stories wrapped in 260px frames without
  overflow. Dark instructor surface/action colors used generated dark tokens.
- Composed learner cards: 214.7px grid viewport with 1123px content scrolled to 908px;
  footer top remained 230.7px and document scroll remained zero.
- Node 26.5.0 / pnpm 10.29.3 local tools. Node 24, full Chrome/Firefox/WebKit, touch,
  screen-reader, zoom/reflow matrix, visual regression, Next.js/RSC and broader
  performance verification stay open under X/R/Z. Existing general U acceptance
  boxes remain open except previously evidenced completions.

Next dependency batch: M-01 AppButton and M-10 ExperiencePageNavigator, then M-05
AppPageTabs and M-04 AppPageHeader as dependencies allow. Evaluate owned public prop
mappings and update legacy compositions using removed props in the same batch.
Keep grid/editor/global acceptance gates open and continue only from validated evidence.

## Continuing execution

Finish the remaining baseline measurements, owned API mappings and P-07/P-08/P-11
verification records. The async/date/grid proofs and engine decision have landed
locally. Complete the remaining token/icon/host
foundations while continuing the remaining U/M/E/G/K work. No mass import replacement is permitted
by this milestone. All unchecked required tasks remain required.

The experimental contracts may change during proofs. Keep the current `App*`
exports available until each component's implementation, stories, tests and
consumer mapping land together. Any removal of existing public props/types is a
breaking change. The complete dependency/literal-removal audit Z remains open. Baseline snapshots
contain the old APIs by design during execution; replace/remove them during Z
rather than excluding them from the final literal audit.

Review changes as a draft PR with task IDs and validation evidence. The existing
component-only Actions AI allowlist does not cover this infrastructure change;
it requires the ordinary maintainer PR path. No release workflow or credential/
permission setting was modified. A future merge of a release-worthy commit can
trigger the existing release workflow; no merge is authorized by this record.

## Page actions and navigation

Completed on 2026-10-06: M-01, M-04, M-05 and M-10, added to the shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) on
`feat/react-aria-owned-foundation-cards`. No merge or publication is authorized.
Most catalog rows and broad U/X/R/Z gates remain open.

| Task | Implementation and evidence |
| --- | --- |
| M-01 | AppButton now wraps owned Button, forwards a native button ref, uses variant/tone/density and event-free onPress, defaults to form-safe type=button and preserves loading/disabled semantics. Four behavior/SSR tests cover pointer/Enter/Space once, pending/disabled, native submit and decorative slots. Stories cover variants, dark pending/disabled, compact density and native form submission. |
| M-05 | AppPageTabs preserves value/items/onChange/density and routing; adds disabled items, named regions, manual activation and owned content panels. Local tabs connect panel IDs, skip disabled items and retain host-controlled selection. Route sections use native links with aria-current, host routing/replacement and native modified clicks. Keyboard focus scrolls only the overflowing section strip. |
| M-04 | AppPageHeader preserves title, metadata, breadcrumbs, menu/action precedence and owned zero-argument callbacks. Native heading level is independent of visual typography. Primary/subpage surfaces use shared light/dark tokens. Long paths retain collapsed ancestor menus with native route anchors, disabled commands and return focus. Metadata/actions and long text wrap in narrow containers. |
| M-10 | ExperiencePageNavigator retains the actual authoring page-list model and host callbacks. Separate selection/actions, translated rename/remove, guarded native-form rename, read-only/last-page restrictions and drag source/target validation remain. Move up/down adds keyboard/touch reorder requests using the existing callback. Removal moves focus to a surviving adjacent page after the host commits row removal. |

The [button](react-aria-button.md), [page layout](react-aria-page-layout.md) and
[page navigation](react-aria-page-navigation.md) guides document breaking prop/style
mappings and host integration. All four directories have granular exports,
transitive source guards, owned declaration checks, colocated stories/tests and
packed fixtures. Consumer typings reject AppButton sx, native onClick and href.
Library-owned labels retain translation defaults; host titles remain host-owned.

Dependent legacy editor/upload/modal stories and compositions now use AppButton's
owned props. Their menu anchors use native refs rather than event objects and DOM
regressions verify focus/activation. ContentEditorChrome keeps a legacy Button
internally to preserve its existing MouseEvent callback contract until M-17; it
is explicitly unmigrated. This is not evidence of complete editor/legacy removal.

Validation:

- `pnpm check`: 113 files / 525 tests passed, four foundation tests, four release
  tests, source/token/layer checks, production/story typecheck, ESM/declarations,
  public import and consumer type checks. Modified native link tests may emit the
  existing jsdom unsupported navigation diagnostic; assertions pass.
- `pnpm build-storybook`: passed with the existing directive/sourcemap and
  large-chunk warnings. No check exemptions or warning filters were added.
- Packed React 18.3.1 / 19.2.3: real tarballs passed SSR without browser globals,
  production Vite builds, one compiled stylesheet and no legacy/editor bundles
  or auto-installed legacy peers. Both hydrated Workspace Access panels and
  opened navigator rename dialogs through keyboard menus with Introduction
  focused in the labelled field; captured error/warning logs were empty.
- Native in-app browser: AppButton Cancel did not submit; Enter and Space each
  submitted once (count 2), with visible 2px focus and 44px default control height.
  Navigator keyboard rename trimmed the title and returned action-trigger focus;
  Move down changed the host-rendered order. Removing the focused row moved focus
  to the surviving active selection. A 303px list scrolled 987px while document
  scroll stayed zero and its header stayed at top 16px.
- Local tabs ArrowRight selected Learners and rendered its named associated panel
  with a visible 2px focus ring. Collapsed breadcrumb keyboard opening exposed a
  native href anchor; Escape returned Show path focus. The 260px header wrapped
  title/description/metadata/actions with scrollWidth equal to its 260px width.
- Narrow route tabs initially left focused Preferences clipped. The resulting
  regression fix moves only strip.scrollLeft: at 320px viewport/260px strip,
  Preferences focus scrolled 112px, with document scroll zero; reverse Tab brought
  Activities back into view. Colocated route/controlled keyboard geometry tests
  cover this fix. Dark actions used scoped generated token colors.

Node 26.5.0 / pnpm 10.29.3 remain the local tools. Full Chrome/Firefox/WebKit,
touch, screen-reader, zoom/reflow matrix, visual regression, Node 24, Next.js/RSC
and performance gates remain open. The native checks are representative evidence,
not full acceptance of general U controls.

Next batch: M-08 AppModal and M-07 AuthShell, then M-09 SideNavigation and M-06
AppShell as dependencies allow. Preserve host routing/account adapters and map
legacy modal props/callbacks in dependent editor compositions explicitly. Complete
validation/commit/push before starting each successor chat; continue the required
backlog in dependency order without overlapping checkout writes.

## Modal and application shells

Completed on 2026-10-06: M-06, M-07, M-08 and M-09, in the shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) on
`feat/react-aria-owned-foundation-cards`. No merge or publication is authorized.
See [modal/shell mappings](react-aria-modal-shells.md) for the breaking modal
callbacks/actions/size/style contract and deliberate navigation behavior changes.

| Task | Implementation and evidence |
| --- | --- |
| M-08 | AppModal composes owned Dialog/Button; native ref/style/parts, independently locked dismissal, four owned reasons, associated subtitle, custom accessible header/footer and translated multi-step footer. Actions are form-safe/pending/disabled; one-step labels are hidden. Direct AppPageTabs fills a fixed-height body with independently scrolling panels. Six colocated behavior/SSR tests cover focus, nested tabs/popover, theme scope, dismissal locks/reasons, action once/pending, sizing/ref and custom sections. |
| M-07 | AuthShell keeps its presentation props, adds native ref/class/style, semantic h1, responsive panel, wrapping footer and resilient tall/wide content. Three DOM tests cover field identity, host native form submission and host footer routing; stories include long content. |
| M-09 | SideNavigation retains models, adapters and host callbacks while using owned links/buttons/icons/compact Menu. Selection, explicit expansion, drilldown/back focus, native collapse, account-qualified choices, duplicate suppression and retryable organization/logout failure are covered with seven DOM tests and retained path/stack/identity helper regressions. Account failures remain inside the accessible menu overlay via Menu.errorMessage. |
| M-06 | AppShell retains navigation/children, adds native ref, mainId/mainLabel and a named main landmark. Desktop scroll remains independent; <=40rem stacks navigation above main with a 45dvh limit and functional collapse. Composed DOM/ref/collapse and no-browser-global SSR tests plus a long scroll story cover integration. |

All four directories enter the transitive owned source/declaration guard, granular
exports and packed consumer fixture. Consumer typings reject retired modal action
and style props. Shared Dialog gains explicit subtitle description association,
owned size/parts/header/body/ref support and full viewport sizing. AppPageTabs/Tabs
flex sizing supports modal panels without scrolling the entire body. Existing
link/image/columns editor dialogs now map modal actions/size/style; five new
composed DOM tests cover keyboard trim/cancel, file selection/upload/pending and
focus restoration. Their bodies remain unmigrated under M-31–M-33.

Validation:

- `pnpm check`: 116 files / 530 tests passed, four foundation tests, four release
  tests, production/story typecheck, token/source/layer checks, ESM/declarations
  and all public import/consumer typing checks. Existing modified/native-link
  jsdom navigation diagnostics may appear; assertions pass.
- `pnpm build-storybook`: passed with existing directive/sourcemap/large-chunk
  warnings. No checks were weakened or warning filters added.
- Packed React 18.3.1 / 19.2.3: real tarballs passed SSR without browser globals,
  production Vite builds, one compiled stylesheet, no legacy/editor bundles or
  auto-installed retired peers. Both hydrated AppModal, nested Help popover and
  its Note field; nested Escape stayed local and Save returned Catalog settings
  focus. Captured error/warning logs were empty on both React majors.
- Native in-app browser: medium modal panel 261px with 1398px content scrolled
  1137px; tabs/footer stayed outside its scroll and body/document scroll stayed
  zero. Escape returned Open modal focus. Dark modal at 260px used a 228px surface
  with matching scrollWidth; full modal measured exactly 260x600 at origin zero.
  Browser caught full mode inheriting a height preset; fixed with a regression.
- AuthShell long-content story at 260px had a 213px panel within the 245px document
  content width (vertical scrollbar), a 1760px document and visible first heading;
  no horizontal document overflow.
- Production Storybook AppShell at 260x600 measured navigation270px/main330px,
  document width260px/scroll0. Keyboard focus scrolled the nav list1327px while
  main stayed0. Collapse retained Expand navigation focus and changed heights to
  navigation45px/main555px. Wheel scrolling moved main676.5px with document0.
  Desktop expanded navigation was280px; collapsed48px with full720px main height.
  Keyboard account menu opened its scoped compact commands with unavailable host
  actions disabled. DOM tests verify Escape focus return and retry failures.

Node 26.5.0 / pnpm 10.29.3 local. Full browser/touch/screen-reader/zoom/visual,
performance, Node24 and Next.js/RSC gates remain open under X/R/Z. Representative
native checks do not complete the general U acceptance matrix.

Next dependency batch: M-31 ColumnsLayoutModal, M-32 ImageUploadModal and M-33
LinkUrlModal, then owned editor menu/formatting controls M-27–M-30 as dependencies
allow. Preserve Lexical/host callbacks and explicitly map any new URL/image data
contracts. Complete edits/checks/commit/push before starting the next local chat.
Continue all required tasks in dependency order, with future tasks deferred.
