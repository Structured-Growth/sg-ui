// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { LearnerClassCard } from "../LearnerClassCard/LearnerClassCard";
import { CardCollectionWithFooter } from "./CardCollectionWithFooter";
afterEach(cleanup);
const rows = [{ id: "1", label: "One" }, { id: "2", label: "Two" }, { id: "3", label: "Three" }];
const defaults = { rows, getRowId: (row: typeof rows[number]) => row.id, page: 0, pageSize: 2, pageSizeOptions: [2, 4],
  onPageChange: vi.fn(), onPageSizeChange: vi.fn(), renderCard: (row: typeof rows[number]) => <article>{row.label}</article> };
describe("CardCollectionWithFooter", () => {
  it("keeps card slicing and footer on the same valid page after shrinking data", () => {
    const callback = vi.fn();
    const { rerender } = render(<CardCollectionWithFooter {...defaults} page={99} onPageChange={callback} />);
    expect(screen.getAllByRole("article").map(node => node.textContent)).toEqual(["Three"]);
    expect(screen.getByText("3-3 of 3")).toBeTruthy();
    rerender(<CardCollectionWithFooter {...defaults} rows={rows.slice(0, 1)} page={99} onPageChange={callback} />);
    expect(screen.getAllByRole("article").map(node => node.textContent)).toEqual(["One"]);
    expect(screen.getByText("1-1 of 1")).toBeTruthy();
    expect(callback).not.toHaveBeenCalled();
  });
  it("composes controlled navigation and size reset with rendered cards", async () => {
    function Controlled() {
      const [page, setPage] = useState(0);
      const [size, setSize] = useState(2);
      return <CardCollectionWithFooter {...defaults} page={page} pageSize={size} onPageChange={setPage} onPageSizeChange={setSize} />;
    }
    render(<Controlled />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Last page" }));
    expect(screen.queryByText("One")).toBeNull();
    expect(screen.getByText("Three")).toBeTruthy();
    await user.selectOptions(screen.getByRole("combobox"), "4");
    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("Page 1 of 1")).toBeTruthy();
  });
  it("withholds pagination requests until the host accepts and requests page zero before size", async () => {
    const requests: string[] = [];
    function Host() {
      const [accept, setAccept] = useState(false);
      const [page, setPage] = useState(1);
      const [size, setSize] = useState(2);
      return <>
        <button onClick={() => setAccept(value => !value)}>Toggle acceptance</button>
        <CardCollectionWithFooter {...defaults} page={page} pageSize={size}
          onPageChange={next => { requests.push(`page:${next}`); if (accept) setPage(next); }}
          onPageSizeChange={next => { requests.push(`size:${next}`); if (accept) setSize(next); }} />
      </>;
    }
    render(<Host />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(requests).toEqual(["page:0"]);
    expect(screen.getAllByRole("article").map(node => node.textContent)).toEqual(["Three"]);
    await user.selectOptions(screen.getByRole("combobox"), "4");
    expect(requests).toEqual(["page:0", "page:0", "size:4"]);
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("2");
    expect(screen.getAllByRole("article").map(node => node.textContent)).toEqual(["Three"]);
    await user.click(screen.getByRole("button", { name: "Toggle acceptance" }));
    await user.selectOptions(screen.getByRole("combobox"), "4");
    expect(requests).toEqual(["page:0", "page:0", "size:4", "page:0", "size:4"]);
    expect(screen.getAllByRole("article").map(node => node.textContent)).toEqual(["One", "Two", "Three"]);
    expect(screen.getByText("1-3 of 3")).toBeTruthy();
  });
  it("preserves keyed card state through reordering", () => {
    function StatefulCard({ label }: { label: string }) { return <input aria-label={label} defaultValue={label} />; }
    const renderCard = (row: typeof rows[number]) => <StatefulCard label={row.label} />;
    const { rerender } = render(<CardCollectionWithFooter {...defaults} renderCard={renderCard} />);
    const one = screen.getByRole("textbox", { name: "One" });
    rerender(<CardCollectionWithFooter {...defaults} rows={[rows[1], rows[0], rows[2]]} renderCard={renderCard} />);
    expect(screen.getByRole("textbox", { name: "One" })).toBe(one);
  });
  it("renders host or fallback empty/loading states and blocks loading navigation", () => {
    const { rerender } = render(<CardCollectionWithFooter {...defaults} rows={[]} />);
    expect(screen.getByText("No courses")).toBeTruthy();
    rerender(<CardCollectionWithFooter {...defaults} rows={[]} emptyContent="No matching topics" />);
    expect(screen.getByText("No matching topics")).toBeTruthy();
    rerender(<CardCollectionWithFooter {...defaults} loading loadingContent="Loading topics" />);
    expect(screen.getByText("Loading topics")).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
    expect(document.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(screen.getAllByRole("button").every(button => (button as HTMLButtonElement).disabled)).toBe(true);
  });
  it("keeps nested course actions separate from pagination and parent submission", async () => {
    const action = vi.fn();
    const page = vi.fn();
    const submit = vi.fn(event => event.preventDefault());
    render(<form onSubmit={submit}><CardCollectionWithFooter {...defaults} pageSize={1} onPageChange={page}
      renderCard={row => <LearnerClassCard courseName={row.label} instructorName="Author" progressPercent={40}
        nextActivity="Read" dueAt="2026-10-10" referenceNow={new Date("2026-10-06T12:00:00Z")} onContinue={action} />} /></form>);
    const user = userEvent.setup();
    screen.getByRole("button", { name: "Continue" }).focus();
    await user.keyboard("{Enter}");
    expect(action).toHaveBeenCalledTimes(1);
    expect(page).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(page).toHaveBeenCalledWith(1);
    expect(action).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
  });
  it("renders server cards with normalized invalid page state", () => {
    const html = renderToString(<CardCollectionWithFooter {...defaults} page={-1} />);
    expect(html).toContain("One");
    expect(html).toContain("1-2 of 3");
  });
});

it("reveals the whole focused card control after native scrolling and cancels on unmount", () => {
  let frame: FrameRequestCallback | undefined;
  const request = vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { frame = callback; return 7; });
  const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  try {
    const { container, unmount } = render(<CardCollectionWithFooter {...defaults} renderCard={row => <input aria-label={row.label} />} />);
    const port = container.querySelector<HTMLElement>('[data-sgui-part="card-collection-grid"]')!;
    const control = screen.getByRole("textbox", { name: "One" });
    Object.defineProperties(port, { clientTop: { value: 2 }, clientHeight: { value: 100 }, scrollHeight: { value: 500 } });
    vi.spyOn(port, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(control, "getBoundingClientRect").mockReturnValue({ top: 170, bottom: 234, height: 64 } as DOMRect);
    control.style.outlineStyle = "solid"; control.style.outlineWidth = "2px"; control.style.outlineOffset = "2px";
    port.scrollTop = 50;
    control.focus();
    expect(port.scrollTop).toBe(50);
    act(() => frame!(0));
    expect(port.scrollTop).toBe(86);
    expect(document.activeElement).toBe(control);
    screen.getByRole("textbox", { name: "Two" }).focus();
    unmount();
    expect(cancel).toHaveBeenCalledWith(7);
  } finally { request.mockRestore(); cancel.mockRestore(); }
});
