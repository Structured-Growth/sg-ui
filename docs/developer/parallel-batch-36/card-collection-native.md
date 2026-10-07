# M-11 card collection native composition

Current disposition: bounded Chromium composition proof passed in wave27. Earlier
pending/red entries below are preserved history; final evidence is recorded at
the end. Firefox/WebKit and whole-row/manual/device/AT acceptance remain open.

Reviewed baseline: `4c9f859bad204a7d7fd2e3787aa6f293db268525`.
Managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch36-card-collection-native/sg-ui`.
Branch: `codex/batch36-card-collection-native`.
Exclusive writes: CardCollectionWithFooter directory, the focused browser spec,
and this report. Shared footer/card frame and all other source remain read-only.

Read root AGENTS.md and [development validation](../react-aria-development-validation.md),
[batch29 inventory](../parallel-batch-29/inventory-acceptance-02-12.md),
[batch13 collection evidence](../parallel-batch-13/card-collection.md), and
[card pagination contract](../react-aria-card-pagination.md). M-11 remains held;
M-12 standalone footer acceptance and grid reset/shrink evidence are not repeated.
No architecture or API change was made. Wave21 subsequently demonstrated the
constrained enlarged-text viewport defect recorded below.

## Added composition evidence

[NativeCollection story](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.stories.tsx)
has one host pagination owner, explicit accept/reject requests, complete keyed rows,
state replacements, and editable owned fields inside owned cards.
The [unit regression](../../../src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx)
proves withheld page/size requests preserve the cards/select and accepted size
changes request page zero before size and display the matching card slice/count.

[Focused native spec](../../../tests/browser/inventory-card-collection.spec.ts)
contains six cases: four light/dark × compact/comfortable container cases and two
state/pagination cases. It measures 800/780/760/360/320px container changes with a
260px host, the 22.5rem column threshold, no horizontal overflow, visible footer,
internal scrolling, stable input identity/draft/focus, native keyboard scroll at
200% root text sizing, and overlapping keyed card reorder. State cases ensure
loading/empty/ready replace cards/status without replacing the collection/footer,
loading disables navigation, and state changes do not request pagination.
Host rejection then acceptance checks cards, select, count, and exact reset order.
Actual browser zoom is distinct from root text sizing.

## Targeted validation and handoff

`pnpm install --frozen-lockfile` passed under token-owned installation slot0;
608 packages reused, no dependency/lockfile changes. The pre-existing package
manager warning about ignored esbuild scripts was retained; no permission setting
was changed. Token-owned light slot3 serialized the following commands:

- `pnpm exec vitest run src/components/CardCollectionWithFooter/CardCollectionWithFooter.test.tsx --maxWorkers=1`: **7/7 passed**.
- `pnpm typecheck`: **passed**.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: **passed**.

Initial head contained only test/story/report changes. The subsequent owned CSS
correction also passed foundation/token guards as recorded below. No full check, Storybook build, browser server,
CI/title dispatch, consumer suite, merge or publication was started by this worker.
Slots are released only after matching this worker's owner token.

Coordinator request against the clean committed head: fresh immutable Storybook
pool, Chromium first, arguments
`tests/browser/inventory-card-collection.spec.ts --project=chromium --workers=1`.
Final exact head is provided in the authorized coordinator handoff because this
report cannot contain its own commit hash. Assigned source stays reserved pending
actual Chromium proof and any bounded corrections.

**Chromium: pending; Firefox/WebKit: pending coordinated batch checkpoint.**
No queued run counts as a pass. Preserve any red result and classify product,
fixture/driver/expectation, or environment cause before correction. No current
native failure is established. Spoken AT, physical-device behavior, browser chrome
zoom, and broad M/U/X/R/Z acceptance remain unverified. No master checkbox or
whole-row acceptance is upgraded by this patch.


## Wave21 red evidence and bounded correction

Coordinator immutable pool tested exact head
`93a14b7ad35dce4bcfb331f1fdc62e070fa1fc34` on Node `v24.19.0`, Chromium:
**1 passed, 5 failed, zero skips/flaky**. Build/initial/final head remained unchanged.
Preserved artifacts under this worktree:
`artifacts/browser-pool/d58bbd20-e98c-401d-bbdf-f528f2101090/`
(`evidence.json`, `browser.log`, `results.json`, screenshots and traces).

Two underlying issues, not five independent bugs:

1. **Product/layout:** all four theme/density cases failed the full focused-input
   visibility assertion after native Tab at 200% root sizing. Comfortable input
   top was `272.5625` against grid top `285`; compact was `162.75` against `165`.
   The screenshot shows a tall wrapped footer and only a narrow card strip. The
   grid could shrink below a native input's height; scrolling/anchoring cannot
   fully reveal an input larger than its viewport. The owned collection CSS now
   keeps at least one control-height of grid content (plus existing padding) and
   allows the root to scroll when footer chrome exceeds the constrained host.
   Shared footer source remains read-only. Full-input visibility assertions are
   retained unchanged; additional native Tab assertions require the footer size
   selector to be fully visible via the root scroll, which must actually move.
2. **Test expectation:** the state case assumed Status always has `role=status`.
   Source and the native role tree show the default `announcement=off` quiet
   status presentation, with no role; it is neither a progressbar nor a live
   region. The selector now uses the owned status part and still checks exactly
   one replacement, translated text, `aria-live=off`, and absent role. No product
   announcement change was made or spoken behavior claimed.

Pagination host rejection/acceptance passed in wave21. Reorder assertions were
not reached in the four red cases; their native outcome is still pending, along
with validation of the viewport correction. No tolerance was widened, no criteria
were dropped, and no independent browser/build/server run was started.

Correction targeted validation: 7/7 collection unit cases, source and browser
TypeScript, `pnpm foundations:check`, and `pnpm tokens:check` passed. These are
local checks of the corrected source, not a fresh Chromium pass. Exact corrected
clean head is supplied to the coordinator for a new immutable Chromium job with
the same six focused cases. Firefox/WebKit/manual/device/AT remain pending.


## Wave22 candidate red evidence and second correction

Coordinator tested shared candidate
`e6270941ea8828d8868fef0798451a599a9db25f`, with this worker's owned changed files
byte-identical to prepared head `e9d09c688bb4367a8a4369125e28f88405373602`.
Attribution: `/tmp/sgui-batch45-candidate-source-attribution.json`.
Source/build hashes were unchanged and candidate stayed clean. Chromium result:
**2 passed, 4 failed, zero skipped/flaky**. Original candidate/artifacts preserved:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/`
(root and `card-collection-native/evidence.json`, shard log, screenshots, traces).
Lifecycle/quiet status and host pagination cases passed. Compact enlarged-input
full visibility passed; comfortable cases stopped earlier in the normal-size
resize loop, so their enlarged-input correction has not yet been proved.

