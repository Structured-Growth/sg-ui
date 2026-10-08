# SGUI React Aria migration: functionality-first master task list

Rewritten: 2026-10-08. Goal: a usable baseline of **every existing component in the owned architecture first**, followed by separate regression, bug-fix and acceptance passes. A baseline can have known bugs. Baseline completion does not mean production acceptance or migration completion.

The [execution record](react-aria-progress.md) remains the evidence source. The [original scope ledger](react-aria-scope-ledger.md) preserves all previous IDs, checked status, mappings, deferred work and evidence, including changes already present in the working tree. No completed implementation is reset or inferred missing by this rewrite. Historical acceptance percentages remain history; the new finer leaves start open for evidence mapping, not because accepted work needs reimplementation.

## Execution order

| Priority | Work | Completion rule |
| --- | --- | --- |
| P1 | Reconcile existing evidence and finish functionality across all catalog components, required primitives, foundation and host support | All required `F-*` items checked with owned source, one usable example and minimal smoke evidence |
| P2 | Expand targeted regression coverage | Independently checked `T-*` tasks, one feature or state transition at a time |
| P3 | Fix found bugs; browser, visual, accessibility, locale and lifecycle hardening | Individually tracked fixes and `V-*` evidence; unsupported environments stay explicit |
| P4 | Reconcile original scope and complete package/release/removal acceptance | Required `A-*` and original obligations closed with evidence; release prerequisites reviewed |
| Future | Explicitly deferred product features | Outside the required milestone unless the user selects them |

Work breadth-first: get each missing control's primary flow working before expanding an already-working control's test matrix. Do not queue another edge-case audit while a required component has no usable owned baseline. Existing owned components need evidence reconciliation and targeted gaps, not another migration rewrite. Foundation and shared primitives precede the compositions that require them; editor and grid basics remain P1, not the end of the project.

Scheduling order is **functionality → regression → hardening** across the whole library. While any required `F-*` baseline task is unfinished, choose functionality work; do not schedule new `T-*`, `V-*` or `A-*` work. After the baseline milestones close, finish required `T-*` regression tasks before scheduling hardening. Final acceptance follows hardening.

Evidence reconciliation belongs to the current phase. Reuse existing passing tests and retain required validation during functionality work. Fix a build/import or primary-flow failure as part of its functionality task, with only the minimal smoke evidence needed to establish that flow. Record other bugs for the later phases; discovering them does not promote a regression or hardening assignment ahead of functionality. Existing guards, public contracts, licensing and host boundaries remain in force.

## Detailed checklists

- [P1 functionality baseline](react-aria-baseline-tasks.md): 570 independently checkable tasks.
- [P2 expanded regression coverage](react-aria-regression-tasks.md): 570 independently checkable tasks.
- [P3/P4 hardening and scope closure](react-aria-hardening-tasks.md): 782 independently checkable tasks.

The files are one backlog split for readability. They cover all 37 catalog directories, all 47 current experimental directories, and 18 supporting modules/concerns. IDs encode the inventory row, not a renamed public API. Matching `F-C01-01` and `T-C01-01` separate delivery of the same feature from deeper regression evidence. `V-*` adds native/visual evidence, and `A-E-06` closes the original E-06 obligation. Never add historical parent totals to the active child totals or report baseline percentage as overall acceptance.

## Every implementation chat closes a small task

1. Select the earliest unfinished phase, then claim one specific open ID and list the files you will touch. Reference its legacy parent for context. Pick a task that can finish in one chat.
2. Inspect current source, stories, tests and accepted evidence first. If it is already done, reconcile evidence and check the task; do not invent work or duplicate tests.
3. Deliver the smallest reviewable functionality slice. If the selected item is still too large, retain it as a parent and create concrete `-a`, `-b`, etc. children before implementation. Children must name observable deliverables, not “continue work.”
4. Run the minimum checks required by repository policy. Close the functionality task independently from future regression/browser tasks. Record bugs as separate tasks with expected/actual behavior and reproduction.
5. Update the checkbox and append evidence to the execution record in the same change. The final report names checked IDs, result, validation and any newly identified successor IDs.

