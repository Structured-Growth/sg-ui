# Button owned action contract

Task M-01. Button is the sole public action component and owns its interaction implementation. It forwards a native HTMLButtonElement ref and selectively chosen
native form and accessibility attributes. Load `/styles.css` and provide Provider
or ThemeScope, including around mixed legacy editor compositions.

This is a breaking contract change from the extracted MUI wrapper:

| Previous prop | Owned mapping |
| --- | --- |
| variant="contained" | variant="filled" (default) |
| variant="outlined" / "text" | Same names |
| color="primary" | tone="primary" (default) |
| color="inherit" | tone="neutral" |
| size="small" | density="compact" |
| size="medium" / "large" | density="comfortable", or inherit the scope density |
| onClick(event) | onPress() for one normalized pointer/keyboard/touch activation |
| sx and styling callbacks | className, native style, documented button part hooks and scoped tokens |
| href / component | Owned Link with the host routing adapter |

Other upstream props/colors are removed; do not forward arbitrary upstream objects.
Loading suppresses activation, retains focus and exposes translated Pending progress.
Disabled blocks activation and focus. Buttons default to type="button"; submit and
reset are explicit. Start/end icon slots are decorative; icon-only content must
have an accessible name supplied by the host.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/experimental";
import { Button } from "@structured-growth/sg-ui/components/Button";

<Provider>
  <Button variant="outlined" tone="neutral" density="compact"
    onPress={() => saveCourse()}>Save</Button>
</Provider>;
```

Existing editor menu compositions obtain their anchor through a native ref instead
of a press event. Host callbacks elsewhere in the library remain host-owned; their
contracts are not automatically converted by this action migration.

ContentEditorChrome continues to use its legacy button internally for its existing
MouseEvent-based menu callback contract, which can supply an anchor to the host.
That composition remains unmigrated; its later migration must explicitly map this
contract. Other Button consumers use the owned action API in this batch.

## Native form activation ordering

Pending reset buttons suppress the native reset default. Submit/reset buttons
deliver the owned `onPress` once from native click capture, before the form default
action; ordinary buttons retain React Aria press handling. Pointer, Enter and Space
ordering and current host callbacks are covered by [focused button evidence](parallel-batch-13/control-button.md).
The corrected frozen commit passed both Chromium/WebKit cases. Firefox, physical
touch and spoken assistive-technology acceptance remain separate.


## Unreleased API consolidation

Before the first release, AppButton and AppButtonProps were removed. Use Button
and ButtonProps from the package root, `/components`, or `/components/Button`.
The primitives and experimental entry points re-export this same implementation;
there is no AppButton compatibility alias. The canonical documentation route is
`/docs/components/button`; the former `/docs/components/owned-button` redirects
there. Historical migration ledgers retain their original names and acceptance IDs.
