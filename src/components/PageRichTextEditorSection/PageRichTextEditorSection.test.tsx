import { describe, expect, it, vi } from "vitest";

const implementation = vi.hoisted(() => vi.fn(() => null));
vi.mock("./PageRichTextEditorSection.impl", () => ({
  PageRichTextEditorSection: implementation,
}));

import { PageRichTextEditorSection } from "./PageRichTextEditorSection";

describe("PageRichTextEditorSection public export", () => {
  it("preserves the implementation reference including native ref support", () => {
    expect(PageRichTextEditorSection).toBe(implementation);
  });
});
