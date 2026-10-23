# Sliding drilldown menu panel scope

Status: HierarchicalMenu is implemented and integrated with public exports,
independent website overview/playground/examples, metadata and guard registration.
Three strengthened unit cases and nine native cases pass; the changed duplicate-ID
Back-focus case passes all three engines. The production docs check verifies both
current copied source and reference independence; the complete catalog verifies
98 routes and 1,284 setup/initial/changed example snippets. Validation logs are in
`final-acceptance/wave-04/coordinator/validation`. No spoken-AT or physical-device
approval is inferred from this technical component validation.
The requested component is the sliding panel that replaces a menu level and
provides a Back button. Dropdown/flyout submenus are outside this scope.
The documentation sidebar now adopts the component; see the dated integration
evidence below. SideNavigation keeps its existing account-aware implementation.
HM-T-01 regression coverage is complete: seven menu tests and 63 related
SideNavigation tests pass. HM-V-01 presentation validation is complete;
HM-ADOPT-01 is complete for the documentation sidebar.

## Reference and existing SGUI behavior

Reviewed the learning platform's
`apps/web/src/ui/components/SideNavigation/SideNavigation.tsx` and its stories.
`childBehavior: "drilldown"` pushes a child level onto a menu stack. The child
replaces the visible menu, shows a left-arrow Back row labelled with the branch
name, and enters with directional motion. Back pops one level and reverses the
entry direction. The story's Org Settings branch demonstrates this pattern.
The reference animates the incoming content by a short horizontal offset and
opacity; it does not animate two full-width panels crossing simultaneously.

SGUI already preserves this inside
[SideNavigation](../../packages/ui/src/components/SideNavigation/SideNavigation.tsx):
`handleDrilldown`, `handleBack`, `buildMenuStack`, a Back button and the current
level's sections. Its
[styles](../../packages/ui/src/components/SideNavigation/SideNavigation.module.css)
provide forward/back entry animation and reduced-motion handling. Existing
[behavior tests](../../packages/ui/src/components/SideNavigation/SideNavigation.test.tsx)
and [ancestry helper tests](../../packages/ui/src/components/SideNavigation/SideNavigation.helpers.test.ts)
cover relevant flows; source inspection does not establish browser visual parity.

The gap is availability as a reusable drilldown panel outside the account-aware
SideNavigation composition. The generic
[Menu](../../packages/ui/src/experimental/Menu/Menu.tsx) currently accepts flat items
and cannot present this hierarchy. Preserve existing support while extracting
reusable behavior; do not rebuild the entire menu system.

## Reusable component boundary

Use a candidate component name such as `DrilldownMenuPanel`; final naming and
exports belong to implementation. The panel owns level rendering, its local
navigation stack, Back behavior and transitions. It accepts host-supplied menu
content and callbacks without requiring a user profile, organization, account
adapter or application router.

Keep root presentation separate from level transitions: the same panel can sit
inside persistent side navigation or an appropriate trigger-opened surface.
The outer host owns opening, positioning and dismissal. Navigation must retain
native links and disclosure buttons; a popup command host must retain proper
menu keyboard/collection semantics. Resolve this composition before exposing a
universal renderer; arbitrary children must not silently break menu semantics.

## Appearance and branching requirements

- Activating a drilldown branch replaces the visible level within the same panel
  bounds. Keep the surrounding host/header stable; do not open a second flyout.
- Show a Back row above child content, with an arrow and a meaningful accessible
  label. Preserve the reference branch-name label by default; allow translated
  host labels. Hide Back at the root.
- Support a title, grouped items and optional footer sections per level. Child
  levels may have different labels, icons, links/actions, active or disabled
  items and content. Do not hard-code organization settings or account choices.
- Support recursive depth, including at least root → child → grandchild in the
  example. Back returns exactly one level. Sibling branches can lead to different
  content configurations; do not require a single fixed second-level template.
- Preserve SideNavigation's branch-level choice of inline expansion or drilldown,
  including mixed ancestry. Inline expansion remains its existing behavior;
  adding flyout submenus is not part of this component task.
- Match the existing short directional entry motion as the baseline. Forward and
  Back have opposite directions; account for RTL and reduced motion. Full-panel
  sliding choreography would be a separate intentional visual change.
- Keep Back available while long child content scrolls. Constrain content to the
  host's width/height, support compact and comfortable density, and retain visible
  focus with enlarged text, light/dark appearance and forced colors.

## Proposed state and event contract

These are requirements, not shipped prop names:

- Stable item/level identities determine ancestry. Repeated labels must not
  determine which branch is restored or focused.
- Support local stack ownership and a controlled path/change-request option.
  Keep expanded branches, current drilldown path and route/selection distinct,
  with one owner for each state concern.
- Entering a branch changes levels without firing its leaf action. Activating a
  leaf requests its host action/navigation once. Preserve existing SideNavigation
  branch routing to its href or first descendant; new standalone use should not
  require navigation merely to open a child panel.
- Back restores the previous level and focuses the branch that opened the child.
  Forward moves focus into the new level. Preserve prior inline expansion and
  usable scroll position when returning. Hidden levels cannot retain focus.
- Define reset behavior: a standalone uncontrolled panel starts at root on remount;
  a popup host resets its path on reopening by default; persistent navigation can
  derive ancestry from the host route. Controlled path values stay authoritative.
  Removed/disabled ancestors require path reconciliation and focus recovery.
