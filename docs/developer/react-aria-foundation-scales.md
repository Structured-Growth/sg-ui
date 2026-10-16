# Foundation geometry and motion scales

A-D-06 defines the production scale and its bounded exceptions. The authored
source is `packages/ui/src/foundation/tokens.json`. Theme colors still follow
identity palettes → semantic maps → component aliases → styles. This contract
preserves the existing geometry and Material-derived rounded control silhouette;
it does not replace it with a square or pill identity.

| Role | Current value / ownership | Use |
| --- | --- | --- |
| Spacing | `space1`–`space4`: .25, .5, .75, 1rem | Box padding, Stack gaps and component spacing; zero omits spacing. |
| Control sizing | Compact 2rem / comfortable 2.75rem; inline padding .5 / 1rem | Minimums grow with content; touch floor is 2.75rem, independently of density. |
| Text | Shared typography/control roles | Never shrink body/headings to obtain compact controls. |
| Control radius | `controlRadius`: .625rem (10px at the default root) | Button's `buttonRadius` aliases this role; Surface and therefore Card share it. This is the intentional reconciliation of the former independent Button/Card radii. |
| Field radius | `fieldRadius`: .375rem (6px at the default root) | Text inputs, Select, selection controls and field-derived controls remain independently customizable. A field is not a primary action. |
| Popup option inset | Popup radius less its padding and border, bounded at zero | Menus/options remain inside the outer contour; do not copy the outer radius onto every nested part. |
| Focus | `focusWidth`, `focusOffset`: .125rem each | Visible outer ring; focused descendants of scrollports need room for both. Selected indicators must remain separate from focus. |
| Outline / separator | Local 1px solid CSS border | Intentional device-pixel hairline, including joined ButtonGroup outline and divider. There is no public generated border-width token. Do not describe this constant as one. |
| Spinner stroke | Local 2px `currentColor` border | Small Button pending indicator needs a heavier contour than a hairline; local implementation geometry, not a focus width. |
| Circular progress stroke | Local 3 SVG user units | Scales within the progress SVG viewBox; not 3 CSS pixels and not interchangeable with icon stroke. |
| Icons | Default 1em, strokeWidth 2 SVG user units; native size/strokeWidth overrides | Decorative action icons inherit text color. Navigation uses generated pointer 1rem / touch 1.25rem size roles. SVG artwork coordinates and explicit icon sizes remain content geometry. |
| Elevation | Flat has none; outlined has the 1px border; raised uses `overlayShadow` | Default shadow `0rem 1rem 3rem #00000040`. Forced colors restore a visible border for raised surfaces. |
| Overlay layers | `overlayLayer` 1400; `popoverLayer` 1410 | Overlay stacking, not arbitrary component z-index escalation. |
| Short transition | `motionDuration`: 120ms | Brief state feedback. Button background transitions use CSS's default `ease`; this is not continuous progress timing. |
| Pending action rotation | Local 800ms `linear` infinite | Button spinner. Deliberately faster small action feedback; stopped under reduced motion while retaining the named progress indicator. |
| Indeterminate progress | Local 1.2s; circular `linear`, bar `ease-in-out` alternate | Deliberately slower ongoing-operation indicator. Reduced motion stops rotation and uses a static full bar. Determinate progress remains value-driven. |

The 1px, 2px, SVG stroke and continuous-motion values above are narrow supported
implementation exceptions, not generated theme overrides or a claim of an
all-component motion inventory. Preserve those timings rather than applying the
120ms transition duration to continuous progress. Explicit scope geometry overrides
are allowed, but a newly reusable scale role belongs in authored tokens with a
type, reference and affected component aliases before it is consumed. Regenerate
with the existing token generator and validate token graph, output and affected
consumers; never edit generated CSS/TypeScript by hand. No token bytes need to
change for this documented reconciliation.

Button primary fill intentionally uses the same background for hover and press.
Outlined/text and neutral actions use the subtle interaction background for both;
the neutral filled press selector must be present alongside its hover selector.
Press is temporary activation, distinct from persistent selection. Native/Aria
semantics and focus indicators remain required when state colors converge.

Sources: `components/Button/Button.module.css`,
`experimental/Surface/Surface.module.css`, `experimental/Card/Card.tsx`,
`experimental/ButtonGroup/ButtonGroup.module.css`,
`experimental/Progress/Progress.module.css`, and
`experimental/icons/createVector.tsx`, all relative to `packages/ui/src`.
See [theme scope and density](react-aria-theme.md) and
[action emphasis](react-aria-layout-actions.md) for host usage.
