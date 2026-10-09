# Batch 84: packed editor hydration preparation

Parent acceptance: X-17, X-20, R-01, Z-11. Baseline:
`007617d53600b258e001d69530fb74d672362222`. This is a bounded consumer proof;
these parents and broad editor acceptance remain open.

## Prepared behavior

`node scripts/test-editor-consumer.mjs` retains its SSR and hydration-entry build
path. It does not launch a browser. Its success message now explicitly distinguishes
building a hydration entry from executing hydration. `--react18` selects React
18.3.1; the default selects React 19.2.3.

`--browser` dynamically loads the new browser helper after the existing tarball
installation, server rendering and Vite production build checks. The extracted
Proof uses only public packed imports and the package stylesheet. Browser-only
host controls expose hydration completion, editor-key replacement and reloading
exactly the saved JSON. Production components and shared browser infrastructure
are unchanged.

The existing `packed-browser.mjs` serves only the clean fixture dist directory on
an OS-assigned unique loopback port. It runs one browser/session sequentially,
with zero retries; there are no concurrent Playwright test workers. For each
selected engine it first opens JavaScript-disabled SSR markup, then a hydrated
context. Console warnings/errors and page errors fail the case; recoverable React
hydration errors are explicitly forwarded to console.error. Traces/screenshots
and diagnostic JSON are retained on failure.

The new case verifies:

- SSR exposes the initial twelve-paragraph public JSON and the server hydration marker.
- Hydration mounts the actual packed editor with all initial text and editable state.
- Native Select All, Backspace, bold shortcut, typed text and Enter serialize two
  paragraphs with the exact text and bold/plain formats, and render bold text.
- Reloading the host's native-edit serialization recreates the same document/format.
- Live read-only mode blocks keyboard edits and preserves DOM text and saved JSON.
- Host replacement through editorKey while read-only removes the prior document,
  preserves read-only state and loads a saved bold replacement.
- Returning to editable mode permits a native edit of the replacement and serializes it.

Each engine/version run uses a UUID evidence name under `artifacts/packed-browser`.
A metadata JSON records React version, Node/platform, selected engines, fixture dist
path, hashes of every built asset and server HTML, timestamps and pass/fail state.
React 18 and 19 have separate evidence. The coordinator must record the actual
frozen source head and commands alongside those artifacts.

## Targeted preparation evidence

Runtime: Node 24.19.0, pnpm 10.29.3. Owned atomic canonical install/light slots
were released only after owner-token verification; no foreign slot was removed.

- PASS: `pnpm install --frozen-lockfile` (own install slot),
  `/tmp/sgui-batch84-install.log`. pnpm reported ignored esbuild build scripts.
- PASS: `node --test scripts/fixtures/editor-packed-browser/integrity.test.mjs`
  (own light slot), 4 tests, `/tmp/sgui-batch84-integrity.log`.
  This covers the public JSON oracle's rejection of stale/reordered/lost-format
  results, opt-in routing and matching server/client props, JSX parsing through
  TypeScript, and Node syntax checks of the runner/spec/helpers.
- PASS: `pnpm exec tsc -p scripts/fixtures/editor-packed-browser/tsconfig.json`
  (own light slot), `/tmp/sgui-batch84-types.log`. This checks the new document
  oracle and Playwright case; JSX parsing is checked separately above.
- PASS: `git diff --check`.

No package build, pack, fixture build or browser was run during preparation.
No native pass, whole gate completion, Firefox/WebKit result or production defect
is claimed. Native assertions are prepared and unverified.

## Frozen commands for coordinator authorization

Run from the prepared worker head (or a reviewed testing-only candidate retaining
identical owned bytes), with Node 24 on PATH. One library build is needed before
both consumers. The coordinator owns the heavy window and fixture install leases:

```sh
pnpm build
SGUI_BROWSER_ENGINES=chromium node scripts/test-editor-consumer.mjs --react18 --browser
SGUI_BROWSER_ENGINES=chromium node scripts/test-editor-consumer.mjs --browser
```

Run the two consumer commands sequentially, capture each full command/output and
its printed fixture/evidence paths, and retain any red evidence. The commands use
the repository Playwright runtime against installed tarballs, never a source alias.
The default SSR-only command remains available separately. Chromium is first;
Firefox/WebKit are pending the coordinator batch checkpoint. Do not replace failed
native assertions with forced clicks, retries or simulated Lexical state writes.
Any demonstrated production defect needs an exclusively reserved corrective scope.
