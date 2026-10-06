// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import * as icons from "./index";
afterEach(cleanup);
const catalog = Object.entries(icons).filter((entry): entry is [string, typeof icons.AddIcon] => /^[A-Z].*Icon$/.test(entry[0]));
it.each(catalog)("%s renders an owned decorative vector with a forwarded ref", (_name, Icon) => {
  const ref = createRef<SVGSVGElement>();
  const { container } = render(<Icon ref={ref} size={20} strokeWidth={1.5} color="currentColor" />);
  const svg = container.querySelector("svg")!;
  expect(ref.current).toBe(svg); expect(svg.getAttribute("aria-hidden")).toBe("true");
  expect(svg.getAttribute("width")).toBe("20"); expect(svg.getAttribute("stroke-width")).toBe("1.5");
  expect(svg.getAttribute("stroke")).toBe("currentColor"); expect(svg.querySelectorAll("path,line,rect,circle,polyline,ellipse,polygon").length).toBeGreaterThan(0);
});
it.each(["lesson", "quiz", "exam", "assignment", "project", "lab", "practice", "unknown", null, undefined])("preserves the activity fallback for %s", type => {
  const { container } = render(<>{icons.getActivityTypeIcon(type)}</>);
  expect(container.querySelector("svg")?.getAttribute("width")).toBe("20");
  expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
});
it("supports explicit consumer overrides including an empty icon", () => {
  render(<>{icons.getActivityTypeIcon("LESSON", { overrides: { lesson: <span>Custom lesson</span> } })}</>);
  expect(screen.getByText("Custom lesson")).toBeTruthy();
  expect(icons.getActivityTypeIcon("unknown", { fallback: null })).toBeNull();
});
it("names meaningful icons and leaves decorative icons out of the accessibility tree", () => {
  render(<><icons.CheckIcon label="Completed" /><icons.AddIcon /></>);
  expect(screen.getAllByRole("img")).toHaveLength(1); expect(screen.getByRole("img", { name: "Completed" })).toBeTruthy();
});
it("mirrors directional symbols explicitly and renders on the server without browser reads", () => {
  const html = renderToString(<div dir="rtl"><icons.ChevronRightIcon /><icons.AddIcon /><icons.UndoIcon mirrorInRtl={false} /></div>);
  expect(html.match(/data-mirror-rtl="true"/g)).toHaveLength(1);
  expect(html).toContain('aria-hidden="true"');
});
