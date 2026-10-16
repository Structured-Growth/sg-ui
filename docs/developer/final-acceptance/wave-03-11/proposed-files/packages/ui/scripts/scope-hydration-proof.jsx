import React from 'react';
import { Provider, ThemeScope } from '@structured-growth/sg-ui/theme';
import { SGTranslationProvider } from '@structured-growth/sg-ui/i18n';
import { Button } from '@structured-growth/sg-ui/components/Button';
import { TextArea, TextField, DateField, PeriodPicker, DateTimeRangePicker, DateRangeComparisonPicker, Popover, Menu } from '@structured-growth/sg-ui/experimental';
export const comparison = { primary: { start: '2024-02-28', end: '2024-02-29' }, comparison: { start: '2024-02-26', end: '2024-02-27' }, mode: 'previous-period' };
export function Proof({ locale = 'ar-EG', theme = 'system' }) {
  const [changed, setChanged] = React.useState(false);
  React.useEffect(() => {
    const update = () => setChanged(true);
    document.addEventListener('sgui-acceptance-scope-update', update);
    window.scopeHydrated = true;
    return () => document.removeEventListener('sgui-acceptance-scope-update', update);
  }, []);
  return <React.StrictMode><SGTranslationProvider value={{ locale: changed ? 'fr-FR' : locale, t: (_key, options) => options.defaultMessage, useNamespace: () => {} }}>
    <Provider data-testid="owner" theme={changed ? 'dark' : theme} density={changed ? 'compact' : 'comfortable'}
      style={{ width: '31rem', '--sgui-menu-background': changed ? '#172554' : '#fff7ed' }}>
      <ThemeScope data-testid="inherited"><TextField label="Course name" name="course" defaultValue="Science" description="Host description" />
        <TextArea label="Notes" name="notes" defaultValue="Leap day" />
        <DateField label="Leap date" name="date" defaultValue="2024-02-29" />
        <PeriodPicker label="Month" unit="month" referenceDate="2024-02-29" name="month" defaultValue={{ start: '2024-02-01', end: '2024-02-29' }} />
        <DateTimeRangePicker label="Appointment" referenceDate="2024-02-29" name="appointment" defaultValue={{ start: '2024-02-29T09:15:00', end: '2024-02-29T10:30:00' }} />
        <DateRangeComparisonPicker label="Comparison" name="comparison" defaultValue={comparison} />
        <Popover title="Scope help" trigger={<Button>Open help</Button>}><ThemeScope>
          <Menu label="Scope actions" trigger={<Button>Open actions</Button>} items={[{ id: 'review', label: 'Review' }]} />
        </ThemeScope></Popover>
      </ThemeScope>
      <ThemeScope data-testid="fixed" theme="light" density="comfortable"><Button>Fixed action</Button></ThemeScope>
    </Provider>
  </SGTranslationProvider><Provider data-testid="sibling" theme="light" density="comfortable"><TextField label="Sibling course" defaultValue="Mathematics" /></Provider></React.StrictMode>;
}
