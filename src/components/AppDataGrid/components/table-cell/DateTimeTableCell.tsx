import { TextTableCell } from "./TextTableCell";

type DateTimeTableCellProps = {
  value: unknown;
  fallbackText?: string;
};

export function DateTimeTableCell({ value, fallbackText }: DateTimeTableCellProps) {
  const dateValue = typeof value === "string" || value instanceof Date ? new Date(value) : null;
  const formatted = dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toLocaleString("en-US") : null;

  return <TextTableCell fallbackText={fallbackText} value={formatted} />;
}
