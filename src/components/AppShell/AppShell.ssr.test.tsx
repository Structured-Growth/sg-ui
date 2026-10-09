import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { AppShell } from "./AppShell";
import { SideNavigation } from "../SideNavigation/SideNavigation";
it("renders shell landmarks and host route links without browser globals", () => {
  const html = renderToString(<AppShell mainId="main" navigation={<SideNavigation model={{ user: { initials: "TH", name: "Thomas", organization: "School" }, rootMenu: { id: "root", sections: [{ id: "main", items: [{ id: "home", label: "Home", href: "/" }] }] } }} />}>Content</AppShell>);
  expect(html).toContain('<nav'); expect(html).toContain('href="/"'); expect(html).toContain('<main id="main"'); expect(html).toContain('Content');
});
it("renders host dimensions and independent shell names without measuring the viewport", () => {
  const html = renderToString(<>
    <AppShell className="host-narrow" style={{ inlineSize: "20rem", blockSize: "30rem" }} mainId="narrow-main" mainLabel="Narrow workspace" navigation={<nav aria-label="Narrow routes" />}>Narrow content</AppShell>
    <AppShell mainId="wide-main" mainLabel="Wide workspace" navigation={<nav aria-label="Wide routes" />}>Wide content</AppShell>
  </>);
  expect(html).toContain('style="inline-size:20rem;block-size:30rem"');
  expect(html).toContain('data-sgui-part="app-shell"');
  expect(html.match(/data-sgui-part="navigation"/g)).toHaveLength(2);
  expect(html).toContain('<main id="narrow-main" aria-label="Narrow workspace"');
  expect(html).toContain('<main id="wide-main" aria-label="Wide workspace"');
});
