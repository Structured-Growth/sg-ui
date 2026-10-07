import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "../../foundation/ThemeScope";
import { TextColorPickerControl } from "./TextColorPickerControl";

const meta = { title: "Editors/TextColorPickerControl", component: TextColorPickerControl, tags: ["autodocs"] } satisfies Meta<typeof TextColorPickerControl>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example({ mode = "foreground" }: { mode?: "foreground" | "background" }) {
  const [color, setColor] = useState(mode === "foreground" ? "var(--sgui-text)" : "");
  return <ThemeScope><TextColorPickerControl mode={mode} onChange={setColor} value={color} /><p>Selected: {color || "Inherited"}</p></ThemeScope>;
}
export const Default: Story = { render: () => <Example /> };
export const Background: Story = { render: () => <Example mode="background" /> };
export const Disabled: Story = { args: { disabled: true } };
export const WithoutCallback: Story = {};
