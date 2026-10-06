import { describe, expect, it } from "vitest";
import { AppButton } from "./AppButton";

describe("AppButton", () => {
  it("applies default variant and color", () => {
    const element = AppButton({ children: "Save" });
    expect((element as any).props.variant).toBe("contained");
    expect((element as any).props.color).toBe("primary");
  });

  it("respects explicit variant and color", () => {
    const element = AppButton({ children: "Cancel", variant: "text", color: "inherit" });
    expect((element as any).props.variant).toBe("text");
    expect((element as any).props.color).toBe("inherit");
  });
});
