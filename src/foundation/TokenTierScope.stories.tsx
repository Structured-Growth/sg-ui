import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider, ThemeScope, type ColorTheme, type Density, type ScopeStyle } from "../theme";
import { AppButton } from "../components/AppButton/AppButton";
import { Popover, Typography } from "../experimental";
import { tokens, tokenTiers, type TokenName } from "./tokens.generated";

const meta = { title: "Foundations/TokenTierScope", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// These are declared role swatches, not component state implementations. Actual
// AppButton/Popover styles still consume their existing semantic/density roles.
const colorRoles: readonly TokenName[] = [...tokenTiers.semantic,
  "buttonPrimaryBackground", "buttonPrimaryHoverBackground", "buttonPrimaryPressedBackground", "buttonPrimaryText",
  "buttonNeutralBackground", "buttonNeutralHoverBackground", "buttonNeutralPressedBackground", "buttonNeutralText",
  "buttonDestructiveBackground", "buttonDestructiveHoverBackground", "buttonDestructivePressedBackground", "buttonDestructiveText",
  "fieldBackground", "fieldText", "fieldBorder", "fieldInvalidBorder", "menuBackground", "menuHoverBackground",
  "menuPressedBackground", "menuSelectedBackground", "menuSelectedText", "menuSeparator", "dialogBackground",
  "dialogBackdrop", "cardBackground", "cardBorder", "controlFocusColor"];
const layout: ScopeStyle = { padding: tokens.space4, background: tokens.surface };

function RoleSwatches() {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: tokens.space2 }}>
    {colorRoles.map(role => <div key={role}>
      <Typography>{role}</Typography>
      <div data-token-role={role} aria-hidden="true" style={{ backgroundColor: tokens[role], height: tokens.space4 }} />
    </div>)}
    <div data-token-geometry="" style={{ minHeight: tokens.buttonHeight, paddingInline: tokens.buttonPadding,
      borderRadius: tokens.buttonRadius, outline: `${tokens.controlFocusWidth} solid ${tokens.controlFocusColor}`,
      outlineOffset: tokens.controlFocusOffset, boxShadow: tokens.dialogShadow }}>Declared component geometry</div>
  </div>;
}

export const NestedOverrides: Story = { render: () => <ThemeScope theme="light" density="comfortable" data-testid="alias-parent" style={{ ...layout,
  "--sgui-action": "#005a9c", "--sgui-action-hover": "#075985", "--sgui-danger": "#991b1b" }}>
  <Typography as="h2" variant="h3">Parent semantic overrides</Typography>
  <RoleSwatches /><AppButton>Parent actual action</AppButton>
  <ThemeScope density="compact" data-testid="alias-child" style={{ ...layout,
    "--sgui-action": "#6b21a8", "--sgui-action-hover": "#581c87", "--sgui-danger": "#9f1239", "--sgui-surface-raised": "#fef3c7" }}>
    <Typography as="h3" variant="h3">Nested semantic overrides</Typography>
    <RoleSwatches /><AppButton>Child actual action</AppButton>
    <ThemeScope data-testid="alias-component" style={{ ...layout, "--sgui-button-primary-background": "#166534" }}>
      <Typography>Independent component slot override</Typography>
      <RoleSwatches /><AppButton>Component scope actual action</AppButton>
    </ThemeScope>
  </ThemeScope>
  <ThemeScope theme="dark" data-testid="alias-dark" style={layout}>
    <Typography>Explicit dark boundary with inherited host variables</Typography><RoleSwatches />
  </ThemeScope>
</ThemeScope> };

function SwitchingExample() {
  const [theme, setTheme] = useState<ColorTheme>("light");
  const [density, setDensity] = useState<Density>("comfortable");
  return <>
    <div style={{ display: "flex", gap: tokens.space2, flexWrap: "wrap" }}>
      {(["light", "dark", "system"] as const).map(value => <AppButton key={value} onPress={() => setTheme(value)}>Use {value} theme</AppButton>)}
      {(["compact", "comfortable"] as const).map(value => <AppButton key={value} onPress={() => setDensity(value)}>Use {value} density</AppButton>)}
    </div>
    <Provider theme={theme} density={density} data-testid="switch-scope" style={layout}>
      <Typography as="h2" variant="h3">Live scope</Typography><RoleSwatches /><AppButton>Switch actual action</AppButton>
      <ThemeScope data-testid="switch-inherited"><AppButton>Inherited actual action</AppButton><RoleSwatches /></ThemeScope>
      <ThemeScope theme="dark" density="compact" data-testid="switch-fixed"><AppButton>Fixed actual action</AppButton><RoleSwatches /></ThemeScope>
    </Provider>
    <ThemeScope theme="light" density="comfortable" data-testid="reference-light"><RoleSwatches /></ThemeScope>
    <ThemeScope theme="dark" density="compact" data-testid="reference-dark"><RoleSwatches /></ThemeScope>
  </>;
}
export const Switching: Story = { render: () => <SwitchingExample /> };

export const PortaledScope: Story = { render: () => <>
  <Provider theme="dark" density="compact" data-testid="portal-owner" style={{ ...layout, width: "32rem",
    "--sgui-action": "#22d3ee", "--sgui-danger": "#fda4af", "--sgui-surface": "#172554",
    "--sgui-surface-raised": "#312e81", "--sgui-button-primary-background": "#a3e635" }}>
    <Popover title="Scoped token dialog" trigger={<AppButton>Open scoped token dialog</AppButton>}>
      <div data-testid="portal-content"><RoleSwatches /><AppButton>Portal actual action</AppButton>
        <ThemeScope density="comfortable" data-testid="portal-comfortable"><RoleSwatches /><AppButton>Portal comfortable action</AppButton></ThemeScope>
      </div>
    </Popover>
    <RoleSwatches />
  </Provider>
  <Provider theme="light" density="comfortable" data-testid="adjacent-host" style={{ ...layout,
    "--sgui-action": "#92400e", "--sgui-surface": "#fff7ed" }}>
    <Typography>Adjacent host scope</Typography><RoleSwatches /><AppButton>Adjacent actual action</AppButton>
  </Provider>
</> };

function DeclaredPairsExample() {
  return <>{(["light", "dark"] as const).map(theme => <ThemeScope key={theme} theme={theme} data-testid={`pairs-${theme}`} style={layout}>
    <Typography as="h2" variant="h3">{theme} declared default roles</Typography><RoleSwatches />
    <AppButton>Forced colors {theme} action</AppButton><AppButton disabled>Forced colors {theme} disabled</AppButton>
  </ThemeScope>)}</>;
}
export const DeclaredPairs: Story = { render: () => <DeclaredPairsExample /> };
