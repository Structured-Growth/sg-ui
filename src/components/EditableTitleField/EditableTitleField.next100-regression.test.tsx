// @vitest-environment jsdom
import { useState } from "react";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../theme";
import { EditableTitleField, type EditableTitleFieldProps } from "./index";

afterEach(cleanup);

it("keeps the active draft separate from host title changes and commits through the public host callback", async () => {
  const saved = vi.fn();
  function Host() {
    const [title, setTitle] = useState("Original");
    const onSave: EditableTitleFieldProps["onSave"] = next => { saved(next); setTitle(next); };
    return <Provider><EditableTitleField title={title} onSave={onSave} />
      <button onClick={() => setTitle("Host replacement")} onMouseDown={event => event.preventDefault()}>Replace title</button>
    </Provider>;
  }
  const user = userEvent.setup();
  render(<Host />);
  await user.click(screen.getByRole("button", { name: "Edit title" }));
  const input = screen.getByRole("textbox", { name: "Document title" });
  await user.clear(input);
  await user.type(input, " Draft title ");
  await user.click(screen.getByRole("button", { name: "Replace title" }));
  expect((input as HTMLInputElement).value).toBe(" Draft title ");
  expect(saved).not.toHaveBeenCalled();
  await user.keyboard("{Enter}");
  expect(saved).toHaveBeenCalledExactlyOnceWith("Draft title");
  expect(screen.getByRole("heading", { name: "Draft title" })).toBeDefined();
  await user.click(screen.getByRole("button", { name: "Edit title" }));
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Draft title");
});

it("isolates a pending save and ignores its late rejection after that instance unmounts", async () => {
  let reject!: (reason: Error) => void;
  const firstSave = vi.fn(() => new Promise<void>((_, fail) => { reject = fail; }));
  const secondSave = vi.fn();
  function Pair({ first = true }: { first?: boolean }) {
    return <Provider>
      {first && <section aria-label="First"><EditableTitleField title="First title" onSave={firstSave} /></section>}
      <section aria-label="Second"><EditableTitleField title="Second title" onSave={secondSave} /></section>
    </Provider>;
  }
  const user = userEvent.setup();
  const view = render(<Pair />);
  const first = within(screen.getByRole("region", { name: "First" }));
  await user.click(first.getByRole("button", { name: "Edit title" }));
  await user.clear(first.getByRole("textbox"));
  await user.type(first.getByRole("textbox"), "First draft{Enter}");
  expect(firstSave).toHaveBeenCalledExactlyOnceWith("First draft");
  const second = within(screen.getByRole("region", { name: "Second" }));
  await user.click(second.getByRole("button", { name: "Edit title" }));
  await user.clear(second.getByRole("textbox"));
  await user.type(second.getByRole("textbox"), "Second draft");
  expect(secondSave).not.toHaveBeenCalled();
  view.rerender(<Pair first={false} />);
  const secondInput = second.getByRole("textbox");
  secondInput.focus();
  await act(async () => { reject(new Error("Late first failure")); });
  expect(screen.queryByText("Could not save title. Try again.")).toBeNull();
  expect((secondInput as HTMLInputElement).value).toBe("Second draft");
  expect(document.activeElement).toBe(secondInput);
  await user.keyboard("{Enter}");
  expect(secondSave).toHaveBeenCalledExactlyOnceWith("Second draft");
  expect(firstSave).toHaveBeenCalledTimes(1);
});
