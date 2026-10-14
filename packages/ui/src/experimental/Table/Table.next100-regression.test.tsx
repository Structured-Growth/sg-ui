// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Provider, Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow } from "../../primitives";

afterEach(cleanup);

it("forwards public table and cell customization while retaining native semantics", () => {
  const table = createRef<HTMLTableElement>();
  const header = createRef<HTMLTableCellElement>();
  const cell = createRef<HTMLTableCellElement>();
  render(<Provider><Table ref={table} density="compact" className="host-table" style={{ maxWidth: 480 }}>
    <TableCaption>Course totals</TableCaption>
    <TableHead><TableRow><TableHeaderCell ref={header} id="total" abbr="Total" align="center" className="host-header" style={{ width: 120 }}>Learners</TableHeaderCell></TableRow></TableHead>
    <TableBody><TableRow><TableCell ref={cell} headers="total" rowSpan={2} align="end" className="host-cell" style={{ paddingInline: 12 }} aria-label="12 enrolled learners">12</TableCell></TableRow><TableRow /></TableBody>
  </Table></Provider>);
  expect(table.current).toBe(screen.getByRole("table", { name: "Course totals" }));
  expect(table.current?.classList.contains("host-table")).toBe(true);
  expect(table.current?.style.maxWidth).toBe("480px");
  expect(table.current?.getAttribute("data-sgui-density")).toBe("compact");
  expect(header.current).toBe(screen.getByRole("columnheader", { name: "Learners" }));
  expect(header.current?.classList.contains("host-header")).toBe(true);
  expect(header.current?.style.width).toBe("120px");
  expect(header.current?.abbr).toBe("Total");
  expect(header.current?.getAttribute("data-align")).toBe("center");
  expect(cell.current).toBe(screen.getByRole("cell", { name: "12 enrolled learners" }));
  expect(cell.current?.classList.contains("host-cell")).toBe(true);
  expect(cell.current?.style.paddingInline).toBe("12px");
  expect(cell.current?.rowSpan).toBe(2);
  expect(cell.current?.headers).toBe(header.current?.id);
  expect(cell.current?.getAttribute("data-align")).toBe("end");
});

it("keeps sibling table refs and host content isolated through update removal and remount", () => {
  const first = createRef<HTMLTableElement>();
  const second = createRef<HTMLTableElement>();
  const firstCell = createRef<HTMLTableCellElement>();
  const secondCell = createRef<HTMLTableCellElement>();
  function View({ visible = true, value = "Initial" }: { visible?: boolean; value?: string }) {
    return <Provider>
      {visible && <Table key="first" ref={first}><TableCaption>First course</TableCaption><TableBody><TableRow><TableCell ref={firstCell}>{value}</TableCell></TableRow></TableBody></Table>}
      <Table key="second" ref={second}><TableCaption>Second course</TableCaption><TableBody><TableRow><TableCell ref={secondCell}>Unchanged</TableCell></TableRow></TableBody></Table>
    </Provider>;
  }
  const { rerender, unmount } = render(<View />);
  const originalFirst = first.current;
  const originalSecond = second.current;
  const originalSecondCell = secondCell.current;
  expect(originalFirst).not.toBe(originalSecond);
  rerender(<View value="Updated" />);
  expect(first.current).toBe(originalFirst);
  expect(within(first.current!).getByRole("cell", { name: "Updated" })).toBe(firstCell.current);
  expect(second.current).toBe(originalSecond);
  expect(secondCell.current).toBe(originalSecondCell);
  expect(secondCell.current?.textContent).toBe("Unchanged");
  rerender(<View visible={false} />);
  expect(first.current).toBeNull();
  expect(firstCell.current).toBeNull();
  expect(originalFirst?.isConnected).toBe(false);
  expect(second.current).toBe(originalSecond);
  rerender(<View value="Remounted" />);
  expect(first.current).not.toBe(originalFirst);
  expect(within(first.current!).getByRole("cell", { name: "Remounted" })).toBe(firstCell.current);
  expect(secondCell.current).toBe(originalSecondCell);
  unmount();
  expect(first.current).toBeNull();
  expect(second.current).toBeNull();
  expect(firstCell.current).toBeNull();
  expect(secondCell.current).toBeNull();
});
