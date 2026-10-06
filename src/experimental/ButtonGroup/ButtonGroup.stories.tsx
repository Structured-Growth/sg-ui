import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup } from "./ButtonGroup";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
const meta = { title: "Migration proofs/ButtonGroup", component: ButtonGroup, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course actions", joined: true, children: <><Button tone="neutral" variant="text">Create</Button><Button tone="neutral" variant="text">Import</Button></> } } satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
