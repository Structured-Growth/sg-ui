// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { AppShellMain } from "./AppShellMain";
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
function nativeFrames() {
  const pending = new Map<number, FrameRequestCallback>();
  let sequence = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { pending.set(++sequence, callback); return sequence; });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { pending.delete(id); });
  return () => act(() => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(callback => callback(0)); });
}
it("reveals the whole owned focused control after local resizing without moving focus", () => {
  const flush = nativeFrames(); let resize = () => {}; const disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", class { constructor(callback: () => void) { resize = callback; } observe() {} disconnect = disconnect; });
  render(<AppShellMain style={{overflow:"auto"}}><input aria-label="Course title" /></AppShellMain>);
  const main = screen.getByRole("main"); const input = screen.getByRole("textbox") as HTMLInputElement;
  const reveal = vi.fn(); input.scrollIntoView = reveal;
  vi.spyOn(main, "getBoundingClientRect").mockReturnValue(new DOMRect(0,0,300,100));
  vi.spyOn(input, "getBoundingClientRect").mockReturnValue(new DOMRect(10,10,200,44));
  act(() => input.focus()); flush(); expect(reveal).not.toHaveBeenCalled();
  vi.mocked(input.getBoundingClientRect).mockReturnValue(new DOMRect(10,-12,200,44));
  act(() => resize()); flush();
  expect(reveal).toHaveBeenCalledExactlyOnceWith({block:"nearest",inline:"nearest",behavior:"instant"});
  expect(document.activeElement).toBe(input);
});
it("preserves outside focus and cancels pending observation work on unmount", () => {
  const flush = nativeFrames(); const disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect = disconnect; });
  const {unmount} = render(<><AppShellMain style={{overflow:"auto"}}><input aria-label="Owned title" /></AppShellMain><button>Outside action</button></>);
  const input = screen.getByRole("textbox") as HTMLInputElement; const reveal = vi.fn(); input.scrollIntoView = reveal;
  vi.spyOn(input, "getBoundingClientRect").mockReturnValue(new DOMRect(0,-50,200,44));
  act(() => input.focus()); act(() => screen.getByRole("button").focus()); flush();
  expect(reveal).not.toHaveBeenCalled(); expect(document.activeElement).toBe(screen.getByRole("button"));
  act(() => input.focus()); unmount(); flush();
  expect(disconnect).toHaveBeenCalledOnce(); expect(reveal).not.toHaveBeenCalled();
});
