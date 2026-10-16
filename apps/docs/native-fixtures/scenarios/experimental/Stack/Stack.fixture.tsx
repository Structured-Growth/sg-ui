import type { Meta, StoryObj } from "../../../types";
import { Button, Stack } from "@structured-growth/sg-ui/experimental";
import { Provider } from "@structured-growth/sg-ui/theme";
const meta = { title: "Migration proofs/Stack", component: Stack, tags: ["autodocs"],
  decorators: [(Story) => <Provider><Story /></Provider>], args: { children: "Course details" },
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Wrapping: Story = { render: () => <div style={{ width: 240 }}>
  {(["ltr", "rtl"] as const).map(dir => <Stack key={dir} role="group" aria-label={`${dir} wrapping actions`} dir={dir} direction="row" wrap gap={2} padding={2}>
    {["First action", "Second action", "Third action"].map(label => <Button key={label}>{label}</Button>)}
  </Stack>)}
</div> };
