// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AsyncMultiSelect } from "./AsyncMultiSelect";
import { HostSearchExample } from "./AsyncMultiSelect.stories";
afterEach(cleanup);
it("aborts superseded host searches and rejects late responses even when transport ignores abort", async () => {
  const user = userEvent.setup();
  const pending: { signal: AbortSignal; resolve: (options: { id: string; label: string }[]) => void }[] = [];
  const search = vi.fn((_query: string, signal: AbortSignal) => new Promise<{ id: string; label: string }[]>(resolve => pending.push({ signal, resolve })));
  const { unmount } = render(<HostSearchExample search={search} />);
  await user.type(screen.getByRole("searchbox"), "x");
  expect(pending[0]!.signal.aborted).toBe(true);
  await act(async () => pending[1]!.resolve([{ id: "current", label: "Current result" }]));
  await act(async () => pending[0]!.resolve([{ id: "stale", label: "Stale result" }]));
  expect(screen.getByRole("option", { name: "Current result" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "Stale result" })).toBeNull();
  unmount(); expect(pending[1]!.signal.aborted).toBe(true);
});
const options = [{ id: "one", label: "Science" }, { id: "two", label: "Mathematics" }, { id: "three", label: "Archived", disabled: true }];
it("selects by keyboard, skips disabled results and serializes IDs", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  render(<form data-testid="form"><AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={options} name="courses" onValueChange={change} /><button type="reset">Reset</button></form>);
  await user.tab(); await user.tab(); await user.keyboard("{Home} {End} ");
  expect(change.mock.calls.at(-1)?.[0].map((item: { id: string }) => item.id)).toEqual(["one", "two"]);
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).getAll("courses")).toEqual(["one", "two"]);
  await user.click(screen.getByRole("button", { name: "Reset" }));
  expect(new FormData(screen.getByTestId("form") as HTMLFormElement).getAll("courses")).toEqual([]);
});
it("keeps selected records outside search results and restores search focus after removal", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const { rerender } = render(<AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={options} defaultValue={[options[0]!]} onValueChange={change} />);
  rerender(<AsyncMultiSelect label="Courses" query="Math" onQueryChange={() => {}} options={[options[1]!]} defaultValue={[options[0]!]} onValueChange={change} />);
  await user.click(screen.getByRole("option", { name: "Mathematics" }));
  expect(change.mock.calls.at(-1)?.[0].map((item: { id: string }) => item.id)).toEqual(["one", "two"]);
  await user.click(screen.getByRole("button", { name: "Remove Science" }));
  expect(change.mock.calls.at(-1)?.[0].map((item: { id: string }) => item.id)).toEqual(["two"]);
  expect(document.activeElement).toBe(screen.getByRole("searchbox"));
});
it("exposes loading, error, retry and empty states and blocks stale results during loading", async () => {
  const user = userEvent.setup(); const change = vi.fn(); const retry = vi.fn();
  const { rerender } = render(<AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={options} loading onValueChange={change} />);
  expect(screen.getByRole("status").textContent).toBe("Loading options…");
  await user.click(screen.getByRole("option", { name: "Science" })); expect(change).not.toHaveBeenCalled();
  rerender(<AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={[]} errorMessage="Search failed" onRetry={retry} />);
  expect(screen.getByRole("status").textContent).toBe("Search failed");
  await user.click(screen.getByRole("button", { name: "Retry" })); expect(retry).toHaveBeenCalledOnce();
  rerender(<AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={[]} />);
  expect(screen.getByRole("status").textContent).toBe("No options found");
});
it("respects controlled selection and read-only state with a long result list", async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const many = Array.from({ length: 200 }, (_, i) => ({ id: String(i), label: `Course ${i}` }));
  const { rerender } = render(<AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={many} value={[many[0]!]} onValueChange={change} />);
  await user.click(screen.getByRole("option", { name: "Course 199" }));
  expect(change.mock.calls.at(-1)?.[0].map((item: { id: string }) => item.id)).toEqual(["0", "199"]);
  expect(screen.queryByRole("button", { name: "Remove Course 199" })).toBeNull();
  rerender(<AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}} options={many} value={[many[0]!]} onValueChange={change} readOnly />);
  change.mockClear(); await user.click(screen.getByRole("option", { name: "Course 1" })); expect(change).not.toHaveBeenCalled();
  expect((screen.getByRole("searchbox") as HTMLInputElement).readOnly).toBe(true);
});
