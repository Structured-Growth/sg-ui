import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "./Stack";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Stack", component: Stack, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
