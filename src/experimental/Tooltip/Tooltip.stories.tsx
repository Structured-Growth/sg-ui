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
