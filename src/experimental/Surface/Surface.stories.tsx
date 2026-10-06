import type { Meta, StoryObj } from "@storybook/react-vite";
import { Surface } from "./Surface";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Surface", component: Surface, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
