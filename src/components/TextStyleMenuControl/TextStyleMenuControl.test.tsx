import { describe, expect, it, vi } from "vitest";
import { TextStyleMenuControl } from "./TextStyleMenuControl";

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

describe("TextStyleMenuControl", () => {
  it("opens menu and runs all actions", () => {
    const handlers = {
      onLowercase: vi.fn(),
      onUppercase: vi.fn(),
      onCapitalize: vi.fn(),
      onStrikethrough: vi.fn(),
      onSubscript: vi.fn(),
      onSuperscript: vi.fn(),
      onHighlight: vi.fn(),
      onClearFormatting: vi.fn(),
    };
    stateControl.anchor = { id: "open-anchor" };
    const element = TextStyleMenuControl(handlers) as any;

    const button = findNodes(element, (candidate) => candidate?.type?.name === "AppButton")[0];
    button.props.onClick({ currentTarget: { id: "anchor" } });
    expect(setAnchorMock).toHaveBeenCalledWith({ id: "anchor" });

    const actions = findNodes(
      element,
      (candidate) => typeof candidate?.props?.onClick === "function" && candidate?.props?.sx?.minWidth === 280,
    );
    expect(actions).toHaveLength(8);
    actions.forEach((action) => action.props.onClick());
    expect(handlers.onLowercase).toHaveBeenCalledTimes(1);
    expect(handlers.onUppercase).toHaveBeenCalledTimes(1);
    expect(handlers.onCapitalize).toHaveBeenCalledTimes(1);
    expect(handlers.onStrikethrough).toHaveBeenCalledTimes(1);
    expect(handlers.onSubscript).toHaveBeenCalledTimes(1);
    expect(handlers.onSuperscript).toHaveBeenCalledTimes(1);
    expect(handlers.onHighlight).toHaveBeenCalledTimes(1);
    expect(handlers.onClearFormatting).toHaveBeenCalledTimes(1);
    expect(setAnchorMock).toHaveBeenCalledWith(null);
  });

  it("supports disabled trigger", () => {
    const element = TextStyleMenuControl({ disabled: true }) as any;
    const button = findNodes(element, (candidate) => candidate?.type?.name === "AppButton")[0];
    expect(button.props.disabled).toBe(true);
  });
});
