import { beforeAll, describe, expect, it, vi } from "vitest";
import type { SideNavItem, SideNavMenu } from "./SideNavigation";

vi.mock("../../hooks/usePersistentState", () => ({
  usePersistentState: () => ["org-1", vi.fn()],
}));
vi.mock("../../adapters/accounts", () => ({ ACTIVE_ORGANIZATION_STORAGE_KEY: "lp:active-org" }));
vi.mock("../../i18n", () => ({
  useTranslation: () => ({ t: (_k: string, { defaultMessage }: { defaultMessage: string }) => defaultMessage, useNamespace: () => undefined }),
}));
vi.mock("../../adapters/accounts", () => ({
  getStoredAuthSession: () => null,
  getStoredAuthSessions: () => [],
  markOrganizationSwitched: vi.fn(),
  setActiveStoredAuthSession: vi.fn(),
}));
vi.mock("../../adapters/accounts", () => ({ acceptLegalDocuments: vi.fn(), login: vi.fn() }));

let helpers: Awaited<typeof import("./SideNavigation")>;

const findNodes = (node: any, predicate: (candidate: any) => boolean, found: any[] = []) => {
  if (!node || typeof node !== "object") {
    return found;
  }
  if (predicate(node)) {
    found.push(node);
  }
  const children = node?.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child) => findNodes(child, predicate, found));
  } else {
    findNodes(children, predicate, found);
  }
  return found;
};

const collectText = (node: any, values: string[] = []) => {
  if (typeof node === "string") {
    values.push(node);
    return values;
  }
  if (!node || typeof node !== "object") {
    return values;
  }
  const children = node?.props?.children;
  const primary = node?.props?.primary;
  if (primary !== undefined) {
    collectText(primary, values);
  }
  if (Array.isArray(children)) {
    children.forEach((child) => collectText(child, values));
  } else {
    collectText(children, values);
  }
  return values;
};

