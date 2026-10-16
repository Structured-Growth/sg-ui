# Screen-reader operator runbook — A-X-11

Status: unrun. No spoken output or operator observation was available in this conversation. Do not mark A-X-11 complete from this protocol, accessibility tree, DOM assertions, axe, or the native grid spec.

## Setup and record

Coordinator supplies an immutable private fixture host and confirms the six IDs below exist in its `/fixtures/index.json`. `input-evidence.json` records current source hashes and registry entries; all six fixture sources still match the prior worksheet. Build identity must also be recorded at execution. Do not use the user's server3000 or rebuild shared output. Start from a fresh browser profile with no private account data. Fixtures own in-memory state and need no authentication/database. Append `&embed=true` to suppress autoplay; reload between scenarios.

Use an actual installed screen reader. A practical first pairing is the operator's macOS VoiceOver with Safari; NVDA with Firefox/Chrome is a separate useful Windows pairing. These are proposed execution pairings, not tested support certifications. Record OS/build, actual browser version, AT version, keyboard layout, speech language/verbosity, interaction/browse mode and quick-navigation setting. Record operator identity, UTC timestamp, source manifest hash, host manifest hash, URL and viewport. No prescribed exact speech string follows from a role/name attribute.

Operator uses their familiar AT commands to navigate/read and records every command actually used. For ordinary browser navigation use Tab/Shift+Tab, Enter/Space, arrows and Escape as indicated; turn off AT quick navigation or switch interaction mode when sending application arrow keys, recording the mode change. Do not emulate the screen reader with JavaScript or inject focus. Capture actual speech verbatim or a clearly labeled operator paraphrase, preferably with a consented local recording/transcript reference and time offset. Store no personal profile data.

For each step record: expected semantic information; observed speech; active control/focus position before/after; pass/fail/blocked; severity; recording reference; defect/follow-up. Empty speech fields remain unrun. Expected semantics below are prompts to assess, not fabricated observations. A missing name, lost focus, duplicate/late announcement, stuck mode or inaccessible action is a finding even if the DOM is valid.

## Dialogs

`/fixtures/?id=migration-proofs-dialog--nested-form&embed=true`

1. Tab to **Create course**, activate. Expect dialog name **Create course**, description **Review the settings before saving**, and meaningful initial **Course name** focus. Read required state. Record actual name/role/description order and whether repeated.
2. Tab through **Category**, **Naming help**, tabs and footer; Shift+Tab back. Open Category; arrow through Science/Mathematics and disabled Archived, then Escape. Expect selector dismissal first with parent dialog remaining, focus returning to Category.
3. Open Naming help, read guidance/private note; Escape returns to its trigger, parent remains. Exercise Access then Details tab; disabled Unavailable must remain unavailable. Save an empty name and record whether error **Enter a course name.** is discoverable/announced. Record native validation behavior if it intercepts submission instead.
4. Enter a course name; cancel with Escape. Expect dialog closes and focus returns to Create course. Reopen and save a valid value; distinguish host close from persistence (no backend). Check keyboard cannot enter inert background while open.

## Selectors

`/fixtures/?id=migration-proofs-select--independent&embed=true`

1. Reach **First status**, initially Draft. Open with keyboard, move past unavailable option to Active and select. Expect label, expanded/collapsed state, option name/selection/availability and value change. Record spoken option position if provided; do not require one universal wording.
2. Reach **Second status**, initially Draft; change to Active, reopen and Escape without selecting. Expect retained committed value and focus. Confirm First status remains unchanged when editing Second status. Report any loss of label/context or redundant announcement.

## Calendars

`/fixtures/?id=migration-proofs-daterangeselector--availability&embed=true`

1. Locate **Booking dates**, open calendar using its actual named trigger, record segmented start/end labels and current values. Navigate February 2024 with arrow keys in interaction mode. Compare focused date and selected endpoint speech.
2. Explore February 15, unavailable for **No remaining capacity**. Record how its date, unavailable state and reason can be discovered; if keyboard skips the cell, use AT reading navigation and record that distinction. Attempt a range crossing it; record validation and whether Apply becomes unavailable/blocked. Do not invent a specific error sentence.
3. Select **Early February** preset and Apply using actual labels present in the build; record endpoint information and committed civil dates. Reopen, edit a draft and Cancel/Escape; verify old committed range, trigger focus and no stale draft announcement. Contrast with February reporting period spanning unavailable date.

## Navigation

`/fixtures/?id=navigation-sidenavigation--native-hierarchy&embed=true`

1. Find **Course workspace navigation** region and Overview current link. Read its current-page context.
2. Expand Courses; navigate Active courses. Expect expanded state and updated current route context. Fixture simulates routing locally; no network navigation is required.
3. Activate Settings drilldown and People; use the named Back control. Record Back name, keyboard sequence, returned focus and current page indication. Ensure navigation items are conveyed as links/buttons as appropriate, not application menus. Exercise Shift+Tab to leave region.

## Tables and interactive grids

`/fixtures/?id=migration-proofs-catalog-grid-interaction--focus-retention&embed=true`

1. Tab from **Host action** into **Focus courses**. Record actual entry control; no programmatic cell focus. Read grid role and row/column/header context. Compare **Independent focus courses** and ensure region names distinguish them. Plain semantic Table requires a separate reading sample before asserting both contracts.
2. Navigate cells using arrows; reach **Inspect Course 1** / **Review Course 1**, activate one. Record action name, response and selection independence. Toggle a row checkbox and record state/context. Tab out and Shift+Tab back; record exact entry/exit path.
3. From a body control send fixture Alt+R to retain rows during refresh (if OS/AT intercepts, record blocked and use coordinator alternative rather than dispatching DOM events). Record busy/status speech and retained focus. Hide Score with Alt+H and delete focused row with Alt+D; note fallback focus. Alt+E empties first grid; preserve second grid focus when testing that independently. These shortcuts are fixture host operations, not public grid shortcuts.
4. Optional busy-lifecycle fixture for error/retry speech must be recorded as a separate identified scenario; this focus fixture alone cannot certify error/Retry announcements.

## Editors

`/fixtures/?id=editors-pagerichtexteditorsection--full-tools&embed=true`

1. Read the editor's accessible name/role/multiline/editable state. If unnamed, record finding; do not supply an assumed label from source. Read initial content. Tab/AT-navigate into and out of toolbar and editor, recording mode transitions.
2. Type a distinctive local phrase, select it with keyboard, apply Bold using actual toolbar control. Record pressed state and whether editing selection survives toolbar navigation; read phrase again. Undo/redo, record content and focus.
3. Open a link dialog from the toolbar, inspect label/value/error behavior, cancel and verify editor selection/focus. If this fixture lacks a required tool, record blocked and identify the exact alternate fixture before proceeding. Do not infer upload or persistence behavior from controls alone. Existing 20 editor V owners remain separate.

## Finish

Keep all findings and blocked operations. A complete six-category transcript is a bounded review of the recorded pairing/build only. Coordinator assigns concrete fixes, runs their affected regressions, and reviews speech again where changed. No all-platform conformance claim follows from one pairing. Fill `operator-observations.template.json` with actual observations; leave the supplied template unrun.
