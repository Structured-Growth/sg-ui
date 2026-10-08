// @vitest-environment jsdom
import { useState } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../../experimental/Provider/Provider";
import { DataToolbarColumnsMenu, type DataToolbarColumnOption } from "./DataToolbarColumnsMenu";
afterEach(cleanup);
const initial = [
  { id: "name", label: "Course name", locked: true, visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "instructor", label: "Instructor", visible: false },
];
function Harness({ change }: { change: (options: DataToolbarColumnOption[]) => void }) {
  const [options, setOptions] = useState(initial);
  return <DataToolbarColumnsMenu options={options} onChange={next => { setOptions(next); change(next); }} />;
}
it("keeps locked columns disabled, toggles controlled visibility once and resets all columns", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const submit = vi.fn(event => event.preventDefault());
  render(<Provider theme="dark"><form onSubmit={submit}><Harness change={change} /></form></Provider>);
  await user.tab(); await user.keyboard("{Enter}");
  expect(screen.getByRole("dialog", { name: "Columns" }).closest('[data-sgui-theme="dark"]')).toBeTruthy();
  expect((screen.getByRole("checkbox", { name: "Course name" }) as HTMLInputElement).disabled).toBe(true);
  await user.click(screen.getByRole("checkbox", { name: "Course name" })); expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole("checkbox", { name: "Status" }));
  expect(change).toHaveBeenCalledExactlyOnceWith([initial[0], { ...initial[1], visible: false }, initial[2]]);
  expect((screen.getByRole("checkbox", { name: "Status" }) as HTMLInputElement).checked).toBe(false);
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(change).toHaveBeenLastCalledWith(initial.map(option => ({ ...option, visible: true })));
  expect(submit).not.toHaveBeenCalled();
  await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Columns" })));
});
it("searches literal host labels, reports no matches and clears search after dismissal", async () => {
  const user = userEvent.setup(); render(<Provider><Harness change={vi.fn()} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Columns" }));
  const search = screen.getByRole("searchbox", { name: "Search" });
  await user.type(search, "  INSTRUCTOR ");
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  expect(screen.getByRole("checkbox", { name: "Instructor" })).toBeTruthy();
  await user.clear(search); await user.type(search, "missing"); expect(screen.queryByRole("checkbox")).toBeNull();
  expect(screen.getByText("No matching columns")).toBeTruthy();
  await user.keyboard("{Escape}"); await user.click(screen.getByRole("button", { name: "Columns" }));
  expect((screen.getByRole("searchbox", { name: "Search" }) as HTMLInputElement).value).toBe("");
  expect(screen.getAllByRole("checkbox")).toHaveLength(3);
});
it("supports keyboard checkbox changes without closing the dialog", async () => {
  const user = userEvent.setup(); const change = vi.fn(); render(<Provider><Harness change={change} /></Provider>);
  await user.tab(); await user.keyboard("{Enter}");
  screen.getByRole("button", { name: "Move Course name down" }).focus(); await user.tab();
  expect(document.activeElement).toBe(screen.getByRole("checkbox", { name: "Status" }));
  await user.keyboard(" "); expect(change).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("dialog", { name: "Columns" })).toBeTruthy();
});
it("translates library strings while searching host labels without generated translation keys", async () => {
  const { SGTranslationProvider } = await import("../../../i18n");
  const user = userEvent.setup();
  const t = vi.fn((_key: string, { defaultMessage }: { defaultMessage: string }) => `Local ${defaultMessage}`);
  render(<SGTranslationProvider value={{ locale: "en-US", t, useNamespace: () => {} }}><Provider><Harness change={vi.fn()} /></Provider></SGTranslationProvider>);
  await user.click(screen.getByRole("button", { name: "Local Columns" }));
  expect(screen.getByRole("checkbox", { name: "Course name" })).toBeTruthy();
  await user.type(screen.getByRole("searchbox", { name: "Local Search" }), "course");
  expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  expect(t.mock.calls.some(([key]) => key.startsWith("common.ui.label"))).toBe(false);
});

it("requests full-array moves through filtered results without changing visibility or locking text positions", async () => {
  const user = userEvent.setup(); const change = vi.fn(); render(<Provider><Harness change={change} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Columns" }));
  expect((screen.getByRole("button", { name: "Move Course name up" }) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole("button", { name: "Move Instructor down" }) as HTMLButtonElement).disabled).toBe(true);
  await user.type(screen.getByRole("searchbox"), "Course");
  const move = screen.getByRole("button", { name: "Move Course name down" });
  move.focus(); await user.keyboard("{Enter}");
  expect(change).toHaveBeenCalledExactlyOnceWith([initial[1], initial[0], initial[2]]);
  await user.clear(screen.getByRole("searchbox"));
  expect(screen.getAllByRole("checkbox")).toEqual(["Status", "Course name", "Instructor"].map(name => screen.getByRole("checkbox", { name })));
  await user.click(screen.getByRole("button", { name: "Move Instructor up" }));
  expect(change).toHaveBeenLastCalledWith([initial[1], initial[2], initial[0]]);
});
