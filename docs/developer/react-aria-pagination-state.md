# Pagination and persistent state hooks

Task references: M-42 (hook portion), H-13–H-15. Both hooks are public through
`@structured-growth/sg-ui/hooks` and the root export. They use owned types and
preserve the `[value, setter]` return contract. Hooks need no visual scope or CSS;
controls composed with them still require the foundation stylesheet and scope.
`normalizePaginationModel`, `APP_PAGE_SIZE_OPTIONS` and their model/configuration
types come from a pure module without a client directive; the interactive hooks
declare their own client boundaries.

**Breaking defaults:** `usePersistentState` and `usePersistentPaginationModel`
now keep independent memory-only state unless the host passes
`{ storage: "local" }` or `{ storage: "session" }`. The previous key-first call
still compiles, but does not automatically read/write local storage. Use a
nonempty, distinct key per view when opting in; `undefined` is accepted for
memory-only state. Switching the key or storage mode resets the hook's default
snapshot to the supplied initial value and restores the new storage scope.

`APP_PAGE_SIZE_OPTIONS` remains `[25, 50, 100]` as suggested menu choices. The
pagination hook no longer treats those values as a required policy or caps sizes
at 100. Without `pageSizeOptions`, every positive safe integer is accepted;
fractional positive sizes are floored. Invalid sizes use `defaultPageSize`
(default 25), then 25 if that default is invalid. Pages are nonnegative safe
integers, with fractions floored and invalid values reset to zero.

Supply `pageSizeOptions` to enforce a host policy. Valid choices are positive
safe integers; duplicates and invalid choices are ignored, and remaining choices
are sorted. Sizes round up to the next choice or clamp to the largest choice.
An empty or entirely invalid list accepts arbitrary sizes. Live changes to the
list re-normalize the current model. Changing the page size through the setter
does not infer a page reset: pass `{ page: 0, pageSize }` for a size action.
`AppPaginationFooter.onPaginationModelChange` already makes this atomic request.

```tsx
import { usePersistentPaginationModel } from "@structured-growth/sg-ui/hooks";

const [pagination, setPagination] = usePersistentPaginationModel(
  "instructor-courses-pagination",
  { page: 0, pageSize: 10 },
  { storage: "session", pageSizeOptions: [10, 75, 250], version: 1 },
);
// Pass setPagination to AppPaginationFooter.onPaginationModelChange.
// Reset the live state and its persisted value to host defaults:
setPagination({ page: 0, pageSize: 10 });
```

Storage is read after hydration. Server rendering and the first hydration render
use the initial model and never read browser storage, including when a browser
window is present during server rendering. No module-level request state is
shared. Malformed JSON or invalid pagination shapes restore initial defaults.
Normalized persisted models are written back. Blocked storage and quota failures
retain updates in browser memory; local and session scopes are isolated.

`version` opts into the envelope
`{ __sguiPersistent: true, version, value }`. Without it, raw JSON remains the
format. Version mismatches (including legacy raw JSON) restore the initial value
unless `migrate(value, previousVersion)` returns a valid model. The previous
version is undefined for raw JSON. Missing keys and malformed JSON always use
initial defaults and never run migration, including after live version changes.
The host owns migration decisions, distinct
keys and schema versions. A valid migration is persisted on the next setter call;
normalization also writes back corrected pagination. The generic state hook's
`validate` option lets hosts reject malformed stored state; the pagination hook
always validates its owned numeric model. Live validation changes recheck both
stored and memory-only values. Rejected stored candidates remain available if
the host later loosens validation. Live version/migration changes also apply to
blocked-storage fallbacks and cached reads; fallback values retain their schema
version. Equivalent JSON migration results preserve snapshot identity, including
when the host supplies an inline migration callback.

Use the setter with host defaults to reset live and saved state. To remove saved
state entirely, the host may remove its storage key and dispatch the corresponding
storage event; do not assume removing a key alone changes mounted views. This
hook is separate from the grid's aggregate view-state persistence contract.
Persist presentation preferences only; credentials, sessions, personal data and
application datasets belong to the host's security and storage policies.

Colocated tests use real React hooks and cover arbitrary/configured sizes, live
reconfiguration, functional updates, opt-in local/session persistence, migration,
malformed state, blocked storage, key isolation, SSR and hydration restoration.
The two hook stories demonstrate memory-only and session-persisted pagination
with the same footer size choices.
