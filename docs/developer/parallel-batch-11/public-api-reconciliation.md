# Batch 11: public-api-reconciliation

Assignment: bounded Z-13/W-13 read-only source/API audit, 2026-10-07.
Baseline verified before edits: `d0fcc6298004ad23d1a75480b216b39142e6df96`.
Worktree: `/Users/thomashall/.codex/worktrees/batch11-public-api-reconciliation/sg-ui`.
Branch: `codex/batch11-public-api-reconciliation`; draft PR base: `codex/dev`.
Implementation/final head and PR URL are supplied in the coordinator delivery
message; the report cannot contain the hash of its own commit.

## Result and scope

The [bounded reconciliation](../react-aria-public-api-reconciliation.md) records
exact form callback/value/ref contracts, catalog grid criteria/reset/cell types,
editor link/image/upload boundaries, package routes and historical provenance.
Existing primitive/form/reset, grid cell and editor dialog/policy coverage was
reviewed first. This adds neither duplicate tests nor implementation changes.

Three concrete discrepancies are reserved for follow-up:

- F-01: primitives guide promises Checkbox input ref; source forwards label ref.
- F-02: guide requires visible TextField label; source also accepts aria-label.
- F-03: named AppDataGridViewState is granular-only because the root/component
  barrel omits its reexport; guide does not make that route explicit.

TextArea/RadioGroup promotion and named criteria/persistence/date-context exports
remain API-owner convenience decisions, not invented required features. Editor
guides match the callbacks: standalone image description is a second dialog
argument, while integrated onUploadImage remains File-only and serialized document
changes carry the final description. Transport abort/asset cleanup and file-byte
validation remain host-owned.

Only these allowlisted files changed:

- `docs/developer/react-aria-public-api-reconciliation.md`
- `docs/developer/parallel-batch-11/public-api-reconciliation.md`

No source, export, build, workflow, checklist, central guidance or historical
snapshot edits. Primary and other worktrees are preserved.

## Local validation and evidence limits

Runtime: bundled Node `v24.19.0` at
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`.
The shell's default Node was `v26.5.0`; all executable audit/link assertions used
the explicit Node 24 binary. No dependency install was needed.

Exact validation invocations from this worktree:

1. `git rev-parse HEAD` and `git status --short`: exact assigned baseline and clean
   initial state; `git switch -c codex/batch11-public-api-reconciliation` succeeded.
2. `/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --input-type=module` with an inline assertion script: passed source-route,
   signature/ref and baseline provenance assertions. It reads package.json,
   root/component/primitive/experimental/component-specific indexes and source
   contracts, confirms the three discrepancies and expected source routes, and
   confirms one-argument file upload invocation. This is text/source inspection,
   not TypeScript resolution, emitted declaration or runtime component validation.
3. The same explicit `node --input-type=module` invocation with an inline local
   Markdown-link/path/allowlist script: passed for both changed documents. It
   resolves relative links, checks anchored headings and inline repository paths,
   and requires tracked/untracked changed files to equal the two-file allowlist.
4. `git diff --check`: passed.

Source discovery used `rg --files` / `rg -n`; contract reads used `cat`/`sed` and
historical primitive source used
`git show 21adebd61bedfc6a1ed395fe664ff4be83896821:src/components/primitives/index.ts`.
Two exploratory guessed guide filenames, react-aria-forms.md and
react-aria-inputs.md, did not exist; discovery located the actual primitive,
proof-controls, layout-actions and prior batch form/reset guides instead.

No build, Storybook, browser, full check, unit suite, consumer pack or current
emitted-declaration check ran. No heavy validation lock/queue slot was needed.
Historical tests/reports are attributed to their original evidence, not rerun
or claimed as fresh passes. Dev GitHub CI/title runs remain user-paused; no run
is dispatched, rerun, awaited or re-enabled. Firefox, physical devices and spoken
assistive technology are unverified here; later complete matrix acceptance remains
required. Broad G/E/U/X/R/Z, Z-13 and W-13 remain open.

## Owner decisions and next bounded task

Coordinator/API owner should record F-01's ref contract disposition and F-03's
named-export disposition; F-02 can be corrected in primitive guidance to match
the existing naming union. Any input-ref behavior change needs a reviewed breaking
mapping and composed/native evidence. A reset type reexport would be compatible,
but requires its own fresh source/declaration/packed import checks. Keep the
historical public-api.json immutable; final reconciliation needs a fresh final
head and complete release-marker audit.

Central guidance suggestion: link this audit from the relevant consumer migration
entry, update primitive label/ref wording and specify the reset type's approved
route. Those files were outside this task's allowlist. Validation follows
[development policy](../react-aria-development-validation.md), not a broad-gate
completion. One human-authorized completion report is sent to coordinator chat
`01a1164f-41db-7f30-aaf9-f20133b6566f`; no continuing messages or automation.
