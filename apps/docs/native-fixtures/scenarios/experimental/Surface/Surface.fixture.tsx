import type { Meta, StoryObj } from "../../../types";
import { Surface } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Surface", component: Surface, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
