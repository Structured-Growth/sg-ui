// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider } from "../../i18n";
import { OwnedGridCell, formatOwnedGridDate, ownedGridJson } from "./ownedGridCells";
import type { OwnedGridPresentationColumn } from "./ownedGridColumns";
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });
const row = { id: "row", name: "Sample", image: "/image.png" };
const base: OwnedGridPresentationColumn<typeof row> = { field: "name", headerName: "Name" };

it("renders text, empty fallbacks, JSON escaped content and cyclic fallback", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<OwnedGridCell ref={ref} row={row} column={base} value={false} />);
  expect(screen.getByText("false")).toBeTruthy();
  expect(ref.current?.dataset.sguiPart).toBe("grid-cell-content");
  rerender(<OwnedGridCell row={row} column={{ ...base, fallbackText: "Empty" }} value={null} />);
  expect(screen.getByText("Empty")).toBeTruthy();
  const value = { html: "<img src=x onerror=alert(1)>" };
  rerender(<OwnedGridCell row={row} column={{ ...base, cellType: "json" }} value={value} />);
  expect(screen.queryByRole("img")).toBeNull();
  expect(screen.getByText(JSON.stringify(value))).toBeTruthy();
  const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
  expect(ownedGridJson(cyclic, "Invalid JSON")).toBe("Invalid JSON");
  expect(ownedGridJson(1n)).toBe("—");
});

it("formats literal dates in host locale without calendar drift and rejects invalid dates", () => {
  expect(formatOwnedGridDate("2026-10-06", { locale: "en-US", timeZone: "America/Los_Angeles", cellType: "date" })).toBe("Oct 6, 2026");
  expect(formatOwnedGridDate("2026-10-06", { locale: "de-DE", timeZone: "Pacific/Kiritimati", cellType: "dateTime" })).toBe("6. Okt. 2026");
  for (const value of ["2026-02-30", "2026-02-30T10:00:00Z", "2026-10-06T12:00:00", "bad", new Date(NaN), null]) {
    expect(formatOwnedGridDate(value, { locale: "en-US", cellType: "date" }, "Invalid")).toBe("Invalid");
  }
  const formatter = vi.fn(() => "Host display");
  expect(formatOwnedGridDate("2026-10-06", { locale: "en-US", cellType: "dateTime", timeZone: "America/Chicago" }, "—", formatter)).toBe("Host display");
  expect(formatter.mock.calls[0]?.[1]).toEqual({ locale: "en-US", cellType: "dateTime", timeZone: "UTC", dateOnly: true });
});

it("uses translation locale, host timestamp zone and owned custom row callbacks", () => {
  const timestamp = "2026-10-06T02:00:00Z";
  const { rerender } = render(<SGTranslationProvider value={{ locale: "de-DE", useNamespace: () => {}, t: (_key, options) => options.defaultMessage }}>
    <OwnedGridCell row={row} column={{ ...base, cellType: "date" }} value={timestamp} timeZone="America/Los_Angeles" />
  </SGTranslationProvider>);
  expect(screen.getByText("5. Okt. 2026")).toBeTruthy();
  const custom = vi.fn(value => <strong>{value.name}</strong>);
  rerender(<OwnedGridCell row={row} column={{ ...base, cellType: "custom", renderCustomCell: custom }} value="Ignored" />);
  expect(custom).toHaveBeenCalledWith(row);
  expect(screen.getByText("Sample").tagName).toBe("STRONG");
});

it("uses the owned navigation adapter for link cells and displays link fallbacks", async () => {
  const navigate = vi.fn();
  const { rerender } = render(<SGNavigationProvider value={{ pathname: "/", navigate }}>
    <OwnedGridCell row={row} column={{ ...base, cellType: "link", getLink: () => ({ href: "/course", label: "Open course" }) }} value="Raw" />
  </SGNavigationProvider>);
  await userEvent.setup().click(screen.getByRole("link", { name: "Open course" }));
  expect(navigate).toHaveBeenCalledOnce();
  expect(navigate).toHaveBeenCalledWith("/course", { replace: undefined });
  rerender(<OwnedGridCell row={row} column={{ ...base, cellType: "link" }} value={null} />);
  expect(screen.queryByRole("link")).toBeNull();
  expect(screen.getByText("—")).toBeTruthy();
});

