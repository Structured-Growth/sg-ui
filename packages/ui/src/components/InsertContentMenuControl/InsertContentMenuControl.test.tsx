// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InsertContentMenuControl } from "./InsertContentMenuControl";

afterEach(cleanup);

describe("InsertContentMenuControl", () => {
  it("opens from the native trigger and invokes insertion callbacks", async () => {
    const user = userEvent.setup();
    const onInsertImage = vi.fn();
    const onInsertHorizontalRule = vi.fn();
    const onInsertColumnsLayout = vi.fn();
    render(<InsertContentMenuControl onInsertImage={onInsertImage} onInsertHorizontalRule={onInsertHorizontalRule} onInsertColumnsLayout={onInsertColumnsLayout} />);
    const trigger = screen.getByRole("button", { name: /Insert/ });
    trigger.focus();
    await user.keyboard(" ");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.click(screen.getByRole("menuitem", { name: "Image" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Horizontal Rule" }));
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Columns Layout" }));
    expect(onInsertImage).toHaveBeenCalledTimes(1);
    expect(onInsertHorizontalRule).toHaveBeenCalledTimes(1);
    expect(onInsertColumnsLayout).toHaveBeenCalledTimes(1);
  });

  it("prevents disabled insertion menu activation", async () => {
    const user = userEvent.setup();
    render(<InsertContentMenuControl disabled />);
    await user.click(screen.getByRole("button", { name: /Insert/ }));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

it("skips unavailable commands and returns focus without submitting a surrounding form", async () => {
  const user = userEvent.setup(); const submit = vi.fn(event => event.preventDefault()); const insert = vi.fn();
  render(<form onSubmit={submit}><InsertContentMenuControl onInsertHorizontalRule={insert} /></form>);
  const trigger = screen.getByRole("button", { name: "Insert" }); trigger.focus();
  await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("menuitem", { name: "Image" }).getAttribute("aria-disabled")).toBe("true");
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Horizontal Rule" }));
  await user.keyboard("{Enter}"); expect(insert).toHaveBeenCalledTimes(1); expect(submit).not.toHaveBeenCalled();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});

it("hands keyboard focus to a host-opened insertion dialog", async () => {
  const { useState } = await import("react");
  const { ColumnsLayoutModal } = await import("../ColumnsLayoutModal");
  const insert = vi.fn();
  function Host() {
    const [open, setOpen] = useState(false);
    return <><InsertContentMenuControl onInsertColumnsLayout={() => setOpen(true)} /><ColumnsLayoutModal open={open} onClose={() => setOpen(false)} onSubmit={preset => { insert(preset); setOpen(false); }} /></>;
  }
  const user = userEvent.setup(); render(<Host />);
  const trigger = screen.getByRole("button", {name:"Insert"}); trigger.focus();
  await user.keyboard("{ArrowDown}{Enter}");
  const dialog = await screen.findByRole("dialog");
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  expect(screen.queryByRole("menu")).toBeNull();
  await user.click(screen.getByRole("button", {name:"Insert"}));
  expect(insert).toHaveBeenCalledExactlyOnceWith("twoEqual");
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
