// Representative host-owned saved JSON, shared by stories and acceptance tests.
// No fixture data is used by the production editor.
const text = (value: string, format = 0, style = "") => ({
  type: "text", version: 1, text: value, detail: 0, format, mode: "normal", style,
});
const element = (type: string, children: unknown[], extra = {}) => ({
  type, version: 1, children, direction: null, format: "", indent: 0, ...extra,
});
const paragraph = (value: string) => element("paragraph", [text(value)]);

export const IMAGE_POLICY_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==";
export const SAVED_IMAGE_SOURCE_DOCUMENT = {
  root: element("root", [
    ...[
      ["Relative illustration", "/image-policy-pixel.png"],
      ["Web illustration", "https://images.example.org/image-policy-pixel.png"],
      ["Embedded illustration", IMAGE_POLICY_PIXEL],
      ["Embedded SVG illustration", "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221%22%20height=%221%22%3E%3Cscript%3Ealert('unsafe-svg')%3C/script%3E%3Crect%20width=%221%22%20height=%221%22%20fill=%22red%22/%3E%3C/svg%3E"],
      ["Rejected script image", "javascript:alert('unsafe-image')"],
      ["Rejected HTML image", "data:text/html,%3Cscript%3Ealert(1)%3C/script%3E"],
      ["Rejected network image", "//images.example.org/rejected-image-policy.png"],
      ["Rejected file image", "file:///private/image-policy.png"],
      ["", "data:text/html,decorative"],
    ].map(([altText, src]) => element("paragraph", [{ type: "image", version: 1, src, altText,
      width: 640, height: 480, assetId: "host-image", assetVersionId: "host-version" }], { textFormat: 0, textStyle: "" })),
    { ...paragraph("Edit image document"), textFormat: 0, textStyle: "" },
  ]),
};

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
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==",
      altText: "Saved course illustration", width: 640, height: 480, assetId: "course-cover", assetVersionId: "cover-v2" }]),
    { type: "horizontalrule", version: 1 },
    paragraph("Edit this ending"),
  ]),
};

export const SAVED_LINK_DOCUMENT = {
  root: element("root", [
    ...[
      ["Relative guide", "/link-policy-destination"],
      ["Web guide", "www.example.org/guide"],
      ["Rejected script", "javascript:alert('unsafe-link')"],
      ["Rejected data", "data:text/html,unsafe"],
      ["Rejected network path", "//example.org/guide"],
      ["Rejected scheme", "sms:123"],
    ].map(([label, url]) => element("paragraph", [element("link", [text(label, 3)], {
      url, target: "_blank", rel: "author", title: label,
    })])),
    paragraph("Edit link document"),
  ]),
};
