# AppModal local surface containment

Task reference: C-08, bounded batch168. See the [modal/shell contracts](react-aria-modal-shells.md)
for dismissal, focus, sizing and style slots, and the [batch evidence](parallel-batch-168/modal-container-boundary.md)
for validation limits. This slice does not close C-08 or broad acceptance.

AppModal merges its owned root class with the consumer `className` on the existing
native dialog element. That element has named `sgui-app-modal` inline-size
containment. Dialog still supplies the containing surface's actual inline size:
its size preset or AppModal's `width` and native `style` passed through
`surfaceStyle`. Explicit width remains limited by the existing viewport maximum;
native host styles retain their precedence. Containment adds no width, height,
overlay or portal overrides. Import `/styles.css` and provide Provider or ThemeScope.

The dialog portals out of the opener's ordinary host layout. A container around an
opener does not automatically contain the portaled dialog. Each AppModal measures
its own dialog surface independently, including when different dialogs are opened
sequentially. The `ContainerBoundary` story demonstrates independent 360px and
800px surfaces in a wide viewport and a live width toggle without remounting.
These are portaled dialogs, not dialogs embedded in an ordinary host column.

Below a local inline size of 30rem, the footer stacks its step label before the
actions, and direct action children occupy full rows. Action wrapping remains
enabled; step/body text can break long words and the body can shrink inline.
The relative threshold follows enlarged root text. At wider sizes, the existing
wrapping row arrangement remains. Custom `footerContent` uses the same direct-child
arrangement; a consumer wrapper continues to own its internal content layout.
No labels, callback order, disabled/loading states or public props change.

The existing dialog header/footer, multi-step visibility, initial focus and return
focus remain with Dialog. Height presets and explicit height still bound the
surface. A tabbed body retains its minimum usable scrollport and independently
scrolling selected panel; when enlarged chrome cannot fit, the whole dialog can
scroll. The container query does not introduce a second scroll owner or make
dialog chrome fixed. Browser cases prepare native width, geometry, keyboard,
sticky-tab/panel and whole-dialog scrolling checks; results must come from a fresh
coordinated build. No editor-dialog ownership or device/assistive-technology
acceptance is inferred.
