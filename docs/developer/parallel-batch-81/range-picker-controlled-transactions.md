# Controlled open DateRangePicker transactions — batch 81

Parent criteria: K-03, K-06, K-07. Baseline:
`007617d53600b258e001d69530fb74d672362222`.

This bounded evidence slice composes the controlled picker, mounted selector,
Apply requests, hidden native form endpoints and preventable native form reset.
Production source is unchanged; no product defect has been demonstrated.

## Prepared coverage

The new controlled-transactions story exposes an accept/reject host, exact request
and reset-prevention ledgers, actual form submission and external host endpoint
replacement. Alt+H replaces endpoints and Alt+P toggles reset prevention without
moving focus out of the calendar. January default endpoints deliberately differ
from the February controlled commit to detect accidental default restoration.

Three colocated tests verify rejected Apply/reopen, host acceptance, changed open
endpoints invalidating a pending anchor and prevented/accepted open reset.
The focused browser spec adds trusted keyboard Tab/Enter/arrow anchor setup,
actual `form.reset()` while calendar focus remains inside, retention and completion
of the prevented preview, accepted reset closing the picker without a request,
and both submitted endpoint values. FormData reads use the real form node even
while React Aria hides the host from the accessibility tree behind the modal.
Outside-month duplicates are excluded when locating native calendar buttons.

## Local preparation evidence

- `pnpm install --frozen-lockfile`: passed, `/tmp/batch81-range-install.log`.
- `pnpm exec vitest run src/experimental/DateRangePicker/DateRangePicker.test.tsx src/experimental/DateRangePicker/DateRangePicker.controlled-transactions.test.tsx`: 2 files / 5 tests passed, `/tmp/batch81-range-unit-3.log`.
- `pnpm typecheck`: passed, `/tmp/batch81-range-types-2.log`.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed on final browser spec, `/tmp/batch81-range-browser-types-final.log`.
- `pnpm foundations:check`: passed, `/tmp/batch81-range-foundations.log`.

Initial failures were fixture defects: querying the accessibility-hidden host form,
matching duplicate outside-month dates and supplying an unsupported Provider
locale prop. Red logs remain at `/tmp/batch81-range-unit.log`,
`/tmp/batch81-range-unit-2.log` and `/tmp/batch81-range-types.log`. Assertions of
transaction behavior were retained. No source reservation was required.

## Coordinator native window — pending

Use a fresh pooled Storybook snapshot containing this frozen commit. Do not build
or rebuild during the suite. Focused command, with coordinator-owned environment
and output paths:

```sh
pnpm exec playwright test tests/browser/range-picker-controlled-transactions.spec.ts --project=chromium --workers=1 --retries=0
```

The worker stopped before builds/native commands as instructed. No Chromium pass
is claimed. Firefox/WebKit await the batch checkpoint. Paste, autofill, IME,
physical devices, assistive technology and broad calendar acceptance remain open.
