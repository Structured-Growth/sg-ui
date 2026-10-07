# AppButton owned action contract

Task M-01. AppButton keeps its public name and uses SGUI's Button interaction
implementation. It forwards a native HTMLButtonElement ref and selectively chosen
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
import { AppButton } from "@structured-growth/sg-ui/components/AppButton";

<Provider>
  <AppButton variant="outlined" tone="neutral" density="compact"
    onPress={() => saveCourse()}>Save</AppButton>
</Provider>;
```

Existing editor menu compositions obtain their anchor through a native ref instead
of a press event. Host callbacks elsewhere in the library remain host-owned; their
contracts are not automatically converted by this action migration.

ContentEditorChrome continues to use its legacy button internally for its existing
MouseEvent-based menu callback contract, which can supply an anchor to the host.
That composition remains unmigrated; its later migration must explicitly map this
contract. Other AppButton consumers use the owned action API in this batch.

## Native form activation ordering

Pending reset buttons suppress the native reset default. Submit/reset buttons
deliver the owned `onPress` once from native click capture, before the form default
action; ordinary buttons retain React Aria press handling. Pointer, Enter and Space
ordering and current host callbacks are covered by [focused button evidence](parallel-batch-13/control-button.md).
The corrected frozen commit passed both Chromium/WebKit cases. Firefox, physical
touch and spoken assistive-technology acceptance remain separate.
