import type { ReactNode } from "react";
import { OwnedGridCell } from "../../ownedGridCells";
export function CustomTableCell({ children }: { children: ReactNode }) {
  return <OwnedGridCell row={undefined} value={undefined} column={{ field: "value", cellType: "custom", renderCustomCell: () => children }} />;
}
