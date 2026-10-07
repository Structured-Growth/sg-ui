# Batch 104: C-12–C-15 acceptance evidence

Inspected baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`).
Managed isolated worktree: `/Users/thomashall/.codex/worktrees/batch-104-acceptance/sg-ui`.
Branch: `codex/batch-104-acceptance-evidence`. Initial checkout was clean at that
exact baseline. Only this report changes. The coordinator owns acceptance and
integration; no master checkbox, inventory row or broad gate is closed.

## Per-criterion disposition

| ID | Disposition at inspected baseline | Concrete evidence | Remaining gate / owner handoff |
| --- | --- | --- | --- |
| C-12 | **Partial**: fluid layout and bounded reflow evidence; no CSS `clamp()` adoption or documented benefit assessment found. Absence of `clamp()` alone is not a defect. | AuthShell uses percentage-bounded token gutters, `inline-size: 100%`, rem maximum width, wrapping and document scrolling. AppPageHeader wraps breadcrumbs/actions with rem flex bases. Dialog uses `min(100%, …rem)`, wrapping header and outer overflow. Typography tokens use rem sizes and numeric line heights. Retained dialog/instructor Chromium artifacts below establish representative narrow/enlarged-text behavior on their historical heads. | Coordinator should assess where fluid sizing actually benefits layout; preserve rem-based text enlargement rather than adding viewport-only typography to satisfy a syntax search. Existing modal/header/auth/card specs can cover a fresh reviewed candidate. Full supported-engine, actual browser zoom, physical mobile and broader host/catalog reflow remain open. No demonstrated production defect warrants a new source reservation here. |
| C-13 | **Partial; evaluation evidence missing**. Explicit hex palette/state tokens and contrast assertions exist, but no color-mix/OKLCH tooling/derivation decision was found. | `tokens.json` has separate light/dark action/actionHover/focus/surface values; generated `tokens.css` supplies explicit values. `scripts/tokens.test.mjs` checks nine declared foreground/background combinations per theme at 4.5:1 text and 3:1 focus/border thresholds. This is an inspected assertion, **not an executed pass**. CSS search found no runtime `color-mix()`/`oklch()` dependencies needing a fallback. | Minimal follow-up edit allowlist: `docs/developer/react-aria-architecture.md` for a reviewed adoption/deferral rationale. `src/foundation/tokens.json`, `scripts/tokens.mjs`, `scripts/tokens.test.mjs`, `src/foundation/tokens.css`, `src/foundation/tokens.generated.ts` would need separately granted ownership only if palette tooling changes are justified. Coordinator-run token checks and fresh representative browser contrast/state checks are required for any actual palette change. Existing explicit colors do not establish evaluated perceptual derivation or the whole contrast matrix. |
| C-14 | **Partial**: a concrete `@supports` fallback exists and the inspected CSS has no anchor-positioning, style-query or special-transition dependency. Full fallback behavior is untested here. | Dialog line 20 uses `@supports not (height: 100dvh)` to replace modal maximum height with `calc(100vh - 2rem)`. AuthShell puts `100vh` before `100dvh`. Popover/Menu use private React Aria placement rather than CSS anchors. DateRangeSelector's size container query only enhances a base wrapping flex layout. | The Dialog fallback replaces only `max-block-size`; xl/full `block-size` still uses dvh. This is an exact source limitation, not a reproduced failure in a supported engine. If coordinator establishes an unsupported-dvh target, reserve only `src/experimental/Dialog/Dialog.module.css` and `tests/browser/acceptance-pack-104.spec.ts` for an existing-story fallback regression, with `src/experimental/Dialog/Dialog.test.tsx` only if behavior changes. Verify md/xl/full sizing, focus containment and dismissal under that target before deciding a fix. No new story/config/polyfill is authorized by this report. |
| C-15 | **Partial**: owned visible-focus implementation and retained native Chromium slices; no whole-catalog focus acceptance. | Button uses `[data-focus-visible]` with focus width/color/offset tokens and forced-colors Highlight. Editor's `outline: none` is followed by `.viewport:focus-visible, .editable:focus-visible` token outlines. Menu suppresses base outlines but restores an inset token outline on React Aria `[data-focused]`, including forced colors. Retained instructor native Tab cases require `:focus-visible`, solid nonzero outline, whole-control bounds and center hit testing. | Fresh affected-engine checks should reuse existing deterministic display-preferences, editor/menu and instructor specs. Root must retain all keyboard states, nested/portaled controls, clipping, contrast, forced colors and enlarged-text coverage; physical high-contrast/zoom and spoken AT remain independent. AppDataGridShell's suppressed `.content` outline is on a `tabIndex=-1` focus entry, so suppression alone does not establish a broken interactive focus indicator. No demonstrated missing native regression justifies duplicating existing specs. |

## Exact source provenance

All paths below are relative to the repository root. Git blob IDs were read with
`git ls-tree HEAD` at the inspected baseline, not inferred from filenames or a
migration checkbox. Links are the source available in this report's checkout.

| Source | Git blob | Criterion |
| --- | --- | --- |
| [tokens.json](../../../src/foundation/tokens.json) | `64113cf0b2117e9bf1c2982bfe44c05a2ba59cee` | C-12/C-13/C-15 |
| [tokens.css](../../../src/foundation/tokens.css) | `b36050c8871253823b4a9deb8d146936a14222ec` | C-13 |
| [token assertions](../../../scripts/tokens.test.mjs) | `c06e8cbe72a0460ab9f54198bea95d3c74bf2b01` | C-13 |
| [AuthShell CSS](../../../src/components/AuthShell/AuthShell.module.css) | `0cd35a0e8b495c11ecc0cce717f0cad27abc3519` | C-12/C-14 |
| [page header CSS](../../../src/components/AppPageHeader/AppPageHeader.module.css) | `1fe3d6971a58e31e502509f8220bda3b1b55d664` | C-12 |
| [Dialog CSS](../../../src/experimental/Dialog/Dialog.module.css) | `2a303b80cad1fecea4558179fabe14e959f65bde` | C-12/C-14/C-15 |
| [calendar CSS](../../../src/experimental/DateRangeSelector/DateRangeSelector.module.css) | `b7052417e3fbdeef01f25540a3f1f11619404ca9` | C-14 |
| [Popover implementation](../../../src/experimental/Popover/Popover.tsx) | `a892ebeb2665f432c635619bc2be43ee5abcb174` | C-14 |
| [Button CSS](../../../src/experimental/Button/Button.module.css) | `cccf005e0bdee43ac22d8f8830523938ce5167f6` | C-15 |
| [Menu CSS](../../../src/experimental/Menu/Menu.module.css) | `2f5371f35a24b6d6104864d9385f2d94c927752a` | C-15 |
| [editor CSS](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css) | `eb123f89aeb360eb8394ab88be8d3b68774fe889` | C-15 |
| [shell focus entry](../../../src/components/AppDataGridShell/AppDataGridShell.tsx) | `32310c5053ef335e38709f1650a7909be214722f` | C-15 limitation |
| [display preferences spec](../../../tests/browser/display-preferences.spec.ts) | `cd5204cc7ab2f3deacc4da235198498138316dc7` | C-12/C-15 assertions; unrun here |

## Retained artifact inspection and limits

Read-only inspection on 2026-10-07 found both following historical artifact sets
still present. Root evidence, shard evidence and results JSON were parsed; their
browser logs exist. These are reused to assess the assigned C criteria, not to
repeat inventory M-row acceptance or create a current-head full-matrix claim.

Artifact base:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool`.

