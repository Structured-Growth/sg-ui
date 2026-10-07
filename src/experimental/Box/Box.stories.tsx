import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./Box";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Box", component: Box, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Box>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
