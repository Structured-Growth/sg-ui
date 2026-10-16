# Parallel 11 — compiled CSS and stylesheet acceptance

Date: 2026-10-16. Assigned leaves: A-C-01, A-C-02, A-C-05, A-C-06, A-C-07, A-C-18.

**Outcome: five complete, one partial (A-C-07), none blocked.** These are reconciliation recommendations for the coordinator; no shared checklist or ledger was changed. The full original requirements at `react-aria-hardening-tasks.md:199–216` and corresponding C leaves in `react-aria-scope-ledger.md:180–197` were compared, rather than inheriting historical checked status.

## Head, inputs and evidence reuse

- Local `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, existing modified checkout. HEAD identifies the base, not a committed representation of current source.
- `inspection.json` captures the timestamp and exact SHA-256 values. All **103** inspected CSS/build/guard/guidance inputs match FA-02 `inputHashes` or FA-01 `sourceHashes`; all **86** inspected emitted CSS/class-map assets match FA-01 `builtHashes` (one stylesheet and 85 class maps). There are zero differences in these scopes. This is a scoped comparison, not a new full inventory or a universal unchanged-input assertion.
- FA-04 `fa04-library.txt` records the fresh successful build. `fa04-package.txt` records successful entry imports, consumer types and actual packed output equality. FA-04 records all 1,778 output files equal to FA-01. This report independently compared only the 86 CSS-related outputs it needs.
- `fa04-original-check.txt:16–55` contains the **32 passing foundation tests**, including four CSS pipeline regressions, the class naming test and ten component-CSS guard tests. That command later failed calendar unit cases; do not describe the entire command as green. FA-04 preserves and reconciles those unrelated failures separately. `fa02-foundations.txt` and the first stage of FA-04 show the source/token/layer guard passing.
- The retained test/build evidence used Node 24. The new read-only inventory script ran with local Node **26.5.0**; this is not a fresh Node 24 test result or an expanded runtime support promise.

New check: `node docs/developer/final-acceptance/parallel-11/inspect.mjs` from repository root, exit 0. It reads source and built CSS with PostCSS, compares saved hashes, checks registration coverage and inventories layers/selectors/important declarations. It writes only `inspection.json` beside itself. The initial script invocation had a bracket syntax error, corrected before the successful run; it did not execute the inventory. No completed test, build, package, native, browser or consumer suite was rerun. No dependencies installed; no shared output, source, server, release or Git state changed.

## A-C-01 — complete

Original obligation: compile colocated CSS Modules into browser-ready CSS, with source maps where appropriate.

Source: `packages/ui/scripts/build.mjs:1–29`, `scripts/css-modules.mjs:1–33`, `tsconfig.build.json:5–6` (all script paths in this report are relative to `packages/ui` unless otherwise stated). Build validates generated tokens, emits TypeScript, rewrites `.module.css` references to generated ESM class-map modules, and compiles collected CSS with PostCSS Modules. Class names use component-relative path hashes; traversal is sorted; tokens precede the module chunks in `dist/styles.css`.

Evidence: retained FA-04 fresh build and package pass; retained `scripts/css-modules.test.mjs` test and four `scripts/CSSPipeline.next100-regression.test.mjs` cases prove stable distinct classes, ordered real emission, public stylesheet resolution/side effects, deterministic independent-root compilation, replacement, syntax-error rejection and recovery. Current emitted CSS has no uncompiled `:global(...)`/`:local(...)` syntax; all 86 relevant artifacts still match the snapshot.

Map limit: CSS intentionally uses `map: false`; `docs/developer/react-aria-architecture.md:112–119` explicitly documents this initial choice and adds maps when consumer debugging warrants them. JS/declaration maps remain enabled. The leaf says “where appropriate,” so an explicit bounded decision is sufficient; this report does not claim CSS source maps exist. Browser engine compatibility and packed bundler execution remain separate acceptance leaves.

Successor: none required for this leaf. Add CSS maps only if a concrete debugging requirement makes them appropriate.

## A-C-02 — complete

Original obligation: document stylesheet entry points/import order and a basic installation requiring no consumer Tailwind/PostCSS setup.

Source: `packages/ui/package.json` exports `./styles.css` as `./dist/styles.css` and marks `./dist/**/*.css` side-effectful. `README.md:42–72` supplies root and granular examples importing this stylesheet once before rendering Provider/Button, with host reset/font ownership and no Tailwind requirement. `docs/developer/react-aria-architecture.md:112–124` explains compilation ownership, token-before-component layers and no consumer PostCSS compilation. `apps/docs/app/installation/page.tsx` supplies the same public CSS import and scope.

Evidence: retained FA-04 package pass verifies CSS export, compilation and side effects in actual packed-file equality. The retained CSS pipeline public-export test resolves the stylesheet and imports its generated class assets. Inspection confirms output starts with the named token-layer ordering and matches saved output.

Limits: these are basic source/install and package-output proofs; no new clean consumer/browser execution occurred. Importing a single precomposed entry means consumers do not order separate library component/theme files. More detailed host utility-layer composition is the A-C-07 gap below.

Successor: none required for this leaf.

## A-C-05 — complete

Original obligation: define a named namespaced layer and low-specificity selectors; explain unlayered overrides and important caveats.

Source: `src/foundation/tokens.css:2–4` declares `@layer sgui.tokens, sgui.components` and zero-specificity `:where([data-sgui-scope])` token roots. Components use local module classes with state attributes/pseudos, for example `src/components/Button/Button.module.css:2–28`; there is no ID-based escalation in inspected emitted selectors. `docs/developer/component-architecture.md:43–48` and `docs/developer/react-aria-architecture.md:121–124` explain normal unlayered host precedence and reversed important layer priority. `react-aria-adoption-checklist.md:135–140` directs consumers to public parts instead of generated class names.

Evidence: retained class-name/layer tests and source guard pass; the current PostCSS inventory finds all **930 emitted rules** inside named layers, no ID-selector candidates and only the declared tokens/components layers. This includes keyframe rules; it is not a count of independent visual selectors. Token scopes use `:where`; component state selectors have ordinary class/attribute specificity, not uniformly zero specificity.

Limits: the inventory is not a formal specificity calculator or computed-style browser assertion. This closure concerns the shipped named-layer/selector design and documented cascade caveats. The concrete undocumented Popover important exception affects A-C-07's stronger routine-important/composition requirement, not the existence of the caveat documentation here.

Successor: none required for this leaf; coordinate A-C-07 documentation below.

## A-C-06 — complete

Original obligation: make global reset optional, scope required normalization and avoid import-only host body/link/button/typography changes.

Source: `src/components/Button/Button.module.css:2–21` scopes box sizing, border, font and spacing to the control class. `src/foundation/ThemeScope.module.css` scopes text color/scrollbars to the owned root. `src/foundation/tokens.css` applies token definitions under `[data-sgui-scope]`, not a document reset. `README.md:67–72`, `component-architecture.md:35–41` and architecture styling guidance explicitly assign global reset, fonts and body backgrounds to the host. No library reset export is required: the host chooses whether to load its own reset.

Evidence: all 85 current CSS Modules are covered by the registered CSS guard; only generated token CSS is non-module source CSS. Retained CSS pipeline tests reject global host selectors in their emitted sample, and retained CSS lint fixtures reject bare/global-only selectors. Current emitted inventory has zero unlayered rules and zero html/body/:root selector candidates. Public stylesheet output is unchanged from accepted builds.

Limits: owned scopes intentionally affect their descendants, including document content, and Provider/overlays can perform runtime behavior. This leaf concerns stylesheet-import side effects; it does not waive overlay scroll locking or certify browser computed styles. Regex host-selector inventory is supporting evidence alongside the existing scoped source guard, not a general CSS proof.

Successor: none required for this leaf.

## A-C-07 — partial

Original obligation: document stylesheet composition across themes, components, utilities and consumer overrides; avoid escalating specificity or routine `!important`.

Satisfied: one stylesheet emits token/theme definitions before module components; README/architecture/adoption guidance explain public CSS import, scopes, token overrides, public parts and normal unlayered host overrides. The emitted artifact has no ID-selector escalation. Source/test references and retained evidence are the same unchanged pipeline/layer sources used for A-C-01/02/05.

Finding: `src/experimental/Popover/Popover.module.css:6–8` contains **13 important declarations**, the only ones among the 86 source CSS files: dialog has position/inset/max-block-size (3), drawer has position/inset/inline-size/max-inline-size/max-block-size (5), and narrow auto has the same five (5). `Popover.tsx:51` always obtains positioning from `useOverlayPosition` and `:141–143` merges its inline style into the root even for alternate presentations. Source supports a plausible need to override anchored geometry; it does not by itself establish that every important property is necessary. Existing styling guidance documents important reversal generally but does not identify this exception or its host override impact. No explicit guidance composes a host utility layer with library layers. Do not close the complete leaf on general override prose alone.

Reproduction: run the owned inventory and inspect `css.important`; read Popover CSS lines 6–8 and the root style merge at lines 141–143. This is a static finding, not a claim that dialog/drawer behavior is broken.

Required successors:

1. **C07-doc-composition:** update architecture/adoption guidance with the complete supported ordering for host reset (optional), SGUI token/theme scope, SGUI component rules, host utilities and host overrides. Explain that normal unlayered utilities win, while layered utilities need an explicitly chosen host order; do not invent an existing SGUI utilities stylesheet. Keep scope/token override guidance and the important-order caveat consistent.
2. **C07-popover-important:** decide whether alternate presentations should omit/replace anchored inline geometry or retain a narrowly justified important exception. Document every retained property and consumer impact. If implementation changes, run the affected Popover unit tests and a bounded native scenario covering anchored mode, dialog, drawer, narrow auto, reopen and resize. If documentation alone explains a reviewed necessary exception, avoid rerunning unaffected completed suites. No native evidence is added here.

## A-C-18 — complete (bounded lint contract independently reconciled)

Original obligation: add CSS/token lint rules catching retired selectors, accidental global rules, ad hoc typography and unsupported tokens.

Source: `scripts/check-component-css.mjs:1–126` returns source-located PostCSS diagnostics. It catches retired MUI/Emotion selectors and class prefixes, bare/global-only/host selectors, noncomponent layers, unknown `--sgui-*` references, direct semantic color bypass, literal component colors, and non-owned typography values. Local descendants, keyframes, inherited typography and forced-color system colors retain intentional support. `scripts/check-foundations.mjs:78–89,115–123` invokes it through the audited directories; `package.json` includes the ten `check-component-css.test.mjs` fixtures in `test:foundations`, and `check` invokes that command plus source/token guards.

Evidence: the retained FA-04 transcript explicitly executes and passes all ten fixtures, including positive and negative selector branches, token/layer failures, literal/shorthand/fallback typography, comments and locations, dimension/percentage arithmetic, quoted data and exact semantic exceptions. Current registered directories cover **all 85 existing CSS Modules**; no present module falls outside them. The guard, fixture, registration and stylesheet hashes match saved evidence, so no rerun is justified.

Independent exception review: the exact PageRichTextEditorSection entries preserve saved document semantics: bold `700`, subscript/superscript `0.75em`, under the exact file + entire selector + property + value contract. This conforms to AGENTS' allowance for shared component styles; it is not a whole-file typography exclusion. Negative fixtures reject altered scopes/values/files/extra selectors, and layer/token/ownership checks still run. There is no evidence requiring removal of these intentional semantic styles to satisfy this lint leaf.

Actual documentation drift: `docs/developer/react-aria-css-lint.md:43–44,93–94` still says registration and independent review are pending. Registration is already present and executed in FA-04, and this report supplies the bounded independent review. This is no longer an implementation/test-registration blocker for the original leaf.

Limits: conservative selector scanner, not complete CSS grammar; sibling relationships, unusual escapes, custom-property indirection and typography-role suitability still need review. Inline React styles, docs-owned CSS and emitted specificity are not validated by this helper. New library directories need registration; the coverage comparison is dated evidence, not an automatic future all-repository guarantee. These limits do not turn the requested existence of lint rules into native/browser/device/AT conformance.

Successor (nonblocking documentation correction): update `react-aria-css-lint.md` to remove the stale package-registration claim and link the actual FA-04 fixture execution plus this review. Preserve the scanner limitations and narrow semantic contract. Coordinator alone should reconcile the shared acceptance checkbox.

## Scope preserved

Only `docs/developer/final-acceptance/parallel-11/` was written. This report, `results.json`, the reproducible read-only `inspect.mjs` and its `inspection.json` receipt are the deliverables. No release, production promotion, editor V waiver, browser/device/AT certification or shared-count update is implied.
