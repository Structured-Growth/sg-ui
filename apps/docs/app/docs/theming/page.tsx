import { Typography, Link } from '@structured-growth/sg-ui/primitives';
import { DocPage } from '../../../components/DocPage';
import { ThemePipelineExplorer } from '../../../components/ThemePipelineExplorer';
export const metadata = {title:'Theming'};
export default function Page() { return <DocPage title="Theming" description="Choose an identity, appearance and contrast independently.">
  <Typography>Identity defines colors, typography and shape. The examples offer Material Design, Apple Human Interface and Editorial. Material uses tonal surfaces and rounded actions; Apple uses system typography and neutral surfaces with blue accents. These are SGUI interpretations of their design languages. Each supports light/dark appearance and increased contrast.</Typography>
  <Typography>Appearance can follow your system or explicitly use light/dark. Contrast can follow your system, use standard contrast or increase contrast. Follow system responds to changes while the page is open; previews initially use a stable light/default server snapshot and resolve preferences after hydration.</Typography>
  <Typography>Operating-system forced colors always take precedence. The previews use system colors and preserve focus indicators. The browser may also recolor the website in that mode; demo selectors themselves only affect previews and their portals.</Typography>
  <Typography>The website retains its Structured Growth identity. The shared Demo settings toolbar carries identity, appearance and contrast across component pages. Prop controls and source panels stay separate from live preview scopes. Component source panels contain component imports, state and JSX. Applications own stylesheet loading, theme setup and system-preference subscriptions; see the installation guidance.</Typography>
  <Typography>Theme colors follow four layers: named identity palettes → appearance/contrast semantic mappings → component tokens → component styles. Change a semantic role to update all components using it, or override a component token within a scope for a specific treatment. Typography, shape and density use shared foundation roles. The UI package owns component aliases and styles; this website owns its identity palettes and mappings. Applications can provide their own mappings through Provider or ThemeScope.</Typography>
  <ThemePipelineExplorer />
  <Link href="https://m3.material.io/styles/color/the-color-system">Material Design color reference</Link><Link href="https://developer.apple.com/design/human-interface-guidelines">Apple Human Interface Guidelines</Link>
  <Link href="/docs/components/button">Explore identities with buttons →</Link><Link href="/docs/components/dialog">Explore themed dialog portals →</Link>
</DocPage>; }
