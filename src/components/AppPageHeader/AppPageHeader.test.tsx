import { describe, expect, it, vi } from "vitest";
import { AppPageHeader } from "./AppPageHeader";

const { setBreadcrumbMenuAnchor } = vi.hoisted(() => ({
  setBreadcrumbMenuAnchor: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useMemo: <T,>(factory: () => T) => factory(),
    useState: <T,>(initial: T) => [initial, setBreadcrumbMenuAnchor] as const,
  };
});

describe("AppPageHeader", () => {
  const findNode = (node: any, predicate: (candidate: any) => boolean): any => {
    if (!node || typeof node !== "object") {
      return null;
    }
    if (predicate(node)) {
      return node;
    }
    const children = node?.props?.children;
    if (Array.isArray(children)) {
      for (const child of children) {
        const found = findNode(child, predicate);
        if (found) {
          return found;
        }
      }
      return null;
    }
    return findNode(children, predicate);
  };

  it("renders header with fixed secondary background and optional more menu button", () => {
    const element = AppPageHeader({
      title: "Defense Against the Dark Arts",
      moreMenuItems: [{ label: "Edit" }],
    }) as any;

    expect(element.props.sx.bgcolor).toBe("action.hover");
    const moreButton = findNode(element, (candidate) => candidate?.props?.["aria-label"] === "More actions");
    expect(moreButton).toBeTruthy();
    moreButton.props.onClick({ currentTarget: { id: "more-anchor" } });
    expect(setBreadcrumbMenuAnchor).toHaveBeenCalledTimes(1);
  });

  it("always uses secondary background", () => {
    const element = AppPageHeader({
      title: "Section Preferences",
    }) as any;
    expect(element.props.sx.bgcolor).toBe("action.hover");
  });

  it("omits right-side stack when no metadata or more button is provided", () => {
    const element = AppPageHeader({
      title: "Classes",
    }) as any;

    expect(JSON.stringify(element)).not.toContain("IconButton");
  });

  it("renders more button without right metadata", () => {
    const element = AppPageHeader({
      title: "Classes",
      moreMenuItems: [{ label: "Edit" }],
    }) as any;
    const moreButton = findNode(element, (candidate) => candidate?.props?.["aria-label"] === "More actions");
    expect(moreButton).toBeTruthy();
  });

  it("renders action buttons and hides more menu when both are provided", () => {
    const element = AppPageHeader({
      title: "Classes",
      actionButtons: "Add Course to Section...",
      moreMenuItems: [{ label: "Edit" }],
    }) as any;

    expect(findNode(element, (candidate) => candidate?.props?.children === "Add Course to Section...")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.["aria-label"] === "More actions")).toBeNull();
  });

  it("renders detail-style breadcrumbs, description, and meta items", () => {
    const element = AppPageHeader({
      title: "Biology 101",
      breadcrumbs: [
        { href: "/sections", label: "Classes" },
        { label: "Section" },
      ],
      description: "Intro class",
      metaItems: [
        { id: "learners", label: "28 Learners" },
        { id: "site", label: "Hogwarts" },
      ],
    }) as any;

    const breadcrumbsNode = findNode(element, (candidate) => candidate?.props?.["aria-label"] === "breadcrumbs");
    expect(breadcrumbsNode).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.["aria-label"] === "Show path")).toBeNull();
    expect(findNode(element, (candidate) => candidate?.props?.children === "Intro class")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.children === "28 Learners")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.children === "Hogwarts")).toBeTruthy();
  });

  it("condenses breadcrumbs with menu when there are more than three items", () => {
    setBreadcrumbMenuAnchor.mockClear();
    const element = AppPageHeader({
      title: "Biology 101",
      breadcrumbs: [
        { href: "/org", label: "Org" },
        { href: "/org/classes", label: "Classes" },
        { href: "/org/sections/biology", label: "Biology" },
        { label: "Section" },
      ],
    }) as any;

    const breadcrumbsNode = findNode(element, (candidate) => candidate?.props?.["aria-label"] === "breadcrumbs");
    expect(breadcrumbsNode).toBeTruthy();
    const breadcrumbChildren = (Array.isArray(breadcrumbsNode.props.children) ? breadcrumbsNode.props.children : [breadcrumbsNode.props.children]).filter(Boolean);
    expect(breadcrumbChildren.some((child: any) => child?.props?.children === "Org")).toBe(true);
    expect(breadcrumbChildren.some((child: any) => child?.props?.children === "Classes")).toBe(false);
    expect(breadcrumbChildren.some((child: any) => child?.props?.children === "Section")).toBe(true);
    expect(breadcrumbChildren.some((child: any) => child?.props?.children === "Biology")).toBe(true);
    const collapseButton = findNode(element, (candidate) => candidate?.props?.["aria-label"] === "Show path");
    expect(collapseButton).toBeTruthy();
    collapseButton.props.onClick({ currentTarget: { id: "anchor" } });
    expect(setBreadcrumbMenuAnchor).toHaveBeenCalledWith({ id: "anchor" });
  });

  it("does not condense breadcrumbs when there are three items", () => {
    const element = AppPageHeader({
      title: "Biology 101",
      breadcrumbs: [
        { href: "/org", label: "Org" },
        { href: "/org/classes", label: "Classes" },
        { label: "Section" },
      ],
    }) as any;

    expect(findNode(element, (candidate) => candidate?.props?.["aria-label"] === "Show path")).toBeNull();
  });

  it("runs menu item callback when a header menu action is clicked", () => {
    const onEdit = vi.fn();
    const element = AppPageHeader({
      title: "Biology 101",
      moreMenuItems: [{ id: "edit", label: "Edit Section", onClick: onEdit }],
    }) as any;

    const menuItem = findNode(element, (candidate) => candidate?.props?.children === "Edit Section");
    expect(menuItem).toBeTruthy();
    menuItem.props.onClick();
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("closes collapsed breadcrumb menu when breadcrumb item is clicked", () => {
    setBreadcrumbMenuAnchor.mockClear();
    const element = AppPageHeader({
      title: "Biology 101",
      breadcrumbs: [
        { href: "/org", label: "Org" },
        { href: "/org/classes", label: "Classes" },
        { href: "/org/sections/biology", label: "Biology" },
        { label: "Section" },
      ],
    }) as any;

    const collapsedMenuItem = findNode(element, (candidate) => candidate?.props?.children === "Classes");
    expect(collapsedMenuItem).toBeTruthy();
    collapsedMenuItem.props.onClick();
    expect(setBreadcrumbMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("renders href-based more menu item and closes after click", () => {
    setBreadcrumbMenuAnchor.mockClear();
    const element = AppPageHeader({
      title: "Biology 101",
      moreMenuItems: [{ id: "link-item", label: "Open Settings", href: "/admin/settings" }],
    }) as any;

    const linkMenuItem = findNode(element, (candidate) => candidate?.props?.children === "Open Settings");
    expect(linkMenuItem).toBeTruthy();
    expect(linkMenuItem.props.href).toBe("/admin/settings");
    linkMenuItem.props.onClick();
    expect(setBreadcrumbMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("covers collapsed href breadcrumb branches and meta+action grid layout", () => {
    const element = AppPageHeader({
      title: "Advanced Header",
      breadcrumbs: [
        { href: "/root", label: "Root" },
        { href: "/middle", label: "Middle" },
        { href: "/penultimate", label: "Penultimate" },
        { label: "Current" },
      ],
      metaItems: [{ label: "No ID Meta" }],
      actionButtons: "Do Action",
    }) as any;

    const breadcrumbsNode = findNode(element, (candidate) => candidate?.props?.["aria-label"] === "breadcrumbs");
    expect(breadcrumbsNode).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.href === "/root")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.href === "/penultimate")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.children === "Middle")).toBeTruthy();

    const titleGrid = findNode(element, (candidate) => candidate?.props?.sx?.display === "grid");
    expect(titleGrid.props.sx.gridTemplateColumns).toBe("minmax(0, 1fr) minmax(0, 200px) minmax(0, 200px)");
    expect(findNode(element, (candidate) => candidate?.props?.children === "No ID Meta")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.children === "Do Action")).toBeTruthy();
  });

  it("covers danger styles for href and non-href more menu items", () => {
    const onDelete = vi.fn();
    const element = AppPageHeader({
      title: "Advanced Header",
      moreMenuItems: [
        { label: "Danger Link", href: "/danger", danger: true },
        { label: "Danger Action", danger: true, onClick: onDelete, disabled: true },
      ],
    }) as any;

    const dangerLinkItem = findNode(element, (candidate) => candidate?.props?.children === "Danger Link");
    expect(dangerLinkItem.props.href).toBe("/danger");
    expect(dangerLinkItem.props.sx.color).toBe("error.main");
    dangerLinkItem.props.onClick();

    const dangerActionItem = findNode(element, (candidate) => candidate?.props?.children === "Danger Action");
    expect(dangerActionItem.props.disabled).toBe(true);
    expect(dangerActionItem.props.sx.color).toBe("error.main");
    dangerActionItem.props.onClick();
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("covers collapsed non-link breadcrumb branches and meta+more grid layout branch", () => {
    const element = AppPageHeader({
      title: "No-link collapsed crumbs",
      breadcrumbs: [
        { label: "Root No Link" },
        { label: "Middle No Link" },
        { label: "Penultimate No Link" },
        { label: "Current No Link" },
      ],
      metaItems: [{ label: "Meta A" }],
      moreMenuItems: [{ label: "Edit" }],
    }) as any;

    expect(findNode(element, (candidate) => candidate?.props?.children === "Root No Link")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.children === "Penultimate No Link")).toBeTruthy();
    expect(findNode(element, (candidate) => candidate?.props?.children === "Middle No Link")).toBeTruthy();

    const titleGrid = findNode(element, (candidate) => candidate?.props?.sx?.display === "grid");
    expect(titleGrid.props.sx.gridTemplateColumns).toBe("minmax(0, 1fr) minmax(0, 200px) 56px");
  });
});
