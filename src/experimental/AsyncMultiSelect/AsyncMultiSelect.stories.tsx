import { useEffect, useState } from "react";
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
