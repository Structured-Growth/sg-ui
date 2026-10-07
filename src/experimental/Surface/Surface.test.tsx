// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Surface } from "./Surface";
afterEach(cleanup);
it("preserves owned layout props, native semantics and refs", () => { const ref = createRef<HTMLElement>(); render(<Surface ref={ref} as="section" aria-label="Details" tone="subtle" variant="raised" padding={4}>Details</Surface>);
    const element = screen.getByRole("region", { name: "Details" }); expect(ref.current).toBe(element); expect(element.dataset.tone).toBe("subtle"); expect(element.dataset.variant).toBe("raised"); expect(element.hasAttribute("tone")).toBe(false); });
it("renders without browser globals or a provider", () => { expect(renderToString(<Surface id="server" />)).toContain('id="server"'); });
