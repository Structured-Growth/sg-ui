// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider } from "../../i18n";
afterEach(cleanup);
const items = [
  { id: "details", label: "Details", content: "Course details" },
  { id: "disabled", label: "Unavailable", disabled: true, content: "Unavailable content" },
  { id: "access", label: "Access", content: "Course access" },
];
describe("owned tabs proof", () => {
  it("skips disabled tabs and automatically selects on arrow navigation", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<Tabs label="Course settings" items={items} onValueChange={change} />);
    await user.click(screen.getByRole("tab", { name: "Details" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Access" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Course access");
    expect(change).toHaveBeenLastCalledWith("access");
  });
  it("keeps manual activation separate from focus and honors controlled selection", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const { rerender } = render(<Tabs label="Course settings" items={items} activation="manual" onValueChange={change} />);
    await user.click(screen.getByRole("tab", { name: "Details" }));
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Access" }));
    expect(screen.getByRole("tab", { name: "Details" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{Enter}");
    expect(change).toHaveBeenLastCalledWith("access");
    rerender(<Tabs label="Course settings" items={items} value="details" onValueChange={change} />);
    await user.click(screen.getByRole("tab", { name: "Access" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("Course details");
  });
  it("uses the host locale for RTL arrow navigation", async () => {
    const user = userEvent.setup();
    render(<SGTranslationProvider value={{ locale: "ar-EG", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider><Tabs label="Course settings" items={items} /></Provider>
    </SGTranslationProvider>);
    await user.click(screen.getByRole("tab", { name: "Details" }));
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Access" }).getAttribute("aria-selected")).toBe("true");
  });
});
