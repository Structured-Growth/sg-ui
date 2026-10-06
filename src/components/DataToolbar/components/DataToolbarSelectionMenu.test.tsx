import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToolbarSelectionMenu } from "./DataToolbarSelectionMenu";

const setAnchorEl = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(initial: T) => [initial, setAnchorEl] as const,
  };
});

describe("DataToolbarSelectionMenu", () => {
  beforeEach(() => {
    setAnchorEl.mockClear();
  });

  it("wires checkbox, menu open, and option selection handlers", () => {
    const onToggleSelection = vi.fn();
    const onSelectOption = vi.fn();

    const element = DataToolbarSelectionMenu({
      options: [
        { id: "all", label: "All" },
        { id: "none", label: "None" },
      ],
      selectionState: "some",
      onToggleSelection,
      onSelectOption,
    }) as any;

    const [triggerBox, menu] = element.props.children as any[];
    const checkbox = triggerBox.props.children[0];
    const trigger = triggerBox.props.children[1];
    checkbox.props.onChange();
    trigger.props.onClick({ currentTarget: { nodeName: "BUTTON" } });

    expect(onToggleSelection).toHaveBeenCalled();
    expect(setAnchorEl).toHaveBeenCalled();
    expect(menu.props.open).toBe(false);

    const firstOption = menu.props.children[0];
    firstOption.props.onClick();
    expect(onSelectOption).toHaveBeenCalledWith("all");
    expect(setAnchorEl).toHaveBeenCalledWith(null);

    menu.props.onClose();
    expect(setAnchorEl).toHaveBeenCalledWith(null);
  });
});
