import { StrictMode, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsyncMultiSelect, type MultiSelectOption } from "./AsyncMultiSelect";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
const courses = Array.from({ length: 200 }, (_, index) => ({ id: String(index), label: `Course ${index + 1}` }));
/** This is a host adapter example, with no application endpoint or library-owned fetching. */
export function HostSearchExample({ search = sampleSearch }: { search?: (query: string, signal: AbortSignal) => Promise<MultiSelectOption[]> }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<MultiSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(undefined);
    search(query, controller.signal).then(results => {
      // Also reject stale responses from hosts whose transport ignores abort.
      if (!controller.signal.aborted) { setOptions(results); setLoading(false); }
    }, () => {
      if (!controller.signal.aborted) { setError("Search failed. Try again."); setOptions([]); setLoading(false); }
    });
    return () => controller.abort();
  }, [query, retry, search]);
  return <AsyncMultiSelect label="Courses" query={query} onQueryChange={setQuery} options={options}
    loading={loading} errorMessage={error} onRetry={() => setRetry(value => value + 1)}
    description="Search 200 host-supplied courses. Selected records survive searches." name="courses" />;
}
function sampleSearch(query: string, signal: AbortSignal): Promise<MultiSelectOption[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(courses.filter(course => course.label.toLowerCase().includes(query.toLowerCase()))), 400);
    signal.addEventListener("abort", () => { clearTimeout(timer); reject(new Error("Canceled")); }, { once: true });
  });
}
const meta = { title: "Migration proofs/AsyncMultiSelect", component: AsyncMultiSelect, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>],
  args: { label: "Courses", query: "", onQueryChange: () => {}, options: courses },
} satisfies Meta<typeof AsyncMultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HostSearch: Story = { render: () => <HostSearchExample /> };
export const Empty: Story = { args: { options: [] } };
export const FailedSearch: Story = { args: { options: [], errorMessage: "Search failed.", onRetry: () => {} } };
export const ReadOnly: Story = { args: { value: [courses[0]!], readOnly: true } };

/** Manually settle requests in any order; the transport intentionally ignores abort. */
function RaceExample() {
 const [requests, setRequests] = useState<{ query: string; resolve: (options: MultiSelectOption[]) => void; reject: (error: Error) => void }[]>([]);
 const [search] = useState(() => (query: string, _signal: AbortSignal) => new Promise<MultiSelectOption[]>((resolve, reject) => {
   setRequests(current => [...current, { query, resolve, reject }]);
 }));
 return <><HostSearchExample search={search} />{requests.map((request, index) => <div key={index}>
   <Button onPress={() => request.resolve([{ id: `result-${index}`, label: `Result ${request.query || "initial"}` }])}>Resolve request {index}</Button>
   <Button onPress={() => request.reject(new Error("Search failed"))}>Reject request {index}</Button>
 </div>)}</>;
}
export const RequestRace: Story = { render: () => <RaceExample /> };
export const Loading: Story = { args: { loading: true } };
export const Independent: Story = { render: () => <form>
 <AsyncMultiSelect label="First courses" name="first" query="" onQueryChange={() => {}} options={[{ id: "01", label: "Science" }, { id: "locked", label: "Archived", disabled: true }, { id: "1", label: "Mathematics" }]} />
 <AsyncMultiSelect label="Second courses" name="second" query="" onQueryChange={() => {}} options={[{ id: "01", label: "Science" }, { id: "1", label: "Mathematics" }]} defaultValue={[{ id: "1", label: "Mathematics" }]} />
 </form> };

function NativeResetExample() {
 const [prevent, setPrevent] = useState(false);
 const [query, setQuery] = useState("Course");
 const [changes, setChanges] = useState(0);
 const [queryChanges, setQueryChanges] = useState(0);
 const options = courses.slice(0, 2);
 return <StrictMode><label><input type="checkbox" checked={prevent} onChange={event => setPrevent(event.target.checked)} />Prevent form reset</label>
  <form onReset={event => { if (prevent) event.preventDefault(); }}>
   <AsyncMultiSelect label="Reset courses" name="courses" options={options} defaultValue={[options[0]!]} query={query}
    onQueryChange={next => { setQuery(next); setQueryChanges(count => count + 1); }} onValueChange={() => setChanges(count => count + 1)} />
   <AsyncMultiSelect label="Controlled courses" name="controlledCourses" options={options} value={[options[1]!]} defaultValue={[options[0]!]}
    query="Controlled" onQueryChange={() => setQueryChanges(count => count + 1)} onValueChange={() => setChanges(count => count + 1)} />
   <button type="reset">Reset courses</button>
  </form><output aria-label="Selection changes">{changes}</output><output aria-label="Query changes">{queryChanges}</output>
 </StrictMode>;
}
export const NativeFormReset: Story = { render: () => <NativeResetExample /> };
export const NativeSearchReset: Story = { render: () => <StrictMode><form><RaceExample /><button type="reset">Reset search selection</button></form></StrictMode> };


function NativeBusyExample() {
 const [state, setState] = useState<"loading" | "error" | "success">("loading");
 const [query, setQuery] = useState("Host query");
 const [changes, setChanges] = useState(0);
 const [queryChanges, setQueryChanges] = useState(0);
 const results = [{ id: "stale", label: "Retained result" }];
 return <>
  <AsyncMultiSelect label="Pending courses" query={query} onQueryChange={next => { setQuery(next); setQueryChanges(count => count + 1); }}
   options={state === "success" ? [{ id: "current", label: "Current result" }] : results}
   loading={state === "loading"} errorMessage={state === "error" ? "Host search failed" : undefined}
   onRetry={() => setState("loading")} onValueChange={() => setChanges(count => count + 1)}
   description="The host controls loading, errors, retry and results." />
  <AsyncMultiSelect label="Independent courses" query="Independent query" onQueryChange={() => {}}
   options={[{ id: "independent", label: "Independent result" }]} />
  <Button onPress={() => setState("error")}>Fail host search</Button>
  <Button onPress={() => setState("success")}>Resolve host search</Button>
  <Button onPress={() => setState("loading")}>Start host search</Button>
  <output aria-label="Selection changes">{changes}</output>
  <output aria-label="Query changes">{queryChanges}</output>
 </>;
}
export const NativeBusyLifecycle: Story = { render: () => <StrictMode><NativeBusyExample /></StrictMode> };
