import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataToolbarColumnsMenu } from "./DataToolbarColumnsMenu";

const setState = vi.fn();
const useStateMock = vi.fn();

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
    useCallback: <T,>(fn: T) => fn,
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

describe("DataToolbarColumnsMenu", () => {
  beforeEach(() => {
    setState.mockClear();
    useStateMock.mockReset();
    useStateMock.mockImplementation((initial: unknown) => [initial, setState]);
  });

  it("opens menu and updates column visibility + reset", () => {
    const onChange = vi.fn();
    const options = [
      { id: "name", label: "Name", visible: true },
      { id: "status", label: "Status", visible: false },
    ];
    const element = DataToolbarColumnsMenu({ options, onChange }) as any;

    const nodesWithOnClick = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    nodesWithOnClick[0].props.onClick({ currentTarget: { nodeName: "BUTTON" } });
    expect(setState).toHaveBeenCalled();

    nodesWithOnClick[1].props.onClick();
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toHaveLength(2);

    const resetButton = nodesWithOnClick[nodesWithOnClick.length - 1];
    resetButton.props.onClick();
    expect(onChange).toHaveBeenCalledWith([
      { id: "name", label: "Name", visible: true },
      { id: "status", label: "Status", visible: true },
    ]);
  });

  it("keeps locked columns visible when toggled", () => {
    const onChange = vi.fn();
    const options = [
      { id: "name", label: "Name", locked: true, visible: true },
      { id: "status", label: "Status", visible: true },
    ];
    const element = DataToolbarColumnsMenu({ options, onChange }) as any;
    const nodesWithOnClick = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    nodesWithOnClick[1].props.onClick();
    expect(onChange).toHaveBeenCalledWith([
      { id: "name", label: "Name", locked: true, visible: true },
      { id: "status", label: "Status", visible: true },
    ]);
  });

  it("toggles an unlocked row option from the menu list", () => {
    const onChange = vi.fn();
    const options = [
      { id: "name", label: "Name", visible: true },
      { id: "status", label: "Status", visible: true },
    ];
    const element = DataToolbarColumnsMenu({ options, onChange }) as any;
    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[1].props.onClick();

    const nextOptions = onChange.mock.calls[0][0];
    expect(nextOptions).toHaveLength(2);
    expect(nextOptions.some((option: { visible: boolean }) => option.visible === false)).toBe(true);
  });

  it("returns empty filtered options state when search has no matches", () => {
    useStateMock
      .mockImplementationOnce(() => [null, setState])
      .mockImplementationOnce(() => ["no-match", setState]);

    const element = DataToolbarColumnsMenu({
      options: [{ id: "name", label: "Name", visible: true }],
      onChange: vi.fn(),
    }) as any;

    const noMatchText = findNodes(
      element,
      (candidate) => candidate?.props?.children === "No matching columns",
    );
    expect(noMatchText.length).toBeGreaterThan(0);
  });

  it("resets anchor/query on popover close and updates query from input", () => {
    const element = DataToolbarColumnsMenu({
      options: [{ id: "name", label: "Name", visible: true }],
      onChange: vi.fn(),
    }) as any;

    const input = findNodes(element, (candidate) => typeof candidate?.props?.onChange === "function")[0];
    input.props.onChange({ target: { value: "na" } });
    const popover = findNodes(element, (candidate) => typeof candidate?.props?.onClose === "function")[0];
    popover.props.onClose();

    const setCalls = setState.mock.calls.map((call) => call[0]);
    expect(setCalls).toContain("na");
    expect(setCalls).toContain(null);
    expect(setCalls).toContain("");
  });


});
