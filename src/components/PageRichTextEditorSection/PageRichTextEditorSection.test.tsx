import { describe, expect, it, vi } from "vitest";

const implCall = vi.hoisted(() => vi.fn(() => ({ type: "ImplResult" })));

vi.mock("./PageRichTextEditorSection.impl", () => ({
  PageRichTextEditorSection: (props: unknown) => implCall(props),
}));

import * as wrapper from "./PageRichTextEditorSection";

describe("PageRichTextEditorSection wrapper", () => {
  it("delegates to the implementation component", () => {
    const props = { title: "Page 1" } as any;
    const result = wrapper.PageRichTextEditorSection(props);
    expect(implCall).toHaveBeenCalledWith(props);
    expect(result).toEqual({ type: "ImplResult" });
  });
});
