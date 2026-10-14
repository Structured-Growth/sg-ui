// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { CircularProgress, LinearProgress } from "./index";
afterEach(cleanup);
it("keeps named progress semantics, bounded values and fixed circular/linear presentation", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<CircularProgress ref={ref} aria-label="Loading courses" />);
  expect(ref.current).toBe(screen.getByRole("progressbar", { name: "Loading courses" }));
  expect(ref.current?.getAttribute("aria-valuenow")).toBeNull();
  expect(ref.current?.querySelector("svg")).not.toBeNull();
  rerender(<LinearProgress ref={ref} label="Upload" value={150} valueText="Complete" />);
  expect(ref.current?.getAttribute("aria-valuenow")).toBe("100");
  expect(ref.current?.getAttribute("aria-valuetext")).toBe("Complete");
  expect(ref.current?.querySelector("svg")).toBeNull();
  expect(ref.current?.getAttribute("data-variant")).toBe("linear");
});
it("renders both public progress names in SSR with external and visible labels", () => {
  const html = renderToString(<><span id="work">Work</span><CircularProgress aria-labelledby="work" value={30} /><LinearProgress label="Download" value={20} /></>);
  expect(html).toContain('aria-labelledby="work"');
  expect(html).toContain('aria-valuenow="30"');
  expect(html).toContain('aria-label="Download"');
});
