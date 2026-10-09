// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { Provider } from "../../theme";
import { TextStyleMenuControl, type TextStyleMenuControlProps } from "./index";
import styles from "./TextStyleMenuControl.module.css";

afterEach(cleanup);

it("binds case samples to shared typography tokens without inline font overrides", async () => {
  const user = userEvent.setup();
  render(<Provider><TextStyleMenuControl onLowercase={() => {}} /></Provider>);
  await user.click(screen.getByRole("button", { name: "Text style" }));
  for (const sample of ["abc", "ABC", "Tt"]) {
    const element = within(screen.getByRole("menu")).getByText(sample);
    expect(element.classList.contains(styles.letters)).toBe(true);
    expect(element.getAttribute("style")).toBeNull();
  }
  // jsdom does not resolve CSS custom properties. Guard the bound shared role;
  // computed typography, density and enlarged text remain browser/visual gates.
  const css = readFileSync("src/components/TextStyleMenuControl/TextStyleMenuControl.module.css", "utf8");
  const declarations = css.match(/\.letters\s*\{([^}]+)\}/)?.[1];
  expect(declarations).toBeDefined();
  for (const property of ["font-family", "font-size", "font-weight", "line-height"]) {
    expect(declarations).toMatch(new RegExp(`${property}:\\s*var\\(--sgui-[\\w-]+\\)`));
  }
});

it("isolates sibling controlled state and callbacks across dismissal, unmount and remount", async () => {
  const user = userEvent.setup();
  const first = vi.fn(); const second = vi.fn();
  const firstProps: TextStyleMenuControlProps = { activeStyles: ["highlight"], onHighlight: first };
  const secondProps: TextStyleMenuControlProps = { activeStyles: [], onHighlight: second };
  const Host = ({ showFirst = true }: { showFirst?: boolean }) => <Provider>
    {showFirst && <section aria-label="First editor"><TextStyleMenuControl {...firstProps} /></section>}
    <section aria-label="Second editor"><TextStyleMenuControl {...secondProps} /></section>
  </Provider>;
  const { rerender } = render(<Host />);
  const open = async (name: string) => {
    await user.click(within(screen.getByRole("region", { name })).getByRole("button", { name: "Text style" }));
    return screen.getByRole("menuitemcheckbox", { name: "Highlight" });
  };
  expect((await open("First editor")).getAttribute("aria-checked")).toBe("true");
  await user.keyboard("{Escape}");
  expect((await open("Second editor")).getAttribute("aria-checked")).toBe("false");
  await user.click(screen.getByRole("menuitemcheckbox", { name: "Highlight" }));
  expect(second).toHaveBeenCalledTimes(1); expect(first).not.toHaveBeenCalled();
  await open("First editor");
  rerender(<Host showFirst={false} />);
  expect(screen.queryByRole("menu")).toBeNull();
  expect((await open("Second editor")).getAttribute("aria-checked")).toBe("false");
  await user.keyboard("{Escape}");
  rerender(<Host />);
  expect((await open("First editor")).getAttribute("aria-checked")).toBe("true");
  await user.click(screen.getByRole("menuitemcheckbox", { name: "Highlight" }));
  expect(first).toHaveBeenCalledTimes(1); expect(second).toHaveBeenCalledTimes(1);
});
