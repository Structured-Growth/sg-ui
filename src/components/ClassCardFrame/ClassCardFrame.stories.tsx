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

const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><rect width="600" height="900" fill="#697b91"/></svg>')}`;

function ParentResizeExample({ layout }: { layout: "flex" | "grid" }) {
  const [compact, setCompact] = useState(false);
  const [requests, setRequests] = useState(0);
  return <div data-testid="resize-example" data-state={compact ? "compact" : "expanded"}>
    <Typography variant="body1">The focused action resizes its host and replaces header/footer content together.</Typography>
    <div data-testid="resize-parent" style={{
      display: layout, inlineSize: compact ? 240 : 680, maxInlineSize: "100%", gap: 16,
      ...(layout === "grid" ? { gridTemplateColumns: "64px minmax(0, 1fr)" } : {}),
    }}>
      <aside aria-label="Host sidebar" style={{ inlineSize: 64, flexShrink: 0, minInlineSize: 0 }}>
        <Typography variant="body2">Host</Typography>
      </aside>
      <div data-testid="frame-host" style={{ minInlineSize: 0, flex: "1 1 0" }}>
        <ClassCardFrame
          header={compact
            ? <Typography key="compact" variant="h5" as="h3">{longLabel}</Typography>
            : <div key="expanded"><Typography variant="h5" as="h3">Course preview</Typography><img src={portrait} alt="Header portrait" width={600} height={900} /></div>}
          body={<Typography variant="body1">Resizing the parent preserves this body and its focused action.</Typography>}
          footer={<>
            {compact
              ? <div key="compact"><img src={illustration} alt="Footer landscape" width={1200} height={600} /><Typography variant="body2">{longLabel}</Typography></div>
              : <Typography key="expanded" variant="body2">Ready to preview</Typography>}
            <Button key="action" density="compact" onPress={() => { setCompact(value => !value); setRequests(value => value + 1); }}>Resize course preview</Button>
          </>} />
      </div>
    </div>
    <output aria-label="Resize requests">{requests}</output>
  </div>;
}

export const FlexParentResize: Story = { render: () => <ParentResizeExample layout="flex" /> };
export const GridParentResize: Story = { render: () => <ParentResizeExample layout="grid" /> };
