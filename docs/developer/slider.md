# Slider

`Slider` is exported from the public root, primitives and experimental entries.
Its owned generic props infer a scalar or number-array callback from `value` or
`defaultValue`. Load `/styles.css` and provide `Provider` or `ThemeScope`.

## Reference research and decisions

Reviewed 2026-10-24:

| Reference | SGUI decision |
| --- | --- |
| [W3C slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) | Named native range inputs; arrows, Home/End and larger Page increments; orientation and formatted accessible values. |
| [W3C multi-thumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/) | Independently named thumbs, stable tab order, dependent limits and non-crossing ranges. Preserve real-device/AT verification as a separate obligation. |
| [React Aria Slider](https://react-aria.adobe.com/Slider) | Reuse the installed internal interaction implementation for dragging, track clicks, keyboard, locale/RTL, formatting and filled intervals. Expose owned props only. |
| [Radix slider](https://www.radix-ui.com/primitives/docs/components/slider) | Separate continuous change from committed interaction. Multiple thumbs are useful; minimum-gap and push/cross behavior would need an explicit owned contract and remain future work. |
| [Carbon slider guidance](https://www.carbondesignsystem.com/building-blocks/core/components/slider/guidelines) | Keep a visible label/output; show a composition with exact text entry. Parsing and draft text belong to the host rather than coupling every slider to a second input. |

## Shipped contract

- A scalar creates one thumb; an ascending numeric array creates multiple thumbs.
  Thumbs may meet but cannot cross. Use meaningful `thumbLabels`; translated
  Minimum/Maximum or numbered labels are fallbacks for multiple thumbs.
- Scale defaults: `min=0`, `max=100`, `step=1`. Supply finite values, `min < max`
  and positive `step`. Steps start at min; keep host values on that scale.
- Controlled `value`/`onValueChange` and uncontrolled `defaultValue` are supported.
  `onValueCommit` runs after a pointer or keyboard adjustment finishes. It is an
  interaction callback, not persistence or validation.
- Horizontal/vertical, local density, disabled, host invalid/error/description,
  shared message placement, current output, optional endpoints and sparse marks.
  Marks are descriptive only; step determines snapping. `fillOffset` changes a
  single thumb's auto-filled origin, for example zero in a negative/positive scale.
- `formatOptions` uses Intl number formatting for output and accessible values.
  Percent scales use fractions (0–1, step .01); currency remains raw numeric data.
- `name` submits a scalar; arrays submit `name[0]`, `name[1]`, etc. `thumbNames`
  overrides those names. Disabled native fields do not submit. Uncontrolled reset
  restores defaults without edit callbacks; controlled reset remains host-owned.
- The forwarded ref targets the group div. Focus its native range inputs when
  programmatic thumb focus is needed.

The host owns exact-entry parsing, validation/submission gating, loading, requests,
commit debouncing, and durable storage. A slider always has a numeric value. Track
survey participation separately when an unanswered state is required; use named
radio options for a few discrete answers or text entry when exact values dominate.

## Validation scope

Three colocated smoke cases cover scalar step/commit/forms/reset, range constraints
and controlled authority, and disabled/fieldset/validation associations. Production
docs browser checks cover real pointer/keyboard/geometry, vertical and RTL layout,
form reset and source examples. These are a bounded baseline, not a claim of manual
screen-reader, physical touch or complete cross-browser acceptance.

Potential later features: explicit minimum thumb gap, pushable/crossing thumbs,
nonlinear scales, draggable intervals, thumb tooltips and a separately owned numeric
field primitive. No new dependency or compatibility surface is introduced.

## Handle count and fill presentation

The value shape is the source of truth for handle count: a scalar gives one handle,
and an array such as `[20, 50, 80]` gives three. There is no separate count prop that
could conflict with controlled values. The docs Handles selector creates one through
five appropriately stepped starting values; consumers can supply longer arrays.

`fill` defaults to `auto` and follows numeric minimum/maximum, including vertical
and RTL layouts:

| Mode | Painted interval |
| --- | --- |
| auto | Minimum (or single-thumb fillOffset) to a scalar; first to last for arrays |
| before | Minimum to first handle |
| after | Last handle to maximum |
| between | First to last handle; no fill when there is only one handle |
| none | No filled interval; the neutral rail and all handles remain visible |

These modes only change paint. Handle constraints, native data, names, keyboard and
pointer behavior stay the same. `fillOffset` applies only to single-thumb auto fill.

## Bounds, precision and formatted display

`min` and `max` define the numeric domain independently of formatting. Use 0–10,
0–100, a negative range, or another finite domain. `step` defines selectable
increments: 1 for whole numbers, .1 for tenths, .01 for cents. There is no separate
continuous/decimal flag: even fine pointer dragging snaps to the positive step.
Display precision does not change numeric values or the step.

Use `formatOptions.minimumFractionDigits` and `maximumFractionDigits` together for
an exact number of displayed decimal places. Dollar-and-cent values use step .01
and `{style:'currency', currency:'USD', minimumFractionDigits:2,
maximumFractionDigits:2}`. A numeric 12.5 displays as $12.50 while callbacks and
native submission retain 12.5. Currency code, locale and formatting conventions
remain consumer choices.

For percentages choose one convention deliberately:

- Fractional values: min 0, max 1, step .0001 with `style:'percent'`. Numeric .255
  displays as 25.50% with two fraction digits.
- Percentage points: min 0, max 100, step .01 with `style:'unit', unit:'percent'`.
  Numeric 25.5 displays as 25.50% without scaling the value by 100.

These are locale-aware [Intl.NumberFormat options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat),
not regular-expression masks. A regex can validate a separate text-entry draft;
it is not the slider's formatting contract. Keep enough visible digits to explain
meaningful step changes.

The playground offers lower/upper bounds, step, number format, fixed decimal
places and currency alongside presets. Valid draft edits apply on blur and reset
its own starting values; invalid bounds or steps leave the last valid preview and
copied source intact. Fixed reference examples remain independent.

## Increment ticks and snapping

`increment` generates evenly spaced, decorative ticks anchored at `min` (maximum
1001 visible ticks; hidden ticks impose no visual-count cap). A final tick appears at `max` only when that bound is on the increment
lattice. `showTicks` defaults to true; hide generated ticks independently of
snapping. `tickAppearance` is dot by default, or line. Explicit labeled `marks`
remain independent. Tick colors adapt to the filled and unfilled track.

`snapToIncrements` defaults to false. When true it requires increment and uses that
spacing as the effective pointer/keyboard/native-input step. Otherwise `step` keeps
its existing meaning, so users can select values between visible ticks. This is
uniform increment snapping, not snapping to arbitrarily positioned custom marks.
Callbacks/form data remain numeric; controlled hosts own re-aligning their values
when changing the increment, just as when changing step or bounds.
