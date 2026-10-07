import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/TextArea", component: TextArea, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course description", description: "Provide a short summary", defaultValue: "Learn together.\nPractice at your own pace." } } satisfies Meta<typeof TextArea>;
export default meta;
// Storybook's inferred args intersect mutually exclusive naming branches.
// Keep the required label/aria-label union on the public component contract.
type Story = StoryObj;
export const Default: Story = {};
export const Validation: Story = { args: { required: true, invalid: true, errorMessage: "Add a description" } };
