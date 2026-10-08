import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ThemeScope } from "./ThemeScope";
import { tokens } from "./tokens.generated";
import tokenSource from "./tokens.json";
import { Box } from "../experimental/Box/Box";
import { Button } from "../experimental/Button/Button";
import { Progress } from "../experimental/Progress/Progress";
import { Stack } from "../experimental/Stack/Stack";
import { Surface } from "../experimental/Surface/Surface";
import { Typography } from "../experimental/Typography/Typography";

const themes = ["light", "dark"] as const;
const densities = ["compact", "comfortable"] as const;
const palette = ["surface", "surfaceSubtle", "text", "textMuted", "border", "divider",
  "action", "actionHover", "onAction", "danger", "focus", "backdrop"] as const;
const spaces = ["space1", "space2", "space3", "space4"] as const;

const meta = {
  title: "Foundations/Foundation Catalogue",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: "D-20: production semantic palettes, spacing, density, surfaces, keyboard focus and motion. Typography roles (including bodyAlt2) and font metadata are covered by [Foundations/Typefaces](?path=/story/foundations-typefaces--defaults). The shared Storybook Provider supplies production tokens, locale and direction. Use the theme/density/direction toolbar for inherited examples; explicit light/dark comparisons remain fixed. No token overrides or simulated preference styles are used." } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ThemeComparison({ children }: { children: ReactNode }) {
  return <Stack gap={4}>
    {themes.map(theme => <ThemeScope key={theme} theme={theme} style={{ background: tokens.surface, padding: tokens.space4 }}>
      <Stack gap={4}>
        <Typography as="h2" variant="h5">{theme} theme</Typography>
        {children}
      </Stack>
    </ThemeScope>)}
  </Stack>;
}

export const Palettes: Story = {
  render: () => <ThemeComparison>
    <Typography>Semantic colors change with the production scope. Labels remain outside swatches so color alone does not identify a token.</Typography>
    <Stack direction="row" wrap gap={4}>
      {palette.map(name => <Stack key={name} gap={2}>
        <Box aria-hidden="true" style={{ inlineSize: "calc(4 * var(--sgui-space4))", blockSize: "calc(3 * var(--sgui-space4))", background: tokens[name], border: `1px solid ${tokens.border}` }} />
        <Typography variant="code" as="code">{name}</Typography>
        <Typography variant="caption" tone="muted">{tokens[name]}</Typography>
      </Stack>)}
    </Stack>
    <Stack direction="row" wrap gap={3}>
      <Typography>Default text on surface</Typography>
      <Typography tone="muted">Muted text on surface</Typography>
      <Typography tone="primary">Primary text on surface</Typography>
      <Typography tone="danger">Danger text on surface</Typography>
      <Button>Action / onAction</Button>
    </Stack>
  </ThemeComparison>,
};

export const Spacing: Story = {
  render: () => <Stack gap={4}>
    <Typography as="h1" variant="h4">Production spacing scale</Typography>
    <Typography>Bars show each shared spacing step; outlined examples apply the same token as padding. Rem lengths follow the host root text size.</Typography>
    {spaces.map((name, index) => <Stack key={name} gap={2}>
      <Typography as="h2" variant="bodyAlt2">{name}: {tokenSource.shared[name].$value}</Typography>
      <Box aria-hidden="true" data-spacing-bar={name} style={{ inlineSize: tokens[name], blockSize: tokens.space4, background: tokens.action }} />
      <Surface variant="outlined" padding={(index + 1) as 1 | 2 | 3 | 4}>
        <Typography variant="body2">Padding uses {tokens[name]}</Typography>
      </Surface>
    </Stack>)}
  </Stack>,
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView!;
    const widths = spaces.map(name => {
      const bar = canvasElement.querySelector<HTMLElement>(`[data-spacing-bar="${name}"]`)!;
      return Number.parseFloat(view.getComputedStyle(bar).inlineSize);
    });
    expect(widths[0]).toBeGreaterThan(0);
    widths.slice(1).forEach((width, index) => expect(width).toBeGreaterThan(widths[index]));
  },
};

export const Density: Story = {
  render: () => <ThemeComparison>
    <Typography>Identical controls inherit each density scope. Control height and horizontal padding come from production density tokens.</Typography>
    {densities.map(density => <ThemeScope key={density} density={density}>
      <Stack gap={3}>
        <Typography as="h3" variant="bodyAlt2">{density}</Typography>
        <Typography variant="code" as="code">{tokens.controlHeight} / {tokens.controlPadding}</Typography>
        <Stack direction="row" wrap gap={2}>
          <Button>{density} primary</Button>
          <Button variant="outlined" tone="neutral">{density} neutral</Button>
          <Button variant="text">{density} text</Button>
          <Button disabled>{density} disabled</Button>
        </Stack>
      </Stack>
    </ThemeScope>)}
  </ThemeComparison>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const view = canvasElement.ownerDocument.defaultView!;
    const compact = canvas.getAllByRole("button", { name: "compact primary" });
    const comfortable = canvas.getAllByRole("button", { name: "comfortable primary" });
    compact.forEach((button, index) => {
      const smaller = view.getComputedStyle(button);
      const larger = view.getComputedStyle(comfortable[index]);
      expect(Number.parseFloat(smaller.minBlockSize)).toBeGreaterThan(0);
      expect(Number.parseFloat(larger.minBlockSize)).toBeGreaterThan(Number.parseFloat(smaller.minBlockSize));
      expect(Number.parseFloat(larger.paddingInlineStart)).toBeGreaterThan(Number.parseFloat(smaller.paddingInlineStart));
    });
  },
};

