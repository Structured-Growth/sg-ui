# Rating

`Rating` is an owned form input exported from the root, primitives and experimental
entries. It uses React Aria radio interaction internally and native radio inputs.
Load `/styles.css` and provide `Provider` or `ThemeScope`.

## Reference research

Reviewed 2026-10-24:

| Reference | SGUI decision |
| --- | --- |
| [W3C rating radio example](https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/) and [radio pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) | A discrete rating is one named answer. Use native radio semantics, one group Tab entry, arrow selection and separate visible keyboard focus. Custom glyphs remain decorative. |
| [Mantine Rating](https://mantine.dev/core/rating/) | Support a repeated custom symbol, per-answer symbols, selectable scale size and cumulative versus selected-only highlighting. |
| [Material UI Rating](https://mui.com/material-ui/react-rating/) | Preserve controlled/uncontrolled, disabled/read-only and hover-preview patterns. Use these as design references without adding MUI or another dependency. Fractional aggregate display remains a separate future contract. |

## Public contract

- Default: five stars and no answer. `max` generates 1 through max; use a positive
  integer. `options` instead supplies an ordered array of unique finite numeric
  values, accessible labels, optional disabled choices and per-answer icon content.
  Zero is a valid explicit answer; `null` is unanswered.
- `variant`: stars, numbers, labels or icons. `icon` supplies a repeated custom
  symbol; `emptyIcon` optionally supplies the unfilled symbol. `options[].icon`
  may contain several non-interactive icons, still representing one answer.
  Labels always name answers; `showOptionLabels` also displays them.
- `highlightMode="cumulative"` fills symbols through the chosen position;
  `"selected"` fills only the chosen answer. Use selected-only for distinct faces
  or grouped icons. Hover previews symbols without committing a value or emitting
  callbacks. Number/label choices default to selected-only highlighting.
- `value`/`onValueChange` are controlled; `defaultValue` initializes uncontrolled
  state. No implicit answer is selected. `clearable` adds a separate clear action;
  it requests null and returns focus to an enabled radio. `clearLabel` overrides
  its translated text. A controlled host may reject a request.
- `name` supplies the native form key. Checked enabled inputs submit numeric
  strings. Native required validation blocks unanswered submission. Uncontrolled
  reset restores defaults without edit callbacks; controlled reset belongs to the
  host. Disabled/read-only prevent changes. Selected-disabled collection handling
  retains an enabled Tab entry and excludes the disabled answer from submission.
- Horizontal/vertical, local density, description/error placement and host-owned
  invalid state follow the form-control contracts. Focus remains distinct from
  the continuous solid selected treatment; forced colors retain system cues.
  The forwarded ref targets the outer rating div containing the radiogroup and
  optional clear action.

A rating selects one answer, even when that answer displays many icons. Use
Checkbox for independent choices. Hosts own label translation, survey branching,
additional validation and persistence. This component does not calculate averages
or render partially filled aggregate stars; use a separately specified display
component or Slider for continuous values.

## Validation scope

Three unit cases cover unanswered/required/clear/reset/native values, controlled
zero/disabled/read-only/fieldset behavior, and independently named multi-icon groups.
Three production-browser cases cover hover versus commit, native survey behavior,
number/label/custom symbols, orientation/density, real RTL interaction, forced-color
focus and copied-source isolation/compilation. This bounded baseline does not claim
manual screen-reader, physical touch or full browser-matrix acceptance.

`highlightAppearance` chooses `icon`, `background`, or `both`. Stars and icons default to icon highlighting; numbers and labels default to background highlighting. Cumulative choices share the same appearance through the selected endpoint. Custom `icon`/`emptyIcon` content can change the symbol itself. Keyboard focus remains separate.

For distinct severity icons, supply `variant="icons"`, labeled `options` and `highlightMode="selected"`. Rating submits one numeric native radio answer, supports required validation and reset, and exposes an unanswered state. ToggleButtonGroup uses pressed buttons and string IDs, permits multiple selection, and leaves form serialization to the host; staggered layout only changes placement.

`layout="staggered"` alternates equal-width answers across two rows with a 75% advance and 25% overlap (horizontal) or columns (vertical). DOM, numeric value and keyboard order remain the ordered scale; horizontal arrows or vertical arrows advance sequentially. Labels wrap within the available width; each answer retains the density target size. Use inline layout or more space when the minimum targets cannot fit.

Options use `buttonWidth="equal"` by default in either orientation; `"content"` sizes inline answers individually. Staggered layout always uses equal widths. Like ToggleButtonGroup, Rating supports orientation, density, disabled choices, icons, labels and staggered placement. It retains single numeric selection and native form semantics. Use `icon="👍" emptyIcon="-"` for a scale that changes dashes to thumbs on hover and selection.

`showOptionValues` displays each numeric answer; `optionLayout="stacked"` puts its number above its icon and optional label. An explicit `options[].icon: null` suppresses the symbol while keeping that numeric answer selectable. The pain example supplies all 0–10 values with symbols only at even values; every answer retains its full accessible label.


`options[].annotation` provides non-interactive content above the choice, outside its selected background. Give its meaning in the accessible option label. The pain examples use numeric buttons from 0–10 and annotations only on even answers, in both horizontal inline and staggered layouts.

Annotations share a single band above horizontal choices or a trailing column beside vertical choices. Each stays aligned to its answer; annotation space is outside staggered option rows/columns so their gaps remain compact.

`appearance="plain"` removes answer surfaces and visible borders while retaining their full density target size and keyboard focus outline. It applies to stars and custom symbols independently of `highlightAppearance`; plain answers use icon/text highlighting rather than filled button surfaces. Outlined remains the default.

`scaleLabels={{start, middle, end}}` supplies an independent, evenly distributed band above the scale. It describes the group accessibly and does not size individual answers; use per-option labels for each radio name. `choiceShape="circle"` keeps number choices square with circular borders and full density targets. The horizontal inline anchor example distributes answers across the band; a narrow host can scroll the band and choices together.

Independent scale labels and their choices fit their contents instead of expanding to the host width. Number choices retain a shared spacing-token gap; label anchors retain a separate larger minimum gap. Wider labels can expand the shared band, and narrow hosts scroll it intact.

Scale anchors follow orientation: horizontal anchors run across the top; vertical anchors run down a separate trailing column with endpoint anchors centered on the first and last control rows, and the middle anchor halfway between. They share the choice stack height and do not create spaces between individual answers.

Horizontal staggered choices share the full intrinsic width of the scale-label band. When label spacing determines that width, grid positions spread across it too; circular controls retain their target size and stay centered in their option tracks.
