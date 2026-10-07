# Batch 86 canonical validation leases (R-11/X-12)

Reviewed baseline: `e2437c59015d868d8f7c815c7db4378b65fa804f`.
Scope is restricted to `scripts/browser-validation-pool.mjs`, its colocated Node
fixtures, and this record. No browser, build, package, CI or production acceptance
is claimed.

The exported `acquireLightSlot` and `acquireInstallSlot` helpers previously used
`slot-N`, separate from the human scheduler's canonical directories. They now
atomically claim `/tmp/sgui-light-validation-slots/slot0` through `slot3` and
`/tmp/sgui-install-slots/slot0` through `slot1`, respectively.
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

## Validation evidence

Independent review corrected the install prefix to `slot`: canonical install
claims are `/tmp/sgui-install-slots/slot0` and `slot1`, matching the direct caller.
The tested implementation head was
`53ec839ee36496cf2539bf3509880052e1020d06`, clean before execution.

The coordinator authorized only temporary-root canonical-helper fixtures under a
directly claimed canonical light slot1–3. On Node **24.21.0**, with
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin` prepended to
PATH, this command passed **4 tests, 0 failures** (exit 0):

```sh
node --test --test-name-pattern='canonical helper' scripts/browser-validation-pool.test.mjs
```

The gate was atomically claimed directly at
`/tmp/sgui-light-validation-slots/slot1`, owner token
`batch86:53ec839ee36496cf2539bf3509880052e1020d06:0530bc13-82a1-4baf-a0e4-2e50d27f8ded`.
The same complete token was verified and released after test completion.
All fixture acquisitions ran in unique temporary roots; global install leases
and unresolved light slot0 were untouched. No install, browser/build/package,
CI, native check or supervisor ran. The final evidence commit changes only this
record after the tested implementation head. `git diff --check` passed.

The coordinator owns review and integration. R-11/X-12 remain open beyond this
bounded scheduler correction.
