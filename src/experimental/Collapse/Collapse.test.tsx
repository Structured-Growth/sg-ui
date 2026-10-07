// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Collapse } from "./Collapse";
afterEach(cleanup);
it("hides retained children and forwards a native panel ref", () => {
 const ref = createRef<HTMLDivElement>(); const view = render(<Collapse ref={ref} expanded={false}><button>Action</button></Collapse>);
 expect(ref.current?.hidden).toBe(true); expect(screen.queryByRole("button")).toBeNull(); expect(screen.getByRole("button", { hidden: true })).toBeDefined();
 view.rerender(<Collapse ref={ref} expanded><button>Action</button></Collapse>); expect(screen.getByRole("button")).toBeDefined(); expect(ref.current?.hidden).toBe(false);
});
it("allows the consumer to unmount collapsed children", () => {
 render(<Collapse expanded={false} unmountOnCollapse><button>Action</button></Collapse>); expect(screen.queryByRole("button", { hidden: true })).toBeNull();
});
