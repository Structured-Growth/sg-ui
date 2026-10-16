# BUG-0011 / A-K-17 — K17-callback-reason-access

Implemented in the shared modified `dev` checkout based on `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. This closes the reproduced callback-reason implementation gap; it does not close full A-K-17 native/AT acceptance.

## Reproduction and change

Read AGENTS.md, the final acceptance ledger, wave-02-11/report.md, and the exact GAP K17 probe in wave-02-11/acceptance.test.tsx. That probe characterizes a dynamically unavailable October 16 with no reason text, disclosure or button description. Its negative characterization remains historical evidence and was not edited.

Calendar now resolves static-first availability explanations for each date and attaches a visually hidden reason through `aria-describedby` on the native interaction element. This follows DateRangeSelector's existing private CalendarCell ref bridge because CalendarCell filters labelable ARIA props. The engine retains its complete localized date name, selected/disabled/read-only semantics and keyboard interactions; decorative day content remains aria-hidden. Cleanup removes only the bridge's own ID, retaining host references across callback/selection replacement and callback removal.

The existing translated native details/summary disclosure now includes callback explanations for the visible calendar interval, in addition to all static records. It refreshes when months or policies change, remains operable in disabled/read-only calendars, and supports keyboard and pointer/touch disclosure without hover. Static records win for a date present in both sources, matching the range selector policy. No data fetching or upstream public type was introduced. DatePicker already composes Calendar and inherits this behavior without another implementation edit.

## Focused evidence

Node path first in PATH: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin` (v24.21.0). Vitest v4.1.11 / jsdom, cwd `packages/ui`.

- `pnpm exec vitest run src/experimental/Calendar/Calendar.test.tsx src/experimental/Calendar/Calendar.native-locales.test.tsx`: 2 files / 9 tests passed before adding the new tests (17:47:31 runner timestamp; 1.37s). The unchanged locale suite supplies five cases: multiple selection/focus, Sunday/Monday headers, Arabic RTL and Hebrew display/Gregorian values. No runtime implementation change followed this run, apart from removing a blank line.
- Final `pnpm exec vitest run src/experimental/Calendar/Calendar.test.tsx`: 1 file / 10 tests passed (17:48:22 runner timestamp; 1.12s). Includes original four tests and six new cases: static/callback keyboard focus and nonselection; callback/controlled-selection replacement/removal retaining host description references; disabled; read-only; static removal/month navigation; composed DatePicker disclosure and disabled selection.
- `git diff --check -- packages/ui/src/experimental/Calendar/Calendar.tsx packages/ui/src/experimental/Calendar/Calendar.test.tsx`: passed.

Earlier new-test runs failed on assertion assumptions: October 16 is today in the execution environment and its full name includes Today; clicking an already selected date invokes the existing callback; disabled calendars omit the selected suffix from their date name. Tests now match complete-name substrings, clear the initial selection callback before blocked-date activation, and compare native selection state before/after. No implementation behavior was changed to satisfy those assumptions. An initial append command used the wrong cwd and did not write a file; it was corrected before the new test runs.

## Boundaries and follow-ups

Only Calendar.tsx, Calendar.test.tsx and this fix-09 report/results were written. Existing shared changes were preserved. No staging, commits, installs, builds, generated outputs, server changes, browser/consumer suites or release operations.

DOM tests establish associations and disclosure activation, not actual spoken descriptions or physical touch behavior. Callback disclosure covers the visible interval rather than enumerating an unbounded callback policy. Host reasons remain host-supplied strings. Coordinator must validate the frozen docs fixture/native keyboard/touch flows, actual AT output and final integrated build; full AT/device acceptance remains separate. DatePicker source was read and hashed as a shared dependency; its worker may subsequently change it, requiring coordinator reconciliation. No full production typecheck was run under the instructed suites-only scope.

Exact source/test/dependency SHA-256 hashes are in results.json. The original GAP K17 negative probe is superseded by the positive colocated tests and should not be treated as a current expected behavior test.
