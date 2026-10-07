// @vitest-environment node
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { RadioGroup } from "./RadioGroup";

it("renders native named radio fields without browser globals", () => {
  expect(typeof document).toBe("undefined");
  const html = renderToString(<RadioGroup label="Delivery" name="delivery" required
    defaultValue="self" description="Choose a format"
    options={[{ value: "self", label: "Self paced" }, { value: "live", label: "Live" }]} />);
  expect(html).toContain('role="radiogroup"');
  expect(html).toContain('name="delivery"');
  expect(html).toContain('checked=""');
  expect(html).toContain('value="self"');
  expect(html).toContain("Choose a format");
});
