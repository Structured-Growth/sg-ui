// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "../../theme";
import { createResponseRaceTransport, ServerResponseRacesFixture } from "./AppDataGridShell.server-response-races.stories";

afterEach(cleanup);
function setup() {
  const transport = createResponseRaceTransport();
  const result = render(<Provider><ServerResponseRacesFixture transport={transport} /></Provider>);
  const user = userEvent.setup();
  const view = (name: "First" | "Second") => within(screen.getByRole("region", { name: `${name} view` }));
  const state = (name: "First" | "Second") => JSON.parse(view(name).getByLabelText(`${name} host state`).textContent!);
  const settle = async (id: number, outcome: "success" | "error") => {
    await act(async () => { transport.settle(id, outcome); await Promise.resolve(); });
  };
  return { ...result, transport, user, view, state, settle };
}
for (const obsoleteOutcome of ["success", "error"] as const) {
  it(`discards older ${obsoleteOutcome} after newer success, retaining criteria, status, focus and independent view`, async () => {
    const { transport, user, view, state, settle } = setup();
    await user.click(view("First").getByRole("button", { name: "Next page" }));
    await user.click(view("First").getByRole("button", { name: "Search", exact: true }));
    const search = view("First").getByRole("searchbox", { name: "Search" });
    await user.type(search, "x");
    // Both promises are dispatched and unresolved before the newer completion.
    expect(transport.getSnapshot().requests).toEqual([
      { id: 1, view: "First", epoch: 1, page: 1, search: "", settled: false },
      { id: 2, view: "First", epoch: 1, page: 0, search: "x", settled: false },
    ]);
    expect(transport.getSnapshot().trace).toEqual([
      "First:1:callback:page", "First:1:callback:state", "First:1:dispatch:1:page=1:search=",
      "First:1:callback:page", "First:1:callback:search", "First:1:callback:state", "First:1:dispatch:2:page=0:search=x",
    ]);
    await user.click(view("Second").getByRole("button", { name: "Next page" }));
    await user.click(view("Second").getByRole("button", { name: "Search", exact: true }));
    await user.type(view("Second").getByRole("searchbox", { name: "Search" }), "y");
    expect(transport.getSnapshot().requests.filter(request => !request.settled)).toHaveLength(4);
    const secondPending = state("Second");
    search.focus();
    await settle(2, "success");
    expect(state("First")).toEqual({ epoch: 1, page: 0, search: "x", status: "ready", error: null, rows: ["First response 2"] });
    expect(view("First").getByRole("checkbox", { name: "Select First response 2" })).toBeTruthy();
    expect(document.activeElement).toBe(search);
    const accepted = state("First");
    await settle(1, obsoleteOutcome);
    expect(state("First")).toEqual(accepted);
    expect(state("Second")).toEqual(secondPending);
    expect(document.activeElement).toBe(search);
    expect(view("First").queryByText("Refreshing rows")).toBeNull();
    expect(view("First").queryByRole("alert")).toBeNull();
    expect(transport.getSnapshot().trace.slice(-4)).toEqual([
      "First:1:settle:2:success", "First:1:commit:2:success",
      `First:1:settle:1:${obsoleteOutcome}`, `First:1:discard:1:${obsoleteOutcome}`,
    ]);
    await settle(4, "success");
    const secondAccepted = state("Second");
    await settle(3, "error");
    expect(state("Second")).toEqual(secondAccepted);
    expect(state("Second").rows).toEqual(["Second response 4"]);
    expect(state("First")).toEqual(accepted);
  });
}
for (const action of ["Replace", "Unmount"] as const) {
  for (const outcome of ["success", "error"] as const) {
    it(`discards ${outcome} after ${action.toLowerCase()} without committing or redispatching`, async () => {
      const { transport, user, view, state, settle, unmount } = setup();
      await user.click(view("First").getByRole("button", { name: "Next page" }));
      await user.click(view("Second").getByRole("button", { name: "Next page" }));
      const other = state("Second");
      const actionButton = view("First").getByRole("button", { name: `${action} First host` });
      await user.click(actionButton);
      const afterDispose = transport.getSnapshot().trace;
      expect(afterDispose.at(-1)).toBe("First:1:disposed");
      await settle(1, outcome);
      expect(transport.getSnapshot().trace).toEqual([...afterDispose, `First:1:settle:1:${outcome}`, `First:1:discard:1:${outcome}`]);
      expect(transport.getSnapshot().requests).toHaveLength(2);
      expect(state("Second")).toEqual(other);
      expect(document.activeElement).toBe(actionButton);
      if (action === "Replace") expect(state("First")).toEqual({ epoch: 2, page: 0, search: "", status: "ready", error: null, rows: ["First initial course"] });
      else expect(view("First").queryByRole("grid")).toBeNull();
      unmount();
      const afterUnmount = transport.getSnapshot().trace;
      await settle(2, outcome);
      expect(transport.getSnapshot().trace).toEqual([...afterUnmount, `Second:1:settle:2:${outcome}`, `Second:1:discard:2:${outcome}`]);
      expect(transport.getSnapshot().requests).toHaveLength(2);
    });
  }
}

it("obsolete settlement cannot clear a newer pending request or replace its committed error", async () => {
  const { transport, user, view, state, settle } = setup();
  await user.click(view("First").getByRole("button", { name: "Next page" }));
  await user.click(view("First").getByRole("button", { name: "Search", exact: true }));
  const search = view("First").getByRole("searchbox", { name: "Search" });
  await user.type(search, "x");
  const pending = state("First");
  await settle(1, "error");
  expect(state("First")).toEqual(pending);
  expect(document.activeElement).toBe(search);
  await user.type(search, "y");
  await settle(3, "error");
  const currentError = state("First");
  expect(currentError.status).toBe("error");
  expect(currentError.error).toBe("Request 3 failed");
  await settle(2, "success");
  expect(state("First")).toEqual(currentError);
  expect(view("First").getByRole("alert").textContent).toContain("Request 3 failed");
  expect(document.activeElement).toBe(search);
  expect(transport.getSnapshot().trace.slice(-4)).toEqual([
    "First:1:settle:3:error", "First:1:commit:3:error", "First:1:settle:2:success", "First:1:discard:2:success",
  ]);
});
