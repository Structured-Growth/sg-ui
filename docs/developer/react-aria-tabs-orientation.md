# Owned Tabs orientation (U-09 partial)

`Tabs` from `/experimental` accepts an owned optional
`orientation: "horizontal" | "vertical"`, defaulting to `"horizontal"`.
Load `/styles.css` and provide `Provider` or `ThemeScope`. Existing selection,
activation, native root ref, className and style contracts are preserved.
AppPageTabs and catalog wrappers are unchanged.

Vertical Tabs places its tablist alongside the panel, stacks tabs vertically and
uses a logical inline-end selection border. Up/Down navigate enabled tabs with
wrapping; Home/End reach the enabled ends. Horizontal arrows continue to follow
the interaction locale, including RTL. Automatic activation selects on navigation;
manual activation moves focus first and requests selection on Enter/Space.
Controlled `value` stays authoritative until the host accepts `onValueChange`.

Constrain the root's `blockSize` for a bounded vertical scrollport. The tablist
reveals a focused tab by changing only its own vertical scroll position;
horizontal lists retain their own horizontal reveal, including negative RTL
scrollLeft. Panels scroll independently. Overflow and focus outlines use owned
tokens, so theme/density scopes apply without alternate story styling.

```tsx
import { Provider, Tabs } from "@structured-growth/sg-ui/experimental";
import "@structured-growth/sg-ui/styles.css";

<Provider><Tabs label="Course settings" orientation="vertical"
  activation="manual" style={{ blockSize: "12rem" }} items={[
    { id: "details", label: "Details", content: "Course details" },
    { id: "access", label: "Access", content: "Course access" },
  ]} /></Provider>;
```

[Batch170 evidence](parallel-batch-170/tabs-orientation.md) records the bounded
checks and prepared native cases. Broad U-09 and manual/device/assistive-technology
acceptance remain open; DOM focus assertions do not establish spoken output.
