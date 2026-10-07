# Batch 100: D-10–D-13 acceptance evidence

Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`
baseline), inspected on 2026-10-07. This report assesses the four unchecked
parent criteria directly; it does not repeat migration inventory or close any
master checkbox. Only the coordinator accepts/integrates evidence.

Exclusive edit: this file. No production, shared configuration, master acceptance,
ledger, generator or other report changes. No new browser spec: the remaining
touch gate needs a defined target policy and device evidence, not another desktop
proof of the existing density token. No installs, tests, builds, packing, browser,
performance, CI or global validation leases were run/acquired.

## Isolation

The desktop `create_worktree` service returned `Not a git repository` despite
the active checkout being a Git worktree. Created an isolated Git worktree at
`/Users/thomashall/.codex/worktrees/batch100-acceptance-evidence/sg-ui`, branch
`codex/batch100-acceptance-evidence`, from the exact baseline before edits.
`attach_worktree` then returned `The checkout exists but is not a managed worktree`.
Thus isolation is verified, but app-managed registration is **not** established;
do not describe this as a successfully attached managed worktree. Primary and all
other worktrees, including image-upload work, remain untouched.

## Per-ID matrix

“Supported” below means the exact definition/source-policy criterion is supported
at the reviewed head. It does not mean current runtime, whole-parent, full-engine,
manual, device or assistive-technology acceptance.

| ID | Assessment | Current-head evidence | Remaining gate / owner |
| --- | --- | --- | --- |
| D-10 | Supported by source and documented host contract | [README](../../../README.md) assigns optional Geist loading to hosts and system fallback to SGUI. [Architecture](../react-aria-architecture.md) states host-supplied Geist. `tokens.json` and generated `tokens.css` retain `"Geist", "Geist Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. No font binaries are tracked and inspected runtime/story source contains no font-face, Google font URLs or woff/ttf references. | Host owns any optional font asset/loading/license choice. No SGUI licensed font asset requirement found. No current browser-network capture or packed-output audit was run; this is the repository font strategy, not certification of host network behavior. |
| D-11 | Supported by source and explicit compatibility contract | `ThemeScope` defines independent `ColorTheme` and `Density`, defaulting to light/comfortable and inheriting each setting separately. Density selectors independently define compact `2rem`/`0.75rem` versus comfortable `2.75rem`/`1rem` height/padding. [Architecture](../react-aria-architecture.md) explicitly documents generic Menu scope inheritance and catalog compact defaults. `InsertContentMenuControl` explicitly sets compact on Menu and trigger; other inspected catalog menus do likewise. | Generic Menu intentionally inherits scope; it is not globally compact. Nested-theme/density unit assertions are retained source, **not executed here**. Coordinator retains broad catalog/portal/runtime acceptance ownership. |
| D-12 | Partial; minimum sizing and focus rules exist, comfortable touch acceptance absent | Button uses both minimum block and inline size from the density height token; IconButton delegates to Button and uses that height as its width. Comfortable is 44px and compact 32px at a 16px root font. Button focus-visible uses tokenized width/offset/color and forced-colors Highlight; Menu focused items retain an inset outline. | No coarse-pointer enlargement rule found in inspected Button/IconButton/Menu/foundation source. Retained group tests measure desktop density geometry, not coarse-pointer comfort. Root must establish which important compact controls require larger touch hit regions, verify native computed target/spacing and focus in both densities, then retain physical-device evidence. 32px alone is **not** asserted to violate WCAG; spacing/exceptions and the chosen comfort policy need assessment. X-07/device/AT remain open. |
| D-13 | Supported for the defined split/filled contracts | [Layout/actions](../react-aria-layout-actions.md) defines neutral text primary and secondary menu trigger in one outlined group. SplitAction composes that exact pattern. ButtonGroup supplies shared border `--sgui-border` and inner logical divider `--sgui-divider`; both actions use neutral `--sgui-text`. Tokens define readable light/dark text and corresponding borders/dividers. AppModal maps primary persistence actions to filled/primary, secondary to text/neutral; [modal mappings](../react-aria-modal-shells.md) document these defaults. | SplitAction follows inherited density and has no filled split variant; filled emphasis exists through Button/AppModal. No new visual contrast measurement or current light/dark native geometry result is claimed. Historical host-blocking results establish only their recorded interaction slice; broad U-01/G-10/X/manual/device/AT remain open. |

## Exact retained Git evidence

All blobs below were resolved with `git ls-tree -r HEAD` at the reviewed head.
Git blobs identify immutable inspected content, not successful test execution.

