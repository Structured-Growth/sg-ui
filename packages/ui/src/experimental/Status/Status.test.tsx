// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Status } from "./Status";
afterEach(cleanup);
it("stays quiet by default and enables atomic announcements only when requested", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(<Status ref={ref}>Ready</Status>);
  expect(ref.current).toBe(screen.getByText("Ready"));
  expect(ref.current?.getAttribute("aria-live")).toBe("off");
  expect(screen.queryByRole("status")).toBeNull();
  rerender(<Status announcement="polite">Saved</Status>);
  const status = screen.getByRole("status");
  expect(status.getAttribute("aria-atomic")).toBe("true");
  rerender(<Status announcement="assertive" tone="danger">Upload failed</Status>);
  expect(screen.getByRole("alert").getAttribute("aria-live")).toBe("assertive");
});
it("renders host content without browser globals", () => {
  expect(renderToString(<Status>Ready</Status>)).toContain("Ready");
});
