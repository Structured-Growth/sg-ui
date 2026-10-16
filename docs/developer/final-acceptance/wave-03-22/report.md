# Wave 03-22 — cards and step announcements

Three assigned original leaves remain partial. One concrete defect fix is prepared as a reviewable patch; no change outside this evidence directory was applied. No central count/checklist or acceptance claim was changed.

## Substantive result

`instructor-literal-labels.patch` removes InstructorClassCard's two post-translation `.replace` calls, adds two focused colocated regression cases and updates developer guidance. The translation adapter already returns formatted text. For example, supplying an activity label containing `Draft {value} $&` currently causes the final rendered label to be interpreted a second time; dollar replacement syntax can additionally expand surrounding text. The patch renders the returned translation directly, preserving literal host content and the adapter's final translation. No props, callbacks, assets, date parser, menu, CSS or lifecycle-status API are added.

`literal-replacement-repro.txt` records a successful Node 24.21.0 reproduction using the actual owned ICU formatter and the current source's replacement operation. It proves the string corruption and the already-correct formatter result; it is not a React/native execution. `proposed-files/` mirrors the exact three target files. The test assertions cover default fallback DOM/SSR, literal braces/dollars/markup-like content, final host translations and namespace/value forwarding.

`git apply --check` succeeds for the patch without applying it. The artifact syntax/dependency check passes (Node 24.21.0, TypeScript 5.9.3); this is explicitly not a typecheck or behavioral result.

The separate candidate Vitest harness substitutes the proposed implementation content at the original source ID in memory, so relative library imports still resolve and shared source remains untouched. `validation-plan.json` provides exact baseline/candidate and post-integration commands. The first two harness attempts failed before collecting tests due to harness paths and dependency resolution, both corrected in the saved final harness. Two subsequent admitted-run attempts stopped immediately because the shared validation lease was occupied. These logs are preserved. The final harness has not run; neither baseline React failures nor candidate passes are claimed. The patch remains pending coordinator integration and focused runtime validation.

## Reused current evidence

Read AGENTS.md, final acceptance guidance, assignment/prior reports and coordinator-integration/evidence.json. Compared all recorded runtime closures, unit tests, native specs, fixtures and targeted built outputs for AppOperationSteps, InstructorClassCard and LearnerClassCard against wave-02-01 exact hashes: 50, 64 and 83 compared paths respectively (overlapping dependencies counted per component); zero changed and zero uncompared paths. `evidence.json` contains the path/hash comparison and exact prior test-title references. Retain the accepted F/T/V evidence for these unchanged inputs; no already-passing unit/native suite was repeated for credit.

Shared frame and Typography rules already supply overflow-wrap:anywhere. Long text is covered by retained next100 source preservation plus native/HB geometry. The initial suspicion of missing card wrapping was discarded after reading those dependencies. No speculative CSS patch is included.

## A-M-03 — partial

Original: Reconcile AppOperationSteps final acceptance: State announcements, completed/error/active visuals, hide single-step numbering. Link F-C03, T-C03 and V-C03 evidence and any unresolved defects.

Retain wave-02-01 F-C03/T-C03/V-C03: explicit accessible state text, ordered noninteractive steps, distinct completed/error icons and tones, reduced-motion active progress, no single-step number and mounted host Status identity. Actual speech remains missing. The library deliberately owns no live region; the host's Status announces completion/error milestones while percentage updates remain quiet.

Successor `W02-01-C03-AT`: use `at-operator-receipt.md` with the existing NativeStateTransitions fixture. It supplies exact keyboard actions, expected host ownership and empty fields for real OS/browser/AT/source/build/speech evidence, including retry. No operator session was available; no speech was fabricated. No component patch is justified by this external evidence gap.

## A-M-14 — partial

Original: Reconcile InstructorClassCard final acceptance: Status/menu/actions, callbacks, long text, date and icon fallbacks. Link F-C14, T-C14 and V-C14 evidence and any unresolved defects.

Retain wave-02-01 F-C14/T-C14/V-C14, batch66 native status/model replacement, route once per Enter, host-formatted de-DE dates/missing labels and HB-12 localized presentation. The new literal-content defect affects a previously uncovered host string input. Successor `W03-22-C14-integrate-literal-labels` is actionable through the supplied patch and two regressions, but remains unapplied/unvalidated in React.

Successor `W02-01-C14-intent` still requires explicit owner disposition for the original menu/callback/date/icon wording. `scope-disposition.md` maps every clause to current shipped ownership and precise evidence, with an explicit decision column. Current card offers one actionHref Link through the host router, required host activity text and fixed decorative assets. No undeclared menu or persistence callback is implied and no owner approval is manufactured.

## A-M-15 — partial

Original: Reconcile LearnerClassCard final acceptance: Progress/due labels/status/actions, translation, accessible interactive regions. Link F-C15, T-C15 and V-C15 evidence and any unresolved defects.

Retain wave-02-01 F-C15/T-C15/V-C15, normalized named progress, locale/referenceNow due text, invalid-date fallback, separate Details/Continue actions, native destination semantics and corrected all-engine ICU/destination parity shard. Current source has no lifecycle-status prop. Successor `W02-01-C15-status` remains an owner attribution decision: whether the status clause means progress/due presentation or requests a separate approved lifecycle API. `scope-disposition.md` is ready for that review. No new learner defect is asserted and no accepted flows were repeated.

## Validation and limits

See `validation-plan.json` for exact commands and expected assertions; `evidence.json` for input/output hashes; `results.json` for all three original leaf records. `artifact-hashes.json` hashes delivered patch/proposed files/harness/logs. Logs include original harness failures and occupied-lease errors rather than hiding them. Reproduction and artifact checks use the existing cached Node 24.21.0; default shell Node 26 is not used for acceptance.

No install/build/catalog generation, server start, shared example mutation, broad suite, real screen reader, device result, new native engine result, packed consumer execution or release occurred. User server 3000, dirty shared source, personal workspace state and other owners' files were preserved. Pending owner decisions and AT receipt remain external; the patch alone does not close runtime acceptance.
