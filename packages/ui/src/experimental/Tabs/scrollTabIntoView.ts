/** Keep focused items visible by moving only their owning tablist, never ancestors. */
export function scrollTabIntoView(strip: HTMLElement, item: HTMLElement, orientation: "horizontal" | "vertical" = "horizontal") {
  if (!strip.contains(item)) return;
  const viewport = strip.getBoundingClientRect();
  const bounds = item.getBoundingClientRect();
  if (orientation === "vertical") {
    const top = viewport.top + strip.clientTop;
    const bottom = top + strip.clientHeight;
    if (bounds.top < top) strip.scrollTop += bounds.top - top;
    else if (bounds.bottom > bottom) strip.scrollTop += bounds.bottom - bottom;
  } else {
    const left = viewport.left + strip.clientLeft;
    const right = left + strip.clientWidth;
    if (bounds.left < left) strip.scrollLeft += bounds.left - left;
    else if (bounds.right > right) strip.scrollLeft += bounds.right - right;
  }
}
