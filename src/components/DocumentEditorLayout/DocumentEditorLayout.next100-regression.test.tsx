// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Button } from "../../experimental/Button/Button";
import { ThemeScope } from "../../foundation/ThemeScope";
import { DocumentEditorLayout, type DocumentEditorLayoutProps } from "./index";

afterEach(cleanup);

it("isolates host status/actions and releases only the removed layout ref", async () => {
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const saveFirst = vi.fn();
  const saveSecond = vi.fn();
  const user = userEvent.setup();
  const firstProps: DocumentEditorLayoutProps = {
    title: "First document",
    headerRight: <><span role="status" style={{ color: "var(--sgui-text-muted)" }}>First draft</span><Button onPress={saveFirst}>Save first</Button></>,
    children: <textarea aria-label="First text" defaultValue="First draft text" />,
  };
  const secondProps: DocumentEditorLayoutProps = {
    title: "Second document",
    headerRight: <><span role="status" style={{ color: "var(--sgui-text-muted)" }}>Second saved</span><Button onPress={saveSecond}>Save second</Button></>,
    children: <textarea aria-label="Second text" defaultValue="Second draft text" />,
  };
  const composition = (showFirst: boolean) => <ThemeScope>
    {showFirst && <DocumentEditorLayout key="first" ref={firstRef} {...firstProps} />}
    <DocumentEditorLayout key="second" ref={secondRef} {...secondProps} />
  </ThemeScope>;
  const view = render(composition(true));
  const secondRoot = secondRef.current!;
  const secondText = screen.getByRole("textbox", { name: "Second text" });
  expect(within(firstRef.current!).getByRole("status").textContent).toBe("First draft");
  expect(within(secondRoot).getByRole("status").textContent).toBe("Second saved");
  expect(within(firstRef.current!).getByRole("status").style.color).toBe("var(--sgui-text-muted)");
  await user.click(screen.getByRole("button", { name: "Save first" }));
  expect(saveFirst).toHaveBeenCalledTimes(1);
  expect(saveSecond).not.toHaveBeenCalled();
  await user.click(secondText);
  await user.type(secondText, " updated");
  view.rerender(composition(false));
  expect(firstRef.current).toBeNull();
  expect(secondRef.current).toBe(secondRoot);
  expect(document.activeElement).toBe(secondText);
  expect((secondText as HTMLTextAreaElement).value).toBe("Second draft text updated");
  expect(screen.queryByText("First draft")).toBeNull();
  expect(within(secondRoot).getByRole("status").textContent).toBe("Second saved");
  await user.click(screen.getByRole("button", { name: "Save second" }));
  expect(saveSecond).toHaveBeenCalledTimes(1);
  expect(saveFirst).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(secondRef.current).toBeNull();
});
