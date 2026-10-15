import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { ThemeScope } from "./ThemeScope";

describe("ThemeScope", () => {
  it("renders system settings on the server without browser reads or hydration-dependent markup", () => {
    const html = renderToString(<ThemeScope theme="system" density="compact" interactionMode="touch" dir="rtl">Content</ThemeScope>);
    expect(html).toContain('data-sgui-theme="system"');
    expect(html).toContain('data-sgui-density="compact"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('data-sgui-interaction="touch"');
  });
  it("inherits unspecified nested settings and permits independent theme and density overrides", () => {
    const html = renderToString(<ThemeScope theme="dark" density="compact" interactionMode="touch">
      <ThemeScope><ThemeScope theme="light"><ThemeScope density="comfortable" interactionMode="pointer">Content</ThemeScope></ThemeScope></ThemeScope>
    </ThemeScope>);
    expect(html.match(/data-sgui-theme="dark"/g)).toHaveLength(2);
    expect(html.match(/data-sgui-theme="light"/g)).toHaveLength(2);
    expect(html.match(/data-sgui-density="compact"/g)).toHaveLength(3);
    expect(html.match(/data-sgui-density="comfortable"/g)).toHaveLength(1);
    expect(html.match(/data-sgui-interaction="touch"/g)).toHaveLength(3);
    expect(html.match(/data-sgui-interaction="pointer"/g)).toHaveLength(1);
  });
});
