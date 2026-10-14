// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { SGAccountProvider, type SGAccountAdapter } from "./accounts";
import { SGNavigationProvider } from "./navigation";
import { SideNavigation, type SideNavigationModel } from "../components/SideNavigation";
import { Provider } from "../theme";

afterEach(() => { cleanup(); localStorage.clear(); });

it("T-S05-02: presents pending logout, suppresses repeats and clears pending after host settlement", async () => {
  let finish!: () => void;
  const pending = new Promise<void>(resolve => { finish = resolve; });
  const session = { accountId: "host-account", email: "host@example.com", activeOrgId: "school",
    organizations: [{ id: "school", name: "School" }] };
  const host: SGAccountAdapter = {
    getStoredAuthSession: vi.fn(() => session), getStoredAuthSessions: vi.fn(() => [session]),
    setActiveStoredAuthSession: vi.fn(), markOrganizationSwitched: vi.fn(),
    logoutAccount: vi.fn(() => pending), logoutAllAccounts: vi.fn(async () => {}),
  };
  const model: SideNavigationModel = {
    user: { initials: "HP", name: "Host Person", organization: "School", defaultOrganizationId: "school" },
    rootMenu: { id: "root", sections: [] },
  };
  const navigate = vi.fn();
  render(<Provider><SGNavigationProvider value={{ pathname: "/courses", navigate }}>
    <SGAccountProvider value={host}><SideNavigation model={model} /></SGAccountProvider>
  </SGNavigationProvider></Provider>);
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", { name: "Host Person School" });
  await user.click(trigger);
  const logout = screen.getByRole("menuitem", { name: "Logout" });
  expect(logout.getAttribute("aria-disabled")).not.toBe("true");
  await user.click(logout);
  expect(host.logoutAccount).toHaveBeenCalledExactlyOnceWith("host-account");
  expect(screen.getByRole("menu")).toBeTruthy();
  expect(screen.getByRole("menuitem", { name: "Logout" }).getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByRole("menuitem", { name: "Add account" }).getAttribute("aria-disabled")).toBe("true");
  await user.click(screen.getByRole("menuitem", { name: "Logout" }));
  await user.click(screen.getByRole("menuitem", { name: "Add account" }));
  expect(host.logoutAccount).toHaveBeenCalledTimes(1);
  expect(host.logoutAllAccounts).not.toHaveBeenCalled();
  expect(navigate).not.toHaveBeenCalled();
  await act(async () => { finish(); await pending; });
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  expect(navigate).toHaveBeenCalledExactlyOnceWith("/courses");
  await user.click(trigger);
  expect(screen.getByRole("menuitem", { name: "Logout" }).getAttribute("aria-disabled")).not.toBe("true");
  expect(screen.getByRole("menuitem", { name: "Add account" }).getAttribute("aria-disabled")).not.toBe("true");
  expect(host.logoutAccount).toHaveBeenCalledTimes(1);
});
