# Batch 14 exact-head evidence review

W-19/X-01, reviewed 2026-10-07. **Accept all 18 exact heads below for their
bounded report/test-only scope.** No blocking introduced regression or allowlist
violation was found. This is not acceptance of their remaining product, native,
device, manual or assistive-technology combinations. No broad gate is closed.

## Isolation and authority

- Verified review baseline: `f1e5e457ce6240022ca07d6336ea06c5b67c917c`.
  GitHub commit metadata and `refs/heads/codex/dev` agreed before isolation.
- Created and attached exactly one managed worktree before any report edits:
  `/Users/thomashall/.codex/worktrees/batch14-review-evidence/sg-ui`.
- Branch: `codex/batch14-review-evidence`; report draft PR base: `codex/dev`.
- Exclusive write allowlist: `docs/developer/parallel-batch-14/review-evidence.md`.
  All source, tests, stories, existing reports, central checklists, configuration,
  workflows and other checkouts remained read-only.
- Read root AGENTS.md and [development validation](../react-aria-development-validation.md).
  The explicit review-only instruction overrides per-task UI/build/install suites.
- Checked canonical [W-19/X-01](../react-aria-master-task-list.md), existing batch
  13 review-1/2/3, and the exact completion reports before evaluating patches.
  Those prior reviews concern other PRs; this is one unique report for this set.

## Exact heads and decisions

Every worker's recorded baseline is
`b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818` (B). Comparisons below use B to
the exact head, not the moving GitHub baseRefOid. The fetched PR refs agree with
GitHub's headRefOid. All 18 were OPEN drafts targeting `codex/dev` when inspected.

