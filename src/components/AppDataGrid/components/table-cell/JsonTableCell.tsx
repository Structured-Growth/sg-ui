import { TextTableCell } from "./TextTableCell";

type JsonTableCellProps = {
  value: unknown;
  fallbackText?: string;
};

export function JsonTableCell({ value, fallbackText }: JsonTableCellProps) {
  const textValue = value === null || value === undefined ? null : JSON.stringify(value, null, 0);

  return <TextTableCell fallbackText={fallbackText} title={textValue ?? ""} truncate value={textValue} />;
}
