# DateField public hook dependency prerequisite

Task references: U-18/K-06, bounded dependency prerequisite only. Recorded
2026-10-07 against reviewed dev baseline
`ae89e71047127d999311c7a65cb2c5a169ed4ccf` in the isolated, attached managed worktree
`/Users/thomashall/.codex/worktrees/datefield-hook-dependencies/sg-ui`.
Branch: `codex/datefield-public-hook-dependencies`.

## Purpose and verified public APIs

The [batch18 independent review](../parallel-batch-18/standalone-reset-review.md)
keeps prevented incomplete DateField draft preservation open: the day draft `28`
is lost after a host-prevented reset. The current wrapper owns complete ISO/null
values; incomplete segment state belongs to React Aria Components. This change
makes supported lower-level hooks directly available for the separately owned
DateField implementation work. It does not change DateField or prove preservation.

Adobe's [date field hook documentation](https://react-aria.adobe.com/DateField/useDateField)
and [state hook documentation](https://react-aria.adobe.com/DateField/useDateFieldState)
document the behavior/state split. Installed versions, rather than current web
examples alone, establish the exact import paths and signatures below:

| Direct runtime dependency | Public imports verified | Responsibility |
| --- | --- | --- |
| `react-aria@3.52.1` | `useDateField`, `useDateSegment` from `react-aria/useDateField`; `useLocale` from `react-aria/I18nProvider` | Field/segment interactions, accessibility DOM props, locale |
| `react-stately@3.50.0` | `useDateFieldState` from `react-stately/useDateFieldState` | Date value, incomplete segment state and validation state |

All four hooks are also public root exports. Prefer these selected public
subpaths in the interaction implementation. In this pinned release,
`react-aria/i18n` exposes localization script utilities, not `useLocale`, and
`react-aria/useDateSegment` and `react-aria/useLocale` are not the verified imports.
No private exports are needed or permitted. Read-only inspection of installed
`dist/private` implementation files informed behavior assessment; these are not
application imports.

Installed public declarations require `locale` and `createCalendar` for
`useDateFieldState`; existing direct `@internationalized/date@3.12.4` supplies
`createCalendar` and date utilities. `useDateField` receives props, state and a
native field ref, with an optional hidden-input ref. `useDateSegment` receives a
segment, state and native segment ref. The proof uses all of those public hooks.
No additional direct package is required for that composition. Optional public
`useFocusRing` from `react-aria/useFocusRing` and `mergeProps` from
`react-aria/mergeProps` also resolve as functions from the same dependency; no
optional dependency was added.

The frozen batch20 report at
`64f3d26c22b8854068816ad9de75ec26f5878511` was inspected with read-only `git show`
after the coordinator supplied it. Its proposed `react-aria/useLocale` import
must use the verified `react-aria/I18nProvider` subpath (or the existing public RAC
locale bridge). Its proposed facade remains unvalidated implementation work;
this prerequisite neither modifies nor adopts that worker's failing evidence.

Installed React Aria Components `dist/private/DateField.mjs` creates its own state
with `useDateFieldState` and passes that state into `useDateField`. A descendant
`DateFieldStateContext` provider cannot replace the state captured by the parent
field's hooks. Installed React Aria `dist/private/datepicker/useDateField.mjs`
registers its reset behavior with `state.defaultValue` and `state.setValue`.
A future owned facade must preserve those observable interactions through public
contracts; direct dependencies alone do not solve reset transactions.

## Manifest, lockfile and compatibility

Only `package.json`, `pnpm-lock.yaml` and this report are changed. The two runtime
dependencies are exact pins to versions already required by
`react-aria-components@1.21.1`; React Aria itself pins React Stately 3.50.0.
The lock delta contains exactly six root-importer lines. Existing package
resolutions, integrity hashes, snapshots and transitive edges remain byte-for-byte
unchanged. Runtime resolution verifies the new direct imports and React Aria
Components resolve to the same installed hook packages, with no duplicate copies.
No unrelated upgrade, new foundation, Next.js dependency or public export is added.

SGUI's React/React DOM peers remain `^18.3.1 || ^19.0.0`. The pinned React Aria
packages accept React `^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0-rc.1`;
React Aria also accepts React DOM with that range. These include SGUI's supported
React 18.3/19 versions. Consumers receive the hooks as SGUI runtime dependencies,
not new consumer peers. This task did not execute a React 18/19 packed matrix.
SGUI-owned strings/props/native refs remain the public boundary; upstream state,
date and prop types must stay inside the implementation.

## Bounded validation actually run

Runtime: Node 24.21.0, pnpm 10.29.3, installed React/React DOM 19.2.3.
Installs acquired an atomic owned `slot0` or `slot1` directory under
`/tmp/sgui-install-slots` and released only their matching owner token.
Validation similarly used the existing four-slot light-validation pool.

- `pnpm install --lockfile-only --offline --ignore-scripts` generated the minimal
  importer update from existing resolutions.
- `pnpm install --frozen-lockfile --offline` passed with no downloads; the lockfile
  was accepted without resolution changes. pnpm reported the existing ignored
  esbuild build script; no build-script approval or configuration was changed.
- A temporary external proof under
  `/tmp/sgui-batch21-datefield-dependency-proof` typechecked the actual public
  subpath hook composition using TypeScript 5.9.3, strict mode, bundler resolution
  and `skipLibCheck: false`.
- Its Node ESM proof imported root/subpath hooks, asserted hook identity and
  identical React Aria Components/direct package resolution, and invoked the
  hooks through React server rendering. It asserted spinbutton markup and a named
  hidden input containing `2026-10-07`. This is an import/SSR composition proof,
  not browser, hydration or reset behavior acceptance.
- `pnpm foundations:check` passed existing source/import/layer/token guards.
  Lockfile structural comparison and `git diff --check` passed. Source and public
  barrels were inspected read-only; no owned public API or upstream type export
  changed.

Per the bounded task instruction, no broad `pnpm check`, Storybook/package build,
unit/browser suite, server, CI, publishing or release work ran. Those broader gates
remain coordinator integration work. U-18/K-06 and broad acceptance stay open.

## Follow-up reservation and handoff

The current source guard matches `react-aria` imports but does not explicitly
match `react-stately`; existing declaration guards likewise do not explicitly
name it. Reserve a separate coordinator-owned guard follow-up to cover React
Stately imports/types at the same interaction/public boundaries when the hook
implementation lands. Guard/build files are outside this task's write allowlist;
none was weakened or changed here. No build change is required by the direct
runtime dependency additions: the current ESM build preserves package imports.

The DateField worker may adopt the dependency commit only after the coordinator
verifies it. Implementation, shared reset helpers, build configuration, AGENTS.md,
central acceptance records, versions, licensing and workflow permissions remain
outside this change. No functional DateField acceptance or release is claimed.
