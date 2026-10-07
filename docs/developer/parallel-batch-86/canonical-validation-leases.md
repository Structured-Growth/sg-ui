# Batch 86 canonical validation leases (R-11/X-12)

Reviewed baseline: `e2437c59015d868d8f7c815c7db4378b65fa804f`.
Scope is restricted to `scripts/browser-validation-pool.mjs`, its colocated Node
fixtures, and this record. No browser, build, package, CI or production acceptance
is claimed.

The exported `acquireLightSlot` and `acquireInstallSlot` helpers previously used
`slot-N`, separate from the human scheduler's canonical directories. They now
atomically claim `/tmp/sgui-light-validation-slots/slot0` through `slot3` and
`/tmp/sgui-install-slots/installslot0` through `installslot1`, respectively.
Canonical occupancy, including ownerless, file and symlink claims, is never
reclaimed. Occupied slots are skipped; full capacity rejects admission.

Each helper first claims the corresponding legacy `slot-N` directory and holds
that transition guard throughout the lease lifetime. Existing legacy occupancy
therefore blocks that corresponding helper slot, and an old helper starting later
cannot claim a new helper's slot. Failed canonical acquisition releases only the
helper's own guard. Generic `acquireSlot`, browser/session `slot-N` allocation and
supervisor scheduling remain unchanged. Old generic callers do not acquire
canonical claims themselves; the corrected exports are the interoperable entry
points.

The returned helper lease includes its `legacyLease`. Pass the complete lease to
`releaseLease`; do not reconstruct a canonical-only object. Release verifies both
regular directories/files and exact owner strings before changing either claim.
Owner replacement or malformed claims retain both for explicit owner resolution.
No cleanup steals or removes a foreign lease. This preserves the existing
exact-owner cleanup model; it does not add stale reclamation or protection from
external owner rewriting between filesystem operations.

The second helper argument `{ root }` is a fixture-only seam. Fixtures use unique
temporary roots, independent Node processes for atomic contention, canonical
human claims, full 4/2 capacity, legacy occupancy in both admission directions,
owner mismatch retention, symlink/file refusal, failure cleanup and unchanged
generic naming. They never create or modify actual global scheduler leases.

## Validation status

Code and fixtures are prepared. Execution is pending coordinator light-window
authorization because the coordinator is running a frozen snapshot. No tests,
install, global lease fixture, native/browser check or supervisor has run for
this change. The unresolved global light slot0 owner replacement is untouched.

Planned focused command, with the authorized Node 24 binary directory prepended
to PATH:

```sh
node --test --test-name-pattern='canonical helper' scripts/browser-validation-pool.test.mjs
```

The coordinator owns review and integration. R-11/X-12 remain open beyond this
bounded scheduler correction.
