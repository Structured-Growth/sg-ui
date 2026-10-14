// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Select } from "./Select";
// Exercise the internal sizing adapter through its real Select context and portal.
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const options = [{ id: "draft", label: "Draft" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "active", label: "Active" }];
it("defers observed popup size changes to a frame while preserving positioning and cancelling pending resize work", async () => {
 const observers: TestObserver[] = [];
 class TestObserver implements ResizeObserver {
  targets = new Set<Element>();
  constructor(readonly callback: ResizeObserverCallback) { observers.push(this); }
  observe(target: Element) { this.targets.add(target); }
  unobserve(target: Element) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); }
 }
 vi.stubGlobal("ResizeObserver", TestObserver);
 let anchorTop = 180;
 vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function(this: HTMLElement) {
  return this.tagName === "BUTTON" ? new DOMRect(100, anchorTop, 140, 44) : new DOMRect(0, 0, 180, 120);
 });
 const user = userEvent.setup();
 const { unmount } = render(<div data-testid="scroll-host"><Select label="Status" options={options} defaultValue="draft" /></div>);
 await user.click(screen.getByRole("button"));
 const popup = screen.getByRole("listbox").parentElement!;
 const before = Number.parseFloat(popup.style.top);
 expect(Number.isFinite(before)).toBe(true);
 const owned = observers.find(observer => observer.targets.size === 2)!;
 expect(owned).toBeDefined();
 const writes = vi.spyOn(popup.style, "top", "set");
 const pending = new Map<number, FrameRequestCallback>(); let nextFrame = 1;
 vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
  const frame = nextFrame++; pending.set(frame, callback); return frame;
 });
 const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(frame => { pending.delete(frame); });
 const notify = (observer: TestObserver, height: number) => observer.callback([...observer.targets].map(target => ({
  target, contentRect: new DOMRect(0, 0, 180, height),
 } as ResizeObserverEntry)), observer);
 // Upstream observers must not change the observed size in native delivery.
 await act(async () => { observers.forEach(observer => notify(observer, 160)); notify(owned, 160); });
 expect(writes).not.toHaveBeenCalled();
 expect(pending.size).toBe(1);
 anchorTop -= 24;
 const callbacks = [...pending.values()]; pending.clear();
 await act(async () => { callbacks.forEach(callback => callback(performance.now())); });
 expect(Number.parseFloat(popup.style.top)).toBe(before - 24);
 expect(writes).toHaveBeenCalled();
 writes.mockClear();
 await act(async () => { observers.forEach(observer => notify(observer, 160)); });
 expect(writes).not.toHaveBeenCalled();
 expect(pending.size).toBe(0);
 fireEvent.scroll(popup);
 expect(pending.size).toBe(0);
 anchorTop -= 12;
 fireEvent.scroll(screen.getByTestId("scroll-host"));
 expect(pending.size).toBe(1);
 const scrollCallbacks = [...pending.values()]; pending.clear();
 await act(async () => { scrollCallbacks.forEach(callback => callback(performance.now())); });
 expect(Number.parseFloat(popup.style.top)).toBe(before - 36);
 expect(screen.getByRole("listbox")).toBeDefined();
 fireEvent(window, new Event("resize"));
 const frame = [...pending.keys()][0];
 expect(pending.size).toBe(1);
 unmount();
 expect(cancel).toHaveBeenCalledWith(frame);
 expect(pending.has(frame)).toBe(false);
 expect(owned.targets.size).toBe(0);
});
