# Popover collision and moving-anchor proof (U-19 / U-07)

Baseline: `007617d53600b258e001d69530fb74d672362222` (`codex/dev`).
This batch adds proof only. Popover runtime and all shared configurations are unchanged.

## Bounded fixture and assertions

- [Fixture](../../../src/experimental/Popover/Popover.collision.stories.tsx):
  four owned placement intents (`bottom start/end`, `top start/end`), fixed edge
  anchors and a separate scrollable host. The edge anchor intentionally opposes
  the requested vertical side, requiring a resolved flip. Host layout does not
  repair focus, overlay positions or clipping.
- [Composition tests](../../../src/experimental/Popover/Popover.collision.test.tsx):
  all four intents open named content via keyboard, inherit dark/RTL/enlarged
  token scope through the portal, expose editable controls and restore trigger
  focus after Escape. These jsdom tests make no placement/layout claim.
- [Native spec](../../../tests/browser/popover-native-collision.spec.ts):
  32 cases cover four placement intents, two host layouts, and four scope/text
  combinations (light/LTR/normal, dark/RTL/enlarged, light/RTL/enlarged,
  dark/LTR/normal). Every case opens by native pointer, edits via keyboard,
  resizes an open viewport from 640×720 to 420×640, reaches both controls via Tab,
  activates the second by pointer and dismisses via Escape.

The browser assertions require full overlay, dialog and control rectangles inside
viewport bounds and five-point native hit testing, actual resolved top/bottom
placement, vertical anchor adjacency and horizontal overlap. They check visual
scope/direction, English interaction locale, enlarged computed body text, retained
input/focus and unchanged document scroll. Each successful case attaches requested
placement and actual anchor/overlay/dialog/control rectangles at every stage.

Scrollable-host cases move the anchor by 32 CSS pixels using the native host
`scrollBy` API and require that exact measured displacement and updated overlay
adjacency while keyboard focus stays inside. A modal intentionally locks wheel
scroll outside itself; this does not claim physical wheel scrolling through a
modal. No mock rectangles, forced clicks, retries, manual focus repair or external
scroll reset hide failures. Enlarged shared CSS tokens are not browser-chrome zoom.

## Local validation before native authorization

Frozen-lock install passed using atomic install slot1, released by this owner.
Targeted light validation used atomic light slot0. Initial commands used the shell
runtime Node 26.5.0 / pnpm 10.29.3; this is not supported-runtime matrix evidence.

| Command | Outcome | Log |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Passed | `/tmp/batch83-popover-install.log` |
| `pnpm exec vitest run src/experimental/Popover/Popover.collision.test.tsx --maxWorkers=1` | 4/4 passed | `/tmp/batch83-popover-unit.log` |
| `pnpm exec tsc --noEmit` | Passed | `/tmp/batch83-popover-source-types.log` |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Passed | `/tmp/batch83-popover-browser-types.log` |
| `pnpm foundations:check` | Passed | `/tmp/batch83-popover-foundation.log` |
| `git diff --check` | Passed | No output |

## Pending native evidence

No Storybook build, browser run, packing or performance command has been executed
by this worker. Coordinator owns the build-once snapshot/native window and loopback
port. Proposed focused first run against the coordinator snapshot:

```sh
pnpm exec playwright test tests/browser/popover-native-collision.spec.ts --project=chromium --workers=1 --retries=0
```

Native acceptance, including whether all draft assertions pass, remains pending.
Firefox/WebKit belong to the later batch checkpoint. No production defect or fix
is claimed before native evidence. If a real runtime defect emerges, reserve its
exact corrective source scope with the coordinator before editing runtime files.
Broad U-19/U-07 and device/assistive-technology acceptance remains open.
