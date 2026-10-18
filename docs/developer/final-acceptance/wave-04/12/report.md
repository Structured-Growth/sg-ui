# Wave04/12 — browser keyboard, focus and SSR

**Recommendation: 0 complete, 13 partial, 0 blocked.** Every assigned original
criterion and its exact remaining successor is retained in `results.json`.
All300V completion and139openA are the newer canonical context; no acceptance
count, checklist, shared source, build output, commit or branch was changed.
HEAD matched assigned `6c485ed79d0d6a521d188e5bde8315722296f518` at capture.

## Concrete deliverables

`review-and-hydration.patch` and `proposed-files/` contain eight repository-relative
files for coordinator review/integration:

1. New `packages/ui/scripts/visual-baseline-review.mjs`, declaration and five
   meaningful helper tests. The integrity gate requires all48named matrix images,
   explicit accepted observations, actual reviewer metadata and image/source/host/
   interaction hashes. Missing, pending, rejected, duplicate, changed or escaping
   image paths fail. Recorded source files are rehashed against the checkout.
   It does not authenticate a reviewer, prove successful interactions, inspect a
   running host or determine whether the manifest covers the full source closure.
2. Existing visual config: explicit capture/compare modes, candidate output in a
   fresh directory, required review gate before comparison, `updateSnapshots:none`
   for comparison and rejection of CLI snapshot-update flags. The old config could
   create missing snapshots under Playwright's normal default without review;
   that source-confirmed acceptance gap now has a concrete proposed guard.
3. Existing packed lifecycle runner: preserve **every initial ID-bearing server
   node and ID**, compare all initial named input/textarea/select values and
   disabled flags immediately after hydration, assert month/course/notes initial
   values, and resolve initial hydrated label/description references before any
   portal interaction. Record server/hydrated observations in the receipt.
   Existing no-global SSR, exact leap-day/date/comparison assertions, zero browser/
   recoverable errors, nested portal updates, sibling isolation and sequential
   focus-return assertions remain. No new install, consumer or duplicate matrix.
4. New `wave04-browser-acceptance.spec.ts` supplies three finite cases on existing
   fixtures: English/Arabic composed shell landmarks, heading levels/current-link
   names, actual native Enter submission and field DOM/value/focus preservation
   through reflow; plus all 20 tabbed-modal fields and both footer buttons reached
   by native Tab, text-spacing/root-font stress, clipping/hit tests, reverse Tab,
   open-dialog resize and Escape restoration. Console/page diagnostics and any
   external service request fail the new tests. No fixture registration is needed.
   New `playwright.wave04-browser-acceptance.config.ts` runs these three cases plus
   the existing nine removed/surviving-opener cases serially in three engines on an
   explicit isolated coordinator host. It starts no server. The optional `--grep`
   in the validation plan runs only the nine new executions when old evidence
   already covers removed-openers.
5. Maintained `docs/developer/react-aria-visual-baseline-review.md` explains the
   actual review procedure, receipt schema, candidate/no-update comparison commands,
   host-manifest prerequisite and limits. No candidate images, baseline approval
   or fabricated review receipt are supplied.

`patch-inputs.json` binds each existing target's base bytes and all proposed files.
The patch dry-run passes. These are proposals; no shared file was modified.

## Accepted evidence reconciled

Read AGENTS, acceptance/hardening execution guidance, wave03 reconciliation and
all nine assigned prior owners' reports/successors, then newer followup, HB19/20
and simulator receipts. `evidence.json` preserves26/26matching prior report/result
hashes, four raw native/docs report hash matches, direct source/evidence hashes,
15/16matching followup selected source inputs, and exact raw native case statuses.
The one changed selected input is docs `presentation.json`; this16-file comparison
is not a full current source/output attestation.

The raw followup report confirms **15selector, nine overlay, nine grid and12
primitive executions passed**. The system-indication scope has nine unique final
passes using the original rail/color passes plus corrected three-engine color
continuation. Original WebKit capability failure is retained; unsupported
forced-color-adjust remains unsupported. No duplicate corrected pass is counted
as additional coverage. HB19/20 separately record current editor/native fixes,
reviewed captures and239affected unit passes; their exact shared-input changes
and screenshot engine scopes remain explicit.

Consequently old “integrate/run” requests for the selector cases, editor overlay
ownership and trusted grid entry are superseded. `changed-behavior-delta.md` maps
these concrete successors and newer BUG0013/Menu fixes to shipped assertions and
receipts. Do not repeat accepted inventories or blanket suites to reconstruct them.
Direct spec hash equality does not prove full transitive host equivalence after
shared Menu or selection changes.

## Per-leaf recommendation