| Path | Git blob | Criterion |
| --- | --- | --- |
| `README.md` | `0af615ed0dc6984d08b57aed8eea8ecb8ddce9a4` | D-10/general default |
| `src/foundation/tokens.json` | `64113cf0b2117e9bf1c2982bfe44c05a2ba59cee` | D-10–D-13 |
| `src/foundation/tokens.css` | `b36050c8871253823b4a9deb8d146936a14222ec` | generated font/density/theme values |
| `src/foundation/ThemeScope.tsx` | `ec330a71f6ee1f32ad10b717efe5a285094ca953` | independent density/default |
| `src/foundation/ThemeScope.test.tsx` | `d2a452011b3679297cf5c09f75f2999bc10f9c11` | retained inheritance assertions, unrun |
| `src/experimental/Provider/Provider.tsx` | `cb3e3de6f89932418f05fd793a4899bd8ff548ed` | scope delegation |
| `src/experimental/Menu/Menu.tsx` | `60ebffe51e492d220465271c2b783c422ccc716a` | explicit density or inherited scope |
| `src/components/InsertContentMenuControl/InsertContentMenuControl.tsx` | `97c24ed0a4bcb6ab30d89b9cfa75df41864194a9` | catalog compact compatibility |
| `src/experimental/Button/Button.module.css` | `cccf005e0bdee43ac22d8f8830523938ce5167f6` | minimum sizing/focus/neutral text |
| `src/experimental/IconButton/IconButton.tsx` | `4e138431786d5c5166a54fab22171824960fdf0c` | neutral default/delegation |
| `src/experimental/IconButton/IconButton.module.css` | `be70d39b2981129870afbd8ebebc2d8e33bebee1` | density width |
| `src/experimental/Menu/Menu.module.css` | `2f5371f35a24b6d6104864d9385f2d94c927752a` | minimum item height/focus |
| `src/experimental/ButtonGroup/ButtonGroup.module.css` | `7a4872422c0163033cf612747dbb0c9cffb20be7` | shared border/divider |
| `src/experimental/SplitAction/SplitAction.tsx` | `50f18c4dd2f083f8a8428b08120283d1b306a23c` | composed neutral split |
| `src/components/AppModal/AppModal.tsx` | `82b09b4104fd0d5c14dd4d63c4fca20bcbe3fc16` | filled primary context |
| `docs/developer/react-aria-architecture.md` | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` | host fonts/explicit density policy |
| `docs/developer/react-aria-theme.md` | `f4c013be5314931ed051863eeb1ead6501594772` | public scope/font ownership |
| `docs/developer/react-aria-layout-actions.md` | `d5bb37391920da442d64ed16979bb97ed8e34159` | split definition |

## Historical runs and artifact retention limits

These reports were read as bounded historical records. Their runs are not new
passes at `e43bf60`, and unchanged selected blobs do not prove an unchanged full
dependency/build graph.

| Retained report | Exact recorded tested head and scope | Actual retention inspected now |
| --- | --- | --- |
| [SplitAction batch 13](../parallel-batch-13/control-splitaction.md), blob `4552d14e6273ec8c5ea51e7d9832da8d51e9efca` | `f5f824e99edd6e7a17b6ac031b0adcc337b6f4c3`; records 8 Chromium/WebKit host-blocking/replacement/unmount passes, Firefox unverified. Does not test split colors or physical touch. | Recorded worktree `artifacts/` and `/tmp/sgui-batch13-control-splitaction-browser.log` are absent. Git retains the report/spec/source, not inspected raw results/traces. Current SplitAction/spec blobs equal that head: `50f18c4dd2f083f8a8428b08120283d1b306a23c` / `57bf2fcc4352c092157ba79703d602bac9071031`. |
| [ButtonGroup batch 13](../parallel-batch-13/control-buttongroup.md), blob `75ae5d7557bb3efb4b3ebe543aa2b930831130be` | Corrected `6037f1b5313766d39a832e0af8a461ce9e3eef59`; records 2 Chromium passes for density/corners and native traversal. Earlier `92cd135d1233f3cac4a82d7fa7dac48ec23fb262` three-engine run had 2 passed/4 failed; corrected Firefox/WebKit remained pending in this report. | Pool directory `.../batch13-control-buttongroup/sg-ui/artifacts/browser-pool/0c5ac786-8f5c-42ef-af94-b5cf8ddf413f/` exists with only `storybook` as its immediate child. `evidence.json`, `build.log`, `types.log`, `browser.log`, `results.json` are absent. Surviving build directory is not a retained result. Current CSS/spec blobs equal corrected head: `7a4872422c0163033cf612747dbb0c9cffb20be7` / `50395a45da5f90ff4cf9145b81e75d1e025dc85d`. |

No claim is made about copies in uninspected coordinator storage or CI. Exact
recorded paths were checked read-only; nothing was deleted or recreated.

## Checks performed and bounded handoff

- Read README, migration and component architecture before writing; read the
  four parent criteria, theme/action/modal contracts, implementation files and
  relevant retained tests/reports.
- Verified clean baseline, exact HEAD, worktree isolation and selected Git blobs.
- Searched `src`, `.storybook`, and `package.json` for `font-face`, Google font
  hosts, woff/ttf references: no matches. Enumerated tracked paths for
  `.woff`, `.woff2`, `.ttf`, `.otf`: none. This excludes untracked host assets and
  does not claim a freshly built network audit.
- Inspected density minima, focus/forced-colors rules and coarse-pointer policy
  in relevant source. Compared four historical/current blobs with `git rev-parse`.
- Checked recorded artifact/log existence with read-only filesystem inspection.
- Final report links, whitespace and exclusive diff are checked before commit;
  no execution-based acceptance result is generated by this task.

D-12 is an acceptance/evidence gap, not a demonstrated activation defect. No
exclusive production fix allowlist is requested without a chosen comfort policy.
Suggested coordinator-owned next slice: review Button/IconButton/SplitAction/Menu
targets under coarse-pointer use, both densities and native keyboard modality;
use existing deterministic stories and retain exact head/build/results. A genuine
failed target policy would justify a separately assigned bounded source change
to `src/experimental/Button/Button.module.css` and, only if necessary,
`src/experimental/IconButton/IconButton.module.css`, with one focused native
target/focus regression and affected composed checks. Shared token changes need
their own owner; physical-device and spoken AT evidence cannot be supplied by
touchscreen emulation alone. No new test was fabricated and no root validation
window is required for this documentation-only report.
