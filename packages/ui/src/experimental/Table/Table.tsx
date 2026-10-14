import { forwardRef, type AriaAttributes, type CSSProperties, type ReactNode } from "react";
import type { Density } from "../../foundation/ThemeScope";
import styles from "./Table.module.css";

export interface TablePartProps extends AriaAttributes {
  children?: ReactNode;
  id?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}
export interface TableProps extends TablePartProps { density?: Density; }
export interface TableCellProps extends TablePartProps {
  colSpan?: number;
  rowSpan?: number;
  headers?: string;
  align?: "start" | "center" | "end";
}
export interface TableHeaderCellProps extends TableCellProps {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  abbr?: string;
}
function classes(base: string, extra?: string) { return [base, extra].filter(Boolean).join(" "); }
/** Native table semantics for static/composed content; interactive grids use DataGrid. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ density, className, ...props }, ref) {
  return <table {...props} ref={ref} className={classes(styles.table, className)} data-sgui-density={density} data-sgui-part="table" />;
});
export const TableHead = forwardRef<HTMLTableSectionElement, TablePartProps>(function TableHead(props, ref) {
  return <thead {...props} ref={ref} data-sgui-part="table-head" />;
});
export const TableBody = forwardRef<HTMLTableSectionElement, TablePartProps>(function TableBody(props, ref) {
  return <tbody {...props} ref={ref} data-sgui-part="table-body" />;
});
export const TableFoot = forwardRef<HTMLTableSectionElement, TablePartProps>(function TableFoot(props, ref) {
  return <tfoot {...props} ref={ref} data-sgui-part="table-foot" />;
});
export const TableRow = forwardRef<HTMLTableRowElement, TablePartProps>(function TableRow(props, ref) {
  return <tr {...props} ref={ref} data-sgui-part="table-row" />;
});
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ align = "start", className, ...props }, ref) {
  return <td {...props} ref={ref} className={classes(styles.cell, className)} data-align={align} data-sgui-part="table-cell" />;
});
export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell({ align = "start", className, scope = "col", ...props }, ref) {
  return <th {...props} ref={ref} scope={scope} className={classes(styles.header, className)} data-align={align} data-sgui-part="table-header-cell" />;
});
export const TableCaption = forwardRef<HTMLTableCaptionElement, TablePartProps>(function TableCaption({ className, ...props }, ref) {
  return <caption {...props} ref={ref} className={classes(styles.caption, className)} data-sgui-part="table-caption" />;
});
