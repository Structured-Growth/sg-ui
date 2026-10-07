import { useEffect, useRef, useState } from "react";
import { ThemeScope } from "../../foundation/ThemeScope";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
const meta = { title:"Migration proofs/Tooltip", component:Tooltip, tags:["autodocs"],
  decorators:[(Story) => <Provider><Story /></Provider>],
  args:{ trigger:<Button>Refresh</Button>, content:"Refresh the course list" },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const DarkScope: Story = { render:args => <Provider theme="dark"><Tooltip {...args} /></Provider> };
export const LongDescription: Story = { args:{ content:"Refresh courses using the latest information supplied by the host application. Your current filters and selection are preserved." } };

/** Trigger keys identify different host actions; ordinary content updates retain focus. */
export const TriggerLifetime: Story = {
  render: () => <TriggerLifetimeExample />,
};

function TriggerLifetimeExample() {
  const [version, setVersion] = useState(0);
  const [visible, setVisible] = useState(true);
  const [openRequests, setOpenRequests] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const schedule = (action: () => void) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(action, 2000);
  };
  return <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32 }}>
    <Button onPress={() => schedule(() => setVersion(value => value + 1))}>Replace trigger after delay</Button>
    <Button onPress={() => schedule(() => setVisible(false))}>Remove tooltip after delay</Button>
    <ThemeScope theme="dark" density="compact" dir="rtl" lang="en-US" style={{"--sgui-surface":"rebeccapurple"}}>
      {visible && <Tooltip onOpenChange={open => { if (open) setOpenRequests(value => value + 1); }} delay={3000} closeDelay={0} trigger={<Button key={version}>Action {version}</Button>} content={`Help for action ${version}`} />}
    </ThemeScope>
    <ThemeScope theme="light" density="comfortable" dir="ltr" lang="ar-EG">
      <Tooltip trigger={<Button>Independent action</Button>} content="Independent help" closeDelay={0} />
      <Tooltip trigger={<Button disabled>Unavailable action</Button>} content="Unavailable help" delay={0} />
    </ThemeScope>
    <Button>Next action</Button>
    <p role="status">Action open requests: {openRequests}</p>
  </div>;
}
