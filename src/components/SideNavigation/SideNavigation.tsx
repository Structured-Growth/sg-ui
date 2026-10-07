"use client";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FocusEvent } from "react";
import { usePathname, useRouter } from "../../adapters/navigation";
import { useAccountAdapter } from "../../adapters/accounts";
import type { AuthOrganization, StoredAuthSession } from "../../adapters/accounts";
import { usePersistentState } from "../../hooks/usePersistentState";
import { useTranslation } from "../../i18n";
import { Button } from "../../experimental/Button/Button";
import { Link } from "../../experimental/Link/Link";
import { Menu, type MenuItem } from "../../experimental/Menu/Menu";
import { Avatar } from "../../experimental/Avatar/Avatar";
import { AccountCircleIcon, AddIcon, CheckIcon, ChevronRightIcon, ExpandMoreIcon, KeyboardArrowLeftIcon, LogoutIcon } from "../../experimental/icons";
import styles from "./SideNavigation.module.css";

export type SideNavChildBehavior = "expand" | "drilldown";

export type SideNavIcon = React.ReactNode | string;

export type SideNavItem = {
  id: string;
  label: string;
  href?: string;
  icon?: SideNavIcon;
  active?: boolean;
  childBehavior?: SideNavChildBehavior;
  children?: SideNavItem[];
  defaultExpanded?: boolean;
};

export type SideNavSection = {
  id: string;
  title?: string;
  items: SideNavItem[];
};

export type SideNavMenu = {
  id: string;
  sections: SideNavSection[];
  footerSections?: SideNavSection[];
  backLabel?: string;
  backHref?: string;
};

export type SideNavOrganization = {
  id: string;
  name: string;
  role: string;
  billingScopeLabel: string;
};

export type SideNavigationModel = {
  user: {
    initials: string;
    name: string;
    organization: string;
    email?: string;
    organizations?: SideNavOrganization[];
    defaultOrganizationId?: string;
  };
  rootMenu: SideNavMenu;
};

