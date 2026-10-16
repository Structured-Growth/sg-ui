from pathlib import Path
b=Path('docs/developer/final-acceptance/wave-03-10/proposed-files')
p=b/'packages/ui/src/experimental/DataGrid/DataGrid.tsx';s=p.read_text();s=s.replace('width={() => gridElement.current?.querySelector<HTMLElement>(`[data-width-column-index="${index}"]`)?.getBoundingClientRect().width ?? current.widths[column.id] ?? column.width ?? 160}', '''width={() => {
                const width = gridElement.current?.querySelector<HTMLElement>(`[data-width-column-index="${index}"]`)?.getBoundingClientRect().width;
                return width && width > 0 ? width : current.widths[column.id] ?? column.width ?? 160;
              }}''');p.write_text(s)
p=b/'apps/docs/native-fixtures/scenarios/experimental/TagGroup/TagGroup.fixture.tsx';s=p.read_text().replace('const items: TagItem[]', 'import { Checkbox, Switch, IconButton, Menu } from "@structured-growth/sg-ui/experimental";\nconst items: TagItem[]');s=s.replace('    <TagGroup label="Touch topics"', '''    <Button onPress={() => setTags(current => current.some(item => item.id === "new") ? current : [...current, { id: "new", label: "New topic" }])}>Add topic</Button>
    <IconButton label="Remove added topic" onPress={() => setTags(current => current.filter(item => item.id !== "new"))}>×</IconButton>
    <Checkbox label="Include archived" />
    <Switch label="Enable reminders" />
    <Menu label="Topic actions" trigger={<Button>Actions</Button>}
      items={[{ id: "clear", label: "Clear topics" }]} onAction={() => setTags([])} />
    <TagGroup label="Touch topics"''');p.write_text(s)
p=b/'packages/ui/tests/browser/acceptance-touch-targets.spec.ts';s=p.read_text().replace("auto coarse-pointer and explicit touch preserve tag action width, spacing, activation and focus", "auto coarse-pointer and explicit touch preserve control targets, tag spacing, activation and focus")
s=s.replace("      await remove.tap();", '''      for (const target of [scope.getByRole('button', { name: 'Add topic', exact: true }), scope.getByRole('button', { name: 'Remove added topic', exact: true }),
        scope.getByRole('checkbox').locator('xpath=ancestor::label[1]'), scope.getByRole('switch').locator('xpath=ancestor::label[1]'),
        scope.getByRole('button', { name: 'Actions', exact: true })]) {
        const bounds = (await target.boundingBox())!;
        expect(bounds.width).toBeGreaterThanOrEqual(44); expect(bounds.height).toBeGreaterThanOrEqual(44);
        measurements.push({ density, mode, control: await target.textContent(), width: bounds.width, height: bounds.height });
      }
      await remove.tap();''')
s=s.replace("expect(focus.style).not.toBe('none');", '''expect(focus.style).not.toBe('none');
      await scope.getByRole('button', { name: 'Add topic', exact: true }).tap();
      await expect(scope.getByRole('button', { name: 'Remove New topic', exact: true })).toBeVisible();
      await scope.getByRole('button', { name: 'Remove added topic', exact: true }).tap();
      await expect(scope.getByRole('button', { name: 'Remove New topic', exact: true })).toHaveCount(0);
      await scope.getByRole('checkbox').locator('xpath=ancestor::label[1]').tap();
      await expect(scope.getByRole('checkbox')).toBeChecked();
      await scope.getByRole('switch').locator('xpath=ancestor::label[1]').tap();
      await expect(scope.getByRole('switch')).toBeChecked();
      await scope.getByRole('button', { name: 'Actions', exact: true }).tap();
      const action = page.getByRole('menuitem', { name: 'Clear topics', exact: true });
      const actionBounds = (await action.boundingBox())!;
      expect(actionBounds.width).toBeGreaterThanOrEqual(44); expect(actionBounds.height).toBeGreaterThanOrEqual(44);
      await action.tap(); await expect(scope.getByText('No tags', { exact: true })).toBeVisible();''')
p.write_text(s)
p=b/'packages/ui/src/components/AppDataGrid/columnWidthAlternative.test.tsx';p.parent.mkdir(parents=True,exist_ok=True);p.write_text('''// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGrid } from "../../experimental/DataGrid/DataGrid";
import { OwnedGridInteraction } from "./ownedGridInteraction";
import { defaultGridState } from "../../experimental/DataGrid/types";
afterEach(cleanup);
for (const kind of ["DataGrid", "AppDataGrid"] as const) it(`${kind} pointer width alternative preserves sibling widths and rejecting host control`, async () => {
  const user = userEvent.setup(); const change = vi.fn();
  const widths = { name: 180, score: 140 }; const rows = [{ id: "a", name: "Course", score: 20 }];
  const common = { label: "Courses", rows, getRowId: (row: typeof rows[number]) => row.id, getRowLabel: (row: typeof rows[number]) => row.name };
  render(kind === "DataGrid" ? <DataGrid {...common} state={{ ...defaultGridState, widths }} onStateChange={state => change(state.widths)}
    columns={[{ id: "name", label: "Name", width: 180, minWidth: 120, maxWidth: 300, getValue: row => row.name }, { id: "score", label: "Score", getValue: row => row.score }, { id: "flex", label: "Flexible", getValue: row => row.name }]} /> :
    <OwnedGridInteraction {...common} columnWidths={widths} onColumnWidthsChange={change} selection={false}
      columns={[{ field: "name", headerName: "Name", width: 180, minWidth: 120, maxWidth: 300 }, { field: "score", headerName: "Score" }, { field: "flex", headerName: "Flexible", flex: 1 }]} />);
  await user.click(screen.getByRole("button", { name: "Width of Name", exact: true }));
  await user.click(screen.getByRole("button", { name: "Wider by 1 pixel" }));
  expect(change).toHaveBeenCalledExactlyOnceWith({ name: 181, score: 140 });
  await user.click(screen.getByRole("button", { name: "Width of Name", exact: true }));
  expect((screen.getByRole("textbox", { name: "Width in CSS pixels" }) as HTMLInputElement).value).toBe("180");
  await user.keyboard("{Escape}"); expect(change).toHaveBeenCalledTimes(1);
});
''')
