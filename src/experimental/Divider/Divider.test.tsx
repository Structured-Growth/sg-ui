// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Divider } from "./Divider";
afterEach(cleanup);
it("preserves owned layout props, native semantics and refs", () => { const ref = createRef<HTMLElement>(); const { rerender } = render(<Divider ref={ref} orientation="vertical" aria-label="Sections" />);
    const element = screen.getByRole("separator", { name: "Sections" }); expect(ref.current).toBe(element); expect(element.getAttribute("aria-orientation")).toBe("vertical");
    rerender(<Divider decorative />); expect(screen.queryByRole("separator")).toBeNull(); expect(screen.getByRole("presentation").getAttribute("aria-orientation")).toBeNull(); });
it("renders without browser globals or a provider", () => { expect(renderToString(<Divider id="server" />)).toContain('id="server"'); });
