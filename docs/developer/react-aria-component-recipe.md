# Canonical owned component recipe

Task reference: W-07. Use this recipe for a new component or a bounded migration;
it does not authorize renaming preserved public exports or expanding task ownership.
[Architecture](component-architecture.md), [AGENTS.md](../../AGENTS.md) and the
component's existing contract define its boundaries.

1. **Define the observable contract.** State the task IDs, existing names/behavior,
   changed behavior, host-owned data/actions and acceptance slice. Inventory current
   props, stories, tests and exports before replacing an implementation. Use Course
   naming for new domain APIs while retaining established Class/App exports.
2. **Declare owned props and refs.** Select useful native attributes and the actual
   native element ref; declare variants, state and callbacks explicitly. Do not
   extend upstream prop/event/state/slot types or expose date classes. Use a single
   normalized onPress action; links use the navigation adapter. Specify controlled
   value/default/change behavior and keep controlled hosts authoritative.
3. **Map interaction internally.** Import only the needed React Aria implementation
   subpaths in the interaction module. Reuse existing SGUI primitives/adapters in
   compositions. Keep selected, focused, pending and draft state distinct; declare
   commit/cancel/reset behavior and one state owner. Guard browser globals and add
   `use client` only where client APIs require it. Preserve native form participation,
   button type defaults and the distinction between disabled and read-only.
4. **Use production styling.** Add colocated compiled CSS Modules in sgui.components
   using generated token variables. Prefer shared tokens/typography roles/variants;
   use logical layout properties, focus/forced-color and reduced-motion behavior.
   Provide declared className/native style and stable documented part hooks where
   needed. No runtime CSS engine, sx or upstream theme types. Check light/dark/system,
   compact/comfortable, RTL, enlarged text and narrow containers.
5. **Name and translate.** Require a visible label or supported accessible-name prop.
   Hide decorative icon slots and name icon-only actions. Associate errors/descriptions
   with controls. Use `t(key, { defaultMessage, ... })` for new library strings;
   hosts translate supplied labels. Locale comes from the host translation adapter
   through Provider; date/time contracts stay serializable with explicit timezones.
6. **Export deliberately.** Add component and owned prop types to their local and
   appropriate public barrels and declared package entry points within authorized
   scope. Source imports stay relative and avoid root-barrel cycles. Use granular
   imports in consumer examples; never advertise a source file as an exported subpath.
   If shared export/config ownership belongs elsewhere, report the required change.
7. **Demonstrate changed behavior.** Colocate stories using production Provider and
   representative local data/host adapters. Cover the changed state/interaction and
   compositional behavior; do not fork tokens or depend on host APIs/authentication.
8. **Test observable behavior.** Add colocated tests for keyboard/pointer actions,
   callbacks, forms/reset, refs, controlled acceptance, accessible state and relevant
   cancellation/lifetime regressions. Compose nested controls to detect accidental
   selection/activation/focus changes. Use browser checks for native timing, focus,
   scroll, positioning, clipboard/download and computed layout. Assertions should
   verify outcomes, not duplicate implementation. Report actual-device/IME and
   assistive-technology behavior as unverified until tested.
9. **Validate and document.** Run `pnpm check` and `pnpm build-storybook` for code/build
   changes plus targeted checks appropriate to the behavior. Build static Storybook
   before `pnpm test:browser`, never during a suite. Use packed consumer checks for
   public export/type/CSS/SSR changes. Update contract docs, stories and applicable
   guidance in the same change; record tests and limits. Docs-only changes require
   source/export/link/example consistency checks, not unrelated UI tests.

Acceptance requires owned declarations and import/style/token boundaries, meaningful
behavior coverage, maintained public entry points, copyable consumer guidance,
required passing checks and an explicit account of remaining acceptance. A migrated
module is not evidence that all broad gates are complete. Do not weaken guards,
claim physical-device conformance from emulation or publish locally. Use a reviewed
Conventional Commit/draft PR; mark actual breaking API changes as breaking.

See [browser evidence](react-aria-browser-acceptance.md),
[server/client packaging](react-aria-server-components.md) and
[read-only host checklist](react-aria-adoption-checklist.md).
