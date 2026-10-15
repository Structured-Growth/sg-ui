/** One passive listener per document also covers scoped overlay portals. */
const documents = new WeakMap<Document, { users: number; release: () => void }>();
const attribute = "data-sgui-scrolling";
export function observeScrollbarActivity(doc: Document): () => void {
  let entry = documents.get(doc);
  if (!entry) {
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();
    const onScroll = (event: Event) => {
      const target = event.target as Element | null;
      if (!target || target.nodeType !== 1 || !target.closest("[data-sgui-scope]")) return;
      const previous = timers.get(target);
      if (previous !== undefined) clearTimeout(previous);
      target.setAttribute(attribute, "");
      timers.set(target, setTimeout(() => {
        target.removeAttribute(attribute);
        timers.delete(target);
      }, 1000));
    };
    doc.addEventListener("scroll", onScroll, { capture: true, passive: true });
    entry = { users: 0, release: () => {
      doc.removeEventListener("scroll", onScroll, true);
      for (const [target, timer] of timers) { clearTimeout(timer); target.removeAttribute(attribute); }
      timers.clear();
      documents.delete(doc);
    } };
    documents.set(doc, entry);
  }
  const current = entry;
  current.users++;
  return () => { if (--current.users === 0) current.release(); };
}
