'use client';
import { ThemeScope, type Density } from '@structured-growth/sg-ui/theme';
import { useDemoSettings } from './DemoSettings';
import { demoTokens } from './demo-theme';
import { useId, useState, type ReactNode } from 'react';
import { AppButton } from '@structured-growth/sg-ui/components/AppButton';
import { Disclosure, Surface } from '@structured-growth/sg-ui/experimental';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import styles from './docs.module.css';
/** Every published example pairs its preview with copyable, current-state source. */
export function Example({ title, description, source, controls, density = 'comfortable', children }: {
  title: string; description?: string; source: string; controls?: ReactNode; density?: Density; children: ReactNode;
}) {
  const {resolvedMode, resolvedContrast, identity, forcedColors} = useDemoSettings();
  const id = useId(); const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(source); setCopied(source); setFailed(false); }
    catch { setFailed(true); setCopied(null); }
  }
  return <Surface as="section" aria-labelledby={id} variant="outlined" padding={4}>
    <Stack gap={3}>
      <Typography id={id} as="h2" variant="h5">{title}</Typography>
      {description && <Typography tone="muted">{description}</Typography>}
      {controls}
      <ThemeScope theme={resolvedMode} density={density} style={demoTokens(resolvedMode, identity, resolvedContrast, forcedColors)} className={styles.preview} data-docs-preview="" data-demo-identity={identity} data-demo-contrast={resolvedContrast} data-demo-forced-colors={forcedColors || undefined}>{children}</ThemeScope>
      <Disclosure label={`Show source: ${title}`}>
        <Stack gap={2}>
          <Stack direction="row" wrap align="center" gap={2}>
            <AppButton variant="outlined" tone="neutral" onPress={copy}>Copy code: {title}</AppButton>
            <Typography variant="caption" aria-live="polite">{failed ? 'Copy unavailable. Select the code below and copy it manually.' : copied === source ? 'Copied to clipboard.' : ''}</Typography>
          </Stack>
          <Typography as="code" variant="code" tabIndex={0} aria-label={`Source: ${title}`} className={styles.code}>{source}</Typography>
        </Stack>
      </Disclosure>
    </Stack>
  </Surface>;
}
