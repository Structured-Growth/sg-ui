// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";
import { ThemeScope } from "../../foundation/ThemeScope";
afterEach(cleanup);
it("describes the focused trigger, dismisses with Escape and keeps trigger focus", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const ref = createRef<HTMLDivElement>();
  render(<Tooltip ref={ref} trigger={<Button>Refresh</Button>} content="Refresh courses" onOpenChange={change} delay={0} closeDelay={0} />);
  await user.tab(); const tooltip = await screen.findByRole("tooltip"); const button = screen.getByRole("button");
  expect(button.getAttribute("aria-describedby")).toBe(tooltip.id); expect(ref.current).toBe(tooltip);
  await user.keyboard("{Escape}"); await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  expect(document.activeElement).toBe(button); expect(change).toHaveBeenCalledWith(false);
});
it("opens on hover and closes when the pointer leaves", async () => {
  const user = userEvent.setup();
  render(<Tooltip trigger={<Button>Refresh</Button>} content="Refresh courses" delay={0} closeDelay={0} />);
  // A real pointer moves before entering; user-event emits enter first in jsdom.
  fireEvent.mouseMove(document.body);
  await user.hover(screen.getByRole("button")); await screen.findByRole("tooltip");
  await user.unhover(screen.getByRole("button")); await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
});
it("copies nested visual and locale settings into its portal", async () => {
  const user = userEvent.setup();
  render(<ThemeScope theme="dark" density="compact" dir="rtl" lang="ar" style={{"--sgui-surface":"rebeccapurple"}}>
    <Tooltip trigger={<Button>Refresh</Button>} content="Refresh courses" /></ThemeScope>);
  await user.tab(); const tooltip = await screen.findByRole("tooltip");
  expect(tooltip.getAttribute("data-sgui-theme")).toBe("dark"); expect(tooltip.getAttribute("data-sgui-density")).toBe("compact");
  expect(tooltip.dir).toBe("rtl"); expect(tooltip.lang).toBe("ar"); expect(tooltip.style.getPropertyValue("--sgui-surface")).toBe("rebeccapurple");
});
it("suppresses the description when disabled", async () => {
  const user = userEvent.setup();
  render(<Tooltip disabled trigger={<Button>Refresh</Button>} content="Refresh courses" delay={0} />);
  await user.tab(); await user.hover(screen.getByRole("button")); expect(screen.queryByRole("tooltip")).toBeNull();
});
