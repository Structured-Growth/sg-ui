# Ready-to-integrate documentation corrections

This is a reviewable payload for the coordinator, not an edit to the maintained guides. Commands below are future reproduction/validation instructions; none were executed in this wave. Exact supporting input hashes are in input-receipt.json. Integration must preserve existing historical evidence and production gates. Concurrent fix-02/fix-04/fix-06/fix-07 now supersede the action, dependency, Brush-mapping and read-only corrections below; reuse their maintained edits and reports. Do not reapply those sections. Concurrent fix-01/fix-03 also supersede token-schema and CSS-composition drafts; use their maintained guides and qualification of remaining Popover necessity. Only usage-direction/error-policy prose remains a review payload. No superseded section should be applied.

## A-A-19: replace dependency-upgrade operational references

Target: `docs/developer/react-aria-dependency-upgrades.md`.

Use `../../packages/ui/package.json` as the authoritative runtime dependency/peer/export manifest; use `../../pnpm-lock.yaml` for resolutions and peer contexts. Root package.json contains workspace tools and forwarding commands. React and React DOM remain peers `^18.3.1 || ^19.0.0`. Runtime reviewed inputs are react-aria-components 1.21.1, react-aria 3.52.1, react-stately 3.50.0, @internationalized/date 3.12.4; package-managed CSS/build/test tools stay development-only. Consumers need no extra interaction/date peer installation.

Review these interaction/date packages as a compatible family. Inspect the actual lockfile peer contexts and resolved date identity during an authorized upgrade. FA-02's one name/version node per dependency is a deduplicated graph observation, not proof of one physical singleton in every consumer. Do not force incompatible versions together with overrides. Preserve the existing frozen-install, license, owned-API, native/packed checks, saved-data rollback and exact tested-head requirements.

Replace active “stories” instructions with “docs examples, colocated source-context unit fixtures and docs-owned native scenarios.” Replace “static Storybook” with “docs-owned static native fixture host.” The root host build command is `pnpm build:browser-docs`; browser commands forward to the library. Run direct library scripts from `packages/ui`. The native test host consumes public compiled package exports: arrange a shared-output lease, build required inputs serially and never rebuild during a suite. Use `pnpm test:browser` with only the affected spec selection during ordinary development; retain the full production matrix before release. Next/Flight stay consumer-fixture inputs, not library runtime dependencies.

Replace `codex/dev` with `dev`. New development starts on dev and integrates there. Targeted development validation follows `react-aria-development-validation.md`; main promotion, tagging and publication need explicit human major/minor release approval. Do not edit versions manually. Keep the pending human security/maintenance owner decisions unchanged; these documentation corrections do not appoint an owner or approve an upgrade.

## A-D-01: replace stale token-tier/schema description

Target: `docs/developer/react-aria-token-roles.md`, Source tiers and integrity plus stale adoption statement.

`packages/ui/src/foundation/tokens.json` is the authored built-in token source. Its current compiler schema is SGUI-owned JSON using `$type`, `$value` and whole-value `{group.key}` aliases. It borrows the DTCG naming/reference convention; the current rem/ms/font/shadow/hex literal encodings are SGUI compiler encodings. It is not advertised as a general DTCG interchange document, and no particular external format revision or full interoperability is certified by these keys. If interoperability with a selected external DTCG revision is required, choose that target explicitly and add a conversion fixture/adapter before claiming conformance. This correction does not manufacture a standards approval.

Every one of these nine groups is required and nonempty:

| Group | Permitted alias targets | Emission |
| --- | --- | --- |
| base | none; literals only | Private source values |
| shared | base | Resolved literal roles |
| light, dark | base or same-theme group | Palette references resolve; same-theme references stay scoped variables |
| compact, comfortable | base, shared | Shared references stay variables; base resolves |
| pointer, touch | shared | Shared references stay variables |
| component | shared, light, compact, pointer, component | References stay variables |

