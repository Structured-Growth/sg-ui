// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { ButtonGroup } from "./ButtonGroup";
afterEach(cleanup);
it("names a native group without adding toolbar keyboard semantics", () => {
 const ref = createRef<HTMLDivElement>(); render(<ButtonGroup ref={ref} label="Course actions" joined orientation="vertical"><button>Edit</button><button>Delete</button></ButtonGroup>);
 const group = screen.getByRole("group", { name: "Course actions" }); expect(ref.current).toBe(group); expect(group.dataset.orientation).toBe("vertical"); expect(group.dataset.joined).toBe("true"); expect(screen.getAllByRole("button")).toHaveLength(2); expect(group.hasAttribute("tabindex")).toBe(false);
});
it("supports server rendering without a provider", () => { expect(renderToString(<ButtonGroup label="Actions" />)).toContain('aria-label="Actions"'); });
