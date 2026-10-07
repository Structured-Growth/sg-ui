# Read-only host adoption checklist

Task reference: W-15, with W-11–W-14/W-18 integration guidance. This checklist is a
review aid for the learner platform or another host. It does not authorize editing
that application, changing routes/data contracts or removing its original UI tree.
A host rollout is a separate implementation task after version/license selection.

## Review before an implementation task

- [ ] Confirm the written commercial agreement, available package version or validated
  tarball, React/React DOM 18.3.1 or 19 peer compatibility and Node >=22.12.0.
- [ ] Inventory host `@ui`/upstream imports, prop bags, theme objects, direct icon/primitive
  usage and private internals. Match each use to a declared public export and the
  [consumer mapping](../migration.md#consumer-migration-mappings). Preserved names do
  not preserve removed props; do not redirect aliases without reviewing call sites.
- [ ] Plan one global `/styles.css` import and owned Provider scopes. Identify overlays,
  nested scopes, host resets/backgrounds/font loading and CSS overrides. Keep reusable
  styles in tokens/shared styles; use declared native slots/parts for context layout.
- [ ] Map routing/pathname/replace through SGNavigationProvider, translations and locale
  through SGTranslationProvider, and account operations through SGAccountProvider.
  Keep application APIs, credentials, session policy and post-account navigation in
  the host. Adapters do not grant data access or enforce application authorization.
- [ ] Identify controlled values and accept requested changes atomically where needed.
  Grid shell/list/cards/footer share one state owner and stable IDs. Server criteria
  snapshots drive host requests; host owns stale-response cancellation, loading/errors,
  selection reconciliation, reorder persistence/rollback and distinct storage keys.
- [ ] Choose explicit opt-in persistence and review restored state/schema/reset behavior.
  Controlled state wins; view identity changes may require remounting. Preserve
  hydration loading behavior rather than reading browser storage during server render.
- [ ] Map editor save/upload/document reset/read-only behavior. Host uploads must supply
  durable approved URLs; temporary local previews are not durable assets. Host owns
  network abort, byte/size/asset authorization and cleanup. Validate current editor
  contract acceptance limits before exposing untrusted content.
- [ ] Review form semantics: explicit submit/reset, required names/labels, string/boolean
  value callbacks, uncontrolled native reset and host validation. Read-only permits
  focus/copy; disabled blocks editing/activation. Avoid duplicate click/press handling.
- [ ] Review date-only versus local datetime/time/instant semantics. Supply valid ISO
  values and explicit host timezone/DST choices; do not infer booking permissions or
  organization fiscal calendars from a date widget. Calendar controls remain proof
  contracts under `/experimental`; check their acceptance limits before adoption.
- [ ] Plan representative light/dark/system, density, locale/RTL, narrow layout, text
  enlargement, keyboard/focus and native clipboard/download checks. Test actual
  devices, IME and assistive technology where required; DOM/browser emulation alone
  does not certify them. Retain loading/empty/error states and full accessible text.
- [ ] Keep original source until a separately authorized rollout establishes parity,
  license/notice requirements and recovery. Record deferred features and unsupported
  old props instead of silently reproducing them in host styling.

## Vite host composition

At the Vite application's entry, load the production CSS once and mount a scope.
These imports are declared package exports; no CSS Modules configuration or extra
interaction-foundation peers are needed in the host.

```tsx
// src/main.tsx in the consuming application
import { createRoot } from "react-dom/client";
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/theme";
import { AppButton } from "@structured-growth/sg-ui/components/AppButton";

function App() {
  return <Provider theme="system" density="comfortable">
    <AppButton onPress={() => console.log("Save requested")}>Save</AppButton>
  </Provider>;
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
```

Without adapters, translations fall back to English and navigation uses native
anchors. With a host translation engine, place SGTranslationProvider outside
Provider so its `value.locale` drives interaction locale. Its `t` implementation
receives key and options including defaultMessage/namespace/values; its
`useNamespace` connects host namespace loading. Hosts own supported locales,
fallback ordering, caching and diagnostics. Provider's optional dir override sets
visual direction; a matching host locale normally supplies interaction direction.

## Next.js App Router host composition

Import CSS once in the host root layout. Scope/context providers and interactive
callbacks belong in a host Client Component. Eligible presentation children can
be rendered by the server and passed through that boundary. SGUI itself has no
Next.js runtime dependency.

```tsx
// app/layout.tsx in the consuming application
import type { ReactNode } from "react";
import "@structured-growth/sg-ui/styles.css";
import { UIProviders } from "./ui-providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><UIProviders>{children}</UIProviders></body></html>;
}
```

```tsx
// app/ui-providers.tsx in the consuming application
"use client";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider } from "@structured-growth/sg-ui/theme";
import { SGNavigationProvider } from "@structured-growth/sg-ui/adapters";

export function UIProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return <SGNavigationProvider value={{
    pathname,
    navigate: (href, options) => options?.replace
      ? router.replace(href) : router.push(href),
  }}><Provider theme="system">{children}</Provider></SGNavigationProvider>;
}
```

```tsx
// app/save-action.tsx in the consuming application
"use client";
import { AppButton } from "@structured-growth/sg-ui/components/AppButton";

export function SaveAction({ onSave }: { onSave: () => void }) {
  return <AppButton onPress={onSave}>Save</AppButton>;
}
```

The parent supplying onSave must also be a Client Component; ordinary functions
cannot cross the server serialization boundary. Root/barrel imports do not create
blanket client boundaries. Prefer declared granular paths and follow
[server/client packaging](react-aria-server-components.md) for eligible modules and
packed Vite/Next/Flight evidence. Examples here are source-checked integration
patterns, not evidence that a particular host application was changed or executed.

## Styling and acceptance review

Use `/tokens` for generated variable names and native style/CSS variables for
explicit scope overrides, for example `tokens.space3` is `var(--sgui-space3)`.
Layers are sgui.tokens then sgui.components; normal
unlayered host CSS wins. Use documented data-sgui-part hooks rather than generated
CSS class names. Separate Typography's visual variant from semantic heading level;
name icon-only controls and use icon label only for meaningful standalone images.
See [theme](react-aria-theme.md), [icons](react-aria-icons.md) and
[primitives](react-aria-primitives.md) for exact supported props.

Before rollout, record parity evidence, accepted public breaking mappings and
remaining gates. True grid pinning, spreadsheet capabilities, scheduling/recurrence,
physical long-press drag, full screen-reader output and broader rich-content trust
are not established by this checklist. Review [calendar limits](react-aria-calendar-contracts.md),
[editor contracts](react-aria-editor-section.md), [reorder](react-aria-grid-reorder.md)
and [browser acceptance](react-aria-browser-acceptance.md). Library check/build,
packed fixture and Storybook evidence do not replace host regression checks.
