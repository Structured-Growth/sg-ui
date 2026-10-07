import { useCallback, useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SGAccountProvider, SGNavigationProvider, type SGAccountAdapter } from "../../adapters";
import { Button } from "../../experimental/Button/Button";
import { Typography } from "../../experimental/Typography/Typography";
import { SideNavigation, type SideNavigationModel } from "./SideNavigation";

const model: SideNavigationModel = {
  user: { initials: "JD", name: "John", organization: "School", defaultOrganizationId: "one" },
  rootMenu: { id: "root", sections: [] },
};
const meta = { title: "Navigation/SideNavigation Organization Lifetime", component: SideNavigation,
  parameters: { layout: "fullscreen" } } satisfies Meta<typeof SideNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DeferredSwitch: Story = { args: { model }, render: () => <DeferredSwitchFixture /> };

function DeferredSwitchFixture() {
  const [adapterGeneration, setAdapterGeneration] = useState(0);
  const [callbackGeneration, setCallbackGeneration] = useState(0);
  const [provided, setProvided] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [requests, setRequests] = useState(0);
  const [settlements, setSettlements] = useState(0);
  const [commits, setCommits] = useState<string[]>([]);
  const [navigation, setNavigation] = useState("None");
  const pending = useRef<Array<{ resolve: () => void; reject: (error: Error) => void }>>([]);
  const host = useMemo<SGAccountAdapter>(() => {
    const sessions = [
      { accountId: "a", email: "a@example.com", activeOrgId: "one", organizations: [{ id: "one", name: "School" }] },
      { accountId: "b", email: "b@example.com", activeOrgId: "two", organizations: [{ id: "two", name: "Other" }] },
    ];
    let active = sessions[0];
    return { organizationStorageKey: "batch70:organization", getStoredAuthSession: () => active, getStoredAuthSessions: () => sessions,
      setActiveStoredAuthSession: account => {
        active = sessions.find(session => session.accountId === account) ?? active;
        setCommits(value => [...value, `${adapterGeneration}:account:${account}`]);
      },
      markOrganizationSwitched: () => setCommits(value => [...value, `${adapterGeneration}:marked`]),
      logoutAccount: async () => {}, logoutAllAccounts: async () => {} };
  }, [adapterGeneration]);
  const change = useCallback(() => {
    void callbackGeneration;
    setRequests(count => count + 1);
    return new Promise<void>((resolve, reject) => pending.current.push({ resolve, reject }))
      .finally(() => setSettlements(count => count + 1));
  }, [callbackGeneration]);
  const content = mounted ? <SideNavigation model={model} onOrganizationChange={change} /> : null;
  return <SGNavigationProvider value={{ pathname: "/courses", navigate: setNavigation }}>
    <div style={{ display: "flex", minHeight: "70dvh" }}>
      {provided ? <SGAccountProvider value={host}>{content}</SGAccountProvider> : content}
      <div style={{ padding: "var(--sgui-space4)" }}>
        <Typography as="h1" variant="h4">Host organization switch lifetime</Typography>
        <Button onPress={() => setAdapterGeneration(value => value + 1)}>Replace account adapter</Button>
        <Button onPress={() => setCallbackGeneration(value => value + 1)}>Replace organization callback</Button>
        <Button onPress={() => setProvided(value => !value)}>Toggle account adapter</Button>
        <Button onPress={() => setMounted(value => !value)}>Toggle navigation</Button>
        <Button onPress={() => pending.current.shift()?.resolve()}>Complete oldest switch</Button>
        <Button onPress={() => pending.current.shift()?.reject(new Error("Host failure"))}>Reject oldest switch</Button>
        <Typography aria-label="Host switch requests">{requests}</Typography>
        <Typography aria-label="Host switch settlements">{settlements}</Typography>
        <Typography aria-label="Host adapter commits">{JSON.stringify(commits)}</Typography>
        <Typography aria-label="Host navigation result">{navigation}</Typography>
      </div>
    </div>
  </SGNavigationProvider>;
}