The actual shard log places comfortable failures at spec line30 (whole footer
bottom), not the enlarged selector assertion: footer bottom `375.296875` versus
host bottom `354`. Screenshot confirms normal-size footer clipping with a 360px
short host. **Owned layout correction:** the new grid minimum was content-box,
adding padding to control-height and unnecessarily forcing footer overflow.
Grid now uses border-box so the minimum already includes existing padding. Normal
whole-footer and focused-input visibility assertions remain unchanged.

**Driver expectation correction:** compact selector had passed full visibility
but root scrollTop was zero; moving the root is unnecessary for an already visible
control. Removed unconditional selector must-scroll assertion. Strengthened keyboard
reachability instead: Tab through enabled Next and Last actions, assert each full
control lies within the host, and require positive root scrolling when the root
actually overflows after reaching the last action. No visibility tolerance widened.
Reorder assertions remain unreached and unproven; no speculative focus fix added.

Second correction targeted checks: 7/7 collection unit cases, browser TypeScript,
foundation and token guards passed. No TypeScript source/API changed since the
preceding source typecheck; no unrelated full check/native/server run performed.
Fresh coordinator Chromium proof of the corrected clean head remains pending.


## Wave23 compact intrinsic-height correction

Coordinator's actual Node24.19 Chromium proof tested candidate
`c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`, byte attribution to prepared
`3a358e9318bdcf70aa5f22d45db4473c04dacaba` recorded in
`/tmp/sgui-batch45-candidate-wave23-attribution.json`. Source/build hashes stayed
unchanged. **4 passed / 2 failed, zero skipped/flaky**. Preserved evidence:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/`
(root/shard evidence, logs/results/traces). The earlier pre-browser attempt stopped
on a child PATH environment error; its cleanup EPERM/recovered dead leases are
retained by the coordinator. That attempt provided no native proof.

Comfortable light/dark full container/enlarged keyboard/footer/reorder cases and
both state/host-pagination cases passed. Compact light/dark both failed enlarged
input top: `162.75` versus grid top `165` (existing minimum assertion `164`).
The snapshot/screenshot shows the focused native input clipped at the grid top;
trace retains grid scrollTop340 across focus and geometry snapshots. This is a
stable **owned layout defect**, not a timing tolerance: compact control-height
is a minimum, while native field body line-height + vertical padding + two 1px
borders can produce a taller actual control. A viewport capped to control-height
cannot show that intrinsic control completely.

Owned grid minimum now takes the maximum of control-height and those actual owned
body/spacing metrics, plus the owned focus outline/offset on both sides. It remains
border-box and keeps the root scroll fallback. This reserves a usable focus stop
without changing shared TextField/footer or local typography. Browser assertions,
tolerances, fixture and API remain unchanged. Comfortable results are historical
candidate evidence, not an automatic pass for this new CSS head; compact downstream
footer/reorder checks remain pending until reached.

Third correction: 7/7 unit cases and foundation/token guards passed. Only CSS and
this report changed; previous source/browser typechecks remain attributable to
the unchanged TypeScript. No independent heavy/native run, unchanged retry, or
acceptance upgrade occurred. Coordinator fresh Chromium proof remains pending;
Firefox/WebKit/manual/device/AT remain open.


## Final wave27 Chromium proof and completion handoff

Original frozen worker source/spec head:
`397d89cc040905c6b7cbe905243b0b72fa10de37`.
Actual shared testing candidate:
`4987a1fe046c37f2e612d6de159aa09e1e840043`.
Read-only `git diff --name-only <worker> <candidate> --
src/components/CardCollectionWithFooter tests/browser/inventory-card-collection.spec.ts`
returned no changed paths: the complete owned component directory and spec are
byte-identical. This is shared candidate proof with exact worker attribution,
not an independent browser run at the original worker head. Shared prerequisites
belong to their respective owners; no Dialog recovery fix or other worker's
implementation/evidence is claimed by this M-11 history.

Coordinator pool on Node `v24.19.0` built fresh immutable Storybook once and ran
`pnpm exec playwright test '(?:^|/)tests/browser/inventory-card-collection\.spec\.ts$' --project=chromium`
with one worker. **All 6 Chromium cases passed, no retries, zero skipped/flaky**:
all four light/dark × compact/comfortable native reflow/focus/draft/reorder cases,
state replacement/quiet semantics, and host-controlled pagination rejection then
acceptance with reset order. Downstream compact footer/keyed-focus assertions
are now reached and passed. Historical unit 7/7, source/browser typechecking and
foundation/token guards retain their exact local source attribution above.

Preserved pool root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/afadf38b-8476-4c9b-a10e-2a78d786822d/`.
Read `evidence.json`, `card-collection-native/evidence.json` and its `browser.log`;
shard results/traces remain adjacent. Source digest initial/final:
`f51549571de652b8a8be38addfc49b31da7c903aba36c7e4f0301385bc752b79`;
build digest initial/final:
`101bdd11ab686d9bad4c31857100322d960ee4edfcd19068dc77c1c06aec7a3e`.
Final head equals the tested candidate and final status is clean. Commands settled
and coordinator released owned leases. Overall pool status is red for unrelated
grid-shell/pointer scopes; the complete card-collection shard is green. No broader
pool success is claimed. Original wave21/22/23 red evidence stays preserved.

Only this report changes after proof; source, story, unit test and browser spec
remain frozen at the attributed worker bytes. No additional tests/builds/native
servers ran during report finalization. Final clean report commit is returned to
the coordinator for individual history review/integration; no candidate history
merge, dev/main merge, publication or master-checkbox change occurs here.
Firefox/WebKit await coordinated checkpoints. Actual browser zoom, physical devices,
spoken assistive technology, broad acceptance and whole M-11 acceptance remain open.
