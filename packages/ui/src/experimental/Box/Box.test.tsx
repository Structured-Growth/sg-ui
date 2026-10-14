// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Box } from "./Box";
afterEach(cleanup);
it("preserves owned layout props, native semantics and refs", () => { const ref = createRef<HTMLElement>(); render(<Box ref={ref} as="main" aria-label="Workspace" padding={3} container className="host" style={{ maxWidth: "60rem" }}>Course</Box>);
    const element = screen.getByRole("main", { name: "Workspace" }); expect(ref.current).toBe(element);
    expect(element.style.padding).toBe("var(--sgui-space3)");
    expect(element.style.maxWidth).toBe("60rem"); expect(element.classList.contains("host")).toBe(true); expect(element.hasAttribute("padding")).toBe(false); });
it("renders without browser globals or a provider", () => { expect(renderToString(<Box id="server" />)).toContain('id="server"'); });
