# Wave04/15 — docs provenance and final reconciliation

Recommend **A-D-20 and A-W-16 complete** for their original documentation obligations;
**15 assigned leaves remain partial**. No canonical checklist/count changed. The
starting/current canonical snapshot remains181acceptedA/139openA,300acceptedV/0openV,
and6future. All17original full criteria, individual decisions, exact evidence paths
and SHA-256 values are in [results.json](results.json).

## Concrete implementation

Later user steering authorized direct new standalone scripts. Implemented:

- `packages/ui/scripts/check-docs-provenance-wave04.mjs`: read-only immutable local-Git
  extraction identity/presence/replacement guard; TypeScript AST checks all33original
  story modules against32direct current fixtures and the documented Button replacement;
  checks27explicit pnpm command snippets in four current guides. Missing mappings,
  fixture exports, replacement files and package scripts fail. Upstream authentication
  is explicitly outside local Git evidence.
- `packages/ui/scripts/check-docs-provenance-wave04.test.mjs`: five meaningful regression
  tests for lost/changed provenance, replacement/presence errors, omitted scenario
  aliases and stale script/filter commands, including prose false-positive handling.
- [consumer-removed-exports.patch](consumer-removed-exports.patch), mirrored under
  [proposed-files/docs/migration.md](proposed-files/docs/migration.md): all12absent
  baseline names get explicit replacements and migration impact, including MenuItem's
  type-versus-JSX boundary and retained aliases. The coordinator concurrently
  integrated this exact table: the observed shared guide hash matches the reviewed
  proposed hash, and reverse patch applicability passes. **Do not reapply it.**
- [migration-trace.json](migration-trace.json): all37Mrows now have current source/test
  hashes and completed V attribution, with HB19/20linked to the10affected editor rows.
  Actual per-row reviewed PR attribution remains explicitly unverified.
- [commitment-gate-map.json](commitment-gate-map.json) updates the prior repository
  commitment map with current source hashes and wave04ownership, retaining original
  commitment text/prior evidence limits. [completion-state.json](completion-state.json)
  keeps migration completion and publication authorization false.

All other authored files stay under wave04/15. Shared docs/ledgers/source/build outputs
were read-only here; the concurrent shared guide integration was coordinator-owned.
No install, build, server, browser, simulator, Git mutation, release or account action.

## Executed validation

[validation-results.json](validation-results.json) and check-1through4logs retain
actual commands and exit codes. Node26.5.0 was used for these lightweight tooling
checks, not supported-runtime product acceptance:

1. `node --test packages/ui/scripts/check-docs-provenance-wave04.test.mjs`:5pass.
2. `node packages/ui/scripts/check-docs-provenance-wave04.mjs --json`: structural
   checks pass:201rows,33originalstory modules,32direct transfers,1documented Button
   replacement and27command snippets;16earlier grid scenarios explicitly unresolved.
3. The same command with `--strict-history`: **exit1**, exactly16early grid exports
   still require semantic comparison/accepted disposition. This remains a failed
   strict acceptance check, not green history parity.
4. `git apply --reverse --check .../consumer-removed-exports.patch`: passes after
   coordinator integration; initial forward success and later state-change failure
   are explained in [retained-tooling-findings.md](retained-tooling-findings.md).
5. `python3 .../audit-doc-links.py`:646trackedMarkdown documents,5156local references,
   4280present,619missing-file findings,257absolute routes explicitly unchecked,
   zero unresolved explicit reference labels.611missing-file findings occur in
   evidence/batch/proposed-mirror paths; the other8are dated historical references
   in inventory/progress/release reports. These are retained for source review,
   not automatically repaired or accepted as current links. Bounded parser does
   not certify full CommonMark, MDX/TSX, arbitrary inline-code paths or shell execution.
6. `python3 .../reconcile.py`: all17reviewed prior report/result pairs match;
   all201manifest presence/replacement checks pass,159present/42absent, original
   source repository/commit/root preserved. Sequential source comparisons record
   concurrent input changes explicitly; no whole-tree atomic attestation is claimed.

## Accepted evidence reused and newer reconciliation

The former unexecuted wave03successors are no longer all pending. Retained follow-up
logs show the icon catalog case, both foundation cases after the specific locator
correction,94catalogroutes/1138compiledsnippets, and English/pseudo/Arabic formatting,
count/clear/reflow plus navigation motion cases in all3desktopengines. HB19and20close
all20previous editorVleaves with named native and rendered receipts. The prior
300/300Vrecord is preserved; no unrelated browser matrix was repeated.

[evidence.json](evidence.json) records exact prior/current/source/receipt hashes,
including absent ignored raw report paths. [foundation-input-comparisons.json](foundation-input-comparisons.json)
records which selected production foundation inputs were actually captured by the
old build inventory; null means not captured, not an invented hash match. The
follow-up foundation-spec hash matches its dedicated validated input receipt.
The raw first docs failures and corrected continuations remain retained upstream.
Current simulator speech proves only its two-selector scenario; it cannot stand
in for English/Arabic count/clear or six-family spoken observations.