const sampleItems: SideNavItem[] = [
  {
    id: "classes",
    label: "Classes",
    href: "/sections",
    childBehavior: "expand",
    defaultExpanded: true,
    children: [
      { id: "instructor", label: "Instructor", href: "/sections/instructor" },
      {
        id: "learner-nested",
        label: "Learner Nested",
        childBehavior: "drilldown",
        children: [
          { id: "learner-classes", label: "Learner Classes", href: "/sections/learner" },
        ],
      },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    childBehavior: "drilldown",
    children: [
      { id: "groups", label: "Groups", href: "/admin/groups" },
    ],
  },
];

describe("SideNavigation helpers", () => {
  beforeAll(async () => {
    helpers = await import("./SideNavigation");
  });

  it("matches hrefs and nested paths", () => {
    expect(helpers.pathMatchesHref(undefined, "/sections")).toBe(false);
    expect(helpers.pathMatchesHref("/", "/")).toBe(true);
    expect(helpers.pathMatchesHref("/", "/sections")).toBe(false);
    expect(helpers.pathMatchesHref("/sections", "/sections")).toBe(true);
    expect(helpers.pathMatchesHref("/sections", "/sections/instructor")).toBe(true);
    expect(helpers.pathMatchesHref("/sections", "/sections-archive")).toBe(false);
  });

  it("collects descendants and expanded states", () => {
    expect(helpers.descendantsContainPath(sampleItems, "/sections/instructor")).toBe(true);
    expect(helpers.descendantsContainPath(sampleItems, "/unknown")).toBe(false);
    expect(helpers.collectExpandedDefaults(sampleItems)).toContain("classes");
    expect(helpers.collectExpandedByPath(sampleItems, "/sections/instructor")).toContain("classes");
    expect(helpers.collectExpandedByPath(sampleItems, "/admin/groups")).not.toContain("admin");
  });

  it("finds drilldown path and first href", () => {
    const drilldownPath = helpers.findDrilldownPath(sampleItems, "/admin/groups");
    expect(drilldownPath.map((item) => item.id)).toEqual(["admin"]);
    expect(helpers.findFirstHref(sampleItems)).toBe("/sections");
    expect(helpers.findFirstHref([{ id: "x", label: "X" }])).toBeUndefined();
    expect(helpers.findDrilldownPath(sampleItems, "/does/not/exist")).toEqual([]);
  });

  it("builds menu stack from root and drilldown sections", () => {
    const rootMenu: SideNavMenu = {
      id: "root",
      sections: [{ id: "main", items: sampleItems }],
      footerSections: [{ id: "footer", items: [{ id: "help", label: "Help", href: "/help" }] }],
    };
    const flatItems = helpers.getMenuItems(rootMenu);
    expect(flatItems.map((item) => item.id)).toContain("help");

    const stack = helpers.buildMenuStack(rootMenu, "/admin/groups");
    expect(stack).toHaveLength(2);
    expect(stack[1]?.backLabel).toBe("Admin");
    expect(stack[1]?.sections[0]?.items[0]?.id).toBe("groups");
    expect(helpers.buildMenuStack(rootMenu, "/not-found")).toHaveLength(1);
  });

  it("maps email display helpers", () => {
    expect(helpers.displayNameFromEmail("harry@hogwarts.edu")).toBe("harry");
    expect(helpers.displayNameFromEmail("harry")).toBe("harry");
    expect(helpers.displayNameFromEmail("@hogwarts.edu")).toBe("@hogwarts.edu");
    expect(helpers.initialsFromIdentity("Harry Potter", "harry@hogwarts.edu")).toBe("HP");
    expect(helpers.initialsFromIdentity("", "john.smith@example.com")).toBe("JS");
    expect(helpers.initialsFromIdentity("", "1@x.com")).toBe("UX");
    expect(helpers.initialsFromIdentity("", "@x.com")).toBe("UX");
    expect(helpers.initialsFromIdentity("", { split: () => [] } as unknown as string)).toBe("UX");
  });

  it("resolves icons and nested href traversal", () => {
    const iconResolver = vi.fn((key: string) => `icon:${key}`);
    expect(helpers.renderItemIcon(undefined, iconResolver)).toBeNull();
    expect(helpers.renderItemIcon("book", iconResolver)).toBe("icon:book");
    expect(iconResolver).toHaveBeenCalledWith("book");
    expect(helpers.renderItemIcon("book")).toBeNull();
    const iconNode = { type: "span", props: { children: "x" } };
    expect(helpers.renderItemIcon(iconNode)).toBe(iconNode);

    const noHrefTopLevel: SideNavItem[] = [
      {
        id: "parent",
        label: "Parent",
        children: [{ id: "child", label: "Child", href: "/child" }],
      },
    ];
    expect(helpers.findFirstHref(noHrefTopLevel)).toBe("/child");
  });

  it("covers nav item click paths for expand, drilldown, and leaf items", () => {
    const onToggle = vi.fn();
    const onDrilldown = vi.fn();
    const onItemSelect = vi.fn();
    const onNavigate = vi.fn();

    const tree = helpers.NavItems({
      items: [
        {
          id: "expand",
          label: "Expand",
          href: "/expand",
          childBehavior: "expand",
          children: [{ id: "expand-child", label: "Expand Child", href: "/expand/child" }],
        },
        {
          id: "drill",
          label: "Drill",
          childBehavior: "drilldown",
          children: [{ id: "drill-child", label: "Drill Child", href: "/drill/child" }],
        },
        { id: "leaf", label: "Leaf", href: "/leaf" },
      ],
      pathname: "/none",
      expanded: new Set<string>(),
      onToggle,
      onDrilldown,
      onItemSelect,
      onNavigate,
    });

    const clickables = findNodes(tree, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0]?.props?.onClick();
    clickables[1]?.props?.onClick();
    clickables[2]?.props?.onClick();

    expect(onToggle).toHaveBeenCalledWith("expand");
    expect(onNavigate).toHaveBeenCalledWith("/expand");
    expect(onNavigate).toHaveBeenCalledWith("/drill/child");
    expect(onDrilldown).toHaveBeenCalledWith(expect.objectContaining({ id: "drill" }));
    expect(onItemSelect).toHaveBeenCalledWith("leaf");
  });

  it("covers recursive descendant and drilldown fallback branches", () => {
    const deepItems: SideNavItem[] = [
      {
        id: "root-expand",
        label: "Root Expand",
        childBehavior: "expand",
        children: [
          {
            id: "inner-drill",
            label: "Inner Drill",
            childBehavior: "drilldown",
            children: [{ id: "leaf", label: "Leaf", href: "/deep/leaf" }],
          },
        ],
      },
    ];

    expect(helpers.descendantsContainPath(deepItems, "/deep/leaf")).toBe(true);
    expect(helpers.findDrilldownPath(deepItems, "/deep/leaf").map((item) => item.id)).toEqual(["inner-drill"]);

    const implicitExpandItems: SideNavItem[] = [
      {
        id: "implicit-expand",
        label: "Implicit Expand",
        children: [
          {
            id: "inner-drill-implicit",
            label: "Inner Drill Implicit",
            childBehavior: "drilldown",
            children: [{ id: "leaf-implicit", label: "Leaf Implicit", href: "/implicit/leaf" }],
          },
        ],
      },
    ];
    expect(helpers.findDrilldownPath(implicitExpandItems, "/implicit/leaf").map((item) => item.id)).toEqual(["inner-drill-implicit"]);
  });

  it("covers nav icon/expanded rendering branches and leaf without href", () => {
    const onToggle = vi.fn();
    const onDrilldown = vi.fn();
    const onItemSelect = vi.fn();
    const onNavigate = vi.fn();
    const resolveIcon = vi.fn((key: string) => `icon:${key}`);

    const tree = helpers.NavItems({
      items: [
        {
          id: "expand-open",
          label: "Expand Open",
          href: "/open",
          icon: "folder",
          childBehavior: "expand",
          children: [{ id: "nested", label: "Nested", href: "/open/nested" }],
        },
        { id: "leaf-no-href", label: "Leaf No Href" },
      ],
      pathname: "/open",
      expanded: new Set<string>(["expand-open"]),
      onToggle,
      onDrilldown,
      onItemSelect,
      onNavigate,
      resolveIcon,
    });

    const clickables = findNodes(tree, (candidate) => typeof candidate?.props?.onClick === "function");
    clickables[0]?.props?.onClick();
    clickables[1]?.props?.onClick();

    expect(resolveIcon).toHaveBeenCalledWith("folder");
    expect(onItemSelect).toHaveBeenCalledWith("leaf-no-href");
  });

  it("covers nav branches for missing hrefs in expand/drilldown items", () => {
    const onToggle = vi.fn();
    const onDrilldown = vi.fn();
    const onItemSelect = vi.fn();
    const onNavigate = vi.fn();

    const tree = helpers.NavItems({
      items: [
        {
          id: "expand-no-href",
          label: "Expand No Href",
          childBehavior: "expand",
          children: [{ id: "expand-child", label: "Expand Child", href: "/expand-child" }],
        },
        {
          id: "drill-no-href",
          label: "Drill No Href",
          childBehavior: "drilldown",
          children: [{ id: "drill-empty", label: "Drill Empty" }],
        },
      ],
      pathname: "/none",
      expanded: new Set<string>(),
      onToggle,
      onDrilldown,
      onItemSelect,
      onNavigate,
    });

    const clickables = findNodes(tree, (candidate) => typeof candidate?.props?.onClick === "function");
    const expandNoHref = clickables.find((node) => collectText(node).join(" ").includes("Expand No Href"));
    const drillNoHref = clickables.find((node) => collectText(node).join(" ").includes("Drill No Href"));
    expandNoHref?.props?.onClick();
    drillNoHref?.props?.onClick();

    expect(onToggle).toHaveBeenCalledWith("expand-no-href");
    expect(onDrilldown).toHaveBeenCalledWith(expect.objectContaining({ id: "drill-no-href" }));
    expect(onNavigate).not.toHaveBeenCalled();
    expect(onItemSelect).not.toHaveBeenCalled();
    expect(helpers.findFirstHref([{ id: "nested", label: "Nested", children: [{ id: "leaf", label: "Leaf" }] }])).toBeUndefined();
  });

  it("applies nested depth indentation style for child nav items", () => {
    const tree = helpers.NavItems({
      items: [{ id: "nested", label: "Nested Child", href: "/nested" }],
      pathname: "/none",
      depth: 2,
      expanded: new Set<string>(),
      onToggle: vi.fn(),
      onDrilldown: vi.fn(),
      onItemSelect: vi.fn(),
      onNavigate: vi.fn(),
    });

    const listItemButtons = findNodes(
      tree,
      (candidate) => typeof candidate?.props?.onClick === "function" && candidate?.props?.sx?.px === 1.5,
    );
    expect(listItemButtons[0]?.props?.sx?.ml).toBe(4);
  });
});
