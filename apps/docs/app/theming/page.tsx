import {Surface} from '@structured-growth/sg-ui/experimental';
import {Stack,Typography,Link} from '@structured-growth/sg-ui/primitives';
import {DocPage,Code} from '../../components/DocPage';
import {ThemePipelineExplorer} from '../../components/ThemePipelineExplorer';
import {FoundationExamples} from '../../components/FoundationExamples';
export const metadata={title:'Theming'};

export default function Page() {
  return <DocPage title="Theming" description="How global decisions become semantic roles, component styles and scoped overrides.">
    <Surface as="section" aria-label="Theming hierarchy" variant="outlined" padding={4}>
      <Stack gap={3}>
        <Typography as="h2" variant="h5">The framework</Typography>
        <Typography>A theme is a set of decisions and relationships. A color palette supplies the available colors; semantic roles explain their purpose; component tokens connect that purpose to a particular control. The application chooses where those decisions apply.</Typography>
        <Code>{`Global theme decisions
  Identity + appearance + contrast
  Typography + shape + spacing + density
    ↓
Named color palettes → semantic mappings → component tokens → component styles
    ↓
Application scope → nested scopes and targeted overrides`}</Code>
        <Typography tone="muted">The dependency direction stays consistent. Components use named roles through their own tokens; they do not choose raw palette colors themselves.</Typography>
      </Stack>
    </Surface>

    <Surface as="section" aria-labelledby="global-theming" variant="outlined" padding={4}><Stack gap={3}>
      <Typography id="global-theming" as="h2" variant="h5">1. Global theming</Typography>
      <Typography>Global theming establishes the shared contract for an application: its visual identity, typography, shape, spacing, default density, and policies for appearance and contrast. It provides a coherent starting point for every component in that application scope.</Typography>
      <Typography>The demo theme “None — global defaults” shows the library’s built-in styles without a demo identity override. It retains SGUI typography, spacing, shape, states and accessible controls; it does not remove the stylesheet. Defaults already cover primary actions, neutral actions, surfaces, text, focus, error, warning, success and information. The warning role is amber, errors are red, success is green and informational messaging uses blue. These semantic roles are separate from primary/secondary/tertiary action priority.</Typography>
      <Typography>Keep these decisions independent. Identity describes the visual language. Appearance chooses light or dark surfaces. Contrast chooses standard or increased contrast. Density changes spacing and control geometry. Changing one should not require rebuilding the others.</Typography>
      <Typography>Interaction sizing is independent of density and viewport layout. interactionMode="auto" follows available pointer capabilities; pointer and touch are explicit host overrides. Touch sizing enlarges control targets and navigation icons while keeping the chosen typography and density. A tablet with a keyboard or a touchscreen laptop can support multiple inputs at once.</Typography>
      <Code>{`<Provider density="compact" interactionMode="auto"
  style={{
    "--sgui-compact-control-height": "2rem",
    "--sgui-comfortable-control-height": "2.75rem",
    "--sgui-touch-target-size": "2.75rem",
    "--sgui-touch-navigation-icon-size": "1.25rem"
  }}>
  {/* Application workspace */}
</Provider>`}</Code>
      <Typography>Global means the application-level default. It does not mean styling every element in the document. SGUI uses explicit scopes, so an application can host a differently themed region without changing the surrounding interface.</Typography>
    </Stack></Surface>

    <Surface as="section" aria-labelledby="semantic-theming" variant="outlined" padding={4}><Stack gap={3}>
      <Typography id="semantic-theming" as="h2" variant="h5">2. Semantic theming</Typography>
      <Typography>Semantic roles give the interface a stable vocabulary of intent: surface, text, muted text, action, focus, selection, and validation. A role describes what a color does. It does not describe its hue or the name of a component.</Typography>
      <Code>{`surface / surfaceRaised / surfaceOverlay → layers of the interface
text / textMuted → information hierarchy
action / actionHover / actionPressed / onAction → an action and its states
surfaceSelected / textSelected / borderSelected → a selection treatment
validationError / validationSuccess / focus → meaning and feedback`}</Code>
      <Typography>Roles work in pairs and groups. An action background needs readable onAction text; a selected surface needs readable selected text; focus must remain visible against its surrounding surface. Those relationships remain stable even when the underlying colors change.</Typography>
    </Stack></Surface>

    <Surface as="section" aria-labelledby="color-palettes" variant="outlined" padding={4}><Stack gap={3}>
      <Typography id="color-palettes" as="h2" variant="h5">3. Color palettes</Typography>
      <Typography>A palette is the named inventory of raw colors available to a theme: navy, gold, white, cool-gray shades, and supporting colors. The names belong to the palette, not to a particular button, field, or page.</Typography>
      <Typography>A palette alone does not say which color is a link, a background, or a focus indicator. Keeping values separate from their use lets the same palette support multiple appearances and contrast levels. Typography and shape have their own identity settings; they are not color-palette entries.</Typography>
    </Stack></Surface>

    <Surface as="section" aria-labelledby="palette-mapping" variant="outlined" padding={4}><Stack gap={3}>
      <Typography id="palette-mapping" as="h2" variant="h5">4. From palettes to semantics</Typography>
      <Typography>The semantic map assigns palette colors to roles for a particular identity, appearance, and contrast combination. This is a deliberate design decision, not an automatic lightening or darkening formula. Each combination needs a complete mapping and verified foreground/background pairs.</Typography>
      <Code>{`One palette, two mappings:
  Light: action → navy;      onAction → white
  Dark:  action → light gold; onAction → navy

One component dependency:
  buttonPrimaryBackground → action → palette value
  buttonPrimaryText       → onAction → palette value`}</Code>
      <Typography>Component tokens add the bridge to implementation. A button background references an action role, while a field background references a surface role. Component styles consume those aliases. Change the action role and all components that depend on it can change together; change only the button token and the effect stays specific to buttons.</Typography>
      <Typography>Interaction states need their own considered mappings. Increased contrast strengthens the relevant pairs. Operating-system forced colors take priority over the selected palette and use system colors so the interface remains usable.</Typography>
    </Stack></Surface>

    <Surface as="section" aria-labelledby="application-theme" variant="outlined" padding={4}><Stack gap={3}>
      <Typography id="application-theme" as="h2" variant="h5">5. Application</Typography>
      <Typography>The application owns its identity palettes, semantic mappings, and the policy that selects the active appearance and contrast. SGUI supplies the component contracts, default tokens, styles, and scope mechanism. The resolved semantic values are applied as CSS variables, and the component aliases resolve against that scope.</Typography>
      <Typography>Load the SGUI stylesheet once. Use Provider at the application boundary for the owned visual scope and interaction-locale integration. Use ThemeScope for a nested visual boundary, such as a compact region or a differently themed preview. The host owns document backgrounds, font loading, and application-level preference handling.</Typography>
      <Typography>A scope also defines where customization stops. Theme variables follow nested scopes and SGUI overlay portals; layout styles such as padding stay on their source element. This allows a dialog or menu to match the region that opened it while the surrounding application retains its own theme.</Typography>
      <Typography>This website demonstrates that separation: its navigation and documentation use one fixed application identity, while component previews use independently selected demo settings. Those examples exercise the same framework.</Typography>
      <Stack direction="row" wrap gap={3}><Link href="/installation">Application setup</Link><Link href="/docs/components/provider">Provider</Link><Link href="/docs/components/theme-scope">ThemeScope</Link></Stack>
    </Stack></Surface>

    <Surface as="section" aria-labelledby="theme-overrides" variant="outlined" padding={4}><Stack gap={3}>
      <Typography id="theme-overrides" as="h2" variant="h5">6. Overrides</Typography>
      <Typography>Start with a component’s supported props when they express the intended variant or state. For a theme change, choose the smallest layer that matches the desired reach.</Typography>
      <Typography><strong>Palette change:</strong> update a raw color when every semantic role that references that color should follow the change.</Typography>
      <Typography><strong>Semantic override:</strong> change a role within a scope when every component using that intent should change, such as the action treatment throughout one application region.</Typography>
      <Typography><strong>Component-token override:</strong> change a component alias when one component family needs a different treatment while the shared semantics stay intact.</Typography>
      <Typography><strong>Local scope:</strong> place the override on Provider or ThemeScope around the region that needs it. Nested scopes retain inherited theme variables and can replace individual values. Sibling regions outside that scope keep their own values.</Typography>
      <Typography>Override related states together: background, hover, pressed, foreground, and any affected focus treatment. Verify the resulting contrast and forced-color behavior. Native className/style remain available for context-specific layout; reusable visual decisions belong in the theme or component tokens.</Typography>
    </Stack></Surface>

    <ThemePipelineExplorer />
    <FoundationExamples />
    <Stack direction="row" wrap gap={3}><Link href="/docs/components/button">Inspect themed buttons →</Link><Link href="/docs/components/dialog">Inspect themed overlay portals →</Link></Stack>
  </DocPage>;
}
