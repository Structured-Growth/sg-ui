# Batch164: token tiers and semantic states

Bounded D-02/D-04 source slice. Parent acceptance remains open.

## Isolation and ownership

Worktree `/Users/thomashall/.codex/worktrees/9b27/sg-ui` was clean and detached at
exact authorized baseline `1948d0b54688cf61dfa6708fd94cbc8ca6e21990` before edits.
`git worktree list` confirmed an independent checkout. Source branch:
`codex/batch164-token-tiers-semantic-states`. No other checkout, primary image-upload
work, source outside the seven-file allowlist, shared ledger or master task was changed.

Source commit and exact targeted tested head:
`294002af3ea96189051ccdd43bcfa267ac8c7608` (`feat: define token tiers and semantic state roles`).
This evidence document is committed afterward; it changes no tested source bytes.
The completion message supplies the final reporting head and this file's hash.

## Delivered contracts

- Base owns deduplicated palette/scale literals. Shared/density role aliases preserve
  all previous emitted literal values. Light/dark now have 41 paired color roles.
- Semantic same-theme and component aliases remain `var()` in CSS. They rebind at
  scope, theme/system and density boundaries, preserving source override relationships.
  All existing CSS scoped declarations and selector order have literal snapshot tests.
- Component tier has 34 slot aliases for primary/neutral/destructive buttons,
  fields, menus, dialogs, cards and focus. Generated `/tokens` adds tier membership,
  semantic/component name types and component variable entries.
- Generator enforces group admission, role alias direction, valid values, types,
  cycles, missing references, emitted-name uniqueness, paired keys/types and matching
  semantic alias topology. Unknown groups can no longer disappear from output silently.
- [Role contracts](../react-aria-token-roles.md) provide the complete light/dark table,
  deduplication/intentional role-alias distinctions, emitted scope behavior,
  component mappings, declared contrast pairs and limitations.

Consumer/component wiring is deliberately deferred under the authorized allowlist.
No component API, interaction or existing CSS treatment was changed. There are no
new runtime validation features. Stories/native specs were not changed because those
paths are outside scope and there is no newly wired component behavior here.

## Actual validation

Node `v24.21.0`, pnpm `10.29.3`. Canonical owner-exclusive resource helpers from
`browser-validation-pool.mjs` were used. Owner:
`batch164-token-tiers-semantic-states`; final light slot `slot1`, install slot `slot0`.
Foreign batch85 light `slot0` was never adopted or removed. All owned claims were
released after command settlement. Dependency installation used
`pnpm install --frozen-lockfile` (passed; unchanged lockfile). Installation reported
ignored esbuild build scripts; no browser/build result is inferred from installation.

Passed on the exact source commit above:

| Command | Outcome / evidence |
| --- | --- |
| `node --test scripts/tokens.test.mjs` | 8 test groups passed, 0 failed/skipped; `/tmp/sgui-batch164-final-tests.log` |
| `node scripts/tokens.mjs --check` | Passed; `/tmp/sgui-batch164-final-tokens.log` |
| `pnpm exec tsc --noEmit --skipLibCheck --target es2022 src/foundation/tokens.generated.ts` | Generated-file types passed; `/tmp/sgui-batch164-final-types.log` |
| `node scripts/check-foundations.mjs` | Import/layer/token guards passed; `/tmp/sgui-batch164-final-foundations.log` |

Each command also retained `<log>.resources.json` with process settlement/resource
evidence. Regeneration passed before source commit. `git diff --check` passed.
Full production/source/story typechecking was not run; the TypeScript command above
is intentionally limited to generated token declarations.

Retained red intermediate evidence:

- `/tmp/sgui-batch164-generate.log`: new component `fieldRadius` collided with the
  existing shared variable. Renamed the new slot `fieldControlRadius`; collision
  rejection remains enforced and tested.
- `/tmp/sgui-batch164-tests.log`: two negative fixtures hit other valid rejection
  paths after adding semantic references. Paired-group validation now precedes
  resolution (preserving the old explicit unpaired-group assertion); the upward-tier
  fixture uses a noncyclic reference to isolate direction validation. No assertion
  was weakened. Final committed-source checks above are green.

Earlier passing logs (`tests-r2`, `types`, `foundations`) preceded final strict
role-alias authoring enforcement. Only final logs attest the tested source commit.

## Pending coordinated validation and follow-up cases

No heavy/full-suite check, build, packed-consumer run, Storybook build, browser/native
run, physical-device or assistive-technology check was performed. Request coordinator
review and an authorized checkpoint/consumer-wiring follow-up for native CSS behavior.
Concrete cases prepared as review scenarios here, **not executable native specs**:

1. Nested light/dark scopes: override local `--sgui-action` and `--sgui-danger`;
   compare actual computed primary/destructive slot backgrounds and error borders
   inside/outside the scope. Verify raised/overlay aliases and independent raised
   overrides. Switch theme while retaining the override.
2. Nested compact/comfortable scopes: actual button-height/padding alias probes track
   their local density variables; legacy component dimensions stay unchanged.
3. Emulated system preference: light-to-dark switching updates every declared role
   and component alias in actual computed styles without markup changes.
4. Provider portal: override semantic variables on the owner scope, open a real
   menu/dialog and inspect intended overlay/selected/hover/pressed/focus slot probes
   in the portal. Verify scope forwarding before claiming nested portal acceptance.
5. Once consumer wiring is separately authorized, review all variants/states in
   both densities/themes, enlarged text and forced colors. Do not infer AT output
   or validation behavior from these color/DOM checks.

These are dependencies for broader acceptance, not reasons to change consumers in
this batch. Native source/spec/stories must be owned in a coordinator-reserved scope.
No D-02/D-04 checkbox or other parent acceptance closure is claimed.

## Tested file SHA-256

| File | SHA-256 |
| --- | --- |
| `src/foundation/tokens.json` | `1b22596dbf77a1904ac1c01026089b55190fb417a2ab6e00ddddce9b636c1d94` |
| `src/foundation/tokens.css` | `fb01cc9285d81c8a66412fc1af5a1d9ab9e157b3a4346a067989fa11890e6196` |
| `src/foundation/tokens.generated.ts` | `45e07cc11684334d9ba3784562b8872bb4dcd9a66312d564b7b6d845b41c3d20` |
| `scripts/tokens.mjs` | `821917699a2f18876902e6bda1c310e0dc0f2daa2f08c98813af9fd682bbfca1` |
| `scripts/tokens.test.mjs` | `561b03d3d71dddd294067f3f01fb8f27f7a345286df8106f32be038c03136b59` |
| `docs/developer/react-aria-token-roles.md` | `9f952aa80baae50ea1741732828d2d660a5a190b683d2ef345d80b657ebe8de9` |
