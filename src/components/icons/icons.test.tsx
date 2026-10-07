// @vitest-environment jsdom
import { createRef } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import * as icons from "./index";
import * as publicIcons from "../../icons";
import { AddIcon as IndividualAddIcon } from "../../icons/AddIcon";
import { getActivityTypeIcon as localActivityIcon } from "./activityTypeIcon";

afterEach(cleanup);
const catalog = Object.entries(icons).filter((entry): entry is [string, typeof icons.AddIcon] => /^[A-Z].*Icon$/.test(entry[0]));

it.each(catalog)("public %s preserves its name and renders a native decorative vector", (name, Icon) => {
  expect(publicIcons[name as keyof typeof publicIcons]).toBe(Icon);
  const ref = createRef<SVGSVGElement>();
  const { container } = render(<Icon ref={ref} size={18} className="host-icon" style={{ opacity: 0.5 }} />);
  const svg = container.querySelector("svg")!;
  expect(ref.current).toBe(svg);
  expect(svg.getAttribute("aria-hidden")).toBe("true");
  expect(svg.getAttribute("focusable")).toBe("false");
  expect(svg.getAttribute("width")).toBe("18");
  expect(svg.getAttribute("height")).toBe("18");
  expect(svg.classList.contains("host-icon")).toBe(true);
  expect(svg.style.opacity).toBe("0.5");
});

it("shares the independent icon implementation and activity helper across entry points", () => {
  expect(IndividualAddIcon).toBe(icons.AddIcon);
  expect(localActivityIcon).toBe(publicIcons.getActivityTypeIcon);
});

it.each([
  ["lesson", icons.MenuBookOutlinedIcon],
  ["QUIZ", icons.QuizOutlinedIcon],
  ["exam", icons.QuizOutlinedIcon],
  ["assignment", icons.FactCheckOutlinedIcon],
  ["project", icons.FactCheckOutlinedIcon],
  ["lab", icons.ScienceOutlinedIcon],
  ["practice", icons.ScienceOutlinedIcon],
  ["unknown", icons.WorkOutlineOutlinedIcon],
  ["", icons.WorkOutlineOutlinedIcon],
  [null, icons.WorkOutlineOutlinedIcon],
  [undefined, icons.WorkOutlineOutlinedIcon],
] as const)("maps public activity %s to the expected symbol", (type, Icon) => {
  expect(renderToString(<>{icons.getActivityTypeIcon(type, { size: 24 })}</>)).toBe(renderToString(<Icon size={24} />));
});

it("retains the 20px activity default and lets the host override known and unknown types", () => {
  const { container } = render(<>{icons.getActivityTypeIcon("lesson")}</>);
  expect(container.querySelector("svg")?.getAttribute("width")).toBe("20");
  cleanup();
  render(<>{icons.getActivityTypeIcon("LESSON", { overrides: { lesson: <span>Host lesson</span> } })}</>);
  expect(screen.getByText("Host lesson")).toBeTruthy();
  expect(icons.getActivityTypeIcon("new-type", { overrides: { "new-type": null }, fallback: "Fallback" })).toBeNull();
  expect(icons.getActivityTypeIcon(null, { fallback: null })).toBeNull();
  expect(icons.getActivityTypeIcon("toString", { overrides: {}, fallback: "Fallback" })).toBe("Fallback");
});

it("names meaningful icons while keeping action decorations hidden", () => {
  render(<><icons.CheckIcon label="Completed" /><icons.AddIcon /></>);
  expect(screen.getAllByRole("img")).toHaveLength(1);
  expect(screen.getByRole("img", { name: "Completed" })).toBeTruthy();
});

it("renders RTL directional defaults and explicit overrides without browser globals", () => {
  const html = renderToString(<div dir="rtl"><icons.ChevronRightIcon /><icons.AddIcon /><icons.UndoIcon mirrorInRtl={false} /></div>);
  expect(html.match(/data-mirror-rtl="true"/g)).toHaveLength(1);
});
