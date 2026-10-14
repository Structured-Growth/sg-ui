import { describe, expect, it } from "vitest";
import { PageRichTextEditorSection } from "./PageRichTextEditorSection";
import { PageRichTextEditorSection as implementation } from "./PageRichTextEditorSection.impl";

describe("PageRichTextEditorSection public export", () => {
  it("preserves the real implementation reference including native ref support", () => {
    expect(PageRichTextEditorSection).toBe(implementation);
  });
});
