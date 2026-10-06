import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "./Provider";
import { SGTranslationProvider } from "../../i18n";
import { Tabs } from "../Tabs/Tabs";
import { ComboBox } from "../ComboBox/ComboBox";
import { tokens } from "../../foundation/tokens.generated";
const meta = { title: "Migration proofs/Provider", component: Provider, tags: ["autodocs"] } satisfies Meta<typeof Provider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HostLocales: Story = {
  render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
    {(["en-US", "ar-EG"] as const).map(locale => <SGTranslationProvider key={locale}
      value={{ locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
      <Provider theme="dark" style={{ background: tokens.surface, padding: tokens.space4 }}>
        <Tabs label={locale} items={[
          { id: "details", label: locale === "ar-EG" ? "التفاصيل" : "Details", content: <ComboBox
            label={locale === "ar-EG" ? "الفئة" : "Category"} options={[{id:"science",label:locale === "ar-EG" ? "العلوم" : "Science"}]} /> },
          { id: "access", label: locale === "ar-EG" ? "الوصول" : "Access", content: locale },
        ]} />
      </Provider>
    </SGTranslationProvider>)}
  </div>,
};
