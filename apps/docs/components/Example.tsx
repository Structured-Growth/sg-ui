'use client';
import { ThemeScope, type Density } from '@structured-growth/sg-ui/theme';
import { useDemoSettings } from './DemoSettings';
import { demoTokens } from './demo-theme';
import { useId, useState, type ReactNode } from 'react';
import { AppButton } from '@structured-growth/sg-ui/components/AppButton';
import { Disclosure, Surface } from '@structured-growth/sg-ui/experimental';
import { Stack, Typography } from '@structured-growth/sg-ui/primitives';
import styles from './docs.module.css';
import {useExamplePresentation} from './ExamplePresentation';
/** Source-backed panels; previewOnly supports the minimal component overview. */
export function Example({ id: anchorId, title, description, source, controls, density = 'comfortable', flushPreview = false, previewOnly = false, children }: {
  id?: string; title: string; description?: string; source: string; controls?: ReactNode; density?: Density; flushPreview?: boolean; previewOnly?: boolean; children: ReactNode;
}) {
  const presentation = useExamplePresentation();
  const isPrimary = title === presentation?.primary;
  const standalone = previewOnly || presentation?.phase === 'overview';
  const displayTitle = presentation?.phase==='examples' && !title.startsWith(presentation.title+':') ? `${presentation.title}: ${title}` : title;
  const {resolvedMode, resolvedContrast, identity, forcedColors} = useDemoSettings();
  const id = useId(); const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(source); setCopied(source); setFailed(false); }
    catch { setFailed(true); setCopied(null); }
  }
  if (presentation && (presentation.phase==='examples' ? isPrimary : !isPrimary)) return null;
  const preview = <ThemeScope role={standalone ? "region" : undefined} aria-label={standalone ? (presentation ? `${presentation.title} at a glance` : title) : undefined} theme={resolvedMode} density={density} style={demoTokens(resolvedMode, identity, resolvedContrast, forcedColors)} className={[styles.preview,flushPreview?styles.flushPreview:undefined].filter(Boolean).join(' ')} data-docs-preview="" data-demo-identity={identity} data-demo-contrast={resolvedContrast} data-demo-forced-colors={forcedColors || undefined}>{children}</ThemeScope>;
  if (standalone) return preview;
  return <Surface data-docs-example="" id={anchorId} as="section" aria-labelledby={id} variant="outlined" padding={4}>
    <Stack gap={3}>
      <Typography id={id} as="h2" variant="h5">{displayTitle}</Typography>
      {description && <Typography tone="muted">{description}</Typography>}
      {controls}
      {preview}
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
