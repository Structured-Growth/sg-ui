import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders navigation and main content slots", () => {
    const element = AppShell({
      navigation: "nav-slot",
      children: "content-slot",
    }) as any;

    const topChildren = element.props.children as any[];
    expect(topChildren[0]).toBe("nav-slot");
    expect(topChildren[1].props.component).toBe("main");
    expect(topChildren[1].props.children).toBe("content-slot");
  });
});
