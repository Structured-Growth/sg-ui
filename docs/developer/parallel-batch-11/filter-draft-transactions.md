# Batch 11: filter draft transactions

Bounded G-09/U-07 audit, 2026-10-07. This adds missing transaction coverage;
it does not change runtime behavior or close either broad acceptance gate.

## Ownership and baseline

- Worktree: `/Users/thomashall/.codex/worktrees/batch11-filter-draft-transactions/sg-ui`.
- Branch: `codex/batch11-filter-draft-transactions`; draft PR base: `codex/dev`.
- Verified clean starting HEAD: `d0fcc6298004ad23d1a75480b216b39142e6df96`.
- Test implementation commit: `527c8f6` (runtime implementation stays at baseline).
- Changed files: this report and
  [DataToolbarFilterMenu.test.tsx](../../../src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx).
- Sort, main toolbar, grid, stories, foundations and other worktrees remain read-only.

Central guidance: [development validation](../react-aria-development-validation.md),
[toolbar contract](../react-aria-data-toolbar.md), and
[master task list](../react-aria-master-task-list.md).

## Existing coverage and missing combinations

Existing filter-menu tests already exercise nested field/operator editing, enum
multi-selection, nested Escape, All with `is`, Cancel/reopen, draft Reset, unknown
fields/operators, valueless operators, number/date inputs, and row removal with
stable identity/focus. Existing
[serialization tests](../../../src/components/DataToolbar/filterRuleValue.test.ts)
cover blank, trimmed, single and multiple values. Existing
[shell tests](../../../src/components/AppDataGridShell/AppDataGridShell.test.tsx)
cover page-zero/filter/state callback ordering and rejected controlled requests;
this audit does not duplicate that ownership coverage.

Five additional tests exercise combinations absent from those tests:

1. Host criteria replacement while open retains the local input/draft; Cancel
   emits no request, and reopening loads the latest controlled criteria.
2. Removing a field and changing another field's type while open causes Apply
   to omit those invalid rules while retaining a valid date rule. Enter activates
   the same Apply transaction.
3. Replacing/reordering enum option labels while the nested picker is open retains
   canonical option IDs and serializes IDs rather than translated labels.
4. Enter and Space Apply each issue one request per opening. A host that has not
   accepted a request continues to supply the original criteria on reopening;
   neither Apply submits the surrounding host form.
5. Keyboard All on an `is_not` enum clears selection and requests no active rule.

No runtime defect against the documented contract was demonstrated by these
combinations. No changed-state story is needed because runtime behavior is unchanged.

## Audit limits and next bounded task

The menu has no field-associated validation error UI: its documented Apply contract
silently omits invalid/incomplete rows. Thus these keyboard tests verify requests,
not error announcements or assistive-technology behavior. Adding an error contract
would require a separate behavior/story/browser task.

Enum options are live host presentation data. A selected ID removed from
`enumOptions` remains in the draft and uses its ID as fallback display text; Apply
does not enforce option membership. The existing parser also trims IDs and uses
`|||` as an unescaped delimiter. Those are existing representation/policy limits,
not a newly introduced validation policy. A next bounded task should decide and
document removed-option behavior and the supported enum-ID domain across menu,
shared parser and grid processing before changing them. That task needs broader
ownership and changed-state stories; this audit preserves host-controlled payloads.

## Validation

Runtime: Node `v24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`.
Commands ran in the worktree with:

```sh
export PATH=/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin:$PATH
pnpm install --frozen-lockfile
pnpm exec vitest run src/components/DataToolbar/components/DataToolbarFilterMenu.test.tsx src/components/DataToolbar/filterRuleValue.test.ts src/components/DataToolbar/DataToolbar.test.tsx
pnpm typecheck
git diff --check
```

Frozen install passed without lockfile changes (pnpm reported the existing ignored
esbuild build script). Targeted Vitest passed: 3 files, 18 tests, including all five
new cases. Typecheck and whitespace checks passed. Checks ran on the test tree
committed as `527c8f6`; the following report commit changes only this document.

No native interaction implementation changed, so no fresh Storybook/browser build
or shared heavy-validation lock was needed. No full check, packed consumer,
browser matrix, physical device or assistive-technology acceptance is claimed.
GitHub CI/title checks for `codex/dev` remain user-paused. The later complete matrix,
including the known Firefox environment prerequisite, remains required.
