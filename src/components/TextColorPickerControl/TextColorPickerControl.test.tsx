import { describe, expect, it, vi } from "vitest";
import { TextColorPickerControl } from "./TextColorPickerControl";

const stateControl = vi.hoisted(() => ({
  anchor: null as unknown,
  draft: "#000000",
  stateIndex: 0,
}));

const setAnchorMock = vi.hoisted(() => vi.fn((value: unknown) => { stateControl.anchor = value; }));
const setDraftMock = vi.hoisted(() => vi.fn((value: unknown) => { stateControl.draft = String(value); }));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useMemo: <T,>(factory: () => T) => factory(),
    useState: <T,>(initial: T) => {
      if (stateControl.stateIndex === 0) {
        stateControl.stateIndex += 1;
        return [((stateControl.anchor ?? initial) as T), setAnchorMock] as const;
      }
      stateControl.stateIndex += 1;
      return [((stateControl.draft ?? initial) as T), setDraftMock] as const;
    },
  };
});

vi.mock("@mui/material/styles", async () => {
  const actual = await vi.importActual<typeof import("@mui/material/styles")>("@mui/material/styles");
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        text: { primary: "#111111", secondary: "#222222" },
        primary: { main: "#1976d2", light: "#63a4ff" },
        secondary: { main: "#9c27b0", light: "#d05ce3" },
        error: { main: "#d32f2f" },
        warning: { main: "#ed6c02" },
        info: { main: "#0288d1" },
        success: { main: "#2e7d32" },
        grey: { 100: "#f5f5f5", 300: "#e0e0e0", 500: "#9e9e9e", 700: "#616161", 900: "#212121" },
        common: { black: "#000000", white: "#ffffff" },
        background: { paper: "#ffffff" },
      },
    }),
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

const render = (props?: Parameters<typeof TextColorPickerControl>[0]) => {
  stateControl.stateIndex = 0;
  return TextColorPickerControl(props ?? {}) as any;
};

describe("TextColorPickerControl", () => {
  it("opens popover and commits hex color from field and color input", () => {
    const onChange = vi.fn();
    stateControl.anchor = null;
    stateControl.draft = "#123456";
    const element = render({ value: "#ffffff", onChange });

    const trigger = findNodes(
      element,
      (candidate) =>
        typeof candidate?.props?.onClick === "function"
        && candidate?.props?.size === "small"
        && candidate?.props?.title === undefined,
    )[0];
    trigger.props.onClick({ currentTarget: { id: "anchor" } });
    expect(setAnchorMock).toHaveBeenCalledWith({ id: "anchor" });

    const textField = findNodes(element, (candidate) => typeof candidate?.props?.onBlur === "function")[0];
    textField.props.onChange({ target: { value: "#abcdef" } });
    expect(setDraftMock).toHaveBeenCalledWith("#abcdef");
    textField.props.onKeyDown({ key: "Enter", preventDefault: vi.fn() });
    textField.props.onBlur();
    expect(onChange).toHaveBeenCalledWith("#123456");

    const colorInput = findNodes(element, (candidate) => candidate?.props?.type === "color")[0];
    colorInput.props.onChange({ target: { value: "#111111" } });
    expect(onChange).toHaveBeenCalledWith("#111111");
  });

  it("selects theme preset and ignores invalid hex commit", () => {
    const onChange = vi.fn();
    stateControl.anchor = { id: "anchor" };
    stateControl.draft = "invalid-color";
    const element = render({ value: "var(--mui-palette-primary-main, #1976d2)", onChange });

    const presetButtons = findNodes(
      element,
      (candidate) => typeof candidate?.props?.onClick === "function" && typeof candidate?.props?.title === "string",
    );
    expect(presetButtons.length).toBeGreaterThan(0);
    presetButtons[0].props.onClick();
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^var\(--mui-palette-/));
    expect(setDraftMock).toHaveBeenCalledWith(expect.stringContaining("theme.palette."));

    const textField = findNodes(element, (candidate) => typeof candidate?.props?.onBlur === "function")[0];
    textField.props.onBlur();
    expect(onChange).toHaveBeenCalledTimes(1);

    const popover = findNodes(element, (candidate) => typeof candidate?.props?.onClose === "function")[0];
    popover.props.onClose();
    expect(setAnchorMock).toHaveBeenCalledWith(null);
  });

  it("supports disabled state", () => {
    stateControl.anchor = null;
    stateControl.draft = "#000000";
    const element = render({ disabled: true });
    const trigger = findNodes(
      element,
      (candidate) =>
        typeof candidate?.props?.onClick === "function"
        && candidate?.props?.size === "small"
        && candidate?.props?.title === undefined,
    )[0];
    expect(trigger.props.disabled).toBe(true);
  });
});
