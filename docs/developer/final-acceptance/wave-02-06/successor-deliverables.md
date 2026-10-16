# Concrete successor drafts and selections

These are reviewable report-owned drafts, not landed library/docs changes. The coordinator must allocate source ownership and validation separately. Preserve functionality-first priority, the 20 editor V leaves and required future production gates.

## W02-06-D13: action emphasis guidance draft

Suggested addition to button usage and linked action guidance:

> Use a filled primary Button for the one dominant confirmation or completion action in a form/dialog, such as Save or Confirm. Use outlined or text neutral actions for adjacent alternatives and ordinary toolbar commands. SplitAction keeps its neutral outlined group, shared divider and text primary command; it does not gain filled emphasis merely because its primary callback performs persistence. Keep action prominence separate from semantic text tones.

This defines contexts using shipped Button variants and SplitAction's actual fixed presentation. It invents no danger Button tone, automatic task priority or unsupported SplitAction variant prop. Validate the docs guidance/catalog links only for a prose-only edit.

## W02-06-D06: scale decisions requiring explicit reconciliation

Existing production contract: space1–4 are 0.25/0.5/0.75/1rem; compact/comfortable controls are 2/2.75rem with 0.5/1rem inline padding; focus width/offset share the owned scale; controlRadius and fieldRadius are separately customizable; Button's buttonRadius aliases controlRadius and Surface/Card use controlRadius. Overlay/popover layers and overlayShadow define depth. Default icons are 1em with owned 16/20px navigation policy; hosts may override native icon size.

Record the intentional decision that baseline Button and Card radii now share controlRadius, while fields remain independently adjustable. Name supported border weights (current common outline 1px and spinner 2px), icon/stroke levels, and short transition versus continuous-indicator durations. Current transition token is 120ms; Button spinner is 800ms; Progress is 1.2s. Do not silently change all durations to 120ms. Either introduce typed indicator/easing/border roles through the authored token pipeline with affected examples/tests, or document narrow intentional constants and why each is a separate semantic role. A prose assertion alone cannot make independently hardcoded durations a generated shared scale.

## W02-06-D15: applicable-state matrix to finish

| State | Existing concrete source indicator | Remaining deliverable |
| --- | --- | --- |
| Hover / pressed | Button data-hovered/data-pressed token background | Record applicable variants and aliases, including any deliberate equal hover/pressed values. |
| Focus | Token outline/data-focus-visible plus system Highlight | Account for decorated fields, menus, portal roots and clipping. |
| Selected | Menu check, selected item records; ToggleButton aria-pressed/system selected colors | Include selection controls, tabs, grids and calendar endpoints; distinguish selected from focus. |
| Disabled | Native/Aria disabled interaction, GrayText in forced colors | Verify every actionable descendant is blocked; incorporate coordinator BUG-0008 receipt. |
| Read-only | TextField readonly, read-only surface; host-authoritative values | Record how each control differs from disabled; do not inherit one generic policy to every API. |
| Invalid | Associated field error text and aria-invalid/native validation | Include deferred date-field feedback and explicit host invalid. |
| Pending | Named progress/spinner, suppressed activation | Distinguish loading data from an in-flight action. |
| Empty | Select empty description, collection empty content | Specify whether the trigger remains usable and how empty data is named. |
| Loading | Grid busy/status, collection loading content | Keep previous-data policy and pagination ownership explicit. |
| Error | Named field/operation alert and retry paths | Distinguish validation errors from failed host operations. |

Produce the final applicability matrix per public component/compound part, with N/A justification and exact source-backed example/tests. This is an acceptance matrix, not a demand for 282 new unit tests. Reuse existing cases; add only cases for real gaps. Global source/DOM inspection is not native or spoken AT output.

## W02-06-C08: containment completion map

| Composition | Owner / allocated width | Query / fallback | Current missing part |
| --- | --- | --- | --- |
| DataToolbar | Root named sgui-data-toolbar; external block/flex/grid width | Search 15rem → 10rem at content width ≤24rem; action wrapping | Existing toolbar-container-boundary.spec.ts execution on candidate host. |
| AppShell navigation | Root named sgui-app-shell; host definite/stretching width | Descendant layout stacks at ≤40rem; 100vh/100dvh base | Existing navigation-shell-container-boundary.spec.ts and third-column cases on candidate host. |
| AppModal | Portaled dialog named sgui-app-modal; dialog size/host surface style | Actions stack below 30rem; body/dialog scroll fallback | Existing modal-container-boundary.spec.ts candidate geometry/focus. |
| Card collection / ClassCardFrame | Parent allocation; grid auto-fill minmax(min(100%,22.5rem),1fr); frame maxInlineSize width | Fluid grid wrapping, no card size-query owner | Document Card/CardCollection containment choice; add meaningful local card descendant query if required, or obtain an explicit accepted alternative to the original query obligation. Do not add empty containment just to satisfy syntax. |

