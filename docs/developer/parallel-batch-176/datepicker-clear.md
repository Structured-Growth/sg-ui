# DatePicker explicit Clear — batch176

F-P42-02 / bounded successor F-P42-02-a: implemented for coordinator review.
Base: `c0602df46c3f521811c1895a37fa9a932733e6ab`.
Tested source commit: `150aa7ae8e33901364da4f8963628f1c1efb3b99`.

The reviewed primitive-contract resolution and independent resolution-review-b
retain opening/selection/dismissal evidence but identify missing explicit Clear.
DatePicker now renders a translated owned Clear button inside its popup for a
nonempty optional editable date. It requests `onValueChange(null)` once through
existing `change`, closes the popup and uses existing Popover trigger-focus return.
Uncontrolled fields serialize an empty date; controlled hosts retain authority
and can accept or reject null. Required, disabled, read-only and empty fields omit
Clear. Native reset still restores uncontrolled defaults silently and leaves
controlled values host-owned. DateField, shared reset and native transaction files
remain unchanged; integrated batch73/batch140 corrections are preserved.

The existing first smoke now covers selection, Clear, empty form serialization,
close/focus and silent default reset. The existing second smoke checks controlled
rejection/accepted empty state and required/read-only/disabled guards. No new test
case or matrix was added. Default production Provider-scoped story describes the
flow; its native-reset story now accepts controlled requests with host state.

## Targeted validation

Node executable: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`
(`v24.21.0`). Commands ran with canonical owned installs2/light4 leases and
recorded process settlement before release. The runner and raw logs/receipts,
including actual argv, input hashes, tested HEAD, outcome and resource-log hashes,
are preserved in:
`/Users/thomashall/.codex/visualizations/2026/10/08/01a11b98-f7c7-7841-9c20-af53b35e7f46/batch176`.

- Frozen install: `pnpm install --frozen-lockfile` passed.
- `pnpm exec vitest run src/experimental/DatePicker/DatePicker.test.tsx src/experimental/DatePicker/DatePicker.native-transactions.test.tsx src/experimental/DateField/DateField.test.tsx`: final 3 files / 23 tests passed.
- `pnpm exec tsc --noEmit`: passed.
- `node scripts/check-foundations.mjs`: passed.
- `node scripts/tokens.mjs --check`: passed.

| Retained log | Outcome | SHA-256 |
| --- | --- | --- |
| install | passed | `b7f2dc63e476ebf7c7be7d79113ecc6bc42190faf767e5d95d0fe4dc55b9e820` |
| units | failed | `23e059199f2cba800f3f6bf966bd3b2f820fe4eafd4573b4e16ad2c396cfcac2` |
| units-final | passed | `5f6a7e8c34166ded4969f321e6c30ceb7d87a9fe7afed1ce2937309981481797` |
| types | passed | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| guard | passed | `91ae87aafa42b6d52479120b5e5d041d0efba241063d18f6fd72725a380b381e` |
| tokens | passed | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The first units run retained one test assertion failure (22 passed, 1 failed):
the controlled smoke incorrectly queried a selected calendar button using
`pressed`. Corrected to inspect the actual native named input's retained host
value; the primary Clear smoke already passed. No product assertion was weakened.
The first token attempt acquired no lease because all light slots were occupied;
no command ran. A later owned attempt passed.

## Limits and handoff

This is bounded functionality evidence, not whole calendar or T/V/U/K/AT acceptance.
Coordinator owns independent review, focused fresh Chromium proof and central
checkbox/integration decisions. No full check, Storybook, browser, packed consumer
or wider matrix ran here. Source reservation remains held until coordinator review
and proof. No primary/integration/central state files changed.

Contract: [calendar selection/reset](../react-aria-calendar-contracts.md#selection-and-drafts).
Policy: [development validation](../react-aria-development-validation.md).
