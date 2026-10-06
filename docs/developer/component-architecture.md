# SGUI component architecture

Adapted from `learning-platform/docs/developer/component-architecture.md` at
commit `8e63f1e16fc3d43d851908b312603a1099ca13d9`. The learner platform's UI was
organized for extraction into a library. SGUI is that standalone library.

This document describes the current extraction. The user-approved target and
execution backlog are in the [React Aria master task list](react-aria-master-task-list.md).
Migration work replaces the foundation while keeping SGUI's APIs, styles, and host
boundaries under SGUI ownership; update this architecture as that work lands.

## Source layout

- `src/components/<Component>`: component implementation, index, stories and tests.
- `src/components/primitives` and `src/components/icons`: MUI primitive/icon wrappers
  and reexports, also exposed through `src/primitives` and `src/icons` entry points.
- `src/theme`: shared MUI tokens, light/dark themes, provider and type augmentation.
- `src/hooks`: reusable state/pagination behavior.
- `src/adapters`: host routing and account integration.
- `src/i18n`: translation adapter and English fallback formatting.
- `src/models.ts`: library presentation models.
- `src/index.ts`: the root public API; package.json exports defines public subpaths.

## Rules for reusable components

Export reusable components and their prop types through the appropriate public
barrels. Avoid circular dependencies: a component should import a sibling's local
entry point rather than importing the library's root barrel back into itself.

Keep implementations independent of Next.js routing/image APIs, application
contracts, authentication endpoints and feature-module imports. Use adapters,
props and callbacks for host integration. Build scripts must not resolve paths
outside the SGUI package to make an import work.

Colocate `*.stories.tsx` and behavior tests with each component. Use representative
fixtures and adapters in stories so the catalog runs without the learner platform.
The application-facing examples and Storybook share `src/theme`; use theme variants
and shared overrides for visual consistency.

Use existing SGUI primitives and components for composed views. Base wrappers and
themes can import MUI directly. Keep application-specific routing, persistence,
authentication and supported-language policy in the consuming application.

Guard browser globals for server rendering and preserve client boundaries. Keep
module augmentation reachable from published declaration entry points. Verify
public imports with the package consumer checks after changing exports or types.

## Adopting the extracted library

The learner platform can replace its `@ui` imports with SGUI's public exports after
installation, using the host adapters for routing, accounts and translations.
See [migration.md](../migration.md) for the file inventory and integration limits.
Do not bring back its local aliases or move its API-bound screens into this library.

[AGENTS.md](../../AGENTS.md) holds the active development rules; this document
explains the architecture they apply to.
