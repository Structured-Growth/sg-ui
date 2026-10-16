// @vitest-environment jsdom
import { StrictMode } from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SGTranslationProvider } from "../../i18n";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Provider } from "./Provider";
import { Popover } from "../Popover/Popover";
import { Menu } from "../Menu/Menu";
import { Button } from "../../components/Button/Button";
afterEach(cleanup);

it("updates an open nested portal without remounting its menu or changing its sibling", async () => {
  const user = userEvent.setup();
  const tree = (changed: boolean) => <StrictMode>
    <SGTranslationProvider value={{ locale: changed ? "ar-EG" : "en-US", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider theme={changed ? "dark" : "light"} density={changed ? "compact" : "comfortable"}
        dir={changed ? "rtl" : "ltr"} style={{ width: "31rem", "--sgui-menu-background": changed ? "#172554" : "#fff7ed" }}>
        <Popover title="Scope help" trigger={<Button>Open help</Button>}>
          <ThemeScope><Menu label="Scope actions" trigger={<Button>Open actions</Button>}
            items={[{ id: "review", label: "Review" }]} /></ThemeScope>
        </Popover>
      </Provider>
    </SGTranslationProvider>
    <Provider theme="light" density="comfortable" data-testid="sibling" style={{ "--sgui-menu-background": "#ffffff" }} />
  </StrictMode>;
  const view = render(tree(false));
  const sibling = view.getByTestId("sibling");
  const before = sibling.outerHTML;
  await user.click(screen.getByRole("button", { name: "Open help" }));
  const dialog = screen.getByRole("dialog", { name: "Scope help" });
  await user.click(screen.getByRole("button", { name: "Open actions" }));
  const menu = screen.getByRole("menu", { name: "Scope actions" });
  const id = menu.getAttribute("aria-labelledby");
  view.rerender(tree(true));
  expect(screen.getByRole("menu", { name: "Scope actions" })).toBe(menu);
  expect(screen.getByRole("dialog", { name: "Scope help", hidden: true })).toBe(dialog);
  expect(menu.getAttribute("aria-labelledby")).toBe(id);
  expect(document.getElementById(id!)).not.toBeNull();
  const portal = menu.closest<HTMLElement>("[data-sgui-scope]")!;
  expect(portal.getAttribute("data-sgui-theme")).toBe("dark");
  expect(portal.getAttribute("data-sgui-density")).toBe("compact");
  expect(portal.getAttribute("dir")).toBe("rtl");
  expect(portal.getAttribute("lang")).toBe("ar-EG");
  expect(portal.style.getPropertyValue("--sgui-menu-background")).toBe("#172554");
  expect(portal.style.width).toBe("");
  expect(sibling.outerHTML).toBe(before);
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("menu")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open actions" })));
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open help" })));
});
