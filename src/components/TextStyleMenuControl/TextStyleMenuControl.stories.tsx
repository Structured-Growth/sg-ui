import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextStyleMenuControl, type TextStyleId } from "./TextStyleMenuControl";

const meta = { title: "Editors/TextStyleMenuControl", component: TextStyleMenuControl, tags: ["autodocs"] } satisfies Meta<typeof TextStyleMenuControl>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveStyles() {
  const [activeStyles, setActiveStyles] = useState<TextStyleId[]>(["highlight"]);
  const [lastAction, setLastAction] = useState("None");
  const toggle = (style: TextStyleId) => {
    setActiveStyles(current => current.includes(style) ? current.filter(value => value !== style) : [...current, style]);
    setLastAction(style);
  };
  return <div>
    <TextStyleMenuControl activeStyles={activeStyles} onLowercase={() => toggle("lowercase")} onUppercase={() => toggle("uppercase")} onCapitalize={() => toggle("capitalize")}
      onStrikethrough={() => toggle("strikethrough")} onSubscript={() => toggle("subscript")} onSuperscript={() => toggle("superscript")} onHighlight={() => toggle("highlight")}
      onClearFormatting={() => { setActiveStyles([]); setLastAction("Clear Formatting"); }} />
    <p>Last host command: {lastAction}</p>
  </div>;
}
export const Default: Story = { render: () => <InteractiveStyles /> };
export const ToolbarDensity: Story = { render: () => <div role="group" aria-label="Formatting"><InteractiveStyles /></div> };
export const LimitedCommands: Story = { args: { onHighlight: () => {}, activeStyles: ["highlight"] } };
export const Disabled: Story = { args: { disabled: true } };
