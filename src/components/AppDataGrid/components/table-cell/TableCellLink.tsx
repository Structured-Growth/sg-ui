import { OwnedGridCell } from "../../ownedGridCells";
import type { OwnedGridPresentationColumn } from "../../ownedGridColumns";
type LinkValue = ReturnType<NonNullable<OwnedGridPresentationColumn<unknown>["getLink"]>>;
export function TableCellLink({ fallbackText, ...link }: LinkValue & { fallbackText?: string }) {
  return <OwnedGridCell row={undefined} value={link.label} column={{ field: "value", cellType: "link", getLink: () => link, fallbackText }} />;
}
