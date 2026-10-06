import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton";
import { Provider } from "../Provider/Provider";
import { AddIcon } from "../icons/AddIcon";
const meta = { title: "Migration proofs/IconButton", component: IconButton, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Add course", children: <AddIcon /> } } satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
