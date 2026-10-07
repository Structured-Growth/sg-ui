import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeScope } from "../../foundation/ThemeScope";
import { Button } from "../../experimental/Button/Button";
import { Typography } from "../../experimental/Typography/Typography";
import { ClassCardFrame } from "./ClassCardFrame";

const meta = {
  title: "Components/ClassCardFrame",
  component: ClassCardFrame,
  args: {
    header: <Typography variant="h5">Week 1 Module</Typography>,
    body: <Typography variant="body1">This section covers baseline practical defense skills.</Typography>,
    footer: <Button density="compact" variant="filled">Open</Button>,
  },
  decorators: [
    (Story) => (
      <ThemeScope><div style={{ padding: 16 }}>
        <Story />
      </div></ThemeScope>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof ClassCardFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutFooter: Story = {
  args: {
    footer: undefined,
  },
};

export const StyledSlots: Story = { args: { headerClassName: "host-header", bodyStyle: { minHeight: 120 }, footerStyle: { padding: 16 } } };

export const Dark: Story = { render: args => <ThemeScope theme="dark"><ClassCardFrame {...args} /></ThemeScope> };

// Host content intentionally includes raw text and an intrinsic-width image.
const longLabel = "AdvancedCourseMaterialWithoutWordSeparatorsForResponsiveFrameAcceptance";
const illustration = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#697b91"/></svg>')}`;

export const ResponsiveSlots: Story = {
  render: () => <div data-testid="frame-cases" style={{ display: "grid", gap: 16, minWidth: 0 }}>
    {[
      { name: "default", width: undefined },
      { name: "minimum", width: 360 },
      { name: "custom", width: 500 },
      { name: "style override", width: 500, style: { maxInlineSize: 280 } },
    ].map(({ name, ...props }) => <div key={name} data-testid={`case-${name}`}>
      <ClassCardFrame {...props}
        header={<><Typography variant="h5" as="h3">{name}: {longLabel}</Typography><span>{longLabel}</span></>}
        body={<><img src={illustration} alt="Course illustration" width={1200} height={600} /><Typography variant="body1">Long course descriptions remain available as the card shrinks and text grows.</Typography></>}
        footer={<><span>{longLabel}</span><Button density="compact">Open course</Button></>} />
    </div>)}
    <div data-testid="case-empty"><ClassCardFrame header={null} body={null} footer={false} /></div>
    <div data-testid="case-no-footer"><ClassCardFrame header="Header only and body" body="Body without a footer" /></div>
  </div>,
};

function WidthStateExample() {
  const [width, setWidth] = useState<number | undefined>();
  return <>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button onPress={() => setWidth(360)}>Use 360</Button>
      <Button onPress={() => setWidth(500)}>Use 500</Button>
      <Button onPress={() => setWidth(undefined)}>Use default</Button>
    </div>
    <ClassCardFrame width={width} header="Width changes preserve the same frame" body={<img src={illustration} alt="Course illustration" width={1200} height={600} />} />
  </>;
}
export const WidthStates: Story = { render: () => <WidthStateExample /> };
