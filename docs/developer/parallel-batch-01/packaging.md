# Packaging batch 01 report

Assignment: packaging. Task IDs: A-18, E-08, R-03–R-05, R-09, X-20, Z-08.
Base: `9f153642e827a14033d646cf0160730c0793bdfc`.
Chat: `01a11652-2110-7621-8552-18c7c7929030`.
Worktree: `/Users/thomashall/.codex/worktrees/batch-01-packaging/sg-ui`.
Branch: `codex/batch-01-packaging`.
Implementation/evidence commit: `6ec39e6` (the subsequent report-only commit records
this review identity).
Draft PR: [#10](https://github.com/Structured-Growth/sg-ui/pull/10), targeting
`codex/dev` for coordinator consolidation; never merged or published by this chat.
The shared validation lock was released after all four corrected consumers passed;
this chat will not reacquire before the coordinator's integration turn.

## Exact acceptance slice

- Actual tarball exports/CSS metadata and all emitted bytes are compared with
  freshly built output. Unexpected source/config top-level contents fail.
- Preserved README/license/notices are checked for unchanged inclusion; emitted
  packed code/declarations/CSS/maps/assets receive the retired-reference audit.
- Ten separate packed Vite entry builds inspect module IDs to reject editor
  traversal and, for basic entries, grid traversal. Each checks explicit CSS.
- The existing comprehensive API consumer now compiles in the installed tarball
  fixture with TypeScript 5.9.3 and matching React 18/19 type packages.

Files: `scripts/check-package.mjs`, `scripts/test-foundation-consumer.mjs`,
`docs/developer/react-aria-package-acceptance.md`, this report.
No public API, package metadata, dependencies, build, CI, shared guidance or
primary checkout files were changed.

## Validation

All heavy commands used the shared atomic mkdir lock with this chat ID recorded,
and released only their own lock through an EXIT trap. The first consumer attempt
caught a premature CSS assertion in the new Vite plugin. The assertion was moved
to the final build output; the corrected consumers all passed. No package/UI fix
or relaxed assertion was needed.

Environment: Node 24.21.0, pnpm 10.29.3, TypeScript 5.9.3.

- `pnpm install --frozen-lockfile`: passed; no lockfile change.
- `pnpm check`: passed, 143 test files / 968 behavior tests, foundation/token/type/
  release/build/package guards. Tarball comparison covered all 1,648 emitted files
  (471 JS, 392 declarations, 784 maps, one stylesheet; 1,479,458 bytes total).
- `pnpm build-storybook`: passed.
- `node scripts/test-foundation-consumer.mjs --react18`: passed React 18.3.1,
  matching React types, API contract, all ten isolated imports, SSR and production
  CSS/icon checks.
- `node scripts/test-foundation-consumer.mjs`: passed React 19.2.3, matching React
  types, API contract, all ten isolated imports, SSR/Flight and production CSS/icon
  checks.
- `node scripts/test-editor-consumer.mjs --react18`: passed packed React 18 SSR
  and production editor build with Lexical retained.
- `node scripts/test-editor-consumer.mjs`: passed packed React 19 SSR and
  production editor build with Lexical retained.
- Script syntax, `git diff --check` and local document links: passed.

Logs: `/tmp/sgui-packaging-check.log`, `/tmp/sgui-packaging-storybook.log`,
`/tmp/sgui-packaging-react18.log`, `/tmp/sgui-packaging-react19.log`,
`/tmp/sgui-packaging-editor18.log`, `/tmp/sgui-packaging-editor19.log`.

No browser suite was run: no UI behavior changed, no browser server was started,
and builds of hydration entries do not prove executed hydration. Node 22.12.0,
a wider TypeScript matrix, actual CI and device/assistive-technology behavior
were not revalidated in this local slice. The corrected consumer-script-only
change was verified by both complete consumer pairs after the successful full
check and Storybook build.

## Remaining gates and coordinator follow-up

E-08/A-18 remain partial: Lexical and its integrations are still direct package
dependencies and therefore install for basic consumers. Decide and implement an
explicit editor package/dependency strategy in a separate bounded assignment
owning package metadata, build entry points and migration docs.

R-03/R-04 remain partial: root and component convenience barrels expose editors;
the ten granular imports are representative evidence, not a complete redesigned
core/grid/editor entry-point contract.

R-09/X-20 establish the repository's current TypeScript 5.9.3 API use with
`skipLibCheck`; a promised wider TypeScript range and full third-party declaration
checking need a separate support decision/matrix. R-05 proves current CSS and
export metadata, not publication/release configuration.

Z-08 remains partial: unchanged notices still name the former styling/component/
grid packages. Current README has no retired-name matches. Do attribution review
under Z-05/Z-06 before changing legal notices; never silently remove them.

Coordinator should link the package acceptance record from central guidance and
reconcile task checkboxes only at their actual scope. Broad U/X/R/Z, browser,
device/assistive-technology, publication and final migration acceptance remain
open. This slice introduces packaging checks, not UI behavior changes.
