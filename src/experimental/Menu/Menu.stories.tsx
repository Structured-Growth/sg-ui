import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "./Menu";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
const meta = { title: "Migration proofs/Menu", component: Menu, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course actions", trigger: <Button>Actions</Button>, items: [{ id: "edit", label: "Edit" }, { id: "locked", label: "Unavailable", disabled: true }, { id: "delete", label: "Delete", tone: "danger" }] } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const RetryableActionError: Story = { args: { defaultOpen: true, errorMessage: "Unable to complete this action. Try again." } };
