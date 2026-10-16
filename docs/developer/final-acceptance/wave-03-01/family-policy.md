# Reviewed family defaults and policy corrections

`normalized-contracts.json` attaches every one of the 469 saved contracts and all
saved alias routes to its owned visual/validation properties. The original exact
texts remain in parallel-01; four declaration deltas are separately explained in
`declaration-deltas.json`. They add an internal grid predicate, change two import
spellings and correct one JSDoc comment. No changed public prop signature was
found in those four files. This is a bounded delta review, not a new export scan.

`normalized-defaults.json` disposes all 678 original candidates. Its direct public
parameter rows are separated from local bindings, private/helper parameters,
shared factory defaults, composed public defaults and nullish derived fallback
expressions. Do not collapse the last group into prop defaults. `reviewed-
dispositions.json` promotes 20 reviewed composed/factory candidates and replaces
three superseded expressions without relabeling old evidence as current behavior.

The proposed public guide records ThemeScope context inheritance, distinct
Button/text tones, distinct Popover/Dialog size domains, Menu selection/density,
Tooltip timing, Dialog/AppModal dismissal arity, field validation precedence,
grid omitted selection and persistence defaults. The guide is source-reviewed;
the compiler fixture checks assignability, not timing or native interactions.

## Correction to retained evidence: DateField entry mode

The prior wave-02-15 `defaults-and-state.md` row says DateField is text by default.
That row is inaccurate for the captured and current implementation. In current
DateField.tsx, text rendering requires `props.entryMode === "text"` AND
`props.kind !== "datetime"`. Otherwise it renders SegmentedDateField. DatePicker
separately destructures entryMode="text" and kind="date"; TimeField uses segments
only for explicit entryMode="segments". The current consumer calendar guide
already correctly distinguishes these cases at its DateField / DatePicker
flexible-entry sections. No library behavior change is proposed. Preserve the
prior report as dated evidence and attach this correction.

The two text renderers also differ in message precedence. TextDateField uses
availability reason before host errorMessage; TextTimeField uses host errorMessage
before availability reason. Both use a translated fallback last. Omitted message
props do not define one universal validation policy. TextDateField's committed
hidden value is suppressed by the composition availability callback. These are
current code observations; exact-input coordinator composed/native results stay
bounded to their named cases.

## Residual semantic work, not an inventory rerun

431 saved nullish expressions remain derived behavior requiring per-path review,
including state, formatting, translation, accessibility and layout resolution.
25 implementation/helper parameter candidates and five local-binding candidates
are explicitly not independent public prop defaults; some may implement a public
composed behavior and cannot be dismissed solely because their function is private.
The family guide plus direct initializer index does not prove all indirect
context/CSS/composition defaults across every public symbol. Historical inherited
upstream APIs at their locked versions are still absent from retained evidence.
Do not close A-B-05/A-A-08/A-Z-13 from candidate classification alone.
