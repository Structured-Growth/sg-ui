import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup } from "./ButtonGroup";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
import { Link } from "../Link/Link";
import { ThemeScope } from "../../foundation/ThemeScope";
const meta = { title: "Migration proofs/ButtonGroup", component: ButtonGroup, tags: ["autodocs"], decorators: [(Story) => <Provider><Story /></Provider>], args: { label: "Course actions", joined: true, children: <><Button tone="neutral" variant="text">Create</Button><Button tone="neutral" variant="text">Import</Button></> } } satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const JoinedOrientations: Story = {
  render: () => <>{(["ltr", "rtl"] as const).map(dir =>
    <Provider key={dir} dir={dir}>
      {(["comfortable", "compact"] as const).map(density =>
        <ThemeScope key={density} density={density}>
          {(["horizontal", "vertical"] as const).map(orientation =>
            <ButtonGroup key={orientation} label={`${dir} ${density} ${orientation}`} joined orientation={orientation}>
              <Button variant="text" tone="neutral">Create</Button>
              <Button variant="text" tone="neutral" disabled>Import</Button>
              <Button variant="text" tone="neutral">Archive</Button>
            </ButtonGroup>)}
        </ThemeScope>)}
    </Provider>)}</>,
};

export const NestedActions: Story = {
  render: () => <>
    <Button>Before group</Button>
    <ButtonGroup label="Nested course actions">
      <Button>Create</Button>
      <Button disabled>Import</Button>
      <div><Button>Archive</Button><Link href="#course-details">Course details</Link></div>
    </ButtonGroup>
    <Button>After group</Button>
  </>,
};
