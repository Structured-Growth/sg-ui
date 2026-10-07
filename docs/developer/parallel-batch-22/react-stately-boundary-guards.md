# React Stately boundary guard prerequisite

This guard slice precedes the owned DateField lower-level hook facade acceptance.
It does not implement DateField or establish functional calendar acceptance.
See the [owned architecture](../react-aria-architecture.md) and
[calendar contracts](../react-aria-calendar-contracts.md).

The isolated managed worktree started at reviewed dev commit
`ed6fb07995d6e837da11cc72aea56d49be70452d`, which already includes direct
`react-stately` 3.50.0 and `react-aria` 3.52.1 dependency prerequisites.
The dependency report belongs to the separately reserved
`docs/developer/parallel-batch-21/datefield-public-hook-dependencies.md`.

## Guard changes

- Source module references are parsed with the existing TypeScript development
  dependency. React Stately root/subpaths and scoped state packages follow the
  existing registered interaction implementation allowlist. DateField is already
  registered; no registrations or component-test requirements were relaxed.
- Static imports/reexports, side-effect imports, import types, dynamic literal
  imports and literal require references are checked. Relative references use
  the same parsing in the migrated/public transitive audit, including type-only
  helper references outside the directly visited directories.
- A common declaration assertion retains all previous upstream prohibitions and
  adds React Stately root/subpaths and scoped state packages. Recursive owned
  declarations, explicit grid/root checks, every declared public entry point and
  wildcard icon declarations use it.
- The scripts expose guard functions for targeted fixture testing while retaining
  their normal direct CLI execution. Fixtures import the real guards; declaration
  checks need no package build or runtime component imports.

## Targeted evidence

Validation used Node **24.21.0**, pnpm **10.29.3** and a frozen-lockfile install
under an atomically acquired install slot in `/tmp/sgui-install-slots`.
Targeted tests/source checks acquired one of the four shared light slots in
`/tmp/sgui-light-validation-slots` and released it after completion.

| Command | Result |
| --- | --- |
| `node --test scripts/react-stately-boundaries.test.mjs` | Four tests passed |
| `node scripts/check-foundations.mjs` | Actual repository source/layer/token guard passed |
| `node --check scripts/check-foundations.mjs` | Passed |
| `node --check scripts/check-package.mjs` | Passed |
| `git diff --check` | Passed |

The tests cover allowed public `useDateFieldState` imports inside the registered
DateField implementation; denied ordinary owned/shared/public modules across
multiple module-reference forms; actual CLI source fixtures rejecting both a
visited helper and a public-barrel dependency reached through a relative import
type; and temporary root/granular/grid declaration fixtures rejecting upstream
state references while accepting an owned serializable DateField contract.
Previous React Aria and other upstream declaration bans also have regression cases.

Local logs: `/tmp/sgui-batch22-stately-install.log`,
`/tmp/sgui-batch22-stately-tests.log`, and
`/tmp/sgui-batch22-stately-foundations.log`.

Per the requested targeted validation policy, no full package build/check,
Storybook, browser/server suites or CI runs were performed. The actual emitted
DateField declarations and functional behavior still require the owning worker's
acceptance. This slice adds a standalone Node test file; adding it to the
`test:foundations` package script requires a follow-up reservation for
`package.json`, outside this worker's write allowlist. The production guards
already execute through their existing package commands.

Only the two guard scripts, the new test file and this evidence report changed.
The coordinator owns integration; no main merge, publication, version, license,
workflow permission or secret changes are included.

## Coordinator review

The coordinator independently repeated all four fixture tests and the actual source guard under Node 24.21.0: passed. After reviewing the exact four-file worker scope, the coordinator merged the full history and reserved the now-free package script scope to include this fixture in `test:foundations`. No functional DateField gate is closed.
