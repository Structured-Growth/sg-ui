import type { SideNavigationModel } from "../components/SideNavigation";
export const mainNavigation: SideNavigationModel = {
  user: { initials: "SG", name: "Structured Growth", organization: "Demo Organization" },
  rootMenu: { id: "root", sections: [{ id: "main", items: [
    { id: "dashboard", label: "Dashboard", href: "/" },
    { id: "courses", label: "Courses", href: "/courses" },
  ] }] },
};
export const resolveNavigationIcon = () => null;
