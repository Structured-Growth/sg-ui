import { describe, expect, it } from "vitest";
import { AuthShell } from "./AuthShell";

describe("AuthShell", () => {
  it("renders the login-style centered layout", () => {
    const element = AuthShell({
      title: "Sign In",
      subtitle: "Use your credentials",
      children: "form",
      footerContent: "footer",
    }) as any;

    expect(element.props.sx.alignItems).toBe("center");
    expect(element.props.sx.justifyContent).toBe("center");

    const panel = element.props.children;
    expect(panel.props.sx.maxWidth).toBe(560);
    expect(panel.props.children[1].props.children).toBe("form");
    expect(panel.props.children[2].props.children).toBe("footer");
  });

  it("omits optional sections when subtitle and footer are not provided", () => {
    const element = AuthShell({
      title: "Sign In",
      children: "form",
    }) as any;

    const panelChildren = element.props.children.props.children;
    expect(panelChildren[0].props.children[1]).toBeNull();
    expect(panelChildren[2]).toBeNull();
  });
});
