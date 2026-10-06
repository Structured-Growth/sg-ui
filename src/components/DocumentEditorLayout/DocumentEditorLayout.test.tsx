import { describe, expect, it } from "vitest";
import { DocumentEditorLayout } from "./DocumentEditorLayout";

describe("DocumentEditorLayout", () => {
  it("renders fallback title and optional regions", () => {
    const element = DocumentEditorLayout({
      title: "Editor",
      headerRight: "header-right",
      menuBar: "menu",
      toolbar: "toolbar",
      children: "content",
    }) as any;

    const children = element.props.children as any[];
    expect(children).toHaveLength(4);
    expect(children[1].props.children).toBe("menu");
    expect(children[2].props.children).toBe("toolbar");
    expect(children[3].props.children).toBe("content");
  });

  it("uses explicit title node when provided", () => {
    const element = DocumentEditorLayout({
      title: "ignored",
      titleNode: "custom-title",
      children: "content",
    }) as any;

    const header = (element.props.children as any[])[0];
    const stack = header.props.children;
    expect(stack.props.children[0]).toBe("custom-title");
  });
});
