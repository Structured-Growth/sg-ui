# React Aria migration execution record

## Backlog sequencing update — 2026-10-08

Follow-up priority clarification: enforce functionality → regression → hardening
across the whole library. Removed the separate P0 queue; reconciliation and
primary-flow blockers belong to functionality. New regression assignments wait
for the required baseline milestone; hardening assignments wait for required
regression closure. Master list, phase headers and AGENTS.md now agree. This
clarifies scheduling without changing task IDs, counts or completed evidence.


User requested very granular tasks, usable functionality across all components first,
and minimal initial test cases followed by separately tracked deeper coverage.
[The rewritten master list](react-aria-master-task-list.md) now links 570 functionality
leaves, 570 regression leaves and 782 hardening/scope tasks (including six deferred
features). It also records nine planning/milestone tasks. The 37 catalog directories,
47 experimental directories and 18 supporting modules/concerns have explicit rows.

`PLAN-001` is complete: separate phase files and the original scope/status snapshot
were written, and AGENTS.md/README guidance aligned. Documentation verification:
unique new IDs, one-to-one feature/regression dependencies, actual inventory and
source paths, preserved historical checklist statuses/component rows, local link
targets and whitespace. No UI implementation or additional acceptance is claimed.
Existing user changes were retained. Code tests/builds were not run for this
writing-only change.

Original acceptance counts below are dated evidence, not progress against the new
leaf denominator. Already accepted implementation/test results should be mapped to
new leaves in focused chats without duplicating work. Full migration acceptance
remains separate from the all-component baseline. Existing tests and required code
validation remain in place; broad new coverage no longer gates each baseline slice.


Started: 2026-10-05. Owner: Codex, local implementation for maintainer review.
Baseline commit: `21adebd61bedfc6a1ed395fe664ff4be83896821` on `main`.
No release tags were present and the working tree was clean before implementation.
At baseline no implementation commit, draft PR, merge or publication had been made. Subsequent batches are on draft PR #1; nothing is merged or published.

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
| U-03, M-35 | [Owned Typography](../../packages/ui/src/experimental/Typography/Typography.tsx), native semantics/ref and SSR tests, all typography roles including bodyAlt2/code. [Typefaces](../../packages/ui/src/components/Typefaces/Typefaces.stories.tsx) keeps the catalog and adds missing roles/dark mode using production tokens. |
| U-11 | [List](../../packages/ui/src/experimental/List/List.tsx), [Navigation](../../packages/ui/src/experimental/Navigation/Navigation.tsx), [Disclosure](../../packages/ui/src/experimental/Disclosure/Disclosure.tsx), [Collapse](../../packages/ui/src/experimental/Collapse/Collapse.tsx). Colocated stories and 11 behavior/SSR tests cover host routing, native roles, selected state, controlled/uncontrolled expansion, disabled state, tab order and focus restoration. Browser collapse removed the focused panel's input while preserving trigger focus. |
| U-12 | [Chip](../../packages/ui/src/experimental/Chip/Chip.tsx), [Badge](../../packages/ui/src/experimental/Badge/Badge.tsx), [TagGroup](../../packages/ui/src/experimental/TagGroup/TagGroup.tsx). Nine tests cover refs/names, group/item disabling, translated removal, keyboard next/previous/empty focus and pointer removal. Browser Delete moved React→Design focus; pointer removal moved to the list when only a disabled tag remained. |
| U-13, U-14 | [Progress](../../packages/ui/src/experimental/Progress/Progress.tsx), [Status](../../packages/ui/src/experimental/Status/Status.tsx), [Avatar](../../packages/ui/src/experimental/Avatar/Avatar.tsx), stories and behavior/SSR tests. Determinate/indeterminate semantics, optional announcements, name/ref, source replacement and image load/error. Browser native image success showed opacity 1/natural width 80 with a 40×40 root; native error removed the image and retained initials in the 48×48 large root. |
| U-15 | [Table](../../packages/ui/src/experimental/Table/Table.tsx) and [Pagination](../../packages/ui/src/experimental/Pagination/Pagination.tsx), six tests and stories. Native table refs/caption/headers, known/unknown totals, zero pages, boundaries, disabled state, form-safe keyboard actions and page-zero-before-size callbacks. Browser last-page navigation and size 25→50 reset Page 4→Page 1. |
| U-16 | [ToggleButton/ToggleButtonGroup](../../packages/ui/src/experimental/ToggleButton/ToggleButton.tsx), five behavior tests and stories. Native refs, controlled/uncontrolled selection, single/multiple selection, no form submission, disabled skipping, required selection, RTL and vertical arrows. Browser arrows moved focus independently, then Space committed Grid→Cards. |
| U-07 partial | [Tooltip](../../packages/ui/src/experimental/Tooltip/Tooltip.tsx), four behavior tests and stories. Focus description, hover, Escape/return focus, disabled state and portal visual/locale overrides; browser keyboard opening/dismissal. Submenus and broader overlay/browser checks stay open. |
| M-02, M-03 | [AppInlineProgress](../../packages/ui/src/components/AppInlineProgress/AppInlineProgress.tsx) and [AppOperationSteps](../../packages/ui/src/components/AppOperationSteps/AppOperationSteps.tsx) now use owned controls/icons/styles. Public names/props retained; percentage normalization, ordered steps, translated status text and accessible progress covered by behavior tests and updated stories. Non-finite inline values now become 0%; completed-step color now uses the action token. |
| M-24 | [EditableTitleField](../../packages/ui/src/components/EditableTitleField/EditableTitleField.tsx) now uses owned controls/icons/styles. Existing props and host-owned persistence preserved. Behavior/SSR and parent compatibility tests cover Enter/blur/Escape, trimming, duplicate pending saves, rejection/retry, IME and focus. Browser saved Updated course title and restored Edit title focus; rejection retained Retry title with aria-invalid and an associated error, Escape restored focus without another save. |

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
| M-12 | [AppPaginationFooter](../../packages/ui/src/components/CardPaginationFooter/CardPaginationFooter.tsx) uses owned Pagination, translated range/page labels, normalized page/size/counts, unknown totals and disabled boundaries. Six behavior/SSR tests include namespace/values, page-zero-before-size ordering and form-safe keyboard activation. |
| M-11 | [CardCollectionWithFooter](../../packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.tsx) uses responsive container columns, stable row keys, independent grid scrolling and translated host-replaceable empty/loading states. Six tests cover keyed identity, shrinking rows with consistent footer, controlled size/navigation, SSR and nested learner action/form composition. |
| M-13 | [ClassCardFrame](../../packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx) uses owned Card and tokenized slots, preserves 420/360 constants and allows container shrinkage. Three tests cover native article slots, optional footer, width and slot class/style overrides plus server rendering. |
| M-14 | [InstructorClassCard](../../packages/ui/src/components/InstructorClassCard/InstructorClassCard.tsx) uses owned avatar/typography/icons/host Link, status labels, archived metadata branch and retained action-label mappings. Three tests cover host keyboard routing, state/custom-label branches, translation values and SSR. No menu or persistence callback was present in its existing contract; none is invented. |
| M-15 | [LearnerClassCard](../../packages/ui/src/components/LearnerClassCard/LearnerClassCard.tsx) uses named Progress, owned actions/links/avatar/icons and the retained locale/due formatter. Three tests cover normalized displayed/accessible percentages including non-finite inputs, callback once, host Details routing, isolated Continue links/fallbacks, translation values and SSR. |

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
internally at that milestone to preserve its MouseEvent callback contract until
M-23; it was explicitly unmigrated then. This is not evidence of complete editor/legacy removal.

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

## Editor dialogs

Completed on 2026-10-06: M-31, M-32 and M-33, in the shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) on
`feat/react-aria-owned-foundation-cards`. The [dialog contracts](react-aria-editor-dialogs.md)
map the preserved host callbacks and deliberate URL/draft behavior changes.
The surrounding editor, formatting/menu controls and general acceptance gates
remain open; this batch does not complete M-34 or broader E/U/X/R/Z work.

| Task | Implementation and evidence |
| --- | --- |
| M-31 | ColumnsLayoutModal uses owned RadioGroup and AppModal, translated title/preset/actions, five retained preset IDs, runtime invalid-ID fallback and draft reset on opening/default changes. Five DOM/SSR/translation tests replace mocked hook inspection: arrows select exactly one preset, Space inserts once without submitting the surrounding form, cancellation/reopening reloads host state and focus returns. Stories expose committed host layout and dark scope. |
| M-32 | ImageUploadModal uses owned fields/actions/icon/typography, native file input and layered token CSS. Local image previews revoke object URLs on replacement/dismissal/unmount. Invalid files, promise pending/duplicate prevention, retry errors, session isolation, same-file reselection and opt-in descriptions are covered by seven DOM tests. File-only callers receive one argument; enableAltText callers receive trimmed text, including an explicit decorative empty string. Stories include host first-failure/retry and pending/error states. |
| M-33 | LinkUrlModal uses owned fields/token CSS, translated labels and an explicit safe protocol/relative-URL policy. Twenty-three DOM tests cover accepted/rejected URLs, trimmed/null payloads, edit/unlink, associated validation/focus, URL Enter/Apply once and cancel/reopen focus. Stories show restricted protocols and blank removal. |

All three directories enter the transitive source/declaration check, granular
exports, public consumer type fixture and packed production fixture. The actual
Lexical host integration has six additional tests with its real engine/plugins
and JSON change callback (formatting/menu triggers isolated while unmigrated):
relative/www URLs keep existing storage normalization and target/rel rules;
existing-link editing/removal preserves text and valid selection; descriptions
including empty text persist with asset IDs; late canceled upload success/failure
cannot insert stale content, close a reopened dialog or report stale errors.
These tests surfaced existing LinkNode.clear detachment and unlink selection bugs.
The editor now atomically splices replacement text before selecting it, and selects
plain replacement text on unlink. Image session guards preserve host upload APIs
and prevent stale editor writes after cancellation/reopening/unmount.

Validation:

- `pnpm check`: 117 files / 564 tests, four foundation tests, four release tests,
  production/story typecheck, token/source/layer checks, ESM/declarations and all
  public imports/consumer typings passed. Existing jsdom native-navigation
  diagnostics may appear; no checks were excluded or weakened.
- `pnpm build-storybook`: passed with existing directive/sourcemap/large-chunk
  warnings. Updated stories use the shared production owned scope.
- Packed React 18.3.1 / 19.2.3: real tarballs pass SSR without browser globals,
  production builds, one stylesheet, no legacy/editor bundle or auto-installed
  retired peers. The fixture includes all three granular dialog imports.
- Native in-app browser on both React majors: ArrowDown chose two2575, keyboard
  Insert committed and returned Choose columns focus. URL Enter accepted host
  values and returned Edit link focus; unsafe javascript URL stayed open with
  URL focus, aria-invalid and an associated error. Native picker rendered a
  decoded local preview; Space submitted the trimmed description and returned
  Upload image focus. React18 captured warning/error logs were empty; React19
  had no packed-preview diagnostics (earlier Storybook manager messages from
  loading during a rebuild were unrelated and were retained in the tab log).
- At 260x600, dark image dialog measured 213px wide with scrollWidth213, height568
  and top16; its long description and filename wrapped and body scrolled with
  footer visible. Production light columns story exposed one selected native
  radio, a 3px keyboard focus outline and committed host status two2575.

Local Node26.5.0 / pnpm10.29.3. Full browser/touch/screen-reader/zoom/visual,
performance, Node24 and Next.js/RSC gates stay open. Representative checks do not
complete the general U acceptance matrix. No merge or publication is authorized.

Next dependency batch: M-27 InsertContentMenuControl, M-28 TextAlignMenuControl,
M-29 TextColorPickerControl and M-30 TextStyleMenuControl, using owned controls and
retaining Lexical/host command models. Then proceed through the remaining editor,
grid and foundation backlog in dependency order. Complete edits/checks/commit/push
before starting each successor local chat; avoid overlapping checkout writes.

Additional native host evidence from the final production Storybook build: the
real full-tools editor selected Guide, inserted Course guide at www.example.org/guide
as an HTTPS anchor with `_blank`/`noopener noreferrer`, edited the existing anchor
to Edited guide at /courses/edited with target/rel cleared, then submitted a blank
URL. The editor retained Edited guide as plain text with zero anchors and native
contenteditable focus; no captured Lexical diagnostics. Remaining legacy toolbar
buttons in this story lack accessible names and remain required M-26 work.

## Editor menu controls

Completed on 2026-10-06: M-27–M-30, in shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) on
`feat/react-aria-owned-foundation-cards`. See the
[editor menu contracts](react-aria-editor-menus.md) for preserved callbacks,
new controlled selection/restrictions and breaking semantic color presets.
M-26/M-25/M-21–M-23/M-34 and general editor/grid/U/X/R/Z gates remain open.

| Task | Implementation and evidence |
| --- | --- |
| M-27 | InsertContentMenuControl uses owned Menu/Button/icons, translated labels, native trigger ref/style and disabled unavailable callbacks. Four DOM tests cover pointer/Space/Enter, host form safety, disabled navigation and keyboard opening of an actual ColumnsLayoutModal with focus transfer/return. |
| M-28 | TextAlignMenuControl retains all six alignment IDs and indent callbacks, adds canIndent/canOutdent restrictions and native trigger ref/style. Six DOM tests cover single checked radio state, all commands once, keyboard skipping/focus, controlled requests, translated Arabic/dark portal and logical start/end icons. |
| M-29 | TextColorPickerControl uses owned Popover/fields/buttons/icons and semantic token swatches, native labeled color input, associated hex errors, foreground/background names, clear/reset and current-color indication. Five DOM tests cover normalized Enter/blur once, composing Enter, draft reload/external updates, swatches/native colors, disabled state and dark scope. A composed test caught React portal form submit bubbling; the picker now stops it before reaching the host form. |
| M-30 | TextStyleMenuControl preserves the eight existing callbacks, disables missing commands and adds optional controlled activeStyles checkbox state. Five DOM tests cover all callbacks once, keyboard/disabled/form behavior, selected state, plain clear command, translations and dark portal. Existing component has no typeface selection; toolbar typeface/heading contracts remain pending. |

The shared owned Menu adds selected choice sections, separators and visual shortcut
hints through owned props. Selection remains host-controlled and action callbacks
close once. Colocated tests cover mixed radio/action roles. Native narrow testing
caught shortcut hints squeezing alignment labels; menus with hints now constrain
their width to the viewport and hide hints below 24rem while retaining labels.
All four directories enter strict transitive source/declaration audits, granular
exports, public consumer typings and the packed fixture. No check was weakened.

The actual Lexical host has an additional composed color test using owned pickers
with real engine/plugins and JSON change output. Semantic foreground/background
tokens serialize, and Clear removes the style. The test caught empty-string
patches persisting `color: ;background-color: ;`; the host now maps Clear to
Lexical null removal. Existing dialog/link/image tests remain passing. This is
necessary host integration repair, not completion of M-34. The legacy toolbar's
background picker explicitly supplies mode=background.

Validation:

- Final `pnpm check`: 117 Vitest files / 576 tests passed, four foundation and
  four release tests, strict source/token/layer checks, production/story typecheck,
  ESM/declarations, all public entry imports and consumer typings passed.
- Final `pnpm build-storybook`: passed with existing directive/sourcemap/large
  chunk warnings. No warning suppression or check exemptions were introduced.
- Final packed React18.3.1 / React19.2.3: real tarballs passed no-browser-global
  SSR, production Vite builds, one compiled stylesheet and no legacy/editor
  bundle or auto-installed retired peers. All four granular menu exports are used.
- Native React19 fixture: ArrowDown/End/Enter Insert opened actual columns dialog;
  Space committed twoEqual and returned Insert focus. Alignment exposed Start
  checked, Center Enter requested center and returned trigger focus. Text style
  skipped unavailable choices to checked Highlight; Space requested once.
  Invalid hex stayed associated with the field, trimmed mixed-case hex requested
  #abcdef, Escape returned Text color focus. React18 confirmed checked alignment,
  disabled style skipping, Space/Enter commands and #fedcba commit. Captured
  warning/error logs were empty in both fixtures.
