import { expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { AppPageHeader } from "./AppPageHeader";
import { AppPageTabs } from "../AppPageTabs/AppPageTabs";
it("renders page layout without browser globals", () => {
  expect(typeof window).toBe("undefined");
  const html = renderToString(<><AppPageHeader title="Course" breadcrumbs={[{ label: "Courses", href: "/courses" }, { label: "Course" }]} moreMenuItems={[{ label: "Edit" }]} /><AppPageTabs value="details" items={[{ id: "details", label: "Details", href: "/details" }]} /></>);
  expect(html).toContain('<h1'); expect(html).toContain('aria-current="page"'); expect(html).not.toContain("Mui");
});
