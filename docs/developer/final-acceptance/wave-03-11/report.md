# Wave 03 / 11 — nested scopes, hydration and lifecycle

Delivered a ready-to-apply patch with three focused regression tests, a deterministic
public-package hydration/portal fixture, its native runner, and consumer guidance.
**Three new source-backed cases pass. All four original acceptance leaves remain
partial pending coordinator integration/native execution.** No central acceptance
counts or shared production files were changed.

The patch adds tests and guidance; no production defect was established in this
bounded source-backed run. `scoped-lifecycle.patch` passes `git apply --check` against
the current dirty checkout. `proposed-files/` mirrors its six target files.

## Executed evidence

- Node **24.21.0**, React **19.2.3**, Vitest **4.1.11**, macOS source-backed run.
- `unit-evidence.json` / `units-final.txt`: **3 suites, 3 cases pass**, 60 recorded
  input hashes unchanged before/after execution. These include direct affected
  scope/control sources and stylesheet modules plus manifest/lock/config/proposed
  tests; this is not a claim that every transitive implementation was frozen.
- Command from `packages/ui`:
  `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node ../../docs/developer/final-acceptance/wave-03-11/run-proposal-tests.mjs`.
  The local config resolves proposal imports against existing source, keeps its
  cache in this evidence directory and runs one worker. It changes no source files.
- `Provider.live-portal.test.tsx`: open Popover → nested Menu, rerender host
  theme/density/locale/direction/custom token while open; preserve dialog/menu DOM
  identity and label reference, update portal attributes/inline variable, exclude
  width, keep sibling markup, Escape menu then dialog and wait for each focus return.
- `ThemeScope.strict-cleanup.test.tsx`: StrictMode and nested/two independent mounts
  share exactly one live document scroll listener. Unmount one root preserves the
  surviving observer; last unmount removes listener, both activity attributes and
  all idle timers. A detached post-unmount scroll does not reactivate anything.
- `Provider.composed-ssr.test.tsx`: dynamic source imports/render without
  window/document; Arabic RTL host locale, literal system theme, initial period,
  local datetime, comparison and multiline values/names survive SSR. No ambient
  clock is used. This tests affected BUG0008/0009 composition inputs in Node,
  not native hydration or every public import.
- The native runner passes `node --check` only. It has **not executed**. The patch
  check and syntax logs are empty on success; exit status zero was observed.

The first harness attempt failed to resolve bare React imports because the tests
live outside the workspace. A later attempt used the default classic JSX transform
for those external files. Both were harness defects, corrected in the local config;
full logs remain. A subsequent real test reached its final Escape before React Aria's
scheduled focus restoration. The test now waits for the documented first focus
return before sending the next Escape. The intermediate failure is preserved in
`units-fifth.txt`, with corrected isolated pass in `units-live-portal-final.txt` and
all-three pass in `units-final.txt`. No production behavior or assertion was removed.
`units-third.txt` records an occupied shared lease; it was not bypassed or reclaimed.

## Reused evidence and input limits

Read assignment, prior wave-02-10/15 and parallel-10 receipts and coordinator integration
evidence. `input-reconciliation.json` compares 84 inspected files: 21 equal the
selected prior scoped snapshots, one differs (component-architecture guidance),
62 were not captured in those selected prior lists. All **26 selected built
Provider/composed-control/TextArea/scope outputs** equal coordinator integration
hashes. These comparisons preserve only their bounded prior evidence. In particular,
unchanged built bytes do not establish a new packed runtime result.

The current coordinator native receipt contains calendar/grid cases, not a
portaled-token-tier or system hydration case. Earlier parallel-10 records its raw
foundation/control artifact directories absent; no replacement raw receipt was
recovered here. Existing source tests are mapped to exact assertions in
`lifecycle-matrix.json`; source presence is explicitly distinguished from execution.
FA-04 unchanged test evidence and BUG0008–0012 coordinator receipts remain dated;
none was rerun as a generic suite. Lifecycle ownership policy is component-specific:
grid ownership is fixed per mounted concern; default/rejection/reset/remount checks
are mapped, without inventing an all-control live ownership-switch promise.

