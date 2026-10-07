# Batch 11: AsyncMultiSelect visual direction audit

Bounded H-06/U-19 evidence on integrated baseline
`d0fcc6298004ad23d1a75480b216b39142e6df96`, branch
`codex/batch11-async-direction`, isolated managed worktree
`/Users/thomashall/.codex/worktrees/batch11-async-direction/sg-ui`.

## Finding and change

AsyncMultiSelect renders an inline TextField, selected-token buttons, status and
ListBox. It has no open state, popup or portal. Both the owned implementation and
the pinned React Aria ListBox render leave descendant visual direction inherited
from the nearest ThemeScope. Unlike Select/ComboBox Popover, this path does not
replace the visual direction with the interaction locale. The stable native
overlay direction bridge is therefore unnecessary; no implementation, API, CSS or
story behavior changed.

The previously absent composed direction case is now colocated in
[AsyncMultiSelect.test.tsx](../../../src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx).
It mounts English/RTL and Arabic/LTR selectors simultaneously, verifies independent
native direction/language ancestry, then reverses both scopes and updates host
description/loading props. Input/listbox DOM identity, search focus in jsdom, host
query values and independent selection survive. Supplied stale options remain
blocked during loading; direction updates emit no host query/selection requests.
This verifies native attribute inheritance, not rendered browser geometry.

Existing tests already cover ignored-abort late responses, late failures, Strict
Mode cleanup, retry/unmount, selected records outside current results, controlled
selection, independent serialization and native reset preserving the host query.
The existing [native reset browser cases](../../../tests/browser/batch05-native-reset.spec.ts)
remain the native-event evidence; they were inspected, not rerun here. Open-state
and overlay placement are inapplicable to this inline component.

## Local validation

Runtime: Node `v24.19.0`, pnpm `10.29.3`, Vitest `4.1.11`. Commands ran from the
isolated worktree with
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`:

- `pnpm install --frozen-lockfile`: passed; lockfile unchanged.
- `pnpm exec vitest run src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`:
  final run passed, 12/12 tests (11 existing and one composed direction case).
- `pnpm typecheck`: passed.
- `git diff --check`: passed.

An initial test adapter returned unformatted ICU fallback text; the fixture was
corrected to use the owned formatter. A subsequent busy-attribute assertion
exposed the separate finding below; the final direction regression verifies the
existing loading status and selection blocking instead.

No native interaction implementation changed, so no new Storybook build/browser
run was required. No shared heavy-validation lock was acquired or priority queue
modified. No full check/build/consumer suite or GitHub CI/title run was dispatched.
This follows the [development validation policy](../react-aria-development-validation.md).
No physical-device, assistive-technology or browser layout claim is made. The later
full matrix remains required; Firefox's existing environment prerequisite was not
retried. Broad H/U/X/R/Z gates remain open.

## Reserved follow-up and central guidance

The audit observed that `loading` supplies `aria-busy` to React Aria ListBox but the
rendered listbox lacks that attribute (jsdom reproduction). Loading status and
selection blocking work. Reserve a separate bounded AsyncMultiSelect native busy
attribute task, with an owned native ref if needed and focused browser evidence;
do not infer spoken assistive-technology acceptance from a DOM attribute.

Central guidance proposal: inline controls should inherit the owned visual scope;
use the stable overlay bridge only where an interaction implementation actually
replaces direction. Keep locale-driven keyboard behavior and host query/stale
response ownership distinct. No shared guidance file was edited in this task.
