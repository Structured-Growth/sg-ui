# Batch167 navigation shell container boundary

C-08 bounded slice; no parent acceptance closure. Prepared 2026-10-08.

## Isolation and implementation

Managed worktree `/Users/thomashall/.codex/worktrees/3edb/sg-ui` was verified clean,
separate from the primary checkout and all other listed worktrees before editing.
Baseline: `1948d0b54688cf61dfa6708fd94cbc8ca6e21990` (`codex/dev`).
Branch: `codex/batch167-navigation-shell-container-boundary`.
Implementation commit: `3c39ac07ca2b2529e10ef707471b1d67c70f70f3`.

The root owns `container: sgui-app-shell / inline-size`. An internal flex wrapper
lets the shell-local 40rem query change descendant layout. The existing stacked
navigation cap, full-width collapsed navigation, main overflow, root native
ref/class/style, region hooks and main ID/name are preserved. SideNavigation is
unchanged. [Host contract](../react-aria-navigation-container.md) covers external
width allocation, intrinsic sizing, default/host block size and stable SSR.

The deliberate embedded-width behavior and DOM wrapper change are marked
`fix!` with a `BREAKING CHANGE` footer. Immediate-root-child part selectors must
become descendant selectors. Public prop names remain unchanged.

## Authorized existing browser observation correction

The coordinator explicitly expanded the exclusive allowlist to
`tests/browser/inventory-shell-responsive.spec.ts`, solely for its layout
observation. The exact old expression was:

```ts
shell.evaluate(element => getComputedStyle(element).flexDirection)
```

The exact new expression is:

```ts
shell.locator('main').evaluate(element => getComputedStyle(element.parentElement!).flexDirection)
```

The wrapper now owns the flex axis; the root is the containment owner and cannot
be selected by its own query. All existing geometry, scrolling, focus, host value,
collapse and overflow assertions are retained unchanged. No assertions weakened.

## Actual targeted checks

Runtime: Node **24.21.0**, binary
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`.
`pnpm install --frozen-lockfile` passed under canonical install slot0, owner
`batch167:install:17788`, with its legacy transition claim and exact-owner release.

Initial lightweight admission failed closed with
`Validation slots occupied; no work started`. No validation commands ran under
that failed attempt; foreign batch85 slot0 was never modified or reclaimed.

Later canonical light slot1 admission, owner `batch167:targeted:27694`, ran:

| Command | Result |
| --- | --- |
| `pnpm exec vitest run src/components/AppShell/AppShell.test.tsx src/components/AppShell/AppShell.ssr.test.tsx` | 2 files, 6 tests passed |
| `pnpm typecheck` | exit 0 |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | exit 0 |
| `pnpm foundations:check` | exit 0 |
| `pnpm tokens:check` | exit 0 |

These checks ran against the working implementation on the stated baseline before
commit; all tested component/story/new-spec blobs match the implementation commit
below. The existing browser observation correction followed its first typecheck.
A second browser typecheck passed on clean exact implementation head
`3c39ac07ca2b2529e10ef707471b1d67c70f70f3`, canonical light slot1 owner
`batch167:corrected-browser-types:37576`. Both light leases included the legacy
transition guard and released exact-owner claims in `finally`. `git diff --check`
passed. No unrelated installation/source edits were made.

## Prepared native cases and remaining dependencies

`IndependentContainers` supplies simultaneous 20rem and 56rem shells in the same
wide viewport, host resize controls, long navigation/content and unsaved fields.
`navigation-shell-container-boundary.spec.ts` prepares six cases:

- Light/dark × LTR/RTL: independent stacked/rail geometry in a 1440px viewport;
  host resize both ways; unchanged main/field DOM identity and value; wide collapsed
  rail width; stacked full-width collapse/expansion and trigger focus.
- Light/dark: host width changes across 641/640/639/320/896px while main input
  retains visible keyboard focus and value; other shell stays wide; wheel/main
  scroll, navigation scroll and second-shell main scroll remain independent;
  native sequential Tab reaches all twelve main actions with visible focus.

The short main region and viewport-relative 45dvh cap are exercised at 800px
viewport height with host block size 36rem. This is not acceptance for every host
block-size allocation. Existing fullscreen responsive cases remain prepared with
the corrected observation.

**No Storybook build, native browser execution, full suite, packed consumer,
physical-device or assistive-technology run was performed in this batch.**
Request coordinator-owned fresh focused Chromium proof of both specs on a clean
candidate including this commit, then Firefox/WebKit in the authorized accumulated
checkpoint. The old frozen daily checkpoint cannot prove this new source. Browser
source typechecking does not establish geometry, scrolling or native focus passes.
Broad C-08 and native/device/AT acceptance remain open. Integration/push remain
coordinator-owned; no PR, push or acceptance ledger mutation was performed here.

## Exact implementation Git blobs

| Path | Blob |
| --- | --- |
| `src/components/AppShell/AppShell.tsx` | `a13296e3915afd5560f1f065b2a4ab226f68acbf` |
| `src/components/AppShell/AppShell.module.css` | `e82721813de144f9d33f51c13aa40370ad288260` |
| `src/components/AppShell/AppShell.stories.tsx` | `e9c1e45f6ea95de5608f95d3935be4920b2acde3` |
| `src/components/AppShell/AppShell.test.tsx` | `438a8f2425faf749cbfc4fa88078d62d77f3abf2` |
| `src/components/AppShell/AppShell.ssr.test.tsx` | `99604b17f5392b477124531a4bd0efdde4fa74c7` |
| `docs/developer/react-aria-navigation-container.md` | `d2a32640adaf6bdc78186d8df9cca06fa25701ae` |
| `tests/browser/navigation-shell-container-boundary.spec.ts` | `e20f8eae7b49a3bd4e0489876153d0d2f307b2c1` |
| `tests/browser/inventory-shell-responsive.spec.ts` | `b3a7eb857f48b760e345874d8a76c82b529de5d3` |

The evidence-only commit follows the implementation commit and leaves these blobs
unchanged. Raw command output is retained in this chat's tool results.