export type SideNavigationProps = {
  model: SideNavigationModel;
  onItemSelect?: (itemId: string) => void;
  onOrganizationChange?: (organizationId: string, accountId?: string) => Promise<void> | void;
  resolveIcon?: (iconKey: string) => React.ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

export const getMenuItems = (menu: SideNavMenu) => [
  ...menu.sections.flatMap((section) => section.items),
  ...(menu.footerSections ?? []).flatMap((section) => section.items),
];

export const pathMatchesHref = (href: string | undefined, pathname: string) => {
  if (!href) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export const descendantsContainPath = (items: SideNavItem[], pathname: string): boolean => {
  for (const item of items) {
    if (pathMatchesHref(item.href, pathname)) {
      return true;
    }

    if (item.children?.length && descendantsContainPath(item.children ?? [], pathname)) {
      return true;
    }
  }

  return false;
};

export const collectExpandedDefaults = (items: SideNavItem[]): string[] => {
  const expanded: string[] = [];

  for (const item of items) {
    const hasChildren = Boolean(item.children?.length);
    const behavior = item.childBehavior ?? "expand";

    if (hasChildren && behavior === "expand" && item.defaultExpanded) {
      expanded.push(item.id);
    }

    if (hasChildren) {
      expanded.push(...collectExpandedDefaults(item.children ?? []));
    }
  }

  return expanded;
};

export const collectExpandedByPath = (items: SideNavItem[], pathname: string): string[] => {
  const expanded: string[] = [];

  for (const item of items) {
    const behavior = item.childBehavior ?? "expand";

    if (item.children?.length) {
      const descendantMatch = descendantsContainPath(item.children ?? [], pathname);

      if (behavior === "expand" && descendantMatch) {
        expanded.push(item.id);
      }

      expanded.push(...collectExpandedByPath(item.children, pathname));
    }
  }

  return expanded;
};

export const findDrilldownPath = (items: SideNavItem[], pathname: string): SideNavItem[] => {
  for (const item of items) {
    if (!item.children?.length) {
      continue;
    }

    const behavior = item.childBehavior ?? "expand";
    const hasDescendantMatch = descendantsContainPath(item.children ?? [], pathname);
    const childPath = findDrilldownPath(item.children, pathname);

    if (behavior === "drilldown" && hasDescendantMatch) {
      return [item, ...childPath];
    }

    if (childPath.length > 0) {
      return childPath;
    }
  }

  return [];
};

export const buildMenuStack = (rootMenu: SideNavMenu, pathname: string): SideNavMenu[] => {
  const drilldownPath = findDrilldownPath(getMenuItems(rootMenu), pathname);
  const stack: SideNavMenu[] = [rootMenu];

  for (const item of drilldownPath) {
    stack.push({
      id: `${item.id}-submenu`,
      backLabel: item.label,
      backHref: item.href,
      sections: [
        {
          id: `${item.id}-section`,
          title: item.label,
          items: item.children ?? [],
        },
      ],
    });
  }

  return stack;
};

type SwitchAccountGroup = {
  accountId: string;
  email: string;
  displayName: string;
  organizations: AuthOrganization[];
};

export const displayNameFromEmail = (email: string) => {
  const [local = ""] = email.split("@");
  return local || email;
};

export const initialsFromIdentity = (name: string, email: string) => {
  const normalizedNameParts = name
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z]/g, ""))
    .filter((part) => part.length > 0);
  if (normalizedNameParts.length >= 2) {
    return `${normalizedNameParts[0][0]}${normalizedNameParts[normalizedNameParts.length - 1][0]}`.toUpperCase();
  }

  const [local = ""] = email.split("@");
  const localParts = local
    .split(/[._-]+/)
    .map((part) => part.replace(/[^a-zA-Z]/g, ""))
    .filter((part) => part.length > 0);
  if (localParts.length >= 2) {
    return `${localParts[0][0]}${localParts[localParts.length - 1][0]}`.toUpperCase();
  }

  const chars = local.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return (chars.slice(0, 2) || "U").padEnd(2, "X");
};

type NavItemsProps = {
  items: SideNavItem[];
  pathname: string;
  depth?: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onDrilldown: (item: SideNavItem) => void;
  onItemSelect?: (itemId: string) => void;
  resolveIcon?: (iconKey: string) => React.ReactNode;
  onNavigate?: (href: string) => void;
};

export const renderItemIcon = (icon: SideNavIcon | undefined, resolveIcon?: (iconKey: string) => React.ReactNode) => {
  if (!icon) {
    return null;
  }

  if (typeof icon === "string") {
    return resolveIcon?.(icon) ?? null;
  }

  return icon;
};

export const findFirstHref = (items: SideNavItem[]): string | undefined => {
  for (const item of items) {
    if (item.href) {
      return item.href;
    }

    if (item.children?.length) {
      const nestedHref = findFirstHref(item.children ?? []);

      if (nestedHref) {
        return nestedHref;
      }
    }
  }

  return undefined;
};

