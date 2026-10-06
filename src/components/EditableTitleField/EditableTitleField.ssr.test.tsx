import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { EditableTitleField } from "./EditableTitleField";
it("renders its public title, named native edit control and fallback without browser globals", () => {
 expect(typeof window).toBe("undefined"); const html = renderToString(<EditableTitleField title="" variant="h6" onSave={() => {}} />);
 expect(html).toContain('<h6'); expect(html).toContain('Untitled document'); expect(html).toContain('aria-label="Edit title"'); expect(html).toContain('type="button"');
});
