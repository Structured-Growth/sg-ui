/** Ticks share the step lattice's minimum anchor. Avoid unbounded decorative DOM. */
export function sliderTicks(min: number, max: number, increment: number): number[] {
  if (!Number.isFinite(increment) || increment <= 0) throw new RangeError("Slider increment must be a finite positive number.");
  const intervals = (max - min) / increment;
  const count = Math.floor(intervals + Number.EPSILON * Math.max(1, Math.abs(intervals)) * 4) + 1;
  if (!Number.isFinite(count) || count > 1001) throw new RangeError("Slider increment must produce at most 1001 ticks.");
  return Array.from({length:Math.max(0,count)},(_,index)=>Math.max(min,Math.min(max,Number((min+index*increment).toPrecision(15)))));
}
