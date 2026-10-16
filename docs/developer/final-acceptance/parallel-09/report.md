# Typography final acceptance reconciliation — parallel-09

Reviewed 2026-10-16 on dirty `dev`, HEAD
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Assigned original leaves:
A-D-07, A-D-08, A-D-09, A-D-10 from
[hardening tasks](../../react-aria-hardening-tasks.md). Recommendations:
**three complete, one partial**. Shared acceptance checkboxes/counts are unchanged.
Only this directory was written. No test, build, install, browser, consumer,
server, release, Git mutation or additional agent was run.

[results.json](results.json) contains per-leaf findings, exact SHA-256 input/output
comparisons, resolved typography metrics, scoped font scan results and successors.
The relevant FA-01–04 work is reused, not repeated. All 23 selected maintained
files match their FA-02 hashes; built Typography JS/declarations and styles.css
match FA-01. These are selected-input comparisons, not a newly captured complete
transitive native-host fingerprint. FA-04's 1,738-case reconciled baseline and
package receipt remain their own dated evidence; this report produces no fresh
runtime pass.

| Leaf | Status against the full original requirement | Evidence and limits |
| --- | --- | --- |
| A-D-07 | **Complete** — requested roles and owned bodyAlt2 replacement exist without module augmentation. | [Typography](../../../../packages/ui/src/experimental/Typography/Typography.tsx) owns 15 visual variants: h1–h6, body1/body2/bodyAlt2, subtitle1/2, caption, overline, button, code. [Token source](../../../../packages/ui/src/foundation/tokens.json) defines size/weight/line-height metrics and label/control roles. [Table CSS](../../../../packages/ui/src/experimental/Table/Table.module.css) maps body2 table content, label-weight headers and label-sized captions; table is a component role rather than a `table` Typography variant. [TextField CSS](../../../../packages/ui/src/experimental/TextField/TextField.module.css) uses owned control-text and label metrics. Public primitives reexport owned prop/variant/element types, and inspected built declarations use HTMLAttributes, not augmentation. bodyAlt2 remains spelled bodyAlt2, now explicitly owned (0.875rem/1.45/500). Definition completion does not certify rendered readability across consumers. |
| A-D-08 | **Complete** — documented semantic HTML selection is independent of appearance. | [Architecture](../../react-aria-architecture.md), [migration](../../../migration.md) and [current consumer guidance](../../../../apps/docs/content/component-usage/presentation.json) explicitly separate `as` and `variant`; guidance gives h2/h5. Public JSDoc makes the same promise. Implementation uses createElement(as), defaults to p regardless of variant. [Typography tests](../../../../packages/ui/src/experimental/Typography/Typography.test.tsx) assert h2/h1 appearance and absence of an h1; [regression](../../../../packages/ui/src/experimental/Typography/Typography.next100-regression.test.tsx) changes semantic and visual roles independently. [Typefaces fixture](../../../../packages/ui/src/components/Typefaces/Typefaces.native-fixture.tsx) uses h2/h5, h3/body2, p samples and native code. Host document hierarchy and spoken AT navigation remain separate obligations. |
| A-D-09 | **Partial** — rem metrics and representative enlargement/localization evidence exist; full zoom/spacing/font-substitution tolerance is unestablished. | Resolved text sizes are rem and line heights unitless. [Typography CSS](../../../../packages/ui/src/experimental/Typography/Typography.module.css) wraps anywhere; deliberate noWrap truncates. [HB-16 retained report](../../backlog-execution-2026-10-15.md#hb-16-completed--typography-table-and-inherited-density) records 8/8 Chromium, 8/8 WebKit and corrected 8/8 Firefox, 32 reviewed captures per engine, at 360px/150% root text, English/Arabic, both themes/densities. [Permanent spec](../../../../packages/ui/tests/browser/hardening-typography-table-presentation.spec.ts) checks all 15 roles/inline fragments, computed metrics, table roles/header associations, horizontal scrolling, focused-link reveal and document bounds. [Current fixture](../../../../apps/docs/native-fixtures/scenarios/experimental/Box/Box.fixture.tsx) retains long localized content. These are useful bounded historical results, not actual browser-chrome zoom or changed-font evidence. |
| A-D-10 | **Complete** — deliberate Geist/system ownership is retained without a library font download or mandatory asset. | [README](../../../../README.md) assigns optional Geist font loading and global resets to hosts; architecture explicitly says host-supplied Geist. Tokens resolve to `"Geist", "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; code has ui-monospace/SFMono-Regular/Menlo/Consolas/monospace. Current production-source scan found zero @font-face, Google font hosts, next/font or font-file references and zero font binaries under packages/ui/src. Generated font values remain aligned. No SGUI font asset/license requirement was found. This criterion does not certify a host's optional font license/network behavior or substituted glyph layout. |

## Retained test and native evidence

[Typography test source](../../../../packages/ui/src/experimental/Typography/Typography.test.tsx)
has 17 cases (two native DOM assertions and 15 SSR variant cases).
[SSR composition](../../../../packages/ui/src/experimental/Typography/Typography.ssr.test.tsx),
[Typography lifecycle](../../../../packages/ui/src/experimental/Typography/Typography.next100-regression.test.tsx)
and [Typefaces regression](../../../../packages/ui/src/components/Typefaces/Typefaces.next100-regression.test.tsx)
cover browser-global absence, role/ref lifecycle, catalog completeness and source
consumer compatibility. FA-04 retains these unchanged files within its passing
baseline; jsdom/SSR assertions are not native browser layout or AT evidence. The
native-props test title mentions styles, but that test does not assert styles;
Typefaces regression separately asserts marginTop forwarding. No stronger claim
is inferred from the title.

[FA-04](../../react-aria-final-acceptance.md#fa-04-local-unitpackagerelease-and-replacement-host-baseline)
retains the original failed full run, targeted correction and package evidence.
None of these Typography tests was among its four corrected files. The original
failure remains a failure; reuse follows the coordinator's documented affected-
input reconciliation, not a claim that the original all-in-one check passed.

HB-16's exact head is not given in its prose; its intended immutable receipt is
`packages/ui/artifacts/hb16-2026-10-16/manifest.json`. That manifest and the three
named accepted results paths are **absent** in this checkout. No hb16/hb05/typeface
artifact directory was found directly under either library or docs artifacts.
Therefore HB-16 is retained report evidence here; no raw results/capture review or
native exact-head equivalence is claimed. Its historical Firefox initial failure
and assertion correction remain described in the backlog; they are not a new
observed component failure. Existing completed native cases were not rerun.

[Earlier D-07–09 reconciliation](../../parallel-batch-99/acceptance-evidence.md)
at `e43bf604be74e0daf731bc990e6c3097f05ed89b` supports the same narrow role/semantics
conclusions and leaves D-09 partial. [Earlier font reconciliation](../../parallel-batch-100/acceptance-evidence.md)
supports the deliberate font strategy at that head. Those source-only reviews are
historical, not browser results. The current [display-preferences spec](../../../../packages/ui/tests/browser/display-preferences.spec.ts)
contains modal 200% root text and line/letter/word/paragraph spacing overrides.
That test source establishes intended coverage only; its historical executions
retain their own head/artifact limits. It does not fill an all-library D-09 gap.

## Required successors for A-D-09

1. **D09-EVIDENCE — coordinator evidence retention.** Locate/archive the existing
   HB-16 host manifest, successful engine results and reviewed captures in durable
   storage. Reconcile the complete relevant input/host hashes before applying them
   to this dirty checkout. Reuse completed cases; missing local receipts alone
   are not a reason to rerun unchanged checks.
2. **D09-ZOOM-FONTS — bounded native/manual acceptance.** Exercise actual browser
   zoom at 200%/400% with recorded CSS viewport, explicit text spacing (line 1.5,
   letter .12em, word .16em, paragraph 2em), and changed font metrics (Geist absent,
   system sans-serif and monospace substitutions). Include long English/Arabic
   labels, both densities, Typography/fields/navigation/table/modal compositions.
   Assert complete content and target reachability, visible keyboard focus,
   deliberate internal scroll and no accidental document overflow. Capture exact
   head, source/host/output hashes, computed fonts and reviewed screenshots. Use
   actual engine/manual settings for claims about zoom; root font-size scaling is
   a different input. Preserve device/AT obligations separately.

No failing implementation was reproduced in this read-only task. No production
fix is proposed without a concrete failure. These successors close evidence
holes; the 20 editor V leaves and unrelated acceptance gates remain open.

## Checks performed

Read AGENTS, final-acceptance execution ledger and full assigned leaf wording;
inspected current implementation, tokens, public declarations, guidance, fixtures,
assertions and historical reports. Read Git HEAD/branch/status without mutation.
Compared selected SHA-256 values with FA-01/02; resolved shared token aliases;
scanned production source for font loaders/binaries; checked recorded native
receipt existence. Exact structured findings are in results.json. No web/remote
CI inspection or complete package/source recapture occurred.
