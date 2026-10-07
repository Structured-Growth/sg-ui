# Executed browser acceptance

Use Node 24 and the frozen pnpm lockfile, then:

```sh
pnpm exec playwright install chromium firefox webkit
pnpm build-storybook
pnpm test:browser
```

CI installs browser system dependencies with `--with-deps`. The harness owns a
static server on loopback port 6173, does not reuse existing servers, and tests
built Storybook iframe stories. Rebuild Storybook after changes to source or
stories; never rebuild it during a browser run. The suite typechecks its config
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

The harness sets the addon’s `a11y.manual` global only in its iframe URLs to
prevent concurrent addon/harness axe runs; its own explicit scans remain mandatory.
Axe scans representative grid, editable/read-only editor, and open nested-dialog
stories in light/dark globals. Every violation tagged WCAG 2 A/AA, WCAG 2.1 A/AA
or WCAG 2.2 AA fails. There are no disabled rules or node exclusions. Full scan
results are attached to the report; automated checks do not replace manual
screen reader testing. These scans are an explicit, limited story/state matrix,
not a claim that the entire catalog or every overlay state has been audited.

The performance smoke processes 1,000 rows, renders 250 rows, sorts and verifies
the resulting values. It records navigation/render and sort/render timings per
engine and fails a 15-second combined hang guard. That deliberately broad guard
is not a consumer latency SLA or a hardware/memory benchmark. Representative
hardware budgets and memory/listener cleanup remain separate acceptance work.

Reports, result JSON, downloaded files and failure traces/screenshots are written
to `artifacts/`. CI retains `sgui-browser-node-24` for 14 days even on failure.
Chromium, Firefox and WebKit are required by the Node 24 CI job. A macOS 27
Firefox launch can fail before tests because of the protected shared profile
directory ([upstream issue](https://github.com/microsoft/playwright/issues/42768));
report this local limitation without skipping Firefox in CI or granting OS
permissions. This is
not a mobile/touch, assistive technology, zoom or Next.js integration matrix.
