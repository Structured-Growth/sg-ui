import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "../../experimental/Box/Box";
import { Provider } from "../../experimental/Provider/Provider";
import { EditableTitleField } from "./EditableTitleField";
const meta = { title: "Editors/EditableTitleField", component: EditableTitleField, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { title: "Page title", onSave: () => {} } } satisfies Meta<typeof EditableTitleField>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example() { const [title, setTitle] = useState("Page title"); return <Box padding={2}><EditableTitleField onSave={setTitle} title={title} variant="h5" /></Box>; }
export const Default: Story = { render: () => <Example /> };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Empty: Story = { args: { title: "" } };
export const SaveFailure: Story = { args: { onSave: async () => { throw new Error("Host persistence failed"); } } };
export const Dark: Story = { render: () => <Provider theme="dark"><Example /></Provider> };
