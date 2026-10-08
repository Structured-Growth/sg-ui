# Batch 158: D-20 focused catalogue browser suite preparation

Prepared October 7, 2026 from exact reviewed batch153 head
`55f6905603bb518a1013cb5160e805bb29a685c6` in isolated managed worktree
`/Users/thomashall/.codex/worktrees/d20-foundation-catalogue-4857/sg-ui`.
The coordinator authorized `codex/batch158-foundation-catalogue` because
`codex/d20-foundation-catalogue` belongs to batch153. That branch and worktree
were preserved. Ownership is limited to this record and
[foundation-catalogue.spec.ts](../../../tests/browser/foundation-catalogue.spec.ts).
Coordinator owns candidate composition, execution, integration and acceptance.

## Inputs and exact scope

Read the actual [catalogue stories](../../../src/foundation/FoundationCatalogue.stories.tsx),
[batch153 evidence](../parallel-batch-153/acceptance-evidence.md), production token
JSON/generated references, ThemeScope/Provider and shared preview, owned
Button/Progress/Box/Stack/Surface implementation and CSS, browser configuration,
browser TypeScript configuration, and existing browser preference/focus cases.
Followed repository AGENTS.md, [owned architecture](../react-aria-architecture.md),
[browser contracts](../react-aria-browser-acceptance.md) and
[targeted validation policy](../react-aria-development-validation.md).
This changes no architecture or production implementation.

Read coordinator's durable `batch153-independent-review.json` at
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/`.
Verdict: `ADMIT_FOR_TARGETED_VALIDATION`; actual published artifact and rendered
preference validation remain unverified. Source SHA-256:
`f24e5dc750b5b5d8f641671bee4df2aa5748cb4954d5493312b90292119ce94a`.
Source Git blob: `885617888749dcf6561117c6c02de690ad4ca1c5`.

## Prepared cases, all UNRUN

Eleven cases per selected engine, bounded to the six authored stories and four
authored plays:

| Cases | Intended observable proof |
| --- | --- |
| One built-index/palette case | Fresh index includes all six source IDs and linked Typefaces Defaults ID; explicit light/dark scopes resolve representative surface/action/border/focus swatches and actual text/button foreground/background pairs from production JSON. |
| One spacing case | All four rem steps resolve to rendered bar widths and matching owned Surface padding at default and doubled host root text size. Root text scaling is explicitly not browser-chrome zoom. |
| One density case | Actual primary button min-height, bounding height and inline padding match production compact/comfortable values in both themes; disabled buttons remain disabled. |
| One surface case | Representative default/outlined and subtle/raised treatments in both themes have expected production colors, visible headings, radius, divider or shadow. This is not a full surface visual matrix. |
| Two native keyboard cases | Light and dark fresh-document Tab entry exposes the production ring; Enter and Space increment the real activation count exactly once, disabled action is skipped, Shift+Tab returns focus, and focused action is in the viewport with an unobscured center. |
| One browser-emulated reduced-motion case | Verify actual media-query state before and after Playwright preference emulation; production button transition and spinner/linear/circular animations change from active to stopped, linear fill becomes static full-width, and pending/disabled/progress value semantics remain available. |
| Four authored composed-play cases | Normal Storybook autoplay runs Spacing, Density, KeyboardFocus and MotionAndPreferences. Read Storybook completion status/reporters, verify autoplay and real play-function presence, fail on play exception, and attach receipts; keyboard play also leaves its expected activation result. |

Expected colors/dimensions come from the existing production JSON, independently
of computed CSS. No replacement token stylesheet, component style override,
fake focus state, injected input event, selection or scroll repair is used.
Host root text scaling is confined to the spacing case. Native input uses
Playwright keyboard actions and the existing macOS WebKit Alt+Tab convention.

## Distinct composed and native evidence

The existing browser suite has local iframe/manual-a11y and diagnostic helpers,
with no shared exported helper at this source head. Reuse those contracts in this
file: built static loopback iframe, `a11y.manual:!true`, zero browser page errors
or console warnings/errors, existing one-worker/no-retry configuration and native
hit-test observations. No configuration/helper source is modified.

Read the installed Storybook **10.6.1** implementation, matching the lockfile:
`shouldAutoplay` disables autoplay for `embed=true`; the preview publishes
`storyFinished` with status/reporters through the addon channel, which retains
the latest event arguments through `last()`. The suite reads those receipts
without rewriting Storybook state or invoking play functions manually. This is
a version-specific harness dependency that coordinator execution must confirm.

Rendered/native cases use `embed=true` and assert autoplay is false. In particular,
the fresh keyboard document must show `Activations: 0` before native Tab; its
authored play's initial `primary.focus()` cannot seed native evidence. Four
separate composed cases enable autoplay and assert success. Those `userEvent`
plays, including their explicit starting focus, remain composed evidence even
when executed inside a browser.

Preference cases use `page.emulateMedia({ reducedMotion: ... })` and require the
corresponding `matchMedia` result. Attached motion receipts label
`physicalDeviceProof: false`. Browser preference emulation exercises production
media rules; it does not prove physical OS/device settings or assistive technology.

## Static verification and execution handoff

Performed only source/API/CSS and Storybook harness implementation inspection,
exact-head/source hash checks, two-path ownership review, local document-link
existence review and `git diff --check`. These are preparation checks.

**UNRUN:** dependency installation, TypeScript, foundation/token guards, unit/play
execution, Storybook build, browser/native/rendered assertions, packed consumers,
remote CI and publication. No browser or heavy-validation lease was acquired.
No main/dev integration, push, master acceptance/state, workflow, permissions,
secrets, token/source/story/configuration or other-worker edits were made.

Coordinator should compose batch153 and this suite into one exact candidate,
typecheck source and browser tests and run relevant foundation/token guards under
supported Node 24, then build one fresh immutable Storybook. The focused command
using the existing harness is:

```sh
pnpm test:browser tests/browser/foundation-catalogue.spec.ts --project=chromium
```

Run only after the fresh build under coordinator-owned validation scheduling;
never rebuild during the suite. Preserve tested head, fresh artifact identity,
full results, all failure details and attached rendered/play/preference receipts.
The full engine checkpoint remains separate; Chromium-only proof cannot close
cross-browser acceptance. RTL, forced colors, full visual/contrast/typography
review, real-device/OS preferences, AT and actual published catalogue artifact/URL
remain separate pending evidence. D-20 stays open.

The completion report records final commit, changed-file SHA-256/Git blobs and
clean status; this record cannot embed its own final identity without changing it.
