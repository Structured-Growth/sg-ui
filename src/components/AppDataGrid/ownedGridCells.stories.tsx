import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Provider } from "../../experimental/Provider/Provider";
import { SGNavigationProvider } from "../../adapters/navigation";
import { Button } from "../../experimental/Button/Button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from "../../experimental/Table/Table";
import { OwnedGridCell } from "./ownedGridCells";
import { TextArea } from "../../experimental/TextArea/TextArea";
import { CopyableTableCell } from "./components/table-cell/CopyableTableCell";
import { TextTableCell } from "./components/table-cell/TextTableCell";
import { AppDataGrid } from "./AppDataGrid";
import type { OwnedGridPresentationColumn } from "./ownedGridColumns";

type ExampleRow = { id: string; text: string | null; date: string; dateTime: string; copy: string; json: unknown; image?: string; custom: string };
const cycle: Record<string, unknown> = {}; cycle.self = cycle;
const rows: ExampleRow[] = [
  { id: "one", text: "Course fundamentals", date: "2026-10-06", dateTime: "2026-10-06T02:00:00Z", copy: "COURSE-001", json: { title: "<strong>Escaped JSON</strong>" }, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%234d6b5d'/%3E%3C/svg%3E", custom: "Preview" },
  { id: "two", text: null, date: "2026-02-30", dateTime: "Invalid timestamp", copy: "", json: cycle, custom: "Preview" },
];
export function CellsExample({ locale = "en-US" }: { locale?: string }) {
  const [action, setAction] = useState("No action");
  const columns: OwnedGridPresentationColumn<ExampleRow>[] = [
    { field: "text", headerName: "Text" }, { field: "date", headerName: "Date", cellType: "date" },
    { field: "dateTime", headerName: "Date and time", cellType: "dateTime" },
    { field: "link", headerName: "Link", cellType: "link", getLink: row => ({ href: `/courses/${row.id}`, label: "Open" }) },
    { field: "copy", headerName: "Copy", cellType: "copyable" }, { field: "json", headerName: "JSON", cellType: "json", fallbackText: "Unavailable JSON" },
    { field: "image", headerName: "Image", cellType: "image", getImageSrc: row => row.image, fallbackText: "No image" },
    { field: "custom", headerName: "Custom", cellType: "custom", renderCustomCell: row => <Button density="compact" variant="text" onPress={() => setAction(`Preview ${row.id}`)}>Preview</Button> },
    { field: "actions", headerName: "Actions", cellType: "menu", getMenuActions: () => [
      { id: "edit", label: "Edit", onPress: row => setAction(`Edit ${row.id}`) },
      { id: "pending", label: "Saving", pending: true, onPress: row => setAction(`Save ${row.id}`) },
      { id: "open", label: "Open course", href: "/courses" },
    ] },
  ];
  return <SGNavigationProvider value={{ pathname: "/", navigate: href => setAction(`Navigate ${href}`) }}>
    <p>Internal M-16 cell presentation proof. Dates use {locale}; date-only values keep their literal calendar day in every host zone. Action work stays with the host.</p>
    <div style={{ overflowX: "auto" }}><Table density="compact"><TableCaption>All nine owned cell types</TableCaption>
      <TableHead><TableRow>{columns.map(column => <TableHeaderCell key={column.field}>{column.headerName}</TableHeaderCell>)}</TableRow></TableHead>
      <TableBody>{rows.map(row => <TableRow key={row.id}>{columns.map(column => <TableCell key={column.field}>
        <OwnedGridCell row={row} column={column} value={Reflect.get(row, column.field)} rowLabel={row.text ?? "Empty course"} locale={locale} timeZone="America/Los_Angeles" />
      </TableCell>)}</TableRow>)}</TableBody>
    </Table></div>
    <p role="status">Host action: {action}</p>
  </SGNavigationProvider>;
}
const meta = { title: "Migration proofs/Catalog grid cells", excludeStories: ["CellsExample"], decorators: [(Story) => <Provider><Story /></Provider>] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllCellTypes: Story = { render: () => <CellsExample /> };
export const HostLocale: Story = { render: () => <CellsExample locale="de-DE" /> };
export const PublicTextWrapping: Story = { render: () => {
  const value = "A complete course description with a preserved second line.\nhttps://example.com/an-unbroken-path-that-must-fit-inside-its-cell";
  return <div style={{ width: 240 }}><Table style={{ width: "100%", tableLayout: "fixed" }}><TableCaption>Public text truncation</TableCaption>
    <TableHead><TableRow><TableHeaderCell>Display</TableHeaderCell></TableRow></TableHead>
    <TableBody><TableRow><TableCell><TextTableCell value={value} title="Truncated description" /></TableCell></TableRow>
      <TableRow><TableCell><TextTableCell value={value} truncate={false} title="Complete description" /></TableCell></TableRow></TableBody>
  </Table></div>;
} };
export const ColumnTextWrapping: Story = { render: () => <div style={{ height: 360 }}><AppDataGrid
  rows={[{ id: "one", description: "First line\nA complete long description that wraps within the declared column width." }]}
  label="Wrapped course descriptions" getRowLabel={() => "Course description"} selection={false}
  columns={[{ field: "description", headerName: "Description", width: 240, truncate: false }]} /></div> };


export const ClipboardFeedback: Story = { render: function ClipboardFeedbackExample() {
  const [revision, setRevision] = useState(0);
  const [showIndependent, setShowIndependent] = useState(true);
  const text = '<img src=x onerror="alert(1)"> & "quoted"\nSecond line';
  const json = { html: '<script>alert("quoted")</script>', text: "First\nSecond & third" };
  return <>
    <p>Use Enter or Space to copy. Each cell announces success or failure for three seconds. Clipboard permissions belong to the browser.</p>
    <div style={{ height: 320 }}><AppDataGrid label="Clipboard courses"
      rows={[{ id: "text", name: "Text course", value: text }, { id: "json", name: "JSON course", value: json }, { id: "empty", name: "Empty course", value: null }]}
      getRowLabel={row => row.name} columns={[{ field: "name", headerName: "Course" },
        { field: "value", headerName: "Copy value", cellType: "copyable", width: 420, truncate: false,
          formatValue: value => typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "—") }]} /></div>
    <section aria-label="Independent copy cell">{showIndependent && <CopyableTableCell value={`Independent ${revision}`} />}</section>
    <Button onPress={() => setRevision(value => value + 1)}>Replace independent value</Button>
    <Button onPress={() => setShowIndependent(value => !value)}>Toggle independent cell</Button>
    <Button>Host action</Button>
    <TextArea label="Clipboard destination" />
  </>;
} };
