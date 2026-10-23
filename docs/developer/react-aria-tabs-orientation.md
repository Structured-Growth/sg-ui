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

Batch170 evidence records the bounded
checks and prepared native cases. Broad U-09 and manual/device/assistive-technology
acceptance remain open; DOM focus assertions do not establish spoken output.

Tabs now paints one decorative, clipped indicator per strip instead of moving
independent selected-tab borders. Selection changes transition its position and
width/height through the owned motion-duration token. Horizontal strips animate
an underline; vertical strips animate the logical-end line (left in RTL). Panels
and selection callbacks update immediately. Manual focus alone does not move it,
and rejected controlled requests leave it on the accepted value.

Initial placement and geometry updates from resize/scrolling are immediate.
Observers follow tab sizes, labels, item changes, density and font layout; native
scroll offsets and the overflow menu's visible list bounds determine clipping.
Existing border indicators remain the SSR/unmeasured fallback. Reduced motion
removes transitions and forced colors uses Highlight. The line is aria-hidden,
adds no focus stops and never replaces native focus styling or panel semantics.

AppPageTabs controlled panels inherit Tabs; route navigation uses the same private
indicator implementation with its own component color alias. Hosts must keep route
strips mounted for transitions between route values; a fresh mount shows the
current indicator immediately. There is no new public motion prop.
