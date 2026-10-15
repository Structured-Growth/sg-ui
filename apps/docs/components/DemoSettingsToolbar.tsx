'use client';
import { usePathname } from 'next/navigation';
import catalog from '../content/catalog.json';
import { Select } from '@structured-growth/sg-ui/experimental';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { identities } from './demo-theme';
import { useDemoSettings } from './DemoSettings';
const componentRoutes = new Set(catalog.map(entry=>`/docs/components/${entry.slug}`));
export function DemoSettingsToolbar() {
  const pathname = usePathname();
  const {mode, identity, contrast, resolvedMode, resolvedContrast, forcedColors, setMode, setIdentity, setContrast} = useDemoSettings();
  if (!componentRoutes.has(pathname)) return null;
  return (
    <Stack gap={2}>
      <Typography variant="caption" tone="muted">Live previews only · shared across component pages</Typography>
      <Select label="Demo theme" value={identity} options={identities.map(item => ({...item}))} onValueChange={value => {if(value === 'none' || value === 'material' || value === 'apple' || value === 'editorial') setIdentity(value);}} />
      <Select label="Demo appearance" value={mode} options={[{id:'system',label:'Follow system'},{id:'light',label:'Light'},{id:'dark',label:'Dark'}]} onValueChange={value => {if(value === 'system' || value === 'light' || value === 'dark') setMode(value);}} />
      <Select label="Demo contrast" value={contrast} options={[{id:'system',label:'Follow system'},{id:'standard',label:'Standard'},{id:'increased',label:'Increased'}]} onValueChange={value => {if(value === 'system' || value === 'standard' || value === 'increased') setContrast(value);}} />
      <Typography variant="caption" aria-live="polite">Resolved: {resolvedMode} · {resolvedContrast} contrast{forcedColors ? ' · operating-system colors active' : ''}{identity === 'none' ? ' · library defaults; no identity override' : ''}</Typography>
    </Stack>
  );
}
