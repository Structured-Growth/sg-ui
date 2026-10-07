// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { ClassCardFrame, STANDARD_CLASS_CARD_WIDTH, STANDARD_CLASS_CARD_MIN_WIDTH } from "./ClassCardFrame";
afterEach(cleanup);
it("preserves width constants and optional frame sections", () => {
  expect(STANDARD_CLASS_CARD_WIDTH).toBe(420);
  expect(STANDARD_CLASS_CARD_MIN_WIDTH).toBe(360);
  const { rerender } = render(<ClassCardFrame header="Title" body="Body" footer="Action" />);
  expect(screen.getByRole("article").style.maxInlineSize).toBe("420px");
  expect(screen.getByText("Action").getAttribute("data-sgui-part")).toBe("class-card-footer");
  rerender(<ClassCardFrame header="Title" body="Body" />);
  expect(screen.queryByText("Action")).toBeNull();
});
it("supports native root and slot styling and server markup", () => {
  render(<ClassCardFrame header="Title" body="Body" footer="Action" width={500}
    className="host-card" headerClassName="host-header" bodyStyle={{ padding: 24 }} footerStyle={{ padding: 10 }} />);
  expect(screen.getByRole("article").classList.contains("host-card")).toBe(true);
  expect(screen.getByRole("article").style.maxInlineSize).toBe("500px");
  expect(screen.getByText("Title").classList.contains("host-header")).toBe(true);
  expect(screen.getByText("Body").style.padding).toBe("24px");
  expect(screen.getByText("Action").style.padding).toBe("10px");
  expect(renderToString(<ClassCardFrame header="Title" body="Body" />)).toContain('data-sgui-part="class-card-frame"');
});