- Final packed dark narrow fixture at260x600: alignment menu measured213px wide
  with scrollWidth213 and273px height; labels and checked state remained readable,
  shortcut hints hid. Color dialog measured201px wide/scrollWidth201 and324px high.
  Production Arabic/dark story had RTL portal and logical start icon rendered the
  right-align icon while hiding left-align. Temporary viewport was reset.
- Final production FullTools editor selected Lorem and applied Primary. DOM showed
  only selected text with color:var(--sgui-action); native picker resolved #1d4ed8.
  Clear removed the declaration and preserved text. No captured diagnostics.

Local Node26.5.0 / pnpm10.29.3. Full Chrome/Firefox/WebKit, touch, screen-reader,
zoom/visual/performance, Node24 and Next.js/RSC gates remain open. Representative
native evidence does not complete the broad acceptance matrix. No merge,
publication, licensing or workflow permission changes are authorized.

Next dependency batch: M-26 RichTextFormattingToolbar, then M-25
FloatingTextSelectionToolbar and M-21–M-23/M-34 as dependencies allow. Preserve
Lexical command/selection/serialization and host account/routing/translation APIs.
Complete checks/commit/push before dispatching the successor local sg-ui chat.
Do not count representative checks as completion of broad acceptance gates.

## Rich text formatting toolbar

Completed on 2026-10-06: M-26, in shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) on
`feat/react-aria-owned-foundation-cards`. See the
[formatting toolbar contract](react-aria-formatting-toolbar.md) for retained
control IDs, callbacks, heading/font-family values and host selection ownership.

The migration composes owned Button/Select/icons and the migrated menu controls,
with tokenized wrapping CSS and a native div ref/class/style/accessible group name.
Inline formatting exposes controlled boolean/mixed pressed state; heading changes use one
value-change path. Unavailable callbacks disable actions. Optional activeTextStyles
and canIndent/canOutdent forward host checked state and restrictions.
The link mouse-down preparation callback remains separate from activation.

Validation:

- Final `pnpm check`: 118 Vitest files / 583 tests passed, four foundation and four
  release tests, source/token/layer guards, production/story typecheck, ESM and
  owned declarations, public entry imports and consumer typings passed. The suite
  printed jsdom navigation-not-implemented diagnostics from link checks; no test
  failed and no check was weakened.
- Final `pnpm build-storybook`: passed with existing directive/sourcemap/large
  chunk warnings.
- Final packed React18.3.1 / React19.2.3 real tarballs: no-browser-global SSR,
  hydration fixture generation, production Vite build, one compiled stylesheet,
  no retired peers or legacy/editor bundle and granular toolbar import passed.
- Seven toolbar DOM tests cover named actions, boolean/mixed pressed state,
  pointer/Space/Enter, form safety, single controlled heading/font requests,
  link preparation, hidden/disabled controls, checked nested styles, restricted
  indent, semantic color, translations, native ref/style/slots and callback timing.
  Two real Lexical-host tests exercise bold, Georgia, H2, serialized change output,
  pointer/keyboard link commit and unlink without replacing document text.
- Native production Storybook selected Lorem and applied Bold only to Lorem,
  then pointer link opening retained the display text and URL Enter stored
  /courses/guide with editor focus. Native chooser Enter initially replaced
  selected text with a newline because a synchronous host callback refocused
  contenteditable during the select event. Toolbar heading/font requests now run
  after that event completes, with unmount cleanup. A targeted regression asserts
  that callbacks cannot refocus during selection keydown; real host keyboard
  font selection is covered. Final production native ArrowDown/Enter applied
  Georgia only to Lorem and H2 to its paragraph, preserved all text and returned
  editor focus. Captured production editor warning/error logs were empty.
- Final packed native React19 Space requested Bold and heading Enter requested
  Heading 3 once while retaining controlled Normal. React18 Space requested Bold
  and font Enter requested Georgia while retaining controlled Arial and returning
  trigger focus. Both captured warning/error logs were empty.
- Narrow dark production story at260x600: toolbar width/scrollWidth228px and
  height305px; selectors/actions wrapped without horizontal overflow. Native
  inspection caught a transparent dark toolbar inheriting a light host surface;
  the toolbar now paints its owned surface token, with final dark background
  rgb(15,23,42) and readable controls. Temporary viewport was reset.

Local Node26.5.0 / pnpm10.29.3. Full browser/touch/screen-reader/zoom/visual,
performance, Node24 and Next.js/RSC gates remain open. Representative native
checks do not complete the broad acceptance matrix.
M-25, M-21–M-23, M-34, grid and broad U/X/R/Z gates remain open.
No merge, publication, version, licensing or workflow permission changes are
authorized. The next dependency batch is M-25, followed by M-21–M-23/M-34 as
dependencies allow. Complete checks/commit/push before the successor local chat.

## Editor layout and floating selection

Completed on 2026-10-06: M-21–M-23 and M-25, in shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) on
`feat/react-aria-owned-foundation-cards`. See the
[editor layout/selection contracts](react-aria-editor-layout.md).

DocumentEditorLayout keeps title/menu/toolbar/content slots and host-owned scrolling.
DocumentEditorToolbar preserves heading/zoom/format callbacks and controlled state,
adds translated accessible action names and disabled unavailable controls, and defers
heading requests until select handling completes. ContentEditorChrome adds owned
normalised actions with native button anchors, loading/disabled/menu semantics and
responsive title editing. Its breaking menu callback mapping is onClick(event) to
onPress(anchor); DocumentEditorToolbar statusColor now uses native CSS colors/tokens.
All four directories enter strict transitive source/declaration guards, granular
exports and consumer typing fixtures. No checks were weakened.

FloatingTextSelectionToolbar composes owned buttons/icons with saved Lexical
selection, translated names, active pressed state and disabled unavailable link.
Alt+F10 enters its keyboard group; Escape returns editor focus. Native hidden
semantics remove dismissed controls from tab navigation. Commands run after the
activation event, restore selected nodes and suppress work when read-only or
unmounted. Position clamps to viewport/boundary intersection and tracks scroll,
resize and measured wrapping. Review caught a focused-toolbar scroll early-return;
the corrected implementation keeps selection state while continuing geometry updates
and hides offscreen selections with editor focus return. The existing fixed-position
scope rendering requires hosts to avoid transformed containing blocks.

Validation:

- Final `pnpm check`: 120 Vitest files / 595 tests passed, four foundation and four
  release tests, production/story typecheck, import/token/layer checks, ESM/declarations,
  all public entry imports and consumer typings passed. jsdom printed its unsupported
  window.scrollBy/navigation diagnostics; native scroll behavior was verified below.
- Final `pnpm build-storybook`: passed with existing directive/sourcemap/large-chunk
  warnings. Native dark-story inspection caught host text inheriting dark foreground
  over a light background; the story now supplies the same owned surface/text tokens.
- Four DocumentEditorLayout tests cover slots/title semantics/ref/style and live
  child interactions; seven DocumentEditorToolbar tests cover commands, pressed and
  unavailable/read-only state, controlled select timing, groups/translations/styles;
  five ContentEditorChrome tests cover native anchors, pointer/Enter/Space/form safety,
  disabled/loading, title editing and slots. Six floating tests use real Lexical
  engine/commands and cover pointer/keyboard selection, link preparation, focus timing,
  scroll/resize/clamping, dismissal, editable state and unmount cancellation.
- Two actual PageRichTextEditorSection composed tests use the real floating toolbar,
  editor engine/plugins and JSON output: selected Guide becomes bold/italic through
  pointer and Alt+F10/Enter, text remains intact, and floating link preparation plus
  URL Enter commits /courses/guide. Geometry shims are scoped/restored for jsdom;
  native behavior is verified independently.
- Packed React18.3.1 / React19.2.3 basic consumers passed no-browser-global SSR,
  production Vite build, one stylesheet, no retired peers and no editor bundle.
  Separate `test-editor-consumer.mjs` tarball fixtures include all four granular
  components and the real Lexical engine; both passed SSR/Vite, one stylesheet and
  no retired foundation bundle or automatically installed retired peers. Their
  installation explicitly overrides inherited peer auto-install environment values.
- Native production packed React19 Alt+F10/Enter applied Bold only to selected
  paragraph1 and returned Packed document focus with all15 paragraphs intact.
  Heading ArrowDown/Enter requested h1 once while controlled Normal remained and
  trigger focus returned. React18 Alt+F10/Tab/Space applied Italic only to paragraph2,
  kept all15 paragraphs and returned editor focus. Captured warning/error logs were
  empty on both hydrated consumers.
- Final production native standalone selected paragraph2, Alt+F10/Enter applied
  Bold and preserved all12 paragraphs. Scrolling while Bold had focus hid an
  offscreen selection and returned Document focus. DocumentEditorLayout host scroll
  moved to301.5px while header top stayed17px. Chrome File Enter returned native
  BUTTON anchor; title Enter saved Native document title and returned Edit title
  focus. DocumentEditorToolbar Space pressed Bold, zoom increased100% to110%, and
  ArrowDown/Enter selected controlled H1 with trigger focus. Captured logs were empty.
- At260x600, dark DocumentEditorToolbar width/scrollWidth212px and height200px;
  chrome width/scrollWidth228px and height261px; floating width222px (220px inner),
  left22/right244px and height42px. Controls/text were readable and did not overflow.
  Floating surface resolved rgb(15,23,42). Viewport override reset after checks.
- Final production real PageRichTextEditorSection selected Lorem, Alt+F10/Enter
  applied Bold only to Lorem, floating pointer Edit link opened with display text
  Lorem, and URL Enter stored /courses/native with editor focus and document text
  intact. Captured logs were empty. Host link insertion reconstructs text styling;
  broader editor semantics remain part of M-34, not completion of that row.

Local Node26.5.0 / pnpm10.29.3. Full browser/touch/screen-reader/zoom/visual,
performance, Node24 and Next.js/RSC gates remain open. These representative native
checks do not complete broad acceptance. M-34, grid/catalog M-16–M-20/M-36–M-37
and general U/X/R/Z gates remain open. No merge/publication/manual version/licensing
or workflow permission/secret changes. Next dependency batch: M-34
PageRichTextEditorSection; complete checks/commit/push before successor dispatch.

## Page rich text editor section

Task reference: M-34. Completed in the shared [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1), pending review.
PageRichTextEditorSection and its transitive ImageNode now use native markup,
owned controls and token CSS Modules. The strict migrated import/layer/token and
recursive declaration boundaries include the entire directory. Added granular
component export, native div ref/class/style, translated accessible document name,
placeholder and generic upload failure. See [consumer contract](react-aria-editor-section.md).

Lexical nodes/plugins/commands, serialized document markers, asset metadata,
heading/body roles, toolbar presets and upload/change callbacks remain available.
Live readOnly updates the existing editor; editorKey seeds a new document. Both
transitions close stale dialogs, clear saved selections and invalidate uploads.
Links wrap existing formatted runs when display text is unchanged; URL edits and
unlink preserve children. Explicit replacement display text remains new content.

Validation for the final source:

- pnpm check passed 120 files / 601 tests plus four foundation and four release
  checks, production/story typing, generated token/layer/import audits, rebuilt
  ESM/declarations, every public import and consumer typing.
- pnpm build-storybook passed with existing directive/sourcemap/large-chunk warnings.
- Parent section tests now use owned Provider only. Five new composed regressions
  cover formatted multi-run link creation/URL edit/unlink, live readOnly, editorKey
  reset with open dialog, all registered-node serialization (including image
  metadata), and translated name/placeholder plus native ref/class/style.
  ImageNode adds native SSR rendering verification. Existing actual Lexical floating,
  formatting/menu/dialog and engine tests remain.
- Packed basic React19.2.3 and React18.3.1 consumers passed; basic imports still
  exclude editor dependencies. Packed full editor consumers passed both React
  versions, SSR without browser globals, hydration entry/Vite production build,
  one stylesheet, and strict absence of retired foundation/autoinstalled peers.
- Native packed React19 selected paragraph1, Alt+F10/Enter applied Bold with all12
  paragraphs intact and editor focus. Link URL Enter committed /courses/packed
  while retaining strong markup and format1 in serialized link children. ReadOnly
  toggle changed contenteditable to false and removed the formatting toolbar.
- Native empty-document check caught indefinite percentage sizing: corrected the
  document container to a definite block-size. Final packed editable/document
  heights both363 within viewport395; a blank-area click150px below the first
  line accepted text. Final React19 warn/error capture was empty.
- Native final React18 Alt+F10/Tab/Space applied Italic to paragraph2 with all12
  paragraphs intact and editor focus. Heading chooser Down/Enter committed h1,
  preserved document text/12 blocks and returned editor focus. Native scroll
  advanced viewport76→120 while toolbarTop70 remained fixed. Warn/error capture
  empty. At320x700 dark, root and toolbar client/scroll widths289/289, viewport
 274/274 with223px content height; token background rgb15,23,42 and text226,232,240.

Local evidence: /tmp/sgui-m34-final-editor.png and /tmp/sgui-m34-narrow-dark.png.
The initial Storybook preview was opened during rebuild and served its fallback
manager recursively; it was not used as final native evidence. Final packed
consumer tabs had no captured warnings/errors. jsdom still emits existing
unsupported scrollBy/navigation diagnostics; no checks were weakened. Local runtime
remains Node26.5.0; Node24 and the full browser/touch/screenreader/zoom/visual/performance/
NextRSC matrix are open. M-16–M-20/M-36–M-37, M-38 reconciliation and broad
U/X/R/Z gates remain open. No merge/publication/version/licensing/workflow-permission
or secret changes. Next batch: grid migration following the G matrix and dependencies.

## Data toolbar

Completed on 2026-10-06: M-20, in shared [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1), pending review.
See [data toolbar contracts](react-aria-data-toolbar.md). DataToolbar and all four
menus now use owned controls, native markup and token CSS Modules. The whole
directory enters strict import/layer/token and recursive declaration guards.
Granular export, public consumer typing and packed fixture coverage were added.
The column-options builder no longer imports retired grid row/visibility types.
Host runtime labels render literally; library strings retain translated fallbacks.

Search/view/refresh/column/sort/filter/selection callbacks stay host-owned. Search
supports controlled or local text with callback observation, named focusable input,
clear/Escape focus return. Missing handlers disable actions. Optional selectedCount
announces selection. Columns remain controlled with visibility locks and reset.
Sort/filter draft identities retain controls across edits/removal; add, move,
remove and reset focus the appropriate owned field after activation completes.
Sort Apply/count excludes stale fields, invalid directions and duplicates. Filter
operators/enum delimiter semantics remain; All applies no enum rule, stale values
on no-value operators clear, and nested pickers preserve drafts and scope.

Validation of final source:

- pnpm check passed 120 Vitest files / 588 tests, four foundation and four release
  checks, production/story typecheck, source/token/layer guards, ESM/declarations,
  all public entry imports and consumer typing. Mocked React/tree tests were
  replaced with 24 actual Provider DOM interaction tests across the toolbar/menus;
  existing pure helper tests remain. No checks weakened.
- pnpm build-storybook passed with existing directive/sourcemap/large chunk warnings.
- Final packed React19.2.3 and React18.3.1 consumers passed no-browser-global SSR,
  hydration entry and production Vite builds, one compiled stylesheet, no retired
  foundation/editor bundle and no automatically installed retired peers.
- Native React19 keyboard columns Space toggled Status while Name stayed locked;
  Escape returned Columns focus. Search accepted text and Escape closed it.
  Selection menu Down/Enter requested none and returned Selection options focus.
  Enum Status keyboard choice, two Space toggles and nested Escape retained the
  parent; Apply emitted active|||paused with no internal draft metadata.
- Native testing caught Add becoming disabled and boundary moves dropping focus.
  Deferred owned Select refs repair this; final packed React19 and React18 Add
  focused the new Column2 and Move up focused the moved Column1. Final React19
  removal of last filter row returned Columns1 focus. Regression covers surviving
  field/input identity, edited values and clean callback payload.
- Desktop HTML drag attempts did not reorder in IAB or Chrome. Replaced with
  pointer capture, movement threshold and owned row refs/rects; commit only on
  matching pointer release and clean up cancellation/lost capture/dismiss/unmount.
  Final source Chrome React19 pointer moved Status before Name; Apply emitted that
  order. Final packed React18 pointer moved Name before Status and retained moved
  field focus. Pointer release/cancel tests restore scoped geometry mocks. Touch
  hardware/browser matrix remains open; Move buttons are the non-drag alternative.
