import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Card", component: Card, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
