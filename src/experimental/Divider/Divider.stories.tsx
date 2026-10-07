import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Divider", component: Divider, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: {},
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