- Final narrow dark320x700 toolbar client/scroll widths257/257; filter and sort
  dialogs273/273, sort height315. Toolbar surface rgb30,41,59 and text226,232,240.
  Final packed native captured warnings/errors empty. Viewport overrides reset.
  Evidence: /tmp/sgui-m20-final-narrow.jpg and /tmp/sgui-m20-chrome-pointer.jpg.

Local Node26.5.0/pnpm10.29.3. Broad browser/touch/screen-reader/zoom/visual,
performance, Node24 and NextRSC gates remain open. M-16–M-19/M-36–M-38 and
G/U/X/R/Z integration/acceptance remain open. In particular, page reset, client
processing, server requests, persistence and grid focus/reorder remain grid work.
No merge/publication/manual version/license/workflow permission/secret changes.
Next dependency batch: G capability/state contract review and M-16 AppDataGrid,
then M-17–M-19 as dependencies allow. Complete checks/commit/push before dispatching
the next local sg-ui chat; do not overlap checkout edits after dispatch.

## Catalog grid contract review

Completed on 2026-10-06: G-01–G-03 design definitions, in shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1), pending review.
See [catalog grid contracts](react-aria-grid-contracts.md). No runtime grid or
public declaration change is included in this documentation batch.

The required capability matrix covers existing cell/helper/subheader behavior,
client/server processing, selection, shared toolbar/cards, visibility/width/order,
status/focus/reorder, persistence and conditional virtualization. True pinning,
expansion/grouping/editing and spreadsheet/analytics features are explicitly
deferred; performance and accessibility acceptance are not deferred.

The source audit found competing sortRules/sortModel, separate checkbox/engine
identity, loaded-input header selection, independently owned toolbar criteria,
separate list/card pagination and misleading pinned/custom page-size props.
Target contracts specify owned alias/helper mappings, per-concern controlled and
default values, transaction ordering with page-zero requests, retained page
selection, validated optional persistence and host action/stale-response ownership.
Shell selection feedback also covers boolean selection. All implementation and
G-04 onward acceptance remain open; design completion is not behavior evidence.

Validation: read-only independent source audit and contract review; checked local
Markdown links/anchors and source paths, git diff whitespace and backlog consistency.
Documentation-only changes do not require pnpm check/build-storybook or new tests
under AGENTS.md. Prior 97d16d6 PR title check passed; validation status is checked
separately before successor dispatch. No check, dependency, runtime, license,
version, workflow permission or secret changes.

Next required batch: M-16 AppDataGrid implementation against these contracts,
split into linked type/processing/cell/interaction batches if needed, then
M-17–M-19. Each code batch must pass required check/Storybook and relevant packed
consumer/native evidence before commit/push and successor dispatch. G/U/X/R/Z and
full native/touch/screenreader/zoom/performance/Node24/NextRSC gates remain open.

## Catalog grid processing batch

Completed on 2026-10-06: first linked M-16 implementation batch in shared
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1), pending review.
This adds internal owned row-processing and transaction building blocks, not a
completed catalog migration. AppDataGrid still renders MUI X and exports legacy
types/helpers. M-16–M-19, M-36/M-37 and G/U/X/R/Z remain open.

`ownedGridModel.ts` validates stable nonempty row IDs and declared unique column
fields, normalizes custom numeric page sizes and shared sort/filter rules, and
uses TanStack internally for stable ordered sorting and paging. Client processing
runs search and all 19 toolbar operators before sorting/paging; server mode
preserves supplied rows/order without processing or a second slice. Accessors
receive original immutable row input. Numeric strings sort numerically; natural
text is case-insensitive. Null/invalid values sort first ascending, last descending.
Date-only values preserve their literal day; timezone-qualified instants and Date
objects use UTC calendar comparisons. Invalid/no-zone timestamps do not match.

`ownedGridState.ts` produces one criterion/page/selection snapshot, requests page
zero before criterion callbacks and emits one combined notification. Current-page
selection retains off-page IDs, and header state counts only unique selectable
page IDs. Callbacks receive copies. Actual per-concern React controlled/default
controllers, persistence, column layout, focus and shell ownership remain later
batches; these pure helpers do not establish those acceptance gates.

The Catalog grid processing Storybook proof composes real owned DataToolbar,
Table and AppPaginationFooter. Review caught separate footer page/size requests
producing duplicate transactions. Optional compatible
`AppPaginationFooter.onPaginationModelChange({page,pageSize})` now supersedes the
two legacy callbacks; `Pagination.onPaginationChange(page,pageSize)` similarly
sends one size request. Without these optional callbacks, the existing
page-zero-before-size order remains unchanged. See [pagination contracts](react-aria-card-pagination.md).

Validation:

- Final pnpm check passed 123 files / 639 tests, foundation/token/layer checks,
  four foundation and four release tests, production/story typecheck, ESM and
  declarations, all public imports and consumer typing. Added 34 model regressions,
  ten transaction/selection tests, four composed toolbar/processing/footer DOM
  tests and three atomic pagination regressions. No checks weakened.
- Final pnpm build-storybook passed with existing directive/sourcemap/chunk warnings.
  Model/transaction files and the proof enter transitive owned-source checks;
  their emitted declarations are guarded against upstream types. The surrounding
  legacy grid is deliberately not marked migrated or exempted from final removal.
- Fresh packed React19.2.3 and React18.3.1 consumers passed no-browser-global SSR,
  hydration entry and production Vite/CSS/no-retired-peer checks. Both native
  consumers changed page3/size10 to page1/size250 with exactly one host request.
  React19 then changed to size10 and activated Next with Enter; the snapshot was
  page1/size10 (zero-based), request count3. Captured browser warnings/errors empty.
- Native composed Storybook search from page3 yielded only Course67, page1, and
  pagination → search → combined snapshot. Escape cleared it and restored Search
  trigger focus. Evidence: /tmp/sgui-m16-processing-search.png and
  /tmp/sgui-m16-packed19-pagination.png. Composed DOM tests also prove filter/sort
  application and unchanged server rows/unknown-total forward navigation.

Local Node26.5.0/pnpm10.29.3; Node24/NextRSC and broad native/touch/screen-reader/
zoom/visual/performance gates remain open. The build still applies the transitional
client boundary to catalog modules; no R completion is claimed. Prior91c8593
validate and conventional-title checks passed; new head checks are inspected
separately after push. No merge/publication/manual version/license/workflow
permission/secret changes.

Next batch: M-16 owned cells/header/status parts and helper/type mappings, then
registered interaction/catalog integration using these shared modules. Complete
required checks/commit/push and dispatch the next local sg-ui chat; no overlapping
checkout edits after dispatch. Continue M-17–M-19 and M-36/M-37 plus required
G/U/X/R/Z reconciliation until the backlog is handled.

## Catalog grid cell and presentation batch

M-16 linked implementation on 2026-10-06 in draft PR #1. Internal
`ownedGridColumns`, `ownedGridCells` and `ownedGridParts` now implement all nine
cell presentations, header sort choices, host row subheaders and status states.
The exported AppDataGrid renderer, types, cell parts and helper functions still
use the retired engine; M-16 is not complete. No public entry point was added for
these preparatory modules.

Column definitions use unconstrained generic rows and owned callbacks, validate
fields and sizing, normalize visibility/order/committed widths, and allocate
bounded weighted flex widths. Layout locks the first text/link/copyable column
and menu columns and puts actions last. Header choices update the canonical
ordered rules. Container measurement, resizing and registered catalog interaction
remain pending.

Cells keep raw processing values separate from display text, host locale/time
zone/formatter support, literal date-only days, escaped JSON/cyclic fallback,
image error fallback and translated clipboard result announcements. Async copy
completion is ignored after a value change/unmount. Menu actions preserve host
row identity, unavailable/pending state and single activation; owned Menu now
supports native target/rel, adds safe new-tab rel values and routes same-context
relative links through the host adapter. Status parts distinguish initial loading,
refresh beside retained rows, empty, no results and host retryable errors. Row
subheader title editing has a keyboard action in addition to double click.

Strict source/transitive/CSS-token and built-declaration checks include these
internal modules and stories without exempting the surrounding legacy renderer.
Tests and Storybook examples are colocated. Broad grid acceptance, M-17–M-19,
M-36/M-37 and G/U/X/R/Z remain open.

Validation: `pnpm check` passed 126 files / 659 tests, including 20 new
column/cell/part/menu regressions; four foundation tests and four release tests,
typecheck/build/package entry imports and declaration guards passed.
`pnpm build-storybook` passed with existing module-directive/sourcemap and chunk
warnings. Fresh packed React 19.2.3 and 18.3.1 fixtures passed SSR/hydration-entry,
Vite/CSS and no-retired-peer checks. Both tarballs also passed direct internal
cell/status/column SSR assertions (these are internal tests, not new public exports).

Chrome native evidence: pending menu action skipped with ArrowDown; Enter on
Open course called host navigation and restored the row trigger; native copy
announced Copied. Header ascending choice set aria-sort; Retry restored Refreshing
rows while retaining the displayed course; keyboard Edit title updated the host
section title. German host locale rendered 6. Okt. for date-only and 5. Okt. for
the Los Angeles instant. Browser warning/error logs were empty. Screenshot:
`/tmp/sgui-m16-owned-cells.png`. This is representative cell/part evidence, not
full catalog grid focus/scroll, touch, screen-reader, zoom or performance acceptance.

Next implementation: registered React Aria catalog interaction with the owned
processing/cell/layout modules, per-concern controllers, native ref and container
measurement/resize behavior; then public AppDataGrid/helpers integration and
strict whole-dependency/declaration checks. Follow with M-17 shared shell, M-18
reorder, M-19 learning composition and required remaining M/G/U/X/R/Z work.

## Catalog grid interaction batch

M-16 linked implementation on 2026-10-06 in draft PR #1. Internal
`ownedGridInteraction` now registers React Aria catalog interaction, composing
the owned processing, cells, header and status parts. Criteria and layout hooks
independently support controlled/default pagination, ordered sort, filters,
search, retained selection, visibility, order and widths. Callback-only concerns
remain writable; defaults seed once and callback snapshots are isolated.
Atomic pagination requests page/size once. Criterion transactions request page
zero before the criterion and then emit one combined snapshot. Selection-only
changes preserve processing dependency references.

The interaction provides native container/table refs, ResizeObserver flex
measurement, committed numeric width overrides and bounded pointer/keyboard/native
slider resizing. Page selection changes only selectable page IDs, retaining
off-page and previously selected disabled IDs. Nested links/menus remain separate
from row actions and selection. Focus tracks row/field/control identity through
sort/refresh and repairs hidden/deleted controls within their grid; empty/loading
page entry falls back to the table. Page transitions made while focus is inside
the grid reset vertical scroll and focus page entry. Footer/toolbar/view-trigger
entry behavior remains the shell's later work. Layout effects use a server-safe
effect when no document exists.

The public AppDataGrid renderer/types/helpers and old parts still use the legacy
engine. M-16 and whole-directory strict removal are not complete. Persistence,
M-17–M-19, M-36/M-37 and broad G/U/X/R/Z gates remain open. Source/transitive,
token/layer and emitted declaration guards cover the new internal modules and
stories; the registered interaction requires colocated behavior tests.

Validation:

- Final `pnpm check`: 130 files / 686 tests, four foundation and four release
  tests, production/story typecheck, ESM/declarations, public-entry imports and
  consumer typing passed. Added 27 controller/layout/interaction/SSR regressions.
  No checks weakened. `pnpm build-storybook` passed with existing module-directive,
  sourcemap and chunk warnings.
- Fresh packed React 19.2.3 and 18.3.1 consumers passed SSR/hydration-entry,
  production Vite/CSS and no-retired-peer checks. Direct internal interaction SSR
  assertions passed from both tarballs with no warnings; these do not add a public
  component export or establish complete hydration/browser acceptance.
- Native in-app browser proof: page selection retained one prior-page ID (11
  selected), header ascending sort reset page two to page one without losing IDs,
  Edit invoked only the host action and returned focus, removing that row restored
  the next row's menu control, keyboard Status resize committed 170 and pointer
  Course resize committed 425 without freezing Score flex. Refresh kept the
  visible row at the same screen position. Narrow viewport rendered minimum
  widths and horizontal scrolling (scrollLeft 407). Two independent instances
  retained separate selections and sorting. Browser warning/error logs empty.
  Screenshot: `/tmp/sgui-m16-interaction.png`.

Local Node26.5.0/pnpm10.29.3; Node24, NextRSC, touch, screen-reader, zoom, complete
visual/browser and workload performance matrices remain open. Native checks are
representative interaction evidence, not whole-catalog acceptance. Prior f1c5fc7
CI/title checks passed; new head checks are inspected separately after push.
No merge, publication, manual version, license, workflow permission or secret
changes.

Next code batch: public AppDataGrid/helpers/cell-parts integration, persistence,
strict whole-directory and public-entry/declaration audits; then M-17 shared
shell, M-18 reorder, M-19 learning composition and required remaining backlog.
Commit/push and dispatch the successor local sg-ui chat, with no overlapping
checkout edits after dispatch.

## Catalog grid public integration batch

Implemented on 2026-10-06 for draft PR #1: M-16 public AppDataGrid renderer,
owned public types/helpers and old cell/header/status paths now compose the
registered owned interaction. Whole AppDataGrid, AppDataGridShell and
LearnerClassesDataGrid directories and their transitive source/declarations enter
the strict audit. Granular public entries are added for all three. This is code
integration, not an internal proof-only batch.

M-17 shell now owns one set of criteria/layout/selection, shares a single processed
result between list/cards and passes transactions directly to the interaction.
Header/footer/toolbar changes produce one combined host snapshot; page resets
precede criteria callbacks. Boolean selection is counted, off-page IDs survive,
and None clears all retained IDs. Footer navigation enters the accepted page's
first text cell/card; view changes preserve trigger focus and deleted card actions
repair focus by stable identity without taking focus from another instance.
Server rows pass through unchanged in both views, including unknown totals.

M-19 learner grid removes retired rendering/typing/styling in favor of owned
link/date/action columns and grid state. Existing Class-prefixed names remain.
Breaking mappings, scope/style requirements and retained/deferred features are in
[catalog integration](react-aria-catalog-grid.md).

Optional versioned persistence validates current fields, criteria, page sizes,
layout/order/widths and view mode; legacy list pagination wins over cards. It never
persists selection, host rows or pending/errors. Controlled values remain
authoritative. Persistence gates controller mounting until a client effect
restores defaults, so SSR and initial hydration match. Malformed/blocked storage
falls back safely. Colocated tests cover real persisted SSR-to-hydration with no
recoverable errors. Public reset-view UI remains open (the internal storage reset
is implemented).

Required verification: repository check, Storybook build, strict public-entry and
declaration checks, clean packed React 18/19 SSR/Vite/CSS consumers and representative
native public grid/shell interactions. Final evidence is recorded below after the
checks complete. Existing jsdom navigation/scroll limitations and Storybook
use-client/sourcemap/chunk warnings remain informational.

M-16/M-17/M-19 integration is shipped on the draft branch, but broad G/U/X/R/Z
acceptance remains open. M-18 row reorder is the next required code batch; the
public renderer deliberately omits rowDrag until bounded pointer/touch/keyboard,
Move controls and cancellation are implemented. The retired exported DnD module
still needs strict migration. M-36/M-37 foundation removal, M-38 reconciliation,
public reset, G workload/performance and browser/touch/SR/zoom/visual/Node24/NextRSC
matrix remain required. No whole-backlog completion, merge or publication is claimed.

Final batch evidence: `pnpm check` passed 130 test files / 680 tests, four
foundation and four release-policy tests, typing, ESM/declarations, public-entry
imports and built consumer typing. `pnpm build-storybook` passed. Packed
React 19.2.3 and 18.3.1 SSR/hydration-entry/Vite/CSS consumers passed; final React19
fixture is `/var/folders/vp/bckxx0097z9gb5q8_d1chsvh0000gn/T/sgui-foundation-consumer-zMj6rZ`
and React18 fixture is `.../sgui-foundation-consumer-xuPd8T`. These fixture builds
are separate from the real persisted hydration tests; they do not prove the full
hydration/browser acceptance matrix. 169 local documentation links and diff
whitespace checks passed.

