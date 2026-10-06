import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToolbar } from "./DataToolbar";

const setState = vi.fn();
const useStateMock = vi.fn();
const useNamespace = vi.fn();

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

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useEffect: (effect: () => void | (() => void)) => {
      const cleanup = effect();
      if (typeof cleanup === "function") {
        cleanup();
      }
    },
    useMemo: <T,>(factory: () => T) => factory(),
    useRef: <T,>(value: T) => ({ current: value }),
    useState: <T,>(initial: T) => useStateMock(initial),
  };
});

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
    useNamespace,
  }),
}));

vi.mock("./components/DataToolbarColumnsMenu", () => ({
  DataToolbarColumnsMenu: (props: unknown) => ({ type: "DataToolbarColumnsMenu", props }),
}));

vi.mock("./components/DataToolbarSortMenu", () => ({
  DataToolbarSortMenu: (props: unknown) => ({ type: "DataToolbarSortMenu", props }),
}));

vi.mock("./components/DataToolbarFilterMenu", () => ({
  DataToolbarFilterMenu: (props: unknown) => ({ type: "DataToolbarFilterMenu", props }),
}));

describe("DataToolbar", () => {
  beforeEach(() => {
    setState.mockClear();
    useStateMock.mockReset();
    useStateMock.mockImplementation((initial: unknown) => [initial, setState]);
    useNamespace.mockClear();
    vi.stubGlobal("window", {
      cancelAnimationFrame: vi.fn(),
      requestAnimationFrame: vi.fn((callback: () => void) => {
        callback();
        return 1;
      }),
    });
  });

  it("renders fallback actions and toggles view mode", () => {
    const onRefresh = vi.fn();
    const onViewModeChange = vi.fn();

    const element = DataToolbar({
      onRefresh,
      showViewModeToggle: true,
      viewMode: "cards",
      onViewModeChange,
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0].props.onClick();
    expect(onRefresh).toHaveBeenCalled();

    const toggleGroup = findNodes(element, (candidate) => typeof candidate?.props?.onChange === "function").find(
      (candidate) => candidate?.props?.exclusive,
    );
    toggleGroup.props.onChange(null, "list");
    expect(onViewModeChange).toHaveBeenCalledWith("list");
    toggleGroup.props.onChange(null, null);
    expect(onViewModeChange).toHaveBeenCalledTimes(1);
    expect(useNamespace).toHaveBeenCalledWith("common.ui");
  });

  it("derives view mode toggle visibility from handlers when prop is omitted", () => {
    const withHandlers = DataToolbar({
      viewMode: "cards",
      onViewModeChange: vi.fn(),
    }) as any;
    expect(findNodes(withHandlers, (candidate) => candidate?.props?.exclusive === true)).toHaveLength(1);

    const withoutHandlers = DataToolbar({
      viewMode: "cards",
    }) as any;
    expect(findNodes(withoutHandlers, (candidate) => candidate?.props?.exclusive === true)).toHaveLength(0);
  });

  it("renders integrated menu components when options are provided", () => {
    const onSearchValueChange = vi.fn();
    const element = DataToolbar({
      columnOptions: [{ id: "name", label: "Name", visible: true }],
      onColumnOptionsChange: vi.fn(),
      sortOptions: [{ id: "name", label: "Name" }],
      sortRules: [{ field: "name", direction: "asc" }],
      onSortRulesChange: vi.fn(),
      filterFields: [{ id: "name", label: "Name", type: "string" }],
      filterRules: [{ field: "name", operator: "contains", value: "x" }],
      onFilterRulesChange: vi.fn(),
      searchValue: "abc",
      onSearchValueChange,
    }) as any;

    const menuNodes = findNodes(element, (candidate) =>
      ["DataToolbarColumnsMenu", "DataToolbarSortMenu", "DataToolbarFilterMenu"].includes(candidate?.type?.name),
    );
    expect(menuNodes.map((node) => node.type.name)).toEqual([
      "DataToolbarColumnsMenu",
      "DataToolbarSortMenu",
      "DataToolbarFilterMenu",
    ]);

    const input = findNodes(element, (candidate) => typeof candidate?.props?.onChange === "function").find(
      (candidate) => candidate?.props?.placeholder === "Search",
    );
    input.props.onChange({ target: { value: "new value" } });
    expect(onSearchValueChange).toHaveBeenCalledWith("new value");
  });

  it("handles internal search close behavior and hides view toggle without handlers", () => {
    useStateMock
      .mockImplementationOnce(() => [true, setState])
      .mockImplementationOnce(() => ["typed", setState]);

    const element = DataToolbar({
      showViewModeToggle: false,
      showColumnsButton: false,
      showSortButton: false,
      showFilterButton: false,
    }) as any;

    const blurInput = findNodes(element, (candidate) => typeof candidate?.props?.onBlur === "function")[0];
    blurInput.props.onBlur();
    expect(setState).not.toHaveBeenCalledWith(false);

    const closeButton = findNodes(
      element,
      (candidate) => typeof candidate?.props?.onClick === "function" && candidate?.props?.size === "small",
    ).at(-1);
    closeButton.props.onClick();
    expect(setState).toHaveBeenCalledWith("");
    expect(setState).toHaveBeenCalledWith(false);

    const toggleGroups = findNodes(element, (candidate) => candidate?.props?.exclusive === true);
    expect(toggleGroups).toHaveLength(0);
  });

  it("opens search and closes on blur when value is empty", () => {
    const collapsedElement = DataToolbar({
      showRefreshButton: false,
      showColumnsButton: false,
      showSortButton: false,
      showFilterButton: false,
      showViewModeToggle: false,
    }) as any;
    const searchButton = findNodes(
      collapsedElement,
      (candidate) => typeof candidate?.props?.onClick === "function" && candidate?.props?.size === "small",
    )[0];
    searchButton.props.onClick();
    expect(setState).toHaveBeenCalledWith(true);

    useStateMock
      .mockImplementationOnce(() => [true, setState])
      .mockImplementationOnce(() => ["   ", setState]);
    const openElement = DataToolbar({
      showRefreshButton: false,
      showColumnsButton: false,
      showSortButton: false,
      showFilterButton: false,
      showViewModeToggle: false,
    }) as any;
    const blurInput = findNodes(openElement, (candidate) => typeof candidate?.props?.onBlur === "function")[0];
    blurInput.props.onBlur();
    expect(setState).toHaveBeenCalledWith(false);
    expect((window as any).cancelAnimationFrame).toHaveBeenCalled();
  });

  it("hides search block when showSearchButton is false and closes empty value without reset", () => {
    useStateMock
      .mockImplementationOnce(() => [true, setState])
      .mockImplementationOnce(() => ["", setState]);
    const element = DataToolbar({
      showRefreshButton: false,
      showColumnsButton: false,
      showSortButton: false,
      showFilterButton: false,
      showSearchButton: false,
      showViewModeToggle: false,
    }) as any;
    expect(findNodes(element, (candidate) => typeof candidate?.props?.onBlur === "function")).toHaveLength(0);

    useStateMock
      .mockImplementationOnce(() => [true, setState])
      .mockImplementationOnce(() => ["", setState]);
    const openElement = DataToolbar({
      showRefreshButton: false,
      showColumnsButton: false,
      showSortButton: false,
      showFilterButton: false,
      showViewModeToggle: false,
    }) as any;
    const closeButton = findNodes(
      openElement,
      (candidate) => typeof candidate?.props?.onClick === "function" && candidate?.props?.size === "small",
    ).at(-1);
    setState.mockClear();
    closeButton.props.onClick();
    expect(setState).toHaveBeenCalledWith(false);
    expect(setState).not.toHaveBeenCalledWith("");
  });
});
