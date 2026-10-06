import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToolbarFilterMenu } from "./DataToolbarFilterMenu";

const setAnchor = vi.fn();
const setDraftRules = vi.fn();
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

describe("DataToolbarFilterMenu", () => {
  beforeEach(() => {
    stateIndex = 0;
    setAnchor.mockClear();
    setDraftRules.mockClear();
    useStateMock.mockReset();
    useStateMock.mockImplementation((initial: unknown) => {
      const states = [
        [null, setAnchor],
        [initial, setDraftRules],
      ] as const;
      const resolved = states[stateIndex] ?? [initial, vi.fn()];
      stateIndex += 1;
      return resolved;
    });
  });

  it("opens menu and applies only valid rules", () => {
    const onApply = vi.fn();
    const value = [{ field: "name", operator: "contains", value: "harry" }] as any;

    const element = DataToolbarFilterMenu({
      fields: [{ id: "name", label: "Name", type: "string" }],
      value,
      onApply,
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0].props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setAnchor).toHaveBeenCalled();

    const applyButton = clickables[clickables.length - 1];
    applyButton.props.onClick();
    expect(onApply).toHaveBeenCalledWith(value);
    expect(setAnchor).toHaveBeenCalledWith(null);
  });

  it("does not apply invalid rules and supports add/remove/reset handlers", () => {
    const onApply = vi.fn();
    const element = DataToolbarFilterMenu({
      fields: [
        { id: "name", label: "Name", type: "string" },
        { id: "status", label: "Status", type: "enum", enumOptions: [{ id: "active", label: "Active" }] },
      ],
      value: [{ field: "name", operator: "contains", value: "" }] as any,
      onApply,
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[1].props.onClick();
    expect(setDraftRules).toHaveBeenCalledWith(expect.any(Function));
    const addUpdater = setDraftRules.mock.calls[0][0];
    expect(addUpdater([{ field: "name", operator: "contains", value: "" }])).toEqual([
      { field: "name", operator: "contains", value: "" },
      { field: "", operator: "", value: "" },
    ]);

    clickables[2].props.onClick();
    expect(setDraftRules).toHaveBeenCalledWith(expect.any(Function));

    clickables[clickables.length - 2].props.onClick();
    expect(setDraftRules).toHaveBeenCalledWith([{ field: "", operator: "", value: "" }]);

    clickables[clickables.length - 1].props.onClick();
    expect(onApply).toHaveBeenCalledWith([]);
  });

  it("counts enum rules as active when serialized values exist", () => {
    const element = DataToolbarFilterMenu({
      fields: [
        {
          id: "status",
          label: "Status",
          type: "enum",
          enumOptions: [
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
          ],
        },
      ],
      value: [{ field: "status", operator: "is", value: JSON.stringify(["active"]) }],
      onApply: vi.fn(),
    }) as any;

    const badgeNodes = findNodes(element, (candidate) => candidate?.props?.badgeContent === 1);
    expect(badgeNodes.length).toBeGreaterThan(0);
  });

  it("closes popover via onClose handler", () => {
    const element = DataToolbarFilterMenu({
      fields: [{ id: "name", label: "Name", type: "string" }],
      value: [{ field: "name", operator: "contains", value: "harry" }] as any,
      onApply: vi.fn(),
    }) as any;

    const popover = findNodes(element, (candidate) => typeof candidate?.props?.onClose === "function")[0];
    popover.props.onClose();
    expect(setAnchor).toHaveBeenCalledWith(null);
  });

  it("updates field/operator/value through change handlers", () => {
    const element = DataToolbarFilterMenu({
      fields: [{ id: "name", label: "Name", type: "string" }],
      value: [{ field: "name", operator: "contains", value: "harry" }] as any,
      onApply: vi.fn(),
    }) as any;

    const changeables = findNodes(element, (candidate) => typeof candidate?.props?.onChange === "function");
    changeables[0].props.onChange({ target: { value: "name" } });
    changeables[1].props.onChange({ target: { value: "equals" } });
    changeables[2].props.onChange({ target: { value: "potter" } });
    expect(setDraftRules).toHaveBeenCalledTimes(3);

    const updateFieldFn = setDraftRules.mock.calls[0][0];
    const updateOperatorFn = setDraftRules.mock.calls[1][0];
    const updateValueFn = setDraftRules.mock.calls[2][0];
    expect(
      updateFieldFn([
        { field: "name", operator: "contains", value: "harry" },
        { field: "status", operator: "is", value: "active" },
      ]),
    ).toEqual([
      { field: "name", operator: "contains", value: "" },
      { field: "status", operator: "is", value: "active" },
    ]);
    expect(
      updateOperatorFn([
        { field: "name", operator: "contains", value: "harry" },
        { field: "status", operator: "is", value: "active" },
      ]),
    ).toEqual([
      { field: "name", operator: "equals", value: "" },
      { field: "status", operator: "is", value: "active" },
    ]);
    expect(
      updateValueFn([
        { field: "name", operator: "contains", value: "harry" },
        { field: "status", operator: "is", value: "active" },
      ]),
    ).toEqual([
      { field: "name", operator: "contains", value: "potter" },
      { field: "status", operator: "is", value: "active" },
    ]);

    changeables[0].props.onChange({ target: { value: "missing_field" } });
    const missingFieldUpdater = setDraftRules.mock.calls[3][0];
    expect(missingFieldUpdater([{ field: "name", operator: "contains", value: "harry" }])).toEqual([
      { field: "missing_field", operator: "", value: "" },
    ]);
  });

  it("handles enum multi-select parsing and renderValue output", () => {
    const element = DataToolbarFilterMenu({
      fields: [
        {
          id: "status",
          label: "Status",
          type: "enum",
          enumOptions: [
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
          ],
        },
      ],
      value: [{ field: "status", operator: "is", value: "" }] as any,
      onApply: vi.fn(),
    }) as any;

    const enumSelect = findNodes(element, (candidate) => candidate?.props?.multiple === true)[0];
    enumSelect.props.onChange({ target: { value: ["active", "inactive"] } });
    const arrayUpdateCall = setDraftRules.mock.calls.find((call) => typeof call[0] === "function");
    expect(arrayUpdateCall[0]([{ field: "status", operator: "is", value: "" }])).toEqual([
      { field: "status", operator: "is", value: "active|||inactive" },
    ]);
    expect(
      arrayUpdateCall[0]([
        { field: "status", operator: "is", value: "" },
        { field: "other", operator: "contains", value: "x" },
      ]),
    ).toEqual([
      { field: "status", operator: "is", value: "active|||inactive" },
      { field: "other", operator: "contains", value: "x" },
    ]);

    enumSelect.props.onChange({ target: { value: "active, inactive ," } });
    const updateCall = setDraftRules.mock.calls.find((call) => typeof call[0] === "function");
    expect(updateCall).toBeDefined();
    expect(updateCall[0]([{ field: "status", operator: "is", value: "" }])).toEqual([
      { field: "status", operator: "is", value: "active|||inactive" },
    ]);
    enumSelect.props.onChange({ target: { value: [] } });
    const clearCall = setDraftRules.mock.calls.filter((call) => typeof call[0] === "function")[2];
    expect(clearCall[0]([{ field: "status", operator: "is", value: "active|||inactive" }])).toEqual([
      { field: "status", operator: "is", value: "" },
    ]);

    expect(enumSelect.props.renderValue([])).toBe("Select values");
    expect(enumSelect.props.renderValue(["active", "unknown"])).toBe("Active, unknown");
  });

  it("uses empty defaults when there is no initial value", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce((initial) => [initial, setDraftRules]);

    const element = DataToolbarFilterMenu({
      fields: [{ id: "name", label: "Name", type: "string" }],
      value: [],
      onApply: vi.fn(),
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0].props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setDraftRules).toHaveBeenCalledWith([{ field: "", operator: "", value: "" }]);
  });

  it("handles enum fields without enumOptions", () => {
    const element = DataToolbarFilterMenu({
      fields: [{ id: "status", label: "Status", type: "enum" }],
      value: [{ field: "status", operator: "is", value: "" }] as any,
      onApply: vi.fn(),
    }) as any;

    const enumSelect = findNodes(element, (candidate) => candidate?.props?.multiple === true)[0];
    expect(enumSelect.props.renderValue(["unknown"])).toBe("unknown");
  });

  it("renders enum selections and supports number/date value inputs", () => {
    const enumElement = DataToolbarFilterMenu({
      fields: [
        {
          id: "status",
          label: "Status",
          type: "enum",
          enumOptions: [
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
          ],
        },
      ],
      value: [{ field: "status", operator: "is", value: "active|||inactive" }] as any,
      onApply: vi.fn(),
    }) as any;
    const checkedBoxes = findNodes(enumElement, (candidate) => candidate?.props?.checked === true);
    expect(checkedBoxes.length).toBeGreaterThan(0);

    const numberElement = DataToolbarFilterMenu({
      fields: [{ id: "score", label: "Score", type: "number" }],
      value: [{ field: "score", operator: "eq", value: "10" }] as any,
      onApply: vi.fn(),
    }) as any;
    expect(findNodes(numberElement, (candidate) => candidate?.props?.type === "number").length).toBeGreaterThan(0);

    const dateElement = DataToolbarFilterMenu({
      fields: [{ id: "createdAt", label: "Created At", type: "date" }],
      value: [{ field: "createdAt", operator: "on", value: "2025-01-01" }] as any,
      onApply: vi.fn(),
    }) as any;
    expect(findNodes(dateElement, (candidate) => candidate?.props?.type === "date").length).toBeGreaterThan(0);
  });

  it("computes active badge count from only valid rules", () => {
    const element = DataToolbarFilterMenu({
      fields: [{ id: "name", label: "Name", type: "string" }],
      value: [
        { field: "unknown", operator: "contains", value: "x" },
        { field: "name", operator: "", value: "x" },
        { field: "name", operator: "eq", value: "x" },
        { field: "name", operator: "is_empty", value: "" },
      ] as any,
      onApply: vi.fn(),
    }) as any;

    const badges = findNodes(element, (candidate) => candidate?.props?.badgeContent === 1);
    expect(badges.length).toBeGreaterThan(0);
  });

  it("applies only valid draft rules across value-required and no-value operators", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [
        [
          { field: "name", operator: "contains", value: "" },
          { field: "name", operator: "is_empty", value: "" },
          { field: "name", operator: "eq", value: "123" },
          { field: "name", operator: "not_real", value: "x" },
          { field: "", operator: "contains", value: "x" },
        ],
        setDraftRules,
      ]);

    const onApply = vi.fn();
    const element = DataToolbarFilterMenu({
      fields: [{ id: "name", label: "Name", type: "string" }],
      value: [{ field: "name", operator: "contains", value: "seed" }] as any,
      onApply,
    }) as any;

    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    const applyButton = clickables[clickables.length - 1];
    applyButton.props.onClick();

    expect(onApply).toHaveBeenCalledWith([
      { field: "name", operator: "is_empty", value: "" },
    ]);
    expect(setAnchor).toHaveBeenCalledWith(null);
  });

  it("removes a draft rule when multiple rules are shown", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setAnchor])
      .mockImplementationOnce(() => [
        [
          { field: "name", operator: "contains", value: "harry" },
          { field: "status", operator: "is", value: "active|||inactive" },
        ],
        setDraftRules,
      ]);

    const element = DataToolbarFilterMenu({
      fields: [
        { id: "name", label: "Name", type: "string" },
        {
          id: "status",
          label: "Status",
          type: "enum",
          enumOptions: [
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
          ],
        },
      ],
      value: [
        { field: "name", operator: "contains", value: "harry" },
        { field: "status", operator: "is", value: "active|||inactive" },
      ] as any,
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

    const removeRuleUpdater = setDraftRules.mock.calls.find((call) => typeof call[0] === "function")?.[0];
    expect(removeRuleUpdater).toBeDefined();
    expect(
      removeRuleUpdater([
        { field: "name", operator: "contains", value: "harry" },
        { field: "status", operator: "is", value: "active|||inactive" },
      ]),
    ).toEqual([{ field: "status", operator: "is", value: "active|||inactive" }]);
  });
});
