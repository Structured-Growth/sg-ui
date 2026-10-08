# Batch 160: packed editor insertion selection correction

Prepared on 2026-10-07 (America/Chicago) in the clean isolated managed worktree
`/Users/thomashall/.codex/worktrees/3c03/sg-ui`, verified at exact baseline
`fdad564100ef336d8a278bbb907386ccfecc9a10` before edits. Branch:
`codex/batch160-packed-editor-selection`. Scope is this report and
`scripts/fixtures/editor-packed-browser/editor.spec.mjs` only.
Parent packed/editor acceptance X-17, X-20, R-01 and Z-11 remains open.

## Retained original red

The coordinator tested candidate `13cca2f6a6cb9b0f7ef5810d501f45d399b71027`
on Node 24 / React 18.3.1 / Chromium. All sequential SSR, hydration, native
bold/plain editing, exact serialized reload, read-only and editorKey replacement
checks passed before the final append assertion failed. Replacement text retained
format 1; ` after reset` was a separate format 0 node. React 19 was UNRUN.
The fixture clicked the re-enabled editor and navigated to its end without
establishing or observing active bold insertion. This supports a fixture
expectation correction, not a confirmed production defect. The precise native
selection/inheritance mechanism remains unclassified.

Read-only review and original raw red are retained outside this worktree:

- `/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/packed84-first-native-cause-review.json`
- `/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/native-evidence/packed84-first/`

The raw `editor-react-18.3.1-c668a6a6-db59-487d-a927-8cbd01143af6-chromium-failure.json`
records the format mismatch and an empty page-error list; its screenshot, trace,
metadata and coordinator logs remain retained. No red evidence was overwritten.

## Bounded correction

After the existing trusted click/end-navigation, the case locates the course
section's visible Text formatting group and Bold button. It requires a boolean
`aria-pressed` state, uses `ControlOrMeta+B` only when that state is false, then
requires active bold and editor focus before typing. Scoping excludes the separate
DocumentEditorToolbar's always-active Bold example. No new click, script focus,
selection assignment or Lexical mutation is introduced.

All earlier assertion bytes and the final combined-text/format-1 JSON assertions
are unchanged. Removing the eleven inserted lines reproduces the complete
baseline spec byte-for-byte (verified with a Python assertion against `git show`).
Corrected spec SHA-256:
`32710ec67c68d0e90065d7995a2b74d64947167236cecdecf20dfa998ae06261`.
The completion report records the commit head and both final file hashes, avoiding
a self-referential hash inside this report.

## Targeted preparation checks

Initial preparation used the existing batch-84 atomic slot-wrapper pattern with
unique batch160 owner tokens and exact owner verification on release, before the
coordinator supplied the canonical helper instructions. Node 24.19.0 / pnpm
10.29.3: frozen install, integrity (4/4) and fixture types all passed. Logs:
`/tmp/sgui-batch160-install.log`, `/tmp/sgui-batch160-integrity.log` and
`/tmp/sgui-batch160-types.log`. Ignored esbuild build scripts were reported.

After receiving the coordinator's protocol, the checks were recaptured using
`acquireInstallSlot`, `acquireLightSlot`, `runOwnedCommand` and `releaseLease`
from `/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/scripts/browser-validation-pool.mjs`.
Each lease owner includes chat `01a11946-35ac-7590-bf04-c092a3a52dea`, batch160
and its command purpose. Each returned exact lease was released after settlement;
foreign light slot0 was untouched, with four light/two install slots unchanged.
Canonical runtime `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`
is Node 24.21.0; its directory was prefixed on PATH for pnpm 10.29.3.

- PASS: `pnpm install --frozen-lockfile`, own install slot0.
- PASS: `node --test scripts/fixtures/editor-packed-browser/integrity.test.mjs`,
  own light slot1, four tests. Covers strict JSON oracle rejection, packed opt-in
  SSR/client wiring, JSX parsing and runner/helper/spec syntax.
- PASS: `pnpm exec tsc -p scripts/fixtures/editor-packed-browser/tsconfig.json`,
  own light slot1, including Playwright locator/keyboard assertion types.
- PASS: `git diff --check` and byte-preservation comparison described above.

Canonical command/lease manifest: `/tmp/sgui-batch160-canonical.log`.
Outputs: `/tmp/sgui-batch160-canonical-{install,integrity,types}.log`.
Each corresponding `.log.resources.json` reports exit code 0, `settled: true`
and no remaining owned processes in the final sample.

## Pending coordinator proof

No builds, packing, browser runs or full checks were performed here. The corrected
native step is unverified until the coordinator builds a fresh reviewed shared
candidate and sequentially runs the actual packed React 18 and React 19 Chromium
consumers with zero retries. Firefox/WebKit, device, IME, AT and broad acceptance
remain open. If active Bold is true but inserted JSON remains plain, retain that
new red and reserve a bounded production investigation rather than weakening the
serialization oracle. No production code, primary image-upload work, shared state,
CI, pushes, merges or publication changed.
