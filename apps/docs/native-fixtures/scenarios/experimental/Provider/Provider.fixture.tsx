import { useState } from "react";
import type { Meta, StoryObj } from "../../../types";
import { Provider } from "@structured-growth/sg-ui/theme";
import { SGTranslationProvider } from "@structured-growth/sg-ui/i18n";
import { Tabs } from "@structured-growth/sg-ui/experimental";
import { ComboBox } from "@structured-growth/sg-ui/experimental";
import { ThemeScope } from "@structured-growth/sg-ui/theme";
import { Button } from "@structured-growth/sg-ui/experimental";
import { Popover } from "@structured-growth/sg-ui/experimental";
import { Menu } from "@structured-growth/sg-ui/experimental";
import { tokens } from "@structured-growth/sg-ui/tokens";
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

function PortalDirectionExample({ locale, initialDir }: { locale: string; initialDir: "ltr" | "rtl" }) {
  const [dir, setDir] = useState(initialDir);
  return <SGTranslationProvider value={{ locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider dir={dir} theme={initialDir === "rtl" ? "dark" : "light"} density={initialDir === "rtl" ? "compact" : "comfortable"}
      style={{ "--sgui-focus": "#a78bfa", padding: tokens.space4 }}>
      <ThemeScope><Popover title={`${locale} settings`} trigger={<Button>{`Open ${locale}`}</Button>}>
        <Menu label={`${locale} actions`} trigger={<Button>{`${locale} actions`}</Button>}
          items={[{ id: "review", label: "Review settings" }, { id: "direction", label: "Reverse visual direction" }]}
          onAction={id => { if (id === "direction") setDir(current => current === "rtl" ? "ltr" : "rtl"); }} />
      </Popover></ThemeScope>
    </Provider>
  </SGTranslationProvider>;
}
/** H-06/U-19: mismatched visual direction and locale in independent nested portal scopes. */
export const ExplicitPortalDirections: Story = {
  render: () => <div style={{ display: "grid", gap: tokens.space4 }}>
    <PortalDirectionExample locale="en-US" initialDir="rtl" />
    <PortalDirectionExample locale="ar-EG" initialDir="ltr" />
  </div>,
};
