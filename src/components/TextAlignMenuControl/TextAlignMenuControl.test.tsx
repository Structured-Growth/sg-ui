import { describe, expect, it, vi } from "vitest";
import { TextAlignMenuControl } from "./TextAlignMenuControl";

const stateControl = vi.hoisted(() => ({
  anchor: null as unknown,
}));
const setAnchorMock = vi.hoisted(() => vi.fn((value: unknown) => { stateControl.anchor = value; }));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useState: <T,>(initial: T) => [((stateControl.anchor ?? initial) as T), setAnchorMock] as const,
  };
});

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

describe("TextAlignMenuControl", () => {
  it("opens menu and applies align + indent actions", () => {
    const onChange = vi.fn();
    const onOutdent = vi.fn();
    const onIndent = vi.fn();
    stateControl.anchor = { id: "open-anchor" };

    const element = TextAlignMenuControl({
      value: "justify",
      onChange,
      onOutdent,
      onIndent,
    }) as any;

    const button = findNodes(element, (candidate) => candidate?.type?.name === "AppButton")[0];
    button.props.onClick({ currentTarget: { id: "anchor" } });
    expect(setAnchorMock).toHaveBeenCalledWith({ id: "anchor" });

    const actions = findNodes(
      element,
      (candidate) => typeof candidate?.props?.onClick === "function" && candidate?.props?.sx?.minWidth === 320,
    );
    expect(actions).toHaveLength(8);
    actions[0].props.onClick();
    actions[1].props.onClick();
    actions[2].props.onClick();
    actions[3].props.onClick();
    actions[4].props.onClick();
    actions[5].props.onClick();
    actions[6].props.onClick();
    actions[7].props.onClick();
    expect(onChange).toHaveBeenCalledWith("left");
    expect(onChange).toHaveBeenCalledWith("center");
    expect(onChange).toHaveBeenCalledWith("right");
    expect(onChange).toHaveBeenCalledWith("justify");
    expect(onChange).toHaveBeenCalledWith("start");
    expect(onChange).toHaveBeenCalledWith("end");
    expect(onOutdent).toHaveBeenCalledTimes(1);
    expect(onIndent).toHaveBeenCalledTimes(1);
    expect(setAnchorMock).toHaveBeenCalledWith(null);
  });

  it("supports disabled trigger", () => {
    const element = TextAlignMenuControl({ disabled: true }) as any;
    const button = findNodes(element, (candidate) => candidate?.type?.name === "AppButton")[0];
    expect(button.props.disabled).toBe(true);
  });
});
