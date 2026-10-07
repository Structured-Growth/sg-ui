# Batch 75: inventory contract intent

Read-only criterion review, 2026-10-07. Exact assigned and inspected baseline:
`39c2275b0f7a873a48eceb1c663ab0bd0016a7e7`.
Managed isolated worktree:
`/Users/thomashall/.codex/worktrees/batch75-inventory-contract-intent/sg-ui`.
Only this report is writable. Coordinator alone integrates and changes canonical
acceptance/master/state records. No source, contract, checkbox or acceptance changed.

**Proposed disposition: retain HOLD for M-10, M-14 and M-30 until the disputed
intent is explicitly resolved and remaining row evidence is reviewed.** The
master descriptions differ from preserved APIs; that is not authorization to
discard approved requirements. The earlier [contract reconciliation](../react-aria-inventory-contract-reconciliation.md)
already records this decision boundary. Neither it nor the newer evidence below
records an owner decision. This report proposes exact wording, not new APIs or
acceptance waivers.

## Source and history

Inspected [master rows](../react-aria-master-task-list.md),
[canonical acceptance](../react-aria-migration-inventory-acceptance.md), README,
migration and component architecture guidance, the three current implementations,
colocated tests, contracts and relevant prior reports. Independently read all
three original component files with `git show` at repository baseline
`21adebd61bedfc6a1ed395fe664ff4be83896821` (identified by the
[baseline inventory](../migration-baseline/inventory.json)). They already expose
the same authoring callbacks, instructor presentation fields and eight style
callbacks. No previous/next/href navigator, instructor menu/persistence/date
parser/dynamic icon API or text-style typeface API was present there.

Path history identifies owned implementation migrations `8f41479` (navigator),
`51734ed` (cards), and `615b978` (editor menus). Current contracts preserve these
component responsibilities while adding owned interaction/style behavior. This
history supports a wording mismatch; it does not prove what the master author
intended. The learner-platform extraction is provenance only; no external source
or host application was modified or used as a runtime dependency.

## M-10 ExperiencePageNavigator

Original: `Previous/next boundaries, labels, disabled states, link/action semantics`.

The [current source](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx)
and [page navigation contract](../react-aria-page-navigation.md) define a controlled
authoring list: `pages`, `activePageKey`, `onSelectPage`, `onAddPage`,
`onRemovePage`, `onRenamePage`, `onReorderPages`, optional title/readOnly and
native class/style. Selection is a button with `aria-current="page"`; its action
trigger is separate. Move up/down requests adjacent **reordering**, not adjacent
navigation. First/last Move limits and last-page removal protection therefore
cannot satisfy a literal previous/next navigation requirement. No href/route
model exists. Read-only permits selection and prevents mutation/drag.

[Unit/SSR coverage](../../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.test.tsx)
includes separated actions, trimmed rename/cancel/focus, Move boundaries,
invalid/self/read-only drag, final-page protection and live host removal/read-only.
The contract records independent list scrolling and remaining full native gates.
This review adds no execution or claim about ongoing batch72 work.

Owner decision required: confirm this row means the preserved authoring list and
explicitly dispose of previous/next/link wording, or retain those clauses as
specified additional navigation work. A new requirement must state its component,
host contract, boundaries and evidence; do not infer it from Move commands.
Even after a wording decision, the baseline acceptance record still lacks complete
native drag/focus evidence. The coordinator must review any later scoped proof
before accepting the row.

## M-14 InstructorClassCard

Original: `Status/menu/actions, callbacks, long text, date and icon fallbacks`.

The [current source](../../../src/components/InstructorClassCard/InstructorClassCard.tsx)
and [card contract](../react-aria-card-frames.md) accept required course/site strings,
four status values, learnerCount, lastLearnerActivityLabel, actionLabel and
actionHref. One footer Link requests navigation through the host adapter. No
card menu, persistence callback, date input/parser/locale or optional image/icon
input exists. The master says “callbacks,” not “persistence”: the latter is an
interpretation in prior audit wording, not a separately established requirement.
The existing host navigation callback can account for routing callbacks if the
owner confirms that interpretation; it cannot prove menu or save operations.

Status labels/tone markers cover active/draft/closed/archived; archived omits
learner/activity metadata. Six known Class/Section action aliases translate;
custom labels pass through. Host activity strings pass through except known
Recent/No recent activity mappings. Fixed AutoStories/CalendarToday icons are
decorative; the Avatar supplies fixed HE fallback with empty alt. There is no
missing remote image or unknown-status contract to test by inventing props.

[Batch66](../parallel-batch-66/instructor-card-native-presentation.md) supersedes
the earlier reconciliation's three-test count: the baseline now contains 21 tests
for all statuses/aliases, translations, zero learners, blank/literal Invalid Date
and host fallback labels, host Intl across locales, icons/avatar, routing and SSR.
Its three recorded Chromium cases cover narrow/enlarged-text light/dark host
composition, actual keyboard routing, retained link focus/identity/hit/containment,
status changes and host date/fallback replacement. This is attributed wave30
evidence at `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b`, not new execution here.
The report explicitly leaves Firefox/WebKit pending. Host fallback examples do
not establish library date parsing or asset failure handling.