Source geometry is present for three classes of composition. Old batches 165/167/168 say their native cases were prepared, not passed. Current docs fixture ledger maps original scenarios; build/typecheck is not native geometry. Future authorized runs use the docs-owned fixture host, not Storybook, and preserve original assertions. Capture host/build hash and exact spec selection; reuse successful unchanged scopes when available.

## W02-06-C09: RTL reproduction and bounded fix selection

SideNavigation CSS has forward translateX(+1rem) and back translateX(-1rem) under both directions. Reproduce with identical drilled menus under Provider dir=ltr and dir=rtl, reduce-motion disabled, and inspect animation start transforms: sign remains unchanged. Directional icon glyphs already use mirrorInRtl and :dir(rtl); don't replace those with manual opposite icons.

Reserve SideNavigation CSS and its existing native fixture/spec for a sign policy (for example a direction variable switched by :dir(rtl)), retain reduced-motion animation:none, and verify forward/back interruption and Back focus on each direction. CSS source alone establishes the unmirrored sign, not actual perceptual usability. Keep physical x/y coordinates where they represent viewport geometry or pointer hit testing. Complete remaining editor V RTL leaves and portaled arrow/placement assertions separately before broad C09 closure.

## W02-06-C11: adopted nesting and support contract

The new in-memory probe proves installed PostCSS/CSS Modules scope parent and child and preserve native & nesting. It runs under Node 26.5.0; this is not the Node 22/24 production matrix. No maintained library stylesheet in the reused FA-02 file list currently contains native nested rules. There is no nesting polyfill/transpiler in css-modules.mjs.

For closure, document that nesting is preserved for the browser, choose the actual supported engine/version boundary (owner decision; none is supplied here), add one shallow owned production nesting case and a persistent positive/negative pipeline fixture, and verify emitted source ownership/specificity and the chosen engine boundary. Limit nesting to one level around a local component class; avoid deeply nested state selectors. Do not infer minimum browser versions from Playwright project names. A reference link to CSS nesting is not a support policy.

## W02-06-C12: fluid-sizing benefit assessment and native selection

Existing min()/max()/percent/Grid/Flex layouts already benefit dialog caps, card columns, toolbar wrapping and rem minimum control sizes. None requires viewport-sized typography. Keep all body/control typography role sizes in rem, unitless line heights, min-inline-size:0 and wrap/overflow fallbacks. clamp() can benefit a non-text gutter/panel cap if a concrete host geometry problem is shown; it is not required merely to add the spelling. Define a minimum based on rem content needs and a maximum that does not cap text growth. Keep Dialog body/whole-surface and calendar internal scrolling for content that cannot fit.

Reuse foundation-catalogue.spec.ts spacing root-size 1×/2× checks, modal-container-boundary enlarged tab-body cases, navigation-shell-container and card presentation specs. Host root-size scaling is not browser-chrome zoom. Missing gates are candidate-host affected-engine execution plus an operator-owned actual 200% zoom/320px reflow receipt where required. Existing batch104 historical Chromium slices remain dated; do not transfer them using only one CSS file hash.

## W02-06-D18/D20: native preferences and published foundations

Preserve the private FoundationCatalogue's six named scenarios and Typefaces fixture plus docs-fixture-migration mappings. Publish the equivalent useful foundation demonstrations in the public docs website using production imports and shared Example owners: palette/semantic map, typography roles, spacing, density, surface variants, focus traversal, motion/preferences. Existing theming inspector already covers palette/map/overrides; existing component pages cover typography/surface/density separately. Missing dedicated public spacing/focus/motion guidance is not fixed by private fixture availability. Omit fixture debug counters from public previews and keep copyable source aligned.

For reduced motion/forced colors, use existing foundation-catalogue and display-preferences specs to check actual computed transitions/animations, selected/focus/error/progress indicators under light/dark and both densities. Review exceptions individually: Progress and selected ToggleButton force system Highlight/HighlightText; color swatches preserve actual content color while selected outline is Highlight and action labels remain named. Never add forced-color-adjust:none for branding. Record native engine/build/input identity and separate browser emulation from an operator-controlled OS high-contrast/AT session. No device, AT or owner sign-off can be manufactured from this report.
