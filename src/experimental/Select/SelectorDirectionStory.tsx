import { useState } from "react";
import { SGTranslationProvider } from "../../i18n";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Provider } from "../Provider/Provider";
import { Select } from "./Select";
import { ComboBox } from "../ComboBox/ComboBox";

/** Host fixture: F2 reverses visual direction, F3 updates description, F4 restores locale direction. */
export function SelectorDirectionStory({ kind }: { kind: "select" | "combo" }) {
  return <>{["en-US", "ar-EG"].map(locale => <DirectionExample key={locale} locale={locale} kind={kind} />)}</>;
}
function DirectionExample({ locale, kind }: { locale: string; kind: "select" | "combo" }) {
  const [dir, setDir] = useState<"rtl" | "ltr" | undefined>(locale === "en-US" ? "rtl" : "ltr");
  const [revision, setRevision] = useState(0);
  const [value, setValue] = useState<string | null>("a");
  const options = [{ id: "a", label: "Alpha" }, { id: "disabled", label: "Unavailable", disabled: true }, { id: "b", label: "Beta" }];
  const props = { label: locale, options, value, onValueChange: setValue, description: `Host update ${revision}. F2 reverse, F3 update, F4 locale direction.` };
  return <SGTranslationProvider value={{ locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider dir={dir} theme={locale === "en-US" ? "dark" : "light"} density={locale === "en-US" ? "compact" : "comfortable"}>
      <ThemeScope style={{ padding: 12, "--sgui-focus": "#a78bfa" }} onKeyDownCapture={event => {
        if (event.key === "F2") { event.preventDefault(); setDir(current => current === "rtl" ? "ltr" : "rtl"); }
        if (event.key === "F3") { event.preventDefault(); setRevision(current => current + 1); }
        if (event.key === "F4") { event.preventDefault(); setDir(undefined); }
      }}>
        {kind === "select" ? <Select {...props} /> : <ComboBox {...props} />}
      </ThemeScope>
    </Provider>
  </SGTranslationProvider>;
}
