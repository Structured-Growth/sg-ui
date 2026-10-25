export type WatchedRange = readonly [start: number, end: number];
export function mergeWatchedRanges(ranges: readonly WatchedRange[], duration: number): WatchedRange[] {
  const sorted = ranges.filter(([start, end]) => Number.isFinite(start) && Number.isFinite(end) && end > start)
    .map(([start, end]): WatchedRange => [Math.max(0, start), Math.min(duration, end)])
    .filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
  const result: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last && start <= last[1] + 0.05) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}
export function allowedPosition(target: number, ranges: readonly WatchedRange[]): boolean {
  return target <= 0.05 || ranges.some(([start, end]) => target >= start && target <= end + 0.05);
}
