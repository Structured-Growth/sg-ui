# Batch 65: catalog SideNavigation native hierarchy flow

M-09 bounded implementation/proof slice, based on
`fc4f9fca9be4aaace869f0944baccaeed921e5b8` in the isolated managed worktree
`/Users/thomashall/.codex/worktrees/batch65-side-navigation-native-flow/sg-ui`.

## Coverage gap and change

The baseline's [catalog unit tests](../../../src/components/SideNavigation/SideNavigation.test.tsx)
cover route activation, expansion/collapse, drilldown/back and account adapter
behavior in jsdom. [Responsive shell browser checks](../../../tests/browser/inventory-shell-responsive.spec.ts)
cover shell layout, collapse and host-content focus/scroll. The existing
[logout lifetime browser checks](../../../tests/browser/batch13-logout-lifetime.spec.ts)
cover stale account-operation results. None proves the catalog hierarchy's full
native keyboard sequence. Experimental navigation/control proofs are prerequisites,
not catalog hierarchy traversal; no duplicate account/network lifetime work is added.

The new `Navigation/SideNavigation/NativeHierarchy` story supplies a real host
pathname adapter, logs each routing/item request and observes the forwarded native
nav ref. It includes a collapsed expandable course branch, enough linked children
for native scrolling, and a footer drilldown branch with its own route.

The host-backed unit regression exposed a catalog defect: immediately accepting
a drilldown branch's own URL invalidated the explicit menu override and returned
to the root. Internal hierarchy matching now accepts both the originating pathname
and requested destination. Back uses the same destination handling when it requests
a parent route. Public props, native ref, accessible names, host routing ownership,
account behavior and translations are preserved. Two regressions cover nested and
non-nested child URLs, including exactly one parent request when required.

The exclusive [native browser spec](../../../tests/browser/batch65-side-navigation-native-flow.spec.ts)
contains four cases: light/dark × ordinary/200% root text at 320 × 720 CSS pixels.
Native Tab/Shift+Tab, Enter, Space, ArrowDown and Escape cover account menu entry/
return, branch expansion/collapse, all child focus stops, selected-route semantics,
drilldown/back, whole-navigation collapse/expand, reopening the drilled branch,
exact routing/selection callback logs and the native nav ref. Focus checks require
an outline, complete control geometry within viewport/scroll ancestors and native
center-point hit testing. The account trigger precedes the hierarchy; the account
portal retains theme/compact density and absent-host logout stays disabled.
No focus/scroll/event injection or corrective layout CSS supplies interaction
results; the only CSS override resizes root text. Runtime warning/error capture
is mandatory.

## Local validation and integration handoff

Node 24 via
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Atomic install/light validation slots were acquired before their commands and only
owned slots released. Commands completed successfully:

- `pnpm install --frozen-lockfile` (unchanged lockfile; existing ignored esbuild build-script notice).
- `pnpm exec vitest run src/components/SideNavigation` — 2 files, 28 tests pass.
- `pnpm exec tsc --noEmit` — source/story types pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` — browser types pass.
- `pnpm foundations:check` — owned imports/layers/tokens pass.
- `git diff --check` — pass.

No full check, package build, Storybook build, browser suite or independent server
was run in this worktree. Coordinator owns candidate integration, one fresh build
and the focused Chromium execution:

```sh
pnpm exec playwright test tests/browser/batch65-side-navigation-native-flow.spec.ts --project=chromium
```

Story ID: `navigation-sidenavigation--native-hierarchy`.
Firefox/WebKit are deferred checkpoints, not established evidence. Browser runtime
results, packed consumers and current-head CI remain unverified here. Actual
browser chrome zoom, physical-device input, spoken assistive technology and broader
M-09/U/X acceptance remain open. This report makes no completion-checkbox claim;
coordinator alone owns integration and acceptance reconciliation.
