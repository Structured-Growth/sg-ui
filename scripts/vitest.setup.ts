import cssEscape from "css.escape";

// jsdom lacks this browser API used by collection keyboard navigation.
// Use the standards polyfill; do not replace the interaction implementation.
if (typeof window !== "undefined") {
  Object.assign(globalThis, { CSS: { ...globalThis.CSS, escape: cssEscape } });
}
