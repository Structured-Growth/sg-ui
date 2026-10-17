// @vitest-environment jsdom
import {afterEach, expect, it} from "vitest";
import {cleanup, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Checkbox} from "./Checkbox";
afterEach(cleanup);
function describedNodes(input: HTMLElement) {
  const ids = (input.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
  expect(ids.length).toBeGreaterThan(0);
  return ids.map(id => {
    const node = document.getElementById(id);
    expect(node, `mounted description ${id}`).not.toBeNull();
    return node!;
  });
}
it("keeps error references mounted and empty until validation, then clears them on reset", async () => {
  const user = userEvent.setup();
  render(<form onSubmit={event => event.preventDefault()}>
    <Checkbox label="Accept terms" name="terms" required description="Required to register" errorMessage="Accept before submitting" />
    <button type="submit">Submit</button><button type="reset">Reset</button>
  </form>);
  const input = screen.getByRole("checkbox", {name: "Accept terms"});
  expect(describedNodes(input).map(node => node.textContent).join(" ")).toContain("Required to register");
  expect(describedNodes(input).map(node => node.textContent).join(" ")).not.toContain("Accept before submitting");
  await user.click(screen.getByText("Submit"));
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(describedNodes(input).map(node => node.textContent).join(" ")).toContain("Accept before submitting");
  await user.click(screen.getByText("Reset"));
  expect(input.getAttribute("aria-invalid")).not.toBe("true");
  expect(describedNodes(input).map(node => node.textContent).join(" ")).not.toContain("Accept before submitting");
});
it("keeps repeated host-invalid error IDs distinct across message and placement updates", () => {
  const fields = (invalid: boolean, error: string) => <>
    <Checkbox label="First approval" description="First guidance" invalid={invalid} errorMessage={error} errorPlacement="above" />
    <Checkbox label="Second approval" description="Second guidance" errorMessage="Second error" errorPlacement="below" />
  </>;
  const {rerender} = render(fields(true, "First error"));
  const first = screen.getByRole("checkbox", {name: "First approval"});
  const second = screen.getByRole("checkbox", {name: "Second approval"});
  const firstIDs = first.getAttribute("aria-describedby");
  expect(describedNodes(first).map(node => node.textContent).join(" ")).toContain("First error");
  expect(describedNodes(second).map(node => node.textContent).join(" ")).not.toContain("Second error");
  const firstNodes = new Set(describedNodes(first));
  expect(describedNodes(second).some(node => firstNodes.has(node))).toBe(false);
  rerender(fields(false, "Replacement error"));
  expect(first.getAttribute("aria-describedby")).toBe(firstIDs);
  expect(describedNodes(first).map(node => node.textContent).join(" ")).not.toContain("Replacement error");
  rerender(fields(true, "Replacement error"));
  expect(describedNodes(first).map(node => node.textContent).join(" ")).toContain("Replacement error");
});
