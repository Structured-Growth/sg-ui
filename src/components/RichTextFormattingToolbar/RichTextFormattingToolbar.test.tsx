import { describe, expect, it, vi } from "vitest";
import { RichTextFormattingToolbar } from "./RichTextFormattingToolbar";

vi.mock("../InsertContentMenuControl", () => ({
  InsertContentMenuControl: (props: unknown) => ({ type: "InsertContentMenuControl", props }),
}));

vi.mock("../TextAlignMenuControl", () => ({
  TextAlignMenuControl: (props: unknown) => ({ type: "TextAlignMenuControl", props }),
}));

vi.mock("../TextColorPickerControl", () => ({
  TextColorPickerControl: (props: unknown) => ({ type: "TextColorPickerControl", props }),
}));

vi.mock("../TextStyleMenuControl", () => ({
  TextStyleMenuControl: (props: unknown) => ({ type: "TextStyleMenuControl", props }),
}));

const findNodes = (node: any, predicate: (candidate: any) => boolean, found: any[] = []) => {
  if (!node || typeof node !== "object") {
    return found;
  }
  if (predicate(node)) {
    found.push(node);
  }
  const children = node?.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child) => findNodes(child, predicate, found));
  } else {
    findNodes(children, predicate, found);
  }
  return found;
};

describe("RichTextFormattingToolbar", () => {
  it("renders controls and wires callbacks", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    const onBold = vi.fn();
    const onItalic = vi.fn();
    const onUnderline = vi.fn();
    const onCode = vi.fn();
    const onLink = vi.fn();
    const onHeadingChange = vi.fn();
    const onFontFamilyChange = vi.fn();
    const onFontSizeDecrease = vi.fn();
    const onFontSizeIncrease = vi.fn();
    const onTextColorChange = vi.fn();
    const onBackgroundColorChange = vi.fn();
    const onAlignmentChange = vi.fn();
    const onIndent = vi.fn();
    const onOutdent = vi.fn();
    const onInsertHorizontalRule = vi.fn();
    const onInsertColumnsLayout = vi.fn();
    const onInsertImage = vi.fn();

    const element = RichTextFormattingToolbar({
      headingValue: "Heading 2",
      onHeadingChange,
      fontFamilyValue: "Georgia",
      onFontFamilyChange,
      fontSizeValue: 18,
      onFontSizeDecrease,
      onFontSizeIncrease,
      onUndo,
      onRedo,
      onBold,
      boldActive: true,
      onItalic,
      italicActive: true,
      onUnderline,
      underlineActive: true,
      onCode,
      codeActive: true,
      onLink,
      textColorValue: "#123456",
      onTextColorChange,
      backgroundColorValue: "#654321",
      onBackgroundColorChange,
      onAlignmentChange,
      onIndent,
      onOutdent,
      onInsertHorizontalRule,
      onInsertColumnsLayout,
      onInsertImage,
      leftSlot: "left-slot",
      rightSlot: "right-slot",
    }) as any;

    const iconButtons = findNodes(
      element,
      (candidate) =>
        typeof candidate?.props?.onClick === "function"
        && candidate?.props?.size === "small"
        && candidate?.props?.sx,
    );
    iconButtons.forEach((button) => button.props.onClick());
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onRedo).toHaveBeenCalledTimes(1);
    expect(onFontSizeDecrease).toHaveBeenCalledTimes(1);
    expect(onFontSizeIncrease).toHaveBeenCalledTimes(1);
    expect(onBold).toHaveBeenCalledTimes(1);
    expect(onItalic).toHaveBeenCalledTimes(1);
    expect(onUnderline).toHaveBeenCalledTimes(1);
    expect(onCode).toHaveBeenCalledTimes(1);
    expect(onLink).toHaveBeenCalledTimes(1);

    const headingSelect = findNodes(
      element,
      (candidate) =>
        typeof candidate?.props?.onChange === "function"
        && findNodes(candidate, (child) => child?.props?.value === "Normal").length > 0,
    )[0];
    const fontFamilySelect = findNodes(
      element,
      (candidate) =>
        typeof candidate?.props?.onChange === "function"
        && findNodes(candidate, (child) => child?.props?.value === "Arial").length > 0,
    )[0];
    headingSelect.props.onChange({ target: { value: "Heading 3" } });
    fontFamilySelect.props.onChange({ target: { value: "Times New Roman" } });
    expect(onHeadingChange).toHaveBeenCalledWith("Heading 3");
    expect(onFontFamilyChange).toHaveBeenCalledWith("Times New Roman");

    const menuItems = findNodes(
      element,
      (candidate) => typeof candidate?.props?.onClick === "function" && typeof candidate?.props?.value === "string",
    );
    menuItems.forEach((menuItem) => menuItem.props.onClick?.());
    expect(onHeadingChange).toHaveBeenCalledWith("Normal");
    expect(onHeadingChange).toHaveBeenCalledWith("Body Alt 3");

    const textColorControls = findNodes(element, (candidate) => candidate?.type?.name === "TextColorPickerControl");
    expect(textColorControls).toHaveLength(2);
    textColorControls[0].props.onChange("#000001");
    textColorControls[1].props.onChange("#000002");
    expect(onTextColorChange).toHaveBeenCalledWith("#000001");
    expect(onBackgroundColorChange).toHaveBeenCalledWith("#000002");

    const alignControl = findNodes(element, (candidate) => candidate?.type?.name === "TextAlignMenuControl")[0];
    alignControl.props.onChange("center");
    alignControl.props.onIndent();
    alignControl.props.onOutdent();
    expect(onAlignmentChange).toHaveBeenCalledWith("center");
    expect(onIndent).toHaveBeenCalledTimes(1);
    expect(onOutdent).toHaveBeenCalledTimes(1);

    const insertControl = findNodes(element, (candidate) => candidate?.type?.name === "InsertContentMenuControl")[0];
    insertControl.props.onInsertHorizontalRule();
    insertControl.props.onInsertColumnsLayout();
    insertControl.props.onInsertImage();
    expect(onInsertHorizontalRule).toHaveBeenCalledTimes(1);
    expect(onInsertColumnsLayout).toHaveBeenCalledTimes(1);
    expect(onInsertImage).toHaveBeenCalledTimes(1);

    expect(JSON.stringify(element)).toContain("left-slot");
    expect(JSON.stringify(element)).toContain("right-slot");
  });

  it("hides and disables controls by set and id", () => {
    const element = RichTextFormattingToolbar({
      showFontFamilySelector: false,
      showFontSizeControls: false,
      disabledControlSets: { history: true, insert: true },
      disabledControls: { heading: true, bold: true },
      hiddenControlSets: { colors: true, textStyle: true },
      hiddenControls: { heading: true, alignment: true, insert: true, undo: true, redo: true, bold: true, italic: true, underline: true, code: true, link: true },
    }) as any;

    expect(findNodes(element, (candidate) => candidate?.type?.name === "Select")).toHaveLength(0);
    expect(findNodes(element, (candidate) => candidate?.type?.name === "TextColorPickerControl")).toHaveLength(0);
    expect(findNodes(element, (candidate) => candidate?.type?.name === "TextStyleMenuControl")).toHaveLength(0);
    expect(findNodes(element, (candidate) => candidate?.type?.name === "TextAlignMenuControl")).toHaveLength(0);
    expect(findNodes(element, (candidate) => candidate?.type?.name === "InsertContentMenuControl")).toHaveLength(0);
    expect(findNodes(element, (candidate) => candidate?.type?.name === "IconButton")).toHaveLength(0);
  });
});
