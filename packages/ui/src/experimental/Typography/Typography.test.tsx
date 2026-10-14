// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Typography, type TypographyVariant } from "./Typography";
afterEach(cleanup);
it("keeps visual typography independent of the document heading hierarchy", () => {
  render(<Typography as="h2" variant="h1">Course details</Typography>);
  const heading = screen.getByRole("heading", { level: 2 }); expect(heading.getAttribute("data-variant")).toBe("h1");
  expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
});
it("forwards native descriptions, styles, classes and refs without augmentation", () => {
  const ref = createRef<HTMLElement>();
  render(<Typography ref={ref} as="span" variant="bodyAlt2" className="host" tone="muted" noWrap aria-label="Course label">Science</Typography>);
  expect(ref.current?.tagName).toBe("SPAN"); expect(ref.current?.classList.contains("host")).toBe(true);
  expect(ref.current?.getAttribute("aria-label")).toBe("Course label");
  expect(ref.current?.getAttribute("data-variant")).toBe("bodyAlt2");
});
it.each<TypographyVariant>(["h1", "h2", "h3", "h4", "h5", "h6", "body1", "body2", "bodyAlt2", "subtitle1", "subtitle2", "caption", "overline", "button", "code"])("renders the %s visual role on the server", variant => {
  const html = renderToString(<Typography variant={variant}>Text</Typography>);
  expect(html).toContain(`data-variant="${variant}"`); expect(html).toContain("Text");
});
