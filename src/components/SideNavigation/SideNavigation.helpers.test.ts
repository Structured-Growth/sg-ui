import { beforeAll, describe, expect, it, vi } from "vitest";
import type { SideNavItem, SideNavMenu } from "./SideNavigation";

let helpers: Awaited<typeof import("./SideNavigation")>;

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

  it("traverses expand ancestors to nested drilldowns and leaves without routes", () => {
    const items: SideNavItem[] = [{ id: "expand", label: "Expand", children: [{ id: "drill", label: "Drill", childBehavior: "drilldown", children: [{ id: "leaf", label: "Leaf", href: "/deep/leaf" }] }] }];
    expect(helpers.descendantsContainPath(items, "/deep/leaf")).toBe(true);
    expect(helpers.findDrilldownPath(items, "/deep/leaf").map(item => item.id)).toEqual(["drill"]);
    expect(helpers.findFirstHref(items)).toBe("/deep/leaf");
    expect(helpers.findFirstHref([{ id: "empty", label: "Empty", children: [{ id: "leaf", label: "Leaf" }] }])).toBeUndefined();
  });
});
