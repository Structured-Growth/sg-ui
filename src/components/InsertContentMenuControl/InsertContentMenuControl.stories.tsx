import { NativeInsertionHost } from "./NativeInsertionHost";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../../experimental/Provider/Provider";
import { InsertContentMenuControl } from "./InsertContentMenuControl";
const meta = { title: "Editors/InsertContentMenuControl", component: InsertContentMenuControl, tags: ["autodocs"] } satisfies Meta<typeof InsertContentMenuControl>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example({ dark = false }: { dark?: boolean }) {
  const [result, setResult] = useState("No insertion requested");
  return <Provider theme={dark ? "dark" : "light"}><InsertContentMenuControl onInsertImage={() => setResult("Image requested")} onInsertHorizontalRule={() => setResult("Horizontal rule requested")} onInsertColumnsLayout={() => setResult("Columns requested")} /><p role="status">{result}</p></Provider>;
}
export const Default: Story = { render: () => <Example /> };
export const Dark: Story = { render: () => <Example dark /> };
export const UnavailableCommands: Story = { args: { onInsertHorizontalRule: () => {} } };

/** Host owns dialog content, requests and final insertion. No editor implementation is involved. */
export const NativeInsertionHandoff: Story = {
  render: () => <Provider><NativeInsertionHost /></Provider>,
};
