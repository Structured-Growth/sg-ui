// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGridDragHandle } from "./DataGridDragHandle";
afterEach(cleanup);
it("normalizes pointer and keyboard activation once and forwards the native button", async () => {
  const user = userEvent.setup(); const onPress = vi.fn(); const ref = createRef<HTMLButtonElement>();
  render(<DataGridDragHandle label="Move History" onPress={onPress} ref={ref} style={{ margin: 4 }} className="host-handle" />);
  const handle = screen.getByRole("button", { name: "Move History" });
  expect(ref.current).toBe(handle); expect(handle.classList.contains("host-handle")).toBe(true);
  expect(handle.style.margin).toBe("4px");
  await user.click(handle); expect(onPress).toHaveBeenCalledTimes(1);
  await user.keyboard("{Enter}"); expect(onPress).toHaveBeenCalledTimes(2);
  await user.keyboard(" "); expect(onPress).toHaveBeenCalledTimes(3);
});
it("suppresses disabled activation and exposes drag slot and state", async () => {
  const user = userEvent.setup(); const onPress = vi.fn();
  render(<DataGridDragHandle label="Move Science" onPress={onPress} disabled dragging slot="drag" />);
  const handle = screen.getByRole("button", { name: "Move Science" });
  await user.click(handle); await user.keyboard("{Enter}");
  expect(onPress).not.toHaveBeenCalled(); expect((handle as HTMLButtonElement).disabled).toBe(true);
  expect(handle.getAttribute("slot")).toBe("drag"); expect(handle.getAttribute("data-dragging")).toBe("true");
});