Native in-app browser public proofs: standalone page 2 entered Course11/name
with scrollTop0; selecting Course1 then page2/select-page announced 11 selected;
Score ascending reset page1 with aria-sort ascending and retained IDs; None
cleared selection. Shared shell selected Course1, switched page2 to cards showing
Course11–20, retained `1 selected` and kept Cards trigger focus. Switching back
kept List trigger focus; next footer page entered Course21/name. Native narrow
543px surface retained horizontal overflow and vertical container scrolling.
Warning/error logs were empty. Screenshot: `/tmp/sgui-public-grid-shell.png`.
Representative evidence only; touch, screen-reader, zoom, visual/performance and
full browser matrices remain open.

## Catalog grid reorder batch (M-18)

The owned public AppDataGrid, shell list and LearnerClassesDataGrid now accept
rowDrag requests with shared stable grid IDs and host row ownership. React Aria
provides pointer/touch/keyboard drag semantics; owned Move up/down controls
provide non-drag access. Reorder is disabled outside complete unsorted/unfiltered
client data fitting on page zero, during pending/error states or multi-selection.
Invalid/self/adjacent no-op and replaced-dataset drops emit no request. Focus
repairs after collection reconciliation, including source controls disabled at
list boundaries, pending host updates and preservation of external focus.

AppDataGridRowDnd is migrated as a whole: named owned button/native ref/slot,
owned row selectors and grid isolation, scoped token preview and lifecycle/SSR
guards. Its granular entry, registered interaction, source/transitive and full
declaration audit now join the strict migrated boundary. The action menu remains
the last column; reorder controls precede text and page-entry focus skips control
columns. See [reorder contracts](react-aria-grid-reorder.md) for breaking mappings
and host optimistic persistence/rollback responsibilities. HostOwnedReorder and
ReorderUnavailableWhileSorted stories exercise the new behavior.

Validation: pnpm check passed 132 files / 704 tests, including 21 public reorder
regressions and six handle/helper tests, plus four foundation and four release
checks, production/story typing, ESM/declarations, public imports and consumer
typing. pnpm build-storybook passed with existing directive/sourcemap/chunk
warnings. Final packed React 19.2.3 and 18.3.1 consumers passed SSR,
hydration-entry, production Vite/CSS and no-retired-peer checks. Source/transitive,
registered interaction, token/layer and upstream declaration audits cover the
whole reorder directory. Local links and diff whitespace were verified.

Native IAB checks on HostOwnedReorder verified keyboard drop from Course 2 after
Course 3, preserved Course 1 selection and eventual source-handle focus; Escape
on an unselected source returns to that source handle, not the different selected
row. Move requests show pending controls, and a rejected optimistic move restores
the exact previous array/order and source Move button focus. This native check
found and fixed two cancellation/rollback timing cases with regressions. The
proof screenshot is /tmp/sgui-m18-reorder-rollback.jpg. No new runtime warning/error
was observed in the completed story (an earlier missing-story error preceded its
first build). IAB coordinate pointer drag attempts from both handle and row did
not produce a move; pointer and touch-device verification are explicitly still
open under G-17/G-18, along with the broad native matrix. React Aria pointer/touch
integration is implemented, but these attempts are not passing device evidence.

This batch updates [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1).
Prior public-grid CI and title runs 37556178468/37556178514 completed successfully.
The next code batch continues M-36/M-37 and the required remaining gates.
M-36/M-37, public reset-view, M-38 reconciliation and broad G/U/X/R/Z gates
remain open. Implementation evidence does not close full touch-device,
screen-reader, browser, zoom, visual, performance, Node24 or NextRSC matrices.

## Public icons and primitives (M-36/M-37)

The public icon catalog now shares the owned vector implementations: all 49
extracted barrel names remain, and all 95 directly used/mapped icons are available
through `/icons` and individual `/icons/<Name>Icon` paths. Activity aliases,
case-insensitive matching, default fallback and host override/fallback options
use the owned size/options contract. Public tests cover every vector, native SVG
refs, decorative/meaningful names and RTL. The complete mapping tables close
B-04, and activity implementation/tests close I-07. See
[icon mappings](react-aria-icons.md).

Every extracted primitive reexport now maps to a real owned implementation or
an explicit documented removal. Public CircularProgress and LinearProgress
wrappers preserve the required accessible-name union and fix their presentation.
Autocomplete shares owned ComboBox; branded links, external label wrapper,
engine selection event and item component are removed with replacements.
Table headers now use explicit native TableHeaderCell semantics. `/primitives`
no longer imports typography augmentation or legacy theme. Public barrel and
individual icon dependency roots, complete component/public declaration directories
and shared adapter/hook/i18n declarations join strict audit coverage. See
[primitive mappings](react-aria-primitives.md).

Validation: pnpm check passed 135 files / 819 tests, four foundation and four
release tests, production/story typing, ESM/declarations, public import/type checks
and source/transitive/token/layer guards. The new batch adds 110 public icon tests
and five progress/composed primitive tests. pnpm build-storybook passed with
existing directive/sourcemap/chunk warnings. Fresh packed React 19.2.3
(`sgui-foundation-consumer-AkETpt`) and React 18.3.1
(`sgui-foundation-consumer-apK2L2`) passed SSR/hydration-entry, production Vite/CSS,
no-retired-peer and unused-vector pruning checks. Packed activity behavior is
checked separately in SSR so the basic client proof continues to reject unused
activity vectors. Native IAB checked public menu keyboard activation, Escape
source-trigger focus return, native field/checkbox reset and named determinate/
indeterminate progress. Runtime warning/error logs were empty; screenshot:
`/tmp/sgui-m36-m37-public-primitives.jpg`. 136 local documentation paths and diff
whitespace passed.

This batch updates [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1).
The master list contains 326 unique task IDs: 320 required and six explicitly
future items. 39 checklist items plus 33 recorded catalog completions make 72
required items closed; 248 remain formally open, including partially implemented
work. This count is closure status, not an equal-effort completion estimate.
M-16–M-19 implementations remain subject to their grid acceptance gates. Legacy
`/theme`, Storybook decorator and package peer removal, public grid reset, presets/
hooks, selective client boundaries and broad browser/accessibility/performance/
release acceptance remain open. Next work continues these code and acceptance
requirements; representative proofs do not close the complete matrix.

## Public theme, dependency removal and M-39 presets

Implemented the public `/theme` mapping and W-09 production Storybook globals on
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1). `AppThemeProvider`
is the owned Provider under its preserved name; root and `/theme` expose Provider,
ThemeScope and owned props. Provider forwards a native div ref for React 18.3/19,
bridges host locale, and allows an explicit visual direction override. Removed
old theme objects, typography augmentation and the last retired source imports.
See [theme mappings](react-aria-theme.md). Storybook uses production tokens/scopes
with theme, density, locale and direction controls; its host canvas supplies the
production surface token after removal of the global baseline.

Z-01 dependency removal is complete: manifests and regenerated lockfile have no
retired direct/runtime/peer/dev/optional/transitive foundation packages. Installation
removed 44 packages without unrelated resolution upgrades. Source root-barrel
transitive audits and public theme declarations are included in the guards.
Historical documentation, snapshot references and notices remain for their explicit
Z-02–Z-06/Z-08 audit; the commercial license and notices are preserved in this batch.
No broad final-removal acceptance is inferred from dependency removal.

M-39 now exposes Course-named translated admin/instructor factories with canonical
immutable presentation statuses, first/action column locks and fresh empty
sort/filter defaults. Existing Class-named exports/identifiers remain; each factory
has isolated arrays and English fallbacks. Ten tests and two controlled toolbar
stories cover translations, canonical enum options, instance isolation and hiding/
resetting unlocked columns. See [preset contracts](react-aria-grid-presets.md).

Final validation: `pnpm check` passed 135 files/829 tests, four foundation and four
release tests, production/story typing, ESM/declarations, all entry imports and
consumer types. `pnpm build-storybook` passed with existing directive/sourcemap/
chunk warnings. Fresh packed React 19.2.3 (`sgui-foundation-consumer-3k1RVD`) and
React 18.3.1 (`sgui-foundation-consumer-a7bqej`) fixtures passed SSR/hydration-entry,
Vite/CSS/no-retired-peer and unused-vector pruning checks using public `/theme`.
The packed editor consumer also passes without retired peers.

Native IAB checks verified live toolbar dark/compact/ar-EG auto RTL settings,
portal language/direction/theme/density, modal focus, Escape source focus and an
independent ltr visual override retaining ar-EG locale. The corrected dark canvas
was visually inspected; screenshot `/tmp/sgui-owned-theme.png`. Storybook manager
emits its upstream future mandatory PopoverProvider ariaLabel warning; no application
errors were observed. Guidance links and diff whitespace passed. These representative
checks do not close full browser/screen-reader/touch/zoom/performance/RSC acceptance.
M-39, W-09 and Z-01 are newly checked; all other required gates keep their disposition.

## Public hook reconciliation, view reset and selective client boundaries

This batch on [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1)
closes M-42, H-13–H-15, G-22 and R-02 with implementation and consumer evidence.
Public pagination accepts arbitrary positive safe integers, or a host-defined
choice policy. Both state hooks are memory-only by default; local/session storage
requires explicit configuration and distinct keys. Versioned migration, validation,
blocked/quota storage fallback, key changes and cross-tab notifications remain
owned. Live validation/migration/version changes apply to cached and blocked
snapshots; absent or malformed storage never migrates the initial default.
Thirty real-hook tests include SSR-to-hydration restoration without recoverable
errors. The pure normalization helper remains server-importable. See
[hook mappings](react-aria-pagination-state.md).

Root/subpath reconciliation exposes LearnerClassesDataGridProps through all three
public entries and adds built consumer typing for learner models/grid props,
reset snapshots, hook options and setters. Models, type-only representative
fixtures and the shared date helper use owned contracts; eleven existing date
helper tests pass. Package guards now explicitly audit root/model/utility
public declarations alongside the existing catalog/hook/adapter/theme audits.
SideNavigation explicitly retains its existing local organization preference.
The persistence default change is documented as breaking.

AppDataGrid and AppDataGridShell offer an optional Reset view action. It restores
declared criteria, page zero, layout and view defaults and clears retained
selection. One complete onResetView snapshot supports atomic controlled host
acceptance; existing callbacks retain their authority. Reset saves validated defaults,
removes legacy keys, and suppresses the unchanged pre-reset controlled snapshot.
A changed host snapshot or later interaction resumes persistence, including when
the host accepts an alternative. Four reset regressions plus persistence tests
cover remount, controlled requests, mutation isolation and native refs. See
[grid reset contract](react-aria-catalog-grid.md).

The build no longer adds client directives by directory. Source implementations
own the boundary, with explicit directives added to two Lexical plugins using
client hooks. A package guard checks source/output fidelity and React client API
imports. A fresh packed React 19.2.3 fixture executes the official Flight renderer
under the react-server condition: Box/Typography/Table/ClassCardFrame/AuthShell/
AppShell and pagination normalization execute on the server, while Provider and
AppButton serialize as client references. The disposable fixture's loader converts
Node module bytes to text and resolves relative source-map URLs for the official
loader; it preserves maps and directives. No package dependency was added. See
[server/client packaging](react-aria-server-components.md). Broader framework
and barrel-weight acceptance remains open under R-04/R-08 and related gates.

H-02 implementation fixes download="" interception while preserving explicit
false routing, click-before-navigation ordering, cancellation, modifier clicks
and targets. Six adapter regressions and a native Link story cover these cases.
IAB verified completed defaultPrevented state for empty/named downloads, native
external links and modifier/target behavior; no extra router callback fired.
Its download-event wait timed out, so completed file-transfer/browser-matrix
verification remains open and H-02 is not checked off. Generated target tabs
were closed. No browser warning/error logs were observed.

Previous-head CI 37558029271 failed one EditableTitleField focus assertion while
all other 828 tests passed. The assertion now waits for the post-commit focus
effect, preserving the expected focus requirement. An added async-save regression
also verifies source focus restoration and preservation of later host focus.
The title checks on that head passed; next-head CI must be evaluated separately.

Final local validation: pnpm check passes 136 files/847 tests, four foundation
and four release tests, production/story typing, build, entry imports, source/
transitive/token/layer/declaration guards and consumer typing. Final Storybook
build passes with existing directive/sourcemap/chunk warnings. Fresh packed
React 19.2.3 (sgui-foundation-consumer-HAEjRw) passes Flight, ordinary SSR,
hydration-entry Vite/CSS/no-retired-peer/pruning; React 18.3.1
(sgui-foundation-consumer-0UJqKd) passes its SSR/Vite/CSS/pruning path. Native IAB
reset checks vary selection, page, card view, search and size 250, then verify
keyboard reset returns list/page zero/size 10/empty selection/search, retains reset
focus and persists defaults after reload. Screenshot: /tmp/sgui-reset-view.png.
139 local guidance links and diff whitespace pass. The static localhost:6148
server remains available; browser tabs are closed.

Six newly closed required tasks bring formal closure to 81/320 (239 open),
including many partially implemented gates. This is a task count rather than an
equal-effort estimate. M-40/M-41/M-43 and broad G/U/X/R/Z acceptance still require
concrete reconciliation and evidence. The PR remains draft; publication, merging,
manual version changes, licensing and workflow permissions/secrets are untouched.

## Real owned behavior tests, grid cells and runtime CI

This batch on [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1)
reconciles M-40/M-41 and closes M-43/R-10 with concrete code and tests.
[Cell/helper acceptance](react-aria-grid-cell-acceptance.md) maps every required
cell and helper to its implementation and behavior assertions. The audit found
`TextTableCell` discarded its truncation option. Shared text presentation now
preserves multiline content with `truncate={false}`; the supported public grid
column also exposes this option. Default ellipsis and full accessible text remain.
New public-grid tests compose all cell types, verify independent nested actions
and original row callbacks, and distinguish raw accessor sorting from formatting.

M-43 removes React hook mocks and synthetic Lexical node/command implementations.
Real mounted subscriptions cover synchronization, identity, removal, notifications,
cleanup and SSR snapshots. Real Lexical editors serialize/default/import/clone
image nodes, handle image insertion and horizontal-rule selection/deletion, and
unregister plugin commands on unmount. Learner grid tests mount the owned grid with
host translation and locale changes, menus, launch links, server passthrough and
client pagination/sort callbacks. Dialog integration tests use the real formatting
toolbar and Insert → Image menu. Remaining test wrappers capture the real editor
and make errors fail; floating toolbar isolation is covered by separate composed
floating tests. No story/test imports or mocks use the retired foundation.

The real grid tests exposed an upstream drag warning for grids without `rowDrag`.
They now omit drag hooks. The table instance changes only when reorder availability
changes, retaining the outer container and owned state. Lost grid focus is repaired
after collection reconciliation, survives an unrelated render and preserves later
host focus. The host reorder story includes an owned availability toggle. Unit
assertions do not claim pointer/touch reorder or browser focus-timing acceptance.

[Runtimes and CI artifacts](react-aria-runtime-ci.md) distinguish the Node 22.12.0
consumer minimum from Node 24 development/AI/release tools. CI tests both runtimes,
serially installs packed React 18.3.1 and 19.2.3 foundation/editor consumers and
retains matrix-specific package, Storybook and validation-log artifacts for 14 days.
Workflow permissions and secrets are unchanged. R-11 remains partial because
browser interaction, accessibility failure policy, performance smoke and host
framework acceptance still require executable coverage. R-12 awaits exact-head
remote artifact evidence for this workflow change.

