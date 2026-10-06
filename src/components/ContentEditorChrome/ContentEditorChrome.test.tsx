import { describe, expect, it, vi } from "vitest";
import { ContentEditorChrome } from "./ContentEditorChrome";

vi.mock("../EditableTitleField", () => ({
  EditableTitleField: (props: unknown) => ({ type: "EditableTitleField", props }),
}));

describe("ContentEditorChrome", () => {
  it("renders title editor, right slot, and menu items", () => {
    const onTitleSave = vi.fn();
    const onFileClick = vi.fn();
    const onEditClick = vi.fn();
    const element = ContentEditorChrome({
      icon: "doc-icon",
      title: "Untitled document",
      onTitleSave,
      rightSlot: "status-chip",
      menuItems: [
        { id: "file", label: "File", onClick: onFileClick },
        { id: "edit", label: "Edit", onClick: onEditClick },
      ],
    }) as any;

    const rootStack = element.props.children;
    const [iconCol, contentCol] = rootStack.props.children as any[];
    expect(iconCol.props.children).toBe("doc-icon");

    const [headerRow, menuRow] = contentCol.props.children as any[];
    const [titleEditor, rightSlot] = headerRow.props.children as any[];
    expect(titleEditor.type.name).toBe("EditableTitleField");
    expect(titleEditor.props.title).toBe("Untitled document");
    expect(titleEditor.props.variant).toBe("h4");
    expect(titleEditor.props.onSave).toBe(onTitleSave);
    expect(rightSlot).toBe("status-chip");

    const menuButtons = menuRow.props.children as any[];
    expect(menuButtons).toHaveLength(2);
    const nativeClick = { type: "click", currentTarget: { id: "file-menu-anchor" } };
    menuButtons[0].props.onClick(nativeClick);
    menuButtons[1].props.onClick({ type: "click" });
    expect(onFileClick).toHaveBeenCalledWith(nativeClick);
    expect(onFileClick).toHaveBeenCalledTimes(1);
    expect(onEditClick).toHaveBeenCalledTimes(1);
  });

  it("supports empty menu and no right slot", () => {
    const element = ContentEditorChrome({
      icon: "doc-icon",
      title: "Doc",
      onTitleSave: vi.fn(),
      menuItems: [],
    }) as any;

    const menuRow = element.props.children.props.children[1].props.children[1];
    expect(menuRow.props.children).toEqual([]);
  });
});
