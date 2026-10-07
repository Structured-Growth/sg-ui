import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "../../foundation/ThemeScope";
import { TextColorPickerControl } from "./TextColorPickerControl";
import { Button } from "../../experimental/Button/Button";
import { Stack } from "../../experimental/Stack/Stack";
import { Typography } from "../../experimental/Typography/Typography";

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

function NativeTransactionsExample() {
  const [foreground, setForeground] = useState("#123456");
  const [background, setBackground] = useState("#fedcba");
  const [readOnly, setReadOnly] = useState(false);
  const [requests, setRequests] = useState<string[]>([]);
  const document = useRef<HTMLTextAreaElement>(null);
  const selection = useRef({ start: 0, end: 0 });
  const captureSelection = () => {
    if (document.current) selection.current = { start: document.current.selectionStart, end: document.current.selectionEnd };
  };
  const reload = () => { setForeground("#654321"); setBackground("#abcdef"); };
  const request = (mode: "foreground" | "background", next: string) => {
    // The host retains its selection independently of focus inside the picker.
    const { start, end } = selection.current;
    setRequests(previous => [...previous, `${mode}:${next || "inherited"}:${start}-${end}`]);
    if (mode === "foreground") setForeground(next); else setBackground(next);
  };
  return <ThemeScope><Stack gap={3} onKeyDown={event => {
    // Host shortcuts also receive React events from the owned portal while open.
    if (event.altKey && event.key.toLowerCase() === "r") { event.preventDefault(); setReadOnly(true); }
    if (event.altKey && event.key.toLowerCase() === "l") { event.preventDefault(); reload(); }
  }}>
    <Typography>Host owns the saved selection and style requests. Alt+R makes the host read-only; Alt+L reloads host colors, including while a picker is open.</Typography>
    <label>Host document<textarea ref={document} defaultValue="Selected host text" readOnly={readOnly} onBlur={captureSelection} /></label>
    <Stack direction="row" gap={2}>
      <TextColorPickerControl value={foreground} disabled={readOnly} onChange={next => request("foreground", next)} />
      <TextColorPickerControl mode="background" value={background} disabled={readOnly} onChange={next => request("background", next)} />
    </Stack>
    <Stack direction="row" gap={2}>
      <Button onPress={reload}>Reload host colors</Button>
      <Button onPress={() => setReadOnly(previous => !previous)}>{readOnly ? "Resume editing" : "Make read-only"}</Button>
      <Button onPress={() => {
        document.current?.focus();
        document.current?.setSelectionRange(selection.current.start, selection.current.end);
      }}>Return to host selection</Button>
    </Stack>
    <output aria-label="Host foreground">{foreground || "inherited"}</output>
    <output aria-label="Host background">{background || "inherited"}</output>
    <output aria-label="Host requests">{JSON.stringify(requests)}</output>
    <output aria-label="Host editability">{readOnly ? "read-only" : "editable"}</output>
  </Stack></ThemeScope>;
}

export const NativeTransactions: Story = { render: () => <NativeTransactionsExample /> };
