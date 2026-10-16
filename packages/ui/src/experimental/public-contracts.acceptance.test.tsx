// @vitest-environment jsdom
import { act, createRef } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "./Provider/Provider";
import { TextField } from "./TextField/TextField";
import { TextArea } from "./TextArea/TextArea";
import { Checkbox } from "./Checkbox/Checkbox";
import { AppDataGrid } from "../components/AppDataGrid/AppDataGrid";
import { createActionMenuColumn } from "../components/AppDataGrid/createActionMenuColumn";
import { ContentEditorChrome } from "../components/ContentEditorChrome/ContentEditorChrome";

afterEach(cleanup);

it.each([TextField, TextArea] as const)("keeps an explicit empty controlled value and instance-local naming through host rerenders: %s", async Field => {
  const change = vi.fn();
  const user = userEvent.setup();
  const view = (value: string) => <Provider><form>
    <Field label="Course A notes" name="a" value={value} defaultValue="Ignored" onValueChange={change} description="Guidance for A" startIcon={<svg aria-label="Decoration" />} inputClassName="host-input" />
    <Field label="Course B notes" name="b" defaultValue="Sibling draft" description="Guidance for B" />
  </form></Provider>;
  const { rerender, container } = render(view(""));
  const first = screen.getByRole("textbox", { name: "Course A notes" }) as HTMLInputElement;
  const second = screen.getByRole("textbox", { name: "Course B notes" }) as HTMLInputElement;
  const firstId = first.id, secondId = second.id;
  const descriptions = (node: HTMLElement) => node.getAttribute("aria-describedby")!.split(/\s+/).map(id => document.getElementById(id)?.textContent).join(" ");
  expect(firstId).toBeTruthy(); expect(secondId).not.toBe(firstId);
  expect(descriptions(first)).toBe("Guidance for A"); expect(descriptions(second)).toBe("Guidance for B");
  expect(first.value).toBe(""); expect(first.classList.contains("host-input")).toBe(true);
  expect(container.querySelector('[data-sgui-part="field-start-icon"]')?.getAttribute("aria-hidden")).toBe("true");
  await user.type(first, "x"); expect(change).toHaveBeenLastCalledWith("x"); expect(first.value).toBe("");
  await user.clear(second); await user.type(second, "Independent");
  rerender(view("Accepted"));
  expect(first.id).toBe(firstId); expect(second.id).toBe(secondId);
  expect(first.value).toBe("Accepted"); expect(second.value).toBe("Independent");
  expect(new FormData(container.querySelector("form")!).get("a")).toBe("Accepted");
});

it("hydrates repeated compound names and generated descriptions without replacing nodes or native refs", async () => {
  const first = createRef<HTMLLabelElement>();
  const second = createRef<HTMLLabelElement>();
  const view = <Provider><Checkbox ref={first} label="Select Course A" description="Only A" defaultChecked /><Checkbox ref={second} label="Select Course B" description="Only B" /></Provider>;
  const container = document.createElement("div"); document.body.append(container);
  container.innerHTML = renderToString(view, { identifierPrefix: "contracts-" });
  const before = [...container.querySelectorAll('input[type="checkbox"]')];
  const ids = before.map(input => input.getAttribute("aria-labelledby"));
  const recoverable = vi.fn();
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, view, { identifierPrefix: "contracts-", onRecoverableError: recoverable }); });
    expect(recoverable).not.toHaveBeenCalled();
    expect(ids[0]).toBeTruthy(); expect(ids[1]).not.toBe(ids[0]);
    for (const [index, name] of ["Select Course A", "Select Course B"].entries()) {
      const input = within(container).getByRole("checkbox", { name }) as HTMLInputElement;
      expect(input).toBe(before[index]); expect(input.getAttribute("aria-labelledby")).toBe(ids[index]);
      expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe(index === 0 ? "Only A" : "Only B");
      expect((index === 0 ? first : second).current?.control).toBe(input);
    }
  } finally { await act(async () => root?.unmount()); container.remove(); }
});

it("names repeated row actions with host context and invokes the selected row callback only", async () => {
  const user = userEvent.setup(), action = vi.fn();
  const rows = [{ id: "a", name: "Course A" }, { id: "b", name: "Course B" }];
  render(<Provider><AppDataGrid label="Courses" rows={rows} getRowId={row => row.id} getRowLabel={row => row.name}
    columns={[{ field: "name", headerName: "Name" }, createActionMenuColumn({ getMenuActions: () => [{ id: "details", label: "Details", onPress: action }] })]}
    selection={false} hideFooter /></Provider>);
  await user.click(screen.getByRole("button", { name: "Actions for Course B" }));
  const menu = await screen.findByRole("menu", { name: "Actions for Course B" });
  await user.click(within(menu).getByRole("menuitem", { name: "Details" }));
  expect(action).toHaveBeenCalledExactlyOnceWith(rows[1]);
  expect(screen.getByRole("button", { name: "Actions for Course A" })).toBeTruthy();
});

it("keeps editor callback anchors, native root style and host status slot ownership", async () => {
  const user = userEvent.setup(), press = vi.fn(), save = vi.fn(), ref = createRef<HTMLDivElement>();
  render(<Provider><ContentEditorChrome ref={ref} icon={<svg aria-label="Decorative document" />} title="Course A" onTitleSave={save}
    className="host-chrome" style={{ maxWidth: 640 }} rightSlot={<span role="status">Saved locally</span>}
    menuItems={[{ id: "publish", label: "Publish Course A", onPress: press, "aria-haspopup": "dialog", "aria-controls": "host-publish" }]} /></Provider>);
  const button = screen.getByRole("button", { name: "Publish Course A" });
  expect(ref.current?.classList.contains("host-chrome")).toBe(true); expect(ref.current?.style.maxWidth).toBe("640px");
  expect(ref.current?.querySelector('[data-sgui-part="editor-status"]')?.contains(screen.getByRole("status"))).toBe(true);
  expect(screen.queryByRole("img", { name: "Decorative document" })).toBeNull();
  expect(button.getAttribute("aria-controls")).toBe("host-publish");
  await user.click(button); expect(press).toHaveBeenCalledExactlyOnceWith(button); expect(save).not.toHaveBeenCalled();
});
