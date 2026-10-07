import { ownedGridText } from "../../ownedGridCells";
export function CellFallback({ value, fallbackText }: { value: unknown; fallbackText?: string }) {
  return <>{ownedGridText(value, fallbackText)}</>;
}