| PR | Exact reviewed head | Decision | Actual changes / report |
| --- | --- | --- | --- |
| [43](https://github.com/Structured-Growth/sg-ui/pull/43) | `b06a3eb90ed5f47a128955a17dc94759a33991df` | accept report | control-table.md only |
| [44](https://github.com/Structured-Growth/sg-ui/pull/44) | `c3aaf46d33b7139fde44f888cb2493949ee4c05b` | accept report | control-collapse.md only |
| [47](https://github.com/Structured-Growth/sg-ui/pull/47) | `40d01640eb9ac223d2d7a38e935b779244cab58d` | accept report | control-breadcrumbs.md only |
| [48](https://github.com/Structured-Growth/sg-ui/pull/48) | `6cad2ec8ea18947838e612eae745dc1c4e3fcf73` | accept report | control-surface.md only |
| [50](https://github.com/Structured-Growth/sg-ui/pull/50) | `519930756097d78a971a0756ad80a29db9563525` | accept report | control-typography.md only |
| [51](https://github.com/Structured-Growth/sg-ui/pull/51) | `8b40247f17559eb8cbc29235cc7d4282d30b35fc` | accept report | control-box.md only |
| [52](https://github.com/Structured-Growth/sg-ui/pull/52) | `e98f4b1d661a2fb4e8372c82c6fc4626010eda2b` | accept report | card-collection.md only |
| [53](https://github.com/Structured-Growth/sg-ui/pull/53) | `f6668c8798b0477f70b6be78f1e183f898a611b3` | accept report | page-navigator.md only |
| [54](https://github.com/Structured-Growth/sg-ui/pull/54) | `6ece4c7c1a3370885a4d711bc84d3f6907a84d4d` | accept report | control-card.md only |
| [55](https://github.com/Structured-Growth/sg-ui/pull/55) | `6f694c9b73bd40ddd72163c3beb9c459c49262ea` | accept report | control-status.md only |
| [56](https://github.com/Structured-Growth/sg-ui/pull/56) | `fc1fd53e763aac6d1d5f60adb3f37e8bed782fc0` | accept report | control-chip.md only |
| [58](https://github.com/Structured-Growth/sg-ui/pull/58) | `91872eca5854f4964d9d6e5f1772dea508afad91` | accept report | control-stack.md only |
| [59](https://github.com/Structured-Growth/sg-ui/pull/59) | `7191b7253299834d85983b70859e642a290c0cef` | accept report | editor-layout.md only |
| [60](https://github.com/Structured-Growth/sg-ui/pull/60) | `fca4c2971436562184a6c1162ea4614ab8b34c1c` | accept report | columns-dialog.md only |
| [61](https://github.com/Structured-Growth/sg-ui/pull/61) | `763c7b434827c55f1bacc750627510f1c00823b0` | accept tests/evidence | control-iconbutton.md + IconButton.test.tsx |
| [62](https://github.com/Structured-Growth/sg-ui/pull/62) | `64d8889f0ed370ca9290471582114354ba5f5213` | accept targeted evidence | control-datagrid.md + DataGrid.test.tsx |
| [66](https://github.com/Structured-Growth/sg-ui/pull/66) | `7c5c4404cae9561bb36f408c62313b7b49614979` | accept tests/evidence | control-togglebutton.md + ToggleButton.test.tsx |
| [76](https://github.com/Structured-Growth/sg-ui/pull/76) | `de65b4c490badfd3e58773e3df94262538595a32` | accept tests/evidence | control-navigation.md + Navigation.test.tsx |

Report names in the table are under `docs/developer/parallel-batch-13/`; changed
test paths are respectively `src/experimental/{IconButton,DataGrid,ToggleButton,Navigation}/`.
Each report declares that component directory, one unique browser spec and its
own report as its allowlist (card collection, navigator, editor layout and columns
use their named `src/components/` directories). Every actual changed path matches
its declared allowlist. No browser spec, implementation, style, story, public API,
translation, dependency, licensing or workflow change appears in any worker diff.
The `docs:`/`test:` titles match the resulting scope; no breaking marker is needed.

## Report-only evidence assessment

These fourteen reports properly distinguish source/test inspection from fresh
execution. Their inspected implementation head is B; their final documentation
heads do not create new runtime evidence. Acceptance here is of that disposition.

| PR | Evidence supported by exact-baseline source/tests | Remaining evidence or decision |
| --- | --- | --- |
| 43 | Native Table caption, headers/scope, spans and refs; one Table case and public primitive composition. No collection engine exists. | Dynamic rows/columns, controlled host composition and native empty/pending behavior are unverified. |
| 44 | Immediate `hidden`/optional unmount; two Collapse cases, retained input composition, three Disclosure and two SSR cases. No animation completion exists. | Standalone native hidden-focus/host-return sequence; host CSS motion is outside this source conclusion. |
| 47 | Last breadcrumb is current text; live array rendering and host Link composition. Shared Typography provides wrapping. | Dynamic item replacement/removal and narrow/enlarged-text RTL native geometry. |
| 48 | Surface forwards owned props/ref through Box; two cases each for Surface, Box and ThemeScope; token-backed variants. | Computed six-variant nested-scope/forced-color native matrix. |
| 50 | Independent semantic element and visual role; bodyAlt2 tokens; 18 Typography/SSR cases. Report correctly rejects its test title as inline-style proof. | Native cascade/style overrides and enlarged-text acceptance. |
| 51 | Nine bounded native Box tags, direct ref, host style after padding default; two cases. No slot API exists. | Full tag/ref/event/container geometry matrix; stale guide opening is separate documentation scope. |
| 52 | Complete client dataset uses rows.length and normalized slicing; six collection, seven footer and seven Pagination cases at B. Underlying rejection coverage is not claimed as collection rejection. | Collection-specific host rejection and full responsive acceptance; unknown totals belong to footer. Collection is M-11, footer M-12: retain this distinction despite assignment label. |
| 53 | Authoring `{key,title}` page list with controlled actions, nine cases plus SSR. Batch09 already records route-contract mismatch. | M-10 authoring versus adjacent/route decision; M-06 belongs to AppShell. Dynamic labels and simultaneous instances remain unverified. |
| 54 | Card/Content are Surface/Box presentation wrappers; 13 cited cases in six files. A nested native button presence assertion is not activation evidence. | Native nested owned actions, CardContent ref and Tab order. Batch10–12 reports really are absent at B, although some exist at this later review baseline. |
| 55 | Quiet/polite/assertive Status mapping plus real grid mutation/retry/independent-owner regression. Historical grid native evidence is attributed separately. | Spoken behavior and fresh native execution; canonical Status ID is U-13, not assigned U-11. |
| 56 | Passive span Chip has no disabled/onPress/onRemove API. Source/barrels/remaining-control contract agree. | Primitive guide's optional onRemove claim contradicts source; reconcile separately. Canonical Chip/Tag/Badge ID is U-12, not U-06. |
| 58 | Direct children/refs, token gap and flex flow; two Stack, two scope and three public primitive cases. | Native wrapping, 38rem breakpoint, gap, order and composed independent density geometry. |
| 59 | Root ref and host-owned scroll region; four layout cases and three stories. Conditional chrome has stable JSX slots; no second scroll/focus owner. | Combined slot replacement while scrolled/focused at narrow/enlarged size. Historical surrounding editor evidence does not prove it. |
| 60 | Effect resets draft on open/defaultPreset; current callback receives preset; five modal cases plus insert-menu composition. | Live default/callback replacement and columns insertion interrupted by editorKey/read-only need separate coverage. |

Checked the master IDs rather than interpreting dispatch labels as canonical
completion: U-03 is Typography, U-16 toggles, U-11 includes Navigation/Disclosure,
and U-17/X-16 are broader interaction/independent-instance criteria. Existing
checked implementation rows are not changed or upgraded by this review.

## Added regression and tested-head assessment

All four additions exercise real controls, accessible DOM queries and host callback
payloads, without mocks that replace the interaction implementation. They add seven
cases (2 + 1 + 3 + 1) beyond existing coverage, and pass unchanged implementations.
No runtime change requires a changed-state story or new native check in these PRs.

| PR | Exact tested code/test commit | Worker-reported checks and limits |
| --- | --- | --- |
| 61 | `2c326a094fffa8177d98f31e1dc7e687358e2f9b` | Node 26.5.0, pnpm 10.29.3, React 19.2.3, RAC 1.21.1, Vitest 4.1.11, jsdom 26.1.0. Frozen install; `pnpm exec vitest run src/experimental/IconButton/IconButton.test.tsx src/experimental/Button/Button.test.tsx --maxWorkers=1`: 2 files/7 passed; `pnpm exec tsc --noEmit` passed. Not Node22/24 or native evidence. |
| 62 | `f20a9d511437af478b715dd37f0268c25e671d96` | Node 24.21.0 via /tmp/sgui-run24.mjs, pnpm 10.29.3, React 19.2.3, Vitest 4.1.11, jsdom 26.1.0. Frozen install; full DataGrid file: 7 passed/1 old paging timeout; same file with `--maxWorkers=1 -t 'isolates overlapping\|retains cross-page'`: 2 passed/6 skipped unchanged. No clean full-file pass claimed. |
| 66 | `ea4e38d48c4620757195cdb8c4c212e86903bdc9` | Node 24.19.0 tests, Node26.5.0 frozen install, pnpm 10.29.3, React 19.2.3, RAC 1.21.1, Vitest 4.1.11, jsdom 26.1.0. `pnpm exec vitest run src/experimental/ToggleButton/ToggleButton.test.tsx --maxWorkers=1`: final 1 file/8 passed. Earlier 6/8 probes are not additional distinct coverage. |
| 76 | `986d09f67e56850f1de7b9ae5e94d5d6032b5a96` | Node26.5.0, pnpm10.29.3, React19.2.3, Vitest4.1.11, TypeScript5.9.3, jsdom26.1.0. Frozen install; `pnpm exec vitest run src/experimental/Navigation/Navigation.test.tsx src/experimental/Link/Link.test.tsx src/adapters/navigation.test.tsx --maxWorkers=1`: 3 files/14 passed; `pnpm typecheck` passed. Unsupported jsdom navigation warnings disclosed. |

Git confirms each tested commit to final head changes **only its report**, so the
tested source/test content is identical to the reviewed head. Runtime outcomes and
precommit test identity are worker completion-report attestations, not independently
rerun or cryptographically bound logs. This review does not invent a combined test
total from overlapping attempts or promote reports to supported-runtime acceptance.

IconButton adds changing host name/description through pending state and external
form/type/name/value DOM forwarding. It does not activate submit/reset buttons.
DataGrid adds two real grids with overlapping row/column keys and nested owned
buttons; exact callback/checkbox assertions guard independent selection. A shared
action spy proves the two invocations and selection suppression, not distinct
per-grid action function identity. Existing catalog-native tests are not proof of
experimental grid behavior. The disclosed old timeout passed on targeted recheck;
no assertion or timeout was weakened.

Toggle adds disabled-fieldset/first-legend handling, held Space interruption and
independent controlled/uncontrolled groups. These are jsdom observations, not
physical key timing, native Tab order or document-wide ID uniqueness acceptance.
Navigation adds stale pathname versus controlled current, host rejection, ref
cleanup, surviving anchor attributes and router callback replacement. `fireEvent`
is appropriate to that callback/DOM slice; it does not prove native navigation.

## Reviewer validation and limits

Runtime: macOS, Node26.5.0 queried only, Apple Git2.54.0, gh2.95.0, Python3.9.6.
Zero reviewer installs, runtime tests, typechecks, full checks, builds, Storybook,
browser or packed-consumer runs. No slots, lock, queue or pool changes. The retained
global validation lock and browser-priority queue were not acquired, stolen or
altered; no unchanged Firefox retry. Paused dev CI/title runs were not polled,
waited on, dispatched or rerun. No source edits, merges, main/publish, credentials,
permissions or licensing changes.

Commands/checks performed:

- `gh api .../commits/<review-baseline>` and `.../git/ref/heads/codex/dev`;
  `git rev-parse`, managed create/attach, then `git switch -c` in isolation.
- `gh pr view <number> --json number,title,state,isDraft,headRefName,headRefOid,baseRefName,baseRefOid,body,files,commits`
  for all 18, then fetch PR heads into `refs/review/batch14/<number>`.
- `git diff --name-only B <head>`, full test diffs, exact `git show <head>:<report>`
  and linked source/test/contract inspection; `git diff --check B <head>` for all
  18: passed. Four tested-commit/final-head path comparisons: report only.
- Python `git show`-based Markdown target audit at each exact worker head:
  **191 local links, including 10 heading anchors**, zero unresolved targets.
  Per-PR counts in table order: 8,10,15,12,11,10,8,15,7,10,11,17,7,8,4,0,4,4.
  Inline source paths and regression counts were inspected separately. Exact
  baseline matters: Pagination has seven cases at B, eight at this later review
  baseline; the worker's 20-case static inventory is correct for its own head.
- Source-directory comparison B to review baseline shows no changes to the 18
  reviewed component directories. Shared consumers may have later changes; no
  fresh integrated runtime pass follows from this comparison.
- This report's local links, whitespace and exclusive changed-file audit pass.

One broad /tmp path inventory encountered an unrelated permission-denied entry;
one optional brace-expanded read attempted an absent Navigation/IconButton.tsx.
The actual IconButton and Navigation files were read successfully. Neither probe
is a validation pass or product failure. A progress message misstated the anchor
count as 13; the exact audit above establishes 10.

## Reserved follow-ups

1. Preserve existing worker reservations; do not dispatch duplicate evidence work.
   Report acceptance does not complete dynamic Table/Breadcrumbs/navigator,
   computed Surface/Typography/Stack, nested Card, collection rejection, editor
   slot-replacement or columns interruption combinations. Each needs its existing
   exact source/story/spec/report ownership and approved fresh browser allocation
   where native behavior is involved.
2. Documentation/product owners reconcile the Chip onRemove guide row, stale Box
   guide opening and M-10 route/authoring decision; preserve passive/host-owned APIs
   until explicitly changed. These files are outside this report's allowlist.
3. Retain experimental DataGrid's reserved drag-hook warning investigation and
   native two-grid checks. IconButton external form activation, Toggle held-key
   native evidence and Navigation host-router focus/removal likewise remain open.
4. Actual spoken Status behavior, physical devices, IME, manual zoom and all broad
   G/K/E/U/H/X/R/Z/production gates stay with their owners. Pool review and priority
   scheduling remain prerequisites, not completed checks.
5. Decisions apply only to the listed exact heads. Any later patch or integration
   conflict needs affected review and targeted checks if it creates a concrete
   interaction concern. No merge authorization is implied by this record.

Final report commit and attached draft PR URL are delivered in the authorized
coordinator message and PR history, avoiding a self-referential commit hash.
