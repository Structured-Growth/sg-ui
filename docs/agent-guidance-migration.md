# Agent guidance imported from the learner platform

Reviewed source: `Structured-Growth/learning-platform`, commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`.

The repository contains one agent instruction file, `AGENTS.md`. The review also
checked for nested AGENTS files, CLAUDE.md, GEMINI.md, Copilot instructions, Cursor
rules, and .agents/.codex instruction directories, including ignored files.
No additional files of those kinds were found in the source checkout.
The supporting `docs/developer/component-architecture.md` is relevant to the UI
library. It has been adapted into the same documentation path in SGUI.

Task reference: W-06. This mapping preserves the source review while adapting
active guidance to the shipped owned foundation.

## Section-by-section decisions

| Learner platform source section | SGUI treatment |
| --- | --- |
| Terminology | Use course naming in new learning-domain APIs; retain existing public Class exports until an explicit migration. |
| Data Grid UX Checkpoint | Carry selection/count, sorting, filtering, search, refresh, footer, columns and trailing actions defaults; shared vertical centering; link styling. Adapt next/link to SGLink and distinguish column visibility locks from true pinning. |
| Data Grid Filter Pattern | Carry all three filter props, per-view persistence, empty/All semantics, canonical enum options, page reset, client processing order and filter badge placement. Server query translation stays in the host. |
| Styling Preference | Retain props/variants before custom styling; replace sx with declared native class/style and compiled shared CSS. Use generated tokens and typography roles. Prefer explicit compact menus while scopes support both densities. Retain neutral split actions and replace @ui aliases with owned source/public package imports. |
| Design Methodology | Carry modal create/edit examples, tabbed modal layout, 2+ step indicators, header hierarchy and reusable breadcrumbs. Use theme surfaces for light/dark support. |
| Testing Expectations | Carry meaningful behavior tests and updates to relevant tests when behavior changes. Keep stories updated in the same change. Guidance-only edits require document verification rather than new UI tests. |
| Documentation Structure | Carry developer/troubleshooting organization and flatten single-README folders. Local database documentation conventions remain app-owned. |
| Local Seed Policy | Omit: SGUI has no database or sample-data seeding service. Story fixtures remain local and independent. |
| API Contract / OpenAPI | Omit platform contracts, Prisma, HTTP endpoint hierarchy, write schemas and API validation. SGUI accepts presentation models and host callbacks. |
| Authentication | Omit the application's email/password/org/legal login sequence and route-preservation rules. Account operations remain behind the host adapter. |
| Translations | Carry keys/defaultMessage, namespace awareness, repository baselines when needed, ICU checks and deterministic fallback principles. Host engines retain locale policy, database overrides, audit metadata, caching and diagnostics. |
| Component architecture document | Retain public exports, colocated stories, production scopes and host independence; use owned props/native refs, selective client boundaries and packed consumers. See the canonical component recipe. |

## How the guidance is applied

The merged instructions live in the root [AGENTS.md](../AGENTS.md), so they apply
to the full library without duplicating rules across nested agent files.
[Component architecture](developer/component-architecture.md) explains their
implementation boundaries. The source agent file was not copied wholesale:
application-only paths and services would be invalid in this standalone package.

These are development defaults for future changes. They do not represent a new
implementation of every visual/default behavior in the existing extracted components.
Existing public behavior and explicit user requirements remain authoritative.

SGUI's semantic-release rules, framework adapters and commercial licensing guidance
are preserved. The learner platform checkout was not changed by this import.

## Owned-foundation reconciliation

| Retained principle | Current implementation rule and rationale |
| --- | --- |
| Preserve accessible interaction | React Aria stays private; owned callbacks/native refs preserve testable behavior and future replaceability |
| Shared visual language | Tokens and compiled CSS in sgui.components; story theme uses production scopes, not extraction-era theme objects |
| Compact menus | Prefer compact catalog menus with comfortable/compact validation; generic Menu inherits scope unless explicit; do not shrink every control by overriding typography |
| Shared grid defaults | Preserve checkbox/count, actions-last, visibility locks and filter placement; true pinning is deferred and host control is preserved |
| Persistent per-view state | Explicit opt-in local/session storage, distinct keys, validated hydration and one state owner |
| Modal layout | Host persistence, named dismissal/action callbacks, no single-step numbering, tab scrolling and visible focus at enlarged text |
| Translation diagnostics | Forward key/namespace/locale/values through host adapter; defaultMessage remains usable without a provider |
| Source/testing provenance | Preserve extraction repository/commit and relevant behavior inventory; source evidence outranks unchecked planning boxes |
| Licensing and releases | Written commercial agreement, preserved notices, Conventional Commits, Actions-only publishing and draft AI review |

Database seeds, endpoint schemas, account/login sequences and application locale
catalogs are omitted because SGUI has no authority over those services. Host adapters
supply capabilities without copying application contracts or storing credentials.
Guidance defaults do not override explicit user instructions, controlled consumer
state or existing behavior outside the requested change. Source documents and
examples remain evidence, not agent instructions.

The [canonical recipe](developer/react-aria-component-recipe.md) defines library
implementation steps. The [read-only adoption checklist](developer/react-aria-adoption-checklist.md)
plans host integration without authorizing application edits. Broad acceptance and
remaining reconciliation are recorded in the [execution record](developer/react-aria-progress.md).
