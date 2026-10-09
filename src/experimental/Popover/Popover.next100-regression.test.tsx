// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Popover, Provider, TextField, type PopoverProps } from "../index";

afterEach(cleanup);

it("initializes defaultOpen once and keeps sibling open requests and child refs independent", async () => {
  const user = userEvent.setup();
  const firstChange = vi.fn();
  const secondChange = vi.fn();
  const firstRef = createRef<HTMLInputElement>();
  const secondRef = createRef<HTMLInputElement>();
  const firstProps = {
    title: "First note", trigger: <Button>Open first note</Button>,
    onOpenChange: firstChange, children: <TextField label="First draft" ref={firstRef} autoFocus />,
  } satisfies PopoverProps;
  const secondProps = {
    title: "Second note", trigger: <Button>Open second note</Button>,
    onOpenChange: secondChange, children: <TextField label="Second draft" ref={secondRef} autoFocus />,
  } satisfies PopoverProps;
  const content = (initial: boolean, includeSecond = true) => <Provider>
    <Popover {...firstProps} defaultOpen={initial} />
    {includeSecond && <Popover {...secondProps} defaultOpen={false} />}
  </Provider>;
  const { rerender } = render(content(true));
  expect(await screen.findByRole("dialog", { name: "First note" })).toBeTruthy();
  await waitFor(() => expect(document.activeElement).toBe(firstRef.current));
  expect(secondRef.current).toBeNull();
  expect(firstChange).not.toHaveBeenCalled();
  expect(secondChange).not.toHaveBeenCalled();
  await user.type(firstRef.current!, "First local draft");

  rerender(content(false));
  expect(screen.getByRole("dialog", { name: "First note" })).toBeTruthy();
  expect(firstRef.current!.value).toBe("First local draft");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(firstChange.mock.calls).toEqual([[false]]);
  expect(secondChange).not.toHaveBeenCalled();

  // A later default value does not reopen an already initialized instance.
  rerender(content(true));
  expect(screen.queryByRole("dialog")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Open second note" }));
  expect(await screen.findByRole("dialog", { name: "Second note" })).toBeTruthy();
  await waitFor(() => expect(document.activeElement).toBe(secondRef.current));
  expect(firstRef.current).toBeNull();
  expect(secondChange.mock.calls).toEqual([[true]]);

  rerender(content(true, false));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(secondRef.current).toBeNull();
  await user.click(screen.getByRole("button", { name: "Open first note" }));
  expect(await screen.findByRole("dialog", { name: "First note" })).toBeTruthy();
  await waitFor(() => expect(document.activeElement).toBe(firstRef.current));
  expect(firstChange.mock.calls).toEqual([[false], [true]]);
  expect(secondChange.mock.calls).toEqual([[true]]);
});
