import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Status } from "./Status";
import { Button } from "../Button/Button";
import { Provider } from "../Provider/Provider";
const meta = { title: "Migration proofs/Status", component: Status, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "All changes saved" },
} satisfies Meta<typeof Status>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Quiet: Story = {};
export const MeaningfulAnnouncement: Story = { render: () => {
  const [message, setMessage] = useState("");
  return <><Button onPress={() => setMessage("Course saved")}>Save course</Button><Status announcement="polite">{message}</Status></>;
} };
export const Error: Story = { args: { children: "Upload failed. Try again.", tone: "danger" } };
