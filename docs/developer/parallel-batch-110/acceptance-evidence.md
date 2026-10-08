# Batch 110: U-02/U-04/U-05/U-06 acceptance evidence

Reviewed 2026-10-07. Exact inspected head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (B).
Disposition: **all four parent criteria remain partial**. Implementation and
contract slices below are supported by current Git source; no fresh runtime pass,
whole-parent acceptance, or integration decision is claimed.

Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch-110-acceptance/sg-ui`.
Branch: `codex/batch-110-acceptance-evidence`. Exclusive actual change: this report.
Optional `tests/browser/acceptance-pack-110.spec.ts` was not created: existing
regressions cover the identified native slices; the outstanding layout combination
needs an appropriate story and the input-base/grouping question needs an owner
contract decision. Neither warrants fabricated or duplicate test work.
Only coordinator `01a1164f-41db-7f30-aaf9-f20133b6566f` accepts, updates shared
acceptance records, schedules validation and integrates. This review does not
repeat inventory M-row acceptance or use migration completion as U acceptance.

## Per-ID evidence matrix at B

| Criterion | Supported current source/contract slice | Disposition and exact remaining gate |
| --- | --- | --- |
| U-02 | Box has nine bounded native element choices, container width/padding/ref; Stack supplies direction/gap/alignment/justify/wrap and a 38rem media breakpoint. Surface supplies default/subtle and flat/outlined/raised token-backed surfaces; Card/Content compose Surface/Box with article/outlined and padding-4 defaults. Divider supplies horizontal/vertical and decorative semantics. CSS modules are in `sgui.components`; generated scope tokens resolve surfaces locally. These exports are in `/experimental`; Box/Stack/Divider also route through the public primitive barrel. [Layout contract](../react-aria-layout-actions.md) identifies Surface as the owned surface replacement. | **Partial.** The implementation wording is supported, but source attributes/SSR tests do not establish actual responsive wrapping, computed container/gap geometry, DOM/Tab order, nested light/dark variants or forced-color rendering. Existing Default layout stories do not contain the combined wrapping/nested-scope scenario. No demonstrated source defect; no new production allowlist justified. Existing batch-13 layout reservations remain owner prerequisites, not completed evidence. |
| U-04 | TextField has internal React Aria Input, naming union, input ref, native required validation, Label/Text description/FieldError association and string host values. TextArea specializes the same contract for multiline native input, refs, descriptions/errors/required/reset. Colocated tests inspect both descriptions together without replacing the accessible name. RadioGroup supplies a named group and descriptions/errors; checkbox/switch stories use native fieldset/legend. | **Partial.** Input base is internal upstream Input, with no exported SGUI-owned InputBase; no dedicated generic grouped-text-field primitive/contract is exposed. This absence is a **contract clarification gap**, not proof that a new primitive is necessary: the owner must decide whether internal base plus native fieldset composition satisfies the parent wording. Existing RadioGroup grouping is not generic grouped-text-field acceptance. Native TextArea association/reset and TextField reassociation attestations below cover bounded subsets; artifacts are missing at checked locations. Generic grouped-field legend/error associations and actual AT announcements remain unverified. TextArea/RadioGroup are `/experimental` only; promotion is already an API-owner decision in [API reconciliation](../react-aria-public-api-reconciliation.md), not a new defect. |
| U-05 | Checkbox owns label, boolean checked/default/callback, mixed presentation and native name/value; Switch owns label/checked/name/value/description; RadioGroup owns string option values/labels, required/errors and orientation. Native disabled-fieldset request guards exist in Checkbox/Switch. RadioGroup repairs native Tab entry when a selected option is removed/disabled without selecting a replacement. [Forms contract](../parallel-batch-01/forms.md) documents checked submission, unchecked/disabled omission, mixed serialization following checked, read-only values, and host-controlled reset. Space toggle and arrow-radio/disabled skipping are documented in [layout/actions](../react-aria-layout-actions.md) and tested in colocated files. | **Partial.** Implementations and keyboard/form semantics are supported; final Checkbox correction is historically Chromium-only, Switch/RadioGroup have bounded Chromium/WebKit attestations. Current integrated three-engine behavior is not established; original failing correction runs remain failures. RadioGroup empty/all-disabled required groups and standalone delegated-reset prevention remain specifically open. Manual spoken mixed/required/error state and physical-device acceptance are separate. Switch deliberately has no required/error contract; required consent uses Checkbox. Removed FormControlLabel is mapped to owned labels, not an absent replacement regression. |
| U-06 | Select/ComboBox expose stable unique string IDs with nullable controlled clear and disabled option keys; labels are presentation. ComboBox locally filters host options through interaction locale and serializes keys. Autocomplete aliases that implementation. Single-selector loading/remote error are host-composed disabled/description/invalid/error states. AsyncMultiSelect (`/experimental`) owns supplied query/results/state, multiple selected records retained outside results, repeated ID form values, translated loading/empty/error/retry, disabled/loading/error result blocking and native busy bridge. Host owns fetching/cancellation/freshness. [Selector contract](../parallel-batch-01/selectors.md) defines all these boundaries. | **Partial.** Contract/implementation wording is supported without adding multiple selection to ComboBox. Historical five-case selector suite predates current direction changes, so it cannot certify current integrated selectors. Async native busy has one historical Chromium case only; broader reset/direction evidence does not establish AT speech. Coordinator needs a fresh bounded three-engine run of existing selector/busy/reset specs at the integrated head and retained artifacts, plus manual AT/device acceptance. No demonstrated missing runtime behavior or speculative production fix is identified. |

## Historical runtime records and retention limits

The rows below are **retained Git report attestations**, not new passes. Exact-head
comparisons used `git diff --name-only TESTED B -- component-directory spec`.
An empty result establishes only identical scoped bytes, not identical dependency,
shared-helper, stylesheet, story build, environment or integrated behavior.
No current full matrix is inferred from these results.

| Slice / retained report | Historical tested head and outcome recorded there | Current scoped identity / artifact inspection |
| --- | --- | --- |
| [TextField reassociation](../parallel-batch-11/standalone-form-reset.md) | `e1c922c94b87ec3232d328c97861eae0f2b904a2`; Chromium/WebKit 8 passed across the combined standalone-reset spec; immutable digest `4a48c6cef56daabe0bee43adbcce636dbeab7eb595ad6d3f02dab431ea17ca5f`. Not 8 TextField-only cases. | `src/experimental/TextField/` and `tests/browser/batch11-standalone-reset.spec.ts` identical to B. Recorded review-worktree pool `efd7fe1f-9c81-4198-943c-ae903c651f2c/evidence.json` missing. |
| [TextArea](../parallel-batch-13/control-textarea.md) | `719836343fc38902e1c9a21107bc4e6bc83cf14b`; Chromium/WebKit 4 passed (2 per engine), reset/ref/form/complete description association; digest `4eb09922e12a59b9810aa5e4b3f56371841b69dc66c6a0d647c9f694bee3905a`. | TextArea directory and `batch13-control-textarea.spec.ts` identical to B; pool `06da65b7-ddad-45ea-91d2-c463aac09d60/evidence.json` missing at recorded original worktree. |
| [Checkbox](../parallel-batch-13/control-checkbox.md) | `ee27dcf11aac93ef2063e13576772d09641278e4`; final Chromium 2 passed, inherited-disabled guard/reset; digest `aaa9cf86c4df1aa451f5b31aceeb6d44bfee3604e6848d097396032f653dc830`. Earlier three-engine fieldset failures are explicitly retained. | Checkbox directory and `batch13-control-checkbox.spec.ts` identical to B; pool `77a9063e-5c98-4ad9-97d7-d76e45c513b0/evidence.json` missing. Final correction Firefox/WebKit remains pending in that report. |
| [Switch](../parallel-batch-13/control-switch.md) | `fdcb9b7faa90520bd925be0ffa1be109e8a60861`; Chromium/WebKit 2 passed, disabled fieldset/reset/independent names; digest `479bfcd6df3a7c1ebfafc6f1c810a87219b29a6844accb275ac40b301c57a431`. Prior red/actionability attempts are not passes. | Switch directory and `batch13-control-switch.spec.ts` identical to B; pool `badca55a-4638-4860-b514-d2dbc19f60e7/evidence.json` missing. Native first-legend pointer, Firefox, physical touch and AT remain unverified. |
| [RadioGroup](../parallel-batch-13/control-radiogroup.md) | `d2b1ccf045f7e1fe62902b6cf1cf60f49fb4d93f`; Chromium/WebKit 6 passed, native removed/disabled-selected Tab entry and required/reset; digest `7bf4f8d7d8b2c007f8a24b2af18d87f9a162b743f7b4873fd12db33ae61b98d1`. | RadioGroup directory and `batch13-control-radiogroup.spec.ts` identical to B; pool `185a7f37-358d-40ab-9bd1-db78691921de/evidence.json` missing. No whole radio required/empty/reset acceptance. |
| [Selectors](../parallel-batch-01/selectors.md) | Implementation commit `b1119a0504004200bfdb8f0938cf78c4e47ca4dc`; report records 10 Chromium/WebKit passes and 5 Firefox launch failures before interaction. Source commit is supplied, but report does not independently bind exact browser-run head beyond its implementation/finalization narrative. | Select/ComboBox directories **differ** at B (direction bridges/stories/tests); browser spec is unchanged. Recorded `batch01-selectors/sg-ui/artifacts/browser-results.json` missing. Do not transfer the old suite's pass to B. |
| [Async busy](../parallel-batch-14/async-native-busy.md) | `4306d22e9037d0b40149f855e9ad9043e59ffe9b`; Chromium 1 passed, busy/failure/retry/success/independent owner; digest `8809c9d614e80dcf99d3b8223c8226781cc611e68bc519838791536b2c959267`. | AsyncMultiSelect directory and `batch14-async-busy.spec.ts` identical to B. Pool `c1e7370f-e355-4ee4-bb4f-d868e342e835/evidence.json` missing in both named original and recovery worktrees. Firefox/WebKit and spoken busy remain pending. |

Artifact checks used `Path.is_file()` on the exact absolute locations derived from
those reports, under `/Users/thomashall/.codex/worktrees/<recorded-name>/sg-ui/artifacts/`.
The corresponding batch01-forms `artifacts/browser-results.json` was also missing.
This establishes loss/unavailability **at those paths**, not that remote/archived
copies never existed. No deleted/archived worktree was restored and no broad disk,
credential or CI search ran. Traces, screenshots, raw logs and immutable builds
were not independently recoverable from these checks. Retained Git reports and
hashes therefore preserve provenance but do not replace raw-artifact review.
Browser run counts above are historical worker attestations, with engine and
manual/device/AT limits intact. Root may locate other retained evidence or schedule
its next window; no acceptance waiver follows from local artifact loss.

## Current Git proof manifest

Each hash below is `git rev-parse B:path`, not a working-tree digest or run result.
Links resolve to the corresponding retained current files. Test declarations and relevant assertions were inspected
and were **not executed** in this assignment.

| Current evidence file | Git blob at B |
| --- | --- |
| [src/experimental/Box/Box.tsx](../../../src/experimental/Box/Box.tsx) | `24269904eb35e0dbb84a5a809df0222ca4ca7943` |
| [src/experimental/Stack/Stack.tsx](../../../src/experimental/Stack/Stack.tsx) | `5c30bca34069aa899c8e38479ade3bf7aaa7acb0` |
| [src/experimental/Surface/Surface.tsx](../../../src/experimental/Surface/Surface.tsx) | `97d4e81997fbd0e8e6426ec0139a4f65387f1255` |
| [src/experimental/Card/Card.tsx](../../../src/experimental/Card/Card.tsx) | `2958daed3352aa00eee3d85153de2dd97be0ec7d` |
| [src/experimental/Divider/Divider.tsx](../../../src/experimental/Divider/Divider.tsx) | `4925f167d7a9271cf894226c3989749f03d9c520` |
| [src/experimental/TextField/TextField.tsx](../../../src/experimental/TextField/TextField.tsx) | `de1f43a5e341da219f3aa353ed90bc1b13b6308e` |
| [src/experimental/TextArea/TextArea.tsx](../../../src/experimental/TextArea/TextArea.tsx) | `0b5bc7747b138cddff9d7ba1b7da9e5faab7545b` |
| [src/experimental/Checkbox/Checkbox.tsx](../../../src/experimental/Checkbox/Checkbox.tsx) | `5d4b8c2ad4af90ee897225ff4d5ebb9c2fdac9b3` |
| [src/experimental/Switch/Switch.tsx](../../../src/experimental/Switch/Switch.tsx) | `5cc7c538949e97e64b41d7b8b28c46c55cfe59bc` |
| [src/experimental/RadioGroup/RadioGroup.tsx](../../../src/experimental/RadioGroup/RadioGroup.tsx) | `a4066df47f478d815a3f9be10fe2fa3f6b54be40` |
| [src/experimental/Select/Select.tsx](../../../src/experimental/Select/Select.tsx) | `e4d05fbdef870aec23f46fbe34deef6bc723f62e` |
| [src/experimental/ComboBox/ComboBox.tsx](../../../src/experimental/ComboBox/ComboBox.tsx) | `2beb5253e85aeafd87b291325a9e69d761b30074` |
| [src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx](../../../src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx) | `f450901bffbc4a0da0fc6c95b71ddc49c1fb3de8` |
| [src/experimental/Box/Box.module.css](../../../src/experimental/Box/Box.module.css) | `7d6f13b779d9b7fc421a0bd29394b661eb3e190f` |
| [src/experimental/Stack/Stack.module.css](../../../src/experimental/Stack/Stack.module.css) | `1faf7f975aeb4d1c39b70b7569fb796d386cf8ca` |
| [src/experimental/Surface/Surface.module.css](../../../src/experimental/Surface/Surface.module.css) | `138edde127995739e5c8c38b5ae72231eaaeddb2` |
| [src/experimental/Divider/Divider.module.css](../../../src/experimental/Divider/Divider.module.css) | `fc516832bc324e53f08a33de5e7934de9d0185e7` |
| [src/experimental/TextField/TextField.module.css](../../../src/experimental/TextField/TextField.module.css) | `bf558fdb356596f7357cde20c0a4c7fc52a1d798` |
| [src/experimental/TextArea/TextArea.module.css](../../../src/experimental/TextArea/TextArea.module.css) | `602d8443012e51e704847f2b283d52a740e8ee3a` |
| [src/experimental/Box/Box.test.tsx](../../../src/experimental/Box/Box.test.tsx) | `2ef1152593b2fdf37ea8570b48fb09b673e3e35d` |
| [src/experimental/Stack/Stack.test.tsx](../../../src/experimental/Stack/Stack.test.tsx) | `51c4831c4ce7b4db76d7f361474ba4cc9c73fca7` |
| [src/experimental/Surface/Surface.test.tsx](../../../src/experimental/Surface/Surface.test.tsx) | `c1155730346efd2ba6e93020d5afb2a13e6b4da9` |
| [src/experimental/Card/Card.test.tsx](../../../src/experimental/Card/Card.test.tsx) | `559b02eb198bb2f8eb89f290842c6b3c474c6b8c` |
| [src/experimental/Divider/Divider.test.tsx](../../../src/experimental/Divider/Divider.test.tsx) | `6aecabbf6d07e25437b22bc872a55f68135d0de5` |
| [src/experimental/TextField/TextField.test.tsx](../../../src/experimental/TextField/TextField.test.tsx) | `e6109c735077cc629301ea575cc5698dbffac82d` |
| [src/experimental/TextArea/TextArea.test.tsx](../../../src/experimental/TextArea/TextArea.test.tsx) | `1bbe169fa2cc356bf59e4cc0d356de7e5959441f` |
| [src/experimental/Checkbox/Checkbox.test.tsx](../../../src/experimental/Checkbox/Checkbox.test.tsx) | `8d2e941e4b967bccf19cd75d003e5138f7c1c87e` |
| [src/experimental/Switch/Switch.test.tsx](../../../src/experimental/Switch/Switch.test.tsx) | `15e7e0920e219480ea285f7f3caa3dd42c7f6860` |
| [src/experimental/RadioGroup/RadioGroup.test.tsx](../../../src/experimental/RadioGroup/RadioGroup.test.tsx) | `4417e93f4b07f3f20246747bbe1e95ef44393e94` |
| [src/experimental/Select/Select.test.tsx](../../../src/experimental/Select/Select.test.tsx) | `d4129eaae2bfe6f339c9a8727593eec2bce9e17c` |
| [src/experimental/ComboBox/ComboBox.test.tsx](../../../src/experimental/ComboBox/ComboBox.test.tsx) | `9f661c6f78ef76d5207fd67b7d6c3503b46b0e28` |
| [src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx](../../../src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx) | `0d55b878d020ebc2923d45df8e38f7cc70bf04a5` |
| [src/components/primitives/index.ts](../../../src/components/primitives/index.ts) | `43de81eedf14f9fc4119ff29cf9ae99cb8245c4f` |
| [src/experimental/index.ts](../../../src/experimental/index.ts) | `1ddfaaa40ff4e61f53d5853428abbe000075f61b` |
| [src/foundation/tokens.css](../../../src/foundation/tokens.css) | `b36050c8871253823b4a9deb8d146936a14222ec` |
| [docs/developer/react-aria-layout-actions.md](../../../docs/developer/react-aria-layout-actions.md) | `d5bb37391920da442d64ed16979bb97ed8e34159` |
| [docs/developer/react-aria-public-api-reconciliation.md](../../../docs/developer/react-aria-public-api-reconciliation.md) | `98165e3f545ddc7a3d08a5f0301ac8b0814d56b1` |
| [docs/developer/parallel-batch-01/forms.md](../../../docs/developer/parallel-batch-01/forms.md) | `6f3ffb9c7c91499d9086dfa9875410c0b1cbd591` |
| [docs/developer/parallel-batch-01/selectors.md](../../../docs/developer/parallel-batch-01/selectors.md) | `b66a36703b915c5a39c86e9ad468d8feb87ae7ca` |

## Minimal owner handoff and checks actually performed

No actual missing behavior was reproduced, so no fix chat, production change or
new browser regression is proposed as a proven defect. The following are bounded
**remaining-evidence** scopes; coordinator must respect existing reservations:

- U-02: existing batch-13 Box/Stack/Surface/Card owners retain their native layout
  scopes. For the concrete Stack gap, reserve only `src/experimental/Stack/Stack.stories.tsx`
  and `tests/browser/batch13-control-stack.spec.ts` plus that owner's unique report.
  A wrapping row with nested scopes is absent from the existing Default fixture;
  measure the 38rem breakpoint, wrapping, gap and Tab/DOM order under a fresh root
  window. Do not claim that a new story was allowed/created by batch 110.
- U-04: owner resolves internal Input versus owned input-base and generic native
  fieldset grouping against the exact parent wording. Initial decision scope can
  be only `docs/developer/react-aria-public-api-reconciliation.md`; any new public
  primitive/export changes require a separate exact allowlist. If composition is
  approved, reserve only `src/experimental/TextField/TextField.stories.tsx`,
  `src/experimental/TextField/TextField.test.tsx` and a uniquely assigned native
  spec for two fields under a legend with required/error/external descriptions.
  Check native labeling/description IDs, submission, disabled inheritance, and
  focus; manual AT still belongs to the AT owner. No speculative implementation
  path or promotion is authorized here.
- U-05/U-06: existing native specs suffice for the covered slices; request root's
  bounded current-head window for `batch13-control-checkbox`, `batch13-control-switch`,
  `batch13-control-radiogroup`, `batch13-control-textarea`, `batch11-standalone-reset`,
  `batch01-selectors` and `batch14-async-busy`. All are **UNRUN at B in this assignment**.
  Three engines, retained raw artifacts, immutable build/tested-head binding and
  actual manual/device/AT review remain required by their owners. These checks
  would support only their assertions, not close entire parents automatically.

Read-only inspection: root instructions, README, migration/component architecture,
master criteria, layout/proof/primitives/API contracts, current implementations,
CSS, barrels, test assertions, stories and cited historical reports. Commands:
`rg --files`, targeted `rg -n`, `cat`/`sed`, `git status --short`, `git rev-parse`,
scoped historical `git diff --name-only`, and Python exact-path file existence.
One attempted `react-aria-controls.md` read found no such file; actual contracts
were subsequently read. Large broad outputs were truncated; subsequent focused
reads supplied the relied-on exact source and report sections.

Report validation: relative-link/path existence, exact changed-file allowlist,
manifest blob resolution and `git diff --check`. No install, runtime/unit test,
typecheck, build, pack, browser, performance, global lease/queue or CI command ran.
No new test count/pass, supported-runtime pass or combined full-matrix result is
claimed. Primary image-upload and all other worktrees/resources were preserved;
no merge/main/publish/force/deletion/workflow/secrets/credentials action occurred.
Final clean report commit is supplied in the authorized coordinator handoff to
avoid a self-referential hash. Acceptance/ledger/master files remain unchanged.
