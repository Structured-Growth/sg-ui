import { describe, expect, it, vi } from "vitest";
import { AppPageTabs } from "./AppPageTabs";

describe("AppPageTabs", () => {
  it("renders controlled tabs with onChange handler", () => {
    const onChange = vi.fn();
    const element = AppPageTabs({
      value: "a",
      onChange,
      density: "compact",
      items: [
        { id: "a", label: "Tab A", href: "/a" },
        { id: "b", label: "Tab B", href: "/b" },
      ],
    }) as any;

    const tabs = element.props.children as any;
    tabs.props.onChange(null, "b");
    expect(onChange).toHaveBeenCalledWith("b");
    expect(tabs.props.sx).toMatchObject({ minHeight: 36 });
  });

  it("renders link tabs when onChange is not provided", () => {
    const element = AppPageTabs({
      value: "a",
      density: "comfortable",
      items: [{ id: "a", label: "Tab A", href: "/a", replace: true }],
    }) as any;

    const tabs = element.props.children as any;
    const tab = (tabs.props.children as any[])[0];
    expect(tab.props.href).toBe("/a");
    expect(tab.props.replace).toBe(true);
    expect(tabs.props.sx).toMatchObject({ minHeight: 48 });
  });

  it("uses default density styles and forwards icons", () => {
    const icon = { type: "Icon", props: {} } as any;
    const element = AppPageTabs({
      value: "a",
      items: [{ id: "a", label: "Tab A", href: "/a", icon }],
      onChange: vi.fn(),
    }) as any;

    const tabs = element.props.children as any;
    const tab = (tabs.props.children as any[])[0];
    expect(tabs.props.sx).toBeUndefined();
    expect(tab.props.sx).toBeUndefined();
    expect(tab.props.icon).toBe(icon);
  });
});
