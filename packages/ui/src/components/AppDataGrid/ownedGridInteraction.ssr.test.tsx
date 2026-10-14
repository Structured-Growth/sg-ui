import { expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { OwnedGridInteraction } from "./ownedGridInteraction";

it("renders owned grid cells and status without browser globals", () => {
  const html = renderToString(<OwnedGridInteraction label="SSR courses" rows={[{ id: 1, name: "Course one" }]}
    columns={[{ field: "name", headerName: "Course", flex: 1 }]} getRowLabel={row => row.name} />);
  expect(html).toContain("Course one");
  expect(html).toContain('role="grid"');
  expect(html).toContain('data-sgui-part="grid-container"');
  const empty = renderToString(<OwnedGridInteraction label="SSR loading" rows={[]} loading
    columns={[{ field: "name", headerName: "Course" }]} getRowLabel={() => "Course"} />);
  expect(empty).toContain("Loading rows");
});
