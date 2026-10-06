import { describe, expect, it, vi } from "vitest";

const useNamespace = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useMemo: <T,>(factory: () => T) => factory(),
  };
});

vi.mock("../../../../i18n", () => ({
  useTranslation: () => ({
    useNamespace,
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
  }),
}));

describe("CopyableTableCell", () => {
  it("disables copy for empty values and copies for non-empty values", async () => {
    const writeText = vi.fn(async () => undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const { CopyableTableCell } = await import("./CopyableTableCell");

    const empty = CopyableTableCell({ value: "" }) as any;
    const emptyButton = ((empty.props.children as any[])[1].props.children.props.children as any);
    expect(emptyButton.props.disabled).toBe(true);
    await emptyButton.props.onClick();
    expect(writeText).not.toHaveBeenCalled();

    const undefinedCell = CopyableTableCell({ value: undefined }) as any;
    const undefinedButton = ((undefinedCell.props.children as any[])[1].props.children.props.children as any);
    expect(undefinedButton.props.disabled).toBe(true);

    const valueCell = CopyableTableCell({ value: 123 }) as any;
    const button = ((valueCell.props.children as any[])[1].props.children.props.children as any);
    expect(button.props.disabled).toBe(false);
    await button.props.onClick();
    expect(writeText).toHaveBeenCalledWith("123");
    expect(useNamespace).toHaveBeenCalledWith("common.ui");
  }, 20000);
});