| Slice | Actual tested head and retained files under artifact base | Directly read result |
| --- | --- | --- |
| Dialog reflow, [report](../parallel-batch-50/dialog-header-reflow.md), report blob `44f297e634d974691b6c0afc443692943ddbb216` | Head `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`; `16f6feff-4479-4f37-8c96-451b694ba457/evidence.json`; same directory's `dialog-header-reflow/{evidence.json,results.json,browser.log}`. Source digest `b6047a36c2eb6749f427c775e1f0c716225a303dd276fd272da6608de5efcc56`; build digest `1afdb63861962fc7858ba9c42ec5a7e7e5dcc9b89d4f02fad7d6d9ddead899ca`. | Shard project Chromium, passed, 8 expected/0 skipped/0 unexpected/0 flaky; 9358.135ms. Root status **failed**. Only the green slice is attributable. |
| Instructor focus/reflow, [report](../parallel-batch-66/instructor-card-native-presentation.md), report blob `709d3335d287b6880e33d04058741d976938435d` | Head `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b`; `80b00fee-f55f-45e8-88dc-4666223d88cc/evidence.json`; same directory's `instructor-card-native-presentation/{evidence.json,results.json,browser.log}`. Source digest `43bd8083dad4209f05ab036ef66e5107eadee96747ee37fa2307da8fc2d934e3`; build digest `6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`. | Shard project Chromium, passed, 3 expected/0 skipped/0 unexpected/0 flaky; 4309.008ms. Root JSON status **failed** (report describes an unrelated incomplete pointer scope). This report preserves actual root status. |

