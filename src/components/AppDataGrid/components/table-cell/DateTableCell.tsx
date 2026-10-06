import { TextTableCell } from "./TextTableCell";

type DateTableCellProps = {
  value: unknown;
  fallbackText?: string;
};

export function DateTableCell({ value, fallbackText }: DateTableCellProps) {
  const dateValue = typeof value === "string" || value instanceof Date ? new Date(value) : null;
  const formatted = dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toLocaleDateString("en-US") : null;

  return <TextTableCell fallbackText={fallbackText} value={formatted} />;
}
