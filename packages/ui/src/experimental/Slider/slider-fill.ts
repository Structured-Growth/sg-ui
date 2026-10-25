/** Normalized track interval. Before/after follow values, independently of RTL/orientation. */
export function sliderFillInterval(values: readonly number[], min: number, max: number,
  fill: "auto" | "before" | "after" | "between" | "none", offset?: number): {start: number; end: number} | null {
  if (fill === "none" || !values.length || max <= min || (fill === "between" && values.length < 2)) return null;
  const first = values[0], last = values[values.length - 1];
  const [from, to] = fill === "before" ? [min, first] : fill === "after" ? [last, max]
    : values.length > 1 ? [first, last] : [offset ?? min, first];
  const percent = (value: number) => Math.max(0, Math.min(1, (value - min) / (max - min)));
  return {start: Math.min(percent(from), percent(to)), end: Math.max(percent(from), percent(to))};
}