export function NavItems({ items, pathname, depth = 0, expanded, onToggle, onDrilldown, onItemSelect, resolveIcon, onNavigate }: NavItemsProps) {
  return <ul className={styles.list}>
    {items.map(item => {
      const hasChildren = Boolean(item.children?.length);
      const behavior = item.childBehavior ?? "expand";
      const isExpanded = expanded.has(item.id);
      const selected = item.active || pathMatchesHref(item.href, pathname);
      const icon = renderItemIcon(item.icon, resolveIcon);
      const content = <><span aria-hidden="true" className={styles.icon}>{icon}</span><span className={styles.itemLabel}>{item.label}</span>{hasChildren && <span aria-hidden="true" className={styles.icon}>{behavior === "expand" ? <ExpandMoreIcon className={isExpanded ? styles.rotated : undefined} /> : <ChevronRightIcon />}</span>}</>;
      const activate = () => {
        if (hasChildren && behavior === "expand") {
          if (item.href) onNavigate?.(item.href);
          onToggle(item.id);
        } else if (hasChildren && behavior === "drilldown") {
          const href = item.href ?? findFirstHref(item.children ?? []);
          if (href) onNavigate?.(href);
          onDrilldown(item);
        } else onItemSelect?.(item.id);
      };
      return <li key={item.id} data-selected={selected || undefined} style={{ marginInlineStart: depth ? "var(--sgui-space4)" : undefined }}>
        {item.href && !hasChildren ? <Link className={styles.item} href={item.href} tone="inherit" underline="none" aria-current={selected ? "page" : undefined} onClick={event => {
          if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onItemSelect?.(item.id);
        }}>{content}</Link> : <Button className={styles.item} variant="text" tone="neutral" density="compact" aria-expanded={hasChildren && behavior === "expand" ? isExpanded : undefined} onPress={activate}>{content}</Button>}
        {hasChildren && behavior === "expand" && isExpanded && <NavItems items={item.children ?? []} pathname={pathname} depth={depth + 1} expanded={expanded} onToggle={onToggle} onDrilldown={onDrilldown} onItemSelect={onItemSelect} resolveIcon={resolveIcon} onNavigate={onNavigate} />}
      </li>;
    })}
  </ul>;
}

