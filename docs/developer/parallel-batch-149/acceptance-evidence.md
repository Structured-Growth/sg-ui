# Batch 149: native side-navigation traversal expectation

Parent tasks: **M-09 / U-07, partial only**. This is the exclusive test-driver
successor to batch 141. It does not update acceptance or establish a runtime fix.
Base: `a926cb95de34d65c9bf0741809ff1048529ca6bf`, checked clean before edits in the
new managed isolated worktree `/Users/thomashall/.codex/worktrees/ed7a/sg-ui`.
Branch: `codex/batch149-native-navigation-traversal`.

Only `tests/browser/batch65-side-navigation-native-flow.spec.ts` and this report
are changed. The coordinator's durable state was read without modification; its
batch-141 source reservation and historical results are retained. The explicit
successor-149 dispatch authorizes this bounded spec ownership. Predecessor reports,
all runtime source, the primary image-upload checkout and other worker worktrees
remain untouched. Exact final commit/head and report hash are in the handoff.

## Retained Wave45 evidence and classification

Actual tested frozen head: `48bf2ee90eeaa45e71ea443aef7b83e6e145cb72`.
Root evidence:
`/Users/thomashall/.codex/worktrees/wave45-reviewed-corrections/sg-ui/artifacts/browser-pool/3e5633e9-aeff-46b0-a27d-2ee355195caf/evidence.json`.
Recorded root SHA-256: `145625752ad8959b9d9df41e77108e4dac3ebd4c0c817e3b6132d54747156111`.
Failure review:
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/wave45-navigation-failure-review.json`.
Review SHA-256: `9943c930eac5158dde8973f2661e92080f9d6e22d0e0672c6d84e2b6fda5f327`.

The review records Chromium 8/8 and Firefox 4/8. All four enlarged-text Firefox
cases fail People focus after a single Tab from drilled Back(Settings). Their
earlier Courses/collection full-control and client-area-plus-outline assertions
pass; this is bounded evidence that the exercised original clipping assertions
are repaired, not that those enlarged scenarios finish. WebKit is UNRUN for
the batch-141 source in Wave45; earlier WebKit results are historical.

Classification: **test fixture/driver expectation defect**, with the extra native
scroll-container stop strongly supported but its exact active element still
inferred. The retained review identifies a native blue scrollport outline after
Tab and People present but inactive. Read-only trace inspection confirms that
`call@979` is a real Tab. No new browser observation is claimed here. There is no
evidence authorizing another runtime change; if fresh ordered diagnostics expose
an actual reach/focus defect, the coordinator must reserve separate source scope.

## Meaningful changed bytes

The existing `keyboardReach` helper has a narrow drilldown mode for Back→People
and People→Back. It sends at most **two native Tab/Shift+Tab gestures**, preserving
the existing WebKit Alt modifier. The first stop must be the target or the exact
owned `side-navigation-scroll` element. Any other control, document body or page
wrap fails immediately; stopping twice on the scrollport still fails the final
target-focus assertion. Other helper call sites retain their previous behavior.

Each direction attaches ordered samples before traversal and after every gesture,
including on failure. Samples record key/count, actual activeElement tag/id/role,
aria-label/text/part/tabIndex, document focus, native scroll dimensions and exact
target/scrollport focus identity. They distinguish a direct transition from a
Back→scrollport→People transition without assuming the extra stop always occurs.
Reverse traversal receives the same bounded treatment because the native
scrollport can participate between the same controls in either direction; this
reverse sequence remains unverified until fresh proof.

No artificial focus, tabindex mutation, event dispatch, scrolling, timing sleep,
browser-specific skip or visibility relaxation is added. `visibleFocus` and
`focusGeometry` are unchanged, preserving native focus, ancestor clipping,
viewport/hit checks and full-control-plus-outline bounds against the actual
scrollport client area. People activation, selected route/item callbacks, Back
route behavior, account, hierarchy, collapse and scope checks are retained.

## Validation and remaining gates

Static `git diff --check`, allowlist review and source SHA-256 comparison passed.
These are whitespace/ownership checks, not executable validation.
**All changed-byte executable gates are UNRUN**: unit/composed tests, source and
browser-spec typechecks, foundation/import/token guards, build, Storybook,
Chromium/Firefox/WebKit native proof, packed consumers and full validation.
No install, test, typecheck, build, Storybook, browser launch, shared slot/queue/state
write, CI, merge, push or publication was performed. No unchanged rerun occurred.

The coordinator owns meaningful supported checks for this changed spec and fresh
native proof, with priority on the four retained enlarged Firefox failures. It
must inspect both ordered attachments and the unchanged geometry/routing checks
before accepting the slice. Prior Chromium/Firefox successes describe the frozen
Wave45 bytes only and do not prove this successor. No whole M-09/U-07 closure,
broad M/U/X/R/Z acceptance, physical-device or assistive-technology proof is claimed.

## Frozen file SHA-256

| File | SHA-256 |
| --- | --- |
| Changed browser spec | `ff9218029fd1854dccda95e53c4823f469a2ee0d8fb0785400e5f14cf3044e37` |
| Unchanged `src/components/SideNavigation/SideNavigation.tsx` | `50383939370498bf93119118d1b1c831d693ef59a12af48ef8feb43cc62b84f4` |
| Unchanged `src/components/SideNavigation/SideNavigation.module.css` | `71e33ca47f7782ed899b75cefc5ef1970bc4d21a6176e5d209e788414f6cddb7` |
| Unchanged `src/components/SideNavigation/SideNavigation.test.tsx` | `6ed6d8e64145f9681c79744399b41b79d8960eac2f960153e6f8771cd3bc8d61` |
