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
it("does not transfer an open description to a replacement trigger", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Tooltip trigger={<Button key="original">Original</Button>} content="Original help" delay={0} closeDelay={0} />);
  await user.tab(); await screen.findByRole("tooltip");
  rerender(<Tooltip trigger={<Button key="replacement">Replacement</Button>} content="Replacement help" delay={0} closeDelay={0} />);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  expect(screen.getByRole("button").getAttribute("aria-describedby")).toBeNull();
  await user.tab(); expect(await screen.findByRole("tooltip")).toHaveProperty("textContent", "Replacement help");
});
it("keeps independent scope descriptions and clears the removed portal ref", async () => {
  const user = userEvent.setup(); const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<>
    <ThemeScope key="first" theme="dark" dir="rtl" lang="en-US"><Tooltip ref={ref} trigger={<Button>First</Button>} content="First help" /></ThemeScope>
    <ThemeScope key="second" theme="light" dir="ltr" lang="ar-EG"><Tooltip trigger={<Button>Second</Button>} content="Second help" /></ThemeScope>
  </>);
  await user.tab(); const first = await screen.findByRole("tooltip");
  expect(first.dir).toBe("rtl"); expect(first.lang).toBe("en-US");
  rerender(<ThemeScope key="second" theme="light" dir="ltr" lang="ar-EG"><Tooltip trigger={<Button>Second</Button>} content="Second help" /></ThemeScope>);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull()); expect(ref.current).toBeNull();
  await user.tab(); const second = await screen.findByRole("tooltip");
  expect(second.dir).toBe("ltr"); expect(second.lang).toBe("ar-EG");
});
it("retains an open description for ordinary trigger updates and host-controlled replacement", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Tooltip trigger={<Button key="same">Refresh</Button>} content="Old help" />);
  await user.tab(); const tooltip = await screen.findByRole("tooltip"); const button = screen.getByRole("button");
  rerender(<Tooltip trigger={<Button key="same">Refresh courses</Button>} content="Updated help" />);
  expect(screen.getByRole("button")).toBe(button); expect(screen.getByRole("tooltip")).toBe(tooltip);
  expect(tooltip.textContent).toBe("Updated help"); expect(document.activeElement).toBe(button);
  rerender(<Tooltip open trigger={<Button key="controlled">Controlled</Button>} content="Host help" />);
  expect(await screen.findByRole("tooltip")).toHaveProperty("textContent", "Host help");
});
it("does not make a native disabled trigger focusable or show hover help", async () => {
  const user = userEvent.setup();
  render(<><Tooltip trigger={<Button disabled>Unavailable</Button>} content="Help" delay={0} /><Button>Next</Button></>);
  await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", {name:"Next"}));
  fireEvent.mouseMove(document.body); await user.hover(screen.getByRole("button", {name:"Unavailable"}));
  expect(screen.queryByRole("tooltip")).toBeNull();
});
