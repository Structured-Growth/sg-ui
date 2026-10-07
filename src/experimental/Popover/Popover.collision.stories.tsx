import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "../Provider/Provider";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";
import { Popover, type PopoverProps } from "./Popover";

export interface CollisionFixtureProps {
  placement: NonNullable<PopoverProps["placement"]>;
  theme: "light" | "dark";
  dir: "ltr" | "rtl";
  enlarged: boolean;
  host: boolean;
}

/** Host layout only: no positioning/focus repair and no override of overlay bounds. */
export function CollisionFixture({ placement, theme, dir, enlarged, host }: CollisionFixtureProps) {
  const top = placement.startsWith("top");
  const right = placement.endsWith("start") ? dir === "rtl" : dir === "ltr";
  return <Provider theme={theme} dir={dir} density="comfortable" style={enlarged ? {
    "--sgui-body-size": "1.5rem", "--sgui-label-size": "1.5rem",
  } : undefined}>
    <div data-testid="collision-host" style={host ? {
      position: "fixed", inset: "20% 24px", overflow: "auto", border: "1px solid var(--sgui-border)",
      background: "var(--sgui-surface)",
    } : { position: "fixed", inset: 0, pointerEvents: "none" }}>
      <div style={host ? { position: "relative", height: "900px", width: "100%" } : undefined}>
        <div data-testid="collision-anchor" style={host ? {
          position: "absolute", top: "100px", left: right ? undefined : "16px", right: right ? "16px" : undefined,
        } : {
          position: "fixed", top: top ? "8px" : undefined, bottom: top ? undefined : "8px",
          left: right ? undefined : "8px", right: right ? "8px" : undefined, pointerEvents: "auto",
        }}>
          <Popover placement={placement} title="Collision settings" trigger={<Button variant="outlined" tone="neutral">Open settings</Button>}>
            <div style={{ display: "grid", gap: "var(--sgui-space3)" }}>
              <TextField label="Note" />
              <Button variant="outlined" tone="neutral">Review note</Button>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  </Provider>;
}

const meta = {
  title: "Migration proofs/Popover collision", component: CollisionFixture,
  args: { placement: "bottom start", theme: "light", dir: "ltr", enlarged: false, host: false },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CollisionFixture>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ViewportEdge: Story = {};
export const ScrollableHost: Story = { args: { host: true } };
