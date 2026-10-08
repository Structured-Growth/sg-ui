# Batch168 modal container boundary

Parent: C-08 (partial; remains open).
Baseline: `1948d0b54688cf61dfa6708fd94cbc8ca6e21990` (`codex/dev`).
Implementation: `8617963d9c46fc6e69264cdca30bdd552ba19c87`.
Worktree: `/Users/thomashall/.codex/worktrees/eacf/sg-ui`.
Branch: `codex/batch168-modal-container-boundary`.

Before edits, `git status --short` was empty, HEAD matched the authorized baseline,
and `git worktree list` confirmed a distinct managed checkout from the primary and
dev-integration checkouts. No other worktree or primary image-upload work was edited.
All seven changed paths are within the exclusive allowlist.

## Change and prepared native evidence

AppModal merges its root class with consumer className on the existing AriaDialog
through Dialog. The root owns `sgui-app-modal` inline-size containment. The query
below 30rem stacks steps and full-row actions, retains wrapping, and permits
long body/step text to break. Surface dimensions, portal/overlay containment and
Dialog implementation remain unchanged. See the [local surface contract](../react-aria-modal-container.md).

The `ContainerBoundary` story opens independent narrow (360px) and wide (800px)
portaled dialogs sequentially, then toggles actual surface width without remounting.
It uses existing owned controls and shared scopes/tokens. The unit regression
covers dialog/ref identity, merged consumer classes, native surface/body style
slots, preserved focus during resizing and retained steps/actions.

`tests/browser/modal-container-boundary.spec.ts` prepares five native cases:

- Independent narrow/wide surfaces at a 1440px viewport: local container identity,
  portal independence, measured width, step/action geometry, initial/return focus;
  light/comfortable and dark/compact variants.
- Native keyboard-triggered live width changes: measured width, changed footer
  arrangement, visible surviving focus and unchanged viewport.
- Narrow tabbed body: native Tab through twenty fields into both actions,
  selected-panel scroll progress, stationary sticky tabs and no whole-dialog scroll
  while chrome fits.
- Enlarged text at a wide but short viewport: native focus through fields/actions,
  whole-dialog scroll fallback, compact footer and no horizontal dialog overflow.

These cases are prepared, not passed native evidence. No editor dialogs were changed.

## Actual targeted validation

Node **24.21.0**, pnpm **10.29.3**, using
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin` first in PATH.
`pnpm install --frozen-lockfile` exited 0 under an owned canonical install slot0;
pnpm reported its existing ignored esbuild build-script warning.
Light checks held canonical slot1, with unique batch168 UUID owner tokens;
helper cleanup verified ownership and released only owned canonical/transition
claims. Foreign batch85 light slot0 was untouched.

The following passed against the working bytes committed in the implementation
head above (no clean-committed pre-run assertion is made):

| Command | Result |
| --- | --- |
| `pnpm exec vitest run src/components/AppModal/AppModal.test.tsx --maxWorkers=1` | 9 tests passed, 0 failed, 0 skipped |
| `pnpm typecheck` | Exit 0, production and story types |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Exit 0; rerun after adding native theme/density variants also exited 0 |
| `pnpm foundations:check` | Exit 0, owned import/layer/token guards |
| `pnpm tokens:check` | Exit 0 |
| `git diff --check` | Exit 0 |

No failed checks occurred. No Storybook build, native/browser execution, full
check, package/consumer run, CI or manual/device/assistive-technology check ran.
Coordinator validation is requested from the final reviewed committed head:
fresh Storybook plus this unique spec in Chromium first, with Firefox/WebKit
pending the coordinated checkpoint. Native width, geometry, focus and scrolling
remain unverified until that run. No parent checkbox, shared ledger or broad
acceptance gate was closed; integration/push remain coordinator-owned.

## Implementation SHA-256

The evidence-only follow-up commit does not change these six implementation files.

| Path | SHA-256 |
| --- | --- |
| `src/components/AppModal/AppModal.tsx` | `c6ff7b325e31461af7bd607737d6e7df085d836e45152a76f21b2c1918b822df` |
| `src/components/AppModal/AppModal.module.css` | `924f101e70f48856d5cabffaa1ae48375b1ab112b9741349236c4fc51ba80078` |
| `src/components/AppModal/AppModal.stories.tsx` | `e6f19d8821a8efa3365673c65602e7404e897be1ef6403d31365ee8d6a07e3c1` |
| `src/components/AppModal/AppModal.test.tsx` | `44f54f91b6f8b61847f56798a05a547d128f3321ac672cd73bbe1d38508abbf9` |
| `docs/developer/react-aria-modal-container.md` | `c21a713f39e8d9c1f97a14ec8c81e2d5e533da6bb031f50589905b555ccc0f96` |
| `tests/browser/modal-container-boundary.spec.ts` | `99b4954ab82cc668ec28c5f840b6b8610e4982416fdbffeb682e1440724edf4c` |
