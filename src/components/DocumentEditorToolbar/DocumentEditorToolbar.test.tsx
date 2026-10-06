import { describe, expect, it, vi } from "vitest";
import { DocumentEditorToolbar } from "./DocumentEditorToolbar";

const collectNodes = (node: any, predicate: (candidate: any) => boolean, found: any[] = []) => {
  if (!node || typeof node !== "object") {
    return found;
  }

  if (predicate(node)) {
    found.push(node);
  }

  const children = node?.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child) => collectNodes(child, predicate, found));
  } else {
    collectNodes(children, predicate, found);
  }

  return found;
};

const createProps = () => ({
  canEdit: true,
  headingValue: "normal" as const,
  onHeadingChange: vi.fn(),
  actions: {
    bold: { active: false, onClick: vi.fn() },
    italic: { active: true, onClick: vi.fn() },
    bulletList: { active: false, onClick: vi.fn() },
    orderedList: { active: true, onClick: vi.fn() },
  },
});

describe("DocumentEditorToolbar", () => {
  it("wires heading, formatting, and zoom actions", () => {
    const onHeadingChange = vi.fn();
    const onZoomOut = vi.fn();
    const onZoomIn = vi.fn();
    const onBold = vi.fn();
    const onItalic = vi.fn();
    const onBullet = vi.fn();
    const onOrdered = vi.fn();

    const element = DocumentEditorToolbar({
      canEdit: true,
      headingValue: "normal",
      onHeadingChange,
      onZoomOut,
      onZoomIn,
      actions: {
        bold: { active: false, onClick: onBold },
        italic: { active: true, onClick: onItalic },
        bulletList: { active: false, onClick: onBullet },
        orderedList: { active: true, onClick: onOrdered },
      },
      statusLabel: "Saved",
    }) as any;

    const clickableNodes = collectNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    const headingSelect = collectNodes(element, (candidate) => typeof candidate?.props?.onChange === "function")[0];

    clickableNodes.find((node) => node.props.onClick === onZoomOut)?.props.onClick();
    clickableNodes.find((node) => node.props.onClick === onZoomIn)?.props.onClick();
    headingSelect.props.onChange({ target: { value: "h2" } });
    clickableNodes.find((node) => node.props.onClick === onBold)?.props.onClick();
    clickableNodes.find((node) => node.props.onClick === onItalic)?.props.onClick();
    clickableNodes.find((node) => node.props.onClick === onBullet)?.props.onClick();
    clickableNodes.find((node) => node.props.onClick === onOrdered)?.props.onClick();

    expect(onZoomOut).toHaveBeenCalled();
    expect(onZoomIn).toHaveBeenCalled();
    expect(onHeadingChange).toHaveBeenCalledWith("h2");
    expect(onBold).toHaveBeenCalled();
    expect(onItalic).toHaveBeenCalled();
    expect(onBullet).toHaveBeenCalled();
    expect(onOrdered).toHaveBeenCalled();
    const statusNode = collectNodes(element, (candidate) => candidate?.props?.children === "Saved")[0];
    expect(statusNode).toBeTruthy();
  });

  it("renders right slot instead of status text when provided", () => {
    const element = DocumentEditorToolbar({
      ...createProps(),
      statusLabel: "Saved",
      rightSlot: "Custom slot",
    }) as any;

    const rootChildren = element.props.children as any[];
    const statusNode = collectNodes(element, (candidate) => candidate?.props?.children === "Saved")[0];

    expect(rootChildren[1]).toBe("Custom slot");
    expect(statusNode).toBeFalsy();
  });

  it("renders no status element when statusLabel is not provided", () => {
    const element = DocumentEditorToolbar({
      ...createProps(),
    }) as any;

    const statusNode = collectNodes(element, (candidate) => candidate?.props?.children === "Saved")[0];
    expect(statusNode).toBeFalsy();
  });

  it("uses explicit status color when provided", () => {
    const element = DocumentEditorToolbar({
      ...createProps(),
      statusLabel: "Saved",
      statusColor: "success.main",
    }) as any;

    const statusNode = collectNodes(element, (candidate) => candidate?.props?.children === "Saved")[0];
    expect(statusNode.props.color).toBe("success.main");
  });

  it("hides optional control groups when their toggles are false", () => {
    const element = DocumentEditorToolbar({
      ...createProps(),
      showZoomControls: false,
      showAlignmentControls: false,
      showCustomComponentAction: false,
    }) as any;

    const hasZoomLabel = collectNodes(element, (candidate) => candidate?.props?.children === "100%").length > 0;
    const hasCustomButton = collectNodes(element, (candidate) => candidate?.props?.children === "Custom component").length > 0;

    expect(hasZoomLabel).toBe(false);
    expect(hasCustomButton).toBe(false);
  });

  it("applies active formatting colors and renders custom component action", () => {
    const element = DocumentEditorToolbar({
      ...createProps(),
      actions: {
        bold: { active: true, onClick: vi.fn() },
        italic: { active: false, onClick: vi.fn() },
        bulletList: { active: true, onClick: vi.fn() },
        orderedList: { active: false, onClick: vi.fn() },
      },
      showCustomComponentAction: true,
    }) as any;

    const customButton = collectNodes(element, (candidate) => candidate?.props?.children === "Custom component")[0];
    const primaryButtons = collectNodes(element, (candidate) => candidate?.props?.color === "primary");

    expect(primaryButtons.length).toBeGreaterThanOrEqual(2);
    expect(customButton).toBeTruthy();
  });

  it("shows disabled zoom controls when zoom handlers are missing", () => {
    const element = DocumentEditorToolbar({
      ...createProps(),
      showZoomControls: true,
    }) as any;

    const zoomButtons = collectNodes(
      element,
      (candidate) => candidate?.props?.size === "small" && typeof candidate?.props?.disabled === "boolean" && candidate?.props?.onClick === undefined,
    );

    expect(zoomButtons.length).toBeGreaterThanOrEqual(2);
    expect(zoomButtons[0].props.disabled).toBe(true);
    expect(zoomButtons[1].props.disabled).toBe(true);
  });

  it("disables editing controls when canEdit is false", () => {
    const onHeadingChange = vi.fn();
    const onBold = vi.fn();
    const onItalic = vi.fn();
    const onBullet = vi.fn();
    const onOrdered = vi.fn();

    const element = DocumentEditorToolbar({
      ...createProps(),
      canEdit: false,
      onHeadingChange,
      actions: {
        bold: { active: false, onClick: onBold },
        italic: { active: false, onClick: onItalic },
        bulletList: { active: false, onClick: onBullet },
        orderedList: { active: false, onClick: onOrdered },
      },
    }) as any;

    const selectNode = collectNodes(element, (candidate) => typeof candidate?.props?.onChange === "function")[0];
    const controlButtons = collectNodes(
      element,
      (candidate) => candidate?.props?.size === "small" && typeof candidate?.props?.onClick === "function",
    ).filter((node) => [onBold, onItalic, onBullet, onOrdered].includes(node.props.onClick));

    expect(selectNode.props.disabled).toBe(true);
    expect(controlButtons.length).toBe(4);
    controlButtons.forEach((button) => {
      expect(button.props.disabled).toBe(true);
    });
  });
});
