// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Provider } from "../../theme";
import { CardCollectionWithFooter, type CardCollectionWithFooterProps } from "./index";

afterEach(cleanup);

it("isolates identical row IDs, controlled pagination and card drafts across sibling removal", async () => {
  const requests = vi.fn();
  const rows = [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
  function Collection({ name }: { name: string }) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(1);
    const props: CardCollectionWithFooterProps<typeof rows[number]> = {
      rows, getRowId: row => row.id, page, pageSize, pageSizeOptions: [1, 2],
      paginationLabel: `${name} pagination`,
      onPaginationModelChange: model => { requests(name, model); setPage(model.page); setPageSize(model.pageSize); },
      renderCard: row => <input aria-label={`${name} ${row.label}`} defaultValue={row.label} />,
    };
    return <CardCollectionWithFooter {...props} />;
  }
  function Host() {
    const [showFirst, setShowFirst] = useState(true);
    return <Provider><button onClick={() => setShowFirst(false)}>Remove first collection</button>
      {showFirst && <Collection key="first" name="First" />}
      <Collection key="second" name="Second" />
    </Provider>;
  }
  render(<Host />);
  const user = userEvent.setup();
  const draft = screen.getByRole("textbox", { name: "Second One" });
  await user.clear(draft);
  await user.type(draft, "Retained sibling draft");
  await user.click(within(screen.getByRole("navigation", { name: "First pagination" })).getByRole("button", { name: "Next page" }));
  expect(screen.getByRole("textbox", { name: "First Two" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Second One" })).toBe(draft);
  expect((draft as HTMLInputElement).value).toBe("Retained sibling draft");
  expect(requests.mock.calls).toEqual([["First", {page:1,pageSize:1}]]);
  await user.click(screen.getByRole("button", { name: "Remove first collection" }));
  expect(screen.queryByRole("navigation", { name: "First pagination" })).toBeNull();
  expect(screen.getByRole("textbox", { name: "Second One" })).toBe(draft);
  expect((draft as HTMLInputElement).value).toBe("Retained sibling draft");
  await user.click(within(screen.getByRole("navigation", { name: "Second pagination" })).getByRole("button", { name: /Rows per page/ })); await user.click(screen.getByRole("option", { name: "2", exact: true }));
  expect(requests.mock.calls).toEqual([["First", {page:1,pageSize:1}], ["Second", {page:0,pageSize:2}]]);
  expect(screen.getByRole("textbox", { name: "Second One" })).toBe(draft);
  expect(screen.getByRole("textbox", { name: "Second Two" })).toBeTruthy();
});