it("shows a fallback on image failure and retries when the source changes", () => {
  const { rerender } = render(<OwnedGridCell row={row} rowLabel="Course cover" value={null}
    column={{ ...base, cellType: "image", getImageSrc: () => "/first.png", fallbackText: "No cover" }} />);
  fireEvent.error(screen.getByRole("img", { name: "Course cover" }));
  expect(screen.getByText("No cover")).toBeTruthy();
  rerender(<OwnedGridCell row={row} rowLabel="Course cover" value={null}
    column={{ ...base, cellType: "image", getImageSrc: () => "/second.png" }} />);
  expect(screen.getByRole("img")).toHaveProperty("src", "http://localhost:3000/second.png");
});

it("announces clipboard success and failure, disables empty values", async () => {
  const user = userEvent.setup();
  const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const { rerender } = render(<Provider><OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value="Copy me" /></Provider>);
  await user.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Copied"));
  expect(writeText).toHaveBeenCalledExactlyOnceWith("Copy me");
  writeText.mockRejectedValueOnce(new Error("Denied"));
  await user.click(screen.getByRole("button", { name: "Copy" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Unable to copy"));
  rerender(<Provider><OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value={null} /></Provider>);
  expect(screen.getByRole("button", { name: "Copy" })).toHaveProperty("disabled", true);
  expect(screen.getByRole("status").textContent).toBe("");
});

it("ignores stale clipboard completions after a value change", async () => {
  const user = userEvent.setup();
  let resolve!: () => void;
  vi.spyOn(navigator.clipboard, "writeText").mockImplementation(() => new Promise<void>(done => { resolve = done; }));
  const { rerender } = render(<Provider><OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value="Old" /></Provider>);
  await user.click(screen.getByRole("button", { name: "Copy" }));
  rerender(<Provider><OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value="New" /></Provider>);
  resolve();
  await waitFor(() => expect(screen.getByRole("button", { name: "Copy" })).toHaveProperty("disabled", false));
  expect(screen.getByRole("status").textContent).toBe("");
});

it("activates row menu callbacks once and keeps unavailable/pending actions disabled", async () => {
  const user = userEvent.setup();
  const onPress = vi.fn();
  render(<Provider><OwnedGridCell row={row} rowLabel="Sample" value={null} column={{ ...base, cellType: "menu", getMenuActions: () => [
    { id: "edit", label: "Edit", onPress }, { id: "pending", label: "Pending action", onPress, pending: true },
    { id: "missing", label: "Unavailable" }, { id: "external", label: "External", href: "https://example.com", target: "_blank", rel: "external" },
  ] }} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Actions for Sample" }));
  expect(screen.getByRole("menuitem", { name: "Pending action" }).getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByRole("menuitem", { name: "Unavailable" }).getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByRole("menuitem", { name: "External" }).getAttribute("target")).toBe("_blank");
  expect(screen.getByRole("menuitem", { name: "External" }).getAttribute("rel")).toContain("noopener");
  await user.click(screen.getByRole("menuitem", { name: "Edit" }));
  expect(onPress).toHaveBeenCalledExactlyOnceWith(row);
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Actions for Sample" })));
});


it("bounds translated feedback and restarts its lifetime independently for each cell", async () => {
  userEvent.setup();
  const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  vi.useFakeTimers();
  render(<SGTranslationProvider value={{ locale: "de-DE", useNamespace: () => {},
    t: (key, options) => key === "common.ui.grid.copySuccess" ? "Kopiert" : key === "common.ui.grid.copyError" ? "Kopieren fehlgeschlagen" : options.defaultMessage }}>
    <Provider>{["First", "Second"].map(value => <OwnedGridCell key={value} row={row} column={{ ...base, cellType: "copyable" }} value={value} />)}</Provider>
  </SGTranslationProvider>);
  const buttons = screen.getAllByRole("button", { name: "Copy" });
  const statuses = screen.getAllByRole("status");
  await act(async () => { fireEvent.click(buttons[0]!); });
  expect(statuses.map(node => node.textContent)).toEqual(["Kopiert", ""]);
  act(() => vi.advanceTimersByTime(2000));
  writeText.mockRejectedValueOnce(new Error("Denied"));
  await act(async () => { fireEvent.click(buttons[1]!); });
  expect(statuses.map(node => node.textContent)).toEqual(["Kopiert", "Kopieren fehlgeschlagen"]);
  await act(async () => { fireEvent.click(buttons[0]!); });
  act(() => vi.advanceTimersByTime(1000));
  expect(statuses.map(node => node.textContent)).toEqual(["Kopiert", "Kopieren fehlgeschlagen"]);
  act(() => vi.advanceTimersByTime(2000));
  expect(statuses.map(node => node.textContent)).toEqual(["", ""]);
});

it("cleans timers on value replacement and unmount and ignores late rejection", async () => {
  userEvent.setup();
  const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  vi.useFakeTimers();
  const cell = (value: string) => <Provider><OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value={value} /></Provider>;
  const { rerender, unmount } = render(cell("Old"));
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copy" })); });
  expect(vi.getTimerCount()).toBe(1);
  rerender(cell("New"));
  expect(vi.getTimerCount()).toBe(0);
  expect(screen.getByRole("status").textContent).toBe("");
  let reject!: (reason: Error) => void;
  writeText.mockImplementationOnce(() => new Promise<void>((_done, fail) => { reject = fail; }));
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copy" })); });
  unmount();
  await act(async () => { reject(new Error("Late denial")); });
  expect(vi.getTimerCount()).toBe(0);
});

it("isolates pending cells and copies the formatted escaped JSON without moving host focus", async () => {
  const user = userEvent.setup();
  let resolve!: () => void;
  const writeText = vi.spyOn(navigator.clipboard, "writeText").mockImplementationOnce(() => new Promise<void>(done => { resolve = done; })).mockResolvedValue(undefined);
  const payload = { html: '<script>alert("quoted")</script>', text: "First\nSecond & third" };
  render(<Provider><section aria-label="First copy"><OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value="First" /></section>
    <section aria-label="JSON copy"><OwnedGridCell row={row} column={{ ...base, cellType: "copyable", formatValue: value => JSON.stringify(value) }} value={payload} /></section>
    <button>Host action</button></Provider>);
  const first = within(screen.getByRole("region", { name: "First copy" }));
  const second = within(screen.getByRole("region", { name: "JSON copy" }));
  await user.click(first.getByRole("button", { name: "Copy" }));
  await user.click(second.getByRole("button", { name: "Copy" }));
  expect(writeText).toHaveBeenNthCalledWith(2, JSON.stringify(payload));
  expect(first.getByRole("status").textContent).toBe("");
  expect(second.getByRole("status").textContent).toBe("Copied");
  const host = screen.getByRole("button", { name: "Host action" });
  await user.click(host);
  await act(async () => { resolve(); });
  expect(first.getByRole("status").textContent).toBe("Copied");
  expect(document.activeElement).toBe(host);
  expect(document.querySelector("script")).toBeNull();
});


it("releases settled feedback timers when a cell unmounts", async () => {
  userEvent.setup();
  vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  vi.useFakeTimers();
  const { unmount } = render(<OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value="Dispose" />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copy" })); });
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});


it("invalidates a pending write when an empty value keeps the same displayed fallback", async () => {
  const user = userEvent.setup();
  let resolve!: () => void;
  vi.spyOn(navigator.clipboard, "writeText").mockImplementation(() => new Promise<void>(done => { resolve = done; }));
  const cell = (value: string | null) => <OwnedGridCell row={row} column={{ ...base, cellType: "copyable" }} value={value} />;
  const { rerender } = render(cell("—"));
  await user.click(screen.getByRole("button", { name: "Copy" }));
  rerender(cell(null));
  await act(async () => { resolve(); });
  expect(screen.getByRole("button", { name: "Copy" })).toHaveProperty("disabled", true);
  expect(screen.getByRole("status").textContent).toBe("");
});
