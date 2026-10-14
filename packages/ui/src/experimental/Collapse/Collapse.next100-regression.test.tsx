// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Collapse, Provider } from "../../primitives";

afterEach(cleanup);

it("isolates retained and unmounted public panels across host updates and remounts", () => {
  const retainedRef = createRef<HTMLDivElement>();
  const disposableRef = createRef<HTMLDivElement>();
  const View = ({ retained, disposable }: { retained: boolean; disposable: boolean }) => (
    <Provider>
      <Collapse ref={retainedRef} expanded={retained} id="retained-panel">
        <input aria-label="Retained draft" defaultValue="First" />
      </Collapse>
      <Collapse ref={disposableRef} expanded={disposable} unmountOnCollapse id="disposable-panel">
        <input aria-label="Disposable draft" defaultValue="Second" />
      </Collapse>
    </Provider>
  );
  const view = render(<View retained disposable />);
  const retainedInput = screen.getByRole("textbox", { name: "Retained draft" });
  const disposableInput = screen.getByRole("textbox", { name: "Disposable draft" });
  fireEvent.change(retainedInput, { target: { value: "Retained edit" } });
  fireEvent.change(disposableInput, { target: { value: "Discarded edit" } });

  view.rerender(<View retained={false} disposable />);
  expect(retainedRef.current?.hidden).toBe(true);
  expect(screen.queryByRole("textbox", { name: "Retained draft" })).toBeNull();
  expect(screen.getByRole("textbox", { name: "Disposable draft" })).toBe(disposableInput);
  expect((disposableInput as HTMLInputElement).value).toBe("Discarded edit");

  view.rerender(<View retained disposable={false} />);
  expect(screen.getByRole("textbox", { name: "Retained draft" })).toBe(retainedInput);
  expect((retainedInput as HTMLInputElement).value).toBe("Retained edit");
  expect(disposableRef.current?.hidden).toBe(true);
  expect(disposableInput.isConnected).toBe(false);

  view.rerender(<View retained disposable />);
  const remountedInput = screen.getByRole("textbox", { name: "Disposable draft" });
  expect(remountedInput).not.toBe(disposableInput);
  expect((remountedInput as HTMLInputElement).value).toBe("Second");
  expect((retainedInput as HTMLInputElement).value).toBe("Retained edit");
  view.unmount();
  expect(retainedRef.current).toBeNull();
  expect(disposableRef.current).toBeNull();
});
