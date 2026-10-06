"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "../../adapters/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAccountAdapter } from "../../adapters/accounts";
import { usePersistentState } from "../../hooks/usePersistentState";

import { useTranslation } from "../../i18n";
import type { AuthOrganization, StoredAuthSession } from "../../adapters/accounts";

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
};

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

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

export function NavItems({
  items,
  pathname,
  depth = 0,
  expanded,
  onToggle,
  onDrilldown,
  onItemSelect,
  resolveIcon,
  onNavigate,
}: NavItemsProps) {
  return (
    <List dense disablePadding>
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const behavior = item.childBehavior ?? "expand";
        const isExpanded = expanded.has(item.id);
        const icon = renderItemIcon(item.icon, resolveIcon);
        const isSelected = item.active || pathMatchesHref(item.href, pathname);

        return (
          <Box key={item.id}>
            <ListItemButton
              dense
              onClick={() => {
                if (hasChildren && behavior === "expand") {
                  if (item.href) {
                    onNavigate?.(item.href);
                  }
                  onToggle(item.id);
                  return;
                }

                if (hasChildren && behavior === "drilldown") {
                  const drilldownHref = item.href ?? findFirstHref(item.children ?? []);

                  if (drilldownHref) {
                    onNavigate?.(drilldownHref);
                  }
                  onDrilldown(item);
                  return;
                }

                if (item.href) {
                  onNavigate?.(item.href);
                }

                onItemSelect?.(item.id);
              }}
              selected={isSelected}
              sx={{
                borderRadius: 1,
                ml: depth > 0 ? depth * 2 : 0,
                px: 1.5,
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                },
              }}
            >
              {icon ? <ListItemIcon sx={{ color: "text.secondary", minWidth: 28 }}>{icon}</ListItemIcon> : null}
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 400 }} />
              {hasChildren && behavior === "expand" ? (
                isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />
              ) : null}
              {hasChildren && behavior === "drilldown" ? <ChevronRightIcon fontSize="small" /> : null}
            </ListItemButton>
            {hasChildren && behavior === "expand" ? (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <NavItems
                  items={item.children ?? []}
                  pathname={pathname}
                  depth={depth + 1}
                  expanded={expanded}
                  onToggle={onToggle}
                  onDrilldown={onDrilldown}
                  onItemSelect={onItemSelect}
                  resolveIcon={resolveIcon}
                  onNavigate={onNavigate}
                />
              </Collapse>
            ) : null}
          </Box>
        );
      })}
    </List>
  );
}

