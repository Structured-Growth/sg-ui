from pathlib import Path
import difflib, json, hashlib
root=Path.cwd(); out=root/'docs/developer/final-acceptance/wave-03-10'; proposed=out/'proposed-files'
changes={}
def write(path,text):
 p=proposed/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text); changes[path]=text
control='packages/ui/src/experimental/DataGrid/GridColumnWidthControl.tsx'
write(control,'''"use client";
import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { TextField } from "../TextField/TextField";
import { Popover } from "../Popover/Popover";
import { useTranslation } from "../../i18n";

/** Private shared pointer alternative. Width requests remain owned by the grid host. */
export function GridColumnWidthControl({ label, width, minWidth, maxWidth, onWidthChange }: {
  label: string; width: number; minWidth: number; maxWidth?: number;
  onWidthChange: (width: number) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(width));
  const value = Number(draft);
  const valid = draft.trim() !== "" && Number.isFinite(value) && value >= minWidth && value <= (maxWidth ?? Infinity);
  const fixed = minWidth === maxWidth;
  const title = t("common.ui.grid.columnWidth", { defaultMessage: "Width of {label}", values: { label } });
  const request = (next: number) => {
    onWidthChange(next);
    // Closing ends the request. Reopening reads the effective host width again,
    // including host rejection, flex-column allocation and external replacement.
    setOpen(false);
  };
  return <Popover title={title} size="content" open={open} onOpenChange={next => {
    if (next) setDraft(String(width));
    setOpen(next);
  }} trigger={<Button variant="text" tone="neutral" aria-label={title} disabled={fixed}>↔</Button>}>
    <div style={{ display: "grid", gap: "var(--sgui-space2)" }}>
      <TextField label={t("common.ui.grid.widthPixels", { defaultMessage: "Width in CSS pixels" })}
        inputMode="decimal" value={draft} onValueChange={setDraft} invalid={!valid}
        errorMessage={t("common.ui.grid.widthBounds", { defaultMessage: "Enter a finite width within the column limits." })} />
      <Button variant="outlined" tone="neutral" disabled={width <= minWidth}
        onPress={() => request(Math.max(minWidth, width - 1))}>{t("common.ui.grid.narrower", { defaultMessage: "Narrower by 1 pixel" })}</Button>
      <Button variant="outlined" tone="neutral" disabled={width >= (maxWidth ?? Infinity)}
        onPress={() => request(Math.min(maxWidth ?? Infinity, width + 1))}>{t("common.ui.grid.wider", { defaultMessage: "Wider by 1 pixel" })}</Button>
      <Button disabled={!valid || value === width} onPress={() => request(value)}>{t("common.ui.apply", { defaultMessage: "Apply" })}</Button>
    </div>
  </Popover>;
}
''')
p='packages/ui/src/experimental/DataGrid/DataGrid.tsx';s=(root/p).read_text();s=s.replace('import { getGridFillColumn', 'import { GridColumnWidthControl } from "./GridColumnWidthControl";\nimport { getGridFillColumn');s=s.replace('  const resizing = useRef<string | null>(null);','  const resizing = useRef<string | null>(null);\n  const gridElement = useRef<HTMLDivElement>(null);');s=s.replace('<div className={styles.root}>','<div ref={gridElement} className={styles.root}>',1)
needle='</span></div>\n          </Column>)}'
assert needle in s
s=s.replace(needle,'''</span><GridColumnWidthControl label={column.label}
              width={gridElement.current?.querySelector<HTMLElement>(`[data-width-column-index="${index}"]`)?.getBoundingClientRect().width ?? current.widths[column.id] ?? column.width ?? 160}
              minWidth={column.minWidth ?? (column.width === undefined ? 120 : 80)} maxWidth={column.maxWidth}
              onWidthChange={width => update({ widths: retainGridFillColumn(sizingColumns, { ...current.widths, [column.id]: width }, column.id) })} /></div>
          </Column>)}''')
s=s.replace('isRowHeader={index === 0} textValue={column.label}', 'isRowHeader={index === 0} data-width-column-index={index} textValue={column.label}')
# Read effective width on opening, not during render before table mount. Component accepts callback.
s=s.replace('width={gridElement.current?', 'width={() => gridElement.current?').replace('?? column.width ?? 160}\n              minWidth=', '?? column.width ?? 160}\n              minWidth=')
write(p,s)
p='packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx';s=(root/p).read_text();s=s.replace('import { OwnedGridHeaderSortMenu', 'import { GridColumnWidthControl } from "../../experimental/DataGrid/GridColumnWidthControl";\nimport { OwnedGridHeaderSortMenu');s=s.replace('                /></span>\n            </div>', '''                /></span><GridColumnWidthControl label={column.headerName ?? column.field}
                width={() => measured[column.field]!} minWidth={column.minWidth ?? 80} maxWidth={column.maxWidth}
                onWidthChange={width => setWidths(availableWidth > 0 ? retainOwnedGridFlexColumn(visible, { ...layout.widths, [column.field]: width }, column.field) : { ...layout.widths, [column.field]: width })} />
            </div>''');write(p,s)
# Resolve live width only after opening: parent does not need measurement-driven renders.
s=changes[control].replace('width: number; minWidth:', 'width: () => number; minWidth:').replace('useState(String(width))','useState("")').replace('  const value = Number(draft);','  const [effectiveWidth, setEffectiveWidth] = useState(0);\n  const value = Number(draft);').replace('if (next) setDraft(String(width));','if (next) { const current = width(); setDraft(String(current)); setEffectiveWidth(current); }').replace('width <= minWidth','effectiveWidth <= minWidth').replace('width - 1','effectiveWidth - 1').replace('width >= (maxWidth','effectiveWidth >= (maxWidth').replace('width + 1','effectiveWidth + 1').replace('value === width','value === effectiveWidth');write(control,s)
p='packages/ui/src/experimental/TagGroup/TagGroup.module.css';s=(root/p).read_text().replace('min-inline-size: var(--sgui-control-height);','min-inline-size: max(var(--sgui-control-height), var(--sgui-control-minimum-target-size));');write(p,s)
p='apps/docs/content/component-usage/data.json';s=(root/p).read_text();data=json.loads(s)
for slug in ['app-data-grid','processing-grid']:
 data[slug]['how'].append('Each resizable column provides a Width action as a single-pointer alternative to dragging. Open it to apply an exact CSS-pixel width or choose Narrower/Wider by 1 pixel. Fixed columns disable the action. The host accepts the complete width snapshot; reopening reads the effective width if the host rejects a request or a fill column reallocates space.')
write(p,json.dumps(data,indent=2,ensure_ascii=False)+'\n')
patch='';inputs={}
for p,s in changes.items():
 original=(root/p).read_text() if (root/p).exists() else ''
 inputs[p]=hashlib.sha256(original.encode()).hexdigest() if (root/p).exists() else None
 patch+=''.join(difflib.unified_diff(original.splitlines(True),s.splitlines(True),fromfile='a/'+p if (root/p).exists() else '/dev/null',tofile='b/'+p))
(out/'implementation.patch').write_text(patch);(out/'patch-base-hashes.json').write_text(json.dumps(inputs,indent=2)+'\n')
