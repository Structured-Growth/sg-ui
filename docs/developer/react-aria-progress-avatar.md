# Progress, status and avatar contracts

Task references: U-13, U-14, M-02, M-03.

Import the package stylesheet once and render these controls inside `ThemeScope`
or the owned `Provider`. Their CSS uses the shared light/dark tokens and
`sgui.components` layer. No runtime styling engine is required.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Avatar, Progress, Provider, Status } from "@structured-growth/sg-ui/experimental";

export function ImportSummary() {
  return <Provider>
    <Avatar alt="Ada Lovelace" src="/ada.png" fallback="AL" />
    <Progress label="Importing courses" value={3} maxValue={10} valueText="3 of 10 courses" />
    <Status announcement="polite">Import completed</Status>
  </Provider>;
}
```

## Progress and status

`Progress` requires `label`, `aria-label` or `aria-labelledby`. A visible `label`
is also the default accessible name. The host translates labels and `valueText`.
The native ref points to the progressbar's `div`.

Supply a finite `value` for determinate progress; it is clamped between
`minValue` (0 by default) and `maxValue` (100 by default). Omit `value` for loading
without a known total. Non-finite values are treated as indeterminate. Invalid
bounds fall back to a finite, increasing range. `variant` is `linear` by default
or `circular`; both distinguish loading from determinate values in accessibility
semantics. Loading animations stop when reduced motion is requested.

Progress changes do not create live-region announcements. Use `Status` for a
meaningful host message such as completion or failure. Its default
`announcement="off"` is quiet. Explicit `polite` uses an atomic status region;
`assertive` uses an atomic alert. Keep the region mounted before updating its
content. Avoid announcing each percentage update. `tone` supports `neutral` and
`danger`; the host supplies and translates message content. The native ref is a
`div`.

## Avatar

`Avatar` requires host-owned `alt`. An empty string makes the entire avatar
(including its fallback) decorative. A nonempty string names one image role on
the native `span` root, regardless of whether an image or fallback is displayed.
The nested image is decorative, preventing duplicate names.

The fallback remains visible while `src` loads and after an error. Changing `src`
starts a new loading state. No source displays the fallback immediately. The
caller supplies fallback content such as initials or a decorative owned icon.
The root keeps fixed, equal inline/block dimensions across image states; the
image uses `object-fit: cover`. Sizes are `small` (2rem), `medium` (2.5rem,
default) and `large` (3rem), based on the shared spacing token. Shapes are
`circle` (default) and `square`. Native `style` and `className` are escape hatches.

## Existing public progress components

`AppInlineProgress` preserves its public `value` and `barWidth` props. Values are
rounded and clamped to 0–100, with the visible percentage preserved. Non-finite
values now display 0% rather than invalid progress markup. Numeric bar widths
remain pixels; CSS string widths remain supported. The default bar is 3.75rem
(the previous theme's 60px at a 16px root). The progressbar gains a translated
accessible name through the existing translation adapter.

`AppOperationSteps` preserves its public `title`, `subtitle` and `steps` props and
all three status values (`pending`, `in_progress`, `completed`). It renders an
ordered list, gives each step translated status text, and uses the owned circular
loading indicator for active work. It creates no live region and no step-count
labels. Pending/completed icons are decorative. The completed check uses the
shared action token because the current foundation has no success token.

Use `/components/AppInlineProgress` or `/components/AppOperationSteps` for granular
imports that avoid resolving the unmigrated catalog and its peers.

These two migrated catalog components now require the compiled stylesheet and
foundation visual scope instead of MUI theme styling. They retain their existing
public names and exports. Unit tests cover semantics, updates, translation,
image load/error/source changes and server rendering. Browser checks verify native
image success/error events and 40px medium/48px large fallback boxes; full browser,
touch and assistive-technology coverage remains under X.
