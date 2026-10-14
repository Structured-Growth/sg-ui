import type { Meta, StoryObj } from "../../../types";
import { Divider } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Divider", component: Divider, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: {},
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
