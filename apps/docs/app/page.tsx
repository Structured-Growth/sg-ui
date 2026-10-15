import { Surface } from '@structured-growth/sg-ui/experimental';
import { Link, Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { DocPage } from '../components/DocPage';
import styles from '../components/docs.module.css';
export default function Home() { return <DocPage title="Build with Structured Growth UI" description="Owned React components for thoughtful, accessible application interfaces.">
  <Stack direction="row" wrap gap={3}><Link href="/installation">Get started →</Link><Link href="/docs/components">Explore components →</Link></Stack>
  <Surface variant="outlined" padding={4}><Stack gap={2}><Typography as="h2" variant="h5">Explore the possibilities</Typography><Typography>Change props, compare variants and try real interactions. This documentation site uses the same library you install.</Typography></Stack></Surface>
  <Stack className={styles.grid}>{[{title:'Component playgrounds',text:'Inspect variants, tones, density and interaction states.',href:'/docs/components'},{title:'Your visual identity',text:'Use owned theme scopes and token overrides for your application.',href:'/theming'},{title:'Commercial licensing',text:'Public source with a written commercial agreement.',href:'/licensing'}].map(item => <Surface key={item.title} variant="outlined" padding={4}><Stack gap={2}><Typography as="h2" variant="h5">{item.title}</Typography><Typography tone="muted">{item.text}</Typography><Link href={item.href}>Learn more →</Link></Stack></Surface>)}</Stack>
</DocPage>; }