/* c8 ignore start */
export function SideNavigation({ model, onItemSelect, onOrganizationChange, resolveIcon }: SideNavigationProps) {
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
  const refreshStoredSessions = () => {
    const sessions = getStoredAuthSessions();
    const active = getStoredAuthSession();
    setStoredSessions(sessions);
    setActiveStoredAccountId(active?.accountId ?? sessions[0]?.accountId ?? null);
  };

  useEffect(() => {
    refreshStoredSessions();
    setIsSessionHydrated(true);
  }, []);

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
            billingScopeLabel: "Organization Billing Account",
            id: organization.id,
            name: organization.name,
            role: tr("switch.role.member", "Member"),
          }))
        : model.user.organizations?.length
          ? model.user.organizations
        : [
            {
              billingScopeLabel: "Organization Billing Account",
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
  }, [activeOrganizationId, activeStoredSession, setActiveOrganizationId]);

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(collectExpandedDefaults(getMenuItems(model.rootMenu))),
  );
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "back" | null>(null);
  const [menuStackOverride, setMenuStackOverride] = useState<SideNavMenu[] | null>(null);
  const [overridePathname, setOverridePathname] = useState<string | null>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [logoutMenuAnchorEl, setLogoutMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [pendingSelection, setPendingSelection] = useState<{ accountId: string; organizationId: string } | null>(null);
  const [isSwitchingOrganization, setIsSwitchingOrganization] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const derivedMenuStack = useMemo(() => buildMenuStack(model.rootMenu, pathname), [model.rootMenu, pathname]);
  const menuStack = overridePathname === pathname && menuStackOverride ? menuStackOverride : derivedMenuStack;
  const effectiveExpanded = useMemo(
    () =>
      new Set([
        ...expanded,
        ...collectExpandedDefaults(getMenuItems(model.rootMenu)),
        ...collectExpandedByPath(getMenuItems(model.rootMenu), pathname),
      ]),
    [expanded, model.rootMenu, pathname],
  );

  const currentMenu = menuStack[menuStack.length - 1] ?? model.rootMenu;
  const isUserMenuOpen = Boolean(userMenuAnchorEl);
  const isLogoutMenuOpen = Boolean(logoutMenuAnchorEl);
  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    refreshStoredSessions();
  }, [isUserMenuOpen]);
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

    setTransitionDirection("forward");
    setOverridePathname(pathname);
    setMenuStackOverride((currentOverride) => {
      const sourceStack =
        overridePathname === pathname && currentOverride ? currentOverride : derivedMenuStack;
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

    setTransitionDirection("back");
    setOverridePathname(pathname);
    setMenuStackOverride(menuStack.slice(0, -1));

    if (parentHref && !pathMatchesHref(parentHref, pathname)) {
      router.push(parentHref);
    }
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
    setLogoutMenuAnchorEl(null);
  };

  const handleOpenAddAccount = () => {
    if (!accountsEnabled) return;
    handleUserMenuClose();
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  };

  const handleLogoutAccount = async (accountId: string) => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    const wasActiveAccount = activeStoredSession?.accountId === accountId;
    try {
      await logoutAccount(accountId);
    } finally {
      refreshStoredSessions();
      setIsLoggingOut(false);
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
    }
  };

  const handleLogoutAll = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutAllAccounts();
    } finally {
      refreshStoredSessions();
      setIsLoggingOut(false);
      handleUserMenuClose();
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  };

  const handleOrganizationSelect = async (accountId: string, organizationId: string) => {
    if (isSwitchingOrganization) {
      return;
    }
    setPendingSelection({ accountId, organizationId });

    const targetAccountId = accountId === "default-account" ? undefined : accountId;
    const isSameAccount = activeStoredSession?.accountId
      ? activeStoredSession.accountId === accountId
      : targetAccountId === undefined;
    if (isSameAccount && activeOrganizationId === organizationId) {
      handleUserMenuClose();
      return;
    }

    setIsSwitchingOrganization(true);
    try {
      await onOrganizationChange?.(organizationId, targetAccountId);
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
      // Keep navigation stable if switching fails.
    } finally {
      setIsSwitchingOrganization(false);
    }
  };

  return (
    <Paper
      square
      elevation={0}
      sx={{
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: 280,
      }}
    >
      <Box
        onClick={(event) => {
          setUserMenuAnchorEl(event.currentTarget);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setUserMenuAnchorEl(event.currentTarget as HTMLElement);
          }
        }}
        role="button"
        sx={{
          alignItems: "center",
          cursor: "pointer",
          display: "flex",
          gap: 1.5,
          px: 2,
          py: 2,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        tabIndex={0}
      >
        <Avatar sx={{ bgcolor: "grey.400", color: "common.white", height: 42, width: 42 }}>{displayUserInitials}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap fontSize={16} fontWeight={500}>
            {displayUserName}
          </Typography>
          <Typography color="text.secondary" noWrap fontSize={14}>
            {activeOrganization.name}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon sx={{ color: "text.secondary", ml: "auto" }} />
      </Box>

      <Menu
        anchorEl={userMenuAnchorEl}
        MenuListProps={{ dense: true }}
        onClose={handleUserMenuClose}
        open={isUserMenuOpen}
        PaperProps={{ sx: { minWidth: 260 } }}
      >
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            router.push("/account");
          }}
          sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
        >
          <ListItemIcon sx={{ minWidth: 30 }}>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          {tr("user.manageProfile", "Manage Profile")}
        </MenuItem>
        <Divider />
        {switchAccountGroups.flatMap((accountGroup) => {
          const organizationItems = accountGroup.organizations.map((organization) => {
            const isActive = (
              activeStoredSession?.accountId === accountGroup.accountId
              && activeOrganizationId === organization.id
            ) || (
              pendingSelection?.accountId === accountGroup.accountId
              && pendingSelection.organizationId === organization.id
            );
            return (
              <MenuItem
                key={`${accountGroup.accountId}-${organization.id}`}
                disabled={isSwitchingOrganization}
                onClick={() => void handleOrganizationSelect(accountGroup.accountId, organization.id)}
                sx={{ fontSize: 13, minHeight: 30, px: 0.5 }}
              >
                <ListItemIcon sx={{ justifyContent: "center", minWidth: 18, mr: 0.75 }}>
                  {isActive ? <CheckIcon fontSize="small" /> : null}
                </ListItemIcon>
                {organization.name}
              </MenuItem>
            );
          });

          return [
            <Box key={`${accountGroup.accountId}-label`} sx={{ px: 1.25, pt: 0.5 }}>
              <Typography color="text.secondary" variant="caption">
                {accountGroup.email || accountGroup.displayName}
              </Typography>
            </Box>,
            ...organizationItems,
          ];
        })}
        <Divider />
        <MenuItem
          disabled={isSwitchingOrganization}
          onClick={handleOpenAddAccount}
          sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
        >
          <ListItemIcon sx={{ minWidth: 30 }}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          {tr("user.addAccount", "Add account")}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={(event) => {
            if (hasMultipleAccounts) {
              setLogoutMenuAnchorEl(event.currentTarget);
              return;
            }
            const onlyAccountId = getStoredAuthSession()?.accountId ?? switchAccountGroups[0]?.accountId;
            if (onlyAccountId) {
              void handleLogoutAccount(onlyAccountId);
            }
          }}
          sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
        >
          <ListItemIcon sx={{ minWidth: 30 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {tr("user.logout", "Logout")}
          {hasMultipleAccounts ? <ChevronRightIcon fontSize="small" sx={{ ml: "auto" }} /> : null}
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={logoutMenuAnchorEl}
        MenuListProps={{ dense: true }}
        onClose={() => setLogoutMenuAnchorEl(null)}
        open={isLogoutMenuOpen}
        PaperProps={{ sx: { minWidth: 260 } }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        {switchAccountGroups.map((group) => (
          <MenuItem
            key={`logout-${group.accountId}`}
            disabled={isLoggingOut || !accountsEnabled}
            onClick={() => void handleLogoutAccount(group.accountId)}
            sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
          >
            {group.email}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          disabled={isLoggingOut || !accountsEnabled}
          onClick={() => void handleLogoutAll()}
          sx={{ fontSize: 13, minHeight: 30, px: 1.25 }}
        >
          {tr("user.logoutAllAccounts", "Log out of all accounts")}
        </MenuItem>
      </Menu>

      {currentMenu.backLabel ? (
        <>
          <Divider />
          <List dense disablePadding sx={{ px: 1, py: 1 }}>
            <ListItemButton dense onClick={handleBack} sx={{ borderRadius: 1, px: 1.5 }}>
              <ListItemIcon sx={{ color: "text.secondary", minWidth: 28 }}>
                <KeyboardArrowLeftIcon />
              </ListItemIcon>
              <ListItemText primary={currentMenu.backLabel} />
            </ListItemButton>
          </List>
        </>
      ) : null}

      <Divider />

      <Box
        key={menuStack.map((menu) => menu.id).join("/")}
        onAnimationEnd={() => {
          setTransitionDirection(null);
        }}
        sx={{
          animation:
            transitionDirection === null
              ? "none"
              : `${transitionDirection === "forward" ? slideInFromRight : slideInFromLeft} 180ms ease-out`,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1.5 }}>
          {currentMenu.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 2.5 }}>
              {section.title ? (
                <Typography color="text.secondary" fontSize={14} sx={{ mb: 1, px: 0.5 }}>
                  {section.title}
                </Typography>
              ) : null}
              <NavItems
                items={section.items}
                pathname={pathname}
                expanded={effectiveExpanded}
                onToggle={handleToggle}
                onDrilldown={handleDrilldown}
                onItemSelect={onItemSelect}
                resolveIcon={resolveIcon}
                onNavigate={router.push}
              />
            </Box>
          ))}
        </Box>

        {currentMenu.footerSections?.length ? (
          <>
            <Divider />
            <Box sx={{ px: 1.5, py: 1.5 }}>
              {currentMenu.footerSections.map((section, index) => (
                <Box key={section.id}>
                  {index > 0 ? <Divider sx={{ mb: 1.5 }} /> : null}
                  <Box sx={{ mb: 1.5 }}>
                    {section.title ? (
                      <Typography color="text.secondary" fontSize={14} sx={{ mb: 1, px: 0.5 }}>
                        {section.title}
                      </Typography>
                    ) : null}
                    <NavItems
                      items={section.items}
                      pathname={pathname}
                      expanded={effectiveExpanded}
                      onToggle={handleToggle}
                      onDrilldown={handleDrilldown}
                      onItemSelect={onItemSelect}
                      resolveIcon={resolveIcon}
                      onNavigate={router.push}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        ) : null}
      </Box>

      <Box sx={{ alignItems: "center", borderTop: 1, borderColor: "divider", display: "flex", minHeight: 40, px: 2 }}>
        <ChevronRightIcon sx={{ color: "text.disabled", ml: "auto" }} />
      </Box>
    </Paper>
  );
}
/* c8 ignore end */
