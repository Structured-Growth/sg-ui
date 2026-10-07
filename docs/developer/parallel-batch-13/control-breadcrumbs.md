# Batch 13: Breadcrumbs inspection (U-10/X-03)

## Result

Evidence-only disposition: no demonstrated in-scope defect was identified at the
specified baseline. No product, test, story, API or style changes were made. No
broad acceptance ID is closed. This report distinguishes existing assertions and
source evidence from combinations that have not been exercised natively.

## Isolation and ownership

- Exact baseline verified before edits: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Attached managed worktree: `/Users/thomashall/.codex/worktrees/batch13-control-breadcrumbs/sg-ui`.
- Branch: `codex/batch13-control-breadcrumbs`; draft PR base: `codex/dev`.
- Exclusive allowlist: `src/experimental/Breadcrumbs/`,
  `tests/browser/batch13-control-breadcrumbs.spec.ts`, and this report.
- Only this report changed. Primary and other worktrees were preserved.
- Reviewed product head is the exact baseline above. Final report commit/head and
  draft PR URL are supplied in the coordinator handoff and PR metadata; the report
  does not attempt to embed its own commit hash.

## Existing evidence

| Concern | Evidence at reviewed baseline | Limits |
| --- | --- | --- |
| Current page | [Breadcrumbs implementation](../../../src/experimental/Breadcrumbs/Breadcrumbs.tsx) renders the last item as text with `aria-current="page"`, even with an href. [Two colocated tests](../../../src/experimental/Breadcrumbs/Breadcrumbs.test.tsx) assert named navigation, list items, exactly two ancestor links, current-page marking, route activation, separate names and single/empty collections. | Existing assertions inspected; not rerun in this documentation-only task. |
| Long labels | [Breadcrumb CSS](../../../src/experimental/Breadcrumbs/Breadcrumbs.module.css) wraps the flex list and allows root/items to shrink. [Typography CSS](../../../src/experimental/Typography/Typography.module.css) supplies inherited `overflow-wrap: anywhere`; [Link CSS](../../../src/experimental/Link/Link.module.css) also applies it. Complete labels remain DOM text. | Source evidence only; standalone Breadcrumbs narrow-container, enlarged-text and RTL geometry not established. The initial suspected missing current-label wrap rule was ruled out by shared Typography. |
| Native anchors / host authority | Ancestors compose [owned Link](../../../src/experimental/Link/Link.tsx) and [SGLink](../../../src/adapters/Link.tsx). [Link tests](../../../src/experimental/Link/Link.test.tsx) assert route options, native ref, modifier/cancellation, external rel and custom router behavior. [Navigation tests](../../../src/adapters/navigation.test.tsx) assert native fallback and external bypass. | A host custom Link owns equivalent anchor behavior. Breadcrumb items do not declare per-item anchor refs or target/download props; no new API was inferred. |
| Adapter ref forwarding | Navigation tests assert that a forwarded custom router ref resolves to the native anchor, alongside routing attributes. [Batch 01 browser spec](../../../tests/browser/batch01-adapters.spec.ts) focuses a custom router anchor and activates it with Enter. [Previous completion record](../parallel-batch-01/adapters.md) records four local Chromium/WebKit cases passing, plus a Firefox launch failure. | Historical evidence, not a fresh pass at this baseline or a composed Breadcrumbs ref test. Breadcrumbs' own ref targets the native nav. |
| Dynamic items | `items.map` runs directly on every render, keyed by host item ID. Link/text selection and current-page marking use the current array length and index; there is no copied item state or memoized collection. Adapter context is read by the composed Link. | Inspection supports live updates; no existing standalone item append/reorder/ancestor-to-current regression was found. Native focus during removal/replacement remains unverified. |

Read AGENTS.md, the [development validation policy](../react-aria-development-validation.md),
[layout/action contracts](../react-aria-layout-actions.md),
[proof control contracts](../react-aria-proof-controls.md), relevant implementations,
tests and prior adapter evidence before choosing this disposition. Existing
[default story](../../../src/experimental/Breadcrumbs/Breadcrumbs.stories.tsx) remains
accurate because no behavior changed.

## Validation and resource accounting

Runtime used for inspection: macOS arm64, shell zsh, Node `v26.5.0`;
`pnpm` resolves to `/opt/homebrew/bin/pnpm` but was not invoked. This runtime is
not a Node 22/24 consumer acceptance claim.

Commands: `git rev-parse HEAD`, `git switch -c codex/batch13-control-breadcrumbs`,
`git status --short`, `rg --files`, scoped `rg -n`, `cat`, `nl -ba`,
`node --version`, `command -v node`, `command -v pnpm`, and `git diff --check`.
Report links were checked against local file existence. Initial read-only probes
found no local node_modules and no node@24 Homebrew path; neither was required.

Counts: one documentation file changed; zero new tests; zero test/build/install
runs; zero browser launches. No full-suite or fresh native pass is claimed.
No install/light-validation slot or heavy-validation lock was acquired.
The existing lock/priority files were read only; no other worker was interrupted.
The browser pool under review was not bypassed. GitHub CI/title checks remain
paused for dev; no workflow dispatch, retries, merges, publication, secret or
permission changes occurred.

## Reserved follow-up

If fresh composed evidence is requested, reserve exactly
`src/experimental/Breadcrumbs/Breadcrumbs.stories.tsx`,
`src/experimental/Breadcrumbs/Breadcrumbs.test.tsx`,
`tests/browser/batch13-control-breadcrumbs.spec.ts` (or a newly assigned unique
browser path) and a unique follow-up report. Exercise stable-ID item append,
reorder, href/label replacement and ancestor/current transitions with a host
forwardRef anchor; inspect complete long text and native keyboard activation in
narrow/enlarged-text light/dark RTL/LTR scopes. First reproduce a concrete defect
before changing implementation/CSS. Run focused browser evidence only through the
approved pool and existing lock/priority protocol. No shared adapter/source/barrel
change is justified by this inspection. Physical-device and assistive-technology
acceptance, and broad U/X/R/Z gates, remain open.
