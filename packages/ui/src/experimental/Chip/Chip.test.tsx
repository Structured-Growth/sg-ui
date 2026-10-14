// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Chip } from "./Chip";
afterEach(cleanup);
it("renders a passive label with native ref and host attributes", () => {
  const ref = createRef<HTMLSpanElement>();
  render(<Chip ref={ref} tone="primary" variant="outlined" title="Course status">Published</Chip>);
  expect(ref.current).toBe(screen.getByText("Published"));
  expect(ref.current?.tagName).toBe("SPAN");
  expect(ref.current?.title).toBe("Course status");
  expect(ref.current?.getAttribute("data-tone")).toBe("primary");
  expect(screen.queryByRole("button")).toBeNull();
});
