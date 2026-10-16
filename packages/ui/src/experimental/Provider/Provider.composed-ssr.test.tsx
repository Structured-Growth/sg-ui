import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
it("imports and server-renders fixed composed values with an explicit host locale and system theme", async () => {
  expect(typeof window).toBe("undefined");
  expect(typeof document).toBe("undefined");
  const [{ Provider }, { SGTranslationProvider }, { PeriodPicker }, { DateTimeRangePicker }, { DateRangeComparisonPicker }, { TextArea }] = await Promise.all([
    import("./Provider"), import("../../i18n"), import("../PeriodPicker/PeriodPicker"),
    import("../DateTimeRangePicker/DateTimeRangePicker"), import("../DateRangeComparisonPicker/DateRangeComparisonPicker"), import("../TextArea/TextArea"),
  ]);
  const comparison = { primary: { start: "2024-02-28", end: "2024-02-29" }, comparison: { start: "2024-02-26", end: "2024-02-27" }, mode: "previous-period" as const };
  const html = renderToString(createElement(SGTranslationProvider, { value: { locale: "ar-EG", t: (_key, options) => options.defaultMessage, useNamespace: () => {} }, children:
    <Provider theme="system" density="compact">
      <PeriodPicker label="Month" unit="month" referenceDate="2024-02-29" name="month" defaultValue={{ start: "2024-02-01", end: "2024-02-29" }} />
      <DateTimeRangePicker label="Appointment" referenceDate="2024-02-29" name="appointment" defaultValue={{ start: "2024-02-29T09:15:00", end: "2024-02-29T10:30:00" }} />
      <DateRangeComparisonPicker label="Comparison" name="comparison" defaultValue={comparison} />
      <TextArea label="Notes" name="notes" defaultValue="Leap day" />
    </Provider> }));
  expect(html).toContain('data-sgui-theme="system"');
  expect(html).toContain('lang="ar-EG"'); expect(html).toContain('dir="rtl"');
  for (const value of ["2024-02-29", "2024-02-29T09:15:00", "2024-02-29T10:30:00", "Leap day"]) expect(html).toContain(value);
  for (const name of ["month.start", "month.end", "appointment.start", "appointment.end", "comparison", "notes"]) expect(html).toContain(`name="${name}"`);
  expect(typeof window).toBe("undefined"); expect(typeof document).toBe("undefined");
});
