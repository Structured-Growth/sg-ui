# Form field message placement

Field guidance defaults above the control; validation messages default below it.
Use `descriptionPlacement="above" | "below"` and
`errorPlacement="above" | "below"` independently. With a separate title, above
messages follow the label, description first and error second. Checkbox and switch
labels stay beside their indicators; their guidance surrounds that labeled row.
RadioGroup guidance surrounds its option group, after its title.

| Controls | Configuration |
| --- | --- |
| TextField, TextArea, Select, ComboBox, Checkbox, RadioGroup | Both placement props |
| DateField and TimeField, text and segmented modes | Both placement props; original IDs, hook props, validation timing and reset behavior retained |
| DatePicker and DateRangePicker | Both placement props forwarded to their fields; range text guidance/error share the same layout contract |
| DateRangeSelector | Error placement for aggregate validation; both props forwarded to optional endpoint fields |
| PeriodPicker, DateTimeRangePicker, DateRangeComparisonPicker | Both props forwarded to composed fields; error placement also controls aggregate validation. Explicit comparison `rangeProps` placement takes precedence for those child fields |
| Switch, SearchField, AsyncMultiSelect | Description placement. These controls do not acquire an invalid/error-placement API; search and async request failures stay in their existing results/retry flows |

Bare calendars and controls without field messages do not acquire synthetic helper
text or validation APIs. Host-supplied labels/messages retain their translation
ownership. Message positioning never changes native constraints, accepted values,
commit callbacks or validation timing.

`src/experimental/TextField/FieldMessages.tsx` owns the shared placement type and
private rendering helper. Fields supply their existing native message nodes,
styles and IDs; the helper adds no DOM wrapper or interaction implementation.
Above/below instances retain a stable control position in the React tree so that
changing placement preserves the input and its draft. Checkbox's owned choice
label marker lets grid/toolbar styles hide the label without hiding the indicator.

For rows with all messages above, compose `Stack direction="row" wrap align="end"`
so controls align at their lower edge despite varying message heights. For all
messages below, use `align="start"`. This is a row-layout choice, not automatic
height reservation by each independent field; wrapping preserves alignment within
each row. The TextField/TextArea comparisons and the other field reference panels
show both placements at compact and comfortable densities. Playground controls
and copied source remain local to their example.
