// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Stack } from "./Stack";
afterEach(cleanup);
it("preserves owned layout props, native semantics and refs", () => { const ref = createRef<HTMLElement>(); render(<Stack ref={ref} as="nav" aria-label="Actions" direction="row" gap={4} align="center" justify="between" wrap responsive><a href="#courses">Courses</a><button>Refresh</button></Stack>);
    const element = screen.getByRole("navigation", { name: "Actions" }); expect(ref.current).toBe(element);
    expect(element.dataset.direction).toBe("row"); expect(element.dataset.responsive).toBe("true"); expect(element.style.gap).toBe("var(--sgui-space4)");
    expect(element.children.length).toBe(2); expect(element.hasAttribute("gap")).toBe(false); });
it("renders without browser globals or a provider", () => { expect(renderToString(<Stack id="server" />)).toContain('id="server"'); });
