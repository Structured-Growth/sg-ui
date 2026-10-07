import { OwnedTableCell, type TableCellValueProps } from "./OwnedTableCell";
export function TextTableCell({ title, truncate: _truncate, ...props }: TableCellValueProps & { title?: string; truncate?: boolean }) {
  return <div title={title}><OwnedTableCell {...props} cellType="text" /></div>;
}
