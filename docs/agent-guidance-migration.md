# Agent guidance imported from the learner platform

Reviewed source: `Structured-Growth/learning-platform`, commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`.

The repository contains one agent instruction file, `AGENTS.md`. The review also
checked for nested AGENTS files, CLAUDE.md, GEMINI.md, Copilot instructions, Cursor
rules, and .agents/.codex instruction directories, including ignored files.
No additional files of those kinds were found in the source checkout.
The supporting `docs/developer/component-architecture.md` is relevant to the UI
library. It has been adapted into the same documentation path in SGUI.

## Section-by-section decisions

| Learner platform source section | SGUI treatment |
| --- | --- |
| Terminology | Use course naming in new learning-domain APIs; retain existing public Class exports until an explicit migration. |
| Data Grid UX Checkpoint | Carry selection/count, sorting, filtering, search, refresh, footer, columns and trailing actions defaults; shared vertical centering; link styling. Adapt next/link to SGLink and distinguish column visibility locks from Pro pinning. |
| Data Grid Filter Pattern | Carry all three filter props, per-view persistence, empty/All semantics, canonical enum options, page reset, client processing order and filter badge placement. Server query translation stays in the host. |
| Styling Preference | Carry props-before-sx, shared tokens, compact menus, typography variants and neutral split-button actions. Replace application @ui import rules with SGUI primitive/component boundaries. |
| Design Methodology | Carry modal create/edit examples, tabbed modal layout, 2+ step indicators, header hierarchy and reusable breadcrumbs. Use theme surfaces for light/dark support. |
| Testing Expectations | Carry meaningful behavior tests and updates to relevant tests when behavior changes. Keep stories updated in the same change. Guidance-only edits require document verification rather than new UI tests. |
| Documentation Structure | Carry developer/troubleshooting organization and flatten single-README folders. Local database documentation conventions remain app-owned. |
| Local Seed Policy | Omit: SGUI has no database or sample-data seeding service. Story fixtures remain local and independent. |
| API Contract / OpenAPI | Omit platform contracts, Prisma, HTTP endpoint hierarchy, write schemas and API validation. SGUI accepts presentation models and host callbacks. |
| Authentication | Omit the application's email/password/org/legal login sequence and route-preservation rules. Account operations remain behind the host adapter. |
| Translations | Carry keys/defaultMessage, namespace awareness, repository baselines when needed, ICU checks and deterministic fallback principles. Host engines retain locale policy, database overrides, audit metadata, caching and diagnostics. |
| Component architecture document | Carry public exports, colocated stories, shared themes and framework independence; update all paths and package names to SGUI. |

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
