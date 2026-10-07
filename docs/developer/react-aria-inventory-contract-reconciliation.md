# Inventory contract wording reconciliation

Bounded W-19 / M-10 / M-14 / M-30 evidence, 2026-10-07. Inspected current
baseline `e372781c2b1ceca630cda6fc7a989af2d6c05c33`, with a clean isolated
worktree before edits. This supplements the [37-row inventory audit](react-aria-migration-inventory-acceptance.md)
and [its report](parallel-batch-05/inventory-evidence.md); it does not repeat that
audit, rescore its six recommended rows, or edit/close the [master rows](react-aria-master-task-list.md).
All three rows remain held pending intent decisions and complete acceptance.
Native/manual/device/assistive-technology and broad G/K/E/U/X/R/Z gates stay open.

## Evidence and decision boundary

The master wording is demonstrably different from the preserved public contracts.
That proves a documentation mismatch, not that user-approved target behavior may
be discarded. The coordinator must obtain/record the product/API owner's decision
before replacing criteria. No inspected artifact establishes whether the disputed
phrases were shorthand, mistaken component attribution, or intended new features.
No new APIs or implementation are proposed as if already approved.

Current source, colocated tests and contract guides below are primary evidence.
Historical source at repository baseline `21adebd61bedfc6a1ed395fe664ff4be83896821`
was read with `git show`: it already has the same authoring-page callbacks,
instructor-card presentation fields and eight text-style callbacks. The
[baseline inventory](migration-baseline/inventory.json) identifies that commit;
[extraction provenance](../migration.md#source-architecture-and-disposition) and
the [manifest](../extraction-manifest.json) identify learner-platform commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`. Provenance is not a runtime dependency
or evidence of approval to expand or remove behavior. Public types are reexported
through their component indexes and the [component barrel](../../src/components/index.ts),
with subpaths declared in [package exports](../../package.json).

## M-10: authoring page list

Master criterion: `Previous/next boundaries, labels, disabled states, link/action semantics`.
The [source](../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx),
[public index](../../src/components/ExperiencePageNavigator/index.ts) and
[contract](react-aria-page-navigation.md) expose this exact API:

```ts
type ExperiencePageNavigatorItem = { key: string; title: string };
type ExperiencePageNavigatorProps = {
  pages: ExperiencePageNavigatorItem[];
  activePageKey: string | null;
  onSelectPage: (pageKey: string) => void;
  onAddPage: () => void;
  onRemovePage: (pageKey: string) => void;
  onRenamePage: (pageKey: string, title: string) => void;
  onReorderPages: (sourceKey: string, targetKey: string) => void;
  title?: string;
  readOnly?: boolean;
  className?: string;
  style?: CSSProperties;
};
```

`CSSProperties` is React's native style type. Selection uses buttons and
`aria-current="page"`; action triggers are separate. There are no previous/next
navigation or href/route props. Move up/down are adjacent reorder requests, not
navigation. Hosts own selected page, order and persistence.

| Original criterion | Current mapping and unresolved requirement |
| --- | --- |
| Previous/next boundaries | First/last Move up/down and last-page removal guards exist. They cannot count as proof of previous/next navigation. Owner must decide whether navigation remains required. |
| Labels | Host page/title text; translated Pages/Add/position/active/action/rename/remove/Move labels with English fallbacks. |
| Disabled states | Read-only blocks mutations/drag while allowing selection; boundary Move commands and final-page removal are disabled. |
| Link/action semantics | Selection/action button separation and host callbacks are proven; route/link behavior is absent and requires explicit attribution or new scope. |

Existing [DOM tests](../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.test.tsx)
cover single selection/add, trimmed Enter rename, dismissal/focus, blank/unchanged
names, keyboard reorder boundaries, invalid/self/read-only drag, last-page removal,
host removal during rename, adjacent removal focus and live read-only changes.
[SSR test](../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.ssr.test.tsx)
and [stories](../../src/components/ExperiencePageNavigator/ExperiencePageNavigator.stories.tsx)
cover server rendering and host composition. The [page-navigation execution record](react-aria-progress.md#page-actions-and-navigation)
records representative native rename/reorder/removal focus and independent list
scrolling, plus packed React 18/19 checks. These are historical passes at their
reported implementation/runtime, not a fresh test of this baseline. Complete
native drag/focus, narrow/enlarged text, physical touch and spoken AT remain open.

Owner decision: confirm authoring-list scope and explicitly dispose of the
previous/next/link clauses, or retain them as a separate approved navigation
requirement. Bounded alternatives: (A) revise wording only with that recorded
decision; (B) specify host-controlled adjacent selection using the existing
`onSelectPage` contract, including boundaries/read-only policy; (C) specify a
separate route/link navigation contract and its adapter/accessibility tests.
B/C require API/design review and implementation evidence before acceptance.

## M-14: instructor course presentation card

Master criterion: `Status/menu/actions, callbacks, long text, date and icon fallbacks`.
The [source](../../src/components/InstructorClassCard/InstructorClassCard.tsx),
[public index](../../src/components/InstructorClassCard/index.ts) and
[card contract](react-aria-card-frames.md) expose:

```ts
type InstructorClassCardStatus = "active" | "draft" | "closed" | "archived";
type InstructorClassCardProps = {
  className: string;
  siteName: string;
  status: InstructorClassCardStatus;
  learnerCount: number;
  lastLearnerActivityLabel: string;
  actionLabel: string;
  actionHref: string;
};
```

`className` is the displayed course name. All fields are required. One footer
Link uses `actionHref` and host navigation; no menu, card action callback, date
input, locale, date formatter, image URL or configurable icon exists. Metadata
icons are fixed decorative AutoStories/CalendarToday; Avatar has fixed `HE`
fallback and empty alt. The host supplies any formatted activity/date label.

| Original criterion | Current mapping and unresolved requirement |
| --- | --- |
| Status | Four translated labels/token tones; archived omits learner/activity metadata. No unknown-status fallback is declared. |
| Menu/actions, callbacks | One action link and navigation adapter; known Open/Set Up/View Class or Section labels map to translated Section labels, custom labels pass through. Menu/persistence callbacks are absent, not verified. |
| Long text | Owned heading wrap; historical native 260px long-name evidence is representative, not a complete content matrix. |
| Date fallbacks | Host activity string passes through except translated Recent activity/No recent activity. No library date parsing/fallback contract; blank/invalid host content policy is unresolved. |
| Icon fallbacks | Fixed decorative icons and fixed Avatar fallback; no missing-image/dynamic-icon API. Required fallback scenarios must be identified, not inferred from markup. |

Existing [three tests](../../src/components/InstructorClassCard/InstructorClassCard.test.tsx)
cover keyboard routing, active metadata, archived omission, closed/custom activity
and action text, draft label mapping, namespace/interpolation and SSR. They do
not establish exhaustive empty/malformed/date/icon fallback acceptance.
[Stories](../../src/components/InstructorClassCard/InstructorClassCard.stories.tsx)
and the [card execution record](react-aria-progress.md#card-pagination-and-course-cards)
record narrow long-name wrapping and dark token rendering. Those historical
checks do not close native navigation/reflow, device or AT acceptance.

Owner decision: confirm presentation-only scope and explicitly assign menu,
callbacks, date/icon fallback criteria, or require new card behavior. Bounded
alternatives: (A) keep host-formatted text/action link and define evidence for
empty labels, long text and fixed decorative/fallback presentation; (B) add a
separately approved host-owned menu/action contract with disabled/focus/routing
tests; (C) define approved optional date/avatar/icon presentation inputs and
explicit invalid/missing policy. B/C are new implementation tasks; no fetching,
persistence or application contracts belong in the card.

## M-30: text-style commands and M-26 ownership

Master criterion: `Style/typeface options, tokenized labels, selection and focus behavior`.
The [source](../../src/components/TextStyleMenuControl/TextStyleMenuControl.tsx),
[public index](../../src/components/TextStyleMenuControl/index.ts) and
[menu contract](react-aria-editor-menus.md#textstylemenucontrol-m-30) expose:

```ts
type TextStyleId = "lowercase" | "uppercase" | "capitalize" | "strikethrough"
  | "subscript" | "superscript" | "highlight";
type TextStyleMenuControlProps = {
  onLowercase?: () => void;
  onUppercase?: () => void;
  onCapitalize?: () => void;
  onStrikethrough?: () => void;
  onSubscript?: () => void;
  onSuperscript?: () => void;
  onHighlight?: () => void;
  onClearFormatting?: () => void;
  activeStyles?: readonly TextStyleId[];
  disabled?: boolean;
};
```

Clear is a separate command, not a `TextStyleId`. Missing callbacks disable
commands; optional activeStyles marks host-controlled checked choices. This
menu neither selects fonts nor owns Lexical state/selection.

The [M-26 implementation](../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.impl.tsx)
and [toolbar contract](react-aria-formatting-toolbar.md#retained-host-contract)
own `fontFamilyValue?: string`, `onFontFamilyChange?: (value: string) => void`,
`showFontFamilySelector?: boolean`, `headingValue?: RichTextHeadingValue` and
`onHeadingChange?: (value: RichTextHeadingValue) => void`. Font choices are Arial,
Georgia and Times New Roman; heading choices are Normal, Heading 1–6 and Body Alt
1–3. M-26 forwards `activeTextStyles?: readonly TextStyleId[]` and its
`onTextStyleLowercase`, `onTextStyleUppercase`, `onTextStyleCapitalize`,
`onTextStyleStrikethrough`, `onTextStyleSubscript`, `onTextStyleSuperscript`,
`onTextStyleHighlight` and `onTextStyleClearFormatting`
optional event-free callbacks to M-30. M-35 Typefaces is the typography story
catalog, not a font-selector runtime API.

| Original criterion | Current mapping and unresolved requirement |
| --- | --- |
| Style/typeface options | Seven style IDs plus Clear belong to M-30. Font/heading chooser behavior exists in M-26; owner must approve attribution, or specify additional M-30 typeface behavior. |
| Tokenized labels | Translated menu labels/fallbacks and owned tokens for case samples/icons; shortcuts are informational. |
| Selection | Optional host-controlled checked styles; host owns document formatting and selection restoration. No typeface selection in M-30. |
| Focus | Keyboard unavailable-item skipping and trigger restoration; composed editor selection/focus remains broader M-26/E acceptance. |

Existing [five menu tests](../../src/components/TextStyleMenuControl/TextStyleMenuControl.test.tsx)
cover all eight callbacks once, disabled activation, keyboard skipping/focus,
controlled checked state, ordinary Clear and translated scoped dark portal.
[Menu stories](../../src/components/TextStyleMenuControl/TextStyleMenuControl.stories.tsx)
and the [menu execution record](react-aria-progress.md#editor-menu-controls)
record packed/native keyboard checks. [Toolbar tests](../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx)
cover single controlled heading/font requests and callback-after-keydown focus
timing; the [toolbar execution record](react-aria-progress.md#rich-text-formatting-toolbar)
records representative native Georgia/H2 selection preserving editor text.
These do not prove a complete Lexical mixed-selection/history/formatting matrix,
native/device/AT focus acceptance, or typeface behavior in M-30.

Owner decision: attribute existing typeface/heading evidence to M-26 while
retaining its acceptance obligations, or require a new M-30 typeface contract.
Bounded alternatives: (A) wording-only clarification with an explicit M-26
dependency; (B) approve a separate chooser composition/reuse contract and its
controlled state, selection restoration and native tests. Do not duplicate font
state or count the M-35 catalog as chooser acceptance.

## Exact proposed master wording for coordinator review

These replacement rows are proposals, conditional on the decisions above. Record
the disposition of every original disputed criterion beside any accepted edit;
do not silently delete requirements or mark rows complete. No master file was
edited in this task.

| ID | Component | Proposed acceptance criteria |
| --- | --- | --- |
| M-10 | ExperiencePageNavigator | Controlled authoring page list; separate selection/actions; add/rename/remove and read-only/last-page boundaries; keyboard Move up/down and validated drag reorder; translated labels and native focus/scroll behavior. Resolve original previous/next/link intent explicitly before acceptance. |
| M-14 | InstructorClassCard | Four status labels and archived metadata branch; host action-link routing and known/custom label mappings; long text and host activity-label presentation; fixed decorative icons/avatar fallback. Resolve original menu/callback/date/icon fallback intent and required scenarios explicitly before acceptance. |
| M-30 | TextStyleMenuControl | Eight host style commands, unavailable/disabled actions, controlled checked styles, translated tokenized labels and native menu/editor focus behavior; typeface/heading chooser acceptance remains with M-26. Resolve any additional M-30 typeface intent explicitly before acceptance. |

Next bounded task: coordinator records the three owner dispositions, then assigns
one narrowly scoped missing-evidence or implementation task per confirmed
requirement. A wording decision alone cannot close these held rows. Validation
of this documentation follows [the development policy](react-aria-development-validation.md);
execution details are in [the batch report](parallel-batch-09/inventory-contract-wording.md).