Previous-head `dd93c2c` CI [37558672846](https://github.com/Structured-Growth/sg-ui/actions/runs/37558672846)
passed `pnpm check`, Storybook, packing and uploaded the unexpired `sgui-build`
artifact. This verifies that head's EditableTitleField focus regression, not the
new batch. PR title checks also passed for that head.

Final local Node 24 and exact-minimum Node 22.12.0 `pnpm check` both pass
137 files/855 tests, four foundation and four release tests, production/story
typing, source/transitive/declaration/token/CSS guards, build, public entry imports
and consumer typing. The final Node 24 Storybook build passes with the existing
upstream directive/sourcemap/chunk warnings. Final Node 22.12 packed React 18/19
foundation and editor consumers all pass; React 19 includes the official Flight
proof. Earlier Node 24 packed consumers also passed during this batch. Log files:
`/tmp/sgui-acceptance-final24.log`, `/tmp/sgui-acceptance-final22.log` and
`/tmp/sgui-acceptance-consumers24.log`. No repository dependencies changed.

Native IAB checks confirm actual nowrap/ellipsis and multiline wrapping in a
fixed-width source-wrapper story and the supported public grid column, including
dark rendering. See the cell acceptance record for widths/heights. Keyboard host
reorder toggling removes/restores all five handles and preserves source toggle
focus; no browser warning/error logs occur. Screenshots:
`/tmp/sgui-cell-wrapping.png`, `/tmp/sgui-reorder-toggle.png`. Temporary tab closed.
This does not verify a host toggle while focus is inside the grid, pointer/touch
reorder, screen-reader behavior or the complete native timing matrix.

158 relevant local guidance links and diff whitespace pass. Four newly closed
required tasks bring recorded closure to 85/320 (235 open); this count is not an
engineering-effort estimate. Broad G/U/X/R/Z gates and R-12 exact-head remote
artifact verification remain open. The PR stays draft.

## Executable browser gates and removal audit

R-11/X-12 now have a real Playwright gate against built static Storybook,
requiring Chromium/Firefox/WebKit in the Node 24 CI job. See
[browser acceptance](react-aria-browser-acceptance.md) for scope and failure policy.
Saved downloads verify exact bytes for empty/named/boolean attributes; explicit
false routing, click ordering, cancellation, modifier/target/external behavior
execute natively. Keyboard tests cover nested Escape focus, grid cell navigation,
selection/menu/sort, real Lexical selection and Alt+F10 formatting, native
read-only scrolling and host Move requests/source focus/rollback. No pointer or
touch drag claim is added.

The first axe run found a real keyboard-accessibility defect in the editor's
scrollable viewport. It now exposes a translated named region, keyboard tab stop
and token-based focus outline in editable/read-only modes. Two colocated tests
preserve focus access and the following editable tab stop. Native PageDown and
light/dark scans pass. The harness is the sole mandatory axe scan owner, avoiding
competing addon runs without disabled rules or node exclusions. All WCAG-tagged
violations, browser runtime errors and warnings fail; no retry/skip hides them.

Final local Chromium/WebKit run passes 30/30 tests including 16 axe scans in
23.7 seconds. The 1,000-row/250-render smoke observes navigation/render then
sort/render at 454/640ms in Chromium and 479/677ms in WebKit; its generous total
15-second threshold detects hangs, not a hardware performance guarantee.
Full Firefox remains required in Linux CI. Local Firefox exits before navigation
with a profile error consistent with the reported macOS app-data restriction;
it is not counted as a browser success. No OS permissions were changed.
Logs and reports: `/tmp/sgui-browser-final.log`, `artifacts/browser-results.json`.
CI retains `sgui-browser-node-24` plus browser logs for 14 days.

The [classified removal audit](react-aria-removal-audit.md) inspects every tracked
file, including hidden configuration, historical snapshots, manifests, guards,
lockfile and protected legal files. Six extraction destinations now have truthful
existence/removal/rename and owned replacement metadata, retaining source paths,
repository and commit. Z-03/Z-04 are reconciled; historical/legal literal work
remains open. A recursive package guard rejects retired references in every
emitted JS/declaration/CSS/JSON/map/SVG/HTML/text module, beyond public declaration
checks. Temporary probes prove it rejects a source-map reference and filename;
the probes were removed. Fresh dist/Storybook and eight new packed consumers
establish Z-07. LICENSE/notices are preserved and final Z-08 remains open.

R-12 closes with exact `c78a24e` CI
[37559276148](https://github.com/Structured-Growth/sg-ui/actions/runs/37559276148)
success: both Node targets, all four consumers per target, package/Storybook
uploads and six unexpired 14-day artifacts. Downloaded logs and the official
Node 24 tarball confirm the result. Its only retired text is protected legal
content. [Runtime evidence](react-aria-runtime-ci.md) records IDs and expiration.
This validates the prior commit rather than later browser changes.

Final local full checks on Node 24 and exact-minimum Node 22.12.0 pass 138 files /
857 tests, four foundation/four release tests, typing, build, public APIs and all
owned boundary/output guards. Storybook rebuild passes existing upstream build
warnings. Eight fresh packed React 18.3.1/19.2.3 foundation/editor consumers across
both Node runtimes pass; React 19 includes Flight. Logs:
`/tmp/sgui-browser-batch-check24.log`, `/tmp/sgui-browser-batch-check22.log`,
`/tmp/sgui-browser-batch-consumers24.log`, `/tmp/sgui-browser-batch-consumers22.log`.
All 201 extraction destinations/replacement paths and 280 guidance links pass.
Frozen install and diff whitespace are verified before commit.

Implementation-head `83b8dae2` CI
[37560065588](https://github.com/Structured-Growth/sg-ui/actions/runs/37560065588)
passes both runtime jobs, all eight consumers and 45/45 Chromium/Firefox/WebKit
tests, including 24 WCAG scans. Downloaded JSON confirms zero skipped,
unexpected or flaky tests in 95.7 seconds. Firefox verifies actual file transfers
and interactions on Linux. Seven unexpired 14-day artifacts include browser
report `11456069764`, expiring 2026-10-21 02:10:07 UTC. The browser guide records
engine-specific smoke timings. PR title validation also passes.

The final output guard additionally rejects standalone retired branding; a third
temporary negative probe confirms it, then is removed. Final Node 24 full check
and Storybook pass in `/tmp/sgui-browser-batch-final-check24.log`.
Seven newly closed tasks (H-02, R-11, R-12, X-12, Z-03, Z-04, Z-07) bring formal
closure to 92/320 required tasks, 228 open (28.75%). Broad native/touch/screen-
reader/visual/framework/performance gates remain open. The PR remains draft;
versions, licenses and workflow permissions/secrets are unchanged. Later heads
require independent CI inspection.

## Packed browser hydration and native handle input

R-08/X-18 now execute the packed production Vite consumers in browsers for both
React 18.3.1 and 19.2.3, rather than stopping at the hydration-entry build. The
helper loads each fixture with JavaScript disabled and then hydrates it with
mandatory browser diagnostics. Initial dark scope/English locale/leap-day
calendar, duplicate IDs, hydrated accessibility references, exact server scope
identity and real dialog/tab/refresh callbacks/focus are checked. Local Node 24
Chromium and WebKit pass both fixtures.

A separate clean packed Next.js 16.4.0/React 19.2.3 fixture builds production
App Router output, starts the production server and executes the same two
browser modes. Server shell/card/table/pagination imports run without a client
boundary; a consumer Client Component owns scope, translation adapter, state and
event handlers. Browser checks verify host `fr-FR`, French February headings,
2024-02-28/29 endpoints, theme tokens, server node identity, tabs, nested overlays,
save/Escape and trigger focus. Duplicate IDs fail in both modes and every IDREF
must resolve after hydration and dialog mount. React Aria's date helper targets
are inserted by client effects; their absence in SSR-only markup is explicitly
recorded, not claimed as complete pre-JavaScript accessibility. Local Chromium
and WebKit pass with zero browser errors or warnings. Next remains fixture-only.

CI Node 24 now runs all three engines for both packed Vite React versions and
the Next fixture, with diagnostic JSON/failure screenshots/traces in the existing
14-day browser artifact. Local engine subsets are explicit and forbidden in CI.
The [browser acceptance guide](react-aria-browser-acceptance.md) records commands,
scope and limits. Logs: `/tmp/sgui-packed-browser18.log`,
`/tmp/sgui-packed-browser19.log`, `/tmp/sgui-next-consumer.log`.

Native handle-coordinate dragging exposed a real first-gesture defect: the
upstream slot's `pointerEvents: none` passed hits to the enclosing cell and no
native dragstart occurred, though dragging row text succeeded. The owned handle
now defaults to native pointer hit testing for its drag slot while preserving
host style. A colocated regression composes the actual public grid and verifies
its draggable handle/row, without importing upstream context into tests.
The new browser file uses native mouse gestures and requires trusted
dragstart/drop/dragend, before/after host changes, cancellation/rollback and source
focus. Trusted touchscreen taps separately verify the non-drag Move alternative
at 390px. Physical-device long-press dragging, assistive-technology behavior and
the broad G-17/G-18 matrix remain open.

R-08/X-18 bring formal recorded closure to 94/320 required tasks (226 open,
29.38%). These checks cover representative packed consumers rather than every
host framework or control. The shared PR remains draft and unmerged.

Final local Node 24 full check passes 138 files/858 tests, four foundation and
four release tests, build/typing/package and owned-boundary guards. Frozen install
passes. Fresh Storybook build passes with existing upstream warnings. The final
Chromium/WebKit suite passes 40/40 in 41.7 seconds with 16 WCAG scans and ten
native reorder/touch-alternative tests; no skipped or flaky tests. Final freshly
packed React 18/19 Vite browser, Next browser and React 18/19 editor consumers pass
serially in `/tmp/sgui-hydration-final-consumers.log`. Logs:
`/tmp/sgui-hydration-check24.log`, `/tmp/sgui-hydration-final-browser.log`,
`/tmp/sgui-native-drag-storybook.log`. 168 local guidance links and whitespace pass.
Firefox remains required in CI and retains the known local Mac launch limitation.
Exact-minimum Node 22.12.0 full check also passes 138 files/858 tests, foundation/
release tests, production/story typing, build and package/owned guards in
`/tmp/sgui-hydration-check22.log`. Current consumer execution is local Node 24;
the CI matrix independently runs packed consumers on both supported runtimes.

Previous final guard head `7f03a351` independently passes CI
[37560788949](https://github.com/Structured-Growth/sg-ui/actions/runs/37560788949)
on both runtimes, all eight consumers and 45/45 Linux browser tests. Downloaded
JSON confirms zero skipped/unexpected/flaky results; all seven artifacts remain
unexpired. This is previous-head evidence, not validation of this later batch.

## Native modal reflow and display preferences

X-05/X-06 gain executable representative gates, while their broad checkboxes stay
open. Public AppModal's light/dark tabbed stories execute all twenty fields and
footer actions with native Tab at 320px and with 200% text plus spacing overrides.
The suite requires the complete focused control inside its panel/viewport and
uncovered at its center, stable header/footer positions where space permits,
action callbacks, native tab switching and nested portal/return focus.

Two real defects are fixed: fixed-height chrome could squeeze the tab panel away
under enlarged text, and suppressed initial scrolling/WebKit caret-only scrolling
could leave focused fields clipped. A token-sized panel minimum and outer dialog
scroll fallback keep content/actions reachable. Focus visibility checks run after
layout/restoration against intersecting scrollports, stop when focus changes or
content unmounts, and ignore nested portaled focus. The TextReflow story and
[modal contract](react-aria-modal-shells.md) document this behavior.

Browser preferences stop linear/circular/button loading animations while keeping
pending/indeterminate semantics. Every configured engine must apply forced-color
emulation; system Highlight focus outlines and disabled/pending meaning are checked.
Chromium and WebKit both report the active query. Actual chrome zoom, physical
high-contrast settings, assistive technology and full catalog contrast/state
acceptance remain open. Root text scaling/effective reflow are scoped accurately
in the [browser guide](react-aria-browser-acceptance.md#display-preferences-and-modal-reflow-x-05x-06-partial).

Prior exact head `1a6c3d51` CI
[37561495918](https://github.com/Structured-Growth/sg-ui/actions/runs/37561495918)
passes Node 22.12.0's check/Storybook/four packed consumers and Node 24's check,
Storybook and 60/60 Linux Chromium/Firefox/WebKit tests, with no skipped,
unexpected or flaky tests (downloaded JSON, 134.4 seconds). Its overall conclusion
is failure: the new Node 24 packed React 18 step crashed while serving a missing
request because it sent 200 headers before reading the file and then sent 404
headers. The helper now reads first; a new foundation Node regression verifies
missing/malformed requests, path boundaries, subsequent availability and exact
bytes. Vite fixtures declare an empty data favicon; browser diagnostic assertions
remain mandatory. No packed Firefox/Next CI success is inferred from that run.

Final local frozen install and full checks pass on Node 24 and exact-minimum
22.12.0: 138 files/858 behavior tests, five foundation and four release tests,
source/story typing, build, public APIs and owned import/token/layer/output guards.
Storybook builds with existing upstream warnings. Fresh serial packed React 18/19
Vite SSR/browser/Flight and Next 16.4.0 production/browser consumers pass Chromium
and WebKit, with zero browser warnings/errors. Logs: `/tmp/sgui-display-complete-check24.log`,
`/tmp/sgui-display-complete-check22.log`, `/tmp/sgui-display-complete-storybook.log` and
`/tmp/sgui-display-complete-consumers.log`. Firefox retains its local Mac launch
limitation and remains required in CI. Formal closure stays 94/320 (226 open).

The final Chromium/WebKit browser suite passes 54/54 in 48.8 seconds, with zero
skipped, unexpected or flaky tests, including initial footer action focus under
enlarged chrome. Results are in `artifacts/browser-results.json` and
`/tmp/sgui-display-complete-browser-results.json`; the log is
`/tmp/sgui-display-complete-browser.log`. Header, body and footer share the same
scoped visibility repair. The PR remains draft; later heads need independent CI.

## Calendar explanations without hover (K-17 partial)

DateRangeSelector now shows host preset descriptions as visible paragraphs with
button description references, including disabled presets. Keyboard focus on an
unavailable date exposes its ISO date and host reason in a visible status. A private
native-ref bridge attaches the reason to the actual date button while preserving
its complete localized date label and existing description references. It cleans
up only its own reference when host availability changes. Native disclosure access,
separate draft endpoints and Apply/Cancel ownership remain. No public API changed.

The Availability story now demonstrates disabled/available preset explanations and
a host-controlled committed output. Colocated regressions cover descriptions,
keyboard focus without selection, full labels and changed/removed host reasons.
Native browser gates cover light/dark preset activation and delayed commit, Arrow
focus on unavailable dates and keyboard disclosure toggling. K-17 stays unchecked
for intermediate range previews, assistive technology and the remaining matrix;
formal closure remains 94/320 required tasks (226 open, 29.38%).

Final local validation: Node 24 and exact-minimum Node 22.12.0 `pnpm check`
pass 138 files/861 behavior tests, five foundation and four release tests, source/
story typing, ESM/declarations/public imports and owned boundary/token/layer guards.
Fresh Storybook builds with existing upstream warnings. The complete local
Chromium/WebKit suite passes 62/62 in 53.9 seconds, with zero skipped, unexpected
or flaky tests and mandatory diagnostics; eight cases cover the new calendar
behavior. Fresh serial packed React 18/19 Vite SSR/browser (React 19 Flight) and
Next 16.4.0 production/browser pass both local engines with no browser diagnostics.
Local Firefox retains its documented launch limitation and remains mandatory in CI.
Evidence: `/tmp/sgui-calendar-final-check-storybook.log`,
`/tmp/sgui-calendar-final-check22.log`, `/tmp/sgui-calendar-final-browser.log`,
`/tmp/sgui-calendar-final-browser-results.json` and
`/tmp/sgui-calendar-final-consumers.log`. Current-head CI is independently required.

## Native editor clipboard and read-only document selection (E-05/X-09 partial)

Native clipboard gates now copy browser source fields into the actual Lexical
editor, requiring trusted copy/paste events and plain/HTML MIME transfers. Plain
multiline paste, native undo/redo, rich bold/italic serialization, a host-owned
saved-document reload, ordinary formatting/typing and read-only edit rejection
execute in both themes. No synthetic clipboard payload or permissions bypass is
used. The ClipboardEditing story makes the host callback and reload observable.

The document-only copy assertion exposed the read-only root's missing keyboard
focus: Select All copied host content. The root now takes Tab focus and scopes
unmodified Ctrl/Command+A to its own read-only contents, preserving native Copy.
Editable commands remain with Lexical; composition and unrelated/modified keys
are not intercepted. Colocated tests cover both modifier keys and read-only focus.
Native selection gestures have a 25ms key hold so selectionchange reaches Lexical
before the next formatting command; a zero-duration burst exposed pending native
selection timing and is not claimed as resolved engine behavior.

Actual IME composition, OS clipboard permission prompts, physical devices and
live assistive technology remain open. E-05/X-09 remain unchecked; formal closure
stays 94/320 required tasks (226 open, 29.38%).

Final local validation: Node 24 and exact-minimum Node 22.12.0 `pnpm check`
pass 138 files/863 behavior tests, five foundation and four release tests, source/
story typing, ESM/declarations/public imports and owned boundary/token/layer guards.
Fresh Storybook passes with existing upstream warnings. Full Chromium/WebKit
passes 70/70 in 58.7 seconds, with zero skipped, unexpected or flaky tests and
mandatory diagnostics. Eight new clipboard cases pass, alongside 16 axe scans.
Fresh serial Node 24 packed React 18/19 editor SSR/hydration-entry builds and
foundation Vite SSR/hydration browser consumers (React 19 Flight) pass; both local
engines report no browser diagnostics. Firefox remains mandatory in Linux CI and
retains its documented local launch limitation. Evidence: `/tmp/sgui-clipboard-final-check-storybook.log`,
`/tmp/sgui-clipboard-final-check22.log`, `/tmp/sgui-clipboard-final-browser.log`,
`/tmp/sgui-clipboard-final-browser-results.json` and `/tmp/sgui-clipboard-final-consumers.log`.

## Local editor image resource ownership (E-06 partial)

The integrated editor previously allocated local insertion object URLs without
releasing them. PageRichTextEditorSection now tracks only its own URLs, releases
them on document-key replacement/unmount, and discards failed/stale local
insertions. URLs survive read-only changes and deleted content so native undo can
restore the image. Host upload URLs remain host-owned, including blob URLs. Dialog
preview allocation/release stays independent. The LocalImageLifecycle story makes
replacement, read-only and unmount behavior reviewable; native browser tests use
real PNG files, loaded-image checks, undo/redo and observed balanced URL lifetimes.
Colocated regressions cover lifecycle cleanup and host ownership. Local blob URLs
remain temporary; durable saved documents require host upload asset addresses.

E-06 remains unchecked for the wider URL/protocol, file/content validation and
host upload acceptance. E-02/E-04/E-07 rich-document and trust-boundary coverage
also remains open. Formal closure stays 94/320 required tasks (226 open, 29.38%).

Final local validation: Node 24 and exact-minimum Node 22.12.0 `pnpm check`
pass 138 files/865 behavior tests, five foundation and four release tests, source/
story typing, ESM/declarations/public imports and owned boundary/token/layer guards.
Fresh Storybook passes with existing upstream warnings. Full Chromium/WebKit
passes 74/74 in 66.2 seconds, with zero skipped, unexpected or flaky tests and
mandatory diagnostics; four new image lifecycle cases pass alongside 16 axe scans.
Fresh serial Node 24 packed React 18/19 editor SSR/hydration-entry builds pass.
Packed Vite/Next browser consumers were not repeated for this resource-only batch;
calendar-head CI independently passes all three engines and all eight consumers,
as recorded in [runtime evidence](react-aria-runtime-ci.md). Local Firefox retains
its launch limitation and remains mandatory in Linux CI. Evidence:
`/tmp/sgui-image-check-storybook.log`, `/tmp/sgui-image-check22.log`,
`/tmp/sgui-image-browser.log`, `/tmp/sgui-image-browser-results.json` and
`/tmp/sgui-image-consumers.log`. Guidance links (111) and whitespace checks pass.

## Saved rich-document interactions (E-02/E-04 partial)

Registered CodeHighlightNode so saved highlighted code can reload rather than
silently failing initial parse; added the real Lexical ListPlugin so saved lists
continue and exit through native Enter. The rich-document browser gate exposed a
separate production error: rule deletion places a valid range caret on the root,
but ToolbarBridge called `getTopLevelElementOrThrow()`. Reading the optional
top-level element preserves toolbar updates and native Undo after deletion.
Colocated regressions exercise the registered JSON configuration, list commands
and root caret. The SavedRichDocument story supplies a host-save/reload flow.

Native Chromium/WebKit cases cover all inline formats, author color/body marker,
alignment/indentation, link attributes, numbered/bullet lists, quote, highlighted
multiline code, table header/cell/background, loaded image/alt/dimensions/asset
metadata and rules. Editing before and after `editorKey` reload compares all
unchanged serialized nodes; read-only reload retains rendering. Native Enter
continues/exits lists; rule deletion/Undo and host reload retain list edits.
The fixture is representative: E-02/E-04 remain unchecked for their complete
node/plugin, selection/history, table and consumer-document matrix. E-06/E-07
link/image trust boundaries are separately open. Formal closure stays 94/320
required tasks (226 open, 29.38%).

The preceding clipboard CI completed with two Linux WebKit failures because the
trusted HTML paste event enumerated no MIME types despite passing rich rendering,
serialization and subsequent editing. Observation now requires actual HTML bytes
containing the copied bold content from the same trusted event; no clipboard
injection, retries or diagnostic exclusions were added. See the failed exact-head
[runtime record](react-aria-runtime-ci.md); new Linux verification remains required.

Image-lifetime CI also finished with two Firefox failures rejecting its PNG
fixture and the same two WebKit clipboard assertions (107/111 passed). A chunk
checksum audit confirmed invalid IDAT CRCs in that fixture and the first rich
fixture. Both now contain generated checksum-valid 1×1 RGBA PNG bytes, retaining
the native loaded-width and mandatory runtime-error assertions. This corrects
test data, not a production image decoding policy; Linux verification is required.

Final local Node 24 and exact Node 22.12.0 `pnpm check` pass 139 files/868 behavior
tests, five foundation and four release tests, source/story typing, builds/public
APIs and owned boundaries/token/layer guards. Fresh Storybook passes with existing
upstream warnings. Full Chromium/WebKit passes 82/82 in 73.9 seconds with zero
skipped, unexpected or flaky cases, including eight new rich-document cases and
16 axe scans. Fresh serial packed React 18/19 editor SSR/hydration-entry builds
pass. Vite/Next browser consumers were not repeated; earlier independently
successful CI is recorded separately. Firefox remains mandatory in Linux CI.
Evidence: `/tmp/sgui-rich-final-check-storybook.log`, `/tmp/sgui-rich-check22.log`,
`/tmp/sgui-rich-final-browser.log`, `/tmp/sgui-rich-final-browser-results.json`
and `/tmp/sgui-rich-consumers.log`.

## Shared editor link destinations (E-06/E-07 partial)

Continued the unfinished link-policy batch with one owned destination policy for
LinkUrlModal, saved/pasted Lexical links and browser activation. The owned node
replacement accepts existing saved `link` documents, preserves rich children and
URL/title/target/rel metadata, and emits the existing public `link` JSON schema.
Unsafe/malformed destinations render as `about:blank` and activation is canceled;
accepted ordinary, modifier and middle activation retains the existing new-tab
behavior while isolating the opener. Noncollapsed selection and host-canceled
clicks suppress activation. Dialog host restrictions remain supported.

Added the LinkDestinations story and native light/dark browser cases for saved
rejected destinations, ordinary/modifier/middle opener isolation, host save/reload
and native rich link paste. Chromium clipboard converts relative href attributes
to absolute destinations, while WebKit preserves their relative spelling; the
paste test verifies the exact resolved native href property across both. It does
not alter clipboard contents or bypass browser diagnostics.

The [link contract](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial)
records accepted destinations and host responsibilities. Rejected original URLs
remain in host JSON for fidelity; external host renderers must apply their own
policy. Image sources, upload/file validation, document styles and broader
rich-content trust acceptance remain open. E-06/E-07 remain unchecked; this batch
does not change formal task closure.

Local Node 24 validation: `pnpm check` passes 142 files/914 behavior tests,
foundation/release guards, source/story typing, ESM/declarations and package imports.
Fresh `pnpm build-storybook` passes with existing upstream warnings. Full
Chromium/WebKit passes 90/90 in 74.9 seconds, with zero skipped,
unexpected or flaky cases, including eight new link cases and 16 axe scans.
Fresh serial packed React 18.3.1/19.2.3 editor SSR/hydration-entry builds pass.
Firefox and exact-minimum Node 22.12 were not rerun in this batch; Firefox retains
its documented local launch limitation and remains required in Linux CI.
Vite/Next browser consumers and remote CI were not rerun. Evidence:
`/tmp/sgui-links-final-check.log`, `/tmp/sgui-links-storybook.log`,
`/tmp/sgui-links-final-browser.log`, `/tmp/sgui-links-final-browser-results.json`
and `/tmp/sgui-links-consumers.log`.

## Saved and uploaded image source policy (E-06/E-07 partial)

Owner: Codex. Status: implemented and locally verified, pending review on
[draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1). This continuation
also carries forward the completed, previously uncommitted shared link-policy
batch above. Formal closure remains 94/320 required tasks; E-06/E-07 stay open.

Image decoration and new upload results now share an owned source policy for
HTTP/HTTPS, relative paths/queries/fragments, nonempty blob URLs and encoded
image MIME data. Unsupported schemes, network paths, malformed HTTP destinations,
empty blob/data payloads and non-image data are rejected. Saved rejected images
render translated placeholders without resource requests, preserve meaningful
alt names/decorative semantics, and retain original source/dimensions/asset JSON.
Rejected new upload results leave the same file and description available for
retry. Host URL ownership and local undo/document URL lifetimes remain unchanged.
The [image source contract](react-aria-editor-section.md#image-source-policy-e-06e-07-partial)
states the syntax/context boundary; image bytes, asset authorization, redirects,
upload cancellation matrix and broader rich-content/style acceptance remain open.

ImageSources demonstrates saved reload/read-only and host rejection/retry. Native
light/dark browser cases require relative/web/data PNG and encoded SVG to decode,
an SVG script to remain inert in its img context, rejected addresses to produce
no request, saved metadata to remain unchanged and retry to retain description.
The fixture includes Lexical's native paragraph fields for exact JSON comparison;
resource counts target owned image decorations because WebKit inserts empty
Lexical linebreak-helper images outside them. Diagnostics, no-request checks and
complete JSON assertions remain mandatory.

Local Node 24 `pnpm check` passes 143 files/960 behavior tests, foundation/release
tests, source/story typing, build/declarations/public imports and owned guards.
Final story typecheck and fresh `pnpm build-storybook` pass with existing upstream
warnings. The full Chromium/WebKit suite passes 98/98 in 78.2 seconds, with zero
skipped, unexpected or flaky cases, including eight image-source cases and
16 axe scans. Fresh serial packed React 18.3.1/19.2.3 editor SSR/hydration-entry
builds pass. Exact-minimum Node 22.12, local Firefox and packed Vite/Next browser
consumers were not repeated for this slice; independent current-head CI remains
required. Evidence: `/tmp/sgui-image-policy-check.log`,
`/tmp/sgui-image-policy-final-typecheck.log`,
`/tmp/sgui-image-policy-final-storybook.log`,
`/tmp/sgui-image-policy-complete-browser.log`,
`/tmp/sgui-image-policy-complete-browser-results.json` and
`/tmp/sgui-image-policy-consumers.log`. Guidance links and whitespace checks pass.


## Host upload lifetime matrix (E-06 partial)

This slice completes representative UI cancellation acceptance after editorKey
replacement, read-only changes and unmount. Each transition is tested with late
host success and failure. Colocated composed tests settle the old request while a
new upload is pending, require unchanged serialized document/callbacks and busy
state, retain current failures for retry and reject another late failure after
reset. Existing Cancel/reopening tests remain. Standalone ImageUploadModal now
invalidates local promise updates on unmount; both late outcomes require a single
preview release and an empty new draft.

HostUploadLifecycle demonstrates these transitions with a delayed host promise.
Native Chromium/WebKit cases require no stale image/error, clean reopening,
enabled file selection, an empty description and Escape dismissal. Read-only
retains the original text. Host callbacks remain File-only, returned URLs remain
host-owned and UI invalidation does not abort transport or undo created assets.
See the [upload lifetime contract](react-aria-editor-section.md#host-upload-lifetime-e-06-partial).
E-06/E-07 remain open for wider file/content validation, author styles and trust
acceptance; formal closure stays 94/320 required tasks.

Local Node 24 `pnpm check` passes 143 files/968 behavior tests plus foundation,
release, type, build/declaration and public package checks. Fresh Storybook passes
with existing upstream warnings. Complete Chromium/WebKit passes 110/110 in
89.4 seconds with zero skipped, unexpected or flaky cases, including the 12 new
upload lifetime cases and 16 axe scans. Exact-minimum Node 22.12, local Firefox
and packed browser consumers were not repeated for this slice. Predecessor
6bee8cf CI run 37619587227 was still pending at handoff; current-head CI must be
checked independently. Logs: `/tmp/sgui-upload-final-check.log`,
`/tmp/sgui-upload-storybook.log`, `/tmp/sgui-upload-browser.log` and
`/tmp/sgui-upload-browser-results.json`. Changed guidance paths and whitespace pass.


## Next.js docs workspace skeleton — 2026-10-14

DOCS-001–DOCS-004 are complete in the separate [docs website backlog](docs-website.md).
Library source/tooling/tests moved to `packages/ui`; `apps/docs` consumes its compiled
public package and supplies an app-owned theme. Navigation, installation, component
index, Button/Dialog playgrounds, theming, unreleased version manifest and licensing
skeleton are implemented. The AppButton story was transferred and retired. Existing
native Storybook fixtures remain until separately migrated; historical evidence
paths refer to the pre-workspace layout. Root docs source links now resolve to UI.
Node 24 full checks pass 257 files/1,640 tests plus guards/types/release/build/package
checks; docs production build and one Chromium smoke pass. See the linked receipt
for exact scope, logs and unrun matrices. No F/T/V/A count or commercial term changes.


## Docs playground/source contract — 2026-10-14

Root AGENTS.md requires a prop playground for every component docs page and a
shared preview/source/copy panel for every live example. Current AppButton/AppModal
docs satisfy the contract; the separate docs backlog lists each catalog/primitive
family still awaiting docs rollout. Button variants/tones, densities, content and
native form plus the dialog playground expose runnable current-setting source.
Docs type/build and the single expanded Chromium smoke pass; nine generated
snippets typecheck and native clipboard bytes match displayed source. This closes
the current docs-source requirement, not all-library rollout or any T/V/A gate.


## Demo/website theme isolation — 2026-10-14

The docs website retains fixed Structured Growth/light styling. Component page
selectors now own preview-only identity/mode, with Structured Growth and SGUI
Default in light/dark. Prop controls, documentation frames and code panels remain
in the website scope; preview density and overlay identity are separately scoped.
Generated source reflects preview settings. Docs type/build and Chromium scope,
computed palette, portal, clipboard/snippet and original smoke assertions pass;
see [docs validation](docs-website.md#website-versus-demonstration-scopes--2026-10-14).
No library runtime change or broad acceptance is claimed.


## Demo identities/system/contrast — 2026-10-14

DOCS-009 is implemented: Structured Growth, SGUI Default and Editorial demo identities
with independently selected system/light/dark appearance and system/standard/
increased contrast. Browser preference changes update previews without reload;
forced colors retain OS palette precedence. Website branding stays separate.
Copyable examples include matching palettes and live preference subscriptions.
Node 24 docs type/build and three production Chromium checks pass, including
named enhanced text/control/focus contrast pairs, preference changes/overrides,
forced-color focus, Editorial high-contrast dialog and prior source/clipboard
checks. See [docs evidence](docs-website.md). No library API or F/T/V/A count changes.


## Shared Demo settings toolbar — 2026-10-14

DOCS-010 is complete: one persistent layout-level owner and toolbar replace the
per-component appearance panels. Client navigation preserves identity, appearance
and contrast across component and information pages. Website and demo scopes
remain separate; source snapshots and portals consume the shared choices. Node 24
docs type/build and all three targeted production Chromium checks pass, including
selection persistence, prior palette/system/forced-color checks and snippet/copy
evidence. See [docs receipt](docs-website.md). Full reload starts fresh; no backend
persistence or library/migration acceptance change is claimed.


## Complete Next.js component catalog — 2026-10-14

DOCS-011 and the 84 DOCS-PLAY leaves are implemented: 90 searchable component
pages, 269 examples, coverage for all 200 public React component/icon names,
including compound children, aliases and host providers. Every page has a meaningful
playground and current copyable source. Production build/type/export checks and five
Chromium checks pass, including compilation of 538 initial/changed snippets,
clipboard, separate demo scopes, preferences, navigation and representative mobile
layouts. See [catalog evidence](docs-website.md). Legacy Storybook native fixture
transfer and generated complete prop references remain open. No F/T/V/A acceptance
count or library API change is implied.


## Remaining regression leaves — 2026-10-15

Closed the last 17 T leaves with a combined 63-case Chromium run against the
fresh docs-owned native fixture host, six existing Navigation/Stack unit cases,
and browser-test TypeScript validation. Added focused real-layout checks for Stack
wrapping, long breadcrumb ancestors, loaded/rejected avatar sizing, neutral split
actions and tooltip placement; joined-group checks now assert the shared outer
border and logical inner dividers. Preserved the existing native selection, editor,
shell, modal, tab and grid scenarios. All 570 F and 570 T leaves are now recorded
complete; no broad hardening/final acceptance claim follows.

See the [task-to-evidence receipt](backlog-execution-2026-10-15.md) for scope,
runtime and retained local reports. The checkout includes ongoing changes and is
not an attested production head.


## Initial hardening and website reconciliation — 2026-10-15

The final regression flows also passed independently in Firefox and WebKit:
63 native cases per engine, zero skips/retries. Recorded 39 primary-flow V leaves
across thirteen component scopes plus V-S15-01/02 and V-S16-01. Broader visual,
manual accessibility, physical-device and production acceptance remain separate.

Closed the twelve outstanding docs scenario leaves, the complete prop-reference
leaf and library-watch leaf. The final docs production build and 21 Chromium
checks passed (90 catalog routes, 904 compiled source snapshots); 15 focused
API/isolation/theme Node checks passed. Fixed BUG-0001: API metadata no longer
depends on shell working directory. See the
[execution receipt](backlog-execution-2026-10-15.md) for individual mappings and
remaining gates. No release, deployment or whole-code audit completion is claimed.


### Second native hardening batch

An additional 44 existing control/adapter/calendar cases passed in each of
Chromium, Firefox and WebKit. The evidence closes 69 primary component V leaves,
two adapter consuming-output leaves, four production-docs Chromium leaves and
six narrow utility output leaves. Failure/cleanup, visual review and manual
accessibility remain independently tracked. The current open hardening/final
acceptance count is 659; the website retains three open entries. See the
[updated task mapping](backlog-execution-2026-10-15.md#second-hardening-batch).


### Broader development checkpoint and repaired defects

The full unit run is green (262 files, 1,660 tests). Repaired missing granular
BrushIcon forwarding (BUG-0002) and the overflow hook's missing explicit client
boundary (BUG-0003); fresh package/consumer/packed-output guards pass. All 35
foundation/release-policy Node checks, library/browser types and foundation/token
guards pass. The full Chromium run passed 509/513; its four stale sizing/token
assertions were corrected, and all 16 affected foundation/token cases then passed
in all three engines against a fresh host. No all-suite-green or frozen release
claim is made for that mixed evidence.

Accepted the additional individually successful Chromium primary flows and the
Provider/PersistentState evidence with explicit mappings. There are now 153
completed V leaves and three repaired defects; 629 hardening/final-acceptance leaves
remain open. See the [checkpoint receipt](backlog-execution-2026-10-15.md#broader-development-checkpoint).


Fresh public-package, native upload-lifetime and pure date-contract boundary
evidence additionally closes V-S14-01, V-S16-02 and V-S17-02. The latest remaining
hardening/final-acceptance count is 626 (156 V leaves complete, three repaired
bugs tracked separately). The website still has three open entries.


## Final acceptance inventory — 2026-10-16

A-B-01 | captured modified dev Git/package/public-entry state | [inventory](final-acceptance/2026-10-16-inventory.json) | uncommitted base 540f47d | package audit and 238 runtime/declaration entry comparisons pass | local tracking refs only; no release acceptance | A-B-03/A-B-05.

A-B-02 | reviewed required repository guidance before this batch | [execution](react-aria-final-acceptance.md) | uncommitted base 540f47d | guidance/path reconciliation | review is not all-component conformance | A-B-03.

A-B-04 | captured all primitive and direct icon exports including wildcard helper routes | [capture script](../../packages/ui/scripts/capture-acceptance-inventory.mjs) | uncommitted base 540f47d | resolved declarations match every runtime entry; packed bytes/consumer types pass | signatures/defaults and legal/AT gates remain | A-B-05/A-Z-08/A-Z-13.

Remaining active counts: 317 acceptance, 20 editor hardening and six future leaves. No production promotion or publication.


## Final acceptance FA-02/03 — 2026-10-16

A-B-03 | inventoried maintained source/imports, CSS/classes, DOM candidates, ambient declarations, hidden configuration, installed workspace dependency graph and generated-output linkage | [source snapshot](final-acceptance/2026-10-16-source-inventory.json) | uncommitted dev base 540f47d | AST/PostCSS capture and foundation guards pass | inventory is not DOM/SSR/legal conformance; personal state/secrets excluded | A-B-05/A-B-09/A-Z-05/06/08.

A-B-11 | recorded separate React/Node/TypeScript/bundler/browser/SSR/RSC promises and configured versus executed evidence | [support matrix and resume ledger](react-aria-final-acceptance.md) | uncommitted dev base 540f47d | inspected manifests, CI and consumer fixtures | no new remote CI/device/AT/support-range claim | A-B-06/A-Z-11.

Current remaining: 315 A, 20 V and six future leaves. Durable transcripts now accompany the snapshots; reuse completed scopes unless their relevant inputs change. FA-04 baseline check is in progress.


## Final acceptance FA-04 — 2026-10-16

A-B-06 | captured full local baseline, preserved original nine failures and reconciled four stale calendar fixtures/tests with shipped contracts | [durable ledger/transcripts](react-aria-final-acceptance.md#fa-04-local-unitpackagerelease-and-replacement-host-baseline) | modified dev base 540f47d | 1728 unaffected retained unit passes + 10 affected rerun passes = 1738 cases; 32 foundation checks; four release checks; typecheck, fresh library/native-fixture builds and package audit pass | original pnpm check command failed; no false green-run claim; full engines/remote CI/AT remain separate | A-B-05/A-Z-11.

Remaining: 314 A, 20 editor V and six future leaves. Next A-B-05. Completed inventories and unaffected checks are retained, not repeated.


## Fifteen-conversation acceptance reconciliation — 2026-10-16

Reviewed all fifteen reports covering 55 distinct leaves. Accepted 32 complete
architecture/contract/inventory obligations, retained 23 partial with explicit
successors and removed only completed rows from the active checklist.
[Machine reconciliation](final-acceptance/parallel-reconciliation-2026-10-16.json)
preserves each original task, report/result hashes and limits. All 1778 built
outputs unchanged from FA-01; source deltas remain the four FA-04 test/fixture
changes. No production mutation or broad suite rerun.

Current: 38/320 A complete; 282 A remain. Twenty V and six future leaves unchanged.
BUG-0008 tracks six disabled/read-only Clear characterizations in the new picker
compositions; BUG-0009 tracks unsupported inherited TextArea icon props. Other
partial findings include type cycles/enforcement, 36 stale manifest rows, current
routing/theme/bundle/visual evidence and documentation gaps. No native/device/AT
or release result inferred from source-only reviews; Node26 defect probes retain
their environment limit. Next fix BUG-0008, then BUG-0009; reuse completed evidence.


## Wave 02 acceptance and integrated corrections — 2026-10-16

All 282 remaining A leaves were reviewed exactly once by the original fifteen
conversations: 127 complete, 154 partial, one blocked. Twelve additional
user-authorized fix conversations delivered and were reviewed; coordinator
validation closes A-G-02 and A-K-16 as two further narrow contract/publication
obligations. Current total **167/320 A closed; 153 A, 20 editor V and six future
items remain**. This pass closed 129 of 282. Original wording, outcomes and
successors are preserved in [wave reconciliation](final-acceptance/wave-02-reconciliation.json)
and [supplement](final-acceptance/coordinator-integration/supplemental-reconciliation.json).

BUG-0008–0012 are corrected: picker disabled/read-only Clear/commit guards,
TextArea inherited icons/multiline alignment, DatePicker availability parity,
Calendar callback reason access and grid reserved __reorder IDs. Retain affected
31 picker/TextArea, 37 DateField/DatePicker, Calendar/locale, 123 grid and 24
composed transaction unit results with their actual source boundaries. Fresh
Node 24 library/type, foundation guard, package-import/consumer type/packed-file,
docs production/catalog and docs-owned native fixture builds pass. Seven focused
native cases per desktop engine pass in Chromium/Firefox/WebKit (21 executions;
18 unaffected earlier passes plus three enriched datetime reruns). First build
and test-driver failures remain preserved alongside successful corrections.

[Integration receipts](final-acceptance/coordinator-integration/evidence.json)
record exact current working inputs and built outputs. Earlier FA snapshots and
report hashes are immutable dated evidence. Documentation/manifest fixes are
separate from physical device/AT, legal/owner approval and full production
matrices; A-X-11 remains blocked on actual screen-reader/operator observation.
Resume the remaining specific successors, not completed inventories or unchanged
passing checks. Uncommitted dev work only; no production branch/tag/publication.


## Wave03 integration / dev push — 2026-10-16

Reviewed all40 handoffs; integrated compatible51patch-file portions and subsequent
reproduced native fixes, preserving the preexisting calendar/editor/search work.
Closed14 bounded original A leaves;181/320 closed,139 A /20V /6future remain.
[Per-leaf decisions](final-acceptance/wave-03-integration/reconciliation.json) and
[push receipts](final-acceptance/wave-03-integration/push-evidence.json) retain exact
evidence and unperformed gates. Fresh build/type/foundation/token/docs/fixture/
package/browser-type/release-policy checks pass. Initial full unit run1843pass/1fail
was corrected with focused23-case rerun; current editor190case run and Select6
pass. Earlier89 native passes/8failures/1skip/64unrun are not a green complete
matrix; corrected native/operator/consumer/visual/owner/legal gates stay open.
User explicitly requested committing current work to dev and pushing it now.
Personal .obsidian state excluded; main/tags/publication/version untouched.

## Validated browser follow-up — 2026-10-16

Known automated failures are resolved in the [follow-up receipts](final-acceptance/wave-03-followup/validation-results.json). Full unit checkpoint:297 files /1,851 tests pass; the final Menu type guard also passes17 affected tests. Fresh library/foundation/token/docs/fixture/type/package checks pass. Native evidence covers161 passing cases and one unsupported Firefox touch skip: the full run passed160 cases, and its last WebKit CSS-capability assertion was corrected and passed in a three-engine focused rerun. Unsupported WebKit forced-color-adjust coverage is explicitly recorded rather than claimed. Docs evidence covers11 passing cases, including94 routes and1,138 compiled source snapshots, using the original eight passes plus three corrected cases.

Menu native Tab dismissal, neutral Button feedback and editor Cancel restoration order are fixed. Original failing runs remain retained. **139 A,20 editor V and six future leaves remain**; this follow-up does not close physical-device/AT, reviewed visual-baseline, installed-consumer or owner/legal/production gates.


## iOS Simulator VoiceOver automation proof — 2026-10-16

User prefers simulator automation. Verified installed Xcode27.1/iOS27.0; added a private standalone XCTest/Safari harness and leased runner under `packages/ui/tests/apple`. Two executions pass the Select interaction plus actual VoiceOver speech capture. The maintained runner passes build/test/summary/shutdown, retains immutable host/source hashes and xcresult. [Receipts and original failed locator run](final-acceptance/apple-simulator/results.json). No library source, public exports or consumer dependencies change. This is a bounded capability proof, not physical-device or whole manual-AT acceptance; existing139 A/20V/6future counts remain. No operator intervention was required.


## Compact calendar defaults and text navigation — 2026-10-16

Completed the requested calendar layout update: tighter pointer cells in both densities, default hidden endpoint fields, logical-start month/year with grouped text navigation buttons, and horizontal month slides. Touch minimum targets remain intact; RTL reverses motion and reduced motion disables it. A private inert outgoing snapshot preserves one live grid/focus owner. Compact headers reserve enough width to keep longer month names from changing height.

[Task receipts](final-acceptance/calendar-compact-layout/results.json): affected units 15 files / 82 tests pass; library, foundation, production docs/catalog, native fixture and browser type checks pass. Browser evidence covers 42 passing configurations across Chromium/Firefox/WebKit: initial 41 passes plus a corrected 12-case navigation/reflow rerun after waiting for motion to settle. The original WebKit timing failure is retained. This feature does not change the remaining 139 A / 20 V / 6 future acceptance counts.


## Presets opt-in in default date examples — 2026-10-16

Corrected the docs-owned default that injected presets into date-range overviews, playgrounds, density and form examples. Show presets now starts off; explicit preset examples and the playground option remain available. The library already defaults to an empty preset list. Production docs build/catalog checks and four focused browser checks pass, covering both inline/dropdown defaults, opt-in choices/source/isolation and desktop/narrow overview sizing. [Receipt](final-acceptance/calendar-compact-layout/preset-defaults.json). Existing acceptance counts remain unchanged.


## Independent calendar endpoint assignment — 2026-10-16

Added optional `calendarEndpoints` index mapping for independent paged range calendars. The From/To reference examples now use `["start", "end"]`, and the range playgrounds expose an assignment option. Assigned calendars edit their endpoint and evaluate its restrictions; either endpoint can be entered first, crossing clears only the opposite endpoint, and incomplete drafts cannot commit. Shared/unassigned, linked and scrolling behavior remains covered. Updated public prop declarations, usage guidance and copied source.

[Receipts](final-acceptance/calendar-independent-endpoints/results.json): 89 affected tests / 15 files pass; fresh library/foundation/production docs/catalog/native fixture/browser-type checks pass; six native docs cases pass across Chromium/Firefox/WebKit for inline and dropdown From/To selection, keyboard/pointer input, navigation, Apply/Cancel and compiled source. Existing 139 A / 20 V / 6 future acceptance counts remain unchanged.


## DatePicker popup width correction — 2026-10-16

Removed the stale seven-control-width calculation from DatePicker's calendar wrapper; its content width now follows the actual compact calendar while retaining the viewport cap. [Receipt](final-acceptance/calendar-compact-layout/popup-width.json): all 12 browser checks pass across Chromium/Firefox/WebKit, including balanced padding at both densities on desktop/narrow viewports plus existing width/source/focus checks. Fresh library/foundation/production docs/catalog/native fixture/browser-type validation passes. Reviewed the Material dark popup screenshot. No public API change or broad acceptance closure.


## One-calendar preset example without endpoint fields — 2026-10-16

Removed the optional start/end textboxes from DateRangePicker's “Preset panel with one calendar” example (also reused on the Calendar page). Its copied source and description match the cleaned dropdown; other explicitly field-enabled preset examples remain. Production docs build/catalog checks and five focused overview/preset browser checks pass, including preset selection/Apply and the absence of endpoint textboxes in the dropdown/source. No library API or acceptance-count change.


## Shared form-field message placement — 2026-10-16

Implemented the requested default descriptions above controls and independently configurable `descriptionPlacement` / `errorPlacement` values (`above` / `below`; errors default below). A shared private helper/type keeps existing message nodes, IDs and interaction state owned by each field. Covers text, selection, choice, date/time (text and segments) and composed range/period fields. Switch/search/async selection expose description placement and retain their existing request-status semantics. Inline choice labels remain beside indicators; private grid/toolbar label hiding now targets the owned choice label marker. Updated public declarations, every affected playground/source, both-density message examples, usage guidance and the [contract guide](form-field-message-placement.md).

[Receipts](final-acceptance/form-field-message-placement/results.json): 92 affected test files / 642 tests pass; fresh library/foundation/production docs/catalog/native fixture/browser types and final docs types pass. All 81 targeted native docs cases pass across Chromium/Firefox/WebKit, including composed forwarding and both grid renderers' visible selection controls. Reviewed aligned row screenshots. Initial locator/focus-driver failures are retained; native input focus inside managed grids is not used as a keyboard acceptance claim. Existing 139 A / 20 V / 6 future counts remain unchanged.

## 2026-10-16 — FormFieldScope presentation defaults

Implemented the requested reusable `FormFieldScope` (root/primitives/experimental
exports) for shared description/error placement. Explicit field props win,
nested scopes inherit omitted settings, and library fallback stays description
above/error below. The scope adds no DOM element or native form. All existing
placement-capable fields and composed picker errors participate; search/async
request failures retain result-flow semantics. Values, messages, validation,
required/disabled state and density keep their existing ownership.

The new catalog page has its independent overview, playground, compact and
comfortable nested-scope examples, generated public props and Contains metadata,
and host/accessibility guidance. Copied source matches live controls and values.

Validation: affected suite **314 tests / 49 files** passed; final dedicated scope
suite **5 tests** also passed, including live inheritance in a date-time popup.
Foundation guards, fresh library build, production docs build/catalog checks,
docs typecheck, and packed package imports/declarations/assets passed. New docs
browser scenario passed in Chromium, Firefox and WebKit (**3/3**), checking
inheritance, overrides, state/source isolation and narrow reflow. Evidence:
[form-field-scope/results.json](final-acceptance/form-field-scope/results.json).
These feature checks do not close the broader device/AT/visual acceptance gates.

## 2026-10-17 — Opt-in resizable icon-panel shelves

Added `IconPanelNavigation.resizable` (default false), `minPanelWidth` (240px),
`maxPanelWidth` (960px), and `onPanelWidthChange(width, id)` notifications. A
focusable inward-edge separator supports pointer capture, touch targets,
physical Left/Right arrows with RTL, Shift increments, Home/End bounds, Escape
rollback and pointer cancellation. Widths survive close/reopen and panel switches
while mounted; content remains mounted and preserves its existing state.
Host and viewport bounds still apply. The resize limit uses document geometry,
including the stable scrollbar gutter, and updates when the viewport changes.

DocsShell enables resizing only for Page documentation, leaving Demo settings
fixed. Desktop growth preserves room for the main pane, and narrow shelves remain
viewport-bounded overlays. The component playground exposes resizing and width
bounds; named compact/comfortable examples demonstrate both rail sides. Public
prop metadata, component guidance and the icon-panel architecture guide are current.

Final validation: **15 units / 5 files**, foundation guards, fresh library build,
production docs build/catalog/source guards, docs typecheck and packed-package
checks pass. **9 browser cases pass**: six new resize cases across Chromium,
Firefox and WebKit, plus the three existing rail cases in their configured
Chromium environment. They cover drag, keyboard/RTL, cancellation, retained widths,
opt-in/default behavior, source compilation and narrow viewport fit.
Evidence: [resizable-icon-panel/results.json](final-acceptance/resizable-icon-panel/results.json).

Retained probes: initial narrow viewport overflow was fixed by accounting for the
document gutter. A Chromium pointer driver was stabilized by disabling opening
motion for the resize scenario; existing motion assertions remain. An extra,
outside-default-matrix Firefox run of the unchanged original rail smoke failed
its `scrollbar-width: thin` assertion (received `none`); it is retained as an
unclosed cross-engine follow-up, not counted as a passing baseline or resolved
by weakening the assertion. The default docs suite runs that existing test in
Chromium. These targeted results do not close broader acceptance gates.

## 2026-10-17 — In-place DatePicker month/year navigation

Calendar and DatePicker now default to `navigation="period"`: the month/year
heading replaces the day view with the shared PeriodPicker inline month/year
buttons, inside the existing popup. `navigation="arrows"` retains the previous
static heading, and `"month-year"` retains direct native dropdowns. Non-Gregorian
calendars preserve their native heading/day navigation; their direct selectors
remain available. Native locale and multiple-selection smoke evidence still passes.

The mounted, inert/aria-hidden day layout reserves frame size. Year/month choices
use buttons rather than nested popups; Apply navigates to the first eligible day
and returns to days without committing the date, while Cancel/Escape returns
without changing focus date/value. Heading focus is restored. Date/time actions
are hidden while period navigation is active, retaining their layout space so
there is only one visible Apply action and no change in popup dimensions.

`periodPickerProps` forwards relevant year-entry, year-page-size, visible-year,
year-bound and message-placement options. The calendar owns display, unit,
purpose, labels, callbacks, disabled/read-only state and date restrictions.
Additional chooser year bounds intersect inherited min/max and availability,
and cannot broaden them; actual date validation remains the outer field's
responsibility. Partial months remain navigable; completely blocked periods
are disabled. Callback predicates retain single-date null endpoint/range context.

PeriodPicker adds reusable inline display and navigation purpose while retaining
popup/whole-period-selection defaults and native form semantics. Year pages
default to 12 (16/24 configurable); text-year entry remains optional. Typed
incomplete years stay invalid when choosing a month. Native serialization is
absent in navigation mode and retained in inline selection mode.

Updated public API/composition metadata, component guidance, prop playgrounds,
compact/comfortable examples, birthday and date/time scenarios, and
[calendar contracts](react-aria-calendar-contracts.md). Each Example owns state.

Final targeted validation: **136 units / 23 files**, fresh library build,
foundation/source graph guards, production docs build/catalog guards, docs
typecheck and packed-package declarations/import/assets pass. **13 browser cases
pass**: nine new cases across Chromium/Firefox/WebKit plus four affected existing
Chromium birthday/date-time/range-navigation cases. Assertions cover exactly one
popup, unchanged width/height across view changes, no default inline scrolling,
availability/bounds, native values remaining uncommitted, cancellation and focus,
year paging/leap-day selection, narrow fit, source compilation and existing
date/time draft ownership. Compact and comfortable chooser screenshots were
reviewed. Evidence: [results.json](final-acceptance/date-picker-inline-period-navigation/results.json).
Broader device/AT/visual gates remain separate and unchanged.

### Separate month/year navigation and optional heading controls (2026-10-17)

Completed: Calendar/DatePicker period headings now use independent grouped text
buttons. Month opens month-only choices; year opens year-only choices. A choice
returns immediately to days without committing a date, with no Apply/Cancel/Clear.
Escape restores the originating heading; one popup and its frame dimensions remain.
Year navigation retains the visible month when eligible, otherwise uses the first
eligible day of the chosen year. Optional typed-year navigation uses Enter.

Added `allowMonthSelection` and `allowYearSelection` (both true by default) for
period navigation. False retains plain text; actual date restrictions still use
min/max and availability. Added independently owned week-only event reference,
playground controls, generated API metadata and current contract guidance.
Standalone PeriodPicker retains its existing defaults; optional inline navigationView
selects immediate month-only/year-only choices.

Validation: 136 affected unit tests in 23 files; library build/foundation guards;
fresh production docs build/catalog/source-isolation checks; docs TypeScript;
packed-package checks. All 16 browser cases passed: 4 new/updated scenarios across
Chromium, Firefox and WebKit plus 4 affected Chromium birthday/time/range cases.
The cases cover independent choices, immediate view changes without date commits,
missing action controls, partial/full availability bounds, stable dimensions,
compact/comfortable/narrow layouts, Escape/focus return, week-only restrictions,
and source compilation. Month-choice screenshots reviewed. Evidence:
[separate month/year navigation](final-acceptance/separate-month-year-navigation/results.json).
Broader historical acceptance/device/AT gates remain separate.


### Shared MonthPicker/YearPicker and range navigation parity (2026-10-17)

Completed the shared component extraction requested after the separate single-date
heading work. Public MonthPicker (numeric 1–12) and YearPicker (numeric 1–9999)
are exported through root/components/experimental, with localized choices,
controlled/uncontrolled state, disabled/readOnly, bounded availability and owned
styles. YearPicker supports paged buttons and deferred text validation/acceptance
on Enter or blur. Both inherit density. Neither creates an overlay or owns native
form serialization; PeriodPicker retains whole-period selection semantics.

Calendar and all range calendar layouts now compose a shared private view adapter
and these public choices. PeriodPicker inline month/year choices also reuse them.
DateRangeSelector and DateRangePicker default to navigation="period" with the
same allowMonthSelection/allowYearSelection and periodPickerProps contracts as
Calendar/DatePicker. Explicit arrows/month-year remain available. Only one chooser
is active in a range selector; independent From/To navigation preserves the other
calendar and applies draft/endpoint-aware availability without changing the range.

Added two catalog routes with independent overview/playground/reference panels,
range examples at both densities and an independent From/To scenario. Regenerated
API/composition/catalog metadata and documented props/defaults/host ownership.
Existing single-date adapter tests moved to CalendarPeriodNavigation.test.tsx,
retaining all four assertions/scenarios at the shared implementation boundary.

Validation: 144 affected unit tests in 26 files; fresh library build and foundation
import/layer/token guards; production docs build, catalog/source-isolation and
metadata checks; docs TypeScript; packed runtime/declaration/CSS/asset checks,
including public root picker imports. All 34 targeted browser cases passed across
Chromium/Firefox/WebKit (existing single-date flows plus shared/range/standalone
checks). Two extra Chromium runs captured compact/comfortable range month/year
views for visual review. Evidence is recorded in
[shared calendar pickers](final-acceptance/shared-calendar-pickers/results.json).
Broader historical acceptance/device/AT gates remain unchanged.

### DateRangePicker field-description correction (2026-10-17)

Restored the original catalog page subtitle. The overview/playground/reference
field description now reads: “Select the calendar icon or type a date range,
such as 'next week'”. Removed DateRangePicker's automatic format/reference-date
paragraph; only an explicit host description is rendered. Description/error ARIA
references now include only mounted messages. Parsing and deterministic reference
semantics remain unchanged. Validation: 16 affected units in four files, fresh
library/production docs builds and catalog checks, plus both Chromium range-text
browser cases (including overview-description association, restored subtitle,
relative input, native submission, isolation and copied source).

### Inset field focus regression (2026-10-17)

Fixed shared field/segment CSS to draw focus outlines inward, including decorated
wrappers and attached calendar/clock buttons. Theme colors, owned focus-width,
keyboard visibility and forced-color Highlight remain; borders/radii/layout do
not change. This affects shared textbox, textarea, select/combobox, search,
async multi-select, date/time and range field implementations.

Added field-focus-boundary.spec.ts: four demo identities × both densities × ten
field routes, plus dark/forced-color visibility and attached-action focus checks.
All 15 focused cases passed (five each in Chromium, Firefox and WebKit). Screenshot
review confirmed inset outlines. Library/production docs builds, catalog checks
and foundation import/layer/token guards passed. Evidence:
[focus boundary](final-acceptance/field-focus-boundary/results.json).

Open follow-up: the separate, unchanged picker-radius.spec.ts year-label fit
assertion fails in Material Compact/Light and Comfortable/Dark at line 30 in the
optional legacy month/year dropdown. Both failure records are retained in the
focus receipt; neither assertion was removed or weakened. This is not a claim
that the whole browser matrix or historical visual/AT gates are closed.


### 2026-10-17 — Year scrolling and independent calendar views

Completed the requested four-column YearPicker native vertical scroll default,
without a year-range heading or page arrows. Pagination remains available through
yearNavigation="paged"; calendar/date/range compositions forward it through
periodPickerProps. Documented both modes and kept source-backed controls/examples.

Calendar, DateRangeSelector and DateRangePicker now default to independent
multi-calendar navigation. Choosing a month/year or an arrow changes only that
view, preserving sibling views and shared selected dates/ranges. Linked navigation
remains explicit. Isolated nested interaction props and retained active keyboard
range previews, draft/Apply/Cancel/Clear/reset behavior and endpoint restrictions.

Validation: 149 affected unit cases in 26 files; 60 production browser cases
(28 Chromium, 16 Firefox, 16 WebKit), including four-column scroll/keyboards,
pagination opt-in, stable in-place chooser geometry, sibling isolation, source
compilation, bidirectional range creation and independent endpoint/drag/touch flows.
Library/production docs builds, foundation guards, docs TypeScript and packed
consumer checks passed. Evidence and source fingerprints:
[year scrolling and navigation](final-acceptance/year-scroll-independent-navigation/results.json).
This does not close unrelated historical acceptance gates or the previously
recorded optional legacy picker-radius year-label fit failures.


### 2026-10-17 — Fill the year chooser's reserved surface

Corrected the fixed six-row year scroller so it fills the available replacement
frame. Single-calendar range selectors extend that frame across hidden fields
and actions, removing the blank lower section without resizing the popup.
Multi-calendar replacements remain isolated to their calendar.

Validation: 149 affected units; 36 production browser cases in Chromium, Firefox
and WebKit. New assertions measure full scroll-frame height, the range selector's
bottom edge, and complete visibility of the last row after End. Existing stable
popup dimensions, source compilation, navigation isolation and explicit pagination
checks remain. Library/docs builds, catalog and foundation guards passed. The
first browser run exposed an inline-example viewport setup issue (35/36); bringing
the whole host into view retained all assertions and the final run passed 36/36.
[Evidence](final-acceptance/year-chooser-fill/results.json).


### 2026-10-17 — Responsive month choices

MonthPicker now measures its actual frame, localized labels and minimum control
targets. It prefers two columns/six rows when they fit; shorter hosts use more
columns, while narrow hosts retain readable controls and host-owned overflow.
The shared calendar/date/range/inline-period adapters inherit this behavior;
YearPicker keeps four columns. Resizing preserves selection/focus and calendar
popup dimensions. Added independently stateful resizable examples for tall,
medium and short/wide hosts at both densities, with matching public source.

Validation: 149 affected units; 54 production browser cases (18 each in Chromium,
Firefox and WebKit), including layout/resize/source checks and existing shared
month/year isolation, range preservation and year-scroll regressions. Library/docs
builds, catalog, foundation guards, docs TypeScript and packed consumers passed.
[Evidence](final-acceptance/responsive-month-choices/results.json).


### 2026-10-17 — Center fitting month choices

Centered natural-height month rows within the available frame using safe grid
alignment, retaining start alignment for overflow. DatePicker now provides one
stable replacement-view anchor covering its calendar and reserved hidden Clear/
time area, removing the previous top-heavy spacing without resizing the popup.
The adaptive column count and independent multi-calendar behavior remain intact.

Validation: 149 affected units; 62 browser cases (26 Chromium, 18 Firefox,
18 WebKit). Added geometric assertions comparing month-row centers with the full
DatePicker popup and other chooser frames, retaining responsive/source/selection,
month/year isolation and year-scroll checks. Birthday, narrow popup and atomic
datetime scenarios also passed. Library/docs builds, catalog, foundation guards,
docs TypeScript and packed consumers passed. Screenshot review confirmed balanced
spacing. [Evidence](final-acceptance/centered-month-choices/results.json).


### 2026-10-17 — Sliding tab selection indicators

Tabs now shares one decorative clipped indicator that animates selection changes
horizontally or vertically and resizes to the selected tab. AppPageTabs controlled
panels inherit it; route mode shares the private renderer and its own color alias.
Initial placement, scrolling and resizing track immediately; manual focus waits
for activation. Reduced motion disables transitions, forced colors uses Highlight,
and SSR/unmeasured strips retain the existing border fallback. Native focus,
selection callbacks and panel semantics are unchanged. Docs describe the default.

Validation: 21 unit cases in five files; all 24 new native animation cases pass
(eight each Chromium/Firefox/WebKit), including paused mid-transition geometry,
both densities/orientations, manual activation, reduced motion, RTL/forced colors
and route tabs. Existing overflow tests now also assert indicator alignment after
promotion and scrolling. Combined run: 31 pass, two WebKit overflow-menu cases fail
only the unchanged zero-page-error assertion with a ResizeObserver loop warning.
The warning reproduces with the entire indicator function bypassed in the browser;
this is isolation evidence, not an exact full-repository baseline checkout.

Recorded bounded follow-up [TABS-MENU-WEBKIT-RO](final-acceptance/animated-tab-indicators/open-followup.md)
without removing or filtering assertions. Library/docs builds, foundation guards,
catalog, docs TypeScript and packed consumers pass. This is not an all-green
browser or historical acceptance claim. [Evidence](final-acceptance/animated-tab-indicators/results.json).
