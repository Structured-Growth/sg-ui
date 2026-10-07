import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { Provider } from "../../experimental/Provider/Provider";
import { ExperiencePageNavigator } from "./ExperiencePageNavigator";
it("renders the controlled authoring navigator without browser globals", () => {
  const markup = renderToString(<Provider><ExperiencePageNavigator pages={[{ key: "a", title: "Intro" }]}
    activePageKey="a" onSelectPage={() => {}} onAddPage={() => {}} onRemovePage={() => {}}
    onRenamePage={() => {}} onReorderPages={() => {}} /></Provider>);
  expect(markup).toContain('aria-current="page"'); expect(markup).toContain("Intro");
  expect(markup).toContain("Page 1"); expect(markup).not.toContain("Mui");
});
