import { OwnedTableCell, type TableCellValueProps } from "./OwnedTableCell";
export function CopyableTableCell(props: TableCellValueProps) { return <OwnedTableCell {...props} cellType="copyable" />; }
