// @vitest-environment jsdom
import { createRef } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppThemeProvider, Provider, ThemeScope } from "./index";
import { SGTranslationProvider } from "../i18n";
import { Dialog } from "../experimental/Dialog/Dialog";
import { Button } from "../experimental/Button/Button";
afterEach(cleanup);
const arabic = { locale: "ar-EG", t: (_key: string, options: { defaultMessage: string }) => options.defaultMessage, useNamespace: () => {} };

describe("public owned theme", () => {
  it("preserves the provider name and stable scoped server settings", () => {
    expect(AppThemeProvider).toBe(Provider);
    const html = renderToString(<SGTranslationProvider value={arabic}><AppThemeProvider theme="system" density="compact"><ThemeScope theme="light">Content</ThemeScope></AppThemeProvider></SGTranslationProvider>);
    expect(html).toContain('data-sgui-theme="system"');
    expect(html).toContain('data-sgui-theme="light"');
    expect(html.match(/data-sgui-density="compact"/g)).toHaveLength(2);
    expect(html.match(/dir="rtl"/g)).toHaveLength(2);
    expect(html.match(/lang="ar-EG"/g)).toHaveLength(2);
    expect(html).not.toContain("<style");
  });
  it("updates theme, density and host locale live on the same native scope/ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<AppThemeProvider ref={ref}>Content</AppThemeProvider>);
    const element = ref.current;
    rerender(<SGTranslationProvider value={arabic}><AppThemeProvider ref={ref} theme="dark" density="compact" dir="ltr">Content</AppThemeProvider></SGTranslationProvider>);
    // Adapter insertion can remount; subsequent setting changes preserve the element.
    const scoped = ref.current!;
    expect(element).toBeTruthy();
    expect(scoped.getAttribute("lang")).toBe("ar-EG");
    expect(scoped.getAttribute("dir")).toBe("ltr");
    rerender(<SGTranslationProvider value={arabic}><AppThemeProvider ref={ref} theme="light" density="comfortable">Content</AppThemeProvider></SGTranslationProvider>);
    expect(ref.current).toBe(scoped);
    expect(scoped.getAttribute("dir")).toBe("rtl");
    expect(scoped.getAttribute("data-sgui-theme")).toBe("light");
    expect(scoped.getAttribute("data-sgui-density")).toBe("comfortable");
  });
  it("carries owned public theme, locale, explicit direction and token overrides to portals", async () => {
    const user = userEvent.setup();
    render(<SGTranslationProvider value={arabic}><AppThemeProvider theme="dark" density="compact" dir="ltr" style={{ "--sgui-focus": "#abcdef", padding: 99 }}>
      <Dialog open title="Settings" onDismiss={() => {}}><Button>Save</Button></Dialog>
    </AppThemeProvider></SGTranslationProvider>);
    const dialog = await screen.findByRole("dialog", { name: "Settings" });
    const scope = dialog.closest('[data-sgui-scope]') as HTMLElement;
    expect(scope.getAttribute("data-sgui-theme")).toBe("dark");
    expect(scope.getAttribute("data-sgui-density")).toBe("compact");
    expect(scope.getAttribute("lang")).toBe("ar-EG");
    expect(scope.getAttribute("dir")).toBe("ltr");
    expect(scope.style.getPropertyValue("--sgui-focus")).toBe("#abcdef");
    expect(scope.style.padding).toBe("");
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
