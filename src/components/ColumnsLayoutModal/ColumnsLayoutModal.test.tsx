import { describe, expect, it, vi } from "vitest";
import { ColumnsLayoutModal } from "./ColumnsLayoutModal";

const stateControl = vi.hoisted(() => ({
  value: "twoEqual" as "twoEqual" | "two2575" | "threeEqual" | "three255025" | "fourEqual",
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useMemo: <T,>(factory: () => T) => factory(),
    useState: <T,>(initial: T) => [((stateControl.value ?? initial) as T), (next: T) => { stateControl.value = next as any; }] as const,
  };
});

describe("ColumnsLayoutModal", () => {
  it("renders all presets and submits the default selected preset", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const element = ColumnsLayoutModal({
      open: true,
      onClose,
      onSubmit,
    }) as any;

    expect(element.props.open).toBe(true);
    expect(element.props.title).toBe("Choose columns layout");
    expect(element.props.paperSx).toEqual({ width: 460 });

    const optionsContainer = element.props.children;
    const optionButtons = optionsContainer.props.children as any[];
    expect(optionButtons).toHaveLength(5);
    expect(optionButtons[0].props.children).toBe("2 columns (equal width)");
    expect(optionButtons[4].props.children).toBe("4 columns (equal width)");

    element.props.primaryAction.onClick();
    expect(onSubmit).toHaveBeenCalledWith("twoEqual");
    element.props.secondaryAction.onClick();
    expect(onClose).toHaveBeenCalledTimes(1);
    element.props.onClose();
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("allows selecting a new preset before submit", () => {
    const onSubmit = vi.fn();
    stateControl.value = "threeEqual";
    const initialElement = ColumnsLayoutModal({
      open: true,
      onClose: vi.fn(),
      onSubmit,
      defaultPreset: "threeEqual",
    }) as any;

    const optionButtons = initialElement.props.children.props.children as any[];
    optionButtons[1].props.onPress();
    const rerenderedElement = ColumnsLayoutModal({
      open: true,
      onClose: vi.fn(),
      onSubmit,
      defaultPreset: "threeEqual",
    }) as any;
    rerenderedElement.props.primaryAction.onClick();
    expect(onSubmit).toHaveBeenCalledWith("two2575");
  });
});