## Native fixture ready for coordinator

`scripts/scope-hydration-proof.jsx` uses public package imports and fixed leap-day
values. `scripts/test-scoped-lifecycle-consumer.mjs` consumes an **already installed
immutable packed fixture**; it does not install, rebuild the library, or alter the
existing broad Proof. It builds only its own small production consumer under that
fixture, then uses ephemeral ports and serial Chromium/Firefox/WebKit sessions.
Run once each for the existing packed React 18.3.1 and 19.2.3 fixtures. The exact
command template, required absolute path parameters, expected assertions and
remaining narrow old-token-tier case are in `validation-plan.json`.

The runner gates JavaScript requests while initial linked production CSS styles
server markup, records that prehydration styled frame, releases JS, and checks
server node identity/course ID, unique server/hydrated IDs, resolved hydrated
IDREFs, zero recoverable/console/page errors and exact initial locale/date wire
values. It then changes system preference, preserves fixed light child appearance,
opens nested Popover/Menu and dispatches an explicit **programmatic host-update
event** to change live scope without clicking through inert content. It checks
computed menu background, scope attributes, layout exclusion, adjacent isolation,
menu identity and sequential focus return. Package outputs are hashed before/after;
consumer outputs and browser versions are recorded. No pre-JS all-IDREF or
all-physical-frame/no-flash claim is made. Host stylesheet timing and serialized
initial host settings remain explicit responsibilities in the proposed guidance.

## A-D-16 — partial

- [ ] A-D-16 Reconcile original `D-16`: Define scoped theme/density roots and nested overrides; ensure portaled overlays receive the correct scope and variables. Historical status: open.

Live nested portal source behavior now passes; existing nested/static computed portal contracts retained.

**Remaining:** Integrate patch; recover matching raw prior static token-tier portal result or run its single existing case; execute proposed live portal computed-style/focus case on frozen packed output.

## A-D-17 — partial

- [ ] A-D-17 Reconcile original `D-17`: Specify explicit light/dark/system settings, initial server theme, `color-scheme`, and hydration behavior without unwanted flashes or browser-global assumptions. Historical status: open.

Deterministic system markup/locale SSR passes, and concrete initial stylesheet/server-setting guidance plus a gated hydration fixture are ready.

**Remaining:** Integrate guidance and fixture; execute styled prehydration/system preference and explicit child-theme checks against immutable packed React18/19 consumers. Initial CSS link timing remains host-owned.

## A-X-16 — partial

- [ ] A-X-16 Reconcile original `X-16`: Test multiple independent component instances, nested themes/portals, stable IDs, React Strict Mode cleanup, and controlled/uncontrolled transitions. Historical status: open.

Exact lifecycle matrix and passing live portal/two-root StrictMode observer cleanup successors supplied. Existing grid ownership/default/rejection/remount boundaries retained.

**Remaining:** Integrate tests; execute proposed native nested update/ID/focus slice. Broader component-specific lifecycle coverage remains bounded by mapped retained evidence; do not claim every public control ownership transition.

## A-X-18 — partial

- [ ] A-X-18 Reconcile original `X-18`: Add SSR render and hydration tests with no window/document at import time, no mismatched IDs, and correct initial locale/theme/date values. Historical status: checked.

Affected composed imports/render now execute without browser globals and preserve explicit Arabic locale/system/date/multiline values. Runnable native hydration/ID checks supplied.

**Remaining:** Execute packed native fixture for supported React versions with exact tarball/build/host hashes; require preserved server nodes/IDs, exact wire values and zero recoverable errors. No current React18 or native hydration pass is claimed.

Only `docs/developer/final-acceptance/wave-03-11/` was written. No installs,
shared builds, servers, branches, staging, commits, pushes, versions, tags,
publication, workflow/settings changes or messages to other chats occurred.
User server3000 and personal workspace state were untouched. No device, spoken AT,
remote CI, legal/owner approval or production acceptance is inferred.
