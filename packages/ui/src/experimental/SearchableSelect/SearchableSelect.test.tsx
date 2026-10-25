// @vitest-environment jsdom
import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchableSelect } from "./SearchableSelect";
import { searchOptions } from "./option-search";

afterEach(cleanup);
const options = [
  { id: "texarkana", label: "Texarkana" },
  { id: "texas", label: "Texas", keywords: ["TX", "Lone Star State"], description: "Central time" },
  { id: "california", label: "California", keywords: ["CA"] },
  { id: "retired", label: "Retired region", disabled: true },
];

it("ranks explicit aliases and bounded typos without inventing short-query matches", async () => {
  expect(searchOptions(options, " tx ").map(option => option.id)).toEqual(["texas"]);
  expect(searchOptions(options, "Txeas", "fuzzy").map(option => option.id)).toEqual(["texas"]);
  expect(searchOptions(options, "TX", "fuzzy").map(option => option.id)).toEqual(["texas"]);
  expect(searchOptions([{ id: "tx", label: "Texas" }], "TX", "fuzzy")).toEqual([]);
  expect(searchOptions(options, "star lone").map(option => option.id)).toEqual(["texas"]);
  expect(searchOptions([{ id: "cafe", label: "Café" }], "cafe")).toHaveLength(1);
  expect(searchOptions(options, "unmatched", "none")).toHaveLength(4);
  expect(searchOptions(options, "tex", option => option.id === "california")[0]?.id).toBe("california");
  const user = userEvent.setup(), change = vi.fn(), search = vi.fn();
  render(<form aria-label="Address"><SearchableSelect label="State" name="state" options={options} onValueChange={change} onSearchChange={search} clearable/></form>);
  await user.type(screen.getByRole("combobox"), "TX");
  expect(await screen.findByRole("option", { name: "Texas" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "California" })).toBeNull();
  await user.keyboard("{ArrowDown}{Enter}");
  await waitFor(() => expect(change).toHaveBeenLastCalledWith("texas"));
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Texas");
  expect(new FormData(screen.getByRole("form") as HTMLFormElement).get("state")).toBe("texas");
  expect(search).toHaveBeenLastCalledWith("TX");
  await user.click(screen.getByRole("button", { name: "Clear State" }));
  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
  await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
});

it("searches in the popup, clears selection and keeps controlled host acceptance authoritative", async () => {
  const user = userEvent.setup(), change = vi.fn();
  const { rerender } = render(<SearchableSelect label="State" options={options} searchPlacement="dropdown"
    value="california" onValueChange={change} clearable/>);
  await user.click(screen.getByRole("button", { name: /California/ }));
  const unavailable = await screen.findByRole("option", { name: "Retired region" });
  expect(unavailable.getAttribute("aria-disabled")).toBe("true");
  await user.click(unavailable);
  expect(change).not.toHaveBeenCalled();
  const search = await screen.findByRole("searchbox");
  await user.type(search, "TX");
  expect(await screen.findByRole("option", { name: "Texas" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "California" })).toBeNull();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  expect(document.activeElement).toBe(screen.getByRole("button", { name: /California/ }));
  await user.click(screen.getByRole("button", { name: /California/ }));
  await user.type(await screen.findByRole("searchbox"), "TX");
  await user.keyboard("{ArrowDown}{Enter}");
  await waitFor(() => expect(change).toHaveBeenLastCalledWith("texas"));
  expect(screen.getByRole("button", { name: /California/ })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Clear State" }));
  expect(change).toHaveBeenLastCalledWith(null);
  rerender(<SearchableSelect label="State" options={options} searchPlacement="dropdown" value={null} clearable/>);
  expect(screen.queryByRole("button", { name: "Clear State" })).toBeNull();
});

it("isolates instances, restores native defaults and exposes loading/errors without selectable stale results", async () => {
  const user = userEvent.setup(), retry = vi.fn();
  function Host() {
    const [loading, setLoading] = useState(false);
    return <form aria-label="Regions">
      <SearchableSelect label="First state" name="first" options={options} defaultValue="texas" searchPlacement="dropdown"/>
      <SearchableSelect label="Second state" name="second" options={options} defaultValue="california"/>
      <SearchableSelect label="Remote state" options={options} searchPlacement="dropdown" loading={loading}
        searchErrorMessage={loading ? undefined : "Request failed"} onRetry={retry}/>
      <button type="button" onClick={() => setLoading(true)}>Load</button><button type="reset">Reset</button>
    </form>;
  }
  render(<Host/>);
  await user.click(screen.getByRole("button", { name: /Texas First state/ }));
  await user.click(await screen.findByRole("option", { name: "California" }));
  const form = screen.getByRole("form") as HTMLFormElement;
  expect(new FormData(form).get("first")).toBe("california");
  expect((screen.getByRole("combobox", { name: "Second state" }) as HTMLInputElement).value).toBe("California");
  await user.click(screen.getByRole("button", { name: "Reset" }));
  await waitFor(() => expect(new FormData(form).get("first")).toBe("texas"));
  await user.click(screen.getByRole("button", { name: /Remote state/ }));
  expect(await screen.findByText("Request failed")).toBeTruthy();
  expect(screen.queryAllByRole("option")).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "Retry" }));
  expect(retry).toHaveBeenCalledOnce();
  await user.keyboard("{Escape}");
  await user.click(screen.getByRole("button", { name: "Load" }));
  await user.click(screen.getByRole("button", { name: /Remote state/ }));
  expect(await screen.findByText("Loading options…")).toBeTruthy();
  expect(screen.queryAllByRole("option")).toHaveLength(0);
});
