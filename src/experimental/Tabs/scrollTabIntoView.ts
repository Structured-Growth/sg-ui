/** Keep focused items visible by moving only their section strip, never ancestors. */
export function scrollTabIntoView(strip: HTMLElement, item: HTMLElement) {
  const viewport = strip.getBoundingClientRect();
  const bounds = item.getBoundingClientRect();
  const left = viewport.left + strip.clientLeft;
  const right = left + strip.clientWidth;
  if (bounds.left < left) strip.scrollLeft += bounds.left - left;
  else if (bounds.right > right) strip.scrollLeft += bounds.right - right;
}
