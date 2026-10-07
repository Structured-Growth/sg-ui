import type { Meta, StoryObj } from "@storybook/react-vite";
import { forwardRef, useRef, useState } from "react";
import { AppButton } from "../components/AppButton";
import { Link } from "../primitives";
import SGLink from "./Link";
import { SGNavigationProvider, usePathname, useRouter, type SGLinkProps } from "./navigation";
import { SGAccountProvider, useAccountAdapter, type SGAccountAdapter } from "./accounts";

const meta = { title: "Host adapters/Acceptance", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const CustomLink = forwardRef<HTMLAnchorElement, SGLinkProps>(function CustomLink({ replace, onClick, ...props }, ref) {
  const { push: navigate } = useRouter();
  return <a {...props} ref={ref} data-router="host" onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && (!props.target || props.target === "_self") && (props.download === undefined || props.download === false)) {
      event.preventDefault();
      navigate(props.href, { replace });
    }
  }} />;
});

function Pathname() { return <output aria-label="Host pathname">{usePathname()}</output>; }
function RoutingExample() {
  const [pathname, setPathname] = useState("/courses");
  const [events, setEvents] = useState<string[]>([]);
  const anchor = useRef<HTMLAnchorElement>(null);
  const navigate = (href: string, options?: { replace?: boolean }) => {
    setEvents(previous => [...previous, `${options?.replace ? "replace" : "push"}:${href}`]);
    setPathname(href);
  };
  return <div style={{ display: "grid", gap: "1rem" }}>
    <SGLink href="#native-course" replace>Native fallback course</SGLink>
    <SGNavigationProvider value={{ pathname, navigate }}>
      <SGLink href="/courses/one?tab=details#title" replace>Replace course</SGLink>
      <SGLink href="#canceled" onClick={event => event.preventDefault()}>Canceled course</SGLink>
      <SGLink href="https://adapter.example.test/course">External course</SGLink>
      <SGLink href="data:text/plain,SGUI%20host%20adapter" download="adapter.txt">Download course</SGLink>
      <Link href="/courses/two">Styled course</Link>
      <Pathname />
    </SGNavigationProvider>
    <SGNavigationProvider value={{ pathname, navigate, Link: CustomLink }}>
      <SGLink href="/courses/custom" replace ref={anchor} aria-description="Host router course" data-host="course">Custom router course</SGLink>
      <AppButton onPress={() => anchor.current?.focus()}>Focus custom router link</AppButton>
    </SGNavigationProvider>
    <output aria-label="Host navigation events" style={{ whiteSpace: "pre-wrap" }}>{events.join("\n")}</output>
  </div>;
}
export const Routing: Story = { render: () => <RoutingExample /> };

/** The host owns completion/error policy; no account network or storage is used. */
function AccountActions({ settle }: { settle: (fail: boolean) => void }) {
  const adapter = useAccountAdapter();
  const [status, setStatus] = useState("Ready");
  const pending = useRef(false);
  const logout = async () => {
    if (pending.current) return;
    pending.current = true;
    setStatus("Pending");
    try { await adapter.logoutAccount("account-1"); setStatus("Signed out"); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Host logout failed"); }
    finally { pending.current = false; }
  };
  return <div style={{ display: "grid", gap: "1rem" }}>
    <AppButton onPress={() => void logout()} disabled={!adapter.enabled || status === "Pending"}>Log out account</AppButton>
    <AppButton onPress={() => settle(false)} disabled={status !== "Pending"}>Host completes logout</AppButton>
    <AppButton onPress={() => settle(true)} disabled={status !== "Pending"}>Host rejects logout</AppButton>
    <output aria-label="Host account status" aria-live="polite">{status}</output>
  </div>;
}
function AccountsExample() {
  const completion = useRef<{ resolve: () => void; reject: (error: Error) => void } | null>(null);
  const [calls, setCalls] = useState(0);
  const host: SGAccountAdapter = {
    getStoredAuthSessions: () => [], getStoredAuthSession: () => null,
    setActiveStoredAuthSession: () => {}, markOrganizationSwitched: () => {},
    logoutAccount: () => { setCalls(count => count + 1); return new Promise<void>((resolve, reject) => { completion.current = { resolve, reject }; }); },
    logoutAllAccounts: async () => {},
  };
  return <SGAccountProvider value={host}>
    <AccountActions settle={fail => { if (fail) completion.current?.reject(new Error("Host logout failed")); else completion.current?.resolve(); completion.current = null; }} />
    <output aria-label="Host logout requests">{calls}</output>
  </SGAccountProvider>;
}
export const AsyncAccounts: Story = { render: () => <AccountsExample /> };
