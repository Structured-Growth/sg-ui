// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
it("reveals a clipped controlled tab inside its strip during arrow navigation", async () => {
  const user = userEvent.setup();
  render(<Tabs label="Sections" items={items} activation="manual" />);
  const strip = screen.getByRole("tablist");
  const details = screen.getByRole("tab", { name: "Details" });
  const access = screen.getByRole("tab", { name: "Access" });
  Object.defineProperty(strip, "clientWidth", { value: 260 });
  vi.spyOn(strip, "getBoundingClientRect").mockReturnValue({ left: 16, right: 276 } as DOMRect);
  vi.spyOn(details, "getBoundingClientRect").mockImplementation(() => ({ left: 16 - strip.scrollLeft, right: 140 - strip.scrollLeft } as DOMRect));
  vi.spyOn(access, "getBoundingClientRect").mockImplementation(() => ({ left: 254 - strip.scrollLeft, right: 388 - strip.scrollLeft } as DOMRect));
  await user.click(details); await user.keyboard("{ArrowRight}");
  expect(document.activeElement).toBe(access); expect(strip.scrollLeft).toBe(112);
});

// Vertical orientation uses the same owned activation and disabled-item contracts.
describe("vertical tabs", () => {
  it("exposes orientation and uses Up/Down, skipping disabled tabs and wrapping", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<Tabs label="Vertical settings" items={items} orientation="vertical" onValueChange={change} />);
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("vertical");
    await user.click(screen.getByRole("tab", { name: "Details" }));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Access" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("Course access");
    expect(change).toHaveBeenLastCalledWith("access");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Details" }));
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Access" }));
  });
  it("keeps manual vertical focus separate from controlled selection until host acceptance", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    const { rerender } = render(<Tabs label="Vertical settings" items={items} orientation="vertical" activation="manual" value="details" onValueChange={change} />);
    await user.click(screen.getByRole("tab", { name: "Details" }));
    change.mockClear();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Access" }));
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("tabpanel").textContent).toBe("Course details");
    for (const [key, label] of [["End", "Access"], ["Home", "Details"], ["ArrowUp", "Access"], ["ArrowDown", "Details"]]) {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      fireEvent(document.activeElement!, event);
      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: label }));
      expect(change).not.toHaveBeenCalled();
      expect(screen.getByRole("tabpanel").textContent).toBe("Course details");
    }
    const modifiedEnd = new KeyboardEvent("keydown", { key: "End", altKey: true, bubbles: true, cancelable: true });
    fireEvent(document.activeElement!, modifiedEnd);
    expect(modifiedEnd.defaultPrevented).toBe(false);
    await user.keyboard("{ArrowDown}");
    await user.keyboard(" ");
    expect(change).toHaveBeenLastCalledWith("access");
    expect(screen.getByRole("tabpanel").textContent).toBe("Course details");
    rerender(<Tabs label="Vertical settings" items={items} orientation="vertical" activation="manual" value="access" onValueChange={change} />);
    expect(screen.getByRole("tabpanel").textContent).toBe("Course access");
  });
  it("uses the vertical axis in RTL and preserves the native root ref/style", async () => {
    const user = userEvent.setup(); const ref = vi.fn();
    render(<SGTranslationProvider value={{ locale: "ar-EG", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider><Tabs ref={ref} label="Vertical settings" items={items} orientation="vertical" style={{ blockSize: 160 }} /></Provider>
    </SGTranslationProvider>);
    const root = screen.getByRole("tablist").parentElement!.parentElement!;
    expect(ref).toHaveBeenCalledWith(root);
    expect(root.style.blockSize).toBe("160px");
    await user.click(screen.getByRole("tab", { name: "Details" }));
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Access" }));
  });
  it("reveals both vertical ends without changing another list or the horizontal axis", async () => {
    const user = userEvent.setup();
    render(<><Tabs label="Vertical settings" items={items} orientation="vertical" activation="manual" /><Tabs label="Other settings" items={items} /></>);
    const strip = screen.getByRole("tablist", { name: "Vertical settings" });
    const other = screen.getByRole("tablist", { name: "Other settings" });
    const [details,,access] = strip.querySelectorAll<HTMLElement>('[role="tab"]');
    Object.defineProperty(strip, "clientHeight", { value: 80 });
    Object.defineProperty(strip, "clientTop", { value: 2 });
    vi.spyOn(strip, "getBoundingClientRect").mockReturnValue({ top: 10, bottom: 92 } as DOMRect);
    vi.spyOn(details, "getBoundingClientRect").mockImplementation(() => ({ top: 12 - strip.scrollTop, bottom: 52 - strip.scrollTop } as DOMRect));
    vi.spyOn(access, "getBoundingClientRect").mockImplementation(() => ({ top: 92 - strip.scrollTop, bottom: 132 - strip.scrollTop } as DOMRect));
    await user.click(details);
    strip.scrollLeft = 7; other.scrollTop = 13;
    fireEvent.scroll(strip);
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(access); expect(strip.scrollTop).toBe(40);
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(details); expect(strip.scrollTop).toBe(0);
    expect(strip.scrollLeft).toBe(7); expect(other.scrollTop).toBe(13);
  });
});
