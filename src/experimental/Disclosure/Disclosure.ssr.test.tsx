import { expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { Disclosure } from "./Disclosure";
import { Navigation, NavigationItem } from "../Navigation/Navigation";
import { List, ListItem, ListItemText } from "../List/List";
import { Provider } from "../Provider/Provider";
it("renders expanded navigation and linked disclosure state without browser globals", () => {
  expect(typeof window).toBe("undefined"); expect(typeof document).toBe("undefined");
  const html = renderToString(<Provider><Navigation label="Main"><List><ListItem><Disclosure label="Courses" defaultExpanded><List><ListItem><NavigationItem href="/algebra" current><ListItemText primary="Algebra" secondary="Three lessons" /></NavigationItem></ListItem></List></Disclosure></ListItem></List></Navigation></Provider>);
  expect(html).toContain('<nav'); expect(html).toContain('aria-label="Main"'); expect(html).toContain('aria-expanded="true"');
  expect(html).toContain('aria-current="page"'); expect(html).toContain('href="/algebra"'); expect(html).toContain('role="region"');
  const triggerId = html.match(/<button[^>]*id="([^"]+)"/)?.[1];
  const panelId = html.match(/aria-controls="([^"]+)"/)?.[1];
  expect(triggerId).toBeDefined(); expect(panelId).toBeDefined();
  expect(html).toContain(`aria-labelledby="${triggerId}"`); expect(html).toContain(`id="${panelId}"`);
  expect(html).not.toContain('role="menu');
});
it("renders collapsed retained or unmounted content deterministically on the server", () => {
  const retained = renderToString(<Disclosure label="Retained"><input aria-label="Draft" defaultValue="Saved" /></Disclosure>);
  expect(retained).toContain('aria-expanded="false"'); expect(retained).toContain('hidden=""'); expect(retained).toContain('value="Saved"');
  const unmounted = renderToString(<Disclosure label="Unmounted" unmountOnCollapse><input aria-label="Draft" /></Disclosure>);
  expect(unmounted).toContain('hidden=""'); expect(unmounted).not.toContain('<input');
});
