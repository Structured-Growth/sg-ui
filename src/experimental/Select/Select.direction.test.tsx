// @vitest-environment jsdom
import { createRef, StrictMode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SGTranslationProvider } from "../../i18n";
import { Provider } from "../Provider/Provider";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Select } from "./Select";
import { ComboBox } from "../ComboBox/ComboBox";

afterEach(cleanup);
const options = [{ id: "a", label: "Alpha" }, { id: "disabled", label: "Unavailable", disabled: true }, { id: "b", label: "Beta" }];
for (const kind of ["select", "combo"] as const) {
  for (const locale of ["en-US", "ar-EG"]) {
    it(`${kind} preserves ${locale} visual overrides and open focus through controlled host updates`, async () => {
      const user = userEvent.setup();
      const change = vi.fn();
      const selectRef = createRef<HTMLButtonElement>();
      const comboRef = createRef<HTMLInputElement>();
      const dir = locale === "en-US" ? "rtl" : "ltr";
      const reverse = dir === "rtl" ? "ltr" : "rtl";
      const tree = (visual: "rtl" | "ltr" | undefined, description: string) => <StrictMode>
        <SGTranslationProvider value={{ locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}><Provider dir={visual} theme="dark" density="compact">
          <ThemeScope style={{ padding: 12, "--sgui-focus": "#a78bfa" }}>
            {kind === "select"
              ? <Select ref={selectRef} label="Choice" options={options} value="a" onValueChange={change} description={description} />
              : <ComboBox ref={comboRef} label="Choice" options={options} value="a" onValueChange={change} description={description} />}
          </ThemeScope>
        </Provider></SGTranslationProvider>
      </StrictMode>;
      const view = render(tree(dir, "Before"));
      const independent = render(<SGTranslationProvider value={{ locale: locale === "en-US" ? "ar-EG" : "en-US", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}><Provider dir={reverse}><Select label="Independent" options={options} /></Provider></SGTranslationProvider>);
      await user.click(screen.getByRole("button", { name: kind === "select" ? /Alpha Choice/ : "Show options Choice" }));
      const list = screen.getByRole("listbox");
      const portal = list.closest("[data-sgui-scope]")!;
      expect(portal.getAttribute("dir")).toBe(dir);
      expect(portal.getAttribute("lang")).toBe(locale);
      expect(portal.getAttribute("data-sgui-theme")).toBe("dark");
      expect(portal.getAttribute("data-sgui-density")).toBe("compact");
      expect((portal as HTMLElement).style.padding).toBe("");
      expect((portal as HTMLElement).style.getPropertyValue("--sgui-focus")).toBe("#a78bfa");
      const focused = document.activeElement;
      view.rerender(tree(dir, "Host update"));
      expect(screen.getByRole("listbox")).toBe(list);
      expect(document.activeElement).toBe(focused);
      view.rerender(tree(reverse, "Host update"));
      expect(portal.getAttribute("dir")).toBe(reverse);
      expect(screen.getByRole("listbox")).toBe(list);
      view.rerender(tree(undefined, "Locale fallback"));
      expect(portal.getAttribute("dir")).toBe(locale === "en-US" ? "ltr" : "rtl");
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(kind === "select" ? selectRef.current : comboRef.current));
      await user.click(screen.getByRole("button", { name: /Independent/ }));
      const otherPortal = screen.getByRole("listbox").closest("[data-sgui-scope]")!;
      expect(otherPortal.getAttribute("dir")).toBe(reverse);
      expect(otherPortal.getAttribute("lang")).toBe(locale === "en-US" ? "ar-EG" : "en-US");
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
      independent.unmount();
      await user.click(screen.getByRole("button"));
      await user.click(screen.getByRole("option", { name: "Beta" }));
      expect(change).toHaveBeenLastCalledWith("b");
      expect(kind === "select" ? selectRef.current?.textContent : comboRef.current?.value).toContain("Alpha");
    });
  }
}
