// @vitest-environment jsdom
import { StrictMode } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SGTranslationProvider } from "../../i18n";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Provider } from "./Provider";
import { Menu } from "../Menu/Menu";
import { Button } from "../Button/Button";
afterEach(cleanup);

it("keeps independently mounted scopes isolated across portal reopen and removal", async () => {
  const user = userEvent.setup();
  const mount = (locale: string, dir: "ltr" | "rtl", theme: "light" | "dark", density: "compact" | "comfortable") => render(
    <StrictMode><SGTranslationProvider value={{ locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider dir={dir} theme={theme} density={density}>
        <ThemeScope><Menu label={locale} trigger={<Button>{locale}</Button>} items={[{ id: "review", label: "Review" }]} /></ThemeScope>
      </Provider>
    </SGTranslationProvider></StrictMode>);
  const first = mount("en-US", "rtl", "dark", "compact");
  mount("ar-EG", "ltr", "light", "comfortable");
  for (const [locale, dir, theme, density] of [["en-US", "rtl", "dark", "compact"], ["ar-EG", "ltr", "light", "comfortable"], ["en-US", "rtl", "dark", "compact"]]) {
    await user.click(screen.getByRole("button", { name: locale }));
    const scope = screen.getByRole("menu", { name: locale }).closest("[data-sgui-scope]")!;
    expect(scope.getAttribute("dir")).toBe(dir);
    expect(scope.getAttribute("lang")).toBe(locale);
    expect(scope.getAttribute("data-sgui-theme")).toBe(theme);
    expect(scope.getAttribute("data-sgui-density")).toBe(density);
    await user.keyboard("{Escape}");
  }
  first.unmount();
  await user.click(screen.getByRole("button", { name: "ar-EG" }));
  expect(screen.getByRole("menu").closest("[data-sgui-scope]")?.getAttribute("dir")).toBe("ltr");
});
