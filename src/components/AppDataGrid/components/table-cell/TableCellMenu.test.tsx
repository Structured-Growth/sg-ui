import { describe, expect, it, vi } from "vitest";

const setAnchorEl = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(initial: T) => [initial, setAnchorEl] as const,
  };
});

describe("TableCellMenu", () => {
  it("wires menu open/close and invokes row action handlers", async () => {
    const { TableCellMenu } = await import("./TableCellMenu");
    const onClick = vi.fn();
    const row = { id: "row-1" };

    const element = TableCellMenu({
      row,
      actions: [
        { id: "edit", label: "Edit", onClick },
        { id: "view", label: "View", href: "/rows/1", onClick },
      ],
    }) as any;

    const [iconButton, menu] = element.props.children as any[];
    iconButton.props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setAnchorEl).toHaveBeenCalled();
    expect(menu.props.open).toBe(false);

    const menuItems = menu.props.children as any[];
    menuItems[0].props.onClick();
    menuItems[1].props.onClick();
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(setAnchorEl).toHaveBeenCalledWith(null);
    expect(menuItems[1].props.href).toBe("/rows/1");
  }, 20000);
});
