# HierarchicalMenu: ready for coordinator integration

User-directed implementation now exists in the shared checkout; no build or runtime
suite was run by this author. Apply `hierarchical-integration.patch` for the shared
exports, interaction guard, catalog entry, usage/navigation and new docs examples.
The patch contains exact proposed files and does not change generated metadata.

Actual new files:

- `packages/ui/src/experimental/HierarchicalMenu/{HierarchicalMenu.tsx,HierarchicalMenu.module.css,types.ts,model.ts,index.ts,HierarchicalMenu.test.tsx}`
- `apps/docs/native-fixtures/scenarios/experimental/HierarchicalMenu/HierarchicalMenu.fixture.tsx`
- `packages/ui/tests/browser/hierarchical-menu.spec.ts`

The component owns recursive levels, native navigation/command semantics, stable-ID
controlled/local path requests, section/footer content, mixed inline/drilldown,
Back focus and scroll restoration, disabled/removed ancestor reconciliation, cycle
protection, directional short motion, reduced motion and forced-color focus.
Popup geometry/dismissal is host-owned; child command Escape unwinds one displayed
level before root dismissal. Native links keep adapter semantics and secure targets.
The existing SideNavigation implementation is unchanged; adoption is still separate.

Three colocated baseline cases and three native cases cover deep entry/Back,
mixed ancestry, independent panels, controlled rejection/removal and command popup
Escape/reset. They are ready to run, not passing claims. Public docs add a prop
playground, fixed compact/comfortable mixed references, controlled authority and
popup composition; every panel has its own state owner and copyable public source.

Author checks: source/unit no-emit TypeScript passes; the virtual proposed export +
fixture + browser spec + docs integration also has zero diagnostics. Seven pure
model assertions pass. Scoped CSS validator and token-name check pass. Initial
TypeScript failure (missing checker CSS ambient root and React nativeEvent access)
is retained in hierarchical-types-first.txt and corrected. No Vitest/Playwright,
build, install, simulator, source graph or full foundation run is claimed.

Run `hierarchical-validation-plan.json` under coordinator admission. Regenerate
catalog/API/composition and private fixture registry after applying exports, then
build the immutable host once and execute the three focused native cases. Keep
all failures and zero-page-error assertions. HM-F01–04/A-U07 remain pending runtime,
public source-snippet checks and rendered review; this handoff does not infer AT,
physical-device, broad T/V or production approval.


Coordinator authorized a light unit slot after initial1/3 command-focus failure.
A frame-only attempt retained that failure; keeping the command collection mounted
across path updates resolves native FocusScope restoration to the enclosing Dialog.
All3 strict baseline unit cases now pass in hierarchical-units-stable-collection.txt.
Source is frozen at SHA256 `82a2dd27b51265bf10f8f01477cdba74a22e271add68266fa76fb39d5d994cce` for coordinator rebuild.
The fixture model is no longer exported because the registry generator scans
object exports regardless of excludeStories; exactly3 actual scenarios remain.
Apply hierarchical-native-manifest.patch before registry generation; it preserves
new fixture provenance and does not invent historical Storybook evidence.
