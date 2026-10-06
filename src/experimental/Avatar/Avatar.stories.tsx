import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Avatar", component: Avatar, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { alt: "Ada Lovelace", fallback: "AL" },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Fallback: Story = {};
export const Image: Story = { args: { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23475569'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%23e2e8f0'/%3E%3Cpath d='M15 80 Q15 48 40 48 Q65 48 65 80' fill='%23e2e8f0'/%3E%3C/svg%3E" } };
export const BrokenImage: Story = { args: { src: "data:image/png;base64,broken", size: "large", shape: "square" } };
export const Decorative: Story = { args: { alt: "" } };