export const SideNavigation = forwardRef<HTMLElement, SideNavigationProps>(function SideNavigation({ model, onItemSelect, onOrganizationChange, resolveIcon, className, style, "aria-label": ariaLabel }, ref) {
  const { getStoredAuthSession, getStoredAuthSessions, markOrganizationSwitched,
    setActiveStoredAuthSession, logoutAccount, logoutAllAccounts, organizationStorageKey, enabled: accountsEnabled } = useAccountAdapter();
  const pathname = usePathname();
  const router = useRouter();
  const { t, useNamespace } = useTranslation();
  useNamespace("navigation");
  const tr = useCallback(
    (key: string, defaultMessage: string) => t(key, { defaultMessage, namespace: "navigation" }),
    [t],
  );
  const [isSessionHydrated, setIsSessionHydrated] = useState(false);
  const [storedSessions, setStoredSessions] = useState<StoredAuthSession[]>([]);
  const [activeStoredAccountId, setActiveStoredAccountId] = useState<string | null>(null);
  const refreshStoredSessions = useCallback(() => {
    const sessions = getStoredAuthSessions();
    const active = getStoredAuthSession();
    setStoredSessions(sessions);
    setActiveStoredAccountId(active?.accountId ?? sessions[0]?.accountId ?? null);
  }, [getStoredAuthSessions, getStoredAuthSession]);

  useEffect(() => {
    refreshStoredSessions();
    setIsSessionHydrated(true);
  }, [refreshStoredSessions]);

  const activeStoredSession = useMemo(() => {
    if (!isSessionHydrated || storedSessions.length === 0) {
      return null;
    }

    if (activeStoredAccountId) {
      return storedSessions.find((session) => session.accountId === activeStoredAccountId) ?? storedSessions[0] ?? null;
    }

    return storedSessions[0] ?? null;
  }, [activeStoredAccountId, isSessionHydrated, storedSessions]);

  const organizations = useMemo<SideNavOrganization[]>(
    () =>
      activeStoredSession?.organizations?.length
        ? activeStoredSession.organizations.map((organization) => ({
            billingScopeLabel: tr("switch.billingScope", "Organization Billing Account"),
            id: organization.id,
            name: organization.name,
            role: tr("switch.role.member", "Member"),
          }))
        : model.user.organizations?.length
          ? model.user.organizations
        : [
            {
              billingScopeLabel: tr("switch.billingScope", "Organization Billing Account"),
              id: model.user.defaultOrganizationId ?? "default-organization",
              name: model.user.organization,
              role: tr("switch.role.member", "Member"),
            },
          ],
    [activeStoredSession, model.user.defaultOrganizationId, model.user.organization, model.user.organizations, tr],
  );
  const [activeOrganizationId, setActiveOrganizationId] = usePersistentState<string>(
    organizationStorageKey ?? "sgui:active-organization",
    activeStoredSession?.activeOrgId ?? model.user.defaultOrganizationId ?? organizations[0]?.id ?? "default-organization",
    { storage: "local" },
  );
  const activeOrganization = useMemo(
    () => organizations.find((organization) => organization.id === activeOrganizationId) ?? organizations[0],
    [activeOrganizationId, organizations],
  );

  useEffect(() => {
    if (!activeStoredSession?.activeOrgId) {
      return;
    }

    if (activeOrganizationId !== activeStoredSession.activeOrgId) {
      setActiveOrganizationId(activeStoredSession.activeOrgId);
    }
  }, [activeStoredSession, setActiveOrganizationId]);

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(collectExpandedDefaults(getMenuItems(model.rootMenu))),
  );
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "back" | null>(null);
  const [menuStackOverride, setMenuStackOverride] = useState<SideNavMenu[] | null>(null);
  const [overridePathname, setOverridePathname] = useState<string | null>(null);
  const [overrideDestination, setOverrideDestination] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const focusAfterTransition = useRef<string | null>(null);
  const revealFrame = useRef<number | null>(null);
  useEffect(() => () => {
    if (revealFrame.current !== null) window.cancelAnimationFrame(revealFrame.current);
  }, []);
  const revealFocusedItem = (event: FocusEvent<HTMLDivElement>) => {
    const scrollport = event.currentTarget;
    const control = event.target;
    if (revealFrame.current !== null) window.cancelAnimationFrame(revealFrame.current);
    // Native focus scrolling may run after focus dispatch. Measure its final result
    // on the next frame, and adjust only our own vertical scrollport.
    revealFrame.current = window.requestAnimationFrame(() => {
      revealFrame.current = null;
      if (!scrollport.isConnected || scrollport.ownerDocument.activeElement !== control) return;
      const port = scrollport.getBoundingClientRect();
      const rect = control.getBoundingClientRect();
      if (!scrollport.clientHeight || !rect.height) return;
      const css = window.getComputedStyle(control);
      const outline = css.outlineStyle === "none" ? 0
        : Math.max(0, (parseFloat(css.outlineWidth) || 0) + (parseFloat(css.outlineOffset) || 0));
      // clientHeight excludes a horizontal scrollbar; clientTop excludes borders.
      const top = port.top + scrollport.clientTop;
      const bottom = top + scrollport.clientHeight;
      const delta = rect.top - outline < top ? rect.top - outline - top
        : rect.bottom + outline > bottom ? rect.bottom + outline - bottom : 0;
      if (delta) scrollport.scrollTop = Math.max(0,
        Math.min(scrollport.scrollHeight - scrollport.clientHeight, scrollport.scrollTop + delta));
    });
  };
  const [isSwitchingOrganization, setIsSwitchingOrganization] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accountOperation = useRef(false);
  const logoutOperation = useRef<object | null>(null);
  const organizationOperation = useRef<object | null>(null);
  useEffect(() => {
    setIsSwitchingOrganization(false);
    setAccountError(null);
    return () => {
      // Invalidate only library-owned results, never the host's pending request.
      if (organizationOperation.current) {
        organizationOperation.current = null;
        accountOperation.current = false;
      }
    };
  }, [onOrganizationChange, accountsEnabled, getStoredAuthSession, getStoredAuthSessions,
    setActiveStoredAuthSession, markOrganizationSwitched, organizationStorageKey]);
  useEffect(() => {
    setIsLoggingOut(false);
    setAccountError(null);
    return () => {
      // Invalidate shell results only. The host still owns its pending request.
      if (logoutOperation.current) {
        logoutOperation.current = null;
        accountOperation.current = false;
      }
    };
  }, [accountsEnabled, logoutAccount, logoutAllAccounts, getStoredAuthSession, getStoredAuthSessions]);

  const derivedMenuStack = useMemo(() => buildMenuStack(model.rootMenu, pathname), [model.rootMenu, pathname]);
  // Keep the explicit hierarchy while the host accepts the requested branch route.
  const overrideMatchesPath = overridePathname === pathname || overrideDestination === pathname;
  const menuStack = overrideMatchesPath && menuStackOverride ? menuStackOverride : derivedMenuStack;
  const effectiveExpanded = useMemo(
    () =>
      new Set([
        ...expanded,

      ]),
    [expanded, model.rootMenu, pathname],
  );

  const currentMenu = menuStack[menuStack.length - 1] ?? model.rootMenu;

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    refreshStoredSessions();
  }, [isUserMenuOpen, refreshStoredSessions]);
  const switchAccountGroups = useMemo<SwitchAccountGroup[]>(
    () => {
      if (storedSessions.length > 0) {
        return storedSessions.map((session) => ({
          accountId: session.accountId,
          displayName: displayNameFromEmail(session.email),
          email: session.email,
          organizations: session.organizations,
        }));
      }

      return [{
        accountId: "default-account",
        displayName: model.user.name,
        email: model.user.email ?? "",
        organizations: organizations.map((organization) => ({
          id: organization.id,
          name: organization.name,
        })),
      }];
    },
    [model.user.email, model.user.name, organizations, storedSessions],
  );

  const displayUserName = activeStoredSession
    ? (model.user.name?.trim() || displayNameFromEmail(activeStoredSession.email))
    : (model.user.name?.trim() || displayNameFromEmail(model.user.email ?? ""));
  const displayUserInitials = activeStoredSession
    ? initialsFromIdentity(displayUserName, activeStoredSession.email)
    : initialsFromIdentity(displayUserName, model.user.email ?? "");
  const hasMultipleAccounts = switchAccountGroups.length > 1;

  const handleToggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleDrilldown = (item: SideNavItem) => {
    const childItems = item.children ?? [];

    focusAfterTransition.current = "first";
    setTransitionDirection("forward");
    setOverridePathname(pathname);
    setOverrideDestination(item.href ?? findFirstHref(childItems) ?? pathname);
    setMenuStackOverride((currentOverride) => {
      const sourceStack =
        overrideMatchesPath && currentOverride ? currentOverride : derivedMenuStack;
      const nextMenu: SideNavMenu = {
        id: `${item.id}-submenu`,
        backLabel: item.label,
        backHref: item.href,
        sections: [
          {
            id: `${item.id}-section`,
            title: item.label,
            items: childItems,
          },
        ],
      };

      return [...sourceStack, nextMenu];
    });
  };

  const handleBack = () => {
    if (menuStack.length <= 1) {
      return;
    }

    const parentHref = menuStack[menuStack.length - 1]?.backHref;

    focusAfterTransition.current = currentMenu.backLabel ?? "first";
    setTransitionDirection("back");
    setOverridePathname(pathname);
    setOverrideDestination(parentHref && !pathMatchesHref(parentHref, pathname) ? parentHref : pathname);
    setMenuStackOverride(menuStack.slice(0, -1));

    if (parentHref && !pathMatchesHref(parentHref, pathname)) {
      router.push(parentHref);
    }
  };

  const handleUserMenuClose = () => {
    setIsUserMenuOpen(false);
  };

  const handleOpenAddAccount = () => {
    if (!accountsEnabled) return;
    handleUserMenuClose();
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  };

  const handleLogoutAccount = async (accountId: string) => {
    if (!accountsEnabled || accountOperation.current) {
      return;
    }

    accountOperation.current = true;
    setAccountError(null);
    setIsLoggingOut(true);
    const operation = {};
    logoutOperation.current = operation;
    const wasActiveAccount = activeStoredSession?.accountId === accountId;
    try {
      await logoutAccount(accountId);
      if (logoutOperation.current !== operation) return;
      refreshStoredSessions();
      handleUserMenuClose();
      const remainingSessions = getStoredAuthSessions();
      if (remainingSessions.length === 0) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (wasActiveAccount) {
        const shouldSkipOrganizationSelection = (
          remainingSessions.length === 1
          && (remainingSessions[0]?.organizations.length ?? 0) === 1
        );
        if (shouldSkipOrganizationSelection) {
          router.push(pathname);
          return;
        }

        router.push(`/login/select-organization?next=${encodeURIComponent(pathname)}`);
      }
    } catch {
      if (logoutOperation.current === operation) {
        setAccountError(tr("user.logoutFailed", "Unable to log out. Try again."));
      }
    } finally {
      if (logoutOperation.current === operation) {
        logoutOperation.current = null;
        accountOperation.current = false;
        setIsLoggingOut(false);
      }
    }
  };

  const handleLogoutAll = async () => {
    if (!accountsEnabled || accountOperation.current) {
      return;
    }

    setIsLoggingOut(true);
    accountOperation.current = true;
    setAccountError(null);
    const operation = {};
    logoutOperation.current = operation;
    try {
      await logoutAllAccounts();
      if (logoutOperation.current !== operation) return;
      refreshStoredSessions();
      handleUserMenuClose();
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    } catch {
      if (logoutOperation.current === operation) {
        setAccountError(tr("user.logoutFailed", "Unable to log out. Try again."));
      }
    } finally {
      if (logoutOperation.current === operation) {
        logoutOperation.current = null;
        accountOperation.current = false;
        setIsLoggingOut(false);
      }
    }
  };

  const handleOrganizationSelect = async (accountId: string, organizationId: string) => {
    if (accountOperation.current) {
      return;
    }
    setAccountError(null);

    const targetAccountId = accountId === "default-account" ? undefined : accountId;
    const isSameAccount = activeStoredSession?.accountId
      ? activeStoredSession.accountId === accountId
      : targetAccountId === undefined;
    if (isSameAccount && activeOrganizationId === organizationId) {
      handleUserMenuClose();
      return;
    }

    accountOperation.current = true;
    setIsSwitchingOrganization(true);
    const operation = {};
    organizationOperation.current = operation;
    try {
      await onOrganizationChange?.(organizationId, targetAccountId);
      if (organizationOperation.current !== operation) return;
      if (targetAccountId) {
        setActiveStoredAuthSession(targetAccountId);
        setActiveStoredAccountId(targetAccountId);
      }
      setActiveOrganizationId(organizationId);
      markOrganizationSwitched();
      refreshStoredSessions();
      handleUserMenuClose();
      // The host owns refresh/navigation after an organization switch.
    } catch {
      if (organizationOperation.current === operation) {
        setAccountError(tr("switch.failed", "Unable to switch organization. Try again."));
      }
    } finally {
      if (organizationOperation.current === operation) {
        organizationOperation.current = null;
        accountOperation.current = false;
        setIsSwitchingOrganization(false);
      }
    }
  };

  const menuKey = menuStack.map(menu => menu.id).join("/");
  useEffect(() => {
    setExpanded(current => new Set([...current, ...collectExpandedByPath(getMenuItems(model.rootMenu), pathname)]));
  }, [model.rootMenu, pathname]);
  useEffect(() => {
    const target = focusAfterTransition.current;
    if (!target) return;
    focusAfterTransition.current = null;
    const controls = [...(menuContentRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [])];
    (controls.find(control => control.textContent?.trim() === target) ?? controls[0])?.focus();
  }, [menuKey]);
  const menuActions = new Map<string, () => void>();
  const accountItems: MenuItem[] = [];
  const addAction = (item: MenuItem, action: () => void) => { accountItems.push(item); menuActions.set(item.id, action); };
  addAction({ id: "profile", label: tr("user.manageProfile", "Manage Profile"), icon: <AccountCircleIcon /> }, () => router.push("/account"));
  for (const [accountIndex, group] of switchAccountGroups.entries()) {
    for (const [organizationIndex, organization] of group.organizations.entries()) {
      const active = (activeStoredSession?.accountId === group.accountId || !activeStoredSession) && activeOrganizationId === organization.id;
      addAction({ id: `organization-${accountIndex}-${organizationIndex}`, label: hasMultipleAccounts ? `${organization.name} (${group.email || group.displayName})` : organization.name, disabled: isSwitchingOrganization || isLoggingOut, icon: active ? <CheckIcon /> : undefined }, () => void handleOrganizationSelect(group.accountId, organization.id));
    }
  }
  addAction({ id: "add", label: tr("user.addAccount", "Add account"), icon: <AddIcon />, disabled: !accountsEnabled || isSwitchingOrganization || isLoggingOut }, handleOpenAddAccount);
  for (const [index, group] of switchAccountGroups.entries()) {
    addAction({ id: `logout-${index}`, label: hasMultipleAccounts ? `${tr("user.logout", "Logout")} (${group.email || group.displayName})` : tr("user.logout", "Logout"), icon: <LogoutIcon />, disabled: !accountsEnabled || isLoggingOut || isSwitchingOrganization }, () => void handleLogoutAccount(group.accountId));
  }
  if (hasMultipleAccounts) addAction({ id: "logout-all", label: tr("user.logoutAllAccounts", "Log out of all accounts"), disabled: !accountsEnabled || isLoggingOut || isSwitchingOrganization }, () => void handleLogoutAll());
  const renderSections = (sections: SideNavSection[]) => sections.map(section => <section key={section.id} className={styles.section} aria-label={section.title}>
    {section.title && <h2 className={styles.sectionTitle}>{section.title}</h2>}
    <NavItems items={section.items} pathname={pathname} expanded={effectiveExpanded} onToggle={handleToggle} onDrilldown={handleDrilldown} onItemSelect={onItemSelect} resolveIcon={resolveIcon} onNavigate={router.push} />
  </section>);
  return <nav ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} style={style} aria-label={ariaLabel ?? tr("landmark", "Main navigation")} data-collapsed={collapsed || undefined} data-sgui-part="side-navigation">
    {!collapsed && <>
      <Menu label={tr("user.menu", "Account and organization")} density="compact" errorMessage={accountError ?? undefined} open={isUserMenuOpen} onOpenChange={open => { if (open || !accountOperation.current) setIsUserMenuOpen(open); }} items={accountItems} onAction={id => menuActions.get(id)?.()} trigger={<Button variant="text" tone="neutral" className={styles.userTrigger}>
        <Avatar alt="" fallback={displayUserInitials} /><span className={styles.identity}><span>{displayUserName}</span><span className={styles.organization}>{activeOrganization?.name}</span></span><ExpandMoreIcon />
      </Button>} />
      {accountError && !isUserMenuOpen && <p role="alert" className={styles.error}>{accountError}</p>}
      <div ref={menuContentRef} className={styles.menuContent} data-direction={transitionDirection ?? undefined} onAnimationEnd={() => setTransitionDirection(null)}>
        {currentMenu.backLabel && <Button variant="text" tone="neutral" startIcon={<KeyboardArrowLeftIcon />} className={styles.back} onPress={handleBack}>{currentMenu.backLabel}</Button>}
        <div className={styles.scroll} data-sgui-part="side-navigation-scroll" onFocusCapture={revealFocusedItem}>{renderSections(currentMenu.sections)}{currentMenu.footerSections?.length ? <div className={styles.footer}>{renderSections(currentMenu.footerSections)}</div> : null}</div>
      </div>
    </>}
    <Button variant="text" tone="neutral" className={styles.collapse} aria-label={collapsed ? tr("expand", "Expand navigation") : tr("collapse", "Collapse navigation")} aria-expanded={!collapsed} onPress={() => setCollapsed(value => !value)}>{collapsed ? <ChevronRightIcon /> : <KeyboardArrowLeftIcon />}</Button>
  </nav>;
});
