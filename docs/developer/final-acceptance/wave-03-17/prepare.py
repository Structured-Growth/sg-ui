from pathlib import Path
import difflib
root=Path.cwd()
out=root/'docs/developer/final-acceptance/wave-03-17'
changes={}
p='packages/ui/src/components/SideNavigation/SideNavigation.module.css'
s=(root/p).read_text()
s=s.replace('  .menuContent { display:', '  .menuContent { --sgui-navigation-forward-offset: 1rem; --sgui-navigation-back-offset: -1rem; display:')
s=s.replace('  .menuContent[data-direction="forward"]', '  .menuContent:dir(rtl) { --sgui-navigation-forward-offset: -1rem; --sgui-navigation-back-offset: 1rem; }\n  .menuContent[data-direction="forward"]',1)
s=s.replace('transform: translateX(1rem)', 'transform: translateX(var(--sgui-navigation-forward-offset))').replace('transform: translateX(-1rem)', 'transform: translateX(var(--sgui-navigation-back-offset))')
changes[p]=s
p='apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx'
s=(root/p).read_text().replace('style={{ maxWidth: 320 }}','data-testid="translation-example" style={{ maxWidth: 320 }}').replace('<Typography aria-live="polite">','<Typography role="status" aria-live="polite">')
s=s.replace('    <Button onPress=', '''    <Typography data-testid="localized-number">{t("grid.total", { defaultMessage: "{total, number}", namespace: "grid", values: { total: 12345.5 } })}</Typography>
    <Typography data-testid="localized-date">{t("grid.date", { defaultMessage: "{date, date}", namespace: "grid", values: { date: new Date("2026-10-16T12:00:00Z") } })}</Typography>
    <Button onPress=''',1)
# Keep numeric/date ICU tokens out of pseudo transformation; their formatted output is the content under test.
s=s.replace(' : `⟦${options.defaultMessage} — expanded label⟧`', ' : key === "grid.total" || key === "grid.date" ? formatIcuMessage(options.defaultMessage, "en-US", options.values) : `⟦${options.defaultMessage} — expanded label⟧`')
s=s.replace(' : key === "grid.clear" ? "مسح التحديد" : "حدد صفًا آخر"', ' : key === "grid.total" || key === "grid.date" ? formatIcuMessage(options.defaultMessage, "ar-EG", options.values) : key === "grid.clear" ? "مسح التحديد" : "حدد صفًا آخر"')
# Fallback adapter intentionally returns keys; retain English fallback semantics.
changes[p]=s
p='apps/docs/native-fixtures/scenarios/components/SideNavigation/SideNavigation.fixture.tsx'
s=(root/p).read_text()
s=s.replace('import { useMemo,', 'import { Provider } from "@structured-growth/sg-ui/theme";\nimport { SGTranslationProvider, formatIcuMessage } from "@structured-growth/sg-ui/i18n";\nimport { useMemo,',1)
s+='''
/** Locale comes from the public translation adapter, without a visual dir override. */
export const EnglishDrillMotion: Story = { render: () => <LocaleHierarchy locale="en-US" /> };
export const ArabicDrillMotion: Story = { render: () => <LocaleHierarchy locale="ar-EG" /> };
function LocaleHierarchy({ locale }: { locale: string }) {
  return <SGTranslationProvider value={{ locale, useNamespace: () => {},
    t: (_key, options) => formatIcuMessage(options.defaultMessage, locale, options.values) }}>
    <Provider data-testid="navigation-locale"><NativeHierarchyExample /></Provider>
  </SGTranslationProvider>;
}
'''
changes[p]=s
p='docs/developer/react-aria-i18n-acceptance.md'
s=(root/p).read_text()
s=s.replace('`Translations.stories.tsx` provides English fallback, pseudo-localized long labels\nand Arabic plural/direction compositions using production Provider and controls.\nThe shared Storybook locale controls remain representative fixtures, not supported\nlocale policy; see [public theme contracts](react-aria-theme.md).', '''`apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx` preserves
English fallback, pseudo-localized long labels and Arabic plural/direction scenarios
using public Provider and controls. Provider reads the translation adapter locale;
there is no public `locale` prop on Provider. Do not set only DOM `dir` when testing
locale-driven interaction. Fixture locales are representative test data, not a
consumer supported-locale policy; see [public theme contracts](react-aria-theme.md).

The focused `translations-locale-acceptance.spec.ts` checks counts 0/1/2/3/11/100,
clear, keyboard focus, complete pseudo labels and 320 CSS-pixel reflow. Date and
number output use the fixed instant 2026-10-16T12:00:00Z and a UTC browser context;
this pins the existing runtime-time-zone contract without adding a new formatter
API. Its DOM live-region assertions establish rendered updates only. An operator
must separately record actual English/Arabic spoken count and clear announcements
with AT, browser, OS, device and language versions. These specs need a freshly
built docs-native host after integration; adding a spec is not a passing receipt.''')
s=s.replace('Browser visual/RTL and assistive-technology review of these new stories remains\nopen.', 'Current-input browser visual/RTL execution and assistive-technology review of\nthese migrated scenarios remain open. The dated Storybook build above is retained\nonly as historical evidence; Storybook has been removed.')
changes[p]=s
patch=''
for p,s in changes.items():
    dest=out/'proposed-files'/p; dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(s)
    patch+=''.join(difflib.unified_diff((root/p).read_text().splitlines(True),s.splitlines(True),fromfile='a/'+p,tofile='b/'+p))
# Include new focused specs as additions, without writing into the shared checkout.
for dest in sorted((out/'proposed-files/packages/ui/tests/browser').glob('*.spec.ts')):
    p=str(dest.relative_to(out/'proposed-files'))
    original=(root/p).read_text() if (root/p).exists() else ''
    patch+=''.join(difflib.unified_diff(original.splitlines(True),dest.read_text().splitlines(True),fromfile='a/'+p if original else '/dev/null',tofile='b/'+p))
(out/'localization-direction.patch').write_text(patch)