export const Surfaces: Story = {
  render: () => <ThemeComparison>
    <Typography>Every owned surface tone and variant uses the production surface, divider, radius and shadow tokens.</Typography>
    <Stack direction="row" wrap gap={4}>
      {(["default", "subtle"] as const).flatMap(tone =>
        (["flat", "outlined", "raised"] as const).map(variant => <Surface key={`${tone}-${variant}`} tone={tone} variant={variant} padding={4}>
          <Typography as="h3" variant="subtitle2">{tone} / {variant}</Typography>
          <Typography variant="body2">Surface text</Typography>
          <Typography variant="caption" tone="muted">Secondary text</Typography>
        </Surface>))}
    </Stack>
  </ThemeComparison>,
};

function FocusExample() {
  const [activations, setActivations] = useState(0);
  return <Stack gap={4}>
    <Typography as="h1" variant="h4">Keyboard focus</Typography>
    <Typography>Tab and Shift+Tab through the actions. Activate with Enter or Space. The disabled action is skipped. Change the global theme to inspect the ring on either surface; enable OS forced colors for the production system-color treatment.</Typography>
    <Typography variant="code" as="code">{tokens.focusWidth} / {tokens.focusOffset} / {tokens.focus}</Typography>
    <Surface tone="subtle" variant="outlined" padding={4}>
      <Stack direction="row" wrap gap={4}>
        <Button onPress={() => setActivations(count => count + 1)}>Primary focus action</Button>
        <Button variant="outlined" tone="neutral" onPress={() => setActivations(count => count + 1)}>Neutral focus action</Button>
        <Button disabled>Disabled focus action</Button>
        <Button variant="text" onPress={() => setActivations(count => count + 1)}>Text focus action</Button>
      </Stack>
    </Surface>
    <Typography role="status">Activations: {activations}</Typography>
  </Stack>;
}

export const KeyboardFocus: Story = {
  render: () => <FocusExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primary = canvas.getByRole("button", { name: "Primary focus action" });
    const neutral = canvas.getByRole("button", { name: "Neutral focus action" });
    // Establish the canvas starting point, then exercise actual keyboard traversal.
    primary.focus();
    await userEvent.tab();
    expect(neutral).toHaveFocus();
    expect(neutral).toHaveAttribute("data-focus-visible");
    await userEvent.keyboard(" ");
    expect(canvas.getByRole("status")).toHaveTextContent("Activations: 1");
    await userEvent.tab();
    expect(canvas.getByRole("button", { name: "Text focus action" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(neutral).toHaveFocus();
  },
};

export const MotionAndPreferences: Story = {
  render: () => <Stack gap={4}>
    <Typography as="h1" variant="h4">Production motion and display preferences</Typography>
    <Typography>Hover or press the action to inspect its background transition ({tokenSource.shared.motionDuration.$value}, {tokens.motionDuration}). Pending and indeterminate indicators use their existing production animations.</Typography>
    <Typography>Enable reduced motion in the OS or browser rendering tools: the button transition and spinner stop, circular progress stops rotating, and linear progress becomes a static full-width indicator. Progress names and determinate values remain available. Enable forced colors to inspect system focus, disabled and progress colors. Changing a theme or a token is not preference emulation.</Typography>
    <Stack direction="row" wrap gap={4}>
      <Button>Hover or press action</Button>
      <Button loading>Pending action</Button>
      <Button disabled>Unavailable action</Button>
    </Stack>
    <Progress label="Indeterminate linear work" />
    <Progress variant="circular" label="Indeterminate circular work" />
    <Progress label="Determinate work" value={40} valueText="40 of 100" />
  </Stack>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("progressbar", { name: "Determinate work" })).toHaveAttribute("aria-valuenow", "40");
    expect(canvas.getByRole("progressbar", { name: "Indeterminate linear work" })).not.toHaveAttribute("aria-valuenow");
    const circular = canvas.getByRole("progressbar", { name: "Indeterminate circular work" });
    expect(circular).not.toHaveAttribute("aria-valuenow");
    const view = canvasElement.ownerDocument.defaultView!;
    const animation = view.getComputedStyle(circular.querySelector("svg")!).animationName;
    const reduced = view.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) expect(animation).toBe("none");
    else expect(animation).not.toBe("none");
  },
};
