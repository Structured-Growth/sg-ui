import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitAction } from "./SplitAction";
import { Provider } from "../Provider/Provider";

const meta = { title: "Migration proofs/SplitAction", component: SplitAction, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Create course", items: [{ id: "import", label: "Import courses" }], onPress: () => {}, onAction: () => {} } } satisfies Meta<typeof SplitAction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
