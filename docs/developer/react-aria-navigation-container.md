# AppShell navigation containment

C-08, batch167 bounded implementation. Import `/styles.css` and provide `Provider`
or `ThemeScope`. See the [modal/shell contracts](react-aria-modal-shells.md) for
public props and host navigation adapters.

AppShell's outer `data-sgui-part="app-shell"` div owns the named
`sgui-app-shell` inline-size container. Its available width comes from the host,
not its navigation or main content. Supply a definite width or a stretching
block/flex/grid allocation; a shrink-to-fit host must not rely on the contained
children to establish intrinsic width. Inline-size containment does not contain
block size. The root still defaults to `100vh` with `100dvh` enhancement, and
native `style`/`className` can provide a host block size.

At a shell content width of 40rem or less, navigation stacks above main even in
a wide viewport. Wider shells keep a side rail. Each shell responds to its own
width independently. The existing 45dvh navigation cap remains viewport-relative;
collapsed navigation still fills the available inline width when stacked and
uses its compact rail width when wide. No mobile drawer behavior is introduced.

An internal flex wrapper is necessary because a container query cannot select
its own containment owner. Native root ref/className/style remain on the outer
div. The public `navigation` and `main` part hooks, mainId/mainLabel and semantic
main landmark remain available as descendants. They are now inside the internal
wrapper; host selectors requiring these parts to be immediate root children must
use descendant selectors. Treat the wrapper and generated CSS classes as internal.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AppShell, Provider, SideNavigation } from "@structured-growth/sg-ui";

<Provider>
  <div style={{ inlineSize: "24rem" }}>
    <AppShell style={{ blockSize: "32rem" }} mainId="course-workspace"
      mainLabel="Course workspace" navigation={<SideNavigation model={navigationModel} />}>
      {hostContent}
    </AppShell>
  </div>
</Provider>;
```

Main keeps its independent overflow region, minimum size constraints and
overscroll containment. Host resize does not remount main, reset host field
values or move focus. Navigation owns its separate internal scroll area.
CSS determines layout without viewport reads or mount-time width state; SSR
renders the same landmarks, root customization and wrapper as the client.

This deliberately changes responsive behavior for embedded narrow shells and
adds an internal DOM wrapper. It does not add props or change SideNavigation.
The [batch167 evidence](parallel-batch-167/navigation-shell-container-boundary.md)
records actual targeted checks and prepared native cases. C-08 and broad
native/device/assistive-technology acceptance remain open.
