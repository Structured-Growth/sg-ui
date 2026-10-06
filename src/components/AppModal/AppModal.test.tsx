import { describe, expect, it, vi } from "vitest";
import { AppModal } from "./AppModal";

describe("AppModal", () => {
  it("blocks backdrop close when disableBackdropClose is true", () => {
    const onClose = vi.fn();
    const element = AppModal({
      open: true,
      onClose,
      disableBackdropClose: true,
      children: "content",
    }) as any;

    element.props.onClose({ type: "click" }, "backdropClick");
    expect(onClose).not.toHaveBeenCalled();

    element.props.onClose({ type: "esc" }, "escapeKeyDown");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("builds step/footer text and applies size settings", () => {
    const element = AppModal({
      open: true,
      title: "Edit Activity",
      children: "content",
      steps: { current: 1, total: 2 },
      primaryAction: { label: "Save" },
      secondaryAction: { label: "Cancel" },
      size: "xl",
      heightMode: "md",
    }) as any;

    expect(element.props.maxWidth).toBe("xl");
    expect(element.props.PaperProps.sx.height).toBe("68vh");

    const dialogChildren = element.props.children as any[];
    const actions = dialogChildren[2];
    const footerStack = actions.props.children.props.children[1];
    expect(footerStack.props.children[0].props.children).toBe("Cancel");
    expect(footerStack.props.children[1].props.children).toBe("Save");
  });

  it("renders close button and triggers onClose with escape reason", () => {
    const onClose = vi.fn();
    const element = AppModal({
      open: true,
      title: "Title",
      children: "content",
      showCloseButton: true,
      onClose,
    }) as any;

    const dialogChildren = element.props.children as any[];
    const header = dialogChildren[0];
    const closeButton = header.props.children.props.children[1];
    closeButton.props.onClick({ type: "click" });
    expect(onClose).toHaveBeenCalledWith(expect.anything(), "escapeKeyDown");
  });

  it("supports custom width/height and full-screen mode", () => {
    const element = AppModal({
      open: true,
      children: "content",
      size: "full",
      width: 900,
      height: "70vh",
      steps: { current: 1, total: 1, label: "Custom step" },
    }) as any;

    expect(element.props.fullScreen).toBe(true);
    expect(element.props.maxWidth).toBe(false);
    expect(element.props.PaperProps.sx.width).toBe(900);
    expect(element.props.PaperProps.sx.height).toBe("70vh");

    const dialogChildren = element.props.children as any[];
    const actions = dialogChildren[2];
    const stepText = actions.props.children.props.children[0];
    expect(stepText.props.children).toBe("Custom step");
  });

  it("applies xl fallback paper sizing when no explicit width/height is provided", () => {
    const element = AppModal({
      open: true,
      children: "content",
      size: "xl",
      heightMode: "auto",
    }) as any;

    expect(element.props.maxWidth).toBe("xl");
    expect(element.props.PaperProps.sx.height).toBe("92vh");
    expect(element.props.PaperProps.sx.width).toBe("96vw");
    expect(element.props.PaperProps.sx.maxWidth).toBe("96vw");
  });

  it("supports small and large preset height modes and xl width override", () => {
    const small = AppModal({
      open: true,
      children: "content",
      heightMode: "sm",
    }) as any;
    expect(small.props.PaperProps.sx.height).toBe("56vh");

    const large = AppModal({
      open: true,
      children: "content",
      heightMode: "lg",
    }) as any;
    expect(large.props.PaperProps.sx.height).toBe("80vh");

    const xlWithCustomWidth = AppModal({
      open: true,
      children: "content",
      size: "xl",
      width: 800,
    }) as any;
    expect(xlWithCustomWidth.props.PaperProps.sx.width).toBe(800);
    expect(xlWithCustomWidth.props.PaperProps.sx.maxWidth).toBe("none");
  });

  it("falls back to small modal size when nullable size inputs are provided", () => {
    const element = AppModal({
      open: true,
      children: "content",
      size: null as any,
      maxWidth: null as any,
    }) as any;
    expect(element.props.maxWidth).toBe("sm");
  });

  it("renders subtitle without title when provided", () => {
    const element = AppModal({
      open: true,
      subtitle: "Only subtitle",
      children: "content",
    }) as any;
    const dialogChildren = element.props.children as any[];
    const header = dialogChildren[0];
    const headerBlock = header.props.children.props.children[0].props.children;
    expect(headerBlock.props.children[0]).toBeNull();
    expect(headerBlock.props.children[1].props.children).toBe("Only subtitle");
  });

  it("renders custom header/footer content and can render without header/footer sections", () => {
    const withCustomBlocks = AppModal({
      open: true,
      children: "content",
      headerContent: "Custom Header",
      footerContent: "Custom Footer",
    }) as any;
    const withCustomChildren = withCustomBlocks.props.children as any[];
    expect(withCustomChildren[0].props.children.props.children[0].props.children).toBe("Custom Header");
    expect(withCustomChildren[2].props.children.props.children[1]).toBe("Custom Footer");

    const minimal = AppModal({
      open: true,
      children: "content",
    }) as any;
    const minimalChildren = minimal.props.children as any[];
    expect(minimalChildren).toHaveLength(3);
    expect(minimalChildren[0]).toBeNull();
    expect(minimalChildren[2]).toBeNull();
  });
});
