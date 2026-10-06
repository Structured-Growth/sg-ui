import { describe, expect, it, vi } from "vitest";
import { RowSubHeader } from "./RowSubHeader";

describe("RowSubHeader", () => {
  it("renders expanded state with trailing content and handlers", () => {
    const onToggle = vi.fn();
    const onTitleDoubleClick = vi.fn();
    const element = RowSubHeader({
      title: "Learners",
      expanded: true,
      onToggle,
      onTitleDoubleClick,
      titleTooltip: "Section learners",
      trailingContent: "3 selected",
      titleVariant: "h6",
    }) as any;

    const [iconButton, title, trailing] = element.props.children as any[];
    expect(iconButton.props["aria-label"]).toBe("Collapse section");
    iconButton.props.onClick();
    expect(onToggle).toHaveBeenCalledTimes(1);

    expect(title.props.variant).toBe("h6");
    expect(title.props.title).toBe("Section learners");
    expect(title.props.sx).toEqual({ cursor: "text" });
    title.props.onDoubleClick();
    expect(onTitleDoubleClick).toHaveBeenCalledTimes(1);
    expect(title.props.children).toBe("Learners");

    expect(trailing.props.children).toBe("3 selected");
  });

  it("renders collapsed state and omits optional props when unset", () => {
    const element = RowSubHeader({
      title: "Courses",
      expanded: false,
    }) as any;

    const [iconButton, title, trailing] = element.props.children as any[];
    expect(iconButton.props["aria-label"]).toBe("Expand section");
    expect(title.props.variant).toBe("body2");
    expect(title.props.sx).toBeUndefined();
    expect(title.props.title).toBeUndefined();
    expect(trailing).toBeNull();
  });
});
