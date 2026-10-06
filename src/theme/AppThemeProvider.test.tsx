import { describe, expect, it } from "vitest";
import { AppThemeProvider } from "./AppThemeProvider";
import { theme } from "./theme";

describe("AppThemeProvider", () => {
  it("wraps children with the app theme provider and css baseline", () => {
    const element = AppThemeProvider({ children: "content" }) as any;

    expect(element.props.theme).toBe(theme);
    const children = Array.isArray(element.props.children) ? element.props.children : [element.props.children];
    expect(children).toHaveLength(2);
    expect(children[0]?.type?.name ?? children[0]?.type?.muiName).toBeTruthy();
    expect(children[1]).toBe("content");
  });
});
