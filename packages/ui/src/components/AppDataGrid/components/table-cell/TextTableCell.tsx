import { OwnedTableCell, type TableCellValueProps } from "./OwnedTableCell";
export function TextTableCell({ title, ...props }: TableCellValueProps & { title?: string }) {
  return <div title={title}><OwnedTableCell {...props} cellType="text" /></div>;
}
