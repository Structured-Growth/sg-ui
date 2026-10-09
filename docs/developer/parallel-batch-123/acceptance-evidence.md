# Batch 123: X-07/X-08/X-09/X-10/X-13 acceptance evidence

Reviewed baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`).
Review date: 2026-10-07, America/Chicago. Isolated managed checkout:
`/Users/thomashall/.codex/worktrees/batch123-acceptance/sg-ui`.
Only this report changes. All five parent criteria remain unchecked in
[the master list](../react-aria-master-task-list.md). This is a fresh read-only
criterion/evidence assessment, not another M-row inventory or acceptance closure.
No install, test, build, pack, browser, performance, CI or lease commands ran.

## Per-ID matrix

| Criterion | Assessment at reviewed head | Exact support and remaining gate |
| --- | --- | --- |
| X-07 target size, spacing and coarse pointer | **Partial; missing acceptance evidence.** | `src/foundation/tokens.css` defines compact `2rem` and comfortable `2.75rem` heights; Button uses minimum inline/block sizes and IconButton uses the height for width. These are 32/44 CSS px only at a 16px root, not measurements of every actual hit area. Grid resizers are narrow dedicated targets; checkbox/radio indicators must be assessed with their associated label hit areas. No coarse-pointer branch was found in the inspected foundation/experimental CSS, and no catalog-wide target/spacing/coarse-pointer measurement gate was found in browser specs. This does not prove a WCAG failure or require every target to be 44px. Root must record actual target geometry, spacing/overlap and applicable exceptions under the chosen WCAG requirement, in both densities and representative coarse-pointer contexts, then physical primary-touch usability. Axe scans and density tokens alone cannot close this criterion. |
| X-08 keyboard and single-pointer non-drag alternatives | **Partial; row-reorder slice supported.** | `ownedGridInteraction.tsx` renders Move up/down Buttons invoking the same reorder request path as drag. `batch01-grid-reorder.spec.ts` checks Enter/Space and pointer Move with focus repair; `reorder.spec.ts` checks trusted touchscreen taps with zero dragstart. Retained artifact A below independently confirms the emulated-touch slice, at its exact historical candidate. Full acceptance still requires operation inventory, including public and experimental column resizing, verification of each applicable single-pointer alternative and keyboard path, boundary/cancellation cases and manual AT/device evidence. Keyboard resizing alone is not proof of a single-pointer non-drag resize alternative. Host save/rollback remains host-owned. |
| X-09 actual browser pointer/touch, focus, layout, portals and clipboard | **Partial; actual native slices supported.** | `acceptance.spec.ts` uses native mouse/keys, nested dialog/popover dismissal/focus and native download bytes; `reorder.spec.ts` observes trusted native events; `editor-clipboard.spec.ts` uses keyboard Copy/Paste and trusted transfer data; display-preference and portal specs cover native layout/focus. Retained A verifies touch and B verifies grid native clipboard/denial at a historical candidate. Existing spec files establish coverage intent, not a current pass. Require fresh root-owned runs at an attributed head for the complete selected matrix; physical touch, OS clipboard prompts, IME and spoken AT remain separate. No synthetic-event or DOM-emulation result is substituted for native execution. |
| X-10 Chrome/Firefox/WebKit plus representative touch/AT | **Partial; three-engine infrastructure established.** | `playwright.config.ts` configures Desktop Chrome/Firefox/Safari engine profiles, one worker, zero retries and failure traces/screenshots. `.github/workflows/ci.yml` installs Chromium/Firefox/WebKit and runs the suite on Node 24 with 14-day artifacts. Browser acceptance docs record earlier Linux three-engine success at `83b8dae2148002e79d2df331fd105c274f97ca96` (run 37560065588), and later bounded results/failures. Those are historical reports, not verified current CI or branded-browser/device coverage. The referenced downloaded artifact directory is absent here; remote availability was not queried. A is Chromium emulated touch only. Root must obtain fresh three-engine evidence and name device/OS/browser and screen-reader/AT versions, scenarios, observed announcements and owners. Playwright WebKit does not establish physical Safari/iOS acceptance; axe is not spoken AT. |
| X-13 browser stories/tests for all changed behavior; local deterministic fixtures | **Partial; inspected fixture pattern supported.** | Native specs navigate loopback static Storybook; the row-reorder story uses five local rows, local host simulation/timers and StrictMode rather than authentication/database/service requests. The existing native specs cover the representative changed reorder/clipboard behavior; A/B retain executed evidence. This does not establish “all changed behavior” across the current catalog. Root needs a change-to-story/spec-to-run attribution ledger, including newly integrated changes and unrun engine subsets, with fresh build/source digests. No new story or redundant proofcase is added by this report. |

## Retained artifacts independently read in this review

Evidence root (local, retained):
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f/`.

Aggregate `evidence.json` exists and hashes to
`5cb3d884baa20acc27afbaef230469ebabddf30d48f6c10a0dc32c69f5c1b59c`.
It records `status: passed`, initial/final HEAD
`1a378accd909a471e653fe4e27fe9457c9531049`, empty final status,
matching initial/final source and build digests, and `cleanup: owned commands settled`.
Runtime: Node `v24.19.0`, Playwright `1.63.0`. This review reads those records;
it does not independently rerun or certify resource cleanup.

