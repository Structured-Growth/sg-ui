// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../../experimental/Provider/Provider";
import { Button } from "../../../experimental/Button/Button";
import { SGTranslationProvider } from "../../../i18n";
import { TableHeaderSortMenu as OwnedGridHeaderSortMenu } from "./header/TableHeaderSortMenu";
import { RowSubHeader as OwnedGridRowSubHeader } from "./RowSubHeader";
import { OwnedGridStatus } from "../ownedGridParts";

afterEach(cleanup);

it("requests canonical sort directions once and restores keyboard focus", async () => {
  const user = userEvent.setup(); const sort = vi.fn();
  const { rerender } = render(<Provider><OwnedGridHeaderSortMenu label="Course" onSortSelect={sort} /></Provider>);
  await user.tab(); await user.keyboard("{ArrowDown}{Enter}");
  expect(sort).toHaveBeenCalledExactlyOnceWith("asc");
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Sort Course" })));
  rerender(<Provider><OwnedGridHeaderSortMenu label="Course" sortDirection="asc" onSortSelect={sort} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Sort Course" }));
  expect(screen.getByRole("menuitemradio", { name: "Sort Ascending" }).getAttribute("aria-checked")).toBe("true");
  await user.click(screen.getByRole("menuitemradio", { name: "Sort Descending" }));
  expect(sort).toHaveBeenLastCalledWith("desc");
  rerender(<Provider><OwnedGridHeaderSortMenu label="Course" sortDirection="desc" onSortSelect={sort} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Sort Course" }));
  await user.click(screen.getByRole("menuitem", { name: "Clear Sort" }));
  expect(sort).toHaveBeenLastCalledWith(undefined); expect(sort).toHaveBeenCalledTimes(3);
});

it("dismisses sort without a transaction and prevents unavailable activation", async () => {
  const sort = vi.fn(); const user = userEvent.setup();
  const { rerender } = render(<Provider theme="dark"><OwnedGridHeaderSortMenu label="Course" onSortSelect={sort} /></Provider>);
  await user.click(screen.getByRole("button"));
  expect(screen.getByRole("menu").closest('[data-sgui-theme="dark"]')).toBeTruthy();
  expect(screen.queryByRole("menuitem", { name: "Clear Sort" })).toBeNull();
  await user.keyboard("{Escape}"); expect(sort).not.toHaveBeenCalled();
  rerender(<Provider><OwnedGridHeaderSortMenu label="Course" disabled onSortSelect={sort} /></Provider>);
  await user.click(screen.getByRole("button")); expect(screen.queryByRole("menu")).toBeNull();
});

it("announces distinct pending, empty, no-results and host error states", async () => {
  const retry = vi.fn(); const user = userEvent.setup(); const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<OwnedGridStatus ref={ref} state="loading" className="host-status" style={{ margin: 2 }} />);
  expect(screen.getByRole("status").textContent).toBe("Loading rows");
  expect(screen.getByRole("progressbar", { name: "Loading rows" })).toBeTruthy();
  expect(ref.current).toBe(screen.getByRole("status")); expect(ref.current?.className).toContain("host-status");
  rerender(<OwnedGridStatus state="refreshing" />); expect(screen.getByRole("status").textContent).toBe("Refreshing rows");
  rerender(<OwnedGridStatus state="empty" />); expect(screen.getByRole("status").textContent).toBe("No rows available");
  expect(screen.queryByRole("progressbar")).toBeNull();
  rerender(<OwnedGridStatus state="noResults" />); expect(screen.getByRole("status").textContent).toBe("No results found");
  rerender(<OwnedGridStatus state="error" message="Network unavailable" onRetry={retry} />);
  expect(screen.getByRole("alert").textContent).toContain("Network unavailable");
  await user.tab(); await user.keyboard("{Enter}"); expect(retry).toHaveBeenCalledExactlyOnceWith();
});

it("keeps retained row controls mounted during refresh", () => {
  const { rerender } = render(<><Button>Course actions</Button><OwnedGridStatus state="refreshing" /></>);
  const action = screen.getByRole("button", { name: "Course actions" }); action.focus();
  rerender(<><Button>Course actions</Button><OwnedGridStatus state="error" /></>);
  expect(screen.getByRole("button", { name: "Course actions" })).toBe(action); expect(document.activeElement).toBe(action);
});

it("exposes host-controlled section actions, keyboard editing and native title double-click", async () => {
  const toggle = vi.fn(); const edit = vi.fn(); const trailing = vi.fn(); const user = userEvent.setup(); const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<OwnedGridRowSubHeader ref={ref} title="Week 1" onToggle={toggle} onTitleDoubleClick={edit}
    titleVariant="subtitle2" titleTooltip="First week" trailingContent={<Button onPress={trailing}>Add lesson</Button>} />);
  const collapse = screen.getByRole("button", { name: "Collapse Week 1" });
  expect(collapse.getAttribute("aria-expanded")).toBe("true");
  await user.tab(); await user.keyboard("{Enter}"); expect(toggle).toHaveBeenCalledExactlyOnceWith();
  expect(collapse.getAttribute("aria-expanded")).toBe("true");
  await user.tab(); await user.keyboard("{Enter}"); expect(edit).toHaveBeenCalledExactlyOnceWith();
  fireEvent.doubleClick(screen.getByTitle("First week")); expect(edit).toHaveBeenCalledTimes(2);
  await user.click(screen.getByRole("button", { name: "Add lesson" })); expect(trailing).toHaveBeenCalledTimes(1);
  expect(toggle).toHaveBeenCalledTimes(1); expect(ref.current?.getAttribute("data-sgui-part")).toBe("grid-row-subheader");
  rerender(<OwnedGridRowSubHeader title="Week 1" expanded={false} onToggle={toggle} />);
  expect(screen.getByRole("button", { name: "Expand Week 1" }).getAttribute("aria-expanded")).toBe("false");
  rerender(<OwnedGridRowSubHeader title="Static section" />); expect(screen.queryByRole("button")).toBeNull();
});

it("forwards translation keys, namespace and interpolation while keeping host labels literal", async () => {
  const lookup = vi.fn((_key, options) => options.defaultMessage === "Sort {column}" ? `Order ${options.values.column}` : `Translated ${options.defaultMessage}`);
  const namespace = vi.fn(); const user = userEvent.setup();
  render(<SGTranslationProvider value={{ locale: "en-US", t: lookup, useNamespace: namespace }}><Provider>
    <OwnedGridHeaderSortMenu label="Host course" onSortSelect={() => {}} /><OwnedGridStatus state="empty" />
  </Provider></SGTranslationProvider>);
  expect(screen.getByText("Host course")).toBeTruthy(); expect(screen.getByRole("status").textContent).toBe("Translated No rows available");
  await user.click(screen.getByRole("button", { name: "Order Host course" }));
  expect(screen.getByRole("menuitemradio", { name: "Translated Sort Ascending" })).toBeTruthy();
  expect(lookup).toHaveBeenCalledWith("common.ui.headerSort.column", { defaultMessage: "Sort {column}", namespace: "common.ui", values: { column: "Host course" } });
  expect(namespace).toHaveBeenCalledWith("common.ui");
});