Every productive chat should close at least one reviewable leaf task: implementation, accepted evidence reconciliation, focused regression, reproducible defect diagnosis, documentation, or a concrete prerequisite resolution. A read-only diagnosis must leave a reproducible finding and an actionable successor. Do not check an unfinished task merely to meet this rule. If externally blocked, record the exact blocker and completed independent work; ask for input only when actually needed.

Evidence format: `ID | result | source/test/story path | commit or accepted record | validation | limits | successor IDs`. Checkbox checked means the named leaf result exists. It does not imply its whole component, original parent, browser matrix or release gate is complete. Do not check the new finer tasks wholesale based on a broad historical checkbox; reconcile the specific result first.

## Minimal testing during P1

Keep a very small smoke set: normally 1–3 meaningful cases per component or changed composition **in total**, reusing current tests. Establish rendering/accessible primary label, the main owned callback/transition, and a critical guard if needed. Preserve existing tests and update those directly broken by an intentional contract change. Registered interactions still require colocated tests.

Do not add exhaustive controlled/uncontrolled, keyboard matrix, browser-engine, locale/timezone, nested-instance, visual, SSR, performance, IME, device or assistive-technology coverage to an ordinary P1 slice. Those have separate P2/P3/P4 tasks. Use a narrow native check during P1 only when needed to establish the primary flow that DOM emulation cannot show. Full coverage does not block the baseline checkbox.

Keep existing required checks: code/dependency/build/release changes run `pnpm check` and `pnpm build-storybook`; documentation-only changes verify relevant links, IDs, scope and consistency. This rewrite changes what new coverage is authored and when, not whether existing checks pass. Do not delete tests, weaken assertions, disable CI, alter workflow permissions or rebuild Storybook during an active browser run to accelerate progress.

## Baseline milestone and later acceptance

- [x] PLAN-001 Rewrite the execution backlog into granular functionality and separate regression/hardening tasks; preserve original scope and align agent guidance. Evidence: this document, the three linked checklists and the original scope ledger; documentation checks recorded in this chat.
- [x] PLAN-002 Reconcile existing accepted catalog evidence into `F-C*` leaves, in small component-sized chats. Split this coordinator rollup by component; do not wait for whole-backlog reconciliation to implement a real gap.
- [x] PLAN-003 Reconcile existing accepted primitive evidence into `F-P*` leaves, in small control-sized chats.
- [x] PLAN-004 Reconcile existing accepted foundation/host evidence into `F-S*` leaves, in small module-sized chats.
- [x] BASE-001 Confirm all required `F-*` leaves have owned implementation and minimal smoke/story evidence; list every known bug and retain all later coverage tasks.
- [x] BASE-002 Walk a composed host story using navigation, modal/form, cards/grid and editor; verify primary callbacks without backend dependencies. This is one composed smoke flow, not full acceptance.
- [x] BASE-003 Record the baseline milestone separately from test/acceptance percentages and switch normal scheduling to P2.
- [ ] ACCEPT-001 Confirm all required `T-*`, `V-*` and `A-*` leaves and original obligations are closed, with honestly bounded device/assistive-technology evidence and explicit future scope.
- [ ] ACCEPT-002 Mark full migration complete only after original Z-16 requirements are met. Publication remains a separately authorized workflow action.

## Keeping this backlog complete

The detailed feature slices supplement the original scope; they do not discard original obligations. The hardening file gives each original checklist item an independent closure task and retains each deferred feature. Catalog M-01–M-37 inventory rows map to C01–C37 exactly; their status evidence remains in the ledger/execution record. Broad original parents stay open while their functionality children can close.

Add a leaf when a chat discovers a missing helper, public alias, state, or bug. New components get their own inventory row, specific functionality leaves, a shared minimal-smoke task, and separate regression/native tasks. Do not create thousands of placeholder tasks merely to inflate counts. Keep independent useful work granular enough that a chat can finish it.

A baseline component story must use production scope/styles, the owned APIs and representative host adapters. Public name preservation, breaking-change mappings and safety boundaries remain implementation requirements; visual polish and wider environment coverage follow afterward. Deferred grid pinning/virtualization/enhancements, recurrence/scheduler work, Figma token export and multi-framework support are not silently promoted into baseline requirements.

