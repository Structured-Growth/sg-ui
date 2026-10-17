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

The frame owns the named `sgui-class-card` inline-size query boundary. The host
allocates its width through a block, a flex item with `min-inline-size: 0`, or a
`minmax(0, 1fr)` grid track. The frame fills that allocation up to its maximum;
inline-size containment does not derive an intrinsic width from slot content, so
an intrinsically sized/shrink-to-fit host must supply a width. Below 20rem of card
content width, owned header/body padding changes from space4 to space3. Footer
padding and host-provided slot layout remain unchanged. Resizing one card does
not choose the spacing of a sibling. Native slot styles can override this padding.

`CardCollectionWithFooter` keeps its fluid `auto-fill`/`minmax` grid; the collection
allocates tracks and each ClassCardFrame adapts its own slots. Generic Card is a
surface primitive and does not add containment to arbitrary consumer layouts.
Toolbar, navigation-shell and modal query boundaries remain documented in
[toolbar](react-aria-data-toolbar.md), [navigation](react-aria-navigation-container.md)
and [modal](react-aria-modal-container.md) contracts.

Text roles use rem-backed tokens; the card maximum is a compatibility pixel prop,
not a fixed text size. The rem query threshold follows root text enlargement.
Keep mobile layouts shrinkable and allow long labels to wrap. Do not add a
viewport-only font-size clamp: there is no demonstrated benefit over the owned
rem scale, and it can defeat text enlargement. Existing `min(100%, ...)` overlay
widths and the fluid collection grid provide the useful fluid sizing. At short
heights retain independent tab-panel scrolling and the whole-dialog fallback.
Browser zoom must be validated using browser controls; root font-size overrides
and a 320 CSS-pixel viewport are separate reflow checks.

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
The adapter returns final formatted text; cards render it once. Host activity
labels may contain literal braces or dollar signs, which are retained as text
rather than interpreted again as placeholders or replacement patterns.

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

## Original card-scope attribution

The initial extracted InstructorClassCard already exposed `status`, one
`actionHref`/`actionLabel`, and host-formatted `lastLearnerActivityLabel`. Its seven
prop names remain unchanged. Routing callbacks belong to the Link adapter; the
card has no menu or persistence callback, date parser, or external icon/image
input. Fixed icons are decorative and the avatar supplies its fallback. For a
menu-bearing composition, compose the public Menu with ClassCardFrame in the host
rather than passing unsupported props into this card.

The original LearnerClassCard also exposed the same nine current prop names:
progress, next activity, due-date/reference inputs, destinations and `onContinue`.
Its status presentation is progress/due text; neither original nor current API
contains a separate lifecycle-status prop. The owned migration preserves these
boundaries and adds named/clamped progress and tested due-format fallbacks.
The [source comparison](final-acceptance/wave-04/coordinator/reviewed/card-source-scope.json)
records the immutable extraction commit, exact source hashes and prop-name lists.
This resolves generic checklist wording against the actual extracted contracts;
it is not a new feature approval or a claim about spoken screen-reader output.