| ID | New reconciliation/deliverable | Specific work still required |
| --- | --- | --- |
| A-X-01 | Semantic toolbar probes integrated; current affected-unit/native selection evidence retained | Finish bounded remaining assertion/mock review against changed behavior; jsdom geometry does not establish native focus. |
| A-X-02 | All five selector contract cases pass across engines; editor keyboard/RTL evidence newer | Map remaining component-specific applicable keys to exact accepted native cases; no universal all-keys claim. |
| A-X-03 | Native selector roles/descriptions/forms pass; initial hydration associations strengthened | Execute packed proposal; reconcile remaining route headings/landmarks/validation and actual announcements separately. |
| A-X-04 | Nested/editor return, trap, dismissal and grid disappearance successors executed | Recover matching batch52 removed-opener/host-focus two-frame receipt or run only that uncovered existing scope; retain separate reorder/update evidence. |
| A-X-05 | Retain real Tab stress/reflow and narrow editor/overlay geometry | Actual200%/400% browser-controls zoom with independent shell panes, sticky focus stops, text spacing and open-overlay resize. |
| A-X-06 | Corrected native system-indication checks retained with unsupported capability limits | Named rendered text/non-text/state contrast and actual OS-high-contrast observations for claimed platforms. |
| A-X-09 | Trusted grid entry successor now executed; retain desktop pointer/focus/layout/portals | Named physical-input and clipboard-policy observations with explicit environment limits. |
| A-X-13 | Concrete changed-contract/native assertion delta supplied, including completed editorV | Coordinator freezes full changed-contract inventory and accepts remaining specific gaps; execute new proposal slices only. |
| A-X-14 | Existing48-image comparator retained; capture and reviewed comparison separated | Capture missing representative48images, inspect, bind review hashes and run no-update comparison. Existing HB reviews keep their own scope. |
| A-X-15 | Executable fail-closed review gate and maintained procedure; five tests pass | Coordinator integrates/adopts gate and performs actual attributable image review/comparison. Tool validity is not visual approval. |
| A-X-16 | Source lifecycle evidence retained; all initial server-ID-node/wire preservation authored | Execute strengthened packed nested-scope proof; preserve component-specific mount-fixed ownership contracts. |
| A-X-17 | Reuse installed18.3.1/19.2.3 immutable consumer driver/fixtures | Actual same-tarball type/SSR/hydrated matrix on supportedNode22.12/24; no developmentReact substitute. |
| A-X-18 | Original historical checked status retained; broader hydration stays partial | Execute strengthened runner in both installed React consumers; sourceSSR cannot certify native hydration/all-export global safety. |

No leaf is labelled blocked merely because its remaining observation is external.
No actual speech is inferred from DOM/axe. The simulator receipt supplies actual
Select VoiceOver service output within one scenario; it supplies neither the
six-family human review nor physical touch. CSS text scaling is not actual zoom.

## Checks actually performed

- Five pure review-integrity tests pass on supported **Node24.19.0**; log:
  `review-gate-tests-node24.log`. No browser or build starts in these tests.
- Proposed visual/native configs and native spec semantic check: **TypeScript5.9.3, zero diagnostics**, no emit;
  `proposal-types.json`. Stronger hydration runner passes `node --check` only.
- Playwright discovery finds **36 tests in two files across three engines**
  (nine new executions, 27 existing); `native-discovery.log`. This is listing,
  not runtime acceptance. Isolated transpiled discovery mirrors remain here.
  The first native authoring check used an unsupported Playwright `current` role
  filter; its diagnostic is preserved in `proposal-types-first-native-failure.json`.
  The corrected test queries actual `aria-current` through the accessible link.
- Patch dry-run exit0, `patch-check.log`; no patch applied.
- Read-only scoped raw-report/source comparison, `capture.log` / `evidence.json`.

The first helper-test run used defaultNode26.5.0 and five ephemeral OS temporary
directories, each removed by its finally block. This was outside the requested
write boundary. The corrected Node24 replay sets `SGUI_REVIEW_TEST_TMP` inside
this assigned directory. No shared source or persistent outside file was changed.
Both logs remain; Node26 is not used as supported-runtime acceptance.

`validation-plan.json` gives ordered coordinator commands and prerequisites:
review/apply the patch, reuse one immutable native host for48candidate captures
and review/comparison, run the three new composed native cases (and only uncovered existing removed-opener cases), and run the existing lifecycle proof once per already
installed React version (12cases each). Preserve all failures. No new builds,
installs, heavy browser/simulator runs, servers, commits, pushes, branch changes,
release/account-setting mutations or owner/legal decisions occurred here.

## Native follow-up after coordinator integration

Both new composed-shell cases passed in all three engines. The modal case exposed
a genuine already-focused field remaining outside the viewport after open resize
in Chromium/Firefox. A granted single Chromium diagnostic run confirmed actual
offscreen geometry without changing the visibility predicate. The coordinator
applied the precise Dialog resize-reveal fix; its rebuild/native continuation
remains coordinator-owned. One focused StrictMode/lifetime regression is supplied
as a proposed addition to existing Dialog tests. See `modal-resize-diagnosis.md`,
`modal-resize-results.json`, and `dialog-resize-lifetime-test.patch`. These are
scoped successors, not blanket completion of the 13 original obligations.
