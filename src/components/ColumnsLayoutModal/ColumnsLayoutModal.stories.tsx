import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColumnsLayoutModal, type ColumnsLayoutPreset } from "./ColumnsLayoutModal";
import { AppButton } from "../AppButton";
import { Provider } from "../../experimental/Provider/Provider";
const meta = { title: "Editors/ColumnsLayoutModal", component: ColumnsLayoutModal, tags: ["autodocs"] } satisfies Meta<typeof ColumnsLayoutModal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { defaultPreset: "twoEqual", onClose: () => {}, onSubmit: () => {}, open: true },
  render: args => {
    const [open, setOpen] = useState(args.open);
    const [preset, setPreset] = useState<ColumnsLayoutPreset>(args.defaultPreset ?? "twoEqual");
    return <><AppButton onPress={() => setOpen(true)}>Choose columns</AppButton><p role="status">Host layout: {preset}</p>
      <ColumnsLayoutModal {...args} open={open} defaultPreset={preset} onClose={() => setOpen(false)} onSubmit={value => { setPreset(value); setOpen(false); }} /></>;
  },
};
export const Dark: Story = { ...Default, decorators: [Story => <Provider theme="dark"><Story /></Provider>] };
