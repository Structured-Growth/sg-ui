// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import { CourseCardFrame, STANDARD_COURSE_CARD_WIDTH, STANDARD_COURSE_CARD_MIN_WIDTH } from "./CourseCardFrame";
afterEach(cleanup);
it("preserves width constants and optional frame sections", () => {
  expect(STANDARD_COURSE_CARD_WIDTH).toBe(420);
  expect(STANDARD_COURSE_CARD_MIN_WIDTH).toBe(360);
  const { rerender } = render(<CourseCardFrame header="Title" body="Body" footer="Action" />);
  expect(screen.getByRole("article").style.maxInlineSize).toBe("420px");
  expect(screen.getByText("Action").getAttribute("data-sgui-part")).toBe("course-card-footer");
  rerender(<CourseCardFrame header="Title" body="Body" />);
  expect(screen.queryByText("Action")).toBeNull();
});
it("supports native root and slot styling and server markup", () => {
  render(<CourseCardFrame header="Title" body="Body" footer="Action" width={500}
    className="host-card" headerClassName="host-header" bodyStyle={{ padding: 24 }} footerStyle={{ padding: 10 }} />);
  expect(screen.getByRole("article").classList.contains("host-card")).toBe(true);
  expect(screen.getByRole("article").style.maxInlineSize).toBe("500px");
  expect(screen.getByText("Title").classList.contains("host-header")).toBe(true);
  expect(screen.getByText("Body").style.padding).toBe("24px");
  expect(screen.getByText("Action").style.padding).toBe("10px");
  expect(renderToString(<CourseCardFrame header="Title" body="Body" />)).toContain('data-sgui-part="course-card-frame"');
});

it("updates width on the same frame and lets host native style take precedence", () => {
  const { rerender } = render(<CourseCardFrame header="Title" body="Body" width={360} />);
  const frame = screen.getByRole("article");
  expect(frame.style.maxInlineSize).toBe("360px");
  rerender(<CourseCardFrame header="Title" body="Body" width={500} />);
  expect(screen.getByRole("article")).toBe(frame);
  expect(frame.style.maxInlineSize).toBe("500px");
  rerender(<CourseCardFrame header="Title" body="Body" width={500} style={{ maxInlineSize: 280 }} />);
  expect(frame.style.maxInlineSize).toBe("280px");
  rerender(<CourseCardFrame header="Title" body="Body" />);
  expect(frame.style.maxInlineSize).toBe("420px");
});
it("preserves image attributes, arbitrary slot content and falsy footer omission", () => {
  const { rerender, container } = render(<CourseCardFrame header={null}
    body={<img src="/host-course.png" alt="Host course image" width={1200} height={600} />} footer={false} />);
  expect(screen.getByRole("img", { name: "Host course image" }).getAttribute("src")).toBe("/host-course.png");
  expect(screen.getByRole("img").getAttribute("width")).toBe("1200");
  expect(container.querySelector('[data-sgui-part="course-card-header"]')).not.toBeNull();
  expect(container.querySelector('[data-sgui-part="course-card-footer"]')).toBeNull();
  rerender(<CourseCardFrame header={null} body={null} footer={0} />);
  expect(container.querySelector('[data-sgui-part="course-card-body"]')?.textContent).toBe("");
  expect(container.querySelector('[data-sgui-part="course-card-footer"]')).toBeNull();
});
