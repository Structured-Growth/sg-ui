import type { FocusEvent } from "react";

/** Native focus may reveal only an input caret; keep the host control reachable. */
export function revealFocusedElement(shell: HTMLElement, target: HTMLElement, behavior?: ScrollBehavior) {
  const view = target.ownerDocument.defaultView;
  // Portaled/nested dialogs own their own focus and scroll behavior.
  if (!view || !shell.isConnected || !target.isConnected || !shell.contains(target)
    || target.ownerDocument.activeElement !== target || target.closest('[role="dialog"]')) return;
  const bounds = target.getBoundingClientRect();
  const viewport = { top: 0, bottom: view.innerHeight, left: 0, right: view.innerWidth };
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    const css = view.getComputedStyle(parent);
    const clip = parent.getBoundingClientRect();
    if (/auto|scroll|hidden|clip/.test(css.overflowY)) {
      viewport.top = Math.max(viewport.top, clip.top);
      viewport.bottom = Math.min(viewport.bottom, clip.bottom);
    }
    if (/auto|scroll|hidden|clip/.test(css.overflowX)) {
      viewport.left = Math.max(viewport.left, clip.left);
      viewport.right = Math.min(viewport.right, clip.right);
    }
  }
  if (bounds.top < viewport.top || bounds.bottom > viewport.bottom
    || bounds.left < viewport.left || bounds.right > viewport.right) {
    // Focus must reveal the whole control, rather than an animated caret-only
    // scroll that can leave its border/focus indicator clipped in Firefox.
    target.scrollIntoView({ block: "nearest", inline: "nearest", ...(behavior ? {behavior} : {}) });
  }
}

export function revealFocusedControl(event: FocusEvent<HTMLDivElement>) {
  const shell = event.currentTarget;
  const target = event.target as HTMLElement;
  const view = target.ownerDocument.defaultView;
  if (!view || !shell.contains(target) || target.closest('[role="dialog"]')) return;
  view.requestAnimationFrame(() => revealFocusedElement(shell, target));
}
