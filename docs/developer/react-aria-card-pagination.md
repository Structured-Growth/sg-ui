# Card collection and pagination contracts

Task references: M-11, M-12. Public `CardCollectionWithFooter` and
`AppPaginationFooter` names remain. They now use owned Pagination, scoped tokens
and compiled CSS Modules. Import `@structured-growth/sg-ui/styles.css` once and
provide `Provider` or `ThemeScope`. Granular `/components/CardCollectionWithFooter`
and `/components/CardPaginationFooter` imports avoid the legacy catalog barrel.
Root/catalog imports still require legacy peers while migration continues.

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

For atomic grid/server requests, `AppPaginationFooter.onPaginationModelChange`
receives `{ page, pageSize }` once per page or size action. A size action includes
page zero; this callback supersedes both separate callbacks when supplied. The
required legacy callback props can be no-ops when adopting this optional path.
The owned `Pagination.onPaginationChange(page, pageSize)` provides the same atomic
size request; page buttons still use its `onPageChange`. Without these optional
callbacks, the existing page-reset-before-size callback order is preserved.
This compatible addition supports M-16 transactions without changing existing cards.

**Breaking integration changes:** page-size selection now calls `onPageChange(0)`
before `onPageSizeChange(size)`, matching owned Pagination. Hosts should no longer
rely on the old footer's size-only callback. Buttons use translated First/Previous/
Next/Last page text in place of legacy icon buttons. The stylesheet and visual scope
are required; MUI theme overrides and `.MuiTablePagination-*` selectors no longer
style this footer. Use `className`, native `style`, the
`data-sgui-part="card-pagination-footer"` hook, or scoped token overrides instead.

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
Broader browser/assistive technology gates remain in the master task list.
