import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./Popover";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
const meta = { title: "Migration proofs/Popover", component: Popover, tags: ["autodocs"],
  decorators: [(Story) => <Provider theme="dark"><Story /></Provider>],
  args: { trigger: <Button variant="outlined" tone="neutral">Edit note</Button>, title: "Course note", children: <TextField label="Note" /> },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