A-D-20 closes the shipped source-backed foundation examples/publication obligation
under the approved docs host. A-W-16 closes the integrated truthful migration/manifest
update obligation. Neither asserts original upstream-byte authentication, every
historical story's behavioral parity, all-library documentation completeness, legal
approval, remote deployment, product release or migration completion.

## Per-leaf remaining work

| Original leaf | Recommendation | Specific successor |
| --- | --- | --- |
| A-B-07 | partial | B07-RAW: join recoverable controls/navigation/modal/grid raw captures to original theme/density interaction receipts. Wave03-29 reported historical HB roots absent; do not relabel unrelated calendar images. Capture only proven missing slices on an admitted immutable host; review each candidate. |
| A-B-12 | partial | B12-UPSTREAM: obtain an authorized original-commit archive/reference behavior; B12-GRID16: compare the16early grid scenarios listed in extraction-lineage.md against owned behavior or record a human decision. Manifest presence cannot establish semantic parity. |
| A-B-14 | partial | B14-AUTHENTICATE: owner supplies read-only commit-bound upstream source/behavior evidence and unchanged status against a known upstream baseline. Local extraction commits cannot authenticate unavailable upstream bytes. |
| A-D-20 | complete | None for this publication/examples obligation. Remote hosting rollout, optical/device/AT certification and final A gates are separate; this recommendation does not imply them. |
| A-I-08 | partial | I08-NATIVE: execute prepared I-S2 geometry/naming/direction/contrast cases on matching compiled output and inspect optical captures; I08-PACKED: retain supported-runtime exact-candidate pruning/notice attribution. Do not rerun the already passing docs case solely for credit. |
| A-H-08 | partial | H08-SPEECH: obtain actual English/Arabic count/clear speech and long-label observations using the prior operator record or expanded simulator scenarios. Current simulator selector speech is a different scope. DOM live-region checks cannot stand in for the outstanding speech successor. |
| A-M-38 | partial | M38-REVIEW: attach actual per-row reviewed PR/commit and exact validation receipt, then reconcile original A-M criterion holds. Initial draft PR1 and latest touched commit do not prove review; transitive guard evidence remains required for relevant changed candidate inputs. |
| A-W-10 | partial | W10-GRID16: disposition16initial grid export behaviors individually; W10-PUBLIC12: finish DOCS-005-b01 throughb12 public examples, including adapters/calendar/grid helpers; retain current public/native source and focused evidence. No Storybook restoration. |
| A-W-13 | partial | W13-API: join complete historical inherited-prop/default/release-marker dispositions with the A-B-05/A-Z-13 owner. The12removed-export table is already integrated. |
| A-W-16 | complete | None for this documentation/manifest obligation. Original upstream authentication and16grid behaviors remain explicitly open in B12/B14/W10; retaining those limits satisfies truthful provenance rather than asserting parity. |
| A-W-18 | partial | W18-OWNER: record supported-release/backport window, cadence/accountable maintainer and confidential intake/disclosure authority in the existing dependency decision record. W18-API: join final default/breaking/public-experimental decisions. No support SLA or policy can be invented here. |
| A-W-19 | partial | W19-REVIEW: review619missing-file records:611are in evidence/batch/mirror paths,8are historical non-evidence-guide links; do not call them current defects automatically.257absolute routes are unchecked. Broad inline-code path/command validity and MDX/TSX literals remain outside this bounded parser. Reuse existing typed/snippet receipts only for matching inputs. |
| A-Z-05 | partial | Z05-POLICY: human decision on literal-zero historical names versus provenance-preserving migration explanations, with explicit scope. Current lineage calls its reference policy proposed; cannot silently accept an exception or delete legal/history evidence. |
| A-Z-11 | partial | Z11-CANDIDATE: coordinator joins exact final candidate/package,input closure,supported Node22/24 React18/19 SSR/hydration/RSC/Next,performance,required engine/device/spokenAT/visual/support and production CI receipts. Run only changed or genuinely missing scopes; configured jobs and this source audit are not executions. |
| A-Z-12 | partial | Z12-HUMAN: coordinator supplies complete actual conversation commitment/approval coverage. Resolve M10navigation/M14card/M30typeface criterion decisions without deleting original clauses or silently duplicating APIs. Peer proposals require review; dispatch is not acceptance. |
| A-Z-15 | partial | Z15-FINAL: reconcile all15wave04reports/integrated patches,exact reviewed PR/commit/run identities and final dependency/feature/owner/legal decisions. Preserve FUT-A-20/FUT-D-21/FUT-G-24/FUT-K-13/14/15 only; required unfinished work cannot become optional. |
| A-Z-16 | partial | Z16-CLOSE: satisfy every remaining required acceptance/decision/evidence gate before marking migration complete. Publishing requires explicit human release approval,production validation and configured workflow; no promotion,tag,version edit or publish here. |

[validation-plan.json](validation-plan.json) gives bounded runnable commands,
preconditions and expected assertions. Reuse passing scopes whose relevant inputs
match; coordinator serializes only changed/missing validation. Do not restore
Storybook, repeat completed V work, turn unfinished requirements into future scope,
substitute DOM/axe for speech or infer human legal/release/support decisions.