Owner decision required: assign “menu” and “date and icon fallbacks” to their
actual intended scenarios, and confirm callbacks mean host routing or retain
specified extra behavior. If existing presentation scope is approved, remaining
concrete checkpoint is supported-engine evidence review for batch66; complete
row acceptance cannot follow from its Chromium result alone. No product defect
is demonstrated by an absent unapproved API.

## M-30 TextStyleMenuControl

Original: `Style/typeface options, tokenized labels, selection and focus behavior`.

The [current source](../../../src/components/TextStyleMenuControl/TextStyleMenuControl.tsx)
and [menu contract](../react-aria-editor-menus.md#textstylemenucontrol-m-30) expose
lowercase/uppercase/capitalize/strikethrough/subscript/superscript/highlight and
Clear Formatting callbacks. Seven TextStyleIds are checked through controlled
activeStyles; Clear is an ordinary command. Missing callbacks disable commands;
disabled locks the trigger. Labels translate with fallbacks, case samples use
shared typography tokens, and displayed shortcuts do not register global commands.
Document formatting and selection restoration remain host-owned.

Typeface and heading selection are concretely implemented by
[RichTextFormattingToolbar](../../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.impl.tsx)
via fontFamilyValue/onFontFamilyChange/showFontFamilySelector and
headingValue/onHeadingChange. This is M-26 responsibility, not M-35's typography
catalog and not evidence of a typeface API in M-30.

[Batch64](../parallel-batch-64/style-menu-native-selection.md) supersedes the
earlier reconciliation's five-test count: seven tests cover all callbacks,
controlled checked state, translations, disabled skipping/Escape restoration,
live callback/state replacement and availability. Three recorded wave30 Chromium
cases exercise real keyboard DOM selection with all style commands, accepted and
rejected controlled updates, host range restoration, Clear availability and Escape.
The example is a bounded single-line contenteditable adapter; it does not certify
the complete Lexical mixed-selection/history matrix. Firefox/WebKit remain
pending in that record; no rerun or artifact re-verification occurred here.

Owner decision required: explicitly attribute typeface/heading acceptance to
M-26 without removing its obligations, or retain a specified additional M-30
chooser requirement. Under the preserved menu scope, remaining row checkpoint
is supported-engine style/selection/focus evidence review. Broader Lexical E/M-26
acceptance remains separate and must not be claimed by this menu fixture.

## Exact proposed master rows

Conditional on a recorded owner disposition of each original disputed clause:

| ID | Component | Proposed acceptance criteria |
| --- | --- | --- |
| M-10 | ExperiencePageNavigator | Controlled authoring page list; separate page selection and actions; translated labels; add/rename/remove and read-only/last-page boundaries; keyboard Move up/down and validated drag reorder; native rename/removal focus and independent list scrolling. |
| M-14 | InstructorClassCard | Four translated status labels and archived metadata branch; host action-link routing with known/custom labels; long course/site text and host-formatted activity/date labels, including host missing/invalid fallback presentation; fixed decorative icons and HE avatar fallback; native route focus and responsive reflow. |
| M-30 | TextStyleMenuControl | Eight host style commands; unavailable/disabled actions and controlled checked styles; translated labels and tokenized case samples; native menu keyboard/focus behavior and host selection handoff. Typeface/heading chooser criteria remain with M-26. |

Record original-clause dispositions beside any canonical edit: M-10 previous/next
and link intent; M-14 menu, callback attribution and exact date/icon fallback
scenarios; M-30 typeface attribution. If the owner retains additional behavior,
keep it visibly unmet and specify separate implementation/acceptance work rather
than adopting these narrower rows. No owner decision was inferred from migration
completion or report delegation.

[Batch60](../parallel-batch-60/page-navigation-evidence.md) concerns M-04/M-05,
not M-10. Its accepted header/tab evidence cannot transfer to the authoring
navigator. Its useful precedent is bounded row acceptance after exact criteria
are evidenced, with physical-device, browser zoom, spoken AT and broader
U/X/R/Z/production gates kept separate. Those broader gates remain open here;
they are not the sole reason for these three holds. The unresolved intent and
specific native evidence limits above are the row reasons.

## Documentation validation

Verified this report's relative Markdown paths and explicit fragment, exact
baseline/history identifiers, source API names and prior report scope/counts.
`git diff --check` passed; changed-path allowlist contains only this report.
No install, test, build, Storybook/native process, CI dispatch, GitHub write,
main integration, publishing, credential or workflow-permission action occurred.
Final commit and clean worktree status are sent to the authorized coordinator.
