# Wave 03-09 — zoom, reflow and containment

Four assigned leaves remain **partial**. This batch delivers a five-file implementation/documentation/test patch and new bounded Chromium evidence; it does not change shared acceptance counts or close runtime acceptance from an unapplied patch.

Only this evidence directory was written. No source patch applied, shared install/build/catalog command, server startup, branch/index/commit/release action or cross-chat message occurred. Existing user3000 was reused in separate disposable browser contexts and left running. Both browser commands acquired/released the existing validation leases through the inspected `/tmp/sgui-calendar-validate.mjs`; no competing lease was bypassed or reclaimed.

## Concrete deliverables

`card-containment.patch` adds `sgui-class-card / inline-size` containment to ClassCardFrame. Below 20rem of allocated card content width, owned header/body padding changes from space4 to space3. It preserves footer padding, host slot layouts, public props and the collection's fluid grid. Developer and component guidance explain the allocation/intrinsic-size contract, generic Card exclusion, rem threshold and useful fluid-sizing choices. A state-owning two-card fixture and one native spec cover independent allocations, host resize, sibling isolation, native focus and 200% root text/spacing. All five files are mirrored in `proposed-files`. `git apply --check` passes; coordinator integration is still required.

The isolated static CSS prototype uses production-rendered card markup and current `packages/ui/dist/styles.css`, whose hash equals the coordinator integration receipt. Its injected public-part CSS is equivalent to the proposed behavior, but is **not** compiled/integrated CSS Modules acceptance. At 280/420px host allocations the measured inner widths were 278/418px, with header padding 12/16px; resizing only the first host yielded 16/16px without losing native link focus; 200% root text plus spacing/monospace yielded 24/24px with no card inline overflow. Both complete English/Arabic prototype screenshots were reviewed.

## New executed evidence

Runtime: bundled Node **24.19.0**, Playwright Chromium **153.0.8010.12**, Darwin **27.0.0**. New browser checks use the existing mutable development host, not an immutable production candidate. Served JS/CSS response hashes are in `reflow-results.json`; selected source/built hashes and comparison results are in `input-evidence.json`.

| Corrected configuration | Card / tabbed-modal focus result |
| --- | --- |
| English, compact, monospace, 320×640 CSS viewport | pass |
| Arabic card title / RTL overlay, comfortable, serif, 320×640 | pass |
| English, comfortable, serif, 640×640 with 200% root text | pass |
| Arabic card title / RTL overlay, compact, monospace, 640×640 with 200% root text | pass |

Every configuration applies line-height 1.5, letter-spacing .12em, word-spacing .16em and paragraph margin 2em. Real playground state supplies long card titles. Density/direction and font/spacing are explicit disposable DOM/CSS stress inputs; modal labels remain English under RTL. Native Tab/Shift+Tab and Escape exercise the live React dialog. Per-stop rectangles fit the viewport and clipping ancestors, three native hit-test points remain unobscured, and focus returns to the opener. At enlarged root text the dialog has genuine scroll overflow (782/746px content in 435px client height), revealing each tested control as focus moves. No focused-control obstruction defect was reproduced in this bounded run, so no speculative focus repair was proposed.

These are **root-text enlargement and CSS-viewport reflow, not browser zoom**. No CSS zoom, transform, CDP page/pinch scaling or deviceScaleFactor is claimed as browser-controls zoom. This is four corrected configurations, not seven distinct passes: initial logs/results are retained separately. The first driver edited overview DOM that React refreshed for English and checked dismissal focus before asynchronous restoration settled in one case. The corrected driver changes real playground title state and waits for restored focus; all affected configurations were rerun.

Ten final captures received direct visual review (`screenshot-review.json`). Whole-card captures in the live docs host include sticky website chrome over nonfocused upper card content; they are not full-content visibility evidence. Clean isolated prototype captures show entire card content. Modal captures show the initial Close stop; enlarged body/footer content is deliberately scrollable, with per-stop executable evidence rather than an assertion that all chrome/content is simultaneously visible.

## Original leaves and residual work

- **A-D-09:** “Use rem-based text sizing and layouts that tolerate zoom, text spacing changes, long labels, and font substitution.” New long-title/font/spacing/native-focus checks pass within the table's limits. Actual browser-controls 200%/400% zoom, remaining missing-font/system-sans and wider component coverage remain open. HB-16 manifest is still absent locally; retain its historical completed narrative without fabricating raw-artifact verification.
- **A-C-08:** “Use container size queries for reusable card, toolbar, navigation, and modal compositions; choose/document containment boundaries so consumers know what supplies the container.” The missing card boundary now has a concrete tested CSS prototype and ready-to-apply implementation/test/documentation patch. Integrate/build/run the new spec and the existing previously prepared toolbar/navigation/modal boundary specs against a coordinated candidate. Prototype geometry does not close integrated runtime acceptance.
- **A-C-12:** “Use fluid sizing such as clamp where beneficial without preventing text zoom; establish mobile/reflow fallbacks.” The patch includes a concrete benefit assessment: retain rem text, fluid min/max/grid allocation and short-dialog scrolling; avoid an unjustified viewport-only font clamp. New focused reflow/scroll evidence passes, but documentation integration and actual zoom/candidate fallback validation remain open.
- **A-X-05:** “Ensure sticky headers/footers do not obscure focused controls; verify zoom/reflow/text-spacing behavior and scroll padding where needed.” The tested tabbed-modal focus stops and dismissal pass. Actual zoom, viewport resize while overlays are open, independent shell panes and wider sticky-state/focus-ring coverage remain open. No broad shell/calendar/all-catalog or spoken-AT result follows.

## Reuse, commands and handoff

All eight assignment report/results hash comparisons match. Selected source inputs match the scoped prior receipts except the changed central final-acceptance document and component-architecture guidance; neither is used to transfer old runtime acceptance. Current catalog and dist stylesheet equal coordinator integration hashes. Full details, exact original checklist statements, commands, runtime/host limits and successors are in `results.json`; `artifact-hashes.json` binds local deliverables.

From repository root, the exact browser command form used was:

```sh
/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node docs/developer/final-acceptance/wave-03-09/reflow-check.cjs
```

The second command substitutes `card-prototype.cjs`. `validate-artifacts.cjs` runs directly with that Node executable and passed Node syntax, TypeScript syntax-only transpilation, PostCSS parsing and patch applicability. No import/type/build result is inferred from syntax checks. Exact coordinator build, fixture/type/catalog/native commands and actual-zoom operator record requirements are in `validation-plan.json`. Current evidence is sufficient for review and targeted integration, not production acceptance.
