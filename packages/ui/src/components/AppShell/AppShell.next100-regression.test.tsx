// @vitest-environment jsdom
import { createRef } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it } from "vitest";
import { ThemeScope } from "../../foundation";
import { AppPageHeader } from "../AppPageHeader";
import { SideNavigation } from "../SideNavigation";
import { AppShell, type AppShellProps } from "./AppShell";

afterEach(cleanup);

it("propagates the host scope through navigation and header children across scope updates", () => {
  const ref = createRef<HTMLDivElement>();
  const props: AppShellProps = {
    mainId: "course-workspace",
    mainLabel: "Course workspace",
    className: "host-shell",
    style: { height: 480 },
    navigation: <ThemeScope data-testid="navigation-scope"><nav aria-label="Host navigation">Courses</nav></ThemeScope>,
    children: <ThemeScope data-testid="content-scope"><AppPageHeader title="Host course header" /><p>Host content</p></ThemeScope>,
  };
  const workspace = (theme: "light" | "dark", density: "compact" | "comfortable") =>
    <ThemeScope theme={theme} density={density} dir="rtl" lang="ar"><AppShell {...props} ref={ref} /></ThemeScope>;
  const view = render(workspace("dark", "compact"));
  const main = screen.getByRole("main", { name: "Course workspace" });
  expect(main.id).toBe("course-workspace");
  expect(ref.current?.contains(screen.getByRole("navigation", { name: "Host navigation" }))).toBe(true);
  expect(ref.current?.classList.contains("host-shell")).toBe(true);
  expect(ref.current?.style.height).toBe("480px");
  expect(within(main).getByRole("heading", { name: "Host course header" })).toBeTruthy();
  expect(within(main).getByText("Host content")).toBeTruthy();
  for (const id of ["navigation-scope", "content-scope"]) {
    const scope = screen.getByTestId(id);
    expect(scope.dataset.sguiTheme).toBe("dark");
    expect(scope.dataset.sguiDensity).toBe("compact");
    expect(scope.dir).toBe("rtl");
    expect(scope.lang).toBe("ar");
  }
  view.rerender(workspace("light", "comfortable"));
  expect(screen.getByRole("main", { name: "Course workspace" })).toBe(main);
  for (const id of ["navigation-scope", "content-scope"]) {
    expect(screen.getByTestId(id).dataset.sguiTheme).toBe("light");
    expect(screen.getByTestId(id).dataset.sguiDensity).toBe("comfortable");
  }
});

it("isolates sibling navigation state and preserves the surviving host field when another shell unmounts", async () => {
  const user = userEvent.setup();
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = createRef<HTMLDivElement>();
  const shell = (name: string, ref: typeof firstRef) => <AppShell key={name} ref={ref} mainLabel={`${name} workspace`}
    navigation={<SideNavigation aria-label={`${name} navigation`} model={{ user: { initials: name, name, organization: "School" }, rootMenu: { id: name, sections: [] } }} />}>
    <label>{name} title<input defaultValue={`${name} draft`} /></label>
  </AppShell>;
  const view = render(<ThemeScope>{shell("First", firstRef)}{shell("Second", secondRef)}</ThemeScope>);
  const secondMain = screen.getByRole("main", { name: "Second workspace" });
  const secondInput = within(secondMain).getByRole("textbox", { name: "Second title" });
  await user.clear(secondInput);
  await user.type(secondInput, "Unsaved second title");
  await user.click(within(screen.getByRole("navigation", { name: "First navigation" })).getByRole("button", { name: "Collapse navigation" }));
  expect(screen.getByRole("navigation", { name: "First navigation" }).hasAttribute("data-collapsed")).toBe(true);
  expect(screen.getByRole("navigation", { name: "Second navigation" }).hasAttribute("data-collapsed")).toBe(false);
  view.rerender(<ThemeScope>{shell("Second", secondRef)}</ThemeScope>);
  expect(firstRef.current).toBeNull();
  expect(screen.queryByRole("navigation", { name: "First navigation" })).toBeNull();
  expect(screen.getByRole("main", { name: "Second workspace" })).toBe(secondMain);
  expect(within(secondMain).getByRole("textbox", { name: "Second title" })).toBe(secondInput);
  expect((secondInput as HTMLInputElement).value).toBe("Unsaved second title");
  await user.click(within(screen.getByRole("navigation", { name: "Second navigation" })).getByRole("button", { name: "Collapse navigation" }));
  expect(screen.getByRole("navigation", { name: "Second navigation" }).hasAttribute("data-collapsed")).toBe(true);
  view.unmount();
  expect(secondRef.current).toBeNull();
});
