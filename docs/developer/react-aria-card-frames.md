# Owned course card frames

Task references: M-13, M-14, M-15. Public Class-prefixed names and presentation
props remain available. Import `@structured-growth/sg-ui/styles.css` once and wrap
cards in the owned `Provider` or `ThemeScope`. The legacy MUI theme no longer
styles these cards. This integration change and removal of frame `sx` slots need
a breaking release marker.

`ClassCardFrame` uses an owned outlined Card, native content slots and generated
surface/divider/spacing tokens in the `sgui.components` CSS layer. Its standard
width constants remain 420 and 360 pixels; the default maximum width remains
420 pixels, while the frame can shrink to fit its container. The minimum constant
is available for host layout choices and is not imposed on narrow containers.
`width` still accepts a pixel number. Long card headings wrap within the header.

| Previous frame styling | Owned mapping |
| --- | --- |
| `headerSx` | `headerClassName`, `headerStyle` |
| `bodySx` | `bodyClassName`, `bodyStyle` |
| `footerSx` | `footerClassName`, `footerStyle` |
| Theme-dependent `sx` expressions/arrays | Consumer CSS using generated variables, or a native style object |

Root `className` and native `style` are also supported. Root `style` can override
the width. `data-sgui-part` hooks are `class-card-frame`, `class-card-header`,
`class-card-body` and `class-card-footer`. Native styles use CSS names and lengths
(for example `{ padding: 16 }`), without MUI shorthand or theme string resolution.
The footer remains optional and omitted for falsy content, preserving existing
render behavior.

`InstructorClassCard.className` remains the displayed course name, not a styling
class. Active/draft markers use the owned action token; archived uses muted text;
closed uses the default text token. The foundation does not yet define success or
warning tokens. Every state retains an explicit translated status label so color
is not its only indicator. Archived cards omit learner/activity metadata. Existing
known action/activity label mappings and custom host labels remain unchanged.
Interpolation values and namespace now reach the host translation adapter.

`LearnerClassCard` retains its due formatter, locale, `referenceNow`, destinations
and `onContinue`. Details uses `detailsHref`, falling back to `continueHref`;
without a destination it remains a button. Continue with a destination is a link
opening a new tab with `noopener noreferrer`, invoking `onContinue` once on click.
Without a destination the owned Button invokes `onContinue` once through normalized
press handling. Internal links use the existing host navigation adapter.

Progress gains the translated accessible name `card.progress` with default
message “Course progress”. Its progressbar and visible percentage both clamp to 0–100 and non-finite
values use 0. This corrects invalid percentages such as NaN% or 140%.
Course names use an `h3` with owned subtitle typography; sites/instructors,
metadata and decorative avatars/icons do not create extra interactive regions.
Hosts own data, labels, routing, persistence and account actions.

Colocated tests verify frame slots/widths, status branches, interpolation values,
keyboard link/button activation, destination fallback, callback count, isolated
new-tab links, progress semantics and server rendering. Native browser layout,
focus and navigation checks are part of the batch acceptance evidence; broader
cross-browser and assistive-technology checks remain under X.