Records require `$type` and `$value`. Extra metadata is not a validated interchange contract; it is not emitted. Names match `^[a-z][A-Za-z0-9]*$`. Supported resolved literal types are color (`#RRGGBB` or `#RRGGBBAA`), dimension (nonnegative decimal rem string), duration (integer ms string), number (finite JSON number), fontFamily (string without semicolon/braces/newline) and shadow (restricted four-field rem/rem/rem/#RRGGBBAA string). Alias types must match. Only base may contain literals; aliases must resolve without missing targets or cycles and follow the table. Light/dark are color groups, paired light/dark, compact/comfortable and pointer/touch have identical keys/types, and semantic same-theme alias topology matches across light/dark. Public camelCase-to-kebab variable names must not collide.

The canonical `light`, `compact`, `pointer` names in component references identify key sets, not forced runtime settings. Theme, density and interaction scopes rebind those variables. Public tiers include shared, semantic, density, interaction and component. Component styles consume component color aliases; the old pre-adoption statement is historical and should be removed from active guidance. Base deduplication is by type plus value; equal roles may intentionally have separate public names.

Run `pnpm tokens:generate` after an authorized source edit and `pnpm tokens:check` to check generated output. Direct script: from packages/ui, `node scripts/tokens.mjs --check`; do not hand-edit generated CSS/TS. This payload was derived from the current compiler; token generation/tests were already covered in FA-04 and were not rerun for this prose.

## A-C-07: append stylesheet composition contract

Target: architecture/adoption styling guidance.

Import `@structured-growth/sg-ui/styles.css` once before using scoped controls. It declares `sgui.tokens` before `sgui.components`; it includes theme, density and interaction variables plus compiled component CSS. There is no SGUI utilities stylesheet and no required global reset. The host owns any reset, fonts and body background.

For a host that uses cascade layers, declare its order before loading styles, for example:

```css
@layer host.reset, sgui.tokens, sgui.components, host.utilities, host.overrides;
```

Put optional reset in host.reset, utilities in host.utilities and deliberate component overrides in host.overrides. Normal unlayered host declarations outrank normal layered declarations regardless of selector specificity. Later named layers win for normal declarations; important layer order reverses and important declarations beat normal ones. Prefer scoped token variables, supported class/style props or documented data-sgui-part hooks over generated CSS Module names and specificity escalation. Host inline styles do not become inherited portal layout styles.

Current important exception: Popover alternate presentations must override anchored inline geometry supplied by useOverlayPosition. Dialog declares important position/inset/max-block-size; drawer and narrow auto declare important position/inset/inline-size/max-inline-size/max-block-size (13 declarations total across those selectors). These are presentation-geometry locks, not branding overrides. Theme tokens and normal content styles remain the supported extension path. An ordinary host utility cannot override these important geometry declarations. Keep this exception explicit; do not spread routine important rules to controls. The coordinator must review whether each lock is still needed, or separately omit inappropriate anchored styles before removing locks and validating resize/reopen behavior. This payload explains current behavior; it does not establish native necessity for all 13 declarations.

## A-A-07: replace stale ContentEditorChrome paragraph and add notifications

Target: `docs/developer/react-aria-button.md`.

ContentEditorChrome uses the owned Button. Its composition callback is `onPress(anchor: HTMLButtonElement)` and obtains the anchor through its native ref; it does not forward a MouseEvent. Use that anchor for positioning/focus and do not read event.currentTarget. Button itself exposes parameterless onPress for pointer, Enter/Space and touch. Ordinary actions bind React Aria press once; submit/reset use the owned native form path, which invokes onPress once before the browser form default. Do not independently attach native click and press to perform the same action.

ToggleButton's onSelectedChange reports the requested boolean selection; onPress reports activation. Supplying both intentionally invokes two distinct notifications, each once. Link remains a native cancellable click contract: host onClick runs before eligible navigation. Custom host Link implementations own native modifier/target/download behavior, ref/attribute forwarding and cancellation. ContentEditorChrome's anchor parameter and Link's event are explicit composition exceptions, not additional Button callback payloads.

Read-only Select and picker triggers currently use native disabled to prevent opening. Their readonly selected form value remains submitted; they do not share a text input's focus/copy behavior. Generic “read-only permits focus” prose must identify this exception or deliberately change and test the implementation. Do not infer universal readOnly/loading props on actions that do not declare them.

## A-I-05 / A-I-08: concrete icon mapping and usage direction policy

Targets: icon-map.json, complete symbol mapping table, icon guidance.

Add this missing mapping alongside the existing 95 original symbols: `BrushIcon` uses Lucide `Paintbrush`. The wrapper, gallery and public routes already exist; no asset replacement is proposed. Preserve the Lucide ISC and Feather MIT attribution text already present in both equal notices. Mapping metadata correction does not constitute legal-owner approval of every asset.

Default mirror set: ArrowForward, ChevronRight, KeyboardArrowLeft, Logout, FormatIndentDecrease, FormatIndentIncrease, Undo and Redo. The shared factory defaults size=1em, strokeWidth=2, currentColor and fill=none. Use 16px leading control icons, 20px navigation icons, and explicit sizes only for documented contexts. Named icon paths select glyphs; their physical-looking names alone do not determine layout meaning.

| Usage | Mirroring policy |
| --- | --- |
| Logical forward/back, enter/exit navigation | Inherit default RTL mirror; explicit override only for physical semantics |
| Logical indentation, undo/redo controls | Use owned defaults in the direction of the editing context |
| Physical left/right alignment, fixed spatial/geographic arrows | Preserve physical meaning with mirrorInRtl=false when a default-mirrored glyph is reused |
| Media/time/data meaning or nondirectional status glyph | No automatic semantic reversal; host deliberately selects appropriate glyph |
| Host-provided icon ReactNode | Host owns meaning, dimensions, direction and naming |

A containing IconButton needs its own translated label; tooltip is supplementary description. Decorative slot glyphs remain hidden. Standalone informative icon uses a nonempty label. This table is ready for contract review, but actual 16/20/24px optical, computed RTL transform and named contrast-pair/forced-color acceptance still need recorded rendered evidence.

## A-H-05: safe host diagnostic pattern

Target: host-adapter usage guidance/examples. SideNavigation shows translated generic operation errors and catches rejections; the host must retain useful diagnostics before rejection if it needs reporting. Example wrapper:

```ts
async function logoutAccount(sessionId: string) {
  try {
    await hostLogout(sessionId);
  } catch (cause: unknown) {
    retainHostDiagnostic({ operation: "logoutAccount", cause });
    throw cause;
  }
}
```

`hostLogout` and `retainHostDiagnostic` are explicit host integration functions, not SGUI exports. Diagnostic storage/redaction and permissions belong to the host; never stringify arbitrary payloads to a public console by default. Apply the same wrapper to logoutAllAccounts/onOrganizationChange where needed. The adapter preserves the original rejection identity; SideNavigation's generic alert is not a diagnostic transport. A rejecting host wrapper is called once per admitted operation, retains cause once, then enables explicit retry; obsolete session results must not navigate or mutate the replacement owner. This proposed host policy needs focused integration assertions before closing the full error-handling obligation.
