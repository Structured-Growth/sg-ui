# Searchable selection

SearchableSelect combines an editable single-select field and an alternate
select-style trigger with search inside the popup. The public root, primitives
and experimental entries export the component and its owned props, option and
filter types. Load the public stylesheet and provide Provider or ThemeScope.

## Pattern research and design decisions

The reference review compared official component documentation rather than
adding another UI foundation:

| Reference | Relevant behavior | SGUI decision |
| --- | --- | --- |
| [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | Editable and select-only interactions; input editing, popup keyboard navigation, commit and dismissal | Distinguish search text from selected ID and keep interaction semantics owned by React Aria. |
| [React Aria ComboBox](https://react-aria.adobe.com/ComboBox) | Editable input, optional dropdown action, controlled filtering and native form integration | Use the installed ComboBox interaction implementation for the input layout. Reuse SGUI field/list CSS, Button, translation and portal scopes. |
| [React Aria searchable Select example](https://reactspectrum.blob.core.windows.net/reactspectrum/20c24d349cd084ab79d8d4d484986faa89d34bbf/docs/react-aria/examples/searchable-select.html) | Select plus Autocomplete, with a search field above a listbox | Compose the equivalent supported APIs from installed react-aria-components 1.21.1 internally. Search is outside the listbox option tree. Preserve all records in the underlying selection collection while filtering visible items by ID. |
| [Mantine Combobox](https://mantine.dev/core/combobox/) and [examples](https://mantine.dev/combobox/?e=SelectDropdownSearch) | Input targets, button targets, search inside a dropdown, custom options and empty states | Offer input/dropdown search placement, descriptions, disabled choices and explicit empty content. Keep density local. |
| [Mantine fuzzy-search guidance](https://help.mantine.dev/q/select-fuzzy) | Custom matching permits different search strategies | Support a host predicate and conservative optional typo tolerance without adding a fuzzy-search dependency. |
| [MUI Autocomplete](https://mui.com/material-ui/react-autocomplete/) | Accent/case normalization, custom filtering and disabling local filtering for server results | Normalize local text and expose filter="none" plus onSearchChange. Fetching, cancellation and freshness belong to the host. |
| [shadcn Combobox](https://ui.shadcn.com/docs/components/combobox) | Clear actions, custom item content and button-triggered popup input | Include clear selection and richer labels/descriptions. This is design reference only; SGUI does not adopt Base UI, Radix or their styles. |
| [Select2 search](https://select2.org/searching/) | Search location and domain-specific matcher customization | Treat aliases as host metadata and permit custom matching rather than hard-coding place-name dictionaries. |

Abbreviations are not spelling mistakes. Texas requires keywords such as `TX`;
the library does not infer geography from IDs. Case/diacritic normalization and
multiword contains matching are the default. Fuzzy mode additionally uses bounded
word edit distance, including adjacent transpositions: one edit for query words
of 3–5 characters, two for longer words, and no typo correction below three.
Exact labels/aliases outrank prefixes, contains matches and typo matches; ties
retain host order. A custom predicate retains host ordering.

The initial superset combines both layouts, matching policies, explicit aliases,
option descriptions, disabled choices, clear selection, native forms/validation,
controlled or uncontrolled IDs, request/empty states, retry callbacks and both
densities. Existing Select, ComboBox/Autocomplete and AsyncMultiSelect keep their
contracts. Groups, multiple selection, arbitrary-value creation and virtualization
are separate product decisions; they are not implied by this single-record picker.

## Ownership and behavior

`searchPlacement="input"` renders a joined input/dropdown frame. Typing filters
results; opening the options action browses the full collection. Leaving an
uncommitted query restores the selected label. `searchPlacement="dropdown"`
keeps the selected label on the trigger, focuses the popup search on opening and
starts each opening with an empty query. Escape dismisses without selecting.

`value`/`onValueChange` own the selected ID; `null` clears it. Without value,
defaultValue initializes owned state. Search edits notify onSearchChange and do
not become custom values. A controlled host may reject selection/clear requests.
Keep the selected record in options when replacing a remote result set so its
label and native form representation remain available. `filter="none"` bypasses
local matching; it does not start a request. Loading/search failure suppress
selectable results. onRetry delegates recovery to the host. Form errors use
invalid/errorMessage separately.

The forwarded ref targets the native root div in both layouts. Inherit density,
appearance, contrast, direction and locale from the production scope. Shared field,
list, scrollbar and Button styles own their respective behavior; the colocated
module owns the popup search/results layout. ComboBox and the editable
SearchableSelect share AttachedField.module.css for their single field outline,
logical action divider, end rounding and group focus treatment. Additional text
colors are component aliases in the generated token source. No host reset or
website identity is copied into the control.

The catalog route is `/docs/components/searchable-select`, with an independent
overview, prop playground, fixed layout/density/matching/state examples, retry,
custom filtering and a native form. Source snippets use public imports and state
owned by each Example. See the [backlog](backlog.md) for remaining regression and
environment hardening; automated browser results do not establish manual AT,
physical-device or IME conformance.
