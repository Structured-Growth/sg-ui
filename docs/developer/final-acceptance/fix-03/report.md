# Fix 03 — CSS composition and lint documentation

Assigned: A-C-07, A-C-18. Base: modified shared `dev` checkout at
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Documentation-only delivery;
coordinator owns shared acceptance counts and the architecture link.

## Delivered changes

- Added [stylesheet composition guide](../../react-aria-css-composition.md): optional
  host reset, first-declared host/SGUI layer ordering, token/theme scopes, compiled
  components, host utilities/overrides, normal unlayered and inline precedence,
  important layer reversal and portal scope boundaries. No SGUI utilities export
  is invented. The CSS import example explicitly assumes host package resolution.
- Inventoried every retained Popover important declaration separately: three for
  dialog, five for drawer, five for narrow auto. Described physical inset vs logical
  size effects, normal-declaration exceptions and host override impact. Reviewed
  current root style merge and unconditional positioning-hook use. Source supports
  a possible inline geometry conflict; necessity of each declaration is unverified.
  No production CSS or behavior changed and no permanent exception was approved.
- Corrected [lint guide](../../react-aria-css-lint.md): fixture registration and
  independent review are completed evidence, not pending implementation blockers.
  Linked retained FA-04 foundation execution and parallel-11 review. Preserved
  Batch 169/172 historical candidate context, exact semantic exceptions and scanner
  limitations. Clarified commands run from `packages/ui`.

## Outcomes

**Complete successors:** `C07-doc-composition`, `C18-doc-drift`.
**A-C-07 remains partial:** `C07-popover-important` still needs a justified
property-by-property retention decision or implementation change. This guide
makes the exception reviewable; documentation alone does not prove necessity.
**A-C-18 remains previously accepted complete:** this delivery corrects its stale
nonblocking guidance, not a second leaf closure. No shared checklist/count changed.

## Validation and retained evidence

`python3 docs/developer/final-acceptance/fix-03/validate.py` passed; its
[receipt](validation.json) records 13 important declarations, 11 resolving local
file links (fragments not checked), registration confirmation and input hashes.
The guard, ten-fixture file and package registration hashes match parallel-11's
receipt. Popover CSS also matches; the earlier scoped receipt did not include
Popover.tsx, so its new hash records current inspection only and does not establish
unchanged implementation. No old built output is claimed to validate current
Popover.tsx or unrelated concurrently changing sources.

`git diff --check -- docs/developer/react-aria-css-lint.md docs/developer/react-aria-css-composition.md docs/developer/final-acceptance/fix-03`
passed. Because new files are untracked, that Git check covers tracked diffs;
the bounded validator separately reads the new guide and checks its links/content.

Reused [parallel-11 report](../parallel-11/report.md) and
[FA-04 original transcript](../fa04-original-check.txt): the foundation stage
passed 32 tests including ten CSS guard fixtures on Node 24; the original overall
command later failed unrelated calendar tests. No tests, broad suites, builds,
package consumers or browser checks were rerun for these docs-only corrections.
Hashes of changed documentation and receipt files are recorded in `results.json`;
that file excludes its own hash to avoid a self-referential digest.

## Remaining requirements and scope

Coordinator must link the composition guide from architecture. For
`C07-popover-important`, review every important property or change the positioning
strategy. If implementation changes, run affected Popover unit tests plus a bounded
native anchored/dialog/drawer/narrow-auto scenario with reopen and resize. Browser
computed cascade, host composition, zoom/focus/scroll, writing modes, physical
devices and assistive technology remain explicit separate requirements. No legal
approval, remote CI result, release validation, production promotion or editor V
waiver follows from this delivery. No install, server mutation, source/generated
output edit, staging, commit, push, cleanup or worktree action occurred. Only the
two assigned guides and this evidence directory were written.
