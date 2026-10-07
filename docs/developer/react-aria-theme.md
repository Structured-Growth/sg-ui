# Public theme and production Storybook scopes

Task references: W-09, A-15 (theme mapping), Z-01–Z-03 (implementation removal;
final historical/literal audit remains open). Public `/theme` and root exports
now expose `Provider`, `ThemeScope`, `AppThemeProvider` and their owned types.
`AppThemeProvider` is the same component as Provider under its preserved name.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AppThemeProvider, ThemeScope } from "@structured-growth/sg-ui/theme";

<AppThemeProvider theme="system" density="comfortable">
  <ThemeScope theme="dark" density="compact" style={{ "--sgui-focus": "#a78bfa" }}>
    Content
  </ThemeScope>
</AppThemeProvider>;
```

The stylesheet must be loaded once. Settings default to light/comfortable;
nested scopes inherit unspecified settings. `system` uses CSS media queries,
so server and initial client markup stay stable without browser reads. ThemeScope
accepts native div attributes/style/ref. Provider additionally bridges the host
`SGTranslationProvider` locale to interaction locale and scope language/direction.
Its optional `dir="ltr|rtl"` overrides visual layout direction; interaction locale
continues to follow the host locale. Set a matching host locale for normal use;
the direction override also supports independent layout testing.

Portals inherit theme, density, language, direction and custom `--sgui-*` variables;
layout styles such as padding remain at the source root. There is no global CSS
baseline or runtime stylesheet injection. Applications own body/background/font
loading and any reset they require.

| Removed API | Owned mapping |
| --- | --- |
| `theme`, `lightTheme`, `darkTheme`, upstream ThemeProvider/theme objects | theme setting on Provider/ThemeScope |
| palette/typography/component override objects | generated `/tokens`, CSS variables and documented component parts |
| upstream typography augmentation | owned Typography roles, including `bodyAlt2` |
| global baseline installed by AppThemeProvider | host-owned global styles; scoped library normalization |

Storybook imports production tokens and uses the public Provider. Toolbar globals
control light/dark/system, compact/comfortable, representative en-US/fr-FR/ar-EG
locales and auto/ltr/rtl layout direction. These story locales are test examples,
not a library supported-locale policy. Translation fallback uses the same ICU
formatter and locale adapter as consumers. Stories may intentionally demonstrate
nested explicit settings, which override outer globals as production scopes do.

The retired runtime, peer and development packages were removed after source
imports and augmentation consumers were eliminated. Packed checks must confirm
React 18.3/19 consumers install without those peers. This closes dependency
removal, not full accessibility, screen-reader, browser, performance or final
historical-reference acceptance.

See the [classified removal audit](react-aria-removal-audit.md) for source/output
guards, reconciled extraction destinations and remaining historical/legal text.
