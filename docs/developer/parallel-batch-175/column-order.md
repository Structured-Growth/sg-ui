# Batch 175: non-drag catalog column order (F-C20-05)

Base: `c0602df46c3f521811c1895a37fa9a932733e6ab` (`codex/dev`).
Tested implementation head: `9cb200a55aed7c10cb858cb5c66d348d84a7900a`, clean before validation.

## Contract and bounded implementation

The coordinator's fixed `functionality-resolutions/grid-contracts.json` and
`functionality-resolution-review-b.json` under
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f`
identify F-C20-05 as a genuine missing functionality slice. The approved
[catalog contract](../react-aria-grid-contracts.md) requires non-drag order controls;
existing visibility/reset evidence did not establish them. The
[development validation policy](../react-aria-development-validation.md) governs this run.

[Columns menu](../../../src/components/DataToolbar/components/DataToolbarColumnsMenu.tsx)
now renders compact owned Buttons named “Move {column} up/down”, translated with
`defaultMessage`, namespace and host-label values. Each activation swaps adjacent
entries in the **complete** controlled option array, including when search hides
other entries. It preserves every option and visibility value. Full-array ends
disable the corresponding move button. Locked means visibility-only: locked text
columns remain movable. The existing onChange → onColumnOptionsChange → shell
setOrder path remains the only state engine; catalog normalization retains all
menu/action fields last. The generic menu has no action-field metadata and makes
requests; the catalog remains final authority. Reset still shows all columns in
current order; dismissal still clears search.

The [new production-scope story](../../../src/components/DataToolbar/DataToolbar.column-order.stories.tsx)
uses a controlled AppDataGridShell host, accepts order/visibility callbacks, starts
Notes hidden, and exposes host snapshots. Story ID:
`data-display-datatoolbar-column-order--controlled-host-order`.
Storybook already supplies production tokens and compiled component styles.

Two new bounded smoke cases establish full-array keyboard/pointer movement and
one primary controlled shell composition, including hidden Notes, movable locked
Name and actions-last normalization. Existing menu visibility/locks/reset cases
are reused. No new API, barrels, shared tokens or additional state owner.

## Targeted evidence

Runtime: Node `v24.21.0`, executable
`/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`;
`/opt/homebrew/bin/pnpm` v10.29.3 with that Node directory prepended to PATH.
Missing dependencies were installed with exact argv `pnpm install --frozen-lockfile`
under an owned canonical install lease; manifest/lockfile unchanged. Install log
`/tmp/sgui-batch175/install.log`, SHA-256
`58a185897f8954cf19fbc4595a60fe06db35e248a6d05f3676117083e2967f0c`.

Validation used the canonical four-slot helper at light slot1 plus its legacy
transition guard, with exact owner verified before both claims were released.
Owner: `batch175:9cb200a55aed7c10cb858cb5c66d348d84a7900a:0781f117-3222-4d8d-a0cb-7ac079f04204`.

- Executable `/opt/homebrew/bin/pnpm`, argv `["exec", "vitest", "run", "src/components/DataToolbar/components/DataToolbarColumnsMenu.test.tsx", "src/components/AppDataGridShell/AppDataGridShell.test.tsx"]`: exit 0. Log `/tmp/sgui-batch175/units.log`, SHA-256 `4ed9dab260e38dab069ddf18d059a7bae1971da02cc99df6d6e8015d7400c923`.
- Executable `/opt/homebrew/bin/pnpm`, argv `["exec", "tsc", "--noEmit"]`: exit 0. Log `/tmp/sgui-batch175/types.log`, SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- Executable `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`, argv `["scripts/check-foundations.mjs"]`: exit 0. Log `/tmp/sgui-batch175/foundation.log`, SHA-256 `91ae87aafa42b6d52479120b5e5d041d0efba241063d18f6fd72725a380b381e`.
- Executable `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`, argv `["scripts/tokens.mjs", "--check"]`: exit 0. Log `/tmp/sgui-batch175/tokens.log`, SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Unit result: **2 files, 30 tests passed**. Type/import/layer/token checks passed.
`git diff --check` passed. Exact head/executable/argv/lease/hash manifest:
`/tmp/sgui-batch175/validation-3.jsonl`, SHA-256
`2cb03c354be78e289fcbfa0c726c498f49c7ef60e15d564f43f1a9aacfb571d7`.

Retained red evidence is fixture-only: at `52bac526495af98ddd9f9e9e8f77cd9f4e1f2b9b`,
the test queried a grid hidden from the accessibility tree by the open dialog.
It now inspects the captured rendered grid with hidden headers included. Log
`/tmp/sgui-batch175/units-red-52bac52.log`, SHA-256
`6b5b4df914b87fee7c59270d06ea89ff0de799d19e8fb3243cca39225caad228`.
At `830de049d0c04f8c139c6fc051879b454c7d1f80`, a new label-text assertion included
Checkbox's decorative check mark. It now compares the ordered checkbox nodes
resolved by accessible name. Log `/tmp/sgui-batch175/units-red-830de04.log`, SHA-256
`937ac8041692ce88706826400dcacdc58d8d1f8b43e675f0da83c85fd3bb0f77`.
No product assertions were weakened; both runs' types/guards passed.

## Ownership and limits

Only the six coordinator-approved paths changed: columns-menu TSX/CSS/test, the
new column-order story, shell test and this record. Frozen batch165 toolbar stories,
CSS/native-composition/browser files and central checklists/state are untouched.
Source remains reserved until independent review and coordinator-owned focused
Chromium proof. No native/browser/Storybook build, full check, package, regression
matrix, visual/accessibility audit, device/AT or production acceptance was run.
F-C20-05 and original G-12/broad acceptance remain open; this record does not close them.
This evidence commit changes documentation only after the tested source head.
