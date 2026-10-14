import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { Button, TextField, ThemeScope, Provider, AsyncMultiSelect, DateRangeSelector } from "./index";

describe("interaction proof server rendering", () => {
  it("renders host result selection and date ranges without browser globals", () => {
    const html = renderToString(<Provider><AsyncMultiSelect label="Courses" query="" onQueryChange={() => {}}
      options={[{ id: "one", label: "Science" }]} defaultValue={[{ id: "one", label: "Science" }]} name="courses" />
      <DateRangeSelector label="Dates" defaultValue={{ start: "2024-02-28", end: "2024-02-29" }} name="dates" /></Provider>);
    expect(html).toContain('name="courses"'); expect(html).toContain('name="dates.start"');
    expect(html).toContain('2024-02-29'); expect(html).toContain('aria-multiselectable="true"');
  });
  it("renders native controls, associated labels and values without browser globals", () => {
    const html = renderToString(<ThemeScope theme="system">
      <TextField label="Course name" name="course" defaultValue="Introduction" />
      <Button type="submit">Save course</Button>
    </ThemeScope>);
    expect(html).toContain('data-sgui-theme="system"');
    expect(html).toContain('name="course"');
    expect(html).toContain('value="Introduction"');
    expect(html).toContain('<label');
    expect(html).toContain('type="submit"');
    expect(html).toContain('Save course');
  });
});
