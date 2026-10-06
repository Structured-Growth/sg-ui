import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToolbarSortMenu } from "./DataToolbarSortMenu";

const setAnchor = vi.fn();
const setDraftRules = vi.fn();
const setDraggingIndex = vi.fn();
const setDropIndex = vi.fn();
const useStateMock = vi.fn();
let stateIndex = 0;

const findNodes = (node: any, predicate: (candidate: any) => boolean, found: any[] = []) => {
  if (Array.isArray(node)) {
    node.forEach((child) => findNodes(child, predicate, found));
    return found;
  }

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
    useMemo: <T,>(factory: () => T) => factory(),
    useState: <T,>(initial: T) => useStateMock(initial),
  };
});

vi.mock("../../../i18n", () => ({
  useTranslation: () => ({
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
    useNamespace: () => undefined,
  }),
}));

vi.mock("../../../i18n/labelKey", () => ({
  toLabelKey: (_prefix: string, label: string) => label,
}));

describe("DataToolbarSortMenu", () => {
  beforeEach(() => {
    stateIndex = 0;
    setAnchor.mockClear();
    setDraftRules.mockClear();
    setDraggingIndex.mockClear();
    setDropIndex.mockClear();
    useStateMock.mockReset();
    useStateMock.mockImplementation((initial: unknown) => {
      const states = [
        [null, setAnchor],
        [initial, setDraftRules],
        [null, setDraggingIndex],
        [null, setDropIndex],
      ] as const;
      const resolved = states[stateIndex] ?? [initial, vi.fn()];
      stateIndex += 1;
      return resolved;
    });
  });

  it("opens menu, supports reset/add, and applies valid sort rules", () => {
    const onApply = vi.fn();
    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [{ field: "name", direction: "asc" }],
      onApply,
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0].props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setAnchor).toHaveBeenCalled();

    clickables[1].props.onClick();
    expect(setDraftRules).toHaveBeenCalled();
    const addUpdater = setDraftRules.mock.calls.find((call) => typeof call[0] === "function")?.[0];
    expect(addUpdater).toBeDefined();
    expect(addUpdater([{ field: "name", direction: "asc" }])).toEqual([
      { field: "name", direction: "asc" },
      { field: "status", direction: "asc" },
    ]);

    const resetButton = clickables[clickables.length - 2];
    resetButton.props.onClick();
    const applyButton = clickables[clickables.length - 1];
    applyButton.props.onClick();

    expect(onApply).toHaveBeenCalledWith([{ field: "name", direction: "asc" }]);
    expect(setAnchor).toHaveBeenCalledWith(null);
  });

  it("opens menu with an empty default rule when no sort value exists", () => {
    const element = DataToolbarSortMenu({
      options: [{ id: "name", label: "Name" }],
      value: [],
      onApply: vi.fn(),
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0].props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setDraftRules).toHaveBeenCalledWith([{ field: "", direction: "" }]);
    expect(setAnchor).toHaveBeenCalled();
  });

  it("disables add when no unused sort fields remain", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }], setDraftRules])
      .mockImplementationOnce(() => [0, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [{ id: "name", label: "Name" }],
      value: [{ field: "name", direction: "asc" }],
      onApply: vi.fn(),
    }) as any;

    const addButtons = findNodes(
      element,
      (candidate) => candidate?.props?.disabled === true && typeof candidate?.props?.onClick === "function",
    );
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("filters out incomplete rules during apply", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "" }], setDraftRules])
      .mockImplementationOnce(() => [null, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const onApply = vi.fn();
    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "" },
      ],
      onApply,
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    const applyButton = clickables[clickables.length - 1];
    applyButton.props.onClick();
    expect(onApply).toHaveBeenCalledWith([{ field: "name", direction: "asc" }]);
    expect(setAnchor).toHaveBeenCalledWith(null);
  });

  it("closes popover through onClose handler", () => {
    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const popovers = findNodes(element, (candidate) => typeof candidate?.props?.onClose === "function");
    popovers[0].props.onClose();
    expect(setAnchor).toHaveBeenCalledWith(null);
  });

  it("does not add rule when no options are available", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "", direction: "" }], setDraftRules])
      .mockImplementationOnce(() => [null, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [],
      value: [{ field: "", direction: "" }],
      onApply: vi.fn(),
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0].props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    clickables[1].props.onClick();
    expect(setDraftRules).toHaveBeenCalledTimes(1);
  });

  it("does not add when all fields are already used", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }], setDraftRules])
      .mockImplementationOnce(() => [null, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [{ id: "name", label: "Name" }],
      value: [{ field: "name", direction: "asc" }],
      onApply: vi.fn(),
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[1].props.onClick();
    expect(setDraftRules).not.toHaveBeenCalled();
  });

  it("updates field and direction via select change handlers", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }], setDraftRules])
      .mockImplementationOnce(() => [null, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [{ field: "name", direction: "asc" }],
      onApply: vi.fn(),
    }) as any;

    const selects = findNodes(element, (candidate) => typeof candidate?.props?.onChange === "function");
    expect(selects.length).toBeGreaterThanOrEqual(2);
    selects[0].props.onChange({ target: { value: "status" } });
    selects[1].props.onChange({ target: { value: "desc" } });

    const fieldUpdater = setDraftRules.mock.calls[0][0];
    const directionUpdater = setDraftRules.mock.calls[1][0];
    expect(fieldUpdater([{ field: "name", direction: "asc" }, { field: "other", direction: "asc" }])).toEqual([
      { field: "status", direction: "asc" },
      { field: "other", direction: "asc" },
    ]);
    expect(directionUpdater([{ field: "status", direction: "asc" }, { field: "other", direction: "asc" }])).toEqual([
      { field: "status", direction: "desc" },
      { field: "other", direction: "asc" },
    ]);
  });

  it("handles drag-over and drop reordering", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [1, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const dropRows = findNodes(element, (candidate) => typeof candidate?.props?.onDragOver === "function" && typeof candidate?.props?.onDrop === "function");
    expect(dropRows.length).toBeGreaterThan(0);
    const preventDefault = vi.fn();
    dropRows[0].props.onDragOver({ preventDefault });
    dropRows[0].props.onDrop({ preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(setDropIndex).toHaveBeenCalled();
    expect(setDraggingIndex).toHaveBeenCalledWith(null);
    expect(setDropIndex).toHaveBeenCalledWith(null);

    const reorderUpdater = setDraftRules.mock.calls.find((call) => typeof call[0] === "function")?.[0];
    expect(reorderUpdater).toBeDefined();
    expect(reorderUpdater([{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }])).toEqual([
      { field: "status", direction: "desc" },
      { field: "name", direction: "asc" },
    ]);
  });

  it("skips drag reorder when dropping onto the same row", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [0, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const dropRows = findNodes(element, (candidate) => typeof candidate?.props?.onDrop === "function");
    expect(dropRows.length).toBeGreaterThan(0);
    const preventDefault = vi.fn();
    dropRows[0].props.onDrop({ preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
    expect(setDraftRules).not.toHaveBeenCalled();
  });

  it("supports remove and drag-handle start/end interactions", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [0, setDraggingIndex])
      .mockImplementationOnce(() => [1, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const removeButtons = findNodes(
      element,
      (candidate) =>
        typeof candidate?.props?.onClick === "function" &&
        candidate?.props?.size === "small" &&
        candidate?.props?.sx === undefined,
    );
    expect(removeButtons.length).toBeGreaterThan(0);
    removeButtons[0].props.onClick();

    const removeUpdater = setDraftRules.mock.calls.find((call) => typeof call[0] === "function")?.[0];
    expect(removeUpdater).toBeDefined();
    expect(removeUpdater([{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }])).toEqual([
      { field: "status", direction: "desc" },
    ]);

    const dragHandles = findNodes(
      element,
      (candidate) => typeof candidate?.props?.onDragStart === "function" && typeof candidate?.props?.onDragEnd === "function",
    );
    expect(dragHandles.length).toBeGreaterThan(0);
    const setData = vi.fn();
    dragHandles[0].props.onDragStart({
      dataTransfer: {
        effectAllowed: "",
        setData,
      },
    });
    dragHandles[0].props.onDragEnd();

    expect(setDraggingIndex).toHaveBeenCalledWith(0);
    expect(setData).toHaveBeenCalledWith("text/plain", "0");
    expect(setDraggingIndex).toHaveBeenCalledWith(null);
    expect(setDropIndex).toHaveBeenCalledWith(null);
  });

  it("returns early for guarded drag-drop paths", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [null, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const elementNoDrag = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const rowsNoDrag = findNodes(elementNoDrag, (candidate) => typeof candidate?.props?.onDragOver === "function");
    const preventDefault = vi.fn();
    rowsNoDrag[0].props.onDragOver({ preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();

    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [-1, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const elementNegativeDrag = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const rowsNegativeDrag = findNodes(elementNegativeDrag, (candidate) => typeof candidate?.props?.onDrop === "function");
    rowsNegativeDrag[0].props.onDrop({ preventDefault: vi.fn() });
    expect(setDraftRules).not.toHaveBeenCalled();

    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [5, setDraggingIndex])
      .mockImplementationOnce(() => [null, setDropIndex]);

    const elementOutOfRangeDrag = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const rowsOutOfRangeDrag = findNodes(elementOutOfRangeDrag, (candidate) => typeof candidate?.props?.onDrop === "function");
    rowsOutOfRangeDrag[0].props.onDrop({ preventDefault: vi.fn() });
    const outOfRangeMoveUpdater = [...setDraftRules.mock.calls].reverse().find((call) => typeof call[0] === "function")?.[0];
    expect(outOfRangeMoveUpdater).toBeDefined();
    const existing = [{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }];
    expect(outOfRangeMoveUpdater(existing)).toBe(existing);
  });

  it("keeps drop index when dragging over the same target repeatedly", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [[{ field: "name", direction: "asc" }, { field: "status", direction: "desc" }], setDraftRules])
      .mockImplementationOnce(() => [1, setDraggingIndex])
      .mockImplementationOnce(() => [0, setDropIndex]);

    const element = DataToolbarSortMenu({
      options: [
        { id: "name", label: "Name" },
        { id: "status", label: "Status" },
      ],
      value: [
        { field: "name", direction: "asc" },
        { field: "status", direction: "desc" },
      ],
      onApply: vi.fn(),
    }) as any;

    const rows = findNodes(element, (candidate) => typeof candidate?.props?.onDragOver === "function");
    rows[0].props.onDragOver({ preventDefault: vi.fn() });
    const dropUpdater = setDropIndex.mock.calls[0][0];
    expect(dropUpdater(0)).toBe(0);
    expect(dropUpdater(1)).toBe(0);
  });

});