## Accepted direction and boundaries

- React Aria Components is the chosen primary interaction foundation. Use its
  lower-level hooks when component composition cannot meet a demonstrated need.
  This is an implementation dependency, not SGUI's public API or visual identity.
- SGUI owns its component APIs, design tokens, styles, compositions, documentation,
  and observable behavior. It must be possible to replace the foundation later.
- Remove the entire existing MUI foundation: Material components, X DataGrid,
  icons, Emotion, augmentation, public type coupling, styling selectors, tests,
  stories, consumer requirements, and obsolete guidance. Grid baseline functionality
  is part of P1; broad grid hardening follows as separate tasks.
- Use compiled CSS Modules and CSS custom properties as the default. Tailwind,
  Sass, a runtime styling engine, or a typed CSS authoring tool is not required of
  consumers. Additional tooling needs a documented benefit before adoption.
- Preserve the recorded TanStack processing/React Aria interaction decision and
  one owner per grid state concern. Separate engine responsibilities remain explicit.
- UI library only: do not move application screens, APIs, database models, session
  storage, authentication flows, or platform contracts into SGUI.
- Preserve routing, translation, and account adapters and host-owned data fetching.
- React is the current supported framework. Multi-framework packages are a future
  decision, not an automatic consequence of using headless primitives.
- Publish `@structured-growth/sg-ui` publicly on npm under the existing commercial
  license requirements. Public distribution does not grant a free-use license.
- GitHub Actions produces official builds and releases. semantic-release uses
  Conventional Commits; no manually authored changesets or version bumps.
- AI-generated changes are reviewable draft PRs. Do not automatically merge them.

Alternatives researched were Base UI, Ark UI/Zag, Radix, Headless UI, Mantine, and
shadcn/ui. They are comparison evidence, not approved additional foundations.
React-specific APIs do not prove superior performance; measure actual workloads.

## References and repository guidance

These document upstream capabilities and standards. Prototype findings and SGUI
requirements decide implementation; marketing claims are not performance evidence.
Reverify versions and browser support when each task is implemented.

- [React Aria Components and composition](https://react-aria.adobe.com/getting-started)
- [React Aria date picker](https://react-aria.adobe.com/DatePicker)
- [React Aria calendar](https://react-aria.adobe.com/Calendar)
- [React Aria range calendar](https://react-aria.adobe.com/RangeCalendar)
- [React Aria table](https://react-aria.adobe.com/Table)
- [React Aria Components package/license](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/package.json)
- [Apache 2.0 terms](https://www.apache.org/licenses/LICENSE-2.0)
- [Design Tokens Community Group stable reports](https://www.designtokens.org/technical-reports/)
- [CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
- [CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container)
- [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values)
- [CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting)
- [vanilla-extract theme contracts](https://vanilla-extract.style/documentation/theming/)
- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind browser requirements](https://tailwindcss.com/docs/compatibility)
- [WCAG 2.2 guidance](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)
- [Storybook accessibility checks](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [TanStack Table's headless responsibilities](https://tanstack.com/table/v8/docs/overview)
- [AG Grid Community/Enterprise comparison](https://www.ag-grid.com/react-data-grid/community-vs-enterprise/)
- [Base UI architecture](https://base-ui.com/react/overview/about)
- [Ark UI architecture](https://ark-ui.com/docs/overview/about)
- [Ark UI date picker](https://ark-ui.com/docs/components/date-picker)
- [Zag framework adapters](https://zagjs.com/guides/framework-adapters)
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Headless UI](https://headlessui.com/)
- [Mantine CSS Modules](https://mantine.dev/styles/css-modules/)
- [shadcn/ui code ownership](https://ui.shadcn.com/docs)
- [HeroUI's React Aria implementation](https://heroui.com/docs/introduction)

Local background: [current component architecture](component-architecture.md),
[extraction inventory](../migration.md), [guidance provenance](../agent-guidance-migration.md),
[GitHub setup](../github-setup.md), [commercial licensing](../commercial-licensing.md),
and [agent instructions](../../AGENTS.md).
