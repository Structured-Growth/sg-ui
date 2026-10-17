// @vitest-environment jsdom
import { StrictMode, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";
import { TextField } from "../TextField/TextField";
import { Provider } from "../Provider/Provider";
afterEach(cleanup);

function InitiallyOpenStack({ childDismissed, parentDismissed }: { childDismissed: () => void; parentDismissed: () => void }) {
  const [parentOpen, setParentOpen] = useState(true);
  const [childOpen, setChildOpen] = useState(true);
  return <Provider>
    <TextField label="Outside draft" defaultValue="Keep host draft" />
    <Dialog open={parentOpen} title="Initially open parent" onDismiss={() => { parentDismissed(); setParentOpen(false); }}>
      <TextField label="Parent initial field" autoFocus />
      <Dialog open={childOpen} title="Initially open child" onDismiss={() => { childDismissed(); setChildOpen(false); }}>
        <TextField label="Child initial field" autoFocus />
      </Dialog>
    </Dialog>
  </Provider>;
}

for (const strict of [false, true]) it(`keeps an initially open nested child accessible and dismisses only the topmost dialog (StrictMode=${strict})`, async () => {
  const user = userEvent.setup();
  const childDismissed = vi.fn(); const parentDismissed = vi.fn();
  const tree = <InitiallyOpenStack childDismissed={childDismissed} parentDismissed={parentDismissed} />;
  render(strict ? <StrictMode>{tree}</StrictMode> : tree);
  const child = await screen.findByRole("dialog", { name: "Initially open child" });
  const field = await within(child).findByRole("textbox", { name: "Child initial field" });
  await waitFor(() => expect(document.activeElement).toBe(field));
  expect(childDismissed).not.toHaveBeenCalled(); expect(parentDismissed).not.toHaveBeenCalled();
  const fieldId = field.id;
  await user.type(field, "Child draft");
  expect(child.closest('[aria-hidden="true"], [inert]')).toBeNull();
  expect(screen.queryByRole("dialog", { name: "Initially open parent" })).toBeNull();
  for (let index = 0; index < 3; index++) {
    await user.tab(); expect(child.contains(document.activeElement)).toBe(true);
  }
  expect(document.getElementById(fieldId)).toBe(field);
  expect((field as HTMLInputElement).value).toBe("Child draft");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Initially open child" })).toBeNull());
  expect(childDismissed).toHaveBeenCalledOnce(); expect(parentDismissed).not.toHaveBeenCalled();
  const parent = await screen.findByRole("dialog", { name: "Initially open parent" });
  await waitFor(() => expect(parent.contains(document.activeElement)).toBe(true));
  expect(parent.closest('[aria-hidden="true"], [inert]')).toBeNull();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(childDismissed).toHaveBeenCalledOnce(); expect(parentDismissed).toHaveBeenCalledOnce();
  const outside = screen.getByRole("textbox", { name: "Outside draft" }) as HTMLInputElement;
  expect(outside.value).toBe("Keep host draft");
  expect(outside.closest('[aria-hidden="true"], [inert]')).toBeNull();
});
