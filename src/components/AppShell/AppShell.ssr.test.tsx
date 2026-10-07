import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { AppShell } from "./AppShell";
import { SideNavigation } from "../SideNavigation/SideNavigation";
it("renders shell landmarks and host route links without browser globals", () => {
  const html = renderToString(<AppShell mainId="main" navigation={<SideNavigation model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [{ id: "main", items: [{ id: "home", label: "Home", href: "/" }] }] } }} />}>Content</AppShell>);
  expect(html).toContain('<nav'); expect(html).toContain('href="/"'); expect(html).toContain('<main id="main"'); expect(html).toContain('Content');
});
