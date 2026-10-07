import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../components/AppButton";
import { Stack, Typography } from "../primitives";
import { Provider } from "../theme";
import { SGTranslationProvider, useTranslation, formatIcuMessage, type SGTranslationAdapter } from ".";

const english = "{n, plural, =0 {No rows selected} one {# row selected} other {# rows selected}}";
const arabic = "{n, plural, zero {لم يتم تحديد صفوف} one {تم تحديد صف واحد} two {تم تحديد صفين} few {تم تحديد # صفوف} many {تم تحديد # صفًا} other {تم تحديد # صف}}";
const pseudo = "{n, plural, =0 {⟦Nöö rööws sëëlëëctëëd — ëëxpààndëëd tràànslààtïïöön⟧} one {⟦# rööw sëëlëëctëëd — ëëxpààndëëd tràànslààtïïöön⟧} other {⟦# rööws sëëlëëctëëd — ëëxpààndëëd tràànslààtïïöön⟧}}";
function Example() {
  const [n, setCount] = useState(0);
  const { t } = useTranslation();
  return <Stack gap={2} style={{ maxWidth: 320 }}>
    <Typography aria-live="polite">{t("grid.selection", { defaultMessage: english, namespace: "grid", values: { n } })}</Typography>
    <AppButton onPress={() => setCount(count => count + 1)}>{t("grid.selectNext", { defaultMessage: "Select another row", namespace: "grid" })}</AppButton>
    <AppButton variant="outlined" onPress={() => setCount(0)}>{t("grid.clear", { defaultMessage: "Clear selection", namespace: "grid" })}</AppButton>
  </Stack>;
}
const fallback: SGTranslationAdapter = { locale: "en-US", t: key => key, useNamespace: () => {} };
const meta = { title: "Foundations/Translations", component: Example, tags: ["autodocs"] } satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const EnglishFallback: Story = { render: () => <SGTranslationProvider value={fallback}><Provider><Example /></Provider></SGTranslationProvider> };
export const PseudoLocalizedLongLabels: Story = { render: () => <SGTranslationProvider value={{ ...fallback, t: (key, options) => key === "grid.selection" ? formatIcuMessage(pseudo, "en-US", options.values) : `⟦${options.defaultMessage} — expanded label⟧` }}><Provider><Example /></Provider></SGTranslationProvider> };
export const ArabicPluralAndDirection: Story = { render: () => <SGTranslationProvider value={{ ...fallback, locale: "ar-EG", t: (key, options) => key === "grid.selection" ? formatIcuMessage(arabic, "ar-EG", options.values) : key === "grid.clear" ? "مسح التحديد" : "حدد صفًا آخر" }}><Provider><Example /></Provider></SGTranslationProvider> };
