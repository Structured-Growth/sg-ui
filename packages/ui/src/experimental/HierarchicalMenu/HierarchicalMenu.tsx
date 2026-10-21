"use client";
import { forwardRef, useEffect, useId, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { Menu as AriaMenu, MenuItem as AriaMenuItem, MenuSection, Header } from "react-aria-components/Menu";
import { Button } from "../../components/Button/Button";
import { Link } from "../Link/Link";
import { Typography } from "../Typography/Typography";
import { KeyboardArrowLeftIcon } from "../../icons/KeyboardArrowLeftIcon";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { useTranslation } from "../../i18n";
import { useNavigationAdapter } from "../../adapters/navigation";
import { levelItems, resolvePath } from "./model";
import type { HierarchicalMenuItem, HierarchicalMenuLevel, HierarchicalMenuProps } from "./types";
import styles from "./HierarchicalMenu.module.css";

export type { HierarchicalMenuItem, HierarchicalMenuLevel, HierarchicalMenuSection, HierarchicalMenuProps } from "./types";

/** Surface-independent drilldown panel. The host owns popup opening and placement. */
export const HierarchicalMenu = forwardRef<HTMLDivElement, HierarchicalMenuProps>(function HierarchicalMenu({
  label, items, presentation = "navigation", path: controlled, defaultPath = [], onPathChange,
  onAction, onDismiss, backLabel, density, className, style,
}, ref) {
  const { t } = useTranslation();
  const { navigate } = useNavigationAdapter();
  const [localPath, setLocalPath] = useState<readonly string[]>(defaultPath);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const root = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<HTMLDivElement | null>(null);
  const ownsFocus = useRef(false);
  const scrollPositions = useRef(new Map<string, number>());
  const requested = controlled ?? localPath;
  const commands = presentation === "commands";
  const resolved = resolvePath(items, requested, commands);
  const key = JSON.stringify(resolved.path);
  const rawKey = JSON.stringify(requested);
  const previous = useRef({ key, path: resolved.path });
  const pending = useRef<{ key: string; item?: string } | null>(null);
  const lastRepair = useRef<string | null>(null);
  const titleId = useId();
  const parent = resolved.ancestors.at(-1);
  const [transition, setTransition] = useState<"forward" | "back" | undefined>();

  function request(next: string[], focusPath?: readonly string[]) {
    if (scroll.current) scrollPositions.current.set(key, scroll.current.scrollTop);
    pending.current = { key: JSON.stringify(next), item: focusPath ? JSON.stringify(focusPath) : undefined };
    if (controlled === undefined) setLocalPath(next);
    onPathChange?.(next);
  }
  function back() {
    if (!parent) return;
    let end = resolved.path.length - 1;
    while (!commands && end > 0 && resolved.ancestors[end - 1].childBehavior === "inline") end--;
    request(resolved.path.slice(0, end), resolved.path);
  }
  // Only accepted path/model changes move focus. Rejected controlled requests do
  // not change the view or focus. A successful host destination always wins.
  useEffect(() => {
    const before = previous.current;
    previous.current = { key, path: resolved.path };
    if (before.key === key) return;
    setTransition(resolved.path.length > before.path.length ? "forward" : "back");
    if (scroll.current) scroll.current.scrollTop = scrollPositions.current.get(key) ?? 0;
    const node = root.current;
    if (!node) return;
    const intent = pending.current;
    pending.current = null;
    const view = node.ownerDocument.defaultView;
    if (!view) return;
    // React Aria commits its collection after the new level's first effect.
    // Resolve actual item DOM in a frame, after that collection commit. Recheck
    // ownership there so an intervening host focus destination always wins.
    const frame = view.requestAnimationFrame(() => {
      if (root.current !== node || !node.isConnected) return;
      const active = node.ownerDocument.activeElement;
      const mayRecover = ownsFocus.current && (active === node.ownerDocument.body || !!active && node.contains(active));
      if (!mayRecover) return;
      const candidates = Array.from(node.querySelectorAll<HTMLElement>('[data-hierarchical-item]:not([aria-disabled="true"]):not(:disabled)'))
        .filter(element => !element.closest('[hidden]'));
      const restoredPath = intent?.key === key ? intent.item : JSON.stringify(before.path.slice(0, resolved.path.length + 1));
      const target = restoredPath ? candidates.find(element => element.dataset.hierarchicalPath === restoredPath) : undefined;
      (target ?? candidates.find(element => !element.hasAttribute('data-hierarchical-back')) ?? candidates[0] ?? node).focus({ preventScroll: true });
    });
    return () => view.cancelAnimationFrame(frame);
  }, [key]);
  useEffect(() => {
    if (key === rawKey) { lastRepair.current = null; return; }
    const repair = rawKey + ":" + key;
    if (lastRepair.current === repair) return;
    lastRepair.current = repair;
    if (controlled === undefined) setLocalPath(resolved.path);
    onPathChange?.([...resolved.path]);
  }, [key, rawKey, controlled, onPathChange]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (commands && parent) { event.preventDefault(); event.stopPropagation(); back(); }
    else if (commands && onDismiss) { event.preventDefault(); event.stopPropagation(); onDismiss(); }
  }
  const accessibleBack = parent && (backLabel?.(parent.label) ?? t("common.ui.hierarchicalMenu.back", { defaultMessage: "Back to {label}", values: { label: parent.label } }));
  function enter(item: HierarchicalMenuItem, prefix = resolved.path) {
    if (item.disabled) return;
    if (item.children) request([...prefix, item.id]);
    else onAction?.(item.id);
  }
  function content(item: HierarchicalMenuItem) {
    return <>{item.icon && <span className={styles.icon} aria-hidden="true">{item.icon}</span>}
      <span className={styles.itemLabel}>{item.label}</span>{item.children && <span className={styles.arrow} aria-hidden="true"><ChevronRightIcon /></span>}</>;
  }
  // Navigation keeps native link activation and disclosures. It intentionally
  // does not emulate menu arrow keys or put form content in a command collection.
  function navigationLevel(level: HierarchicalMenuLevel, prefix: string[], visited: Set<HierarchicalMenuLevel>): ReactNode {
    return <>{level.sections.map(section => <section key={section.id} className={styles.section} aria-label={section.label}>
      {section.label && <Typography as="div" variant="caption" className={styles.sectionTitle}>{section.label}</Typography>}
      <ul className={styles.list}>{section.items.map(item => navigationItem(item, prefix, visited))}</ul>
    </section>)}{level.footerItems?.length ? <ul className={`${styles.list} ${styles.footer}`}>{level.footerItems.map(item => navigationItem(item, prefix, visited))}</ul> : null}</>;
  }
  function navigationItem(item: HierarchicalMenuItem, prefix: string[], visited: Set<HierarchicalMenuLevel>) {
    const identity = JSON.stringify([...prefix, item.id]);
    const inline = !!item.children && item.childBehavior === "inline" && !visited.has(item.children);
    const isExpanded = expanded.has(identity);
    const isCycle = !!item.children && visited.has(item.children);
    return <li key={item.id}>
      {item.href && !item.children && !item.disabled ? <Link href={item.href} target={item.target} rel={item.rel} replace={item.replace} underline="none" tone="inherit"
        aria-current={item.current ? "page" : undefined} data-hierarchical-item={item.id} data-hierarchical-path={identity} className={styles.item} onClick={() => onAction?.(item.id)}>{content(item)}</Link> :
        <Button variant="text" tone="neutral" disabled={item.disabled || isCycle} aria-current={item.current ? "page" : undefined}
          aria-expanded={inline ? isExpanded : undefined} className={styles.item} {...{ "data-hierarchical-item": item.id, "data-hierarchical-path": identity }} onPress={() => {
            if (inline) setExpanded(before => { const next = new Set(before); if (next.has(identity)) next.delete(identity); else next.add(identity); return next; });
            else enter(item, prefix);
          }}>{content(item)}</Button>}
      {inline && <div hidden={!isExpanded || item.disabled} className={styles.inline}>{navigationLevel(item.children!, [...prefix, item.id], new Set([...visited, item.children!]))}</div>}
    </li>;
  }
  const commandItems = levelItems(resolved.level);
  const backId = useId(); // Separate collection identity, not a host-reserved string.
  const commandItem = (item: HierarchicalMenuItem) => <AriaMenuItem key={item.id} id={item.id} textValue={item.label}
    isDisabled={item.disabled || !!item.children && resolved.levels.includes(item.children)} href={item.children ? undefined : item.href} target={item.target}
    rel={item.target === "_blank" ? [...new Set([...(item.rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"])].join(" ") : item.rel}
    shouldCloseOnSelect={false} aria-current={item.current ? "page" : undefined} data-hierarchical-item={item.id} data-hierarchical-path={JSON.stringify([...resolved.path, item.id])} className={styles.item} onClick={event => {
      if (!item.children && item.href && (!item.target || item.target === "_self") && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(item.href) && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault(); navigate(item.href, { replace: item.replace });
      }
    }}>{content(item)}</AriaMenuItem>;
  return <div ref={node => { root.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
    className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-sgui-density={density} data-sgui-part="hierarchical-menu"
    tabIndex={-1} onKeyDownCapture={onKeyDown} onFocusCapture={() => { ownsFocus.current = true; }} onBlurCapture={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) ownsFocus.current = false;
    }}>
    {resolved.level.title && <Typography id={titleId} as="div" variant="subtitle2" className={styles.title}>{resolved.level.title}</Typography>}
    <div key={commands ? "commands" : key} className={styles.level} data-direction={transition} onAnimationEnd={() => setTransition(undefined)}>
      {commands ? <AriaMenu ref={scroll} aria-label={label} className={styles.commands} onAction={id => {
        if (id === backId) back();
        else { const item = commandItems.find(candidate => candidate.id === id); if (item) enter(item); }
      }}>
        {parent && <AriaMenuItem id={backId} textValue={accessibleBack!} aria-label={accessibleBack!} shouldCloseOnSelect={false}
          className={`${styles.item} ${styles.back}`} data-hierarchical-item={parent.id} data-hierarchical-path={key} data-hierarchical-back><span className={styles.arrow} aria-hidden="true"><KeyboardArrowLeftIcon /></span><span className={styles.itemLabel} data-sgui-part="hierarchical-back-label">{parent.label}</span></AriaMenuItem>}
        {resolved.level.sections.map(section => <MenuSection key={section.id} className={styles.section}>
          {section.label && <Header className={styles.sectionTitle}>{section.label}</Header>}{section.items.map(commandItem)}
        </MenuSection>)}
        {!!resolved.level.footerItems?.length && <MenuSection className={styles.footer}>{resolved.level.footerItems.map(commandItem)}</MenuSection>}
      </AriaMenu> : <nav aria-label={label} className={styles.navigation}>
        {parent && <Button variant="text" tone="neutral" aria-label={accessibleBack!} className={`${styles.item} ${styles.back}`}
          {...{ "data-hierarchical-item": parent.id, "data-hierarchical-path": key, "data-hierarchical-back": true }} onPress={back}>
          <span className={styles.arrow} aria-hidden="true"><KeyboardArrowLeftIcon /></span>
          <span className={styles.itemLabel} data-sgui-part="hierarchical-back-label">{parent.label}</span>
        </Button>}
        <div ref={scroll} className={styles.scroll} data-sgui-part="hierarchical-scroll">{navigationLevel(resolved.level, resolved.path, new Set(resolved.levels))}</div>
      </nav>}
    </div>
  </div>;
});
