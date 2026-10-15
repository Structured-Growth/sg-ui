# Structured Growth website color guide

This is SGUI's proposed website treatment, implemented in its app-owned
`structured-growth` identity. It is not a claim that the reference sites publish
this combined palette as an official brand standard. Research date: 2026-10-14.

## Reference evidence

The live [Structured Growth website](https://www.structured-growth.com/) and its
inline SVG logo use deep navy and gold. The inspected logo contains `#0b233e`
and `#c5962c`; rendered body text is `#0b233f` and some link styles use `#c7972c`.
Use the logo's pair as the consistent starting point. No separate public brand
manual was located in the focused search; these are observed website values.

[Notre Dame's academic color guide](https://onmessage.nd.edu/university-branding/colors/)
publishes primary navy `#0c2340` and metallic gold `#ae9142`, plus medium blue
`#143865`, dark gold `#8c7535`, warm white `#efe9d9` and light warm white
`#f8f4ec`. It supports the navy/gold direction without replacing Structured
Growth's own logo colors or importing Notre Dame marks or other brand assets.

The earlier cream treatment drew on Anthropic's surfaces. The owner's October 15,
2026 Figma sidebar reference supersedes that direction: use neutral surfaces,
tighter corners, regular-weight labels and a consistent leading icon column.

## Applied palette

| Role | Color | Use |
| --- | --- | --- |
| Navy | `#0b233e` | Headings, normal text, links and primary actions |
| Medium blue | `#143865` | Action hover |
| Brand gold | `#c5962c` | Thin header accent and pressed neutral surfaces |
| Accessible dark gold | `#8c7535` | Focus and functional accents on light surfaces |
| White | `#ffffff` | Canvas, sidebar, raised surfaces and overlays |
| Cool gray | `#f5f6f8` | Subdued panels, search and code surfaces |
| Hover gray | `#edf0f4` | Navigation/link hover |
| Pale blue | `#e8f0fa` | Selected backgrounds with navy text |
| Muted ink | `#526071` | Secondary text |
| Control border | `#788494` | Visible control outlines |
| Soft border | `#dce1e8` | Decorative dividers |

White surfaces occupy most of the page. Navy supplies the information hierarchy;
gold stays a restrained brand accent. Bright gold is unsuitable for small text
or sole focus rings on light surfaces; use accessible dark gold for those roles.
Links and navigation use background hover feedback and visible keyboard focus.
Current navigation rows use pale blue without a heavy side border or bold label.

The website's desktop menu uses 6px corners, 32px minimum rows, 16px leading
icons, 8px icon-to-label gaps and regular 12px labels. Navigation has a distinct
compact scale; body text, headings and form controls keep their existing sizes.
Touch-capable devices retain 44px minimum rows and search targets. Category disclosure chevrons
stay at the trailing edge. Search has a leading icon and a cool-gray fill.
The sidebar remains square, 17rem wide on desktop, with 8px outer gutters and
edge-to-edge dividers. The header is a compact application toolbar: 14px brand
label, 32px version picker, a thin gold keyline and an accessible visually hidden
picker label. Main content padding is 16–32px rather than a large website inset.

Reusable SideNavigation owns vertical alignment, consistent icon sizing, row gaps,
and density-aware minimum row height (32px compact, 36px comfortable; 44px on touch devices). Selection and hover have separate component
color aliases, so consumer themes control their colors without local overrides.
Icons remain host-supplied; the docs menu uses the existing public SGUI icons.

Dark maps retain deep navy surfaces, cool light text and lighter gold actions/focus.
The fixed website remains light; dark/increased maps stay complete for identity
resolution. Increased contrast uses white/navy backgrounds with stronger text and
controls. OS forced colors replace brand colors. Other demo identities and the
library's shipped default palette are unchanged.

## Implementation and verification

Named colors live in `apps/docs/theme/palettes.ts`; complete semantic mappings
live in `theme-graph.ts`. Website styles consume semantic roles, and public
component aliases resolve through the existing foundation. The SideNavigation hover/selection aliases are declared in the public token source
and regenerated; generated token output is never hand-edited.

Existing graph tests check complete maps, text/control/focus contrast, increased
contrast and forced colors. Added named selected/hover/pressed pairs to those
checks. The docs browser checks verify the fixed navy shell remains independent
of demo settings, including overlays. Exact validation evidence is recorded in
[the website execution record](docs-website.md).


The website’s right tools rail uses the same compact navigation scale: 16px icons,
32px buttons, a 40px rail and 12px panel headings/control labels. It has its own
compact ThemeScope so dropdowns/tooltips inherit the same policy. Touch sizing
uses 44px targets and 20px icons (52px rail). Responsive overlay offsets are
derived from that rail width rather than a fixed desktop dimension.
