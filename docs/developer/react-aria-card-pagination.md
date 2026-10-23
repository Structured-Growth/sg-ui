# Card collection and pagination contracts

Task references: M-11, M-12. Public `CardCollectionWithFooter` and
`AppPaginationFooter` names remain. They now use owned Pagination, scoped tokens
and compiled CSS Modules. Import `@structured-growth/sg-ui/styles.css` once and
provide `Provider` or `ThemeScope`. Granular `/components/CardCollectionWithFooter`
and `/components/CardPaginationFooter` imports are supported alongside root/catalog imports.

The host owns zero-based `page`, `pageSize`, rows, row IDs and callbacks. Rendering
normalizes negative/non-finite pages to zero, invalid sizes to 25 and known-total
pages to the last available page. Collection slicing and footer display use the
same normalization; a shrinking dataset no longer leaves an empty grid above a
footer showing existing rows. No callback fires during normalization. Stable row
IDs preserve card state through reordering within a page. This collection pages
its complete host-supplied client dataset; it does not fetch or infer server rows.

`AppPaginationFooter.totalCount` accepts a known nonnegative count, or undefined,
null or a negative value for unknown totals. Unknown totals display `Total unknown`
and a page number, omit Last page, and use host `hasNextPage` for Next. Known totals
display the row range (zero total is `0-0 of 0`) and page count. Disabled/loading
navigation prevents both size selection and page actions. `label` on the footer
and `paginationLabel` on the collection distinguish pagination landmarks.

Both components require `onPaginationModelChange({ page, pageSize })`.
Every page or size interaction requests one complete state transaction. Size
changes include page zero. Hosts accept or reject that transaction using their
controlled page and size; separate callback fallback paths are removed.
The owned Pagination primitive exposes `onPageChange` for page buttons and
`onPaginationChange(page, pageSize)` for complete size requests.

Use `className`, native `style`, `data-sgui-part="card-pagination-footer"`
or scoped tokens to customize the footer.

The collection uses its available container width for columns with a 22.5rem
preferred minimum, shrinking to one column on narrow containers. Only the grid
scrolls when its parent constrains height; the footer remains outside the scroll
area and wraps navigation for narrow widths. No browser-global layout reads or
runtime stylesheet engine are needed. `loading`, `loadingContent`, `emptyContent`
add explicit host presentation states; defaults use translated library strings.
Loading replaces cards, marks the grid busy and disables pagination. Hosts own
card actions, data retrieval, persistence and routing.

Colocated tests cover host navigation/size ordering, form-safe keyboard activation,
known/unknown/zero totals, invalid values, translation forwarding, stable row keys,
shrinking data, empty/loading states, composed controlled navigation and SSR.
Broader browser and assistive technology validation remains required.

## Native focus visibility follow-up

The collection measures its own grid scrollport on the next animation frame after
focus. If a browser reveals only an input caret, it scrolls that same grid just
enough to expose the complete focused control and its outline. Focus and the
outer application scroll remain with their existing owners. Pending work is
canceled on unmount and ignored if focus has moved elsewhere. The minimum grid
height and oversized-footer root scrolling still apply.

The Rows per page control composes the public Select dropdown. Its options and
selected size remain controlled; choosing a size requests page zero and the new
size atomically. Disabled pagination also disables the dropdown. The overlay
inherits the pagination scope and returns focus to its trigger when dismissed.
