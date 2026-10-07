import { OwnedGridCell } from "../../ownedGridCells";
import type { AppDataGridMenuAction } from "../../types";
export function TableCellMenu<Row>({ row, actions, rowLabel }: { row: Row; actions: readonly AppDataGridMenuAction<Row>[]; rowLabel?: string }) {
  return <OwnedGridCell row={row} value={undefined} rowLabel={rowLabel} column={{ field: "actions", cellType: "menu", getMenuActions: () => actions }} />;
}
