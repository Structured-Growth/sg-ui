import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { SGTranslationProvider } from "../../i18n";
import { Provider } from "./Provider";
describe("host locale bridge", () => {
  it("uses the host locale and its direction in server markup", () => {
    const html = renderToString(<SGTranslationProvider value={{ locale: "ar-EG", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider>Content</Provider>
    </SGTranslationProvider>);
    expect(html).toContain('lang="ar-EG"'); expect(html).toContain('dir="rtl"');
  });
});
