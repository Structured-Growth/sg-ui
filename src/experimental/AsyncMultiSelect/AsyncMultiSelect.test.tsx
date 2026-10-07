// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { StrictMode } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Provider } from "../Provider/Provider";
import { SGTranslationProvider, formatIcuMessage } from "../../i18n";
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

it("isolates selected records, statuses and native form values across instances", async () => {
 const user = userEvent.setup();
 render(<form data-testid="independent"><AsyncMultiSelect label="First courses" query="" onQueryChange={() => {}} options={options} name="first" /><AsyncMultiSelect label="Second courses" query="" onQueryChange={() => {}} options={options} name="second" defaultValue={[options[1]!]} /></form>);
 await user.click(screen.getAllByRole("option", { name: "Science" })[0]!);
 const form = screen.getByTestId("independent") as HTMLFormElement;
 expect(new FormData(form).getAll("first")).toEqual(["one"]);
 expect(new FormData(form).getAll("second")).toEqual(["two"]);
 const inputs = screen.getAllByRole("searchbox");
 expect(inputs[0]!.id).not.toBe(inputs[1]!.id);
 expect(inputs[0]!.getAttribute("aria-describedby")).not.toBe(inputs[1]!.getAttribute("aria-describedby"));
});
it("rejects late failures through Strict Mode cleanup, retries and unmount", async () => {
 const user = userEvent.setup();
 const pending: { signal: AbortSignal; resolve: (results: typeof options) => void; reject: (error: Error) => void }[] = [];
 const search = vi.fn((_query: string, signal: AbortSignal) => new Promise<typeof options>((resolve, reject) => pending.push({ signal, resolve, reject })));
 const { unmount } = render(<StrictMode><HostSearchExample search={search} /></StrictMode>);
 expect(pending).toHaveLength(2); expect(pending[0]!.signal.aborted).toBe(true);
 await user.type(screen.getByRole("searchbox"), "x");
 expect(pending[1]!.signal.aborted).toBe(true);
 await act(async () => pending[2]!.reject(new Error("Current failure")));
 expect(screen.getByRole("status").textContent).toBe("Search failed. Try again.");
 await user.click(screen.getByRole("button", { name: "Retry" }));
 expect(screen.getByRole("status").textContent).toBe("Loading options…");
 await act(async () => pending[3]!.resolve([options[0]!]));
 await act(async () => { pending[0]!.reject(new Error("Strict replay")); pending[1]!.reject(new Error("Stale failure")); });
 expect(screen.getByRole("option", { name: "Science" })).toBeTruthy();
 expect(screen.getByRole("status").textContent).toBe("1 options available");
 await user.type(screen.getByRole("searchbox"), "y");
 unmount(); expect(pending[4]!.signal.aborted).toBe(true);
 await act(async () => pending[4]!.reject(new Error("After unmount")));
});
it("accepts controlled clear without reviving defaults and omits disabled native values", async () => {
 const user = userEvent.setup(); const change = vi.fn();
 const props = { label: "Controlled courses", query: "", onQueryChange: () => {}, options, name: "courses", defaultValue: [options[1]!], onValueChange: change };
 const { rerender } = render(<form data-testid="controlled"><AsyncMultiSelect {...props} value={[options[0]!]} /></form>);
 await user.click(screen.getByRole("button", { name: "Remove Science" }));
 expect(change).toHaveBeenLastCalledWith([]);
 expect(screen.getByRole("button", { name: "Remove Science" })).toBeTruthy();
 rerender(<form data-testid="controlled"><AsyncMultiSelect {...props} value={[]} /></form>);
 expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
 expect(new FormData(screen.getByTestId("controlled") as HTMLFormElement).getAll("courses")).toEqual([]);
 rerender(<form data-testid="controlled"><AsyncMultiSelect {...props} value={[options[0]!]} disabled /></form>);
 expect(new FormData(screen.getByTestId("controlled") as HTMLFormElement).getAll("courses")).toEqual([]);
 change.mockClear(); await user.click(screen.getByRole("option", { name: "Mathematics" }));
 expect(change).not.toHaveBeenCalled();
});

