import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppButton } from "../AppButton";
import { LinkUrlModal } from "./LinkUrlModal";

const meta = {
  title: "Editors/LinkUrlModal",
  component: LinkUrlModal,
  tags: ["autodocs"],
  args: { open: false, onClose: () => {}, onSubmit: () => {} },
} satisfies Meta<typeof LinkUrlModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [lastDisplayText, setLastDisplayText] = useState("Example");
    const [lastValue, setLastValue] = useState<string | null>("https://example.com");
    const [session, setSession] = useState(0);

    return (
      <>
        <AppButton
          onPress={() => {
            setSession((current) => current + 1);
            setOpen(true);
          }}
          density="compact"
          variant="outlined"
        >
          Open Link Modal
        </AppButton>
        <LinkUrlModal
          initialDisplayText={lastDisplayText}
          key={session}
          initialUrl={lastValue ?? ""}
          onClose={() => setOpen(false)}
          onSubmit={({ displayText, url }) => {
            setLastDisplayText(displayText);
            setLastValue(url);
            setOpen(false);
          }}
          open={open}
        />
      </>
    );
  },
};
