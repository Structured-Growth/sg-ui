// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SGNavigationProvider } from "./navigation";
import Link from "./Link";
import { SGAccountProvider, useAccountAdapter } from "./accounts";
import { SGTranslationProvider, useTranslation } from "../i18n";
afterEach(cleanup);
describe("host adapters", () => {
  it("routes clicks and preserves replace behavior without passing it to the DOM", () => {
    const navigate = vi.fn();
    render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link href="/courses" replace>Courses</Link></SGNavigationProvider>);
    fireEvent.click(screen.getByRole("link"));
    expect(navigate).toHaveBeenCalledWith("/courses", { replace: true });
    expect(screen.getByRole("link").hasAttribute("replace")).toBe(false);
  });
  it("preserves modified-click browser behavior", () => {
    const navigate = vi.fn();
    render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link href="#courses">Courses</Link></SGNavigationProvider>);
    fireEvent.click(screen.getByRole("link"), { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });
  it("respects consumer cancellation", () => {
    const navigate = vi.fn();
    render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link href="/courses" onClick={e => e.preventDefault()}>Courses</Link></SGNavigationProvider>);
    fireEvent.click(screen.getByRole("link"));
    expect(navigate).not.toHaveBeenCalled();
  });
  it.each(["", "course.txt", true])("leaves download=%s to the browser", (download) => {
    const navigate = vi.fn();
    render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link href="#download" download={download}>Download</Link></SGNavigationProvider>);
    expect(fireEvent.click(screen.getByRole("link"))).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
  it("routes download=false and calls the native click callback before navigation", () => {
    const order: string[] = [];
    render(<SGNavigationProvider value={{ pathname: "/", navigate: () => order.push("navigate") }}><Link href="#course" download={false} onClick={() => order.push("click")}>Course</Link></SGNavigationProvider>);
    expect(fireEvent.click(screen.getByRole("link"))).toBe(false);
    expect(order).toEqual(["click", "navigate"]);
  });
  it.each(["_blank", "course-window"])("preserves target=%s navigation", (target) => {
    const navigate = vi.fn();
    render(<SGNavigationProvider value={{ pathname: "/", navigate }}><Link href="#course" target={target}>Course</Link></SGNavigationProvider>);
    expect(fireEvent.click(screen.getByRole("link"))).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
  it("supports custom router links", () => {
    render(<SGNavigationProvider value={{ pathname: "/", navigate: vi.fn(), Link: props => <a href={props.href} data-router="custom">{props.children}</a> }}><Link href="/courses">Courses</Link></SGNavigationProvider>);
    expect(screen.getByRole("link").getAttribute("data-router")).toBe("custom");
  });
  it("uses English messages and interpolation without a translation provider", () => {
    function Label() {
      const { t } = useTranslation();
      return <span>{t("selection.count", { defaultMessage: "{count} selected", values: { count: 3 } })}</span>;
    }
    render(<Label />);
    expect(screen.getByText("3 selected")).toBeTruthy();
  });
  it("uses host translations", () => {
    function Label() { return <span>{useTranslation().t("save", { defaultMessage: "Save" })}</span>; }
    render(<SGTranslationProvider value={{ locale: "es-ES", t: () => "Guardar", useNamespace: () => {} }}><Label /></SGTranslationProvider>);
    expect(screen.getByText("Guardar")).toBeTruthy();
  });
  it("disables account actions by default and delegates to a supplied host", () => {
    function Status() { const adapter = useAccountAdapter(); return <button onClick={() => void adapter.logoutAccount("account-1")}>{String(adapter.enabled)}</button>; }
    const { unmount } = render(<Status />);
    expect(screen.getByText("false")).toBeTruthy();
    unmount();
    const logoutAccount = vi.fn(async () => {});
    render(<SGAccountProvider value={{ getStoredAuthSessions: () => [], getStoredAuthSession: () => null, setActiveStoredAuthSession: () => {}, markOrganizationSwitched: () => {}, logoutAccount, logoutAllAccounts: async () => {} }}><Status /></SGAccountProvider>);
    fireEvent.click(screen.getByText("true"));
    expect(logoutAccount).toHaveBeenCalledWith("account-1");
  });
});
