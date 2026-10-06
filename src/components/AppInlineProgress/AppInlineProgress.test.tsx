import { describe, expect, it } from "vitest";
import { AppInlineProgress } from "./AppInlineProgress";

describe("AppInlineProgress", () => {
  it("clamps and rounds progress and uses default themed width callback", () => {
    const element = AppInlineProgress({ value: 110.6 }) as any;
    const [bar, label] = element.props.children as any[];

    expect(bar.props.value).toBe(100);
    expect(bar.props.variant).toBe("determinate");
    expect(typeof bar.props.sx.width).toBe("function");
    expect(bar.props.sx.width({ spacing: (value: number) => `${value * 8}px` })).toBe("60px");
    expect(label.props.children).toBe("100%");
  });

  it("supports explicit width and lower bound clamp", () => {
    const element = AppInlineProgress({ value: -8.2, barWidth: "240px" }) as any;
    const [bar, label] = element.props.children as any[];

    expect(bar.props.value).toBe(0);
    expect(bar.props.sx.width).toBe("240px");
    expect(label.props.children).toBe("0%");
  });
});