- The outer surface retains dismissal and final trigger-focus restoration.
  Specify Escape behavior per host: popup commands unwind a child level before
  closing the root; persistent navigation does not acquire popup dismissal rules.
- Use owned types, React Aria inside interactions, generated component token aliases
  and compiled CSS Modules. Library-owned strings use translations with English
  fallbacks; host-provided content and routing/persistence remain host-owned.

## Delivery and acceptance leaves

The completed checklist is archived.
The HM-ADOPT-01 integration result is recorded below; remaining tasks live only
in the [unified backlog](backlog.md).

This plan is separate from historical F/T/V counts. Follow the
[master execution policy](react-aria-execution-policy.md) and
[current shell contracts](react-aria-modal-shells.md).

HM-V-01 evidence (2026-10-17): presentation closure
joins nine effective Chromium/Firefox/WebKit cases. Real CSS animation keyframes
reverse direction on Back in English/LTR and Arabic/RTL. Reduced-motion cases
have zero active animations. At a 360px viewport and 200% text, forced-color
emulation preserves usable scrolling, visible Back, focus and bounds on both
edges. The fixture now constrains the outer scope as well as the panel; root
review caught the original RTL underflow that a document scrollWidth check missed.
All three final narrow captures were reviewed. Original animation-driver failures
remain retained; the corrected driver waits for animationstart and resolves
Firefox rem/calc keyframes through CSS. No physical-device or spoken-AT claim.

## Prepared owned contract

`HierarchicalMenu` is a surface-independent panel with `items` (a
HierarchicalMenuLevel), `presentation="navigation" | "commands"`, controlled
`path`/`onPathChange`, `defaultPath`, leaf `onAction`, optional root `onDismiss`,
`backLabel`, density, native div ref/className/style. Levels own titles, labelled
sections and optional footerItems. Item IDs are stable and unique within a level;
children identify deeper levels and navigation supports mixed inline/drilldown.
Commands use a React Aria menu collection, while navigation uses native Link and
Button controls. Branches do not activate hrefs or leaf callbacks. The outer
Popover or persistent host owns geometry/opening/dismissal. Reset follows remount;
controlled paths remain authoritative. Existing SideNavigation is untouched.

HM-ADOPT-01 | complete for the documentation sidebar |
`apps/docs/components/CatalogNavigation.tsx`, `docs.module.css`,
`apps/docs/tests/grouped-navigation.spec.ts` and the HierarchicalMenu navigation
scroll hook | working tree based on `98c678d6` | validation below | Chromium-only
integration evidence, no new device/spoken-AT or release approval | A-Z-11.

CatalogNavigation supplies the existing category/slug model to the public
HierarchicalMenu export with a controlled path. Route changes and search results
select the correct category; leaf links retain the existing Next.js host adapter,
native modified-click semantics and current-page markers. Overview, search and
general links remain outside the replaceable category level. The static catalog
has no fetching, pending or error state to migrate; SearchField retains its
existing empty-results behavior. SideNavigation and its tests remain unchanged.

The reusable panel now owns entry motion, path requests and focus recovery,
replacing the sidebar's duplicate implementation. Entering a category focuses its
first destination, following the panel's shipped behavior; the integration test
now asserts that destination instead of the previous host-specific Back focus.
Back returns focus to the opening category. The category heading stays semantic;
Back retains the accessible name “Back to Components” and displays the branch
name using the library's existing contract. Persistent navigation does not dismiss
or unwind on Escape. Searching across categories and browser history still derive
the category from the destination route.

The compact website scope retains its fixed identity and token-based typography.
The public `data-sgui-part="hierarchical-scroll"` navigation hook lets this host
keep overflow visible and omit the nested gutter, so the sidebar owns scrolling.
Bounded standalone panels keep their existing internal scrolling by default.
The component usage guidance documents that host styling hook. No prop contract,
component example state or copied example source changes.

Validation:

- `pnpm build:docs`: fresh library build, docs production build/typecheck, theme
  checks and catalog checks pass (98 pages, 209 public names, 173 isolated owners).
- From `packages/ui`, `node node_modules/vitest/vitest.mjs run
  src/experimental/HierarchicalMenu/HierarchicalMenu.test.tsx`: all seven tests pass.
- From `packages/ui`, `node node_modules/typescript/bin/tsc --noEmit` and
  `node scripts/check-foundations.mjs`: pass.
- `pnpm --filter @structured-growth/docs exec playwright test
  tests/grouped-navigation.spec.ts`: all five Chromium cases pass against the
  fresh production docs build under the shared validation leases. They cover
  first-destination/Back focus, branch activation without routing, all action
  category entries, outer scroll ownership, persistent Escape behavior, direct
  routes, search/history, navigation ordering, hover/focus, narrow/touch layouts
  and doubled text. Root/child screenshots were reviewed. An initial new assertion
  incorrectly used export names for four existing catalog display labels; fixing
  the expected labels produced the five-case pass with no application change.

Local runtime: Node 26.5.0 and repository-pinned pnpm 10.29.3. These are targeted
development results, not supported Node 22/24 or whole-catalog browser acceptance.
Firefox/WebKit integration checks remain for the batch checkpoint under the
development validation policy; existing standalone component evidence retains
its recorded scope.
