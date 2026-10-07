// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SGTranslationProvider, useTranslation, type SGTranslationAdapter, type SGTranslationOptions } from ".";

const options: SGTranslationOptions = { defaultMessage: "{n, plural, one {# row selected} other {# rows selected}}", namespace: "grid", values: { n: 2 } };
function Label({ request = options }: { request?: SGTranslationOptions }) {
  const adapter = useTranslation();
  return <span lang={adapter.locale}>{adapter.t("grid.selection", request)}</span>;
}
afterEach(cleanup);

describe("translation adapter boundary", () => {
  it("renders English fallback with no host, including SSR", () => {
    render(<Label />);
    expect(screen.getByText("2 rows selected").lang).toBe("en-US");
    expect(renderToString(<Label />)).toContain("2 rows selected");
  });
  it("forwards the exact key/options/values and preserves host locale and method receiver", () => {
    const t = vi.fn(function(this: SGTranslationAdapter, key: string, received: SGTranslationOptions) {
      expect(this.locale).toBe("ar-EG");
      expect(received).toBe(options);
      expect(received.values).toBe(options.values);
      expect(key).toBe("grid.selection");
      return "تم تحديد صفين";
    });
    const host = { locale: "ar-EG", t, useNamespace: vi.fn() };
    render(<SGTranslationProvider value={host}><Label /></SGTranslationProvider>);
    expect(screen.getByText("تم تحديد صفين").lang).toBe("ar-EG");
    expect(t).toHaveBeenCalledTimes(1);
    expect(host.useNamespace).not.toHaveBeenCalled();
  });
  it("forwards namespaces without eager loading, caching or deduplication", () => {
    const host = { locale: "fr-FR", t: vi.fn(), useNamespace: vi.fn() };
    let adapter: SGTranslationAdapter | undefined;
    function Capture() { adapter = useTranslation(); return null; }
    render(<SGTranslationProvider value={host}><Capture /></SGTranslationProvider>);
    expect(host.useNamespace).not.toHaveBeenCalled();
    adapter!.useNamespace("grid"); adapter!.useNamespace("grid");
    expect(host.useNamespace.mock.calls).toEqual([["grid"], ["grid"]]);
    host.useNamespace.mockImplementation(() => { throw new Error("host namespace failure"); });
    expect(() => adapter!.useNamespace("grid")).toThrow("host namespace failure");
  });
  it.each(["throw", "key", "placeholder", "non-string"])("uses English fallback when host returns %s without retrying", failure => {
    const t = vi.fn((key: string) => {
      if (failure === "throw") throw new Error("host diagnosis");
      return failure === "key" ? key : failure === "placeholder" ? "[[missing_translation]]" : undefined as unknown as string;
    });
    render(<SGTranslationProvider value={{ locale: "ar-EG", t, useNamespace: vi.fn() }}><Label /></SGTranslationProvider>);
    expect(screen.getByText("2 rows selected").lang).toBe("ar-EG");
    expect(t).toHaveBeenCalledTimes(1);
  });
  it("preserves intentionally empty host labels and treats host strings as already formatted", () => {
    const host = { locale: "en-US", t: () => "", useNamespace: vi.fn() };
    const { container, rerender } = render(<SGTranslationProvider value={host}><Label /></SGTranslationProvider>);
    expect(container.textContent).toBe("");
    rerender(<SGTranslationProvider value={{ ...host, t: () => "Literal {n}" }}><Label /></SGTranslationProvider>);
    expect(screen.getByText("Literal {n}")).toBeTruthy();
  });
  it("updates locale/lookup on host replacement and isolates nested providers", () => {
    const host = { locale: "fr-FR", t: () => "Deux", useNamespace: vi.fn() };
    const { rerender } = render(<SGTranslationProvider value={host}><Label /></SGTranslationProvider>);
    rerender(<SGTranslationProvider value={{ ...host, locale: "ar-EG", t: () => "اثنان" }}><Label /><SGTranslationProvider value={host}><Label /></SGTranslationProvider></SGTranslationProvider>);
    expect(screen.getByText("اثنان").lang).toBe("ar-EG");
    expect(screen.getByText("Deux").lang).toBe("fr-FR");
  });
});
