// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";
afterEach(cleanup);

it("does not deliver pending hover callbacks from a replaced or removed trigger", async () => {
  // Separate module scope keeps the interaction engine's shared warmup cold.
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender, unmount } = render(<StrictMode><Tooltip trigger={<Button key="old">Old</Button>} content="Old help" delay={100} onOpenChange={change} /></StrictMode>);
  fireEvent.mouseMove(document.body); await user.hover(screen.getByRole("button"));
  expect(screen.queryByRole("tooltip")).toBeNull(); expect(change).not.toHaveBeenCalled();
  rerender(<StrictMode><Tooltip trigger={<Button key="new">New</Button>} content="New help" delay={100} onOpenChange={change} /></StrictMode>);
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 150)); });
  expect(screen.queryByRole("tooltip")).toBeNull(); expect(change).not.toHaveBeenCalled();
  // Reset the shared warmup via a real dismissal before testing a second pending lifetime.
  await user.tab(); await screen.findByRole("tooltip"); await user.keyboard("{Escape}");
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 600)); });
  await user.tab(); change.mockClear();
  fireEvent.mouseMove(document.body); await user.hover(screen.getByRole("button"));
  expect(screen.queryByRole("tooltip")).toBeNull(); expect(change).not.toHaveBeenCalled();
  unmount(); await act(async () => { await new Promise(resolve => setTimeout(resolve, 150)); });
  expect(screen.queryByRole("tooltip")).toBeNull(); expect(change).not.toHaveBeenCalled();
});
