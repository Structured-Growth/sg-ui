import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Box } from "../Box/Box";
import { Stack } from "../Stack/Stack";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import { SplitAction } from "./SplitAction";
import { Provider } from "../Provider/Provider";

const meta = { title: "Migration proofs/SplitAction", component: SplitAction, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Create course", items: [{ id: "import", label: "Import courses" }], onPress: () => {}, onAction: () => {} } } satisfies Meta<typeof SplitAction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

function HostUpdatesExample() {
  const [state, setState] = useState<"ready" | "loading" | "disabled">("ready");
  const [replacement, setReplacement] = useState(false);
  const [result, setResult] = useState("No action");
  const [mounted, setMounted] = useState(true);
  return <Box onKeyDown={event => {
    if (!event.altKey) return;
    if (event.key === "l") setState("loading");
    else if (event.key === "d") setState("disabled");
    else if (event.key === "r") setReplacement(true);
    else if (event.key === "u") setMounted(false);
    else return;
    event.preventDefault();
  }}>
    <Stack gap={2}>
      <Typography>Open the menu, then use Alt+L for pending, Alt+D for disabled, Alt+R to replace host actions, or Alt+U to remove the control.</Typography>
      {mounted && <SplitAction label="Create course" loading={state === "loading"} disabled={state === "disabled"}
        items={[{ id: replacement ? "upload" : "import", label: replacement ? "Upload courses" : "Import courses" }, { id: "locked", label: "Unavailable", disabled: true }]}
        onPress={() => setResult(replacement ? "Replacement primary" : "Original primary")}
        onAction={id => setResult(`${replacement ? "Replacement" : "Original"} ${id}`)} />}
      <Button onPress={() => { setState("ready"); setMounted(true); }}>Restore actions</Button>
      <Typography role="status">{result}</Typography>
    </Stack>
  </Box>;
}
export const HostUpdates: Story = { render: () => <HostUpdatesExample /> };
