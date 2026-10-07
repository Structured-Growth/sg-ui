// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { startTransition, Suspense, useState, type ReactElement } from "react";
import { QueuedHostTransition } from "./DocumentEditorToolbar.heading-lifetime.stories";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocumentEditorToolbar, type DocumentEditorToolbarProps } from "./DocumentEditorToolbar";

const props = (): DocumentEditorToolbarProps => ({
  canEdit: true, headingValue: "normal", onHeadingChange: vi.fn(),
  actions: { bold: { active: false }, italic: { active: false }, bulletList: { active: false }, orderedList: { active: false } },
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

// Use the real Select keyboard interaction, then control only the deferred
// delivery boundary. No mocked Select or timing sleeps hide the stale closure.
async function queueHeading() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /Text style heading/ }));
  await user.keyboard("{ArrowDown}");
  const option = screen.getByRole("option", { name: "H1", exact: true });
  vi.useFakeTimers();
  fireEvent.keyDown(option, { key: "Enter", code: "Enter" });
  fireEvent.keyUp(option, { key: "Enter", code: "Enter" });
}
function deliver() { act(() => { vi.runAllTimers(); }); }

describe("DocumentEditorToolbar queued heading lifetime", () => {
  it("delivers once to the current committed owner while preserving controlled heading and deferred focus", async () => {
    const original = vi.fn();
    const current = vi.fn(() => screen.getByRole("textbox", { name: "Host editor" }).focus());
    const initial = { ...props(), onHeadingChange: original };
    const view = render(<><DocumentEditorToolbar {...initial} /><div role="textbox" aria-label="Host editor" tabIndex={0} /></>);
    await queueHeading();
    expect(original).not.toHaveBeenCalled();
    view.rerender(<><DocumentEditorToolbar {...initial} onHeadingChange={current} /><div role="textbox" aria-label="Host editor" tabIndex={0} /></>);
    expect(current).not.toHaveBeenCalled();
    deliver();
    expect(original).not.toHaveBeenCalled();
    expect(current).toHaveBeenCalledExactlyOnceWith("h1");
    expect(screen.getByRole("button", { name: /Text style heading/ }).textContent).toContain("Normal");
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Host editor" }));
  });

  for (const restriction of ["read-only", "callback removal"] as const) {
    it(`rejects the queued request after ${restriction}`, async () => {
      const initial = props(); const original = initial.onHeadingChange;
      const view = render(<DocumentEditorToolbar {...initial} />);
      await queueHeading();
      view.rerender(<DocumentEditorToolbar {...initial} canEdit={restriction !== "read-only"} onHeadingChange={restriction === "callback removal" ? undefined : original} />);
      deliver();
      expect(original).not.toHaveBeenCalled();
      expect((screen.getByRole("button", { name: /Text style heading/ }) as HTMLButtonElement).disabled).toBe(true);
    });
    it(`does not resurrect a request invalidated by ${restriction}`, async () => {
      const initial = props(); const current = vi.fn();
      const view = render(<DocumentEditorToolbar {...initial} />);
      await queueHeading();
      view.rerender(<DocumentEditorToolbar {...initial} canEdit={restriction !== "read-only"} onHeadingChange={restriction === "callback removal" ? undefined : initial.onHeadingChange} />);
      view.rerender(<DocumentEditorToolbar {...initial} onHeadingChange={current} />);
      deliver();
      expect(initial.onHeadingChange).not.toHaveBeenCalled(); expect(current).not.toHaveBeenCalled();
    });
  }
  it("does not transfer ownership to an uncommitted suspended render", async () => {
    const original = vi.fn(); const speculative = vi.fn(); const attempted = vi.fn();
    const pending = new Promise<never>(() => undefined);
    function Suspend(): ReactElement { attempted(); throw pending; }
    function Host() {
      const [next, setNext] = useState(false);
      return <><button onClick={() => startTransition(() => setNext(true))}>Suspend owner</button>
        <Suspense fallback={<span>Pending owner</span>}>
          <DocumentEditorToolbar {...props()} onHeadingChange={next ? speculative : original} />
          {next && <Suspend />}
        </Suspense></>;
    }
    render(<Host />); await queueHeading();
    fireEvent.click(screen.getByRole("button", { name: "Suspend owner" }));
    expect(attempted).toHaveBeenCalled(); expect(screen.queryByText("Pending owner")).toBeNull();
    deliver(); expect(original).toHaveBeenCalledExactlyOnceWith("h1"); expect(speculative).not.toHaveBeenCalled();
  });
  it("cancels delivery on unmount", async () => {
    const initial = props(); const view = render(<DocumentEditorToolbar {...initial} />);
    await queueHeading(); view.unmount(); deliver(); expect(initial.onHeadingChange).not.toHaveBeenCalled();
  });
  it("retains a pending request across an unrelated committed render", async () => {
    const initial = props(); const view = render(<DocumentEditorToolbar {...initial} />);
    await queueHeading(); view.rerender(<DocumentEditorToolbar {...initial} statusLabel="Saved" />);
    deliver(); expect(initial.onHeadingChange).toHaveBeenCalledExactlyOnceWith("h1");
  });
});

// Validate the native-run fixture's event ordering with the same real owned
// Select before handing the frozen story to the coordinator's browser build.
describe("queued heading host fixture", () => {
  for (const mode of ["replace", "remove", "read-only", "unmount", "remove-restore", "read-only-restore", "unchanged"]) {
    it(`commits ${mode} between option Enter and deferred delivery`, async () => {
      const Preview = QueuedHostTransition.render as () => ReactElement;
      const user = userEvent.setup(); render(<Preview />);
      await user.click(screen.getByRole("button", { name: mode, exact: true }));
      await user.click(screen.getByRole("button", { name: /Text style heading/ }));
      await user.keyboard("{ArrowDown}{Enter}");
      await waitFor(() => expect(screen.getByLabelText("Heading delivery checkpoint").textContent).toBe("drained"));
      expect(screen.getByLabelText("Heading host commits").textContent).toBe("1");
      const trace = JSON.parse(screen.getByLabelText("Heading event trace").textContent ?? "[]");
      expect(trace.slice(0, 3)).toEqual(["option-enter", "select-closed", `host-committed:${mode}`]);
      if (mode.endsWith("-restore")) expect(trace).toEqual(["option-enter", "select-closed", `host-committed:${mode}`, "availability-restored", "delivery-checkpoint"]);
      expect(screen.getByLabelText("Heading requests").textContent).toBe(
        mode === "replace" ? '["current:h1"]' : mode === "unchanged" ? '["original:h1"]' : '[]',
      );
    });
  }
});
