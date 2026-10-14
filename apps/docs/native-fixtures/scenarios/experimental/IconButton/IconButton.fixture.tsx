import type { Meta, StoryObj } from "../../../types";
import { IconButton } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
import { AddIcon } from "@structured-growth/sg-ui/experimental/icons";
const meta = { title: "Migration proofs/IconButton", component: IconButton, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Add course", children: <AddIcon /> } } satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
