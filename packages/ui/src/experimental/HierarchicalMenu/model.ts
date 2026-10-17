import type { HierarchicalMenuItem, HierarchicalMenuLevel } from "./types";

export function levelItems(level: HierarchicalMenuLevel): readonly HierarchicalMenuItem[] {
  return [...level.sections.flatMap(section => section.items), ...(level.footerItems ?? [])];
}
/** Reconcile removed/disabled ancestors without looking up labels or entering cycles. */
export function resolvePath(root: HierarchicalMenuLevel, requested: readonly string[], commands: boolean) {
  const path: string[] = [];
  const ancestors: HierarchicalMenuItem[] = [];
  const levels = [root];
  const visited = new Set<HierarchicalMenuLevel>([root]);
  let level = root;
  let lastDrilldown = 0;
  for (const id of requested) {
    const item = levelItems(level).find(candidate => candidate.id === id);
    if (!item?.children || item.disabled || visited.has(item.children)) break;
    path.push(id); ancestors.push(item); level = item.children;
    visited.add(level); levels.push(level);
    if (commands || item.childBehavior !== "inline") lastDrilldown = path.length;
  }
  path.length = lastDrilldown; ancestors.length = lastDrilldown; levels.length = lastDrilldown + 1;
  return { path, level: levels.at(-1)!, ancestors, levels };
}
