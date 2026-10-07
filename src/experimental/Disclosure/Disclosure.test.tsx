// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Disclosure } from "./Disclosure";
import { Navigation, NavigationItem } from "../Navigation/Navigation";
import { List, ListItem } from "../List/List";
afterEach(cleanup);
it("toggles a named linked panel using keyboard and excludes collapsed children from tab order", async () => {
  const user = userEvent.setup(); const onExpandedChange = vi.fn(); const ref = createRef<HTMLDivElement>();
  render(<Disclosure ref={ref} label="Courses" onExpandedChange={onExpandedChange}><Navigation label="Course links"><List><ListItem><NavigationItem href="/algebra">Algebra</NavigationItem></ListItem></List></Navigation></Disclosure>);
  const trigger = screen.getByRole("button", { name: "Courses" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false"); expect(screen.queryByRole("link")).toBeNull();
  expect(ref.current?.getAttribute("data-sgui-part")).toBe("disclosure");
  await user.tab(); await user.keyboard("{Enter}");
  expect(onExpandedChange).toHaveBeenCalledWith(true); const panel = screen.getByRole("region", { name: "Courses" });
  expect(trigger.getAttribute("aria-controls")).toBe(panel.id); await user.tab(); expect(document.activeElement).toBe(screen.getByRole("link"));
  await user.tab({ shift: true }); await user.keyboard(" "); expect(onExpandedChange).toHaveBeenLastCalledWith(false); expect(screen.queryByRole("region")).toBeNull();
});
it("keeps controlled expansion authoritative and restores focus when the host collapses focused content", async () => {
  const user = userEvent.setup(); const onExpandedChange = vi.fn();
  const view = render(<Disclosure label="Details" expanded onExpandedChange={onExpandedChange} unmountOnCollapse><input aria-label="Note" /></Disclosure>);
  await user.click(screen.getByRole("button")); expect(onExpandedChange).toHaveBeenCalledWith(false); expect(screen.getByRole("region")).toBeDefined();
  await user.click(screen.getByRole("textbox"));
  view.rerender(<Disclosure label="Details" expanded={false} onExpandedChange={onExpandedChange} unmountOnCollapse><input aria-label="Note" /></Disclosure>);
  expect(screen.queryByRole("textbox", { hidden: true })).toBeNull(); expect(document.activeElement).toBe(screen.getByRole("button"));
});
it("keeps independent state and disables expansion requests", async () => {
  render(<><Disclosure label="One" defaultExpanded><input aria-label="Retained" defaultValue="Saved" /></Disclosure><Disclosure label="Two" disabled>Hidden</Disclosure></>);
  await userEvent.click(screen.getByRole("button", { name: "One" })); expect(screen.getByRole("textbox", { hidden: true }).getAttribute("value")).toBe("Saved");
  await userEvent.click(screen.getByRole("button", { name: "Two" })); expect(screen.getByRole("button", { name: "Two" }).getAttribute("aria-expanded")).toBe("false");
});
