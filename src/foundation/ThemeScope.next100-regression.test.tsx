// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ThemeScope, type ThemeScopeProps } from "../theme";

afterEach(cleanup);

it("updates nested public scope overrides without leaking to a sibling and releases the native ref", () => {
  const ref = createRef<HTMLDivElement>();
  const composition = (nested: ThemeScopeProps) => (
    <ThemeScope theme="dark" density="compact" style={{ "--sgui-action": "#123456" }}>
      <ThemeScope {...nested} ref={ref} data-testid="nested"><ThemeScope data-testid="child" /></ThemeScope>
      <ThemeScope data-testid="sibling" />
    </ThemeScope>
  );
  const view = render(composition({ theme: "light", density: "comfortable", className: "host", style: { "--sgui-action": "#abcdef" } }));
  const nested = view.getByTestId("nested");
  const child = view.getByTestId("child");
  const sibling = view.getByTestId("sibling");
  expect(ref.current).toBe(nested);
  expect(nested.classList.contains("host")).toBe(true);
  expect(child.getAttribute("data-sgui-theme")).toBe("light");
  expect(child.getAttribute("data-sgui-density")).toBe("comfortable");
  expect(child.style.getPropertyValue("--sgui-action")).toBe("#abcdef");
  expect(sibling.getAttribute("data-sgui-theme")).toBe("dark");
  expect(sibling.getAttribute("data-sgui-density")).toBe("compact");
  expect(sibling.style.getPropertyValue("--sgui-action")).toBe("#123456");

  view.rerender(composition({ theme: "system" }));
  expect(ref.current).toBe(nested);
  expect(child.getAttribute("data-sgui-theme")).toBe("system");
  expect(child.getAttribute("data-sgui-density")).toBe("compact");
  expect(child.style.getPropertyValue("--sgui-action")).toBe("#123456");
  expect(sibling.getAttribute("data-sgui-theme")).toBe("dark");
  expect(sibling.style.getPropertyValue("--sgui-action")).toBe("#123456");
  view.unmount();
  expect(ref.current).toBeNull();
});