| Artifact | Independently checked result | SHA-256 |
| --- | --- | --- |
| A: `pooled-touch-url/results.json` | expected 1, skipped/unexpected/flaky 0; duration 3464.65ms; Chromium selected touch Move case | `1954167d8ca540d71598a6d899506ee0cca9e3a1be14d805daaf5bd0134d17f0` |
| B: `clipboard-pooled-origin/results.json` | expected 4, skipped/unexpected/flaky 0; duration 22290.229ms; Chromium grid clipboard cases | `ee06a0868f42aa2e5f76325ea54430f714f4758ba956b63b14065df071c18593` |

Direct `git show` byte comparison against the tested candidate confirms current
`reorder.spec.ts` SHA-256
`48485ccc9c464397fd72577dd9750db494e5ecc4655683b5bd42dc3e4a82a169`
and `batch05-grid-clipboard.spec.ts` SHA-256
`91e108dcb3bd96c1963bc153bd0ffec8a1a586e2b9a31ffb2f273f708e932cdd`
are identical to that candidate. Production/source tree identity with today's
baseline is **not** established by matching spec bytes. A/B are historical slice
evidence, never today's full matrix. Attribution and detailed event/permission
limits remain in [batch 68](../parallel-batch-68/pooled-touch-url.md) and
[batch 71](../parallel-batch-71/clipboard-pooled-origin.md).

Existence inspection found `/tmp/sgui-ci-83b8dae2-artifacts`,
`/tmp/sgui-ci-calendar-browser`, and
`/tmp/sgui-clipboard-final-browser-results.json` absent. Their documentation
claims are preserved as historical provenance; no payload was available here to
independently check them. A documented expiration is not a live availability check.

## Exact Git blob anchors at the reviewed baseline

Paths below are repository-relative; retrieve with
`git show e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>`.

| Path | Git blob |
| --- | --- |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `src/foundation/tokens.css` | `b36050c8871253823b4a9deb8d146936a14222ec` |
| `src/experimental/Button/Button.module.css` | `cccf005e0bdee43ac22d8f8830523938ce5167f6` |
| `src/experimental/IconButton/IconButton.module.css` | `be70d39b2981129870afbd8ebebc2d8e33bebee1` |
| `src/components/AppDataGrid/ownedGridInteraction.tsx` | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| `src/components/AppDataGrid/ownedGridInteraction.module.css` | `5755e97b79b1befefca13e7b76126869ddfa9aa3` |
| `tests/browser/reorder.spec.ts` | `2449eb6339a6bf5eb9c1d193fe0ad3cc5d9acc91` |
| `tests/browser/batch01-grid-reorder.spec.ts` | `eeca05b54067ec5526fd5fce44c0de7ed3cef68e` |
| `tests/browser/acceptance.spec.ts` | `f11daf0511e310efbf365ade27ed482ddc6b5daa` |
| `tests/browser/editor-clipboard.spec.ts` | `62f6f3d3234ed78bdb2f99deb9831bec1dae35c6` |
| `tests/browser/batch05-grid-clipboard.spec.ts` | `bcc2517d1a5a41b30f7253d4a97c1812a00c4590` |
| `playwright.config.ts` | `ef2fb5556b35d18e74c7c02cdc512e92f2964223` |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
| `docs/developer/react-aria-browser-acceptance.md` | `41db9ad1186ddccbb84fabcd2a23237e05300c56` |
| `docs/developer/parallel-batch-68/pooled-touch-url.md` | `8a47e50a1d37d020e11ead84d8b5da0c95bfdfe0` |
| `docs/developer/parallel-batch-71/clipboard-pooled-origin.md` | `cf65d729b005cc63e83c48b794bff5b59d7e7186` |

## Bounded coordinator handoff

No confirmed production defect is claimed and no optional test is prepared:
existing fixtures already express the retained slices; more duplicated cases
would not resolve missing catalog/manual evidence. Root alone accepts/integrates.

1. X-07: reserve a geometry/coarse-pointer audit against existing deterministic
   Button/IconButton, calendar and grid fixtures. A possible future exclusive
   test-only allowlist is `tests/browser/acceptance-pack-123.spec.ts`, with this
   report; production paths require separate evidence and assignment. Check
   computed hit rectangles, adjacent targets, density, actual media capability
   and trusted taps. Status **UNRUN; request root validation window**. If a defect
   emerges, propose only its affected component/style/test paths then.
2. X-08: investigate column resizing's single-pointer non-drag path before
   alleging a missing behavior; inspected catalog renderer exposes ColumnResizer
   but no separate resize action in that header. Future narrow investigation
   starts read-only in `ownedGridInteraction.tsx`, its layout controller and the
   experimental DataGrid implementation. Any source repair needs a new exclusive
   allowlist and owned API decision, plus native pointer/keyboard checks.
3. X-09/X-10/X-13: root obtains head-attributed selected native runs and the
   three-engine checkpoint; device/AT reviewers supply named manual evidence.
   Retain red attempts and missing artifacts, rather than converting old green
   slices into today's full acceptance. No parent checkbox is waived.

Checks actually performed: clean baseline/ref inspection; managed-worktree
creation before editing; `rg` source/spec/document inspection; `git rev-parse`
blob anchors; Python file existence, JSON statistics and SHA-256 reads; exact
candidate/current spec byte comparison. An initial search used nonexistent
`src/foundation/styles`, `src/foundation/tokens` and `tests/browser/helpers.ts`
paths; subsequent inspection used the actual token files and native spec files.
These search misses were not tests. Final whitespace/link/scope checks and the
individual report commit accompany the handoff; no UI pass is claimed.
