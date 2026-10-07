// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { PointerReorderInvalidationFixture } from "./AppDataGrid.reorder-invalidation.stories";

afterEach(cleanup);
describe("pointer invalidation host composition (native drag proof is browser-only)", () => {
  it.each(["dataset", "identity"])("applies an armed %s replacement once without host move requests", async kind => {
    render(<Provider><PointerReorderInvalidationFixture /></Provider>);
    await userEvent.click(screen.getByRole("button", { name: `Arm ${kind} replacement` }));
    const strip = screen.getByRole("region", { name: "Host replacement strip" });
    // This verifies the host trigger/oracle only, not native pointer dragging.
    fireEvent.dragEnter(strip);
    expect(screen.getByRole("status", { name: "Replacement state" }).textContent).toBe(`Revision 1; last ${kind}; armed none`);
    fireEvent.dragEnter(strip);
    expect(screen.getByRole("status", { name: "Replacement state" }).textContent).toBe(`Revision 1; last ${kind}; armed none`);
    for (const prefix of ["Source", "Other"]) {
      const region = screen.getByRole("region", { name: `${prefix} grid` });
      expect(within(region).getAllByRole("button", { name: /^Reorder/ }).map(handle => handle.getAttribute("aria-label")))
        .toEqual(Array.from({ length: 5 }, (_, index) => `Reorder ${prefix} Course ${index + 1}`));
      expect(screen.getByRole("status", { name: `${prefix} requests` }).textContent).toBe(`${prefix} requests: 0`);
    }
  });

  it("counts requests independently for grids with colliding IDs after replacement", async () => {
    render(<Provider><PointerReorderInvalidationFixture /></Provider>);
    await userEvent.click(screen.getByRole("button", { name: "Arm identity replacement" }));
    fireEvent.dragEnter(screen.getByRole("region", { name: "Host replacement strip" }));
    await userEvent.click(screen.getByRole("button", { name: "Move Other Course 2 down" }));
    expect(screen.getByRole("status", { name: "Source requests" }).textContent).toBe("Source requests: 0");
    expect(screen.getByRole("status", { name: "Other requests" }).textContent).toBe("Other requests: 1");
    await userEvent.click(screen.getByRole("button", { name: "Move Source Course 2 down" }));
    expect(screen.getByRole("status", { name: "Source requests" }).textContent).toBe("Source requests: 1");
    expect(screen.getByRole("status", { name: "Other requests" }).textContent).toBe("Other requests: 1");
  });
});
