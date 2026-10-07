import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Button } from "../../experimental/Button/Button";
import { Typography } from "../../experimental/Typography/Typography";
import { ClassCardFrame } from "./ClassCardFrame";

const meta = {
  title: "Components/ClassCardFrame",
  component: ClassCardFrame,
  args: {
    header: <Typography variant="h5">Week 1 Module</Typography>,
    body: <Typography variant="body1">This section covers baseline practical defense skills.</Typography>,
    footer: <Button density="compact" variant="filled">Open</Button>,
  },
  decorators: [
    (Story) => (
      <ThemeScope><div style={{ padding: 16 }}>
        <Story />
      </div></ThemeScope>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof ClassCardFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutFooter: Story = {
  args: {
    footer: undefined,
  },
};

export const StyledSlots: Story = { args: { headerClassName: "host-header", bodyStyle: { minHeight: 120 }, footerStyle: { padding: 16 } } };

export const Dark: Story = { render: args => <ThemeScope theme="dark"><ClassCardFrame {...args} /></ThemeScope> };
