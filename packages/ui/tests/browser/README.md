# Executed browser acceptance

Use Node 24 and the frozen pnpm lockfile, then run from the repository root:

```sh
pnpm --filter @structured-growth/sg-ui exec playwright install chromium firefox webkit
pnpm build
pnpm build:browser-docs
pnpm test:browser
```

CI installs browser system dependencies with `--with-deps`. The harness owns a
static server on loopback port 6173, does not reuse existing servers, and tests
built docs-owned native fixtures from `apps/docs/native-fixtures`. Rebuild the
package and fixtures after changes; never rebuild them during a browser run.
The suite typechecks its config
and tests, uses one worker, disables retries, and fails on uncaught browser
errors or console warnings/errors. Successful reruns do not hide flaky retries.

The native download assertions wait for a download, save the file and compare
its complete bytes. Link checks cover empty/named/boolean download attributes,
explicit false routing, cancellation, host callback ordering, modifier-created
tabs, explicit targets and native external navigation. Dialog tests cover nested
Escape dismissal and trigger focus restoration. Real Lexical tests type and
select text using keyboard input, then apply formatting. Grid tests cover native
cell focus movement, nested actions, selection, sort and host-owned Move requests
including rollback and reorder toggling.

Historical fixture URLs retain the `a11y.manual` parameter; there is no Storybook
runtime or addon. The harness's explicit axe scans remain mandatory.
Axe scans representative grid, editable/read-only editor, and open nested-dialog
fixtures in light/dark globals. Every violation tagged WCAG 2 A/AA, WCAG 2.1 A/AA
or WCAG 2.2 AA fails. There are no disabled rules or node exclusions. Full scan
results are attached to the report; automated checks do not replace manual
screen reader testing. These scans are an explicit, limited story/state matrix,
not a claim that the entire catalog or every overlay state has been audited.

`hardening-control-geometry.spec.ts` measures shared control heights, field typography,
checkbox/switch row alignment, icon centers, stable Select widths and truncation,
and equal ToggleButtonGroup widths. It covers both themes/densities/directions,
pointer/touch target policies, enlarged text and narrow reflow. Presentation checks
also assert native semantics and bounded long English/Arabic content. Screenshots
are review evidence; geometry assertions are the repeatable regression gates.
The focused `hardening-*-presentation.spec.ts` suites retain native geometry and
semantic assertions for long localized progress, headers/tabs, shells, modals,
navigation/disclosure and course-card/pagination compositions. Their screenshots
support visual review; the assertions run again in the regular browser suite.
For incremental development, preserve independently passing engine reports and
rerun only failed or affected cases. Parallel engines must use separate canonical
slot/port ownership, artifact directories and one worker each against the same
immutable built host. Never rebuild that host while any engine uses it.

Both this directory and `apps/docs/tests` run in their respective CI jobs. The
docs geometry suites cover the website playground layout and sizing contracts;
run the complete docs suite with `pnpm test:docs` from the repository root.

The performance smoke processes 1,000 rows, renders 250 rows, sorts and verifies
the resulting values. It records navigation/render and sort/render timings per
engine and fails a 15-second combined hang guard. That deliberately broad guard
is not a consumer latency SLA or a hardware/memory benchmark. Representative
hardware budgets and memory/listener cleanup remain separate acceptance work.

Reports, result JSON, downloaded files and failure traces/screenshots are written
to `artifacts/`. CI retains `sgui-browser-node-24` for 14 days even on failure.
Chromium, Firefox and WebKit are required by the Node 24 CI job. Report any local
browser launch failure separately without skipping that browser in CI. This is
not a mobile/touch, assistive technology, zoom or Next.js integration matrix.

Display-preference gates exercise native modal focus at 320px and enlarged text
with text spacing, nested portal focus, action callbacks and return focus. The
suite verifies complete control visibility, reduced-motion loading semantics and
system focus colors under forced-color emulation. Every engine must report the
active media query; capability evidence remains attached. Effective reflow
and root text scaling do not establish actual browser chrome zoom or physical
high-contrast settings. See the [scoped evidence](../../../../docs/developer/react-aria-browser-acceptance.md#display-preferences-and-modal-reflow-x-05x-06-partial).


Additional permanent presentation suites cover localized calendars
(`hardening-date-presentation.spec.ts`), typography/table/scope inheritance
(`hardening-typography-table-presentation.spec.ts`), grid/reorder cell and page
containment (`hardening-grid-presentation.spec.ts`), and editor-dialog focus-ring
clearance (`hardening-editor-dialogs-presentation.spec.ts`). These assert geometry
and native behavior; retained screenshots supplement their assertions. Use the
resumable execution index before choosing affected cases or engines to rerun.
