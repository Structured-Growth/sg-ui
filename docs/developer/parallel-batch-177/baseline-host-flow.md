# BASE-002: one host-owned functionality smoke fixture

## Reconciliation and result

The starting source is `e4e60bd8e890c5a6daa69b3dd2c3d2b6077bb39d` (`codex/dev` snapshot). Existing component stories/tests and execution evidence establish smaller navigation, dialog, card and editor slices, but no accepted single host story and actual proof connecting all four was found. BASE-002 remains open pending coordinator review and fresh native proof.

[BaselineHostFlow](../../../src/foundation/BaselineHostFlow.stories.tsx) is a fixture under the production Provider using existing owned AppPageTabs, AppModal, AppButton, TextField, ClassCardFrame and PageRichTextEditorSection. Host state supplies section navigation, form submission, created-course data, card activation and saved editor JSON. No backend, routing dependency, upload, component API, runtime implementation, token or export changes were added. Consumer labels are host-owned example text.

There is one composed [unit smoke](../../../src/foundation/BaselineHostFlow.test.tsx) and one [browser case](../../../tests/browser/baseline-host-flow.spec.ts), not another per-component matrix. The unit follows Courses navigation → create modal → native associated-form submission → course card → edit action → selected Introduction panel and real contenteditable. It verifies the host navigation values, exactly one submission and the opened course title. It does not emulate Lexical native typing. The browser case follows the same flow, types `Welcome to Course basics` with native browser keyboard input, checks exact serialized paragraph text received by the host callback and attaches the saved JSON.

## Worker validation

Executed with Node `v24.21.0` at `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`, in `/Users/thomashall/.codex/worktrees/2f3e/sg-ui`. Each command used canonical `runOwnedCommand`; install used `acquireInstallSlot` (install capacity 2), other commands used `acquireLightSlot` (light capacity 4). All acquired leases released after settlement. Receipt files at `/tmp/sgui-batch177-<name>.log.receipt.json` preserve full argv, executable, timestamp, head, input hashes and resources log hash. These runs used the parent HEAD plus the uncommitted exact fixture hashes below; the fixture content is unchanged in the delivered commit. No claim that native browser execution passed is made.

| Check | Exact Node argv | Result | Log SHA-256 |
| --- | --- | --- | --- |
| `install` | `/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs install --frozen-lockfile` | passed | `4838a8ea53b1491a1c07dd071c39d4b4c0984fc93c50237fe23d05ccd684d6ed` |
| `units` | `/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs exec vitest run src/foundation/BaselineHostFlow.test.tsx` | passed | `adc79c1a4e06666467905f2faf754a384cc5cdd744eb263bb6a47cc3ec1d0dd6` |
| `types` | `/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs typecheck` | passed | `c69295502cf3c94bdfcbc5cfd3cbe0464af37c821c4a6c00479dd574265d7dcd` |
| `browser-types` | `/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs exec tsc --noEmit -p tests/browser/tsconfig.json` | passed | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `foundations` | `/opt/homebrew/lib/node_modules/pnpm/bin/pnpm.cjs foundations:check` | passed | `b080040244a19b1081c15c8e4ef1c9484f03489deeaaf48003121bc25ed23244` |

Validated input SHA-256:

- Story: `af8c2b934d22eba75442057ab2339f1a020262e0617a5ee9b14c8adc19c0f78e`.
- Unit: `3a7d67445302eef75713fe4b84774852d2f741d453a930cba2f6be56cee38929`.
- Browser case: `178c39a7bc99875a6fb25ba6d64ccd79320b6e86fbeb07e3d21dc6939c1dbd7e`.
- Lockfile: `786f56018e5278bc36f59b02d0c2d2ee0ab2df7fc7883178aeb4b9deb3d13438`.

`git diff --check` passed. Unit result: one file / one test passed. Type and foundation checks passed. No broad build, Storybook build, browser run, packed-consumer run or full check was performed by this worker.

## Coordinator prerequisite and limits

Review the four reserved files and include this commit in a shared candidate. Under the coordinator's heavy/browser ownership, build fresh static Storybook at that exact candidate head, then run only `pnpm exec playwright test tests/browser/baseline-host-flow.spec.ts --project=chromium` with the canonical owned browser runner. Story ID: `foundations-baseline-host-flow--primary`. Do not rebuild during the suite. Record tested head, argv, logs and observed outcome before closing BASE-002. Source remains reserved until coordinator review/proof; central master/baseline/execution checklists were deliberately not changed.

This is a primary host composition functionality smoke using a card (the permitted cards/grid alternative). It does not prove grid operations, backend persistence, routing adapters, uploads, rich formatting, reload/undo, additional themes/densities/engines, visual/accessibility, physical device or assistive technology acceptance. Existing wider evidence and later T/V/A gates retain their separate ownership.
