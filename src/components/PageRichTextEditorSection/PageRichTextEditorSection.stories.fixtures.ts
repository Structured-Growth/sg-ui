// Representative host-owned saved JSON, shared by stories and acceptance tests.
// No fixture data is used by the production editor.
const text = (value: string, format = 0, style = "") => ({
  type: "text", version: 1, text: value, detail: 0, format, mode: "normal", style,
});
const element = (type: string, children: unknown[], extra = {}) => ({
  type, version: 1, children, direction: null, format: "", indent: 0, ...extra,
});
const paragraph = (value: string) => element("paragraph", [text(value)]);

export const SAVED_RICH_DOCUMENT = {
  root: element("root", [
    element("heading", [text("Saved course guide")], { tag: "h2" }),
    element("paragraph", [
      text("Bold", 1), text(" Italic", 2), text(" Underlined", 8),
      text(" Struck", 4), text(" Inline code", 16), text(" Subscript", 32),
      text(" Superscript", 64),
      text(" Colored", 0, "color: #123456; background-color: #fff59d; --lp-text-variant: bodyAlt2;"),
    ], { format: "center", indent: 1 }),
    element("paragraph", [element("link", [text("Course link", 3)], {
      url: "https://example.com/course", target: "_blank", rel: "noopener noreferrer", title: "Course guide",
    })]),
    element("list", [element("listitem", [text("First lesson")], { value: 3 }),
      element("listitem", [text("Second lesson")], { value: 4 })], { listType: "number", start: 3, tag: "ol" }),
    element("list", [element("listitem", [text("Practice lesson")], { value: 1 })], { listType: "bullet", start: 1, tag: "ul" }),
    element("quote", [text("Learning takes practice")]),
    element("code", [{ ...text("const"), type: "code-highlight", highlightType: "keyword" },
      text(" course = 1;"), { type: "linebreak", version: 1 }, text("return course;")], { language: "javascript" }),
    element("table", [element("tablerow", [
      element("tablecell", [paragraph("Lesson heading")], { colSpan: 1, rowSpan: 1, headerState: 1, width: 180, backgroundColor: "#fff59d" }),
      element("tablecell", [paragraph("Duration heading")], { colSpan: 1, rowSpan: 1, headerState: 1 }),
    ]), element("tablerow", [
      element("tablecell", [paragraph("Reading")], { colSpan: 1, rowSpan: 1, headerState: 0 }),
      element("tablecell", [paragraph("10 minutes")], { colSpan: 1, rowSpan: 1, headerState: 0 }),
    ])]),
    element("paragraph", [{ type: "image", version: 1,
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
      altText: "Saved course illustration", width: 640, height: 480, assetId: "course-cover", assetVersionId: "cover-v2" }]),
    { type: "horizontalrule", version: 1 },
    paragraph("Edit this ending"),
  ]),
};
