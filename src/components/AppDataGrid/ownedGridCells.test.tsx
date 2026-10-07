// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../experimental/Provider/Provider";
import { SGNavigationProvider } from "../../adapters/navigation";
import { SGTranslationProvider } from "../../i18n";
import { OwnedGridCell, formatOwnedGridDate, ownedGridJson } from "./ownedGridCells";
import type { OwnedGridPresentationColumn } from "./ownedGridColumns";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
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
