import type { Preview } from "@storybook/react-vite";
import { Provider, type ColorTheme, type Density } from "../src/theme";
import { SGTranslationProvider } from "../src/i18n";
import { formatIcuMessage } from "../src/i18n/icu";
import { tokens } from "../src/foundation/tokens.generated";
import "../src/foundation/tokens.css";
const preview: Preview = {
  initialGlobals: { theme: "light", density: "comfortable", locale: "en-US", direction: "auto" },
  globalTypes: {
    theme: { description: "Color theme", toolbar: { icon: "circlehollow", items: ["light", "dark", "system"], dynamicTitle: true } },
    density: { description: "Control density", toolbar: { icon: "collapse", items: ["compact", "comfortable"], dynamicTitle: true } },
    locale: { description: "Interaction locale", toolbar: { icon: "globe", items: ["en-US", "fr-FR", "ar-EG"], dynamicTitle: true } },
    direction: { description: "Direction override", toolbar: { icon: "transfer", items: ["auto", "ltr", "rtl"], dynamicTitle: true } },
  },
  decorators: [(Story, { globals }) => {
    const locale = globals.locale as string;
    return <SGTranslationProvider value={{ locale, t: (_key, options) => formatIcuMessage(options.defaultMessage, locale, options.values), useNamespace: () => {} }}>
      <Provider style={{ background: tokens.surface, padding: tokens.space4, minHeight: "100vh", boxSizing: "border-box" }} theme={globals.theme as ColorTheme} density={globals.density as Density} dir={globals.direction === "auto" ? undefined : globals.direction as "ltr" | "rtl"}><Story /></Provider>
    </SGTranslationProvider>;
  }],
  parameters: { controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } } },
};
export default preview;
