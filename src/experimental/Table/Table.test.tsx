// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFoot, TableHead, TableHeaderCell, TableRow } from "./Table";
afterEach(cleanup);
it("preserves native table associations, caption, spans, and native refs", () => {
  const ref = createRef<HTMLTableElement>();
  const cellRef = createRef<HTMLTableCellElement>();
  render(<Table ref={ref}><TableCaption>Course enrollment</TableCaption>
    <TableHead><TableRow><TableHeaderCell id="course">Course</TableHeaderCell><TableHeaderCell id="count" align="end">Learners</TableHeaderCell></TableRow></TableHead>
    <TableBody><TableRow><TableHeaderCell scope="row">React</TableHeaderCell><TableCell ref={cellRef} headers="count" align="end">12</TableCell></TableRow></TableBody>
    <TableFoot><TableRow><TableCell colSpan={2}>1 course</TableCell></TableRow></TableFoot>
  </Table>);
  expect(ref.current).toBe(screen.getByRole("table", { name: "Course enrollment" }));
  expect(screen.queryByRole("grid")).toBeNull();
  expect(screen.getByRole("columnheader", { name: "Learners" }).getAttribute("scope")).toBe("col");
  expect(screen.getByRole("rowheader", { name: "React" }).getAttribute("scope")).toBe("row");
  expect(cellRef.current).toBe(screen.getByRole("cell", { name: "12" }));
  expect(cellRef.current?.headers).toBe("count");
  expect(screen.getByRole("cell", { name: "1 course" }).getAttribute("colspan")).toBe("2");
});
