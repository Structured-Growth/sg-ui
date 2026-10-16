# Wave 03-14 — overlay focus, collision and modality

**Five partial; zero acceptance leaves newly closed.** Concrete successors are
implemented as a reviewable, unapplied [four-file patch](overlay-successors.patch)
and matching [proposed-file mirrors](proposed-files). No production/source/test/
documentation file outside this evidence directory was edited. No overlay engine
redesign or new production bug is claimed without reproduction.

Read AGENTS, final-acceptance guidance, assignment, prior reports/results and the
coordinator integration snapshot. Reused their accepted unchanged results rather
than rerunning a broad suite. The base is modified `dev` at
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`; see [exact evidence](evidence.json).
The starting153 A/20 V/6 future ledger is not changed by this handoff.

## Delivered changes

1. **AppModal native fixture:** replaced shared mapped ContainerBoundary open/width/
   tab state with separate `ContainerSurface` owners. Existing trigger/dialog names
   and native scenarios remain available. Added `Ownership`, a public-package
   AppModal/Menu/Tooltip/PageRichTextEditorSection/nested-child composition with
   a separately scoped sibling. Its portal theme/density/dir/lang change while
   mounted. Added `ContractMatrix`, whose25 modal hosts own their state separately:
   six sizes × four heightMode values, plus explicit540×440 custom chrome.
2. **Three focused native tests:** combined actual menu hit/focus, tooltip bounds,
   live1100↔360 resize, scope propagation, editor-link cancel/apply transaction and
   repeated child-return focus; real document scrolling before/after nested lock,
   native wheel suppression and child Tab/Shift+Tab containment; and size/height
   geometry, draft retention, footer reachability and return focus for the matrix.
   Layer/portal/scope/geometry observations attach as JSON. The matrix places focus
   on the final field programmatically before native Tab to the footer; it does
   not claim keyboard traversal of every intermediate field. Existing20-field
   traversal/sticky/whole-dialog tests retain that separate assertion scope.
3. **Production docs shell regression:** one appended test resizes1280→960→375→1280
   while AppModal's native lock is active, compares locked/unlocked same-viewport
   header/sidebar/main/preview x and width, checks return focus and restores original
   geometry. It retains the existing classic-scrollbar setup. No gutter or native
   lock CSS is disabled or replaced.
4. **Maintained ownership guidance:** proposed addition to proof-controls documents
   the interaction engine's modal stack and lock lifetime, equal modal-layer portal
   ordering, scoped anchored layers, host focus ownership, and the distinction
   between root text enlargement and actual browser chrome zoom.

The new exports are in the already registered AppModal fixture module. The
coordinator's normal registry/build pass discovers them; there is no generated
registry/manifest/lockfile patch here. Production docs examples already have separate
Example owners and are preserved. No generic filler examples or new public API.

## Original leaves

The exact original checklist requirements are retained per leaf in
[results.json](results.json), with exact commands, hashes, limits and successors.

| Leaf | Result and concrete outcome | Still required |
| --- | --- | --- |
| A-C-17 | Partial. Ownership contract plus combined dialog/menu/tooltip/editor test and real hit-target observations delivered. | Integrate/build/execute at frozen host; source layer values and typechecking do not prove visual ordering. |
| A-U-08 | Partial. Nested document lock/wheel/Tab/final unlock and production shell resize tests delivered; existing title/description/reasons/removed-opener behavior retained. | Native execution, durable removed-opener/explicit-host-focus receipts and actual AT modality/announcement observations. |
| A-U-19 | Partial. Active menu/tooltip collision at360px plus portal scope changes and existing Popover collision assertions retained. | Actual browser chrome zoom and remaining ComboBox/Select/date overlay families. No CSS text enlargement is called zoom. |
| A-X-04 | Partial. Editor dialog cancel returns toolbar focus, apply preserves selected text as a real link; repeated child close returns opener. Existing batch52 explicitly covers removal/host placement with two-frame stability. | Frozen-host execution plus broader grid/reorder/update and editor V focus transitions, which this overlay patch does not certify. |
| A-M-08 | Partial. Separate fixture owners, full size×height input matrix/custom override and F-C08/T-C08/V-C08 [clause mapping](clause-matrix.md). | Native matrix, retain/recover sticky tab/whole-dialog/custom md/lg receipts and actual spoken overlay acceptance. |

No patch-only acceptance closure or automatic checkbox/count update is requested.
Each row's patch still needs integration and runtime validation.

## Checks performed and retained evidence

- `node docs/developer/final-acceptance/wave-03-14/check-candidate.mjs` — **pass**,
  zero diagnostics. Compiler host reads candidate files in memory at their real
  module paths, resolving public compiled package declarations and installed React/
  Playwright types. No emit/build/registry mutation. [Final output](candidate-types-final.txt).
  Runtime was **Node26.5.0**, pure analysis only, not supported Node22/24 acceptance.
- `python3 docs/developer/final-acceptance/wave-03-14/capture.py` — **pass**;
 75 scoped inputs/output/docs/receipt paths hashed, base/candidate/patch hashes
  recorded. All20 selected AppModal runtime/unit/spec/fixture inputs match
  wave-02-01; zero differences. All17 selected comparable coordinator inputs match;
  zero differences. All10 assigned prior report/result hashes match assignment.
  Existing F/T/V and FA-04 evidence is retained within its dated head/host/engine
  limits; no individual unit totals or fresh full-distribution acceptance inferred.
- `git apply --check docs/developer/final-acceptance/wave-03-14/overlay-successors.patch`
  — **pass**, [empty success log](patch-check.txt). No patch applied.
- `node --check docs/developer/final-acceptance/wave-03-14/native.config.mjs`
  — **pass**. This coordinator-ready config requires an admitted immutable host,
  rejects user port3000, starts no server, uses one worker/zero retries and writes
  receipts only inside this directory.

Retained first failures: [initial helper import failure](candidate-types.txt) used
an incorrect TypeScript installation path. [Next typecheck](candidate-types-rerun.txt)
found two unsupported `Provider lang` props and three missing ambient Node-type
references in the analysis harness. Corrected language scope to public ThemeScope,
set installed Node type roots and reran to zero diagnostics. These were candidate/
harness issues, not reproduced production defects. The failed logs remain intact.

Inspected `/tmp/sgui-calendar-validate.mjs`; no heavy/unit/browser job was attempted,
so no shared lease was acquired or bypassed. No host was admitted for this owner;
no existing host/user examples were mutated. No install/build/catalog generation,
server startup, broad suite, packed-consumer, actual zoom, AT/device, remote CI or
release work occurred.

## Coordinator handoff

[validation-plan.json](validation-plan.json) contains integration prerequisites,
exact build/test commands and expected assertions. Use the normal coordinator
lease and supported runtime. Before applying, recheck base hashes and patch
applicability because all chats share a dirty checkout. Freeze and hash the new
fixture/package outputs before native runs. Recover accepted old raw receipts first;
run only missing/unmatched existing cases alongside the three new tests.

[operator-cases.md](operator-cases.md) supplies real browser chrome zoom and named
screen-reader procedures. These are unexecuted external evidence requests, with
no fabricated operator approval. Preserve independent editor V and grid-focus
successors. No central ledger, branches/index/history, personal Obsidian file or user3000 changed.
