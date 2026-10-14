import { expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { usePersistentState } from "./usePersistentState";
it("uses only the initial snapshot without browser storage during server rendering", () => {
  function View() { const [value] = usePersistentState("ssr-view", { count: 7 }); return <output>{value.count}</output>; }
  expect(renderToString(<View />)).toBe("<output>7</output>");
});
