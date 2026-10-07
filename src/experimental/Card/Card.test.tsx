// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Card, CardContent } from "./Card";
afterEach(cleanup);
it("preserves owned layout props, native semantics and refs", () => { const ref = createRef<HTMLElement>(); render(<Card ref={ref} aria-label="Course"><CardContent><h2>Algebra</h2><button>Open</button></CardContent></Card>);
    const element = screen.getByRole("article", { name: "Course" }); expect(ref.current).toBe(element); expect(element.dataset.variant).toBe("outlined");
    expect(element.firstElementChild?.getAttribute("style")).toContain("var(--sgui-space4)"); expect(screen.getByRole("button", { name: "Open" })).toBeDefined(); });
it("renders without browser globals or a provider", () => { expect(renderToString(<Card id="server" />)).toContain('id="server"'); });
