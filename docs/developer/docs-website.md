# Documentation website

The Next.js documentation application lives in apps/docs and consumes compiled
public exports from packages/ui. The website owns its framework routing and
Structured Growth identity. Library consumers require no Next.js dependency.

## Workspace and commands

Run from the repository root:

```sh
pnpm dev
pnpm build:docs
pnpm check:docs
pnpm test:docs
pnpm build:browser-docs
```

Library build precedes catalog generation and docs compilation. Use pnpm
build:watch in a second terminal during live library development. Direct library
scripts run from packages/ui. Never rebuild a host while a browser suite uses it.

## Component pages

The catalog is under /docs/components. General pages use /installation, /theming,
/releases and /licensing. Keep internal links canonical.

Every component page uses the Button template: independent bare overview, prop
playground, named examples, then linked Contains and Used In sections. DataGrid's
processing-grid page has the explicitly requested single-example exception.
Every live example uses Example. Each panel owns its interaction state and source;
controls must not alter siblings or fixed reference configurations. Copied source
uses public imports, valid host state/callbacks and safely serialized JSX strings.
Application-level theme setup belongs in installation/theming guidance.

Catalog metadata records all public components, aliases and compound children.
Generate prop metadata from fresh built declarations. Maintain component-specific
usage guidance under apps/docs/content/component-usage with Setup, Props,
Behavior and accessibility, and Host responsibilities. Composition metadata links
one level of documented children, with private helpers transparent.

The shell's right rail owns shared demo identity/appearance/contrast settings and
the page's combined Documentation panel. Density stays local to examples. The
fixed website identity applies to navigation, controls and source panels; demo
settings affect previews and their portals. Preserve native forced colors,
keyboard focus, stable system-preference subscriptions and accessible copy status.

## Navigation and layout

Group each component page once in component-navigation.json. Category menus use
sliding drilldown and keyboard-accessible Back controls. Search has an accessible
name and navigates directly to matching pages across categories.

Keep sidebar order: Overview, divider, search, component menus, divider,
Installation, Theming, Release history, Licenses. GitHub and commercial-license
information belong at the bottom. The website has no shell footer.

The header stays outside independently scrolling sidebar and main panes. Desktop
sidebar width is 17rem. Bound reading width and page padding inside the full-width
main scroll pane. Preserve native overlay scroll locking, stable document gutters,
keyboard access, narrow reflow and main-only route scroll reset.

## Native browser fixtures

The private host lives in apps/docs/native-fixtures and exercises the built public
package at /fixtures/?id=<fixture-id>. module-manifest.json lists current modules
and bounded private compiled aliases; registry files are generated from executable
fixture exports. No source-origin or historical migration manifest is needed.
Source-context unit fixtures stay colocated with their library implementations.

Run foundations:check, docs catalog:check, relevant unit/type checks and focused
browser checks for changed contracts. Validate displayed and copied snippets
against public package types. Preserve component assertions when updating host
fixtures. Browser emulation does not establish physical-device or screen-reader
acceptance. See [development validation](react-aria-development-validation.md),
[browser checks](react-aria-browser-acceptance.md) and [deployment](../deployment/amplify.md).
