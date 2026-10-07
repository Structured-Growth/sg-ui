import { OwnedGridCell, type OwnedGridCellProps } from "../../ownedGridCells";
import type { OwnedGridCellType } from "../../ownedGridColumns";
export type TableCellValueProps = Pick<OwnedGridCellProps<unknown>, "value" | "locale" | "timeZone" | "formatDate" | "className" | "style"> & { fallbackText?: string };
export function OwnedTableCell({ cellType, fallbackText, ...props }: TableCellValueProps & { cellType: OwnedGridCellType }) {
  return <OwnedGridCell {...props} row={undefined} column={{ field: "value", cellType, fallbackText }} />;
}
