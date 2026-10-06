import { describe, expect, it, vi } from "vitest";

const setMenuAnchor = vi.fn();
const useNamespace = vi.fn();
const stateControl = vi.hoisted(() => ({
  value: undefined as unknown,
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(initial: T) => [((stateControl.value ?? initial) as T), setMenuAnchor] as const,
  };
});

vi.mock("../../../../i18n", () => ({
  useTranslation: () => ({
    useNamespace,
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}));

describe("TableHeaderSortMenu", () => {
  it("renders and wires sort menu actions", async () => {
    stateControl.value = undefined;
    const { TableHeaderSortMenu } = await import("./TableHeaderSortMenu");
    const onSortSelect = vi.fn();
    const element = TableHeaderSortMenu({
      label: "Name",
      sortDirection: "asc",
      onSortSelect,
    }) as any;

    const [headerContent, triggerButton, menu] = element.props.children as any[];
    expect(headerContent).toBeTruthy();
    triggerButton.props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setMenuAnchor).toHaveBeenCalled();

    const menuItems = menu.props.children as any[];
    menuItems[0].props.onClick();
    menuItems[1].props.onClick();
    menuItems[2].props.onClick();
    expect(onSortSelect).toHaveBeenNthCalledWith(1, "asc");
    expect(onSortSelect).toHaveBeenNthCalledWith(2, "desc");
    expect(onSortSelect).toHaveBeenNthCalledWith(3, "");
    expect(useNamespace).toHaveBeenCalledWith("common.ui");
  }, 20000);

  it("closes anchor when trigger is clicked while menu is already open", async () => {
    stateControl.value = { nodeName: "DIV" };
    const { TableHeaderSortMenu } = await import("./TableHeaderSortMenu");
    const element = TableHeaderSortMenu({
      label: "Name",
      sortDirection: "",
      onSortSelect: vi.fn(),
    }) as any;
    const [, triggerButton, menu] = element.props.children as any[];
    expect(menu.props.open).toBe(true);

    triggerButton.props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setMenuAnchor).toHaveBeenCalledWith(null);

    const menuItems = menu.props.children as any[];
    expect(menuItems.filter(Boolean)).toHaveLength(2);
  });
});