for (const controlled of [false, true]) {
 it(`honors prevented reset and silently preserves ${controlled ? "controlled selection" : "latest defaults"} in StrictMode`, async () => {
  const user = userEvent.setup(); const change = vi.fn(); const queryChange = vi.fn();
  const props = { label: "Reset courses", name: "courses", query: "Science", onQueryChange: queryChange, options, defaultValue: [options[1]!], onValueChange: change };
  const { rerender } = render(<StrictMode><form data-testid="reset" onReset={event => event.preventDefault()}>
   <AsyncMultiSelect {...props} value={controlled ? [options[0]!] : undefined} />
  </form></StrictMode>);
  if (!controlled) await user.click(screen.getByRole("button", { name: "Remove Mathematics" }));
  const form = screen.getByTestId("reset") as HTMLFormElement; change.mockClear();
  await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(new FormData(form).getAll("courses")).toEqual(controlled ? ["one"] : []);
  expect(screen.getByRole("searchbox")).toHaveProperty("value", "Science");
  expect(change).not.toHaveBeenCalled(); expect(queryChange).not.toHaveBeenCalled();
  rerender(<StrictMode><form data-testid="reset"><AsyncMultiSelect {...props}
   defaultValue={[options[0]!]} value={controlled ? [] : undefined} /></form></StrictMode>);
  await act(async () => { form.reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(new FormData(form).getAll("courses")).toEqual(controlled ? [] : ["one"]);
  expect(screen.getByRole("searchbox")).toHaveProperty("value", "Science");
  expect(change).not.toHaveBeenCalled(); expect(queryChange).not.toHaveBeenCalled();
 });
}
it("reset clears selection without changing the host query or reviving stale request selections", async () => {
 const user = userEvent.setup();
 const pending: { signal: AbortSignal; resolve: (results: typeof options) => void }[] = [];
 const search = vi.fn((_query: string, signal: AbortSignal) => new Promise<typeof options>(resolve => pending.push({ signal, resolve })));
 const { unmount } = render(<StrictMode><form data-testid="search-reset"><HostSearchExample search={search} /></form></StrictMode>);
 await act(async () => pending[1]!.resolve([options[0]!]));
 await user.click(screen.getByRole("option", { name: "Science" }));
 await user.type(screen.getByRole("searchbox"), "x");
 await act(async () => { (screen.getByTestId("search-reset") as HTMLFormElement).reset(); await new Promise(resolve => setTimeout(resolve, 10)); });
 expect(search).toHaveBeenCalledTimes(3); expect(pending[1]!.signal.aborted).toBe(true);
 expect(pending[2]!.signal.aborted).toBe(false); expect(screen.getByRole("searchbox")).toHaveProperty("value", "x");
 await act(async () => { pending[0]!.resolve([options[0]!]); pending[2]!.resolve([options[1]!]); });
 expect(screen.queryByRole("option", { name: "Science" })).toBeNull();
 expect(screen.getByRole("option", { name: "Mathematics" })).toBeTruthy();
 expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
 unmount(); expect(pending[2]!.signal.aborted).toBe(true);
 await act(async () => pending[2]!.resolve([options[0]!]));
});


it("inherits independent visual directions without replacing host queries or mounted results", async () => {
 const user = userEvent.setup(); const queryChange = vi.fn(); const change = vi.fn();
 function Pair({ reverse = false, loading = false, revision = 0 }) {
  return <>{["en-US", "ar-EG"].map(locale => <SGTranslationProvider key={locale}
   value={{ locale, t: (_key, options) => formatIcuMessage(options.defaultMessage, locale, options.values), useNamespace: () => {} }}>
   <Provider dir={reverse ? (locale === "en-US" ? "ltr" : "rtl") : (locale === "en-US" ? "rtl" : "ltr")}>
    <ThemeScope data-testid={locale}>
     <AsyncMultiSelect label={locale} query="Host query" onQueryChange={queryChange} options={options}
      defaultValue={[options[0]!]} onValueChange={change} loading={loading} description={`Revision ${revision}`} />
    </ThemeScope>
   </Provider>
  </SGTranslationProvider>)}</>;
 }
 const { rerender } = render(<Pair />);
 const inputs = screen.getAllByRole("searchbox"); const lists = screen.getAllByRole("listbox");
 for (const [index, locale] of ["en-US", "ar-EG"].entries()) {
  const scope = screen.getByTestId(locale);
  expect(scope.getAttribute("dir")).toBe(index === 0 ? "rtl" : "ltr");
  expect(scope.getAttribute("lang")).toBe(locale);
  // Inline descendants inherit the visual scope; none replaces it with a locale-derived dir.
  expect(lists[index]!.closest("[dir]")).toBe(scope);
  expect(inputs[index]!.closest("[dir]")).toBe(scope);
 }
 await user.click(screen.getAllByRole("button", { name: "Remove Science" })[0]!);
 expect(document.activeElement).toBe(inputs[0]);
 expect(screen.getAllByRole("button", { name: "Remove Science" })).toHaveLength(1);
 change.mockClear();
 rerender(<Pair reverse loading revision={1} />);
 for (const [index, locale] of ["en-US", "ar-EG"].entries()) {
  expect(screen.getAllByRole("searchbox")[index]).toBe(inputs[index]);
  expect(screen.getAllByRole("listbox")[index]).toBe(lists[index]);
  expect(inputs[index]).toHaveProperty("value", "Host query");
  expect(screen.getByTestId(locale).getAttribute("dir")).toBe(index === 0 ? "ltr" : "rtl");
  expect(screen.getAllByRole("status")[index]!.textContent).toBe("Loading options…");
 }
 expect(document.activeElement).toBe(inputs[0]);
 await user.click(screen.getAllByRole("option", { name: "Mathematics" })[0]!);
 expect(change).not.toHaveBeenCalled(); expect(queryChange).not.toHaveBeenCalled();
 expect(screen.getAllByRole("button", { name: "Remove Science" })).toHaveLength(1);
});
