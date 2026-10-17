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
Adopting the component in the current menu is a separate follow-up.

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

This plan is separate from historical F/T/V counts. Follow the
[master execution policy](react-aria-master-task-list.md) and
[current shell contracts](react-aria-modal-shells.md).

- [x] HM-SCOPE-01 Inspect the reference sliding drilldown/Back pattern, reconcile
  existing SGUI support and record the standalone component boundary here.
- [x] HM-F-01 Finalize the owned panel model, controlled/local path contract,
  per-level content options and navigation-versus-command host composition.
- [x] HM-F-02 Extract reusable drilldown/Back rendering and transitions; preserve
  SideNavigation's public model, routing behavior and existing assertions.
- [x] HM-F-03 Add a public prop playground and independent source-backed examples:
  three levels with Back, different sibling configurations, mixed inline/drilldown
  navigation and compact/comfortable references. Update usage, catalog exports
  and composition metadata; validate snippets against built public types.
- [x] HM-F-04 Establish the primary entry/Back/action flows using existing coverage
  and only 1–3 meaningful added/adapted smoke cases per affected component in total.
  Use a focused browser check to verify how motion, Back and scrolling appear.
- [ ] HM-T-01 Cover deeper path/model changes, controlled ownership and independent
  panel instances after functionality.
- [ ] HM-V-01 Validate direction, reduced motion, text enlargement, narrow hosts,
  focus and forced colors; retain explicit device/assistive-technology limits.
- [ ] HM-ADOPT-01 Apply the component to the current menu in a follow-up, preserving
  host adapters and pending/error behavior.

HM-SCOPE-01 evidence: inspected the local reference SideNavigation source/stories
and linked SGUI source/tests; verified document links and diff whitespace.
HM-F-01–04 are complete: public build/catalog/source-copy checks pass; three
strengthened units and nine native cases pass. Coordinator screenshot review
found and corrected narrow Back-label wrapping; final geometry/captures pass
across all three engines. Broader HM-T/HM-V and adoption retain their own scope.


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
controlled paths remain authoritative. Existing SideNavigation is untouched;
HM-ADOPT-01 remains separate.
