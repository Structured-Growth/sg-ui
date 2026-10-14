'use client';
import { Select, Surface } from '@structured-growth/sg-ui/experimental';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import { identities } from './demo-theme';
import { useDemoSettings } from './DemoSettings';
export function DemoSettingsToolbar() {
  const {mode, identity, contrast, resolvedMode, resolvedContrast, forcedColors, setMode, setIdentity, setContrast} = useDemoSettings();
  return (
    <Surface as="section" aria-label="Demo settings" tone="subtle" padding={4}><Stack gap={2}>
      <Stack direction="row" wrap align="end" justify="between" gap={3}>
        <Stack gap={0}><Typography variant="subtitle2">Demo settings</Typography><Typography variant="caption" tone="muted">Live previews only · shared across pages</Typography></Stack>
        <Stack direction="row" wrap align="end" gap={3}>
        <Select label="Demo theme" value={identity} options={identities.map(item => ({...item}))} onValueChange={value => {if(value === 'material' || value === 'apple' || value === 'editorial') setIdentity(value);}} />
        <Select label="Demo appearance" value={mode} options={[{id:'system',label:'Follow system'},{id:'light',label:'Light'},{id:'dark',label:'Dark'}]} onValueChange={value => {if(value === 'system' || value === 'light' || value === 'dark') setMode(value);}} />
        <Select label="Demo contrast" value={contrast} options={[{id:'system',label:'Follow system'},{id:'standard',label:'Standard'},{id:'increased',label:'Increased'}]} onValueChange={value => {if(value === 'system' || value === 'standard' || value === 'increased') setContrast(value);}} />
        </Stack>
      </Stack>
      <Typography variant="caption" aria-live="polite">Resolved: {resolvedMode} · {resolvedContrast} contrast{forcedColors ? ' · operating-system colors active' : ''}</Typography>
    </Stack></Surface>
  );
}