Read `git show <tested-head>:<path>` and compared bytes to baseline `HEAD`:

- Dialog CSS is identical; SHA256 `b263eaaedd6437e45ed6db3430acb989d159750b98132ed32d9d6b31571f4c0b`.
- `tests/browser/batch50-dialog-header-reflow.spec.ts` is identical; blob
  `68254e4ed431ada0d4dcd9cdd190cbdf48854456`, SHA256
  `44ef0b0824c3b07a4d19637d4a5da66e0779aef5f1c07b626e86e61cb581eaed`.
- InstructorClassCard.tsx is identical; blob
  `83ec860b0c0ad65363441152b893b2889cf46bcc`, SHA256
  `f9b093771537cc25300fd72fc6644aa7d3a0decf9cac4800803c75486d7d9ea4`.
- `tests/browser/batch66-instructor-card-native-presentation.spec.ts` is identical;
  blob `0aad65e05d9865cba3667a2337ba3b58cce52bee`, SHA256
  `4c3dc0815e9fccb469d5de1d92f0304cc7d7fdcf09f495bc9a4e9ad62d6ecbe4`.

Those comparisons are bounded to four files; shared dependencies and complete
builds were not compared. They cannot transfer historical results to the current
head. Both retained shard reports record Node 24.19.0/Chromium; instructor also
records pnpm 10.29.3/Playwright 1.63.0. Results config lists all three projects,
but shard selection and results establish **Chromium only**.

The checked-in [browser acceptance record](../react-aria-browser-acceptance.md)
(blob `41db9ad1186ddccbb84fabcd2a23237e05300c56`) describes historical 54/54 local
Chromium/WebKit display checks and earlier three-engine CI at
`83b8dae2148002e79d2df331fd105c274f97ca96`. This worker found
`/tmp/sgui-display-complete-browser-results.json`, its `.log`, and
`/tmp/sgui-ci-83b8dae2-artifacts` **absent**. Wave23/wave30 `/tmp` attribution JSONs
are also absent. Checked-in descriptions remain provenance; missing files cannot
be re-inspected or treated as current retained execution. No remote CI lookup,
download, artifact-expiration assertion or new execution occurred.

## Checks performed and next window

Read README, migration, component/target architecture, development validation,
assigned master criteria, current CSS/implementations/token assertions/browser
assertions and bounded reports. Used `rg` source/doc searches, `git ls-tree`,
`git show`, file existence checks, JSON parsing and four byte/SHA256 comparisons.
The CSS-only query for `clamp(`, `color-mix(`, `oklch(`, `@supports`, `anchor-name`,
`position-anchor`, `anchor(`, style container queries, `view-transition`,
`interpolate-size` and `transition-behavior` returned only Dialog's `@supports`.
The ordinary date size query was inspected separately. The TypeScript grid
helper named `clamp` is numeric column processing, not CSS fluid typography.

No install, unit test, typecheck, build, pack, browser, performance, CI or lease
command was run. No optional spec was added: current native assertions already
cover the identified representative slices, while color evaluation and unsupported
dvh behavior need a concrete owner decision/target rather than fabricated tests.
Documentation whitespace/link/path verification is the only local validation.
Coordinator may request a serialized fresh validation window using the existing
specs on a frozen candidate. All C-12–C-15 remain partial; device/manual/AT,
supported-engine and host composition limits survive this report.
