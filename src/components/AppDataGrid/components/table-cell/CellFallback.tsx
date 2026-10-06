type CellFallbackProps = {
  value: unknown;
  fallbackText?: string;
};

export function CellFallback({ value, fallbackText = "\u2014" }: CellFallbackProps) {
  if (value === null || value === undefined || value === "") {
    return <>{fallbackText}</>;
  }

  return <>{String(value)}</>;
}
