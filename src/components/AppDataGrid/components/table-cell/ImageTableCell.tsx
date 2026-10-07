import { OwnedGridCell } from "../../ownedGridCells";
export function ImageTableCell({ src, alt = "", fallbackText }: { src?: string | null; alt?: string; fallbackText?: string }) {
  return <OwnedGridCell row={undefined} value={undefined} rowLabel={alt} column={{ field: "value", cellType: "image", getImageSrc: () => src, fallbackText }} />;
}
