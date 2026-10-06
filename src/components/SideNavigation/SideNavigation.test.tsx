import { beforeEach, describe, expect, it, vi } from "vitest";
import { SideNavigation } from "./SideNavigation";

const push = vi.fn();
const logoutAccountMock = vi.hoisted(() => vi.fn());
const logoutAllAccountsMock = vi.hoisted(() => vi.fn());
const storedSessionsControl = vi.hoisted(() => ({
  activeAccountId: "acct-1",
  sessions: [{
    accountId: "acct-1",
    email: "harry@example.com",
    activeOrgId: "org-1",
    organizations: [{ id: "org-1", name: "Hogwarts" }],
  }] as Array<{
    accountId: string;
    email: string;
    activeOrgId: string;
    organizations: Array<{ id: string; name: string }>;
  }>,
}));
let stateCallIndex = 0;
const stateOverrides = new Map<number, unknown>();
const stateSetters = new Map<number, ReturnType<typeof vi.fn>>();

type TreeNode = {
  key?: string;
  type?: unknown;
  props?: {
    children?: unknown;
    onClick?: (event?: unknown) => unknown;
  };
};

const findNodes = (node: unknown, predicate: (candidate: TreeNode) => boolean, found: TreeNode[] = []) => {
  if (!node || typeof node !== "object") {
    return found;
  }
  const candidate = node as TreeNode;
  if (predicate(candidate)) {
    found.push(candidate);
  }
  if (typeof candidate.type === "function" && candidate.type.name === "NavItems") {
    findNodes(candidate.type(candidate.props), predicate, found);
  }
  const children = candidate.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child) => findNodes(child, predicate, found));
  } else {
    findNodes(children, predicate, found);
  }
  return found;
};

const renderSideNavigation = (
  overrides?: Record<number, unknown>,
  modelOverride?: Parameters<typeof SideNavigation>[0]["model"],
  propsOverride?: Partial<Parameters<typeof SideNavigation>[0]>,
) => {
  stateCallIndex = 0;
  stateOverrides.clear();
  stateSetters.clear();
  Object.entries(overrides ?? {}).forEach(([index, value]) => {
    stateOverrides.set(Number(index), value);
  });

  const defaultModel = {
    user: {
      initials: "HP",
      name: "Harry Potter",
      organization: "Hogwarts",
      defaultOrganizationId: "org-1",
    },
    rootMenu: {
      id: "root",
      sections: [
        {
          id: "sections",
          title: "Sections",
          items: [{ id: "my-sections", label: "My Sections", href: "/sections/instructor" }],
        },
      ],
    },
  } satisfies Parameters<typeof SideNavigation>[0]["model"];

  return SideNavigation({ model: modelOverride ?? defaultModel, ...propsOverride }) as unknown;
};

const flushMicrotasks = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useCallback: <T,>(fn: T) => fn,
    useEffect: (effect: () => void | (() => void)) => {
      effect();
    },
    useMemo: <T,>(factory: () => T) => factory(),
    useState: <T,>(initial: T | (() => T)) => {
      const setter = vi.fn();
      const value = (stateOverrides.has(stateCallIndex)
        ? stateOverrides.get(stateCallIndex)
        : typeof initial === "function"
          ? (initial as () => T)()
          : initial) as T;
      stateSetters.set(stateCallIndex, setter);
      stateCallIndex += 1;
      return [value, setter] as const;
    },
  };
});

vi.mock("../../adapters/navigation", () => ({
  usePathname: () => "/sections/instructor",
  useRouter: () => ({ push }),
}));

vi.mock("../../hooks/usePersistentState", () => ({
  usePersistentState: () => ["org-1", vi.fn()],
}));

vi.mock("../../i18n", () => ({
  useTranslation: () => ({
    t: (_key: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage,
    useNamespace: () => undefined,
  }),
}));

vi.mock("../../adapters/accounts", () => ({
  useAccountAdapter: () => ({
    getStoredAuthSessions: () => storedSessionsControl.sessions,
    getStoredAuthSession: () => storedSessionsControl.sessions.find((session) => session.accountId === storedSessionsControl.activeAccountId) ?? storedSessionsControl.sessions[0] ?? null,
    markOrganizationSwitched: vi.fn(), setActiveStoredAuthSession: vi.fn(),
    logoutAccount: logoutAccountMock, logoutAllAccounts: logoutAllAccountsMock,
    enabled: true,
  }),
}));

describe("SideNavigation", () => {
  beforeEach(() => {
    storedSessionsControl.sessions = [{
      accountId: "acct-1",
      email: "harry@example.com",
      activeOrgId: "org-1",
      organizations: [{ id: "org-1", name: "Hogwarts" }],
    }];
    storedSessionsControl.activeAccountId = "acct-1";
    push.mockReset();
    logoutAccountMock.mockReset();
    logoutAllAccountsMock.mockReset();
    logoutAccountMock.mockImplementation(async (accountId: string) => {
      storedSessionsControl.sessions = storedSessionsControl.sessions.filter((session) => session.accountId !== accountId);
      if (storedSessionsControl.activeAccountId === accountId) {
        storedSessionsControl.activeAccountId = storedSessionsControl.sessions[0]?.accountId ?? "";
      }
    });
    logoutAllAccountsMock.mockResolvedValue(undefined);
  });

  it("routes to account from the user menu", () => {
    const element = renderSideNavigation();
    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");

    const manageProfile = clickables.find((node) => `${node?.props?.children}`.includes("Manage Profile"));
    manageProfile?.props?.onClick();
    expect(push).toHaveBeenCalledWith("/account");
  });

  it("logs out single account to login selection flow", async () => {
    const element = renderSideNavigation({
      0: true,
      1: [{
        accountId: "acct-1",
        email: "harry@example.com",
        activeOrgId: "org-1",
        organizations: [{ id: "org-1", name: "Hogwarts" }],
      }],
      2: "acct-1",
    });
    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");

    const logout = clickables.find((node) => `${node?.props?.children}`.includes("Logout"));
    logout?.props?.onClick();
    await flushMicrotasks();
    expect(logoutAccountMock).toHaveBeenCalledWith("acct-1");
    expect(push).toHaveBeenCalledWith("/login?next=%2Fsections%2Finstructor");
  });

  it("routes add-account to login with current path as next", () => {
    const element = renderSideNavigation();
    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");
    const addAccount = clickables.find((node) => `${node?.props?.children}`.includes("Add account"));

    addAccount?.props?.onClick();
    expect(push).toHaveBeenCalledWith("/login?next=%2Fsections%2Finstructor");
  });

  it("opens separate logout flyout for multiple accounts", async () => {
    const element = renderSideNavigation({
      0: true,
      1: [
        {
          accountId: "acct-1",
          email: "harry@example.com",
          activeOrgId: "org-1",
          organizations: [{ id: "org-1", name: "Hogwarts" }],
        },
        {
          accountId: "acct-2",
          email: "tom@example.com",
          activeOrgId: "org-2",
          organizations: [{ id: "org-2", name: "Org Two" }],
        },
      ],
      2: "acct-2",
    });
    const clickables = findNodes(element, (candidate) => typeof candidate?.props?.onClick === "function");

    const logout = clickables.find((node) => `${node?.props?.children}`.includes("Logout"));
    logout?.props?.onClick({ currentTarget: { nodeName: "DIV" } });
    await flushMicrotasks();
    expect(stateSetters.get(8)).toHaveBeenCalled();
    expect(logoutAccountMock).not.toHaveBeenCalled();
    expect(logoutAllAccountsMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});
