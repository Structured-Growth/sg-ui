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

/**
 * React Aria follows preventScroll focus with a native viewport reveal in a frame.
 * Manual vertical navigation owns the list scroll, including that later reveal.
 * Bridge only these private elements; native focus entry and host methods stay intact.
 */
export function createManualTabRevealRef(enabled: boolean): (element: HTMLDivElement | null) => void {
  let release: (() => void) | undefined;
  return element => {
    release?.();
    release = undefined;
    if (!element || !enabled) return;
    const descriptor = Object.getOwnPropertyDescriptor(element, "scrollIntoView");
    Object.defineProperty(element, "scrollIntoView", {
      configurable: true,
      value: () => {
        // The list itself is already in its host's chosen viewport. A stale
        // upstream frame must not reveal a tab after focus left the strip.
        if (element.getAttribute("role") !== "tab" || element.ownerDocument.activeElement !== element) return;
        const list = element.closest<HTMLElement>('[role="tablist"]');
        if (list) scrollTabIntoView(list, element, "vertical");
      },
    });
    release = () => {
      if (descriptor) Object.defineProperty(element, "scrollIntoView", descriptor);
      else delete (element as Partial<HTMLElement>).scrollIntoView;
    };
  };
}
