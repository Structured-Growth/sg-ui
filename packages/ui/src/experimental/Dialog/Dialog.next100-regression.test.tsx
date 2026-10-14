// @vitest-environment jsdom
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog, type DialogDismissReason } from "./Dialog";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";

afterEach(cleanup);

describe("Dialog next100 missing regression", () => {
  it("associates the description and retains the document lock until the last dialog unmounts", async () => {
    const user = userEvent.setup();
    const dismissed = vi.fn<(reason: DialogDismissReason) => void>();
    const dialogRef = createRef<HTMLElement>();
    const root = document.documentElement;
    const originalOverflow = root.style.overflow;
    root.style.overflow = "scroll";
    function Fixture() {
      const [childOpen, setChildOpen] = useState(false);
      return <Provider>
        <Dialog ref={dialogRef} open title="Parent lock" description="Review the course before saving" onDismiss={dismissed}>
          <Button onPress={() => setChildOpen(true)}>Open nested lock</Button>
          <Dialog open={childOpen} title="Child lock" onDismiss={reason => { dismissed(reason); setChildOpen(false); }}>
            Child content
          </Dialog>
        </Dialog>
      </Provider>;
    }
    try {
      const view = render(<Fixture />);
      const parent = screen.getByRole("dialog", { name: "Parent lock" });
      expect(dialogRef.current).toBe(parent);
      const descriptionId = parent.getAttribute("aria-describedby");
      expect(descriptionId).toBeTruthy();
      expect(document.getElementById(descriptionId!)?.textContent).toBe("Review the course before saving");
      await waitFor(() => expect(root.style.overflow).toBe("hidden"));
      await user.click(screen.getByRole("button", { name: "Open nested lock" }));
      expect(screen.getByRole("dialog", { name: "Child lock" })).toBeTruthy();
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog", { name: "Child lock" })).toBeNull());
      expect(dismissed.mock.calls).toEqual([["escape"]]);
      expect(root.style.overflow).toBe("hidden");
      expect(dialogRef.current).toBe(parent);
      view.unmount();
      await waitFor(() => expect(root.style.overflow).toBe("scroll"));
      expect(dialogRef.current).toBeNull();
      expect(dismissed.mock.calls).toEqual([["escape"]]);
    } finally {
      cleanup();
      root.style.overflow = originalOverflow;
    }
  });
});
