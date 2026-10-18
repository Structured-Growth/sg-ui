# Modal resize focus failure — confirmed product issue

The granted single Chromium diagnostic run reproduced the failure on the existing
frozen `packages/ui/browser-docs-static` host. The canonical lease helper exited
and released both leases. No builds or Firefox rerun were started.

Field 1 remains active after the 200% root-font/text-spacing change and open-dialog
resize to 320 × 640, but its rectangle is y654.406–718.406. All three horizontal
centerline hit tests return null because they are outside the viewport. The outer
dialog is y102.406–537.594, clientHeight435, scrollHeight980 and scrollTop0. Its
body begins y479.406 and extends to799.406. This is genuine clipping/offscreen
focus, not a one-pixel tolerance, incorrect hit target or overstrict ancestor-box
false positive. `failed-focused-control.json` preserves actual measurements.

The existing `Dialog.tsx` calls `revealFocusedControl` only from focus-capture
handlers. Viewport or font/layout changes do not necessarily dispatch focus again
for an already-focused field. Chromium/Firefox retain its old scroll position;
the initial WebKit pass does not establish equivalent behavior in the other engines.

Only the shared new `wave04-browser-acceptance.spec.ts` diagnostics were changed:
failed polling now retains the full observation, active ID, viewport, hit elements,
ancestor overflow/scroll dimensions and a viewport screenshot. The original
visibility predicate and all native Tab steps are unchanged. Failed observations
are attached before rethrow, so an early Field 1 failure no longer leaves only an
empty successful-stops array. Current browser TypeScript passes.

`dialog-resize-focus.patch` is a precise **unapplied** product proposal for
`packages/ui/src/experimental/Dialog/Dialog.tsx`. It extracts the existing reveal
operation for reuse and subscribes to window resize plus ResizeObserver changes
on the dialog and its immediate header/body/footer. It coalesces observation
callbacks into a frame, keeps only the active nearest-dialog owner, disconnects
observers/removes listeners/cancels its pending frame at cleanup, and uses the
existing conditional scrollIntoView operation. It neither refocuses controls nor
changes CSS layout, focus traps, return-focus policy, assertions or scroll locking.
The observed chrome permits whole-dialog scrolling already; missing reveal timing
is the reproduced fault, so a speculative AppModal CSS change is not justified.

The proposal passes `git apply --check` and an in-memory strict TypeScript check
of Dialog/imported source (Node24.19.0, TypeScript5.9.3, zero diagnostics). It still
requires coordinator review/application, one shared rebuild and the existing
modal-only case in affected engines. Preserve six accepted shell passes and the
original Chromium/Firefox failures. Rerun WebKit for the shared Dialog change if
required by its affected scope. No assertion should be relaxed or native focus
seeded to hide the resize failure.

Exact executed diagnostic command, from repository root:

```sh
/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node packages/ui/node_modules/@playwright/test/cli.js test --config /tmp/wave04-controls-layout.config.mjs --grep 'every tabbed-modal' --project=chromium --reporter=line --output=/Users/thomashall/Repositories/sg-ui/docs/developer/final-acceptance/wave-04/12/modal-diagnostic
```

`modal-diagnostic.log` retains the actual exit1 failure and its trace. The command
used the coordinator's explicit bounded window; no approval or release outcome is
inferred. The product proposal was sent to the coordinator before its rebuild.

## Coordinator integration and focused lifetime regression

The coordinator has applied the precise Dialog fix and queued its shared rebuild.
`dialog-resize-lifetime-test.patch` adds exactly one case to the existing Dialog
test file. Under StrictMode it verifies nested ownership, observer disconnection,
resize-listener removal and queued-frame cancellation/no late scrolling. RO/RAF
lifetime and geometry are instrumented for this cleanup probe; real focus scopes
remain mounted. It does not replace native geometry evidence. The complete proposed
Dialog plus unit file typecheck with zero diagnostics; the test patch dry-run passes.
The unit case is not executed here; coordinator reviews and runs that one case.
Base/proposal hashes are in `resize-lifetime-inputs.json`.

## Focused lifetime case correction and executed result

The coordinator's initial test run found both initially-open nested portals hidden
from accessible queries in StrictMode. The case now opens the parent through its
real Button, waits for its accessible dialog/initial field focus, opens the child
through its real Button, and waits for its accessible field/focus. No hidden-role
query, focus mock or relaxed cleanup assertion was introduced. The single added
case passes on Node24.19.0 / Vitest4.1.11: **1passed,14skipped,0failed**.
`lifetime-realistic-open-results.json` binds source/log hashes. The original
both-open source and failure remain separately retained; no independent product
bug is inferred from the earlier immediate accessible query failure.
